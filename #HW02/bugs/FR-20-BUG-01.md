# FR-20-BUG-01

**Tiêu đề Issue:** `[FR-20] Đăng ký không kiểm tra trường bắt buộc: Họ tên, Email, Mật khẩu rỗng vẫn tạo tài khoản (FR-01)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-20-BUG-01 |
| Mức độ | High |
| Feature | FR-20 (Mobile: Đăng ký và Hủy đơn), tầng API |
| Yêu cầu SRS bị vi phạm | FR-01: "Người dùng phải cung cấp: Họ Tên, Email, Mật khẩu." |
| Môi trường | Backend localhost:3000, SUT commit 85af3ba (commit trong bản clone của mình, hãy thay bằng `git rev-parse --short HEAD` trong repo của bạn) |
| Test case liên quan | DT-R03, DT-R13, DT-R28 |
| GitHub Issue | TODO (link) |
| Trạng thái | Open |

## Các bước tái hiện
Postman: import `FR20_API_RunAll.postman_collection.json`, mở folder **B**, Send lần lượt từ B0 xuống. 
1. Gửi B0 (chuẩn bị).
2. Gửi `FR-20-BUG-01a`: `POST /api/register` body `{"name":"","email":"<email mới>","password":"Abcdef1!"}`.
3. Gửi `FR-20-BUG-01b`: body `{"name":"Nguyen Van A","email":"","password":"Abcdef1!"}`.
4. Gửi `FR-20-BUG-01c`: body `{"name":"Nguyen Van A","email":"<email mới>","password":""}`.
5. Gửi "Đọc lại (admin)": `GET /api/admin/users` với token admin.

## Kết quả thực tế
Cả 3 request trả HTTP 200 và tài khoản được tạo (id lần lượt 5, 15, 30 trong lần chạy của bạn). Đọc lại bằng API admin thấy các tài khoản này tồn tại.

## Kết quả mong đợi (theo SRS)
Trả 4xx kèm thông báo lỗi, không tạo tài khoản.

## Bằng chứng
![ảnh](screenshots/FR-20-BUG-01.png)
TODO: chụp request + response trong Postman (tab Body và Test Results) và đính kèm vào Issue.

## Ghi chú
Ảnh hưởng: tài khoản rác, không đăng nhập hoặc liên hệ được. Mật khẩu rỗng cũng thuộc yêu cầu độ mạnh mật khẩu (xem BUG-04) nhưng được xếp vào đây vì vi phạm trực tiếp "phải cung cấp".
