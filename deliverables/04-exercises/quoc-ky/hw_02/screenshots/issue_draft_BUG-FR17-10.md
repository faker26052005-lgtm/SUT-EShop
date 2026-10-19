# [BUG] [FR-17][Backend API] Endpoint POST /api/admin/coupons accepts max_uses_per_user = 0 and silently coerces to 1 via falsy fallback instead of rejecting with HTTP 400

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-10`
- **Discovered by Test Case:** [`TC_FR17_19`](../Main_Report.md#tc_fr17_19)
- **Feature / Subsystem:** Coupon Management (`FR-17`)
- **Severity:** `Major`
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend server running on `http://localhost:3000`.
- SUT frontend-admin server running on `http://localhost:5174`.
- Admin account logged in (`admin@eshop.com` / `Admin123!`).

### 3. Steps to Reproduce
1. Execute direct API request via curl with `max_uses_per_user = 0`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"ZEROUSES","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":0}'
   ```
2. Inspect HTTP status code and response body.
3. Query database table `coupons` for the created coupon:
   ```bash
   node -e "const sqlite3 = require('./backend/node_modules/sqlite3'); const db = new sqlite3.Database('./backend/database.sqlite'); db.all('SELECT id, code, max_uses_per_user FROM coupons WHERE code=\"ZEROUSES\"', (err, rows) => console.log(rows));"
   ```
4. Note that while the Admin Web UI has HTML5 `min="1"` preventing form submission in the browser, the Backend REST API completely lacks validation and allows client bypass.

### 4. Test Data / Payload
```json
{
  "code": "ZEROUSES",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 0
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `max_uses_per_user` (>= 1)..."
- In boundary value analysis, $U = 1$ is the valid On-point, while $U = 0$ is the invalid Off-point belonging to the Invalid Equivalence Partition (`EP-17-32`, `BVA-17-07-OFF`).
- The backend API must validate `Number(max_uses_per_user) >= 1` and reject invalid values with **`HTTP 400 Bad Request`** (`{"error": "Số lần sử dụng tối đa mỗi người phải từ 1 trở lên"}`).
- The system must not silently mutate or coerce client input values.
- No coupon must be created in the database when an invalid payload is sent.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/admin/coupons` accepts the invalid payload and returns **`HTTP 200 OK`**: `{"message":"Coupon created","id":10}`.
- SQLite database persists the row, but with `max_uses_per_user = 1` because the backend implementation uses JavaScript's logical OR operator (`max_uses_per_user || 1`), where `0 || 1` evaluates to `1`.
- The API silently overrides client intent and bypasses data integrity contracts.

### 7. Evidence & Visual Proof
- **Admin Web UI Browser HTML5 Validation Tooltip (blocking 0):** `screenshots/BUG_FR17_10_browser_validation_tooltip.png`
- **Terminal Calling API with 0 and Receiving HTTP 200 OK:** `screenshots/BUG_FR17_10_api_terminal.png`
- ![Browser HTML5 Validation Tooltip](./BUG_FR17_10_browser_validation_tooltip.png)
- ![Terminal Calling API with 0 and Receiving 200 OK](./BUG_FR17_10_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Line 474):
    ```javascript
    max_uses_per_user || 1,
    ```
    Using `|| 1` as default value treats `0` as falsy and silently replaces it with `1`, completely bypassing validation for $U < 1$.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    if (max_uses_per_user !== undefined && max_uses_per_user !== null && Number(max_uses_per_user) < 1) {
      return res.status(400).json({ error: "Số lần sử dụng tối đa mỗi người phải từ 1 trở lên" });
    }
    ```
