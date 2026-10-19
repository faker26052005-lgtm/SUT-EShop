# [BUG] [FR-07][Web UI / API] Quantity zero (0) accepted, rendering zero-priced item and 200 OK

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-05`
- **Discovered by Test Case:** [`TC_FR07_05`](../Main_Report.md#tc_fr07_05)
- **Feature / Subsystem:** Shopping Cart (`FR-07` / Web UI & Backend REST API)
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
- Product ID 1 (`iPhone 15 Pro Max`) exists in SQLite database.

### 3. Steps to Reproduce
1. Open browser and access `http://localhost:5173/product/1`.
2. Clear the quantity input field and enter `0` (Boundary Off-point).
3. Click **"Thêm vào giỏ hàng"** (click twice if initial click was ignored).
4. Navigate to the cart page: `http://localhost:5173/cart`.
5. Observe the quantity and subtotal rendered in the cart table.
6. (API Verification):
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": 0}'
   ```

### 4. Test Data / Payload
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": 0
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-06 & FR-07:*
> "Số lượng sản phẩm trong giỏ hàng phải là số nguyên dương, tối thiểu là 1 ($Q \ge 1$)."
- Web UI input must enforce `min="1"` to block entering 0, or auto-revert to 1, or prompt confirmation dialog to delete.
- API `POST /api/cart` must reject `quantity = 0` with HTTP `400 Bad Request` (`{"error": "Quantity must be greater than or equal to 1"}`).
- The cart table must never render or store a line item with quantity 0 or subtotal 0 ₫.

### 6. Actual Result (Observed on SUT)
- `ProductDetail.jsx` allows entering `0` in the input without validation or `min="1"` attribute.
- Submitting adds the item to the cart, and `/cart` renders the row with:
  - `Số lượng: 0`
  - `Thành tiền: 0 ₫`
  - `Tổng tạm tính: 0 ₫`
- Calling `POST /api/cart` with `quantity: 0` returns HTTP `200 OK` (`{"message":"Added to cart"}`).
- Moreover, `/cart` renders static text `<td>{item.quantity}</td>` with no input field or `+/-` buttons to adjust quantity in-cart.

### 7. Evidence & Visual Proof
- **Web UI Inputting Q=0:** `screenshots/BUG_FR07_05_input_zero.png`  
  ![Nhập số lượng 0 trên trang chi tiết](./BUG_FR07_05_input_zero.png)
- **Web UI Cart Table with Q=0 and 0 ₫:** `screenshots/BUG_FR07_05_cart_zero.png`  
  ![Giỏ hàng lưu số lượng 0 và thành tiền 0đ](./BUG_FR07_05_cart_zero.png)
- **API Terminal Execution Log (200 OK):** `screenshots/BUG_FR07_05_api_terminal.png`  
  ![Terminal POST /api/cart với quantity=0 trả về 200 OK](./BUG_FR07_05_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/ProductDetail.jsx` (Lines 56–62): Input does not enforce `min="1"`.
  - `frontend-web/src/pages/Cart.jsx` (Line 47): Renders static text without adjustment controls.
  - `backend/server.js` (Lines 290–295): Missing quantity validation ($Q \ge 1$).
- **Proposed Fix:**
  - In `ProductDetail.jsx`: Add `min="1"` and check `parseInt(quantity) >= 1`:
    ```jsx
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
      className="border p-2 w-20 rounded"
    />
    ```
  - In `backend/server.js`: Reject `quantity < 1`:
    ```javascript
    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    ```
