# FR-08-BUG-07

**Tiêu đề Issue:** `[FR-08] Rò rỉ dữ liệu đơn hàng giữa các tài khoản người dùng khác nhau (Data Isolation)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-07 |
| Mức độ | Critical |
| Feature | FR-08 – Thanh toán / Phân quyền |
| Yêu cầu SRS bị vi phạm | FR-08 / SEC / FR-11: "Người dùng chỉ được phép truy cập và nhìn thấy danh sách đơn hàng của chính tài khoản mình." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | BL-05 (Folder B: FR-08-BUG-07a, FR-08-BUG-07b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/98 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở folder **B** -> Chọn **FR-08-BUG-07a. User 1 tạo đơn hàng mới** và bấm **Send**.
2. Đổi sang Token của `User 2`.
3. Chọn **FR-08-BUG-07b. User 2 gọi GET /api/orders/my-orders** và bấm **Send**.

## Kết quả thực tế
Response trả về danh sách đơn hàng của `User 2` chứa cả `orderId` vừa được tạo bởi `User 1` (Thiếu điều kiện lọc `WHERE user_id = ?` khi truy vấn CSDL).

## Kết quả mong đợi (theo SRS)
API `/api/orders/my-orders` phải cô lập dữ liệu theo `user_id` giải mã từ Token JWT. `User 2` hoàn toàn không thể xem được đơn hàng của `User 1`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-07-leak.png`: Response danh sách đơn hàng của User 2 xuất hiện đơn của User 1.