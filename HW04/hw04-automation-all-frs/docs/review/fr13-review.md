# FR-13 - Review và gap analysis của script do AI sinh

Mục đích: ghi lại chỗ AI viết sai hoặc thiếu và chỗ bạn đã sửa. Phần này vào báo cáo chính và là nguyên liệu cho AI Critique (200-300 từ), cũng là nội dung để kể trong video (ít nhất một chỗ sửa).

## A. AI tự phát hiện khi chạy thử với server giả lập (chưa phải SUT thật)

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Mọi ca so số hiển thị trên dashboard với **giá trị tuyệt đối** (tổng doanh thu tính từ API). | Database đã có đơn cũ nên nếu công thức doanh thu sai, cả các ca "đơn pending không cộng doanh thu" cũng đỏ vì số nền sai, che mất việc quy tắc đó vẫn đúng. | So **chênh lệch** của số hiển thị trước và sau khi tạo đơn (S01-S10). Một ca riêng S13 kiểm tra giá trị tuyệt đối. |
| 2 | Đọc số trên dashboard ngay sau khi mở trang. | Giao diện hiện "0" cho đến khi tải xong danh sách đơn, nên có thể đọc nhầm số 0 (đọc quá sớm). | Helper `waitDashboardLoaded` chờ số đơn khác 0, và `ensureAtLeastOneOrder` đảm bảo DB mới cũng có ít nhất một đơn. |

## B. Sau khi bạn chạy trên SUT thật

Lần chạy đầu trên SUT thật cho kết quả ổn định (11 đạt, 8 đỏ trên cả 3 trình duyệt), và cả 8 test đỏ đều là bug thật của SUT (xem mục D), nên không có chỗ nào phải sửa script vì kết quả sai. Hai điều đáng ghi:

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Cả bộ | Lần chạy đầu toàn bộ test lỗi `ECONNREFUSED` ở cổng 3000: backend chưa bật. Hạn chế: bộ test không tự kiểm tra SUT đã sẵn sàng, nên lỗi môi trường báo như một lỗi test. | AI không có SUT để thử. | Ghi trong hướng dẫn chạy: bật 3 phần SUT (3000, 5173, 5174) trước khi chạy. Có thể bổ sung bước kiểm tra sức khỏe nếu còn thời gian. |
| 2 | S13 | Giá trị tuyệt đối tăng dần qua các lần chạy vì DB tích lũy đơn (số liệu lớn, ví dụ 2148533648, 12891201888). | Đặc thù của feature (dữ liệu dùng chung). | S13 so với tổng tính từ `GET /api/admin/orders` ngay lúc đó, nên không phụ thuộc số cũ. Các ca khác dùng chênh lệch. |

## C. Test không tự động hóa được / chưa tự động hóa (và lý do)

| Test case HW02 | Lý do |
| :-- | :-- |
| DT-02, DT-04, DT-05 của FR-13 (checkout thiếu hoặc sai kiểu `total_amount`, thiếu `shipping_address`) | Giao diện không cho gửi những body này, chỉ làm được ở tầng API. HW02 đã phủ bằng Postman. |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| FR13-BUG-01 Doanh thu hiển thị gấp đôi | S01, S06, S07, S08, S09, S13 | (điền link) | `bugs/screenshots/FR13-BUG-01-*.png` |
| FR13-BUG-02 Đơn đã hủy còn nút "Đánh dấu Đã giao" | S12 | (điền link) | `bugs/screenshots/FR13-BUG-02-*.png` |
| FR13-BUG-03 Admin web không từ chối token của tài khoản thường | A04 | (điền link) | `bugs/screenshots/FR13-BUG-03-*.png` |
