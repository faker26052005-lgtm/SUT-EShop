# BÁO CÁO LỖI (DEFECT / BUG REPORT) - DỰ ÁN ESHOP SUT
## Bài tập Tuần 02 (HW02-AI) - Domain Testing & Boundary Value Analysis (BVA)
* **Môn học:** Software Testing (CSC13003) - FIT@HCMUS
* **Tiêu chuẩn áp dụng:** Slide S08 — Bug Report 10 Essentials & Guru99 Defect Life Cycle
* **Người thực hiện:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
* **Ngày lập báo cáo:** 19/10/2026

---

## 1. Bảng Tổng Hợp Danh Mục Lỗi (Defect Summary Table)

| Bug ID | Chức năng (Function) | Tóm tắt lỗi (Problem Summary) | Defect Type | Priority | Severity | Status |
|:---|:---|:---|:---|:---:|:---:|:---:|
| **BUG-FR01-01** | FR-01: Đăng ký tài khoản (UI) | Regex cấm ký tự `@` và bắt buộc khoảng trắng; chặn mật khẩu hợp lệ | Coding logic / Regex | **Immediate** | **Serious** | Open |
| **BUG-FR01-02** | FR-01: Đăng ký tài khoản (UI) | Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu" | Feature missing | **High** | **Serious** | Open |
| **BUG-FR01-03** | FR-01: Đăng ký tài khoản (UI) | Input Email dùng `type="text"`, thiếu validation định dạng RFC | User Interface | **Medium** | **Medium** | Open |
| **BUG-FR01-04** | FR-01: Đăng ký tài khoản (UI) | Nút "Đăng ký" dùng màu đỏ (`bg-red-500`) vi phạm quy chuẩn thiết kế UI | User Interface | **Low** | **Cosmetic** | Open |
| **BUG-FR01-05** | FR-01: Đăng ký tài khoản (API) | Backend lưu mật khẩu plaintext, bảng `users` thiếu UNIQUE cho email | Security / Database | **Immediate** | **Fatal** | Open |
| **BUG-FR01-06** | FR-01: Đăng ký tài khoản (Full) | Thiếu kiểm tra tập ký tự Họ Tên & Email (chấp nhận số, XSS, cú pháp `_@)`) | Robustness / Security | **High** | **Serious** | Open |

---

## 2. Hồ Sơ Chi Tiết Từng Lỗi (Theo 10 Thành Phần Chuẩn Slide S08)

### BUG-FR01-01: Regex mật khẩu bắt buộc khoảng trắng và cấm ký tự đặc biệt
1. **Bug ID:** `BUG-FR01-01`
2. **Function name:** `FR-01: Đăng ký tài khoản (Web Client)`
3. **Problem summary:** `Verify Registration with Valid Password: Valid password 'ValidPass@123' is rejected with 'Mật khẩu quá yếu!' instead of being accepted.`
4. **How to reproduce the defect:**
   * **Environment:** Windows 11, Google Chrome 120+, Frontend Web port 5173, React 18.
   * **Steps to Reproduce:**
     1. Mở trình duyệt, truy cập `http://localhost:5173/register`.
     2. Nhập Họ Tên: `"Nguyen Van A"`, Email: `"validuser@gmail.com"`.
     3. Nhập Mật khẩu: `"ValidPass@123"`.
     4. Nhấp nút "Đăng ký".
   * **Expected Behavior:** Hệ thống chấp nhận mật khẩu hợp lệ thỏa mãn đầy đủ tiêu chuẩn đặc tả FR-01 ($\ge 8$ ký tự, có chữ hoa, chữ thường, số, và ký tự `@`), tiến hành gửi request đăng ký.
   * **Actual Behavior:** Trình duyệt hiển thị popup thông báo lỗi *"Mật khẩu quá yếu!"*; form bị chặn submit.
   * **Root Cause & Code Reference:** Tại file `frontend-web/src/pages/Register.jsx` dòng 15:
     ```javascript
     const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
     ```
     Biểu thức chính quy này chứa nhóm `(?=.*\s)` bắt buộc phải có dấu cách, đồng thời tập ký tự `[A-Za-z\d\s]` cấm toàn bộ các ký tự đặc biệt hợp lệ `@$!%*?&`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Frontend Developer
8. **Status:** `Open / New`
9. **Priority:** `Immediate (Critical)` — Phải sửa ngay trong 01 ngày vì làm tê liệt luồng đăng ký của người dùng bình thường.
10. **Severity:** `Serious` — Ảnh hưởng nghiêm trọng đến tính năng chính của hệ thống.

---

### BUG-FR01-02: Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu"
1. **Bug ID:** `BUG-FR01-02`
2. **Function name:** `FR-01: Đăng ký tài khoản (Web Client)`
3. **Problem summary:** `Validate Confirm Password field: Registration form completely lacks Confirm Password input field instead of providing confirmation check.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173.
   * **Steps to Reproduce:**
     1. Mở trang `http://localhost:5173/register`.
     2. Quan sát toàn bộ giao diện form đăng ký.
   * **Expected Behavior:** Form phải có 4 trường bắt buộc theo đặc tả FR-01: Họ Tên, Email, Mật khẩu, và Xác nhận mật khẩu; hệ thống phải đối chiếu hai trường mật khẩu trùng khớp nhau trước khi submit.
   * **Actual Behavior:** Giao diện chỉ có 3 ô input: Họ tên (`name`), Email (`email`), Mật khẩu (`password`). Hoàn toàn không có ô `confirmPassword`.
   * **Root Cause & Code Reference:** Trong `frontend-web/src/pages/Register.jsx`, state `formData` chỉ khởi tạo `{ name: '', email: '', password: '' }` và không render thẻ input cho trường xác nhận.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Frontend Developer
8. **Status:** `Open / New`
9. **Priority:** `High` — Phải sửa trong 02-04 ngày vì vi phạm đặc tả chức năng cốt lõi.
10. **Severity:** `Serious` — Bỏ mất chốt chặn an toàn bảo vệ người dùng tránh gõ nhầm mật khẩu.

---

### BUG-FR01-03: Trường Email không dùng `type="email"` và thiếu validation format
1. **Bug ID:** `BUG-FR01-03`
2. **Function name:** `FR-01: Đăng ký tài khoản (Web Client)`
3. **Problem summary:** `Test Email Input Type & Syntax: Email input uses type='text' instead of type='email', allowing invalid formats like 'invalidemail.com' to submit.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173.
   * **Steps to Reproduce:**
     1. Mở `/register`.
     2. Nhập Họ Tên: `"Nguyen Van A"`, Email: `"invalidemail.com"` (thiếu `@`), Mật khẩu workaround: `"ValidPass 123"`.
     3. Nhấp "Đăng ký".
   * **Expected Behavior:** Trình duyệt kích hoạt HTML5 email validation hoặc code ném lỗi yêu cầu email phải có định dạng hợp lệ.
   * **Actual Behavior:** Form submit thành công, gửi thẳng chuỗi `invalidemail.com` lên backend và backend lưu vào CSDL.
   * **Root Cause & Code Reference:** Tại file `frontend-web/src/pages/Register.jsx` dòng 48:
     ```jsx
     <input type="text" name="email" required ... />
     ```
     Input bị gán sai kiểu `type="text"` và không có biểu thức chính quy kiểm tra định dạng email theo RFC 5322.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Frontend Developer
8. **Status:** `Open / New`
9. **Priority:** `Medium` — Sửa trong 05-08 ngày.
10. **Severity:** `Medium` — Sai lệch quy chuẩn form HTML5 và tiêu chuẩn nghiệp vụ FR-22.

---

### BUG-FR01-04: Nút "Đăng ký" sai màu quy chuẩn thiết kế UI
1. **Bug ID:** `BUG-FR01-04`
2. **Function name:** `FR-01: Giao diện Đăng ký (Web Client UI)`
3. **Problem summary:** `Check Register Button Color: Submit button displays red color (bg-red-500) instead of standard design blue color.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173.
   * **Steps to Reproduce:** Truy cập `/register` và quan sát nút "Đăng ký".
   * **Expected Behavior:** Nút gửi form chính của hệ thống phải có màu xanh dương theo quy chuẩn thiết kế FR-21.
   * **Actual Behavior:** Nút hiển thị màu đỏ rực (`bg-red-500` - màu thường dành cho hành động hủy hoặc nguy hiểm).
   * **Root Cause & Code Reference:** Tại file `frontend-web/src/pages/Register.jsx` dòng 72: class Tailwind gán `bg-red-500 hover:bg-red-600`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Frontend Developer
8. **Status:** `Open / New`
9. **Priority:** `Low` — Sửa trong đợt refactor giao diện tiếp theo.
10. **Severity:** `Cosmetic` — Lỗi thẩm mỹ, không làm hỏng tính năng nghiệp vụ.

---

### BUG-FR01-05: Backend không validate dữ liệu, không check trùng email, lưu mật khẩu plaintext
1. **Bug ID:** `BUG-FR01-05`
2. **Function name:** `FR-01: API Đăng ký tài khoản (Backend Server)`
3. **Problem summary:** `Validate Register API Security: Backend allows duplicate emails and stores unhashed plaintext passwords instead of rejecting with HTTP 409 and hashing with bcrypt.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API port 3000, SQLite 3 database.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/register` với body: `{"name": "Nguyen Van A", "email": "test@eshop.com", "password": "ValidPass 123"}` (email đã có trong database).
     2. Mở file CSDL SQLite và truy vấn `SELECT * FROM users WHERE email = 'test@eshop.com'`.
   * **Expected Behavior:** Backend phải kiểm tra sự tồn tại của email, trả về mã lỗi HTTP 409 Conflict. Nếu email mới, mật khẩu phải được băm bảo mật bằng thuật toán an toàn như `bcrypt` trước khi lưu (tiêu chuẩn SEC-01).
   * **Actual Behavior:** Backend trả về HTTP 200/201 đăng ký thành công. Truy vấn CSDL thấy xuất hiện 2 dòng cùng email `test@eshop.com`, và cột `password` chứa chuỗi ký tự bản rõ `"ValidPass 123"` mà không hề được băm.
   * **Root Cause & Code Reference:**
     * Trong `backend/database.js`: Cột `email TEXT` không có ràng buộc `UNIQUE`.
     * Trong `backend/server.js` tuyến `POST /api/register`: Gọi lệnh `INSERT INTO users (name, email, password) VALUES (?, ?, ?)` trực tiếp mà không kiểm tra trùng lặp hay gọi `bcrypt.hash()`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Backend Developer
8. **Status:** `Open / New`
9. **Priority:** `Immediate (Critical)` — Phải vá lỗi ngay trong 01 ngày.
10. **Severity:** `Fatal` — Lỗ hổng bảo mật nghiêm trọng làm lộ toàn bộ mật khẩu người dùng khi CSDL bị truy cập và làm hỏng toàn vẹn dữ liệu.

---

### BUG-FR01-06: Hệ thống thiếu kiểm tra tập ký tự Họ Tên & Email (nhận số, script XSS, cú pháp phi lý `_@)`)
1. **Bug ID:** `BUG-FR01-06`
2. **Function name:** `FR-01: Input Sanitization & Robustness (Full Stack)`
3. **Problem summary:** `Validate Character Sets & Sanitization: System accepts numeric names, malicious XSS script payloads, and malformed email '_@)' instead of rejecting invalid character sets.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173 & Backend API port 3000.
   * **Steps to Reproduce:**
     1. Mở `/register`.
     2. Nhập Họ Tên: `"<script>alert(1)</script>"`, Email: `"_@)"`, Mật khẩu workaround: `"ValidPass 123"`.
     3. Bấm Đăng ký.
   * **Expected Behavior:** Hệ thống phát hiện họ tên chứa ký tự đặc biệt nguy hiểm và cấu trúc email không có tên miền hợp lệ (FQDN/TLD), từ chối submit và thông báo lỗi.
   * **Actual Behavior:** Cả Frontend và Backend đều cho qua 100%, tài khoản được tạo thành công với chuỗi script độc hại và địa chỉ email phi lý `_@)` trong CSDL SQLite.
   * **Root Cause:** SUT thiếu hoàn toàn tầng Sanitize và thư viện kiểm tra tập ký tự (như `validator.isAlpha()` cho Họ Tên và `validator.isEmail()` cho Email).
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 19/10/2026
7. **Assign to:** Fullstack Developer
8. **Status:** `Open / New`
9. **Priority:** `High` — Sửa trong 02-04 ngày.
10. **Severity:** `Serious` — Gây nguy cơ tấn công Stored XSS khi trang Admin hiển thị danh sách người dùng và nguy cơ sập tiến trình Backend khi gửi mail tới domain không hợp lệ.
