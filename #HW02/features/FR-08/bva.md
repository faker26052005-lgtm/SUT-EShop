# FR-08 – Thanh toán (Checkout) · Boundary Value Analysis

## Bước 5: Boundary Value Analysis

### 5.1 Biến được chọn cho BVA và lý do

| Biến | Miền hợp lệ | Biên dưới | Biên trên | Lý do chọn |
| :--- | :--- | :-: | :-: | :--- |
| `total_amount` | Number $\ge 1$ | 1 | Không giới hạn | Biến dạng số, Backend tự tính từ giỏ hàng. Kiểm thử các mức số 0, số âm và số nhỏ nhất. |
| Độ dài `shipping_address` | 1–255 ký tự (giả định chuẩn) | 1 | 255 | Chuỗi ký tự có độ dài thứ tự. SRS im lặng về độ dài Max nên chọn 255 làm biên giả định. |
| `quantity` (khi tạo giỏ hàng) | Integer $\ge 1$ | 1 | 999 (giả định) | Số lượng sản phẩm dạng số nguyên dương. |
| `price` (khi tạo giỏ hàng) | Number $\ge 1$ | 1 | Không giới hạn | Đơn giá sản phẩm dạng số dương. |

**Không áp dụng BVA** cho:
- `Authorization`: Chuỗi mã hóa/định danh (JWT Token), thuộc dạng Categorical (danh định), không mang tính thứ tự số hay độ dài nghiệp vụ.

---

### 5.2 Bảng giá trị biên

Áp dụng kỹ thuật **3-value BVA** ($min-1, min, min+1, max-1, max, max+1$) cho các điểm biên:

| Biến | min−1 | min | min+1 | max−1 | max | max+1 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| `total_amount` | `-1` | `0` | `1` | N/A | N/A | N/A |
| Độ dài `shipping_address` | 0 (`""`) | 1 (`"A"`) | 2 (`"AB"`) | 254 | 255 | 256 |
| `quantity` | `0` | `1` | `2` | 998 | 999 | 1000 |
| `price` | `0` | `1` | `2` | N/A | N/A | N/A |

---

### 5.3 Test case BVA

| ID | Biến | Giá trị (và ý nghĩa) | Loại biên | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BV-01 | `total_amount` | `-1` | min−1 (số âm) | CẦN LÀM RÕ | R2, R4 |
| BV-02 | `total_amount` | `0` | min (bằng 0) | CẦN LÀM RÕ | R2, R4 |
| BV-03 | `total_amount` | `1` | min+1 (số dương nhỏ nhất) | 2xx và dữ liệu lưu đúng | R2, R4 |
| BV-04 | `shipping_address` | `""` (0 ký tự) | min−1 (chuỗi rỗng) | CẦN LÀM RÕ | R8 |
| BV-05 | `shipping_address` | `"A"` (1 ký tự) | min (chuỗi 1 ký tự) | 2xx và dữ liệu lưu đúng | R8 |
| BV-06 | `shipping_address` | `"AB"` (2 ký tự) | min+1 | 2xx và dữ liệu lưu đúng | R8 |
| BV-07 | `shipping_address` | Chuỗi 254 ký tự | max−1 | CẦN LÀM RÕ | R8 |
| BV-08 | `shipping_address` | Chuỗi 255 ký tự | max (giới hạn Max) | CẦN LÀM RÕ | R8 |
| BV-09 | `shipping_address` | Chuỗi 256 ký tự | max+1 (vượt giới hạn) | CẦN LÀM RÕ | R8 |
| BV-10 | `quantity` | `0` | min−1 (bằng 0) | CẦN LÀM RÕ | R2 |
| BV-11 | `quantity` | `1` | min (số lượng tối thiểu) | 2xx và dữ liệu lưu đúng | R2 |
| BV-12 | `quantity` | `2` | min+1 | 2xx và dữ liệu lưu đúng | R2 |
| BV-13 | `quantity` | `998` | max−1 | CẦN LÀM RÕ | R2 |
| BV-14 | `quantity` | `999` | max | CẦN LÀM RÕ | R2 |
| BV-15 | `quantity` | `1000` | max+1 | CẦN LÀM RÕ | R2 |
| BV-16 | `price` | `0` | min−1 (bằng 0) | CẦN LÀM RÕ | R2 |
| BV-17 | `price` | `1` | min (đơn giá tối thiểu) | 2xx và dữ liệu lưu đúng | R2 |
| BV-18 | `price` | `2` | min+1 | 2xx và dữ liệu lưu đúng | R2 |

---

### 5.4 Phân biệt với Domain Testing

| Test BVA | Trùng lớp với | Quyết định |
| :--- | :--- | :--- |
| BV-02 (`total_amount = 0`) | DT-08 (`total_amount = 0`) | **Giữ BV-02, loại DT-08**: BV-02 định danh chính xác điểm biên dưới. |
| BV-04 (`address = ""`) | DT-15 (`address = ""`) | **Giữ BV-04, loại DT-15**: Trùng lặp hoàn toàn chuỗi rỗng. |
| BV-10 (`quantity = 0`) | DT-21 (`quantity = 0`) | **Giữ BV-10, loại DT-21**: Trùng lặp kiểm thử số lượng 0. |
| BV-12 (`quantity = 2`) | DT-19 (`quantity = 2`) | **Giữ DT-19, loại BV-12**: DT-19 đại diện chuẩn cho lớp hợp lệ, point min+1 không mang thêm rủi ro. |

Việc loại bỏ bớt ca trùng giúp tối ưu bộ test nhưng vẫn giữ nguyên coverage 100%.