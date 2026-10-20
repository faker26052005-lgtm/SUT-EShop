# FR-15-BUG-06

**Tiêu đề Issue:** `[FR-15] GET/PUT/DELETE /api/products/:id với id không tồn tại vẫn trả thành công (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-06 |
| Mức độ | Medium |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | SRS không nêu mã lỗi cụ thể. Theo quy ước kiểm thử, thao tác trên sản phẩm không tồn tại phải bị từ chối (4xx), không được báo thành công. |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-G02, DT-G03, DT-U10, DT-U11, DT-D02, DT-D03 (6 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/86 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-06**, bấm **Send lần lượt 06a, 06b, 06c** (Xem / Sửa / Xóa sản phẩm có id `999999`).

Body thử ở bước 2 (request 06b, `PUT /api/products/999999`, token admin):
```json
{ "name": "<bugMark>-06b-sp", "price": 100000, "description": "<bugMark>-06b", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Server trả **thành công** (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 4xx) dù không có sản phẩm nào với id `999999`:

| Yêu cầu | Test | Kết quả |
| :--- | :--- | :--- |
| `GET /api/products/999999` | DT-G02 | Trả thành công thay vì lỗi không tìm thấy |
| `PUT /api/products/999999` | DT-U10 | Báo sửa thành công, không có bản ghi nào bị tác động |
| `DELETE /api/products/999999` | DT-D02 | Báo xóa thành công, không có bản ghi nào bị tác động |


## Kết quả mong đợi (theo SRS)
Server trả mã 4xx (ví dụ 404) với thông báo phù hợp cho cả ba thao tác xem, sửa, xóa trên sản phẩm không tồn tại.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-06-get.png`: request 06a, thấy mã HTTP và nội dung trả về.
- `FR-15-BUG-06-put-delete.png`: request 06b và 06c, thấy mã HTTP trả về.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (không kiểm tra bản ghi có tồn tại hay không) nên gộp 6 test thành MỘT bug.
- Mức độ Medium vì không làm hỏng dữ liệu nhưng làm client hiểu sai trạng thái.
- Các ca id không phải số (`"abc"`: DT-G03, DT-U11, DT-D03) chạy ở Folder A; SRS không quy định cách xử lý nên nếu chỉ riêng các ca này FAIL thì nên chuyển sang mục cần làm rõ.
