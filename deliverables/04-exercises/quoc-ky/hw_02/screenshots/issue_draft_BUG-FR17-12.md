# [SEC-03][BUG] [FR-17][Backend API] Missing authorizeAdmin guard allows regular users (role='user') to create coupons via POST /api/admin/coupons

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-12`
- **Discovered by Test Case:** [`TC_FR17_23`](../Main_Report.md#tc_fr17_23)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & RBAC Authorization Guard
- **Severity:** `Critical` (Privilege Escalation / BOLA Security Vulnerability)
- **Priority:** `High (P0 - Security Hotspot)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend server running on `http://localhost:3000`.
- Regular user account exists with `role = 'user'` (`test@eshop.com` / `Test1234!`).

### 3. Steps to Reproduce
1. Log in with regular customer credentials (`test@eshop.com` / `Test1234!`) to obtain a JWT token where payload has `role: "user"`:
   ```bash
   USER_TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"Test1234!"}' | jq -r .token)
   ```
2. Send a `POST` request to the Admin-only route `http://localhost:3000/api/admin/coupons` using this regular user token:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $USER_TOKEN" \
     -d '{
       "code": "HACKEDD99",
       "type": "percent",
       "discount_value": 99,
       "min_order_amount": 0,
       "expired_at": "2026-12-31",
       "max_uses_per_user": 1
     }'
   ```
3. Inspect HTTP status code and response body.
4. Verify database table `coupons` to see the unauthorized coupon persisted in SQLite.

### 4. Test Data / Payload
```json
{
  "code": "HACKEDD99",
  "type": "percent",
  "discount_value": 99,
  "min_order_amount": 0,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (Mục 5.3 & SEC-03):*
> "Chỉ user có role='admin' mới được gọi API Admin... Tất cả các route quản trị `/api/admin/*` bắt buộc phải kiểm tra quyền quản trị viên."
- The endpoint `POST /api/admin/coupons` must verify that `req.user.role === 'admin'`.
- Any authenticated user without `admin` role must be rejected with **`HTTP 403 Forbidden`** (`{"error": "Forbidden: Admin access required"}`).
- No coupon must ever be inserted into the database by an unprivileged customer account.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/admin/coupons` completely omits role validation (`authorizeAdmin`).
- The backend responds with **`HTTP 200 OK`**: `{"message":"Coupon created","id":15}`.
- SQLite database persists the row `HACKEDD99` with a 99% discount created by an ordinary customer.
- **Security Impact:** Any registered user can arbitrarily generate massive discount vouchers (e.g., 99% - 100% off with 0 ₫ minimum order amount) to purchase store goods virtually for free, leading to catastrophic financial loss.

### 7. Evidence & Visual Proof
- **Terminal Proof (Regular user calling Admin API and getting HTTP 200 OK):** `screenshots/BUG_FR17_12_api_terminal.png`
- ![Privilege Escalation Terminal Proof](./BUG_FR17_12_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Line 457):
    ```javascript
    // ADMIN: CRUD Coupons
    app.post("/api/admin/coupons", authenticateToken, (req, res) => {
    ```
    Route declaration uses `authenticateToken` but forgets `authorizeAdmin` middleware (or missing role check `if (req.user.role !== 'admin')`).
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    app.post("/api/admin/coupons", authenticateToken, (req, res) => {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden: Admin access required" });
      }
      // ...
    ```
