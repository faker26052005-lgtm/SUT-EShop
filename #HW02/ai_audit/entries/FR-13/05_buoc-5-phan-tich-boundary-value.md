# FR-13-05 – FR-13 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 21:01:33 (UTC+0700) |
| Feature / bước | FR-13 – Bước 5 - Phân tích boundary value |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: 3 value.
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Chọn và Loại Các Biến Cho BVA

* **Các biến được CHỌN để áp dụng BVA:**
1. **`total_amount`** *(Body - `POST /api/checkout`)*: Dữ liệu kiểu số (Number) có miền giá trị liên tục, có tính thứ tự rõ ràng.
2. **Độ dài chuỗi `shipping_address**` *(Body - `POST /api/checkout`)*: Độ dài chuỗi ký tự (String Length) là một tập số nguyên không âm có thứ tự.
3. **`:id`** *(Path - `PUT /api/admin/orders/:id/status`)*: Khóa chính dạng số nguyên (Integer ID) có tính thứ tự.


* **Các biến bị LOẠI khỏi BVA:**
1. **`Authorization`** *(Header)*: Chuỗi định danh token xác thực dạng danh mục (Categorical), không có giá trị số hay thứ tự toán học.
2. **`status`** *(Body)*: Tập hợp rời rạc các giá trị cố định (Enum 5 chuỗi), không chứa thứ tự liên tục hay khoảng giá trị số.



---

### 2. Xác Định Giá Trị Biên (BVA 3-Value Variant)

Do SRS không nêu rõ hạn mức tối đa (Max limit), các giá trị biên trên ($U$) được giả định theo tiêu chuẩn hạ tầng (như số nguyên 32-bit `2,147,483,647` hoặc chuẩn `VARCHAR(255)`). Các điểm mơ hồ được đánh dấu để làm rõ.

* **Quy tắc BVA 3-Value:** Với biên dưới $L$ và biên trên $U$, chọn 6 điểm thử nghiệm: $L-1, L, L+1$ (quanh biên dưới) và $U-1, U, U+1$ (quanh biên trên).

#### Bảng xác định giá trị biên:

| Biến / Chỉ số | Biên dưới (\(L\)) | Biên trên (\(U\)) | Các giá trị BVA 3-Value |
| --- | --- | --- | --- |
| **`total_amount`** | \(L = 1\) (Số nguyên dương nhỏ nhất) | \(U = 2,147,483,647\) (MAX 32-bit INT) | • Quanh \(L\): `0` (\(L-1\)), `1` (\(L\)), `2` (\(L+1\))<br><br>• Quanh \(U\): `2147483646` (\(U-1\)), `2147483647` (\(U\)), `2147483648` (\(U+1\)) |
| **Độ dài `shipping_address`** | \(L = 1\) ký tự | \(U = 255\) ký tự | • Quanh \(L\): `0` (\(L-1\)), `1` (\(L\)), `2` (\(L+1\))<br><br>• Quanh \(U\): `254` (\(U-1\)), `255` (\(U\)), `256` (\(U+1\)) |
| **Order `:id`** | \(L = 1\) (ID số nguyên dương) | \(U = 2,147,483,647\) (MAX INT) | • Quanh \(L\): `0` (\(L-1\)), `1` (\(L\)), `2` (\(L+1\))<br><br>• Quanh \(U\): `2147483646` (\(U-1\)), `2147483647` (\(U\)), `2147483648` (\(U+1\)) |

---

### 3. Danh Sách Test Case BVA

*(Tất cả request không đề cập đến lỗi xác thực đều mặc định sử dụng Admin JWT hợp lệ; các biến khác giữ giá trị chuẩn hợp lệ).*

| ID | Biến | Giá trị cụ thể | Ý nghĩa giá trị | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- | --- |
| **BV-01** | `total_amount` | `0` | Dưới biên dưới hợp lệ ($L-1$) | `CẦN LÀM RÕ` | R1 |
| **BV-02** | `total_amount` | `1` | Biên dưới hợp lệ ($L$) | `2xx và dữ liệu được lưu đúng` | R1 |
| **BV-03** | `total_amount` | `2` | Trên biên dưới hợp lệ ($L+1$) | `2xx và dữ liệu được lưu đúng` | R1 |
| **BV-04** | `total_amount` | `2147483646` | Dưới biên trên hợp lệ ($U-1$) | `2xx và dữ liệu được lưu đúng` | R1 |
| **BV-05** | `total_amount` | `2147483647` | Biên trên hợp lệ ($U$) | `2xx và dữ liệu được lưu đúng` | R1 |
| **BV-06** | `total_amount` | `2147483648` | Vượt biên trên hợp lệ ($U+1$) | `CẦN LÀM RÕ` | R1 |
| **BV-07** | `shipping_address` | `""` (Độ dài = 0) | Dưới biên dưới hợp lệ ($L-1$) | `CẦN LÀM RÕ` | R2 |
| **BV-08** | `shipping_address` | `"A"` (Độ dài = 1) | Biên dưới hợp lệ ($L$) | `2xx và dữ liệu được lưu đúng` | R2 |
| **BV-09** | `shipping_address` | `"AB"` (Độ dài = 2) | Trên biên dưới hợp lệ ($L+1$) | `2xx và dữ liệu được lưu đúng` | R2 |
| **BV-10** | `shipping_address` | Chuỗi 254 ký tự | Dưới biên trên hợp lệ ($U-1$) | `2xx và dữ liệu được lưu đúng` | R2 |
| **BV-11** | `shipping_address` | Chuỗi 255 ký tự | Biên trên hợp lệ ($U$) | `2xx và dữ liệu được lưu đúng` | R2 |
| **BV-12** | `shipping_address` | Chuỗi 256 ký tự | Vượt biên trên hợp lệ ($U+1$) | `CẦN LÀM RÕ` | R2 |
| **BV-13** | `:id` | `0` | Dưới biên dưới hợp lệ ($L-1$) | `4xx và dữ liệu không đổi` | R6 |
| **BV-14** | `:id` | `1` | Biên dưới hợp lệ ($L$) | `2xx và dữ liệu được lưu đúng` | R6 |
| **BV-15** | `:id` | `2` | Trên biên dưới hợp lệ ($L+1$) | `2xx và dữ liệu được lưu đúng` | R6 |
| **BV-16** | `:id` | `2147483646` | Dưới biên trên hợp lệ ($U-1$) | `2xx và dữ liệu được lưu đúng` | R6 |
| **BV-17** | `:id` | `2147483647` | Biên trên hợp lệ ($U$) | `2xx và dữ liệu được lưu đúng` | R6 |
| **BV-18** | `:id` | `2147483648` | Vượt biên trên hợp lệ ($U+1$) | `4xx và dữ liệu không đổi` | R6 |

---

### 4. Đối Chiếu Trùng Lặp Giữa Test Case BVA và Domain Testing

#### Các trường hợp trùng lớp / trùng giá trị đại diện:

1. **`BV-01` (`total_amount = 0`)** trùng với **`DT-20`** (Checkout với `total_amount = 0`).
2. **`BV-07` (`shipping_address` rỗng)** trùng với **`DT-25`** (Checkout với `shipping_address` chuỗi rỗng).
3. **`BV-13` (`:id = 0`)** đại diện trùng nhóm lớp với **`DT-11`** (Order ID âm/bằng 0).
4. **`BV-02`, `BV-03` (`total_amount = 1, 2`)** nằm trong cùng lớp tương đương hợp lệ `AMT_V1` với **`DT-18`** (`total_amount = 200000`).

#### Khuyến nghị xử lý (Nên giữ hay loại bỏ?):

* **KHÔNG NÊN GIỮ CÁC TEST TRÙNG LẶP HOÀN TOÀN TRONG BỘ THI CÔNG (Execution Test Suite):**
* Nên **loại bỏ hoặc gộp các Test Case trùng khớp hoàn toàn** (như `BV-01`/`DT-20`, `BV-07`/`DT-25`) để tối ưu hóa thời gian thực thi tự động/thủ công và tránh lãng phí tài nguyên.


* **NÊN GIỮ LẠI CÁC TEST GIÁ TRỊ BIÊN ĐẶC THÙ (BVA Boundary Tests):**
* Các test case kiểm tra giá trị cận trên/cận dưới ($U$, $U+1$, $L$) như `BV-05`, `BV-06`, `BV-11`, `BV-12`, `BV-17`, `BV-18` **BẮT BUỘC NÊN GIỮ LẠI**.
* *Lý do:* Kỹ thuật Chia lớp tương đương (Domain Testing) chỉ đại diện một giá trị trung bình trong lớp, trong khi lỗi phần mềm thực tế (tràn bộ nhớ, cắt gọt dữ liệu DB, lỗi gõ dấu `>=` thành `>`) xảy ra chủ yếu ở chính các điểm biên này.

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
