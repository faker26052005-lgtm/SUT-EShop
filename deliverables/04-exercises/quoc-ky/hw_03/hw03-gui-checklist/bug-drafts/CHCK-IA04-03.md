# [Checkout] Backend tính sai công thức giảm giá mã SAVE10, số tiền chiết khấu và thành tiền hiển thị sai

**Checklist item:** `CHCK-IA04-03`  
**Interface Aspect:** `IA-04` (Success confirmation)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Major  

## Steps to reproduce
1. Thêm sản phẩm 28,000,000 ₫ vào giỏ hàng và chuyển sang /checkout.
2. Nhập mã coupon hợp lệ "SAVE10" (giảm 10%) và bấm "Áp dụng".
3. Quan sát số tiền tại dòng "Tiết kiệm:" và "Thành tiền:".

## Expected result
Xuất hiện khối thông báo màu xanh gồm 3 dòng: (1) "✅ Áp dụng thành công! Giảm 10%", (2) Tiết kiệm: 2,800,000 ₫, (3) Thành tiền: 25,200,000 ₫

## Actual result
- Chrome: Lỗi tính toán và phản hồi: Backend tính sai công thức mã SAVE10, số tiền tiết kiệm và thành tiền hiển thị sai lệch hoàn toàn, không đạt mức 25,200,000 ₫ theo yêu cầu
- Firefox: Lỗi tính toán và phản hồi: Backend tính sai công thức mã SAVE10, hiển thị số tiền tiết kiệm và thành tiền bị sai lệch hoàn toàn, không đạt mức 25,200,000 ₫ theo yêu cầu
- Safari: Lỗi tính toán và phản hồi: Backend tính sai công thức mã SAVE10, hiển thị số tiền tiết kiệm và thành tiền bị sai lệch hoàn toàn, không đạt mức 25,200,000 ₫ theo yêu cầu

## Evidence
![CHCK-IA04-03 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA04-03_Chrome.png?raw=true)

![CHCK-IA04-03 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA04-03_Firefox.png?raw=true)

![CHCK-IA04-03 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CHCK-IA04-03_Safari.png?raw=true)

