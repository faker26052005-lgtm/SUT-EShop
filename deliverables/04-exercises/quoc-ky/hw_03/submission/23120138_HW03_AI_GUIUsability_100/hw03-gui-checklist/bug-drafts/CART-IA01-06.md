# [Cart] Lệch tông màu nút Call-To-Action chính giữa Giỏ hàng và Checkout

**GitHub Issue:** [#119](https://github.com/faker26052005-lgtm/SUT-EShop/issues/119)

**Checklist item:** `CART-IA01-06`  
**Interface Aspect:** `IA-01` (Consistency across screens)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Cosmetic  

## Steps to reproduce
1. Truy cập /cart và dùng DevTools đo mã màu nền background-color của nút "Tiến hành thanh toán".
2. Nhấp vào nút để sang trang /checkout và đo mã màu nền của nút "Xác Nhận Thanh Toán".
3. So sánh hai mã màu nền của 2 nút CTA trên cùng một luồng thanh toán.

## Expected result
Hai nút cùng giá trị background-color

## Actual result
- Chrome: Màu nút CTA không nhất quán: Cart dùng bg-green-500 (#22c55e), Checkout dùng bg-green-600 (#16a34a)
- Firefox: Hai nút CTA chính lệch tông màu: Cart dùng bg-green-500 #22c55e, Checkout dùng bg-green-600 #16a34a
- Safari: Hai nút CTA chính lệch tông màu: Cart dùng bg-green-500 #22c55e, Checkout dùng bg-green-600 #16a34a

## Evidence
![CART-IA01-06 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Chrome_01.png?raw=true)

![CART-IA01-06 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Chrome_02.png?raw=true)

![CART-IA01-06 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Firefox_01.png?raw=true)

![CART-IA01-06 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Firefox_02.png?raw=true)

![CART-IA01-06 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Safari_01.png?raw=true)

![CART-IA01-06 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA01-06_Safari_02.png?raw=true)

