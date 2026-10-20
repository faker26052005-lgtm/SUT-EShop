# FR-15-BUG-08

**Tiêu đề Issue:** `[FR-15] PUT /api/products/:id làm thay đổi các sản phẩm khác (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-08 |
| Mức độ | High |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: "Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | BL-02, DT-U01, BL-04 (3 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/88 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-08**, bấm **Send ở 08a** (ghi nhận dữ liệu các sản phẩm khác).
3. Bấm **Send ở 08b** (sửa sản phẩm mục tiêu `prodA` với dữ liệu hợp lệ), rồi **08c** (đọc lại và so sánh).

Body thử ở bước 2 (request 08b, `PUT /api/products/{{prodA}}`, token admin):
```json
{ "name": "<bugMark>-08-sp-moi", "price": 777777, "description": "<bugMark>-08b", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Sản phẩm mục tiêu được sửa đúng (HTTP **TODO: ghi mã HTTP thực tế**) nhưng khi đọc lại ở 08c, **TODO: x/y sản phẩm khác bị đổi hoặc mất** (ví dụ: id=TODO, tên TODO → TODO).

## Kết quả mong đợi (theo SRS)
Chỉ sản phẩm `prodA` bị thay đổi; toàn bộ sản phẩm khác giữ nguyên tên, giá, mô tả, ảnh và danh mục.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-08-before.png`: request 08a, thấy danh sách sản phẩm trước khi sửa.
- `FR-15-BUG-08-after.png`: request 08c, thấy các sản phẩm khác đã bị đổi.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Kiểm tra sản phẩm mục tiêu và các sản phẩm khác trong cùng một lần đọc lại, nên chỉ cần một bug cho cả ba test.
- Ca BL-04 (gửi kèm `id` lạ trong body) cũng thuộc nhóm này vì cùng kiểm tra việc sửa không gây ảnh hưởng tới bản ghi khác.
- Nếu bug có thật, dữ liệu mẫu có thể đã bị ghi đè; khôi phục dữ liệu mẫu sau khi chụp bằng chứng.
