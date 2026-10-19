# [BUG] [FR-17][Checkout] Endpoint /api/apply-coupon allows negative final order amount when fixed discount exceeds order total

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-18`
- **Discovered by Test Case:** [`TC_FR17_34`](../Main_Report.md#tc_fr17_34)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & Checkout Pricing Engine (`FR-09`)
- **Severity:** `Critical` (Financial Arithmetic Underflow / Negative Payable Total / Revenue Loss)
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
- Active fixed coupon with discount value higher than order total (e.g. `BIG50K` with `discount_value = 50000`, `min_order_amount = 0`).
- Customer account `test@eshop.com` logged in.

### 3. Steps to Reproduce
1. Log in to customer web interface at `http://localhost:5173/login`.
2. Proceed to Checkout page `http://localhost:5173/checkout`.
3. Set "Tổng tiền thanh toán (VND)" to `30000`.
4. In "Mã Giảm Giá", enter `BIG50K` and click "Áp dụng" (Apply).
5. Inspect the displayed discount savings, final total, and API response payload.

### 4. Test Data / Payload
- Order total: `30,000 ₫`
- Coupon: `BIG50K` (`type="fixed"`, `discount_value=50000`, `min_order_amount=0`)
- Endpoint: `POST http://localhost:3000/api/apply-coupon`
- Payload: `{"code":"BIG50K","total_amount":30000,"user_id":2}`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-09 & FR-08 / CPN-BR-10):*
> "Tổng thanh toán sau giảm giá không bao giờ được nhỏ hơn 0 ₫. Nếu số tiền giảm lớn hơn tổng giá trị đơn hàng, số tiền giảm tối đa chỉ bằng giá trị đơn hàng và tổng thanh toán phải bằng 0 ₫."
- For an order total of `30,000 ₫` with fixed discount `50,000 ₫`:
  - Maximum applicable discount: `30,000 ₫`.
  - Final payable total: `0 ₫`.

### 6. Actual Result (Observed on SUT)
- SUT performs naive subtraction without underflow clamp:
  - Message: `✅ Áp dụng thành công! Giảm 50,000 ₫`
  - Tiết kiệm: `50,000 ₫`
  - Thành tiền: **`-20,000 ₫`**
  - Tổng thanh toán: **`-20,000 ₫`** (Negative order total!)
- API response:
  ```json
  {"success":true,"coupon_id":16,"discount_amount":50000,"final_amount":-20000,"message":"Áp dụng thành công! Giảm 50,000 ₫"}
  ```

### 7. Evidence & Visual Proof
- **Web Checkout Screenshot Proof:** `screenshots/BUG_FR17_18_actual.png`
- ![Web Checkout Proof](./BUG_FR17_18_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Lines 403–406 & 423–426):
    ```javascript
    discount_amount = coupon.discount_value;
    const final_amount = total_amount - discount_amount;
    ```
    Lacks lower bound clamping (`Math.max(0, ...)`).
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    discount_amount = Math.min(total_amount, coupon.discount_value);
    const final_amount = Math.max(0, total_amount - discount_amount);
    ```
