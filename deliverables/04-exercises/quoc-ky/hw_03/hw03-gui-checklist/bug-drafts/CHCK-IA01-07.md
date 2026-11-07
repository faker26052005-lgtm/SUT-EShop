# [Checkout] Ô "Tổng tiền thanh toán" hiển thị số thô không có dấu phân cách hàng nghìn

**Checklist item:** `CHCK-IA01-07`  
**Interface Aspect:** `IA-01` (Consistency across screens)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Thêm sản phẩm 28,000,000 ₫ vào giỏ hàng và sang trang /checkout.
2. Quan sát giá trị hiển thị bên trong ô nhập liệu "Tổng tiền thanh toán (VND):".

## Expected result
Định dạng số tiền có dấu phân cách hàng nghìn đồng nhất với Cart ("28,000,000 ₫") và dòng "Tổng thanh toán" ở Checkout

## Actual result
- Chrome: Ô input hiển thị số thô 28000000 không có dấu phân cách hàng nghìn, không đồng nhất với định dạng tiền tệ ở Cart và dòng Tổng thanh toán
- Firefox: Ô input hiển thị số thô 28000000 không có dấu phân cách hàng nghìn, không đồng nhất với định dạng tiền tệ ở Cart và dòng Tổng thanh toán
- Safari: Ô input hiển thị số thô 28000000 không có dấu phân cách hàng nghìn, không đồng nhất với định dạng tiền tệ ở Cart và dòng Tổng thanh toán

## Evidence
![CHCK-IA01-07 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-07_Chrome.png?raw=true)

![CHCK-IA01-07 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-07_Firefox.png?raw=true)

![CHCK-IA01-07 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-07_Safari.png?raw=true)

