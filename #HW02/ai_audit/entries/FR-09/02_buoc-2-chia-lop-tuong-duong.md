# FR-09-02 – FR-09 · Bước 2 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:37:17 (UTC+0700) |
| Feature / bước | FR-09 – Bước 2 - chia lớp tương đương |
| Chat / phiên | FR09 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 2 – XÁC ĐỊNH BIẾN.
Dựa trên kết quả bước 1 (không thêm thông tin từ bên ngoài), hãy:
1. Lập bảng biến đầu vào: tên biến, vị trí (body/query/path/header), kiểu dữ liệu, ràng buộc SRS nêu rõ, SRS im lặng về điều gì, và biến có thứ tự/số hay không (để áp dụng BVA).
2. Liệt kê biến trạng thái và điều kiện ẩn (ví dụ token, vai trò người dùng, dữ liệu có sẵn) cùng cách dựng trạng thái cho test.
3. Liệt kê những đầu ra cần quan sát để kết luận một test pass hay fail.
Chưa chia lớp, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả BƯỚC 2 - Xác định biến, dựa hoàn toàn vào các yêu cầu đã trích xuất từ Bước 1.

### 1. Bảng Biến Đầu Vào (Input Variables)

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc SRS nêu rõ | SRS im lặng về (Mơ hồ) | Áp dụng BVA (Có/Không) |
| --- | --- | --- | --- | --- | --- |
| `code` | Body | String | Phải có trong CSDL, `is_active = 1`, còn hạn, chưa hết lượt dùng. | Phân biệt chữ hoa/thường, độ dài tối đa, chuỗi rỗng (`""`), khoảng trắng dư thừa, ký tự đặc biệt. | **Không** (chỉ có Boundary về độ dài chuỗi, nhưng SRS không định nghĩa độ dài). |
| `total_amount` | Body | Number | Phải `>= min_order_amount` của mã đó. | Chấp nhận số `0`, số âm, số thập phân, hoặc giới hạn giá trị tối đa (max value) hay không. | **Có** (giới hạn dựa trên `min_order_amount` và giá trị `0`). |
| `user_id` | Body | Number | Số lần đã dùng mã của user này `< max_uses_per_user`. | Truyền số `< 0`, số `0`, hoặc truyền `user_id` không khớp với user trong JWT token (Bảo mật). | **Có** (giới hạn quanh số `0`, nhưng chủ yếu dùng cho Domain Testing). |
| `Authorization` | Header | String (Bearer) | Phải là JWT token hợp lệ (SEC-02, C4). | Token hết hạn, sai định dạng, hoặc header bị bỏ trống. | **Không** (đúng hoặc sai logic). |

---

### 2. Biến Trạng Thái & Điều Kiện Ẩn (State Variables & Hidden Conditions)

Đây là các dữ liệu nền (background data) cần được thiết lập trước khi gọi API `/api/apply-coupon`.

* **Tài khoản người dùng (User & JWT Token):**
* *Mô tả:* API yêu cầu token hợp lệ để định danh người dùng.
* *Cách dựng trạng thái:* Gọi `POST /api/register` để tạo user mới -> Gọi `POST /api/login` với email/password vừa tạo để lấy JWT Token và `user_id` hợp lệ.


* **Trạng thái của Mã giảm giá trong CSDL (Coupon Record):**
* *Mô tả:* Các thuộc tính của mã như `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`, `is_active` quyết định logic tính toán.
* *Cách dựng trạng thái:* Dùng tài khoản Admin (admin@eshop.com) gọi `POST /api/login` lấy token Admin -> Gọi `POST /api/admin/coupons` để tạo sẵn các mã kiểm thử (như SAVE10, BIGBUY, VIP100, EXPIRED) với các cấu hình mong muốn.


* **Lịch sử sử dụng mã của người dùng (Usage History):**
* *Mô tả:* Hệ thống phải đếm xem user này đã dùng mã này bao nhiêu lần để so sánh với `max_uses_per_user`.
* *Cách dựng trạng thái:* Dùng một user hợp lệ, gọi thành công API `/api/apply-coupon` (và API thanh toán nếu hệ thống chỉ đếm khi đã chốt đơn - *điều này thực tế cần BA làm rõ, nhưng trong phạm vi tài liệu, ta giả định có thể giả lập số lượt dùng*).


* **Thời gian hệ thống (System Time):**
* *Mô tả:* Dùng để so sánh với `expired_at` (C2).
* *Cách dựng trạng thái:* Tạo mã có `expired_at` là ngày trong quá khứ, ngày hiện tại, và ngày tương lai để kiểm thử, thay vì phải chỉnh đồng hồ của server.



---

### 3. Đầu Ra Cần Quan Sát (Observable Outputs)

Để kết luận một test case là Pass hay Fail, ta cần quan sát các đầu ra sau từ API `/api/apply-coupon`:

1. **HTTP Status Code:**
* Mong đợi `200 OK` cho các trường hợp tính toán thành công.
* Cần quan sát các mã lỗi (VD: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`) đối với các trường hợp vi phạm điều kiện (dù SRS chưa chốt mã lỗi cụ thể).


2. **Cấu trúc JSON phản hồi (Body Response):**
* Khi thành công: Phải trả về JSON chứa `discount_amount` và `final_amount` được tính toán chính xác theo công thức (R6, R7, R8).
* Khi thất bại: Phải trả về thông báo lỗi (Error message) tương ứng với điều kiện bị vi phạm (C1-C5).


3. **Khía cạnh Bảo mật (Security Observables):**
* SEC-05: Khi nhập các payload SQL Injection vào trường `code` (VD: `' OR 1=1--`), API không được sập (HTTP 500) hoặc trả về lỗi cú pháp SQL, mà phải xử lý như một mã không tồn tại.
* SEC-04: (Quan sát ngoài lề nếu test End-to-End) Mã chứa payload XSS (VD: `<script>`) khi nhập vào không được thực thi trên UI. Tuy nhiên, ở mức độ API, ta quan sát xem API có báo lỗi định dạng hay vẫn chấp nhận lưu/xử lý chuỗi này.

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
