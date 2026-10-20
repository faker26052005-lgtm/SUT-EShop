# FR-13-04 – FR-13 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:57:56 (UTC+0700) |
| Feature / bước | FR-13 – Bước 4 - Testcase domain testing |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là bảng danh sách Test Cases cho **BƯỚC 4 – TEST CASE DOMAIN TESTING** được xây dựng từ các lớp tương đương ở Bước 3.

Tất cả các test case đều tuân thủ quy tắc **đơn lỗi (Single Fault Assumption)**: mỗi test case không hợp lệ chỉ vi phạm đúng 1 điều kiện, các thông số còn lại đều sử dụng giá trị hợp lệ chuẩn (*Default Header Authorization = Admin JWT hợp lệ; Order ID = 101 hợp lệ*).

### Bảng Test Cases Domain Testing


| ID | Lớp | Mô tả | Input (Request Header / Path / Body) | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- | --- |
| **DT-01** | `AUTH_V1` | Gửi request API Admin với Token Admin hợp lệ | `Header: Authorization = "Bearer <valid_admin_jwt>"`<br><br>`GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng` | R3, R4, R5, SEC-02, SEC-03 |
| **DT-02** | `AUTH_IV1` | Gửi request API Admin nhưng không có Header Authorization | `Header: (Khuyết Header Authorization)`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R4, SEC-02 |
| **DT-03** | `AUTH_IV2` | Gửi request API Admin với Token thiếu tiền tố `Bearer ` | `Header: Authorization = "<valid_admin_jwt>"`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R4, SEC-02 |
| **DT-04** | `AUTH_IV3` | Gửi request API Admin với Token sai chữ ký/cấu trúc | `Header: Authorization = "Bearer invalid.jwt.string"`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R4, SEC-02 |
| **DT-05** | `AUTH_IV4` | Gửi request API Admin với Token đã hết hạn (`exp`) | `Header: Authorization = "Bearer <expired_admin_jwt>"`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R4, SEC-02 |
| **DT-06** | `AUTH_IV5` | Gửi request API Admin với Token người dùng thường (`role = 'user'`) | `Header: Authorization = "Bearer <valid_user_jwt>"`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R3, R5, SEC-03 |
| **DT-07** | `AUTH_IV6` | Gửi request API Admin với Token thiếu claim `role` | `Header: Authorization = "Bearer <valid_jwt_no_role>"`<br><br>`GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R3, R5, SEC-03 |
| **DT-08** | `ID_V1` | Cập nhật trạng thái cho Order ID hợp lệ và tồn tại | `Path: /api/admin/orders/101/status`<br><br>`Body: {"status": "confirmed"}` | `2xx và dữ liệu được lưu đúng` | R6 |
| **DT-09** | `ID_IV1` | Cập nhật trạng thái cho Order ID không tồn tại trong hệ thống | `Path: /api/admin/orders/999999/status`<br><br>`Body: {"status": "confirmed"}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-10** | `ID_IV2` | Order ID sai kiểu dữ liệu (chứa chữ/ký tự đặc biệt) | `Path: /api/admin/orders/abc_xyz/status`<br><br>`Body: {"status": "confirmed"}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-11** | `ID_IV3` | Order ID là số âm hoặc bằng 0 | `Path: /api/admin/orders/-5/status`<br><br>`Body: {"status": "confirmed"}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-12** | `ID_IV4` | Thiếu Order ID trên đường dẫn URL | `Path: /api/admin/orders//status`<br><br>`Body: {"status": "confirmed"}` | `CẦN LÀM RÕ` | R6 |
| **DT-13** | `ST_IV1` | Cập nhật trạng thái với giá trị chuỗi không nằm trong Enum 5 trạng thái | `Path: /api/admin/orders/101/status`<br><br>`Body: {"status": "completed"}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-14** | `ST_IV2` | Cập nhật trạng thái với sai kiểu dữ liệu (Number) | `Path: /api/admin/orders/101/status`<br><br>`Body: {"status": 123}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-15** | `ST_IV3` | Cập nhật trạng thái với chuỗi rỗng | `Path: /api/admin/orders/101/status`<br><br>`Body: {"status": ""}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-16** | `ST_IV4` | Cập nhật trạng thái thiếu thuộc tính `status` trong JSON Body | `Path: /api/admin/orders/101/status`<br><br>`Body: {}` | `4xx và dữ liệu không đổi` | R6 |
| **DT-17** | `ST_IV5` | Cập nhật trạng thái viết hoa chữ cái | `Path: /api/admin/orders/101/status`<br><br>`Body: {"status": "DELIVERED"}` | `CẦN LÀM RÕ` | R6 |
| **DT-18** | `AMT_V1` | Checkout với `total_amount` là số nguyên dương hợp lệ | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | `2xx và dữ liệu được lưu đúng` | R1, R2 |
| **DT-19** | `AMT_IV1` | Checkout với `total_amount` số âm | `POST /api/checkout`<br><br>`Body: {"total_amount": -50000, "shipping_address": "123 Le Loi, TP.HCM"}` | `CẦN LÀM RÕ` | R1 |
| **DT-20** | `AMT_IV2` | Checkout với `total_amount` bằng 0 | `POST /api/checkout`<br><br>`Body: {"total_amount": 0, "shipping_address": "123 Le Loi, TP.HCM"}` | `CẦN LÀM RÕ` | R1 |
| **DT-21** | `AMT_IV3` | Checkout với `total_amount` là số thập phân | `POST /api/checkout`<br><br>`Body: {"total_amount": 199000.50, "shipping_address": "123 Le Loi, TP.HCM"}` | `CẦN LÀM RÕ` | R1 |
| **DT-22** | `AMT_IV4` | Checkout với `total_amount` sai kiểu dữ liệu (String) | `POST /api/checkout`<br><br>`Body: {"total_amount": "200000", "shipping_address": "123 Le Loi, TP.HCM"}` | `4xx và dữ liệu không đổi` | R1 |
| **DT-23** | `AMT_IV5` | Checkout thiếu thuộc tính `total_amount` trong JSON Body | `POST /api/checkout`<br><br>`Body: {"shipping_address": "123 Le Loi, TP.HCM"}` | `4xx và dữ liệu không đổi` | R1 |
| **DT-24** | `ADDR_V1` | Checkout với `shipping_address` chuỗi hợp lệ | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | `2xx và dữ liệu được lưu đúng` | R2 |
| **DT-25** | `ADDR_IV1` | Checkout với `shipping_address` chuỗi rỗng | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000, "shipping_address": ""}` | `CẦN LÀM RÕ` | R2 |
| **DT-26** | `ADDR_IV2` | Checkout với `shipping_address` chỉ chứa khoảng trắng | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000, "shipping_address": "   "}` | `CẦN LÀM RÕ` | R2 |
| **DT-27** | `ADDR_IV3` | Checkout với `shipping_address` sai kiểu dữ liệu (Number) | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000, "shipping_address": 123456}` | `4xx và dữ liệu không đổi` | R2 |
| **DT-28** | `ADDR_IV4` | Checkout thiếu thuộc tính `shipping_address` trong JSON Body | `POST /api/checkout`<br><br>`Body: {"total_amount": 200000}` | `4xx và dữ liệu không đổi` | R2 |
| **DT-29** | `TRANS_V1` | Chuyển trạng thái từ `pending` sang `confirmed` | `Path: /api/admin/orders/101/status` *(Status hiện tại: pending)*<br><br>`Body: {"status": "confirmed"}` | `2xx và dữ liệu được lưu đúng` | R7 |
| **DT-30** | `TRANS_V2` | Chuyển trạng thái từ `pending` sang `canceled` | `Path: /api/admin/orders/101/status` *(Status hiện tại: pending)*<br><br>`Body: {"status": "canceled"}` | `2xx và dữ liệu được lưu đúng` | R7 |
| **DT-31** | `TRANS_IV1` | Chuyển trạng thái từ `pending` sang `delivered` (nhảy bước không hợp lệ) | `Path: /api/admin/orders/101/status` *(Status hiện tại: pending)*<br><br>`Body: {"status": "delivered"}` | `4xx và dữ liệu không đổi` | R7 |
| **DT-32** | `TRANS_V3` | Chuyển trạng thái từ `confirmed` sang `shipping` | `Path: /api/admin/orders/102/status` *(Status hiện tại: confirmed)*<br><br>`Body: {"status": "shipping"}` | `2xx và dữ liệu được lưu đúng` | R7 |
| **DT-33** | `TRANS_V4` | Chuyển trạng thái từ `confirmed` sang `canceled` | `Path: /api/admin/orders/102/status` *(Status hiện tại: confirmed)*<br><br>`Body: {"status": "canceled"}` | `2xx và dữ liệu được lưu đúng` | R7 |
| **DT-34** | `TRANS_IV2` | Chuyển trạng thái từ `confirmed` quay ngược về `pending` | `Path: /api/admin/orders/102/status` *(Status hiện tại: confirmed)*<br><br>`Body: {"status": "pending"}` | `4xx và dữ liệu không đổi` | R7 |
| **DT-35** | `TRANS_V5` | Chuyển trạng thái từ `shipping` sang `delivered` | `Path: /api/admin/orders/103/status` *(Status hiện tại: shipping)*<br><br>`Body: {"status": "delivered"}` | `2xx và dữ liệu được lưu đúng` | R1, R7 |
| **DT-36** | `TRANS_IV3` | Chuyển trạng thái từ `shipping` sang `canceled` | `Path: /api/admin/orders/103/status` *(Status hiện tại: shipping)*<br><br>`Body: {"status": "canceled"}` | `4xx và dữ liệu không đổi` | R7 |
| **DT-37** | `TRANS_IV4` | Chuyển trạng thái từ `delivered` (trạng thái kết thúc) sang `canceled` | `Path: /api/admin/orders/104/status` *(Status hiện tại: delivered)*<br><br>`Body: {"status": "canceled"}` | `4xx và dữ liệu không đổi` | R7 |
| **DT-38** | `TRANS_IV5` | Chuyển trạng thái từ `canceled` (trạng thái kết thúc) sang `confirmed` | `Path: /api/admin/orders/105/status` *(Status hiện tại: canceled)*<br><br>`Body: {"status": "confirmed"}` | `4xx và dữ liệu không đổi` | R7 |
| **DT-39** | `DASH_V1` | Kiểm tra tính Doanh Thu & Tổng Đơn khi có đơn `delivered` | DB Setup: 1 đơn status `delivered` (amount: 100000)<br><br>`GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng` | R1, R2 |
| **DT-40** | `DASH_V2` | Kiểm tra tính Doanh Thu & Tổng Đơn khi có đơn `pending` | DB Setup: 1 đơn status `pending` (amount: 100000)<br><br>`GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng` | R1, R2 |
| **DT-41** | `DASH_V3` | Kiểm tra tính Doanh Thu & Tổng Đơn khi có đơn `confirmed` | DB Setup: 1 đơn status `confirmed` (amount: 100000)<br><br>`GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng` | R1, R2 |
| **DT-42** | `DASH_V4` | Kiểm tra tính Doanh Thu & Tổng Đơn khi có đơn `shipping` | DB Setup: 1 đơn status `shipping` (amount: 100000)<br><br>`GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng` | R1, R2 |
| **DT-43** | `DASH_IV1` | Kiểm tra việc đếm Tổng Đơn Hàng đối với đơn bị `canceled` | DB Setup: 1 đơn status `canceled` (amount: 100000)<br><br>`GET /api/admin/orders` | `CẦN LÀM RÕ` | R1, R2 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
