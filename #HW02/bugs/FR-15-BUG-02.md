# FR-15-BUG-02

**Tiêu đề Issue:** `[FR-15] POST /api/products không validate Giá (bắt buộc, phải là số dương > 0) (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-02 |
| Mức độ | High |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: "Giá: bắt buộc, phải là số **dương** (> 0)." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-11, DT-12, DT-13, DT-15, DT-16, DT-17, BV-08 (7 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/82 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-02**, bấm **Send lần lượt 02a đến 02d** (Giá = 0, Giá âm, Giá là chữ, thiếu Giá).
3. Bấm **Send ở 02e (GET /api/products)** để xem các sản phẩm đã bị tạo.

Body thử ở bước 2 (request 02b, mỗi lần một giá trị, token admin):
```json
{ "name": "<bugMark>-02b-sp", "price": -50000, "description": "<bugMark>-02b", "imageUrl": "http://img.com/1.jpg", "category_id": <catId> }
```

## Kết quả thực tế
Server nhận yêu cầu (HTTP **TODO: ghi mã HTTP thực tế**, kỳ vọng 4xx nhưng nhận 2xx) và **tạo sản phẩm mới** với giá không hợp lệ:

| Giá trị Giá gửi lên | Vi phạm | Kết quả |
| :--- | :--- | :--- |
| `0` — DT-16, BV-08 | không phải số dương | Tạo sản phẩm với giá 0 |
| `-50000` — DT-17 | số âm | Tạo sản phẩm với giá âm |
| `"abc"` — DT-13 | sai kiểu (chữ) | Tạo sản phẩm |
| `true` — DT-15 | sai kiểu (boolean) | Tạo sản phẩm |
| thiếu trường `price` — DT-11 | bắt buộc | Tạo sản phẩm không có giá |
| `null` — DT-12 | bắt buộc | Tạo sản phẩm không có giá |


## Kết quả mong đợi (theo SRS)
Server từ chối (mã 4xx) và **không tạo** sản phẩm nào, vì Giá là bắt buộc và phải là số dương (> 0).

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-02-request.png`: request 02b (Giá âm), thấy mã HTTP trả về.
- `FR-15-BUG-02-readback.png`: request 02e, thấy các sản phẩm có Giá 0 / âm / sai kiểu trong danh sách.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (không có bước kiểm tra Giá khi thêm) nên gộp 7 test thành MỘT bug.
- Giá dạng chuỗi số `"100000"` (DT-14), số thập phân (DT-18, BV-11), giá rất lớn (DT-19) chưa kết luận (SRS không nêu), không thuộc bug này.
- Biên hợp lệ BV-09, BV-10 (giá 1, 2) phải được chấp nhận.
