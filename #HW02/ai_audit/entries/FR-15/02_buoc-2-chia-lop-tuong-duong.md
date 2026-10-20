# FR-15-02 – FR-15 · Bước 2 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:54:57 (UTC+0700) |
| Feature / bước | FR-15 – Bước 2 - chia lớp tương đương |
| Chat / phiên | Fr15 |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 2 – XÁC ĐỊNH BIẾN.
Dựa trên kết quả bước 1 (không thêm thông tin từ bên ngoài), hãy:
1. Lập bảng biến đầu vào: tên biến, vị trí (body/query/path/header), kiểu dữ liệu, ràng buộc SRS nêu rõ, SRS im lặng về điều gì, và biến có thứ tự/số hay không (để áp dụng BVA).
2. Liệt kê biến trạng thái và điều kiện ẩn (ví dụ token, vai trò người dùng, dữ liệu có sẵn) cùng cách dựng trạng thái cho test.
3. Liệt kê những đầu ra cần quan sát để kết luận một test pass hay fail.
Chưa chia lớp, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là kết quả thực hiện **BƯỚC 2 – XÁC ĐỊNH BIẾN** để chuẩn bị cho việc áp dụng kỹ thuật phân tích giá trị biên (BVA) và phân vùng tương đương.

### 1. Bảng biến đầu vào (Input Variables)

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc rõ ràng (SRS) | SRS im lặng / Mơ hồ | Có thứ tự/số (để áp dụng BVA)? |
| --- | --- | --- | --- | --- | --- |
| **name** | Body | String | Bắt buộc, tối đa 255 ký tự. | Có cho phép trùng tên? Có được toàn khoảng trắng? Có cấm ký tự đặc biệt? | Có (Dựa trên độ dài chuỗi: 0, 1, 255, 256 ký tự). |
| **price** | Body | Number | Bắt buộc, số dương (> 0). | Là số nguyên hay thập phân? Giới hạn giá trị lớn nhất (Max) là bao nhiêu? | Có (Dựa trên giá trị số: ≤0, >0, cận Max). |
| **category_id** | Body | ID/Integer | Bắt buộc, phải chọn từ danh sách có sẵn. | Nếu truyền ID không tồn tại hoặc ID đã bị xóa thì sao? | Không (Chỉ có tính hợp lệ: Tồn tại / Không tồn tại). |
| **description** | Body | String | Không nhắc đến. | Có bắt buộc không? Giới hạn độ dài bao nhiêu? | Có (Dựa trên độ dài chuỗi, nếu BA xác nhận giới hạn). |
| **imageUrl** | Body | String | Không nhắc đến. | Có bắt buộc không? Có validate định dạng URL không? Giới hạn độ dài? | Có (Dựa trên độ dài chuỗi, định dạng regex). |
| **id** (Sản phẩm) | Path | ID/Integer | Không đề cập rõ, nhưng là tham số để định danh khi Xem/Sửa/Xóa. | Định dạng ID? Xử lý sao nếu ID không tồn tại? | Không (Chỉ xét tính tồn tại: Có / Không / Định dạng sai). |
| **search** | Query | String | Tìm kiếm sản phẩm theo tên. | Phân biệt chữ hoa chữ thường không? Giới hạn độ dài từ khóa? Tìm gần đúng hay chính xác? | Có (Dựa trên độ dài chuỗi tìm kiếm). |

---

### 2. Biến trạng thái, điều kiện ẩn và Cách dựng (State Variables & Hidden Conditions)

Đây là các yếu tố môi trường hoặc dữ liệu cần có sẵn trước khi gửi API request.

* **Trạng thái Xác thực & Phân quyền (Authentication & Authorization):**
* *Biến trạng thái:* Trạng thái đăng nhập và Role của người dùng (`Authorization: Bearer <token>`).
* *Các điều kiện:* Token Admin hợp lệ, Token User thường hợp lệ, Token sai/hết hạn, Không có Token.
* *Cách dựng:* Gọi `POST /api/login` với tài khoản `admin@eshop.com` để lấy token Admin, hoặc `test@eshop.com` để lấy token User thường. Truyền token vào header khi test.


* **Dữ liệu Danh mục (Category Data):**
* *Biến trạng thái:* Sự tồn tại của danh mục trong hệ thống.
* *Các điều kiện:* Có ít nhất một `category_id` hợp lệ để gán cho sản phẩm.
* *Cách dựng:* Dùng token Admin gọi `POST /api/categories` để tạo một danh mục mồi (dummy category) và lấy ID trả về.


* **Dữ liệu Sản phẩm (Product Data):**
* *Biến trạng thái:* Sự tồn tại của sản phẩm trong hệ thống (cần cho API Xem, Sửa, Xóa).
* *Các điều kiện:* Có sẵn sản phẩm mục tiêu (target product) và sản phẩm khác (other products) để test tính độc lập.
* *Cách dựng:* Dùng token Admin gọi `POST /api/products` để tạo từ 1 đến 2 sản phẩm trước khi thực thi test case Sửa/Xóa.

---

### 3. Đầu ra cần quan sát (Expected Outputs to Observe)

Để kết luận một test case là Pass hay Fail, ta cần quan sát các kết quả sau:

1. **HTTP Status Code:**
* Thành công: 200 (OK), 201 (Created), 204 (No Content).
* Lỗi Client/Validate: 400 (Bad Request), 422 (Unprocessable Entity).
* Lỗi Phân quyền/Xác thực: 401 (Unauthorized), 403 (Forbidden).
* Lỗi Dữ liệu: 404 (Not Found - khi không tìm thấy id).


2. **HTTP Response Body:**
* Nếu thành công: Trả về thông tin sản phẩm vừa tạo/sửa, hoặc danh sách sản phẩm (kèm ID), message thành công.
* Nếu thất bại: Trả về thông báo lỗi chi tiết (báo lỗi tên quá dài, giá âm, thiếu category, token không hợp lệ...).


3. **Trạng thái Dữ liệu (State Mutation):**
* *Thêm/Sửa:* Gọi lại `GET /api/products/:id` xem dữ liệu mới đã thực sự lưu vào hệ thống đúng như request gửi đi chưa.
* *Xóa:* Gọi lại `GET /api/products/:id` phải trả về 404 (hoặc trạng thái đã bị xóa).
* *Tính độc lập (Đòi hỏi từ SRS):* Khi gọi sửa `id = 1`, sau đó gọi `GET /api/products/:id` với `id = 2`, dữ liệu của `id = 2` phải **giữ nguyên**, không bị ảnh hưởng.


4. **Quan sát khía cạnh Bảo mật (Security):**
* *(SEC-05)* Thử gửi input có chứa ký tự SQL Injection (`' OR 1=1 --`), hệ thống không bị crash (Lỗi 500) hoặc rò rỉ dữ liệu, chứng tỏ có Parameterized Query.
* *(SEC-04)* Dữ liệu có thẻ HTML `<script>alert(1)</script>` khi GET ra phải trả về nguyên gốc (để UI tự escape) hoặc đã được escape thành ký tự an toàn (`&lt;script&gt;`).

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
