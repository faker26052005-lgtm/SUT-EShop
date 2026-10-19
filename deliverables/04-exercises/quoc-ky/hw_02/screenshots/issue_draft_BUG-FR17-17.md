# [BUG] [FR-17][Checkout] Endpoint /api/apply-coupon rejects orders matching exact min_order_amount at boundary On-point

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-17`
- **Discovered by Test Case:** [`TC_FR17_30`](../Main_Report.md#tc_fr17_30)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & Checkout Validation Engine (`FR-09`)
- **Severity:** `Major` (Boundary Value / Off-by-one Defect / Business Rule C3 Violation)
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend running on `http://localhost:3000`.
- Web frontend running on `http://localhost:5173`.
- Active coupon `VIP100` (`min_order_amount = 300000`, fixed discount 100,000 ₫).
- Customer account `test@eshop.com` logged in.

### 3. Steps to Reproduce
1. Log in to customer web interface at `http://localhost:5173/login`.
2. Proceed to Checkout page `http://localhost:5173/checkout`.
3. Set "Tổng tiền thanh toán (VND)" to exactly `300000` (matching `min_order_amount = 300000`).
4. In "Mã Giảm Giá" input, enter `VIP100` and click "Áp dụng" (Apply).
5. Inspect the resulting error message and HTTP status code.

### 4. Test Data / Payload
- Total amount: `300,000 ₫`
- Coupon code: `VIP100` (`min_order_amount = 300000`)
- Endpoint: `POST http://localhost:3000/api/apply-coupon`
- Payload: `{"code":"VIP100","total_amount":300000,"user_id":2}`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-09 Điều kiện C3 & FR-17 / CPN-BR-04):*
> "Điều kiện áp dụng mã giảm giá: Tổng giá trị đơn hàng >= Giá trị đơn hàng tối thiểu (min_order_amount)."
- Boundary On-point: $Total = min\_order\_amount = 300{,}000\text{ ₫}$.
- Since $300{,}000 \ge 300{,}000$ evaluates to `true`, the coupon must be successfully applied (`HTTP 200 OK`).

### 6. Actual Result (Observed on SUT)
- SUT rejects the coupon with **`HTTP 400 Bad Request`**:
  ```json
  {"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}
  ```
- On Checkout UI, a red error is displayed: `Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này`.

### 7. Evidence & Visual Proof
- **Web Checkout Screenshot Proof:** `screenshots/BUG_FR17_17_actual.png`
- ![Web Checkout Proof](./BUG_FR17_17_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Line 379):
    ```javascript
    if (total_amount > coupon.min_order_amount) {
    ```
    The developer used strict inequality (`>`) instead of greater-than-or-equal (`>=`). When `total_amount === coupon.min_order_amount`, the condition evaluates to `false` and branches into HTTP 400 error.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    if (total_amount >= coupon.min_order_amount) {
    ```
