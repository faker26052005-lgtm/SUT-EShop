# FR-15-05 – FR-15 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 09:00:37 (UTC+0700) |
| Feature / bước | FR-15 – Bước 5 - Phân tích boundary value |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: 3 value.
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là **BƯỚC 5 – BOUNDARY VALUE ANALYSIS (BVA)** dựa trên các biến đã xác định từ các bước trước.

### 1. Chọn biến để áp dụng BVA

* **Các biến được chọn:**
* **`name` (Độ dài chuỗi):** Được chọn vì SRS quy định rõ biên hợp lệ (bắt buộc có nhập, tối đa 255 ký tự).
* **`price` (Giá trị số):** Được chọn vì SRS quy định rõ biên hợp lệ (phải là số dương `> 0`).


* **Các biến bị loại và lý do:**
* `category_id`, `id`: Là các định danh (ID) mang tính chất phân loại (Nominal/Discrete), không có thứ tự lớn bé hoặc giới hạn độ lớn tuyến tính trong logic kiểm thử đen (chỉ xét tồn tại hay không).
* `description`, `imageUrl`, `search`: Là các chuỗi nhưng SRS đang **im lặng hoàn toàn** về giới hạn độ dài. Không có biên được định nghĩa trong tài liệu nên không thể áp dụng BVA (trừ khi BA làm rõ thông tin).



---

### 2. Xác định biên và Bảng giá trị biên (Variant: 3-Value)

Biến thể 3-value yêu cầu lấy 3 giá trị tại một biên: `Biên - 1`, `Biên`, và `Biên + 1`.

*(Lưu ý đối với biến `price`: Vì SRS im lặng về kiểu dữ liệu và giới hạn trên, ta giả định đơn vị nhỏ nhất là số nguyên `1` (dựa trên ví dụ `100000` của API), và không thiết kế giá trị biên trên do chưa có thông tin).*

| Biến | Thuộc tính | Giới hạn hợp lệ | Loại biên | Biên - 1 (Cận dưới/ngoài) | Biên (Tại biên) | Biên + 1 (Cận trên/trong) |
| --- | --- | --- | --- | --- | --- | --- |
| **`name`** | Độ dài chuỗi (ký tự) | `[1, 255]` | Biên dưới | **0** (Không hợp lệ) | **1** (Hợp lệ) | **2** (Hợp lệ) |
|  |  |  | Biên trên | **254** (Hợp lệ) | **255** (Hợp lệ) | **256** (Không hợp lệ) |
| **`price`** | Giá trị số nguyên | `>= 1` | Biên dưới | **0** (Không hợp lệ) | **1** (Hợp lệ) | **2** (Hợp lệ) |
|  |  |  | Biên trên | CẦN LÀM RÕ | CẦN LÀM RÕ | CẦN LÀM RÕ |

---

### 3. Test Case Boundary Value Analysis (BVA)

*Body chuẩn cho các biến còn lại:* `{"price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}`

| ID | Biến | Giá trị cụ thể | Ý nghĩa giá trị (Variant 3-value) | Kỳ vọng | Mã Y/C |
| --- | --- | --- | --- | --- | --- |
| **BV-01** | name | `""` (Rỗng) | Cận dưới (Độ dài = 0) | 4xx và dữ liệu không đổi | R2 |
| **BV-02** | name | `"A"` | Tại biên dưới (Độ dài = 1) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-03** | name | `"AB"` | Cận trên của biên dưới (Độ dài = 2) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-04** | name | Chuỗi gồm 254 chữ `"A"` | Cận dưới của biên trên (Độ dài = 254) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-05** | name | Chuỗi gồm 255 chữ `"A"` | Tại biên trên (Độ dài = 255) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-06** | name | Chuỗi gồm 256 chữ `"A"` | Cận trên (Độ dài = 256) | 4xx và dữ liệu không đổi | R2 |
| **BV-07** | price | `0` | Cận dưới (Giá trị = 0) | 4xx và dữ liệu không đổi | R3 |
| **BV-08** | price | `1` | Tại biên dưới (Giá trị = 1) | 2xx và dữ liệu được lưu đúng | R3 |
| **BV-09** | price | `2` | Cận trên của biên dưới (Giá trị = 2) | 2xx và dữ liệu được lưu đúng | R3 |

---

### 4. Phân tích trùng lặp với Domain Testing (Bước 4)

Khi so sánh kết quả sinh test từ kỹ thuật BVA với Equivalence Partitioning (Domain Testing) ở Bước 4, ta thấy các sự trùng lặp sau:

1. **BV-01 (name rỗng, độ dài 0) TRÙNG VỚI DT-03 (name chuỗi rỗng):** Cả hai đều vi phạm điều kiện "Bắt buộc".
2. **BV-06 (name dài 256 ký tự) TRÙNG VỚI DT-04 (name dài 256 ký tự):** Cả hai đều vi phạm điều kiện "Max length".
3. **BV-07 (price = 0) TRÙNG VỚI DT-09 (price = 0):** Cả hai đều vi phạm điều kiện "Giá là số dương > 0".

**Có nên giữ không?**

* **Về mặt lý thuyết thiết kế:** **NÊN GIỮ CẢ HAI** trong các tài liệu phân tích kỹ thuật vì chúng chứng minh rằng cả hai phương pháp luận (xét theo lớp đại diện và xét theo biên) đều che phủ được điểm đứt gãy của hệ thống.
* **Về mặt thực thi (Test Execution):** **KHÔNG NÊN CHẠY CẢ HAI**. Để tối ưu thời gian thực thi (đặc biệt trong Test Automation), khi nhập vào công cụ quản lý test (Jira, TestRail...), ta nên **gộp/loại bỏ trùng lặp**. Giữ lại một bộ test duy nhất nhưng gắn thẻ (tag) chứng minh test case này thỏa mãn độ phủ của cả Domain Testing và Boundary Value Analysis.
## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
