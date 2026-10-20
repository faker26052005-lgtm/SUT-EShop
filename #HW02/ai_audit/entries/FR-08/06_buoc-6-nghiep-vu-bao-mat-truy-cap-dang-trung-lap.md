# FR-08-06 – FR-08 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:45:51 (UTC+0700) |
| Feature / bước | FR-08 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | FR8 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API

## Output của AI (nguyên văn, CHƯA chỉnh sửa)

### 1. Danh sách Test Case Truy cập (Access Control - AC)

| ID | Mô tả | Cách dựng và Input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AC-01** | Kiểm tra quyền truy cập API Checkout khi chưa đăng nhập | **Setup:** Không truyền Header `Authorization`.<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |
| **AC-02** | Kiểm tra quyền truy cập API Lấy giỏ hàng khi chưa đăng nhập | **Setup:** Không truyền Header `Authorization`.<br>**Endpoint:** `GET /api/cart` | 4xx và dữ liệu không đổi | R6 |
| **AC-03** | Kiểm tra quyền truy cập API Thêm giỏ hàng khi chưa đăng nhập | **Setup:** Không truyền Header `Authorization`.<br>**Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2}` | 4xx và dữ liệu không đổi | R6 |
| **AC-04** | Kiểm tra quyền truy cập API Xem lịch sử đơn hàng khi chưa đăng nhập | **Setup:** Không truyền Header `Authorization`.<br>**Endpoint:** `GET /api/orders/my-orders` | 4xx và dữ liệu không đổi | R6 |
| **AC-05** | Kiểm tra quyền thanh toán với Token không hợp lệ hoặc đã hết hạn | **Setup:** Header `Authorization: Bearer invalid_or_expired_token`.<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |

---

### 2. Danh sách Test Case Nghiệp vụ & Bảo mật (Business Logic & Security - BL)

| ID | Mô tả | Cách dựng và Input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **BL-01** | Kiểm tra Backend tự tính lại `total_amount` và bỏ qua giá trị client gửi sai lệch | **Setup:** Giỏ hàng có 2 SP A (giá 100k, tổng = 200k).<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 1, "shipping_address": "123 Le Loi"}`<br>**Verify:** Gọi `GET /api/orders/my-orders`. | 2xx và dữ liệu được lưu đúng *(Giá trị `total_amount` trong lịch sử đơn hàng phải lưu đúng 200,000)* | R2, R4 |
| **BL-02** | Kiểm tra giỏ hàng bị xóa tự động sau khi thanh toán thành công | **Setup:** Tạo giỏ hàng có 1 SP -> Gọi `POST /api/checkout` thành công (2xx).<br>**Verify:** Gọi `GET /api/cart`. | 2xx và dữ liệu được lưu đúng *(API `GET /api/cart` trả về giỏ hàng rỗng)* | R5 |
| **BL-03** | Kiểm tra giỏ hàng KHÔNG bị xóa khi thanh toán thất bại | **Setup:** Giỏ hàng có 1 SP -> Gọi `POST /api/checkout` với Token hỏng/lỗi (4xx).<br>**Verify:** Gọi `GET /api/cart`. | 4xx và dữ liệu không đổi *(Giỏ hàng vẫn giữ nguyên sản phẩm ban đầu)* | R5, R6 |
| **BL-04** | Kiểm tra Giao diện (UI) hiển thị đầy đủ danh sách sản phẩm đặt mua | **Setup:** Thêm 3 sản phẩm khác nhau vào giỏ -> Mở giao diện Checkout trên UI.<br>**Verify:** Kiểm tra danh sách hiển thị trên UI. | Giao diện hiển thị đầy đủ tên, số lượng, đơn giá của cả 3 sản phẩm | R3 |
| **BL-05** | Kiểm tra Giao diện (UI) không cho phép người dùng chỉnh sửa trực tiếp `total_amount` | **Setup:** Mở màn hình Checkout trên UI.<br>**Verify:** Kiểm tra trường `total_amount` trên UI. | Trường `total_amount` ở trạng thái không cho phép chỉnh sửa (disabled/readonly) | R2 |
| **BL-06** | Kiểm tra tính năng chống XSS khi hiển thị `shipping_address` trên UI | **Setup:** Gọi `POST /api/checkout` với `shipping_address: "<script>alert('XSS')</script>"`.<br>**Verify:** Mở xem chi tiết đơn hàng trên UI. | Dữ liệu được escape đúng cách, hiển thị dưới dạng văn bản thuần, không thực thi `innerHTML` | R7 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
