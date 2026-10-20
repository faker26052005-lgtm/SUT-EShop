# FR-13-02 – FR-13 · Bước 2 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:51:11 (UTC+0700) |
| Feature / bước | FR-13 – Bước 2 - chia lớp tương đương |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 2 – XÁC ĐỊNH BIẾN.
Dựa trên kết quả bước 1 (không thêm thông tin từ bên ngoài), hãy:
1. Lập bảng biến đầu vào: tên biến, vị trí (body/query/path/header), kiểu dữ liệu, ràng buộc SRS nêu rõ, SRS im lặng về điều gì, và biến có thứ tự/số hay không (để áp dụng BVA).
2. Liệt kê biến trạng thái và điều kiện ẩn (ví dụ token, vai trò người dùng, dữ liệu có sẵn) cùng cách dựng trạng thái cho test.
3. Liệt kê những đầu ra cần quan sát để kết luận một test pass hay fail.
Chưa chia lớp, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Bảng Biến Đầu Vào (Input Variables)

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc SRS nêu rõ | SRS im lặng về điều gì | Áp dụng BVA? |
| --- | --- | --- | --- | --- | --- |
| **`Authorization`** | Header | String | Bắt buộc cho các API Admin và Checkout. Phải là `Bearer <token>` chứa JWT hợp lệ, chứa `role = 'admin'` đối với các API Admin (SEC-02, SEC-03, FR-12). | Xử lý khi token hết hạn, token bị chỉnh sửa chữ ký, token thiếu tiền tố `Bearer`, hoặc gửi token của `role != 'admin'`. | **Không** (Biến danh mục/Xác thực) |
| **`:id`** | Path | String / Integer | Định danh duy nhất của đơn hàng cần cập nhật trạng thái (`PUT /api/admin/orders/:id/status`). | Kiểu dữ liệu chính xác (Số nguyên hay UUID/String), cách xử lý khi `:id` không tồn tại, âm, hoặc chứa ký tự đặc biệt. | **Có** *(Nếu `:id` là kiểu số)* |
| **`status`** | Body | String (Enum) | Nhận 1 trong 5 giá trị: `pending`, `confirmed`, `shipping`, `delivered`, `canceled` (FR-10). | Cách xử lý khi truyền giá trị ngoài danh mục (ví dụ: `DELIVERED`, `draft`, `invalid`), truyền chuỗi rỗng `""`, hoặc `null`. | **Không** (Danh mục rời rạc / Enum) |
| **`total_amount`** | Body | Number | Số tiền của đơn hàng khi checkout (`POST /api/checkout`). | Giới hạn nhỏ nhất (min), lớn nhất (max), xử lý số âm (`< 0`), bằng `0`, hoặc số thập phân/không phải số. | **Có** (Miền giá trị số liên tục) |
| **`shipping_address`** | Body | String | Địa chỉ nhận hàng khi checkout (`POST /api/checkout`). | Độ dài tối thiểu/tối đa, xử lý chuỗi rỗng `""`, chỉ chứa khoảng trắng, hoặc chứa ký tự đặc biệt/HTML. | **Có** (Dựa theo độ dài chuỗi - Length) |

---

### 2. Biến Trạng Thái và Điều Kiện Ẩn (State Variables & Setup)


| Biến trạng thái / Điều kiện ẩn | Tác động đến Test | Cách dựng trạng thái cho Test (Setup) |
| --- | --- | --- |
| **Trạng thái Tập hợp Đơn hàng trong DB** | Trực tiếp quyết định giá trị **Tổng doanh thu** và **Tổng số đơn hàng** trên Dashboard. | **1.** Gọi `POST /api/checkout` để khởi tạo các đơn hàng mới với `total_amount` xác định.<br><br>**2.** Gọi `PUT /api/admin/orders/:id/status` chuyển trạng thái đơn theo luồng:<br><br>- Luồng thành công: `pending` → `confirmed` → `shipping` → `delivered`.<br>- Luồng hủy: `pending`/`confirmed` → `canceled`.<br><br>**3.** Xây dựng các kịch bản DB mẫu:<br><br>- DB rỗng (0 đơn hàng).<br>- DB chỉ chứa các đơn chưa `delivered` (`pending`, `confirmed`, `shipping`, `canceled`).<br>- DB chứa kết hợp nhiều đơn ở đầy đủ 5 trạng thái. |
| **Trạng thái Xác thực & Quyền hạn (Auth)** | Quyết định quyền truy cập vào các API Admin. | Khởi tạo các tài khoản test và sinh ra các chuỗi Token tương ứng:<br><br>- Token A: Đăng nhập thành công với tài khoản Admin (`role = 'admin'`).<br>- Token B: Đăng nhập thành công với tài khoản User thường (`role = 'user'`).<br>- Token C: Token đã hết hạn (Expired Token) hoặc bị sửa payload (Invalid Signature). |

---

### 3. Các Đầu Ra Cần Quan Sát (Output Observation)

Để kết luận một Test Case là **PASS** hay **FAIL**, cần kiểm tra đồng thời 3 nhóm đầu ra:

* **A. Mã lỗi HTTP (HTTP Status Code):**
* `200 OK` / `201 Created`: Thao tác cập nhật trạng thái hoặc tạo đơn hàng thành công.
* `400 Bad Request`: Dữ liệu đầu vào sai định dạng (status không hợp lệ, amount sai,...).
* `401 Unauthorized`: Thiếu Header Authorization hoặc Token JWT không hợp lệ/hết hạn.
* `403 Forbidden`: Token hợp lệ nhưng không có quyền Admin (`role != 'admin'`).
* `404 Not Found`: Đường dẫn sai hoặc Order ID không tồn tại trong hệ thống.


* **B. Giá trị tính toán trên Dashboard (Response Body / UI):**
* **Tổng doanh thu (Total Revenue):** Kiểm tra xem số liệu hiển thị có đúng bằng tổng $total\_amount$ của các đơn có `status = 'delivered'` hay không. Xác nhận các đơn có status `pending`, `confirmed`, `shipping`, `canceled` **không** bị cộng dồn vào doanh thu.
* **Tổng số đơn hàng (Total Orders Count):** Kiểm tra xem số liệu có phản ánh chính xác tổng số lượng record đơn hàng trên hệ thống hay không.


* **C. Trạng thái Dữ liệu (Data Integrity):**
* Sau khi thực hiện `PUT /api/admin/orders/:id/status`, gọi `GET /api/admin/orders` để xác nhận trạng thái đơn hàng đã được cập nhật chính xác trong cơ sở dữ liệu và tuân thủ đúng chuyển đổi luồng (State Transition).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
