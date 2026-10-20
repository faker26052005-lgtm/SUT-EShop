# FR-08-01 – FR-08 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:37:46 (UTC+0700) |
| Feature / bước | FR-08 – Bước 1 - trích yêu cầu |
| Chat / phiên | FR8 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Bạn là kỹ sư kiểm thử phần mềm. Tôi sẽ kiểm thử black-box feature {FR_08} của hệ thống EShop bằng Domain Testing và Boundary Value Analysis. Ta làm theo từng bước, mỗi bước một yêu cầu riêng.

BƯỚC 1 – TRÍCH YÊU CẦU.
Dưới đây là đặc tả (SRS) và tài liệu API của feature. Chỉ dùng thông tin trong hai tài liệu này; không suy đoán thêm và không dùng kiến thức về cách hệ thống được cài đặt.

ĐẦU VÀO CHO AI – FR-08 (dán nguyên khối này vào Prompt 1)
A. Trích SRS – FR-08: Thanh toán (Checkout)
- Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được.
- Tổng tiền thanh toán được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.
- Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua.
- Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount do client gửi lên.
- Sau thanh toán thành công, giỏ hàng được xóa.
B. Trích SRS – Yêu cầu bảo mật liên quan
MãNội dungSEC-02Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.SEC-04Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng innerHTML trực tiếp.C. Trích tài liệu API – Giỏ hàng & Đơn hàng (Cart & Orders)
Yêu cầu Header: Authorization: Bearer <token>
4.1 Lấy giỏ hàng
- Endpoint: GET /api/cart
4.2 Thêm vào giỏ hàng
- Endpoint: POST /api/cart
- Body (JSON):{  "id": 1,  "name": "Sản phẩm A",  "price": 100000,  "quantity": 2}
4.3 Đặt hàng (Checkout)
- Endpoint: POST /api/checkout
- Body (JSON):{  "total_amount": 200000,  "shipping_address": "123 Le Loi, TP.HCM"}
4.4 Lấy lịch sử đơn hàng cá nhân
- Endpoint: GET /api/orders/my-orders


Yêu cầu:
1. Lập bảng yêu cầu: Mã (R1, R2...), nội dung ngắn gọn, nguồn (mục SRS/SEC), loại (input / nghiệp vụ / bảo mật / truy cập).
2. Liệt kê endpoint liên quan: method, đường dẫn, có cần token không, body.
3. Liệt kê riêng các chỗ SRS im lặng hoặc mơ hồ (điều người kiểm thử cần biết để viết kỳ vọng nhưng SRS không nói). Mỗi chỗ ghi "CẦN LÀM RÕ" và không tự đoán kỳ vọng.
Chỉ trả về kết quả bước 1, chưa sinh test case.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả thực hiện **BƯỚC 1 - TRÍCH YÊU CẦU** dựa trên tài liệu Đặc tả (SRS) và API bạn đã cung cấp:

### 1. Bảng phân tích yêu cầu (Requirements Table)

| Mã | Nội dung ngắn gọn | Nguồn | Loại |
| --- | --- | --- | --- |
| **R1** | Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được. | FR-08 | Truy cập |
| **R2** | Tổng tiền được tính tự động từ giỏ hàng, không cho phép client chỉnh sửa. | FR-08 | Nghiệp vụ / Input |
| **R3** | Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua. | FR-08 | Nghiệp vụ |
| **R4** | Backend tự tính lại tổng tiền, bỏ qua trường `total_amount` từ client gửi lên. | FR-08 | Nghiệp vụ / Bảo mật |
| **R5** | Sau khi thanh toán thành công, giỏ hàng phải được xóa. | FR-08 | Nghiệp vụ |
| **R6** | Các API bảo mật yêu cầu JWT Token hợp lệ. | SEC-02 | Bảo mật / Truy cập |
| **R7** | Mọi dữ liệu user nhập vào hiển thị trên UI phải được escape đúng cách (chống XSS). | SEC-04 | Bảo mật |
| **R8** | Cung cấp địa chỉ giao hàng (`shipping_address`) khi thanh toán. | API 4.3 | Input |

---

### 2. Danh sách Endpoint liên quan

Tất cả các endpoint dưới đây đều ngầm định yêu cầu Header: `Authorization: Bearer <token>` dựa theo yêu cầu bảo mật.

| Method | Đường dẫn (Endpoint) | Cần Token? | Body (Payload) |
| --- | --- | --- | --- |
| **GET** | `/api/cart` | Có | *(Không có)* |
| **POST** | `/api/cart` | Có | `{ "id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2 }` |
| **POST** | `/api/checkout` | Có | `{ "total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM" }` |
| **GET** | `/api/orders/my-orders` | Có | *(Không có)* |

---

### 3. Các điểm mơ hồ / Im lặng trong SRS (Cần làm rõ)

Dưới đây là các trường hợp tài liệu chưa quy định rõ, tester không được tự đoán kỳ vọng mà cần BA/Dev xác nhận:

* **CẦN LÀM RÕ:** Hệ thống xử lý thế nào nếu người dùng gọi API Checkout (`POST /api/checkout`) nhưng **giỏ hàng đang trống**? (Có báo lỗi không, HTTP Status Code là gì?).
* **CẦN LÀM RÕ:** Ràng buộc dữ liệu đầu vào của trường `shipping_address` là gì? (Có bắt buộc không, độ dài tối đa/tối thiểu, có cho phép ký tự đặc biệt không, xử lý rỗng/null như thế nào?).
* **CẦN LÀM RÕ:** Phương thức thanh toán (Payment Method) của hệ thống là gì? API checkout không truyền phương thức thanh toán, vậy đây là thanh toán COD (nhận hàng trả tiền) hay mặc định trừ tiền qua ví/thẻ?
* **CẦN LÀM RÕ:** Khi JWT Token không hợp lệ, hết hạn, hoặc bị thiếu thì hệ thống trả về HTTP Status Code nào (401 Unauthorized hay 403 Forbidden)? Format response lỗi ra sao?
* **CẦN LÀM RÕ:** Xử lý thế nào nếu có sự thay đổi về giá hoặc sản phẩm hết hàng (Out of stock) ngay tại thời điểm người dùng bấm thanh toán?
* **CẦN LÀM RÕ:** Cấu trúc Response của `POST /api/checkout` trả về gì khi thanh toán thành công? (Có trả về Order ID không?).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
