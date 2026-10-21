# FR-17 – Quản lý Mã Giảm Giá (Coupon CRUD) · Kết quả

## Môi trường
- Hệ điều hành: Windows 11
- SUT: `http://localhost:3000` (Node.js/Express + SQLite)
- Công cụ: Collection Postman `FR17_API_postman_collection.json` được chạy bằng `dry_run.js` (Node.js v25.8.1)
- Thời gian chạy: 2026-10-21 02:46:27 UTC (09:46:27 GMT+7)

## Cách chạy
1. Trong Postman: Import file `FR17_API_postman_collection.json`.
2. Chạy `B0. CHUẨN BỊ` trước nếu muốn tái hiện từng bug trong Folder B.
3. Nhấn `Send` trên request `A. RUN ALL - FR-17 API` để chạy toàn bộ 34 ca test và xem báo cáo Visualizer/Markdown.
Hoặc chạy offline: `node dry_run.js FR17_API_postman_collection.json http://localhost:3000`.

## Bảng kết quả chi tiết
| ID | Mã HTTP | Verdict | Quan sát thực tế | Side-effect / Ghi chú | Bug liên quan |
| :--- | :---: | :---: | :--- | :--- | :--- |
| DT-01 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":90} | Coupon mới xuất hiện trong GET /api/coupons | - |
| DT-02 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":91} | Coupon type fixed xuất hiện trong GET /api/coupons | - |
| DT-03 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":92} | Dữ liệu bị thay đổi: chấp nhận tạo coupon có code rỗng | FR-17-BUG-02 |
| DT-04 | 500 | FAIL | HTTP 500 {"error":"SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code"} | Server crash unhandled SQLITE_CONSTRAINT thay vì 400/409 | FR-17-BUG-03 |
| DT-05 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":93} | Chấp nhận type không hợp lệ ("amount") | FR-17-BUG-02 |
| DT-06 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":94} | Chấp nhận tạo khi thiếu trường bắt buộc type | FR-17-BUG-02 |
| DT-07 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":95} | Chấp nhận discount_value âm (-5) | FR-17-BUG-02 |
| DT-08 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":96} | Chấp nhận tạo khi thiếu trường discount_value | FR-17-BUG-02 |
| DT-09 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":97} | Chấp nhận tạo khi thiếu trường expired_at | FR-17-BUG-02 |
| DT-10 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":98} | Chấp nhận tạo khi thiếu trường min_order_amount | FR-17-BUG-02 |
| DT-11 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":99} | Chấp nhận max_uses_per_user âm (-1) | FR-17-BUG-02 |
| DT-12 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":100} | Chấp nhận tạo khi thiếu trường max_uses_per_user | FR-17-BUG-02 |
| DT-13 | 200 | CẦN LÀM RÕ | HTTP 200 {"message":"Coupon created","id":101} | Tạo được coupon hết hạn quá khứ; SRS không cấm rõ | - |
| DT-14 | 200 | CẦN LÀM RÕ | HTTP 200 {"message":"Coupon created","id":102} | Tạo được với chuỗi ngày sai format; SRS không nêu format | - |
| DT-15 | 200 | PASS | HTTP 200 {"message":"Coupon deleted"} | Coupon tồn tại đã bị xóa khỏi cơ sở dữ liệu | - |
| DT-16 | 200 | FAIL | HTTP 200 {"message":"Coupon deleted"} | Xóa id không tồn tại nhưng trả 200 thành công thay vì 404 | FR-17-BUG-04 |
| BV-01 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":104} | discount_value = -1 (dưới biên > 0) vẫn được tạo | FR-17-BUG-02 |
| BV-02 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":105} | discount_value = 0 (biên = 0, không dương) vẫn được tạo | FR-17-BUG-02 |
| BV-03 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":106} | discount_value = 1 (dương tối thiểu) tạo thành công | - |
| BV-04 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":107} | min_order_amount = -1 (dưới biên >= 0) vẫn được tạo | FR-17-BUG-02 |
| BV-05 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":108} | min_order_amount = 0 (đúng biên >= 0) tạo thành công | - |
| BV-06 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":109} | min_order_amount = 1 (dương nhỏ nhất) tạo thành công | - |
| BV-07 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":110} | max_uses_per_user = 0 (dưới biên >= 1) vẫn được tạo | FR-17-BUG-02 |
| AC-01 | 401 | PASS | HTTP 401 {"error":"Unauthorized"} | Thiếu Authorization header bị từ chối chính xác | - |
| AC-02 | 401 | PASS | HTTP 401 {"error":"Unauthorized"} | Header sai định dạng (không Bearer) bị từ chối 401 | - |
| AC-03 | 403 | PASS | HTTP 403 {"error":"Forbidden"} | Token giả mạo chữ ký bị từ chối 403 Forbidden | - |
| AC-04 | 200 | FAIL | HTTP 200 {"message":"Coupon created","id":111} | User thường tạo được coupon admin (lỗ hổng RBAC) | FR-17-BUG-01 |
| AC-05 | 401 | PASS | HTTP 401 {"error":"Unauthorized"} | DELETE thiếu header Authorization bị từ chối 401 | - |
| AC-06 | 200 | FAIL | HTTP 200 {"message":"Coupon deleted"} | User thường xóa được coupon admin (lỗ hổng RBAC) | FR-17-BUG-01 |
| BL-01 | 200 | PASS | HTTP 200 [{"id":1,"code":"SAVE10",...}] | Admin lấy được danh sách coupon đầy đủ các trường | - |
| BL-02 | 200 | PASS | HTTP 200 {"message":"Coupon created","id":114} | Tạo coupon và kiểm tra xuất hiện ngay trong danh sách | - |
| BL-03 | 200 | PASS | HTTP 200 {"message":"Coupon deleted"} | Xóa coupon và kiểm tra biến mất ngay khỏi danh sách | - |
| BL-04 | 200 | CẦN LÀM RÕ | HTTP 200 {"message":"Coupon created","id":116} | Body gửi is_active=0 nhưng hệ thống lưu is_active=1 | - |
| BL-05 | 200 | CẦN LÀM RÕ | HTTP 200 {"message":"Coupon deleted"} | DELETE lần 2 id vừa xóa vẫn báo 200 Coupon deleted | - |

## Gom test đỏ theo nguyên nhân gốc
| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm |
| :--- | :--- | :--- | :---: | :--- |
| FR-17-BUG-01 | Thiếu kiểm tra phân quyền vai trò Admin (RBAC) trên các endpoint POST và DELETE /api/admin/coupons | AC-04, AC-06 | Critical | R1, R3, SEC-03 |
| FR-17-BUG-02 | Endpoint POST /api/admin/coupons thiếu toàn bộ validation dữ liệu đầu vào cho các trường bắt buộc và miền giá trị | DT-03, DT-05, DT-06, DT-07, DT-08, DT-09, DT-10, DT-11, DT-12, BV-01, BV-02, BV-04, BV-07 | High | R4, R6, R7, R8, R9, R10 |
| FR-17-BUG-03 | Lỗi trùng mã giảm giá không được bắt và xử lý ở tầng controller, làm bung ngoại lệ SQLite gây HTTP 500 | DT-04 | Medium | R5 |
| FR-17-BUG-04 | Endpoint DELETE /api/admin/coupons/:id không kiểm tra số dòng bị ảnh hưởng, trả về 200 OK ngay cả khi id không tồn tại | DT-16 | Low | R12 |

## Tổng kết
| Chỉ số | Số lượng |
| :--- | :--- |
| Tổng ca test thiết kế & chạy | 34 |
| Passed | 13 (38.2%) |
| Failed | 17 (50.0%) |
| CẦN LÀM RÕ (SRS im lặng) | 4 (11.8%) |
| Số lượng bug phát hiện | 4 nguyên nhân gốc |

## Phụ lục: Câu hỏi cần làm rõ với GV/TA
| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tester | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :---: |
| 1 | Hạn dùng `expired_at` là ngày trong quá khứ (`DT-13`) | SRS R8 chỉ ghi "expired_at: ngày hết hạn, bắt buộc", không nói rõ ngày quá khứ có bị chặn khi tạo hay không | Hệ thống hiện chấp nhận tạo (HTTP 200) | Giả định nên từ chối 400 | Chưa hỏi |
| 2 | Định dạng ngày `expired_at` (`DT-14`) | SRS không quy định format (ISO 8601 `YYYY-MM-DD` hay chuỗi ngày tự do) | Hệ thống lưu chuỗi thô bất kỳ (kể cả `31-12-2099`) | Giả định cần chuẩn hóa format ISO 8601 | Chưa hỏi |
| 3 | Mass assignment trường `is_active` (`BL-04`) | SRS không nói client có được đặt `is_active` khi POST tạo coupon không | Hệ thống bỏ qua giá trị client gửi và luôn gán cứng `is_active = 1` | Giả định đây là hành vi hợp lý (server-side default) | Chưa hỏi |
| 4 | Thao tác xóa lặp lại (Double delete) (`BL-05`) | SRS không nêu rõ gọi DELETE lần 2 với id vừa xóa xong có trả về 404 hay 200 (idempotent) | Hệ thống luôn trả về HTTP 200 | Giả định nên trả về 404 | Chưa hỏi |

## Chi tiết từng bug (Bug Write-up)

### FR-17-BUG-01 – User thường có thể tạo và xóa mã giảm giá do thiếu phân quyền (RBAC)
- **Điều kiện / Bước tái hiện**:
  - Request `FR-17-BUG-01a`: `POST /api/admin/coupons` với token của user thường (`test@eshop.com`).
  - Request `FR-17-BUG-01b`: `DELETE /api/admin/coupons/1` với token của user thường.
- **Kỳ vọng**: SRS mục 2.17 (R1: "Admin có quyền: Tạo mã giảm giá mới", R3: "Admin có quyền: Xóa mã giảm giá") và SEC-03 (Kiểm soát truy cập dựa trên vai trò). Kỳ vọng hệ thống từ chối với `HTTP 403 Forbidden`.
- **Thực tế**: Server trả về `HTTP 200 OK`, tạo mới và xóa coupon thành công từ tài khoản user thường.
- **Mức độ**: **Critical** — Lỗ hổng bảo mật nghiêm trọng (vượt quyền), người dùng thường có thể can thiệp tạo coupon tùy tiện hoặc xóa coupon của quản trị viên.

### FR-17-BUG-02 – POST /api/admin/coupons thiếu validation trường bắt buộc và miền giá trị
- **Điều kiện / Bước tái hiện**: Các request `FR-17-BUG-02a` đến `FR-17-BUG-02f` trong Folder B:
  - `BUG-02a`: `code` rỗng `""`
  - `BUG-02b`: `type` không hợp lệ (`"amount"`)
  - `BUG-02c`: `discount_value` âm (`-5`)
  - `BUG-02d`: Thiếu trường bắt buộc `expired_at`
  - `BUG-02e`: `min_order_amount` âm (`-1`)
  - `BUG-02f`: `max_uses_per_user` bằng 0 (`0`)
- **Kỳ vọng**: SRS mục 2.17 (R4: code không rỗng; R6: type chỉ nhận percent/fixed, bắt buộc; R7: discount_value > 0, bắt buộc; R8: expired_at bắt buộc; R9: min_order_amount >= 0, bắt buộc; R10: max_uses_per_user >= 1, bắt buộc). Kỳ vọng từ chối với `HTTP 400 Bad Request`.
- **Thực tế**: Server đều trả về `HTTP 200 {"message":"Coupon created"}` và lưu vào cơ sở dữ liệu.
- **Mức độ**: **High** — Chức năng cốt lõi lưu trữ dữ liệu không hợp lệ, dẫn đến sai lệch tiền bạc khi áp dụng giảm giá vào đơn hàng.

### FR-17-BUG-03 – Trùng mã giảm giá gây lỗi máy chủ 500 SQLite Unhandled Exception thay vì 400/409
- **Điều kiện / Bước tái hiện**:
  - Request `FR-17-BUG-03a`: Gửi `POST /api/admin/coupons` với `code: "SAVE10"` (mã đã tồn tại trong DB).
- **Kỳ vọng**: SRS R5 ("Trùng mã: Hệ thống từ chối và thông báo 'Mã giảm giá đã tồn tại'"). Kỳ vọng trả về `HTTP 400 Bad Request` hoặc `HTTP 409 Conflict`.
- **Thực tế**: Server trả về `HTTP 500 Internal Server Error` kèm body lỗi chưa bắt: `{"error":"SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code"}`.
- **Mức độ**: **Medium** — Không làm hỏng dữ liệu nhưng làm lộ cấu trúc cơ sở dữ liệu backend và vi phạm chuẩn mã phản hồi nghiệp vụ.

### FR-17-BUG-04 – DELETE /api/admin/coupons/:id với id không tồn tại trả về 200 OK thay vì 404
- **Điều kiện / Bước tái hiện**:
  - Request `FR-17-BUG-04a`: Gửi `DELETE /api/admin/coupons/99999` với quyền Admin.
- **Kỳ vọng**: SRS R12 ("id không tồn tại: Thông báo 'Không tìm thấy mã giảm giá'"). Kỳ vọng `HTTP 404 Not Found` (hoặc 400).
- **Thực tế**: Server trả về `HTTP 200 OK {"message":"Coupon deleted"}`.
- **Mức độ**: **Low** — Không phá hỏng dữ liệu nhưng báo sai trạng thái thực thi.

