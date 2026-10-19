# [BUG] [FR-17][Admin Web & API] Coupon creation accepts whitespace-only code and displays blank coupons in management table

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-03`
- **Discovered by Test Case:** [`TC_FR17_12`](../Main_Report.md#tc_fr17_12)
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
3. In the "Tạo mã giảm giá mới" form, enter 5 space characters `"     "` in the "Mã coupon" input field.
4. Fill out other fields with valid data (e.g. Type: Percent, Value: 15, Min order: 100000, Expired: 2026-12-31, Max uses: 1).
5. Click **"Tạo mã"** button.
6. Alternatively, execute direct API request via curl:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/admin/coupons \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $ADMIN_TOKEN" \
     -d '{"code":"     ","type":"percent","discount_value":10,"min_order_amount":100000,"expired_at":"2026-12-31","max_uses_per_user":1}'
   ```
7. Observe table rows below the form.

### 4. Test Data / Payload
```json
{
  "code": "     ",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 100000,
  "expired_at": "2026-12-31",
  "max_uses_per_user": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17):*
> "Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương)..."
- Form input and backend API must normalize inputs by trimming leading/trailing whitespace.
- Submitting a code composed solely of whitespace must be rejected with `HTTP 400 Bad Request` (`{"error": "Mã coupon không được để trống hoặc chỉ chứa khoảng trắng"}`).
- The Admin UI should display a validation error message and prevent form submission.
- No record with whitespace code must be stored in the SQLite database.

### 6. Actual Result (Observed on SUT)
- Admin Web UI allows submission because HTML5 `required` attribute checks only `length > 0` without trimming spaces.
- Endpoint `POST /api/admin/coupons` returns `HTTP 200 OK` (`{"message":"Coupon created","id":17}`).
- SQLite database persists the row with `code = '     '`.
- The Admin coupon management table renders new rows with a completely blank "Mã" column, making it impossible for administrators or customers to identify or apply the code.

### 7. Evidence & Visual Proof
- **Form Input with Whitespace:** `screenshots/BUG_FR17_03_form_whitespace.png`
- **Terminal API 200 OK:** `screenshots/BUG_FR17_03_api_terminal.png`
- **Admin Table with Blank Rows:** `screenshots/BUG_FR17_03_table_blank_row.png`
- ![Form Input with Whitespace](./BUG_FR17_03_form_whitespace.png)
- ![Terminal API 200 OK](./BUG_FR17_03_api_terminal.png)
- ![Admin Table with Blank Rows](./BUG_FR17_03_table_blank_row.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-admin/src/App.jsx` (Lines 641–646):
    ```javascript
    onChange={(e) =>
      setCouponForm({
        ...couponForm,
        code: e.target.value.toUpperCase(),
      })
    }
    ```
    Lacks trim validation before form submission.
  - `backend/server.js` (Lines 457–481):
    Directly passes `code` into SQL query without verifying `code.trim().length > 0`.
- **Proposed Fix:**
  - In `frontend-admin/src/App.jsx`:
    ```javascript
    if (!couponForm.code.trim()) {
      alert("Mã coupon không được chỉ chứa khoảng trắng!");
      return;
    }
    ```
  - In `backend/server.js`:
    ```javascript
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Mã coupon không được để trống hoặc chỉ chứa khoảng trắng" });
    }
    ```
