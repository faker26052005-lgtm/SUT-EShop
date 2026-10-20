# FR-09-05 – FR-09 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:43:53 (UTC+0700) |
| Feature / bước | FR-09 – Bước 5 - Phân tích boundary value |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: TODO (điền đúng biến thể giảng viên dạy, ví dụ 3-value: min-1, min, min+1, max-1, max, max+1).
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 5 - Phân tích Giá trị biên (Boundary Value Analysis - BVA) dựa trên các yêu cầu và phân tích từ các bước trước.

### 1. Lựa chọn biến để áp dụng BVA

**Các biến được CHỌN (có tính thứ tự, số lượng hoặc thời gian):**

* **`total_amount` (Body):** Là giá trị số, có ràng buộc biên dưới rõ ràng là `>= min_order_amount`.
* **Số lượt đã sử dụng (Biến trạng thái ẩn):** Là giá trị số đếm, có ràng buộc biên trên là `< max_uses_per_user`.
* **Thời gian hiện tại so với `expired_at` (Biến trạng thái ẩn):** Có tính thứ tự thời gian, ràng buộc là "trước `expired_at`".

**Các biến BỊ LOẠI (không có tính thứ tự hoặc không có biên nghiệp vụ được SRS định nghĩa):**

* **`code`:** Chuỗi ký tự định danh (String), SRS không định nghĩa giới hạn độ dài (min/max length) nên không có biên.
* **`user_id`:** Dù là số nhưng mang tính chất định danh (Identifier), không đại diện cho một đại lượng có thể so sánh lớn/nhỏ mang ý nghĩa nghiệp vụ trong API này (ngoại trừ biên = 0 thuộc về schema, đã phủ trong Domain Testing).
* **`Authorization` (Token):** Chuỗi mã hóa, chỉ có trạng thái hợp lệ hoặc không hợp lệ (hết hạn, sai chữ ký).

---

### 2. Xác định biên và Bảng giá trị biên

Sử dụng **biến thể 3-value BVA (Giá trị biên 3 điểm)**: Kiểm tra ngay tại mốc biên (Boundary), sát dưới biên một đơn vị (Boundary - 1) và sát trên biên một đơn vị (Boundary + 1).

* **Biến 1: `total_amount` (Giả sử test với mã SAVE10 có `min_order_amount = 300000`)**
* Ràng buộc: `>= 300000`
* Giá trị biên: `299999` (min - 1), `300000` (min), `300001` (min + 1)


* **Biến 2: Số lượt đã dùng (Giả sử test với mã VIP100 có `max_uses_per_user = 2`)**
* Ràng buộc: `< 2` (Nghĩa là tối đa chỉ được dùng 1 lần, lần thứ 2 gọi API sẽ lỗi).
* Giá trị biên: `1` (max - 1), `2` (max), `3` (max + 1)


* **Biến 3: Thời gian hiện tại vs `expired_at` (Giả sử test với mã có `expired_at = 2024-12-31`)**
* Ràng buộc: "trước 2024-12-31"
* Giá trị biên (tính theo ngày): `2024-12-30` (trước 1 ngày), `2024-12-31` (đúng ngày), `2025-01-01` (sau 1 ngày).



---

### 3. Danh sách Test Case BVA

| ID | Biến test | Giá trị BVA | Ý nghĩa giá trị | Kỳ vọng theo SRS | Mã YC |
| --- | --- | --- | --- | --- | --- |
| **BV-01** | `total_amount` | 299,999 | Dưới ngưỡng tối thiểu 1 đơn vị (min - 1) | 4xx và dữ liệu không đổi | R3 |
| **BV-02** | `total_amount` | 300,000 | Ngay tại ngưỡng tối thiểu (min) | 2xx và dữ liệu được lưu đúng | R3 |
| **BV-03** | `total_amount` | 300,001 | Trên ngưỡng tối thiểu 1 đơn vị (min + 1) | 2xx và dữ liệu được lưu đúng | R3 |
| **BV-04** | Số lượt đã dùng | 1 lần | Sát dưới giới hạn lượt dùng (`max_uses_per_user` - 1) | 2xx và dữ liệu được lưu đúng | R5 |
| **BV-05** | Số lượt đã dùng | 2 lần | Ngay tại giới hạn (`max_uses_per_user`). Ràng buộc là `< max` | 4xx và dữ liệu không đổi | R5 |
| **BV-06** | Số lượt đã dùng | 3 lần | Vượt giới hạn 1 đơn vị (`max_uses_per_user` + 1) | 4xx và dữ liệu không đổi | R5 |
| **BV-07** | Ngày hiện tại | 2024-12-30 | Trước ngày hết hạn 1 ngày | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-08** | Ngày hiện tại | 2024-12-31 | Ngay đúng ngày `expired_at` | CẦN LÀM RÕ (Toán tử < hay <=) | R2 |
| **BV-09** | Ngày hiện tại | 2025-01-01 | Sau ngày hết hạn 1 ngày | 4xx và dữ liệu không đổi | R2 |

---

### 4. Đánh giá trùng lặp giữa BVA và Domain Testing

Khi so sánh bảng Test Case ở Bước 4 (Domain Testing - DT) và Bước 5 (BVA - BV), ta thấy có sự trùng lặp do đại diện của lớp tương đương thường vô tình (hoặc cố ý) rơi vào vùng biên hoặc cùng kiểm tra chung một lỗi:

1. **DT-10 (`total_amount` = 250,000) trùng lớp với BV-01 (`total_amount` = 299,999):** Cả hai đều test lớp "dưới ngưỡng tối thiểu".
2. **DT-05 (User đã dùng 2 lần - hết lượt) trùng với BV-05 (Số lượt = 2):** Cùng test lớp "đã chạm/vượt giới hạn sử dụng".
3. **DT-04 (Mã đã quá hạn - EXPIRED) trùng lớp với BV-09 (Ngày hiện tại = sau hạn 1 ngày):** Cùng test lớp "thời gian đã vượt quá `expired_at`".

**Có nên giữ lại không?**
*Quyết định:* **Nên loại bỏ các test case của Domain Testing (DT-04, DT-05, DT-10) và giữ lại các test case BVA.**
*Lý do:* Theo nguyên lý kiểm thử, lỗi thường tập trung ở các giá trị biên do sai sót của Dev khi dùng toán tử (như dùng `>` thay vì `>=`). Test case BVA (ví dụ 299,999) có xác suất tìm ra lỗi cao hơn rất nhiều so với một giá trị ngẫu nhiên trong vùng không hợp lệ (250,000) của Domain Testing. Việc giữ lại cả hai là dư thừa tài nguyên (cùng test 1 lớp lỗi), do đó giữ lại test có giá trị cao nhất (BVA) để tối ưu bộ test.

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
