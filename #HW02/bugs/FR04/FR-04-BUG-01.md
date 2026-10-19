# FR-04-BUG-01

**Tiêu đề Issue:** `[FR-04] PUT /api/users/me không validate số điện thoại, nhận mọi giá trị (FR-04)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-04-BUG-01 |
| Mức độ | High |
| Feature | FR-04 – Quản lý hồ sơ cá nhân |
| Yêu cầu SRS bị vi phạm | FR-04: "Số điện thoại hợp lệ: bắt đầu bằng số `0`, từ 10–11 chữ số." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | DT-03, DT-04, DT-05, DT-06, DT-07, DT-08, DT-08b, DT-08c, BV-01, BV-04, BV-05, BV-07 (12 test, cùng một nguyên nhân gốc) |
| GitHub Issue | TODO (link) |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới và token.
2. Ở **B3**, sửa body như bên dưới rồi bấm **Send**.
3. Bấm **Send ở B4 (GET /users/me)** để xem dữ liệu đã lưu thật.

Body thử ở bước 2 (mỗi lần một giá trị, lần nào cũng bắt đầu từ user mới):
```json
{ "phone": "9123456789" }
```

## Kết quả thực tế
Server trả **HTTP 200** `{"message":"Profile updated"}` và lưu đúng giá trị sai. Dữ liệu đọc lại bằng `GET /api/users/me`:

| Giá trị gửi lên | Vi phạm | SĐT được lưu |
| :--- | :--- | :--- |
| `9123456789` | không bắt đầu bằng 0 | `9123456789` |
| `09123abcde` | chứa chữ cái | `09123abcde` |
| `0912 345 678` | có khoảng trắng | `0912 345 678` |
| `+84912345678` | dạng quốc tế | `+84912345678` |
| `0912-345-678` | ký tự đặc biệt | `0912-345-678` |
| `012345678` (9 số) | ngắn hơn 10 | `012345678` |
| `012345678901` (12 số) | dài hơn 11 | `012345678901` |
| `0` (1 số) | quá ngắn | `0` |
| `1987654321` | chữ số đầu là 1 | `1987654321` |
| `912345678` (kiểu number) | sai kiểu | `912345678` |
| `true` (kiểu boolean) | sai kiểu | `1` (bị ép kiểu) |
| `["0912345678"]` (mảng) | sai kiểu | `[object Object]` (dữ liệu hỏng) |

## Kết quả mong đợi (theo SRS)
Server từ chối (mã 4xx) và hồ sơ giữ nguyên SĐT cũ, vì chỉ chấp nhận chuỗi bắt đầu bằng `0` dài 10–11 chữ số.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-04-BUG-01-request.png`: B3 với body `{"phone":"9123456789"}`, thấy HTTP 200.
- `FR-04-BUG-01-get.png`: B4 thấy `phone` đã bị đổi thành `9123456789`.
- TODO: ảnh trang GitHub Issue có đính kèm hai ảnh trên.

## Ghi chú
- Cùng một nguyên nhân gốc (không có bước kiểm tra SĐT) nên gộp 12 test thành MỘT bug.
- Server còn không kiểm tra kiểu dữ liệu: `true` bị ép thành `1`, mảng bị lưu thành `[object Object]`, tức là có thể làm hỏng dữ liệu.
- Các giá trị rỗng/null của SĐT chưa kết luận (xem `clarifications.md`), không thuộc bug này.
