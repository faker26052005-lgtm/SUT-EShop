# [Cart] Giỏ hàng chỉ lưu tạm trong RAM React, nhấn F5 reload trang làm mất sạch toàn bộ sản phẩm

**GitHub Issue:** [#122](https://github.com/faker26052005-lgtm/SUT-EShop/issues/122)

**Checklist item:** `CART-IA04-03`  
**Interface Aspect:** `IA-04` (Currency of data on screen)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Thêm sản phẩm "Samsung Galaxy S24 Ultra" vào giỏ hàng.
2. Vào trang /cart và kiểm tra thấy sản phẩm và tổng tiền 28,000,000 ₫.
3. Nhấn phím F5 (hoặc nút Reload trình duyệt) để tải lại trang.

## Expected result
Danh sách sản phẩm và tổng tiền tạm tính `28,000,000 ₫` vẫn được lưu giữ, hiển thị nguyên vẹn sau khi reload

## Actual result
- Chrome: Lỗi lưu trữ state: Giỏ hàng chỉ lưu tạm trong RAM React, không lưu vào localStorage/sessionStorage, nhấn F5 reload trang làm mất sạch toàn bộ sản phẩm
- Firefox: Lỗi Currency of Data: Giỏ hàng chỉ lưu tạm trong RAM React, không lưu localStorage
- nhấn F5 trên Firefox làm mất sạch toàn bộ sản phẩm về giỏ hàng trống
- Safari: Lỗi Currency of Data: Giỏ hàng chỉ lưu tạm trong RAM React, không lưu localStorage
- nhấn F5 trên WebKit làm mất sạch toàn bộ sản phẩm về giỏ hàng trống

## Evidence
![CART-IA04-03 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Chrome_01.png?raw=true)

![CART-IA04-03 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Chrome_02.png?raw=true)

![CART-IA04-03 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Firefox_01.png?raw=true)

![CART-IA04-03 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Firefox_02.png?raw=true)

![CART-IA04-03 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Safari_01.png?raw=true)

![CART-IA04-03 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots/FAILED_CART-IA04-03_Safari_02.png?raw=true)

