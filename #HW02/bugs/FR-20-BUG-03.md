# FR-20-BUG-03

**Tiêu đề Issue:** `[FR-20] Cho phép đăng ký trùng email, hệ thống có 2 tài khoản `test@eshop.com` (FR-01)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-20-BUG-03 |
| Mức độ | High |
| Feature | FR-20 (Mobile: Đăng ký và Hủy đơn), tầng API |
| Yêu cầu SRS bị vi phạm | FR-01: "Email ... là duy nhất trong hệ thống." |
| Môi trường | Backend localhost:3000, SUT commit 85af3ba (commit trong bản clone của mình, hãy thay bằng `git rev-parse --short HEAD` trong repo của bạn) |
| Test case liên quan | DT-R14, BL-R03 |
| GitHub Issue | TODO (link) |
| Trạng thái | Open |

## Các bước tái hiện
Postman: import `FR20_API_RunAll.postman_collection.json`, mở folder **B**, Send lần lượt từ B0 xuống. 
1. Gửi B0.
2. Gửi `FR-20-BUG-03a`: `POST /api/register` body `{"name":"Trung Email","email":"test@eshop.com","password":"Abcdef1!"}`.
3. Gửi `FR-20-BUG-03b`: `GET /api/admin/users` (token admin) và đếm tài khoản có email `test@eshop.com`.
4. BL-R03: gửi hai request đăng ký cùng email cùng lúc (có trong folder A, ca BL-R03).

## Kết quả thực tế
HTTP 200, tài khoản thứ hai được tạo (id 16 trong lần chạy của bạn); đọc lại thấy 2 tài khoản cùng email. BL-R03: cả hai request đồng thời đều HTTP 200, tạo 2 tài khoản.

## Kết quả mong đợi (theo SRS)
Từ chối (4xx, thông thường 409), chỉ còn 1 tài khoản.

## Bằng chứng
![ảnh](screenshots/FR-20-BUG-03.png)
TODO: chụp request + response trong Postman (tab Body và Test Results) và đính kèm vào Issue.

## Ghi chú
Mức độ: High, chưa phải Critical. Kiểm tra trên bản clone của mình: đăng nhập `test@eshop.com` bằng mật khẩu của tài khoản trùng thì bị từ chối, nên tài khoản gốc không bị chiếm; tuy vậy dữ liệu vẫn sai và có thể gây nhầm lẫn khi đặt lại mật khẩu theo email. Bạn nên tự lặp lại phép thử này trên máy bạn và ghi kết quả vào Issue.
