# FR-09-BUG-03

**Tiêu đề Issue:** `[FR-09] POST /api/apply-coupon không kiểm tra JWT: không token hoặc token sai vẫn nhận 200 (FR-09, SEC-02)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-09-BUG-03 |
| Mức độ | High |
| Feature | FR-09 – Mã giảm giá (Coupon) |
| Yêu cầu SRS bị vi phạm | FR-09 điều kiện C4: "Người dùng phải có JWT Token hợp lệ"; SEC-02: "Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ" |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | AC-01, AC-02 (2 test, cùng một nguyên nhân gốc) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/79 |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có `{{userId}}`.
2. Ở **B3**, đặt body như bên dưới.

```json
{ "code": "SAVE10", "total_amount": 500000, "user_id": {{userId}} }
```

3. Lần 1: tab **Authorization** chọn **No Auth**, bấm **Send**.
4. Lần 2: tab **Authorization** chọn **Bearer Token**, nhập `abc.def.ghi`, bấm **Send**.

## Kết quả thực tế
Cả hai lần server đều trả **HTTP 200** kèm `discount_amount` và `final_amount` (giá trị sai do BUG-01, không liên quan bug này):

| Test | Authorization | HTTP | Response |
| :--- | :--- | :--- | :--- |
| AC-01 | Không có token | 200 | `discount_amount: -4500000`, `final_amount: 5000000` |
| AC-02 | Token sai (`abc.def.ghi`) | 200 | `discount_amount: -4500000`, `final_amount: 5000000` |

## Kết quả mong đợi (theo SRS)
Server từ chối bằng **401 hoặc 403** và không trả `discount_amount` / `final_amount`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR-09-BUG-03-no-token.png`: B3 với **No Auth**, thấy HTTP 200 và response.
- `FR-09-BUG-03-bad-token.png`: B3 với token `abc.def.ghi`, thấy HTTP 200 và response.
- TODO: ảnh trang GitHub Issue có đính kèm hai ảnh trên.

## Ghi chú
- Hai test cùng nguyên nhân gốc (API không kiểm tra token) nên gộp thành MỘT bug.
- Hệ quả: ai cũng gọi được API mà không cần đăng nhập, và `user_id` do client tự gửi nên có thể giả mạo bất kỳ id nào (xem `clarifications.md`, các mục DT-21..25).
- Nên đối chiếu với các API khác: ở FR-04, API không token trả 401 và token sai trả 403 (AC-01, AC-02 PASS), nên đây là thiếu middleware riêng ở route này.
