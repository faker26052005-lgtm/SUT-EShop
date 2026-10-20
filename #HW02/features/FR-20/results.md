# FR-20 – Mobile: Đăng ký và Hủy đơn · Kết quả

## Bước 7: Thực thi và kết quả

### 7.1 Môi trường
- Thiết bị / hệ điều hành / phiên bản Expo Go hoặc emulator: TODO
- Node, Postman (hoặc script gọi API): TODO
- SUT: commit TODO; reset dữ liệu bằng `node database.js` trước mỗi lượt chạy: TODO
- Thay đổi môi trường: sửa `API_URL` ở `frontend-mobile/App.js` thành địa chỉ máy chạy backend (không phải bản vá lỗi): TODO

### 7.2 Cách chạy
1. Chạy backend (`node database.js`, `node server.js`) và app (`npx expo start`).
2. **Đăng ký:** mỗi ca dùng email mới (trừ DT-R14, DT-R15). Nhập trên app, chụp màn hình thông báo; sau đó gửi cùng giá trị thẳng vào `POST /api/register` và ghi mã HTTP. Các ca "Tầng = UI" (xác nhận mật khẩu, nhãn, vị trí lỗi) chỉ chạy trên app. Để kiểm tra "tài khoản có thật sự được tạo", thử `POST /api/login`.
3. **Hủy đơn:** dựng đơn bằng user thử (thêm giỏ → thanh toán, ra trạng thái `pending`). Dùng token admin gọi `PUT /api/admin/orders/:id/status` để đưa sang `confirmed`, `shipping`, `delivered`; đơn `canceled` có được bằng cách hủy một đơn `pending`. Mỗi ca dùng một đơn riêng. Đọc lại bằng `GET /api/orders/my-orders`.
4. Ghi từng ca vào bảng dưới ngay sau khi chạy.

### 7.3 Bảng kết quả
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

### 7.4 Tổng hợp
Bảng số liệu tổng hợp nằm ở Bước 10 bên dưới (một nơi duy nhất). Số liệu hiện là **tạm tính**: mới chạy tầng API; chưa chạy UI cho 10 ca chỉ-UI và cho các ca UI+API.

## Bước 8: Gom test đỏ theo nguyên nhân gốc

Nhiều test đỏ không có nghĩa là nhiều bug. Gom theo nguyên nhân gốc rồi mới mở Issue.

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm | GitHub Issue |
| :--- | :--- | :--- | :-: | :--- | :--- |
| FR-20-BUG-01 | `POST /api/register` không kiểm tra trường bắt buộc (name, email, password rỗng vẫn tạo tài khoản) | DT-R03, DT-R13, DT-R28 | High | FR-01: "phải cung cấp: Họ Tên, Email, Mật khẩu" | TODO |
| FR-20-BUG-02 | `POST /api/register` không kiểm tra định dạng email | DT-R08, DT-R09, DT-R10, DT-R12 | High | FR-01: "Email phải có định dạng hợp lệ" | TODO |
| FR-20-BUG-03 | `POST /api/register` cho phép đăng ký trùng email (không có ràng buộc duy nhất) | DT-R14, BL-R03 | High | FR-01: "Email ... là duy nhất trong hệ thống" | TODO |
| FR-20-BUG-04 | `POST /api/register` không áp dụng luật mật khẩu mạnh (độ dài ≥ 8 và 4 loại ký tự) | DT-R23, R24, R25, R26, BV-R01, BV-R04; phụ thuộc giả định #3: DT-R27, DT-R29 | High | FR-01: "Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt" | TODO |
| FR-20-BUG-05 | `PUT /api/orders/:id/cancel` cho user hủy đơn đang `shipping` (guard chỉ chặn `delivered` và `canceled`) | DT-C03, BV-C01 | High | FR-10: "đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy"; FR-20: chỉ hủy khi `pending`/`confirmed` | TODO |

**Quy ước đếm:** 19 test đỏ là 19 *ca*, không phải 19 bug; chúng thuộc 5 nguyên nhân gốc. DT-R27 và DT-R29 dựa trên giả định #3 (Phụ lục A mục 3): nếu GV xác nhận ký tự đặc biệt ngoài tập SRS vẫn hợp lệ thì loại hai ca này khỏi BUG-04 (bug vẫn còn nhờ 6 ca kia). BV-C01 cùng nguyên nhân với DT-C03 (không phải race condition: server không kiểm tra `shipping` ở bất kỳ thời điểm nào).

Kiểm tra: BUG-01 (3) + BUG-02 (4) + BUG-03 (2) + BUG-04 (8) + BUG-05 (2) = 19 test FAIL, khớp bảng kết quả.

- [ ] Mỗi bug đã có ảnh chụp
- [ ] Đã tạo GitHub Issue cho mỗi bug và điền link
- [x] Các ca CẦN LÀM RÕ (8 ca) không bị mở thành bug

## Bước 10: Tổng kết

| Chỉ số | Số lượng |
| :--- | :-: |
| Pool | D |
| Test case thiết kế | 63 (Domain 41, BVA 7, Business 12, Access 3) |
| Đã chạy | 53 (tầng API) |
| Passed | 26 |
| Failed | 19 |
| Cần làm rõ | 8 |
| Chưa chạy | 10 (ca chỉ-UI; chưa chạy UI cho các ca UI+API) |
| Số bug | 5 |

Cộng dồn các số này vào bảng Test Summary trong `README.md` gốc.

## Phụ lục A: Câu hỏi cần làm rõ với GV/TA

Mỗi chỗ SRS im lặng là một dòng. Không mở bug cho các mục này. Cột "Hệ thống hiện xử lý thế nào" điền sau khi chạy test.

| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tôi | Trạng thái / trả lời |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Họ tên | Độ dài tối thiểu/tối đa, toàn khoảng trắng, ký tự đặc biệt/HTML | Chấp nhận cả 4 ca (HTTP 200, tạo tài khoản): toàn khoảng trắng, HTML, 1000 ký tự, 1 ký tự | Chỉ rỗng là không hợp lệ | Chưa hỏi |
| 2 | Mật khẩu | Độ dài tối đa | Chấp nhận mật khẩu 500 ký tự (HTTP 200) | Không giới hạn | Chưa hỏi |
| 3 | Mật khẩu | Ký tự đặc biệt ngoài `@$!%*?&` (ví dụ `#`, khoảng trắng) có hợp lệ | Chấp nhận (HTTP 200) cả `#` và khoảng trắng; đang tính FAIL trong BUG-04 theo giả định này | Tập liệt kê là đầy đủ | Chưa hỏi |
| 4 | Email | Trùng email có phân biệt hoa/thường | Chấp nhận `TEST@ESHOP.COM` như tài khoản mới (HTTP 200) | Không rõ | Chưa hỏi |
| 5 | FR-22 trên mobile | Dấu `*`, vị trí thông báo lỗi, `type="email"`/`type="password"` áp dụng thế nào cho app | Chưa chạy (tầng giao diện) | Che mật khẩu là bắt buộc; phần còn lại chưa rõ | Chưa hỏi |
| 6 | Hủy đơn không hợp lệ | Mã lỗi/nội dung thông báo cụ thể ("lỗi phù hợp") | DT-C04, C05, C06, C07 bị từ chối 4xx (PASS); DT-C03 (shipping) lại cho hủy: xem BUG-05. Mã/thông báo cụ thể xem báo cáo Markdown | Chấp nhận mọi 4xx có thông báo, không 5xx | Chưa hỏi |
| 7 | Hủy đơn | Có hoàn lại tồn kho không | Không test | Không có yêu cầu | Chưa hỏi |
| 8 | Email | `user@domain` (không có đuôi miền) có hợp lệ | Chấp nhận `user@domain` (HTTP 200) | Coi là không hợp lệ | Chưa hỏi |
| 9 | Admin hủy `shipping` | Sơ đồ FR-10 không có `shipping → canceled` nhưng văn bản nói "chỉ Admin mới có thể thao tác" | Từ chối HTTP 400 "Invalid state transition from shipping to canceled" | Chưa rõ | Chưa hỏi |
