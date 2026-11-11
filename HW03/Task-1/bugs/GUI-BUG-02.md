# GUI-BUG-02

**Tiêu đề Issue:** `[GUI] Form đăng ký chỉ có một thông báo lỗi mật khẩu cho mọi trường hợp, không chỉ ra ô sai thực sự`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | GUI-BUG-02 |
| Mức độ | Medium |
| Màn hình | Register |
| Mục checklist liên quan | UI-12, UI-13, UI-14 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/104 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở màn hình Register.
2. Thử lần lượt các trường hợp: (a) email sai định dạng; (b) email đã tồn tại (`test@eshop.com`) kèm mật khẩu đúng quy tắc; (c) mật khẩu yếu thật sự.
3. Nhấn nút "Đăng Ký" sau mỗi trường hợp.

## Kết quả thực tế
Cả ba trường hợp đều chỉ hiện cùng một thông báo lỗi về mật khẩu ("Mật khẩu quá yếu! ..."). Thông báo này đúng với trường hợp (c), nhưng cũng xuất hiện khi mật khẩu đã đúng quy tắc hoặc khi lỗi nằm ở ô khác: không có thông báo nào về email sai định dạng hay email đã được sử dụng. Quy tắc mật khẩu có hiển thị rõ dưới ô nhập, nhưng thông báo không giúp người dùng biết ô nào thực sự sai. Không có request nào được gửi tới server.

## Kết quả mong đợi
Mỗi lỗi được báo đúng ô và đúng nguyên nhân: email sai định dạng báo là sai định dạng, email đã tồn tại báo là đã được sử dụng, mật khẩu yếu mới báo mật khẩu yếu.

## Bằng chứng
Ảnh chụp các mục checklist UI-12, UI-13, UI-14 (đặt trong `bugs/screenshots/`).
- [ ] Ảnh lỗi đã được đính kèm vào Issue
- [ ] Ảnh trang GitHub Issue có đính kèm ảnh

## Ghi chú
- Gộp các mục checklist UI-12, UI-13, UI-14 thành MỘT bug vì có cùng nguyên nhân gốc.
- Lỗi này có thể là hệ quả của GUI-BUG-01 (kiểm tra mật khẩu luôn thất bại và chặn trước các kiểm tra khác). Cần xác nhận lại sau khi GUI-BUG-01 được sửa.
