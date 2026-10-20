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


---

## PHẦN 2: DANH SÁCH LỖI PHÁT HIỆN TẠI FEATURE B — FR-09: ÁP DỤNG MÃ GIẢM GIÁ (COUPON)

---

### BUG-FR09-01: Sai công thức toán học khi tính giảm giá theo phần trăm (SAVE10)
1. **Bug ID:** `BUG-FR09-01`
2. **Function name:** `FR-09: Tính toán giảm giá theo phần trăm (Backend API)`
3. **Problem summary:** `Calculate Percentage Discount: Backend multiplies total by negative factor (1 - discount_value) instead of (total * discount_value / 100), increasing order total 10-fold.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `http://localhost:3000/api/apply-coupon`, Node.js Express.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/apply-coupon` với body: `{"code": "SAVE10", "total_amount": 400000, "user_id": 2}`.
     2. Quan sát kết quả JSON trả về.
   * **Expected Behavior:** Giảm 10% của 400,000 ₫ là 40,000 ₫; `discount_amount: 40000`, `final_amount: 360000`.
   * **Actual Behavior:** Hệ thống trả về `discount_amount: -3600000`, `final_amount: 4000000` (khách hàng bị đội giá gấp 10 lần).
   * **Root Cause & Code Reference:** Tại file `backend/server.js` dòng 406:
     ```javascript
     discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
     ```
     Với `coupon.discount_value = 10`, `(1 - 10) = -9`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Backend Developer
8. **Status:** `Open / New`
9. **Priority:** `Immediate (Critical)` — Tính toán sai tiền của khách hàng, đe dọa trực tiếp hoạt động kinh doanh.
10. **Severity:** `Fatal` — Gây thiệt hại tài chính nghiêm trọng và tính sai giá trị thanh toán.

---

### BUG-FR09-02: Sai toán tử so sánh ngưỡng tối thiểu (sử dụng '>' thay vì '>=')
1. **Bug ID:** `BUG-FR09-02`
2. **Function name:** `FR-09: Kiểm tra ngưỡng giá trị tối thiểu (Backend API)`
3. **Problem summary:** `Validate Minimum Order Amount: Backend uses strict inequality '>' instead of '>=', falsely rejecting orders exactly equal to min_order_amount.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `:5173` & Backend `:3000`.
   * **Steps to Reproduce:**
     1. Nhập đơn hàng có tổng tiền đúng `500,000 ₫`.
     2. Nhập mã `'BIGBUY'` (có `min_order_amount = 500,000 ₫`).
     3. Nhấp "Áp dụng".
   * **Expected Behavior:** Hệ thống chấp nhận mã hợp lệ vì $500,000 \ge 500,000$ (thỏa mãn điều kiện C3).
   * **Actual Behavior:** Hệ thống từ chối với HTTP 400: *"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"*.
   * **Root Cause & Code Reference:** Tại `backend/server.js` dòng 385:
     ```javascript
     if (total_amount > coupon.min_order_amount) { // Thiếu dấu =
     ```
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Backend Developer
8. **Status:** `Open / New`
9. **Priority:** `High`
10. **Severity:** `Serious` — Từ chối sai các khách hàng đạt đủ điều kiện khuyến mãi tối thiểu.

---

### BUG-FR09-03: Endpoint áp dụng coupon không yêu cầu xác thực JWT (Vi phạm C4)
1. **Bug ID:** `BUG-FR09-03`
2. **Function name:** `FR-09: Xác thực người dùng khi áp coupon (Security / API)`
3. **Problem summary:** `Authenticate Coupon Application: POST /api/apply-coupon lacks authenticateToken middleware, violating C4 requirement.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `:3000`.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/apply-coupon` với body `{"code": "BIGBUY", "total_amount": 600000}` mà không kèm header `Authorization: Bearer <token>`.
   * **Expected Behavior:** Backend trả về HTTP 401 Unauthorized yêu cầu đăng nhập theo quy định C4.
   * **Actual Behavior:** Backend trả về HTTP 200 thành công cho khách vãng lai.
   * **Root Cause:** Route `app.post("/api/apply-coupon", ...)` trong `server.js` thiếu middleware `authenticateToken`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Backend Developer
8. **Status:** `Open / New`
9. **Priority:** `High`
10. **Severity:** `Serious` — Vi phạm ràng buộc bảo mật và quản lý khuyến mãi của hệ thống.

---

### BUG-FR09-04: Backend nhận user_id từ request body gây nguy cơ ID Spoofing
1. **Bug ID:** `BUG-FR09-04`
2. **Function name:** `FR-09: Kiểm soát định danh người dùng (Security / API)`
3. **Problem summary:** `Authorize User Identity: Backend trusts client-provided user_id in body instead of extracting from verified JWT token, allowing quota bypass.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `:3000`.
   * **Steps to Reproduce:**
     1. Tài khoản A (User ID 2) đã dùng hết lượt mã `BIGBUY`.
     2. Gửi request với body `{"code": "BIGBUY", "total_amount": 600000, "user_id": 999}`.
   * **Expected Behavior:** Backend lấy `req.user.id` từ token, phát hiện đã hết lượt và từ chối.
   * **Actual Behavior:** Backend truy vấn `user_id = 999`, không thấy lịch sử dùng và cho phép áp dụng thành công.
   * **Root Cause:** `server.js:370` lấy `const { code, total_amount, user_id } = req.body;`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Backend Developer
8. **Status:** `Open / New`
9. **Priority:** `High`
10. **Severity:** `Serious` — Lỗ hổng cho phép kẻ gian giả mạo ID người dùng khác để qua mặt hạn ngạch sử dụng coupon.

---

### BUG-FR09-05: Giao diện Checkout cho phép người dùng tự do nhập và sửa tổng tiền thanh toán
1. **Bug ID:** `BUG-FR09-05`
2. **Function name:** `FR-08 / FR-09: Toàn vẹn dữ liệu đơn hàng (Web Client / Security)`
3. **Problem summary:** `Enforce Order Total Integrity: Checkout page exposes an editable input for total amount, allowing price tampering.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `http://localhost:5173/checkout`.
   * **Steps to Reproduce:**
     1. Mở trang Checkout.
     2. Tại ô "Tổng tiền thanh toán (VND)", gõ trực tiếp số tiền `600,000 ₫` (mặc dù giỏ hàng chỉ có món 50,000 ₫).
     3. Nhập mã `'BIGBUY'` và bấm Áp dụng.
   * **Expected Behavior:** Tổng tiền thanh toán là trường chỉ đọc (read-only), tự động tính từ giỏ hàng (theo đặc tả FR-08 dòng 105).
   * **Actual Behavior:** Input cho phép sửa tự do, người dùng có thể kích hoạt các mã giảm giá giá trị cao hoặc giảm giá tiền thanh toán tùy ý.
   * **Root Cause:** `frontend-web/src/pages/Checkout.jsx` dòng 93-103 render `<input type="number" value={editableTotal} onChange=... />`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Fullstack Developer
8. **Status:** `Open / New`
9. **Priority:** `Immediate (Critical)`
10. **Severity:** `Fatal` — Lỗ hổng cho phép người mua gian lận tùy ý giá trị thanh toán của đơn hàng.

---

### BUG-FR09-06: Ghi nhận lượt sử dụng coupon tách rời khỏi transaction thanh toán
1. **Bug ID:** `BUG-FR09-06`
2. **Function name:** `FR-09: Quản lý tính nguyên tử của giao dịch (Architecture / Fullstack)`
3. **Problem summary:** `Persist Coupon Usage: Frontend executes separate uncoordinated call to /api/coupon-usage, risking unrecorded single-use coupons.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `:5173` & Backend `:3000`.
   * **Steps to Reproduce:**
     1. Áp dụng mã `BIGBUY` (mã dùng 1 lần) và tiến hành đặt hàng.
     2. Dùng DevTools chặn request thứ hai gửi tới `/api/coupon-usage` sau khi `/api/checkout` đã thành công.
   * **Expected Behavior:** Đơn hàng và việc ghi nhận trừ lượt dùng coupon phải nằm chung trong 1 transaction nguyên tử tại Backend.
   * **Actual Behavior:** Đơn hàng được tạo thành công nhưng bảng `coupon_usage` không có bản ghi nào, người dùng có thể tiếp tục dùng mã này cho các đơn hàng tiếp theo.
   * **Root Cause:** `Checkout.jsx` dòng 54-59 thực hiện 2 request HTTP độc lập thay vì backend xử lý trong cùng 1 transaction.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 20/10/2026
7. **Assign to:** Fullstack Developer
8. **Status:** `Open / New`
9. **Priority:** `High`
10. **Severity:** `Serious` — Thiếu tính nguyên tử (Atomicity), gây rủi ro lạm dụng mã giảm giá nhiều lần.
