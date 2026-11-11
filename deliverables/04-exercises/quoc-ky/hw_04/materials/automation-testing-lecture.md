# TÀI LIỆU TỔNG HỢP: AUTOMATION TESTING (KIỂM THỬ TỰ ĐỘNG)
*Dựa trên bài giảng Software Testing - Bộ môn Công nghệ Phần mềm (FIT - HCMUS)*

---

## 1. Automation Testing là gì?
Automation Testing (Kiểm thử tự động) là quá trình sử dụng các công cụ kiểm thử tự động chuyên dụng để chạy một tập hợp các kịch bản kiểm thử (test cases) một cách tự động.

**Đặc điểm chính:**
* **Thay thế công việc thủ công:** Giúp chạy lại các bộ kiểm thử lặp đi lặp lại vốn rất tốn thời gian nếu làm thủ công.
* **Quy trình tự động hóa:** Dễ dàng nhập dữ liệu kiểm thử vào Hệ thống cần kiểm thử (System Under Test), so sánh kết quả thực tế (actual results) với kết quả mong đợi (expected outcomes) và tự động tạo ra các báo cáo kiểm thử toàn diện.
* **Lợi ích:** Giảm thiểu sự can thiệp của con người, tăng tốc độ viết và chạy lại bộ test, từ đó cải thiện tỷ suất hoàn vốn (ROI) của việc kiểm thử.

---

## 2. Tại sao chúng ta cần Automation Testing?
Việc áp dụng Automation Testing mang lại nhiều lợi ích to lớn trong quy trình phát triển phần mềm:

1. **Cải thiện độ chính xác (Improved Accuracy):** Giảm thiểu lỗi do con người (ví dụ: quên thực hiện một bước nào đó) vì các bài test được thiết kế để tuân thủ nghiêm ngặt một tập hợp các bước đã định trước.
2. **Tăng tốc độ (Increased Speed):** Các bài kiểm thử có thể chạy liên tục, song song 24/7 mà không cần con người can thiệp, giúp giảm đáng kể thời gian kiểm thử tổng thể.
3. **Tính nhất quán (Consistency):** Các test cases được thực thi theo cùng một cách chính xác mỗi lần chạy. Có thể chạy nhiều lần trong ngày giúp phát hiện và giải quyết lỗi nhanh chóng, tăng độ tin cậy của phần mềm.
4. **Tiết kiệm chi phí (Cost Savings):** Mặc dù chi phí ban đầu (thời gian, công nghệ, nhân lực) để thiết lập có thể lớn, nhưng ROI dài hạn về độ chính xác, tốc độ và tính nhất quán là chắc chắn.
5. **Tăng cường độ bao phủ kiểm thử (Enhanced Test Coverage):** Các bộ test tự động có thể được tái sử dụng để chạy trên nhiều sự kết hợp giữa các trình duyệt, thiết bị và hệ điều hành khác nhau (đặc biệt hiệu quả khi kết hợp với môi trường Cloud).
6. **Cải thiện khả năng tái sử dụng (Improved Test Reusability):** Sau khi tạo, các test tự động có thể được lưu trữ và tái sử dụng trên nhiều hệ thống chỉ với một cú click chuột.
7. **Kiểm thử liên tục (Continuous Testing):** Có thể chạy thường xuyên ở bất kỳ giai đoạn nào (phát triển, tích hợp, triển khai) và có thể tích hợp trực tiếp vào pipeline phát triển (CI/CD) để chạy tự động mỗi khi có thay đổi code.

---

## 3. Nên tự động hóa những Test Case nào?

### Các Test Case LÝ TƯỞNG để tự động hóa:
* Các bài kiểm thử dễ xảy ra lỗi do con người.
* Các bài kiểm thử đơn điệu và lặp đi lặp lại.
* Các bài kiểm thử mở rộng sử dụng nhiều bộ dữ liệu (data sets) khác nhau.
* Các bài kiểm thử không thể thực hiện thủ công.
* Các bài kiểm thử thủ công tốn quá nhiều thời gian.
* Các bài kiểm thử có nguy cơ rủi ro cao.
* Các bài kiểm thử yêu cầu thực thi trên nhiều nền tảng phần cứng và phần mềm khác nhau.

### Các Test Case KHÔNG NÊN tự động hóa:
* Các test case có yêu cầu thay đổi liên tục và thường xuyên.
* Các test case được thực thi theo cách ngẫu nhiên (ad-hoc basis) do tính chất không thể đoán trước của chúng.

### Phạm vi áp dụng của Automation Testing:
* **Ngành nghề:** IT, Thương mại điện tử, Tài chính Ngân hàng, Bảo hiểm, Viễn thông, Trò chơi điện tử (Gaming), và Giáo dục... (Bất kỳ ngành nào cần chức năng cao, tính ổn định và trải nghiệm người dùng tốt).
* **Loại ứng dụng (Application Under Tests):** Website, Ứng dụng di động (Mobile), Ứng dụng máy tính (Desktop), và API.
* **Loại kiểm thử (Testing types):** Kiểm thử hồi quy (Regression testing), Kiểm thử chấp nhận (Acceptance testing), Kiểm thử đơn vị (Unit testing), Kiểm thử tích hợp (Integration testing)...
* **Môi trường kiểm thử (Testing environment):** Có thể chạy trên nhiều Hệ điều hành, Trình duyệt và Thiết bị khác nhau.

---

## 4. Tại sao Automation Testing thất bại và Cách khắc phục?

Dưới đây là những nguyên nhân phổ biến khiến việc áp dụng kiểm thử tự động thất bại cùng với các giải pháp tương ứng:

### Vấn đề 1: Thiếu kế hoạch và chiến lược rõ ràng
* **Giải pháp:** Cần xác định rõ phạm vi tự động hóa, chọn đúng công cụ, chuẩn bị dữ liệu kiểm thử, thiết kế & thực thi test case, bảo trì & cập nhật liên tục, cũng như giám sát và báo cáo kết quả định kỳ.

### Vấn đề 2: Không hiểu rõ Ứng dụng cần kiểm thử (Application Under Test)
* **Giải pháp:** 
  * Đọc kỹ các yêu cầu và đặc tả của ứng dụng để hiểu mục đích, chức năng, thành phần và các phụ thuộc.
  * Thực hiện kiểm thử khám phá (Exploratory testing) để làm quen với các tính năng.
  * Làm việc chặt chẽ với đội ngũ phát triển (Dev) để hiểu rõ hơn về thiết kế và cách triển khai.

### Vấn đề 3: Không sử dụng môi trường Đám mây (Cloud Environments)
* **Giải pháp:** Sử dụng Cloud testing để chạy test tự động trên phạm vi rộng các trình duyệt/thiết bị mà không cần đầu tư máy móc vật lý. Điều này mang lại sự linh hoạt, tiết kiệm chi phí, khả năng mô phỏng điều kiện thực tế và hỗ trợ lên lịch chạy test tự động.

### Vấn đề 4: Thiếu sự hợp tác giữa đội ngũ Phát triển (Dev) và Kiểm thử (QA)
* **Giải pháp:** Xác định rõ vai trò và trách nhiệm; cùng nhau lập kế hoạch và tiến hành kiểm thử; sử dụng chung một bộ công cụ (common toolset) để đảm bảo quy trình kiểm thử được tích hợp vào quy trình phát triển.

### Vấn đề 5: Lựa chọn sai công cụ kiểm thử (Wrong tool selection)
Để chọn đúng công cụ, cần xem xét các tiêu chí sau:
1. **Tương thích (Compatibility):** Phù hợp với môi trường phát triển (HĐH, ngôn ngữ lập trình...).
2. **Chức năng (Functionality):** Có đủ tính năng để tạo, chạy, báo cáo và debug test (vd: thế mạnh của tool có khớp với nhu cầu kiểm thử UI web hay không).
3. **Dễ sử dụng (Usability):** Giao diện thân thiện, dễ điều hướng với hướng dẫn rõ ràng.
4. **Khả năng mở rộng (Scalability):** Có thể mở rộng để đáp ứng nhu cầu tương lai khi phần mềm phát triển.
5. **Khả năng tích hợp (Integration):** Tích hợp tốt với các công cụ khác như hệ thống theo dõi lỗi (bug tracking) hay CI/CD.
6. **Hỗ trợ (Support):** Dịch vụ chăm sóc khách hàng tốt, cộng đồng lớn mạnh, tài liệu phong phú.
7. **Bảo mật (Security):** Có biện pháp bảo vệ dữ liệu và đảm bảo kiểm thử diễn ra an toàn.
8. **Danh tiếng (Reputation):** Được đánh giá tốt và khuyên dùng bởi cộng đồng kiểm thử.

---
**Nguồn tham khảo:**
* *https://katalon.com/resources-center/blog/what-is-automation-testing*