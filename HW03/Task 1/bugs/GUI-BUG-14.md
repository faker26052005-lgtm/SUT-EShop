# GUI-BUG-14

**Tiêu đề Issue:** `[GUI] Thông báo nổi không tự biến mất`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-14 |
| Mức độ | Low |
| Màn hình | Register, Profile |
| Mục checklist liên quan | UI-52 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/116 |
| Trạng thái | Open |

## Các bước tái hiện
1. Thực hiện một thao tác để hiện thông báo nổi (toast/alert) trên màn hình.
2. Chờ vài giây.

## Kết quả thực tế
Thông báo hiện vĩnh viễn cho đến khi tải lại trang.

## Kết quả mong đợi
Thông báo tự động biến mất sau khoảng 3–5 giây để không che khuất màn hình.

## Bằng chứng
Ảnh chụp các mục checklist UI-52 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
