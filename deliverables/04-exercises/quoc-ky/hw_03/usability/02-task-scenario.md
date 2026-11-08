# Task Scenario and Task Components

- **Evaluated Flow:** `Product selection → Add to cart → Apply coupon → Checkout`
- **Target Platform:** Desktop Web (`http://localhost:3000`)
- **Baseline Commit:** `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`

---

## 1. Scenario Definition (Bilingual)

### English Prompt (Read to Participant):
> *"You are looking to buy a tech accessory or gadget priced at 300,000 ₫ or more for your daily study and work on the EShop store. The store has sent you a promotional discount code: `SAVE10`. Please find an item you like that meets this condition, apply your promotional code, and complete your order."*

### Vietnamese Prompt (Đọc và giao cho người tham gia):
> *"Bạn đang cần mua một món đồ công nghệ có giá từ 300.000 ₫ trở lên phục vụ học tập, làm việc trên website EShop. Cửa hàng vừa tặng bạn một mã giảm giá là `SAVE10`. Bạn hãy tìm một sản phẩm ưng ý thỏa điều kiện trên, áp dụng mã giảm giá này và tiến hành hoàn tất việc đặt hàng."*

---

## 2. Provided Scenario Data
- **Promotional Coupon Code:** `SAVE10` (offers 10% discount on orders $\ge 300,000$ ₫).
- **Product Scope & Constraint:** Any product from the store catalog with price $\ge 300,000$ ₫ (e.g., `Tai nghe AirPods Pro 2`, `Bàn phím cơ Keychron Q1`, or any smartphone/laptop) to satisfy the coupon activation threshold.
- **Payment / Confirmation:** Complete the checkout with standard delivery to finalize the purchase.

---

## 3. Task Components Table

| Component | Specification |
|---|---|
| **User Task** | Select a product priced $\ge 300,000$ ₫ from the catalog, place it in the cart, apply the promotional discount code `SAVE10`, and complete the checkout order. |
| **Machine State** | - SUT running locally on `http://localhost:3000` (backend on `http://localhost:5000`).<br>- Logged in with test user account (`test@eshop.com`).<br>- Shopping cart is empty.<br>- Coupon `SAVE10` is active in database and has zero prior uses recorded in `coupon_usage` for the test user. |
| **Successful Completion Criteria** | Order confirmation page rendered successfully displaying confirmation message ("Thanh toán thành công!" / Order ID) with the 10% discount correctly subtracted from the total. |
| **Time Benchmark** | $\le 180$ seconds (3 minutes) — *Initial baseline; to be formally calibrated based on the actual Pilot session results in Phase 5.* |

---

## 4. Problem Statement to Data Mapping

| Problem Statement | Performance Data | Preference Data | Task Component |
|---|---|---|---|
| **PS-1: Coupon Visibility & Friction**<br>Can users identify, apply, and verify coupon `SAVE10` without confusion or errors? | - Time spent on cart & coupon input<br>- Erroneous clicks or repeated submissions<br>- Coupon help requests | - Clarity probe rating<br>- Verbatim comments regarding discount feedback | Cart review and coupon entry step |
| **PS-2: Navigation & Error Recovery**<br>What UI bottlenecks or ambiguous elements impede progress between cart and confirmation? | - Total task time (seconds)<br>- Navigation errors (dead clicks, backtracking)<br>- Completion outcome (`success`, `assisted`, `fail`) | - Error recovery probe rating<br>- Speed probe rating<br>- Think-aloud frustration quotes | Item selection, cart-to-checkout transition, order confirmation |
| **PS-3: User Trust & Overall Usability**<br>Does the end-to-end purchasing process provide transparency and satisfaction ($\text{SUS} \ge 68$)? | - Unassisted completion rate (%)<br>- Frequency of monitor interventions | - 10-item SUS standardized score<br>- Trust probe feedback on pricing & summary | End-to-end checkout experience |

---

## 5. Scenario Lint Checklist

- [x] **No UI control or element names:** Does NOT say "click Add to cart", "open Giỏ hàng", "type in the input", or "press Áp dụng".
- [x] **No procedural navigation hints:** Prompts user with natural shopping intent without prescribing step 1, step 2, step 3.
- [x] **No technical jargon:** Free of technical terms like "local storage", "endpoint", "DOM element", or "form submission".
- [x] **Clear and verifiable completion criteria:** Explicitly ends at the final order confirmation state.
- [x] **Empirical test data:** Uses real active coupon `SAVE10` and real store items.

---

## 6. State Reset Procedure (Between Sessions)
To maintain strict experimental validity, the test monitor must execute this reset procedure before **every** participant session (PILOT, P01 through P07):

1. **Clear Browser Storage:**
   - In Chrome/Firefox DevTools (F12) $\rightarrow$ Application / Storage $\rightarrow$ Clear site data (Local Storage, Session Storage, Cookies).
   - Alternatively, remove the cart item key from `localStorage.removeItem('cart')` to guarantee an empty cart.

2. **Verify User Session:**
   - Navigate to `http://localhost:3000/login`.
   - Log in with test account: `test@eshop.com` / `password123` (or ensure the active session cookie for `test@eshop.com` is refreshed).
   - Verify that the Cart icon shows `0` items.

3. **Reset Database Coupon Usage & Previous Test Orders:**
   - Execute the following SQLite cleanup script on `backend/database.sqlite`:
     ```sql
     -- 1. Reset coupon usage for SAVE10 so subsequent participants can reuse it
     DELETE FROM coupon_usage WHERE coupon_id = (SELECT id FROM coupons WHERE code = 'SAVE10');

     -- 2. Clean up test orders created by the test account (cleans all orders regardless of status)
     DELETE FROM orders WHERE user_id = (SELECT id FROM users WHERE email = 'test@eshop.com');
     ```
   *(Note: EShop schema does not have a separate `order_items` table; deleting from `orders` and `coupon_usage` completely restores a pristine database state).*

4. **Sanity Verification:**
   - Open `http://localhost:3000/`.
   - Confirm product list loads normally.
   - Confirm cart drawer or page shows the empty state: *"Giỏ hàng của bạn đang trống"*.
   - Start OBS Studio / Google Meet screen and audio recording.
