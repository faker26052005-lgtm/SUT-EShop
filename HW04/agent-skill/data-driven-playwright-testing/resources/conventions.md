# Conventions

## Project layout (created by `scaffold-project.js`)

```
data/            test tables: <id>-<group>.json | .csv, accounts.json, defaults.json
tests/           <id>-<slug>.spec.ts (one per feature) and helpers/ (data, env, dialogs, numbers, api, web, admin...)
docs/            spec-notes.md, review/<id>-review.md, test-summary.md (generated)
bugs/            <ID>.md per bug, BUG_LIST.md, screenshots/
scripts/         run-matrix.js, summarize.js
reports/         <id>-<browser>/ HTML report, _json/<id>-<browser>.json  (generated, not committed)
```

The feature id (`fr04`) is the file-name prefix of the spec **and** of its data files. `run-matrix.js` selects tests with `playwright test <id>-`.

## Data table schema

A table is a JSON array (or a CSV with a header row; CSV values are strings, convert explicitly). One row = one test.

| Column | Meaning |
| :-- | :-- |
| `id` | Short unique id with a group prefix: `P` phone/primary input, `F` fields, `X` security/escaping, `C` checkout-like flows, `S` scenarios, `A` access control, `E` read-only/permissions. Pick prefixes per feature, keep them stable |
| `title` | One line, appears in the test name and the report |
| inputs | `phone`, `value`, `payload`, `picks`... whatever the feature needs |
| `expect` / `mode` | `accept`, `reject`, or `clarify`; features may add modes (`ui-walk`, `api-seed`, `empty-cart`) but each mode needs a spec branch that asserts |
| `source` | The SRS clause or HW/test-design id the row comes from (`SRS FR-04 R1`, `HW02 DT-05`) |
| `draft` | Only scaffold rows: `true` until replaced |

Rules: no expected value computed from the SUT's own current behaviour; boundaries come in pairs (just inside, just outside); one concern per row; rows that depend on a documented spec gap use `clarify`.

## CLARIFY

When the SRS is silent or ambiguous, the test records and does not judge:

```ts
test.info().annotations.push({ type: 'CLARIFY', description: `${row.source}; observed=${JSON.stringify(observed)}` });
```

`summarize.js` counts them in a separate column. Report them separately from passes: a CLARIFY-only test passed nothing, it recorded something.

## Bugs

- Id: `<FEATURE>-BUG-<nn>` (`FR04-BUG-01`). One file per bug from `resources/templates/docs/bug-report.md.tpl`; one row per bug in `bugs/BUG_LIST.md`.
- Severity: **Critical** = security hole, data/financial integrity, or access control broken; **High** = a core requirement fails or a core flow breaks; **Medium** = validation or secondary behaviour wrong; **Low** = cosmetic or minor wording.
- Evidence: the failing test id(s), `Expected`/`Received`, a screenshot from the report, the same result on all three browsers (or a note when not).

## Runs and reports

- One run per feature x browser: slug `<feature>-<browser>` (`fr04-firefox`), HTML in `reports/<slug>/`, JSON in `reports/_json/<slug>.json`. The report title carries `Run by: <id>` and the ISO time, so every report proves who ran it and when.
- A full submission has every feature on all three browsers. `node scripts/summarize.js` prints the counts; set `MIN_RUNS=9` to print the minimum the course requires.
