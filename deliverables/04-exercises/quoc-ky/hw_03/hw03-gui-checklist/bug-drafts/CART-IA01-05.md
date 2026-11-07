# [Cart] Không nhất quán ký hiệu đơn vị tiền tệ giữa Trang chủ (VND) và Giỏ hàng (₫)

**Checklist item:** `CART-IA01-05`  
**Interface Aspect:** `IA-01` (Consistency across screens)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Truy cập trang chủ / và quan sát giá sản phẩm "Samsung Galaxy S24 Ultra" (hiển thị "28,000,000 VND").
2. Thêm sản phẩm vào giỏ hàng và điều hướng sang trang giỏ hàng /cart.
3. Quan sát cột "Giá" và dòng "Tổng tạm tính:" trên giỏ hàng.

## Expected result
Đơn vị tiền tệ hiển thị cùng một ký hiệu tiền tệ trên cả hai trang

## Actual result
- Chrome: Ký hiệu tiền tệ không nhất quán: Trang chủ dùng "VND", Cart dùng "₫"
- Firefox: Không nhất quán đơn vị tiền tệ: Trang chủ hiển thị "VND", trong khi trang Cart hiển thị ký hiệu "₫"
- Safari: Không nhất quán đơn vị tiền tệ: Trang chủ hiển thị "VND", trong khi trang Cart hiển thị ký hiệu "₫"

## Evidence
![CART-IA01-05 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA01-05_Chrome.png?raw=true)

![CART-IA01-05 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA01-05_Firefox_01.png?raw=true)

![CART-IA01-05 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA01-05_Firefox_02.png?raw=true)

![CART-IA01-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA01-05_Safari_01.png?raw=true)

![CART-IA01-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA01-05_Safari_02.png?raw=true)

