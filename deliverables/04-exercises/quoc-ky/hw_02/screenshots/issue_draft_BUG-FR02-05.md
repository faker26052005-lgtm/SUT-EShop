# [BUG] [FR-02][Web UI] Email input uses type="text" instead of type="email", bypassing HTML5 format validation

### 1. Defect Metadata
- **Bug ID:** `BUG-FR02-05`
- **Discovered by Test Case:** [`TC_FR02_14`](../Main_Report.md#tc_fr02_14)
- **Feature / Subsystem:** Login and Account Lockout (`FR-02`) / Web Client UI
- **Severity:** `Major`
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v18.19.1
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT Web frontend is running on `http://localhost:5173`.
- User navigates to the login page `http://localhost:5173/login`.

### 3. Steps to Reproduce
1. Open login page at `http://localhost:5173/login`.
2. In the first input field (labeled "Username"), enter an invalid email without '@': `testeshop.com`.
3. In the password field, enter `Test1234!`.
4. Click the "Sign In" button.

### 4. Test Data / Payload
```json
{
  "email": "testeshop.com",
  "password": "Test1234!"
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-02, Item 5):*
> "Trường email phải dùng `type="email"` (có validate HTML5 format)."
- Trình duyệt hiển thị cảnh báo HTML5 dạng tooltip: *"Please include an '@' in the email address..."* (hoặc *"Vui lòng bao gồm '@' trong địa chỉ email..."*).
- Form bị chặn lại ở phía Client, không gửi request HTTP `POST /api/login` lên server khi định dạng email sai.

### 6. Actual Result (Observed on SUT)
- Trường email được định nghĩa với `type="text"` (nhãn hiển thị là "Username") thay vì `type="email"`.
- Trình duyệt hoàn toàn không kích hoạt cơ chế HTML5 email format validation.
- Form cho phép gửi trực tiếp chuỗi không hợp lệ `testeshop.com` lên server qua `POST /api/login` (nhận mã 401) và hiển thị thông báo "Đăng nhập thất bại. Vui lòng kiểm tra lại."
- *(Các lỗi giao diện liên quan phát hiện đồng thời: Tiêu đề trang đăng nhập bị nhầm thành "Đăng Ký", và trường Mật khẩu dùng `type="text"` làm lộ mật khẩu ở dạng rõ text).*
- HTTP Status Code: `401 Unauthorized` (do backend nhận request không hợp lệ)
- Client Behavior: Không kích hoạt HTML5 format validation

### 7. Evidence & Visual Proof
- **Screenshot:**
  ![Minh chứng lỗi type=text bỏ qua validate email](https://raw.githubusercontent.com/faker26052005-lgtm/SUT-EShop/QuocKy-HW02/deliverables/04-exercises/quoc-ky/hw_02/screenshots/BUG_FR02_05_actual.png)
  *(File cục bộ: `screenshots/BUG_FR02_05_actual.png` và `screenshots/TC_FR02_14_api.png`)*
- **Terminal / API Log:**
```text
quocky05@quocky-linux:~/academy/software-testing/seminar$ curl -i -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testeshop.com","password":"Test1234!"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 37
ETag: W/"25-3YG4LRpkIFolV4uVOnUIRm2hZA0"
Date: Sun, 18 Oct 2026 18:19:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Invalid email or password"}
```

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `frontend-web/src/pages/Login.jsx`
- **Line Numbers:** Lines 24, 28–35, 38–46
- **Flawed Code Snippet:**
```jsx
<h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h2>

<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-gray-700 mb-2">Username</label>
    <input
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border p-2 rounded"
      required
    />
  </div>
  <div>
    <label className="block text-gray-700 mb-2">Mật khẩu</label>
    <input
      type="text"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border p-2 rounded"
      required
    />
  </div>
```
- **Proposed Fix:**
```jsx
<h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>

<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label className="block text-gray-700 mb-2">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border p-2 rounded"
      required
    />
  </div>
  <div>
    <label className="block text-gray-700 mb-2">Mật khẩu</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border p-2 rounded"
      required
    />
  </div>
```
