# [BUG] [FR-17][Admin Web & API] Coupon creation accepts negative min_order_amount (-1) and persists in database

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-09`
- **Discovered by Test Case:** [`TC_FR17_18`](../Main_Report.md#tc_fr17_18)
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
   - Mã coupon: `NEGMIN`
   - Loại: `Phần trăm (%)`
   - Giá trị %: `10`
   - Đơn tối thiểu: `-1`
   - Ngày hết hạn: `10/19/2026`
   - Giới hạn/người: `1`
4. Click **"Tạo mã"** button.
5. Alternatively, execute direct API request via curl:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"NEGMIN","type":"percent","discount_value":10,"min_order_amount":-1,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
6. Inspect the coupon table below and the SQLite database.

### 4. Test Data / Payload
```json
{
  "code": "NEGMIN",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": -1,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: ... `min_order_amount` (>= 0)..."
- In boundary value analysis, $M = 0\text{ ₫}$ is the On-point and $M = -1\text{ ₫}$ is the Off-point belonging to the Invalid Equivalence Partition (`EP-17-28`, `BVA-17-06-OFF`).
- Both Admin UI and backend API must reject negative minimum order amount with `HTTP 400 Bad Request` (`{"error": "Đơn hàng tối thiểu không được âm"}`).
- The form UI should enforce `min="0"` or validate upon submission.
- No coupon with a negative `min_order_amount` must be inserted into the SQLite database.

### 6. Actual Result (Observed on SUT)
- Admin Web UI allows typing `-1` and submitting without error because the input tag lacks `min="0"` validation attribute.
- Form submits successfully, and rows appear in the management table with `Đơn tối thiểu: -1 ₫`.
- Endpoint `POST /api/admin/coupons` returns `HTTP 200 OK` (`{"message":"Coupon created","id":7}`).
- SQLite database persists the row with `min_order_amount = -1`.
- Coupon with negative minimum threshold distorts checkout qualification checks.

### 7. Evidence & Visual Proof
- **Form Input Negative Min Order:** `screenshots/BUG_FR17_09_form_input_negmin.png`
- **Table Displaying -1 ₫ Min Order:** `screenshots/BUG_FR17_09_table_negmin.png`
- **Terminal API 200 OK:** `screenshots/BUG_FR17_09_api_terminal.png`
- ![Form Input Negative Min Order](./BUG_FR17_09_form_input_negmin.png)
- ![Table Displaying -1 ₫ Min Order](./BUG_FR17_09_table_negmin.png)
- ![Terminal API 200 OK](./BUG_FR17_09_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-admin/src/App.jsx` (Lines 676–687):
    Input tag only specifies `type="number"` and lacks `min="0"`.
  - `backend/server.js` (Lines 457–481):
    Directly passes `min_order_amount` into SQL query without validating `Number(min_order_amount) >= 0`.
- **Proposed Fix:**
  - In `frontend-admin/src/App.jsx`:
    ```jsx
    min="0"
    ```
  - In `backend/server.js`:
    ```javascript
    if (min_order_amount !== undefined && min_order_amount !== null && Number(min_order_amount) < 0) {
      return res.status(400).json({ error: "Đơn hàng tối thiểu không được âm" });
    }
    ```
