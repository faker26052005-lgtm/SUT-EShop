# [BUG] [FR-20][Backend API] Endpoint PUT /api/orders/:id/cancel allows customer to cancel orders in 'shipping' status

### 1. Defect Metadata
- **Bug ID:** `BUG-FR20-01`
- **Discovered by Test Case:** [`TC_MOB_05`](../Main_Report.md#tc_mob_05)
- **Feature / Subsystem:** Order State Machine & Cancellation (`FR-10`, `FR-20`)
- **Severity:** `Critical` (State Machine Invariant Violation / Core Business Logic Bypass)
- **Priority:** `High (P1)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend running on `http://localhost:3000`.
- In `orders` table, order `id = 103` exists with `user_id = 1` and `status = 'shipping'`.
- User 1 credentials logged in with valid JWT token.

### 3. Steps to Reproduce
1. Log in via `POST /api/login` with User 1 credentials (`admin@eshop.com` / `Admin123!`) to obtain JWT token.
2. Query SQLite DB to verify order 103 is currently in `shipping` status:
   ```bash
   SELECT id, user_id, status FROM orders WHERE id = 103;
   ```
3. Send an HTTP PUT request to cancel order 103 directly via API:
   ```bash
   curl -i -X PUT http://localhost:3000/api/orders/103/cancel \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{}'
   ```
4. Observe the HTTP response status code and JSON body.
5. Re-query SQLite DB to check order 103 status:
   ```bash
   SELECT id, user_id, status FROM orders WHERE id = 103;
   ```

### 4. Test Data / Payload
- Target URL: `PUT http://localhost:3000/api/orders/103/cancel`
- Headers: `Authorization: Bearer <user1_jwt>`, `Content-Type: application/json`
- Body: `{}`

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from `specs/system_requirements_specification.md` (FR-10 Order State Machine & FR-20 Mobile Order Tracking):*
> "Khi đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy — chỉ Admin mới có thể thao tác."
- API Layer: Return HTTP Status **`400 Bad Request`** with error message such as `{"error": "Cannot cancel this order."}`.
- Database Layer: `orders.status` for `id = 103` **must strictly remain `'shipping'`**.

### 6. Actual Result (Observed on SUT)
- API accepts the cancellation request and returns HTTP **`200 OK`**:
  ```json
  {"message": "Order canceled successfully"}
  ```
- Database Layer: `orders.status` for `id = 103` is mutated from `'shipping'` to **`'canceled'`**.

### 7. Evidence & Visual Proof
- **Terminal API & DB Verification Screenshot:** `deliverables/04-exercises/quoc-ky/hw_02/screenshots/BUG_FR20_01_actual.png`
- ![Terminal Execution Proof](./BUG_FR20_01_actual.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect File:** `backend/server.js` (Lines 328–331):
  ```javascript
  // Lẽ ra phải là: if (order.status !== 'pending' && order.status !== 'confirmed')
  if (order.status === "delivered" || order.status === "canceled") {
    return res.status(400).json({ error: "Cannot cancel this order." });
  }

  db.run(
    "UPDATE orders SET status = ? WHERE id = ?",
    ["canceled", req.params.id],
    function (err) {
      res.json({ message: "Order canceled successfully" });
    },
  );
  ```
- **Explanation:**
  The server only verifies whether `order.status` is `"delivered"` or `"canceled"`. When an order is in `"shipping"`, it slips through the condition and is updated to `"canceled"`, breaking the state machine specification.
- **Proposed Fix:**
  Change the status validation logic in `backend/server.js`:
  ```javascript
  if (order.status !== "pending" && order.status !== "confirmed") {
    return res.status(400).json({ error: "Cannot cancel this order." });
  }
  ```
