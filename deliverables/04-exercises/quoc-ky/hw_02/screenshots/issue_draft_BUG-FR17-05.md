# [BUG] [FR-17][Admin Web & API] Coupon creation accepts discount_value = 0 and creates 0% discount coupon in database

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-05`
- **Discovered by Test Case:** [`TC_FR17_14`](../Main_Report.md#tc_fr17_14)
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
   - Mã coupon: `PCTZERO`
   - Loại: `Phần trăm (%)`
   - Giá trị: `0`
   - Đơn tối thiểu: `100000`
   - Ngày hết hạn: `10/21/2026`
   - Giới hạn/người: `1`
4. Click **"Tạo mã"** button.
5. Alternatively, execute direct API request via curl:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"PCTZERO0","type":"percent","discount_value":0,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
6. Inspect the coupon table below and the SQLite database.

### 4. Test Data / Payload
```json
{
  "code": "PCTZERO",
  "type": "percent",
  "discount_value": 0,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `discount_value` (dương)..."
- In mathematics and ISTQB boundary value analysis, "dương" (positive) strictly means $V > 0$.
- Form input must enforce `min="1"` for percent discounts.
- Backend API must reject requests with `discount_value <= 0` with `HTTP 400 Bad Request` (`{"error": "Giá trị giảm giá phải lớn hơn 0"}`).
- No coupon with 0 discount value must be inserted into the database.

### 6. Actual Result (Observed on SUT)
- Admin Web UI allows submitting `0` because input tag lacks `min="1"` validation attribute.
- Form submits successfully, and a new row appears in the management table with `Giá trị: 0%`.
- Endpoint `POST /api/admin/coupons` returns `HTTP 200 OK` (`{"message":"Coupon created","id":22}`).
- SQLite database persists the row with `discount_value = 0`, violating the explicit positivity requirement in the SRS.

### 7. Evidence & Visual Proof
- **Form Input Zero Value:** `screenshots/BUG_FR17_05_form_input_zero.png`
- **Table Displaying 0% Coupon:** `screenshots/BUG_FR17_05_table_zero_pct.png`
- **Terminal API 200 OK:** `screenshots/BUG_FR17_05_api_terminal.png`
- ![Form Input Zero Value](./BUG_FR17_05_form_input_zero.png)
- ![Table Displaying 0% Coupon](./BUG_FR17_05_table_zero_pct.png)
- ![Terminal API 200 OK](./BUG_FR17_05_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-admin/src/App.jsx` (Lines 665–675):
    ```jsx
    <input
      placeholder={
        couponForm.type === "percent"
          ? "Giá trị % (VD: 10)"
          : "Số tiền (VD: 50000)"
      }
      type="number"
      className="border p-2 rounded"
      value={couponForm.discount_value}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          discount_value: e.target.value,
        })
      }
      required
    />
    ```
    Lacks `min="1"` attribute.
  - `backend/server.js` (Lines 457–481):
    Blindly executes SQL insert without checking `Number(discount_value) > 0`.
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
