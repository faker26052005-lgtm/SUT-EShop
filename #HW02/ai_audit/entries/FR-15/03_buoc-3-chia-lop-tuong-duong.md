# FR-15-03 – FR-15 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:56:16 (UTC+0700) |
| Feature / bước | FR-15 – Bước 3 - chia lớp tương đương |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là **BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Equivalence Partitioning)** áp dụng cho từng biến đã xác định ở Bước 2.

*(Lưu ý: Đối với các đại diện không hợp lệ, ta ngầm định rằng tất cả các biến khác trong request body đều đang ở trạng thái hợp lệ, để đảm bảo lỗi sinh ra là do đúng một điều kiện duy nhất bị vi phạm).*

### 1. Biến `name` (Body - Tên sản phẩm)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** Chuỗi có độ dài từ 1 đến 255 ký tự. | Có | (Không) | `"Áo thun nam"` | R2 |
| **L2:** Không truyền trường `name` (Missing/Null). | Không | Thiếu trường bắt buộc | `null` hoặc không gửi key `name` | R2 |
| **L3:** Chuỗi rỗng (0 ký tự). | Không | Vi phạm yêu cầu bắt buộc (không có dữ liệu thực) | `""` | R2 |
| **L4:** Chuỗi dài hơn 255 ký tự. | Không | Vượt quá độ dài tối đa cho phép | Chuỗi gồm 256 chữ `"A"` | R2 |
| **L5:** Sai kiểu dữ liệu (Không phải chuỗi). | Không | Sai định dạng kiểu dữ liệu | `123` (số) hoặc `true` (boolean) | R2 |
| **L6:** Chuỗi chỉ toàn khoảng trắng. | CẦN LÀM RÕ | CẦN LÀM RÕ | `"   "` | R2 |
| **L7:** Tên trùng với một sản phẩm đã có trong DB. | CẦN LÀM RÕ | CẦN LÀM RÕ | `"Áo thun nam"` (đã tồn tại) | R2 |

### 2. Biến `price` (Body - Giá)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** Số nguyên dương (> 0). | Có | (Không) | `100000` | R3 |
| **L2:** Không truyền trường `price`. | Không | Thiếu trường bắt buộc | `null` hoặc không gửi key `price` | R3 |
| **L3:** Giá trị bằng 0. | Không | Vi phạm điều kiện lớn hơn 0 | `0` | R3 |
| **L4:** Giá trị là số âm. | Không | Vi phạm điều kiện lớn hơn 0 | `-50000` | R3 |
| **L5:** Sai kiểu dữ liệu (String, Boolean). | Không | Sai định dạng kiểu dữ liệu | `"100000"` (chuỗi) | R3 |
| **L6:** Số thập phân dương. | CẦN LÀM RÕ | CẦN LÀM RÕ | `10.5` | R3 |
| **L7:** Số vượt quá giới hạn lưu trữ (Max Int). | CẦN LÀM RÕ | CẦN LÀM RÕ | `9999999999999999` | R3 |

### 3. Biến `category_id` (Body - Danh mục)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** ID danh mục đang tồn tại trong hệ thống. | Có | (Không) | `1` (ID đã có sẵn) | R4 |
| **L2:** Không truyền trường `category_id`. | Không | Thiếu trường bắt buộc | `null` hoặc không gửi key | R4 |
| **L3:** ID danh mục không tồn tại trong hệ thống. | Không | Dữ liệu tham chiếu không tồn tại | `9999` (Chưa từng tạo) | R4 |
| **L4:** Sai kiểu dữ liệu. | Không | Sai định dạng kiểu dữ liệu | `"abc"` | R4 |
| **L5:** ID danh mục đã bị xóa trước đó. | CẦN LÀM RÕ | CẦN LÀM RÕ | `2` (ID của danh mục vừa xóa) | R4 |

### 4. Biến `description` (Body - Mô tả)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** Chuỗi ký tự thông thường. | Có (Ngầm định) | (Không) | `"Mô tả sản phẩm rất hay"` | R1 |
| **L2:** Không truyền trường `description` hoặc chuỗi rỗng. | CẦN LÀM RÕ | CẦN LÀM RÕ (Trường này có bắt buộc không?) | `null` hoặc `""` | R1 |
| **L3:** Chuỗi cực dài. | CẦN LÀM RÕ | CẦN LÀM RÕ (Có max length cho mô tả không?) | Chuỗi dài 10,000 ký tự | R1 |

### 5. Biến `imageUrl` (Body - Link ảnh)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** Chuỗi có định dạng URL hợp lệ. | Có (Ngầm định) | (Không) | `"[http://example.com/1.jpg](http://example.com/1.jpg)"` | R1 |
| **L2:** Không truyền trường `imageUrl` hoặc chuỗi rỗng. | CẦN LÀM RÕ | CẦN LÀM RÕ (Có bắt buộc không?) | `null` hoặc `""` | R1 |
| **L3:** Chuỗi không phải là định dạng URL. | CẦN LÀM RÕ | CẦN LÀM RÕ (Có validate URL format không?) | `"not_a_valid_url"` | R1 |

### 6. Biến `id` (Path Parameter - Dành cho API Xem chi tiết/Sửa/Xóa)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** ID sản phẩm đang tồn tại trong hệ thống. | Có | (Không) | `1` | R1, R5 |
| **L2:** ID sản phẩm không tồn tại. | Không | Không tìm thấy thực thể cần thao tác | `9999` | R1, R5 |
| **L3:** Sai kiểu dữ liệu (chữ cái / ký tự đặc biệt). | Không | Sai định dạng path parameter | `"abc"` | R1, R5 |
| **L4:** ID sản phẩm đã bị xóa. | CẦN LÀM RÕ | CẦN LÀM RÕ (API Xem/Sửa/Xóa ứng xử thế nào?) | `2` (ID sản phẩm đã xóa) | R1, R5 |

### 7. Biến `search` (Query Parameter - Dành cho API Lấy danh sách)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **L1:** Chuỗi khớp với tên sản phẩm có trong DB. | Có | (Không) | `"Áo thun"` | R1 |
| **L2:** Chuỗi không khớp với bất kỳ sản phẩm nào. | Có (Trả về mảng rỗng) | (Không) | `"Sản_phẩm_không_có_thật"` | R1 |
| **L3:** Không truyền query string hoặc chuỗi rỗng. | Có (Lấy tất cả) | (Không) | Lược bỏ `?search=` | R1 |
| **L4:** Từ khóa chứa thẻ HTML/Script (XSS payload). | Có (UI escape) | CẦN LÀM RÕ (Hệ thống có tự sanitize hay lưu nguyên gốc?) | `<script>alert(1)</script>` | R8 |
| **L5:** Từ khóa chứa payload SQL Injection. | Có (Trả về đúng/sai hợp lệ do bảo vệ DB) | Vi phạm R9 nếu CSDL sập. Lớp này dùng để verify R9. | `' OR 1=1 --` | R9 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
