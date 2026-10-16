# Weekly Technical Report — Week 03-04
# Báo cáo Kỹ thuật Tuần 03-04

## Project: T06 — API Testing & Contract Testing
- **Group:** Nhóm 11 | FIT@HCMUS
- **Reporter:** Nguyen Hoang Anh Tu (MSSV: 23120183)
- **Period:** Week 03-04 (2026-10-04 to 2026-10-18)
- **Report Date:** 2026-10-16

---

## 1. Task Assignment This Week

Per division of labor (Tú is responsible for):
- **Newman P3**: CLI-based Postman collection runner with HTML report
- **Pact C1**: Consumer-Driven Contract Test — Consumer side (EShopMobile)
- **Pact C2**: Consumer-Driven Contract Test — Provider Verification (EShopBackend)
- **Pact C3**: Breaking Change Prevention Demo

---

## 2. Work Completed

### ✅ C1 — Consumer Contract Test (PASSED)
- File: `tests/pact/consumer/product.consumer.test.js`
- What it does: Simulates EShopMobile calling GET /api/products on a Pact Mock Server. Defines the expected contract (status 200, JSON body with `id`, `name`, `price`, `stock`, `category`).
- Output: Generates `tests/pact/pacts/EShopMobile-EShopBackend.json`
- Command: `npm run test:consumer` (from `tests/pact/`)
- Result: **1/1 test PASSED** in ~60ms

### ✅ C2 — Provider Verification (PASSED)
- File: `tests/pact/provider/verify.js`
- What it does: Replays the generated contract against the actual EShopBackend running on port 3000. Verifies the provider honors the consumer contract.
- Command: `npm run test:provider` (requires backend running on port 3000)
- Result: **Verification PASSED** — Provider response matches consumer contract 100%

### ✅ C3 — Breaking Change Prevention (WORKING)
- File: `tests/pact/breaking-change/verify-breaking.js`
- What it does: Injects a deliberate breaking change (renames `price` field to `unit_price` in provider response). Replays contract against the modified response. Demonstrates that Pact catches the field mismatch.
- Command: `npm run test:breaking`
- Result: **Verification FAILED as expected** — Pact detected `price` missing, `unit_price` unexpected → Breaking change prevented ✓

### ✅ Backend Request Logger
- File: `backend/server.js` (middleware added)
- What it does: Logs every incoming HTTP request (method, URL, timestamp) to the terminal so developers can observe live traffic without DevTools.

---

## 3. Generated Artifacts

| Artifact | Path | Description |
|---|---|---|
| Consumer Contract JSON | `tests/pact/pacts/EShopMobile-EShopBackend.json` | Machine-readable contract |
| Consumer Test | `tests/pact/consumer/product.consumer.test.js` | Pact Consumer test (C1) |
| Provider Verifier | `tests/pact/provider/verify.js` | Provider verification (C2) |
| Breaking Change Script | `tests/pact/breaking-change/verify-breaking.js` | Breaking change demo (C3) |
| Pact README | `tests/pact/README.md` | Full documentation |
| Pact package.json | `tests/pact/package.json` | Dependencies |

---

## 4. Test Evidence

### C1 — Consumer Test Output
```
PASS consumer/product.consumer.test.js
  EShopMobile → EShopBackend Contract
    ✓ returns a list of products from GET /api/products (Xms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

### C2 — Provider Verification Output
```
Verifying a pact between EShopMobile and EShopBackend
  GET /api/products
    returns a response which
      has status code 200 ✓
      includes headers
        "Content-Type" with value ... ✓
      has a matching body ✓

1 interaction, 0 failures
```

### C3 — Breaking Change Detection Output
```
Verifying a pact between EShopMobile and EShopBackend
  GET /api/products (Breaking Change Simulation)
    returns a response which
      has a matching body FAILED
        $ Expected 'price' but got 'unit_price'

1 interaction, 1 failure
→ Breaking change detected and blocked ✓
```

---

## 5. Screenshots & Demo

See attached:
- `screenshots/` — Terminal output for C1, C2, C3
- `demo/` — Video walkthrough of running all 3 scenarios

---

## 6. Issues Encountered & Resolved

| Issue | Root Cause | Resolution |
|---|---|---|
| Pact Rust FFI panic on startup | `regex()` matcher used in Content-Type header (not supported in JS SDK) | Changed to plain string `"application/json; charset=utf-8"` |
| Provider ECONNREFUSED | Backend not started before provider verification | Added `waitForServer()` polling mechanism in `verify.js` |
| Maven download failed | Apache mirror URL changed | Switched to Maven Central repo in `pom.xml` |

---

## 7. Next Week Plan

- [ ] Complete Karate K1/K2 feature tests (Ky)
- [ ] Finalize AI-Agent tests AI1/AI2 (Ky)
- [ ] Newman HTML report generation P3 (Tu — needs confirmed)
- [ ] Record full demo video for presentation

---
*Nguyen Hoang Anh Tu — 23120183 | Nhóm 11 | 2026-10-16*
