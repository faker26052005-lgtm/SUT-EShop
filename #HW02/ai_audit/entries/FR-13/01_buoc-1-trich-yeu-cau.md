# FR-13-01 – FR-13 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:49:59 (UTC+0700) |
| Feature / bước | FR-13 – Bước 1 - trích yêu cầu |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Chào bạn, dưới đây là kết quả thực hiện **BƯỚC 1 – TRÍCH XUẤT YÊU CẦU** dựa trên tài liệu SRS và API bạn đã cung cấp.

### 1. Bảng Trích Xuất Yêu Cầu

| Mã | Nội dung ngắn gọn | Nguồn (Mục) | Loại |
| --- | --- | --- | --- |
| **R1** | Tính tổng doanh thu: Chỉ cộng dồn `total_amount` của các đơn hàng có `status = 'delivered'`. | FR-13 | Nghiệp vụ |
| **R2** | Hiển thị tổng số lượng đơn hàng đã đặt trên hệ thống. | FR-13 | Nghiệp vụ |
| **R3** | Phân hệ Admin chỉ cho phép tài khoản có `role = 'admin'` truy cập. | FR-12 | Truy cập |
| **R4** | API Admin yêu cầu phải có Token JWT hợp lệ. | FR-12 / SEC-02 | Bảo mật |
| **R5** | API Admin phải kiểm tra `role = 'admin'` bên trong Token. | FR-12 / SEC-03 | Bảo mật / Truy cập |
| **R6** | Trạng thái đơn hàng gồm 5 loại: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`. | FR-10 | Input |
| **R7** | Luồng trạng thái hợp lệ: `pending` → `confirmed` → `shipping` → `delivered` (kết thúc) HOẶC `pending`/`confirmed` → `canceled` (kết thúc). | FR-10 | Nghiệp vụ |

---

### 2. Danh Sách Endpoint Liên Quan

| Method | Đường dẫn (Endpoint) | Yêu cầu Token | Cấu trúc Body (JSON) |
| --- | --- | --- | --- |
| `GET` | `/api/admin/orders` | Có (Role: Admin) | *(Không có)* |
| `PUT` | `/api/admin/orders/:id/status` | Có (Role: Admin) | `{"status": "<giá_trị>"}` |
| `POST` | `/api/checkout` | Có (Bearer Token) | `{"total_amount": <number>, "shipping_address": "<string>"}` |

---

### 3. Các Điểm Mơ Hồ / Im Lặng (Cần Làm Rõ)

Để đảm bảo độ bao phủ khi phân tích giá trị biên và miền dữ liệu ở các bước sau, các điểm dưới đây của SRS **CẦN LÀM RÕ**:

* **CẦN LÀM RÕ 1 (Về tính toán số liệu Dashboard):** Vì Dashboard không có API riêng mà tính từ `GET /api/admin/orders`, API này **có phân trang (pagination) không**? Nếu API phân trang (ví dụ mỗi trang 20 đơn), Frontend không thể tự cộng dồn chính xác tổng doanh thu/tổng đơn của toàn hệ thống chỉ với 1 trang.
* **CẦN LÀM RÕ 2 (Về tổng số đơn hàng - R2):** "Tổng số đơn hàng" là đếm *tất cả* các trạng thái (kể cả `canceled` hay bị lỗi), hay chỉ đếm các đơn hàng hợp lệ? Có bao gồm các đơn hàng đã bị xóa (soft-delete) không?
* **CẦN LÀM RÕ 3 (Về giá trị `total_amount`):** Khi checkout, `total_amount` có cho phép giá trị âm (`< 0`), bằng `0`, hoặc số thập phân không? Nếu hệ thống từng bị lỗi lọt đơn hàng âm hoặc bằng `0`, phép cộng tổng doanh thu của Dashboard xử lý thế nào?
* **CẦN LÀM RÕ 4 (Về giới hạn hiển thị Dashboard):** Giá trị tổng doanh thu tối đa mà Dashboard có thể hiển thị trước khi bị tràn kiểu dữ liệu (integer overflow) hoặc vỡ giao diện (UI clipping) là bao nhiêu?

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
```text
TODO (nếu quá dài: lưu vào ai_audit/raw/ và ghi đường dẫn ở đây)
```

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
