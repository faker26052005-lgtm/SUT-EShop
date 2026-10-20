# FR-15-01 – FR-15 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:52:12 (UTC+0700) |
| Feature / bước | FR-15 – Bước 1 - trích yêu cầu |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Bạn là kỹ sư kiểm thử phần mềm. Tôi sẽ kiểm thử black-box feature {FR_15} của hệ thống EShop bằng Domain Testing và Boundary Value Analysis. Ta làm theo từng bước, mỗi bước một yêu cầu riêng.

BƯỚC 1 – TRÍCH YÊU CẦU.
Dưới đây là đặc tả (SRS) và tài liệu API của feature. Chỉ dùng thông tin trong hai tài liệu này; không suy đoán thêm và không dùng kiến thức về cách hệ thống được cài đặt.

A. Trích SRS – FR-15: Quản lý Sản phẩm (Product CRUD)
- Admin có thể Thêm / Xem / Sửa / Xóa sản phẩm.
  - Ràng buộc đầu vào:Tên sản phẩm: bắt buộc, tối đa 255 ký tự.
  - Giá: bắt buộc, phải là số dương (> 0).
  - Danh mục: bắt buộc, phải chọn từ danh sách có sẵn.
- Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên.
B. Trích SRS – Các yêu cầu liên quan
FR-12: Kiểm soát truy cập (Access Control)
- Phân hệ Admin chỉ dành cho tài khoản có role = 'admin'.
- Tất cả các API Admin (/api/admin/*) và các API có tính ảnh hưởng dữ liệu (POST/PUT/DELETE /api/products, /api/categories, /api/coupons) đều phải yêu cầu:
  1. Token JWT hợp lệ.
  2. role = 'admin' trong Token.
Yêu cầu bảo mật
MãNội dungSEC-02Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.SEC-03API Admin phải kiểm tra role = 'admin' trong Token, không chỉ kiểm tra sự tồn tại của Token.SEC-04Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng innerHTML trực tiếp.SEC-05Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp.C. Trích tài liệu API – Sản phẩm (Products) & Danh mục (Categories)
3.1 Lấy danh sách sản phẩm
- Endpoint: GET /api/products
- Query string (Tùy chọn): ?search=keyword để tìm kiếm sản phẩm theo tên.
3.2 Xem chi tiết một sản phẩm
- Endpoint: GET /api/products/:id
3.3 Thêm / Sửa / Xóa Sản phẩm (Dành cho Admin)
- Thêm sản phẩm: POST /api/products
- Cập nhật: PUT /api/products/:id
- Xóa: DELETE /api/products/:id
- Body khi Thêm/Sửa (JSON):{  "name": "Tên sản phẩm",  "price": 100000,  "description": "Mô tả",  "imageUrl": "http://...",  "category_id": 1}
3.4 Danh mục (Categories)
- Lấy danh sách: GET /api/categories
- Thêm mới: POST /api/categories (Body: {"name": "Tên DM"})
- Cập nhật: PUT /api/categories/:id
- Xóa: DELETE /api/categories/:id
D. API hỗ trợ dựng dữ liệu kiểm thử (không thuộc FR-15)
Tài khoản mặc định: Admin admin@eshop.com / Admin123!; User test@eshop.com / Test1234!. Các API quản trị yêu cầu Authorization: Bearer <token> của tài khoản Admin.
1.1 Đăng ký tài khoản
- Endpoint: POST /api/register
- Body (JSON):{  "name": "Nguyen Van A",  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): {"message": "User registered successfully", "id": 1}
1.2 Đăng nhập
- Endpoint: POST /api/login
- Body (JSON):{  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): Trả về chuỗi JWT token và thông tin user.

Yêu cầu:
1. Lập bảng yêu cầu: Mã (R1, R2...), nội dung ngắn gọn, nguồn (mục SRS/SEC), loại (input / nghiệp vụ / bảo mật / truy cập).
2. Liệt kê endpoint liên quan: method, đường dẫn, có cần token không, body.
3. Liệt kê riêng các chỗ SRS im lặng hoặc mơ hồ (điều người kiểm thử cần biết để viết kỳ vọng nhưng SRS không nói). Mỗi chỗ ghi "CẦN LÀM RÕ" và không tự đoán kỳ vọng.
Chỉ trả về kết quả bước 1, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là kết quả thực hiện **BƯỚC 1 – TRÍCH YÊU CẦU** dựa trên tài liệu đặc tả (SRS) và API bạn đã cung cấp.

### 1. Bảng phân tích yêu cầu

| Mã | Nội dung yêu cầu | Nguồn | Loại yêu cầu |
| --- | --- | --- | --- |
| **R1** | Admin có thể Thêm / Xem / Sửa / Xóa sản phẩm. | FR-15 | Nghiệp vụ |
| **R2** | Tên sản phẩm: Bắt buộc, tối đa 255 ký tự. | FR-15 | Input |
| **R3** | Giá: Bắt buộc, phải là số dương (> 0). | FR-15 | Input |
| **R4** | Danh mục: Bắt buộc, phải chọn từ danh sách có sẵn (category_id hợp lệ). | FR-15 | Input |
| **R5** | Sửa sản phẩm: Chỉ sản phẩm được chọn bị thay đổi, các sản phẩm khác giữ nguyên. | FR-15 | Nghiệp vụ |
| **R6** | Các API có tính ảnh hưởng dữ liệu (POST/PUT/DELETE `/api/products`) yêu cầu Token JWT hợp lệ. | FR-12, SEC-02 | Bảo mật / Truy cập |
| **R7** | Token của các API thay đổi dữ liệu phải có `role = 'admin'`. | FR-12, SEC-03 | Truy cập |
| **R8** | Mọi dữ liệu user nhập vào khi hiển thị trên UI phải được escape đúng cách (không dùng innerHTML). | SEC-04 | Bảo mật |
| **R9** | Truy vấn CSDL phải dùng Parameterized Query (không nối chuỗi). | SEC-05 | Bảo mật |

---

### 2. Danh sách Endpoint liên quan (Feature FR-15)

Dưới đây là các API trực tiếp phục vụ cho việc quản lý Sản phẩm:

| Method | Endpoint | Yêu cầu Token? | Body / Query parameters |
| --- | --- | --- | --- |
| **GET** | `/api/products` | Không (Công khai) | *Query (Tùy chọn):* `?search=keyword` |
| **GET** | `/api/products/:id` | Không (Công khai) | Không có |
| **POST** | `/api/products` | Có (Admin JWT) | *Body (JSON):* `{ "name": "...", "price": 100000, "description": "...", "imageUrl": "...", "category_id": 1 }` |
| **PUT** | `/api/products/:id` | Có (Admin JWT) | *Body (JSON):* `{ "name": "...", "price": 100000, "description": "...", "imageUrl": "...", "category_id": 1 }` |
| **DELETE** | `/api/products/:id` | Có (Admin JWT) | Không có |

---

### 3. Các điểm mơ hồ / SRS im lặng (CẦN LÀM RÕ)

Đây là những vùng tối trong đặc tả cần phân tích viên nghiệp vụ (BA) hoặc Dev xác nhận trước khi có thể viết test case và thiết lập kỳ vọng (Expected Results) chính xác:

 **Tên sản phẩm:**
* *CẦN LÀM RÕ:* Có cho phép trùng tên sản phẩm không?
* *CẦN LÀM RÕ:* Có cho phép tên sản phẩm chỉ chứa toàn khoảng trắng (spaces) hoặc các ký tự đặc biệt không?


 **Giá sản phẩm:**
* *CẦN LÀM RÕ:* Kiểu dữ liệu của "giá" là số nguyên (Integer) hay có chấp nhận số thập phân (Float/Decimal)?
* *CẦN LÀM RÕ:* Có giới hạn giá trị tối đa (Max value) cho giá sản phẩm không?


 **Các trường dữ liệu khác trong Body:**
* *CẦN LÀM RÕ:* Các trường `description` và `imageUrl` là bắt buộc hay tùy chọn? Nếu có, độ dài tối đa là bao nhiêu?


 **Hành vi Xóa (Delete):**
* *CẦN LÀM RÕ:* Xóa sản phẩm là xóa cứng (xóa hẳn khỏi DB) hay xóa mềm (chỉ đánh dấu `is_deleted = true`)?
* *CẦN LÀM RÕ:* Nếu cố gắng xóa một danh mục (`/api/categories/:id`) đang chứa các sản phẩm bên trong thì hệ thống sẽ chặn lại báo lỗi hay cascade xóa luôn sản phẩm?


**Xử lý lỗi và HTTP Status Code:**
* *CẦN LÀM RÕ:* Khi thao tác thành công (Thêm/Sửa/Xóa), API trả về HTTP Status Code nào (200, 201, 204) và cấu trúc Body ra sao?
* *CẦN LÀM RÕ:* Nếu đầu vào sai (ví dụ: thiếu tên, giá âm) hoặc sai Token/Role, hệ thống trả về mã lỗi HTTP bao nhiêu (400, 401, 403, 422...)?

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
