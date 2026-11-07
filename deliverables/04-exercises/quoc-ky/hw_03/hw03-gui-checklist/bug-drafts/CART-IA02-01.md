# [Cart] Tiêu điểm bàn phím bị rơi về document.body khi xóa dòng sản phẩm trong giỏ hàng

**Checklist item:** `CART-IA02-01`  
**Interface Aspect:** `IA-02` (Focus on the right object)  
**Platforms affected:** Google Chrome, Mozilla Firefox, Apple Safari (WebKit)  
**Environment:** Linux (Ubuntu x86_64), Node.js, Vite React SUT at `http://localhost:5173`  
**Severity:** Minor  

## Steps to reproduce
1. Thêm 2 sản phẩm vào giỏ hàng (Samsung Galaxy S24 Ultra và iPhone 15 Pro Max).
2. Truy cập /cart và dùng bàn phím (hoặc chuột) kích hoạt nút "Xóa" ở dòng sản phẩm đầu tiên.
3. Sau khi dòng sản phẩm bị xóa, mở DevTools Console và gõ document.activeElement để kiểm tra vị trí tiêu điểm.

## Expected result
Tiêu điểm không rơi về `<body>` (`document.activeElement` khác `BODY`)

## Actual result
- Chrome: Khi xóa sản phẩm, phần tử bị unmount làm mất tiêu điểm và document.activeElement bị rơi về document.body
- Firefox: Khi xóa sản phẩm, phần tử bị unmount làm mất tiêu điểm và document.activeElement bị rơi về document.body
- Safari: Khi xóa sản phẩm, phần tử bị unmount làm mất tiêu điểm và document.activeElement bị rơi về document.body

## Evidence
![CART-IA02-01 on Chrome](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA02-01_Chrome.png?raw=true)

![CART-IA02-01 on Firefox](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA02-01_Firefox.png?raw=true)

![CART-IA02-01 on Safari](https://github.com/faker26052005-lgtm/SUT-EShop/blob/224ce3c24112f189468b42b95357d4c6c1993e7d/evidence/screenshots/FAILED_CART-IA02-01_Safari.png?raw=true)

