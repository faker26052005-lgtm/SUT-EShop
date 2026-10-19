# [BUG] [FR-17][REST API] Endpoint POST /api/admin/coupons accepts invalid coupon type enum and creates coupon with HTTP 200 OK

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-04`
- **Discovered by Test Case:** [`TC_FR17_13`](../Main_Report.md#tc_fr17_13)
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
3. Notice that the select dropdown only provides two valid choices: *"Phần trăm (%)"* and *"Số tiền cố định (₫)"*.
4. Send a direct HTTP POST request to endpoint `/api/admin/coupons` with an invalid/unsupported enum value `type: "free_shipping"`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"FREESHIP","type":"free_shipping","discount_value":20000,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
5. Query SQLite database: `SELECT * FROM coupons WHERE code='FREESHIP';`.

### 4. Test Data / Payload
```json
{
  "code": "FREESHIP",
  "type": "free_shipping",
  "discount_value": 20000,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `type` (percent/fixed)..."
- The backend API must strictly validate the `type` field against allowed enum values `['percent', 'fixed']`.
- Submitting an unsupported enum value must be rejected with `HTTP 400 Bad Request` (`{"error": "Loại coupon không hợp lệ. Chỉ chấp nhận 'percent' hoặc 'fixed'"}`).
- No coupon record with invalid type must be stored in the database.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/admin/coupons` accepts any arbitrary string for `type` and returns `HTTP 200 OK`:
  ```json
  {
    "message": "Coupon created",
    "id": 19
  }
  ```
- SQLite database persists the coupon record with `type = 'free_shipping'`.
- In downstream coupon application logic (`/api/apply-coupon`), the calculation branches via `if (coupon.type === "percent") { ... } else { ... }`, thereby incorrectly treating unknown types as fixed discount and corrupting order financial calculations.

### 7. Evidence & Visual Proof
- **Admin UI Type Select Options:** `screenshots/BUG_FR17_04_ui_dropdown.png`
- **Terminal API 200 OK & DB Mutation:** `screenshots/BUG_FR17_04_api_terminal.png`
- ![Admin UI Type Select](./BUG_FR17_04_ui_dropdown.png)
- ![Terminal API 200 OK](./BUG_FR17_04_api_terminal.png)

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
  The server does not validate `type` against whitelist values `['percent', 'fixed']`. SQLite text columns do not enforce enum constraints unless explicitly declared as `CHECK(type IN ('percent', 'fixed'))`.
- **Proposed Fix:**
  Add enum validation guard at the top of the route handler:
  ```javascript
  const validTypes = ["percent", "fixed"];
  if (!type || !validTypes.includes(type)) {
    return res.status(400).json({ error: "Loại mã giảm giá không hợp lệ. Chỉ chấp nhận 'percent' hoặc 'fixed'" });
  }
  ```
