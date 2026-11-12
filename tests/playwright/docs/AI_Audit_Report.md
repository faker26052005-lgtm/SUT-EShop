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
