# FR-08-BUG-02

**Tiêu đề Issue:** `[FR-08] Backend tin tưởng total_amount do Client gửi lên thay vì tự tính lại từ giỏ hàng (R2, R4)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-02 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | FR-08 / R2, R4: "Backend phải tự tính lại tổng tiền từ giỏ hàng; không chấp nhận/lưu trực tiếp giá trị total_amount do client gửi lên." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | DT-07, DT-08, BL-01 (Folder B: FR-08-BUG-02a, FR-08-BUG-02b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/93 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đảm bảo giỏ hàng của user có 1 sản phẩm giá trị **200,000đ**.
2. Mở folder **B** -> Chọn **FR-08-BUG-02a. Checkout gửi total_amount = 1** và bấm **Send**.
3. Chọn tiếp **FR-08-BUG-02b. Đọc lại lịch sử đơn hàng (`GET /api/orders/my-orders`)** và bấm **Send**.

Payload gửi lên ở Bước 2:
```json
{
  "total_amount": 1,
  "shipping_address": "123 Le Loi, TP.HCM"
}
```

## Kết quả thực tế
- Tại Bước 2: Server trả về **HTTP 200 OK** `{"message":"Checkout successful","orderId":205}`.
- Tại Bước 3: Đọc lại thông tin đơn hàng vừa tạo trong CSDL, trường `total_amount` được lưu trực tiếp là **1đ** (hoặc tính sai lệch so với giỏ hàng thực tế do Backend không tự tính lại dựa trên đơn giá và số lượng trong DB).

## Kết quả mong đợi (theo SRS)
Backend phải bỏ qua hoàn toàn trường `total_amount` do client truyền lên, tự truy vấn giá trị thực của các item trong giỏ hàng để tính toán và lưu đúng số tiền **200,000đ** vào CSDL.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-02a-request.png`: Checkout với `total_amount = 1`.
- `FR-08-BUG-02b-orders.png`: Lịch sử đơn hàng hiển thị `total_amount` bị lưu sai thành 1đ.

## Ghi chú
- Lỗi logic nguy hiểm dẫn đến thất thoát doanh thu (Client-side Price Tampering).