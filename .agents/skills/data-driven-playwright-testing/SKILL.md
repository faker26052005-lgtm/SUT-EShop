---
name: data-driven-playwright-testing
description: Builds, runs and maintains data-driven Playwright test automation for a web feature described by an SRS or API spec. Test cases live in JSON/CSV tables, scripts run on Chromium, Firefox and WebKit with one HTML report per run, red tests are triaged into real bugs versus script mistakes, and AI-generated scripts are reviewed with a checklist (flaky waits, fragile selectors, empty assertions, locale problems, missing edge cases). Use when asked to automate test cases for a feature, add a feature to an existing Playwright suite, run a multi-browser regression and summarize it, triage failing automated tests, write bug reports from them, or review and fix generated Playwright scripts.
---

# Data-driven Playwright testing

Turns "automate feature X from this SRS" into a repeatable pipeline: **data table -> spec -> 3-browser matrix -> HTML reports -> triage -> review**. The pipeline was proven on the EShop SUT (FR-04, FR-08, FR-13: 60 tests per browser, 9 real bugs, 9 browser runs).

## Decision tree: which situation is this?

| Situation | Do this |
| :-- | :-- |
| No Playwright project yet | Run `scripts/scaffold-project.js`, then the workflow below |
| Project exists, new feature to automate | Workflow steps 1-8 |
| Tests exist and some are red | "Triage of red tests" |
| Scripts were generated (by you or another AI) and need checking | "Review pass" |
| SUT or SRS changed | "Maintenance" |

## Scripts (black boxes: run with `--help` first, do not read their source)

Paths in this file starting with `scripts/`, `resources/` or `examples/` are relative to the skill folder (for example `.agents/skills/data-driven-playwright-testing/`). Commands that start with `node scripts/run-matrix.js` or `npx playwright` run inside the **generated project**.

| Script | Purpose |
| :-- | :-- |
| `scripts/scaffold-project.js <dir> [--preset generic\|eshop] [--run-by ID] [--title T]` | Creates the project: config (3 browsers, serial, HTML+JSON reports, pinned locale), `run-matrix.js`, `summarize.js`, helpers. Preset `eshop` adds the EShop API/web/admin helpers |
| `scripts/scaffold-feature.js <id> --title "..." --dir <dir>` | Adds `data/<id>-cases.json`, `tests/<id>-<slug>.spec.ts`, `docs/review/<id>-review.md`, npm scripts `test:<id>` and `test:all` |
| `scripts/lint-tests.js [paths] [--strict]` | Static review of specs and helpers (rules L01-L14: sleeps, selectors, empty assertions, inline data, locale...) |
| `scripts/compare-runs.js <before.json> <after.json>` | After a fix: red->green, green->red (must be 0), still red (real bugs) |
| inside the generated project: `node scripts/run-matrix.js <id[,id]> [browser]` and `node scripts/summarize.js` | Runs feature x browser matrix; writes `docs/test-summary.md` |

Resources: `resources/conventions.md` (layout, data schema, naming, severity), `resources/review-checklist.md` (what AI-generated scripts get wrong and how to fix it), `resources/templates/` (files the scripts copy), `examples/eshop-fr04/` (a complete reference feature).

## Inputs to gather first (ask only for what is missing)

SRS and API spec paths; SUT URLs (web, admin, API) and how to start it; accounts (admin, user); the feature id and title; an existing test design (equivalence classes / boundary values) if the course produced one; the id to print in reports ("Run by"); whether the SUT is running now.

## Workflow: add a feature

1. **Read the spec first.** List the SRS clauses of the feature. Write every gap, contradiction or silence into `docs/spec-notes.md` (template provided). Rule: the SRS is the oracle, not the behaviour the SUT has today. Where the spec is wrong and Playwright has verified the real behaviour, the verified behaviour wins and the note says so. Where it is silent, the case becomes `clarify`.
2. **Inspect the SUT before writing any selector.** Open the page (browser tool, or `npx playwright codegen <url>`). Record the facts that shape the helpers at the top of the helper file: no ids/testids? labels linked to inputs? alerts or in-page messages? where the token lives (localStorage key)? does a reload lose state (SPA memory)? Never guess a selector.
3. **Design the data table** in `data/<id>-cases.json` (or `.csv`). One row = one test. Columns: `id`, `title`, the inputs, `expect` or `mode` (`accept` / `reject` / `clarify` / feature-specific), `source` (SRS clause). Cover equivalence classes, boundaries just inside and outside, malformed input, and security payloads where the SRS has a security clause. See `resources/conventions.md`.
4. **Scaffold** with `scripts/scaffold-feature.js`, then replace every `TODO` and delete the `draft` flag per row.
5. **Write the spec** under the hard rules below. Arrange state through the API (fresh throwaway account, seeded data); drive and assert through the UI under test; read stored results back through the API when the SRS is about stored data.
6. **Quality gates, in this order:** `node scripts/lint-tests.js tests` (fix all errors, justify or fix warnings) -> `npx tsc --noEmit -p .` -> `npx playwright test --list` (the count equals rows x 3 browsers) -> one debug run `npx playwright test <id>- --project=chromium`.
7. **Run the matrix** `node scripts/run-matrix.js <id>` (chromium, firefox, webkit; one HTML report each in `reports/<id>-<browser>/`), then `node scripts/summarize.js`. Open at least one report: `npx playwright show-report reports/<id>-chromium`. A non-zero exit code from a run with red tests is normal; red tests are candidate bugs.
8. **Triage, document, review** (next sections). Finish with the deliverables checklist.

If the SUT cannot be started in this environment, stop after gate `--list`, say clearly that nothing was executed, and give the exact commands for the user to run.

## Hard rules

- **No inline test data.** Inputs and expectations come from `data/*.json|csv` through `loadData()`. Credentials come from `data/accounts.json` or environment variables. (Lint L10, L11, L14.)
- **At least three kinds of assertion** across the suite: value equality (`toBe`, `toHaveLength`), UI state (`toBeVisible`, `toHaveValue`, `toHaveURL`, `toContainText`) and condition/ordering (`toBeGreaterThan`, `toContain`, `.not.toBe`, `expect.poll(...)`). (L12)
- **Every test branch asserts something.** The only exception is a row with `mode: clarify`, which records the observed behaviour as a `CLARIFY` annotation and never judges it. A loop of assertions over a list that can be empty needs a prior assertion on the list itself. (L08, L13)
- **Selectors:** role / placeholder / visible text with `exact: true`; never CSS classes, never position. If nothing stable exists, say so in the review and ask for `data-testid`. Keep unavoidable structural selectors (xpath) in one helper with a comment. (L04, L05)
- **No fixed sleeps.** Wait for a response, an event, or a polled value. (L01) Do not leave `.only`. (L02)
- **Dialogs (`alert`/`confirm`):** use `captureDialogs` + `clickAndWaitDialog`; the message-list position is taken BEFORE the click, because the page's own JavaScript raises the dialog during the click. (L09)
- **Numbers on screen:** parse with `digits()` (digits only, `NaN` when none, never 0) and compare **deltas** before/after an action when the database is shared and grows between runs; add one absolute check. Pin `locale: 'en-US'` in the config and use `toLocaleString('en-US')`. (L03, L06)
- **Errors are not swallowed.** `catch(() => null)` is acceptable only if the null is checked or recorded. (L07)
- **A red test is not "fixed" by changing the expectation.** Change an expectation only when the SRS says so, or when the SRS is silent (then it becomes `clarify`).
- **Shared database => `workers: 1`.** Use throwaway accounts for destructive or lock-out cases (wrong passwords) so shared accounts are never locked.

## Triage of red tests

For each red test, in order:

1. Re-run it alone on chromium. If it flips to green, it is flaky or order-dependent: fix the script.
2. Read `Expected` vs `Received` and the screenshot/trace in the report.
3. Reproduce by hand (browser or API) and compare with the SRS clause in the row's `source`.
4. Compare the three browsers. Same result everywhere = application behaviour. Differs by browser = script race (typically dialogs, timing) or an engine difference: fix the script first.
5. Classify: **real bug** (SRS violated) -> bug report; **false red** (script wrong) -> fix, record in the review file; **spec gap** -> `clarify` + `docs/spec-notes.md`; **environment** (SUT down, database state) -> fix the environment.
6. For each real bug write `bugs/<ID>.md` (template in `resources/templates/docs/`), add it to `bugs/BUG_LIST.md`, and open the issue if the user asks. Bug ID `FRxx-BUG-nn`; severity Critical / High / Medium / Low per `resources/conventions.md`.

## Review pass (use after generating or receiving scripts)

1. Run `node scripts/lint-tests.js tests`.
2. Walk each spec and helper through `resources/review-checklist.md`; record every finding in `docs/review/<id>-review.md` (sections A-E) with its cause: **P** prompt quality, **M** model limitation, **F** feature/SUT trait.
3. **Verify a fix before applying it.** Reproduce the problem or read the library source. Two proposals from the reference project were wrong until checked: throwing inside `expect.poll` aborts the poll instead of retrying (so the helper returns `NaN`), and narrowing a "no buttons" assertion would have hidden the very bug it detects.
4. Apply the fix, re-run the matrix, then `node scripts/compare-runs.js <before.json> <after.json>`: nothing may turn green->red; red->green must be only false reds; the rest must equal the known bug count.
5. Mark a review row "fixed" only after step 4 ran. Otherwise write "fixed, not re-run".

## Maintenance

Data first, code second. SRS changed: edit rows (`expect`, `source`) and `docs/spec-notes.md`. UI text changed: edit the selector in one helper. SUT behaviour changed: re-run the matrix, use `compare-runs.js`, update bug status. Re-run `lint-tests.js` after every non-trivial edit.

## Deliverables checklist

- `data/<id>-*.json|csv`, `tests/<id>-*.spec.ts`, helper changes
- `docs/spec-notes.md` entries, `docs/review/<id>-review.md` (A-E)
- `bugs/<ID>.md` per real bug and `bugs/BUG_LIST.md`
- `reports/<id>-chromium|firefox|webkit/` HTML reports and `docs/test-summary.md`
- A closing summary to the user: tests per browser, passed/failed, number of bugs, what was verified and what was not (for example "not executed: SUT was not running")

## Style

Code and comments in English. Write the documents (notes, review, bug reports) in the user's language; the bundled templates are Vietnamese, translate them when the course language differs. Never claim a result you did not obtain by running it.
