# Tổng hợp Hướng dẫn Bài tập HW02 – Domain Testing trên EShop

Tài liệu này tổng hợp toàn bộ các yêu cầu, quy trình và giải đáp thắc mắc liên quan đến bài tập HW02 dựa trên các cuộc thảo luận trước đó.

## 1. Yêu cầu chung
- **Mục tiêu:** Áp dụng kỹ thuật **Domain Testing** và **Boundary Value Analysis** vào hệ thống EShop.
- **SUT (Hệ thống cần test):** EShop (có Web và Mobile App). Toàn bộ đặc tả yêu cầu chức năng (FR) nằm trong file `eshop-sut/README.md`.
- **Chiến lược AI-First:** Bắt buộc dùng AI để hỗ trợ từng bước của kỹ thuật test (không dùng một prompt chung chung), sinh viên tự đánh giá và chịu trách nhiệm về kết quả.
- **Hình thức:** Làm cá nhân nhưng hoạt động trong phạm vi nhóm (chia chức năng không trùng lặp, dùng chung repo để báo cáo bug).

## 2. Các bước thực hiện chi tiết

1. **Chọn chức năng (Features):** Mỗi thành viên chọn **4 features** từ 4 Pool (A, B, C, D), đảm bảo không trùng với thành viên khác.
2. **Đọc tài liệu Đặc tả (SRS):** Tham khảo file `eshop-sut/README.md` để nắm rõ logic nghiệp vụ, các ràng buộc và điều kiện của từng chức năng làm cơ sở thiết kế Test Case. Không tự giả định chức năng.
3. **Thiết kế Test Case:** Áp dụng Domain Testing và Boundary Value Analysis (có AI hỗ trợ).
4. **Tìm & Báo cáo Bug:** Chạy thử Test Case trên hệ thống EShop. Nếu hệ thống hoạt động sai lệch so với mô tả trong `README.md` thì đó là Bug. Báo cáo bug này lên GitHub Issues của nhóm kèm ảnh chụp màn hình.
5. **AI Gap Analysis:** Phân tích xem AI đã bỏ sót Test Case hay Bug nào và giải thích lý do.
6. **AI Audit & AI Critique:** Ghi log lại toàn bộ quá trình trao đổi với AI (Audit Report) và viết 1 đoạn 200-300 chữ đánh giá AI (Critique).
7. **Agent Skill (Khuyến khích):** Xây dựng các skill tự động hóa quá trình test và quay video YouTube demo.

## 3. Các điểm quan trọng cần lưu ý

### A. Định nghĩa Bug là gì?
Bug là sự sai lệch giữa **Kết quả thực tế (Actual Result)** trên ứng dụng EShop so với **Kết quả mong đợi (Expected Result)** được quy định trong tài liệu `README.md`.
*Ví dụ:* Tài liệu yêu cầu mật khẩu phải có 8 ký tự, nhưng bạn tạo mật khẩu 7 ký tự mà hệ thống EShop vẫn cho đăng ký thành công => Đây là 1 Bug.

### B. Chiến lược xây dựng Agent Skill
- **Test Design Skill:** Nên **gộp** Domain Testing và Boundary Value Analysis vào chung 1 skill. Vì hai kỹ thuật này bổ trợ trực tiếp cho nhau (sau khi tìm được các phân vùng tương đương thì tiến hành lấy luôn giá trị biên của các phân vùng đó).
- **AI Audit Skill:** Bắt buộc **tách riêng** thành 1 skill/rule độc lập để tự động ghi nhận lại log các đoạn hội thoại, công cụ, thời gian và kết quả của AI.

### C. Quy trình làm việc với Git & GitHub
- **GitHub Issues:** Cả nhóm dùng chung **1 GitHub Repository** để tập trung báo cáo Bug lên mục Issues chung của nhóm.
- **Git Commit Log:** Đây là bài tập cá nhân, bạn có thể tạo branch/thư mục riêng trên repo. Đặc biệt lưu ý: **Mỗi bước test của từng chức năng phải tạo một Git Commit mới.** Cuối cùng, dùng lệnh `git log` để xuất ra file text nộp bài.

## 4. Danh sách các file cần nộp (Trong file `.zip`)

Tên file: `[Mã Số Sinh Viên]_HW02_AI_DomainTesting_[Điểm Tự Đánh Giá].zip`

1. 📄 **Main report (Markdown + PDF):** Báo cáo kết quả Domain Testing và Boundary Value Analysis.
2. 🐛 **Bug report:** Báo cáo Markdown + Link GitHub Issues (có screenshot).
3. 🤖 **AI Reports (Markdown + PDF):** Chứa AI Critique và AI Audit Report.
4. 📜 **Git Commit Log:** File text chứa lịch sử Git Commit cá nhân.
5. 📖 **README.md:** Chứa bảng tự đánh giá (Self-Assessment), số liệu tổng hợp Test (số feature, test case, bug) và link video Demo.
6. 📁 **Khác:** Bất kỳ file bổ trợ hoặc code Agent Skill nào khác.
