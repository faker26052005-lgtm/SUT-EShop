# AI Critique (200–300 từ)

Qua các feature đã phân tích, AI phù hợp nhất với vai trò người tạo bản thảo. Nó phủ nhanh và đều các lớp tương đương cơ bản, ma trận xác thực và phân quyền, chuyển trạng thái, cách ly dữ liệu giữa các người dùng. Nó cũng liệt kê khá đầy đủ những chỗ SRS im lặng, và đó chính là nguồn của phần lớn câu hỏi làm rõ. Ở FR-08 và FR-13, nhiều ca AI viết đã trực tiếp bắt được lỗi thật, như giỏ hàng không bị xóa hay phân quyền hỏng.

Điểm yếu nằm ở ba chỗ:

- Bịa thông tin ngoài SRS: AI tự đặt các biên như 255, 999, MAX_INT, thêm trường như is_active hay order_id, và khẳng định hệ thống có tầng validation dù thực tế không có.
- Phản hồi thiếu nhất quán: AI diễn giải lại SRS rồi áp dụng khác nhau giữa các ca, và đặt kỳ vọng 4xx ở chỗ SRS không nói.
Thiết kế test thiếu thực tế: AI dùng token giả, dựng trạng thái qua DB, không cô lập dữ liệu giữa các ca, bỏ qua nội dung response và sinh nhiều ca trùng.

Cách khắc phục là kiểm soát prompt chặt chẽ hơn thay vì ghi mông lung. Cần bắt trích nguyên văn SRS, cấm đoán edge case khi SRS không nêu, và buộc ghi trạng thái ban đầu cùng side effect ngay từ đầu.

Sau cùng thì em có đề xuất là dùng AI để sinh bản nháp, gợi ý góc nhìn và sàng lọc điểm mơ hồ. Việc chốt kết quả cuối, loại bỏ ca trùng hoặc bịa, chạy thực tế và kết luận bug phải do chúng ta thực hiện