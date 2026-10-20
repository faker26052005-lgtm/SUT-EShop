# FR-20-03 – FR-20 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:35:44 (UTC+0700) |
| Feature / bước | FR-20 – Bước 3 - chia lớp tương đương |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là bảng phân lớp tương đương cho từng biến và trạng thái đã xác định ở Bước 2. Nguyên tắc áp dụng: **Mỗi giá trị đại diện của lớp không hợp lệ chỉ vi phạm đúng MỘT điều kiện** (để tránh hiện tượng che giấu lỗi - defect masking).

### 1. Biến `name` (Họ Tên)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Tên thông thường | Có | (Không có) | `"Nguyen Van A"` | R1 |
| Bỏ trống | Không | Bỏ trống trường bắt buộc | `""` | R1, R6 |
| Sai kiểu dữ liệu | Không | Truyền vào số (áp dụng test API) | `12345` (integer) | R1 |
| Tên quá dài | CẦN LÀM RÕ | Vượt quá giới hạn max (chưa rõ) | Chuỗi có 256 ký tự | R1 |
| Chứa số/Ký tự đặc biệt | CẦN LÀM RÕ | Chứa ký tự ngoài bảng chữ cái | `"Nguyen Van A 123!"` | R1 |

### 2. Biến `email` (Email đăng ký)

*Lưu ý: Tính duy nhất của email được đưa vào đây như một lớp tương đương của dữ liệu đầu vào.*

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Email chuẩn, chưa tồn tại | Có | (Không có) | `"newuser@domain.com"` | R1, R2, R6 |
| Bỏ trống | Không | Bỏ trống trường bắt buộc | `""` | R1, R6 |
| Thiếu ký tự `@` | Không | Sai định dạng (thiếu `@`) | `"userdomain.com"` | R2 |
| Thiếu phần domain | Không | Sai định dạng (có `@` nhưng thiếu domain) | `"user@"` | R2 |
| Thiếu phần user | Không | Sai định dạng (có `@` nhưng thiếu user) | `"@domain.com"` | R2 |
| Email đã tồn tại | Không | Vi phạm tính duy nhất | `"test@domain.com"` (đã tạo) | R2 |
| Sai kiểu dữ liệu | Không | Truyền vào số/boolean (test API) | `true` (boolean) | R1 |
| Email chứa khoảng trắng | CẦN LÀM RÕ | Không rõ API có tự động trim() không | `"user @domain.com"` | R2 |

### 3. Biến `password` (Mật khẩu)

*Để đảm bảo chỉ vi phạm 1 điều kiện, đại diện của lớp thiếu chữ hoa vẫn phải đảm bảo $\ge$ 8 ký tự, có chữ thường, số và ký tự đặc biệt.*

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Thỏa mãn mọi quy tắc | Có | (Không có) | `"Pass123!@"` | R1, R3, R6 |
| Bỏ trống | Không | Bỏ trống trường bắt buộc | `""` | R1, R6 |
| Ngắn hơn 8 ký tự | Không | Độ dài < 8 (nhưng đủ 4 loại ký tự) | `"Pas12!@"` (7 ký tự) | R3 |
| Thiếu chữ hoa | Không | Không có chữ cái In hoa | `"pass123!@"` | R3 |
| Thiếu chữ thường | Không | Không có chữ cái In thường | `"PASS123!@"` | R3 |
| Thiếu số | Không | Không có chữ số | `"Password!@"` | R3 |
| Thiếu ký tự đặc biệt | Không | Không có ký tự đặc biệt (@,$,!,...) | `"Password123"` | R3 |
| Quá độ dài tối đa | CẦN LÀM RÕ | Vượt giới hạn max (chưa rõ) | Chuỗi hợp lệ dài 256 ký tự | R3 |
| Chứa khoảng trắng | CẦN LÀM RÕ | Chứa dấu cách (space) | `"Pass 123!@"` | R3 |

### 4. Biến `confirm_password` (Xác nhận mật khẩu - Frontend)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện (Giả sử password là `"Pass123!@"`) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Khớp hoàn toàn | Có | (Không có) | `"Pass123!@"` | R1, R4 |
| Bỏ trống | Không | Bỏ trống trường bắt buộc | `""` | R1, R4 |
| Sai 1 ký tự | Không | Khác biệt dữ liệu | `"Pass123!#"` | R4 |
| Khác biệt Hoa/Thường | Không | Sai case sensitivity | `"pass123!@"` | R4 |

### 5. Biến `id` (Mã đơn hàng - API Path `/:id/cancel`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| ID hợp lệ, tồn tại | Có | (Không có) | `1` (Số nguyên dương) | R9 |
| ID không tồn tại | Không | Đơn hàng không có trong DB | `999999` | R9 |
| Sai kiểu dữ liệu ID | Không | Truyền chữ thay vì số | `"abc"` | R9 |
| ID số âm | CẦN LÀM RÕ | Không rõ API bắt lỗi format hay lỗi 404 | `-1` | R9 |

### 6. Biến Trạng Thái: Order Status & Quyền Truy Cập (Context Hủy Đơn)

*Biến này là tổ hợp của trạng thái đơn hàng hiện tại và Token người dùng gọi API.*

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện (Context giả định) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Status = `pending`, Chính chủ | Có | (Không có) | Gửi Token User A, hủy đơn ID `pending` của User A | R9, R11 |
| Status = `confirmed`, Chính chủ | Có | (Không có) | Gửi Token User A, hủy đơn ID `confirmed` của User A | R9, R11 |
| Status = `shipping` | Không | Hủy khi đang giao hàng | Gửi Token User A, hủy đơn ID `shipping` của User A | R10 |
| Status = `delivered` | Không | Hủy khi đã giao xong | Gửi Token User A, hủy đơn ID `delivered` của User A | R10 |
| Status = `canceled` | Không | Hủy đơn đã hủy trước đó | Gửi Token User A, hủy đơn ID `canceled` của User A | R10 |
| Truy cập trái phép (Khác User) | Không | Hủy đơn của người khác (ID tồn tại nhưng sai owner) | Gửi Token User A, hủy đơn ID `pending` của User B | R11, FR-11 |
| Không có Token | Không | Thiếu xác thực (No Authorization Header) | Không gửi Token, gọi hủy đơn `pending` | R11, SEC-02 |
| Token hết hạn / Không hợp lệ | Không | Token sai format hoặc expired | Gửi Token đã bị sửa đổi/hết hạn | R11, SEC-02 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
