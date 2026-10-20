# FR-08-BUG-04

**Tiêu đề Issue:** `[FR-08] Hệ thống cho phép Checkout khi giỏ hàng rỗng (0 sản phẩm)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-04 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | Logic Nghiệp vụ Đặt hàng / Ranging Validation |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | DT-26, DT-29 (Folder B: FR-08-BUG-04a) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/95 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đảm bảo giỏ hàng của người dùng đang rỗng (0 sản phẩm).
2. Mở folder **B** -> Chọn **FR-08-BUG-04a. Đảm bảo giỏ hàng rỗng & thực hiện Checkout** và bấm **Send**.

Payload gửi lên:
```json
{
  "total_amount": 0,
  "shipping_address": "123 Le Loi, TP.HCM"
}
```

## Kết quả thực tế
Server chấp nhận yêu cầu và tạo thành công một đơn hàng rỗng có giá trị 0đ, trả về **HTTP 200 OK** `{"message":"Checkout successful","orderId":200}`.

## Kết quả mong đợi (theo SRS)
Backend phải kiểm tra số lượng mục trong giỏ hàng trước khi tạo đơn. Nếu giỏ hàng rỗng, request phải bị từ chối với mã lỗi **HTTP 400 Bad Request** kèm thông báo `"Cart is empty"`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-04-empty-cart.png`: Checkout thành công khi giỏ rỗng, nhận HTTP 200 OK.