# Kết quả: run-01-fr09-coupon

**Mô hình, ngày giờ, người chạy:** (người điền)

## 1. Số liệu tự động

| Hạng mục | Giá trị |
|---|---|
| Ngày giờ chạy | 2026-11-18 08:20:27 AM |
| Karate | 1.5.2 |
| Lệnh | `java -DbaseUrl=http://localhost:3000 -cp C:\Users\LOQ\CODING\Testing\SUT-EShop\karate\karate-1.5.2.jar;C:\Users\LOQ\CODING\Testing\SUT-EShop\karate;C:\Users\LOQ\CODING\Testing\SUT-EShop\.agents\skills\api-test-design\assets\karate com.intuit.karate.Main -t ~@slow -o executions\run-01-fr09-coupon\report executions\run-01-fr09-coupon\features` |
| Địa chỉ máy chủ | http://localhost:3000 |
| Phạm vi thẻ | bỏ qua @slow |
| Ca đã chạy | 19 |
| Xanh | 13 |
| Đỏ | 6 |
| Ca trong matrix (tổng / Y / S / N / người thêm) | 19 / 13 / 6 / 0 / 0 |

## 2. Ca đỏ

| ID | Kỳ vọng và căn cứ | Phản hồi thực tế | Nhận định của Agent | Lệnh tái hiện (để người chạy) | Người xác nhận | Mã lỗi |
|----|-------------------|------------------|---------------------|-------------------------------|----------------|--------|
| CP01 | 200, discount_amount = 50000, final_amount = 450000 (SRS FR-09: 500.000 × 10% = 50.000₫) | 200, `discount_amount: -4500000`, `final_amount: 5000000` | `HT?` Công thức tính giảm giá coupon percent bị sai logic nghiêm trọng (tính ra số âm và làm tổng tiền tăng gấp 10 lần), vi phạm công thức SRS FR-09 | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"SAVE10\",\"total_amount\":500000}"` |  |  |
| CP03 | 200, discount_amount = 30000, final_amount = 270000 (SRS FR-09 C3: tổng đơn hàng >= min_order_amount 300.000₫) | 400, `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}` | `HT?` Lỗi toán tử biên: hệ thống dùng `total > min_order_amount` thay vì `>=` như SRS FR-09 C3 quy định, từ chối đơn hàng đúng bằng ngưỡng tối thiểu 300.000₫ | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"SAVE10\",\"total_amount\":300000}"` |  |  |
| CP04 | 200, discount_amount = 50000, final_amount = 450000 (SRS FR-09 C3: tổng đơn hàng >= min_order_amount 500.000₫ của BIGBUY) | 400, `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"}` | `HT?` Lỗi toán tử biên: hệ thống từ chối khi đơn hàng đúng bằng ngưỡng tối thiểu 500.000₫ của mã fixed BIGBUY, vi phạm điều kiện C3 SRS FR-09 | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"BIGBUY\",\"total_amount\":500000}"` |  |  |
| CP09 | 401 khi không có Authorization token (SRS FR-09 C4: Người dùng phải có JWT Token hợp lệ) | 200, `{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}` | `HT?` Vi phạm điều kiện C4 SRS FR-09: hệ thống cho phép áp dụng coupon thành công khi không có Authorization token. (Lưu ý: OpenAPI ghi `security: []`, cần người xác nhận mâu thuẫn) | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -d "{\"code\":\"SAVE10\",\"total_amount\":500000}"` |  |  |
| CP14 | 400 khi total_amount là số âm -50000 (OpenAPI schema `ApplyCouponRequest` quy định `minimum: 0`) | 200 (chấp nhận áp dụng mã với số tiền âm) | `HT?` Hệ thống không validate ràng buộc `minimum: 0` của schema OpenAPI, chấp nhận `total_amount = -50000` và trả về 200 OK | Xem các bước trong feature `@CP14` (cần tạo mã tạm có ngưỡng âm, áp số âm, dọn dẹp) |  |  |
| CP19 | 400 khi thiếu coupon_id trong body `POST /api/coupon-usage` (OpenAPI schema quy định `required: [coupon_id]`) | 200, `{"message":"Usage recorded"}` | `HT?` Hệ thống không validate trường bắt buộc `coupon_id`, ghi nhận thành công và trả 200 OK khi gửi body rỗng `{}` | `curl -X POST http://localhost:3000/api/coupon-usage -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{}"` |  |  |

## 3. Ca xanh đáng ngờ

| ID | Vì sao đáng ngờ | Gợi ý siết |
|----|-----------------|------------|
| CP11 | Ca thiếu trường `code` chỉ kiểm tra `response.error == '#string'` (assertion lỏng do tài liệu không nêu chuỗi cụ thể). | Nếu có tài liệu quy định thông báo chuẩn, siết `match response.error == '<thông báo>'` |
| CP12 | Ca thiếu trường `total_amount` chỉ kiểm tra `response.error == '#string'`. | Tương tự CP11, siết khi có thông báo chuẩn |
| CP13 | Ca body rỗng `{}` chỉ kiểm tra `response.error == '#string'`. | Tương tự CP11, siết khi có thông báo chuẩn |
| CP15 | Ca `total_amount = 'abc'` chỉ kiểm tra `response.error == '#string'`. | Tương tự CP11, siết khi có thông báo chuẩn |

## 4. Ca chưa chạy

Không có. Mọi ca Y hoặc S đều đã chạy.

## 5. Điểm tài liệu ảnh hưởng kết quả

- **CP09 (Điều kiện C4 - Đã đăng nhập)**: SRS FR-09 C4 yêu cầu "Người dùng phải có JWT Token hợp lệ". Tuy nhiên, OpenAPI mô tả `POST /api/apply-coupon` có `security: []`. Hệ thống thực tế chấp nhận áp dụng mã khi không có token (trả về 200 OK). Do ưu tiên SRS nên gắn nhãn `HT?`, nhưng cần người xác nhận xem thiết kế API có cố ý cho phép áp dụng thử khi chưa đăng nhập không.
- **CP14 (Cô lập số âm)**: Nhờ kịch bản tạo mã tạm có `min_order_amount = -1000000`, đã cô lập thành công việc hệ thống chấp nhận `total_amount = -50000` (trả 200 OK), chứng minh hệ thống không validate `minimum: 0`.
- **CP19 (`POST /api/coupon-usage` thiếu coupon_id)**: OpenAPI đặt `required: [coupon_id]` nhưng chỉ liệt kê các mã phản hồi 200, 401, 403 (không liệt kê 400). Thực tế hệ thống trả 200 OK khi body rỗng `{}`.

## 6. Phần người điền

| Hạng mục | Giá trị |
|---|---|
| Số ca đã xác nhận là lỗi hệ thống thật |  |
| Số ca đỏ hóa ra là test sai (`KY`) |  |
| Nhận xét về chất lượng ca Agent đề xuất |  |
