# GUI-BUG-12

**Tiêu đề Issue:** `[GUI] Vẫn hiện form Login khi đã đăng nhập`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-12 |
| Mức độ | Low |
| Màn hình | Login |
| Mục checklist liên quan | UI-30 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/114 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập vào hệ thống.
2. Truy cập lại trang Login (qua địa chỉ URL).

## Kết quả thực tế
Trang vẫn hiện form đăng nhập trong khi góc trái màn hình vẫn hiển thị trạng thái đang đăng nhập.

## Kết quả mong đợi
Được xử lý hợp lý: chuyển hướng đi chỗ khác hoặc hiện thông báo đã đăng nhập.

## Bằng chứng
Ảnh chụp các mục checklist UI-30 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
