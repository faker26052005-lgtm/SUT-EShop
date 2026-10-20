# FR-20-02 – FR-20 · Bước 2 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:33:50 (UTC+0700) |
| Feature / bước | FR-20 – Bước 2 - chia lớp tương đương |
| Chat / phiên | FR20 |
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

Bảng dưới đây liệt kê các biến đầu vào của hệ thống được trích xuất từ API và UI, phục vụ cho việc kiểm thử tính năng Đăng ký và Hủy đơn hàng.

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc từ SRS | Điểm SRS im lặng / Chưa rõ | Có thứ tự/số (để áp dụng BVA)? |
| --- | --- | --- | --- | --- | --- |
| **`name`** (Họ Tên) | UI Form / API Body | Chuỗi (String) | Bắt buộc nhập (có ký hiệu `*`). | Giới hạn độ dài min/max; có cho phép số/ký tự đặc biệt không; xử lý khoảng trắng. | **Có** (Độ dài chuỗi). |
| **`email`** | UI Form / API Body | Chuỗi (type="email") | Bắt buộc nhập; đúng định dạng (`user@domain.com`); duy nhất. | Giới hạn độ dài max; phân biệt hoa/thường; khoảng trắng. | **Có** (Độ dài chuỗi, các phần tử cấu thành định dạng email). |
| **`password`** | UI Form / API Body | Chuỗi (type="password") | Bắt buộc nhập; tối thiểu 8 ký tự; chứa $\ge1$ chữ hoa, $\ge1$ chữ thường, $\ge1$ số, $\ge1$ ký tự đặc biệt (@, $, !, %, *, ?, &). | Giới hạn độ dài max; có cho phép khoảng trắng không. | **Có** (Độ dài chuỗi - biên dưới là 8; số lượng các loại ký tự). |
| **`confirm_password`** | UI Form (Không có trong API) | Chuỗi (type="password") | Bắt buộc nhập; phải khớp hoàn toàn với `password`. | Hành vi khi paste (dán) dữ liệu vào trường này. | **Không** (Chỉ so sánh khớp/không khớp). |
| **`id`** (Mã đơn hàng) | API Path (`/:id/cancel`) | Số (Integer) | Phải là đơn hàng tồn tại và thuộc về user đang gọi. | Hành vi khi truyền chữ, ký tự đặc biệt, mã đơn âm. | **Không** (Chỉ mang tính phân loại: hợp lệ / không hợp lệ / không tồn tại). |

---

### 2. Biến Trạng Thái, Điều Kiện Ẩn và Cách Dựng Trạng Thái

Các tính năng này phụ thuộc rất lớn vào ngữ cảnh, quyền truy cập và dữ liệu đã có sẵn trong hệ thống.

* **Biến trạng thái 1: Sự tồn tại của Email trong hệ thống**
* *Điều kiện:* Email dùng để đăng ký chưa từng tồn tại (Hợp lệ) / Đã tồn tại (Không hợp lệ).
* *Cách dựng trạng thái (Setup):* Dùng API `POST /api/register` đăng ký trước một email, hoặc dùng tài khoản có sẵn theo đặc tả (`test@domain.com`, `admin@eshop.com`) để làm dữ liệu "đã tồn tại".


* **Biến trạng thái 2: Trạng thái của Đơn hàng (Order State Machine)**
* *Điều kiện:* Để user hủy thành công, trạng thái phải là `pending` hoặc `confirmed`. Nếu là `shipping`, `delivered`, hoặc `canceled`, hệ thống phải từ chối.
* *Cách dựng trạng thái (Setup):*
1. Gọi API `POST /api/checkout` bằng User Token để tạo đơn hàng mới (trạng thái mặc định là `pending`).
2. Dùng tài khoản Admin gọi `GET /api/admin/orders` lấy danh sách đơn, sau đó gọi `PUT /api/admin/orders/:id/status` với body `{"status": "..."}` để ép đơn hàng sang các trạng thái `confirmed`, `shipping`, `delivered`, `canceled` phục vụ cho từng test case.




* **Điều kiện ẩn: Token xác thực & Phân quyền (Authorization & Authentication)**
* *Điều kiện:* Hành động Hủy đơn hàng yêu cầu JWT token hợp lệ của chính chủ đơn hàng. Admin API yêu cầu JWT token có `role='admin'`.
* *Cách dựng trạng thái (Setup):* Gọi API `POST /api/login` với tài khoản User (để lấy Token hủy đơn) hoặc tài khoản Admin (để lấy Token đổi trạng thái đơn).



---

### 3. Các Đầu Ra Cần Quan Sát (Pass/Fail Criteria)

Để kết luận một test case là Pass hay Fail, cần quan sát đồng thời các lớp sau:

**A. Mức UI/Frontend:**

* **Đăng ký:**
* Dấu `*` hiển thị đúng ở các trường bắt buộc.
* Trường Mật khẩu và Xác nhận mật khẩu hiển thị dạng dấu chấm đen/sao (không lộ plaintext).
* *Thành công:* Ứng dụng tự động chuyển hướng (redirect) về màn hình Đăng nhập.
* *Thất bại:* Thông báo lỗi xuất hiện **trên nút submit** (không hiển thị bên dưới nút).


* **Lịch sử đơn hàng:**
* Trạng thái đơn hàng hiển thị tiếng Việt rõ ràng, có phân biệt màu sắc.
* Nút "Hủy đơn" có hiển thị/bị ẩn đi/disable đúng theo trạng thái đơn không (tùy thuộc vào UI design thực tế).



**B. Mức API / Giao tiếp mạng (Network):**

* **HTTP Status Code:** Trả về `200 OK` cho thao tác thành công, và các mã lỗi tương ứng (như `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`) cho thao tác thất bại.
* **Response Body:** JSON trả về có đúng cấu trúc mong đợi không (VD: `{"message": "User registered successfully", "id": 1}`). Chứa nội dung lỗi (Error Message) phù hợp.

**C. Mức Database / Backend State:**

* **Đăng ký:**
* Cơ sở dữ liệu tạo ra một record User mới.
* Mật khẩu **phải được mã hóa (hashed)**, tuyệt đối không lưu dạng plaintext (kiểm tra DB hoặc tài liệu kiến trúc).


* **Hủy đơn hàng:**
* Bản ghi đơn hàng trên hệ thống thực sự được đổi sang trạng thái `canceled`.
* Xác minh lại bằng cách dùng User gọi API `GET /api/orders/:id` hoặc `GET /api/orders/my-orders`, trả về trạng thái phải là đã hủy.

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
