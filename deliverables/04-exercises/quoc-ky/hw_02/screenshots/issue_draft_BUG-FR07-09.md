# [BUG] [FR-07][REST API] POST /api/cart accepts omitted or null quantity payload with 200 OK without required field validation

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-09`
- **Discovered by Test Case:** [`TC_FR07_10`](../Main_Report.md#tc_fr07_10)
- **Feature / Subsystem:** Shopping Cart (`FR-07` / Backend REST API)
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
- User authenticated with valid JWT token (`test@eshop.com`).

### 3. Steps to Reproduce
1. Obtain auth token via `POST /api/login`:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   ```
2. Send `POST /api/cart` with `quantity: null`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": null}'
   ```
3. Send `POST /api/cart` omitting the `quantity` field completely:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000}'
   ```
4. Observe HTTP response status and body.
5. Inspect cart state via `GET /api/cart`:
   ```bash
   curl -s -X GET http://localhost:3000/api/cart -H "Authorization: Bearer $TOKEN"
   ```

### 4. Test Data / Payload
```json
// Payload A (null quantity)
{
  "id": 1,
  "price": 30000000,
  "quantity": null
}

// Payload B (omitted quantity)
{
  "id": 1,
  "price": 30000000
}
```

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07:*
> "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$)."
- Backend REST API `POST /api/cart` must validate payload schema and reject missing or null `quantity` with HTTP `400 Bad Request` (`{"error": "Quantity is required and must be a positive integer"}`).
- The in-memory cart array must not be polluted with items lacking valid quantities.

### 6. Actual Result (Observed on SUT)
- Endpoint `POST /api/cart` returns HTTP `200 OK` (`{"message":"Added to cart"}`) for both `quantity: null` and omitted `quantity`.
- Inspection via `GET /api/cart` confirms both malformed objects were appended directly to `userCarts[userId]`:
  `[{"id": 1, "price": 30000000, "quantity": null}, {"id": 1, "price": 30000000}]`.

### 7. Evidence & Visual Proof
- **API Terminal Execution Log (HTTP 200 OK on null/omitted quantity):** `screenshots/BUG_FR07_09_api_terminal.png`  
  ![Terminal POST /api/cart với quantity null và khuyết quantity trả về 200 OK](./BUG_FR07_09_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `backend/server.js` (Lines 290–295):
    ```javascript
    app.post("/api/cart", authenticateToken, (req, res) => {
      const userId = req.user.id;
      if (!userCarts[userId]) userCarts[userId] = [];
      userCarts[userId].push(req.body);
      res.json({ message: "Added to cart" });
    });
    ```
- **Analysis:**
  - The endpoint directly appends `req.body` into `userCarts` without verifying whether `quantity` exists, is not null, or conforms to positive integer constraints.
- **Proposed Fix:**
  - In `backend/server.js`, add strict schema validation before appending:
    ```javascript
    const { id, quantity } = req.body;
    if (quantity === undefined || quantity === null || String(quantity).trim() === "") {
      return res.status(400).json({ error: "Quantity is required" });
    }
    const numQty = Number(quantity);
    if (!Number.isInteger(numQty) || numQty < 1) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```
