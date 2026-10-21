# Kịch Bản Thực Hiện Live Demo Áp Dụng Skill `domain-testing-value-analysis`

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên:** Nguyễn Quốc Kỳ – **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Tính năng lựa chọn Demo:** `FR-17: Quản lý Mã Giảm Giá (Coupon CRUD - Admin)`  
> **Thời lượng dự kiến:** 3.5 – 4.5 phút  
> **Mục tiêu:** Thể hiện tương tác hai chiều (Human-in-the-Loop), năng lực Bloom-AI G9.2 (Apply) & G9.3 (Analyze), và minh chứng 1 Git commit cho mỗi bước.

---

## 🛠️ 1. Thiết Lập Môi Trường Trước Khi Bấm Quay

1. **Giao diện IDE:** Chia đôi màn hình:
   * **Bên trái (70%):** Cửa sổ Chat của Antigravity (hoặc giao diện tương tác với AI).
   * **Bên phải (30%):** Cửa sổ Terminal mở sẵn tại thư mục repository bài tập (`SUT-EShop`).
2. **Trạng thái Git:** Kiểm tra `git status` đảm bảo working tree sạch sẽ.
3. **Môi trường chạy ngầm:** EShop Backend (:3000) và Frontend Admin (:5174 hoặc :5173) đang chạy bình thường.

---

## 🎬 2. Kịch Bản Chi Tiết Từng Bước (Lời Thoại & Thao Tác)

### 📍 PHÂN ĐOẠN 0: MỞ ĐẦU PHIÊN DEMO (00:00 – 00:20)
* **[Thao tác màn hình]:** Mở cửa sổ chat mới, chuẩn bị dán Prompt khởi động.
* **[Lời thoại]:**
  > *"Sau khi đã giới thiệu về kiến trúc của skill, bây giờ em xin thực hiện một phiên Live Demo tương tác thực tế giữa kỹ sư kiểm thử và AI Agent trên tính năng **FR-17: Quản lý Mã Giảm Giá (Coupon CRUD - Admin)**.*  
  > *Em sẽ bắt đầu bằng prompt kích hoạt skill ở chế độ Step-by-Step."*
* **[Prompt gửi cho AI]:**
  ```text
  Hãy kích hoạt skill domain-testing-value-analysis và thực hiện Bước 1 cho tính năng FR-17 (Quản lý Mã Giảm Giá - Coupon CRUD).
  ```

---

### 📍 BƯỚC 1: TRÍCH XUẤT BIẾN & CAN THIỆP SAI SỐ $\epsilon$ (00:20 – 01:00)
* **[Thao tác màn hình]:** AI xuất bảng 7 cột nhận diện 8 biến đầu vào. Dùng chuột chỉ vào biến `discount_value` đang có $\epsilon = 1$.
* **[Lời thoại]:**
  > *"Ở Bước 1, AI đã trích xuất đầy đủ 8 biến đầu vào cùng trích dẫn từ tài liệu SRS. Tuy nhiên, khi kiểm tra kỹ thuật, em phát hiện ở biến `discount_value`, AI đang mặc định bước vi sai $\epsilon = 1$.*  
  > *Trong thực tế thương mại điện tử, tỷ lệ chiết khấu phần trăm có thể là số thập phân như 2.5% hoặc 9.99%. Do đó, em sẽ đóng vai trò Human-in-the-Loop để yêu cầu AI tinh chỉnh bước vi sai này xuống $0.01$."*
* **[Prompt phản hồi / Can thiệp kỹ thuật]:**
  ```text
  Kết quả Bước 1 rất tốt. Tuy nhiên tại biến discount_value, hãy điều chỉnh bước vi sai epsilon từ 1 thành 0.01 để bao phủ các trường hợp chiết khấu phần trăm dạng số thập phân.
  ```
* **[AI phản hồi]:** AI cập nhật bảng với $\epsilon = 0.01$ và hiển thị câu lệnh gợi ý commit.
* **[Thao tác Terminal]:** Chuyển sang cửa sổ Terminal gõ lệnh commit:
  ```bash
  git commit -m "feat(FR-17): step 1 - identify variables and input domain constraints"
  ```
* **[Lời thoại]:**
  > *"Sau khi AI cập nhật chuẩn xác sai số $\epsilon = 0.01$, em nghiệm thu Bước 1 và thực hiện Git commit đầu tiên."*

---

### 📍 BƯỚC 2: PHÂN VÙNG TƯƠNG ĐƯƠNG (EP) & RÀ SOÁT (01:00 – 01:40)
* **[Thao tác màn hình]:** Gõ lệnh chuyển bước:
  ```text
  Proceed to Step 2
  ```
* **[Thao tác màn hình]:** AI xuất bảng phân vùng 5 tầng (VEP/IEP). Rê chuột vào các dòng phân vùng không hợp lệ (IEP).
* **[Lời thoại]:**
  > *"Tại Bước 2, AI tiến hành phân vùng tương đương. Điểm em đánh giá cao là AI tuân thủ nghiêm ngặt nguyên tắc **Single-Fault Isolation**: khi kiểm thử phân vùng sai như mã rỗng hoặc enum không hợp lệ, các trường khác đều được giữ ở Baseline hợp lệ chuẩn.*  
  > *Bảng phân loại 5 tầng này đã bao phủ trọn vẹn cả dữ liệu form, phân quyền và nghiệp vụ. Em đồng ý và thực hiện commit Bước 2."*
* **[Thao tác Terminal]:**
  ```bash
  git commit -m "feat(FR-17): step 2 - define equivalence partitions and single-fault baselines"
  ```

---

### 📍 BƯỚC 3: PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) & RÀ SOÁT (01:40 – 02:15)
* **[Thao tác màn hình]:** Gõ lệnh chuyển bước:
  ```text
  Proceed to Step 3
  ```
* **[Thao tác màn hình]:** AI xuất bảng 3-Value BVA với các cột On-point, Off-point, In-point.
* **[Lời thoại]:**
  > *"Ở Bước 3, AI xác định chính xác các điểm biên 3-Value: ví dụ với tỷ lệ phần trăm là $0\%, 0.01\%, 100\%, 100.01\%$, và ngưỡng đơn tối thiểu là $0$ ₫ (On-point hợp lệ) và $-1$ ₫ (Off-point không hợp lệ).*  
  > *Kết quả hoàn toàn chính xác theo định nghĩa toán học của ISTQB. Em thực hiện commit Bước 3."*
* **[Thao tác Terminal]:**
  ```bash
  git commit -m "feat(FR-17): step 3 - boundary value analysis with On/Off/In point classification"
  ```

---

### 📍 BƯỚC 4: THIẾT KẾ TEST CASES & FEEDBACK BẢO MẬT/CSDL (02:15 – 03:15)
* **[Thao tác màn hình]:** Gõ lệnh chuyển bước:
  ```text
  Proceed to Step 4
  ```
* **[Thao tác màn hình]:** AI xuất danh sách Test Cases. Dừng lại đọc lướt để đưa feedback can thiệp.
* **[Lời thoại]:**
  > *"Tại Bước 4, AI sinh ra ma trận ca kiểm thử. Sau khi rà soát, em nhận thấy AI mới chỉ tập trung vào kiểm tra giao diện và API thông thường, nhưng còn thiếu ca kiểm thử bảo mật phân quyền (khi User thường cố tình gọi API Admin theo chuẩn SEC-03) và chưa có câu lệnh kiểm tra trực tiếp trạng thái trong CSDL SQLite.*  
  > *Em sẽ gửi feedback yêu cầu AI bổ sung."*
* **[Prompt phản hồi / Can thiệp kỹ thuật]:**
  ```text
  Hãy bổ sung thêm 1 kịch bản kiểm thử bảo mật phân quyền (khi User thông thường gọi API Admin tạo coupon -> phải bị từ chối 403 Forbidden theo SEC-03), đồng thời đảm bảo trong mục Multi-tier Validation của các thẻ test case phải có câu lệnh SQL SELECT kiểm tra trạng thái bảng coupons.
  ```
* **[AI phản hồi]:** AI bổ sung kịch bản `TC_FR17_23` (Role Escalation) và cập nhật câu lệnh SQL vào mục Multi-tier Validation.
* **[Thao tác Terminal]:** Chuyển sang Terminal gõ lệnh commit:
  ```bash
  git commit -m "feat(FR-17): step 4 - design test cases with EP and BVA traceability"
  ```
* **[Lời thoại]:**
  > *"AI đã tiếp thu feedback rất chính xác, bổ sung ca kiểm thử bảo mật và cập nhật đầy đủ tiêu chí xác thực đa tầng. Em tiến hành commit Bước 4."*

---

### 📍 BƯỚC 5: MA TRẬN TRUY VẾT & ĐỘ BAO PHỦ (03:15 – 03:45)
* **[Thao tác màn hình]:** Gõ lệnh chuyển bước:
  ```text
  Proceed to Step 5
  ```
* **[Thao tác màn hình]:** AI xuất 3 bảng kiểm chứng ma trận độ bao phủ đạt 100%.
* **[Lời thoại]:**
  > *"Ở Bước 5, ma trận truy vết xác nhận 100% phân vùng VEP, IEP và các điểm biên On/Off đã được ánh xạ đến ít nhất một ca kiểm thử. Không có phân vùng nào bị bỏ sót hay bị nghẽn. Em thực hiện commit Bước 5."*
* **[Thao tác Terminal]:**
  ```bash
  git commit -m "feat(FR-17): step 5 - coverage analysis and traceability verification"
  ```

---

### 📍 BƯỚC 6: AI GAP ANALYSIS & GIẢ THUYẾT LỖI SUT (03:45 – 04:15)
* **[Thao tác màn hình]:** Gõ lệnh chuyển bước:
  ```text
  Proceed to Step 6
  ```
* **[Thao tác màn hình]:** AI xuất bảng tự phản biện và danh sách giả thuyết lỗi trên EShop SUT.
* **[Lời thoại]:**
  > *"Bước 6 là bước tự phân tích của AI. AI tự chỉ ra điểm ban đầu suýt bỏ sót là trường hợp phần trăm thập phân và đề xuất giả thuyết lỗi thực tế: backend có thể bị lỗi làm tròn tiền hoặc không kiểm tra chặt chẽ khi giá trị giảm lớn hơn tổng đơn hàng.*  
  > *Đây là tư liệu quý giá để đưa vào Báo cáo AI Critique và làm cơ sở săn bug trên SUT. Em thực hiện commit cuối cùng của quy trình."*
* **[Thao tác Terminal]:**
  ```bash
  git commit -m "feat(FR-17): step 6 - ai gap analysis and exploratory defect hypotheses"
  ```

---

### 📍 TỔNG KẾT PHIÊN DEMO & MINH CHỨNG GIT LOG (04:15 – 04:45)
* **[Thao tác Terminal]:** Tại Terminal, gõ lệnh kiểm tra lịch sử commit:
  ```bash
  git log -n 6 --oneline
  ```
* **[Thao tác màn hình]:** Rê chuột vào 6 dòng commit thẳng hàng vừa tạo.
* **[Lời thoại]:**
  > *"Như Thầy Cô thấy trên màn hình Terminal, lệnh `git log` hiển thị rõ ràng 6 commit liên tiếp tương ứng với 6 bước làm việc vừa rồi.*  
  > *Quy trình này chứng minh em đã làm chủ hoàn toàn công cụ AI: từ việc ra lệnh, thẩm định sai số, gửi feedback điều chỉnh cho đến nghiệm thu kết quả.*  
  > *Sau đây, em sẽ lấy một ca kiểm thử vừa sinh ra ở Bước 4 để chạy trực tiếp trên hệ thống EShop thực tế."*

---

## ⚡ 3. Bảng Tra Nhanh Prompt & Lệnh Terminal (Quick Cheat Sheet)

| Bước | Lệnh gửi AI trong Chat | Lệnh gõ trong Terminal |
| :---: | :--- | :--- |
| **Bắt đầu** | `Hãy kích hoạt skill domain-testing-value-analysis và thực hiện Bước 1 cho tính năng FR-17 (Quản lý Mã Giảm Giá - Coupon CRUD).` | *(Chuẩn bị terminal)* |
| **Sửa Step 1** | `Kết quả Bước 1 rất tốt. Tuy nhiên tại biến discount_value, hãy điều chỉnh bước vi sai epsilon từ 1 thành 0.01 để bao phủ các trường hợp chiết khấu phần trăm dạng số thập phân.` | `git commit -m "feat(FR-17): step 1 - identify variables and input domain constraints"` |
| **Sang Step 2** | `Proceed to Step 2` | `git commit -m "feat(FR-17): step 2 - define equivalence partitions and single-fault baselines"` |
| **Sang Step 3** | `Proceed to Step 3` | `git commit -m "feat(FR-17): step 3 - boundary value analysis with On/Off/In point classification"` |
| **Sửa Step 4** | `Proceed to Step 4`<br/>*(Sau đó feedback):* `Hãy bổ sung thêm 1 kịch bản kiểm thử bảo mật phân quyền (khi User thông thường gọi API Admin tạo coupon -> phải bị từ chối 403 Forbidden theo SEC-03), đồng thời đảm bảo trong mục Multi-tier Validation của các thẻ test case phải có câu lệnh SQL SELECT kiểm tra trạng thái bảng coupons.` | `git commit -m "feat(FR-17): step 4 - design test cases with EP and BVA traceability"` |
| **Sang Step 5** | `Proceed to Step 5` | `git commit -m "feat(FR-17): step 5 - coverage analysis and traceability verification"` |
| **Sang Step 6** | `Proceed to Step 6` | `git commit -m "feat(FR-17): step 6 - ai gap analysis and exploratory defect hypotheses"` |
| **Tổng kết** | *(Chuyển sang Terminal)* | `git log -n 6 --oneline` |
