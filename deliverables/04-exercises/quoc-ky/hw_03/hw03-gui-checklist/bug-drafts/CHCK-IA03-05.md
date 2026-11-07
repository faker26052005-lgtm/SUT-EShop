# [Checkout] Tuyến đường /checkout thiếu Auth Guard bảo vệ, người dùng chưa đăng nhập vẫn vào thẳng form

**Checklist item:** `CHCK-IA03-05`  
**Interface Aspect:** `IA-03` (Correct destinations)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Bấm nút "Thoát" để đăng xuất tài khoản.
2. Gõ trực tiếp URL http://localhost:5173/checkout vào thanh địa chỉ trình duyệt rồi nhấn Enter.

## Expected result
Không hiển thị form thanh toán, chuyển sang `/login`

## Actual result
- Chrome: Lỗ hổng điều hướng/bảo mật: Tuyến đường /checkout không có Auth Guard bảo vệ, người dùng chưa đăng nhập gõ trực tiếp URL vẫn vào thẳng form thanh toán
- Firefox: Lỗ hổng điều hướng/bảo mật: Tuyến đường /checkout không có Auth Guard bảo vệ, người dùng chưa đăng nhập gõ trực tiếp URL vẫn vào thẳng form thanh toán trên Firefox
- Safari: Lỗ hổng điều hướng/bảo mật: Tuyến đường /checkout không có Auth Guard bảo vệ, người dùng chưa đăng nhập gõ trực tiếp URL vẫn vào thẳng form thanh toán trên WebKit

## Evidence
![CHCK-IA03-05 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-05_Chrome.png?raw=true)

![CHCK-IA03-05 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-05_Firefox.png?raw=true)

![CHCK-IA03-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-05_Safari.png?raw=true)

![CHCK-IA03-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-05_Safari_02.png?raw=true)

![CHCK-IA03-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA03-05_Safari_03.png?raw=true)

