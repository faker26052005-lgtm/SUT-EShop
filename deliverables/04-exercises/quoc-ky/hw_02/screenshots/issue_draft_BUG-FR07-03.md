# [BUG] [FR-07][Backend API] Endpoint POST /api/cart accepts non-existent product ID (9999) without validation

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-03`
- **Discovered by Test Case:** [`TC_FR07_03`](../Main_Report.md#tc_fr07_03)
- **Feature / Subsystem:** Shopping Cart API (`FR-07` / Backend REST API)
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
- User account `test@eshop.com` has a valid JWT Bearer token.
- SQLite database does NOT contain any product with `id = 9999`.

### 3. Steps to Reproduce
1. Obtain JWT authentication token for user `test@eshop.com`:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   ```
2. Submit a cart insertion request with non-existent product `id = 9999`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 9999, "price": 100000, "quantity": 1}'
   ```
3. Retrieve current user cart from backend:
   ```bash
   curl -s http://localhost:3000/api/cart -H "Authorization: Bearer $TOKEN"
   ```

### 4. Test Data / Payload
```json
{
  "id": 9999,
  "price": 100000,
  "quantity": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-07, Item 1) & API Specification §4.2:*
> "Validate rejection when adding well-formed non-existent product ID."
- The backend API must verify product existence in the SQLite `products` table before modifying cart state.
- Endpoint `POST /api/cart` must reject the request with HTTP `404 Not Found` or `400 Bad Request` (`{"error": "Product not found"}`).
- The user's shopping cart must not be polluted with invalid or ghost items.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/cart` returns HTTP `200 OK` (`{"message":"Added to cart"}`).
- Calling `GET /api/cart` reveals that the non-existent product ID 9999 has been stored directly into the in-memory `userCarts` structure:
  ```json
  [..., {"id": 9999, "price": 100000, "quantity": 1}]
  ```
- Additionally, on Web UI:
  - Visiting `http://localhost:5173/product/9999` returns HTTP 200 with `{}` and renders developer raw message: `"Sản phẩm không tồn tại (Lỗi trắng trang do data rỗng)"`.
  - Visiting plural route `http://localhost:5173/products/9999` renders a completely blank page.

### 7. Evidence & Visual Proof
- **API Terminal Execution Log:** `screenshots/BUG_FR07_03_api_terminal.png`  
  ![API POST /api/cart chấp nhận ID 9999 trả về 200 OK](./BUG_FR07_03_api_terminal.png)
- **Web UI on /product/9999:** `screenshots/BUG_FR07_03_ui_actual.png`  
  ![Giao diện báo data rỗng trên /product/9999](./BUG_FR07_03_ui_actual.png)
- **Web UI on /products/9999 (Blank page):** `screenshots/BUG_FR07_03_route_plural.png`  
  ![Trắng trang trên /products/9999](./BUG_FR07_03_route_plural.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js`
- **Line Numbers:** Lines 290–295
- **Flawed Code Snippet:**
```javascript
app.post("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  if (!userCarts[userId]) userCarts[userId] = [];
  userCarts[userId].push(req.body);
  res.json({ message: "Added to cart" });
});
```
- **Proposed Fix:**
Query SQLite to ensure the product exists before accepting cart items:
```javascript
app.post("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id, quantity } = req.body;
  if (!id) return res.status(400).json({ error: "Product ID is required" });

  db.get("SELECT id, name, price FROM products WHERE id = ?", [id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push({ ...product, quantity: quantity || 1 });
    res.json({ message: "Added to cart" });
  });
});
```
