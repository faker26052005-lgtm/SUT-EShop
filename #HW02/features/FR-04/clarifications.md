# FR-04 – Quản lý hồ sơ cá nhân · Câu hỏi cần làm rõ với GV/TA

Mỗi chỗ SRS im lặng là một dòng. Không mở bug cho các mục này. Mục 1–7 ứng với 7 test CẦN LÀM RÕ, mục 8–9 là các giả định đằng sau những verdict PASS/FAIL ở trên.

| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tôi | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `phone = ""` (DT-09) | SĐT có bắt buộc không, có xóa được SĐT không | HTTP 200, lưu chuỗi rỗng | SĐT là trường tùy chọn, xóa được; nếu thế thì không phải bug | Chưa hỏi |
| 2 | `phone = null` (DT-08d) | Giống mục 1, với giá trị null | HTTP 200, lưu `null` | Như mục 1 | Chưa hỏi |
| 3 | `name = ""` (DT-12) | Họ Tên có bắt buộc không | HTTP 200, lưu rỗng | Họ Tên không được rỗng (nếu đúng thì đây là bug) | Chưa hỏi |
| 4 | `name = "   "` (DT-13) | Chuỗi toàn khoảng trắng có tính là rỗng không | HTTP 200, lưu nguyên | Như mục 3 | Chưa hỏi |
| 5 | `name = "<b>x</b>"` (DT-14) | Server có phải lọc HTML không, hay chỉ cần UI escape khi hiển thị (SEC-04) | HTTP 200, lưu nguyên thẻ HTML | Server lưu nguyên, UI phải escape; TODO kiểm tra thêm trên giao diện web | Chưa hỏi |
| 6 | `shipping_address = ""` (DT-16) | Địa chỉ mặc định có bắt buộc không | HTTP 200, lưu rỗng | Địa chỉ là trường tùy chọn | Chưa hỏi |
| 7 | `name` dài 1000 ký tự (DT-17) | Có giới hạn độ dài tên/địa chỉ không | HTTP 200, lưu đủ 1000 ký tự | Chưa có giả định về giới hạn | Chưa hỏi |
| 8 | Cập nhật một phần (BL-02) | `PUT /api/users/me` chỉ gửi một trường thì các trường còn lại giữ nguyên hay bị xóa | Các trường không gửi bị đặt thành `null` | A1: phải giữ nguyên (BUG-02 phụ thuộc giả định này) | Chưa hỏi |
| 9 | Gửi `email` (BL-03) | "Email không được thay đổi qua giao diện": áp dụng cho cả API không; nếu gửi email thì nên bỏ qua (200) hay từ chối (4xx) | HTTP 200 nhưng email không đổi | Bỏ qua trường email là chấp nhận được, nên tính PASS | Chưa hỏi |
