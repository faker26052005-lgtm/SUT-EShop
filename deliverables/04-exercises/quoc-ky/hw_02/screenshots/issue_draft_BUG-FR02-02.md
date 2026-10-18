# [BUG] [FR-02][Backend API / SQLite DB] Premature account lockout triggered at attempt N=2 with excessive 180s duration

### 1. Defect Metadata
- **Bug ID:** `BUG-FR02-02`
- **Discovered by Test Case:** [`TC_FR02_04`](../Main_Report.md#tc_fr02_04)
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
- User account `test@eshop.com` exists in SQLite database with `login_attempts = 1` and `locked_until = NULL` (state after 1 prior failed attempt).
- SUT backend server is running on `http://localhost:3000`.

### 3. Steps to Reproduce
1. Send a second consecutive failed login request with valid email `test@eshop.com` and invalid password `WrongPass2!`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"WrongPass2!"}'
   ```
2. Query the SQLite database to inspect `login_attempts` and `locked_until` columns:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

### 4. Test Data / Payload
```json
{
  "email": "test@eshop.com",
  "password": "WrongPass2!"
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-02, Items 2 & 3):*
> "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần đăng nhập sai liên tiếp lên đúng 1 đơn vị. Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)."
- Tại lần thử sai thứ 2 ($N=2$, điểm Off-point trước ngưỡng khóa 3):
  - HTTP Status: `401 Unauthorized` (`{"error": "Invalid email or password"}`).
  - Trong CSDL SQLite: `login_attempts` phải tăng từ `1` lên **đúng `2`** ($N=2$).
  - Trường `locked_until` phải tiếp tục giữ nguyên là `NULL` (chưa khóa tài khoản).
- Khi đạt ngưỡng khóa ($N=3$), thời hạn tạm khóa chỉ là 30 giây.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized`.
- Tuy nhiên trong CSDL SQLite:
  - `login_attempts` bị tăng vọt từ `1` lên **`3`** (do lỗi logic `+ 2`).
  - Do `newAttempts >= 3`, hệ thống kích hoạt khóa tài khoản non ngay tại lần thử thứ 2 ($N=2$).
  - Thời hạn khóa `locked_until` bị tính sai thành **180 giây** (`2026-10-18T17:38:17.793Z` so với thời điểm gửi `17:35:17 GMT`), dài gấp 6 lần quy định 30 giây của SRS.
- HTTP Status Code: `401 Unauthorized`
- Database Mutation: `login_attempts` = 3, `locked_until` = `2026-10-18T17:38:17.793Z` (+180s)

### 7. Evidence & Visual Proof
- **Screenshot:**
  ![Minh chứng lỗi](https://raw.githubusercontent.com/faker26052005-lgtm/SUT-EShop/QuocKy-HW02/deliverables/04-exercises/quoc-ky/hw_02/screenshots/BUG_FR02_02_actual.png)
  *(File cục bộ: `screenshots/BUG_FR02_02_actual.png`)*
- **Terminal / API Log:**
```text
quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬──────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until │
├─────────┼────┼──────────────────┼────────────────┼──────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 1              │ null         │
└─────────┴────┴──────────────────┴────────────────┴──────────────┘

quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ curl -i -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"WrongPass2!"}'
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 37
ETag: W/"25-3YG4LRpkIFolV4uVOnUIRm2hZA0"
Date: Sun, 18 Oct 2026 17:35:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Invalid email or password"}

quocky05@quocky-linux:~/academy/software-testing/seminar/SUT-EShop$ ~/.gemini/config/skills/test-execution-partner/scripts/db_helper.sh query "SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';"
┌─────────┬────┬──────────────────┬────────────────┬────────────────────────────┐
│ (index) │ id │ email            │ login_attempts │ locked_until               │
├─────────┼────┼──────────────────┼────────────────┼────────────────────────────┤
│ 0       │ 2  │ 'test@eshop.com' │ 3              │ '2026-10-18T17:38:17.793Z' │
└─────────┴────┴──────────────────┴────────────────┴────────────────────────────┘
```

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js`
- **Line Numbers:** Lines 54-58
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
