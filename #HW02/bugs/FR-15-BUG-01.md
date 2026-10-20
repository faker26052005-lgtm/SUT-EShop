# FR-15-BUG-01

**Tiêu đề Issue:** `[FR-15] POST /api/products không validate Tên sản phẩm (bắt buộc, tối đa 255 ký tự) (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-01 |
| Mức độ | High |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: "Tên sản phẩm: bắt buộc, tối đa 255 ký tự." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-03, DT-04, DT-05, BV-01, BV-06, BV-07 (6 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/81 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-01**, bấm **Send ở 01a** (Tên rỗng), rồi **01b** (Tên 256 ký tự).
3. Bấm **Send ở 01c (GET /api/products)** để xem các sản phẩm đã bị tạo.

Body thử ở bước 2 (request 01a, mỗi lần một giá trị, token admin):
```json
{ "name": "", "price": 100000, "description": "<bugMark>-01a", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Server nhận yêu cầu (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 4xx nhưng nhận 2xx) và **tạo sản phẩm mới** với tên không hợp lệ. Dữ liệu đọc lại bằng `GET /api/products`:

| Giá trị Tên gửi lên | Vi phạm | Kết quả |
| :--- | :--- | :--- |
| `""` (rỗng) — DT-05, BV-01 | không được để trống | Tạo sản phẩm với tên rỗng |
| 256 ký tự — BV-06 | dài hơn 255 | Tạo sản phẩm, lưu đủ 256 ký tự |
| 1000 ký tự — BV-07 | dài hơn 255 | Tạo sản phẩm |
| thiếu trường `name` — DT-03 | bắt buộc | Tạo sản phẩm không có tên |
| `null` — DT-04 | bắt buộc | Tạo sản phẩm không có tên |


## Kết quả mong đợi (theo SRS)
Server từ chối (mã 4xx) và **không tạo** sản phẩm nào, vì Tên là bắt buộc và dài tối đa 255 ký tự.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-01-request.png`: request 01a (Tên rỗng), thấy mã HTTP trả về.
- `FR-15-BUG-01-readback.png`: request 01c, thấy sản phẩm có Tên rỗng / 256 ký tự trong danh sách.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (không có bước kiểm tra Tên khi thêm) nên gộp 6 test thành MỘT bug.
- Tên chỉ toàn khoảng trắng (DT-06), tên sai kiểu (DT-07), tên chứa HTML (DT-08) và tên trùng (DT-10) chưa kết luận (SRS không nêu), không thuộc bug này.
- Biên hợp lệ BV-02 đến BV-05 (tên 1, 2, 254, 255 ký tự) phải được chấp nhận; nếu các ca này FAIL thì tách bug khác.
