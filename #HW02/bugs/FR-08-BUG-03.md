# FR-08-BUG-03

**Tiêu đề Issue:** `[FR-08] Giỏ hàng KHÔNG được xóa tự động sau khi thanh toán thành công (R5)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-03 |
| Mức độ | Critical |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | FR-08 / R5: "Sau thanh toán thành công, giỏ hàng được xóa." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | DT-01, BL-01, BL-02 (Folder B: FR-08-BUG-03a, FR-08-BUG-03b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/94 |
| Trạng thái | Open |

## Các bước tái hiện
1. Thêm 1 sản phẩm vào giỏ hàng của người dùng.
2. Mở folder **B** -> Chọn **FR-08-BUG-03a. Thêm SP vào giỏ & thực hiện Checkout thành công** và bấm **Send**.
3. Chọn tiếp **FR-08-BUG-03b. Đọc lại giỏ hàng (`GET /api/cart`)** và bấm **Send**.

Payload gửi ở Bước 2:
```json
{
  "total_amount": 100000,
  "shipping_address": "123 Le Loi, TP.HCM"
}
```

## Kết quả thực tế
Server trả về **HTTP 200 OK** `{"message":"Checkout successful"}`, tuy nhiên khi gọi lại `GET /api/cart` ở Bước 3, các sản phẩm đã thanh toán vẫn tồn tại trong giỏ hàng và bị tích dồn số lượng liên tục qua các đợt mua sắm tiếp theo.

## Kết quả mong đợi (theo SRS)
Sau khi tạo đơn hàng thành công, hệ thống phải thực hiện xóa sạch session/bản ghi giỏ hàng của người dùng đó. `GET /api/cart` phải trả về mảng rỗng `[]`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-03a-checkout.png`: Response Checkout HTTP 200 OK.
- `FR-08-BUG-03b-cart.png`: Response `GET /api/cart` hiển thị giỏ hàng vẫn còn sản phẩm.