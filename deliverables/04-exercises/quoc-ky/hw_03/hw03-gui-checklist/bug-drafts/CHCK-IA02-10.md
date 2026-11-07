# [Checkout] Bất đồng bộ dữ liệu giữa ô tổng tiền phía trên và dòng tổng thanh toán sau khi áp mã giảm giá

**Checklist item:** `CHCK-IA02-10`  
**Interface Aspect:** `IA-02` (Control state vs. data state)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Truy cập /checkout với đơn hàng 28,000,000 ₫.
2. Nhập mã coupon "SAVE10" và bấm "Áp dụng".
3. Quan sát số tiền hiển thị tại ô nhập liệu "Tổng tiền thanh toán (VND):" phía trên và dòng "Tổng thanh toán:" bên dưới.

## Expected result
Ô "Tổng tiền thanh toán (VND):" và dòng "Tổng thanh toán:" cùng hiển thị một giá trị sau khi áp mã SAVE10

## Actual result
- Chrome: Bất đồng bộ dữ liệu: sau khi áp mã SAVE10, ô input phía trên vẫn giữ nguyên 28000000, không tự động cập nhật về số tiền sau giảm 25,200,000 ₫ đồng nhất với dòng Tổng thanh toán
- Firefox: Bất đồng bộ dữ liệu: sau khi áp mã SAVE10, ô input phía trên vẫn giữ nguyên 28000000, không tự động cập nhật về số tiền sau giảm 25,200,000 ₫ đồng nhất với dòng Tổng thanh toán
- Safari: Bất đồng bộ dữ liệu: sau khi áp mã SAVE10, ô input phía trên vẫn giữ nguyên 28000000, không tự động cập nhật về số tiền sau giảm 25,200,000 ₫ đồng nhất với dòng Tổng thanh toán

## Evidence
![CHCK-IA02-10 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-10_Chrome.png?raw=true)

![CHCK-IA02-10 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-10_Firefox.png?raw=true)

![CHCK-IA02-10 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-10_Safari.png?raw=true)

