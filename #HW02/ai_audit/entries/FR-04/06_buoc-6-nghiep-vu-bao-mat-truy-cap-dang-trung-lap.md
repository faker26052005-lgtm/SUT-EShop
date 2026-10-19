# FR-04-06 – FR-04 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:42:02 (UTC+0700) |
| Feature / bước | FR-04 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 6 – Các Test Case dành riêng cho Kiểm thử Nghiệp vụ (Business Logic), Bảo mật (Security) và Truy cập (Access Control), dựa trên các yêu cầu R3, R4, R5, R7 và các quy trình nghiệp vụ tổng thể.

Các test case này tập trung vào **trạng thái hệ thống (Database)** và **luồng dữ liệu (Data flow)** thay vì chỉ nhìn vào mã lỗi HTTP như ở Bước 4 và 5.

### Bảng Test Case Nghiệp vụ, Bảo mật và Truy cập

| ID | Mô tả | Cách dựng và input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AC-01** | Kiểm tra tính độc lập dữ liệu (Đảm bảo người dùng chỉ cập nhật hồ sơ của chính mình). | **Cách dựng:** Trong DB có 2 user: User A và User B. Lấy token hợp lệ của User A.<br>**Input:** Dùng token User A gọi `PUT /api/users/me` với dữ liệu hợp lệ. | Hồ sơ của User A được cập nhật đúng với input. Hồ sơ của User B trong DB **không bị thay đổi** (không bị ghi đè nhầm). | R4 |
| **SEC-01** | Kiểm tra bảo mật trường `email` (Ngăn chặn bypass qua API). | **Cách dựng:** DB có User A với email `old@email.com`.<br>**Input:** Dùng token User A, gọi API kèm theo body: `{"email":"hacked@email.com"}` (các trường khác hợp lệ). | Dù API trả về mã lỗi 4xx hay 2xx (Cần làm rõ), thì dữ liệu `email` của User A trong DB **phải giữ nguyên** là `old@email.com`. | R3 |
| **SEC-02** | Kiểm tra bảo mật trường `role` (Ngăn chặn leo thang đặc quyền - Privilege Escalation). | **Cách dựng:** DB có User A với role `user`.<br>**Input:** Dùng token User A, gọi API kèm theo body: `{"role":"admin"}` (các trường khác hợp lệ). | Dù API trả về mã lỗi 4xx hay 2xx (Cần làm rõ), thì dữ liệu `role` của User A trong DB **phải giữ nguyên** là `user`. | R5, SEC-06 |
| **SEC-03** | Kiểm tra cơ chế chống XSS (Cross-Site Scripting) khi lưu và hiển thị. | **Cách dựng:** DB có User A.<br>**Input:** Gửi `PUT /api/users/me` với `name` là `<script>alert('XSS')</script>`. Sau đó gọi `GET /api/users/me` để lấy lại dữ liệu, hoặc giả lập load lên UI. | Dữ liệu đầu ra/hiển thị phải được escape an toàn (ví dụ thành `&lt;script&gt;...`), tuyệt đối không được render dưới dạng DOM/thực thi mã JS (không dùng `innerHTML`). | R7, SEC-04 |
| **BL-01** | Kiểm tra tính toàn vẹn dữ liệu từ đầu đến cuối (End-to-end Data Integrity). | **Cách dựng:** DB có User A.<br>**Input:** Gửi `PUT /api/users/me` thành công với thông tin mới. Ngay sau đó, dùng token gọi `GET /api/users/me`. | Dữ liệu trả về từ API `GET` phải khớp hoàn toàn 100% với dữ liệu vừa cập nhật ở API `PUT` (Name, Phone, Address). | R1 |
| **BL-02** | Kiểm tra khả năng cập nhật từng phần (Partial Update). | **Cách dựng:** DB có User A với đầy đủ Name, Phone, Address.<br>**Input:** Chỉ gửi 1 trường lên API (VD: `{"phone":"0912345678"}`). Bỏ trống 2 trường còn lại trong JSON body. | CẦN LÀM RÕ (Hệ thống sẽ giữ nguyên Name, Address cũ và chỉ cập nhật Phone, hay sẽ báo lỗi/xóa trắng Name và Address vì không truyền?). | R1 |

*(Lưu ý: Các test case về Invalid Token (không có token, sai chữ ký, hết hạn) đã được bao phủ hoàn toàn bởi các test case DT-20, DT-21, DT-22 ở Bước 4, đáp ứng yêu cầu R6).*

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
