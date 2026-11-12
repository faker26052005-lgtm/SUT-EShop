# Báo Cáo Nhật Ký Sử Dụng AI (AI Audit Report) – HW04

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên:** Nguyễn Quốc Kỳ – **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop Web & Admin Frontend (`https://github.com/ttbhanh/eshop-sut`)  
> **Ngày thực hiện:** 12/11/2026  

---

## 1. Tuyên bố sử dụng AI (Declaration of AI Usage)

> *"I use AI tools for the following tasks: analyzing System Requirements Specification (SRS) documents, designing the modular directory architecture, generating data extraction scripts (tc_to_json.py), synthesizing initial draft Playwright Page Objects and Spec templates, diagnosing locator flakiness, and formatting standard Markdown/PDF reports."*

Toàn bộ mã nguồn do AI sinh ra (AI Draft) đều được tôi trực tiếp rà soát từng dòng, đối chiếu với mã nguồn thực tế của SUT (`CartContext.jsx`, `Login.jsx`, `App.jsx`, `server.js`) và tài liệu SRS. Mọi lỗi sai về selector, cơ chế chờ đợi, cách ly dữ liệu và trạng thái đều được tôi chủ động tái cấu trúc và cam kết thông qua các commit `fix(...)` riêng biệt trong lịch sử Git.

---

## 2. Nhật Ký Phiên Tương Tác AI (AI Interaction Log)

| Phiên # | Thời gian (ISO 8601) | Công cụ AI | Yêu cầu / Prompt chính | Kết quả do AI sinh (Raw Output) | Phần Sinh viên đã Rà soát & Chỉnh sửa (Human Fix) | Commit Git liên quan |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `2026-11-11T23:29:50+07:00` | Google Antigravity (Gemini 3.8 Flash) | Thiết kế kiến trúc Agent Skill `playwright-automation-coach` và script thẩm định `check_requirements.py` | Tạo thư mục skill `.agents/skills/playwright-automation-coach/` gồm tài liệu hướng dẫn và scripts. | Tinh chỉnh bộ regex kiểm tra assertion matcher và author filter để khớp với `git config user.name`. | `41c5cd8`, `b10dc9f` |
| **02** | `2026-11-12T00:15:00+07:00` | Google Antigravity (Gemini 3.8 Flash) | Setup cấu hình Playwright TypeScript, `.env`, `features.json`, `fixtures.ts` | Sinh `playwright.config.ts`, `package.json`, `tsconfig.json`. | Bổ sung `workers: 1`, `retries: 0` và metadata `Run by: 23120138` kèm ISO timestamp bắt buộc. | `fc3a5a5` |
| **03** | `2026-11-12T00:27:00+07:00` | Google Antigravity (Gemini 3.8 Flash) | Trích xuất test case từ `../hw_02/Main_Report.md` ra 3 file JSON data-driven | Chạy `tc_to_json.py` sinh `fr02-login.json` (24 TCs), `fr07-cart.json` (20 TCs), `fr17-coupon.json` (36 TCs). | Đối chiếu các trường `expectedStatus` và kiểu dữ liệu với đặc tả SRS để đảm bảo tính xác thực. | `ca62be9` |
| **04** | `2026-11-12T00:29:00+07:00` | Google Antigravity (Gemini 3.8 Flash) | Sinh bản nháp Page Object và Spec cho FR-02 (Đăng nhập & Khóa tài khoản) | `pages/login.page.ts` và `tests/fr02-login.spec.ts` dùng chung email `test@eshop.com`. | **AI mắc lỗi lớn:** Dùng chung tài khoản gây lỗi hàng loạt khi dính khóa 180s; CSS `.bg-red-100` dễ vỡ. Sinh viên đã tách biệt bản draft và refactor dùng API helper `registerFreshUser()`. | `8ca29e8` (AI draft), `45ced00` (Human fix) |
| **05** | `2026-11-12T00:29:40+07:00` | Google Antigravity (Gemini 3.8 Flash) | Sinh bản nháp Page Object và Spec cho FR-07 (Giỏ hàng) | `pages/cart.page.ts` và `tests/fr07-cart.spec.ts` giả định giỏ hàng persist qua reload. | **AI mắc lỗi:** Giỏ hàng là React state mất khi reload; không tính toán động subtotal và tổng tiền. Sinh viên sửa locator bảng, thêm assertion tính toán `subtotal == total`. | `2cd4cf5` (AI draft), `6a906f3` (Human fix) |
| **06** | `2026-11-12T00:30:20+07:00` | Google Antigravity (Gemini 3.8 Flash) | Sinh bản nháp Page Object và Spec cho FR-17 (Quản lý mã giảm giá Admin) | `pages/admin-coupon.page.ts` và `tests/fr17-coupon.spec.ts` với mã coupon cố định. | **AI mắc lỗi:** Mã coupon trùng lặp gây crash SQLite UNIQUE constraint; không có teardown. Sinh viên thêm hook `afterEach` gọi API xóa coupon và mã động `_timestamp`. | `c0d1fa4` (AI draft), `5139c1f` (Human fix) |
| **07** | `2026-11-12T08:17:00+07:00` | Google Antigravity (Gemini 3.8 Flash) | Rà soát hành vi validation HTML5 client-side của form đăng nhập FR-02 | Spec đợi response POST `/api/login` gây timeout 7s khi bỏ trống trường. | Thêm nhánh xử lý client-side validation không gửi network request, tăng tốc thực thi và chuẩn hóa logic test. | `7893e01` |

---

## 3. Phân Tích Lỗi của AI và Khoảng Cách Năng Lực (AI Error Taxonomy & Gap Analysis)

Qua quá trình cộng tác, các hạn chế điển hình của mô hình AI bao gồm:
1. **Thiếu hiểu biết sâu sắc về State Management phía Frontend:** AI thường mặc định các thay đổi giao diện (như giỏ hàng) được lưu trữ bền vững ở Database/Session, trong khi SUT EShop lưu cục bộ trong React State (`CartContext`), dẫn đến việc reload trang làm mất dữ liệu.
2. **Kẹt tài khoản do không quản lý trạng thái phụ thuộc (Stateful Interference):** AI sử dụng một tài khoản cố định (`test@eshop.com`) cho cả suite đăng nhập. Khi các test case negative kích hoạt bộ đếm sai 3 lần, tài khoản bị khóa 180 giây khiến các test case positive tiếp theo bị rớt oan (False Negative).
3. **Selector dễ vỡ (Fragile Locators):** AI thường có xu hướng dùng class Tailwindcss (`.bg-red-100`, `button.bg-blue-600`) thay vì các Accessible Locators chuẩn (`getByRole`, `getByLabel`, `getByPlaceholder`).
4. **Bỏ sót khâu Dọn dẹp Dữ liệu (Teardown Cleanup):** Khi tạo dữ liệu có ràng buộc duy nhất (Unique Coupon Code), AI không thiết lập hook `afterEach` để dọn dẹp, gây lỗi trùng lặp dữ liệu ở các lần chạy kế tiếp.
