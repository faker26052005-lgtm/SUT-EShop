# [BUG] [FR-07][Web UI] Cart table lacks '+' and '-' interactive buttons to adjust product quantity as specified in SRS

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-10`
- **Discovered by Test Case:** [`TC_FR07_13`](../Main_Report.md#tc_fr07_13)
- **Feature / Subsystem:** Shopping Cart (`FR-07` / Web UI)
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
- Product ID 1 (`iPhone 15 Pro Max`) has been added to the cart with quantity $Q = 2$.

### 3. Steps to Reproduce
1. Open browser and access `http://localhost:5173/product/1`.
2. Enter quantity `2` and click **"Thêm vào giỏ hàng"**.
3. Navigate to the cart page: `http://localhost:5173/cart`.
4. Inspect the **"Số lượng"** column in the cart table.
5. Attempt to find and click the `-` or `+` adjustment button to change the product quantity from 2 to 1.

### 4. Test Data / Payload
- Item: `iPhone 15 Pro Max` (ID 1)
- Initial Quantity: `2`
- Target Action: Click decrement button `-`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07 (Item 1):*
> "Giỏ hàng hiển thị danh sách sản phẩm gồm: Tên sản phẩm, Đơn giá, **Số lượng (có nút +/- để chỉnh)**, Thành tiền, và nút Xóa."
- In the "Số lượng" column, the cart table must provide interactive decrement (`-`) and increment (`+`) buttons adjacent to the quantity number.
- Clicking `-` on an item with quantity 2 must decrement the quantity to 1, updating line subtotal and cart total accordingly.

### 6. Actual Result (Observed on SUT)
- In `frontend-web/src/pages/Cart.jsx`, the "Số lượng" column renders only static text: `<td>{item.quantity}</td>`.
- There are no interactive `+` or `-` buttons anywhere in the cart table.
- Users are completely unable to adjust item quantities once added to the cart.

### 7. Evidence & Visual Proof
- **Web UI Cart Table Missing +/- Buttons:** `screenshots/BUG_FR07_10_missing_adjustment_buttons.png`  
  ![Cột Số lượng chỉ hiển thị text tĩnh không có nút +/-](./BUG_FR07_10_missing_adjustment_buttons.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/Cart.jsx` (Line 47): Renders `{item.quantity}` as static text without any interactive buttons.
  - `frontend-web/src/context/CartContext.jsx`: Lacks quantity update methods (`updateQuantity` or `increment`/`decrement`).
- **Proposed Fix:**
  - In `CartContext.jsx`, export an `updateQuantity(index, delta)` helper:
    ```javascript
    const updateQuantity = (index, delta) => {
      setCart((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
      );
    };
    ```
  - In `Cart.jsx`, replace line 47 with interactive controls:
    ```jsx
    <td className="py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(index, -1)}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(index, 1)}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
        >
          +
        </button>
      </div>
    </td>
    ```
