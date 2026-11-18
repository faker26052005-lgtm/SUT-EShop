# {{PROJECT_TITLE}}

Data-driven Playwright automation (generated with the `data-driven-playwright-testing` skill).

```
npm install
npx playwright install chromium firefox webkit
node scripts/run-matrix.js <feature>        # e.g. fr04 -> 3 browser runs, one HTML report each (reports/<feature>-<browser>/)
npx playwright show-report reports/<feature>-chromium
npm run summary                             # docs/test-summary.md
```

Layout: `data/` test tables (JSON/CSV) | `tests/<feature>-*.spec.ts` | `tests/helpers/` | `docs/` notes, review, summary | `bugs/` bug reports.
