# FR-09-BUG-02

**Tiêu đề Issue:** `[FR-09] POST /api/apply-coupon từ chối khi total_amount bằng đúng min_order_amount (dùng > thay vì >=) (FR-09)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-09-BUG-02 |
| Mức độ | Medium |
| Feature | FR-09 – Mã giảm giá (Coupon) |
| Yêu cầu SRS bị vi phạm | FR-09 điều kiện C3: "Tổng đơn hàng >= (lớn hơn hoặc bằng) min_order_amount" |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | BV-02, BV-05, BV-08 (3 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/78 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới và token.
2. Ở **B3**, đặt body như bên dưới rồi bấm **Send**.

```json
{ "code": "BIGBUY", "total_amount": 500000, "user_id": {{userId}} }
```

Làm tương tự với hai mã còn lại (mỗi lần dùng user mới nếu cần):
`{"code":"SAVE10","total_amount":300000,...}` và `{"code":"VIP100","total_amount":300000,...}`.

## Kết quả thực tế
Khi `total_amount` **bằng đúng** ngưỡng tối thiểu, server trả **HTTP 400** và không có `discount_amount`. Nội dung lỗi: TODO (ghi lại từ ảnh chụp).

| Test | Mã | total_amount | Ngưỡng | Kết quả thực tế |
| :--- | :--- | :--- | :--- | :--- |
| BV-02 | SAVE10 | 300.000 | 300.000 | 400, bị từ chối |
| BV-05 | BIGBUY | 500.000 | 500.000 | 400, bị từ chối |
| BV-08 | VIP100 | 300.000 | 300.000 | 400, bị từ chối |

Các giá trị sát biên vẫn đúng: ngưỡng − 1 bị từ chối (BV-01, BV-04, BV-07 PASS) và ngưỡng + 1 được chấp nhận (BV-06, BV-09 PASS). Như vậy ngưỡng đang bị xử lý là **lớn hơn** thay vì **lớn hơn hoặc bằng**.

## Kết quả mong đợi (theo SRS)
Server chấp nhận (HTTP 200). Ví dụ BIGBUY với 500.000: `discount_amount = 50.000`, `final_amount = 450.000`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-09-BUG-02-request.png`: B3 với `BIGBUY` và `total_amount: 500000`, thấy HTTP 400 và nội dung lỗi.
- `FR-09-BUG-02-plus1.png`: B3 với `total_amount: 500001`, thấy HTTP 200 (đối chứng).
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Ba test cùng nguyên nhân gốc (so sánh `>` thay vì `>=`) nên gộp thành MỘT bug.
- BV-03 (SAVE10, 300.001) không thuộc bug này: nó FAIL vì công thức percent sai (xem BUG-01), còn việc vượt ngưỡng thì đúng.
- Mức Medium vì người dùng chỉ bị từ chối ở đúng một giá trị biên.
