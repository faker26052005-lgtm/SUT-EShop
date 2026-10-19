# [BUG] [FR-07][Backend API] Endpoint POST /api/cart accepts malformed non-numeric product ID ("abc") without validation

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-04`
- **Discovered by Test Case:** [`TC_FR07_04`](../Main_Report.md#tc_fr07_04)
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

### 3. Steps to Reproduce
1. Obtain JWT authentication token for user `test@eshop.com`:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   ```
2. Send request to `POST /api/cart` with string ID `"abc"`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": "abc", "price": 100000, "quantity": 1}'
   ```
3. Retrieve current user cart from backend:
   ```bash
   curl -s http://localhost:3000/api/cart -H "Authorization: Bearer $TOKEN"
   ```

### 4. Test Data / Payload
```json
{
  "id": "abc",
  "price": 100000,
  "quantity": 1
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from API Spec §4.2 & SRS FR-07:*
> "Validate rejection when submitting malformed product ID via API: HTTP 400 Bad Request; từ chối xử lý dữ liệu sai kiểu."
- The backend API must perform schema and type validation on the `id` field.
- The `id` must be a positive integer ($id \in \mathbb{Z}^+$).
- Requests containing non-numeric strings or invalid formats must be rejected with HTTP `400 Bad Request` (`{"error": "Invalid product ID format"}`).
- The user's cart state must not store malformed data.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/cart` returns HTTP `200 OK` (`{"message":"Added to cart"}`).
- Calling `GET /api/cart` reveals that the malformed item `{"id": "abc", "price": 100000, "quantity": 1}` is saved directly into the user's cart.
- The backend completely omits schema/type validation, allowing malformed payload to pollute state.

### 7. Evidence & Visual Proof
- **Terminal Execution Proof:** `screenshots/BUG_FR07_04_actual.png`  
  ![API POST /api/cart chấp nhận ID abc trả về 200 OK](./BUG_FR07_04_actual.png)

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
Validate that `id` is a valid positive integer before proceeding:
```javascript
app.post("/api/cart", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { id, quantity } = req.body;
  const numId = Number(id);

  if (!id || !Number.isInteger(numId) || numId <= 0) {
    return res.status(400).json({ error: "Invalid product ID format" });
  }

  db.get("SELECT id, name, price FROM products WHERE id = ?", [numId], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push({ ...product, quantity: quantity || 1 });
    res.json({ message: "Added to cart" });
  });
});
```
