# FR-20 – Mobile: Đăng ký và Hủy đơn · Câu hỏi cần làm rõ với GV/TA

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
