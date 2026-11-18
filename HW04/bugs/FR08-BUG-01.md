# FR08-BUG-01

**Tiêu đề Issue:** `[FR-08] Server lưu tổng tiền do trình duyệt gửi lên (đơn có thể bị đặt giá 0 hoặc 1 VND)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR08-BUG-01 |
| Mức độ | Critical |
| Feature | FR-08 – Thanh toán |
| Yêu cầu SRS bị vi phạm | FR-08: tổng tiền thanh toán phải bằng tổng giá trị giỏ hàng, do hệ thống tính |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | C05, C06 (`tests/fr08-checkout.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/183 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập, thêm 2 sản phẩm vào giỏ (ví dụ tổng 58000000), vào **Giỏ hàng** và bấm **Tiến hành thanh toán**.
2. Ở ô **Tổng tiền thanh toán (VND)** sửa giá trị thành `1`.
3. Bấm **Xác Nhận Thanh Toán**.
4. Xem đơn vừa tạo (mục Lịch sử đơn hàng ở trang Hồ sơ hoặc `GET /api/orders/my-orders`).

## Kết quả thực tế
Đơn được tạo với `total_amount` = 1 (và = 0 khi nhập 0), không phải giá trị giỏ hàng. Test báo `Expected: 58000000, Received: 1` và `Expected: 30000000, Received: 0`. Giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Tổng tiền của đơn luôn bằng tổng giá trị sản phẩm trong giỏ, do server tính; giá trị bị sửa phải bị bỏ qua hoặc bị từ chối.

## Nguyên nhân nghi ngờ
`POST /api/checkout` trong `backend/server.js` ghi thẳng `total_amount` lấy từ body vào bảng orders mà không tính lại.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR08-BUG-01-edited-total.png`: ô tổng tiền được sửa thành 1 trước khi thanh toán.
- `FR08-BUG-01-order.png`: đơn vừa tạo với tổng 1.
- `FR08-BUG-01-test-failed.png`: test C05 fail (`Expected: 58000000, Received: 1`).
