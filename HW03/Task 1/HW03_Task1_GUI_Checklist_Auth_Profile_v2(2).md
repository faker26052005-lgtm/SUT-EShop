# HW03 – Task 1: GUI Checklist (Register, Login, Profile)

> **Trạng thái:** Checklist do AI sinh bản nháp, sau đó được tác giả rà soát, bổ sung và thực thi trên EShop.

## 1. Phạm vi

| Hạng mục | Nội dung |
|---|---|
| SUT | EShop – https://github.com/ttbhanh/eshop-sut |
| Màn hình kiểm thử | Register Screen, Login Screen, Profile Screen |
| Yêu cầu liên quan | Pool A: FR-01 (Đăng ký), FR-02 (Đăng nhập và khoá tài khoản), FR-04 (Quản lý hồ sơ cá nhân) |
| Khía cạnh giao diện | IA-01 (General UI), IA-02 (Forms), IA-03 (Navigation), IA-04 (Feedback / state) |
| Kết quả | Chỉ dùng **Passed** hoặc **Failed**; cột Notes ghi lý do; chỉ chụp ảnh các mục Failed |

Ký hiệu cột Màn hình: **R** = Register, **L** = Login, **P** = Profile, **All** = cả ba.

---

## 2. Checklist

### IA-01: General UI standards

| ID | Màn hình | Mục kiểm tra | Kết quả mong đợi | Status | Notes |
|---|---|---|---|---|---|
| UI-01 | All | Header, logo, font chữ nhất quán giữa ba màn hình | Cùng bố cục header, cùng hệ font, cỡ chữ phân cấp rõ | Passed | Bố cục header với logo bên trái, menu bên phải và font chữ chung được giữ nhất quán qua cả 3 màn hình. |
| UI-02 | All | Màu sắc và style nút chính (Đăng ký, Đăng nhập, Lưu) | Nút cùng vai trò có cùng kiểu và màu | Failed | Màn hình Register dùng nút "Đăng Ký" màu đỏ, trong khi màn hình Login ("Sign In") và Profile ("Cập nhật") lại dùng nút màu xanh. Thiếu sự nhất quán về màu sắc. |
| UI-03 | All | Căn lề và khoảng cách giữa các thành phần trong form | Đều nhau, không chồng lấn, không lệch hàng | Passed | Form được đặt gọn trong thẻ (card) giữa màn hình, các ô input và chữ được căn lề đều đặn. |
| UI-04 | All | Hiển thị tiếng Việt có dấu | Không lỗi font, không ký tự lạ | Passed | Tiếng Việt hiển thị tốt, không bị lỗi font hay vỡ ký tự. |
| UI-05 | All | Tiêu đề trang và tiêu đề tab trình duyệt | Mỗi màn hình có tiêu đề rõ ràng, phân biệt được | Failed | Tiêu đề trên màn hình Login bị sai (hiển thị là "Đăng Ký" thay vì "Đăng Nhập"). |
| UI-06 | All | Responsive trên màn hình nhỏ (khoảng 375px) | Form vừa màn hình, không có thanh cuộn ngang | Passed | Giao diện tự động scale lại. |
| UI-07 | All | Hiển thị trên màn hình rộng (desktop) | Form không bị kéo giãn quá mức, căn đẹp | Passed | Form được giới hạn chiều rộng trong khung trắng giữa màn hình, không bị kéo giãn tràn lề. |
| UI-08 | All | Độ tương phản và cỡ chữ | Chữ đọc rõ trên nền, cỡ chữ không quá nhỏ | Passed | Chữ xám đậm/đen trên nền trắng hoặc xám nhạt, độ tương phản tốt, dễ đọc. |
| UI-09 | All | Chính tả và ngôn ngữ nhãn | Không lỗi chính tả, không trộn Anh–Việt tuỳ tiện | Failed | Màn hình Login trộn lẫn ngôn ngữ Anh - Việt ("Username", "Sign In" xen kẽ "Mật khẩu", "Quên mật khẩu?"). |

### IA-02: Forms

| ID | Màn hình | Mục kiểm tra | Kết quả mong đợi | Status | Notes |
|---|---|---|---|---|---|
| UI-10 | R | Nhãn từng ô và dấu hiệu trường bắt buộc | Mọi ô có label rõ; trường bắt buộc được đánh dấu | Failed | Có label nhưng không có đánh dấu trường bắt buộc. |
| UI-11 | R | Gửi form khi để trống các trường bắt buộc | Mỗi trường trống có thông báo lỗi riêng | Passed | Có thông báo cần điền vào ô bắt buộc. |
| UI-12 | R | Nhập email sai định dạng | Báo lỗi ngay cạnh ô email | Failed | Không có báo lỗi sai định dạng email mà báo lỗi mật khẩu không đúng định dạng. |
| UI-13 | R | Đăng ký bằng email đã tồn tại (FR-01) | Thông báo email đã được sử dụng, dữ liệu form còn nguyên | Failed | Đăng ký bằng email đã tồn tại (test@eshop.com) kèm mật khẩu đúng quy tắc: chỉ hiện lỗi "Mật khẩu quá yếu", không báo email đã được sử dụng. |
| UI-14 | R | Quy tắc mật khẩu | Quy tắc hiển thị rõ; mật khẩu yếu bị báo lỗi cụ thể | Failed | Quy tắc mật khẩu hiển thị rõ dưới ô nhập và trong thông báo lỗi, và thông báo đúng với trường hợp mật khẩu yếu. Nhưng cùng một thông báo mật khẩu xuất hiện cả khi mật khẩu đúng quy tắc hoặc khi sai ở ô khác, nên không giúp người dùng biết lỗi thật nằm ở đâu. |
| UI-16 | R, L | Ẩn và hiện mật khẩu | Mật khẩu được che; có nút hiện/ẩn hoạt động đúng | Failed | Mật khẩu được che nhưng không có nút hiện mật khẩu. |
| UI-17 | R, P | Độ dài và ký tự không hợp lệ ở họ tên, số điện thoại | Giới hạn độ dài được kiểm soát; ký tự sai bị báo lỗi; khoảng trắng đầu cuối được xử lý | Failed | Đăng ký: mọi trường hợp chỉ hiện thông báo lỗi mật khẩu. Profile: mọi giá trị số điện thoại đã thử (đúng định dạng, không có số 0 đầu, chữ, ký tự đặc biệt) đều bị báo không hợp lệ, không phân biệt được lỗi về độ dài hay ký tự. |
| UI-18 | R, P | Nhập ký tự đặc biệt, emoji, chuỗi giống mã script vào ô văn bản | Được xử lý an toàn, hiển thị nguyên văn, không vỡ giao diện hay chạy mã | Passed | Các ký tự đặc biệt được hệ thống nhận và giữ nguyên vẹn khi kiểm tra bằng API call. Không kiểm tra được qua giao diện vì nút đăng ký và nút cập nhật hồ sơ luôn lỗi API. |
| UI-19 | R, L, P | Giữ dữ liệu đã nhập khi gửi form lỗi | Dữ liệu còn nguyên (trừ mật khẩu) | Failed | Không giữ dữ liệu, toàn bộ đều bị reset. |
| UI-20 | R, L, P | Chống gửi trùng | Nhấn nút nhiều lần chỉ tạo một yêu cầu | Passed | Đã xác nhận: chỉ nhận yêu cầu đầu tiên. |
| UI-21 | R, L, P | Thứ tự Tab và phím Enter | Tab đi theo thứ tự hiển thị; Enter gửi form | Passed | Các phím hoạt động ổn. |
| UI-22 | L | Gửi form đăng nhập khi để trống | Báo lỗi cho từng trường trống | Passed | Có hiển thị đúng vị trí ô trống. |
| UI-23 | L | Đăng nhập sai email hoặc mật khẩu | Thông báo chung, không tiết lộ thông tin nào sai | Passed | Hiển thị thông báo chung "Đăng nhập thất bại", không tiết lộ thông tin nào sai. |
| UI-24 | P | Dữ liệu hiện tại được điền sẵn | Các ô hồ sơ hiển thị đúng thông tin hiện có; ô không được sửa (như email, nếu có) bị khoá và có chú thích | Passed | Kết quả đúng như mong đợi. |
| UI-25 | P | Kiểm tra dữ liệu khi cập nhật hồ sơ | Tên rỗng, số điện thoại sai định dạng bị báo lỗi rõ | Failed | Mọi số điện thoại đã thử, kể cả số đúng theo FR-04 (0912345678, 0123456789) và số không có số 0 đầu, đều bị báo không hợp lệ. Thông báo ghi "9-10 chữ số", khác FR-04 (10-11 chữ số). Không có request nào được gửi tới server. |

> Mục UI-15 (xác nhận mật khẩu không khớp) đã được loại khỏi checklist vì form Register không có ô xác nhận mật khẩu. Số thứ tự của các mục còn lại được giữ nguyên.

### IA-03: Navigation

| ID | Màn hình | Mục kiểm tra | Kết quả mong đợi | Status | Notes |
|---|---|---|---|---|---|
| UI-26 | R, L | Liên kết qua lại giữa Đăng ký và Đăng nhập | Có link rõ ràng, bấm chuyển đúng trang | Passed | Có thể chuyển trực tiếp từ đăng nhập sang đăng ký nếu chưa có tài khoản. |
| UI-27 | R | Chuyển hướng sau khi đăng ký thành công | Chuyển đến trang hợp lý (đăng nhập hoặc trang chủ) | Failed | Khi đăng ký chỉ hiện lỗi sai mật khẩu, không đăng ký thành công được. |
| UI-28 | L | Chuyển hướng sau khi đăng nhập thành công | Về trang chủ hoặc trang người dùng đang cần | Passed | Chuyển hướng đúng khi đăng nhập thành công. |
| UI-29 | P | Truy cập Profile khi chưa đăng nhập | Chuyển về đăng nhập, sau đó quay lại Profile | Passed | Khi chưa đăng nhập, truy cập Profile thì hiện yêu cầu đăng nhập. |
| UI-30 | R, L | Vào Đăng ký hoặc Đăng nhập khi đã đăng nhập | Được xử lý hợp lý (chuyển đi, hoặc thông báo) | Failed | Vào trang Login khi đã đăng nhập thì vẫn hiện form đăng nhập, trong khi góc trái vẫn hiển thị trạng thái đang đăng nhập. |
| UI-31 | P | Lối vào trang Profile và nút Đăng xuất | Dễ tìm trên menu tài khoản, đặt ở vị trí dễ thấy | Passed | Cả 2 nút đều có mặt và đặt ở góc trên bên trái. |
| UI-32 | P | Đăng xuất | Về trang hợp lý; nhấn Back không vào lại được Profile | Passed | Hoạt động tốt. |
| UI-33 | R, L, P | Nút Back của trình duyệt | Không mất dữ liệu bất ngờ, không gửi lại form ngoài ý muốn | Failed | Khi bấm Back, trang luôn reset về trạng thái ban đầu, dữ liệu đã nhập bị mất mà không có cảnh báo; xem là mất dữ liệu bất ngờ. |
| UI-34 | L | Liên kết "Quên mật khẩu" (FR-03) | Có link, bấm đi đúng trang | Passed | Quên mật khẩu hoạt động tốt. |
| UI-35 | P | Huỷ chỉnh sửa hoặc quay lại | Có cách thoát khỏi chỉnh sửa mà không lưu | Passed | Giao diện không có nút Huỷ riêng, nhưng người dùng thoát khỏi trạng thái chỉnh sửa mà không lưu bằng nút Back của trình duyệt. Tiêu chí chỉ yêu cầu có cách thoát không lưu, không bắt buộc phải là nút Huỷ trên giao diện nên xem là đạt. Hạn chế: cách này kém dễ khám phá hơn một nút Huỷ rõ ràng. |
| UI-36 | P | Tải lại trang (F5) khi đã đăng nhập | Vẫn giữ trạng thái đăng nhập, dữ liệu hiển thị đúng | Passed | Reload vẫn giữ trạng thái đăng nhập. |

### IA-04: Feedback / state

| ID | Màn hình | Mục kiểm tra | Kết quả mong đợi | Status | Notes |
|---|---|---|---|---|---|
| UI-37 | R | Thông báo đăng ký thành công | Có phản hồi rõ ràng sau khi đăng ký | Failed | Không đăng ký được, luôn hiện lỗi mật khẩu. |
| UI-38 | R, L, P | Trạng thái đang xử lý khi gửi form | Có loading hoặc nút bị vô hiệu trong lúc chờ | Passed | Request được gửi đi (thấy trong DevTools) và xử lý gần như tức thì; trong lúc tải chỉ thấy màn hình trắng, không có loading indicator riêng. |
| UI-39 | R, L, P | Lỗi mạng hoặc lỗi máy chủ | Thông báo dễ hiểu, có thể thử lại, không hiện lỗi kỹ thuật thô | Passed | Có hiện lỗi kết nối. |
| UI-40 | L | Khoá tài khoản sau nhiều lần đăng nhập sai (FR-02) | Thông báo rõ tài khoản bị khoá và lý do | Failed | Tài khoản có bị khoá (đã kiểm chứng qua API call) nhưng giao diện không hiện lý do không đăng nhập được. |
| UI-41 | L | Hết thời gian khoá hoặc cách mở khoá (FR-02) | Có thông tin thời gian khoá; sau khi hết có thể đăng nhập lại bình thường | Failed | Màn hình không hiện trạng thái khoá; khi bấm đăng nhập với tài khoản bị khoá thì không có phản hồi nào. |
| UI-42 | P | Cập nhật hồ sơ thành công (FR-04) | Có thông báo thành công; thông tin mới hiển thị đúng, kể cả ở header | Failed | Khi cập nhật thì luôn báo lỗi số điện thoại. |
| UI-43 | P | Cập nhật hồ sơ thất bại | Có thông báo rõ; dữ liệu đã nhập không bị mất | Failed | Không thông báo rõ mà chỉ có lỗi số điện thoại. |
| UI-44 | P | Nút Lưu khi chưa thay đổi gì | Nút bị vô hiệu hoặc không gây lỗi | Failed | Nút bấm sẽ báo lỗi số điện thoại khi chưa nhập gì. |
| UI-45 | P | Rời trang khi có thay đổi chưa lưu | Có cảnh báo xác nhận trước khi thoát | Failed | Không có cảnh báo, các thay đổi sẽ mất. |
| UI-46 | All | Trạng thái hover, focus, disabled của nút và link | Có phản hồi hình ảnh rõ ràng cho từng trạng thái | Passed | Các trạng thái hover, focus hoạt động bình thường. |
| UI-47 | P | Phiên đăng nhập hết hạn | Có thông báo và chuyển về màn hình mặc định, không lỗi trắng trang | Passed | Có pop-up nhỏ thông báo phiên hoạt động đã hết; ứng dụng tự động về màn hình mặc định (hiển thị danh sách sản phẩm, không thể thêm vào giỏ hàng, có nút Đăng nhập và Đăng ký ở góc trái). Đây không phải màn hình đăng nhập. |

---

## 3. Các mục AI bỏ sót (tác giả tự bổ sung)

| ID | IA | Màn hình | Mục kiểm tra | Kết quả mong đợi | Vì sao AI bỏ sót | Status | Notes |
|---|---|---|---|---|---|---|---|
| UI-48 | IA-01 | All | Phóng to trang lên 200% (Ctrl + "+") | Nội dung vẫn đọc và thao tác được: không chồng lấn, nút và ô nhập không bị che hay mất, không phải cuộn ngang quá mức. | AI kiểm tra responsive theo kích thước màn hình nhưng ít nghĩ tới việc người dùng tự phóng to trang (do thị lực hoặc thói quen), là tình huống accessibility không nằm trong các nhóm IA mà prompt gợi ý. | Passed | Giao diện scale tốt khi phóng to 200%, không phát sinh lỗi hay vấn đề nào. |
| UI-49 | IA-02 | R, L | Thuộc tính tự động điền của trình duyệt (Autocomplete) | Các ô nhập liệu có thiết lập thuộc tính HTML `autocomplete` chuẩn (VD: `email`, `new-password`, `current-password`) để trình duyệt dễ dàng gợi ý và điền tự động. | Các checklist tự động thường tập trung vào logic kiểm tra tính đúng đắn của dữ liệu thay vì tiện ích thao tác (UX) sinh ra từ trình duyệt. | Passed | Các phần autocomplete hoạt động ổn. |
| UI-50 | IA-02 | R, L | Hành vi Copy/Paste tại ô Mật khẩu / Xác nhận mật khẩu | Có thể dán (Paste) mật khẩu từ clipboard một cách bình thường | Đây là một tương tác cấp hệ điều hành (OS/Browser interaction) nên thường bị sót khi chỉ tập trung đánh giá các yếu tố của trang web. | Passed | Có thể dán mật khẩu và các ô dữ liệu bình thường. |
| UI-51 | IA-03 | L | Xử lý phiên làm việc trên nhiều tab (Multi-tab behaviour) | Đăng nhập cùng một tài khoản trên 2 tab đều hoạt động bình thường; đăng xuất ở một tab không gây lỗi hay trạng thái hỏng ở tab còn lại. | AI phân tích theo luồng tuyến tính trên một màn hình đơn lẻ, hiếm khi tự động nghĩ ra kịch bản người dùng mở song song nhiều tab. | Passed | Các tab hoạt động độc lập: đăng nhập nhiều tab đều thành công, đăng xuất ở một tab không ảnh hưởng tab kia. Không kiểm tra việc đổi hồ sơ giữa các tab vì chức năng cập nhật hồ sơ không dùng được. |
| UI-52 | IA-04 | R, P | Thời gian hiển thị thông báo (Toast/Alert Timeout) | Các thông báo nổi (như "Đăng ký thành công", "Cập nhật thành công") sẽ tự động biến mất sau 3-5 giây để không che khuất màn hình vĩnh viễn | AI đã liệt kê việc "phải có thông báo" (UI-37, UI-42) nhưng bỏ quên khía cạnh vòng đời hiển thị (khi nào thì nó biến mất) của các thành phần nổi | Failed | Các thông báo sẽ hiện vĩnh viễn tới khi tải lại trang. |

---

## 4. Tóm tắt thực thi

| Chỉ số | Giá trị |
|---|---|
| Số màn hình đã test | 3 (Register, Login, Profile) |
| Số mục thiết kế | 46 (AI) + 5 (tự thêm) = 51 |
| Số mục đã thực thi | 51 |
| Passed | 29 |
| Failed | 22 |
| Số bug đã báo trên GitHub Issues | |
