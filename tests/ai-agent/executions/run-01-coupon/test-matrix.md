# Test matrix: run-01-coupon

- Lần chạy: `run-01-coupon`  | Ngày: `<...>`  | Phạm vi: `FR-09 Mã giảm giá (POST /api/apply-coupon, GET /api/coupons, POST /api/coupon-usage)`
- Agent / mô hình: `Antigravity / Gemini 3.8 Flash`  | Người duyệt: `<...>`

## 1. Quy tắc nghiệp vụ và bảo mật

| Mã | Quy tắc | Căn cứ |
|---|---|---|
| R01 | Áp mã giảm giá theo tỷ lệ phần trăm: `discount_amount = total * discount_value / 100`, `final_amount = total - discount_amount`. | SRS FR-09 |
| R02 | Áp mã giảm giá theo số tiền cố định: `discount_amount = discount_value`, `final_amount = total - discount_amount`. | SRS FR-09 |
| R03 | Điều kiện ngưỡng tối thiểu (C3): Đơn hàng có `total_amount >= min_order_amount` mới được áp mã; nếu `total_amount < min_order_amount` thì từ chối (400). | SRS FR-09 C3 |
| R04 | Biên ngưỡng tối thiểu: Đơn hàng có `total_amount` bằng đúng `min_order_amount` vẫn thỏa mãn điều kiện áp mã. | SRS FR-09 C3 |
| R05 | Điều kiện hạn dùng (C2): Ngày áp mã phải trước `expired_at`. Nếu mã đã hết hạn thì từ chối (400). | SRS FR-09 C2 |
| R06 | Điều kiện tồn tại và hoạt động (C1): Mã phải có trong CSDL và `is_active = 1`. Nếu mã không tồn tại thì từ chối (404). | SRS FR-09 C1, OpenAPI |
| R07 | Điều kiện đăng nhập (C4): Người dùng phải có JWT Token hợp lệ khi áp mã (401 nếu thiếu/không hợp lệ). | SRS FR-09 C4, SEC-02 |
| R08 | Ràng buộc dữ liệu đầu vào: Trường `code` bắt buộc, `total_amount` phải là số không âm (`minimum: 0`). Nếu vi phạm thì từ chối (400). | OpenAPI, SRS FR-09 |
| R09 | Điều kiện số lượt dùng (C5): Số lần đã dùng mã của user phải nhỏ hơn `max_uses_per_user`. Nếu đã dùng hết lượt thì từ chối (400). | SRS FR-09 C5 |
| R10 | Phân quyền xem danh sách mã giảm giá: `GET /api/coupons` yêu cầu quyền `admin` (401 khi không có token, 403 khi role không phải admin). | SRS FR-12, SEC-03, OpenAPI |
| R11 | Ghi nhận sử dụng mã giảm giá: `POST /api/coupon-usage` yêu cầu JWT token hợp lệ và `coupon_id`. | SRS FR-09, SEC-02, OpenAPI |

## 2. Test matrix

Cột **Duyệt** do người điền: `Y` giữ nguyên, `S` sửa theo ghi chú (rồi coi như duyệt), `N` bỏ. Agent **không** điền cột này.

| ID | Endpoint | Nhóm ca (1 đến 6) | Căn cứ | Kỳ vọng (theo SRS) | Assertion chính | Duyệt | Ghi chú người duyệt |
|---|---|---|---|---|---|---|---|
| AC01 | POST /api/apply-coupon | 1 | FR-09, R01 | 200; mã SAVE10 (10%), đơn 1.000.000 -> giảm 100.000, thanh toán 900.000 | `status 200`, `response.discount_amount == 100000`, `response.final_amount == 900000`, `response.success == true` |Y | |
| AC02 | POST /api/apply-coupon | 1 | FR-09, R02 | 200; mã BIGBUY (cố định 50.000đ), đơn 600.000 -> giảm 50.000, thanh toán 550.000 | `status 200`, `response.discount_amount == 50000`, `response.final_amount == 550000`, `response.success == true` |Y | |
| AC03 | POST /api/apply-coupon | 2 | FR-09, R03, R04 | 200; đơn đúng bằng ngưỡng 300.000 (SAVE10) vẫn được áp mã -> giảm 30.000, thanh toán 270.000 | `status 200`, `response.discount_amount == 30000`, `response.final_amount == 270000`, `response.success == true` |Y | |
| AC04 | POST /api/apply-coupon | 2 | FR-09, R03 | 400; đơn ngay dưới ngưỡng (299.999 với SAVE10 min 300.000) bị từ chối | `status 400`, `response.error contains '300,000'` | Y | |
| AC05 | POST /api/apply-coupon | 4 | FR-09, R05 | 400; mã EXPIRED đã hết hạn (2020-01-01) bị từ chối kèm thông báo hết hạn | `status 400`, `response.error contains 'hết hạn'` |Y | |
| AC06 | POST /api/apply-coupon | 4 | FR-09, R06, OpenAPI | 404; mã không tồn tại 'NONEXISTENT' bị từ chối với thông báo phù hợp | `status 404`, `response.error contains 'không tồn tại'` |Y | |
| AC07 | POST /api/apply-coupon | 5 | FR-09, R07, SEC-02 | 401; áp mã khi không có Authorization token bị từ chối (SRS C4 thắng OpenAPI) | `status 401` |Y | |
| AC08 | POST /api/apply-coupon | 3 | OpenAPI, R08 | 400; request thiếu trường `code` bị từ chối (SRS không nêu chi tiết chuỗi lỗi) | `status 400`, `response.error != null` |Y | |
| AC09 | POST /api/apply-coupon | 3 | OpenAPI, R08 | 400; `total_amount` âm (-100.000) vi phạm ngưỡng tối thiểu >= 0 | `status 400`, `response.error != null` |Y | |
| AC10 | POST /api/apply-coupon | 6 | FR-09, R09 | 400; user tạm đã dùng SAVE10 1 lần (qua `/api/coupon-usage`), áp lại lần 2 bị từ chối vì hết lượt | `status 400`, `response.error != null` |Y | |
| AC11 | GET /api/coupons | 5 | FR-12, R10, SEC-03 | 403; user thường không có quyền xem danh sách mã giảm giá admin | `status 403` |Y | |
| AC12 | GET /api/coupons | 1 | FR-12, R10, OpenAPI | 200; admin xem danh sách mã giảm giá, trả về danh sách chứa các mã mẫu | `status 200`, `response == '#[]'`, `response contains deep { code: 'SAVE10' }` |Y | |
| AC13 | POST /api/coupon-usage | 5 | SEC-02, R11 | 401; ghi nhận lượt dùng mã khi không có Authorization token bị từ chối | `status 401` |Y | |

## 3. Bảng phủ

| Endpoint | Các ca |
|---|---|
| `POST /api/apply-coupon` | AC01, AC02, AC03, AC04, AC05, AC06, AC07, AC08, AC09, AC10 |
| `GET /api/coupons` | AC11, AC12 |
| `POST /api/coupon-usage` | AC13 (trực tiếp), AC10 (luồng nhiều bước) |

## 4. Mâu thuẫn và điểm chưa rõ

| # | Nội dung | Agent đề xuất | Người quyết định |
|---|---|---|---|
| 1 | OpenAPI ghi `POST /api/apply-coupon` không cần xác thực (`security: []`), nhưng SRS FR-09 C4 yêu cầu "Đã đăng nhập - Người dùng phải có JWT Token hợp lệ". | Theo SRS (SRS quyết định hành vi đúng, SEC-02), ca AC07 kỳ vọng mã 401 khi không gửi token. |Chấp nhận |
| 2 | OpenAPI mô tả 404 cho "Mã không tồn tại hoặc đã bị vô hiệu hóa" (`is_active = 0`). Tuy nhiên trong dữ liệu mẫu không có mã nào có `is_active = 0`, và API không cho phép tạo/sửa mã thành `is_active = 0` (`POST /api/admin/coupons` không nhận `is_active`, `DELETE` thì xóa hẳn). | Ca AC06 kiểm thử mã không tồn tại. Ca "mã bị vô hiệu hóa" không thể phủ qua API nếu không sửa trực tiếp DB. |Chấp nhận |
| 3 | SRS FR-09 C5 và OpenAPI không nêu rõ mã HTTP và thông báo lỗi cụ thể khi hết lượt dùng mã (`max_uses_per_user`), cũng như chuỗi thông báo lỗi khi thiếu `code` (AC08) hay `total_amount` âm (AC09). | Kỳ vọng mã lỗi 400 và kiểm tra `response.error` tồn tại; không áp đặt chuỗi thông báo cụ thể mà tài liệu không nêu để tránh sai kỳ vọng. | Chấp nhận|

## 5. Quy ước dữ liệu

Dữ liệu có sẵn chỉ lấy từ `inputs/sample-data.md`. Dữ liệu tạm được tạo bằng API; ghi từng loại ở đây.

| Loại dữ liệu | Cách tạo (endpoint hoặc hàm dùng chung) | Quy ước đặt tên | Ca dùng |
|---|---|---|---|
| Tài khoản mẫu | Có sẵn trong CSDL (`test@eshop.com` / `Test1234!`, `admin@eshop.com` / `Admin123!`) | id 2 (user), id 1 (admin) | AC01..AC09, AC11..AC13 |
| Tài khoản tạm | `helpers/create-user.feature` hoặc `POST /api/register` | email `tmp_user_<timestamp>@test.com` | AC10 (tránh tiêu tốn lượt dùng duy nhất của tài khoản mẫu `test@eshop.com`) |

### Ca chạy chậm

Ca phải chờ (ví dụ chờ hết thời gian khóa tài khoản). Gắn thẻ `@slow` trong feature.

| ID | Lý do chậm | Thời gian ước tính |
|---|---|---|
| *(Không có)* | Toàn bộ ca kiểm thử trong phạm vi FR-09 phản hồi tức thì, không cần chờ | 0 giây |
