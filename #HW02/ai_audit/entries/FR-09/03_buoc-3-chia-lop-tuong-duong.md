# FR-09-03 – FR-09 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:39:54 (UTC+0700) |
| Feature / bước | FR-09 – Bước 3 - chia lớp tương đương |
| Chat / phiên | FR09 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 3 - Chia lớp tương đương (Domain Testing) cho từng biến đầu vào.

*Lưu ý chung (Quy tắc 1 lỗi): Khi chọn đại diện cho một lớp không hợp lệ của một biến, ta ngầm định **tất cả các biến và điều kiện ẩn khác đều đang ở trạng thái hợp lệ** để đảm bảo test case chỉ vi phạm đúng 1 điều kiện.*

### 1. Biến: `code` (Body)

Giả định khi test các lớp này: `total_amount` đủ ngưỡng, Token hợp lệ, `user_id` đúng.

| Lớp (Partition) | Hợp lệ? | Cách vi phạm (Chỉ 1 lỗi) | Đại diện (Value / State) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Mã tồn tại, đang active, còn hạn, còn lượt dùng | Có | Không vi phạm | `"SAVE10"` | R1, R2, R5 |
| Mã không tồn tại trong CSDL | Không | Không thỏa điều kiện C1 | `"NOTEXIST"` | R1 |
| Mã tồn tại nhưng bị vô hiệu hóa (`is_active = 0`) | Không | Không thỏa điều kiện C1 | `"INACTIVE10"` (Cần admin tạo trước) | R1 |
| Mã tồn tại nhưng đã quá hạn (`expired_at` < hiện tại) | Không | Không thỏa điều kiện C2 | `"EXPIRED"` | R2 |
| Mã hợp lệ nhưng user đã hết lượt dùng (`uses >= max`) | Không | Không thỏa điều kiện C5 | `"VIP100"` (Gửi từ user đã dùng mã này 2 lần) | R5 |
| Mã chứa ký tự SQL Injection | Không | Tấn công bảo mật CSDL | `' OR 1=1--` | R11 (SEC-05) |
| Mã chứa mã độc XSS | Không | Tấn công hiển thị giao diện | `<script>alert(1)</script>` | R10 (SEC-04) |
| Chuỗi rỗng / Khoảng trắng | CẦN LÀM RÕ | SRS không rõ API sẽ báo lỗi schema (Bad Request) hay lỗi không tìm thấy mã (C1) | `""` hoặc `"   "` | R1, R9 |
| Mã đúng nhưng sai hoa/thường | CẦN LÀM RÕ | SRS không định nghĩa có phân biệt hoa/thường không | `"save10"` (Thay vì `"SAVE10"`) | R1 |

---

### 2. Biến: `total_amount` (Body)

Giả định khi test các lớp này: `code` = `"SAVE10"` (ngưỡng 300,000đ), Token hợp lệ, `user_id` hợp lệ.

| Lớp (Partition) | Hợp lệ? | Cách vi phạm (Chỉ 1 lỗi) | Đại diện (Value) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Lớn hơn ngưỡng tối thiểu | Có | Không vi phạm | `500000` | R3 |
| Bằng ngưỡng tối thiểu | Có | Không vi phạm | `300000` | R3 |
| Nhỏ hơn ngưỡng tối thiểu (nhưng > 0) | Không | Không thỏa điều kiện C3 | `250000` | R3 |
| Giá trị bằng 0 | CẦN LÀM RÕ | SRS không quy định đơn hàng 0đ có được gọi API hay API có tự chặn không | `0` | R3, R9 |
| Giá trị âm | CẦN LÀM RÕ | SRS không chặn âm, nhưng logic thực tế đơn hàng không thể âm | `-100000` | R3, R9 |
| Sai kiểu dữ liệu (String thay vì Number) | CẦN LÀM RÕ | Lỗi định dạng API payload, không vi phạm nghiệp vụ C1-C5 (lỗi Schema) | `"500000"` | R9 |

---

### 3. Biến: `user_id` (Body)

Giả định khi test các lớp này: `code` hợp lệ, `total_amount` đủ ngưỡng, Token hợp lệ của User ID = 1.

| Lớp (Partition) | Hợp lệ? | Cách vi phạm (Chỉ 1 lỗi) | Đại diện (Value) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| ID khớp với Token, định dạng đúng | Có | Không vi phạm | `1` | R4, R9 |
| ID khác với User ID trong Token | CẦN LÀM RÕ | SRS chưa quy định cơ chế đối chiếu Token và payload (Lỗ hổng logic quyền) | `2` (nhưng dùng token của user 1) | R4, R9 |
| ID không tồn tại trong hệ thống | CẦN LÀM RÕ | SRS không nói API có check user_id tồn tại không (nếu token đã hợp lệ) | `999999` | R9 |
| ID âm hoặc 0 | CẦN LÀM RÕ | SRS không quy định validate số âm cho ID | `-1` | R9 |
| Sai kiểu dữ liệu (String) | CẦN LÀM RÕ | Lỗi định dạng API payload | `"1"` | R9 |

---

### 4. Biến: `Authorization` (Header)

Giả định khi test các lớp này: Payload body hoàn toàn hợp lệ.

| Lớp (Partition) | Hợp lệ? | Cách vi phạm (Chỉ 1 lỗi) | Đại diện (Value) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| Token đúng định dạng, còn hạn, hợp lệ | Có | Không vi phạm | `Bearer eyJhbG... (Token thật)` | R4 |
| Không gửi Header Authorization | Không | Thiếu xác thực người dùng (C4) | *(Bỏ trống header)* | R4 |
| Gửi Token nhưng đã hết hạn (Expired) | Không | Token không hợp lệ (C4) | `Bearer eyJhbG... (Token hết hạn)` | R4 |
| Token sai chữ ký (Tự sửa payload) / sai format | Không | Token không hợp lệ (C4) | `Bearer invalid_token_123` | R4 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
