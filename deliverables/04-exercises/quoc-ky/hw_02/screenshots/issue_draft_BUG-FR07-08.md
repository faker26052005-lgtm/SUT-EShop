# [BUG] [FR-07][Web UI / API] Decimal quantity (1.5) accepted without integer validation, silently truncated on UI and returning 200 OK on API

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-08`
- **Discovered by Test Case:** [`TC_FR07_09`](../Main_Report.md#tc_fr07_09)
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
2. Enter decimal quantity `1.5` into the quantity input field.
3. Click **"Thêm vào giỏ hàng"**.
4. Observe feedback on the button (changes to "Đã thêm").
5. Navigate to the cart page: `http://localhost:5173/cart`.
6. Observe the quantity column in the cart table (silently truncated to `1`).
7. (API Verification):
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": 1.5}'
   ```

### 4. Test Data / Payload
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": 1.5
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07:*
> "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$, $Q \in \mathbb{N}^*$)."
- Web UI input must enforce integer constraint (e.g. `step="1"`) or reject decimal entries with an explicit validation error message.
- API `POST /api/cart` must reject decimal quantities with HTTP `400 Bad Request` (`{"error": "Quantity must be a positive integer"}`).
- The system must not silently truncate decimal values without user notification or consent.

### 6. Actual Result (Observed on SUT)
- Frontend Web accepts input `1.5` and silently truncates it to `1` via `parseInt(quantity, 10)` in `ProductDetail.jsx`, misleading the user into thinking `1.5` units were added.
- Backend API endpoint `POST /api/cart` accepts `quantity: 1.5` with HTTP `200 OK` without integer validation.

### 7. Evidence & Visual Proof
- **Web UI Decimal Quantity Input (1.5):** `screenshots/BUG_FR07_08_input_decimal.png`  
  ![Ô số lượng nhập 1.5](./BUG_FR07_08_input_decimal.png)
- **Web UI Cart Table Silently Truncated to 1:** `screenshots/BUG_FR07_08_cart_truncated.png`  
  ![Bảng giỏ hàng âm thầm cắt bớt thành 1](./BUG_FR07_08_cart_truncated.png)
- **API Terminal Execution Log (200 OK with quantity 1.5):** `screenshots/BUG_FR07_08_api_terminal.png`  
  ![Terminal POST /api/cart với quantity 1.5 trả về 200 OK](./BUG_FR07_08_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/ProductDetail.jsx`: The `<input type="number">` tag lacks the `step="1"` attribute, allowing decimal input in the browser. Furthermore, `parseInt(quantity)` truncates decimals rather than rejecting them.
  - `backend/server.js` (Lines 290–295): Missing integer validation (such as `Number.isInteger()`) on the `quantity` parameter.
- **Proposed Fix:**
  - In `ProductDetail.jsx`: Add `step="1"` to the quantity input and validate integer:
    ```javascript
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      alert("Số lượng phải là số nguyên dương.");
      return;
    }
    ```
  - In `backend/server.js`:
    ```javascript
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```
