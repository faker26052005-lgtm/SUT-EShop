# AI Critique (200–300 words) – HW04 Automation Testing

**Student:** Nguyen Quoc Ky | **Student ID:** 23120138 | **Class:** 23CLC02  
**Feature Scope:** FR-02 (Login & Lockout), FR-07 (Shopping Cart), FR-17 (Admin Coupon Management)

---

Trong suốt bài tập này, việc cộng tác với AI đã giúp tạo ra bộ khung code ban đầu rất nhanh chóng, nhưng đồng thời cũng bộc lộ rõ những điểm yếu chí mạng của nó trong việc nắm bắt ngữ cảnh và hành vi thực thi. Cụ thể, AI đã tạo ra các kịch bản kiểm thử với nhiều sai sót nghiêm trọng: nó sử dụng chung một tài khoản duy nhất cho tất cả các test case xác thực, dẫn đến chuỗi lỗi sai khi các test case tiêu cực vô tình kích hoạt cơ chế khóa tài khoản 180 giây. AI cũng phụ thuộc vào các CSS selector dễ gãy của Tailwind thay vì sử dụng các thuộc tính ngữ nghĩa ổn định hơn. Thêm vào đó, nó hoàn toàn bỏ qua các hàm dọn dẹp sau khi test tính năng tạo mã giảm giá, làm vi phạm ràng buộc UNIQUE của cơ sở dữ liệu trong các lần chạy tiếp theo. Hơn nữa, AI đã giả định sai rằng trạng thái giỏ hàng sẽ được lưu lại khi tải lại trang, mà không nhận ra Hệ thống đang kiểm thử quản lý dữ liệu giỏ hàng hoàn toàn bằng trạng thái React tạm thời.

Nguyên nhân chính của những điểm mù này là do các mô hình ngôn ngữ lớn tổng hợp code dựa trên các mẫu thống kê chung từ những kho dữ liệu khổng lồ, chứ không thông qua việc phân tích quá trình thực thi động. AI không có khả năng tự đánh giá vòng đời thực thi bên trong hệ thống, các ràng buộc schema SQLite ở phía server, hay các cây trạng thái React cụ thể trừ khi được con người hướng dẫn chi tiết. Nó luôn mặc định một môi trường lý tưởng - điều gần như không bao giờ khớp với các hệ thống phần mềm thực tế vốn luôn chứa lỗi tiềm ẩn.

Trải nghiệm này củng cố một nguyên tắc kỹ thuật cốt lõi: chỉ nên coi AI như một trợ lý thực tập cần được giám sát nghiêm ngặt, tuyệt đối không được xem nó như một nguồn chân lý luôn đúng. Một bộ tự động hóa kiểm thử có giá trị cao không nằm ở số lượng code sinh ra, mà nằm ở sự cô lập dữ liệu, quản lý trạng thái nhất quán và các phép xác nhận có độ bền vững cao. Để cộng tác hiệu quả, kỹ sư phần mềm phải là người làm chủ kiến trúc hệ thống, chủ động rà soát từng dòng code AI tạo ra để đối chiếu với Tài liệu Đặc tả Yêu cầu Hệ thống, và áp dụng các tiêu chuẩn chất lượng một cách khắt khe.
