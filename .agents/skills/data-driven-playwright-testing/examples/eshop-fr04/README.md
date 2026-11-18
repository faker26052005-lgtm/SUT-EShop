# Reference implementation: EShop FR-04 (user profile)

A complete, working use of the workflow (26 tests per browser, 8 of them red because of real SUT bugs).
Use it as a model for the shape of the data tables and the spec, not as something to copy blindly.

| File | What it shows |
| :-- | :-- |
| `data/fr04-phone.json` | Boundary/equivalence table. Columns: `id`, `title`, `phone`, `expect` (`accept` / `reject` / `clarify`), `source` (SRS clause) |
| `data/fr04-fields.json`, `data/fr04-security.json`, `data/fr04-misc.json` | Other tables of the same feature: name/address, output-escaping payloads, access and read-only checks |
| `fr04-profile.spec.ts` | One `for (const row of rows)` loop per table, no inline data, three assertion families, `CLARIFY` annotation for undefined behaviour, throwaway account per test, dialog capture with the mark taken BEFORE the click |

To try it on a fresh project (needs the EShop SUT on ports 3000/5173):

```
node scripts/scaffold-project.js ./my-suite --preset eshop --run-by 12345678
cp examples/eshop-fr04/fr04-profile.spec.ts ./my-suite/tests/
cp examples/eshop-fr04/data/*.json ./my-suite/data/
cd my-suite && npm install && npx playwright install && node scripts/run-matrix.js fr04
```

Expected on the unmodified EShop SUT: 18 passed, 8 failed per browser (FR04-BUG-01, 02, 03).
