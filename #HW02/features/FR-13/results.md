# FR-13 – Dashboard & Quản lý đơn hàng · Kết quả

## Bước 7: Thực thi và kết quả

### 7.1 Môi trường
- Hệ điều hành: Windows
- Môi trường chạy: Node.js Backend (`http://localhost:3000`), Postman v11.x
- Collection: `FR13_API_postman_collection.json` (Chạy tự động toàn bộ 35 test cases qua Folder A)

### 7.2 Cách chạy

- Mở Collection trên Postman $\rightarrow$ Chọn request `A. RUN ALL - FR-13 API` $\rightarrow$ Bấm **Send**.
- Script tự động đăng nhập tài khoản Admin/User mẫu, thực hiện chuỗi thao tác Checkout, Cập nhật trạng thái đơn hàng, Đọc kiểm tra số liệu Dashboard, đối chiếu với CSDL và xuất kết quả trực tiếp ra tab **Test Results** & **Visualizer**.

### 7.3 Bảng kết quả thực thi
*Thời gian chạy: 2026-10-20T14:17:49.774Z | baseUrl: http://localhost:3000*
*Verdict: `PASS` (Đúng SRS) / `FAIL` (Sai SRS - có Bug) / `CẦN LÀM RÕ` (SRS im lặng, chưa kết luận).*

| ID | HTTP | Verdict | Quan sát (Dữ liệu thực tế trả về) | Side-effect | Bug ID |
| :--- | :-: | :-: | :--- | :--- | :-: |
| DT-01 | 200 | PASS | Checkout successful, orderId: 144 / Số đơn tăng = 1 | — |  |
| DT-02 | 200 | FAIL | kỳ vọng 4xx + không tạo đơn; thực tế: HTTP 200, orderId: 145 / Số đơn tăng = 1 | Tạo đơn thiếu amount | FR-13-BUG-01 |
| DT-03 | 200 | CẦN LÀM RÕ | Hệ thống CHẤP NHẬN chuỗi "200000", orderId: 146 / Số đơn tăng = 1 | Ép kiểu tự động |  |
| DT-04 | 200 | FAIL | kỳ vọng 4xx + không tạo đơn; thực tế: HTTP 200, orderId: 147 / Số đơn tăng = 1 | Tạo đơn với amount=true | FR-13-BUG-01 |
| DT-05 | 200 | FAIL | kỳ vọng 4xx + không tạo đơn; thực tế: HTTP 200, orderId: 148 / Số đơn tăng = 1 | Tạo đơn thiếu address | FR-13-BUG-01 |
| DT-06 | 200 | CẦN LÀM RÕ | Hệ thống CHẤP NHẬN address rỗng "", orderId: 149 / Số đơn tăng = 1 | Lưu address rỗng |  |
| DT-07 | 200 | CẦN LÀM RÕ | Hệ thống CHẤP NHẬN address "   ", orderId: 150 / Số đơn tăng = 1 | Lưu khoảng trắng |  |
| BV-01 | 200 | CẦN LÀM RÕ | Hệ thống CHẤP NHẬN amount = 0, orderId: 151 / Số đơn tăng = 1 | Đơn hàng 0 đồng |  |
| BV-02 | 200 | CẦN LÀM RÕ | Hệ thống CHẤP NHẬN amount = -50000, orderId: 152 / Số đơn tăng = 1 | Đơn hàng tiền âm |  |
| BV-03 | 200 | PASS | Checkout successful with amount = 1, orderId: 153 / Số đơn tăng = 1 | — |  |
| BV-04 | 200 | PASS | Checkout successful with amount = 2147483647, orderId: 154 / Số đơn tăng = 1 | — |  |
| TRANS-01 | 200 | PASS | Status updated: pending -> confirmed (thực tế DB: confirmed) | — |  |
| TRANS-02 | 200 | PASS | Status updated: confirmed -> shipping (thực tế DB: shipping) | — |  |
| TRANS-03 | 200 | PASS | Status updated: shipping -> delivered (thực tế DB: delivered) | — |  |
| TRANS-04 | 200 | PASS | Status updated: pending -> canceled (thực tế DB: canceled) | — |  |
| TRANS-05 | 200 | PASS | Status updated: confirmed -> canceled (thực tế DB: canceled) | — |  |
| TRANS-06 | 400 | PASS | Invalid state transition from pending to delivered (thực tế DB: pending) | — |  |
| TRANS-07 | 400 | PASS | Invalid state transition from confirmed to pending (thực tế DB: confirmed) | — |  |
| TRANS-08 | 400 | PASS | Invalid state transition from shipping to canceled (thực tế DB: shipping) | — |  |
| TRANS-09 | 400 | PASS | Invalid state transition from delivered to canceled (thực tế DB: delivered) | — |  |
| TRANS-10 | 400 | PASS | Invalid state transition from canceled to confirmed (thực tế DB: canceled) | — |  |
| TRANS-11 | 400 | PASS | Invalid state transition from pending to completed (thực tế DB: pending) | — |  |
| TRANS-12 | 400 | CẦN LÀM RÕ | Hệ thống TỪ CHỐI status "DELIVERED" (thực tế DB: shipping) | Phân biệt hoa thường |  |
| ID-01 | 404 | PASS | Order not found (khi cập nhật status order id 999999) | — |  |
| ID-02 | 404 | PASS | Order not found (khi cập nhật status order id "abc") | — |  |
| AC-01 | 401 | PASS | Unauthorized (Xem danh sách đơn hàng không có token) | — |  |
| AC-02 | 200 | FAIL | Xem danh sách đơn hàng: token user thường trả về 200 OK kèm danh sách đơn | Lộ dữ liệu Admin | FR-13-BUG-02 |
| AC-03 | 403 | PASS | Forbidden (Xem danh sách đơn hàng với token sai chữ ký) | — |  |
| AC-04 | 401 | PASS | Unauthorized (Sửa status đơn hàng không có token) | — |  |
| AC-05 | 200 | FAIL | Sửa status đơn hàng: token user thường trả về 200 OK "Order status updated" | User sửa được status | FR-13-BUG-02 |
| AC-06 | 401 | PASS | Unauthorized (Đặt hàng Checkout không có token) | — |  |
| BL-01 | 200 | PASS | Dashboard: Doanh thu tính chuẩn CHỈ từ đơn delivered (6,000,000đ), Tổng đơn = 173 | — |  |
| BL-02 | 200 | PASS | Chuyển đơn sang delivered làm tăng Doanh thu chính xác +200,000đ (6m -> 6.2m) | — |  |
| BL-03 | 200 | PASS | Sửa status giữ nguyên total_amount (150k) và shipping_address gốc | — |  |
| BL-04 | 400 | PASS | Invalid state transition from pending to ' OR '1'='1 | — |  |

---

## Bước 8: Gom test đỏ theo nguyên nhân gốc

Toàn bộ 5 test FAIL được phân tích và gom nhóm về 2 nguyên nhân lỗi gốc (Root Causes) trong cơ sở mã nguồn:

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm |
| :--- | :--- | :--- | :-: | :--- |
| **FR-13-BUG-01** | Backend API Checkout (`POST /api/checkout`) thiếu validate các thuộc tính bắt buộc trong Body JSON (`total_amount`, `shipping_address`), dẫn đến việc gửi thiếu trường hoặc gửi sai kiểu dữ liệu vẫn tạo đơn hàng thành công vào CSDL. | DT-02, DT-04, DT-05 (3 tests) | High | FR-13, API Checkout Specification |
| **FR-13-BUG-02** | Lỗi phân quyền Broken Access Control: Các API Admin (`/api/admin/orders` và `/api/admin/orders/:id/status`) chỉ kiểm tra sự tồn tại của Token mà không kiểm tra claim `role = 'admin'`, cho phép tài khoản `user` thường truy cập và thao tác dữ liệu Admin. | AC-02, AC-05 (2 tests) | Critical | FR-12, SEC-03 |

---

## Bước 10: Tổng kết

| Chỉ số | Số lượng |
| :--- | :-: |
| **Pool** | A |
| **Tổng số Test Cases đã thiết kế & thực thi** | **35** (Domain: 21, BVA: 4, Business/Access/Security: 10) |
| **Passed** | **24** |
| **Failed** | **5** |
| **Cần làm rõ (Clarify)** | **6** |
| **Chưa chạy** | 0 |
| **Tổng số Bug phát hiện** | **2** |

---

## Phụ lục A: Câu hỏi cần làm rõ với GV/TA

Các trường hợp kiểm thử trả về chỉ số **CẦN LÀM RÕ** (SRS im lặng / không quy định rõ) được tổng hợp dưới đây để gửi Giảng viên/TA xác nhận:

| # | Biến / Tình huống | Điều SRS chưa nêu rõ | Hệ thống hiện xử lý thế nào | Giả định tạm của Kiểm thử viên | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `total_amount = "200000"` (DT-03) | Có cho phép truyền số dạng chuỗi ký tự hay không | HTTP 200, tự động ép kiểu | Nên bắt buộc kiểu Number thuần túy | Chưa hỏi |
| 2 | `shipping_address = ""` (DT-06) | Địa chỉ nhận hàng có bắt buộc nhập không | HTTP 200, lưu địa chỉ rỗng | Địa chỉ nhận hàng phải bắt buộc nhập | Chưa hỏi |
| 3 | `shipping_address = "   "` (DT-07) | Chuỗi chỉ gồm khoảng trắng có coi là rỗng không | HTTP 200, lưu chuỗi khoảng trắng | Phải trim() và báo lỗi nếu rỗng | Chưa hỏi |
| 4 | `total_amount = 0` (BV-01) | Hệ thống có chấp nhận đơn hàng 0 đồng không | HTTP 200, tạo đơn 0 đồng | Đơn hàng phải có giá trị > 0 | Chưa hỏi |
| 5 | `total_amount = -50000` (BV-02) | Cho phép tạo đơn hàng số tiền âm không | HTTP 200, tạo đơn tiền âm | Không cho phép số tiền âm | Chưa hỏi |
| 6 | `status = "DELIVERED"` (TRANS-12) | Tên trạng thái có phân biệt hoa/thường không | HTTP 400, từ chối dạng viết hoa | Bắt buộc đúng chuẩn chữ thường Enum | Chưa hỏi |