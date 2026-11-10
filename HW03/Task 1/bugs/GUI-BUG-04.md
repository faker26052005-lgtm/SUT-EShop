# GUI-BUG-04

**Tiêu đề Issue:** `[GUI] Tài khoản bị khoá nhưng giao diện không phản hồi`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-04 |
| Mức độ | Medium |
| Màn hình | Login |
| Mục checklist liên quan | UI-40, UI-41 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/106 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở màn hình Login.
2. Đăng nhập sai mật khẩu liên tiếp cho đến khi tài khoản bị khoá (đã xác nhận việc khoá bằng API call).
3. Nhấn nút đăng nhập thêm một lần nữa.

## Kết quả thực tế
Tài khoản thực sự bị khoá nhưng giao diện không hiển thị trạng thái hay lý do. Nhấn nút đăng nhập không có phản hồi nào, người dùng không biết vì sao không đăng nhập được.

## Kết quả mong đợi
Hiện thông báo tài khoản bị khoá, nêu lý do, và cho biết thời gian khoá hoặc cách mở khoá.

## Bằng chứng
Ảnh chụp các mục checklist UI-40, UI-41 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh

## Ghi chú
- Gộp các mục checklist UI-40, UI-41 thành MỘT bug vì có cùng nguyên nhân gốc.
