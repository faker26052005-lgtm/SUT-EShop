# FR-13-07 – FR-13 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 21:06:03 (UTC+0700) |
| Feature / bước | FR-13 – Bước 7 - Kiểm tra lại |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả rà soát toàn bộ bộ Test Case (các Bước 4, 5, 6) nhằm phát hiện và bổ sung các kịch bản kiểm thử **tác động lây lan (Side Effects)** và **thay đổi trạng thái ẩn** sau các thao tác ghi.

---

### I. Phân Tích Các Trạng Thái Có Thể Bị Thay Đổi Sau Thao Tác Ghi

Sau một thao tác ghi (Tạo mới đơn hàng qua Checkout `POST`, Cập nhật trạng thái đơn qua Admin `PUT`), ngoài các trường dữ liệu được gửi trực tiếp trong Request Body, hệ thống có thể bị thay đổi ở 4 nhóm trạng thái sau:

1. **Gán giá trị mặc định cho trường không gửi (Default Unsubmitted Fields):**
* Khi `POST /api/checkout` (chỉ gửi `total_amount` và `shipping_address`), hệ thống có tự động gán `status = 'pending'` và sinh mã `:id` duy nhất hay không?


2. **Tính cô lập giữa các bản ghi (Record Isolation):**
* Khi cập nhật trạng thái đơn hàng $A$ (`PUT /api/admin/orders/A/status`), trạng thái và số tiền của các đơn hàng $B, C$ trong DB có bị biến đổi bất ngờ hay không?


3. **Tác động lên chỉ số tổng hợp toàn hệ thống (Dashboard Aggregate State):**
* Khi tạo mới đơn hàng (ở dạng `pending`), **Tổng số đơn hàng** trên Dashboard có tăng $+1$ không, trong khi **Tổng doanh thu** phải **giữ nguyên** (chỉ cộng đơn `delivered`)?
* Khi thao tác ghi bị LỖI (trả về $4xx$), đảm bảo toàn bộ số liệu Dashboard và trạng thái đơn trong DB **không bị biến đổi lây lan**.


4. **Tính lặp lại / Idempotency:**
* Khi gọi `PUT /api/admin/orders/:id/status` với trạng thái trùng lặp giá trị hiện tại (ví dụ đơn đang `confirmed`, gửi tiếp `confirmed`), hệ thống xử lý thế nào?



---

### II. Kết Quả Rà Soát Bộ Test Case Hiện Có

* **Đã có:**
* `BL-06` đã kiểm tra việc không làm biến đổi các trường khác (`total_amount`, `shipping_address`) trên *cùng 1 bản ghi* khi cập nhật trạng thái.
* `BL-01`, `BL-02`, `BL-03` đã kiểm tra việc chuyển trạng thái thành `delivered` làm tăng tổng doanh thu Dashboard.


* **Chưa có (Cần bổ sung ngay):**
* Chưa có test kiểm tra việc tạo đơn mới (`POST /api/checkout`) làm tăng **Tổng số đơn** nhưng **KHÔNG** làm tăng **Tổng doanh thu**.
* Chưa có test kiểm tra **Tính cô lập giữa các bản ghi** (thao tác trên Đơn A không ảnh hưởng Đơn B).
* Chưa có test kiểm tra **Giá trị tự động gán mặc định** của đơn hàng mới khởi tạo (`status = 'pending'`).
* Chưa có test kiểm tra **Tính toàn vẹn dữ liệu khi thao tác ghi bị thất bại** (Failed Write Side-Effect).
* Chưa có test kiểm tra **Cập nhật lại trạng thái trùng với trạng thái hiện tại** (Idempotency).

---

### III. Bổ Sung Các Test Case Tác Động Trạng Thái Ẩn & Side Effects

| ID | Mô tả | Cách dựng và input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **BL-08** | Kiểm tra các trường mặc định tự gán khi tạo đơn mới (Unsubmitted Fields) | **Input:** `POST /api/checkout` với `{"total_amount": 300000, "shipping_address": "456 Nguyen Hue"}`.<br><br>**Check:** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Xác nhận đơn mới được tự động gán `status = 'pending'` và sinh mã `:id` duy nhất)* | R6, FR-10, Mục 4.3 |
| **BL-09** | Tác động của việc tạo đơn mới lên số liệu Dashboard (Aggregate State) | **Setup:** Ghi nhận Tổng số đơn \(N\) và Tổng doanh thu \(R\) hiện tại trên Dashboard.<br><br>**Input 1:** `POST /api/checkout` với `{"total_amount": 500000, "shipping_address": "789 Tran Hung Dao"}`.<br><br>**Input 2:** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Tổng số đơn tăng thành \(N + 1\); Tổng doanh thu giữ nguyên là \(R\) vì đơn mới có status = 'pending')* | R1, R2, R6, FR-10, FR-13 |
| **BL-10** | Tính cô lập dữ liệu giữa các bản ghi đơn hàng khác nhau (Record Isolation) | **Setup DB:** Có 2 đơn hàng: Đơn 101 (`pending`, `100000`) và Đơn 102 (`pending`, `200000`).<br><br>**Input 1:** `PUT /api/admin/orders/101/status` Body: `{"status": "confirmed"}`.<br><br>**Input 2:** `GET /api/admin/orders` | `2xx và dữ liệu được lưu đúng`<br><br>*(Đơn 101 chuyển sang `confirmed`; Đơn 102 vẫn giữ nguyên `status = 'pending'` và `total_amount = 200000`)* | R6, FR-10 |
| **BL-11** | Kiểm tra số liệu và trạng thái không bị biến đổi khi thao tác ghi bị LỖI (Failed Write Side-Effect) | **Setup DB:** Đơn 103 (`pending`, `150000`). Ghi nhận Doanh thu \(R\) và Tổng đơn \(N\).<br><br>**Input 1:** `PUT /api/admin/orders/103/status` Body: `{"status": "delivered"}` *(Vi phạm luồng)*.<br><br>**Input 2:** `GET /api/admin/orders` | `4xx và dữ liệu không đổi`<br><br>*(Đơn 103 vẫn ở trạng thái `pending`; Doanh thu giữ nguyên \(R\), Tổng số đơn giữ nguyên \(N\))* | R1, R2, R6, R7, FR-10, FR-13 |
| **BL-12** | Cập nhật trạng thái trùng với trạng thái hiện tại của đơn hàng (Idempotency Check) | **Setup DB:** Đơn 104 đang có `status = "confirmed"`.<br><br>**Input:** `PUT /api/admin/orders/104/status` Body: `{"status": "confirmed"}` | `CẦN LÀM RÕ`<br><br>*(SRS im lặng về việc có chấp nhận cập nhật lại trạng thái giống hệt hay trả lỗi 4xx)* | R6, R7, FR-10 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
