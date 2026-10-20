# FR-08-03 – FR-08 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:40:10 (UTC+0700) |
| Feature / bước | FR-08 – Bước 3 - chia lớp tương đương |
| Chat / phiên | FR8 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả thực hiện **BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing)** cho từng biến và trạng thái đã xác định ở Bước 2.

---

### 1. Biến `Authorization` (Header)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C1.1** | Hợp lệ | Không | `Bearer eyJhbGciOi...` *(Token chuẩn, còn hạn)* | R1, R6 |
| **C1.2** | Không hợp lệ | Thiếu Header Authorization | *(Không truyền Header)* | R1, R6 |
| **C1.3** | Không hợp lệ | Sai định dạng Header (thiếu tiền tố `Bearer `) | `"eyJhbGciOi..."` | R1, R6 |
| **C1.4** | Không hợp lệ | Token có chữ ký không hợp lệ / bị sửa đổi | `"Bearer invalid_signature_token"` | R1, R6 |
| **C1.5** | Không hợp lệ | Token đã hết hạn | `"Bearer expired_jwt_token"` | R1, R6 |
| **C1.6** | CẦN LÀM RÕ | N/A *(SRS im lặng khi Token thuộc tài khoản bị khóa/đã logout)* | `"Bearer revoked_jwt_token"` | R1, R6 |

---

### 2. Biến `total_amount` (Body - `POST /api/checkout`)

*Lưu ý:* Theo **R2 & R4**, Backend tự tính lại `total_amount` từ giỏ hàng và bỏ qua giá trị do client gửi lên. Do đó, các giá trị số khác nhau truyền từ client không làm hỏng logic thanh toán mà dùng để verify xem Backend có thực sự bỏ qua giá trị này hay không.

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C2.1** | Hợp lệ | Không *(Truyền đúng bằng tổng tiền giỏ hàng)* | `200000` *(Khi giỏ hàng có tổng = 200,000)* | R2, R4 |
| **C2.2** | Hợp lệ | Không *(Truyền giá trị sai khác giỏ hàng để test R4)* | `0` hoặc `999999` *(Khi giỏ hàng có tổng = 200,000)* | R2, R4 |
| **C2.3** | Không hợp lệ | Sai kiểu dữ liệu (String thay vì Number)* | `"200000"` | R2, R4 |
| **C2.4** | CẦN LÀM RÕ | N/A *(SRS im lặng khi client gửi số âm)* | `-100000` | R2, R4 |
| **C2.5** | CẦN LÀM RÕ | N/A *(SRS im lặng khi không truyền hoặc truyền `null`)* | `null` hoặc không truyền field | R2, R4 |

**Ghi chú:* Lớp **C2.3** vi phạm kiểu dữ liệu nên sẽ bị chặn tại tầng API Schema Validator / Parser trước khi vào logic nghiệp vụ của Backend.

---

### 3. Biến `shipping_address` (Body - `POST /api/checkout`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C3.1** | Hợp lệ | Không *(Chuỗi văn bản chuẩn)* | `"123 Le Loi, TP.HCM"` | R8 |
| **C3.2** | Hợp lệ | Không *(Chuỗi chứa thẻ HTML/JS để kiểm thử escape XSS)* | `"<script>alert('XSS')</script>"` | R7, R8 |
| **C3.3** | Không hợp lệ | Sai kiểu dữ liệu (Number/Array/Object)* | `12345` hoặc `["123 Le Loi"]` | R8 |
| **C3.4** | CẦN LÀM RÕ | N/A *(SRS im lặng về việc địa chỉ có được phép rỗng không)* | `""` *(Chuỗi rỗng)* | R8 |
| **C3.5** | CẦN LÀM RÕ | N/A *(SRS im lặng khi địa chỉ chỉ chứa khoảng trắng)* | `"   "` | R8 |
| **C3.6** | CẦN LÀM RÕ | N/A *(SRS im lặng khi truyền `null` hoặc thiếu field)* | `null` | R8 |
| **C3.7** | CẦN LÀM RÕ | N/A *(SRS im lặng về giới hạn độ dài tối đa Max Length)* | Chuỗi 1000 ký tự | R8 |

**Ghi chú:* Lớp **C3.3** vi phạm kiểu dữ liệu bị chặn ở tầng API Schema Validation.

---

### 4. Biến `quantity` (Body - `POST /api/cart` khi dựng giỏ hàng)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C4.1** | Hợp lệ | Không *(Số nguyên dương > 0)* | `2` | R2, R4 |
| **C4.2** | Không hợp lệ | Sai kiểu dữ liệu (String/Float)* | `"2"` hoặc `1.5` | R2, R4 |
| **C4.3** | CẦN LÀM RÕ | N/A *(SRS im lặng khi số lượng = 0)* | `0` | R2, R4 |
| **C4.4** | CẦN LÀM RÕ | N/A *(SRS im lặng khi số lượng là số âm)* | `-1` | R2, R4 |
| **C4.5** | CẦN LÀM RÕ | N/A *(SRS im lặng về giới hạn số lượng tối đa per item)* | `999999` | R2, R4 |

**Ghi chú:* Lớp **C4.2** bị chặn tại tầng API Schema Parsing.

---

### 5. Biến `price` (Body - `POST /api/cart` khi dựng giỏ hàng)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C5.1** | Hợp lệ | Không *(Số nguyên/thực dương > 0)* | `100000` | R2, R4 |
| **C5.2** | Không hợp lệ | Sai kiểu dữ liệu (String)* | `"100000"` | R2, R4 |
| **C5.3** | CẦN LÀM RÕ | N/A *(SRS im lặng khi đơn giá = 0)* | `0` | R2, R4 |
| **C5.4** | CẦN LÀM RÕ | N/A *(SRS im lặng khi đơn giá âm)* | `-50000` | R2, R4 |

**Ghi chú:* Lớp **C5.2** bị chặn tại tầng API Schema Parsing.

---

### 6. Trạng thái Giỏ hàng (Cart State khi gọi `POST /api/checkout`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **C6.1** | Hợp lệ | Không *(Giỏ hàng có ít nhất 1 sản phẩm)* | Giỏ hàng có 1 SP A (SL: 2, Giá: 100,000) | R2, R3, R4, R5 |
| **C6.2** | CẦN LÀM RÕ | N/A *(SRS im lặng khi Checkout giỏ hàng rỗng)* | Giỏ hàng rỗng (0 sản phẩm) | R2, R5 |
| **C6.3** | CẦN LÀM RÕ | N/A *(SRS im lặng khi sản phẩm bị đổi giá ở DB ngay trước Checkout)* | Giá SP A ở DB đổi từ 100k lên 150k | R2, R4 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
