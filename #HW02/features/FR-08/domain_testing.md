# FR-08 – Thanh toán (Checkout) · Domain Testing

## Bước 1: Trích yêu cầu

### 1.1 Trích nguyên văn từ SRS & Tài liệu API

**SRS FR-08: Thanh toán (Checkout)**
- Chỉ người dùng **đã đăng nhập** mới tiến hành thanh toán được.
- **Tổng tiền thanh toán** được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.
- Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua.
- Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên.
- Sau thanh toán thành công, giỏ hàng được xóa.

**Yêu cầu bảo mật liên quan**
- `SEC-02`: Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.
- `SEC-04`: Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp.

---

### 1.2 Bảng yêu cầu

| Mã | Nội dung | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được | FR-08 | Truy cập |
| R2 | Tổng tiền được tính tự động từ giỏ hàng, không cho client chỉnh sửa trực tiếp | FR-08 | Nghiệp vụ / Input |
| R3 | Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua | FR-08 | Nghiệp vụ |
| R4 | Backend tự tính lại tổng tiền, bỏ qua trường `total_amount` do client gửi lên | FR-08 | Nghiệp vụ / Bảo mật |
| R5 | Sau khi thanh toán thành công, giỏ hàng phải được xóa | FR-08 | Nghiệp vụ |
| R6 | Các API bảo mật yêu cầu JWT Token hợp lệ | SEC-02 | Bảo mật / Truy cập |
| R7 | Mọi dữ liệu user nhập vào hiển thị trên UI phải được escape đúng cách (chống XSS) | SEC-04 | Bảo mật |
| R8 | Cung cấp địa chỉ giao hàng (`shipping_address`) khi thanh toán | API 4.3 | Input |

---

### 1.3 Endpoint liên quan

Tất cả API bảo mật yêu cầu Header: `Authorization: Bearer <token>`

| Method | Endpoint | Cần token? | Body / Payload |
| :--- | :--- | :-: | :--- |
| GET | `/api/cart` | Có | Không có |
| POST | `/api/cart` | Có | `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2}` |
| POST | `/api/checkout` | Có | `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` |
| GET | `/api/orders/my-orders` | Có | Không có |

---

### 1.4 Giả định và chỗ SRS im lặng

| # | Điều chưa rõ | Giả định tạm |
| :-: | :--- | :--- |
| 1 | Checkout khi giỏ hàng rỗng (0 sản phẩm) có được phép không? | Giỏ hàng rỗng không được phép Checkout |
| 2 | Ràng buộc `shipping_address`: rỗng `""`, `null`, toàn khoảng trắng, độ dài Max? | `shipping_address` là trường bắt buộc |
| 3 | Phương thức thanh toán mặc định là gì (COD hay trừ ví/thẻ)? | Giả định thanh toán mặc định thành công |
| 4 | Mã HTTP status khi JWT Token hỏng, hết hạn hoặc thiếu? | Trả về `401 Unauthorized` hoặc `403 Forbidden` |
| 5 | Thay đổi giá hoặc hết hàng ở DB trước thời điểm thanh toán xử lý ra sao? | Backend tự tính theo giá thời điểm checkout |

---

## Bước 2: Xác định biến

### 2.1 Biến đầu vào

| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `Authorization` | header | chuỗi | JWT Token hợp lệ (SEC-02, R1, R6) | Mã HTTP lỗi khi token hỏng/hết hạn | Không |
| `total_amount` | body | số | Backend tự tính lại từ giỏ hàng, bỏ qua giá trị client gửi (R2, R4) | Giá trị âm, `null`, chuỗi, hoặc cực đại | **Có**: Miền số thực/nguyên |
| `shipping_address` | body | chuỗi | Dữ liệu nhập hiển thị UI phải escape (SEC-04, R8) | Rỗng, `null`, toàn khoảng trắng, Max length | **Có**: Độ dài chuỗi |
| `quantity` *(giỏ)* | body | số | Dùng để tính toán `total_amount` | Số lượng bằng 0, số âm, Max quantity | **Có**: Miền số nguyên |
| `price` *(giỏ)* | body | số | Dùng để tính toán `total_amount` | Đơn giá bằng 0, số âm | **Có**: Miền số thực |

---

### 2.2 Biến trạng thái / điều kiện ẩn

| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| **Xác thực (Auth State)** | Quyết định có thực hiện được request checkout không | Đăng nhập tài khoản mẫu lấy token chuẩn; hoặc truyền token giả/hết hạn |
| **Giỏ hàng (Cart State)** | Quyết định tổng tiền và điều kiện đặt hàng | Gọi `POST /api/cart` tạo 0 món, 1 món hoặc nhiều món trước khi Checkout |
| **Lịch sử Đơn hàng (Orders State)** | Kiểm tra side-effect lưu vết đơn hàng | Dùng `GET /api/orders/my-orders` đối chiếu số lượng đơn hàng trước và sau khi checkout |

---

### 2.3 Đầu ra cần quan sát

1. **HTTP Response Status Code**: `2xx` khi thành công; `4xx` khi vi phạm xác thực hoặc định dạng.
2. **HTTP Response Body**: Cấu trúc JSON chứa thông báo/mã đơn hàng.
3. **Trạng thái Giỏ hàng sau Checkout**: Gọi `GET /api/cart` phải trả về rỗng (`[]`).
4. **Dữ liệu Lịch sử Đơn hàng**: Kiểm tra `GET /api/orders/my-orders` xem đơn mới có lưu đúng `total_amount` do Backend tự tính hay không.
5. **Giao diện người dùng (UI)**: Trường `total_amount` disabled không cho sửa; `shipping_address` được escape chống XSS.

---

## Bước 3–4: Chia lớp tương đương và test case Domain Testing

> Quy tắc: Mỗi test case chỉ vi phạm đúng MỘT điều kiện không hợp lệ, các trường khác dùng giá trị hợp lệ chuẩn.

### 3.1 Lớp tương đương theo từng biến

#### 1. Biến `Authorization` (Header)
- **C1.1 (Hợp lệ)**: Token chuẩn, còn hạn. (Đại diện: `Bearer <valid_token>`)
- **C1.2 (Không hợp lệ)**: Thiếu Header Authorization.
- **C1.3 (Không hợp lệ)**: Thiếu tiền tố `Bearer `. (Đại diện: `"eyJhbGciOi..."`)
- **C1.4 (Không hợp lệ)**: Token có chữ ký hỏng. (Đại diện: `"Bearer invalid_sig"`)
- **C1.5 (Không hợp lệ)**: Token đã hết hạn. (Đại diện: `"Bearer expired_token"`)
- **C1.6 (CẦN LÀM RÕ)**: Token bị khóa/logout.

#### 2. Biến `total_amount` (Body - `POST /api/checkout`)
- **C2.1 (Hợp lệ)**: Khớp giá trị giỏ hàng (200,000đ).
- **C2.2 (Hợp lệ)**: Sai khác giá trị giỏ hàng (`0` hoặc `1`đ) để verify R4.
- **C2.3 (Không hợp lệ)**: Sai kiểu dữ liệu String (Đại diện: `"200000"`).
- **C2.4 (CẦN LÀM RÕ)**: Số âm (Đại diện: `-100000`).
- **C2.5 (CẦN LÀM RÕ)**: Truyền `null` hoặc thiếu trường.

#### 3. Biến `shipping_address` (Body - `POST /api/checkout`)
- **C3.1 (Hợp lệ)**: Chuỗi văn bản chuẩn (Đại diện: `"123 Le Loi, TP.HCM"`).
- **C3.2 (Hợp lệ)**: Chuỗi chứa script HTML/JS để kiểm thử escape XSS (Đại diện: `"<script>alert('XSS')</script>"`).
- **C3.3 (Không hợp lệ)**: Sai kiểu dữ liệu Number (Đại diện: `12345`).
- **C3.4 (CẦN LÀM RÕ)**: Chuỗi rỗng `""`.
- **C3.5 (CẦN LÀM RÕ)**: Chỉ chứa khoảng trắng `"   "`.
- **C3.6 (CẦN LÀM RÕ)**: Truyền `null`.
- **C3.7 (CẦN LÀM RÕ)**: Chuỗi 1000 ký tự.

---

### 3.2 Bảng Test Case Domain Testing

| ID | Lớp | Mô tả | Input (Header / Endpoint / Body) | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-01 | C1.1 | Baseline: Checkout với Token chuẩn | Header: `Authorization: Bearer <valid_token>`<br>Body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | 2xx và dữ liệu được lưu đúng | R1, R6, R8 |
| DT-02 | C1.2 | Thiếu Header Authorization | Header: *(Thiếu)* | 4xx và dữ liệu không đổi | R1, R6 |
| DT-03 | C1.3 | Header thiếu tiền tố `Bearer ` | Header: `Authorization: <valid_token>` | 4xx và dữ liệu không đổi | R1, R6 |
| DT-04 | C1.4 | Token chữ ký không hợp lệ | Header: `Authorization: Bearer invalid_sig` | 4xx và dữ liệu không đổi | R1, R6 |
| DT-05 | C1.5 | Token đã hết hạn | Header: `Authorization: Bearer expired_token` | 4xx và dữ liệu không đổi | R1, R6 |
| DT-06 | C1.6 | Token bị khóa/logout | Header: `Authorization: Bearer revoked_token` | CẦN LÀM RÕ | R1, R6 |
| DT-07 | C2.1 | `total_amount` khớp giỏ hàng (200,000) | Body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | 2xx và dữ liệu được lưu đúng | R2, R4 |
| DT-08 | C2.2 | `total_amount` client gửi sai (`0`) -> Backend tự tính lại | Body: `{"total_amount": 0, "shipping_address": "123 Le Loi"}` | 2xx và dữ liệu được lưu đúng | R2, R4 |
| DT-09 | C2.3 | `total_amount` sai kiểu String | Body: `{"total_amount": "200000", "shipping_address": "123 Le Loi"}` | 4xx và dữ liệu không đổi | R2, R4 |
| DT-10 | C2.4 | `total_amount` là số âm (`-100000`) | Body: `{"total_amount": -100000, "shipping_address": "123 Le Loi"}` | CẦN LÀM RÕ | R2, R4 |
| DT-11 | C2.5 | `total_amount` truyền `null` | Body: `{"total_amount": null, "shipping_address": "123 Le Loi"}` | CẦN LÀM RÕ | R2, R4 |
| DT-12 | C3.1 | `shipping_address` văn bản chuẩn | Body: `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | 2xx và dữ liệu được lưu đúng | R8 |
| DT-13 | C3.2 | `shipping_address` chứa script HTML/JS (XSS) | Body: `{"total_amount": 200000, "shipping_address": "<script>alert('XSS')</script>"}` | 2xx và dữ liệu được lưu đúng | R7, R8 |
| DT-14 | C3.3 | `shipping_address` sai kiểu Number | Body: `{"total_amount": 200000, "shipping_address": 12345}` | 4xx và dữ liệu không đổi | R8 |
| DT-15 | C3.4 | `shipping_address` chuỗi rỗng `""` | Body: `{"total_amount": 200000, "shipping_address": ""}` | CẦN LÀM RÕ | R8 |
| DT-16 | C3.5 | `shipping_address` chỉ chứa khoảng trắng | Body: `{"total_amount": 200000, "shipping_address": "   "}` | CẦN LÀM RÕ | R8 |
| DT-17 | C3.6 | `shipping_address` truyền `null` | Body: `{"total_amount": 200000, "shipping_address": null}` | CẦN LÀM RÕ | R8 |
| DT-18 | C3.7 | `shipping_address` 1000 ký tự | Body: `{"total_amount": 200000, "shipping_address": "<1000_chars>"}` | CẦN LÀM RÕ | R8 |
| DT-19 | C4.1 | Giỏ hàng: `quantity` hợp lệ (`2`) | `POST /api/cart` body: `{"id": 1, "quantity": 2, "price": 100000}` | 2xx và dữ liệu được lưu đúng | R2 |
| DT-20 | C4.2 | Giỏ hàng: `quantity` sai kiểu String | `POST /api/cart` body: `{"id": 1, "quantity": "2", "price": 100000}` | 4xx và dữ liệu không đổi | R2 |
| DT-21 | C4.3 | Giỏ hàng: `quantity` bằng 0 | `POST /api/cart` body: `{"id": 1, "quantity": 0, "price": 100000}` | CẦN LÀM RÕ | R2 |
| DT-22 | C4.4 | Giỏ hàng: `quantity` số âm (`-1`) | `POST /api/cart` body: `{"id": 1, "quantity": -1, "price": 100000}` | CẦN LÀM RÕ | R2 |
| DT-23 | C4.5 | Giỏ hàng: `quantity` cực lớn (`999999`) | `POST /api/cart` body: `{"id": 1, "quantity": 999999, "price": 100000}` | CẦN LÀM RÕ | R2 |
| DT-24 | C5.1 | Giỏ hàng: `price` hợp lệ | `POST /api/cart` body: `{"id": 1, "quantity": 1, "price": 100000}` | 2xx và dữ liệu được lưu đúng | R2 |
| DT-25 | C5.2 | Giỏ hàng: `price` sai kiểu String | `POST /api/cart` body: `{"id": 1, "quantity": 1, "price": "100000"}` | 4xx và dữ liệu không đổi | R2 |
| DT-26 | C5.3 | Giỏ hàng: `price` bằng 0 | `POST /api/cart` body: `{"id": 1, "quantity": 1, "price": 0}` | CẦN LÀM RÕ | R2 |
| DT-27 | C5.4 | Giỏ hàng: `price` số âm (`-50000`) | `POST /api/cart` body: `{"id": 1, "quantity": 1, "price": -50000}` | CẦN LÀM RÕ | R2 |
| DT-28 | C6.1 | State: Checkout giỏ hàng có 1 sản phẩm | Giỏ có 1 SP A -> `POST /api/checkout` | 2xx và dữ liệu được lưu đúng | R2, R3, R4, R5 |
| DT-29 | C6.2 | State: Checkout giỏ hàng rỗng (0 SP) | Giỏ rỗng -> `POST /api/checkout` | CẦN LÀM RÕ | R2, R5 |
| DT-30 | C6.3 | State: SP bị thay đổi giá ở DB trước checkout | SP A đổi giá từ 100k lên 150k ở DB -> Checkout | CẦN LÀM RÕ | R2, R4 |

---

## Bước 6: Nghiệp vụ, bảo mật, truy cập & Side-effects

### 6.1 Test Case Truy cập & Bảo mật

| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- |
| AC-01 | Checkout không có token | Bỏ header `Authorization` | 401/403 và dữ liệu không đổi | R1, R6 |
| AC-02 | Xem giỏ hàng không có token | `GET /api/cart` (Không token) | 401/403 và dữ liệu không đổi | R6 |
| AC-03 | Thêm giỏ hàng không có token | `POST /api/cart` (Không token) | 401/403 và dữ liệu không đổi | R6 |
| AC-04 | Xem đơn hàng không có token | `GET /api/orders/my-orders` (Không token) | 401/403 và dữ liệu không đổi | R6 |
| AC-05 | Checkout với token hỏng/hết hạn | Header: `Authorization: Bearer invalid_token` | 401/403 và dữ liệu không đổi | R1, R6 |

### 6.2 Test Case Logic Nghiệp vụ & Side-effects

| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- |
| BL-01 | Backend tự tính lại `total_amount`, bỏ qua giá trị client | Giỏ có 2 SP A (150k, tổng 300k). Checkout gửi `total_amount = 1`. | 2xx và DB lưu `total_amount = 300000` | R2, R4 |
| BL-02 | Giỏ hàng bị xóa sạch sau khi checkout thành công | Gọi `POST /api/checkout` (2xx) -> Gọi `GET /api/cart` | Giỏ hàng trả về rỗng (`[]`) | R5 |
| BL-03 | Giỏ hàng KHÔNG bị xóa khi checkout thất bại | Gọi `POST /api/checkout` với token sai (4xx) -> Gọi `GET /api/cart` | Giỏ hàng vẫn giữ nguyên sản phẩm | R5, R6 |
| BL-04 | UI hiển thị đầy đủ thông tin sản phẩm giỏ hàng | Mở màn hình Checkout trên UI | Hiển thị đủ tên, đơn giá, số lượng | R3 |
| BL-05 | Cách ly dữ liệu đơn hàng giữa các tài khoản | User 1 checkout -> User 2 gọi `GET /api/orders/my-orders` | User 2 không thấy đơn của User 1 | R1, R6, R11 |