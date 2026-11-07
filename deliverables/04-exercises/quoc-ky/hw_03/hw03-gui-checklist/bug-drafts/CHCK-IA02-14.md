# [Checkout] Ô nhập mã giảm giá không phản hồi khi người dùng nhấn phím Enter

**Checklist item:** `CHCK-IA02-14`  
**Interface Aspect:** `IA-02` (Control state vs. data state)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Truy cập /checkout.
2. Nhập mã coupon "SAVE10" vào ô mã giảm giá.
3. Nhấn phím Enter trên bàn phím (không dùng chuột click nút).

## Expected result
Khối kết quả giảm giá xuất hiện tương đương như khi click chuột vào nút "Áp dụng"

## Actual result
- Chrome: Ô input không nằm trong thẻ form và thiếu sự kiện onKeyDown bắt phím Enter, người dùng nhấn Enter không có phản hồi
- Firefox: Ô input không nằm trong thẻ form và thiếu sự kiện onKeyDown bắt phím Enter, người dùng nhấn Enter không có phản hồi
- Safari: Ô input không nằm trong thẻ form và thiếu sự kiện onKeyDown bắt phím Enter, người dùng nhấn Enter không có phản hồi

## Evidence
![CHCK-IA02-14 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-14_Chrome.png?raw=true)

![CHCK-IA02-14 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-14_Firefox.png?raw=true)

![CHCK-IA02-14 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-14_Safari.png?raw=true)

