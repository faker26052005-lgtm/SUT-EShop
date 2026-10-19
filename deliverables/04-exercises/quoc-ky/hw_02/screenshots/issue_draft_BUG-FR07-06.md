# [BUG] [FR-07][Web UI / API] Negative quantity (-1) accepted, producing negative subtotal and total amount

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-06`
- **Discovered by Test Case:** [`TC_FR07_06`](../Main_Report.md#tc_fr07_06)
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
2. Clear the quantity input field and enter `-1`.
3. Click **"Thêm vào giỏ hàng"**.
4. Navigate to the cart page: `http://localhost:5173/cart`.
5. Observe the quantity, subtotal, and total amount rendered in the cart.
6. (API Verification):
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": -1}'
   ```

### 4. Test Data / Payload
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": -1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-06 & FR-07:*
> "Số lượng sản phẩm trong giỏ hàng phải là số nguyên dương, tối thiểu là 1 ($Q \in \mathbb{Z}^+, Q \ge 1$)."
- Web UI input must prevent entering negative numbers (strip or reject the minus sign `-`), or auto-revert to 1 with an error warning.
- Endpoint `POST /api/cart` must reject negative quantities with HTTP `400 Bad Request` (`{"error": "Quantity must be a positive integer"}`).
- The cart must never display negative line item amounts or negative total amounts.

### 6. Actual Result (Observed on SUT)
- `ProductDetail.jsx` accepts negative quantity `-1`.
- On `/cart`, the table renders:
  - `Số lượng: -1`
  - `Thành tiền: -30,000,000 ₫`
  - `Tổng tạm tính: -30,000,000 ₫`
- Endpoint `POST /api/cart` returns HTTP `200 OK` (`{"message":"Added to cart"}`) and saves the negative quantity item into backend state.

### 7. Evidence & Visual Proof
- **Web UI Inputting Q = -1:** `screenshots/BUG_FR07_06_input_negative.png`  
  ![Nhập số lượng -1 trên trang chi tiết](./BUG_FR07_06_input_negative.png)
- **Web UI Cart Table with Negative Amount (-30tr):** `screenshots/BUG_FR07_06_cart_negative.png`  
  ![Giỏ hàng lưu số lượng -1 và thành tiền âm](./BUG_FR07_06_cart_negative.png)
- **API Terminal Execution Log (200 OK):** `screenshots/BUG_FR07_06_api_terminal.png`  
  ![Terminal POST /api/cart với quantity=-1 trả về 200 OK](./BUG_FR07_06_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/ProductDetail.jsx` (Lines 56–62): Input does not prevent negative values.
  - `backend/server.js` (Lines 290–295): Missing positive integer validation.
- **Proposed Fix:**
  - In `ProductDetail.jsx`: Enforce minimum value of 1 on change:
    ```jsx
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
      className="border p-2 w-20 rounded"
    />
    ```
  - In `backend/server.js`: Reject non-positive quantities:
    ```javascript
    const numQty = Number(quantity);
    if (!Number.isInteger(numQty) || numQty <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```
