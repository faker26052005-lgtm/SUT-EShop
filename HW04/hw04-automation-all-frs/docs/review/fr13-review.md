# FR-13 - Review và gap analysis của script do AI sinh

Mục đích: ghi lại chỗ AI viết sai hoặc thiếu và chỗ bạn đã sửa. Phần này vào báo cáo chính và là nguyên liệu cho AI Critique (200-300 từ), cũng là nội dung để kể trong video (ít nhất một chỗ sửa).

## A. AI tự phát hiện khi chạy thử với server giả lập (chưa phải SUT thật)

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Mọi ca so số hiển thị trên dashboard với **giá trị tuyệt đối** (tổng doanh thu tính từ API). | Database đã có đơn cũ nên nếu công thức doanh thu sai, cả các ca "đơn pending không cộng doanh thu" cũng đỏ vì số nền sai, che mất việc quy tắc đó vẫn đúng. | So **chênh lệch** của số hiển thị trước và sau khi tạo đơn (S01-S10). Một ca riêng S13 kiểm tra giá trị tuyệt đối. |
| 2 | Đọc số trên dashboard ngay sau khi mở trang. | Giao diện hiện "0" cho đến khi tải xong danh sách đơn, nên có thể đọc nhầm số 0 (đọc quá sớm). | Helper `waitDashboardLoaded` chờ số đơn khác 0, và `ensureAtLeastOneOrder` đảm bảo DB mới cũng có ít nhất một đơn. |

## B. Sau khi bạn chạy trên SUT thật (điền khi làm)

| # | Test | AI sai hoặc thiếu gì (selector dễ vỡ, assertion yếu, thiếu edge case, wait không ổn định...) | Vì sao AI bỏ sót (prompt, giới hạn của mô hình, đặc thù của feature) | Bạn đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | | | | |

## C. Test không tự động hóa được / chưa tự động hóa (và lý do)

| Test case HW02 | Lý do |
| :-- | :-- |
| DT-02, DT-04, DT-05 của FR-13 (checkout thiếu hoặc sai kiểu `total_amount`, thiếu `shipping_address`) | Giao diện không cho gửi những body này, chỉ làm được ở tầng API. HW02 đã phủ bằng Postman. |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| | | | |
