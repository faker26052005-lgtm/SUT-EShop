# FR-09-BUG-04

**Tiêu đề Issue:** `[FR-09] POST /api/apply-coupon không giới hạn số lần dùng mã trên mỗi user (max_uses_per_user) (FR-09)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-09-BUG-04 |
| Mức độ | Medium |
| Feature | FR-09 – Mã giảm giá (Coupon) |
| Yêu cầu SRS bị vi phạm | FR-09 điều kiện C5: "Số lần đã dùng mã này của user < max_uses_per_user" |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | BV-10 (đã có kết quả). BV-11, BV-12, BL-02, BL-03, BL-04, BL-05, BL-06: TODO (chưa chạy, cần bổ sung trước khi chốt bug) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/80 |
| Trạng thái | Draft (chờ chạy nốt các test lượt dùng và xác nhận giả định A) |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới.
2. Ở **B3**, đặt body như bên dưới rồi bấm **Send** **hai lần liên tiếp** (cùng user, cùng token).

```json
{ "code": "SAVE10", "total_amount": 500000, "user_id": {{userId}} }
```

SAVE10 chỉ cho dùng **1 lần/người** (`max_uses_per_user = 1`).

## Kết quả thực tế
Lần gọi thứ hai vẫn trả **HTTP 200** kèm `discount_amount` và `final_amount` (BV-10). Server không từ chối dù user này đã áp dụng thành công mã này một lần.

## Kết quả mong đợi (theo SRS)
Lần gọi thứ hai bị từ chối (4xx) và không có `discount_amount`, vì số lần đã dùng (1) không còn nhỏ hơn `max_uses_per_user` (1).

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-09-BUG-04-first.png`: B3 lần 1, thấy HTTP 200.
- `FR-09-BUG-04-second.png`: B3 lần 2 cùng body, thấy HTTP 200 (đáng lẽ bị từ chối).
- TODO: ảnh trang GitHub Issue có đính kèm hai ảnh trên.

## Ghi chú
- **Giả định A (cần xác nhận):** bug này dựa trên giả định "đã dùng" = một lần apply-coupon thành công. Nếu hệ thống chỉ tính lượt khi **đặt hàng**, thì BV-10 phải chuyển thành CẦN LÀM RÕ và không mở bug này. Cách kiểm chứng: đặt một đơn có dùng mã, rồi gọi lại apply-coupon.
- Phiên chạy hiện tại dừng sau BV-10 (37/51 test), nên chưa có kết quả BV-11 (VIP100 lần 2), BV-12 (VIP100 lần 3) và nhóm BL. Cần chạy nốt rồi cập nhật bảng test liên quan.
- Chưa phân biệt được hai khả năng: server không đếm lượt, hay đếm nhưng không so sánh. BV-12 (VIP100 lần 3) sẽ giúp tách hai khả năng này.
