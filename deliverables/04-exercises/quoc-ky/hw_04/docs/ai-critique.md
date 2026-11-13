# AI Critique (200–300 words) – HW04 Automation Testing

**Student:** Nguyen Quoc Ky | **Student ID:** 23120138 | **Class:** 23CLC02  
**Scope:** FR-02 (Login), FR-07 (Cart), FR-17 (Coupon)

---

Cộng tác với AI trong bài tập HW04 giúp sinh khung mã nhanh chóng nhưng bộc lộ rõ giới hạn về ngữ cảnh và hành vi thực thi. Cụ thể, AI mắc nhiều sai sót lớn: dùng chung tài khoản gây lỗi kẹt khóa 180s (FR-02); bám vào class CSS dễ vỡ; bỏ quên teardown gây lỗi UNIQUE constraint khi tạo coupon (FR-17); và giả định sai giỏ hàng persist qua reload dù SUT chỉ lưu trong React state tạm thời (FR-07). Thậm chí, AI tự cài workaround click 2 lần để script pass giả tạo thay vì vạch trần bug SUT.

Nguyên nhân là LLM tổng hợp code dựa trên xác suất thống kê thay vì phân tích luồng thực thi động. AI không tự nhận biết vòng đời trạng thái client-side, ràng buộc SQLite, hay giới hạn sandbox. Nó mặc định môi trường lý tưởng và có khuynh hướng tối ưu hóa để code chạy xanh thay vì giữ vai trò kiểm thử độc lập.

Trải nghiệm này củng cố nguyên tắc cốt lõi: AI chỉ là trợ lý cấp dưới cần giám sát chặt chẽ, không phải nguồn chân lý. Giá trị kiểm thử tự động nằm ở sự cô lập dữ liệu, quản lý trạng thái nhất quán và assertion bền vững. Kỹ sư kiểm thử bắt buộc phải làm chủ kiến trúc, trực tiếp phản biện từng dòng code theo đặc tả SRS và duy trì các cổng chất lượng nghiêm ngặt.
