# [BUG] [FR-07][Web UI] Cart footer displays incorrect label "Tổng tạm tính" instead of required "Tổng cộng" as specified in SRS FR-07

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-13`
- **Discovered by Test Case:** [`TC_FR07_18`](../Main_Report.md#tc_fr07_18)
- **Feature / Subsystem:** Shopping Cart (`FR-07` / Web UI)
- **Severity:** `Medium`
- **Priority:** `Medium (P2)`
- **Reporter:** Nguyễn Quốc Kỳ (23120138)
- **Environment:**
  - OS: Linux x86_64
  - Node.js: v24.21.0
  - SUT URLs: Web `http://localhost:5173` | Admin `http://localhost:5174` | API `http://localhost:3000`
  - Database: SQLite 3

### 2. Preconditions
- SUT backend running on `http://localhost:3000`.
- SUT frontend-web running on `http://localhost:5173`.
- Cart contains at least 1 product.

### 3. Steps to Reproduce
1. Open browser and access `http://localhost:5173/cart`.
2. Inspect the summary section at the bottom-left of the cart table.
3. Read the text label accompanying the total monetary amount.

### 4. Test Data / Payload
- UI Text Component: Cart Total Amount Label

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07 (Item 5):*
> "Tổng tiền hiển thị nhãn chính xác: **'Tổng cộng' (không phải 'Tổng tạm tính')**."
- The label must strictly read **"Tổng cộng"** (or `"Tổng cộng:"`).
- The label must not be `"Tổng tạm tính"` or `"Subtotal"`.

### 6. Actual Result (Observed on SUT)
- In `frontend-web/src/pages/Cart.jsx` (Line 63), the rendered text is explicitly `"Tổng tạm tính: "`:
  ```jsx
  <div className="text-xl font-bold">
    Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
  </div>
  ```
- This directly violates the negative constraint specified in SRS FR-07 Item 5 ("không phải 'Tổng tạm tính'").

### 7. Evidence & Visual Proof
- **Cart Footer Displaying "Tổng tạm tính:" Label:** `screenshots/BUG_FR07_13_wrong_label.png`  
  ![Nhãn tổng tiền hiển thị sai thành Tổng tạm tính](./BUG_FR07_13_wrong_label.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/Cart.jsx` (Line 63)
- **Analysis:**
  - Hardcoded string in JSX uses `"Tổng tạm tính:"` rather than adhering to SRS wording specification.
- **Proposed Fix:**
  - In `frontend-web/src/pages/Cart.jsx`, update line 63:
    ```jsx
    <div className="text-xl font-bold">
      Tổng cộng: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
    </div>
    ```
