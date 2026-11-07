# [Checkout] Ô tổng tiền thanh toán cho phép người dùng tự do chỉnh sửa và nhận các giá trị biên/phi số

**Checklist item:** `CHCK-IA02-03`  
**Interface Aspect:** `IA-02` (Data validation (EP/BVA boundaries))  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Blocker  

## Steps to reproduce
1. Truy cập trang /checkout với đơn hàng 28,000,000 ₫.
2. Nhấp vào ô "Tổng tiền thanh toán (VND):", xóa giá trị mặc định.
3. Lần lượt gõ các giá trị: 0, -500000, 28000000.5, 999999999999, "abc".
4. Quan sát phản ứng của ô nhập liệu.

## Expected result
Ô không đổi giá trị, vẫn giữ nguyên `28,000,000 ₫`

## Actual result
- Chrome: Lỗi nghiệp vụ nghiêm trọng: Ô tổng tiền không ở chế độ chỉ đọc, cho phép người dùng tự do nhập các giá trị 0, số âm, số thập phân và tràn số
- Firefox: Lỗi nghiệp vụ: Ô tổng tiền không ở chế độ chỉ đọc, Firefox vẫn cho phép người dùng tự do nhập các giá trị 0, số âm, số thập phân và tràn số
- Safari: Lỗi nghiệp vụ: Ô tổng tiền không ở chế độ chỉ đọc, WebKit vẫn cho phép người dùng tự do nhập các giá trị 0, số âm, số thập phân và tràn số

## Evidence
![CHCK-IA02-03 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-03_Chrome.png?raw=true)

![CHCK-IA02-03 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-03_Firefox.png?raw=true)

![CHCK-IA02-03 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA02-03_Safari.png?raw=true)

