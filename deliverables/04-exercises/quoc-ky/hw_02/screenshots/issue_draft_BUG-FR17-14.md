# [BUG] [FR-17][Backend API] Endpoint DELETE /api/admin/coupons/:id accepts negative ID -1 with HTTP 200 OK instead of HTTP 400/404

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-14`
- **Discovered by Test Case:** [`TC_FR17_25`](../Main_Report.md#tc_fr17_25)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & Route Parameter Validation
- **Severity:** `Medium` (REST API Contract / Input Parameter Validation Violation)
- **Priority:** `Medium (P2)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend server running on `http://localhost:3000`.
- Admin account logged in (`admin@eshop.com` / `Admin123!`).

### 3. Steps to Reproduce
1. Log in with admin credentials to obtain an admin JWT token:
   ```bash
   ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@eshop.com","password":"Admin123!"}' | jq -r .token)
   ```
2. Send a `DELETE` request with negative ID `-1`:
   ```bash
   curl -i -s -X DELETE http://localhost:3000/api/admin/coupons/-1 \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```
3. Inspect HTTP status code and response body.

### 4. Test Data / Payload
- Route: `DELETE /api/admin/coupons/-1`
- Header: `Authorization: Bearer $ADMIN_TOKEN`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17 & API Spec §6.4):*
> "Quản trị viên có thể xóa mã giảm giá... Tham số định danh tài nguyên (ID) phải là số nguyên dương."
- Relational database primary keys are positive integers ($ID \ge 1$). A negative value `:id = -1` belongs to the Invalid Equivalence Partition (`RES-17-03`).
- The backend API must validate `req.params.id` and reject negative values with **`HTTP 400 Bad Request`** (`{"error": "ID mã giảm giá không hợp lệ"}`) or **`HTTP 404 Not Found`**.
- The API must not falsely report successful deletion.

### 6. Actual Result (Observed on SUT)
- Endpoint `DELETE /api/admin/coupons/:id` completely lacks parameter validation for `:id`.
- The backend responds with **`HTTP/1.1 200 OK`**: `{"message":"Coupon deleted"}`.
- False positive deletion confirmation is returned for a nonsensical negative ID.

### 7. Evidence & Visual Proof
- **Terminal Proof (DELETE negative ID -1 returning HTTP 200 OK):** `screenshots/BUG_FR17_14_api_terminal.png`
- ![Terminal Proof](./BUG_FR17_14_api_terminal.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:**
  - `backend/server.js` (Lines 483–487):
    ```javascript
    app.delete("/api/admin/coupons/:id", authenticateToken, (req, res) => {
      db.run("DELETE FROM coupons WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Coupon deleted" });
      });
    });
    ```
    Directly passes `req.params.id` to SQLite without validating `Number(req.params.id) > 0` or checking `this.changes === 0`.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    app.delete("/api/admin/coupons/:id", authenticateToken, (req, res) => {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "ID mã giảm giá không hợp lệ" });
      }
      db.run("DELETE FROM coupons WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
          return res.status(404).json({ error: "Mã giảm giá không tồn tại" });
        }
        res.json({ message: "Coupon deleted" });
      });
    });
    ```
