# FR-08-BUG-05

**Tiêu đề Issue:** `[FR-08] Cho phép đặt hàng khi shipping_address rỗng "" hoặc null (R8)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-05 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | FR-08 / R8: "Địa chỉ giao hàng (shipping_address) là thông tin bắt buộc khi đặt hàng." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | DT-14, DT-15, DT-16, DT-17 (Folder B: FR-08-BUG-05a, FR-08-BUG-05b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/96 |
| Trạng thái | Open |

## Các bước tái hiện
1. Thêm 1 sản phẩm vào giỏ hàng.
2. Mở folder **B** -> Chọn **FR-08-BUG-05a. Checkout với shipping_address rỗng ""** và bấm **Send**.
3. Chọn tiếp **FR-08-BUG-05b. Checkout với shipping_address = null** và bấm **Send**.

Payload thử nghiệm:
- Case 5a: `{"total_amount": 100000, "shipping_address": ""}`
- Case 5b: `{"total_amount": 100000, "shipping_address": null}`

## Kết quả thực tế
Server chấp nhận cả 2 request trên và tạo đơn hàng thành công, trả về **HTTP 200 OK**. Đơn hàng được lưu trong DB với địa chỉ bị khuyết/rỗng.

## Kết quả mong đợi (theo SRS)
Địa chỉ giao hàng là thông tin bắt buộc. Server phải validate và trả về mã lỗi **HTTP 400 Bad Request** khi `shipping_address` bị thiếu, null, hoặc chuỗi rỗng.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-05a-empty-address.png`: Checkout với `shipping_address = ""` nhận HTTP 200.
- `FR-08-BUG-05b-null-address.png`: Checkout với `shipping_address = null` nhận HTTP 200.