# [BUG] [FR-07][Web UI] Add to cart button on Product Detail page ignores first click

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-01`
- **Discovered by Test Case:** [`TC_FR07_01`](../Main_Report.md#tc_fr07_01)
- **Feature / Subsystem:** Shopping Cart (`FR-07`)
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
- SUT frontend-web server running on `http://localhost:5173`.
- User cart is completely empty (`cart.length === 0`).
- Product ID 1 (`iPhone 15 Pro Max`) exists in SQLite database.

### 3. Steps to Reproduce
1. Open browser and access product detail page: `http://localhost:5173/product/1`.
2. Keep the default quantity as `1`.
3. Click the **"Thêm vào giỏ hàng"** button **once**.
4. Observe the button state (does not change to "Đã thêm").
5. Click on **"Giỏ hàng"** on the navbar or navigate directly to `http://localhost:5173/cart`.

### 4. Test Data / Payload
```json
{
  "product_id": 1,
  "quantity": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-07, Item 1):*
> "Hiển thị danh sách sản phẩm với các cột: Sản phẩm, Đơn giá, Số lượng (có nút +/- để chỉnh), Thành tiền, Thao tác."
- Clicking "Thêm vào giỏ hàng" on the product detail page must immediately add the product with the selected quantity to the shopping cart state.
- Button temporarily displays confirmation feedback ("Đã thêm").
- Navigating to `/cart` displays the cart table with exactly 1 row containing the product "iPhone 15 Pro Max", quantity 1, subtotal 30.000.000 ₫, and total 30.000.000 ₫.

### 6. Actual Result (Observed on SUT)
- Clicking "Thêm vào giỏ hàng" the first time performs a complete no-op (no feedback, product is not added to cart context).
- Navigating to `/cart` shows an empty cart screen with message: *"Giỏ hàng của bạn đang trống"*.
- The product is only added if the user clicks the button a second time consecutively.
- Client State: Cart remains empty `[]` after the first click.

### 7. Evidence & Visual Proof
- **Screenshot:** `screenshots/BUG_FR07_01_actual.png`
- **Observed Behavior on Browser:**
  ![Giỏ hàng trống sau khi nhấn Thêm vào giỏ hàng lần đầu](./BUG_FR07_01_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `frontend-web/src/pages/ProductDetail.jsx`
- **Line Numbers:** Lines 21–25
- **Flawed Code Snippet:**
```javascript
const handleAddToCart = () => {
  if (clickCount === 0) {
    setClickCount(1);
    return; // Không làm gì cả ở lần đầu tiên
  }

  addToCart(product, parseInt(quantity));
  setAdded(true);
  setClickCount(0); // Reset lại
  setTimeout(() => setAdded(false), 2000);
};
```
- **Proposed Fix:**
Remove the dummy `clickCount === 0` check so that `addToCart` is triggered reliably on every click:
```javascript
const handleAddToCart = () => {
  addToCart(product, parseInt(quantity));
  setAdded(true);
  setTimeout(() => setAdded(false), 2000);
};
```
