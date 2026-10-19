# [BUG] [FR-07][Web UI] Empty cart state lacks required illustration image/graphic specified in SRS FR-07

### 1. Defect Metadata
- **Bug ID:** `BUG-FR07-12`
- **Discovered by Test Case:** [`TC_FR07_17`](../Main_Report.md#tc_fr07_17)
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
- Cart is completely empty ($Items = 0$).

### 3. Steps to Reproduce
1. Open browser and access `http://localhost:5173/cart`.
2. Observe the layout and components rendered in the empty cart state.
3. Check for the presence of an illustration image or SVG graphic.

### 4. Test Data / Payload
- Cart State: $Items = 0$ (Empty)

### 5. Expected Result (Authoritative SRS Citation)
> *Quote from SRS FR-07 (Item 6):*
> "Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng."
- The empty cart view must render a prominent visual illustration (an `<img>` or `<svg>` representing an empty shopping cart or basket) alongside the clear text notification and return link.

### 6. Actual Result (Observed on SUT)
- In `frontend-web/src/pages/Cart.jsx` (Lines 20–27), the component renders only two text lines (`<h2>` and `<Link>`) inside a blank white container.
- Completely lacks any illustration image or icon, violating the explicit UI design requirement of SRS FR-07.

### 7. Evidence & Visual Proof
- **Empty Cart UI Lacking Illustration Image:** `screenshots/BUG_FR07_12_empty_cart_no_illustration.png`  
  ![Trang giỏ hàng trống chỉ có text thuần thiếu hình minh họa](./BUG_FR07_12_empty_cart_no_illustration.png)

### 8. Root Cause Analysis (Code Inspection)
- **Suspect Files:**
  - `frontend-web/src/pages/Cart.jsx` (Lines 20–27):
    ```jsx
    if (cart.length === 0) {
      return (
        <div className="text-center mt-10">
          <h2 className="text-2xl mb-4">Giỏ hàng của bạn đang trống</h2>
          <Link to="/" className="text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
        </div>
      );
    }
    ```
- **Analysis:**
  - The developer omitted the visual graphic asset in the empty state condition.
- **Proposed Fix:**
  - Add an illustration asset (e.g. SVG or image) to enhance user experience and fulfill SRS requirements:
    ```jsx
    if (cart.length === 0) {
      return (
        <div className="text-center mt-10 flex flex-col items-center">
          <img
            src="/empty-cart.svg"
            alt="Giỏ hàng trống"
            className="w-48 h-48 mb-4 opacity-75"
          />
          <h2 className="text-2xl mb-4 font-semibold text-gray-700">Giỏ hàng của bạn đang trống</h2>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Tiếp tục mua sắm
          </Link>
        </div>
      );
    }
    ```
