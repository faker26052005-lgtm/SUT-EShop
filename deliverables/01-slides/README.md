# Slide Thuyết Trình Seminar — Chủ Đề T06: API & Contract Testing

> **Môn học:** CS423 / CSC15003 — Kiểm thử Phần mềm (Software Testing) · FIT@HCMUS  
> **Nhóm thực hiện:** Nhóm 11 (Nguyễn Hoàng Anh Tú - Nguyễn Quốc Kỳ - Hà Quốc Kiên)  
> **Thời lượng trình bày:** **30 phút** (Tập trung lý thuyết API & Contract Testing, Demo 3 công cụ & So sánh tổng hợp)

---

## 📌 Tập Tin Slide Trong Thư Mục

| Tên tập tin | Định dạng | Mô tả & Cách sử dụng |
|---|---|---|
| [`presentation.md`](presentation.md) | **Markdown (Marp format)** | Nội dung chi tiết 15 slide chuẩn bị cho buổi seminar 30 phút. Định dạng chuẩn widescreen 16:9, nền trắng chữ đen, font to rõ. |

### 🛠️ Cách Xem Trước & Xuất Sang PowerPoint (.pptx) / PDF
1. **Xem trước (Preview):** Cài extension **Marp for VS Code**, mở file `presentation.md` và nhấn tổ hợp phím `Ctrl + K, V` (hoặc nhấn nút icon preview của Marp ở góc trên bên phải).
2. **Xuất sang PowerPoint (`.pptx`):**
   - Trên VS Code: Nhấn biểu tượng Marp trên thanh công cụ $\rightarrow$ Chọn **Export Slide Deck...** $\rightarrow$ Chọn **PowerPoint document (.pptx)**.
   - Hoặc qua terminal (nếu có Node.js):
     ```bash
     npx @marp-team/marp-cli presentation.md --pptx -o final-presentation-slide.pptx
     ```

---

## ⏱️ Cấu Trúc 15 Slide Hoàn Chỉnh (30 Phút)

Đã bổ sung **Slide 10: Lý thuyết Contract Testing & Vì sao nó cần thiết trong Microservices**; đồng thời dời **Slide 13: Ma trận so sánh 3 công cụ** về phía sau sau khi đã trình bày xong cả 3 công cụ (Postman, Karate, Pact):

| Slide # | Thời lượng | Tiêu đề & Nội dung trọng tâm |
|:---:|:---:|---|
| **1** | 1 phút | **Trang Tiêu Đề:** T06 — API & Contract Testing · Nhóm 11 · GVHD |
| **2** | 1 phút | **Mục Tiêu & Khung Trình Bày (Agenda):** 5 khối nội dung cô đọng trong 30 phút |
| **3** | 2.5 phút | **Tổng Quan API Testing:** Bản chất tầng Business Logic, Shift-Left Testing, 4 trọng tâm kiểm thử (Functional, Schema, Boundary, Auth) |
| **4** | 2 phút | **Giải Phẫu HTTP:** Request/Response anatomy & 3 thành phần ca kiểm thử (Pre-request, Execution, Checkpoints) |
| **5** | 2.5 phút | **Công Cụ 1 — Chuyên Sâu Postman:** Kiến trúc phân cấp Collection, Variable Scopes, JavaScript Scripting Sandbox |
| **6** | 2.5 phút | **Kỹ Thuật Postman Nâng Cao:** **Token Chaining** tự động nối chuỗi JWT và **Data-Driven Testing** với CSV |
| **7** | 2 phút | **Demo Postman & Newman (P1, P2, P3):** Basic requests, Runner SLA $< 200\text{ms}$, và Newman CLI CI/CD HTML Dashboard |
| **8** | 2 phút | **Công Cụ 2 — Karate Framework (K1 & K2):** K1 Fuzzy Matchers (`#number`, `#string`) & K2 Data-driven bắt 2 lỗi thực tế của SUT |
| **9** | 2 phút | **Karate Framework (K3):** Stateful Shopping Workflow có xác thực (Login $\rightarrow$ Token $\rightarrow$ Cart $\rightarrow$ Checkout) |
| 🆕 **10** | 3 phút | **Công Cụ 3 — Lý Thuyết Contract Testing & Vì Sao Nó Cần Thiết:** Vấn nạn **API Drift** trong Microservices, hạn chế của E2E & Mock tĩnh, nguyên lý Decoupled Testing |
| **11** | 2 phút | **Consumer-Driven Contract Testing (Pact C1 & C2):** Quy trình 2 pha: Demo C1 (Consumer tạo contract) & C2 (Provider đối soát trên SUT :3000) |
| **12** | 2 phút | **Demo Pact C3 (Breaking Change):** Mô phỏng backend đổi `price` $\rightarrow$ `unit_price`, Pact phát hiện và chặn lỗi tức thì trong 1 giây |
| 🔄 **13** | 2.5 phút | **Ma Trận So Sánh Tổng Hợp 3 Công Cụ:** Đặt sau khi đã trình bày xong cả 3 công cụ; phân tích 8 tiêu chí so sánh và định vị tình huống sử dụng phù hợp cho từng công cụ |
| **14** | 2 phút | **Ứng Dụng AI Agent Trong Testing:** Sinh test từ OpenAPI 3.0, quy trình Human-in-the-loop, phân tích ưu điểm và giới hạn (Failure Modes) của AI |
| **15** | 1 phút | **Kết Luận & Phiên Hỏi - Đáp (Q&A):** 3 bài học thực tiễn & Phiên hỏi đáp cùng Thầy Cô và cả lớp |
