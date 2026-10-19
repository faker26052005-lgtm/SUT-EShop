# [BUG] [FR-07][Web UI] Adding duplicate product creates new row instead of incrementing quantity

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-02`
- **Discovered by Test Case:** [`TC_FR07_02`](../Main_Report.md#tc_fr07_02)
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
- SUT backend running on `http://localhost:3000`.
- SUT frontend-web running on `http://localhost:5173`.
- User cart already has 1 item of product ID 1 (`iPhone 15 Pro Max`) with `quantity = 1`.

### 3. Steps to Reproduce
1. Ensure the cart already has 1 `iPhone 15 Pro Max` ($Q=1$).
2. From the home page or product detail page, perform the action to add `iPhone 15 Pro Max` into the cart a second time ($Q_{add} = 1$).
3. Navigate to the cart page: `http://localhost:5173/cart`.
4. Inspect the table rows, quantity column, and subtotal column.

### 4. Test Data / Payload
```json
{
  "product_id": 1,
  "quantity_added": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-07, Item 2):*
> "Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."
- The cart table must strictly maintain **exactly 1 row** for product ID 1 (`iPhone 15 Pro Max`).
- The Quantity column must aggregate to $Q = 1 + 1 = 2$.
- Subtotal must reflect $30.000.000 \times 2 = 60.000.000\text{ ₫}$.
- Cart Total must display $60.000.000\text{ ₫}$.

### 6. Actual Result (Observed on SUT)
- The cart table spawns a **second distinct row** for the same `iPhone 15 Pro Max`.
- Both rows display `quantity = 1` and `subtotal = 30,000,000 ₫`.
- Cart total calculates to $60.000.000\text{ ₫}$, but item rows are duplicated, violating the business rules and UX standards of SRS FR-07.

### 7. Evidence & Visual Proof
- **Before adding duplicate (1 row):** `screenshots/BUG_FR07_02_before.png`  
  ![Giỏ hàng ban đầu 1 dòng](./BUG_FR07_02_before.png)
- **After adding duplicate (Defect: 2 rows created):** `screenshots/BUG_FR07_02_actual.png`  
  ![Lỗi giỏ hàng tạo 2 dòng cho cùng sản phẩm](./BUG_FR07_02_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `frontend-web/src/context/CartContext.jsx`
- **Line Numbers:** Lines 8–10
- **Flawed Code Snippet:**
```javascript
const addToCart = (product, quantity) => {
  setCart([...cart, { ...product, quantity }]);
};
```
- **Proposed Fix:**
Check if `product.id` already exists in `cart`. If it exists, update its `quantity`; otherwise, push a new row:
```javascript
const addToCart = (product, quantity) => {
  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex > -1) {
    const newCart = [...cart];
    newCart[existingIndex].quantity += quantity;
    setCart(newCart);
  } else {
    setCart([...cart, { ...product, quantity }]);
  }
};
```
