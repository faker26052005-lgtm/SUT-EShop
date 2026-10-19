# FR-20 – Mobile - Đăng ký và Hủy đơn · Bước 7: Thực thi và kết quả

## 6.1 Môi trường
- Thiết bị / hệ điều hành / phiên bản Expo Go hoặc emulator: TODO
- Node, Postman (hoặc script gọi API): TODO
- SUT: commit TODO; reset dữ liệu bằng `node database.js` trước mỗi lượt chạy: TODO
- Thay đổi môi trường: sửa `API_URL` ở `frontend-mobile/App.js` thành địa chỉ máy chạy backend (không phải bản vá lỗi): TODO

## 6.2 Cách chạy
1. Chạy backend (`node database.js`, `node server.js`) và app (`npx expo start`).
2. **Đăng ký:** mỗi ca dùng email mới (trừ DT-R14, DT-R15). Nhập trên app, chụp màn hình thông báo; sau đó gửi cùng giá trị thẳng vào `POST /api/register` và ghi mã HTTP. Các ca "Tầng = UI" (xác nhận mật khẩu, nhãn, vị trí lỗi) chỉ chạy trên app. Để kiểm tra "tài khoản có thật sự được tạo", thử `POST /api/login`.
3. **Hủy đơn:** dựng đơn bằng user thử (thêm giỏ → thanh toán, ra trạng thái `pending`). Dùng token admin gọi `PUT /api/admin/orders/:id/status` để đưa sang `confirmed`, `shipping`, `delivered`; đơn `canceled` có được bằng cách hủy một đơn `pending`. Mỗi ca dùng một đơn riêng. Đọc lại bằng `GET /api/orders/my-orders`.
4. Ghi từng ca vào bảng dưới ngay sau khi chạy.

## 6.3 Bảng kết quả
Verdict: `PASS` (đúng SRS) / `FAIL` (sai SRS) / `CẦN LÀM RÕ` (SRS không nêu) / `N/A` (tầng không áp dụng). PASS vẫn có thể kèm side-effect: ghi ở cột riêng. Chưa chạy: để trống.

| ID | Mô tả | Tầng | HTTP (API) | Verdict UI | Verdict API | Quan sát (dữ liệu đọc lại) | Side-effect | Ảnh | Bug |
| :--- | :--- | :-: | :-: | :-: | :-: | :--- | :--- | :--- | :-: |
| DT-R01 | Baseline: mọi trường hợp lệ | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R02 | Họ tên có dấu tiếng Việt | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R03 | Họ tên rỗng | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=5) |  |  | FR-20-BUG-01 |
| DT-R04 | Họ tên toàn khoảng trắng | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R05 | Họ tên chứa HTML | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R06 | Họ tên rất dài (1000 ký tự) | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R07 | Email hợp lệ dạng khác | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R08 | Email thiếu @ | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=10) |  |  | FR-20-BUG-02 |
| DT-R09 | Email thiếu phần domain | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=11) |  |  | FR-20-BUG-02 |
| DT-R10 | Email thiếu phần local | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=12) |  |  | FR-20-BUG-02 |
| DT-R11 | Email thiếu đuôi miền | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R12 | Email có khoảng trắng | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=14) |  |  | FR-20-BUG-02 |
| DT-R13 | Email rỗng | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=15) |  |  | FR-20-BUG-01 |
| DT-R14 | Email đã tồn tại | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=16) |  |  | FR-20-BUG-03 |
| DT-R15 | Email trùng khác hoa/thường | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R16 | Ký tự đặc biệt hợp lệ `!` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R17 | Ký tự đặc biệt hợp lệ `@` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R18 | Ký tự đặc biệt hợp lệ `$` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R19 | Ký tự đặc biệt hợp lệ `%` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R20 | Ký tự đặc biệt hợp lệ `*` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R21 | Ký tự đặc biệt hợp lệ `?` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R22 | Ký tự đặc biệt hợp lệ `&` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-R23 | Mật khẩu thiếu chữ hoa | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=25) |  |  | FR-20-BUG-04 |
| DT-R24 | Mật khẩu thiếu chữ thường | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=26) |  |  | FR-20-BUG-04 |
| DT-R25 | Mật khẩu thiếu chữ số | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=27) |  |  | FR-20-BUG-04 |
| DT-R26 | Mật khẩu thiếu ký tự đặc biệt | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=28) |  |  | FR-20-BUG-04 |
| DT-R27 | Ký tự đặc biệt ngoài tập SRS | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=29) |  |  | FR-20-BUG-04 |
| DT-R28 | Mật khẩu rỗng | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=30) |  |  | FR-20-BUG-01 |
| DT-R29 | Khoảng trắng thay ký tự đặc biệt | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=31) |  |  | FR-20-BUG-04 |
| DT-R30 | Mật khẩu rất dài hợp lệ về thành phần | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| DT-R31 | Xác nhận không khớp | UI |  |  | N/A |  |  |  |  |
| DT-R32 | Xác nhận rỗng | UI |  |  | N/A |  |  |  |  |
| DT-R33 | Xác nhận chỉ khác hoa/thường | UI |  |  | N/A |  |  |  |  |
| DT-R34 | Form có ô Xác nhận mật khẩu | UI |  |  | N/A |  |  |  |  |
| DT-C01 | Hủy đơn `pending` của mình | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-C02 | Hủy đơn `confirmed` của mình | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-C03 | Hủy đơn `shipping` (user) | UI+API | 200 |  | FAIL | HTTP 200 "Order canceled successfully"; đọc lại: canceled (mong đợi giữ shipping) |  |  | FR-20-BUG-05 |
| DT-C04 | Hủy đơn `delivered` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-C05 | Hủy lại đơn đã `canceled` | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-C06 | Id đơn không tồn tại | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| DT-C07 | Id đơn không phải số | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BV-R01 | Độ dài 7 (min−1), đủ 4 loại ký tự | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=33) |  |  | FR-20-BUG-04 |
| BV-R02 | Độ dài 8 (min) | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BV-R03 | Độ dài 9 (min+1) | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BV-R04 | Độ dài 1 | UI+API | 200 |  | FAIL | HTTP 200, tài khoản được tạo (id=36) |  |  | FR-20-BUG-04 |
| BV-R05 | Độ dài 8, đúng 1 ký tự mỗi loại bắt buộc | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BV-R06 | Họ tên độ dài 1 (biên dưới) | UI+API | 200 |  | CẦN LÀM RÕ | Hệ thống chấp nhận (HTTP 200, tạo tài khoản) |  |  |  |
| BV-C01 | Biên thời gian: màn hình còn hiện đơn `confirmed`, admin vừa chuyển sang `shipping`, user bấm Hủy | UI+API | 200 |  | FAIL | HTTP 200 "Order canceled successfully"; đọc lại: canceled (mong đợi giữ shipping) |  |  | FR-20-BUG-05 |
| BL-R01 | Đăng ký thành công thì chuyển sang màn Đăng nhập | UI |  |  | N/A |  |  |  |  |
| BL-R02 | Đăng nhập bằng tài khoản vừa đăng ký | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BL-R03 | Bấm Đăng ký hai lần liên tiếp | UI+API | 200 |  | FAIL | Cả hai request HTTP 200; tạo 2 tài khoản cùng email |  |  | FR-20-BUG-03 |
| BL-R04 | Mật khẩu bị che ký tự khi nhập | UI |  |  | N/A |  |  |  |  |
| BL-R05 | Dấu `*` ở trường bắt buộc, lỗi nằm trên nút Đăng ký | UI |  |  | N/A |  |  |  |  |
| BL-R06 | Gửi kèm role=admin khi đăng ký | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BL-C01 | Sau khi hủy, lịch sử hiển thị 'Đã hủy' đúng màu | UI |  |  | N/A |  |  |  |  |
| BL-C02 | Tác dụng phụ: hủy một đơn không đổi đơn khác | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BL-C03 | Nút Hủy chỉ hiện ở `pending`/`confirmed` | UI |  |  | N/A |  |  |  |  |
| BL-C04 | Bấm Hủy hai lần liên tiếp | UI+API |  |  | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| BL-C05 | Admin hủy đơn `shipping` | API | 400 | N/A | CẦN LÀM RÕ | Từ chối: "Invalid state transition from shipping to canceled" |  |  |  |
| BL-C06 | Nhãn trạng thái tiếng Việt, mỗi trạng thái một màu | UI |  |  | N/A |  |  |  |  |
| AC-C01 | Hủy đơn không có token | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| AC-C02 | Hủy đơn với token sai | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |
| AC-C03 | Hủy đơn của người khác | API |  | N/A | PASS | Đúng kỳ vọng (chi tiết mã HTTP xem báo cáo Markdown của lần chạy) |  |  |  |

## 6.4 Tổng hợp (tạm tính: mới chạy tầng API)
| Designed | Executed | Passed | Failed | Cần làm rõ | Not executed |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 63 | 53 (tầng API) | 26 | 19 | 8 | 10 (UI-only) + chạy UI cho các ca UI+API |
