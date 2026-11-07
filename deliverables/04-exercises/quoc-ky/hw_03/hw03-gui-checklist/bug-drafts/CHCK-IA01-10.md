# [Checkout] Trùng lặp ngữ nghĩa gây khó hiểu giữa nhãn ô nhập phía trên và nhãn tóm tắt phía dưới

**Checklist item:** `CHCK-IA01-10`  
**Interface Aspect:** `IA-01` (Labels)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Truy cập trang /checkout và quan sát phần hiển thị tiền tệ.
2. So sánh nhãn của ô nhập số tiền phía trên và nhãn dòng tổng tiền chốt đơn bên dưới.

## Expected result
Không có hai nhãn khác nhau chỉ một từ cho cùng giá trị 28,000,000 ('Tổng tiền thanh toán (VND):' và 'Tổng thanh toán:')

## Actual result
- Chrome: Trùng lặp ngữ nghĩa gây khó hiểu: dòng trên đặt nhãn "Tổng tiền thanh toán (VND):", dòng dưới đặt nhãn "Tổng thanh toán: ... ₫"
- Firefox: Trùng lặp ngữ nghĩa gây khó hiểu: dòng trên ghi "Tổng tiền thanh toán (VND):", dòng dưới ghi "Tổng thanh toán: ... ₫"
- Safari: Trùng lặp ngữ nghĩa gây khó hiểu: dòng trên ghi "Tổng tiền thanh toán (VND):", dòng dưới ghi "Tổng thanh toán: ... ₫"

## Evidence
![CHCK-IA01-10 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-10_Chrome.png?raw=true)

![CHCK-IA01-10 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-10_Firefox.png?raw=true)

![CHCK-IA01-10 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-10_Safari.png?raw=true)

