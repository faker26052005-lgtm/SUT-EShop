# GUI-BUG-13

**Tiêu đề Issue:** `[GUI] Không cảnh báo khi rời Profile có thay đổi chưa lưu`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-13 |
| Mức độ | Low |
| Màn hình | Profile |
| Mục checklist liên quan | UI-45 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/115 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở màn hình Profile và sửa dữ liệu nhưng chưa lưu.
2. Rời sang trang khác.

## Kết quả thực tế
Không có cảnh báo nào, các thay đổi chưa lưu bị mất.

## Kết quả mong đợi
Có hộp thoại cảnh báo/xác nhận trước khi thoát khi còn thay đổi chưa lưu.

## Bằng chứng
Ảnh chụp các mục checklist UI-45 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
