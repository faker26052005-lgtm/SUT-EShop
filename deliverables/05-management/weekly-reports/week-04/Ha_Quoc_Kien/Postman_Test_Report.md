# Báo Cáo Tổng Hợp Kiểm Thử API — EShop (Postman)

> **Chủ đề:** API Testing & Contract Testing (T06)
> **Công cụ:** Postman (Desktop)
> **Hệ thống được kiểm thử (SUT):** EShop, backend Node.js/Express + SQLite, repo `ttbhanh/eshop-sut`
> **Ngày chạy:** 13/10/2026 (collection chính), 15/10/2026 (bộ test tổng hợp), 16/10/2026 (thí nghiệm AI sinh test), 23/10/2026 (đánh giá skill Karate)
> **Cấu trúc:** mục 1 đến 11 là phần Postman; mục 12 Data-driven bằng Newman; mục 13 thí nghiệm AI sinh test; mục 14 đánh giá skill `api-test-design`; mục 15 tổng hợp và việc còn lại
> **Tệp minh chứng:** `eshop_api_postman_collection_v3.json` (collection chính: 66 request kèm response mẫu của từng request, cộng 2 request Data-driven, tổng 68 request) và `eshop_api_all_tests.postman_collection.json` (bộ test tổng hợp, 1 request, 118 assertion)

---

## 1. Tổng quan

### 1.1. Mục tiêu
- Khảo sát hành vi thật của toàn bộ API EShop và đối chiếu với tài liệu `api_specification.md`.
- Xây một Postman collection có assertion cho từng request, dùng chained token (đăng nhập một lần, các request sau tự dùng lại token).
- Ghi lại response thật của từng endpoint làm đầu vào cho file OpenAPI, cho hướng AI và cho hợp đồng Pact sau này.
- Phát hiện và ghi nhận các điểm hệ thống không đúng đặc tả.

### 1.2. Phạm vi
- 30 endpoint trong `api_specification.md`.
- 1 endpoint không có trong spec nhưng ứng dụng mobile đang gọi: `POST /api/coupon-usage`.
- 1 biến thể payload của checkout theo đúng cách ứng dụng mobile gửi (`Checkout (Mobile payload)`).
- Tổng cộng **38 request chính**, chia vào 9 thư mục: Auth, Products, Cart, Orders, Coupons, Admin, Users, Categories và `Orders - Cancel` (một request: Cancel order).
- Thư mục `Errors` gồm **28 request** (script kiểm tra nằm ở cấp thư mục: mỗi phản hồi 4xx có hai assertion, phản hồi là JSON và có trường `error` kiểu chuỗi, tổng 16 ca × 2 = 32 assertion; 10 ca trả 200 trái kỳ vọng (E5, E6, E13, E14, E16, E21 đến E25, tức B9 đến B13) không có assertion, chỉ có response mẫu): 2 request chuẩn bị (S1, S2: tạo và đăng nhập tài khoản tạm) và 26 ca kiểm tra phản hồi lỗi (E1 đến E26). Tổng cộng 66 request. Bản v3 thêm hai thư mục Data-driven (`DataDriven - Login`, `DataDriven - Products`, mỗi thư mục một request, xem mục 12), nên file collection có 68 request.
- Kết quả đợt kiểm tra thư mục `Errors` nằm ở mục 6.
- Collection thứ hai, **bộ test tổng hợp** (`eshop_api_all_tests.postman_collection.json`), chỉ có một request `00 RUN ALL`. Toàn bộ test nằm trong script của request này (201 lời gọi `pm.sendRequest`, Newman đếm 202 request gồm cả request kích hoạt, 118 assertion) nên chạy được chỉ bằng một lần bấm Send, không cần Collection Runner. Bộ test được viết sau khi đọc `server.js` và đối chiếu SRS trong README, nhằm kiểm chứng lại các lỗi đã biết và phát hiện thêm lỗi (B15 đến B33).

### 1.3. Phương pháp
1. Đọc `api_specification.md` và lập bảng endpoint.
2. Đọc code backend (`server.js`, `database.js`) để hiểu cách tạo response và các giả thuyết về lỗi.
3. Gọi từng endpoint bằng Postman, ghi lại status code và cấu trúc response thật.
4. Viết assertion theo **hành vi mong đợi theo đặc tả**, không theo hành vi hiện tại của hệ thống. Vì vậy assertion đỏ nghĩa là hệ thống lệch đặc tả, tức là một lỗi cần ghi nhận.
5. Chạy tuần tự trên dữ liệu vừa được reset, lưu response mẫu bằng "Save as example", export collection.
6. Đối chiếu từng yêu cầu chức năng (FR) và bảo mật (SEC) trong README (SRS) với hành vi thật, rồi viết bộ test tổng hợp. Bộ test tự tạo dữ liệu riêng cho mỗi lần chạy (người dùng, sản phẩm, đơn hàng, mã giảm giá) và dọn lại cuối lần chạy, nên chạy lặp lại được.

---

## 2. Môi trường thực hiện

| Hạng mục | Giá trị |
|---|---|
| Hệ điều hành | Windows |
| Backend | `node server.js`, địa chỉ `http://localhost:3000` |
| Cơ sở dữ liệu | SQLite. `database.js` được nạp khi server khởi động và xóa rồi tạo lại toàn bộ bảng, nên **mỗi lần khởi động lại server là reset dữ liệu** |
| Giỏ hàng | Lưu trong bộ nhớ của server (`userCarts`), mất khi khởi động lại |
| Tài khoản mẫu | `test@eshop.com` / `Test1234!` (role user), `admin@eshop.com` / `Admin123!` (role admin) |
| Postman | Bản Desktop (ghi thêm phiên bản: [điền]) |
| Node.js | [điền phiên bản trên máy nhóm]; Node 22 khi chạy thử Newman trên Linux |
| Newman | 6 (chạy thử trên Linux); máy nhóm chạy trên Windows (PowerShell), phiên bản: [điền] |

---

## 3. Thiết lập collection

### 3.1. Biến của collection

| Biến | Cách có giá trị | Dùng cho |
|---|---|---|
| `baseUrl` | Điền tay `http://localhost:3000` | Tiền tố URL của mọi request |
| `userToken` | Script của Login User lưu `token` từ response | Request của người dùng thường (kế thừa từ collection) |
| `adminToken` | Script của Login Admin lưu `token` | Request quản trị |
| `orderId` | Script của Checkout lưu `orderId` | Order detail, Cancel order, Admin update status |
| `newUserEmail` | Script Pre-request của Register sinh email theo thời gian | Register, Forgot/Reset password |
| `newUserId` | Script của Register lưu `id` | Admin delete user |
| `resetToken` | Script của Forgot password lưu `resetToken` | Reset password |
| `newProductId`, `newCategoryId`, `newCouponId` | Script của các request tạo mới lưu `id` | Update/Delete tương ứng |
| `tmpEmail`, `tmpToken` | Script của S1, S2 (thư mục `Errors`) | Tài khoản tạm cho các ca lỗi |
| `dd_case`, `dd_email`, `dd_password`, `dd_expected_status`, `dd_expected_error`, `dd_id`, `dd_name_contains` | Giá trị mặc định khi chạy tay; Newman ghi đè bằng từng dòng CSV | Hai request Data-driven (mục 12) |

### 3.2. Xác thực
- Cấp collection: Bearer Token `{{userToken}}`, các request không khai báo riêng sẽ kế thừa.
- Request quản trị: Bearer Token `{{adminToken}}`.
- Request công khai và các request kiểm tra "không có token": No Auth.

### 3.3. Hai nhóm assertion
- Assertion hành vi đúng: kiểm tra status 200, cấu trúc response, giá trị nghiệp vụ.
- Assertion kiểm tra lỗi (negative): kỳ vọng hệ thống từ chối (401/403/404) hoặc không lộ dữ liệu nhạy cảm.

### 3.4. Bộ test tổng hợp (một request)

- Request `00 RUN ALL` gọi `GET /api/categories` (chỉ để kiểm tra server đang chạy), phần Post-response gọi tiếp các API bằng `pm.sendRequest`, mỗi kiểm tra là một `pm.test`.
- Kết quả hiển thị ở tab **Test Results**. Tên test có dạng `U07 [B15] ...`: mã nhóm và số thứ tự, mã lỗi, nội dung kỳ vọng (kèm mã SRS nếu có).
- Biến chỉ có `baseUrl`. Token, id và dữ liệu dùng trong lúc chạy là biến của script, không phải biến collection, nên bộ test này không minh họa chained token bằng collection variables (việc này do collection chính đảm nhiệm).
- Các nhóm test: A (xác thực), U (hồ sơ), P (sản phẩm), C (danh mục), K (giỏ hàng), O (đơn hàng), Q (mã giảm giá), D (quản trị).

---

## 4. Danh sách request và kết quả

Cột "Kết quả" là kết quả assertion sau khi chạy: "Xanh" là mọi assertion đạt, "Đỏ" là có assertion không đạt (xem mục 6).

| # | Thư mục | Request | Endpoint | Token | HTTP thực tế | Kết quả |
|---|---|---|---|---|---|---|
| 1 | Auth | Login User | POST `/api/login` | Không | 200 | Đỏ (lộ mật khẩu) |
| 2 | Auth | Login Admin | POST `/api/login` | Không | 200 | Đỏ (lộ mật khẩu) |
| 3 | Auth | Register | POST `/api/register` | Không | 200 | Xanh |
| 4 | Auth | Forgot Password | POST `/api/forgot-password` | Không | 200 | Đỏ (OTP 4 chữ số, B28) |
| 5 | Auth | Reset password | POST `/api/reset-password` | Không | 200 | Xanh |
| 6 | Products | Get products | GET `/api/products` | Không | 200 | Xanh |
| 7 | Products | Product detail id 1 | GET `/api/products/1` | Không | 200 | Xanh |
| 8 | Products | Product detail id 2 | GET `/api/products/2` | Không | 200 | Đỏ (`price` là chuỗi) |
| 9 | Products | Product not found | GET `/api/products/99999` | Không | 200 | Đỏ (kỳ vọng 404) |
| 10 | Products | Add product | POST `/api/products` | Admin | 200 | Xanh |
| 11 | Products | Add product (No token) | POST `/api/products` | Không | 200 | Đỏ (kỳ vọng bị chặn) |
| 12 | Products | Update product | PUT `/api/products/{{newProductId}}` | Admin | 200 | Xanh |
| 13 | Products | Delete product | DELETE `/api/products/{{newProductId}}` | Admin | 200 | Xanh |
| 14 | Cart | Add to cart | POST `/api/cart` | User | 200 | Xanh |
| 15 | Cart | Get cart | GET `/api/cart` | User | 200 | Xanh |
| 16 | Orders | Checkout | POST `/api/checkout` | User | 200 | Xanh |
| 17 | Orders | Checkout (Mobile payload) | POST `/api/checkout` | User | 200 | Xanh |
| 18 | Orders | My orders | GET `/api/orders/my-orders` | User | 200 | Xanh |
| 19 | Orders | Order detail | GET `/api/orders/{{orderId}}` | User | 200 | Xanh |
| 20 | Orders | Order detail (no token) | GET `/api/orders/{{orderId}}` | Không | 200 | Đỏ (kỳ vọng bị chặn) |
| 21 | Orders - Cancel | Cancel order | PUT `/api/orders/{{orderId}}/cancel` | User | 200 | Xanh |
| 22 | Coupons | Apply coupon | POST `/api/apply-coupon` | User | 200 | Đỏ (tính giảm giá sai) |
| 23 | Coupons | Get coupon | GET `/api/coupons` | Admin | 200 | Xanh |
| 24 | Coupons | Coupon usage | POST `/api/coupon-usage` | User | 200 | Xanh |
| 25 | Admin | [NEG] Admin get users (user token) | GET `/api/admin/users` | User | 200 | Đỏ (kỳ vọng bị chặn) |
| 26 | Admin | Admin get users | GET `/api/admin/users` | Admin | 200 | Xanh |
| 27 | Admin | Admin get orders | GET `/api/admin/orders` | Admin | 200 | Xanh |
| 28 | Admin | Admin update order status | PUT `/api/admin/orders/{{orderId}}/status` | Admin | 200 | Xanh |
| 29 | Admin | Admin import product | POST `/api/admin/import-products` | Admin | 200 | Xanh |
| 30 | Admin | Admin add coupon | POST `/api/admin/coupons` | Admin | 200 | Xanh |
| 31 | Admin | Admin delete coupon | DELETE `/api/admin/coupons/{{newCouponId}}` | Admin | 200 | Xanh |
| 32 | Admin | Admin delete user | DELETE `/api/admin/users/{{newUserId}}` | Admin | 200 | Xanh |
| 33 | Users | Get profile | GET `/api/users/me` | User | 200 | Đỏ (lộ `password`, `reset_token`) |
| 34 | Users | Update profile | PUT `/api/users/me` | User | 200 | Xanh |
| 35 | Categories | Get category | GET `/api/categories` | Không | 200 | Xanh |
| 36 | Categories | Add category | POST `/api/categories` | Admin | 200 | Xanh |
| 37 | Categories | Update category | PUT `/api/categories/{{newCategoryId}}` | Admin | 200 | Xanh |
| 38 | Categories | Delete category | DELETE `/api/categories/{{newCategoryId}}` | Admin | 200 | Xanh |

### Tổng hợp
- 38 request, **28 request xanh hoàn toàn**.
- **10 request có assertion đỏ** (tổng 17 assertion, tính cả các checkpoint JSON Schema của bản v3), tương ứng **9 lỗi** (B1 đến B8 và B28) ở mục 6. Kết quả chạy `npm run test:full` trên máy nhóm ngày 23/10/2026 (Windows): 68 request, 131 assertion, 18 đỏ (17 ở request chính, 1 ở Data-driven).
- Cả 38 request chính đều trả HTTP 200, kể cả các trường hợp lẽ ra phải là 401, 403 hoặc 404. Điều này chính là điểm cần chú ý: kiểm thử chỉ dựa vào mã trạng thái sẽ không phát hiện được lỗi nào trong 9 lỗi B1 đến B8 và B28.
- Bảng này chỉ tính 38 request chính. Các ca trong thư mục `Errors` được tổng hợp riêng ở mục 6.

---

## 5. Cấu trúc response thật của các endpoint

Spec gốc phần lớn ghi "không nêu chi tiết" về response. Kết quả khảo sát:

| Endpoint | Response thật |
|---|---|
| POST `/api/register` | `{message, id}` |
| POST `/api/login` | `{message, token, user{id, name, email, password, role, login_attempts, locked_until, reset_token, shipping_address, phone}}` |
| POST `/api/forgot-password` | `{message, resetToken}` (chuỗi 4 chữ số) |
| POST `/api/reset-password` | `{message}` |
| GET `/api/users/me` | Object người dùng đầy đủ như trong `user` của login |
| PUT `/api/users/me` | `{message}` ("Profile updated") |
| GET `/api/products` | Mảng `{id, name, price, description, imageUrl, category_id}` |
| GET `/api/products/{id}` | Object sản phẩm như trên. Id không tồn tại trả `{}` |
| POST/PUT/DELETE `/api/products` | `{message, id}` / `{message}` / `{message}` |
| GET `/api/categories` | Mảng `{id, name}` |
| POST/PUT/DELETE `/api/categories` | `{message, id}` / `{message}` / `{message}` |
| GET `/api/cart` | Mảng `{id, name, price, quantity}` |
| POST `/api/cart` | `{message}` ("Added to cart") |
| POST `/api/checkout` | `{message, orderId}` |
| GET `/api/orders/my-orders`, GET `/api/orders/{id}` | `{id, user_id, total_amount, status, shipping_address, created_at}` (không có danh sách món hàng) |
| PUT `/api/orders/{id}/cancel` | `{message}` |
| POST `/api/apply-coupon` | `{success, coupon_id, discount_amount, final_amount, message}` |
| POST `/api/coupon-usage` | `{message}` ("Usage recorded") |
| GET `/api/coupons` | Mảng `{id, code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user}` |
| GET `/api/admin/users` | Mảng `{id, name, email, role, login_attempts, locked_until, shipping_address}` (không có `password`) |
| GET `/api/admin/orders` | Như đơn hàng thường, thêm `user_name` |
| PUT `/api/admin/orders/{id}/status` | `{message}` |
| POST `/api/admin/import-products` | `{message, inserted, errors[]}` |
| POST `/api/admin/coupons` | `{message, id}` |
| DELETE `/api/admin/coupons/{id}`, `/api/admin/users/{id}` | `{message}` |

Ghi chú định dạng: `created_at` có dạng `2026-10-13 12:25:29` (không phải ISO 8601 và không có múi giờ).

---

## 6. Danh sách lỗi phát hiện

| ID | Lỗi | Mức độ | Request chứng minh | Kỳ vọng | Thực tế |
|---|---|---|---|---|---|
| B1 | Đăng nhập trả về mật khẩu dạng chữ thường | Cao | #1, #2 | `user` không chứa `password` | `user.password` có giá trị `Test1234!` / `Admin123!` |
| B2 | Hồ sơ cá nhân lộ `password` và `reset_token` | Cao | #33 | Response không chứa hai trường này | Cả hai đều xuất hiện |
| B3 | Kiểu dữ liệu `price` không nhất quán | Trung bình | #8 | `price` là số | Sản phẩm id 2 trả `"28000000"` (chuỗi) |
| B4 | Tính giảm giá phần trăm sai | Cao | #22 | Đơn 1.000.000 với SAVE10 (10%): giảm 100.000, thành tiền 900.000 | `discount_amount = -9000000`, `final_amount = 10000000` (lớn hơn tổng ban đầu) |
| B5 | Người dùng thường gọi được API quản trị | Cao | #25 | 401 hoặc 403 | 200 kèm danh sách toàn bộ người dùng |
| B6 | Xem chi tiết đơn hàng không cần đăng nhập | Cao | #20 | 401 | 200 kèm dữ liệu đơn hàng |
| B7 | Sản phẩm không tồn tại trả 200 `{}` | Thấp | #9 | 404 | 200 và `{}` |
| B8 | Thêm sản phẩm không cần đăng nhập | Cao | #11 | 401 hoặc 403 | 200, tạo thành công sản phẩm mới (id 7) |
| B9 | Đăng ký chấp nhận email đã tồn tại | Trung bình | E5 | 400 hoặc 409 | 200, tạo thêm tài khoản thứ hai với email `test@eshop.com` |
| B10 | Đăng ký không kiểm tra dữ liệu đầu vào | Trung bình | E6 | 400 | Body `{}` vẫn trả 200 và tạo tài khoản mới |
| B11 | Thêm sản phẩm không kiểm tra dữ liệu đầu vào | Trung bình | E21 đến E25 | 400 khi thiếu `name`, `price` hoặc `category_id` | Body rỗng hoặc thiếu bất kỳ trường nào đều trả 200 và tạo sản phẩm |
| B12 | Sửa và xóa sản phẩm không tồn tại vẫn báo thành công | Thấp | E13, E14 | 404 | 200 với "Product updated" và "Product deleted" |
| B13 | Thanh toán không kiểm tra giỏ hàng và tổng tiền | Cao | E16 | Giỏ trống thì từ chối (400) | Giỏ trống và `total_amount = 1000` vẫn tạo được đơn (`orderId: 1`) |
| B14 | Mã giảm giá từ chối đơn có giá trị đúng bằng mức tối thiểu | Trung bình | E20, Q04 | SAVE10 (tối thiểu 300.000) chấp nhận đơn 300.000 (FR-09 C3: `>=`) | 400 "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫" (so sánh `>` thay vì `>=`) |
| B15 | Người dùng tự đổi được `role` thành admin | Cao | U07 | `role` không đổi được qua API hồ sơ (SEC-06, FR-04) | `PUT /api/users/me` với `"role":"admin"` thành công, `GET /api/users/me` trả `role = admin` |
| B16 | Cập nhật hồ sơ xóa dữ liệu không được gửi | Trung bình | U06 | Trường không gửi giữ nguyên | Chỉ gửi `name` thì `shipping_address` và `phone` thành `null` |
| B17 | Tìm kiếm sản phẩm bị SQL injection | Cao | P08, P09 | Tham số tìm kiếm được xử lý an toàn (SEC-05) | Dấu `'` gây lỗi 500 trả HTML; chuỗi `zzz' OR 1=1 --` trả toàn bộ sản phẩm |
| B18 | Giỏ hàng nhận body bất kỳ | Thấp | K03 | Body `{}` bị từ chối (400) (FR-06) | 200 "Added to cart" |
| B19 | Giỏ hàng tin giá do client gửi | Trung bình | K04 | Giá lấy từ danh mục sản phẩm (30.000.000) | Lưu đúng giá 1 mà client gửi |
| B20 | Giỏ hàng không bị xóa sau khi thanh toán | Trung bình | K05 | Giỏ rỗng sau checkout (FR-08) | Giỏ vẫn còn nguyên các món |
| B21 | User hủy được đơn đang `shipping` | Trung bình | O20 | 400 (FR-10, FR-20) | 200 "Order canceled successfully" |
| B22 | Admin chuyển được đơn `canceled` sang `delivered` | Trung bình | O14 | 400, vì `canceled` là trạng thái kết thúc (FR-10) | 200 "Order status updated" (code có điều kiện riêng cho cặp này) |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ `user_id` | Trung bình | Q13 | Giới hạn lượt dùng vẫn áp dụng (FR-09 C5) | 200, không kiểm tra lượt dùng khi body không có `user_id` |
| B24 | Các API quản trị không kiểm tra `role` | Cao | C04, C09, O22, Q16, Q17, Q20, D05, D09, D10 | 403 với người dùng thường (FR-12, SEC-03) | 200 và thao tác được thực hiện: thêm và xóa danh mục, đổi trạng thái đơn, xem danh sách mã giảm giá, tạo và xóa mã giảm giá, xem đơn toàn hệ thống, import sản phẩm, xóa người dùng khác |
| B25 | Thêm cùng một sản phẩm tạo thêm dòng mới trong giỏ | Thấp | K02b | 1 dòng với `quantity = 2` (FR-07) | 2 dòng riêng |
| B26 | `apply-coupon` không yêu cầu đăng nhập | Trung bình | Q08b | 401 (FR-09 C4) | 200. Lưu ý `api_specification.md` ghi endpoint này không cần token, mâu thuẫn với SRS (xem mục 7) |
| B27 | Khóa tài khoản sai ngưỡng và thời gian | Thấp | A06 | Khóa từ lần sai thứ 3, trong 30 giây, bộ đếm tăng đúng 1 (FR-02) | Khóa ngay sau lần sai thứ 2 (bộ đếm tăng 2), trong 3 phút |
| B28 | Mã OTP đặt lại mật khẩu chỉ có 4 chữ số | Trung bình | A11 | 6 chữ số (FR-03, SEC-07) | 4 chữ số, trả thẳng trong response |
| B29 | Tạo mã giảm giá trùng `code` trả 500 | Thấp | Q19 | 400 hoặc 409 | 500 kèm thông điệp lỗi của cơ sở dữ liệu (lộ chi tiết nội bộ) |
| B30 | Hồ sơ không kiểm tra số điện thoại | Thấp | U08 | Số điện thoại bắt đầu bằng 0, 10 đến 11 chữ số (FR-04) | `phone: "9999"` trả 200 "Profile updated" |
| B31 | Thêm sản phẩm chấp nhận giá âm | Trung bình | P19 | Giá lớn hơn 0 (FR-15), trả 400 | `price: -50000` trả 200 "Product created" |
| B32 | Import không rollback và không kiểm tra giá | Trung bình | D13 | Có dòng lỗi thì không lưu dòng nào (FR-16) | Import một dòng hợp lệ và một dòng `price: -100` trả "2/2 sản phẩm được thêm", `errors: []` |
| B33 | Admin xóa được chính tài khoản đang đăng nhập | Trung bình | D14 | 400 hoặc 403 (FR-19) | `DELETE /admin/users/{id của mình}` trả 200; tài khoản bị xóa không đăng nhập lại được |

B30 đến B33 do thí nghiệm AI phát hiện (test T06, T08, T09, T18 của điều kiện B sinh từ SRS, xem `AI_Run_Log.md` (mục 13)), sau đó được kiểm chứng trực tiếp và đưa vào bộ test tổng hợp. Test D14 dùng một tài khoản admin tạm (tạo nhờ lỗi B15) để không xóa mất tài khoản admin mẫu; nếu B15 được sửa, test này tự bỏ qua.

Mở rộng của các lỗi trước (bộ test tổng hợp): B6 còn gồm xem đơn của người khác (O08); B8 còn gồm sửa và xóa sản phẩm không cần token (P16, P17); B11 còn gồm thêm danh mục và mã giảm giá với body rỗng (C05, Q18); B12 còn gồm sửa, xóa danh mục và xóa người dùng không tồn tại (C07, C08, D12); B13 còn gồm tổng tiền sai lệch với giỏ hàng (O04); B10 còn gồm việc đăng ký chấp nhận email sai định dạng và mật khẩu yếu (ví dụ E5 đã chấp nhận mật khẩu `x`, FR-01).

### Cách tái hiện nhanh
1. Khởi động lại server (reset dữ liệu).
2. B1, B2: chạy Login User rồi Get profile, xem body.
3. B3: GET `/api/products/2`, xem `price` có dấu nháy.
4. B4: POST `/api/apply-coupon` với `{"code":"SAVE10","total_amount":1000000,"user_id":2}`.
5. B5: đăng nhập user thường, gọi GET `/api/admin/users`.
6. B6: tạo một đơn (Checkout), rồi GET `/api/orders/{id}` và chọn No Auth.
7. B7: GET `/api/products/99999`.
8. B8: POST `/api/products` và chọn No Auth.
9. B9, B10: POST `/api/register` với email `test@eshop.com`, rồi với body `{}`.
10. B11: POST `/api/products` bằng `adminToken` với body `{}`.
11. B12: PUT và DELETE `/api/products/99999` bằng `adminToken`.
12. B13: đăng nhập tài khoản mới (giỏ trống), POST `/api/checkout` với `{"total_amount":1000,"shipping_address":"x"}`.
13. B14: POST `/api/apply-coupon` với `{"code":"SAVE10","total_amount":300000,"user_id":2}`.
14. B15 đến B33: chạy bộ test tổng hợp, mỗi lỗi ứng với test có mã lỗi trong tên (bảng ở trên ghi mã test).

### Kết quả đợt kiểm tra phản hồi lỗi (thư mục Errors)

Tất cả phản hồi lỗi đều là JSON (`application/json; charset=utf-8`) với dạng `{"error": "<thông điệp>"}`. Chưa thấy phản hồi HTML ở các tình huống đã thử.

| Ca | Tình huống | Status | Nội dung | Nhận xét |
|---|---|---|---|---|
| E1 | Đăng nhập, email không tồn tại | 401 | `Invalid email or password` | Đúng kỳ vọng |
| E2, E3 | Đăng nhập sai mật khẩu 2 lần liên tiếp | 401 | `Invalid email or password` | Thông điệp không tiết lộ email có tồn tại hay không |
| E4 | Đăng nhập đúng mật khẩu sau 2 lần sai | 403 | `Tài khoản đã bị khóa. Vui lòng thử lại sau.` | Tài khoản bị khóa sau 2 lần sai (cần đối chiếu SRS FR-02 về ngưỡng và thời gian mở khóa) |
| E5 | Đăng ký trùng email | 200 | `User registered successfully` | Lỗi B9 |
| E6 | Đăng ký với body `{}` | 200 | `User registered successfully` | Lỗi B10 |
| E7 | Quên mật khẩu, email không tồn tại | 404 | `User not found` | Cho phép dò xem email nào đã đăng ký |
| E8 | Đặt lại mật khẩu với mã sai | 400 | `Invalid token or email` | Đúng kỳ vọng |
| E9 | Giỏ hàng, không có token | 401 | `Unauthorized` | Đúng kỳ vọng |
| E10 | Giỏ hàng, token sai (`abc`) | 403 | `Forbidden` | Đúng kỳ vọng |
| E11 | API admin, không có token | 401 | `Unauthorized` | Đúng kỳ vọng |
| E12 | Xem đơn hàng không tồn tại (id 99999) | 404 | `Order not found` | Đúng kỳ vọng, trái với sản phẩm không tồn tại (B7) |
| E13 | Sửa sản phẩm không tồn tại | 200 | `Product updated` | Lỗi B12 |
| E14 | Xóa sản phẩm không tồn tại | 200 | `Product deleted` | Lỗi B12 |
| E15 | Hủy đơn đã hủy | 404 | `Order not found` | **Chưa có giá trị kiểm tra**: lúc chạy chưa có đơn nào, nên mới ra 404. Cần chạy lại (xem mục 10) |
| E16 | Thanh toán với giỏ trống, `total_amount = 1000` | 200 | `Checkout successful`, `orderId: 1` | Lỗi B13 |
| E17 | Mã giảm giá không tồn tại | 404 | `Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa` | Đúng kỳ vọng |
| E18 | Mã EXPIRED với đơn 1.000.000 | 400 | `Mã giảm giá đã hết hạn` | Đúng kỳ vọng |
| E19 | SAVE10 với đơn 100.000 (dưới mức tối thiểu) | 400 | `Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này` | Đúng kỳ vọng |
| E20 | SAVE10 với đơn đúng 300.000 | 400 | Như E19 | Lỗi B14 |
| E21 đến E25 | Thêm sản phẩm với body rỗng hoặc thiếu từng trường | 200 | `Product created`, id 7 đến 11 | Lỗi B11: không có trường nào bắt buộc, kể cả khi thiếu cùng lúc `name`, `price`, `category_id` |
| E26 | Admin đổi trạng thái đơn sang `abc` | 400 | `Invalid state transition from pending to abc` | Backend có kiểm tra chuyển trạng thái; cần thử thêm các chuyển hợp lệ và không hợp lệ cụ thể |

Lưu ý về dữ liệu sau đợt này: các ca E5, E6, E16 và E21 đến E25 đã ghi dữ liệu rác vào cơ sở dữ liệu (tài khoản trùng email `test@eshop.com`, tài khoản rỗng, sản phẩm thiếu trường, một đơn hàng giỏ trống). Cần khởi động lại server trước khi chạy tiếp.

### Kết quả bộ test tổng hợp

| Chỉ số | Giá trị |
|---|---|
| Số assertion | 118 |
| Đạt | 62 |
| Không đạt | 56 |
| Số request (Newman) | 202 (gồm request kích hoạt `GET /api/categories`) |
| Chạy lặp lại | Hai lần liên tiếp không khởi động lại server cho kết quả giống hệt nhau |

- 56 assertion không đạt tương ứng 33 lỗi (B1 đến B33) và 1 ghi nhận (O2: JWT không có `exp`, test A17). Mỗi test đỏ đều có mã lỗi trong tên, không có test đỏ do sai script.
- Phân bố test đỏ theo lỗi: B1 (A02), B2 (U02, U03), B3 (P04), B4 (Q01, Q02), B5 (D02), B6 (O07, O08), B7 (P05), B8 (P10, P16, P17), B9 (A08), B10 (A09), B11 (P12, P13, C05, Q18), B12 (P15, P18, C07, C08, D12), B13 (O03, O04), B14 (Q04), B15 (U07), B16 (U06), B17 (P08, P09), B18 (K03), B19 (K04), B20 (K05), B21 (O20), B22 (O14), B23 (Q13), B24 (9 test), B25 (K02b), B26 (Q08b), B27 (A06), B28 (A11), B29 (Q19), B30 (U08), B31 (P19), B32 (D13), B33 (D14), O2 (A17).
- Các test đạt xác nhận những hành vi đúng: đăng nhập sai và email lạ cùng thông điệp, mã OTP chỉ dùng một lần và chỉ đúng cho email đã yêu cầu, đơn hàng chỉ hủy được bởi chủ đơn, lịch sử đơn chỉ chứa đơn của mình, state machine chặn các chuyển trạng thái bỏ bước, mã giảm giá hết hạn và dưới mức tối thiểu bị từ chối, import báo lỗi đúng với danh sách rỗng và dòng thiếu tên.
- Bản 114 assertion (52 đỏ, 62 xanh) đã được kiểm tra trên máy của nhóm và khớp với kỳ vọng. Bản 118 assertion (thêm B30 đến B33) đã chạy hai lần liên tiếp trong môi trường của trợ lý (56 đỏ, 62 xanh) và chạy bằng `npm run test:allin1` trên máy nhóm (Windows) ngày 23/10/2026: 202 request, 118 assertion, 56 đỏ, 62 xanh, 3,2 giây; 56 test đỏ đúng với phân bố theo lỗi ở trên (B1 đến B33 và O2).

---

## 7. Điểm không khớp giữa đặc tả, ứng dụng mobile và backend

| Nội dung | Đặc tả (`api_specification.md`) | Ứng dụng mobile | Backend thực tế |
|---|---|---|---|
| Endpoint `POST /api/coupon-usage` | Không có | Có gọi sau khi checkout có dùng mã | Có, trả `{message: "Usage recorded"}` |
| Body của checkout | `total_amount`, `shipping_address` | `items`, `total_amount`, `coupon_id` (không gửi `shipping_address`) | Chấp nhận cả hai kiểu; đơn tạo từ payload mobile có `shipping_address` là `null` |
| Giỏ hàng `/api/cart` | Có | Không gọi (giỏ hàng giữ trong app) | Có |
| Response login | `token`, `user` | Đọc `token`, `user` | Thêm trường `message` |
| Token cho `apply-coupon` | `api_specification.md`: không cần. SRS FR-09 C4: phải đăng nhập | Không gửi token | Không yêu cầu token (B26) |
| Khóa tài khoản | SRS FR-02: khóa từ lần sai thứ 3, trong 30 giây, bộ đếm +1 | Không liên quan | Khóa sau 2 lần sai (bộ đếm +2), trong 3 phút (B27) |
| Mã OTP đặt lại mật khẩu | SRS FR-03: 6 chữ số | Gửi lại mã người dùng nhập | 4 chữ số (B28) |
| Quyền của API quản trị | SRS FR-12: phải có `role = admin` | Không gọi API quản trị | Chỉ kiểm tra token (B5, B24) |
| Token cho `GET /api/orders/{id}` | Cần | Không dùng endpoint này | Không yêu cầu token (B6) |

Ghi chú:
- Theo code `server.js`, endpoint checkout chỉ đọc `total_amount` và `shipping_address`, **không đọc và không lưu** trường `items` mà mobile gửi lên. Bảng đơn hàng cũng không có cột món hàng.
- `api_specification.md` và SRS mâu thuẫn nhau về `apply-coupon` (không cần token so với phải đăng nhập). Mobile hiện không gửi token cho endpoint này, nên nếu backend được sửa theo SRS thì mobile sẽ bị lỗi khi áp mã

---

## 8. Ghi nhận bổ sung

- `resetToken` chỉ gồm 4 chữ số và được trả thẳng trong response của `forgot-password` (đặc tả cũng ghi như vậy), nên dễ bị dò; SRS yêu cầu 6 chữ số (B28).
- Payload của JWT chỉ gồm `id`, `role`, `iat`, không có `exp` (test A17). Khóa ký JWT được khai báo cứng trong `server.js` với tên `SECRET_KEY = "super_secret_key_that_should_not_be_here"`.
- Mật khẩu được lưu chữ thường trong cơ sở dữ liệu và bị trả ra trong response (SEC-01, B1, B2).
- Các câu lệnh `SELECT *` trả cả các cột nhạy cảm của bảng người dùng.
- Nhiều thao tác ghi dữ liệu (thêm, sửa, xóa) đều trả 200 và chỉ có `message`, không có mã 201 cho trường hợp tạo mới.
- Trong 38 request chính, mọi lỗi lệch đặc tả đều trả 200, nên các công cụ chỉ kiểm tra mã trạng thái không thể phát hiện. Hệ thống có trả đúng 401, 403, 404 hoặc 400 cho đăng nhập sai, thiếu hoặc sai token, đơn hàng không tồn tại, mã giảm giá và trạng thái đơn không hợp lệ. Nhưng việc kiểm tra dữ liệu đầu vào ở đăng ký, thêm sản phẩm, danh mục, mã giảm giá, giỏ hàng và checkout gần như không có.
- Thông điệp lỗi không thống nhất về ngôn ngữ: lỗi tài khoản bị khóa và mã giảm giá viết bằng tiếng Việt, các lỗi khác bằng tiếng Anh.
- `forgot-password` với email không tồn tại trả 404 `User not found`, trong khi đăng nhập sai dùng thông điệp chung. Điều này cho phép dò xem email nào đã đăng ký.
- Lỗi cơ sở dữ liệu có thể lộ ra ngoài: tìm kiếm với dấu `'` trả HTML `Database Error` (B17), tạo mã giảm giá trùng trả thông điệp lỗi của SQLite (B29).
- Hai lỗi phía ứng dụng mobile (`parsed + 1` khi sửa số lượng, `cart.slice(0, -1)` khi thanh toán) không bị API test hay hợp đồng bắt được, và vì backend bỏ qua trường `items` nên lỗi thứ hai không ảnh hưởng đến dữ liệu đơn hàng.

---

## 9. Yêu cầu SRS và giả thuyết chưa được kiểm thử

Các mục dưới đây đến từ đọc code `server.js` và đối chiếu SRS, chưa có test chạy thật. Bốn mục từng nằm ở đây (số điện thoại, giá âm, import không rollback, admin tự xóa) đã được xác nhận thành B30 đến B33.

| Nội dung | SRS | Giả thuyết từ code | Cách kiểm tra |
|---|---|---|---|
| Đăng ký không kiểm tra định dạng email và độ mạnh mật khẩu | FR-01 | Không có validation (E5 đã chấp nhận mật khẩu `x`) | Đăng ký với email `abc` và mật khẩu yếu |
| Đặt lại mật khẩu không kiểm tra độ mạnh mật khẩu mới | FR-03 | Không có validation | Đặt lại với mật khẩu `1` |
| Sản phẩm: giá bằng 0, tên dài hơn 255 ký tự, danh mục không tồn tại (giá âm đã xác nhận là B31) | FR-15 | Không có validation | `POST /products` với các giá trị đó |
| Số lượng trong giỏ hàng là số âm hoặc 0 | FR-06 | Không có validation | `POST /cart` với `quantity` là `-1` |
| Mã giảm giá: `discount_value` âm, `type` không hợp lệ | FR-17 | Không có validation | `POST /admin/coupons` với các giá trị đó |
| Mã OTP không có thời hạn | SEC-07 | Cơ sở dữ liệu không lưu thời điểm hết hạn | Đọc code; khó kiểm tra bằng test nhanh |
| Giả mạo token bằng khóa cứng trong code | SEC-02 | Khóa nằm trong `server.js` | Tạo JWT với khóa đó rồi gọi API |
| Mã EXPIRED với đơn nhỏ hơn mức tối thiểu báo "chưa đủ giá trị tối thiểu" thay vì "hết hạn" | FR-09 | Code kiểm tra ngưỡng trước hạn dùng | Gọi `apply-coupon` với EXPIRED và đơn 50.000 |

---

## 10. Hạn chế và việc tiếp theo

### Hạn chế
- Bộ test tổng hợp gom cả bộ test vào một request, nên không minh họa được từng request, response mẫu và chained token bằng collection variables như collection chính.
- Kết quả đúng với bản mã nguồn repo tại thời điểm chạy; nếu repo thay đổi, cần chạy lại.

### Việc tiếp theo

| # | Việc | Trạng thái |
|---|---|---|
| 1 | Kiểm tra JSON Schema (checkpoint) cho Get products, Product detail, Login trong collection chính | Đã làm trong collection v3 (mục 12) |
| 2 | Kiểm thử Data-driven cho đăng nhập bằng CSV | Đã làm, mở rộng thêm cả chi tiết sản phẩm (mục 12) |
| 3 | Kiểm thử các mục ở mục 9 | Còn lại: số lượng giỏ hàng âm hoặc 0, `discount_value` âm, giả mạo JWT bằng khóa cứng, đặt lại mật khẩu yếu, sản phẩm giá 0 hoặc tên quá dài |
| 4 | Chạy tự động bằng Newman và xuất báo cáo HTML | Đã làm (mục 12) |
| 5 | Đối chiếu `openapi.yaml` với collection | Đã cập nhật B1 đến B33; cần đối chiếu lại nếu có thay đổi |
| 6 | Xây hợp đồng Pact cho ứng dụng mobile | [điền trạng thái, chưa có tài liệu trong đợt tổng hợp này] |
| 7 | Hỏi giảng viên về mâu thuẫn `api_specification.md` và SRS ở `apply-coupon` | [điền kết quả]. Skill ở mục 14 đã chọn theo SRS (401) |
| 8 | Hoàn thiện báo cáo thí nghiệm AI và đưa vào báo cáo chung | Đã làm (mục 13) |
| 9 | Chạy lại bộ test tổng hợp 118 assertion trên máy nhóm | Đã làm (23/10/2026): 56 đỏ, 62 xanh |
| 10 | Chạy lại AC10 sau khi sửa script Karate, thêm ca "bỏ `user_id`" cho B23 | Còn lại (mục 14); Postman đã xác nhận AC10 là lỗi script |

---

## 11. Hướng dẫn tái lập

### Collection chính
1. Clone repo `ttbhanh/eshop-sut`, vào thư mục `backend`, chạy `npm install`.
2. Chạy `node server.js` (thấy dòng `Server is running on http://localhost:3000`).
3. Mở Postman, chọn Import, chọn `eshop_api_postman_collection_v3.json`.
4. Vào tab Variables của collection, kiểm tra `baseUrl` là `http://localhost:3000`.
5. Chạy theo thứ tự: Login User, Login Admin, rồi lần lượt các request theo mục 4. Các request phụ thuộc biến (`orderId`, `newProductId`...) cần chạy sau request tạo ra biến đó.
6. Muốn chạy lại từ đầu: dừng và khởi động lại server để reset dữ liệu.

### Bộ test tổng hợp
1. Khởi động lại server.
2. Mở Postman, chọn Import, chọn `eshop_api_all_tests.postman_collection.json`.
3. Mở request `00 RUN ALL`, bấm Send, xem tab Test Results (kỳ vọng 62 đạt, 56 không đạt).
4. Nếu test đầu tiên (`00 Môi trường sẵn sàng`) không đạt: server chưa chạy hoặc tài khoản mẫu đang bị khóa; khởi động lại server rồi chạy lại.

