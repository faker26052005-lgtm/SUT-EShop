# Bối cảnh dự án (EShop SUT)

Chỉ chứa những điều cố định của dự án. Mọi thứ về hành vi mong đợi nằm trong `inputs/`.

## Chạy ở đâu

- Gốc workspace chứa `inputs/`, `executions/`, `karate/`, `.agents/`, `.antigravity/`.
- Địa chỉ máy chủ mặc định `http://localhost:3000`. Feature dùng biến `baseUrl` do `karate-config.js` cung cấp, không viết cứng địa chỉ.
- Máy chủ do **người** khởi động lại trước mỗi lần chạy để dữ liệu về trạng thái ban đầu.

## Hàm dùng chung (Karate gọi qua `classpath:helpers/...`)

| Hàm | Gọi | Trả về |
|---|---|---|
| Đăng nhập | `call read('classpath:helpers/login.feature') { email: '...', password: '...' }` | `token` |
| Tạo tài khoản tạm | `call read('classpath:helpers/create-user.feature')` | `email`, `password`, `token`, `id` |

Hai hàm này nằm sẵn trong skill (`assets/karate/helpers/`) và `run_karate.py` tự đưa vào đường dẫn, không cần sao chép.

## Quy ước đặt tên biến cho tài khoản mẫu

Tài khoản mẫu (trong `inputs/sample-data.md`) luôn đặt biến là `userToken` và `adminToken`. Tài khoản tạm luôn đặt là `u` (hoặc `u1`, `u2`) và dùng `u.token`.

`check_coverage.py` dựa vào quy ước này: ca có `put`, `patch` hoặc `delete` mà dùng `userToken` hoặc `adminToken` sẽ bị cảnh báo vì có thể làm hỏng dữ liệu mẫu.

## Dữ liệu tạm

- Email tạm do hàm `create-user` tự sinh, không bao giờ tái sử dụng giữa các ca (mỗi ca dùng `call`, không dùng `callonce`).
- Dữ liệu tạm khác (mã giảm giá, sản phẩm...) tạo qua API admin trong chính Scenario cần nó, đặt tên có tiền tố `tmp` và dấu thời gian để không đụng dữ liệu mẫu.
