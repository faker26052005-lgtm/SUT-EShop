# FR-20-BUG-04

**Tiêu đề Issue:** `[FR-20] Đăng ký không áp dụng luật mật khẩu mạnh (độ dài và loại ký tự) (FR-01)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-20-BUG-04 |
| Mức độ | High |
| Feature | FR-20 (Mobile: Đăng ký và Hủy đơn), tầng API |
| Yêu cầu SRS bị vi phạm | FR-01: "Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (`@`, `$`, `!`, `%`, `*`, `?`, `&`)." |
| Môi trường | Backend localhost:3000, SUT commit 85af3ba (commit trong bản clone của mình, hãy thay bằng `git rev-parse --short HEAD` trong repo của bạn) |
| Test case liên quan | DT-R23, DT-R24, DT-R25, DT-R26, BV-R01, BV-R04; phụ thuộc giả định #3: DT-R27, DT-R29 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/50 |
| Trạng thái | Open |

## Các bước tái hiện
Postman: import `FR20_API_RunAll.postman_collection.json`, mở folder **B**, Send lần lượt từ B0 xuống. 
1. Gửi B0.
2. Gửi `FR-20-BUG-04a`: `POST /api/register` với `"password":"abcdef1!"` (thiếu chữ hoa).
3. Gửi `FR-20-BUG-04b`: `"password":"Abcde1!"` (7 ký tự).
4. Lặp lại tay với `ABCDEF1!` (thiếu chữ thường), `Abcdefg!` (thiếu chữ số), `Abcdefg1` (thiếu ký tự đặc biệt), `A` (1 ký tự).
5. Gửi "Đọc lại (admin)" để xác nhận tài khoản tồn tại.

## Kết quả thực tế
Mọi request HTTP 200, tài khoản được tạo (id 25 đến 28, 33, 36 trong lần chạy của bạn). Hệ thống không có luật độ dài lẫn loại ký tự.

## Kết quả mong đợi (theo SRS)
4xx kèm thông báo nêu rõ luật bị vi phạm; không tạo tài khoản.

## Bằng chứng
![ảnh](screenshots/FR-20-BUG-04.png)
TODO: chụp request + response trong Postman (tab Body và Test Results) và đính kèm vào Issue.

## Ghi chú
DT-R27 (`#`) và DT-R29 (khoảng trắng thay ký tự đặc biệt) cũng được nhận nhưng phụ thuộc giả định #3 (tập ký tự đặc biệt là danh sách liệt kê). Nếu GV xác nhận khác, bỏ hai ca này. Lưu ý mật khẩu của DT-R29 là `Abcdef1` kèm một dấu cách ở cuối.
