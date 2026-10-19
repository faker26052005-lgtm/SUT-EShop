# BÁO CÁO LỖI (BUG REPORT) - DỰ ÁN ESHOP SUT
## Bài tập Tuần 02 (HW02-AI) - Domain Testing & BVA
**Sinh viên thực hiện:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)

---

## 1. Tổng quan Lỗi theo Tính năng

| Bug ID | Tính năng (Feature) | Tên lỗi vắn tắt | Mức độ nghiêm trọng (Severity) | Trạng thái (Status) |
|:---|:---|:---|:---:|:---:|
| **BUG-FR01-01** | FR-01: Đăng ký tài khoản | Regex mật khẩu bắt buộc khoảng trắng và cấm ký tự đặc biệt `@$!%*?&` | **Critical** | Open |
| **BUG-FR01-02** | FR-01: Đăng ký tài khoản | Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu" | **Major** | Open |
| **BUG-FR01-03** | FR-01: Đăng ký tài khoản | Input Email dùng `type="text"` thay vì `type="email"`, thiếu format validation | **Minor** | Open |
| **BUG-FR01-04** | FR-01: Đăng ký tài khoản | Nút "Đăng ký" dùng màu đỏ (`bg-red-500`) vi phạm quy chuẩn thiết kế UI | **Trivial** | Open |
| **BUG-FR01-05** | FR-01: Đăng ký tài khoản | Backend không validate dữ liệu, không check trùng email, lưu mật khẩu plaintext | **Critical** | Open |
| **BUG-FR01-06** | FR-01: Đăng ký tài khoản | Không kiểm tra tập ký tự Họ Tên và Email (chấp nhận số, script XSS, cú pháp phi lý `_@)`) | **Major** | Open |

---

## 2. Chi tiết Từng Lỗi Phát Hiện

### BUG-FR01-01: Regex mật khẩu bắt buộc khoảng trắng và cấm ký tự đặc biệt
* **Mức độ (Severity):** Critical
* **Phân loại:** Functional / Validation Bug
* **Vị trí mã nguồn:** `frontend-web/src/pages/Register.jsx` dòng 15
* **Mô tả chi tiết:**
  * Đặc tả FR-01 yêu cầu mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, và ký tự đặc biệt trong tập `@$!%*?&`. Mật khẩu không chứa khoảng trắng.
  * Tuy nhiên mã nguồn thực tế triển khai:
    ```javascript
    const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
    ```
  * Biểu thức chính quy này chứa nhóm điều kiện `(?=.*\s)` bắt buộc phải có khoảng trắng, đồng thời tập ký tự cho phép `[A-Za-z\d\s]` tuyệt đối cấm mọi ký tự đặc biệt như `@$!%*?&`.
* **Hậu quả:**
  * Người dùng nhập mật khẩu bảo mật chuẩn đặc tả như `ValidPass@123` bị từ chối với thông báo "Mật khẩu quá yếu!".
  * Người dùng nhập mật khẩu có khoảng trắng như `ValidPass 123` lại được form chấp nhận.
* **Đề xuất khắc phục (Fix):** Sửa regex thành:
  ```javascript
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  ```

---

### BUG-FR01-02: Giao diện thiếu hoàn toàn trường "Xác nhận mật khẩu"
* **Mức độ (Severity):** Major
* **Phân loại:** UI / Missing Feature Bug
* **Vị trí mã nguồn:** `frontend-web/src/pages/Register.jsx` (form JSX)
* **Mô tả chi tiết:**
  * Đặc tả FR-01 nêu rõ: Người dùng phải nhập Mật khẩu và Xác nhận mật khẩu, hệ thống phải kiểm tra hai trường trùng khớp nhau trước khi đăng ký.
  * Form đăng ký trên frontend chỉ render 3 ô input: Họ tên (`name`), Email (`email`), Mật khẩu (`password`). Hoàn toàn không có ô `confirmPassword`.
* **Hậu quả:** Hệ thống không thể bảo vệ người dùng tránh gõ nhầm mật khẩu khi đăng ký; vi phạm tiêu chuẩn thiết kế chức năng xác thực người dùng.
* **Đề xuất khắc phục (Fix):** Bổ sung ô input Xác nhận mật khẩu vào JSX và thêm kiểm tra `password === confirmPassword` trước khi submit.

---

### BUG-FR01-03: Input Email dùng `type="text"`, thiếu format validation
* **Mức độ (Severity):** Minor
* **Phân loại:** UI Validation Bug
* **Vị trí mã nguồn:** `frontend-web/src/pages/Register.jsx` dòng 48
* **Mô tả chi tiết:**
  * Trường Email được khai báo bằng thẻ `<input type="text" name="email" required ... />` thay vì `<input type="email">`.
  * Form không có bất kỳ regex nào kiểm tra định dạng email trước khi submit.
* **Hậu quả:** Các email sai format như `invalidemail.com`, `@gmail.com`, `user@` không bị trình duyệt hoặc form chặn, được gửi thẳng lên backend và lưu vào CSDL.
* **Đề xuất khắc phục (Fix):** Đổi `type="text"` thành `type="email"` và bổ sung regex email format validation.

---

### BUG-FR01-04: Nút "Đăng ký" sai màu quy chuẩn thiết kế UI
* **Mức độ (Severity):** Trivial
* **Phân loại:** UI Consistency Bug
* **Vị trí mã nguồn:** `frontend-web/src/pages/Register.jsx` dòng 72
* **Mô tả chi tiết:** Nút Đăng ký được gán class Tailwind `bg-red-500` (màu đỏ - thường dùng cho hành động hủy/nguy hiểm), trong khi quy chuẩn thiết kế FR-21 yêu cầu nút submit chính phải có màu xanh dương (`bg-blue-600` hoặc tương đương).
* **Đề xuất khắc phục (Fix):** Đổi class sang màu xanh dương theo đúng design system.

---

### BUG-FR01-05: Backend không validate dữ liệu, không check trùng email, lưu mật khẩu plaintext
* **Mức độ (Severity):** Critical
* **Phân loại:** Backend Security / Data Integrity Bug
* **Vị trí mã nguồn:** `backend/server.js` (Route `POST /api/register`) và `backend/database.js`
* **Mô tả chi tiết:**
  * Tuyến API `POST /api/register` nhận `req.body` gồm `name, email, password` và gọi lệnh `INSERT INTO users (name, email, password) VALUES (?, ?, ?)` trực tiếp mà không:
    1. Kiểm tra định dạng email hay kiểm tra email đã tồn tại hay chưa.
    2. Kiểm tra độ phức tạp của mật khẩu.
    3. Băm mật khẩu (hashing) bằng thư viện an toàn như `bcrypt`.
  * Bảng `users` trong `database.js` không có ràng buộc `UNIQUE` trên cột `email`.
* **Hậu quả:**
  * Lỗ hổng bảo mật nghiêm trọng (SEC-01): Mật khẩu người dùng bị lưu dưới dạng bản rõ (plaintext) trong database.
  * Cho phép đăng ký vô hạn tài khoản trùng email, dẫn đến xung đột logic khi đăng nhập.
* **Đề xuất khắc phục (Fix):**
  1. Thêm ràng buộc `UNIQUE` cho cột `email` trong CSDL.
  2. Bổ sung logic kiểm tra email tồn tại và trả về mã lỗi HTTP 409 Conflict.
  3. Sử dụng `bcrypt.hash(password, 10)` trước khi lưu mật khẩu.

---

### BUG-FR01-06: Không kiểm tra tập ký tự Họ Tên và Email (chấp nhận số, script XSS, cú pháp phi lý `_@)`)
* **Mức độ (Severity):** Major
* **Phân loại:** Robustness / Input Sanitization & Security Defect
* **Vị trí mã nguồn:** `frontend-web/src/pages/Register.jsx` dòng 41, 48 và `backend/server.js` route `POST /api/register`
* **Mô tả chi tiết:**
  * SUT thiếu hoàn toàn kiểm tra tập ký tự hợp lệ cho 2 trường Họ Tên và Email:
    1. **Họ Tên:** Frontend dùng `<input type="text" name="name" required>` mà không có regex giới hạn ký tự chữ cái (`pattern="^[A-Za-zÀ-ỹ\s]+$"`). Backend nhận thẳng và `INSERT` vào SQLite mà không lọc bỏ ký tự số hoặc thẻ HTML. Kết quả: Hệ thống chấp nhận họ tên chỉ gồm chữ số (`"12345678"`) hoặc chứa mã script độc hại (`"<script>alert(1)</script>"`).
    2. **Email:** Frontend dùng `<input type="text" name="email">`, không có regex format theo chuẩn RFC 5322. Backend không kiểm tra cấu trúc tên miền FQDN/TLD. Kết quả: Hệ thống chấp nhận các email chứa ký tự cấm (`"user#$!%@gmail.com"`) và thậm chí chuỗi hoàn toàn phi lý như `"_@)"` (với domain chỉ là một dấu ngoặc đơn đóng `)` không có TLD).
* **Hậu quả:**
  * **Rủi ro Bảo mật Stored XSS:** Chuỗi script độc hại được lưu trực tiếp vào CSDL, khi trang Quản trị viên (Admin) hoặc Hồ sơ người dùng render tên này mà không escape HTML sẽ bị kích hoạt mã độc tấn công phiên làm việc của Admin.
  * **Rủi ro Crash Server:** Địa chỉ email phi lý `_@)` sẽ gây exception không xử lý được khi thư viện gửi mail (như Nodemailer / SMTP) cố gắng phân giải DNS MX record, có thể làm sập tiến trình Backend.
* **Đề xuất khắc phục (Fix):**
  1. Frontend: Bổ sung regex kiểm tra chỉ cho phép chữ cái cho Họ Tên; đổi input email sang `type="email"` và regex RFC chuẩn.
  2. Backend: Sử dụng `validator.isAlpha(name, 'vi-VN')` và `validator.isEmail(email)` trước khi xử lý `INSERT`; đồng thời escape ký tự HTML (Sanitize) để triệt tiêu lỗ hổng XSS.
