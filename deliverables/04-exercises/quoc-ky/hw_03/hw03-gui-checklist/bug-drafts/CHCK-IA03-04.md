# [Checkout] Thiếu Route Guard chặn giỏ hàng rỗng, cho phép truy cập và submit đơn hàng 0 sản phẩm

**Checklist item:** `CHCK-IA03-04`  
**Interface Aspect:** `IA-03` (Correct destinations)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Đăng nhập tài khoản, đảm bảo giỏ hàng hoàn toàn trống (0 sản phẩm).
2. Gõ trực tiếp URL http://localhost:5173/checkout vào thanh địa chỉ trình duyệt rồi nhấn Enter.
3. Quan sát giao diện và thử bấm nút "Xác Nhận Thanh Toán".

## Expected result
Không hiển thị form thanh toán với 0 sản phẩm

## Actual result
- Chrome: Lỗi điều hướng: Không có Route Guard chặn giỏ hàng rỗng, gõ trực tiếp URL /checkout vẫn hiển thị form thanh toán với 0 sản phẩm
- Firefox: Lỗi điều hướng: Hệ thống không có Route Guard chặn giỏ hàng rỗng, Firefox vẫn cho phép truy cập form Checkout và đặt đơn hàng khi giỏ có 0 sản phẩm
- Safari: Lỗi điều hướng: Hệ thống không có Route Guard chặn giỏ hàng rỗng, WebKit vẫn cho phép truy cập form Checkout và đặt đơn hàng khi giỏ có 0 sản phẩm

## Evidence
![CHCK-IA03-04 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-04_Chrome.png?raw=true)

![CHCK-IA03-04 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-04_Firefox.png?raw=true)

![CHCK-IA03-04 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-04_Safari.png?raw=true)

