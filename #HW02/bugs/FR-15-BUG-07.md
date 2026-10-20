# FR-15-BUG-07

**Tiêu đề Issue:** `[FR-15] /api/products nối chuỗi trực tiếp vào truy vấn SQL, dễ bị SQL Injection (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-07 |
| Mức độ | Critical |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | SEC-05: "Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | BL-05, BL-06 (2 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/87 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-07**, bấm **Send ở 07a** (tìm kiếm với payload SQL), rồi **07b** (thêm sản phẩm có Tên chứa payload SQL).
3. Bấm **Send ở 07c (GET /api/products)** để kiểm tra bảng sản phẩm còn truy vấn được không.

Payload ở bước 2:
- 07a: `GET /api/products?search=' OR '1'='1`
- 07b (token admin):
```json
{ "name": "x'); DROP TABLE products;-- <bugMark>", "price": 100000, "description": "<bugMark>-07b", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Payload SQL làm thay đổi hành vi truy vấn (TODO: dán kết quả thực tế của từng request):

| Yêu cầu | Test | Kết quả |
| :--- | :--- | :--- |
| `GET /api/products?search=' OR '1'='1` | BL-05 | HTTP TODO, trả về TODO/tổng số sản phẩm (kỳ vọng: không lộ toàn bộ, không 5xx) |
| `POST /api/products` với Tên chứa `'); DROP TABLE products;-- | BL-06 | HTTP TODO (kỳ vọng: không 5xx) |
| `GET /api/products` sau payload | — | HTTP TODO, TODO sản phẩm (kỳ vọng: vẫn truy vấn được, vẫn còn dữ liệu) |


## Kết quả mong đợi (theo SRS)
Dữ liệu người dùng nhập vào (từ khóa tìm kiếm, Tên sản phẩm) chỉ được coi là **giá trị**, không làm đổi cấu trúc câu lệnh SQL: tìm kiếm với payload không trả về toàn bộ sản phẩm, thêm sản phẩm với Tên chứa dấu nháy không gây lỗi 5xx, bảng sản phẩm vẫn còn nguyên.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-07-search.png`: request 07a, thấy số sản phẩm trả về so với tổng.
- `FR-15-BUG-07-post.png`: request 07b, thấy mã HTTP và thông báo lỗi (nếu có).
- `FR-15-BUG-07-readback.png`: request 07c, thấy trạng thái bảng sản phẩm sau payload.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (truy vấn ghép chuỗi, không dùng parameterized query) ở tìm kiếm và thêm sản phẩm nên gộp BL-05 và BL-06 thành MỘT bug.
- Ca BL-05 so sánh `số kết quả < tổng số sản phẩm`, nên cần ít nhất 2 sản phẩm trong CSDL để kết luận đúng.
- Nếu sau payload mà bảng sản phẩm mất dữ liệu, khôi phục dữ liệu mẫu trước khi chạy tiếp.
