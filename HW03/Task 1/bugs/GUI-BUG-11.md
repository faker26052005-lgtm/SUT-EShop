# GUI-BUG-11

**Tiêu đề Issue:** `[GUI] Nút Back của trình duyệt làm mất dữ liệu đang nhập`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-11 |
| Mức độ | Medium |
| Màn hình | Register, Login, Profile |
| Mục checklist liên quan | UI-33 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/113 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở form và nhập dữ liệu.
2. Chuyển sang trang khác rồi nhấn nút Back của trình duyệt (hoặc ngược lại).
3. Quan sát trạng thái của trang.

## Kết quả thực tế
Trang luôn reset về trạng thái ban đầu khi nhấn Back, dữ liệu đã nhập bị mất mà không có cảnh báo.

## Kết quả mong đợi
Không mất dữ liệu bất ngờ, không gửi lại form ngoài ý muốn.

## Bằng chứng
Ảnh chụp các mục checklist UI-33 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh
