# FR-15-BUG-04

**Tiêu đề Issue:** `[FR-15] PUT /api/products/:id không validate ràng buộc đầu vào (Tên, Giá, Danh mục) (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-04 |
| Mức độ | High |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: ràng buộc Tên (bắt buộc, tối đa 255 ký tự), Giá (số dương > 0), Danh mục (phải thuộc danh sách có sẵn) áp dụng cho dữ liệu sản phẩm, kể cả khi Sửa. |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-U02, DT-U03, DT-U05, DT-U06, DT-U08 (5 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/84 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-04**, bấm **Send lần lượt 04a, 04b, 04c** (đều sửa sản phẩm `prodV`: Tên rỗng, Giá = 0, category_id không tồn tại).
3. Bấm **Send ở 04d (GET /api/products)** để so sánh sản phẩm `prodV` với dữ liệu ban đầu.

Body thử ở bước 2 (request 04b, `PUT /api/products/{{prodV}}`, token admin):
```json
{ "name": "<bugMark>-04b-sp", "price": 0, "description": "<bugMark>-04b", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Server nhận yêu cầu sửa (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 4xx nhưng nhận 2xx) và **ghi đè** sản phẩm bằng dữ liệu không hợp lệ. Dữ liệu đọc lại ở 04d khác với dữ liệu ban đầu:

| Dữ liệu gửi lên khi Sửa | Vi phạm | Kết quả |
| :--- | :--- | :--- |
| `name: ""` — DT-U02 | không được để trống | Sản phẩm bị đổi tên thành rỗng |
| `name` 256 ký tự — DT-U03 | dài hơn 255 | Sản phẩm bị đổi tên |
| `price: 0` — DT-U05 | không phải số dương | Sản phẩm bị đổi giá thành 0 |
| `price: -50000` — DT-U06 | số âm | Sản phẩm bị đổi giá thành số âm |
| `category_id` không tồn tại — DT-U08 | không thuộc danh sách có sẵn | Sản phẩm trỏ tới danh mục không có |


## Kết quả mong đợi (theo SRS)
Server từ chối (mã 4xx) và sản phẩm **giữ nguyên** dữ liệu cũ (tên, giá, danh mục).

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-04-request.png`: request 04a hoặc 04b, thấy mã HTTP trả về.
- `FR-15-BUG-04-readback.png`: request 04d, thấy `prodV` đã bị đổi so với dữ liệu ban đầu.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Là bug riêng với FR-15-BUG-01, 02, 03 vì nằm ở endpoint khác (PUT thay vì POST), dù cùng kiểu lỗi thiếu validate.
- Các ca Sửa mà **thiếu** trường Tên / Giá / Danh mục (DT-U04, DT-U07, DT-U09) là giả định của người kiểm thử (SRS không nói PUT có bắt buộc đủ trường hay không), không đưa vào bug này.
- Folder B chỉ tái hiện 3 trường hợp đại diện (04a, 04b, 04c); các ca DT-U03, DT-U06 chạy ở Folder A.
