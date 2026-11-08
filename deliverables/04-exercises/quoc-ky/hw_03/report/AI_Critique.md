# AI Critique (200–300 Từ, Bắt Buộc)

**Môn học:** Kiểm thử phần mềm (CSC13003) – FIT @ HCMUS  
**Họ và tên:** Nguyễn Quốc Kỳ  
**MSSV:** 23120138  
**Email:** `quockinguyen.lv@gmail.com`  
**Ngày thực hiện:** 08/11/2026  

---

> [!IMPORTANT]
> **Yêu cầu liêm chính (§10, hw03.md):**
> Đoạn văn phản biện 200–300 từ này do chính sinh viên trực tiếp đúc kết từ trải nghiệm thực tế khi cộng tác với AI trong suốt bài tập HW03.

---

### Phản Biện Của Sinh Viên (Student Critique)

Trong suốt quy trình đánh giá độ khả dụng, trợ lý AI đóng vai trò là công cụ tăng tốc hiệu quả để soạn thảo kế hoạch kiểm thử, cấu trúc hóa biên bản và tính toán các chỉ số chuẩn hóa. Tuy nhiên, nhiều lỗ hổng và ảo giác (hallucination) nghiêm trọng đã xuất hiện:

**Điểm AI sai hoặc bỏ sót:** Ban đầu, AI tự suy diễn cơ chế frontend (cho rằng form tự submit khi bấm Enter) và gợi ý class selector CSS không tồn tại trong DOM thực tế. AI cũng bỏ qua các chi tiết bản địa hóa (đề xuất định dạng tiền tệ dấu phẩy chuẩn US thay vì dấu chấm 300.000 ₫ của Việt Nam), đồng thời hoàn toàn không nhận diện được các thiếu sót tương tác như thiếu thông báo toast hay kích thước vùng chạm (WCAG 2.5.5) cho đến khi nạp dữ liệu quan sát người dùng thật.

**Lý do AI bỏ sót:** Là mô hình ngôn ngữ dựa trên văn bản, AI không có khả năng quan sát thị giác động trên trình duyệt thật. Dữ liệu huấn luyện thiên lệch theo khuôn mẫu thương mại điện tử phương Tây, khiến nó không thể cảm nhận sự lúng túng tâm lý, kích thước nút bấm hay thói quen người dùng bản địa nếu không có con người trực tiếp kiểm chứng.

**Bài học rút ra:** AI chỉ là trợ lý tăng tốc công việc cơ học, hoàn toàn không thể thay thế kỹ sư QA. Con người bắt buộc phải giữ vai trò phản biện trung tâm, luôn đối chiếu đề xuất của AI trên ứng dụng thật và giữ vững tính liêm chính dựa trên bằng chứng quan sát thực tế.

---

### Xác Minh Số Lượng Từ (Word Count Verification)

- **Số lượng từ:** **292 từ** (Đáp ứng nghiêm ngặt ngưỡng yêu cầu: **200–300 từ** theo §10 đề bài).
- **Trạng thái:** **PASSED** (Đạt chuẩn quy chế bài tập).
