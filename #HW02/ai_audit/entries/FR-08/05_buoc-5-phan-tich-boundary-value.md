# FR-08-05 – FR-08 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:44:04 (UTC+0700) |
| Feature / bước | FR-08 – Bước 5 - Phân tích boundary value |
| Chat / phiên | FR8 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: 3 value.
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Lựa chọn biến áp dụng Boundary Value Analysis (BVA)

* **Biến được CHỌN:**
* `total_amount`: Biến kiểu số (Numeric), có tập giá trị liên tục mang thứ tự.
* `shipping_address`: Biến kiểu chuỗi (String), áp dụng BVA trên miền thứ tự là **độ dài chuỗi** (`length`).
* `quantity`: Biến kiểu số nguyên (Integer), số lượng sản phẩm.
* `price`: Biến kiểu số (Numeric), đơn giá sản phẩm.

* **Biến bị LOẠI:**
* `Authorization`: Biến kiểu chuỗi định danh (Categorical String - JWT Token), mang tính chất giá trị mã hóa/danh định, không có miền số hay miền độ dài có ý nghĩa nghiệp vụ để xét biên.

---

### 2. Xác định biên và Bảng giá trị biên (Kỹ thuật 3-value BVA)

Sử dụng kỹ thuật **3-value BVA** cho mỗi điểm biên $B$: lấy 3 giá trị gồm $B-1$, $B$, $B+1$ (hoặc Off-point, On-point, In-point).

#### Biến `total_amount` (Body - `POST /api/checkout`)

* *Biên dưới giả định:* $0$ (SRS im lặng về việc đơn hàng 0 VNĐ có hợp lệ hay không, Backend tự tính từ giỏ hàng).

| Điểm biên | Vị trí giá trị | Giá trị cụ thể | Trạng thái theo SRS |
| --- | --- | --- | --- |
| **Biên dưới (0)** | $B - 1$ (Off-point) | `-1` | CẦN LÀM RÕ |
|  | $B$ (On-point) | `0` | CẦN LÀM RÕ |
|  | $B + 1$ (In-point) | `1` | 2xx và dữ liệu được lưu đúng |

#### Biến `shipping_address` (Độ dài chuỗi `length`)

* *Biên dưới:* Min = 1 ký tự (Chuỗi không rỗng).
* *Biên trên:* Max = 255 ký tự (Giả định chuẩn hệ thống; SRS im lặng về Max length).

| Điểm biên | Vị trí giá trị | Giá trị cụ thể (`length`) | Trạng thái theo SRS |
| --- | --- | --- | --- |
| **Biên dưới (Min = 1)** | $B - 1$ (Off-point) | `0` (Chuỗi `""`) | CẦN LÀM RÕ |
|  | $B$ (On-point) | `1` (Ví dụ: `"A"`) | 2xx và dữ liệu được lưu đúng |
|  | $B + 1$ (In-point) | `2` (Ví dụ: `"AB"`) | 2xx và dữ liệu được lưu đúng |
| **Biên trên (Max = 255)** | $B - 1$ (In-point) | `254` ký tự | CẦN LÀM RÕ |
|  | $B$ (On-point) | `255` ký tự | CẦN LÀM RÕ |
|  | $B + 1$ (Off-point) | `256` ký tự | CẦN LÀM RÕ |

#### Biến `quantity` (Body - `POST /api/cart`)

* *Biên dưới:* Min = 1 sản phẩm.
* *Biên trên:* Max = 999 sản phẩm (Giả định giới hạn giỏ hàng; SRS im lặng).

| Điểm biên | Vị trí giá trị | Giá trị cụ thể | Trạng thái theo SRS |
| --- | --- | --- | --- |
| **Biên dưới (Min = 1)** | $B - 1$ (Off-point) | `0` | CẦN LÀM RÕ |
|  | $B$ (On-point) | `1` | 2xx và dữ liệu được lưu đúng |
|  | $B + 1$ (In-point) | `2` | 2xx và dữ liệu được lưu đúng |
| **Biên trên (Max = 999)** | $B - 1$ (In-point) | `998` | CẦN LÀM RÕ |
|  | $B$ (On-point) | `999` | CẦN LÀM RÕ |
|  | $B + 1$ (Off-point) | `1000` | CẦN LÀM RÕ |

#### Biến `price` (Body - `POST /api/cart`)

* *Biên dưới:* Min = 1 VNĐ.

| Điểm biên | Vị trí giá trị | Giá trị cụ thể | Trạng thái theo SRS |
| --- | --- | --- | --- |
| **Biên dưới (Min = 1)** | $B - 1$ (Off-point) | `0` | CẦN LÀM RÕ |
|  | $B$ (On-point) | `1` | 2xx và dữ liệu được lưu đúng |
|  | $B + 1$ (In-point) | `2` | 2xx và dữ liệu được lưu đúng |

---

### 3. Danh sách Test Case BVA

Các biến không trực tiếp kiểm thử biên trong mỗi test case đều sử dụng giá trị hợp lệ chuẩn (Token chuẩn, giỏ hàng có 1 SP giá 100,000, địa chỉ hợp lệ).

| ID | Biến | Giá trị cụ thể | Ý nghĩa của giá trị | Kỳ vọng theo SRS | Mã YC |
| --- | --- | --- | --- | --- | --- |
| **BV-01** | `total_amount` | `-1` | Biên dưới $B-1$ (Off-point số âm) | CẦN LÀM RÕ | R2, R4 |
| **BV-02** | `total_amount` | `0` | Biên dưới $B$ (On-point số 0) | CẦN LÀM RÕ | R2, R4 |
| **BV-03** | `total_amount` | `1` | Biên dưới $B+1$ (In-point số dương nhỏ nhất) | 2xx và dữ liệu được lưu đúng | R2, R4 |
| **BV-04** | `shipping_address` | `""` (0 ký tự) | Biên dưới độ dài $B-1$ (Chuỗi rỗng) | CẦN LÀM RÕ | R8 |
| **BV-05** | `shipping_address` | `"A"` (1 ký tự) | Biên dưới độ dài $B$ (Chuỗi 1 ký tự) | 2xx và dữ liệu được lưu đúng | R8 |
| **BV-06** | `shipping_address` | `"AB"` (2 ký tự) | Biên dưới độ dài $B+1$ (Chuỗi 2 ký tự) | 2xx và dữ liệu được lưu đúng | R8 |
| **BV-07** | `shipping_address` | Chuỗi 254 ký tự | Biên trên độ dài $B-1$ (Cận trên hợp lệ) | CẦN LÀM RÕ | R8 |
| **BV-08** | `shipping_address` | Chuỗi 255 ký tự | Biên trên độ dài $B$ (Trên biên Max) | CẦN LÀM RÕ | R8 |
| **BV-09** | `shipping_address` | Chuỗi 256 ký tự | Biên trên độ dài $B+1$ (Vượt biên Max) | CẦN LÀM RÕ | R8 |
| **BV-10** | `quantity` | `0` | Biên dưới số lượng $B-1$ | CẦN LÀM RÕ | R2 |
| **BV-11** | `quantity` | `1` | Biên dưới số lượng $B$ (Số lượng tối thiểu) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-12** | `quantity` | `2` | Biên dưới số lượng $B+1$ | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-13** | `quantity` | `998` | Biên trên số lượng $B-1$ | CẦN LÀM RÕ | R2 |
| **BV-14** | `quantity` | `999` | Biên trên số lượng $B$ (Số lượng tối đa) | CẦN LÀM RÕ | R2 |
| **BV-15** | `quantity` | `1000` | Biên trên số lượng $B+1$ (Vượt số lượng tối đa) | CẦN LÀM RÕ | R2 |
| **BV-16** | `price` | `0` | Biên dưới đơn giá $B-1$ | CẦN LÀM RÕ | R2 |
| **BV-17** | `price` | `1` | Biên dưới đơn giá $B$ (Đơn giá tối thiểu) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-18** | `price` | `2` | Biên dưới đơn giá $B+1$ | 2xx và dữ liệu được lưu đúng | R2 |

---

### 4. Đối chiếu trùng lặp giữa Test BVA và Test Domain Testing (Bước 4)

| Test BVA ID | Giá trị kiểm thử | Test Domain Testing bị trùng (Bước 4) | Khuyến nghị xử lý (Giữ / Xóa) | Lý do |
| --- | --- | --- | --- | --- |
| **BV-02** | `total_amount = 0` | **DT-08** (`total_amount = 0`) | **Nên GIỮ BV-02, LOẠI BỎ DT-08** | Cùng kiểm thử việc truyền `0` vào `total_amount`. BV-02 mang tính chất kiểm thử giá trị biên chính xác hơn. |
| **BV-04** | `shipping_address = ""` | **DT-15** (`shipping_address = ""`) | **Nên GIỮ BV-04, LOẠI BỎ DT-15** | Hoàn toàn trùng lặp về input chuỗi rỗng. |
| **BV-10** | `quantity = 0` | **DT-21** (`quantity = 0`) | **Nên GIỮ BV-10, LOẠI BỎ DT-21** | Hoàn toàn trùng lặp về kiểm thử số lượng bằng 0. |
| **BV-12** | `quantity = 2` | **DT-19** (`quantity = 2`) | **Nên GIỮ DT-19, LOẠI BỎ BV-12** | DT-19 đã đại diện cho lớp hợp lệ chuẩn của `quantity`. BV-12 là điểm $B+1$ không mang lại thêm rủi ro lỗi mới. |

**Đánh giá tổng quan:** Việc loại bỏ các test case trùng lặp giúp tối ưu hóa bộ test suite, giảm thời gian thực thi nhưng vẫn đảm bảo độ bao phủ (Coverage) 100% các lớp tương đương và các điểm biên quan trọng.

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
