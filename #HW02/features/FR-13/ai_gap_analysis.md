# FR-13 – Dashboard & Quản lý đơn hàng · AI gap analysis

## Bước 9: AI gap analysis

### 9.1 So sánh bộ test của AI và bộ cuối cùng

| Chỉ số | Số lượng / Nhận xét |
| :--- | :--- |
| **Test case AI sinh ra (thô)** | **~78 ca** (Gồm 43 ca Domain, 18 ca BVA, và 17 ca tích hợp/nghiệp vụ ở bước 6, 7). Số lượng rất cồng kềnh. |
| **Test case bộ cuối (con người chốt)** | **35 ca** (Đã tối ưu hóa, gộp các ca trùng lặp và loại bỏ các ca kiểm thử biên lý thuyết không thực tế). |
| **Trùng lặp và Dư thừa do AI tạo ra** | AI tự vẽ ra các điểm biên giả định cho độ dài chuỗi (255) và giới hạn số nguyên (`:id` = 2,147,483,647) rồi sinh ra hàng loạt test case BVA (BV-07 đến BV-18). Con người đã thẳng tay loại bỏ vì SRS không hề quy định, việc test giới hạn này là vô nghĩa trong Black-box testing. |
| **Bao phủ Test Case (Coverage)** | AI làm rất tốt việc phủ kín ma trận chuyển đổi trạng thái (State Transition) và các kịch bản phân quyền (Role-based). Con người gần như giữ nguyên cấu trúc này đưa vào file `domain_testing_2.md`. |

### 9.2 Đánh giá chất lượng sinh Test Case của AI (Đối chiếu)

Mức khớp: **Tốt** (AI làm chuẩn, giữ nguyên), **Một phần** (AI có làm nhưng bị cồng kềnh/lý thuyết), **Yếu** (AI suy diễn sai).

| Nhóm Test / Vấn đề | Đánh giá AI | Ghi chú / Hành động của người test |
| :--- | :--- | :--- |
| **Luồng chuyển trạng thái (State Machine)** | **Rất Tốt** | AI nhận diện chính xác luồng đi của FR-10 (`pending` → `confirmed` → `shipping` → `delivered`/`canceled`), sinh đủ các ca nhảy bước, đi lùi, và trạng thái kết thúc (TRANS-01 đến TRANS-10). |
| **Kiểm tra Token & Phân quyền (BAC)** | **Rất Tốt** | AI đã sinh đúng các ca test lấy token `user` gọi API `admin`. Nhờ kịch bản này mà bộ test đã bắt được lỗi nghiêm trọng FR-13-BUG-02. |
| **Kiểm thử giá trị biên (BVA)** | **Một phần** | AI chọn đúng biến `total_amount` để làm BVA. Tuy nhiên, AI lại máy móc làm BVA cho cả `:id` và `shipping_address` dựa trên giả định CSDL (`VARCHAR(255)`, `MAX_INT`). Con người đã lọc bỏ. |
| **Side-effects (Số liệu Dashboard)** | **Tốt** | Ở bước 6 và 7, AI đã tự liên kết được logic: chuyển trạng thái thành `delivered` thì `Total Revenue` phải tăng, còn tạo đơn mới thì `Total Orders` tăng. |

### 9.3 Điểm nghẽn của AI và nguyên nhân gốc rễ

| # | Vấn đề / Bug thực tế | Hạn chế của AI | Nhóm nguyên nhân |
| :-: | :--- | :--- | :--- |
| 1 | **BUG-01: Backend thiếu Validate Schema (tạo đơn vô tội vạ)** | AI đã thiết kế ĐÚNG các ca test truyền sai kiểu (boolean) hoặc thiếu trường (DT-02, DT-04, DT-05). Tuy nhiên, AI mặc định kỳ vọng là `4xx` (tin rằng dev đã rào lỗi). Thực tế chạy ra `200 OK` tạo thành Bug High. | AI chỉ dự đoán kỳ vọng dựa trên lý thuyết SRS, thiếu kinh nghiệm thực chiến về thói quen "quên validate" của dev. |
| 2 | **BUG-02: Broken Access Control (BAC)** | Tương tự BUG-01, AI đưa ra kịch bản AC-02, AC-05 cực kỳ chuẩn xác, nhưng dự đoán kỳ vọng là `4xx`. Khi chạy thực tế ra `200 OK` tiết lộ lỗ hổng Critical. | Giới hạn chung của AI khi sinh test case tĩnh. Nhưng bù lại kịch bản AI sinh ra rất có giá trị. |
| 3 | **Ảo tưởng về giới hạn hệ thống (Hallucination on limits)** | AI tự cho rằng `:id` tối đa là 2 tỷ, địa chỉ tối đa là 255 ký tự. | Bản năng "lấp đầy khoảng trống" của LLM khi dùng kỹ thuật 3-value BVA nhưng thiếu thông số biên trên. |

### 9.4 AI sai hoặc bịa (Nguyên liệu cho AI Critique)

*   **Bịa thông số kỹ thuật để làm BVA:** AI đưa ra con số `2,147,483,647` cho `total_amount` và `:id`. Vi phạm nghiêm ngặt yêu cầu "Chỉ dùng thông tin trong SRS". Nếu SRS im lặng về biên trên, AI chỉ nên test biên dưới (quanh mức 0, 1) thay vì tự bịa biên trên.
*   **Ca kiểm thử "Idempotency" (BL-12 - Cập nhật trạng thái trùng):** Ở Bước 7, AI tự nghĩ ra ca test gửi lại trạng thái `confirmed` cho một đơn đã `confirmed`. Mặc dù đây là một tư duy System Design tốt, nhưng nó vượt quá phạm vi của một bài Black-box Testing dựa trên SRS cơ bản.

### 9.5 Các ca AI làm xuất sắc (Đáng ghi nhận)

Khác với FR-08, ở FR-13 này AI đã thể hiện sự tiến bộ rõ rệt và làm xuất sắc các điểm sau:
1.  **Phát hiện mâu thuẫn/thiếu sót của SRS rất sắc bén:** Nhóm `CẦN LÀM RÕ` của AI khớp 100% với *Phụ lục A* của bạn. AI nhận diện ngay việc SRS quên cấm số âm, đơn 0 đồng, địa chỉ rỗng và không nói rõ Enum có phân biệt hoa thường hay không.
2.  **Ma trận rủi ro phân quyền:** AI không chỉ test việc "Thiếu token", mà còn test "Có token nhưng sai Role", "Có token đúng Role nhưng sai chữ ký". Đây là tư duy bảo mật (Security Testing) rất chuyên nghiệp.
3.  **Cross-feature Testing:** AI biết kết hợp FR-10 (Trạng thái đơn), FR-12 (Phân quyền) và FR-13 (Dashboard) thành các ca kiểm thử luồng nghiệp vụ (BL) liên hoàn thay vì test rời rạc.

### 9.6 Kết luận & Đề xuất cải tiến Prompt

**Kết luận:** 
Trong FR-13, AI đóng vai trò như một kỹ sư kiểm thử cốt lõi (Core Tester) rất tốt. Kịch bản của AI sinh ra đã trực tiếp giúp "săn" được 2 Bug bự (Thiếu Validation và Phân quyền hỏng). Khoảng cách duy nhất giữa AI và con người ở đây là **sự tối ưu hóa** (con người biết vứt bỏ những ca test dư thừa/lý thuyết) và **sự đối chiếu thực tế** (AI dự đoán 4xx, con người chạy ra 200).

**Điều chỉnh Prompt cho các Feature tiếp theo:**
*   **Tạo giới hạn để giảm việc halluciante:** Thêm rule ở Bước 5 (BVA): *"Nếu SRS không quy định rõ biên trên hoặc biên dưới (Max/Min), TUYỆT ĐỐI KHÔNG tự giả định theo chuẩn Database (như 255 hay MAX_INT). Hãy ghi là 'Không có biên trên/dưới xác định để test'."*
*   **Quy tắc rút gọn (Deduplication Rule):** Thêm rule khi tổng hợp Test Case: *"Nếu một ca test BVA có input trùng hoàn toàn với một ca test Domain, hãy loại bỏ ca Domain và chỉ giữ lại ca BVA để tránh phình to bộ test suite."*