# GUI-BUG-07

**Tiêu đề Issue:** `[GUI] Màu nút chính không nhất quán giữa các màn hình`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-07 |
| Mức độ | Low |
| Màn hình | Register, Login, Profile |
| Mục checklist liên quan | UI-02 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/109 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở lần lượt màn hình Register, Login và Profile.
2. So sánh màu của nút chính trên mỗi màn hình.

## Kết quả thực tế
Nút "Đăng Ký" trên màn hình Register có màu đỏ, trong khi nút "Sign In" trên Login và nút "Cập nhật" trên Profile có màu xanh.

## Kết quả mong đợi
Các nút cùng vai trò (gửi form) có cùng kiểu và màu.

## Bằng chứng
Ảnh chụp các mục checklist UI-02 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
