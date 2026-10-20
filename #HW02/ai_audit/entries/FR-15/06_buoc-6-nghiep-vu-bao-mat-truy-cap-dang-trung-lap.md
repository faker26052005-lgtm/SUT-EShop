# FR-15-06 – FR-15 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 09:02:18 (UTC+0700) |
| Feature / bước | FR-15 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là **BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP**.

Các test case này tập trung vào luồng nghiệp vụ thực tế (CRUD lifecycle), các ràng buộc độc lập dữ liệu, phân quyền và bảo mật an toàn thông tin dựa trên các yêu cầu từ `FR-12` và `SEC-02` đến `SEC-05`.

### Bảng Test Case: Kiểm soát truy cập (Access Control)

*(Áp dụng cho các endpoint có tính ảnh hưởng dữ liệu: `POST`, `PUT`, `DELETE /api/products`)*

| ID | Mô tả Test Case | Cách dựng và Input | Kỳ vọng theo SRS | Mã Y/C |
| --- | --- | --- | --- | --- |
| **AC-01** | Gọi API không đính kèm Token. | **Dựng:** Không có.<br>**Input:** Gọi `POST /api/products` với Body hợp lệ, Header không có `Authorization`. | 4xx (Lỗi xác thực) và dữ liệu không bị thay đổi. | R6, SEC-02 |
| **AC-02** | Gọi API với Token JWT không hợp lệ (sai chữ ký, hết hạn). | **Dựng:** Lấy một JWT ngẫu nhiên bịa ra hoặc đã hết hạn.<br>**Input:** Gọi `POST /api/products` với Body hợp lệ, `Authorization: Bearer <invalid_token>`. | 4xx (Lỗi xác thực) và dữ liệu không bị thay đổi. | R6, SEC-02 |
| **AC-03** | Gọi API với tài khoản có role không phải admin. | **Dựng:** Gọi `POST /api/login` với `test@eshop.com` / `Test1234!` để lấy token User thường.<br>**Input:** Gọi `POST /api/products` kèm token User này. | 4xx (Lỗi phân quyền/Forbidden) và dữ liệu không bị thay đổi. | R7, SEC-03, FR-12 |
| **AC-04** | Gọi API với tài khoản admin. | **Dựng:** Gọi `POST /api/login` với `admin@eshop.com` / `Admin123!` để lấy token Admin.<br>**Input:** Gọi `POST /api/products` kèm token Admin này. | 2xx và sản phẩm được tạo thành công. | R6, R7, SEC-03 |

---

### Bảng Test Case: Nghiệp vụ và Bảo mật (Business Logic & Security)

| ID | Mô tả Test Case | Cách dựng và Input | Kỳ vọng theo SRS | Mã Y/C |
| --- | --- | --- | --- | --- |
| **BL-01** | Tính độc lập của dữ liệu khi Sửa sản phẩm (Sửa SP này không ảnh hưởng SP khác). | **Dựng:** Dùng token Admin tạo SP A (`id=1`) và SP B (`id=2`).<br>**Input:** Gọi `PUT /api/products/1` đổi `name` thành "Áo Khoác". Sau đó gọi `GET /api/products/2`. | SP 1 đổi tên thành "Áo Khoác". Thông tin SP 2 khi GET ra phải **giữ nguyên hoàn toàn**. | R5 |
| **BL-02** | Kiểm tra luồng Thêm và Xem chi tiết sản phẩm. | **Dựng:** Dùng token Admin.<br>**Input:** Gọi `POST /api/products` để tạo SP mới, lấy `id` từ response. Gọi tiếp `GET /api/products/:id` vừa tạo. | GET trả về đúng và đầy đủ các thông tin đã nhập lúc POST. | R1 |
| **BL-03** | Xóa sản phẩm thành công. | **Dựng:** Dùng token Admin tạo SP (`id=1`).<br>**Input:** Gọi `DELETE /api/products/1`. Sau đó gọi `GET /api/products/1`. | CẦN LÀM RÕ (API GET sẽ trả về 404 Not Found hay 200 kèm trạng thái `is_deleted = true`?). Nhưng chắc chắn không hiển thị như SP bình thường. | R1 |
| **BL-04** | Phòng chống XSS từ dữ liệu do Admin nhập. | **Dựng:** Dùng token Admin.<br>**Input:** Gọi `POST /api/products` với `name` là `<script>alert('XSS')</script>`. Gọi `GET /api/products` để xem lại. | CẦN LÀM RÕ (API trả về chuỗi đã được escape thành `&lt;script&gt;` hay giữ nguyên gốc và phó mặc cho Frontend UI tự xử lý theo SEC-04?). | R8, SEC-04 |
| **BL-05** | SQL Injection qua Query String. | **Dựng:** Không cần token.<br>**Input:** Gọi `GET /api/products?search=' OR 1=1 --` | Trả về 200 OK với danh sách rỗng (hoặc khớp đúng tên đó). **Tuyệt đối không** trả về toàn bộ SP trong DB hoặc văng lỗi 500 do sai cú pháp SQL. | R9, SEC-05 |
| **BL-06** | SQL Injection qua Path Parameter. | **Dựng:** Không cần token.<br>**Input:** Gọi `GET /api/products/1 OR 1=1` | Trả về 400 Bad Request hoặc 404 Not Found. Không gây sập CSDL (500). | R9, SEC-05 |


## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
