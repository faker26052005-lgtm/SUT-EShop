# FR-04-05 – FR-04 · Bước 5 - Phân tích boundary value

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:39:26 (UTC+0700) |
| Feature / bước | FR-04 – Bước 5 - Phân tích boundary value |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 5 – BOUNDARY VALUE ANALYSIS.
1. Chọn các biến có thứ tự hoặc là số ở bước 2 và nêu lý do chọn (cũng như lý do loại các biến còn lại).
2. Với mỗi biến, xác định biên dưới và biên trên của miền hợp lệ, rồi lập bảng giá trị biên. Dùng biến thể BVA: TODO (điền đúng biến thể giảng viên dạy, ví dụ 3-value: min-1, min, min+1, max-1, max, max+1).
3. Sinh test case BVA: ID (BV-01...), biến, giá trị cụ thể, ý nghĩa của giá trị, kỳ vọng theo SRS, mã yêu cầu.
4. Chỉ ra test BVA nào trùng lớp với test Domain Testing ở bước 4 và cho biết có nên giữ không.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Chọn biến áp dụng BVA và lý do

**Các biến được chọn để áp dụng BVA:**

* **`phone` (Độ dài chuỗi):** Được chọn vì SRS quy định rõ miền giá trị có tính thứ tự và đếm được là độ dài từ 10 đến 11 ký tự.
* **`name` và `shipping_address` (Độ dài chuỗi):** Mặc dù SRS hiện tại đang im lặng về giới hạn độ dài, về mặt bản chất dữ liệu (String) thì luôn tồn tại biên vật lý của Database (ví dụ `VARCHAR(255)`). Ta có thể áp dụng BVA nhưng kết quả kỳ vọng sẽ ở trạng thái "CẦN LÀM RÕ" cho đến khi team BA/Dev xác nhận biên.

**Các biến bị loại khỏi BVA:**

* **`email`, `role`, `Authorization`:** Loại bỏ vì đây là các biến dạng trạng thái, boolean, hoặc chuỗi không có tính thứ tự/phạm vi số học liên tục. Chúng chỉ mang tính chất đúng/sai hoặc có/không (ví dụ: token hợp lệ hoặc không, chuỗi role là `admin` hoặc không).

---

### 2. Xác định biên và Lập bảng giá trị biên

Sử dụng biến thể **3-value BVA** (phân tích 3 giá trị tại biên). Quy tắc cho một miền hợp lệ `[min, max]` là kiểm tra các giá trị: `min - 1`, `min`, `min + 1`, `max - 1`, `max`, `max + 1`.

#### Bảng giá trị biên cho biến `phone` (Miền hợp lệ: 10 - 11)

* **Biên dưới (min) = 10:** Các giá trị test là 9, 10, 11.
* **Biên trên (max) = 11:** Các giá trị test là 10, 11, 12.
* **Tập giá trị rút gọn (loại trùng lặp):** 9, 10, 11, 12.

| Biến | Min | Max | min - 1 | min | min + 1 | max - 1 | max | max + 1 | Tập giá trị test cuối cùng |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Độ dài `phone**` | 10 | 11 | 9 | 10 | 11 | 10 | 11 | 12 | `{9, 10, 11, 12}` |

#### Bảng giá trị biên cho biến `name` & `shipping_address` (Giả định miền: 1 - 255)

*(Lưu ý: Do SRS chưa rõ, ta dùng 1 làm min và 255 làm max giả định để lập bảng minh họa phương pháp).*

| Biến | Min | Max | min - 1 | min | min + 1 | max - 1 | max | max + 1 | Tập giá trị test cuối cùng |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Độ dài `name`, `address**` | 1 | 255 | 0 | 1 | 2 | 254 | 255 | 256 | `{0, 1, 2, 254, 255, 256}` |

---

### 3. Sinh Test Case BVA

*Quy tắc áp dụng: Giữ nguyên các trường hợp lệ chuẩn (`name`: "Nguyen Van A", `shipping_address`: "123 Le Loi", Token: Hợp lệ) và chỉ vi phạm DUY NHẤT một điều kiện biên đang xét.*

| ID | Biến test | Giá trị độ dài | Giá trị chuỗi cụ thể (Input) | Ý nghĩa của giá trị | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- | --- | --- |
| **BV-01** | `phone` | 9 | `"091234567"` | Dưới biên hợp lệ (min - 1) | 4xx và dữ liệu không đổi | R2 |
| **BV-02** | `phone` | 10 | `"0912345678"` | Ngay tại biên dưới (min) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-03** | `phone` | 11 | `"01234567890"` | Ngay tại biên trên (max, cũng là min + 1) | 2xx và dữ liệu được lưu đúng | R2 |
| **BV-04** | `phone` | 12 | `"091234567890"` | Vượt biên hợp lệ (max + 1) | 4xx và dữ liệu không đổi | R2 |
| **BV-05** | `name` | 0 | `""` | Rỗng (min - 1, giả định min=1) | CẦN LÀM RÕ | R1 |
| **BV-06** | `name` | 1 | `"A"` | Ngắn nhất (min, giả định min=1) | CẦN LÀM RÕ | R1 |
| **BV-07** | `name` | 255 | `"A... (255 ký tự)"` | Dài nhất (max, giả định max=255) | CẦN LÀM RÕ | R1 |
| **BV-08** | `name` | 256 | `"A... (256 ký tự)"` | Vượt giới hạn (max + 1) | CẦN LÀM RÕ | R1 |

*(Việc sinh test case cho `shipping_address` tương tự như `name`, nên được lược bớt để tránh lặp).*

---

### 4. Phân tích trùng lặp giữa BVA và Domain Testing (Bước 4)

Khi đối chiếu bộ BVA với bộ Domain Testing (DT) ở Bước 4, ta thấy sự trùng lặp hoàn toàn tại các lớp liên quan đến **độ dài của `phone**`:

* **BV-01 (Độ dài 9)** trùng với **DT-04** (Lớp P_I2: Vi phạm độ dài ngắn).
* **BV-02 (Độ dài 10)** trùng với **DT-01** (Lớp P_V1: Happy path, 10 số).
* **BV-03 (Độ dài 11)** trùng với **DT-02** (Lớp P_V2: Hợp lệ với 11 số).
* **BV-04 (Độ dài 12)** trùng với **DT-05** (Lớp P_I3: Vi phạm độ dài dài).
* **BV-05 (Độ dài 0)** trùng với **DT-13** (Lớp N_U2: name truyền rỗng).

**Khuyến nghị (Có nên giữ không?):**
**Không nên giữ cả hai.** Theo nguyên tắc tối ưu hóa bộ kiểm thử (Test Optimization), các Test Case của BVA về bản chất chính là việc *chọn ra các giá trị đại diện tốt nhất* cho các lớp tương đương đã chia ở Domain Testing.
-> **Cách xử lý:** Gộp (Merge) chúng lại. Sử dụng bộ Test Case của BVA để thay thế trực tiếp cho các Test Case tương ứng trong nhóm phân hoạch độ dài của Domain Testing. Việc này giúp loại bỏ sự dư thừa, tiết kiệm chi phí bảo trì test case mà vẫn đảm bảo độ phủ (Coverage) cao nhất (phát hiện lỗi tại biên).

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
