# FR-08-BUG-01

**Tiêu đề Issue:** `[FR-08] Cho phép Checkout khi chưa đăng nhập hoặc Token không hợp lệ (SEC-02 / R1 / R6)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-08-BUG-01 |
| Mức độ | Critical |
| Feature | FR-08 – Thanh toán (Checkout) |
| Yêu cầu SRS bị vi phạm | FR-08 / R1, R6, SEC-02: "Chỉ người dùng đã đăng nhập (có Token JWT hợp lệ) mới tiến hành thanh toán được." |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit Open |
| Test case liên quan | AC-01, DT-04, AC-05 (Folder B: FR-08-BUG-01a, FR-08-BUG-01b) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/92 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B** -> Chọn folder **FR-08-BUG-01**.
2. Chọn request **FR-08-BUG-01a. Checkout khi không gửi Header Authorization** và bấm **Send**.
3. Chọn request **FR-08-BUG-01b. Checkout với Token có chữ ký hỏng** và bấm **Send**.

Payload gửi lên:
```json
{
  "total_amount": 200000,
  "shipping_address": "123 Le Loi, TP.HCM"
}
```

## Kết quả thực tế
Server xử lý yêu cầu tạo đơn hàng thành công và trả về mã **HTTP 200 OK** thay vì chặn lại bằng các mã lỗi xác thực.

| Sub-case | Header Authorization | Kết quả thực tế | Mã HTTP mong đợi |
| :--- | :--- | :--- | :-: |
| BUG-01a | *(Không gửi Header)* | HTTP 200 OK (`orderId` sinh mới) | **401 Unauthorized** |
| BUG-01b | `Bearer invalid_signature_token` | HTTP 200 OK (`orderId` sinh mới) | **403 Forbidden** |

## Kết quả mong đợi (theo SRS)
Server phải kiểm tra Token JWT trước khi xử lý đơn hàng. Nếu thiếu Token hoặc Token có chữ ký hỏng/hết hạn, API phải lập tức từ chối với mã **401 Unauthorized** hoặc **403 Forbidden**.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-08-BUG-01a-no-token.png`: Request không token trả về HTTP 200.
- `FR-08-BUG-01b-bad-token.png`: Request token hỏng trả về HTTP 200.

## Ghi chú
- Đây là lỗ hổng bảo mật nghiêm trọng (Authentication Bypass).