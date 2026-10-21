# Kịch Bản Thuyết Minh Chi Tiết Toàn Diện Từng Mục Trong File `SKILL.md`

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên:** Nguyễn Quốc Kỳ – **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Chiến lược trình bày:** Thuyết minh chi tiết, mổ xẻ toàn diện từng mục của file `SKILL.md` theo chuẩn ISTQB FL v4.0 và HW02 Rubric (Mục 7 & 15 – 10 điểm)

---

## 🎬 1. Bố Cục Video Demo HW02 (Khung Thời Gian Khuyến Nghị 8 – 11 Phút)

| Mốc thời gian | Phân đoạn | Nội dung trọng tâm |
| :---: | :--- | :--- |
| **00:00 – 01:15** | **Phần 1: Giới thiệu chung** | Thông tin sinh viên, môn học, bối cảnh bài tập HW02 và mục tiêu video. |
| **01:15 – 06:15** | **Phần 2: Mổ xẻ Chi tiết File `SKILL.md`** | **Trình bày chi tiết từng mục từ trên xuống dưới theo Kịch bản ở Mục 2.** |
| **06:15 – 09:15** | **Phần 3: Live Demo quy trình 6 bước** | Trình diễn tương tác với AI trên feature `FR-02`, thực hiện Git commit từng bước. |
| **09:15 – 10:15** | **Phần 4: Thực thi trên SUT & Bắt Bug** | Chạy 1 test case trên Web/API EShop, chỉ ra bug sai khác SRS $\to$ Show Bug Report & GitHub Issue. |
| **10:15 – 11:00** | **Phần 5: Đánh giá Bloom-AI & Kết luận** | Đánh giá vai trò Human-in-the-Loop, bài học rút ra (AI Critique), lời cảm ơn. |

---

## 🎙️ 2. Kịch Bản Thuyết Minh Chi Tiết Từng Phần Trên `SKILL.MD` (Phần 2: 01:15 – 06:15)

* **Vị trí file trên hệ thống:** [`~/.gemini/config/skills/domain-testing-value-analysis/SKILL.md`](file:///home/quocky05/.gemini/config/skills/domain-testing-value-analysis/SKILL.md)
* **Thiết lập màn hình:** Mở file trên IDE (VS Code hoặc Antigravity), chỉnh font chữ cỡ 16–18px, bật hiển thị số dòng (line numbers).

---

### 📍 Chặng 1: Header YAML & Mục Đích Tiêu Chuẩn (Dòng 1 – 21)
* **[Thao tác màn hình]:** Đặt chuột tại dòng 1. Bôi đen phần YAML Frontmatter (`name` và `description`), sau đó rê chuột xuống mục `## 1. Purpose & Standards`.
* **[Lời thoại]:**
  > *"Kính thưa Thầy Cô, sau đây em xin trình bày chi tiết về cấu trúc và nguyên lý vận hành của Agent Skill `domain-testing-value-analysis` mà em đã xây dựng trong thư mục cấu hình hệ thống.*  
  > 
  > *Ngay tại phần định danh YAML đầu file, skill được mô tả là một trợ lý điều hướng quy trình thiết kế kiểm thử hộp đen. Ở **Mục 1 – Mục đích & Tiêu chuẩn**, skill xác lập 3 trụ cột bắt buộc phải tuân thủ:*  
  > *• Thứ nhất là chuẩn quốc tế **ISTQB FL v4.0 §4.2.1** về Phân vùng tương đương (Equivalence Partitioning).*  
  > *• Thứ hai là chuẩn **ISTQB FL v4.0 §4.2.2** về Phân tích giá trị biên (Boundary Value Analysis).*  
  > *• Và thứ ba là quy chuẩn bài tập **HW02 của FIT@HCMUS** về việc phân tích dựa trên đặc tả, lưu vết Git commit từng bước và có sự thẩm định của con người."*

---

### 📍 Chặng 2: 6 Nguyên Tắc Cốt Lõi & Nguồn Chân Lý (Dòng 23 – 44)
* **[Thao tác màn hình]:** Cuộn chuột đến `## 2. Core Principles & Source of Truth`. Lần lượt rê chuột qua các nguyên tắc từ 1 đến 6.
* **[Lời thoại]:**
  > *"Tại **Mục 2**, em đã thiết lập **6 nguyên tắc cốt lõi** để làm 'hàng rào bảo vệ' (Guardrails) định hướng suy luận cho AI:*  
  > 
  > *1. **Đặc tả là căn cứ duy nhất (Specification as Sole Truth):** AI bắt buộc đọc từ file SRS của EShop. Nếu đặc tả thiếu hoặc chưa rõ, AI phải ghi nhận là giả định (assumption) chứ tuyệt đối không được tự bịa đặt ràng buộc hay mã lỗi.*  
  > *2. **Định nghĩa lỗi (Expected vs. Actual):** Kết quả mong đợi lấy thuần túy từ SRS. Bất kỳ sai khác nào khi chạy trên SUT đều là ứng viên khiếm khuyết (candidate defect).*  
  > *3. **Phân biệt kịch bản đặc tả và kịch bản thăm dò:** Các probe an toàn như SQL Injection hay XSS phải được gắn nhãn là 'Exploratory' trừ khi SRS có yêu cầu cụ thể.*  
  > *4. **Nguồn gốc độc lập giữa EP và BVA:** Phân vùng tương đương và giá trị biên là hai kỹ thuật bổ trợ nhưng xuất phát từ căn cứ khác nhau, cần được truy vết tách biệt.*  
  > *5. **Phân tách miền dữ liệu thành 5 tầng:** Để tránh việc AI thổi phồng số lượng test case, em bắt buộc chia phân vùng thành 5 nhóm: Dữ liệu form thuần túy, Phân quyền truy cập, Định danh tài nguyên CRUD, Quy tắc nghiệp vụ, và Thăm dò an ninh/độ bền.*  
  > *6. **Bao phủ 100% thẻ đặc tả kiểm thử:** Mọi ca kiểm thử trong ma trận đều bắt buộc phải có thẻ chi tiết riêng, không được gộp nhóm hay chỉ đưa ra một vài mẫu minh họa."*

---

### 📍 Chặng 3: Giao Thức Tương Tác Từng Bước (Interactive Protocol) (Dòng 46 – 58)
* **[Thao tác màn hình]:** Cuộn chuột đến `## 3. Interactive Protocol (Step-by-Step Execution)`. Chỉ chuột vào 4 quy tắc và khối lệnh `git commit hook`.
* **[Lời thoại]:**
  > *"Sang **Mục 3**, đây là cơ chế cốt lõi để hiện thực hóa chiến lược **AI-First nhưng không Black-box**.*  
  > 
  > *Mặc định, skill hoạt động ở chế độ **Step-by-Step Mode** thông qua 4 quy tắc thực thi:*  
  > *• **Single-Step Output:** Khi kích hoạt, AI chỉ thực hiện duy nhất 1 bước được yêu cầu.*  
  > *• **Intermediate Deliverable:** Chỉ xuất ra đúng bảng kết quả của bước đó mà không sinh trước các bước sau.*  
  > *• **Git Commit Hook:** Kết thúc mỗi phản hồi, AI phải tự động sinh ra đúng cú pháp lệnh Git commit đề xuất cho bước đó.*  
  > *• **Human Review Prompt:** AI luôn dừng lại để hỏi ý kiến và chờ em xác nhận: 'Proceed' hoặc yêu cầu chỉnh sửa.*  
  > 
  > *Cơ chế này đảm bảo em luôn giữ vai trò Human-in-the-Loop, trực tiếp kiểm duyệt từng bước trước khi commit mã nguồn vào Git."*

---

### 📍 Chặng 4: Sơ Đồ Quy Trình 6 Bước (Dòng 60 – 76)
* **[Thao tác màn hình]:** Cuộn đến `## 4. The 6-Step Workflow`. Trỏ vào sơ đồ Mermaid `flowchart TD` (lia chuột từ S1/G1 xuống S6/G6).
* **[Lời thoại]:**
  > *"Mục 4 trực quan hóa toàn bộ quy trình qua sơ đồ Mermaid. Mỗi bước trong chu trình từ **Step 1 đến Step 6** đều nối tiếp bằng một điểm kiểm soát Git commit tương ứng từ G1 đến G6.*  
  > 
  > *Bây giờ, em xin đi sâu vào chi tiết kỹ thuật mà em đã lập trình cho từng bước trong 6 bước này."*

---

### 📍 Chặng 5: Đi Sâu Chi Tiết Từng Bước (Steps 1 Đến 6)

#### 🔹 Bước 1: Nhận diện biến & ràng buộc (Dòng 79 – 106)
* **[Thao tác màn hình]:** Cuộn đến `### Step 1: Input Variable Identification & Constraints`. Chỉ vào bảng Deliverable 7 cột và khối `Step 1 End-of-Turn Block`.
* **[Lời thoại]:**
  > *"Ở **Step 1**, AI được hướng dẫn đọc trực tiếp SRS của tính năng mục tiêu để bóc tách toàn bộ biến đầu vào.*  
  > *Bảng kết quả chuẩn gồm 7 cột: Tên và mã biến, kiểu dữ liệu, bắt buộc hay tùy chọn, bước vi sai $\epsilon$, câu trích dẫn nguyên văn từ SRS, và các giả định nếu đặc tả chưa nêu rõ.*  
  > *Cuối lượt, AI sẽ sinh câu lệnh commit: `feat(<FEATURE_ID>): step 1 - identify input variables and constraints` và tạo Review Checkpoint."*

#### 🔹 Bước 2: Phân vùng tương đương & Kỷ luật Đơn lỗi (Dòng 107 – 159)
* **[Thao tác màn hình]:** Cuộn đến `### Step 2: Partition Each Variable's Domain`. Rê chuột vào mục **2.1 Single-Fault Isolation** và **Bảng ví dụ Password** (dòng 118–127).
* **[Lời thoại]:**
  > *"Sang **Step 2 – Phân vùng tương đương (EP)**, đây là phần em đầu tư rất kỹ về mặt học thuật:*  
  > *• **Nguyên tắc Giả định Đơn lỗi (Single-Fault Isolation - Mục 2.1):** Khi một trường có nhiều điều kiện phức hợp – ví dụ mật khẩu EShop yêu cầu vừa đủ 8 ký tự, vừa có chữ hoa, chữ thường, số và ký tự đặc biệt – skill ép AI phải rã thành từng điều kiện con.*  
  > *Như Thầy Cô thấy ở bảng ví dụ: khi test phân vùng không hợp lệ `PWD-IEP01` (thiếu chữ hoa), thì cả 4 điều kiện còn lại bắt buộc phải đúng chuẩn. Điều này giúp cô lập chính xác nguyên nhân lỗi và chống hiện tượng che giấu lỗi (error masking).*  
  > *• **Bảng đầu ra chuẩn 9 cột (Mục 2.2):** Phân chia rõ ràng 5 phân tầng (Form, Auth, Resource, Rules, Security) kèm lý do cô lập đơn lỗi trước khi bước sang commit Step 2."*

#### 🔹 Bước 3: Phân tích giá trị biên BVA (Dòng 160 – 206)
* **[Thao tác màn hình]:** Cuộn đến `### Step 3: Boundary Value Analysis (ISTQB §4.2.2)`. Chỉ vào các định nghĩa On-point, Off-point, In-point và hai bảng ví dụ biên đóng $[8, 255]$ và biên mở $> 0$.
* **[Lời thoại]:**
  > *"Tại **Step 3 – Phân tích giá trị biên (BVA)**, skill hướng dẫn AI áp dụng chuẩn xác phương pháp **3-Value BVA** với bước vi sai $\epsilon$:*  
  > *• **On-point:** Giá trị nằm chính xác trên đường biên.*  
  > *• **Off-point:** Giá trị nằm sát biên nhất ở phía đối diện.*  
  > *• **In-point:** Giá trị nằm liền kề bên trong phân vùng.*  
  > 
  > *Skill đưa ra định nghĩa toán học rất chuẩn: với biên bao đóng (như độ dài từ 8 đến 255) thì On-point nằm trong vùng hợp lệ; còn với biên mở (như Giá > 0) thì On-point bằng 0 lại là điểm không hợp lệ, và Off-point bằng 1 mới là điểm hợp lệ đầu tiên.*  
  > *Toàn bộ giá trị biên này được định dạng rõ ràng trong bảng BVA trước khi sang commit Step 3."*

#### 🔹 Bước 4: Thiết kế Ca kiểm thử & Thẻ 7 mục (Dòng 208 – 259)
* **[Thao tác màn hình]:** Cuộn đến `### Step 4: Test Case Design`. Chỉ vào quy tắc tổ hợp, bảng Ma trận truy vết 4.1 và cấu trúc **Thẻ đặc tả chi tiết 7 mục (4.2)**.
* **[Lời thoại]:**
  > *"Ở **Step 4 – Thiết kế Test Case**, skill áp dụng 2 chiến lược tổ hợp:*  
  > *• Với ca kiểm thử dương tính: Cho phép ghép nhiều phân vùng hợp lệ VEP để tối ưu số lượng test case.*  
  > *• Với ca kiểm thử âm tính: Bắt buộc chỉ được chứa **duy nhất một phân vùng không hợp lệ IEP hoặc một điểm Off-point sai**, các dữ liệu khác phải giữ ở baseline hợp lệ.*  
  > 
  > *Đặc biệt, ở mục 4.2, skill bắt buộc **100% test case** đều phải có **Thẻ đặc tả chi tiết 7 mục**: từ mã truy vết, công thức mục tiêu, tiền điều kiện, payload dữ liệu, các bước thực hiện, đến **Multi-tier Validation** kiểm tra 4 tầng: Giao diện UI, mã HTTP API, dữ liệu cập nhật trong SQLite DB, và ràng buộc an ninh/nghiệp vụ."*

#### 🔹 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ (Dòng 261 – 297)
* **[Thao tác màn hình]:** Cuộn đến `### Step 5: Traceability & Coverage Verification`. Chỉ vào 3 bảng kiểm chứng: Bảng EP Coverage, Bảng BVA Coverage và Bảng Summary.
* **[Lời thoại]:**
  > *"Đến **Step 5**, skill đóng vai trò như một bộ kiểm định tự động (Verification Engine):*  
  > *Nó tự đối chiếu ngược lại xem 100% các phân vùng VEP, IEP và các điểm biên On/Off đã được bao phủ bởi ít nhất một Test Case hay chưa.*  
  > *Các phân vùng chưa phủ hoặc bị nghẽn do SRS thiếu thông tin sẽ bị gắn cờ `Uncovered` hoặc `Blocked` để kỹ sư kiểm tra lại trước khi thực hiện commit Step 5."*

#### 🔹 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT (Dòng 299 – 333)
* **[Thao tác màn hình]:** Cuộn đến `### Step 6: Defect Hypotheses & AI Gap Analysis`. Rê chuột vào 2 bảng đầu ra: Bảng khoảng trống của AI và Bảng giả thuyết lỗi SUT.
* **[Lời thoại]:**
  > *"Bước cuối cùng là **Step 6 – Phân tích khoảng trống AI và Giả thuyết lỗi SUT**, phục vụ trực tiếp cho Mục 6.3 và Mục 10 (AI Critique) của bài tập:*  
  > *• Skill yêu cầu AI tự phản biện xem mình đã bỏ sót tổ hợp nào, nguyên nhân do đâu (chất lượng prompt, giới hạn token hay đặc tả bị mơ hồ).*  
  > *• Đồng thời, AI đưa ra các **giả thuyết khiếm khuyết tiềm ẩn trên EShop** (ví dụ: client-side chặn nhưng backend API không validate, lỗi so sánh biên off-by-one, hoặc rò rỉ dữ liệu nhạy cảm) để kỹ sư sẵn sàng kiểm thử thực tế trên hệ thống."*

---

### 📍 Chặng 6: Template Báo Cáo Tổng Hợp & Chuyển Cảnh (Dòng 335 – 361)
* **[Thao tác màn hình]:** Cuộn chuột đến cuối file tại `## 5. Full Report Template`. Sau đó thu nhỏ file hoặc chuyển tab sang giao diện Chat Antigravity.
* **[Lời thoại]:**
  > *"Cuối file là mẫu chuẩn hóa để trích xuất toàn bộ kết quả vào Báo cáo chính `Main_Report.md`.*  
  > 
  > *Như vậy, em đã cấu hình một Agent Skill có tính hệ thống rất cao, chuẩn hóa từ lý thuyết ISTQB đến thực hành kiểm thử phần mềm.*  
  > *Bây giờ, em xin chuyển sang màn hình làm việc thực tế để kích hoạt skill này từng bước trên tính năng mẫu: **FR-02 – Đăng nhập & Khóa tài khoản**."*
