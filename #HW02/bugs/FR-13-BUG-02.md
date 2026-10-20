# FR-13-BUG-02

**Tiêu đề Issue:** `[FR-13] API Admin (/api/admin/orders) không kiểm tra role=admin trong Token, tài khoản user thường vẫn truy cập và sửa được dữ liệu (FR-12, SEC-03)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-13-BUG-02 |
| Mức độ | Critical |
| Feature | FR-13 – Dashboard & Quản lý đơn hàng (Phân quyền Admin) |
| Yêu cầu SRS bị vi phạm | FR-12 & SEC-03: "API Admin phải kiểm tra role = 'admin' trong Token, không chỉ kiểm tra sự tồn tại của Token." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | AC-02, AC-05 (2 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/91 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập tài khoản User thường (`role = 'user'`) qua `POST /api/login` để lấy `userToken`.
2. **AC-02 (Xem danh sách đơn hàng)**:
   - Gửi `GET /api/admin/orders` kèm Header `Authorization: Bearer <userToken>`.
3. **AC-05 (Cập nhật trạng thái đơn hàng)**:
   - Gửi `PUT /api/admin/orders/144/status` kèm Header `Authorization: Bearer <userToken>` và Body `{"status": "confirmed"}`.

## Kết quả thực tế
Server không kiểm tra claim `role` trong Token và cho phép tài khoản User thường thực hiện thành công các thao tác của Admin:

| Ca test | API Endpoint | Header Authorization | Kết quả thực tế |
| :--- | :--- | :--- | :--- |
| **AC-02** | `GET /api/admin/orders` | Token `role = 'user'` | **HTTP 200 OK**, trả về toàn bộ danh sách đơn hàng toàn hệ thống |
| **AC-05** | `PUT /api/admin/orders/144/status` | Token `role = 'user'` | **HTTP 200 OK** `{"message":"Order status updated"}`, trạng thái đơn hàng bị thay đổi |

## Kết quả mong đợi (theo SRS)
Server phải từ chối truy cập với mã lỗi **403 Forbidden** (hoặc **401 Unauthorized**) và giữ nguyên dữ liệu đơn hàng trong hệ thống.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-13-BUG-02-ac02.png`: `GET /api/admin/orders` với token `user` nhận HTTP 200 OK kèm danh sách đơn hàng.
- `FR-13-BUG-02-ac05.png`: `PUT /api/admin/orders/144/status` với token `user` nhận HTTP 200 OK "Order status updated".

## Ghi chú
- Đây là lỗi bảo mật nghiêm trọng **Broken Access Control (Escalation of Privilege)**[cite: 5, 6].
- Nguyên nhân gốc: Middleware xác thực của các API `/api/admin/*` chỉ kiểm tra tính hợp lệ của chuỗi JWT (`jwt.verify`) mà bỏ qua bước kiểm tra thuộc tính `role === 'admin'` trong payload.