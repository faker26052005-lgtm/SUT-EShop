# FR-13-BUG-01

**Tiêu đề Issue:** `[FR-13] POST /api/checkout không validate total_amount và shipping_address, vẫn tạo đơn hàng thành công (FR-13)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-13-BUG-01 |
| Mức độ | High |
| Feature | FR-13 – Dashboard & Quản lý đơn hàng (Checkout API) |
| Yêu cầu SRS bị vi phạm | FR-13 / Đặc tả API Checkout: Các thuộc tính `total_amount` và `shipping_address` là bắt buộc và phải đúng định dạng dữ liệu |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | DT-02, DT-04, DT-05 (3 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/90 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập tài khoản User thường (`POST /api/login`) để lấy `userToken`.
2. Mở Postman, gửi request `POST /api/checkout` với Header `Authorization: Bearer <userToken>` và Body lỗi (mỗi lần một body dưới đây).
3. Đăng nhập Admin (`POST /api/login`), gửi `GET /api/admin/orders` để kiểm tra đơn hàng trong CSDL.

Body thử ở bước 2:
- **DT-02 (Thiếu `total_amount`)**: `{"shipping_address": "123 Le Loi, TP.HCM"}`
- **DT-04 (`total_amount` sai kiểu boolean)**: `{"total_amount": true, "shipping_address": "123 Le Loi, TP.HCM"}`
- **DT-05 (Thiếu `shipping_address`)**: `{"total_amount": 200000}`

## Kết quả thực tế
Server trả **HTTP 200 OK** `{"message":"Checkout successful","orderId": ...}` và vẫn tạo đơn hàng mới trong cơ sở dữ liệu:

| Ca test | Input gửi lên | Kết quả thực tế | Dữ liệu lưu trong CSDL |
| :--- | :--- | :--- | :--- |
| **DT-02** | Thiếu `total_amount` | HTTP 200 OK, orderId: 145 | Tạo đơn mới với `total_amount = null` |
| **DT-04** | `total_amount: true` | HTTP 200 OK, orderId: 147 | Tạo đơn mới với `total_amount = true` (ép kiểu/lỗi) |
| **DT-05** | Thiếu `shipping_address` | HTTP 200 OK, orderId: 148 | Tạo đơn mới với `shipping_address = null` |

## Kết quả mong đợi (theo SRS)
Server phải từ chối request với mã lỗi **4xx** (ví dụ: `400 Bad Request`) và không tạo bất kỳ đơn hàng mới nào trong CSDL.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-13-BUG-01-dt02.png`: Request DT-02 thiếu `total_amount` nhận HTTP 200 OK.
- `FR-13-BUG-01-dt05.png`: Request DT-05 thiếu `shipping_address` nhận HTTP 200 OK.
- `FR-13-BUG-01-orders.png`: `GET /api/admin/orders` thấy các đơn hàng bị thiếu/sai dữ liệu đã được tạo.

## Ghi chú
- Cùng một nguyên nhân gốc: API `POST /api/checkout` thiếu Middleware validation dữ liệu đầu vào.
- Việc cho phép tạo đơn hàng không có số tiền hoặc không có địa chỉ nhận hàng gây hỏng dữ liệu hệ thống và ảnh hưởng trực tiếp đến việc tính toán trên Dashboard.