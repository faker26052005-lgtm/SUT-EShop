# FR08-BUG-02

**Tiêu đề Issue:** `[FR-08] Ô "Tổng tiền thanh toán" trên trang xác nhận đơn hàng cho phép người dùng chỉnh sửa`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR08-BUG-02 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán |
| Yêu cầu SRS bị vi phạm | FR-08: tổng tiền do hệ thống tính, người dùng không được chỉnh sửa |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | C09 (`tests/fr08-checkout.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/184 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập, thêm một sản phẩm vào giỏ, vào **Giỏ hàng** và bấm **Tiến hành thanh toán**.
2. Bấm vào ô **Tổng tiền thanh toán (VND)** và nhập giá trị khác.

## Kết quả thực tế
Ô là `<input type="number">` đang bật (enabled), có thể sửa; dòng "Tổng thanh toán" đổi theo giá trị vừa nhập. Test C09 báo `Expected: disabled, Received: enabled`.

## Kết quả mong đợi (theo SRS)
Tổng tiền chỉ hiển thị, không cho chỉnh sửa (ô bị khóa hoặc chỉ là văn bản).

## Nguyên nhân nghi ngờ
Trong `frontend-web/src/pages/Checkout.jsx` tổng tiền là state `editableTotal` gắn vào một `<input type="number">` có `onChange`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR08-BUG-02-editable-total.png`: ô tổng tiền sau khi sửa giá trị.
- `FR08-BUG-02-test-failed.png`: test C09 fail.
