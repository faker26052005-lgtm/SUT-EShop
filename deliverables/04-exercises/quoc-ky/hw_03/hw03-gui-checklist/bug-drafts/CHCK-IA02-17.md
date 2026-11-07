# [Checkout] Thẻ label "Mã Giảm Giá" thiếu thuộc tính htmlFor, nhấp chuột vào nhãn không kích hoạt focus

**Checklist item:** `CHCK-IA02-17`  
**Interface Aspect:** `IA-02` (Focus on the right object)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Truy cập /checkout.
2. Dùng chuột nhấp thẳng vào chữ nhãn "Mã Giảm Giá" nằm ngay phía trên ô nhập liệu.
3. Quan sát xem ô nhập có tự động nhận tiêu điểm (focus con trỏ nhấp nháy) hay không.

## Expected result
Con trỏ văn bản nhấp nháy (focus) tự động kích hoạt bên trong ô nhập mã giảm giá

## Actual result
- Chrome: Thẻ label thiếu thuộc tính htmlFor liên kết với id của input, click vào chữ nhãn không kích hoạt focus ô nhập
- Firefox: Thẻ label thiếu thuộc tính htmlFor liên kết với id của input, click vào chữ nhãn không kích hoạt focus ô nhập
- Safari: Thẻ label thiếu thuộc tính htmlFor liên kết với id của input, click vào chữ nhãn không kích hoạt focus ô nhập

## Evidence
![CHCK-IA02-17 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-17_Chrome.png?raw=true)

![CHCK-IA02-17 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-17_Firefox.png?raw=true)

![CHCK-IA02-17 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-17_Safari.png?raw=true)

