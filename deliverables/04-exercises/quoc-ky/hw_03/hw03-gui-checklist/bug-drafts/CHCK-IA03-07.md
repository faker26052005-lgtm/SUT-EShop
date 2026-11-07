# [Checkout] Bấm Back sau khi đặt hàng thành công lùi về /cart vẫn còn nguyên sản phẩm cũ

**Checklist item:** `CHCK-IA03-07`  
**Interface Aspect:** `IA-03` (Window system commands (close, back))  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Thực hiện luồng mua hàng và bấm "Xác Nhận Thanh Toán" thành công (màn hình hiển thị "Thanh toán thành công!").
2. Nhấn nút Back của trình duyệt để quay lại trang trước đó.
3. Quan sát trang giỏ hàng /cart.

## Expected result
Trình duyệt chuyển hướng về trang `/cart`, không quay lại form thanh toán đã gửi

## Actual result
- Chrome: Lỗi điều hướng/nghiệp vụ: Bấm Back sau khi thanh toán thành công lùi về /cart vẫn còn nguyên sản phẩm cũ do không clearCart, có nguy cơ gửi lại đơn hàng trùng lặp
- Firefox: Lỗi điều hướng/nghiệp vụ: Bấm Back sau khi thanh toán thành công lùi về /cart vẫn còn nguyên sản phẩm cũ do không clearCart, có nguy cơ gửi lại đơn hàng trùng lặp
- Safari: Lỗi điều hướng/nghiệp vụ: Bấm Back sau khi thanh toán thành công lùi về /cart vẫn còn nguyên sản phẩm cũ do không clearCart, có nguy cơ gửi lại đơn hàng trùng lặp

## Evidence
![CHCK-IA03-07 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Chrome_01.png?raw=true)

![CHCK-IA03-07 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Chrome_02.png?raw=true)

![CHCK-IA03-07 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Chrome_03.png?raw=true)

![CHCK-IA03-07 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Firefox_01.png?raw=true)

![CHCK-IA03-07 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Firefox_02.png?raw=true)

![CHCK-IA03-07 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-07_Safari_01.png?raw=true)

