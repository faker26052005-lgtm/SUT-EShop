# FR08-BUG-03

**Tiêu đề Issue:** `[FR-08] Giỏ hàng không được xóa sau khi thanh toán thành công`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR08-BUG-03 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán |
| Yêu cầu SRS bị vi phạm | FR-08: sau khi thanh toán thành công, giỏ hàng được xóa |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | C10 (`tests/fr08-checkout.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/185 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập, thêm 2 sản phẩm vào giỏ, vào **Giỏ hàng** và bấm **Tiến hành thanh toán**.
2. Bấm **Xác Nhận Thanh Toán** và chờ trang "Thanh toán thành công!".
3. Bấm **Quay lại trang chủ**, rồi bấm **Giỏ hàng** trên header.

## Kết quả thực tế
Giỏ hàng vẫn còn sản phẩm đã thanh toán, dòng "Giỏ hàng của bạn đang trống" không xuất hiện (test C10 báo không tìm thấy dòng này). Giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Giỏ hàng rỗng và hiển thị "Giỏ hàng của bạn đang trống".

## Nguyên nhân nghi ngờ
Trong `frontend-web/src/pages/Checkout.jsx`, hàm `clearCart` được lấy ra từ `useCart()` nhưng không bao giờ được gọi.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR08-BUG-03-cart-after-checkout.png`: giỏ hàng còn sản phẩm sau khi thanh toán.
- `FR08-BUG-03-test-failed.png`: test C10 fail.
