# HW03 – Task 3: Báo cáo kiểm thử giao diện trên nhiều nền tảng (Cross-browser / Cross-platform)

---

## 1. Tổng quan

Task 3 chạy lại checklist GUI của Task 1 (màn hình Register, Login, Profile của EShop) trên nhiều nền tảng để xem kết quả có thay đổi theo trình duyệt và thiết bị hay không.

| Hạng mục | Nội dung |
|---|---|
| SUT | EShop – https://github.com/ttbhanh/eshop-sut (frontend `http://localhost:5173`, backend `http://localhost:3000`) |
| Phạm vi | Register, Login, Profile; 51 mục checklist (46 mục AI sinh và 5 mục tự bổ sung) |
| Số nền tảng | 3 (Firefox, Chrome, Safari) |
| Bằng chứng | 45 ảnh chụp: 42 ảnh (14 lỗi × 3 nền tảng) và 3 ảnh cho lỗi riêng của Chrome (GUI-BUG-15: ảnh Chrome và ảnh đối chiếu Firefox, Safari) |
| Kết quả chi tiết | File `HW03_Task3_Results.csv` (51 mục × 3 nền tảng) |

## 2. Nền tảng và công cụ

| Nền tảng | Môi trường | Công cụ / cách chạy | Nguồn kết quả |
|---|---|---|---|
| Firefox 157 | Windows | Chạy trực tiếp trên máy | Kết quả của Task 1; chạy lại các mục chính để chụp ảnh đúng quy cách |
| Chrome 159 | Windows | Chạy trực tiếp trên máy | Chạy mới |
| Safari 27 | macOS [ĐIỀN: phiên bản macOS] | BrowserStack Live (trình duyệt từ xa); truy cập `localhost` qua BrowserStack Local | Chạy mới trong phiên dùng thử |

Ngày chạy: [ĐIỀN: ngày chạy Task 3].

**Lý do chọn:** đề yêu cầu tối thiểu 3 nền tảng, gồm Chrome, Firefox và Safari. Chrome và Firefox chạy trực tiếp trên máy; Safari chạy bằng **BrowserStack Live**, là công cụ đề ưu tiên và cho Safari thật. Safari dùng bộ máy hiển thị WebKit khác với Chrome (Blink) và Firefox (Gecko), nên là phép thử có giá trị cho sự khác biệt giữa các nền tảng.

## 3. Phương pháp

- Dùng cùng một checklist (51 mục), cùng tài khoản test, và khởi động lại server trước mỗi lần chạy để dữ liệu giống nhau.
- Mỗi mục được đánh dấu **Passed** hoặc **Failed** trên từng nền tảng. Cả 51 mục đều thực hiện được trên cả ba nền tảng nên không có mục nào phải ghi N/A. Kết quả Firefox lấy từ lần chạy Task 1.
- Trên macOS, phím tắt dùng Cmd thay cho Ctrl.
- Ảnh chụp được đóng dấu email, MSSV, họ tên và tên nền tảng. Ảnh đặt tên theo quy ước `GUI-BUG-xx-<nền tảng>`, mỗi lỗi có một ảnh đại diện cho mỗi nền tảng.
- Bảng kết quả chi tiết 51 mục × 3 nền tảng nằm trong file `HW03_Task3_Results.csv`.

## 4. Kết quả tổng hợp

| Nền tảng | Passed | Failed | N/A |
|---|---|---|---|
| Firefox 157 (kết quả Task 1) | 29 | 22 | 0 |
| Chrome 159 | 28 | 23 | 0 |
| Safari 27 (BrowserStack) | 29 | 22 | 0 |

Cả ba nền tảng cho kết quả giống nhau ở 50 trên 51 mục. Chrome khác hai nền tảng còn lại ở một mục duy nhất (UI-50, xem mục 5) nên có thêm một mục Failed.

## 5. Khác biệt giữa các nền tảng

Chỉ có một khác biệt được ghi nhận:

| Mục | Mô tả | Firefox | Chrome | Safari |
|---|---|---|---|---|
| UI-50 (Copy/Paste tại ô mật khẩu) | Khi dán mật khẩu từ clipboard vào ô mật khẩu, mật khẩu hiển thị đầy đủ dạng chữ thường thay vì bị che; khi gõ trực tiếp thì được che bình thường | Passed (mật khẩu được che) | **Failed** (mật khẩu hiện đầy đủ) | Passed (mật khẩu được che) |

- Lỗi chỉ xuất hiện trên **Chrome**, không xuất hiện trên Firefox và Safari. Lỗi được ghi thành GUI-BUG-15 (mức Medium, nhãn nền tảng Chrome), kèm ảnh Chrome và ảnh đối chiếu trên Firefox, Safari.
- Mật khẩu hiển thị rõ trên màn hình có ý nghĩa về quyền riêng tư, nên lỗi được xếp mức Medium.

## 6. Tái hiện các lỗi trên từng nền tảng

14 lỗi từ Task 1 (tương ứng 22 mục Failed) tái hiện giống nhau trên cả ba nền tảng. Mỗi lỗi có một ảnh đại diện cho từng nền tảng (tổng cộng 42 ảnh).

| Mã lỗi | Mô tả | Mức độ | Mục checklist | Firefox | Chrome | Safari | Issue |
|---|---|---|---|---|---|---|---|
| GUI-BUG-01 | Đăng ký luôn bị từ chối với thông báo "Mật khẩu quá yếu" dù mật khẩu đúng quy tắc | High | UI-27, UI-37 | Có | Có | Có | [#103](https://github.com/faker26052005-lgtm/SUT-EShop/issues/103) |
| GUI-BUG-02 | Form đăng ký chỉ có một thông báo lỗi mật khẩu cho mọi trường hợp, không chỉ ra ô sai thực sự | Medium | UI-12, UI-13, UI-14 | Có | Có | Có | [#104](https://github.com/faker26052005-lgtm/SUT-EShop/issues/104) |
| GUI-BUG-03 | Cập nhật hồ sơ luôn bị từ chối với thông báo "Số điện thoại không hợp lệ" dù nhập đúng định dạng | High | UI-17, UI-25, UI-42, UI-43, UI-44 | Có | Có | Có | [#105](https://github.com/faker26052005-lgtm/SUT-EShop/issues/105) |
| GUI-BUG-04 | Tài khoản bị khoá nhưng giao diện không phản hồi | Medium | UI-40, UI-41 | Có | Có | Có | [#106](https://github.com/faker26052005-lgtm/SUT-EShop/issues/106) |
| GUI-BUG-05 | Tiêu đề màn hình Login hiển thị là "Đăng Ký" | Low | UI-05 | Có | Có | Có | [#107](https://github.com/faker26052005-lgtm/SUT-EShop/issues/107) |
| GUI-BUG-06 | Màn hình Login trộn lẫn tiếng Anh và tiếng Việt | Low | UI-09 | Có | Có | Có | [#108](https://github.com/faker26052005-lgtm/SUT-EShop/issues/108) |
| GUI-BUG-07 | Màu nút chính không nhất quán giữa các màn hình | Low | UI-02 | Có | Có | Có | [#109](https://github.com/faker26052005-lgtm/SUT-EShop/issues/109) |
| GUI-BUG-08 | Form đăng ký không đánh dấu các trường bắt buộc | Low | UI-10 | Có | Có | Có | [#110](https://github.com/faker26052005-lgtm/SUT-EShop/issues/110) |
| GUI-BUG-09 | Không có nút hiện/ẩn mật khẩu | Low | UI-16 | Có | Có | Có | [#111](https://github.com/faker26052005-lgtm/SUT-EShop/issues/111) |
| GUI-BUG-10 | Form bị xoá toàn bộ dữ liệu khi gửi lỗi | Medium | UI-19 | Có | Có | Có | [#112](https://github.com/faker26052005-lgtm/SUT-EShop/issues/112) |
| GUI-BUG-11 | Nút Back của trình duyệt làm mất dữ liệu đang nhập | Medium | UI-33 | Có | Có | Có | [#113](https://github.com/faker26052005-lgtm/SUT-EShop/issues/113) |
| GUI-BUG-12 | Vẫn hiện form Login khi đã đăng nhập | Low | UI-30 | Có | Có | Có | [#114](https://github.com/faker26052005-lgtm/SUT-EShop/issues/114) |
| GUI-BUG-13 | Không cảnh báo khi rời Profile có thay đổi chưa lưu | Low | UI-45 | Có | Có | Có | [#115](https://github.com/faker26052005-lgtm/SUT-EShop/issues/115) |
| GUI-BUG-14 | Thông báo nổi không tự biến mất | Low | UI-52 | Có | Có | Có | [#116](https://github.com/faker26052005-lgtm/SUT-EShop/issues/116) |
| GUI-BUG-15 | Mật khẩu dán từ clipboard hiển thị dạng chữ thường, không bị che, trên Chrome | Medium | UI-50 | Không | **Có** | Không | [#161](https://github.com/faker26052005-lgtm/SUT-EShop/issues/161) |

## 7. Quản lý lỗi trên GitHub Issues

- Mỗi lỗi giữ **một Issue duy nhất**, không tạo Issue riêng cho từng nền tảng.
- Mỗi Issue được gắn nhãn `bug`, `severity:...`, `IA-0x` và `platform:...` (liệt kê các nền tảng đã tái hiện).
- Mỗi Issue có ảnh chụp của các nền tảng đã tái hiện.
- Lỗi riêng của Chrome (GUI-BUG-15) chỉ gắn nhãn `platform:Chrome`.

## 8. Nhận xét

1. **Phần lớn lỗi giao diện tái hiện giống nhau trên cả ba nền tảng.** Kiểm thử trên một trình duyệt đã phát hiện hầu hết các lỗi, và việc lặp lại trên ba nền tảng xác nhận điều đó.
2. **Các hành vi tương tác với trình duyệt cần kiểm tra riêng trên từng nền tảng.** Khác biệt duy nhất tìm được (dán mật khẩu) thuộc loại này, và chỉ lộ ra khi chạy trên Chrome.
3. **Ba bộ máy hiển thị cho kết quả tương tự nhau.** Safari (WebKit), Chrome (Blink) và Firefox (Gecko) cho kết quả giống nhau ở 14 lỗi còn lại; lỗi dán mật khẩu chỉ tái hiện trên Chrome trong môi trường đã kiểm thử.

## Phụ lục A. Danh sách ảnh bằng chứng

- Thư mục ảnh Task 3: [ĐIỀN: tên thư mục, ví dụ `Task-3/screenshots/`], gồm 42 ảnh tên dạng `GUI-BUG-xx-<nền tảng>` (14 lỗi × 3 nền tảng).
- Ảnh cho lỗi riêng của Chrome: `GUI-BUG-15-Chrome` và các ảnh đối chiếu `GUI-BUG-15-Firefox`, `GUI-BUG-15-Safari` [ĐIỀN: đặt tên đúng theo thư mục của bạn].
- Mọi ảnh được đóng dấu email, MSSV, họ tên và tên nền tảng.

## Phụ lục B. Bảng kết quả chi tiết

Bảng 51 mục × 3 nền tảng nằm trong file `HW03_Task3_Results.csv` (nộp kèm).
