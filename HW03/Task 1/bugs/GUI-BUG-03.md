# GUI-BUG-03

**Tiêu đề Issue:** `[GUI] Cập nhật hồ sơ luôn bị từ chối với thông báo "Số điện thoại không hợp lệ" dù nhập đúng định dạng`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-03 |
| Mức độ | High |
| Màn hình | Profile |
| Mục checklist liên quan | UI-17, UI-25, UI-42, UI-43, UI-44 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/105 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập bằng `test@eshop.com` / `Test1234!` và mở màn hình Profile.
2. Trong ô "Số điện thoại", nhập `0912345678` (hoặc `0123456789`).
3. Mở DevTools, chọn tab Network, rồi nhấn nút "Cập nhật".

## Kết quả thực tế
Trang hiện hộp thoại cảnh báo của trình duyệt: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số." Thông báo này xuất hiện với mọi giá trị đã thử (số đúng định dạng, số không có số 0 đầu gồm 9 hoặc 10 chữ số, chữ, ký tự đặc biệt), kể cả khi chưa thay đổi gì. Không có request nào được gửi tới server. Không cập nhật được hồ sơ, không có thông báo thành công, thông tin mới không được lưu.

## Kết quả mong đợi
- Số điện thoại hợp lệ (theo yêu cầu FR-04: bắt đầu bằng số 0, dài 10-11 chữ số) được chấp nhận, hồ sơ được cập nhật và có thông báo thành công.
- Số điện thoại không hợp lệ bị báo lỗi rõ, không làm mất dữ liệu đã nhập.
- Khi chưa thay đổi gì, nút "Cập nhật" bị vô hiệu hoặc không gây lỗi.

## Bằng chứng
Ảnh chụp các mục checklist UI-17, UI-25, UI-42, UI-43, UI-44 (đặt trong `bugs/screenshots/`), gồm ảnh hộp thoại lỗi kèm tab Network không có request.
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh

## Ghi chú
- Gộp các mục checklist UI-17, UI-25, UI-42, UI-43, UI-44 thành MỘT bug vì có cùng nguyên nhân gốc.
- Việc từ chối xảy ra ở phía giao diện, không phải ở server. Theo kiểm thử API trước đó, server (PUT /api/users/me) không kiểm tra số điện thoại (giá trị `9999` vẫn được chấp nhận).
- Nội dung thông báo ghi "9-10 chữ số", khác với yêu cầu FR-04 (10-11 chữ số). Số `0912345678` và `0123456789` có 10 chữ số, thoả cả hai quy tắc nhưng vẫn bị từ chối.
- Thông báo lỗi hiển thị bằng hộp thoại alert của trình duyệt, không hiện ngay cạnh ô nhập.
