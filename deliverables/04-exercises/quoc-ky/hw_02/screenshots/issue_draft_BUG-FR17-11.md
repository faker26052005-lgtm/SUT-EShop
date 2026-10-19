# [BUG] [FR-17][Backend API] Endpoint POST /api/admin/coupons accepts negative max_uses_per_user (-1) with HTTP 200 OK and stores in SQLite

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-11`
- **Discovered by Test Case:** [`TC_FR17_20`](../Main_Report.md#tc_fr17_20)
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
1. Execute direct API request via curl with `max_uses_per_user = -1`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"NEGUSES2","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":-1}'
   ```
2. Inspect HTTP status code and response body.
3. Query database table `coupons` for the created coupon:
   ```bash
   node -e "const sqlite3 = require('./backend/node_modules/sqlite3'); const db = new sqlite3.Database('./backend/database.sqlite'); db.all('SELECT id, code, max_uses_per_user FROM coupons WHERE code=\"NEGUSES2\"', (err, rows) => console.log(rows));"
   ```
4. Note that while the Admin Web UI has HTML5 `min="1"` preventing form submission in the browser, the Backend REST API completely lacks validation and allows client bypass.

### 4. Test Data / Payload
```json
{
  "code": "NEGUSES2",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": -1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `max_uses_per_user` (>= 1)..."
- In equivalence partitioning, negative values belong to the Invalid Equivalence Partition (`EP-17-33`).
- The backend API must validate `Number(max_uses_per_user) >= 1` and reject negative values with **`HTTP 400 Bad Request`** (`{"error": "Số lần sử dụng tối đa mỗi người phải từ 1 trở lên"}`).
- No coupon with a negative `max_uses_per_user` must be created in the database.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/admin/coupons` accepts the invalid payload and returns **`HTTP 200 OK`**: `{"message":"Coupon created","id":12}`.
- SQLite database persists the row with `max_uses_per_user = -1`.
- Because `-1` is truthy in JavaScript, the fallback `max_uses_per_user || 1` retains `-1` directly into the SQL query without any validation.
- Having a negative usage limit breaks business logic during checkout when comparing user usage counts against the maximum limit.

### 7. Evidence & Visual Proof
- **Admin Web UI Input -1:** `screenshots/BUG_FR17_11_form_input_neg.png`
- **Terminal Calling API with -1 and Receiving HTTP 200 OK:** `screenshots/BUG_FR17_11_api_terminal.png`
- ![Admin Web UI Input -1](./BUG_FR17_11_form_input_neg.png)
- ![Terminal Calling API with -1 and Receiving HTTP 200 OK](./BUG_FR17_11_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Line 474):
    ```javascript
    max_uses_per_user || 1,
    ```
    Lacks any validation checking if `Number(max_uses_per_user) < 1`.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    if (max_uses_per_user !== undefined && max_uses_per_user !== null && Number(max_uses_per_user) < 1) {
      return res.status(400).json({ error: "Số lần sử dụng tối đa mỗi người phải từ 1 trở lên" });
    }
    ```
