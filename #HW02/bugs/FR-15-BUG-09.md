# FR-15-BUG-09

**Tiêu đề Issue:** `[FR-15] DELETE /api/products/:id làm mất hoặc thay đổi các sản phẩm khác (FR-15)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-15-BUG-09 |
| Mức độ | Critical |
| Feature | FR-15 – Quản lý Sản phẩm (Product CRUD) |
| Yêu cầu SRS bị vi phạm | FR-15: Admin có thể Xóa sản phẩm; thao tác xóa chỉ được ảnh hưởng đến sản phẩm được chọn (không làm mất hay thay đổi sản phẩm khác). |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit  |
| Test case liên quan | DT-D01, BL-07 (2 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/89 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, import collection `FR15_API_postman_collection.json`, mở folder **B** và bấm **Send ở B0 (CHUẨN BỊ)** một lần để có token admin, token user thường, danh mục hợp lệ và các sản phẩm mục tiêu.
2. Mở folder **FR-15-BUG-09**, bấm **Send ở 09a** (ghi nhận danh sách các sản phẩm khác).
3. Bấm **Send ở 09b** (xóa sản phẩm mục tiêu `prodX`), rồi **09c** (đọc lại và so sánh).

## Kết quả thực tế
Sản phẩm mục tiêu bị xóa (HTTP **TODO: ghi mã HTTP thực tế**) nhưng khi đọc lại ở 09c, **TODO: x/y sản phẩm khác bị mất hoặc đổi** (ví dụ id=TODO).

## Kết quả mong đợi (theo SRS)
Chỉ sản phẩm `prodX` biến mất khỏi danh sách; toàn bộ sản phẩm khác còn nguyên dữ liệu.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-15-BUG-09-before.png`: request 09a, thấy danh sách sản phẩm trước khi xóa.
- `FR-15-BUG-09-after.png`: request 09c, thấy các sản phẩm khác bị mất hoặc đổi.
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Nếu bug có thật, có thể mất toàn bộ sản phẩm (xóa không có điều kiện `WHERE id`); chỉ chạy 09 sau khi các bug khác đã chụp xong bằng chứng và khôi phục dữ liệu mẫu sau đó.
- Ca BL-07 (sau khi xóa, sản phẩm không còn trong danh sách, tìm kiếm và xem chi tiết) chạy ở Folder A.
