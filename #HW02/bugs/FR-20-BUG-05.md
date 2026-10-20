# FR-20-BUG-05

**Tiêu đề Issue:** `[FR-20] User tự hủy được đơn đang `shipping` (FR-10)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-20-BUG-05 |
| Mức độ | High |
| Feature | FR-20 (Mobile: Đăng ký và Hủy đơn), tầng API |
| Yêu cầu SRS bị vi phạm | FR-10: "Khi đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy"; FR-20: "chỉ được hủy khi `pending` hoặc `confirmed`". |
| Môi trường | Backend localhost:3000, SUT commit 85af3ba (commit trong bản clone của mình, hãy thay bằng `git rev-parse --short HEAD` trong repo của bạn) |
| Test case liên quan | DT-C03, BV-C01 |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/51 |
| Trạng thái | Open |

## Các bước tái hiện
Postman: import `FR20_API_RunAll.postman_collection.json`, mở folder **B**, Send lần lượt từ B0 xuống. 
1. Gửi B0 (tạo user và đơn rồi đưa đơn sang `shipping`).
2. Gửi `FR-20-BUG-05a`: `GET /api/orders/my-orders` (token user) thấy đơn ở `shipping`.
3. Gửi `FR-20-BUG-05b`: `PUT /api/orders/{{orderId}}/cancel` (token user).
4. Gửi `FR-20-BUG-05c`: đọc lại `my-orders`.

## Kết quả thực tế
HTTP 200 `{"message":"Order canceled successfully"}`; đọc lại trạng thái là `canceled`.

## Kết quả mong đợi (theo SRS)
4xx và đơn giữ nguyên `shipping`.

## Bằng chứng
![ảnh](screenshots/FR-20-BUG-05.png)
TODO: chụp request + response trong Postman (tab Body và Test Results) và đính kèm vào Issue.

## Ghi chú
Server đã chặn `delivered` và `canceled` (DT-C04, DT-C05 đạt) và đường admin có kiểm tra chuyển trạng thái (BL-C05 trả 400), nên lỗi là guard của endpoint hủy của user thiếu trạng thái `shipping`. BV-C01 (admin chuyển sang shipping rồi user hủy) là cùng nguyên nhân, không phải lỗi đồng thời (race condition).
