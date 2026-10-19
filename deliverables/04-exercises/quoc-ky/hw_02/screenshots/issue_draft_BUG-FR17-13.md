# [BUG] [FR-17][Backend API] Endpoint DELETE /api/admin/coupons/:id returns HTTP 200 OK for non-existent ID 9999 instead of HTTP 404 Not Found

### 1. Defect Metadata
- **Bug ID:** `BUG-FR17-13`
- **Discovered by Test Case:** [`TC_FR17_24`](../Main_Report.md#tc_fr17_24)
- **Feature / Subsystem:** Coupon Management (`FR-17`) & Resource Management
- **Severity:** `Medium` (REST API Contract / Resource Handling Violation)
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
- Database table `coupons` does NOT contain any record with `id = 9999`.

### 3. Steps to Reproduce
1. Log in with admin credentials to obtain an admin JWT token:
   ```bash
   ADMIN_TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@eshop.com","password":"Admin123!"}' | jq -r .token)
   ```
2. Send a `DELETE` request for non-existent coupon ID `9999`:
   ```bash
   curl -i -s -X DELETE http://localhost:3000/api/admin/coupons/9999 \
     -H "Authorization: Bearer $ADMIN_TOKEN"
   ```
3. Inspect HTTP status code and response body.

### 4. Test Data / Payload
- Route: `DELETE /api/admin/coupons/9999`
- Header: `Authorization: Bearer $ADMIN_TOKEN`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-17 & API Spec §6.4):*
> "Quản trị viên có thể xóa mã giảm giá... Hệ thống phải phản hồi mã lỗi chuẩn RESTful khi tài nguyên không tồn tại."
- When deleting a non-existent resource ID, the backend API must verify `this.changes === 0` and return **`HTTP 404 Not Found`** (`{"error": "Mã giảm giá không tồn tại"}`).
- The system must not falsely claim successful deletion for resources that do not exist.

### 6. Actual Result (Observed on SUT)
- Endpoint `DELETE /api/admin/coupons/9999` fails to check `this.changes`.
- The backend responds with **`HTTP/1.1 200 OK`**: `{"message":"Coupon deleted"}`.
- False positive deletion confirmation is reported to clients when no records were deleted.

### 7. Evidence & Visual Proof
- **Terminal Proof (DELETE non-existent coupon 9999 returning HTTP 200 OK):** `screenshots/BUG_FR17_13_api_terminal.png`
- ![Terminal Proof](./BUG_FR17_13_api_terminal.png)

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
    Because SQLite returns `err = null` even when no rows match the `WHERE` clause, `this.changes` is 0. The route unconditionally returns `200 OK`.
- **Proposed Fix:**
  - In `backend/server.js`:
    ```javascript
    app.delete("/api/admin/coupons/:id", authenticateToken, (req, res) => {
      db.run("DELETE FROM coupons WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
          return res.status(404).json({ error: "Mã giảm giá không tồn tại" });
        }
        res.json({ message: "Coupon deleted" });
      });
    });
    ```
