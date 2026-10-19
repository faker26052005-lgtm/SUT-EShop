# [BUG] [FR-17][Admin Web & API] Coupon creation accepts discount_value > 100% and creates 101% discount coupon

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-07`
- **Discovered by Test Case:** [`TC_FR17_16`](../Main_Report.md#tc_fr17_16)
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
   - Mã coupon: `OVER101`
   - Loại: `Phần trăm (%)`
   - Giá trị %: `101`
   - Đơn tối thiểu: `100000`
   - Ngày hết hạn: `10/31/2026`
   - Giới hạn/người: `1`
4. Click **"Tạo mã"** button.
5. Alternatively, execute direct API request via curl:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"OVER101","type":"percent","discount_value":101,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
6. Inspect the coupon table below and the SQLite database.

### 4. Test Data / Payload
```json
{
  "code": "OVER101",
  "type": "percent",
  "discount_value": 101,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `discount_value` (dương)... Tỷ lệ phần trăm giảm giá tối đa 100%."
- Mathematically and in ISTQB boundary analysis, a percentage discount cannot exceed 100% ($V \le 100\%$). An off-point of $101\%$ is an invalid equivalence partition (Conditional IEP `EP-17-19`, `BVA-17-04-OFF`).
- Both Admin UI and backend API must reject discount percentage greater than 100% with `HTTP 400 Bad Request` (`{"error": "Tỷ lệ giảm giá theo phần trăm không được vượt quá 100%"}`).
- The form UI should enforce `max="100"` or validate upon submission.
- No coupon with a percentage exceeding 100% must be inserted into the SQLite database.

### 6. Actual Result (Observed on SUT)
- Admin Web UI allows typing `101` and submitting without error because the input tag lacks `max="100"` validation attribute.
- Form submits successfully, and rows appear in the management table with `Giá trị: 101%`.
- Endpoint `POST /api/admin/coupons` returns `HTTP 200 OK` (`{"message":"Coupon created","id":5}`).
- SQLite database persists the row with `type = 'percent'` and `discount_value = 101`.
- Applying this coupon during checkout reduces the price by 101%, causing total payment distortion or negative final prices.

### 7. Evidence & Visual Proof
- **Form Input 101%:** `screenshots/BUG_FR17_07_form_input_101.png`
- **Table Displaying 101% Coupon:** `screenshots/BUG_FR17_07_table_101_pct.png`
- **Terminal API 200 OK:** `screenshots/BUG_FR17_07_api_terminal.png`
- ![Form Input 101%](./BUG_FR17_07_form_input_101.png)
- ![Table Displaying 101% Coupon](./BUG_FR17_07_table_101_pct.png)
- ![Terminal API 200 OK](./BUG_FR17_07_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-admin/src/App.jsx` (Lines 659–675):
    Input tag only specifies `type="number"` and lacks `max={couponForm.type === "percent" ? "100" : undefined}`.
  - `backend/server.js` (Lines 457–481):
    Directly passes `discount_value` into SQL query without validating `if (type === "percent" && Number(discount_value) > 100)`.
- **Proposed Fix:**
  - In `frontend-admin/src/App.jsx`:
    ```jsx
    max={couponForm.type === "percent" ? "100" : undefined}
    ```
  - In `backend/server.js`:
    ```javascript
    if (type === "percent" && Number(discount_value) > 100) {
      return res.status(400).json({ error: "Tỷ lệ giảm giá theo phần trăm không được vượt quá 100%" });
    }
    ```
