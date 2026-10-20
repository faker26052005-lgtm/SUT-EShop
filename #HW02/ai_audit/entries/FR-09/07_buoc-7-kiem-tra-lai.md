# FR-09-07 – FR-09 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:49:32 (UTC+0700) |
| Feature / bước | FR-09 – Bước 7 - Kiểm tra lại |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Sau khi rà soát lại toàn bộ test case ở các Bước 4, 5 và 6, tôi nhận thấy các test case hiện tại **mới chỉ tập trung vào việc kiểm tra Input (đầu vào) và Output trực tiếp (phản hồi JSON, HTTP Status)**.

Tuy nhiên, trong các thao tác ghi (POST, DELETE), hệ thống sẽ có những **Side Effects (Tác động lề / Thay đổi trạng thái ngầm)** lên cơ sở dữ liệu mà người dùng không gửi lên, hoặc ảnh hưởng đến các lần gọi API sau đó. **Các test case trước đó CHƯA kiểm tra những khía cạnh này.**

Dưới đây là các Test Case bổ sung (Tiền tố **SE - Side Effect**) để kiểm tra sự thay đổi trạng thái ngầm dựa theo đúng tài liệu SRS:

### Bảng Test Case: Kiểm tra thay đổi trạng thái (Side Effects)


| ID | Mô tả trạng thái ngầm cần kiểm tra | Cách dựng & Input | Kỳ vọng (Theo SRS / Cần làm rõ) | Yêu cầu |
| --- | --- | --- | --- | --- |
| **SE-01** | **Thời điểm trừ lượt sử dụng:** Gọi API `/api/apply-coupon` có làm tăng "Số lần đã dùng" ngay lập tức không? | **Cách dựng:** Dùng User 1, gọi `/api/apply-coupon` với mã "SAVE10" (`max_uses = 1`) thành công (lần 1). Sau đó tiếp tục gọi lại API này với cùng body (lần 2). | **CẦN LÀM RÕ:** SRS ghi API này để "Tính toán tổng tiền". Nếu API này chỉ tính toán, lần 2 vẫn phải trả về 200 OK. Nếu API này đồng thời chốt luôn lượt dùng, lần 2 phải trả về 4xx (vi phạm C5). | C5 |
| **SE-02** | **Trạng thái mặc định khi tạo mới:** Khi Admin tạo mã, trường `is_active` (không có trong body request) có tự động gán bằng `1` để mã dùng được ngay không? | **Cách dựng:**<br>1. Admin gọi `POST /api/admin/coupons` tạo mã "TET2025" (body chuẩn như SRS).<br>2. User gọi `/api/apply-coupon` với mã "TET2025" ngay lập tức. | HTTP 200 OK ở bước 2. Điều này chứng minh hệ thống đã ngầm tự động set `is_active = 1` lúc tạo mã, thỏa mãn điều kiện C1. | C1, Admin API |
| **SE-03** | **Tính duy nhất của mã (Duplicate Code):** Tạo một mã giảm giá bị trùng lặp `code` với mã đang có trong CSDL. | **Cách dựng:** Admin gọi `POST /api/admin/coupons` để tạo mã "SAVE10" (mã này đã tồn tại theo DB mẫu trong SRS). | HTTP 4xx (Bad Request / Conflict). Dữ liệu không đổi. Hệ thống không được phép lưu 2 mã trùng tên, vì sẽ gây lỗi logic cho điều kiện C1 khi User gọi API áp dụng. | C1, Admin API |
| **SE-04** | **Trạng thái xóa mã (Hard Delete vs Soft Delete):** Sau khi Admin xóa mã, mã đó có thực sự biến mất (hoặc vô hiệu hóa) đối với User không? | **Cách dựng:**<br>1. Admin gọi `DELETE /api/admin/coupons/:id` (xóa mã ID của BIGBUY).<br>2. User gọi `/api/apply-coupon` với mã "BIGBUY". | HTTP 4xx ở bước 2. Dữ liệu không đổi (báo lỗi không tồn tại do vi phạm C1). | C1, Admin API |


**Lý do các test này quan trọng đối với Black-box testing:**
Vì ta không được nhìn vào Source Code hay Database, cách duy nhất để biết một thao tác "Ghi" (Tạo/Áp dụng) có làm sai lệch trạng thái ngầm hay không là **thực hiện một thao tác "Đọc" hoặc "Áp dụng" ngay sau đó** để quan sát sự thay đổi (như cách SE-01 và SE-02 sử dụng kết quả của API này làm tiền đề cho API kia).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
