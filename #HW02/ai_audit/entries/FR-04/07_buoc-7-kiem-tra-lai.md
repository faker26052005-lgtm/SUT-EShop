# FR-04-07 – FR-04 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:45:03 (UTC+0700) |
| Feature / bước | FR-04 – Bước 7 - Kiểm tra lại |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Câu hỏi của bạn vô cùng sắc bén và chạm đúng vào một trong những điểm mù phổ biến nhất của kiểm thử hộp đen (Black-box testing): **Kiểm thử tác dụng phụ (Side-effect testing)** và **Kiểm thử chuyển trạng thái (State Transition)**.

Rà soát lại các test case ở Bước 4, 5 và 6:

* **Các trường không gửi (Email, Role):** Đã được kiểm tra qua `SEC-01`, `SEC-02` và `BL-02`.
* **Bản ghi khác (Cross-user):** Đã được kiểm tra qua `AC-01` (ngăn ghi đè profile user khác).

**TUY NHIÊN, VẪN CÒN THIẾU CÁC KIỂM TRA SAU ĐÂY VỀ TRẠNG THÁI VÀ DỮ LIỆU LIÊN QUAN:**

1. **Dữ liệu liên quan (Related Data):** Sự thay đổi "Địa chỉ giao hàng mặc định" và "SĐT" có gây ảnh hưởng hồi tố (retroactive) đến các đơn hàng đã chốt hay không?
2. **Tính nguyên tử (Atomicity):** Nếu gửi 2 trường hợp lệ và 1 trường lỗi, trạng thái DB sẽ thế nào (lưu một phần hay rollback toàn bộ)?
3. **Mass Assignment vào metadata:** Các trường hệ thống ngoài `email/role` (ví dụ `id`, `created_at`, `status`) có bị ghi đè nếu cố tình gửi lên không?

Dưới đây là các Test Case bổ sung (Side Effects & State Management) để lấp đầy lỗ hổng này:

### Bảng Test Case Bổ Sung: Tác dụng phụ & Quản lý trạng thái (Side Effects)

| ID | Mô tả | Cách dựng và input | Kỳ vọng hệ thống (Trạng thái) | Mã YC (Nguồn) |
| --- | --- | --- | --- | --- |
| **SE-01** | **[Dữ liệu liên quan]** Kiểm tra việc cập nhật "Địa chỉ giao hàng mặc định" không làm thay đổi địa chỉ của các đơn hàng cũ. | **Cách dựng:** User A đã tạo thành công Đơn hàng #123 đang ở trạng thái "Processing" với địa chỉ cũ.<br>**Input:** Gọi `PUT /api/users/me` để đổi `shipping_address` sang địa chỉ mới. | Profile User A lưu địa chỉ mới. **Tuy nhiên**, thông tin giao hàng lưu bên trong Đơn hàng #123 **tuyệt đối không bị thay đổi** (giữ nguyên địa chỉ cũ). | FR-04 (Logic EShop) |
| **SE-02** | **[Tính nguyên tử / Rollback]** Kiểm tra DB không lưu một phần khi request có trường hợp lệ lẫn không hợp lệ. | **Cách dựng:** User A có Name cũ là "A", Phone cũ là "0900000000".<br>**Input:** Gửi body có `name` mới (hợp lệ) nhưng `phone` mới bị sai định dạng (VD: 9 số). | API trả về lỗi 4xx. Trạng thái trong DB bị rollback toàn bộ: `name` **không thay đổi** (vẫn là "A"), `phone` vẫn là số cũ. | R1, R2 |
| **SE-03** | **[Mass Assignment]** Kiểm tra bảo vệ các trường Metadata/System (ngoài `role` và `email`). | **Cách dựng:** User A có `id=5`, `is_active=true`.<br>**Input:** Gửi `PUT /api/users/me` kèm theo payload độc hại: `{"id":999,"is_active":false,"name":"New Name"}`. | API vẫn cập nhật thành công `name`, nhưng các trường `id` và `is_active` trong DB **giữ nguyên không đổi**. | SEC-04 (Mở rộng) |
| **SE-04** | **[Trạng thái thay đổi]** Kiểm tra metadata thời gian (`updated_at`). | **Cách dựng:** DB có User A với `updated_at` là hôm qua.<br>**Input:** Gửi `PUT /api/users/me` cập nhật `name` hợp lệ. | Thành công 200 OK. Trường `updated_at` của bản ghi User A trong DB **tự động chuyển thành thời điểm hiện tại**. (Nếu API lỗi, `updated_at` phải giữ nguyên). | CẦN LÀM RÕ |
| **SE-05** | **[Idempotency - Tính lũy đẳng]** Gửi request cập nhật với dữ liệu GIỐNG HỆT DB hiện tại. | **Cách dựng:** User A đang có `name="Nguyen Van A"`.<br>**Input:** Gửi `PUT /api/users/me` với `name="Nguyen Van A"` (dữ liệu không đổi). | Trả về 200 OK. (*Cần làm rõ với Dev: Hệ thống có bỏ qua update DB để tối ưu performance không, hay vẫn ghi đè và đổi `updated_at`?*) | CẦN LÀM RÕ |

---

**Nhận xét từ QA:**
Việc bổ sung Test Case **SE-01** là cực kỳ quan trọng đối với các hệ thống E-commerce. Rất nhiều bug nghiêm trọng (P0/P1) sinh ra từ việc liên kết khóa ngoại (Foreign Key) thay vì snapshot dữ liệu tĩnh cho các chứng từ (hóa đơn, đơn hàng). Cảm ơn bạn đã phát hiện điểm thiếu sót này trong tư duy phân tích các bước trước.

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
