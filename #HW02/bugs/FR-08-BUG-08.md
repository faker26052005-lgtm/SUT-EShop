# FR-08-BUG-08

**Tiêu đề Issue:** `[FR-08] shipping_address lưu vết kịch bản XSS không được escape / sanitize (SEC-04 / R7)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-08 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán / Bảo mật |
| Yêu cầu SRS bị vi phạm | SEC-04 / R7: "Mọi dữ liệu từ user nhập vào khi hiển thị trên UI/API phải được escape/sanitize đúng cách, tránh đe dọa XSS Stored." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | DT-12, DT-13 (Folder B: FR-08-BUG-08a, FR-08-BUG-08b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/99 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở folder **B** -> Chọn **FR-08-BUG-08a. Checkout với shipping_address chứa script XSS** và bấm **Send**.
2. Chọn **FR-08-BUG-08b. Đọc lại đơn hàng (`GET /api/orders/my-orders`)** và bấm **Send**.

Payload gửi ở Bước 1:
```json
{
  "total_amount": 100000,
  "shipping_address": "<script>alert('XSS')</script>"
}
```

## Kết quả thực tế
Backend lưu nguyên văn chuỗi chứa thẻ `<script>` nguy hiểm vào CSDL và trả nguyên bản qua API mà không thực hiện Sanitize/Strip HTML tags. Khi giao diện Web render trực tiếp sẽ dẫn đến thực thi mã JavaScript độc hại (Stored XSS).

## Kết quả mong đợi (theo SRS)
Backend hoặc Frontend phải thực hiện Encode HTML entities hoặc Sanitize loại bỏ các thẻ script trước khi lưu trữ và phản hồi dữ liệu.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-08-xss.png`: Dữ liệu đơn hàng trả về chứa mã script chưa qua xử lý.