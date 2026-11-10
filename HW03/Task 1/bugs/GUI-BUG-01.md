# GUI-BUG-01

**Tiêu đề Issue:** `[GUI] Đăng ký luôn bị từ chối với thông báo "Mật khẩu quá yếu" dù mật khẩu đúng quy tắc`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-01 |
| Mức độ | High |
| Màn hình | Register |
| Mục checklist liên quan | UI-27, UI-37 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/103 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở màn hình Register.
2. Nhập Họ Tên bất kỳ, Email `test@eshop.com`, Mật khẩu `Test1234!` (đủ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt, đúng với quy tắc hiển thị dưới ô nhập). Lặp lại với `admin@eshop.com` và `Admin123!`.
3. Mở DevTools, chọn tab Network, lọc XHR, rồi nhấn nút "Đăng Ký".

## Kết quả thực tế
Trang hiện khung đỏ: "Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT." dù mật khẩu đã thoả mọi điều kiện đó. Các mật khẩu có ký tự đặc biệt khác cũng bị từ chối với cùng thông báo. Không có request nào được gửi tới server (tab Network không có request XHR). Không đăng ký được tài khoản, không có thông báo thành công và không chuyển hướng.

## Kết quả mong đợi
Mật khẩu thoả các điều kiện đang hiển thị thì form được chấp nhận, yêu cầu đăng ký được gửi tới server, và người dùng nhận được thông báo thành công rồi được chuyển đến trang hợp lý (đăng nhập hoặc trang chủ).

## Bằng chứng
Ảnh chụp các mục checklist UI-27, UI-37 (đặt trong `bugs/screenshots/`), gồm ảnh khung lỗi kèm tab Network không có request.
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh

## Ghi chú
- Việc từ chối xảy ra ở phía giao diện, không phải ở server. Theo kiểm thử API trước đó, server (POST /api/register) không từ chối các dữ liệu này (nhận cả email trùng và mật khẩu yếu).
- Gộp các mục checklist UI-27 và UI-37 thành MỘT bug vì có cùng nguyên nhân gốc.
