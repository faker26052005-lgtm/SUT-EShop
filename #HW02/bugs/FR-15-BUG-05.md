# FR-15-BUG-05

**Tiêu đề Issue:** `[FR-15] POST/PUT/DELETE /api/products không kiểm tra quyền admin (không token hoặc user thường vẫn thao tác được) (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-05 |
| Mức độ | Critical |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-12: các API `POST/PUT/DELETE /api/products` phải yêu cầu Token JWT hợp lệ và `role = admin`; SEC-02, SEC-03. |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09 (9 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/85 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-05**, bấm **Send lần lượt 05a đến 05f** (Thêm / Sửa / Xóa bằng token user thường, rồi Thêm / Sửa / Xóa khi không có token).
3. Bấm **Send ở 05g (GET /api/products)** để xem dữ liệu thật đã bị thay đổi.

Body thử ở bước 2 (request 05a, dùng `Bearer {{userToken}}` của `test@eshop.com`, role không phải admin):
```json
{ "name": "<bugMark>-05a-sp", "price": 100000, "description": "<bugMark>-05a", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Server **thực hiện** thao tác (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 401/403) dù người gọi không phải admin hoặc không có token:

| Thao tác | Người gọi | Test | Kết quả |
| :--- | :--- | :--- | :--- |
| Thêm sản phẩm | User thường | AC-03 | Sản phẩm được tạo |
| Sửa sản phẩm `prodU` | User thường | AC-06 | Sản phẩm bị sửa |
| Xóa sản phẩm `prodD1` | User thường | AC-09 | Sản phẩm bị xóa |
| Thêm sản phẩm | Không có token | AC-01 | Sản phẩm được tạo |
| Sửa sản phẩm `prodU` | Không có token | AC-04 | Sản phẩm bị sửa |
| Xóa sản phẩm `prodD2` | Không có token | AC-07 | Sản phẩm bị xóa |


## Kết quả mong đợi (theo SRS)
Server trả **401 hoặc 403** và dữ liệu sản phẩm **không thay đổi** (không thêm, không sửa, không xóa) khi không có token, token sai hoặc token không phải role `admin`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-05-user-post.png`: request 05a (token user thường), thấy mã HTTP trả về.
- `FR-15-BUG-05-no-token-delete.png`: request 05f (không token), thấy mã HTTP trả về.
- `FR-15-BUG-05-readback.png`: request 05g, thấy sản phẩm đã bị thêm / sửa / xóa trái quyền.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (3 endpoint ghi không có middleware kiểm tra token và role admin) nên gộp 9 test thành MỘT bug.
- Các ca token sai (AC-02, AC-05, AC-08) chạy ở Folder A, Folder B chỉ tái hiện user thường và không token.
- `GET /api/products` và `GET /api/products/:id` không cần token là đúng (AC-10, AC-11), không thuộc bug này.
- Nếu bug có thật, các sản phẩm `prodU`, `prodD1`, `prodD2` bị sửa/xóa; chạy lại B0 để làm mới dữ liệu.
