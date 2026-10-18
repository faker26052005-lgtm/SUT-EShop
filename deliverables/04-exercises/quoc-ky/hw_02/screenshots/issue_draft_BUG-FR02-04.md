# [BUG] [FR-02][Backend API / Security] Correct password bypasses active account lockout and clears lockout state

### 1. Defect Metadata
- **Bug ID:** `BUG-FR02-04`
- **Discovered by Test Case:** [`TC_FR02_07`](../Main_Report.md#tc_fr02_07)
- **Feature / Subsystem:** Login and Account Lockout (`FR-02`)
- **Severity:** `Critical`
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v18.19.1
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- User account `test@eshop.com` is actively locked (`locked_until` is in the future).
- SUT backend server is running on `http://localhost:3000`.

### 3. Steps to Reproduce
1. Query SQLite database to verify `locked_until` is in the future:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```
2. Submit a login request with correct password `Test1234!` during the active lockout period:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"Test1234!"}'
   ```
3. Inspect SQLite database again to verify whether the account was prematurely unlocked:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

### 4. Test Data / Payload
```json
{
  "email": "test@eshop.com",
  "password": "Test1234!"
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-02, Item 3):*
> "Trong thời gian tài khoản bị tạm khóa, mọi yêu cầu đăng nhập (kể cả khi nhập đúng thông tin) đều bị hệ thống từ chối."
- Endpoint `POST /api/login` trả về HTTP `403 Forbidden` (`{"error": "Tài khoản đã bị khóa. Vui lòng thử lại sau."}`).
- Tuyệt đối không cấp JWT token.
- Trong CSDL SQLite, trường `locked_until` phải được giữ nguyên, không được tự ý xóa hoặc mở khóa sớm.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/login` trả về HTTP `200 OK` (`{"message": "Login successful"}`).
- Cấp JWT token hợp lệ và cấp phiên đăng nhập cho người dùng đang trong thời gian phạt khóa.
- Trong CSDL SQLite, trường `locked_until` bị xóa về `NULL`, chấm dứt hiệu lực khóa tài khoản ngay lập tức.
- HTTP Status Code: `200 OK`
- Database Mutation: `locked_until` = null (bị mở khóa trái phép)

### 7. Evidence & Visual Proof
- **Screenshot:**
  ![Minh chứng lỗi vượt khóa khi nhập đúng mật khẩu](https://raw.githubusercontent.com/faker26052005-lgtm/SUT-EShop/QuocKy-HW02/deliverables/04-exercises/quoc-ky/hw_02/screenshots/BUG_FR02_04_actual.png)
  *(File cục bộ: `screenshots/BUG_FR02_04_actual.png`)*
- **Terminal / API Log:**
```text
quocky05@quocky-linux:~/academy/software-testing/seminar$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬───────────────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until          │
├─────────┼────┼──────────────────┼────────────────┼───────────────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 0              │ '2026-10-18 17:56:52' │
└─────────┴────┴──────────────────┴────────────────┴───────────────────────┘

quocky05@quocky-linux:~/academy/software-testing/seminar$ curl -i -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 383
ETag: W/"17f-92JFLxYWHm1+NBQL0h2pi8FYkJw"
Date: Sun, 18 Oct 2026 17:56:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Login successful","token":"...","user":{"id":2,"name":"Test User","email":"test@eshop.com","password":"Test1234!","role":"user","login_attempts":0,"locked_until":"2026-10-18 17:56:52","reset_token":null,"shipping_address":null,"phone":null}}

quocky05@quocky-linux:~/academy/software-testing/seminar$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬──────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until │
├─────────┼────┼──────────────────┼────────────────┼──────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 0              │ null         │
└─────────┴────┴──────────────────┴────────────────┴──────────────┘
```

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js`
- **Line Numbers:** Lines 40-52
- **Flawed Code Snippet:**
```javascript
if (user.locked_until && new Date() < new Date(user.locked_until)) {
  return res
    .status(403)
    .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
}

if (user.password === password) {
  db.run(
    "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?",
    [user.id],
  );
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
  res.json({ message: "Login successful", token, user });
}
```
- **Analysis:**
  1. Nếu chuỗi `locked_until` lưu trong SQLite thiếu ký tự múi giờ `Z` (ví dụ `YYYY-MM-DD HH:MM:SS`), hàm `new Date(user.locked_until)` bị Node.js diễn giải theo giờ Local (GMT+7) thay vì UTC, dẫn đến so sánh `new Date() < new Date(user.locked_until)` bị sai lệch 7 giờ (đánh giá thành false).
  2. Khi điều kiện kiểm tra khóa bị vượt qua, khối `if (user.password === password)` lập tức thực thi câu lệnh SQL xóa `locked_until = NULL`, dẫn đến lỗ hổng bảo mật nghiêm trọng: tài khoản đang bị phạt khóa bị gỡ khóa sớm và cấp quyền đăng nhập thành công.
- **Proposed Fix:**
```javascript
const lockedTime = user.locked_until ? new Date(user.locked_until.includes('T') ? user.locked_until : user.locked_until.replace(' ', 'T') + 'Z') : null;
if (lockedTime && new Date() < lockedTime) {
  return res
    .status(403)
    .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
}
```
