# FR-13-06 – FR-13 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 21:03:04 (UTC+0700) |
| Feature / bước | FR-13 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là danh sách Test Cases cho **BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP** nhằm bổ sung các kịch bản phối hợp nhiều bước, tính toán doanh thu tích lũy, vòng đời đơn hàng và kiểm soát quyền truy cập chi tiết.


### 1. Test Cases Nghiệp Vụ (Business Logic - BL)

| ID | Mô tả | Cách dựng và input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **BL-01** | Tính tổng doanh thu tích lũy khi có nhiều đơn hàng `delivered` | **Setup DB:** Tạo 3 đơn hàng: Đơn 1 (`delivered`, `total_amount = 100000`), Đơn 2 (`delivered`, `total_amount = 250000`), Đơn 3 (`delivered`, `total_amount = 150000`).<br><br>**Input:** `GET /api/admin/orders` (Header Admin Token) | `2xx và dữ liệu được lưu đúng`<br><br>*(Tổng doanh thu = 500,000; Tổng số đơn = 3)* | R1, R2, FR-13 |
| **BL-02** | Tính doanh thu Dashboard trong tập hợp đơn hàng có trạng thái hỗn hợp | **Setup DB:** Tạo 5 đơn hàng: Đơn 1 (`delivered`, 100k), Đơn 2 (`delivered`, 200k), Đơn 3 (`pending`, 300k), Đơn 4 (`shipping`, 400k), Đơn 5 (`canceled`, 500k).<br><br>**Input:** `GET /api/admin/orders` (Header Admin Token) | `2xx và dữ liệu được lưu đúng`<br><br>*(Doanh thu = 300,000 - chỉ cộng Đơn 1 & 2; Tổng số đơn = đếm toàn bộ đơn hàng trong hệ thống)* | R1, R2, FR-10, FR-13 |
| **BL-03** | Kiểm thử toàn bộ vòng đời hợp lệ của đơn hàng (Complete Order Lifecycle) | **1.** `POST /api/checkout` (`total_amount: 200000`) → Tạo đơn ID 201 (`pending`).<br><br>**2.** `PUT /api/admin/orders/201/status` → `{"status": "confirmed"}`.<br><br>**3.** `PUT /api/admin/orders/201/status` → `{"status": "shipping"}`.<br><br>**4.** `PUT /api/admin/orders/201/status` → `{"status": "delivered"}`.<br><br>**5.** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Chuyển trạng thái thành công ở từng bước; khi đạt `delivered`, tổng doanh thu tăng thêm 200,000)* | R1, R6, R7, FR-10, FR-13 |
| **BL-04** | Kiểm thử vòng đời hủy đơn hàng trực tiếp từ `pending` sang `canceled` | **1.** `POST /api/checkout` (`total_amount: 200000`) → Tạo đơn ID 202 (`pending`).<br><br>**2.** `PUT /api/admin/orders/202/status` → `{"status": "canceled"}`.<br><br>**3.** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Chuyển trạng thái thành `canceled` thành công; tổng doanh thu Dashboard không tăng)* | R1, R6, R7, FR-10, FR-13 |
| **BL-05** | Kiểm thử vòng đời hủy đơn hàng từ `confirmed` sang `canceled` | **1.** Tạo đơn ID 203 (`pending`).<br><br>**2.** `PUT /api/admin/orders/203/status` → `{"status": "confirmed"}`.<br><br>**3.** `PUT /api/admin/orders/203/status` → `{"status": "canceled"}`.<br><br>**4.** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Chuyển trạng thái thành `canceled` thành công; tổng doanh thu Dashboard không tăng)* | R1, R6, R7, FR-10, FR-13 |
| **BL-06** | Kiểm tra tính toàn vẹn dữ liệu đơn hàng khi cập nhật trạng thái | **Setup:** Tạo đơn ID 204 với `total_amount = 150000`, `shipping_address = "123 Le Loi"`.<br><br>**Input:** `PUT /api/admin/orders/204/status` với `{"status": "confirmed"}`.<br><br>**Check:** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Chỉ `status` thay đổi; `total_amount` và `shipping_address` giữ nguyên)* | R6, FR-10 |
| **BL-07** | Cố gắng chuyển trạng thái từ `delivered` (kết thúc) quay về `shipping` | **Setup:** Đơn ID 205 đang có `status = "delivered"`.<br><br>**Input:** `PUT /api/admin/orders/205/status` với `{"status": "shipping"}` | `4xx và dữ liệu không đổi`<br><br>*(delivered là trạng thái kết thúc, không cho phép đổi)* | R6, R7, FR-10 |

---

### 2. Test Cases Kiểm Soát Truy Cập & Bảo Mật (Access Control & Security - AC)

| ID | Mô tả | Cách dựng và input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AC-01** | Xem danh sách đơn hàng Admin bằng tài khoản User thường | **Header:** `Authorization: Bearer <valid_user_jwt>` (`role = 'user'`)<br><br>**Input:** `GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R3, R5, SEC-03, FR-12 |
| **AC-02** | Cập nhật trạng thái đơn hàng bằng tài khoản User thường | **Header:** `Authorization: Bearer <valid_user_jwt>` (`role = 'user'`)<br><br>**Input:** `PUT /api/admin/orders/101/status` Body: `{"status": "confirmed"}` | `4xx và dữ liệu không đổi` | R3, R5, SEC-03, FR-12 |
| **AC-03** | Gọi API Admin với Token JWT bị giả mạo / chỉnh sửa chữ ký | **Header:** `Authorization: Bearer <tampered_jwt_signature>` (Sửa payload thành role admin nhưng chữ ký không hợp lệ)<br><br>**Input:** `GET /api/admin/orders` | `4xx và dữ liệu không đổi` | R4, SEC-02, FR-12 |
| **AC-04** | Đặt hàng (`POST /api/checkout`) không truyền Token xác thực | **Header:** *(Khuyết Authorization Header)*<br><br>**Input:** `POST /api/checkout` Body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | `4xx và dữ liệu không đổi` | R4, SEC-02, Mục 4.3 |
| **AC-05** | Đặt hàng (`POST /api/checkout`) với Token hợp lệ của User | **Header:** `Authorization: Bearer <valid_user_jwt>`<br><br>**Input:** `POST /api/checkout` Body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | `2xx và dữ liệu được lưu đúng` | SEC-02, Mục 4.3 |


## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
