# FR-08-02 – FR-08 · Bước 2 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:39:13 (UTC+0700) |
| Feature / bước | FR-08 – Bước 2 - chia lớp tương đương |
| Chat / phiên | FR8 |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 2 – XÁC ĐỊNH BIẾN.
Dựa trên kết quả bước 1 (không thêm thông tin từ bên ngoài), hãy:
1. Lập bảng biến đầu vào: tên biến, vị trí (body/query/path/header), kiểu dữ liệu, ràng buộc SRS nêu rõ, SRS im lặng về điều gì, và biến có thứ tự/số hay không (để áp dụng BVA).
2. Liệt kê biến trạng thái và điều kiện ẩn (ví dụ token, vai trò người dùng, dữ liệu có sẵn) cùng cách dựng trạng thái cho test.
3. Liệt kê những đầu ra cần quan sát để kết luận một test pass hay fail.
Chưa chia lớp, chưa sinh test case.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả thực hiện **BƯỚC 2 – XÁC ĐỊNH BIẾN, TRẠNG THÁI VÀ ĐẦU RA** dựa hoàn toàn trên thông tin đặc tả SRS và tài liệu API từ Bước 1:

---

### 1. Bảng biến đầu vào (Input Variables)

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc SRS nêu rõ | SRS im lặng về điều gì | Có thứ tự/số? (Áp dụng BVA) |
| --- | --- | --- | --- | --- | --- |
| `Authorization` | Header | String (Bearer Token) | Bắt buộc JWT Token hợp lệ (SEC-02). | HTTP Code khi Token sai/hết hạn/thiếu. Format response lỗi. | **Không** (Dữ liệu danh định / Categorical) |
| `total_amount` | Body (`POST /api/checkout`) | Numeric (Number) | Backend tự tính lại từ giỏ hàng; không chấp nhận giá trị client gửi lên (FR-08). | Giá trị BVA cực hạn (0, số âm, số thập phân, MAX_INT). Hệ thống xử lý ra sao nếu client gửi `null` hoặc cố tình sửa giá trị khác thực tế. | **Có** (Miền số thực/nguyên $\rightarrow$ Áp dụng BVA cho giá trị truyền lên) |
| `shipping_address` | Body (`POST /api/checkout`) | String | Là dữ liệu user nhập, khi hiển thị lên UI phải escape đúng cách, không dùng `innerHTML` (SEC-04). | Độ dài Min/Max, ký tự đặc biệt cho phép, khoảng trắng (leading/trailing/only space), xử lý chuỗi rỗng `""` hoặc `null`. | **Có** (Theo độ dài chuỗi `length` $\rightarrow$ Áp dụng BVA cho độ dài) |
| `quantity` *(từ giỏ hàng)* | Body (`POST /api/cart`) | Numeric (Integer) | Được dùng để Backend tự tính lại `total_amount`. | Giới hạn số lượng Min/Max per item, số lượng bằng 0 hoặc âm. | **Có** (Miền số nguyên $\rightarrow$ Áp dụng BVA khi dựng giỏ hàng) |
| `price` *(từ giỏ hàng)* | Body (`POST /api/cart`) | Numeric (Number) | Được dùng để Backend tự tính lại `total_amount`. | Giới hạn giá tiền Min/Max, giá bằng 0, số âm. | **Có** (Miền số thực $\rightarrow$ Áp dụng BVA khi dựng giỏ hàng) |

---

### 2. Biến trạng thái và Điều kiện ẩn (State & Hidden Conditions)

| Trạng thái / Điều kiện ẩn | Các giá trị trạng thái cần kiểm thử | Cách dựng trạng thái cho Test (Setup) |
| --- | --- | --- |
| **Trạng thái Xác thực (Auth State)** | 1. Chưa đăng nhập (Không gửi Header).<br>

<br>2. Token không hợp lệ (Sai định dạng / Chữ ký sai).<br>

<br>3. Token hết hạn.<br>

<br>4. Token hợp lệ của user hợp lệ. | - Dùng API Login để lấy Token chuẩn.<br>

<br>- Tạo Token giả / hết hạn bằng cách sửa string Bearer Token. |
| **Trạng thái Giỏ hàng (Cart State)** | 1. Giỏ hàng rỗng (0 sản phẩm).<br>

<br>2. Giỏ hàng có 1 sản phẩm.<br>

<br>3. Giỏ hàng có nhiều sản phẩm.<br>

<br>4. Giỏ hàng có sản phẩm bị đổi giá / hết hàng trước khi bấm thanh toán. | - Đăng ký tài khoản mới (mặc định giỏ hàng rỗng).<br>

<br>- Gọi `POST /api/cart` 1 hoặc nhiều lần với các mặt hàng/số lượng khác nhau.<br>

<br>- Cập nhật lại giá/kho ở DB/Backend trước khi gọi checkout. |
| **Trạng thái Lịch sử đơn hàng (Orders State)** | 1. Chưa có đơn hàng nào.<br>

<br>2. Đã có một số đơn hàng cũ. | - Gọi `GET /api/orders/my-orders` để đối chiếu trước và sau khi thực hiện Checkout thành công. |

---

### 3. Các đầu ra cần quan sát (Observed Outputs for Pass/Fail)

Để kết luận một Test Case là **PASS** hay **FAIL**, tester cần kiểm tra đầy đủ các đầu ra ở cả cấp độ API lẫn Giao diện (UI):

1. **HTTP Response Status Code:**
* Mã `20x` (200 OK / 201 Created) khi thanh toán thành công.
* Mã `40x` (401 Unauthorized / 400 Bad Request / 403 Forbidden) khi thiếu token, token sai hoặc request không hợp lệ.


2. **HTTP Response Body:**
* Cấu trúc JSON trả về (Thông báo thành công / Mã lỗi / Chi tiết lỗi).


3. **Trạng thái Giỏ hàng sau Checkout (`POST /api/cart` / `GET /api/cart`):**
* Trường hợp Checkout thành công: Gọi `GET /api/cart` phải trả về giỏ hàng rỗng (`[]` hoặc tổng sản phẩm = 0).
* Trường hợp Checkout thất bại: Giỏ hàng phải được giữ nguyên.


4. **Dữ liệu Lịch sử Đơn hàng (`GET /api/orders/my-orders`):**
* Đơn hàng mới phải được ghi nhận.
* Trường `total_amount` của đơn hàng lưu trên hệ thống phải bằng chính xác tổng tiền do Backend tự tính từ giỏ hàng (không phụ thuộc vào giá trị `total_amount` client truyền lên).


5. **Giao diện người dùng (UI Testing):**
* Không cho phép người dùng nhập/sửa ô `total_amount` trên UI.
* Danh sách sản phẩm hiển thị đầy đủ, chính xác tên, số lượng, đơn giá.
* `shipping_address` khi hiển thị lại trên UI đơn hàng phải được escape ký tự HTML/JS (chống lỗi XSS / SEC-04).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
