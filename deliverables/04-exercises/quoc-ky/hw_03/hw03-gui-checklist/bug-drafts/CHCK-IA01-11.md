# [Checkout] Không nhất quán quy cách viết hoa giữa nhãn "Mã Giảm Giá" và "Sản phẩm:"

**Checklist item:** `CHCK-IA01-11`  
**Interface Aspect:** `IA-01` (Labels)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Cosmetic  

## Steps to reproduce
1. Truy cập trang /checkout.
2. Quan sát quy chuẩn viết hoa chữ cái đầu giữa nhãn khối coupon và nhãn danh sách sản phẩm.

## Expected result
Hai nhãn 'Mã Giảm Giá' và 'Sản phẩm:' cùng một cách viết hoa

## Actual result
- Chrome: Không nhất quán viết hoa: nhãn "Mã Giảm Giá" dùng Title Case, nhãn "Sản phẩm:" dùng Sentence case
- Firefox: Không nhất quán viết hoa: nhãn "Mã Giảm Giá" dùng Title Case, nhãn "Sản phẩm:" dùng Sentence case
- Safari: Không nhất quán viết hoa: nhãn "Mã Giảm Giá" dùng Title Case, nhãn "Sản phẩm:" dùng Sentence case

## Evidence
![CHCK-IA01-11 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-11_Chrome.png?raw=true)

![CHCK-IA01-11 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-11_Firefox.png?raw=true)

![CHCK-IA01-11 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-11_Safari.png?raw=true)

