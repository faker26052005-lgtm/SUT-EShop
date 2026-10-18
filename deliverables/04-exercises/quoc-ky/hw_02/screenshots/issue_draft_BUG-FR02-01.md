# [BUG] [FR-02][Backend API / SQLite DB] Failure counter increments by 2 instead of 1 upon invalid login attempt

### 1. Defect Metadata
- **Bug ID:** `BUG-FR02-01`
- **Discovered by Test Case:** [`TC_FR02_03`](../Main_Report.md#tc_fr02_03)
- **Feature / Subsystem:** Login and Account Lockout (`FR-02`)
- **Severity:** `Major`
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v18.19.1
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- User account `test@eshop.com` exists in SQLite database with `login_attempts = 0` and `locked_until = NULL`.
- SUT backend server is running on `http://localhost:3000`.

### 3. Steps to Reproduce
1. Send a login request with valid email `test@eshop.com` and invalid password `WrongPass1!`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"WrongPass1!"}'
   ```
2. Query the SQLite database to inspect `login_attempts` counter for `test@eshop.com`:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

### 4. Test Data / Payload
```json
{
  "email": "test@eshop.com",
  "password": "WrongPass1!"
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-02, Item 2):*
> "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần đăng nhập sai liên tiếp lên đúng 1 đơn vị."
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized` với mã lỗi thông báo thích hợp.
- Trong CSDL SQLite, trường `login_attempts` phải tăng từ `0` lên **đúng `1`** ($N=1$). Trường `locked_until` tiếp tục giữ nguyên là `NULL`.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized` (`{"error":"Invalid email or password"}`).
- Tuy nhiên trong CSDL SQLite, trường `login_attempts` tăng từ `0` lên **`2`** ($N=2$) chỉ sau đúng 1 lần thử sai duy nhất. Điều này khiến cơ chế khóa tài khoản bị kích hoạt sớm sai lệch nghiêm trọng so với quy định ngưỡng $N=3$ của SRS.
- HTTP Status Code: `401 Unauthorized`
- Database Mutation: `login_attempts` = 2, `locked_until` = null

### 7. Evidence & Visual Proof
- **Screenshot:** `screenshots/BUG_FR02_01_actual.png`
- **Terminal / API Log:**
```text
quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬──────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until │
├─────────┼────┼──────────────────┼────────────────┼──────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 0              │ null         │
└─────────┴────┴──────────────────┴────────────────┴──────────────┘

quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ curl -i -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"WrongPass1!"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 37
ETag: W/"25-3YG4LRpkIFolV4uVOnUIRm2hZA0"
Date: Sun, 18 Oct 2026 17:05:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Invalid email or password"}

quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬──────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until │
├─────────┼────┼──────────────────┼────────────────┼──────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 2              │ null         │
└─────────┴────┴──────────────────┴────────────────┴──────────────┘
```

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js`
- **Line Numbers:** Line 54
- **Flawed Code Snippet:**
```javascript
} else {
  const newAttempts = user.login_attempts + 2;
  let lockedUntil = null;
  if (newAttempts >= 3) {
    lockedUntil = new Date(Date.now() + 180000).toISOString();
  }
  db.run(
    "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?",
    [newAttempts, lockedUntil, user.id],
  );
  res.status(401).json({ error: "Invalid email or password" });
}
```
- **Proposed Fix:**
```javascript
} else {
  const newAttempts = user.login_attempts + 1;
  let lockedUntil = null;
  if (newAttempts >= 3) {
    lockedUntil = new Date(Date.now() + 30000).toISOString();
  }
  db.run(
    "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?",
    [newAttempts, lockedUntil, user.id],
  );
  res.status(401).json({ error: "Invalid email or password" });
}
```
