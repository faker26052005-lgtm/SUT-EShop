# Test matrix: run-01-fr09-coupon

Phạm vi: FR-09 Mã Giảm Giá (Coupon) và các endpoint liên quan: `POST /api/apply-coupon`, `POST /api/coupon-usage`
Nguồn: `inputs/srs.md` (mục FR-09), `inputs/openapi.yaml` (đường dẫn `/api/apply-coupon`, `/api/coupon-usage`)

## 1. Quy tắc

| Mã | Quy tắc | Nguồn | Phủ qua API |
|----|---------|-------|-------------|
| R01 | Áp dụng mã hợp lệ loại percent giảm đúng theo công thức `discount_amount = total * discount_value / 100`, `final_amount = total - discount_amount` | SRS FR-09 | Có |
| R02 | Áp dụng mã hợp lệ loại fixed giảm đúng theo công thức `discount_amount = discount_value`, `final_amount = total - discount_amount` | SRS FR-09 | Có |
| R03 | Áp dụng mã khi tổng đơn đúng bằng ngưỡng tối thiểu `total == min_order_amount` thành công | SRS FR-09 C3 | Có |
| R04 | Áp dụng mã khi tổng đơn dưới ngưỡng tối thiểu `total < min_order_amount` bị từ chối 400 | SRS FR-09 C3, OpenAPI | Có |
| R05 | Áp dụng mã đã hết hạn (ngày hiện tại sau hoặc bằng `expired_at`) bị từ chối 400 với thông báo 'Mã giảm giá đã hết hạn' | SRS FR-09 C2, OpenAPI | Có |
| R06 | Áp dụng mã không tồn tại trong CSDL bị từ chối 404 với thông báo 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa' | SRS FR-09 C1, OpenAPI | Có |
| R07 | Mã có trong CSDL nhưng bị vô hiệu hóa (`is_active = 0`) bị từ chối 404 | SRS FR-09 C1, OpenAPI | Không |
| R08 | Áp dụng mã khi không gửi token bị từ chối 401 (SRS C4 nêu cần JWT hợp lệ nhưng không nêu mã; mã 401 theo quy ước bearerAuth của OpenAPI) | SRS FR-09 C4, OpenAPI bearerAuth | Có |
| R09a | Người dùng chưa từng dùng mã (số lần = 0 < max_uses) áp dụng mã thành công | SRS FR-09 C5 | Có |
| R09b | Người dùng đã dùng 1 trong 2 lượt của VIP100 (số lần = max_uses - 1) vẫn áp dụng mã thành công | SRS FR-09 C5 | Có |
| R09c | Người dùng đã dùng hết số lượt (`số lần đã dùng == max_uses_per_user`) khi áp dụng mã tiếp theo bị từ chối 400 | SRS FR-09 C5 | Có |
| R10 | Phản hồi áp dụng mã thành công trả về đầy đủ các trường `success`, `coupon_id`, `discount_amount`, `final_amount`, `message` đúng schema | OpenAPI | Có |
| R11 | Thiếu trường bắt buộc `code` trong body `POST /api/apply-coupon` bị từ chối 400 | OpenAPI | Có |
| R12 | Thiếu trường bắt buộc `total_amount` trong body `POST /api/apply-coupon` bị từ chối 400 | OpenAPI | Có |
| R13 | Body rỗng `{}` khi gọi `POST /api/apply-coupon` bị từ chối 400 | OpenAPI | Có |
| R14 | `total_amount` là số âm (`< 0`) khi gọi `POST /api/apply-coupon` bị từ chối 400 | OpenAPI | Có |
| R15 | `total_amount` sai kiểu dữ liệu (chuỗi không phải số) khi gọi `POST /api/apply-coupon` bị từ chối 400 | OpenAPI | Có |
| R16 | Ghi nhận lượt sử dụng mã `POST /api/coupon-usage` thành công khi có token và `coupon_id` hợp lệ | OpenAPI | Có |
| R17 | Gọi `POST /api/coupon-usage` không có token bị từ chối 401 | OpenAPI | Có |
| R18 | Gọi `POST /api/coupon-usage` với token sai định dạng / không hợp lệ bị từ chối 403 | OpenAPI | Có |
| R19 | Gọi `POST /api/coupon-usage` thiếu `coupon_id` trong body bị từ chối 400 | OpenAPI (`required: [coupon_id]`; 400 không được liệt kê cho endpoint này) | Có |
| R20 | Gọi `POST /api/coupon-usage` với `coupon_id` không tồn tại bị từ chối | Không phủ qua API: SRS và OpenAPI không nêu hành vi này (OpenAPI chỉ liệt kê 200, 401, 403). Xem mục 3 | Không |

## 2. Test matrix

| ID | Endpoint | Nhóm | Quy tắc | Kỳ vọng | Nguồn kỳ vọng | Assertion chính | Duyệt | Ghi chú |
|----|----------|------|---------|---------|---------------|-----------------|-------|---------|
| CP01 | POST /api/apply-coupon | 1 | R01, R10 | 200, discount_amount = 50000, final_amount = 450000, coupon_id = 1 (SAVE10 percent 10%, total 500000) | SRS | status 200; match response.discount_amount == 50000; match response.final_amount == 450000; match response.coupon_id == 1; match response.success == true; match response.message == '#string' | S | total 500k đặt xa biên 300k. Thêm kiểm `message` vì R10 yêu cầu đủ các trường |
| CP02 | POST /api/apply-coupon | 1 | R02, R10 | 200, discount_amount = 50000, final_amount = 750000, coupon_id = 2 (BIGBUY fixed 50000, total 800000) | SRS | status 200; match response.discount_amount == 50000; match response.final_amount == 750000; match response.coupon_id == 2; match response.success == true | Y | total 800k đặt xa biên 500k |
| CP03 | POST /api/apply-coupon | 2 | R03 | 200, discount_amount = 30000, final_amount = 270000 (SAVE10 đúng ngưỡng tối thiểu total = 300000) | SRS | status 200; match response.discount_amount == 30000; match response.final_amount == 270000; match response.success == true | Y | Biên dưới hợp lệ (total == min_order_amount) |
| CP04 | POST /api/apply-coupon | 2 | R03 | 200, discount_amount = 50000, final_amount = 450000 (BIGBUY đúng ngưỡng tối thiểu total = 500000) | SRS | status 200; match response.discount_amount == 50000; match response.final_amount == 450000; match response.success == true | Y | Biên dưới hợp lệ cho fixed (total == min_order_amount) |
| CP05 | POST /api/apply-coupon | 2 | R04 | 400, thông báo chưa đủ giá trị tối thiểu 300,000 ₫ (SAVE10 total = 299999 ngay dưới ngưỡng) | OpenAPI | status 400; match response.error contains 'Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫' | Y | Biên vi phạm ngay dưới ngưỡng min_order_amount |
| CP06 | POST /api/apply-coupon | 2 | R04 | 400, thông báo chưa đủ giá trị tối thiểu 500,000 ₫ (BIGBUY total = 499999 ngay dưới ngưỡng) | OpenAPI | status 400; match response.error contains 'Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫' | Y | Biên vi phạm ngay dưới ngưỡng min_order_amount cho fixed |
| CP07 | POST /api/apply-coupon | 4 | R05 | 400, thông báo 'Mã giảm giá đã hết hạn' (EXPIRED hạn 2020-01-01, total = 300000) | OpenAPI | status 400; match response.error == 'Mã giảm giá đã hết hạn' | Y | total 300k đặt xa biên 100k để cô lập lý do hết hạn |
| CP08 | POST /api/apply-coupon | 4 | R06 | 404, thông báo 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa' (mã KHONGTONTAI, total = 500000) | OpenAPI | status 404; match response.error == 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa' | Y | Mã không có trong CSDL; total đặt đủ lớn |
| CP09 | POST /api/apply-coupon | 5 | R08 | 401 khi không có Authorization token. Mã 401 theo quy ước bearerAuth của OpenAPI; SRS C4 chỉ nêu cần JWT hợp lệ, không nêu mã và nội dung lỗi | Không nêu | status 401; match response.error == '#string' | S | Không gửi header Authorization. Mâu thuẫn với `security: []` xem mục 3 |
| CP10 | POST /api/apply-coupon | 6 | R09a, R09b, R09c | VIP100 (tối đa 2 lượt), total 500.000₫: áp lần 1 trả 200 (đối chứng); ghi nhận 1 lượt rồi áp trả 200 (biên: còn 1 lượt); ghi nhận lượt thứ 2 rồi áp trả 400. Mã 400 theo OpenAPI (mã không áp dụng được), SRS C5 không nêu nội dung lỗi | Không nêu | Hai lần áp đầu: status 200; match response.success == true. Lần áp cuối: status 400; match response.error == '#string' | S | Dùng tài khoản tạm u. Mọi lần áp gửi `user_id` = u.id. Việc ghi nhận lượt dùng là bước riêng: POST /api/coupon-usage với coupon_id = 3 (theo OpenAPI, endpoint này ghi nhận lượt sử dụng). Tổng 500.000₫ xa ngưỡng 300.000₫ |
| CP11 | POST /api/apply-coupon | 3 | R11 | 400 khi thiếu trường code trong body | Không nêu | status 400; match response.error == '#string' | Y | Thiếu trường bắt buộc code; tài liệu không nêu nội dung lỗi |
| CP12 | POST /api/apply-coupon | 3 | R12 | 400 khi thiếu trường total_amount trong body | Không nêu | status 400; match response.error == '#string' | Y | Thiếu trường bắt buộc total_amount; tài liệu không nêu nội dung lỗi |
| CP13 | POST /api/apply-coupon | 3 | R13 | 400 khi body rỗng {} | Không nêu | status 400; match response.error == '#string' | Y | Body rỗng; tài liệu không nêu nội dung lỗi |
| CP14 | POST /api/apply-coupon | 3 | R14 | 400 khi total_amount là số âm (-50000), chỉ vì số âm chứ không vì ngưỡng tối thiểu | Không nêu | status 400; match response.error == '#string' | S | Cô lập lý do: tạo mã tạm tmp_cp_ (percent 10) có min_order_amount âm (-1.000.000, schema `CouponInput` không đặt minimum) bằng adminToken làm bước chuẩn bị, áp số âm lên mã đó bằng tài khoản tạm u, dọn dẹp rồi mới kiểm. Dữ liệu mẫu không có mã như vậy nên tự tạo theo quy tắc 2. Dùng SAVE10 (tối thiểu 300.000₫) sẽ xanh giả |
| CP15 | POST /api/apply-coupon | 3 | R15 | 400 khi total_amount là chuỗi không phải số ('abc') | Không nêu | status 400; match response.error == '#string' | S | Dùng 'abc' thay vì '500000': chuỗi số có thể bị hệ thống ép kiểu hợp lệ nên khó kết luận. Tài liệu không nêu nội dung lỗi |
| CP16 | POST /api/coupon-usage | 1 | R16 | 200, message = 'Usage recorded' khi ghi nhận coupon_id = 1 bằng tài khoản tạm | OpenAPI | status 200; match response.message == 'Usage recorded' | Y | Dùng tài khoản tạm u để không làm bẩn dữ liệu mẫu |
| CP17 | POST /api/coupon-usage | 5 | R17 | 401, error = 'Unauthorized' khi không có token | OpenAPI | status 401; match response.error == 'Unauthorized' | Y | Không có token theo bearerAuth |
| CP18 | POST /api/coupon-usage | 5 | R18 | 403, error = 'Forbidden' khi token sai định dạng | OpenAPI | status 403; match response.error == 'Forbidden' | Y | Token không hợp lệ theo components/responses/Forbidden |
| CP19 | POST /api/coupon-usage | 3 | R19 | 400 khi thiếu coupon_id trong body | Không nêu | status 400; match response.error == '#string' | S | Thiếu trường bắt buộc coupon_id; dùng tài khoản tạm u, body rỗng {}. OpenAPI không liệt kê 400 cho endpoint này; 400 suy ra từ `required: [coupon_id]`, xem mục 3 |

## 3. Mâu thuẫn và điểm chưa rõ

- **Điều kiện C4 (Đã đăng nhập) giữa SRS và OpenAPI**: SRS FR-09 C4 yêu cầu rõ "Người dùng phải có JWT Token hợp lệ" để áp dụng mã giảm giá. Tuy nhiên, OpenAPI mô tả `POST /api/apply-coupon` có `security: []` và trường `user_id` trong body là nullable (cho phép mobile gửi null khi chưa đăng nhập). Theo quy tắc ưu tiên SRS, CP09 kiểm tra từ chối khi không có token. SRS không nêu mã trạng thái, nên mã 401 lấy từ quy ước bearerAuth của OpenAPI; nội dung lỗi không nêu (nguồn kỳ vọng: Không nêu). Token sai định dạng trên endpoint này không có kỳ vọng nào trong tài liệu (`security: []`), nên không tạo ca.
- **Mã bị vô hiệu hóa (`is_active = 0`)**: SRS FR-09 C1 và OpenAPI 404 nhắc tới mã bị vô hiệu hóa, nhưng CSDL mẫu không có mã nào có `is_active = 0` và API admin không có trường `is_active` khi tạo hay sửa mã. Do đó quy tắc R07 đặt `Phủ qua API: Không`.
- **Thông báo lỗi cho C5 (hết lượt dùng)**: OpenAPI 400 chỉ đưa ví dụ cho mã hết hạn và chưa đủ ngưỡng tối thiểu, không có ví dụ thông báo cho việc hết lượt dùng coupon (`max_uses_per_user`). Do đó ca CP10 ghi nguồn kỳ vọng `Không nêu` và chỉ kiểm tra mã 400 kèm `error` là chuỗi.
- **coupon_id không tồn tại ở `POST /api/coupon-usage`**: OpenAPI không liệt kê mã lỗi 400 hay 404 cho trường hợp `coupon_id` không tồn tại ở endpoint này. Theo quy tắc 9 của design-rules, không đoán mã trạng thái; quy tắc R20 được đặt `Phủ qua API: Không`.
- **`POST /api/coupon-usage` thiếu `coupon_id` (CP19)**: OpenAPI đặt `required: [coupon_id]` nhưng chỉ liệt kê 200, 401, 403 cho endpoint, không có 400. Kỳ vọng 400 là suy ra từ `required`; cần hỏi người viết tài liệu nếu ca đỏ.
- **Cô lập lỗi số âm (CP14)**: `total_amount` âm vi phạm `minimum: 0` nhưng cũng nhỏ hơn mọi ngưỡng tối thiểu từ 0 trở lên. Dữ liệu mẫu không có mã nào có ngưỡng âm, nên ca tạo mã tạm bằng API admin với `min_order_amount` âm (schema `CouponInput` không đặt `minimum`) để chỉ kiểm tra số âm mới sinh mã 400.

## 4. Quy ước dữ liệu

- Tài khoản mẫu chỉ để đọc hoặc thao tác an toàn: `userToken` (test@eshop.com), `adminToken` (admin@eshop.com).
- Ca ghi hoặc thay đổi trạng thái lượt dùng (CP10, CP14, CP16, CP19) dùng tài khoản tạm `u` được tạo qua `helpers/create-user.feature` để không làm bẩn dữ liệu dùng chung.
- Mã tạm của CP14 tạo bằng `adminToken` (tiền tố `tmp_cp_` kèm timestamp), chỉ là bước chuẩn bị, và được xóa trước khi kiểm.
- Mã giảm giá mẫu sử dụng: `SAVE10` (id 1, percent 10%, min 300k, max 1), `BIGBUY` (id 2, fixed 50k, min 500k, max 1), `VIP100` (id 3, fixed 100k, min 300k, max 2), `EXPIRED` (id 4, percent 20%, min 100k, hết hạn 2020-01-01).
- Mã không tồn tại: `KHONGTONTAI`.