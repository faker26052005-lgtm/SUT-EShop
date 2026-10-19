# FR-04-BUG-02

**Tiêu đề Issue:** `[FR-04] PUT /api/users/me xóa các trường không gửi lên (name, shipping_address bị đặt thành null)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-04-BUG-02 |
| Mức độ | High (mất dữ liệu người dùng) |
| Feature | FR-04 – Quản lý hồ sơ cá nhân |
| Yêu cầu SRS liên quan | FR-04: người dùng "có thể cập nhật" Họ Tên, SĐT, Địa chỉ giao hàng. **Giả định A1:** cập nhật một trường không được làm mất các trường còn lại (SRS không nói rõ, đã đưa vào `clarifications.md`, mục 8) |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | BL-02 (kiểm tra trực tiếp). Hiện tượng xuất hiện trong **31 trên 34** test (cột side-effect) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/44 |
| Trạng thái | Open (chờ xác nhận giả định A1 với GV/TA) |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới và token.
2. Ở **B3**, sửa body như bên dưới rồi bấm **Send**.
3. Bấm **Send ở B4 (GET /users/me)** để xem dữ liệu đã lưu thật.

Trước bước 2, đặt hồ sơ gốc bằng một request PUT với body:
```json
{ "name": "Ten Goc", "phone": "0900000000", "shipping_address": "Dia chi goc" }
```
Rồi ở B3 chỉ gửi:
```json
{ "phone": "0922222222" }
```

## Kết quả thực tế
HTTP 200. Dữ liệu đọc lại:

| Trường | Trước | Sau |
| :--- | :--- | :--- |
| name | `Ten Goc` | `null` |
| phone | `0900000000` | `0922222222` |
| shipping_address | `Dia chi goc` | `null` |

## Kết quả mong đợi
Chỉ `phone` đổi; `name` và `shipping_address` giữ nguyên (theo giả định A1).

## Bằng chứng
Cần chụp:
- `FR-04-BUG-02-before.png`: GET hồ sơ gốc (đủ 3 trường).
- `FR-04-BUG-02-request.png`: B3 chỉ gửi `phone`, thấy HTTP 200.
- `FR-04-BUG-02-after.png`: GET sau đó, thấy `name` và `shipping_address` là `null`.
- TODO: ảnh trang GitHub Issue.

## Ghi chú
- Lỗi này lộ ra ở hầu hết mọi test chỉ gửi một trường, vì mọi trường không gửi đều bị xóa. Vì vậy mỗi test có thể PASS ở tiêu chí riêng nhưng vẫn kèm side-effect.
- Cần lưu ý: `PUT` theo quy ước REST là thay thế toàn bộ tài nguyên, nên có thể server cố ý ghi đè. Vì SRS không nêu, bug này phải đi kèm câu hỏi xác nhận. Nếu GV/TA xác nhận PUT được phép ghi đè toàn bộ thì đổi trạng thái thành "không phải bug" hoặc "cải tiến".
