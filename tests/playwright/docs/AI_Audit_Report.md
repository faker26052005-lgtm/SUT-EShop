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
