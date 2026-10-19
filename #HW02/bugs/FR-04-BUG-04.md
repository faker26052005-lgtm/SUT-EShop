# FR-04-BUG-04

**Tiêu đề Issue:** `[FR-04] GET /api/users/me trả về mật khẩu dạng plaintext và các trường nhạy cảm (SEC-01)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-04-BUG-04 |
| Mức độ | Critical |
| Feature | FR-04 (API 2.1 `GET /api/users/me`); liên quan SEC-01 (thuộc FR-01 đăng ký) |
| Yêu cầu SRS bị vi phạm | SEC-01: "Mật khẩu **không** được lưu dưới dạng plaintext." |
| Môi trường | Backend localhost:3000, SUT commit TODO (chạy `git rev-parse --short HEAD`) |
| Test case liên quan | BL-06 (ca mới, xem bên dưới) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/46 |
| Trạng thái | Open |

## Test case mới đi kèm
| ID | Mô tả | Input | Kỳ vọng (theo SRS) |
| :--- | :--- | :--- | :--- |
| BL-06 | Response của `GET /api/users/me` không chứa mật khẩu và các trường nhạy cảm | Đăng ký với mật khẩu `Pass1234!`, đăng nhập, gọi GET | Không có trường `password`, `reset_token`; nếu có thì không phải plaintext (SEC-01) |

## Các bước tái hiện
1. Postman: `POST /api/register` với `{"name":"U","email":"bug4@test.com","password":"Pass1234!"}`.
2. `POST /api/login` cùng email và mật khẩu, lấy token.
3. `GET /api/users/me` với `Authorization: Bearer <token>`.

## Kết quả thực tế
HTTP 200. Response chứa các trường `email`, `id`, `name`, `phone`, `role`, `shipping_address` và cả `password`, `reset_token`, `login_attempts`, `locked_until`. Giá trị `password` là **`Pass1234!`**, đúng bằng mật khẩu đã đăng ký.

## Kết quả mong đợi
Response không chứa `password`, `reset_token` và các trường nội bộ; mật khẩu không bao giờ được lưu hoặc trả về dạng plaintext.

## Bằng chứng
- bước đăng ký có mật khẩu `Pass1234!`.
- response của GET thấy `password: "Pass1234!"`.
- TODO: ảnh trang GitHub Issue.

## Ghi chú
- Phát hiện này đến từ việc xem nội dung response khi chạy các ca bổ sung của AI. Không có test nào trước đó (bản mẫu, AI, bộ cuối) kiểm tra phần này.
- Lỗi lộ ra ở endpoint của FR-04 nhưng nguyên nhân gốc (lưu plaintext) thuộc SEC-01
