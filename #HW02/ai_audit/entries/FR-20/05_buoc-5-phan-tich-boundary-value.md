# FR-20-05 – FR-20 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:40:23 (UTC+0700) |
| Feature / bước | FR-20 – Bước 5 - Phân tích boundary value |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: 3 value.
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Chọn biến áp dụng BVA và Lý do

Kỹ thuật Boundary Value Analysis (BVA) chỉ áp dụng cho các biến có tính thứ tự (ordered), có thể đếm được hoặc có giới hạn numeric rõ ràng.

**Biến được chọn:**

1. **Độ dài của `password`:** Được chọn vì SRS quy định rõ biên dưới là "Tối thiểu 8 ký tự".
2. **Độ dài của `name`:** Được chọn vì SRS quy định bắt buộc nhập, suy ra biên dưới ngầm định là độ dài chuỗi bằng 1.

**Biến bị loại trừ (Không áp dụng BVA):**

* **`email`:** Định dạng email được chia theo các phần tử (user, `@`, domain) mang tính logic/pattern thay vì thứ tự tuyến tính. Độ dài tối đa của email SRS không đề cập.
* **`confirm_password`:** Ràng buộc của biến này là "khớp tuyệt đối" với `password` (Binary logic: Khớp / Không khớp), không có tính lớn hơn hay nhỏ hơn.
* **`id` (Mã đơn hàng):** ID dùng để định danh thực thể. BVA có thể áp dụng cho ID ở mức kỹ thuật (VD: ID $> 0$, ID lớn nhất của DB) nhưng SRS không định nghĩa format của ID đơn hàng, nên áp dụng BVA ở đây thiếu cơ sở.
* **Biên trên (Max) của `password` và `name`:** SRS hoàn toàn im lặng về độ dài tối đa của các trường này, do đó **CẦN LÀM RÕ** trước khi có thể áp dụng BVA cho biên trên.

---

### 2. Xác định Biên (Boundaries) và Bảng Giá Trị 3-Value

Áp dụng phương pháp BVA 3-value (kiểm tra tại biên, ngay dưới biên, và ngay trên biên) cho các biên đã biết.

*Lưu ý: Các giá trị test cho password bên dưới đều được thiết kế để chứa đủ 4 loại ký tự (Hoa, thường, số, đặc biệt), đảm bảo nếu test fail thì chỉ fail duy nhất do lỗi độ dài.*

| Biến (Đặc tính) | Biên dưới (Min) | Min - 1 | Min | Min + 1 | Biên trên (Max) | Max - 1 / Max / Max + 1 |
| --- | --- | --- | --- | --- | --- | --- |
| **Độ dài `password**` | 8 ký tự | **7** (`"Aa1!bcd"`) | **8** (`"Aa1!bcde"`) | **9** (`"Aa1!bcdef"`) | *CẦN LÀM RÕ* | *Chưa thể test do thiếu SRS* |
| **Độ dài `name**` | 1 ký tự | **0** (`""` - chuỗi rỗng) | **1** (`"A"`) | **2** (`"An"`) | *CẦN LÀM RÕ* | *Chưa thể test do thiếu SRS* |

---

### 3. Sinh Test Case BVA

*(Các biến khác không nhắc đến mặc định dùng dữ liệu hợp lệ: Email chuẩn, Status đơn hàng hợp lệ...)*

| ID | Biến & Giá trị | Ý nghĩa của giá trị | Input cụ thể | Kết quả mong đợi (Expected Result) | Mã YQ |
| --- | --- | --- | --- | --- | --- |
| **BV-PWD-01** | `password` len = 7 | **Min - 1**: Giá trị không hợp lệ nằm ngay dưới biên. | `password`: `"Aa1!bcd"` (7 ký tự) | 4xx Client Error. Dữ liệu không đổi. UI báo lỗi mật khẩu yếu. | R3 |
| **BV-PWD-02** | `password` len = 8 | **Min**: Giá trị hợp lệ nhỏ nhất tại biên. | `password`: `"Aa1!bcde"` (8 ký tự) | 2xx Success và dữ liệu được lưu đúng. | R3 |
| **BV-PWD-03** | `password` len = 9 | **Min + 1**: Giá trị hợp lệ nằm ngay trên biên. | `password`: `"Aa1!bcdef"` (9 ký tự) | 2xx Success và dữ liệu được lưu đúng. | R3 |
| **BV-NAM-01** | `name` len = 0 | **Min - 1**: Không có ký tự nào (chuỗi rỗng). | `name`: `""` | 4xx Client Error. Dữ liệu không đổi. UI báo lỗi bắt buộc nhập. | R1, R6 |
| **BV-NAM-02** | `name` len = 1 | **Min**: Giá trị hợp lệ nhỏ nhất (Tên 1 ký tự). | `name`: `"A"` | 2xx Success và dữ liệu được lưu đúng. | R1 |
| **BV-NAM-03** | `name` len = 2 | **Min + 1**: Giá trị hợp lệ nằm ngay trên biên. | `name`: `"An"` | 2xx Success và dữ liệu được lưu đúng. | R1 |

---

### 4. Đánh Giá Trùng Lặp Giữa Domain Testing và BVA

Trong thực tế kiểm thử, BVA thường được dùng để *chọn ra giá trị đại diện* cho các lớp tương đương nhằm tối ưu số lượng test case.

**1. Trùng lặp với lớp Không hợp lệ (Invalid Classes):**

* **`BV-PWD-01` (Password 7 ký tự)** trùng chính xác với lớp tương đương ở Test Case **`DT-REG-11`** (Mật khẩu < 8 ký tự) tại Bước 4.
* **`BV-NAM-01` (Name 0 ký tự)** trùng chính xác với lớp tương đương ở Test Case **`DT-REG-02`** (Bỏ trống Họ Tên).
* **Khuyến nghị:** **KHÔNG NÊN GIỮ** cả hai. Nên gộp lại: Dùng chính giá trị biên `Min-1` (7 ký tự, 0 ký tự) làm giá trị đại diện (đầu vào) cho các Test Case phân vùng tương đương `DT-REG-11` và `DT-REG-02` để vừa bao phủ được logic phân vùng, vừa bắt được lỗi off-by-one (lỗi sai lệch 1 đơn vị) tại biên.

**2. Trùng lặp với lớp Hợp lệ (Valid Classes):**

* **`BV-PWD-02`, `BV-PWD-03`, `BV-NAM-02`, `BV-NAM-03**` (Các giá trị 8, 9 ký tự và 1, 2 ký tự) đều thuộc lớp "Dữ liệu hợp lệ chuẩn" của **`DT-REG-01`**.
* **Khuyến nghị:** **NÊN GIỮ**. Test Case `DT-REG-01` thường dùng dữ liệu thực tế mang tính phổ quát, ở giữa miền (Nominal value - ví dụ: Tên "Nguyen Van A", pass "Password123!@"). Việc giữ lại các Test Case `Min` và `Min+1` của BVA là rất quan trọng vì lập trình viên rất dễ code sai dấu `>= 8` thành `> 8`. Mặc dù chúng cùng nằm trong một phân vùng hợp lệ, nhưng rủi ro tại giá trị 8 và 9 cao hơn hẳn so với giá trị 15 (của Domain Testing).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
