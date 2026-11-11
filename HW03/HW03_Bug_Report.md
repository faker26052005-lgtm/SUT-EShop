# HW03 – Bug Report (GUI)

| Hạng mục | Nội dung |
|---|---|
| SUT | EShop – https://github.com/ttbhanh/eshop-sut |
| Sinh viên | [ĐIỀN: Họ tên] – MSSV: [ĐIỀN] |
| GitHub Issues | https://github.com/faker26052005-lgtm/SUT-EShop/issues |
| Nguồn | Checklist GUI (Task 1, Firefox 157) và kiểm thử đa nền tảng (Task 3, Firefox 157, Chrome 159, Safari 27) |
| Tổng số bug | 15 (2 High, 5 Medium, 8 Low) |

Mỗi bug có một Issue duy nhất trên GitHub, kèm ảnh chụp. Các mục checklist Failed có cùng biểu hiện được gộp thành một bug.

## 1. Danh sách bug

| Bug ID | Màn hình | Tiêu đề | Mức độ | Mục checklist | Nền tảng | Issue |
|---|---|---|---|---|---|---|
| GUI-BUG-01 | Register | Đăng ký luôn bị từ chối với thông báo "Mật khẩu quá yếu" dù mật khẩu đúng quy tắc | High | UI-27, UI-37 | Cả 3 | [#103](https://github.com/faker26052005-lgtm/SUT-EShop/issues/103) |
| GUI-BUG-02 | Register | Form đăng ký chỉ có một thông báo lỗi mật khẩu cho mọi trường hợp, không chỉ ra ô sai thực sự | Medium | UI-12, UI-13, UI-14 | Cả 3 | [#104](https://github.com/faker26052005-lgtm/SUT-EShop/issues/104) |
| GUI-BUG-03 | Profile | Cập nhật hồ sơ luôn bị từ chối với thông báo "Số điện thoại không hợp lệ" dù nhập đúng định dạng | High | UI-17, UI-25, UI-42, UI-43, UI-44 | Cả 3 | [#105](https://github.com/faker26052005-lgtm/SUT-EShop/issues/105) |
| GUI-BUG-04 | Login | Tài khoản bị khoá nhưng giao diện không phản hồi | Medium | UI-40, UI-41 | Cả 3 | [#106](https://github.com/faker26052005-lgtm/SUT-EShop/issues/106) |
| GUI-BUG-05 | Login | Tiêu đề màn hình Login hiển thị là "Đăng Ký" | Low | UI-05 | Cả 3 | [#107](https://github.com/faker26052005-lgtm/SUT-EShop/issues/107) |
| GUI-BUG-06 | Login | Màn hình Login trộn lẫn tiếng Anh và tiếng Việt | Low | UI-09 | Cả 3 | [#108](https://github.com/faker26052005-lgtm/SUT-EShop/issues/108) |
| GUI-BUG-07 | Register, Login, Profile | Màu nút chính không nhất quán giữa các màn hình | Low | UI-02 | Cả 3 | [#109](https://github.com/faker26052005-lgtm/SUT-EShop/issues/109) |
| GUI-BUG-08 | Register | Form đăng ký không đánh dấu các trường bắt buộc | Low | UI-10 | Cả 3 | [#110](https://github.com/faker26052005-lgtm/SUT-EShop/issues/110) |
| GUI-BUG-09 | Register, Login | Không có nút hiện/ẩn mật khẩu | Low | UI-16 | Cả 3 | [#111](https://github.com/faker26052005-lgtm/SUT-EShop/issues/111) |
| GUI-BUG-10 | Register, Login, Profile | Form bị xoá toàn bộ dữ liệu khi gửi lỗi | Medium | UI-19 | Cả 3 | [#112](https://github.com/faker26052005-lgtm/SUT-EShop/issues/112) |
| GUI-BUG-11 | Register, Login, Profile | Nút Back của trình duyệt làm mất dữ liệu đang nhập | Medium | UI-33 | Cả 3 | [#113](https://github.com/faker26052005-lgtm/SUT-EShop/issues/113) |
| GUI-BUG-12 | Login | Vẫn hiện form Login khi đã đăng nhập | Low | UI-30 | Cả 3 | [#114](https://github.com/faker26052005-lgtm/SUT-EShop/issues/114) |
| GUI-BUG-13 | Profile | Không cảnh báo khi rời Profile có thay đổi chưa lưu | Low | UI-45 | Cả 3 | [#115](https://github.com/faker26052005-lgtm/SUT-EShop/issues/115) |
| GUI-BUG-14 | Register, Profile | Thông báo nổi không tự biến mất | Low | UI-52 | Cả 3 | [#116](https://github.com/faker26052005-lgtm/SUT-EShop/issues/116) |
| GUI-BUG-15 | Register, Login | Mật khẩu dán từ clipboard hiển thị dạng chữ thường, không bị che, trên Chrome | Medium | UI-50 | Chỉ Chrome | [#161](https://github.com/faker26052005-lgtm/SUT-EShop/issues/161) |

## 2. Chi tiết từng bug

### GUI-BUG-01 – Đăng ký luôn bị từ chối với thông báo "Mật khẩu quá yếu" (High)
- **Tái hiện:** mở Register, nhập Họ Tên bất kỳ, email `test@eshop.com`, mật khẩu `Test1234!` (đủ 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt; thử thêm `admin@eshop.com` / `Admin123!`), mở DevTools tab Network lọc XHR rồi nhấn "Đăng Ký".
- **Thực tế:** hiện khung đỏ "Mật khẩu quá yếu! ..." dù mật khẩu thoả mọi điều kiện đang hiển thị. Không có request nào được gửi, không đăng ký được, không có thông báo thành công và không chuyển hướng.
- **Mong đợi:** mật khẩu thoả điều kiện thì form được chấp nhận, yêu cầu đăng ký được gửi, người dùng nhận thông báo thành công rồi được chuyển đến trang hợp lý (đăng nhập hoặc trang chủ).

### GUI-BUG-02 – Chỉ có một thông báo lỗi mật khẩu cho mọi trường hợp (Medium)
- **Tái hiện:** mở Register, thử lần lượt (a) email sai định dạng, (b) email đã tồn tại `test@eshop.com` kèm mật khẩu đúng quy tắc, (c) mật khẩu yếu thật sự; nhấn "Đăng Ký" sau mỗi trường hợp.
- **Thực tế:** cả ba trường hợp đều chỉ hiện cùng thông báo "Mật khẩu quá yếu! ...". Không có thông báo nào về email sai định dạng hay email đã được sử dụng.
- **Mong đợi:** mỗi lỗi được báo đúng ô và đúng nguyên nhân.
- **Ghi chú:** cần kiểm tra lại sau khi GUI-BUG-01 được sửa.

### GUI-BUG-03 – Cập nhật hồ sơ luôn báo "Số điện thoại không hợp lệ" (High)
- **Tái hiện:** đăng nhập `test@eshop.com` / `Test1234!`, mở Profile, nhập số điện thoại `0912345678` (hoặc `0123456789`), mở DevTools tab Network rồi nhấn "Cập nhật".
- **Thực tế:** hiện hộp thoại alert của trình duyệt "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số." với mọi giá trị đã thử (số đúng định dạng, số 9 hoặc 10 chữ số không có số 0 đầu, chữ, ký tự đặc biệt), kể cả khi chưa thay đổi gì. Không có request nào được gửi, hồ sơ không được lưu.
- **Mong đợi:** số điện thoại hợp lệ theo FR-04 (bắt đầu bằng số 0, dài 10–11 chữ số) được chấp nhận và có thông báo thành công; số không hợp lệ bị báo lỗi rõ, không mất dữ liệu đã nhập; khi chưa thay đổi gì thì nút "Cập nhật" bị vô hiệu hoặc không gây lỗi.
- **Ghi chú:** thông báo ghi "9-10 chữ số", khác yêu cầu FR-04 (10–11 chữ số); lỗi hiển thị bằng alert của trình duyệt, không hiện cạnh ô nhập.

### GUI-BUG-04 – Tài khoản bị khoá nhưng giao diện không phản hồi (Medium)
- **Tái hiện:** mở Login, đăng nhập sai mật khẩu liên tiếp cho đến khi tài khoản bị khoá (đã xác nhận việc khoá bằng API call), rồi nhấn nút đăng nhập thêm một lần.
- **Thực tế:** giao diện không hiển thị trạng thái hay lý do, nhấn nút không có phản hồi nào.
- **Mong đợi:** hiện thông báo tài khoản bị khoá, nêu lý do, và cho biết thời gian khoá hoặc cách mở khoá.

### GUI-BUG-05 – Tiêu đề màn hình Login hiển thị là "Đăng Ký" (Low)
- **Tái hiện:** mở Login, quan sát tiêu đề trang.
- **Thực tế:** tiêu đề là "Đăng Ký".
- **Mong đợi:** tiêu đề là "Đăng Nhập", phân biệt được với Register.

### GUI-BUG-06 – Màn hình Login trộn lẫn tiếng Anh và tiếng Việt (Low)
- **Tái hiện:** mở Login, quan sát các nhãn, nút và liên kết.
- **Thực tế:** các nhãn tiếng Anh ("Username", "Sign In") xen kẽ các nhãn tiếng Việt ("Mật khẩu", "Quên mật khẩu?").
- **Mong đợi:** ngôn ngữ nhãn thống nhất trên toàn màn hình.
- **Ghi chú:** ở Task 2, P7 cũng lúng túng vì các nút bằng tiếng Anh xen với tiếng Việt.

### GUI-BUG-07 – Màu nút chính không nhất quán giữa các màn hình (Low)
- **Tái hiện:** mở lần lượt Register, Login, Profile và so sánh màu nút chính.
- **Thực tế:** nút "Đăng Ký" ở Register màu đỏ; nút "Sign In" ở Login và "Cập nhật" ở Profile màu xanh.
- **Mong đợi:** các nút cùng vai trò (gửi form) có cùng kiểu và màu.

### GUI-BUG-08 – Form đăng ký không đánh dấu các trường bắt buộc (Low)
- **Tái hiện:** mở Register, quan sát các ô nhập và nhãn.
- **Thực tế:** các ô đều có nhãn nhưng không có dấu hiệu cho biết ô nào bắt buộc.
- **Mong đợi:** các trường bắt buộc được đánh dấu rõ (ví dụ dấu * hoặc chú thích).

### GUI-BUG-09 – Không có nút hiện/ẩn mật khẩu (Low)
- **Tái hiện:** mở Register hoặc Login, nhập mật khẩu và tìm nút hiện mật khẩu.
- **Thực tế:** mật khẩu được che nhưng không có nút để hiện.
- **Mong đợi:** mật khẩu được che và có nút hiện/ẩn hoạt động đúng.

### GUI-BUG-10 – Form bị xoá toàn bộ dữ liệu khi gửi lỗi (Medium)
- **Tái hiện:** mở form (Register, Login hoặc Profile), nhập dữ liệu, gửi form theo cách gây lỗi, quan sát các ô sau khi hiện thông báo lỗi.
- **Thực tế:** toàn bộ dữ liệu trong form bị reset, người dùng phải nhập lại từ đầu.
- **Mong đợi:** dữ liệu đã nhập được giữ nguyên (trừ ô mật khẩu) để người dùng chỉ cần sửa chỗ sai.

### GUI-BUG-11 – Nút Back của trình duyệt làm mất dữ liệu đang nhập (Medium)
- **Tái hiện:** mở form và nhập dữ liệu, chuyển sang trang khác rồi nhấn Back của trình duyệt (hoặc ngược lại).
- **Thực tế:** trang luôn reset về trạng thái ban đầu, dữ liệu đã nhập bị mất mà không có cảnh báo.
- **Mong đợi:** không mất dữ liệu bất ngờ, không gửi lại form ngoài ý muốn.

### GUI-BUG-12 – Vẫn hiện form Login khi đã đăng nhập (Low)
- **Tái hiện:** đăng nhập vào hệ thống, rồi truy cập lại trang Login qua địa chỉ URL.
- **Thực tế:** trang vẫn hiện form đăng nhập trong khi góc trái màn hình vẫn hiển thị trạng thái đang đăng nhập.
- **Mong đợi:** được xử lý hợp lý, ví dụ chuyển hướng đi chỗ khác hoặc hiện thông báo đã đăng nhập.

### GUI-BUG-13 – Không cảnh báo khi rời Profile có thay đổi chưa lưu (Low)
- **Tái hiện:** mở Profile, sửa dữ liệu nhưng chưa lưu, rồi rời sang trang khác.
- **Thực tế:** không có cảnh báo, các thay đổi chưa lưu bị mất.
- **Mong đợi:** có hộp thoại cảnh báo/xác nhận trước khi thoát.

### GUI-BUG-14 – Thông báo nổi không tự biến mất (Low)
- **Tái hiện:** thực hiện thao tác để hiện thông báo nổi (toast/alert), chờ vài giây.
- **Thực tế:** thông báo hiện vĩnh viễn cho đến khi tải lại trang.
- **Mong đợi:** thông báo tự biến mất sau khoảng 3–5 giây.

### GUI-BUG-15 – Mật khẩu dán từ clipboard hiển thị dạng chữ thường trên Chrome (Medium, chỉ Chrome)
- **Tái hiện:** mở Register (hoặc Login) bằng Chrome 159, sao chép mật khẩu từ nơi khác (ví dụ gõ `Test1234!` trong trình soạn thảo rồi Ctrl+C), dán (Ctrl+V) vào ô Mật khẩu.
- **Thực tế:** mật khẩu vừa dán hiển thị đầy đủ dạng chữ thường thay vì bị che. Khi gõ trực tiếp thì mật khẩu được che bình thường. Không xuất hiện trên Firefox 157 và Safari 27.
- **Mong đợi:** mật khẩu dán vào ô vẫn bị che giống khi gõ trực tiếp.
- **Ghi chú:** đây là khác biệt giữa các nền tảng duy nhất ghi nhận ở Task 3. Mật khẩu hiển thị rõ trên màn hình có ý nghĩa về quyền riêng tư nên xếp mức Medium.

## 3. Bằng chứng

- Mỗi Issue trên GitHub có ảnh chụp lỗi; ảnh của các lỗi từ GUI-BUG-01 đến 14 được chụp trên cả 3 nền tảng, GUI-BUG-15 có ảnh Chrome và ảnh đối chiếu Firefox, Safari. Ảnh được đóng dấu email, MSSV, họ tên và tên nền tảng.
- GitHub Issues hiển thị danh sách 15 Issue
