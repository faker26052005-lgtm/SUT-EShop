# Kết quả: run-01-coupon

**Mô hình, ngày giờ, người chạy:** Antigravity (Claude 3.7 Sonnet), 2026-11-23 16:40:22, Kiên (AI1) & Kỳ (Reviewer)

## 1. Số liệu tự động

| Hạng mục | Giá trị |
|---|---|
| Ngày giờ chạy | 2026-11-23 04:40:22 PM |
| Karate | 1.5.2 |
| Lệnh | `java -DbaseUrl=http://localhost:3000 -cp C:\Users\LOQ\CODING\Testing\eshop-sut\SUT-EShop-main\karate\karate-1.5.2.jar;C:\Users\LOQ\CODING\Testing\eshop-sut\SUT-EShop-main\karate;C:\Users\LOQ\CODING\Testing\eshop-sut\SUT-EShop-main\.agents\skills\api-test-design\assets\karate com.intuit.karate.Main -t ~@slow -o executions\run-01-coupon\report executions\run-01-coupon\features` |
| Địa chỉ máy chủ | http://localhost:3000 |
| Phạm vi thẻ | bỏ qua @slow |
| Ca đã chạy | 27 |
| Xanh | 17 |
| Đỏ | 10 |
| Ca trong matrix (tổng / Y / S / N / người thêm) | 28 / 20 / 7 / 1 / 1 |

## 2. Ca đỏ

| ID | Kỳ vọng và căn cứ | Phản hồi thực tế | Nhận định của Agent | Lệnh tái hiện (để người chạy) | Người xác nhận | Mã lỗi |
|----|-------------------|------------------|---------------------|-------------------------------|----------------|--------|
| CP01 | 200, discount_amount = 50.000₫, final_amount = 450.000₫ (SRS FR-09 R01: đơn 500k giảm 10% còn 450k) | 200, `{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}` | `HT?` Lỗi tính toán nghiệp vụ nghiêm trọng: công thức nhân sai khiến discount_amount bị âm (-4.500.000₫) và final_amount bị đội lên 5.000.000₫ | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"SAVE10\",\"total_amount\":500000}"` | Lỗi hệ thống (`HT`) | R01 |
| CP03 | 200, chấp nhận vì tổng đơn đúng bằng min_order_amount 300.000₫ (SRS FR-09 C3: `total >= min_order_amount`) | 400, `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}` | `HT?` Lỗi kiểm tra giá trị biên (Off-by-one): hệ thống dùng so sánh lớn hơn hẳn (`>`) thay vì lớn hơn hoặc bằng (`>=`) | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"SAVE10\",\"total_amount\":300000}"` | Lỗi hệ thống (`HT`) | R03a |
| CP07 | 401 khi không có token (SRS FR-09 C4: "Đã đăng nhập: Người dùng phải có JWT Token hợp lệ") | 200, `{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}` | `HT?` Thiếu xác thực: endpoint `/api/apply-coupon` không yêu cầu token, vi phạm điều kiện C4 của SRS | `curl -X POST http://localhost:3000/api/apply-coupon -H "Content-Type: application/json" -d "{\"code\":\"SAVE10\",\"total_amount\":500000}"` | Lỗi theo SRS C4 (mâu thuẫn với OpenAPI `security: []`, cần chốt tài liệu) | R06a |
| CP12 | 400 khi total_amount là số âm (-100.000) (OpenAPI R10: `total_amount minimum: 0`) | 200, áp dụng thành công trên mã tạm có min_order_amount âm | `HT?` Thiếu kiểm tra dữ liệu đầu vào: hệ thống không chặn total_amount âm | Xem các bước trong feature `@CP12` (dùng mã tạm có min_order_amount âm để cô lập) | Lỗi hệ thống (`HT`) | R10 |
| CP15 | 400 khi thiếu trường bắt buộc coupon_id (OpenAPI R08b: `required: [coupon_id]`) | 200, `{"message":"Usage recorded"}` | `HT?` Thiếu kiểm tra dữ liệu đầu vào: body rỗng `{}` vẫn ghi nhận usage thành công | Xem các bước trong feature `@CP15` (dùng tài khoản tạm u) | Lỗi hệ thống (`HT`) | R08b |
| CP19 | 403 khi user thường xem danh sách mã giảm giá (SRS FR-12, OpenAPI R11c) | 200, trả về danh sách toàn bộ mã giảm giá | `HT?` Lỗi phân quyền (RBAC): user thường gọi được API danh sách mã giảm giá của admin | `curl -X GET http://localhost:3000/api/coupons -H "Authorization: Bearer <userToken>"` | Lỗi hệ thống (`HT`) | R11c |
| CP22 | 403 khi user thường tạo mã giảm giá (SRS FR-12, OpenAPI R12c) | 200, `{"message":"Coupon created","id":7}` | `HT?` Lỗi leo quyền nghiêm trọng (Privilege Escalation): user thường gọi được API admin để tạo coupon mới | `curl -X POST http://localhost:3000/api/admin/coupons -H "Content-Type: application/json" -H "Authorization: Bearer <userToken>" -d "{\"code\":\"tmp_perm\",\"type\":\"fixed\",\"discount_value\":10000,\"min_order_amount\":50000,\"expired_at\":\"2099-12-31\",\"max_uses_per_user\":1}"` | Lỗi hệ thống (`HT`) | R12c |
| CP23 | 400 khi tạo mã giảm giá với body rỗng (OpenAPI R12d: thiếu các trường bắt buộc) | 200, `{"message":"Coupon created","id":8}` | `HT?` Thiếu kiểm tra dữ liệu đầu vào: body rỗng `{}` vẫn tạo coupon thành công với các trường null | `curl -X POST http://localhost:3000/api/admin/coupons -H "Content-Type: application/json" -H "Authorization: Bearer <adminToken>" -d "{}"` | Lỗi hệ thống (`HT`) | R12d |
| CP26 | 403 khi user thường xóa mã giảm giá (SRS FR-12, OpenAPI R13c) | 200 | `HT?` Lỗi phân quyền (RBAC): user thường gọi được API admin để xóa coupon | Xem các bước trong feature `@CP26` (dùng mã tạm để thử xóa, không xóa mã mẫu) | Lỗi hệ thống (`HT`) | R13c |
| CP27 | 404 khi xóa coupon với id không tồn tại 99999 (OpenAPI R13d) | 200, `{"message":"Coupon deleted"}` | `HT?` Sai mã trạng thái HTTP: id không tồn tại trong CSDL nhưng hệ thống vẫn trả về HTTP 200 thành công | `curl -X DELETE http://localhost:3000/api/admin/coupons/99999 -H "Authorization: Bearer <adminToken>"` | Lỗi hệ thống (`HT`) | R13d |

## 3. Ca xanh đáng ngờ

| ID | Vì sao đáng ngờ | Gợi ý siết |
|----|-----------------|------------|
| CP02 | Áp mã cố định BIGBUY thành công với discount_amount = 50.000₫, nhưng ở CP01 mã SAVE10 lại bị tính sai công thức | Kiểm tra thêm mã VIP100 hoặc các giá trị đơn hàng khác nhau để xem logic tính toán fixed vs percent có bị lệch nhau hay không |
| CP18, CP21, CP25 | Các ca không có token đều trả về 401 (xanh), nhưng khi có token user thường (CP19, CP22, CP26) lại trả 200 thay vì 403 | Hệ thống có middleware kiểm tra đăng nhập (`authenticateToken`) nhưng thiếu hoàn toàn middleware phân quyền (`authorizeAdmin`), khiến user thường có toàn quyền của admin |

## 4. Ca chưa chạy

Không có. Mọi ca Y hoặc S đều đã chạy. (Ca CP16 bị loại theo quyết định duyệt `N` trong matrix).

## 5. Điểm tài liệu ảnh hưởng kết quả

- **Xác thực tại `POST /api/apply-coupon` (CP07):** SRS C4 quy định người dùng phải có JWT Token hợp lệ, nhưng OpenAPI khai báo `security: []`. Ca CP07 đỏ xác nhận hệ thống hiện đang làm theo OpenAPI (không chặn request thiếu token) chứ không làm theo ràng buộc bảo mật C4 của SRS.
- **Xóa ID không tồn tại (CP27):** OpenAPI mô tả trả về 404 cho `DELETE /api/admin/coupons/{id}`, nhưng hệ thống trả về 200 do câu lệnh `DELETE WHERE id = ?` của SQLite không báo lỗi khi không tìm thấy dòng bị ảnh hưởng.
- **Các API Admin (`/api/coupons`, `/api/admin/coupons`):** SRS FR-12 yêu cầu phân quyền quản trị, nhưng backend chỉ kiểm tra có token hợp lệ hay không chứ không kiểm tra `user.role === 'admin'`.

## 6. Phần người điền

| Hạng mục | Giá trị |
|---|---|
| Số ca đã xác nhận là lỗi hệ thống thật | 10 ca (9 chắc chắn: CP01, CP03, CP12, CP15, CP19, CP22, CP23, CP26, CP27; 1 cần chốt tài liệu: CP07) |
| Số ca đỏ hóa ra là test sai (`KY`) | 0 |
| Nhận xét về chất lượng ca Agent đề xuất | Đạt về cô lập lý do (CP12), kiểm số lượt có đối chứng (CP09), và nêu đúng các điểm tài liệu chưa rõ; yếu ở chỗ bằng chứng các ca nhiều bước (CP12, CP15, CP26) còn thiếu body phản hồi và lệnh tái hiện cụ thể. |