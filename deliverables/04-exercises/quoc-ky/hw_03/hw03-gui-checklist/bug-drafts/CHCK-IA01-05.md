# [Checkout] Nút "Áp dụng" mã giảm giá có độ tương phản chữ không đạt chuẩn WCAG AA

**Checklist item:** `CHCK-IA01-05`  
**Interface Aspect:** `IA-01` (Color scheme)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Truy cập /checkout với giỏ hàng có sản phẩm.
2. Nhập mã coupon hợp lệ "SAVE10" vào ô mã giảm giá để nút "Áp dụng" chuyển sang trạng thái sáng rõ (enabled).
3. Dùng DevTools Inspect đo tỷ lệ tương phản giữa chữ trắng (#ffffff) và nền cam (#f97316 - bg-orange-500).

## Expected result
Tỷ lệ tương phản đạt tối thiểu 4.5:1 (WCAG AA)

## Actual result
- Chrome: Tỷ lệ tương phản chữ trắng trên nền cam bg-orange-500 #f97316 chỉ đạt ~2.8:1, không đạt chuẩn WCAG AA 4.5:1
- Firefox: Tab Accessibility của Firefox phát hiện lỗi tương phản: chữ trắng trên nền cam bg-orange-500 chỉ đạt ~2.94:1, vi phạm chuẩn WCAG AA tối thiểu 4.5:1
- Safari: Tỷ lệ tương phản chữ trắng trên nền cam bg-orange-500 chỉ đạt ~2.94:1, không đạt chuẩn WCAG AA tối thiểu 4.5:1

## Evidence
![CHCK-IA01-05 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-05_Chrome.png?raw=true)

![CHCK-IA01-05 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-05_Firefox.png?raw=true)

![CHCK-IA01-05 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA01-05_Safari.png?raw=true)

