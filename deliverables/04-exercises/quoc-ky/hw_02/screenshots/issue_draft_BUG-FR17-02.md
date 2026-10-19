# [BUG] [FR-17][REST API] Endpoint POST /api/admin/coupons accepts empty string code and creates coupon with HTTP 200 OK

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-02`
- **Discovered by Test Case:** [`TC_FR17_11`](../Main_Report.md#tc_fr17_11)
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
1. Open browser and access Admin Web: `http://localhost:5174`.
2. Navigate to tab **"Mã Giảm Giá"**.
3. Leaving "Mã coupon" empty and clicking "Tạo mã" triggers client-side HTML5 tooltip *"Please fill out this field"*.
4. Send direct HTTP request to endpoint `POST /api/admin/coupons` with empty coupon code payload `{"code": ""}` using admin JWT:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
5. Query SQLite database: `SELECT * FROM coupons WHERE code='';`.

### 4. Test Data / Payload
```json
{
  "code": "",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1)."
- The backend API must enforce server-side validation for mandatory fields.
- Submitting an empty code string `""` or omitting `code` must return client error `HTTP 400 Bad Request` with error message (e.g. `{"error": "Mã coupon không được để trống"}`).
- No coupon record with empty string code must be inserted into the SQLite database.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/admin/coupons` accepts empty string code and returns `HTTP 200 OK`.
- Response Body:
  ```json
  {
    "message": "Coupon created",
    "id": 14
  }
  ```
- SQLite database inserts a new record with `code = ''`.
- While browser UI enforces client-side HTML5 `required` attribute, the API backend completely lacks input validation, allowing bypass of validation and database pollution.

### 7. Evidence & Visual Proof
- **Admin UI Client Tooltip:** `screenshots/BUG_FR17_02_ui.png`
- **Terminal API 200 OK & DB Mutation:** `screenshots/BUG_FR17_02_api_terminal.png`
- ![Admin UI Tooltip](./BUG_FR17_02_ui.png)
- ![Terminal API 200 OK](./BUG_FR17_02_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js`
- **Line Numbers:** Lines 457–481
- **Flawed Code Snippet:**
  ```javascript
  app.post("/api/admin/coupons", authenticateToken, (req, res) => {
    const {
      code,
      type,
      discount_value,
      min_order_amount,
      expired_at,
      max_uses_per_user,
    } = req.body;
    db.run(
      "INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)",
      [
        code,
        type,
        discount_value,
        min_order_amount,
        expired_at,
        max_uses_per_user || 1,
      ],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Coupon created", id: this.lastID });
      },
    );
  });
  ```
- **Explanation:**
  The API route performs no verification on `req.body.code`. When an empty string is provided, SQLite executes the insert without complaint because the column has no `CHECK(length(code) > 0)` constraint, resulting in an invalid coupon entry.
- **Proposed Fix:**
  Add server-side validation for required fields before executing database insert:
  ```javascript
  if (!code || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Mã coupon là trường bắt buộc và không được để trống" });
  }
  ```
