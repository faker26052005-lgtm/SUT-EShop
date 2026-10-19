# [BUG] [FR-17][Admin Web & API] Coupon creation accepts negative discount_value and creates negative percentage coupon

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-06`
- **Discovered by Test Case:** [`TC_FR17_15`](../Main_Report.md#tc_fr17_15)
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
3. In the "Tạo mã giảm giá mới" form, enter:
   - Mã coupon: `PCTNEG`
   - Loại: `Phần trăm (%)`
   - Giá trị: `-10`
   - Đơn tối thiểu: `100000`
   - Ngày hết hạn: `10/22/2026`
   - Giới hạn/người: `1`
4. Click **"Tạo mã"** button.
5. Alternatively, execute direct API request via curl:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"PCTNEGG","type":"percent","discount_value":-10,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
6. Inspect the coupon table below and the SQLite database.

### 4. Test Data / Payload
```json
{
  "code": "PCTNEG",
  "type": "percent",
  "discount_value": -10,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `discount_value` (dương)..."
- In mathematics and ISTQB boundary analysis, positive strictly means $V > 0$. Negative values are in the Invalid Equivalence Partition.
- Both Admin UI and backend API must reject negative numbers with `HTTP 400 Bad Request` (`{"error": "Giá trị giảm giá phải lớn hơn 0"}`).
- The form UI should disallow negative input or prevent submission.
- No coupon with a negative discount value must be inserted into the SQLite database.

### 6. Actual Result (Observed on SUT)
- Admin Web UI allows typing negative numbers and submitting without error because the input tag lacks `min="1"` validation attribute.
- Form submits successfully, and a new row appears in the management table with `Giá trị: -10%`.
- Endpoint `POST /api/admin/coupons` returns `HTTP 200 OK` (`{"message":"Coupon created","id":25}`).
- SQLite database persists the row with `discount_value = -10`.
- Applying this coupon during checkout causes severe financial arithmetic distortion.

### 7. Evidence & Visual Proof
- **Form Input Negative Value:** `screenshots/BUG_FR17_06_form_input_negative.png`
- **Table Displaying -10% Coupon:** `screenshots/BUG_FR17_06_table_negative_pct.png`
- **Terminal API 200 OK:** `screenshots/BUG_FR17_06_api_terminal.png`
- ![Form Input Negative Value](./BUG_FR17_06_form_input_negative.png)
- ![Table Displaying -10% Coupon](./BUG_FR17_06_table_negative_pct.png)
- ![Terminal API 200 OK](./BUG_FR17_06_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-admin/src/App.jsx` (Lines 665–675):
    Input tag only specifies `type="number"` and lacks `min="1"`.
  - `backend/server.js` (Lines 457–481):
    Directly passes `discount_value` into SQL query without validating `Number(discount_value) > 0`.
- **Proposed Fix:**
  - In `frontend-admin/src/App.jsx`:
    ```jsx
    min={couponForm.type === "percent" ? "1" : "1000"}
    ```
  - In `backend/server.js`:
    ```javascript
    if (discount_value === undefined || discount_value === null || Number(discount_value) <= 0) {
      return res.status(400).json({ error: "Giá trị giảm giá phải lớn hơn 0" });
    }
    ```
