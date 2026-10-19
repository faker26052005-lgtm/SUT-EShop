# [BUG] [FR-17][Admin Web & API] Creating duplicate coupon code results in unhandled HTTP 500 error leaking raw SQLite constraint

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-01`
- **Discovered by Test Case:** [`TC_FR17_10`](../Main_Report.md#tc_fr17_10)
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
- Coupon with code `SAVE10` already exists in SQLite database (`coupons.code = 'SAVE10'`).

### 3. Steps to Reproduce
1. Open browser and access Admin Web: `http://localhost:5174`.
2. Navigate to tab **"Mã Giảm Giá"** (`activeTab === 'coupons'`).
3. In the "Tạo mã giảm giá mới" form, enter:
   - Mã coupon: `SAVE10` (duplicate code)
   - Loại: `Phần trăm (%)`
   - Giá trị: `15`
   - Đơn tối thiểu: `100000`
   - Ngày hết hạn: `2026-12-31`
   - Giới hạn/người: `1`
4. Click **"Tạo mã"** button.
5. Observe HTTP response status code in Network tab and browser alert popup dialog.

### 4. Test Data / Payload
```json
{
  "code": "SAVE10",
  "type": "percent",
  "discount_value": 15,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1)."
- The system must validate uniqueness of coupon code before inserting.
- If a duplicate code is submitted, API must return client error `HTTP 400 Bad Request` or `HTTP 409 Conflict` with a user-friendly error message (e.g. `{"error": "Mã giảm giá này đã tồn tại trong hệ thống"}`).
- UI should display a clean business validation message informing the admin that the code already exists.
- SUT must NEVER throw unhandled `HTTP 500 Internal Server Error` exposing raw SQLite constraint exceptions.

### 6. Actual Result (Observed on SUT)
- API endpoint `POST /api/admin/coupons` returns `HTTP 500 Internal Server Error`.
- API Response Body:
  ```json
  {
    "error": "SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code"
  }
  ```
- Admin Web UI triggers a browser alert dialog exposing raw internal SQLite exception:
  `Lỗi: SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code`
- Internal database schema and column names (`coupons.code`) are leaked to the client.

### 7. Evidence & Visual Proof
- **Admin UI Alert Screenshot:** `screenshots/BUG_FR17_01_ui.png`
- **Terminal API Execution Screenshot:** `screenshots/BUG_FR17_01_api_terminal.png`
- ![Admin UI Alert](./BUG_FR17_01_ui.png)
- ![Terminal API 500 Error](./BUG_FR17_01_api_terminal.png)

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
  The endpoint does not validate if `code` already exists in the `coupons` table prior to execution, and blindly passes SQLite callback errors into `res.status(500).json({ error: err.message })`. When a duplicate code triggers the database UNIQUE constraint, it results in an unhandled 500 error instead of a graceful 400/409 validation response.
- **Proposed Fix:**
  Check for existing code or handle `SQLITE_CONSTRAINT` cleanly:
  ```javascript
  db.get("SELECT id FROM coupons WHERE code = ?", [code], (err, row) => {
    if (err) return res.status(500).json({ error: "Lỗi hệ thống CSDL" });
    if (row) return res.status(409).json({ error: "Mã giảm giá này đã tồn tại trong hệ thống" });
    
    db.run(
      "INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)",
      [code, type, discount_value, min_order_amount, expired_at, max_uses_per_user || 1],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Coupon created", id: this.lastID });
      }
    );
  });
  ```
