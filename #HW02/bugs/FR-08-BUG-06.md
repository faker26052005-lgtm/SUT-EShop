# FR-08-BUG-06

**Tiêu đề Issue:** `[FR-08] Chi tiết đơn hàng không lưu đúng/đầy đủ sản phẩm từ giỏ hàng (R3, R4)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-06 |
| Mức độ | High |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | FR-08 / R3, R4: "Đơn hàng mới tạo phải lưu giữ đầy đủ snapshot danh sách sản phẩm đặt mua từ giỏ hàng." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | BL-01, BL-02 (Folder B: FR-08-BUG-06a, FR-08-BUG-06b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/97 |
| Trạng thái | Open |

## Các bước tái hiện
1. Mở folder **B** -> Chọn **FR-08-BUG-06a. Thêm 2 sản phẩm khác nhau vào giỏ & Checkout** và bấm **Send**.
   - SP 1: Đơn giá 100,000đ, SL: 2 (Tổng: 200,000đ)
   - SP 2: Đơn giá 50,000đ, SL: 1 (Tổng: 50,000đ)
   - Tổng tiền đúng phải là **250,000đ**.
2. Chọn tiếp **FR-08-BUG-06b. Xem lịch sử đơn hàng (`GET /api/orders/my-orders`)** và bấm **Send**.

## Kết quả thực tế
Đơn hàng tạo ra không lưu vết đầy đủ các mặt hàng hoặc tính toán sai tổng tiền thực tế của đơn hàng (do giỏ hàng bị đè dữ liệu hoặc sai lệch mối quan hệ giữa bảng orders và order_items).

## Kết quả mong đợi (theo SRS)
Đơn hàng tạo ra phải sao chép chính xác danh sách chi tiết từng sản phẩm (tên, giá snapshot, số lượng) và lưu đúng tổng tiền **250,000đ**.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-06-order-items.png`: Lịch sử đơn hàng chi tiết hiển thị sai danh sách/tổng tiền.