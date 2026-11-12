# AI Audit Report (HW04-AI — Automation Testing)

**Student ID:** `23120183`  
**Student Name:** Nguyễn Hoàng Anh Tú  
**Declaration:** *I use AI tools for the following tasks (environment configuration, DOM survey, data-driven test data generation, Page Object design, step-by-step script generation, and debugging review), with full human review and verification.*

---

## Interaction Log

### Entry 1 — Stage 0 & Stage 1: Playwright Project Setup, Anti-Cheat Config & DOM Survey
- **AI Tool:** Antigravity (Gemini 3.8 Flash)
- **Date & Time:** `2026-11-12 11:23 +07:00`
- **Prompt:**
  > Khởi tạo dự án Playwright TypeScript trên branch mới `hw04/23120183` tại `tests/playwright/`, cấu hình chạy 3 trình duyệt (Chromium, Firefox, WebKit), HTML Reporter có metadata `"Run by: 23120183"` kèm ISO timestamp. Khảo sát DOM thực tế của `Register.jsx` (FR-01), `Checkout.jsx` (FR-09) và `frontend-admin/src/App.jsx` (FR-15) để thiết kế Page Objects và tách 15 test cases mỗi chức năng từ HW02 sang file JSON data-driven.
- **AI Output Summary:**
  - Created `tests/playwright/package.json`, `tsconfig.json`, `playwright.config.ts` (multi-browser projects + HTML reporter + `webServer` configuration).
  - Created `utils/dataLoader.ts` to load external JSON/CSV files cleanly.
  - Surveyed SUT JSX source and produced `docs/DOM_Survey.md` plus Page Objects (`pages/RegisterPage.ts`, `pages/CheckoutCouponPage.ts`, `pages/AdminProductPage.ts`).
  - Exported 45 parameterized test cases (15 per feature) into `test-data/fr01-register.json`, `test-data/fr09-coupons.json`, and `test-data/fr15-products.json`.
- **Human Review Notes:**
  - Verified that `Register.jsx` `<label>` elements lack `htmlFor`, so `getByLabel()` cannot be used; confirmed `form div:has(> label:text-is(...)) input` matches exact DOM elements.
  - Verified `frontend-admin/src/App.jsx` has a secondary CSV preview `<table>`, so `AdminProductPage` explicitly scopes to `table:has(th:text-is("Tên SP"))`.

---

### Entry 2 — Stage 2: Feature A (`FR-01` Account Registration) Script Generation & Human Review
- **AI Tool:** Antigravity (Gemini 3.8 Flash)
- **Date & Time:** `2026-11-12 13:09 +07:00`
- **Prompt:**
  > Dựa trên `test-data/fr01-register.json` và `pages/RegisterPage.ts`, viết kịch bản `tests/fr01-register.spec.ts` chạy Data-Driven trên cả 3 trình duyệt (Chromium, Firefox, WebKit) với tối thiểu 3 assertion patterns (URL, Visibility/State, Text/Attribute/DOM validity). Sau đó chạy thử trên SUT thật, rà soát và sửa các điểm yếu của script.
- **AI Output Summary:**
  - Generated `tests/fr01-register.spec.ts` executing 15 test cases across 3 browsers (45 total runs).
  - Observed consistent results across all 3 browsers: **21 passed, 24 failed** (8 real SUT defects per browser: flawed password regex requiring whitespace instead of special characters, missing Confirm Password field, missing email format validation, missing duplicate email check, accepting whitespace/numeric/XSS names).
- **Human Review & Fixes Applied:**
  1. **Anti-Cheat Report Visibility Gap:** Discovered Playwright's built-in HTML reporter did not render `config.metadata.runBy` visibly in `playwright-report/index.html`. Added `reporters/antiCheatReporter.ts` to inject a visible header banner (`Run by: 23120183` + ISO timestamp) and update `<title>`.
  2. **Weak HTML5 Validation Assertions:** Initial AI script only checked `el.checkValidity() === false`. Strengthened `html5_invalid` assertions to also verify `el.validationMessage.length > 0` and assert zero `POST /api/register` network requests were sent.
  3. **Cross-Browser Email Isolation & Timeout Tuning:** Included `browserName` in `uniqueSuffix` to prevent cross-browser email collisions and tuned failure timeouts (`2000ms–2500ms`) with descriptive bug notes in assertion messages (reducing total run time from 4.5m to 3.9m).

---

### Entry 3 — Stage 3: Feature B (`FR-09` Discount Coupons) Script Generation & Human Review
- **AI Tool:** Antigravity (Gemini 3.8 Flash)
- **Date & Time:** `2026-11-12 16:01 +07:00`
- **Prompt:**
  > Dựa trên `test-data/fr09-coupons.json` và `pages/CheckoutCouponPage.ts`, tạo kịch bản `tests/fr09-coupons.spec.ts` kiểm thử Data-Driven chức năng áp dụng mã giảm giá tại `/checkout` trên 3 trình duyệt (Chromium, Firefox, WebKit) với tối thiểu 3 assertion patterns. Sau đó chạy thử trên SUT thật, rà soát và xử lý các lỗi đồng bộ giữa các trình duyệt.
- **AI Output Summary:**
  - Generated `tests/fr09-coupons.spec.ts` (45 runs across 3 browsers).
  - First run yielded **35 passed, 10 failed** (4.5m): Chromium and Firefox failed only on the 2 real SUT bugs (`TC-FR09-02` `SAVE10` formula bug, `TC-FR09-11` `>` vs `>=` boundary bug), whereas **WebKit failed 4 extra tests** (`TC-FR09-06`, `07`, `09`, `10`) with 30s timeout at `waitForURL('**/checkout')`.
- **Human Review & Fixes Applied:**
  1. **WebKit Auth Hydration Race Condition (`pages/CheckoutCouponPage.ts`):** Diagnosed via `error-context.md` that calling `page.goto('/')` after `loginAsCustomer()` reloaded React and reset `AuthContext` `user` back to `null` until `GET /api/users/me` resolved. On WebKit, clicking through to `Tiến hành thanh toán` raced ahead of `/api/users/me`, causing `Cart.jsx` to alert and redirect back to `/login`. Fixed by waiting for the authenticated `Thoát` button in Header after login and removing the redundant `page.goto('/')` reload.
  2. **API Synchronization & Stronger Assertions (`tests/fr09-coupons.spec.ts`):** Added explicit `page.waitForResponse` for `POST /api/apply-coupon`, verified `type="number"` attribute on total input, asserted mutual exclusivity of `couponSuccessBox` vs `couponErrorMessage`, and verified `finalTotalLabel` (`Tổng thanh toán`) in addition to `couponSuccessBox`.
  3. **Verified Result:** Re-run across all 3 browsers completed in **2.4m** with **39 passed, 6 failed** (0 flaky WebKit errors; 100% consistent across Chromium, Firefox, WebKit).

---

### Entry 4 — Stage 4: Feature C (`FR-15` Admin Product Management CRUD) Script Generation & Human Review
- **AI Tool:** Antigravity (Gemini 3.8 Flash)
- **Date & Time:** `2026-11-12 16:33 +07:00`
- **Prompt:**
  > Dựa trên `test-data/fr15-products.json` và `pages/AdminProductPage.ts`, tạo kịch bản `tests/fr15-products.spec.ts` kiểm thử Data-Driven chức năng Admin Product Management CRUD (`http://localhost:5174`) trên 3 trình duyệt (Chromium, Firefox, WebKit) với tối thiểu 3 assertion patterns. Sau đó chạy thử trên SUT thật, rà soát các false positives và race condition.
- **AI Output Summary:**
  - Generated `tests/fr15-products.spec.ts` (45 runs across 3 browsers).
  - First run yielded **36 passed, 9 failed** (2.5m), missing real SUT defects due to async timing false positives (`TC-FR15-04`, `08`, `09`, `12` passed falsely because assertions ran before `POST`/`PUT` or React state update completed, and `TC-FR15-06` matched substring `'   '` instead of exact whitespace/row-count delta).
- **Human Review & Fixes Applied:**
  1. **Async CRUD False Positives (`tests/fr15-products.spec.ts`):** Added explicit `page.waitForResponse` on `POST /api/products` and `PUT /api/products/` to assert HTTP status `>= 400` and product row count unchanged for invalid inputs (`TC-FR15-04`, `06`, `08`, `09`).
  2. **Update Isolation Race Condition (`TC-FR15-12`):** Synchronized on both `PUT /api/products/` response and the `"Cập nhật thành công!"` `dialog` event before asserting that other product rows remained unchanged — accurately exposing `BUG-FR15-02` (`fakeMassUpdatedProducts`) across all 3 browsers.
  3. **WebKit Admin Login Race & DB Cleanup (`pages/AdminProductPage.ts`, `tests/fr15-products.spec.ts`):** Updated `gotoAndLogin()` to wait for `domcontentloaded` and `Promise.race([loginButton, productsNavItem])` for reliable WebKit navigation, and added `DELETE /api/products/${createdId}` cleanup after positive create tests.
  4. **Verified Result:** Re-run across all 3 browsers completed in **3.1m** with **27 passed, 18 failed** (identical 6 real SUT defects $\times$ 3 browsers: `TC-FR15-04`, `06`, `08`, `09`, `12`, `15`; 0 flaky browser errors).

---

### Entry 5 — Stage 5: Consolidated Multi-Browser Execution & Final Stabilization
- **AI Tool:** Antigravity (Gemini 3.8 Flash)
- **Date & Time:** `2026-11-12 17:08 +07:00`
- **Prompt:**
  > Chạy toàn bộ 3 bộ test (`FR-01` + `FR-09` + `FR-15`) liên tiếp trên cả 3 trình duyệt (`npm test`, 135 runs) để kiểm tra tính ổn định cross-browser và xuất HTML Report tổng hợp.
- **Findings & Human Review Fixes Applied:**
  1. **WebKit DOM Commit Race in `TC-FR15-12` (`43ec92f`):** First consolidated run returned `88 passed, 47 failed` because `TC-FR15-12` passed falsely on WebKit (`alert()` fired before React committed `setProducts(fakeMassUpdatedProducts)` to DOM). Fixed by asserting row 0 commits `resolvedName` before checking row 1 isolation.
  2. **Standardized Traceability Annotations (`64e888e`):** Extracted `annotateTestRun()` into `utils/testHelpers.ts` and applied it across all 3 `.spec.ts` files (`Feature`, `Run by: 23120183`, and `SUT Defect Note`).
  3. **Final Verified Multi-Browser Run:** `npm test` completed in **8.1m** with **87 passed, 48 failed** across **135 total runs** (Chromium: `29 passed, 16 failed`; Firefox: `29 passed, 16 failed`; WebKit: `29 passed, 16 failed` — 100% deterministic across all 3 engines). HTML report visibly displays `Run by: 23120183` and ISO timestamp `2026-11-12T10:06:01.914Z`.
