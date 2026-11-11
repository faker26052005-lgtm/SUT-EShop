# GUI-BUG-10

**Tiêu đề Issue:** `[GUI] Form bị xoá toàn bộ dữ liệu khi gửi lỗi`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-10 |
| Mức độ | Medium |
| Màn hình | Register, Login, Profile |
| Mục checklist liên quan | UI-19 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/112 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở form (Register, Login hoặc Profile) và nhập dữ liệu vào các ô.
2. Gửi form theo cách gây ra lỗi.
3. Quan sát các ô sau khi hiện thông báo lỗi.

## Kết quả thực tế
Toàn bộ dữ liệu trong form bị reset sau khi gửi lỗi, người dùng phải nhập lại từ đầu.

## Kết quả mong đợi
Dữ liệu đã nhập vẫn được giữ nguyên (trừ ô mật khẩu) để người dùng chỉ cần sửa chỗ sai.

## Bằng chứng
Ảnh chụp các mục checklist UI-19 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
