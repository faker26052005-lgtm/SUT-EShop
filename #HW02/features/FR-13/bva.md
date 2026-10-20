# FR-13 – Dashboard & Quản lý đơn hàng · Boundary Value Analysis

## Bước 5: Boundary Value Analysis

### 5.1 Biến được chọn cho BVA và lý do
| Biến | Miền hợp lệ | Biên dưới | Biên trên | Lý do chọn |
| :--- | :--- | :-: | :-: | :--- |
| `total_amount` (Checkout Body) | $1 \le total\_amount \le 2,147,483,647$ | 1 | 2,147,483,647 | Biến kiểu số liên tục, có tính thứ tự rõ ràng |

**Không áp dụng BVA** cho:
- `shipping_address`: SRS không nêu độ dài tối đa/tối thiểu.
- `status`: Tập hợp rời rạc các giá trị cố định (Enum), không có thứ tự liên tục.
- `:id`: Khóa chính dạng số nhưng SRS không nêu khoảng giá trị biên cụ thể.
- `Authorization`: Chuỗi Token xác thực dạng danh mục.

### 5.2 Bảng giá trị biên
Sử dụng biến thể BVA: 3-value ($min-1, min, min+1, max-1, max, max+1$).

| Biến | min−1 | min | min+1 | max−1 | max | max+1 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| `total_amount` | 0 | 1 | 2 | 2,147,483,646 | 2,147,483,647 | 2,147,483,648 |

### 5.3 Test case BVA
| ID | Biến | Giá trị (và ý nghĩa) | Loại biên | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BV-01 | `total_amount` | `{"total_amount": 0}` | min − 1 (dưới biên hợp lệ) | CẦN LÀM RÕ | R1 |
| BV-02 | `total_amount` | `{"total_amount": -50000}` | Cực trị số âm | CẦN LÀM RÕ | R1 |
| BV-03 | `total_amount` | `{"total_amount": 1}` | min (biên dưới hợp lệ) | 2xx và dữ liệu lưu đúng | R1 |
| BV-04 | `total_amount` | `{"total_amount": 2147483647}` | max (MAX INT 32-bit) | 2xx và dữ liệu lưu đúng | R1 |

### 5.4 Phân biệt với Domain Testing
Domain Testing đánh giá xem dữ liệu thuộc lớp tương đương hợp lệ hay không hợp lệ, trong khi BVA tập trung kiểm tra chính xác các ranh giới cận trên/cận dưới để phát hiện lỗi lập trình ở điều kiện so sánh (`>`, `>=`, `<`, `<=`).

| Test BVA | Trùng lớp với | Quyết định |
| :--- | :--- | :--- |
| BV-01 (`total_amount = 0`) | Lớp số âm/bằng 0 | Giữ: Thử nghiệm chính xác điểm giáp ranh biên dưới |
| BV-02 (`total_amount = -50000`) | Lớp số âm | Giữ: Thử nghiệm giá trị âm sâu |
| BV-03 (`total_amount = 1`) | DT-01 (AMT-V1) | Giữ: Kiểm tra giá trị nhỏ nhất hợp lệ |
| BV-04 (`total_amount = 2147483647`) | AMT-V1 | Giữ: Kiểm tra ranh giới tràn số integer |