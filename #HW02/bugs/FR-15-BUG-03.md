# FR-15-BUG-03

**Tiêu đề Issue:** `[FR-15] POST /api/products không validate Danh mục (bắt buộc, phải thuộc danh sách có sẵn) (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-03 |
| Mức độ | High |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: "Danh mục: bắt buộc, phải chọn từ danh sách có sẵn." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-20, DT-21, DT-22, DT-23 (4 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/83 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-03**, bấm **Send ở 03a** (category_id không tồn tại), rồi **03b** (thiếu category_id).
3. Bấm **Send ở 03c (GET /api/products)** để xem các sản phẩm đã bị tạo.

Body thử ở bước 2 (request 03a, token admin). category_id không tồn tại = `max(id danh mục) + 1000` (biến `badCatId` do B0 tính sẵn).
```json
{ "name": "<bugMark>-03a-sp", "price": 100000, "description": "<bugMark>-03a", "imageUrl": "http://img.com/1.jpg", "category_id": <badCatId> }
```

## Kết quả thực tế
Server nhận yêu cầu (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 4xx nhưng nhận 2xx) và **tạo sản phẩm mới** thuộc danh mục không hợp lệ:

| Giá trị category_id gửi lên | Vi phạm | Kết quả |
| :--- | :--- | :--- |
| `<badCatId>` (không tồn tại) — DT-22 | không thuộc danh sách có sẵn | Tạo sản phẩm, `category_id` trỏ tới danh mục không có |
| thiếu trường `category_id` — DT-20 | bắt buộc | Tạo sản phẩm không có danh mục |
| `null` — DT-21 | bắt buộc | Tạo sản phẩm không có danh mục |
| `"abc"` — DT-23 | sai kiểu (chữ) | Tạo sản phẩm |


## Kết quả mong đợi (theo SRS)
Server từ chối (mã 4xx) và **không tạo** sản phẩm nào, vì Danh mục là bắt buộc và phải là một danh mục đang tồn tại.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-03-request.png`: request 03a (category_id không tồn tại), thấy mã HTTP trả về.
- `FR-15-BUG-03-readback.png`: request 03c, thấy sản phẩm có `category_id` không hợp lệ trong danh sách.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (không có bước kiểm tra Danh mục khi thêm) nên gộp 4 test thành MỘT bug.
- `category_id` là chuỗi số hợp lệ như `"1"` (DT-24) chưa kết luận, không thuộc bug này.
