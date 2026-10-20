# FR-09-BUG-01

**Tiêu đề Issue:** `[FR-09] POST /api/apply-coupon tính sai mã loại percent: discount_amount âm, final_amount lớn hơn tổng đơn (FR-09)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-09-BUG-01 |
| Mức độ | Critical |
| Feature | FR-09 – Mã giảm giá (Coupon) |
| Yêu cầu SRS bị vi phạm | FR-09: "Loại percent: discount_amount = total × discount_value / 100"; "final_amount = total − discount_amount" |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | DT-01, DT-20, BV-03 (3 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/77 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới, token và `{{userId}}`.
2. Ở **B3**, đặt body như bên dưới rồi bấm **Send**.

```json
{ "code": "SAVE10", "total_amount": 500000, "user_id": {{userId}} }
```

## Kết quả thực tế
Server trả **HTTP 200** nhưng `discount_amount` là số **âm** và `final_amount` **lớn hơn nhiều** tổng đơn:

| Test | total_amount | discount_amount nhận được | final_amount nhận được | Kỳ vọng (discount / final) |
| :--- | :--- | :--- | :--- | :--- |
| DT-01 | 500.000 | -4.500.000 | 5.000.000 | 50.000 / 450.000 |
| BV-03 | 300.001 | -2.700.009 | 3.000.010 | 30.000,1 / 270.000,9 |
| DT-20 | 10.000.000.000 | -90.000.000.000 | 100.000.000.000 | 1.000.000.000 / 9.000.000.000 |

Ở cả ba trường hợp, `discount_amount` bằng đúng **−9 × total** (tức không phải 10% của total).

Mã loại **fixed** (BIGBUY, VIP100) tính đúng (DT-02, DT-03, BV-06, BV-09 PASS), nên lỗi chỉ nằm ở nhánh `percent`.

## Kết quả mong đợi (theo SRS)
`discount_amount = total × 10 / 100 = 50.000` và `final_amount = 500.000 − 50.000 = 450.000`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-09-BUG-01-request.png`: B3 với body `{"code":"SAVE10","total_amount":500000,...}`, thấy HTTP 200 và response có `discount_amount: -4500000`, `final_amount: 5000000`.
- `FR-09-BUG-01-boundary.png`: B3 với `total_amount` 300001 cho thấy cùng kiểu sai (-2700009 / 3000010).
- TODO: ảnh trang GitHub Issue có đính kèm các ảnh trên.

## Ghi chú
- Ba test cùng nguyên nhân gốc (công thức percent) nên gộp thành MỘT bug.
- Nếu người dùng thanh toán theo `final_amount` này, họ phải trả **gấp 10 lần** giá trị đơn hàng, nên đặt mức Critical.
- Các test AC-01, AC-02, BV-10 cũng trả giá trị sai như trên, nhưng lỗi chính của chúng là nguyên nhân khác (xem BUG-03, BUG-04), không tính vào bug này.
- DT-17 (total dạng chuỗi) và DT-18 (số thập phân) cũng nhận cùng kiểu kết quả sai nhưng đang ở trạng thái CẦN LÀM RÕ (xem `clarifications.md`), không thuộc bug này.
