# [BUG] [FR-07][Web UI / API] Empty quantity accepted, corrupting cart table amounts to "NaN ₫"

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-07`
- **Discovered by Test Case:** [`TC_FR07_07`](../Main_Report.md#tc_fr07_07)
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
2. Highlight and delete all characters in the quantity input field, leaving it completely blank (`""`).
3. Click **"Thêm vào giỏ hàng"**.
4. Observe feedback on the button (changes to "Đã thêm").
5. Navigate to the cart page: `http://localhost:5173/cart`.
6. Observe the quantity, subtotal, and total amount rendered in the cart.
7. (API Verification):
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": ""}'
   ```

### 4. Test Data / Payload
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": ""
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07:*
> "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$)."
- Web UI input must enforce required validation or auto-revert to the default valid value ($Q = 1$) upon blur/submit.
- API `POST /api/cart` must reject empty or whitespace quantity with HTTP `400 Bad Request` (`{"error": "Quantity is required and cannot be empty"}`).
- The cart table calculations must never produce invalid `NaN` or `NaN ₫` displays.

### 6. Actual Result (Observed on SUT)
- `ProductDetail.jsx` allows adding an empty quantity. `parseInt("")` evaluates to `NaN`.
- On `/cart`, the cart table calculations are completely corrupted:
  - `Số lượng: NaN`
  - `Thành tiền: NaN ₫`
  - `Tổng tạm tính: NaN ₫`
- Endpoint `POST /api/cart` returns HTTP `200 OK` for both empty string `""` and whitespace string `"   "`, polluting backend state with malformed values.

### 7. Evidence & Visual Proof
- **Web UI Empty Quantity Input:** `screenshots/BUG_FR07_07_input_empty.png`  
  ![Ô số lượng bị xóa trống](./BUG_FR07_07_input_empty.png)
- **Web UI Cart Corrupted with NaN:** `screenshots/BUG_FR07_07_cart_nan.png`  
  ![Bảng giỏ hàng hiển thị NaN ₫](./BUG_FR07_07_cart_nan.png)
- **API Terminal Execution Log (200 OK):** `screenshots/BUG_FR07_07_api_terminal.png`  
  ![Terminal POST /api/cart với quantity rỗng trả về 200 OK](./BUG_FR07_07_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/ProductDetail.jsx` (Line 27): `addToCart(product, parseInt(quantity));` lacks fallback check when `quantity` is empty.
  - `backend/server.js` (Lines 290–295): Missing required field check for quantity.
- **Proposed Fix:**
  - In `ProductDetail.jsx`: Default empty inputs to 1:
    ```javascript
    const parsedQty = parseInt(quantity, 10);
    const validQty = isNaN(parsedQty) || parsedQty < 1 ? 1 : parsedQty;
    addToCart(product, validQty);
    ```
  - In `backend/server.js`: Validate presence and numeric type:
    ```javascript
    if (quantity === undefined || quantity === null || String(quantity).trim() === "") {
      return res.status(400).json({ error: "Quantity is required" });
    }
    ```
