# FR-08 – Thanh toán (Checkout) · Kết quả

## Bước 7: Thực thi và kết quả

### 7.1 Môi trường
- **Hệ điều hành**: Windows 11
- **SUT (System Under Test)**: Backend Node.js + Express + SQLite (`http://localhost:3000`)
- **Công cụ kiểm thử**: Postman Collection (`FR08_API_postman_collection_2.json`) — Folder A (Full Automated Suite) & Folder B (Bug Reproduction)
- **Thời gian chạy**: 2026-10-20T15:16:21.977Z

---

### 7.2 Cách chạy
- Mở Postman, chọn request duy nhất trong **Folder A** (`A. RUN ALL - FR-08 API`).
- Nhấn **Send**. Script tự động đăng nhập user, dựng dữ liệu giỏ hàng, thực thi 41 ca kiểm thử liên tiếp và render báo cáo visualizer.

---

### 7.3 Bảng kết quả chi tiết

- **Verdict**: `PASS` (Đúng SRS) / `FAIL` (Sai SRS) / `CẦN LÀM RÕ` (SRS im lặng, KHÔNG tính là PASS).

| ID | Mã HTTP | Verdict | Quan sát thực tế | Side-effect / Ghi chú | Bug liên quan |
| :--- | :-: | :-: | :--- | :--- | :--- |
| DT-01 | 200 | **FAIL** | Checkout trả lời 200 nhưng giỏ hàng sau checkout còn 23 món | Giỏ hàng không bị xóa | FR-08-BUG-03 |
| DT-02 | 401 | **PASS** | `{"error":"Unauthorized"}` | Không tạo đơn hàng | |
| DT-03 | 403 | **PASS** | `{"error":"Forbidden"}` | Thiếu tiền tố Bearer bị chặn | |
| DT-04 | 403 | **PASS** | `{"error":"Forbidden"}` | Chữ ký hỏng bị chặn | |
| DT-05 | 403 | **PASS** | `{"error":"Forbidden"}` | Token hết hạn bị chặn | |
| DT-06 | 403 | **CẦN LÀM RÕ** | `{"error":"Forbidden"}` | SRS im lặng về token revoked | |
| DT-07 | 200 | **PASS** | `{"message":"Checkout successful","orderId":205}` | Khớp giá trị giỏ | |
| DT-08 | 200 | **PASS** | Client gửi 0đ -> DB lưu đúng 200,000đ | Backend tự tính lại chuẩn | |
| DT-09 | 200 | **FAIL** | Gửi `total_amount: "200000"` (String) vẫn chấp nhận 200 OK | Thiếu Schema Validation | FR-08-BUG-02 |
| DT-10 | 200 | **CẦN LÀM RÕ** | Gửi `-100000` vẫn trả về 200 OK | SRS im lặng về số âm | |
| DT-11 | 200 | **CẦN LÀM RÕ** | Gửi `null` vẫn trả về 200 OK | SRS im lặng | |
| BV-03 | 200 | **PASS** | `total_amount = 1`đ -> Chấp nhận 200 OK | Biên dưới số nhỏ nhất | |
| DT-12 | 200 | **PASS** | Địa chỉ văn bản chuẩn | Lưu đúng | |
| DT-13 | 200 | **PASS** | Địa chỉ chứa script XSS -> Chấp nhận 200 OK | Lưu văn bản thuần an toàn | FR-08-BUG-08 |
| DT-14 | 200 | **FAIL** | Gửi `shipping_address: 12345` (Number) vẫn trả lời 200 OK | Thiếu Schema Validation | FR-08-BUG-05 |
| DT-15 | 200 | **CẦN LÀM RÕ** | Địa chỉ rỗng `""` vẫn cho đặt hàng thành công | Thiếu validation địa chỉ bắt buộc | FR-08-BUG-05 |
| DT-16 | 200 | **CẦN LÀM RÕ** | Địa chỉ `"   "` vẫn cho đặt hàng thành công | Thiếu validation space | FR-08-BUG-05 |
| DT-17 | 200 | **CẦN LÀM RÕ** | Địa chỉ `null` vẫn cho đặt hàng thành công | Thiếu validation null | FR-08-BUG-05 |
| BV-05 | 200 | **PASS** | Địa chỉ 1 ký tự (`"A"`) | Lưu đúng | |
| BV-08 | 200 | **CẦN LÀM RÕ** | Địa chỉ 255 ký tự | SRS im lặng về Max length | |
| DT-18 | 200 | **CẦN LÀM RÕ** | Địa chỉ 1000 ký tự | SRS im lặng về Max length | |
| DT-19 | 200 | **PASS** | Thêm giỏ `quantity: 2` thành công | | |
| DT-20 | 200 | **FAIL** | Thêm giỏ `quantity: "2"` (String) vẫn nhận 200 OK | Thiếu Schema Validation | FR-08-BUG-02 |
| DT-21 | 200 | **CẦN LÀM RÕ** | Thêm giỏ `quantity: 0` vẫn nhận 200 OK | SRS im lặng | |
| DT-22 | 200 | **CẦN LÀM RÕ** | Thêm giỏ `quantity: -1` vẫn nhận 200 OK | SRS im lặng | |
| DT-23 | 200 | **CẦN LÀM RÕ** | Thêm giỏ `quantity: 999999` vẫn nhận 200 OK | SRS im lặng | |
| DT-24 | 200 | **PASS** | Thêm giỏ `price: 100000` thành công | | |
| DT-25 | 200 | **FAIL** | Thêm giỏ `price: "100000"` (String) vẫn nhận 200 OK | Thiếu Schema Validation | FR-08-BUG-02 |
| DT-26 | 200 | **CẦN LÀM RÕ** | Thêm giỏ `price: 0` vẫn nhận 200 OK | SRS im lặng | |
| DT-27 | 200 | **CẦN LÀM RÕ** | Thêm giỏ `price: -50000` vẫn nhận 200 OK | SRS im lặng | |
| DT-28 | 200 | **PASS** | Checkout giỏ hàng 1 sản phẩm | | |
| DT-29 | 200 | **CẦN LÀM RÕ** | Checkout giỏ hàng rỗng (0 SP) vẫn nhận 200 OK | Lỗ hổng cho phép đơn 0đ | FR-08-BUG-04 |
| AC-01 | 401 | **PASS** | Không token -> Bị từ chối | | FR-08-BUG-01 |
| AC-02 | 401 | **PASS** | Lấy giỏ không token -> Bị từ chối | | |
| AC-03 | 401 | **PASS** | Thêm giỏ không token -> Bị từ chối | | |
| AC-04 | 401 | **PASS** | Xem đơn không token -> Bị từ chối | | |
| AC-05 | 403 | **PASS** | Token hỏng -> Bị từ chối | | FR-08-BUG-01 |
| BL-01 | 200 | **FAIL** | Giỏ có 2 SP (300k), client truyền 1đ -> DB lưu nhầm 200k | Tích dồn giỏ hàng cũ làm sai tiền | FR-08-BUG-02 |
| BL-02 | 200 | **FAIL** | Checkout thành công nhưng giỏ còn lại 45 món | Giỏ hàng không bị xóa | FR-08-BUG-03 |
| BL-03 | 403 | **PASS** | Checkout thất bại -> Giỏ giữ nguyên 46 món | | |
| BL-05 | 200 | **PASS** | User 2 gọi `my-orders` không thấy đơn của User 1 | Cách ly dữ liệu tốt | FR-08-BUG-07 |

---

## Bước 8: Danh sách Bug chi tiết theo Kịch bản kiểm thử (Folder B)

| Bug ID | Mô tả tóm tắt lỗi | Ca test liên quan | Mức độ | Yêu cầu SRS bị vi phạm |
| :--- | :--- | :--- | :-: | :--- |
| **FR-08-BUG-01** | Cho phép Checkout khi chưa đăng nhập hoặc Token không hợp lệ | `AC-01`, `DT-04` | **Critical** | FR-08, SEC-02 |
| **FR-08-BUG-02** | Backend tin tưởng total_amount do Client gửi lên thay vì tự tính lại từ giỏ hàng | `DT-07`, `BL-01` | **High** | FR-08 (R2, R4) |
| **FR-08-BUG-03** | Giỏ hàng KHÔNG được xóa tự động sau khi thanh toán thành công | `DT-01`, `BL-02` | **Critical** | FR-08 (R5) |
| **FR-08-BUG-04** | Cho phép Checkout khi giỏ hàng rỗng (0 sản phẩm) | `DT-29` | **High** | FR-08 Logic Nghiệp vụ |
| **FR-08-BUG-05** | Địa chỉ giao hàng (shipping_address) rỗng hoặc null vẫn cho phép đặt hàng | `DT-14`, `DT-15`, `DT-17` | **High** | FR-08 (R8) |
| **FR-08-BUG-06** | Chi tiết đơn hàng không lưu đúng/đầy đủ sản phẩm từ giỏ hàng | `BL-01` | **Medium** | FR-08 (R3, R4) |
| **FR-08-BUG-07** | Rò rỉ dữ liệu đơn hàng giữa các tài khoản người dùng khác nhau | `BL-05` | **Critical** | FR-08, SEC (Data Isolation) |
| **FR-08-BUG-08** | Lưu vết kịch bản XSS trong shipping_address không escape | `DT-13` | **Medium** | FR-08, SEC-04 (R7) |

---

## Bước 10: Tổng kết

| Chỉ số | Số lượng |
| :--- | :-: |
| **Tổng ca test thiết kế & chạy** | **41** |
| Passed | 20 (48.8%) |
| Failed | 7 (17.1%) |
| CẦN LÀM RÕ (SRS im lặng) | 14 (34.1%) |
| **Số lượng Bug phát hiện (Folder B)** | **8 Kịch bản Bug** |

---

## Phụ lục A: Câu hỏi cần làm rõ với GV/TA

| # | Biến / Tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tester | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | Checkout giỏ rỗng (`DT-29`) | Giỏ hàng rỗng (0 SP) có cho phép Checkout không? | HTTP 200 (Sinh đơn 0đ) | Giỏ hàng rỗng phải bị từ chối | Chưa hỏi |
| 2 | `shipping_address = ""` (`DT-15`) | Địa chỉ giao hàng rỗng có hợp lệ không? | HTTP 200 (Cho đặt hàng) | Địa chỉ là bắt buộc | Chưa hỏi |
| 3 | `shipping_address = "   "` (`DT-16`) | Chuỗi toàn khoảng trắng có tính là rỗng không? | HTTP 200 | Tính là rỗng, từ chối | Chưa hỏi |
| 4 | `shipping_address = null` (`DT-17`) | Địa chỉ bằng `null` có hợp lệ không? | HTTP 200 | Từ chối request | Chưa hỏi |
| 5 | `quantity = 0` (`DT-21`) | Thêm sản phẩm số lượng 0 vào giỏ hàng xử lý ra sao? | HTTP 200 | Từ chối hoặc tự xóa item | Chưa hỏi |
| 6 | `quantity = -1` (`DT-22`) | Thêm sản phẩm số lượng âm vào giỏ hàng? | HTTP 200 | Từ chối (bắt buộc > 0) | Chưa hỏi |
| 7 | `price = 0` (`DT-26`) | Đơn giá sản phẩm bằng 0 có hợp lệ không? | HTTP 200 | Từ chối | Chưa hỏi |
| 8 | `price = -50000` (`DT-27`) | Đơn giá sản phẩm âm có hợp lệ không? | HTTP 200 | Từ chối | Chưa hỏi |
| 9 | `total_amount = -100000` (`DT-10`) | `total_amount` client gửi là số âm? | HTTP 200 (Backend tự bỏ qua) | Bỏ qua là đúng (R4) | Chưa hỏi |
| 10 | `total_amount = null` (`DT-11`) | Client không gửi `total_amount`? | HTTP 200 (Backend tự bỏ qua) | Bỏ qua là đúng (R4) | Chưa hỏi |
| 11 | Địa chỉ dài 1000 ký tự (`DT-18`) | Giới hạn độ dài tối đa của địa chỉ giao hàng? | HTTP 200 (Lưu đủ 1000 ký tự) | Nên giới hạn $\le 255$ ký tự | Chưa hỏi |
| 12 | Token đã logout/revoked (`DT-06`) | Token thuộc tài khoản đã logout có dùng checkout được không? | HTTP 403 (Từ chối) | Từ chối là hợp lý | Chưa hỏi |
| 13 | Thay đổi giá ở DB trước checkout | Đổi giá ở DB ngay trước checkout thì tính theo giá nào? | Backend tự tính theo giá DB | Tính theo giá DB thời điểm checkout | Chưa hỏi |
| 14 | Biến động tồn kho | Thanh toán thành công có tự động trừ kho không? | SRS không nêu | Cần xác nhận với BA | Chưa hỏi |