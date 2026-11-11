# GUI-BUG-15

**Tiêu đề Issue:** `[GUI] Mật khẩu dán từ clipboard hiển thị dạng chữ thường, không bị che, trên Chrome`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-15 |
| Mức độ | Medium |
| Màn hình | Register, Login |
| Mục checklist liên quan | UI-50 |
| Nền tảng | Chrome |
| GitHub Issue |https://github.com/faker26052005-lgtm/SUT-EShop/issues/161 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở trang Register (hoặc Login) bằng Chrome.
2. Sao chép một mật khẩu từ nơi khác (ví dụ gõ `Test1234!` trong một trình soạn thảo rồi nhấn Ctrl+C).
3. Dán (Ctrl+V) vào ô Mật khẩu.

## Kết quả thực tế
Mật khẩu vừa dán hiển thị đầy đủ dạng chữ thường thay vì bị che. Khi gõ trực tiếp vào ô thì mật khẩu được che bình thường. Hiện tượng này không xuất hiện trên Firefox và Safari.

## Kết quả mong đợi
Mật khẩu dán vào ô vẫn bị che giống như khi gõ trực tiếp.

## Bằng chứng
Ảnh chụp trên Chrome và ảnh đối chiếu trên Firefox và Safari (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh

## Ghi chú
- Lỗi chỉ xuất hiện trên Chrome, không xuất hiện trên Firefox và Safari; đây là khác biệt giữa các nền tảng duy nhất được ghi nhận ở Task 3.
