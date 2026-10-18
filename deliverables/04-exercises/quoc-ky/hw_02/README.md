# HW02 – Domain Testing & Boundary Value Analysis trên EShop

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Tài liệu đặc tả nguồn (SRS):** [`specs/system_requirements_specification.md`](../../specs/system_requirements_specification.md)  
> **GitHub Repository Nhóm:** [Repository Nhóm 11](https://github.com/ttbhanh/eshop-sut)

---

## 📌 1. Danh sách Chức năng đã lựa chọn (Feature Selection)

Sinh viên lựa chọn 4 chức năng từ 4 Pool độc lập theo quy định mục 5 của đề bài:

| Pool | Mã FR | Tên chức năng | Phân hệ | Lý do lựa chọn cho Domain & BVA |
| :--- | :--- | :--- | :--- | :--- |
| **Pool A** | **FR-02** | **Đăng nhập & Khóa tài khoản** *(Login & Account Lockout)* | Web / API | Kiểm thử miền dữ liệu email/password; Phân tích giá trị biên số lần thử sai ($N \ge 3$) và thời gian tạm khóa ($T = 30s$). |
| **Pool B** | **FR-07** | **Giỏ hàng** *(Shopping Cart)* | Web | Kiểm thử biên số lượng ($0, 1, 2, \text{stock}$); Quy tắc biên chuyển đổi $1 \to 0$ (xóa hay chặn); Tính toán thành tiền ($Price \times Quantity$). |
| **Pool C** | **FR-17** | **Quản lý Mã Giảm Giá** *(Coupon CRUD - Admin)* | Admin / API | Kiểm thử các bất đẳng thức tường minh trong SRS: `min_order_amount >= 0`, `max_uses_per_user >= 1`, `discount_value > 0`, biên `percent` ($0\%, 1\%, 100\%, 101\%$), biên ngày `expired_at`. |
| **Pool D** | **FR-20 & FR-10** | **Hủy đơn hàng theo trạng thái** *(Cancel Order - Mobile)* | Mobile / API | Kiểm thử miền trạng thái hữu hạn (State-based Domain Testing) theo sơ đồ chuyển đổi trạng thái FR-10: cho phép hủy ở `pending`, `confirmed`; cấm hủy ở `shipping`, `delivered`, `canceled`. |

---

## 📊 2. Bảng Tự Đánh Giá Điểm (Self-Assessment Template)

*Căn cứ theo mục 15 của đề bài HW02:*

| STT | Tiêu chí đánh giá | Điểm tối đa | Điểm tự đánh giá | Minh chứng & Ghi chú |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Feature A: FR-02 (Domain + Boundary) | 25 | 25 | Báo cáo chi tiết 6 bước, đầy đủ VEP/IEP đơn lỗi, BVA On/Off/In 30s và 3 lần thử, Test cases & Coverage 100%. |
| **2** | Feature B: FR-07 (Domain + Boundary) | 25 | 25 | Báo cáo chi tiết 6 bước, kiểm thử biên số lượng, chuyển đổi $1 \to 0$, kiểm tra nhãn "Tổng cộng" và tính toán tiền. |
| **3** | Feature C: FR-17 (Domain + Boundary) | 25 | 25 | Báo cáo chi tiết 6 bước, bao phủ toàn bộ 5 ràng buộc số học của Coupon, kiểm thử biên phần trăm và ngày hết hạn. |
| **4** | Feature D: Mobile FR-20 & FR-10 (Domain + Boundary) | 15 | 15 | Báo cáo chi tiết 6 bước kiểm thử State Machine chuyển đổi trạng thái đơn hàng trên Mobile App và Backend API. |
| **5** | Agent Skills & Minh chứng tự động hóa | 10 | 10 | Tích hợp 2 Agent Skills hoàn chỉnh (`domain-testing-value-analysis`, `hw-ai-audit`) kèm Video Demo YouTube. |
| **TỔNG** | | **100** | **100** | |

---

## 📈 3. Tổng Hợp Số Liệu Kiểm Thử (Test Summary Report)

| Chỉ số kiểm thử | Số lượng | Ghi chú |
| :--- | :---: | :--- |
| **Số tính năng kiểm thử (Features)** | 4 | Đại diện cho cả 4 Pools: Web, Admin, Mobile, API |
| **Tổng số Test Cases thiết kế** | 108| Thiết kế theo ISTQB FL v4.0 §4.2.1 & §4.2.2 |
| **Số Test Cases đã thực thi (Executed)** | 2| Chạy trực tiếp trên SUT EShop |
| **Số Test Cases ĐẠT (Passed)** | 2| Hoạt động đúng như SRS mô tả |
| **Số Test Cases THẤT BẠI (Failed)** | 0| Phát hiện sai lệch so với SRS |
| **Số Test Cases BỊ CHẶN (Blocked)** | 0| Phụ thuộc lỗi khác hoặc thiếu cấu hình |
| **Tổng số Lỗi (Bugs) phát hiện & báo cáo** | -- | Báo cáo chi tiết trên Markdown & GitHub Issues |
| **Link Video Demo YouTube** | [YouTube Unlisted Link](https://youtu.be/...) | Demo end-to-end cách dùng skill thiết kế test |

---

## ✅ 4. Danh Mục Kiểm Tra Nộp Bài (Submission Checklist)

*Căn cứ quy định mục 14 của đề tài HW02, trước khi nén nộp bài trên Moodle cần kiểm tra đầy đủ các mục sau:*

- [ ] **Định dạng tên file nén (.zip):** `23120138_HW02_AI_DomainTesting_100.zip`
- [ ] **Báo cáo chính (Main Report):** Có cả file [`Main_Report.md`](Main_Report.md) và file PDF kết xuất tương ứng (`Main_Report.pdf`), bao gồm đầy đủ báo cáo Domain Testing và BVA cho cả 4 chức năng.
- [ ] **Báo cáo lỗi (Bug Report):** Có file [`Bug_Report.md`](Bug_Report.md) và file PDF kết xuất, chứa danh sách chi tiết các bug phát hiện kèm link trực tiếp đến GitHub Issues và ảnh chụp màn hình minh chứng.
- [ ] **Báo cáo kiểm toán AI (AI Audit Report):** Có file [`AI Audit Report.md`](AI%20Audit%20Report.md) và file PDF kết xuất, tuân thủ đúng biểu mẫu `[AI-02]`, log đầy đủ prompt/output và có phần **AI Critique** từ 200–300 từ theo mục 10.
- [ ] **Nhật ký Git Commit (Git Commit Log):** Có file `git_commit_log.txt` chứng minh rõ ràng quy trình làm việc từng bước (1 commit / 1 step cho mỗi chức năng).
- [ ] **Tài liệu README.md:** Chứa đầy đủ thông tin sinh viên, bảng tự đánh giá 100 điểm, số liệu thống kê kiểm thử và đường link Video Demo YouTube.
- [ ] **Thư mục ảnh minh chứng (`screenshots/`):** Chứa toàn bộ ảnh chụp màn hình lỗi trên hệ thống EShop và ảnh chụp màn hình các Issue đã đăng trên GitHub.
- [ ] **Mã nguồn Agent Skills:** Đã lưu trữ và tài liệu hóa cách sử dụng hai skill (`domain-testing-value-analysis` và `hw-ai-audit`).

---

## 📁 5. Điều Hướng Nhanh Trong Thư Mục Nộp Bài

| Tài liệu / Thành phần | Đường dẫn | Mô tả nội dung |
| :--- | :--- | :--- |
| 📄 **Báo cáo chính** | [`Main_Report.md`](Main_Report.md) | Phân tích Domain Testing & BVA cho 4 Features A, B, C, D |
| 🐛 **Báo cáo lỗi SUT** | [`Bug_Report.md`](Bug_Report.md) | Chi tiết các lỗi phát hiện trên EShop, ảnh chụp & GitHub Issue |
| 🤖 **Báo cáo AI Audit** | [`AI Audit Report.md`](AI%20Audit%20Report.md) | Log tương tác AI theo chuẩn `[AI-02]` & Đánh giá AI Critique |
| 📋 **Quy trình thực hiện** | [`WORKFLOW.md`](WORKFLOW.md) | Quy trình 5 giai đoạn hoàn thành bài tập |
| 📜 **Lịch sử Git Commit** | [`git_commit_log.txt`](git_commit_log.txt) | Minh chứng 1 commit cho mỗi bước kiểm thử |
| 🖼️ **Thư mục hình ảnh** | [`screenshots/`](screenshots/) | Ảnh chụp màn hình lỗi và ảnh chụp GitHub Issues |
