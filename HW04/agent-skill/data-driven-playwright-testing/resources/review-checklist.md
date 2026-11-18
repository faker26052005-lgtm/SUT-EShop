# Review checklist for AI-generated Playwright scripts

Use it file by file after `node scripts/lint-tests.js`. Every finding goes into `docs/review/<id>-review.md` with a cause:
**P** prompt quality (the prompt did not say it), **M** model limitation (no SUT to try, picks the easiest option, unaware of the environment),
**F** feature/SUT trait (no ids, native `alert()`, shared database, async rendering).

Each item lists: how it shows up, why AI scripts contain it, the fix, the lint rule that catches it.

## 1. Waits and races

| # | Finding | Typical cause | Fix | Lint |
| :-: | :-- | :-- | :-- | :-: |
| 1.1 | **Dialog position taken after the click.** Helper clicks, then remembers how many alerts exist, then waits for one more. The page raises its alert during the click, so the wait never ends (null after the timeout). Red tests that depend on the browser (often Firefox/WebKit only) | M, F | `const mark = messages.length;` BEFORE `await target.click();` | L09 |
| 1.2 | `waitForTimeout(500)` before a "must not have happened" check. Passes by luck on a fast machine and after a fix | M, F | Wait for page settle/response (`waitForLoadState('networkidle')` is discouraged by Playwright but acceptable when no DOM signal exists; say so) and keep a DOM assertion as the primary check | L01 |
| 1.3 | Reading a number right after navigation: the UI shows `0` until data arrives | F | Wait for the response or for the tile to differ from the placeholder, then `expect.poll` | - |
| 1.4 | Swallowed wait: `waitForResponse(...).catch(() => null)` hides the real cause | M | Keep the null, but record a `WARN` annotation (or fail) when it happens | L07 |

## 2. Assertions that can pass with nothing checked

| # | Finding | Typical cause | Fix | Lint |
| :-: | :-- | :-- | :-- | :-: |
| 2.1 | `Number('')` is 0: a broken tile ("NaN", "-") is read as 0, so every "did not change" check passes | M | `digits()` returns `NaN` when no digit exists. **Do not throw**: an exception inside `expect.poll` aborts the poll instead of retrying | L06 |
| 2.2 | `for (const o of orders) expect(...)` checks nothing when `orders` is empty (a success page with no stored order passes) | M | First assert the list (`toHaveLength`, `toBeLessThanOrEqual`), and require a visible error when "nothing stored" is accepted | L08 |
| 2.3 | `not.toBe(SUCCESS)` as the whole reject check also passes when nothing happened | M | Also assert the stored value is unchanged (read it back through the API) | - |
| 2.4 | Test body without any `expect` that is not marked CLARIFY | P | Add the assertion or make the row `clarify` | L13 |
| 2.5 | CLARIFY tests counted as passes inflate the pass rate | P | Report "passed with assertions" and "recorded only" separately | - |
| 2.6 | Assertion only on the success message; the stored data is never read back; the UI is not re-checked after reload | M | Read back through the API; reload and `toHaveValue` | - |
| 2.7 | Fixing the check by loosening the expectation to make a red test green | M | Only the SRS (or its silence -> `clarify`) may change an expectation | - |
| 2.8 | **Tightening** an assertion without checking the known bugs. Example: counting only "action" buttons would have hidden the bug that a canceled order still shows "Mark delivered" | M | Before changing any assertion, re-read the bug reports it protects | - |

## 3. Selectors and structure

| # | Finding | Typical cause | Fix | Lint |
| :-: | :-- | :-- | :-- | :-: |
| 3.1 | CSS class selectors (`div.border.rounded`), `:nth-child`, `.first()` on a bare locator | F, M | role / placeholder / text with `exact: true`; ask for `data-testid` | L04 |
| 3.2 | `getByRole('button', { name: 'Save' })` without `exact` matches "Save password" too | P | `exact: true` (check the full accessible name first) | L05 |
| 3.3 | Selector depends on the field order or on a type that the SRS says should change (`input[type="text"]` for an email field) | F | Select by placeholder or name; isolate structural selectors in one helper | L04 |
| 3.4 | `page.locator('li')` counts every list item on the page | M | Scope to the container that holds the data | - |
| 3.5 | `getByLabel` used where labels are not linked to inputs | F | Placeholder or sibling lookup in one helper | - |

## 4. Environment assumptions

| # | Finding | Typical cause | Fix | Lint |
| :-: | :-- | :-- | :-- | :-: |
| 4.1 | Expected text built in Node with `toLocaleString()` and compared with text formatted in the browser: locale comes from two independent places | M | Pin `locale: 'en-US'` in the config and use `toLocaleString('en-US')`, or compare digits only | L03 |
| 4.2 | SUT must be running but nothing checks it; every test fails with `ECONNREFUSED` | P | State the start commands in the README; run a one-test smoke first | - |
| 4.3 | Shared database grows each run, so absolute numbers drift | F | Compare deltas; keep one absolute check | - |
| 4.4 | Shared accounts used in wrong-password tests (lock-out) | F | Throwaway accounts | - |
| 4.5 | Same helper name with different behaviour in two files (`captureDialogs` accept vs dismiss) | P | One helper with a parameter | - |

## 5. Data and coverage

| # | Finding | Typical cause | Fix | Lint |
| :-: | :-- | :-- | :-- | :-: |
| 5.1 | Inline arrays/objects, hard-coded passwords or names in specs or helpers | P | Move to `data/` | L10, L11, L14 |
| 5.2 | Data table contradicts `spec-notes.md` (a case listed as CLARIFY in the notes is a hard `reject` in the table) | P | Make the two agree; the table is what runs | - |
| 5.3 | A decision written in the notes ("check GET /api/cart too") never became a test | P | Turn it into a test or narrow the note | - |
| 5.4 | Base data that only works because of a bug (a "valid" phone that the SRS rejects) | M | Use data valid under the SRS and fix the arrangement | - |
| 5.5 | Missing edge cases: double submit, leading/trailing spaces, boundary +-1, max length, stored XSS in other pages (admin lists), empty state, token expiry, reload | P, M | Add rows; extend the mode switch only if the existing branches cannot assert it | - |
| 5.6 | A faked failure (`page.route` 500) proves only the client's error handling | F | Say so in the report; do not claim server behaviour | - |

## 6. Process

- Run lint, then `tsc`, then `--list`, then one browser, then the matrix.
- Never report a fix as verified without re-running; use `scripts/compare-runs.js` and require 0 regressions.
- Identical red tests on all three browsers = application bugs. A red test that differs by browser = script problem until proven otherwise.
- Verify an AI's proposed fix by reproduction or by reading the library source before applying it (see 2.1 and 2.8).
