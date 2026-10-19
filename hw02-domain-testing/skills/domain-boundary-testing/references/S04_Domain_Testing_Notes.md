# S04 — Domain Testing & Boundary Value Analysis (CSC13003 Course Slides)

Tài liệu được chuyển đổi và hệ thống hóa từ bài giảng chính thức: **CSC13003 - Software Testing - Slide S04: Domain Testing**.

---

## 1. Bản chất & Mục tiêu (Fundamental Goal)
- **Vấn đề cốt lõi:** Có quá nhiều test case khả dĩ, không ai có thể chạy hết được toàn bộ không gian đầu vào.
- **Giải pháp:** Áp dụng chiến lược lấy mẫu phân tầng (stratified sampling strategy) để chọn ra một số lượng nhỏ các ca kiểm thử đại diện từ một không gian rất lớn.
- **Định nghĩa:** Phân chia một miền giá trị (domain) thành các miền con (sub-domains / equivalence classes), sau đó kiểm thử bằng các giá trị đại diện chọn từ mỗi miền con đó.

---

## 2. Quy trình 4 bước tổng quát (General Approach - 4 Steps)
1. **Bước 1 — Xác định các biến đầu vào và đầu ra (Identify Input & Output variables):** Dựa trên đặc tả chương trình (Program Specification).
2. **Bước 2 — Xác định các lớp tương đương cho từng biến (Identify equivalence classes for each Input & Output):** Chia tập giá trị khả dĩ thành các lớp tương đương (Valid & Invalid).
3. **Bước 3 — Chọn "đại diện tốt nhất" cho từng lớp (Find a "best representative" for each subset):** Thiết kế bộ test case tối thiểu bao phủ tất cả các lớp.
4. **Bước 4 — Phân tích giá trị biên (Boundary Value Analysis):** Các đại diện tốt nhất của các miền có thứ tự (ordered fields) thường chính là các giá trị tại biên.

---

## 3. Bước 1: Xác định Input & Output
- Phân tích đặc tả yêu cầu để tìm:
  - Tất cả các biến đầu vào (Inputs).
  - Kết quả đầu ra mong đợi (Outputs) bao gồm: kết quả xử lý thành công (ví dụ: `SUM`) và các thông báo lỗi khi dữ liệu không hợp lệ (`Error message / Invalid Input`).

---

## 4. Bước 2: Xác định các lớp tương đương (Equivalence Classes - EC)

### 4.1. Nguyên lý cơ bản
- Hai test case thuộc cùng một lớp tương đương nếu kết quả mong đợi của chúng là như nhau.
- **Thực thi nhiều test case trong cùng một lớp tương đương về mặt định nghĩa là kiểm thử dư thừa (redundant testing).**
- Việc xác định Equivalence Classes là một quá trình kinh nghiệm (heuristic process).

### 4.2. Phân loại lớp
- **VALID EQUIVALENCE CLASSES (Lớp hợp lệ):** Đại diện cho các đầu vào hợp lệ mà hệ thống chấp nhận.
- **INVALID EQUIVALENCE CLASSES (Lớp không hợp lệ):** Đại diện cho các đầu vào không hợp lệ mà hệ thống phải từ chối/báo lỗi.

### 4.3. Các nguyên tắc / hướng dẫn phân chia (Guidelines)
1. **Ràng buộc theo khoảng giá trị (Range):**
   - *Ví dụ:* Số lượng item từ 1 đến 999 (`1 <= count <= 999`).
   - $\rightarrow$ 1 lớp Valid: `1 <= count <= 999`.
   - $\rightarrow$ 2 lớp Invalid: `count < 1` và `count > 999`.
2. **Ràng buộc theo tập hợp giá trị (Set of values):**
   - Nếu chương trình xử lý khác nhau cho từng giá trị (ví dụ loại xe: `BUS, TRUCK, TAXI-CAB, PASSENGER, MOTORCYCLE`).
   - $\rightarrow$ Mỗi giá trị hợp lệ là 1 lớp Valid.
   - $\rightarrow$ 1 lớp Invalid cho giá trị ngoài tập (ví dụ: `TRAILER`).
3. **Ràng buộc bắt buộc (Must-be condition):**
   - *Ví dụ:* Ký tự đầu tiên của định danh phải là chữ cái (letter).
   - $\rightarrow$ 1 lớp Valid: Là chữ cái.
   - $\rightarrow$ 1 lớp Invalid: Không phải chữ cái (số, ký tự đặc biệt).
4. **Nguyên tắc chia nhỏ (Splitting rule):**
   - Nếu có bất kỳ lý do nào cho thấy các phần tử trong một lớp tương đương không được chương trình xử lý giống nhau, **hãy tách lớp đó thành 2 hoặc nhiều lớp con nhỏ hơn**.

---

## 5. Bước 3: Lựa chọn Test Case (Selecting Test Cases)

### 5.1. Quy tắc bao phủ (Coverage Rules)
- Chọn ít nhất 1 test case từ mỗi lớp tương đương.
- **Đối với các lớp hợp lệ (Valid classes):** Chọn các test case sao cho **bao phủ càng nhiều lớp hợp lệ càng tốt trong cùng một test case**, cho đến khi toàn bộ các lớp hợp lệ được bao phủ (giúp giảm thiểu số lượng ca kiểm thử cần chạy).
- **Đối với các lớp không hợp lệ (Invalid classes):** Mỗi test case **CHỈ ĐƯỢC PHÉP bao phủ DUY NHẤT MỘT lớp không hợp lệ**, tất cả các biến còn lại phải giữ ở giá trị hợp lệ.
  - *Lý do:* Tránh hiện tượng một lỗi che giấu lỗi khác (error masking), giúp cô lập chính xác nguyên nhân thất bại.

### 5.2. Bảng ma trận bao phủ tối thiểu (Minimum Set of Test Cases)
- Lập bảng liệt kê: `#TC`, `Partitions Tested (Mã lớp tương đương được kiểm tra)`, các giá trị input đại diện, và `Expected Output`.

---

## 6. Bước 4: Phân tích giá trị biên (Boundary Value Analysis - BVA)

### 6.1. Tại sao cần kiểm thử tại biên?
- Các chương trình có xác suất lỗi cao nhất tại các điểm biên do:
  - Sai dấu bất đẳng thức (ví dụ: viết nhầm `INPUT <= 25` thay vì `INPUT < 25`).
  - Gõ nhầm giá trị biên (ví dụ: gõ nhầm số `52` thay vì `25`).
- **Giá trị biên bắt được toàn bộ các lỗi này**, trong khi giá trị thông thường (non-boundary) có thể bỏ lọt hoàn toàn cả hai lỗi.

### 6.2. Kỹ thuật chọn điểm biên theo slide (Tối đa 9 giá trị test cho mỗi phân vùng)
Với mỗi phân vùng có biên dưới (**Lower Boundary - LB**) và biên trên (**Upper Boundary - UB**):
- **Tại biên dưới (LB):**
  - `LB - 1` (Invalid / ngoài biên dưới)
  - `LB` (Valid / tại biên dưới)
  - `LB + 1` (Valid / ngay trong biên dưới)
- **Tại biên trên (UB):**
  - `UB - 1` (Valid / ngay trong biên trên)
  - `UB` (Valid / tại biên trên)
  - `UB + 1` (Invalid / ngoài biên trên)
- **Giá trị danh nghĩa (Nominal):** Một giá trị điển hình ở giữa phân vùng hợp lệ.
- **Giá trị cực trị giao diện UI (Smallest / Largest Possible Values):** Điểm nhỏ nhất / lớn nhất mà form UI hoặc kiểu dữ liệu cho phép nhập.

---

## 7. Ưu và nhược điểm của kỹ thuật (Strengths vs Weaknesses)
- **Ưu điểm (Strengths):**
  - Tìm ra các lỗi có xác suất xảy ra cao nhất với một số lượng test case tương đối nhỏ.
  - Rõ ràng theo trực giác, dễ dạy, dễ hiểu và dễ chuẩn hóa quy trình.
  - Mở rộng tốt cho các bài toán có nhiều biến đầu vào.
- **Hạn chế / Điểm mù (Weaknesses / Blind spots):**
  - Bỏ sót các lỗi không nằm ở biên hoặc các trường hợp đặc biệt không rõ ràng.
  - Trong thực tế, các miền giá trị thực sự (actual domains) thường khó xác định trọn vẹn từ đặc tả mơ hồ.
