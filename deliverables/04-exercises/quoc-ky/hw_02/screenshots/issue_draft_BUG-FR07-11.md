# [BUG] [FR-07][Web UI] Delete product button executes immediate deletion without required confirmation dialog

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-11`
- **Discovered by Test Case:** [`TC_FR07_15`](../Main_Report.md#tc_fr07_15)
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
- Cart contains at least 2 products (e.g. `Samsung Galaxy S24 Ultra` and `MacBook Pro M3`).

### 3. Steps to Reproduce
1. Open browser and access `http://localhost:5173/cart`.
2. Locate the first product item in the table.
3. Click the red **"Xóa"** button.
4. Observe whether any confirmation prompt (modal or browser dialog) is displayed before the item is removed.

### 4. Test Data / Payload
- Item: `Samsung Galaxy S24 Ultra` (Price: 28,000,000 ₫)
- Action: Click "Xóa" button

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07 (Item 3):*
> "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."
- Clicking "Xóa" must display a confirmation dialog asking the user to confirm their action (e.g. *"Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"*).
- Item removal must only proceed if the user confirms the action.

### 6. Actual Result (Observed on SUT)
- In `frontend-web/src/pages/Cart.jsx`, the button's `onClick` directly invokes `removeFromCart(index)`.
- No confirmation dialog or prompt is triggered; the product disappears instantly upon click. Accidental clicks immediately destroy the user's selected cart items.

### 7. Evidence & Visual Proof
- **Before Deletion (2 Items in Cart):** `screenshots/BUG_FR07_11_before_delete.png`  
  ![Bảng giỏ hàng có 2 sản phẩm trước khi bấm Xóa](./BUG_FR07_11_before_delete.png)
- **Immediately After Clicking "Xóa" (Item vanishes without confirmation dialog):** `screenshots/BUG_FR07_11_after_delete_no_dialog.png`  
  ![Sản phẩm bị xóa ngay lập tức không có hộp thoại xác nhận](./BUG_FR07_11_after_delete_no_dialog.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/Cart.jsx` (Lines 50–55):
    ```jsx
    <button
      onClick={() => removeFromCart(index)}
      className="text-red-500 hover:text-red-700"
    >
      Xóa
    </button>
    ```
- **Analysis:**
  - The component lacks confirmation logic before calling `removeFromCart(index)`.
- **Proposed Fix:**
  - In `Cart.jsx`, add confirmation guard:
    ```jsx
    const handleDeleteItem = (index, itemName) => {
      if (window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
        removeFromCart(index);
      }
    };
    ```
    And bind to `<button onClick={() => handleDeleteItem(index, item.name)} ...>`.
