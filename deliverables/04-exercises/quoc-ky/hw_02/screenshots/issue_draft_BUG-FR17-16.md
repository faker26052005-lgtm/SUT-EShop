# [BUG] [FR-17][Checkout] Percent coupon discount calculation formula is inverted causing 10x order total increase

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-16`
- **Discovered by Test Case:** [`TC_FR17_27`](../Main_Report.md#tc_fr17_27)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & Checkout Pricing Engine (`FR-09`)
- **Severity:** `Critical` (Financial Arithmetic Defect / Negative Discount / Severe Customer Overcharge)
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
- Active percent coupon `SAVE10` (`type='percent'`, `discount_value=10`, `min_order_amount=300000`).
- Customer account `test@eshop.com` logged in with products in cart (or total 30,000,000 ₫).

### 3. Steps to Reproduce
1. Log in to customer web interface at `http://localhost:5173/login`.
2. Add an item (e.g. iPhone 15 Pro Max) to cart and proceed to Checkout (`http://localhost:5173/checkout`).
3. Set or leave total amount at `30,000,000 ₫`.
4. In "Mã Giảm Giá" (Coupon Code) input, enter `SAVE10` and click "Áp dụng" (Apply).
5. Inspect the displayed discount savings, final total, and API response payload.

### 4. Test Data / Payload
- Order total: `30,000,000 ₫`
- Coupon code: `SAVE10` (`type="percent"`, `discount_value=10`)
- Endpoint: `POST http://localhost:3000/api/apply-coupon`
- Payload: `{"code":"SAVE10","total_amount":30000000,"user_id":2}`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-09 & FR-17 / CPN-BR-01):*
> "Hệ thống hỗ trợ 2 loại mã giảm giá: Theo phần trăm (percent) và Theo số tiền cố định (fixed)... Khi áp dụng mã theo phần trăm, số tiền giảm = Tổng giá trị đơn hàng * (Phần trăm giảm / 100). Tổng thanh toán sau giảm = Tổng đơn hàng - Số tiền giảm."
- For an order total of `30,000,000 ₫` with `10%` discount:
  - Discount savings: $30{,}000{,}000 \times 10\% = 3{,}000{,}000\text{ ₫}$.
  - Final payable total: $30{,}000{,}000 - 3{,}000{,}000 = 27{,}000{,}000\text{ ₫}$.

### 6. Actual Result (Observed on SUT)
- SUT displays an inverted mathematical calculation:
  - Message: `✅ Áp dụng thành công! Giảm 10%`
  - Tiết kiệm (Savings): **`-270,000,000 ₫`** (Negative discount of 270 million VND!)
  - Thành tiền (Payable Total): **`300,000,000 ₫`** (Increased by 10x from 30M to 300M VND!)
  - Tổng thanh toán: **`300,000,000 ₫`**
- API response:
  ```json
  {"success":true,"coupon_id":1,"discount_amount":-270000000,"final_amount":300000000,"message":"Áp dụng thành công! Giảm 10%"}
  ```

### 7. Evidence & Visual Proof
- **Web Checkout Proof:** `screenshots/BUG_FR17_16_actual.png`
- ![Web Checkout Proof](./BUG_FR17_16_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Lines 398–406 & 418–425):
    ```javascript
    let discount_amount = 0;
    if (coupon.type === "percent") {
      discount_amount = Math.floor(
        total_amount * (1 - coupon.discount_value),
      );
    } else {
      discount_amount = coupon.discount_value;
    }
    const final_amount = total_amount - discount_amount;
    ```
    `coupon.discount_value` is stored as an integer `10`. The formula `total_amount * (1 - coupon.discount_value)` calculates $30{,}000{,}000 \times (1 - 10) = -270{,}000{,}000\text{ ₫}$. Subsequently, `total_amount - discount_amount` computes $30{,}000{,}000 - (-270{,}000{,}000) = 300{,}000{,}000\text{ ₫}$.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    let discount_amount = 0;
    if (coupon.type === "percent") {
      discount_amount = Math.floor(total_amount * (coupon.discount_value / 100));
    } else {
      discount_amount = coupon.discount_value;
    }
    const final_amount = Math.max(0, total_amount - discount_amount);
    ```
