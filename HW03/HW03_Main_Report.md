# HW03 – GUI & Usability: Báo cáo chính

| Hạng mục | Nội dung |
|---|---|
| Bài tập | HW03-AI – GUI & Usability (bài cá nhân) |
| Sinh viên | 23120056 - Hà QUốc Kiên |
| SUT | EShop – https://github.com/ttbhanh/eshop-sut (frontend `http://localhost:5173`, backend `http://localhost:3000`) |
| Kho GitHub Issues | https://github.com/faker26052005-lgtm/SUT-EShop/issues |
| Phạm vi | Màn hình Register, Login, Profile (Pool A: FR-01, FR-02, FR-04); flow tìm kiếm sản phẩm và xem chi tiết (FR-05, FR-06) |
| Công cụ AI | Xem AI Audit Report (tài liệu đính kèm) |

## Mục lục

1. Tóm tắt kết quả
2. Task 1 – GUI Checklist
3. Task 2 – Usability Evaluation
4. Task 3 – Cross-browser / Cross-platform
5. Kết luận chung
6. Tài liệu nộp kèm

---

## 1. Tóm tắt kết quả

| Chỉ số | Giá trị |
|---|---|
| Số màn hình đã kiểm thử (Task 1) | 3 (Register, Login, Profile) |
| Số flow đánh giá usability (Task 2) | 1 (tìm kiếm sản phẩm → xem danh sách kết quả → mở chi tiết sản phẩm) |
| Số mục checklist đã thiết kế | 51 (46 do AI sinh sau khi rà soát + 5 tự bổ sung) |
| Số mục đã thực thi | 51 |
| Passed / Failed (Firefox 157, Task 1) | 29 / 22 |
| Passed / Failed (Chrome 159) | 28 / 23 |
| Passed / Failed (Safari 27) | 29 / 22 |
| Số bug | 15 (14 từ Task 1, 1 từ Task 3); mức độ: 2 High, 5 Medium, 8 Low |
| Số người tham gia usability | 7 (cộng 1 người cho buổi thử pilot) |
| Điểm SUS trung bình (7 người) | 44,6 |
| Số nền tảng (Task 3) | 3 (Firefox, Chrome, Safari) |

Ba kết quả chính:
1. Checklist 51 mục phát hiện 22 mục Failed, gộp thành 14 lỗi. Hai lỗi mức High (GUI-BUG-01, GUI-BUG-03) khiến người dùng không đăng ký được tài khoản và không cập nhật được hồ sơ qua giao diện.
2. Đánh giá usability với 7 người cho điểm SUS trung bình 44,6 (dưới mốc tham khảo 68). Cả 7 người hoàn thành nhiệm vụ nhưng 5 trong 7 người không tin tưởng thông tin ở trang chi tiết sản phẩm.
3. Chạy lại checklist trên ba nền tảng cho kết quả giống nhau, trừ một khác biệt duy nhất: mật khẩu dán vào ô mật khẩu bị hiển thị rõ trên Chrome (GUI-BUG-15).

---

## 2. Task 1 – GUI Checklist

### 2.1 Phạm vi và môi trường

| Hạng mục | Nội dung |
|---|---|
| Màn hình kiểm thử | Register, Login, Profile |
| Yêu cầu liên quan | FR-01 (Đăng ký), FR-02 (Đăng nhập và khoá tài khoản), FR-04 (Quản lý hồ sơ cá nhân) |
| Khía cạnh giao diện | IA-01 (General UI), IA-02 (Forms), IA-03 (Navigation), IA-04 (Feedback / state) |
| Môi trường thực thi | Firefox 157, Windows, chạy trực tiếp trên máy |
| Cách ghi kết quả | Chỉ dùng **Passed** hoặc **Failed**; cột Notes ghi lý do với mục Failed; chỉ chụp ảnh các mục Failed |

Ký hiệu cột Màn hình: **R** = Register, **L** = Login, **P** = Profile, **All** = cả ba.

### 2.2 Phương pháp

1. AI được dùng để sinh bản nháp checklist theo từng khía cạnh giao diện IA-01 đến IA-04 (chi tiết prompt và kết quả nằm trong AI Audit Report).
2. Tác giả rà soát từng mục AI sinh, đối chiếu với giao diện thực tế của EShop và yêu cầu FR-01, FR-02, FR-04.
3. Tác giả bổ sung các mục AI bỏ sót và giải thích lý do (mục 2.4).
4. Thực thi toàn bộ checklist trên Firefox, ghi Passed/Failed và Notes cho từng mục, chụp ảnh các mục Failed.
5. Các mục Failed có cùng biểu hiện được gộp thành lỗi và báo trên GitHub Issues kèm ảnh chụp.

### 2.3 Rà soát các mục do AI sinh

- AI sinh 47 mục (UI-01 đến UI-47). Mục **UI-15** (xác nhận mật khẩu không khớp) bị **loại** vì form Register của EShop không có ô xác nhận mật khẩu. Số thứ tự các mục còn lại được giữ nguyên, nên checklist AI sinh còn 46 mục.
- Các mục AI sinh còn lại được giữ và thực thi trên giao diện thật. Với một số mục, kết quả mong đợi được đối chiếu lại theo yêu cầu thật của hệ thống (ví dụ quy tắc số điện thoại của FR-04).

### 2.4 Các mục AI bỏ sót (tác giả tự bổ sung)

| ID | IA | Màn hình | Mục kiểm tra | Vì sao AI bỏ sót | Status |
|---|---|---|---|---|---|
| UI-48 | IA-01 | All | Phóng to trang lên 200% (Ctrl + "+"): nội dung vẫn đọc và thao tác được, không chồng lấn, không mất nút/ô nhập | AI kiểm tra responsive theo kích thước màn hình nhưng ít nghĩ tới việc người dùng tự phóng to trang (do thị lực hoặc thói quen). Đây là tình huống accessibility không nằm trong các nhóm IA mà prompt gợi ý (nguyên nhân: giới hạn của prompt) | Passed |
| UI-49 | IA-02 | R, L | Thuộc tính tự động điền của trình duyệt (`autocomplete`: `email`, `new-password`, `current-password`) | Checklist do AI sinh thường tập trung vào logic kiểm tra tính đúng đắn của dữ liệu hơn là tiện ích thao tác (UX) do trình duyệt cung cấp (nguyên nhân: thiên lệch của mô hình) | Passed |
| UI-50 | IA-02 | R, L | Hành vi Copy/Paste tại ô Mật khẩu: có thể dán mật khẩu từ clipboard bình thường | Đây là tương tác cấp hệ điều hành/trình duyệt nên dễ bị sót khi chỉ đánh giá các yếu tố của trang web (nguyên nhân: đặc điểm giao diện được test) | Passed (Firefox) |
| UI-51 | IA-03 | L | Xử lý phiên làm việc trên nhiều tab: đăng nhập cùng tài khoản trên 2 tab, đăng xuất ở một tab không gây lỗi ở tab còn lại | AI phân tích theo luồng tuyến tính trên một màn hình đơn lẻ, hiếm khi tự nghĩ ra kịch bản mở song song nhiều tab (nguyên nhân: giới hạn của mô hình) | Passed |
| UI-52 | IA-04 | R, P | Thời gian hiển thị thông báo nổi (toast/alert): tự biến mất sau khoảng 3–5 giây | AI đã liệt kê việc "phải có thông báo" (UI-37, UI-42) nhưng bỏ quên vòng đời hiển thị của các thành phần nổi (nguyên nhân: prompt chưa hỏi về trạng thái theo thời gian) | **Failed** |

Về các nhóm AI thường bỏ sót: RTL (chữ viết từ phải sang trái) và dark mode không được thêm vì EShop là ứng dụng tiếng Việt viết từ trái sang phải và không có chế độ giao diện tối, nên các mục này không áp dụng cho SUT.

### 2.5 Kết quả thực thi theo khía cạnh giao diện (Firefox 157)

| Khía cạnh | Số mục | Passed | Failed |
|---|---|---|---|
| IA-01: General UI standards | 10 | 7 | 3 |
| IA-02: Forms | 17 | 9 | 8 |
| IA-03: Navigation | 12 | 9 | 3 |
| IA-04: Feedback / state | 12 | 4 | 8 |
| **Tổng** | **51** | **29** | **22** |

Phần lớn mục Failed tập trung ở IA-02 (Forms) và IA-04 (Feedback / state): 16 trên 22 mục.

### 2.6 Bảng checklist đã thực thi

Cột "Kết quả mong đợi" của từng mục nằm trong file Excel của checklist (nộp kèm). Cột Bug cho biết mục Failed thuộc lỗi nào ở mục 2.7.

| ID | IA | Màn hình | Mục kiểm tra | Status | Notes | Bug |
|---|---|---|---|---|---|---|
| UI-01 | IA-01 | All | Header, logo, font chữ nhất quán giữa ba màn hình | Passed | Bố cục header với logo bên trái, menu bên phải và font chữ chung được giữ nhất quán qua cả 3 màn hình. | |
| UI-02 | IA-01 | All | Màu sắc và style nút chính (Đăng ký, Đăng nhập, Lưu) | Failed | Màn hình Register dùng nút "Đăng Ký" màu đỏ, trong khi màn hình Login ("Sign In") và Profile ("Cập nhật") dùng nút màu xanh. Thiếu nhất quán về màu sắc. | GUI-BUG-07 |
| UI-03 | IA-01 | All | Căn lề và khoảng cách giữa các thành phần trong form | Passed | Form đặt gọn trong thẻ (card) giữa màn hình, các ô input và chữ được căn lề đều đặn. | |
| UI-04 | IA-01 | All | Hiển thị tiếng Việt có dấu | Passed | Tiếng Việt hiển thị tốt, không lỗi font hay vỡ ký tự. | |
| UI-05 | IA-01 | All | Tiêu đề trang và tiêu đề tab trình duyệt | Failed | Tiêu đề trên màn hình Login sai (hiển thị "Đăng Ký" thay vì "Đăng Nhập"). | GUI-BUG-05 |
| UI-06 | IA-01 | All | Responsive trên màn hình nhỏ (khoảng 375px) | Passed | Giao diện tự động scale lại. | |
| UI-07 | IA-01 | All | Hiển thị trên màn hình rộng (desktop) | Passed | Form được giới hạn chiều rộng trong khung trắng giữa màn hình, không bị kéo giãn tràn lề. | |
| UI-08 | IA-01 | All | Độ tương phản và cỡ chữ | Passed | Chữ xám đậm/đen trên nền trắng hoặc xám nhạt, độ tương phản tốt, dễ đọc. | |
| UI-09 | IA-01 | All | Chính tả và ngôn ngữ nhãn | Failed | Màn hình Login trộn lẫn tiếng Anh và tiếng Việt ("Username", "Sign In" xen kẽ "Mật khẩu", "Quên mật khẩu?"). | GUI-BUG-06 |
| UI-10 | IA-02 | R | Nhãn từng ô và dấu hiệu trường bắt buộc | Failed | Có label nhưng không có đánh dấu trường bắt buộc. | GUI-BUG-08 |
| UI-11 | IA-02 | R | Gửi form khi để trống các trường bắt buộc | Passed | Có thông báo cần điền vào ô bắt buộc. | |
| UI-12 | IA-02 | R | Nhập email sai định dạng | Failed | Không có báo lỗi sai định dạng email mà báo lỗi mật khẩu không đúng định dạng. | GUI-BUG-02 |
| UI-13 | IA-02 | R | Đăng ký bằng email đã tồn tại (FR-01) | Failed | Đăng ký bằng email đã tồn tại (test@eshop.com) kèm mật khẩu đúng quy tắc: chỉ hiện lỗi "Mật khẩu quá yếu", không báo email đã được sử dụng. | GUI-BUG-02 |
| UI-14 | IA-02 | R | Quy tắc mật khẩu | Failed | Quy tắc mật khẩu hiển thị rõ dưới ô nhập và trong thông báo lỗi, và thông báo đúng với trường hợp mật khẩu yếu. Nhưng cùng một thông báo xuất hiện cả khi mật khẩu đúng quy tắc hoặc khi sai ở ô khác, nên không giúp người dùng biết lỗi thật nằm ở đâu. | GUI-BUG-02 |
| UI-16 | IA-02 | R, L | Ẩn và hiện mật khẩu | Failed | Mật khẩu được che nhưng không có nút hiện mật khẩu. | GUI-BUG-09 |
| UI-17 | IA-02 | R, P | Độ dài và ký tự không hợp lệ ở họ tên, số điện thoại | Failed | Đăng ký: mọi trường hợp chỉ hiện thông báo lỗi mật khẩu. Profile: mọi giá trị số điện thoại đã thử (đúng định dạng, không có số 0 đầu, chữ, ký tự đặc biệt) đều bị báo không hợp lệ, không phân biệt được lỗi độ dài hay ký tự. | GUI-BUG-03 |
| UI-18 | IA-02 | R, P | Nhập ký tự đặc biệt, emoji, chuỗi giống mã script vào ô văn bản | Passed | Các ký tự đặc biệt được hệ thống nhận và giữ nguyên vẹn khi kiểm tra bằng API call. Không kiểm tra được qua giao diện vì nút đăng ký và nút cập nhật hồ sơ luôn báo lỗi. | |
| UI-19 | IA-02 | R, L, P | Giữ dữ liệu đã nhập khi gửi form lỗi | Failed | Không giữ dữ liệu, toàn bộ bị reset. | GUI-BUG-10 |
| UI-20 | IA-02 | R, L, P | Chống gửi trùng | Passed | Đã xác nhận: chỉ nhận yêu cầu đầu tiên. | |
| UI-21 | IA-02 | R, L, P | Thứ tự Tab và phím Enter | Passed | Các phím hoạt động ổn. | |
| UI-22 | IA-02 | L | Gửi form đăng nhập khi để trống | Passed | Hiển thị đúng vị trí ô trống. | |
| UI-23 | IA-02 | L | Đăng nhập sai email hoặc mật khẩu | Passed | Hiển thị thông báo chung "Đăng nhập thất bại", không tiết lộ thông tin nào sai. | |
| UI-24 | IA-02 | P | Dữ liệu hiện tại được điền sẵn | Passed | Kết quả đúng như mong đợi. | |
| UI-25 | IA-02 | P | Kiểm tra dữ liệu khi cập nhật hồ sơ | Failed | Mọi số điện thoại đã thử, kể cả số đúng theo FR-04 (0912345678, 0123456789) và số không có số 0 đầu, đều bị báo không hợp lệ. Thông báo ghi "9-10 chữ số", khác FR-04 (10-11 chữ số). Không có request nào được gửi tới server. | GUI-BUG-03 |
| UI-26 | IA-03 | R, L | Liên kết qua lại giữa Đăng ký và Đăng nhập | Passed | Có thể chuyển trực tiếp từ đăng nhập sang đăng ký nếu chưa có tài khoản. | |
| UI-27 | IA-03 | R | Chuyển hướng sau khi đăng ký thành công | Failed | Khi đăng ký chỉ hiện lỗi sai mật khẩu, không đăng ký thành công được. | GUI-BUG-01 |
| UI-28 | IA-03 | L | Chuyển hướng sau khi đăng nhập thành công | Passed | Chuyển hướng đúng khi đăng nhập thành công. | |
| UI-29 | IA-03 | P | Truy cập Profile khi chưa đăng nhập | Passed | Khi chưa đăng nhập, truy cập Profile thì hiện yêu cầu đăng nhập. | |
| UI-30 | IA-03 | R, L | Vào Đăng ký hoặc Đăng nhập khi đã đăng nhập | Failed | Vào trang Login khi đã đăng nhập thì vẫn hiện form đăng nhập, trong khi góc trái vẫn hiển thị trạng thái đang đăng nhập. | GUI-BUG-12 |
| UI-31 | IA-03 | P | Lối vào trang Profile và nút Đăng xuất | Passed | Cả 2 nút đều có mặt và đặt ở góc trên bên trái. | |
| UI-32 | IA-03 | P | Đăng xuất | Passed | Hoạt động tốt. | |
| UI-33 | IA-03 | R, L, P | Nút Back của trình duyệt | Failed | Khi bấm Back, trang luôn reset về trạng thái ban đầu, dữ liệu đã nhập bị mất mà không có cảnh báo. | GUI-BUG-11 |
| UI-34 | IA-03 | L | Liên kết "Quên mật khẩu" (FR-03) | Passed | Quên mật khẩu hoạt động tốt. | |
| UI-35 | IA-03 | P | Huỷ chỉnh sửa hoặc quay lại | Passed | Giao diện không có nút Huỷ riêng, nhưng người dùng thoát khỏi trạng thái chỉnh sửa mà không lưu bằng nút Back của trình duyệt. Tiêu chí chỉ yêu cầu có cách thoát không lưu nên xem là đạt. Hạn chế: kém dễ khám phá hơn một nút Huỷ rõ ràng. | |
| UI-36 | IA-03 | P | Tải lại trang (F5) khi đã đăng nhập | Passed | Reload vẫn giữ trạng thái đăng nhập. | |
| UI-37 | IA-04 | R | Thông báo đăng ký thành công | Failed | Không đăng ký được, luôn hiện lỗi mật khẩu. | GUI-BUG-01 |
| UI-38 | IA-04 | R, L, P | Trạng thái đang xử lý khi gửi form | Passed | Request được gửi đi (thấy trong DevTools) và xử lý gần như tức thì; các nút bị vô hiệu trong lúc xử lý nên xem là đạt. Hạn chế: trong lúc tải chỉ thấy màn hình trắng, không có loading indicator riêng. | |
| UI-39 | IA-04 | R, L, P | Lỗi mạng hoặc lỗi máy chủ | Passed | Có hiện lỗi kết nối. | |
| UI-40 | IA-04 | L | Khoá tài khoản sau nhiều lần đăng nhập sai (FR-02) | Failed | Tài khoản có bị khoá (đã kiểm chứng qua API call) nhưng giao diện không hiện lý do không đăng nhập được. | GUI-BUG-04 |
| UI-41 | IA-04 | L | Hết thời gian khoá hoặc cách mở khoá (FR-02) | Failed | Màn hình không hiện trạng thái khoá; khi bấm đăng nhập với tài khoản bị khoá thì không có phản hồi nào. | GUI-BUG-04 |
| UI-42 | IA-04 | P | Cập nhật hồ sơ thành công (FR-04) | Failed | Khi cập nhật thì luôn báo lỗi số điện thoại. | GUI-BUG-03 |
| UI-43 | IA-04 | P | Cập nhật hồ sơ thất bại | Failed | Không có thông báo rõ mà chỉ có lỗi số điện thoại. | GUI-BUG-03 |
| UI-44 | IA-04 | P | Nút Lưu khi chưa thay đổi gì | Failed | Nút bấm báo lỗi số điện thoại khi chưa nhập gì. | GUI-BUG-03 |
| UI-45 | IA-04 | P | Rời trang khi có thay đổi chưa lưu | Failed | Không có cảnh báo, các thay đổi bị mất. | GUI-BUG-13 |
| UI-46 | IA-04 | All | Trạng thái hover, focus, disabled của nút và link | Passed | Các trạng thái hover, focus hoạt động bình thường. | |
| UI-47 | IA-04 | P | Phiên đăng nhập hết hạn | Passed | Có pop-up nhỏ thông báo phiên hoạt động đã hết; ứng dụng tự động về màn hình mặc định (danh sách sản phẩm, không thể thêm vào giỏ hàng, có nút Đăng nhập và Đăng ký ở góc trái). Đây không phải màn hình đăng nhập. | |
| UI-48 | IA-01 | All | Phóng to trang lên 200% | Passed | Giao diện scale tốt khi phóng to 200%, không phát sinh lỗi. | |
| UI-49 | IA-02 | R, L | Thuộc tính tự động điền (Autocomplete) | Passed | Các phần autocomplete hoạt động ổn. | |
| UI-50 | IA-02 | R, L | Copy/Paste tại ô Mật khẩu | Passed | Trên Firefox có thể dán mật khẩu bình thường. Trên Chrome mục này Failed (xem Task 3 và GUI-BUG-15). | |
| UI-51 | IA-03 | L | Xử lý phiên làm việc trên nhiều tab | Passed | Các tab hoạt động độc lập: đăng nhập nhiều tab đều thành công, đăng xuất ở một tab không ảnh hưởng tab kia. Không kiểm tra việc đổi hồ sơ giữa các tab vì chức năng cập nhật hồ sơ không dùng được. | |
| UI-52 | IA-04 | R, P | Thời gian hiển thị thông báo nổi (Toast/Alert Timeout) | Failed | Các thông báo hiện vĩnh viễn cho đến khi tải lại trang. | GUI-BUG-14 |

**Lưu ý khi đọc kết quả:** UI-18 được xác nhận bằng API call (không qua giao diện) vì hai chức năng đăng ký và cập nhật hồ sơ luôn báo lỗi trên giao diện; UI-38 được xem là đạt vì nút bị vô hiệu trong lúc xử lý, dù không có loading indicator riêng.

### 2.7 Danh sách bug

Các mục Failed có cùng biểu hiện được gộp thành một bug. Chi tiết từng bug (các bước tái hiện, kết quả thực tế, kết quả mong đợi, bằng chứng) nằm trong Bug Report và trên GitHub Issues.

| Bug ID | Màn hình | Tiêu đề | Mức độ | Mục checklist | Issue |
|---|---|---|---|---|---|
| GUI-BUG-01 | Register | Đăng ký luôn bị từ chối với thông báo "Mật khẩu quá yếu" dù mật khẩu đúng quy tắc | High | UI-27, UI-37 | [#103](https://github.com/faker26052005-lgtm/SUT-EShop/issues/103) |
| GUI-BUG-02 | Register | Form đăng ký chỉ có một thông báo lỗi mật khẩu cho mọi trường hợp, không chỉ ra ô sai thực sự | Medium | UI-12, UI-13, UI-14 | [#104](https://github.com/faker26052005-lgtm/SUT-EShop/issues/104) |
| GUI-BUG-03 | Profile | Cập nhật hồ sơ luôn bị từ chối với thông báo "Số điện thoại không hợp lệ" dù nhập đúng định dạng | High | UI-17, UI-25, UI-42, UI-43, UI-44 | [#105](https://github.com/faker26052005-lgtm/SUT-EShop/issues/105) |
| GUI-BUG-04 | Login | Tài khoản bị khoá nhưng giao diện không phản hồi | Medium | UI-40, UI-41 | [#106](https://github.com/faker26052005-lgtm/SUT-EShop/issues/106) |
| GUI-BUG-05 | Login | Tiêu đề màn hình Login hiển thị là "Đăng Ký" | Low | UI-05 | [#107](https://github.com/faker26052005-lgtm/SUT-EShop/issues/107) |
| GUI-BUG-06 | Login | Màn hình Login trộn lẫn tiếng Anh và tiếng Việt | Low | UI-09 | [#108](https://github.com/faker26052005-lgtm/SUT-EShop/issues/108) |
| GUI-BUG-07 | Register, Login, Profile | Màu nút chính không nhất quán giữa các màn hình | Low | UI-02 | [#109](https://github.com/faker26052005-lgtm/SUT-EShop/issues/109) |
| GUI-BUG-08 | Register | Form đăng ký không đánh dấu các trường bắt buộc | Low | UI-10 | [#110](https://github.com/faker26052005-lgtm/SUT-EShop/issues/110) |
| GUI-BUG-09 | Register, Login | Không có nút hiện/ẩn mật khẩu | Low | UI-16 | [#111](https://github.com/faker26052005-lgtm/SUT-EShop/issues/111) |
| GUI-BUG-10 | Register, Login, Profile | Form bị xoá toàn bộ dữ liệu khi gửi lỗi | Medium | UI-19 | [#112](https://github.com/faker26052005-lgtm/SUT-EShop/issues/112) |
| GUI-BUG-11 | Register, Login, Profile | Nút Back của trình duyệt làm mất dữ liệu đang nhập | Medium | UI-33 | [#113](https://github.com/faker26052005-lgtm/SUT-EShop/issues/113) |
| GUI-BUG-12 | Login | Vẫn hiện form Login khi đã đăng nhập | Low | UI-30 | [#114](https://github.com/faker26052005-lgtm/SUT-EShop/issues/114) |
| GUI-BUG-13 | Profile | Không cảnh báo khi rời Profile có thay đổi chưa lưu | Low | UI-45 | [#115](https://github.com/faker26052005-lgtm/SUT-EShop/issues/115) |
| GUI-BUG-14 | Register, Profile | Thông báo nổi không tự biến mất | Low | UI-52 | [#116](https://github.com/faker26052005-lgtm/SUT-EShop/issues/116) |
| GUI-BUG-15 | Register, Login | Mật khẩu dán từ clipboard hiển thị dạng chữ thường, không bị che, trên Chrome (phát hiện ở Task 3) | Medium | UI-50 | [#161](https://github.com/faker26052005-lgtm/SUT-EShop/issues/161) |

Thống kê: 2 High, 5 Medium, 8 Low; tổng 15 bug (14 bug từ lần chạy Firefox ở Task 1, 1 bug riêng của Chrome từ Task 3).

### 2.8 Nhận xét

- Hai bug mức High đều chặn một luồng chính: không đăng ký được tài khoản (GUI-BUG-01) và không cập nhật được hồ sơ (GUI-BUG-03). Hai lỗi này kéo theo 7 trong 22 mục Failed.
- Cả hai lỗi trên đều cho thấy giao diện không gửi request nào tới server khi bấm nút (quan sát bằng tab Network), nên người dùng không có cách nào hoàn thành thao tác.
- Nhóm lỗi về phản hồi và trạng thái (không có thông báo khoá tài khoản, thông báo nổi không tự biến mất, không cảnh báo thay đổi chưa lưu) làm người dùng không biết hệ thống đang ở trạng thái nào.
- Nhóm lỗi về tính nhất quán (màu nút, tiêu đề, ngôn ngữ nhãn) có mức độ Low nhưng dễ nhận thấy khi chuyển giữa các màn hình.

---

## 3. Task 2 – Usability Evaluation

### 3.1 Tổng quan

| Hạng mục | Nội dung |
|---|---|
| Flow được đánh giá | Tìm kiếm sản phẩm theo tên → Xem các sản phẩm hiện ra → Mở chi tiết sản phẩm |
| Yêu cầu liên quan | Pool A: FR-05 (Product listing and search), FR-06 (Product detail view) |
| Điều kiện ban đầu | Đã đăng nhập vào tài khoản test |
| Nhiệm vụ thực hiện | Tìm kiếm sản phẩm có chứa chữ "mac", xem các sản phẩm hiện ra, bấm vào thông tin chi tiết của sản phẩm đầu tiên |
| Người thực hiện khảo sát | Hà Quốc Kiên |
| Số người tham gia | 7 người thật (P1–P7) và 1 buổi thử (pilot) |
| Công cụ đo | SUS (System Usability Scale) và 4 câu hỏi mở |
| Ghi nhận | Ghi màn hình, không có âm thanh (người tham gia không muốn dùng micro); phiếu SUS và câu trả lời mở; ghi chú quan sát được tổng hợp lại sau buổi thử từ bản ghi màn hình |

**Lưu ý về phạm vi chức năng:** theo yêu cầu, FR-05 và FR-06 chỉ gồm danh sách sản phẩm với tìm kiếm theo tên và trang chi tiết sản phẩm. EShop không có bộ lọc; việc thiếu bộ lọc không được xem là lỗi mà chỉ được ghi nhận như nhận xét về thiết kế.

### 3.2 Mục tiêu đánh giá

1. Người dùng có tìm được sản phẩm và mở được trang chi tiết bằng ô tìm kiếm theo tên mà không cần hướng dẫn không?
2. Ô tìm kiếm có dễ nhận ra, dễ dùng và hoạt động đúng như người dùng mong đợi không?
3. Khi đi nhầm hoặc tìm không ra, người dùng quay lại bằng cách nào và có gặp bế tắc không?
4. Trang chi tiết có đủ thông tin để người dùng tự tin quyết định mua, và họ có tin tưởng thông tin hiển thị không?

### 3.3 Nhiệm vụ và tiêu chí hoàn thành

Người tham gia được yêu cầu: **tìm kiếm sản phẩm có chứa chữ "mac", xem các sản phẩm hiện ra, rồi bấm vào thông tin chi tiết của sản phẩm đầu tiên** (đã đăng nhập sẵn bằng tài khoản test).

| Kết quả | Định nghĩa |
|---|---|
| Thành công | Tới được trang chi tiết của sản phẩm đầu tiên trong kết quả, không cần hỗ trợ |
| Thành công có hỗ trợ | Hoàn thành sau khi người điều phối phải đưa một gợi ý trung tính |
| Thất bại | Từ bỏ, hoặc không tới được trang chi tiết |

### 3.4 Công cụ đánh giá

- **SUS:** thang chuẩn gồm 10 câu, mỗi câu trả lời theo mức 1 đến 5, quy đổi thành điểm 0–100. Thang này được chọn vì ngắn, phổ biến, phù hợp với mẫu nhỏ và người tham gia không chuyên về kỹ thuật. Phiếu và cách tính nằm ở Phụ lục A.
- **Câu hỏi mở** (hỏi cả 7 người sau khi làm xong phiếu SUS):

| Nhóm | Câu hỏi |
|---|---|
| Rõ ràng | "Có chỗ nào trên trang mà bạn không hiểu hoặc không chắc nó dùng để làm gì không?" |
| Khôi phục lỗi | "Lúc bạn đi nhầm hoặc tìm không ra, bạn đã làm gì để quay lại? Việc đó dễ hay khó?" |
| Tốc độ | "Bạn thấy việc tìm sản phẩm trên trang này nhanh hay chậm?" |
| Tin tưởng | "Thông tin ở trang chi tiết có đủ để bạn quyết định mua không, và bạn có tin thông tin đó không?" |

- **Chỉ số khác:** kết quả hoàn thành, thời gian hoàn thành (ước lượng từ bản ghi màn hình) và việc người điều phối có phải gợi ý hay không (mục 3.7.1). Mức độ lúng túng của từng người được ghi nhận định tính ở mục 3.7.4; số lần đi sai hướng không được đo riêng.

### 3.5 Người tham gia

Tiêu chí: người có thói quen mua sắm trực tuyến, không thuộc lớp đang học HW03, ưu tiên người không làm IT hoặc kiểm thử. Thông tin liên hệ được che 4 số giữa.

| Mã | Họ tên | Liên hệ (SĐT, che 4 số giữa) | Ngày buổi thử |
|---|---|---|---|
| PILOT | Nguyễn Thiện Nhân | MSSV: 23120064 | 04/11/2026 |
| P1 | Hà Quốc Bảo | 090****864 | 08/11/2026 |
| P2 | Hà Quốc Khải | 086****311 | 08/11/2026 |
| P3 | Lý Trương Thùy Linh | 079****790 | 08/11/2026 |
| P4 | Hồ Minh Hiếu | 093****805 | 08/11/2026 |
| P5 | Dương Trọng Hòa | 092****901 | 08/11/2026 |
| P6 | Lý Trương Liễu | 076****320 | 08/11/2026 |
| P7 | Hà Thái Linh | 076****369 | 08/11/2026 |

### 3.6 Buổi thử (Pilot)

Buổi thử với Nguyễn Thiện Nhân được thực hiện ngày 04/11/2026 để kiểm tra luồng hoạt động trước khi chạy 7 buổi thật. Buổi thử chỉ xác nhận luồng chạy ổn định, không phát hiện vấn đề cần điều chỉnh nên kịch bản và câu hỏi được giữ nguyên. Buổi này không được tính vào 7 người tham gia và điểm SUS.

### 3.7 Kết quả

#### 3.7.1 Kết quả từng người

Thời gian là **ước lượng từ bản ghi màn hình**, không đo bằng đồng hồ.

| Mã | Kết quả hoàn thành | Thời gian (ước lượng) | Gợi ý từ người điều phối | Ghi chú | Điểm SUS |
|---|---|---|---|---|---|
| P1 | Thành công | khoảng 20–25 giây | Không ghi nhận | Lúng túng nhẹ với nút xem chi tiết; dùng nút Search vì Enter không hoạt động | 35,0 |
| P2 | Thành công | khoảng 10–15 giây | Không ghi nhận | Sử dụng tốt, hiểu nhanh | 80,0 |
| P3 | Thành công | khoảng 10–15 giây | Không ghi nhận | | 35,0 |
| P4 | Thành công | khoảng 10–15 giây | Không | Dùng được mà không cần hướng dẫn | 62,5 |
| P5 | Thành công | khoảng 10–15 giây | Không ghi nhận | Có chút vướng lúc đầu nhưng nhanh chóng dùng được | 35,0 |
| P6 | Thành công có hỗ trợ | khoảng 10–15 giây | Có một gợi ý nhẹ về chỗ bấm nút "Xem chi tiết" | Dùng được sau khi được gợi ý | 52,5 |
| P7 | Thành công | khoảng 20–25 giây | Không ghi nhận | Lúng túng lúc đầu vì các nút bằng tiếng Anh | 12,5 |
| **Tổng hợp** | **7/7 hoàn thành** (6 độc lập, 1 có hỗ trợ) | trung bình khoảng 15 giây | 1/7 có gợi ý | | **44,6** |

*Thời gian trung bình được tính từ điểm giữa của các khoảng ước lượng (12,5 giây cho khoảng 10–15 và 22,5 giây cho khoảng 20–25).*

#### 3.7.2 Điểm SUS

| Thống kê | Giá trị |
|---|---|
| Điểm trung bình (7 người) | **44,6** |
| Trung vị | 35,0 |
| Độ lệch chuẩn (mẫu) | 22,2 |
| Thấp nhất / cao nhất | 12,5 (P7) / 80,0 (P2) |
| Số người dưới 50 điểm | 4 trên 7 (P1, P3, P5, P7) |
| Số người từ 68 điểm trở lên | 1 trên 7 (P2) |

**Nhận xét.** Điểm trung bình 44,6 thấp hơn mốc tham khảo thường dùng khoảng 68 và nằm trong vùng thường được xem là có vấn đề về khả năng sử dụng. Các điểm số phân tán rất rộng (từ 12,5 đến 80,0), nên điểm trung bình chỉ nên được đọc như một xu hướng chung, đặc biệt khi chỉ có 7 người.

**Điểm đóng góp trung bình theo từng câu (thang 0–4, 4 là tốt nhất):**

| Câu | Nội dung rút gọn | Điểm TB |
|---|---|---|
| 1 | Muốn dùng thường xuyên | 0,71 |
| 2 | Phức tạp không cần thiết (đã đảo chiều) | 2,71 |
| 3 | Dễ sử dụng | 1,86 |
| 4 | Cần người hỗ trợ kỹ thuật (đã đảo chiều) | 2,29 |
| 5 | Các chức năng kết hợp tốt | 1,14 |
| 6 | Quá nhiều điểm không nhất quán (đã đảo chiều) | 1,00 |
| 7 | Học cách dùng rất nhanh | 1,86 |
| 8 | Cồng kềnh khi sử dụng (đã đảo chiều) | 1,43 |
| 9 | Tự tin khi sử dụng | 2,00 |
| 10 | Cần học nhiều trước khi dùng (đã đảo chiều) | 2,86 |

Những câu được đánh giá tốt nhất là câu 10, câu 2 và câu 4: người dùng không thấy hệ thống phức tạp hay khó học, và không cần nhiều hỗ trợ. Những câu thấp nhất là câu 1 (muốn dùng thường xuyên), câu 6 (không nhất quán) và câu 5 (các chức năng kết hợp tốt). Có thể hiểu là trang dễ làm quen nhưng chưa tạo được cảm giác đáng tin cậy, nhất quán và hấp dẫn để người dùng muốn quay lại.

#### 3.7.3 Câu trả lời cho các câu hỏi mở

| Mã | Rõ ràng | Khôi phục lỗi | Tốc độ | Tin tưởng |
|---|---|---|---|---|
| P1 | Ô tìm kiếm không nhận phím Enter nên khá khó chịu | Dùng nút Back của trình duyệt, giống các trang web thông thường | Nhanh | Không |
| P2 | Không | Gõ lại, thao tác như bình thường | Tốt | Không có ảnh minh hoạ nên chắc là không |
| P3 | Thắc mắc vì sao không có nút lọc | Dễ | Bình thường | Nhìn như lừa đảo (scam) |
| P4 | Không có | Dễ, chỉ cần nhấn Back | Nhanh | Chắc là không |
| P5 | Không có | Trở về | Bình thường | Có thể |
| P6 | Không | Bình thường | Nhanh | Có thể |
| P7 | Nhiều thứ trên màn hình không có tiếng Việt | Không thấy nút trở về trên màn hình | Bình thường | Không |

**Tổng hợp theo nhóm**
- **Rõ ràng:** 4 trong 7 người không gặp chỗ nào khó hiểu; 3 người nêu vấn đề (ô tìm kiếm không nhận Enter, không có bộ lọc, giao diện lẫn ngôn ngữ).
- **Khôi phục lỗi:** không ai nói bị bế tắc; người dùng thường dùng nút Back của trình duyệt hoặc gõ lại từ khoá. Một người (P7) không thấy nút quay lại trên giao diện.
- **Tốc độ:** không ai thấy chậm; 4 người đánh giá nhanh hoặc tốt, 3 người thấy bình thường.
- **Tin tưởng:** đây là nhóm yếu nhất. 5 trong 7 người trả lời tiêu cực (P1, P2, P3, P4, P7), 2 người trả lời "có thể" (P5, P6), không ai khẳng định tin tưởng hoàn toàn.

#### 3.7.4 Quan sát hành vi trong buổi thử

| Mã | Quan sát hành vi | Phản hồi của người tham gia |
|---|---|---|
| P1 | Không nhấn được Enter để tìm kiếm nên phải dùng nút Search trên màn hình; tỏ ra lúng túng khi chỉ vào nút xem chi tiết | Muốn bổ sung chức năng tìm kiếm bằng phím Enter |
| P2 | Sử dụng tốt, hiểu nhanh cách dùng | Thấy cách trình bày thông tin rối mắt; nhận xét không sản phẩm nào có ảnh minh hoạ |
| P3 | Có vẻ không quá thích dùng app | Phản hồi còn thiếu nhiều chức năng |
| P4 | Sử dụng dễ dàng, không cần hướng dẫn | Tỏ ra không thích app |
| P5 | Có một chút vấn đề lúc đầu nhưng nhanh chóng sử dụng được | Phàn nàn giao diện cồng kềnh nhưng lại thiếu nhiều chức năng |
| P6 | Sử dụng dễ dàng các chức năng sau khi được gợi ý nhẹ về chỗ bấm nút "Xem chi tiết" | Nhận xét giao diện trông không đẹp mắt |
| P7 | Lúng túng lúc đầu vì các nút được ghi bằng tiếng Anh | Không thích tình trạng tiếng Anh và tiếng Việt trộn lẫn |

*Các quan sát trên được tổng hợp lại sau buổi thử từ bản ghi màn hình và trí nhớ của người điều phối, không phải ghi chú trực tiếp trong buổi.*

**Nhận xét chung.** Cả 7 người đều nêu ít nhất một điều chưa hài lòng và không ai bày tỏ sự yêu thích rõ rệt; 5 người (P3, P4, P5, P6, P7) thể hiện thái độ không thích hoặc phàn nàn trực tiếp. Điều này phù hợp với điểm SUS thấp ở mục 3.7.2, đặc biệt ở các câu về mức độ muốn dùng thường xuyên và tính nhất quán. Ở chiều ngược lại, nhiều người dùng được ngay mà ít gặp khó khăn (P2, P4, P5), nên vấn đề chủ yếu nằm ở cảm nhận về giao diện và độ tin cậy chứ không phải độ khó của thao tác.

#### 3.7.5 Tổng hợp vấn đề và mức nghiêm trọng

Phân biệt **lỗi (bug)** (hành vi sai so với kỳ vọng thông thường), **vấn đề thiết kế mang tính hệ thống** (nhiều người gặp) và **vấn đề riêng lẻ** (một người gặp). Mức nghiêm trọng theo thang ở Phụ lục B.

| # | Vấn đề | Người gặp | Loại | Mức |
|---|---|---|---|---|
| 1 | Trang chi tiết thiếu độ tin cậy: không sản phẩm nào có ảnh minh hoạ, trông như trang lừa đảo, thông tin chưa đủ để quyết định mua | Tiêu cực: P1, P2, P3, P4, P7; chưa chắc: P5, P6 | Thiết kế, hệ thống | 3 – Major |
| 2 | Giao diện trình bày rối mắt, cồng kềnh, chưa đẹp mắt | P2, P5, P6 | Thiết kế, hệ thống | 2 – Minor |
| 3 | Thiếu chức năng so với kỳ vọng (ví dụ bộ lọc, và các chức năng khác chưa được nêu cụ thể) | P3, P5 | Thiết kế, hệ thống (không phải bug, FR-05 và FR-06 không yêu cầu) | 2 – Minor |
| 4 | Giao diện trộn lẫn tiếng Anh và tiếng Việt, gây lúng túng ban đầu | P7 | Lỗi nhất quán, đã báo ở GUI-BUG-06 | 2 – Minor |
| 5 | Ô tìm kiếm không nhận phím Enter, người dùng phải dùng nút Search trên màn hình (có cách thay thế) | P1 | Lỗi nhỏ (Minor error), riêng lẻ | 2 – Minor |
| 6 | Người dùng lúng túng khi chỉ vào nút xem chi tiết; P6 cần một gợi ý nhẹ về nút này | P1, P6 | Thiết kế, khả năng nhận biết nút | 2 – Minor |
| 7 | Không có nút quay lại trên giao diện, người dùng phải dựa vào nút Back của trình duyệt | P7 (không tìm thấy); P1, P4 dùng nút Back của trình duyệt | Thiết kế, riêng lẻ | 2 – Minor |


### 3.8 Kết luận và đề xuất

1. **Tìm và mở được trang chi tiết?** Có. Cả 7 người hoàn thành nhiệm vụ (6 người không cần hỗ trợ, P6 cần một gợi ý nhẹ), trong khoảng 10–15 giây với đa số và 20–25 giây với P1 và P7.
2. **Ô tìm kiếm có dễ dùng không?** Ô tìm kiếm dùng được và nhanh, nhưng không nhận phím Enter nên người dùng phải bấm nút Search trên màn hình; đây là lỗi nhỏ có cách thay thế nhưng gây khó chịu vì làm gián đoạn thao tác quen thuộc.
3. **Khôi phục khi đi nhầm?** Người dùng quay lại dễ dàng bằng nút Back của trình duyệt hoặc gõ lại, nhưng giao diện không có nút quay lại riêng và một người không tìm thấy cách quay lại.
4. **Thông tin trang chi tiết có đáng tin?** Đây là điểm yếu lớn nhất: 5 trong 7 người không tin tưởng hoặc không thấy đủ thông tin, lý do được nêu là thiếu ảnh minh hoạ và trông thiếu chuyên nghiệp.

**Đánh giá chung.** Hiệu quả thao tác tốt nhưng cảm nhận về trang kém: mọi người hoàn thành nhiệm vụ rất nhanh, trong khi điểm SUS trung bình chỉ 44,6 và cả 7 người đều có điều chưa hài lòng. Vấn đề không nằm ở việc hoàn thành được hay không, mà ở độ tin cậy của trang chi tiết, cách trình bày giao diện, sự thiếu nhất quán về ngôn ngữ và một số chức năng người dùng mong đợi.

**Đề xuất cải tiến (theo thứ tự ưu tiên)**
- Bổ sung ảnh sản phẩm và các thông tin giúp tăng độ tin cậy ở trang chi tiết.
- Làm gọn và thống nhất cách trình bày giao diện.
- Thống nhất ngôn ngữ giao diện bằng tiếng Việt.
- Cho phép tìm kiếm bằng phím Enter.
- Thêm nút quay lại hoặc điều hướng rõ ràng trên giao diện, và làm nút xem chi tiết dễ nhận ra hơn.
- Cân nhắc bổ sung bộ lọc kết quả nếu đi xa hơn yêu cầu hiện tại.

### 3.9 Hạn chế

- **Mẫu nhỏ:** chỉ 7 người, điểm SUS phân tán rộng, nên kết quả chỉ chỉ ra xu hướng.
- **Không có âm thanh:** người tham gia không muốn dùng micro nên các video chỉ có hình, việc đánh giá lời nói khi vừa làm vừa nghĩ (think-aloud) bị hạn chế.
- **Ghi chú quan sát tổng hợp lại sau buổi thử:** các quan sát ở mục 3.7.4 được viết lại từ bản ghi màn hình và trí nhớ của người điều phối, nên độ chi tiết và mốc thời gian có hạn chế.
- **Nhiệm vụ cụ thể:** nhiệm vụ được nêu bằng từ khoá và thao tác cụ thể ("mac", mở sản phẩm đầu tiên) thay vì một mục tiêu mở. Vì vậy không quan sát được việc người dùng tự chọn từ khoá hoặc tự quyết định mua, và thời gian hoàn thành có thể ngắn hơn thực tế.
- **Gợi ý trong buổi:** ở buổi của P6, người điều phối đưa một gợi ý nhẹ về chỗ bấm nút "Xem chi tiết", nên kết quả của buổi này không hoàn toàn độc lập.
- **Nhiệm vụ rất ngắn:** mỗi nhiệm vụ chỉ mất khoảng 10–25 giây và thời gian chỉ là ước lượng từ video, nên chênh lệch giữa các người có thể do ngẫu nhiên; điểm SUS phản ánh ấn tượng chung của người dùng về trang, không chỉ riêng nhiệm vụ này.
- **Phạm vi:** chỉ đánh giá một flow ngắn, dữ liệu sản phẩm ít, nên chưa phản ánh toàn bộ trải nghiệm của EShop.

### Phụ lục A. Phiếu SUS, cách tính và dữ liệu thô

Thang điểm: 1 = Hoàn toàn không đồng ý, 5 = Hoàn toàn đồng ý.

| # | Phát biểu |
|---|---|
| 1 | Tôi nghĩ rằng tôi sẽ muốn sử dụng hệ thống này thường xuyên. |
| 2 | Tôi thấy hệ thống này phức tạp một cách không cần thiết. |
| 3 | Tôi thấy hệ thống này dễ sử dụng. |
| 4 | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của người có chuyên môn kỹ thuật để dùng được hệ thống này. |
| 5 | Tôi thấy các chức năng trong hệ thống này được kết hợp với nhau tốt. |
| 6 | Tôi thấy hệ thống này có quá nhiều điểm không nhất quán. |
| 7 | Tôi cho rằng hầu hết mọi người sẽ học cách dùng hệ thống này rất nhanh. |
| 8 | Tôi thấy hệ thống này rất cồng kềnh khi sử dụng. |
| 9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. |
| 10 | Tôi cần học hỏi rất nhiều điều trước khi có thể bắt đầu dùng hệ thống này. |

**Cách tính điểm cho mỗi người**
- Câu lẻ (1, 3, 5, 7, 9): điểm đóng góp = điểm chọn − 1.
- Câu chẵn (2, 4, 6, 8, 10): điểm đóng góp = 5 − điểm chọn.
- Điểm SUS = (tổng 10 điểm đóng góp) × 2,5; điểm của nhóm là trung bình của 7 người.

**Điểm chọn của từng người (1–5)**

| Mã | Câu 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Tổng đóng góp (0–40) | Điểm SUS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | 1 | 2 | 3 | 3 | 4 | 5 | 3 | 5 | 2 | 4 | 14 | 35,0 |
| P2 | 4 | 1 | 5 | 3 | 3 | 2 | 5 | 2 | 5 | 2 | 32 | 80,0 |
| P3 | 1 | 3 | 3 | 4 | 2 | 4 | 3 | 4 | 2 | 2 | 14 | 35,0 |
| P4 | 1 | 1 | 2 | 1 | 1 | 3 | 4 | 2 | 5 | 1 | 25 | 62,5 |
| P5 | 2 | 4 | 2 | 2 | 1 | 5 | 2 | 4 | 3 | 1 | 14 | 35,0 |
| P6 | 2 | 2 | 3 | 2 | 3 | 4 | 2 | 3 | 3 | 1 | 21 | 52,5 |
| P7 | 1 | 3 | 2 | 4 | 1 | 5 | 1 | 5 | 1 | 4 | 5 | 12,5 |

### Phụ lục B. Thang mức độ nghiêm trọng

| Mức | Tên | Định nghĩa |
|---|---|---|
| 4 | Blocker | Ngăn người dùng hoàn thành nhiệm vụ |
| 3 | Major | Gây khó khăn hoặc mất nhiều thời gian đáng kể, nhiều người gặp phải |
| 2 | Minor | Gây khó chịu nhẹ, người dùng vẫn hoàn thành được |
| 1 | Cosmetic | Vấn đề về hình thức, không ảnh hưởng việc hoàn thành |

### Phụ lục C. Bằng chứng usability

- Video ghi màn hình (không có âm thanh) của 7 buổi thật: [ĐIỀN: danh sách tên file video P1–P7 và nơi lưu].
- Phiếu SUS và ghi chú gốc: [ĐIỀN: nơi lưu].
- Xác nhận người tham gia đồng ý được ghi hình: [ĐIỀN: cách xác nhận].

---

## 4. Task 3 – Cross-browser / Cross-platform

### 4.1 Tổng quan

Task 3 chạy lại checklist GUI của Task 1 (Register, Login, Profile) trên ba nền tảng để xem kết quả có thay đổi theo trình duyệt hay không.

| Hạng mục | Nội dung |
|---|---|
| Phạm vi | Register, Login, Profile; 51 mục checklist |
| Số nền tảng | 3 (Firefox, Chrome, Safari) |
| Bằng chứng | 45 ảnh chụp: 42 ảnh (14 lỗi × 3 nền tảng) và 3 ảnh cho lỗi riêng của Chrome (GUI-BUG-15: ảnh Chrome và ảnh đối chiếu Firefox, Safari) |
| Kết quả chi tiết | File Excel/CSV `HW03_Task3_Results` (51 mục × 3 nền tảng), nộp kèm |

### 4.2 Nền tảng và công cụ

| Nền tảng | Môi trường | Công cụ / cách chạy | Nguồn kết quả |
|---|---|---|---|
| Firefox 157 | Windows | Chạy trực tiếp trên máy | Kết quả của Task 1; chạy lại các mục chính để chụp ảnh đúng quy cách |
| Chrome 159 | Windows | Chạy trực tiếp trên máy | Chạy mới |
| Safari 27 | macOS [ĐIỀN: phiên bản macOS] | BrowserStack Live (trình duyệt từ xa); truy cập `localhost` qua BrowserStack Local | Chạy mới trong phiên dùng thử |

Ngày chạy: [ĐIỀN: ngày chạy Task 3].

**Lý do chọn:** đề yêu cầu tối thiểu 3 nền tảng, gồm Chrome, Firefox và Safari. Chrome và Firefox chạy trực tiếp trên máy; Safari chạy bằng BrowserStack Live (công cụ đề ưu tiên) và cho Safari thật. Safari dùng bộ máy hiển thị WebKit khác với Chrome (Blink) và Firefox (Gecko), nên đây là phép thử có giá trị cho sự khác biệt giữa các nền tảng.

### 4.3 Phương pháp

- Dùng cùng một checklist (51 mục) và cùng tài khoản test; khởi động lại server trước mỗi lần chạy để dữ liệu giống nhau.
- Mỗi mục được đánh dấu **Passed** hoặc **Failed** trên từng nền tảng. Cả 51 mục đều thực hiện được trên cả ba nền tảng nên không có mục nào phải ghi N/A. Kết quả Firefox lấy từ lần chạy Task 1.
- Trên macOS, phím tắt dùng Cmd thay cho Ctrl.
- Ảnh chụp được đóng dấu email, MSSV, họ tên và tên nền tảng, đặt tên theo quy ước `GUI-BUG-xx-<nền tảng>`.

### 4.4 Kết quả tổng hợp

| Nền tảng | Passed | Failed | N/A |
|---|---|---|---|
| Firefox 157 | 29 | 22 | 0 |
| Chrome 159 | 28 | 23 | 0 |
| Safari 27 | 29 | 22 | 0 |

Cả ba nền tảng cho kết quả giống nhau ở 50 trên 51 mục. Chrome khác hai nền tảng còn lại ở một mục duy nhất (UI-50), nên có thêm một mục Failed.

### 4.5 Khác biệt giữa các nền tảng

| Mục | Mô tả | Firefox | Chrome | Safari |
|---|---|---|---|---|
| UI-50 (Copy/Paste tại ô mật khẩu) | Khi dán mật khẩu từ clipboard vào ô mật khẩu, mật khẩu hiển thị đầy đủ dạng chữ thường thay vì bị che; khi gõ trực tiếp thì được che bình thường | Passed (mật khẩu được che) | **Failed** (mật khẩu hiện đầy đủ) | Passed (mật khẩu được che) |

- Lỗi chỉ xuất hiện trên **Chrome**, không xuất hiện trên Firefox và Safari. Lỗi được ghi thành GUI-BUG-15 (Medium, nền tảng Chrome), kèm ảnh Chrome và ảnh đối chiếu trên Firefox, Safari.
- Mật khẩu hiển thị rõ trên màn hình có ý nghĩa về quyền riêng tư nên lỗi được xếp mức Medium.

### 4.6 Tái hiện các lỗi trên từng nền tảng

| Bug | Firefox | Chrome | Safari |
|---|---|---|---|
| GUI-BUG-01 đến GUI-BUG-14 | Tái hiện | Tái hiện | Tái hiện |
| GUI-BUG-15 | Không | **Tái hiện** | Không |

14 lỗi từ Task 1 (tương ứng 22 mục Failed) tái hiện giống nhau trên cả ba nền tảng. Mỗi lỗi có một ảnh đại diện cho từng nền tảng.

### 4.7 Quản lý lỗi trên GitHub Issues

- Mỗi lỗi giữ **một Issue duy nhất**, không tạo Issue riêng cho từng nền tảng.
- Mỗi Issue được gắn nhãn `bug`, `severity:...`, `IA-0x` và `platform:...` (liệt kê các nền tảng đã tái hiện).
- Mỗi Issue có ảnh chụp của các nền tảng đã tái hiện.
- Lỗi riêng của Chrome (GUI-BUG-15) gắn nhãn `platform:Chrome`, Issue: [#161](https://github.com/faker26052005-lgtm/SUT-EShop/issues/161).

### 4.8 Nhận xét

1. Phần lớn lỗi giao diện tái hiện giống nhau trên cả ba nền tảng: kiểm thử trên một trình duyệt đã phát hiện hầu hết các lỗi, và việc lặp lại trên ba nền tảng xác nhận điều đó.
2. Khác biệt duy nhất tìm được (dán mật khẩu) liên quan đến thao tác của người dùng với trình duyệt, nên cần kiểm tra riêng trên từng nền tảng mới phát hiện được.
3. Safari (WebKit), Chrome (Blink) và Firefox (Gecko) cho kết quả giống nhau ở các lỗi còn lại.

### 4.9 Hạn chế

- **Chỉ có Safari trên macOS (desktop):** không có iOS hay thiết bị di động, nên giao diện trên màn hình nhỏ và thao tác cảm ứng chưa được đánh giá.
- **Kết quả Firefox lấy từ Task 1:** chỉ chạy lại các mục chính để chụp ảnh, không đánh giá lại toàn bộ 51 mục.
- **Một phiên bản trình duyệt cho mỗi nền tảng:** kết quả thuộc về các phiên bản đã ghi ở mục 4.2.

---

## 5. Kết luận chung

- **Về chất lượng giao diện:** trong 51 mục kiểm tra, 22 mục Failed (43%), gộp thành 14 lỗi; thêm 1 lỗi riêng của Chrome. Hai lỗi High chặn việc đăng ký và cập nhật hồ sơ qua giao diện.
- **Về trải nghiệm người dùng:** người dùng hoàn thành được luồng tìm kiếm và xem chi tiết (7/7), nhưng điểm SUS trung bình chỉ 44,6 và 5/7 người không tin tưởng trang chi tiết sản phẩm.
- **Mối liên hệ giữa các task:** vấn đề trộn lẫn tiếng Anh và tiếng Việt xuất hiện ở cả Task 1 (GUI-BUG-06) và Task 2 (P7 lúng túng vì các nút tiếng Anh). Task 3 cho thấy các lỗi của Task 1 không phụ thuộc trình duyệt, ngoại trừ lỗi dán mật khẩu trên Chrome.
- **Bài học về cách làm:** checklist do AI sinh bao phủ tốt các nhóm giao diện quen thuộc nhưng bỏ sót các tình huống về thao tác của người dùng với trình duyệt và vòng đời thông báo (mục 2.4); các mục này do tác giả bổ sung, và một trong số đó (UI-50) cho ra lỗi chỉ xuất hiện trên một trình duyệt.

---

## 6. Tài liệu nộp kèm

| Tài liệu | Trạng thái |
|---|---|
| Báo cáo chính (file này, Markdown + PDF) | Có |
| Bug Report (kèm ảnh trang GitHub Issues) | HW03_Bug_Report.md |
| AI Audit Report và AI Critique (Markdown + PDF) | 00_AI_AUDIT_REPORT.md |
| Git commit log (file text) | commit_log.txt |
| Excel checklist (51 mục) và test summary | HW03_Task1_Checklist.csv |
| Kết quả Task 3 (51 mục × 3 nền tảng) | `HW03_Task3_Results.csv` |
| Bằng chứng usability (kịch bản, ghi chú quan sát, phiếu SUS, video, bảng 7 người) | HW03_Task2_Evidence.md |
| Ảnh chụp cross-browser (45 ảnh) | Thư mục `Task-3/screenshots/` |
| README.md (bảng tự đánh giá và test summary) | README.md |
