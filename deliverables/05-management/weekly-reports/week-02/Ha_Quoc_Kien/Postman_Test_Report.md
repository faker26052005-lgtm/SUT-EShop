# Báo Cáo Kiểm Thử API Bằng Postman — EShop

> **Chủ đề:** API Testing & Contract Testing (T06)
> **Công cụ:** Postman (Desktop)
> **Hệ thống được kiểm thử (SUT):** EShop, backend Node.js/Express + SQLite, repo `ttbhanh/eshop-sut`
> **Ngày chạy:** 13/10/2026
> **Tệp minh chứng:** `eshop_api_postman_collection.json` (collection kèm response mẫu của từng request)

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
- Tổng cộng **38 request**, chia vào 8 thư mục: Auth, Products, Cart, Orders, Coupons, Admin, Users, Categories.

### 1.3. Phương pháp
1. Đọc `api_specification.md` và lập bảng endpoint.
2. Đọc code backend (`server.js`, `database.js`) để hiểu cách tạo response và các giả thuyết về lỗi.
3. Gọi từng endpoint bằng Postman, ghi lại status code và cấu trúc response thật.
4. Viết assertion theo **hành vi mong đợi theo đặc tả**, không theo hành vi hiện tại của hệ thống. Vì vậy assertion đỏ nghĩa là hệ thống lệch đặc tả, tức là một lỗi cần ghi nhận.
5. Chạy tuần tự trên dữ liệu vừa được reset, lưu response mẫu bằng "Save as example", export collection.

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
| Node.js | [điền phiên bản] |

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

### 3.2. Xác thực
- Cấp collection: Bearer Token `{{userToken}}`, các request không khai báo riêng sẽ kế thừa.
- Request quản trị: Bearer Token `{{adminToken}}`.
- Request công khai và các request kiểm tra "không có token": No Auth.

### 3.3. Hai nhóm assertion
- Assertion hành vi đúng: kiểm tra status 200, cấu trúc response, giá trị nghiệp vụ.
- Assertion kiểm tra lỗi (negative): kỳ vọng hệ thống từ chối (401/403/404) hoặc không lộ dữ liệu nhạy cảm.

---

## 4. Danh sách request và kết quả

Cột "Kết quả" là kết quả assertion sau khi chạy: "Xanh" là mọi assertion đạt, "Đỏ" là có assertion không đạt (xem mục 6).

| # | Thư mục | Request | Endpoint | Token | HTTP thực tế | Kết quả |
|---|---|---|---|---|---|---|
| 1 | Auth | Login User | POST `/api/login` | Không | 200 | Đỏ (lộ mật khẩu) |
| 2 | Auth | Login Admin | POST `/api/login` | Không | 200 | Đỏ (lộ mật khẩu) |
| 3 | Auth | Register | POST `/api/register` | Không | 200 | Xanh |
| 4 | Auth | Forgot Password | POST `/api/forgot-password` | Không | 200 | Xanh |
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
| 21 | Orders | Cancel order | PUT `/api/orders/{{orderId}}/cancel` | User | 200 | Xanh |
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
- 38 request, **29 request xanh hoàn toàn**.
- **9 request có assertion đỏ** (tổng 11 assertion), tương ứng **8 lỗi** ở mục 6.
- Cả 38 request đều trả HTTP 200, kể cả các trường hợp lẽ ra phải là 401, 403 hoặc 404. Điều này chính là điểm cần chú ý: kiểm thử chỉ dựa vào mã trạng thái sẽ không phát hiện được lỗi nào trong 8 lỗi dưới đây.

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

### Cách tái hiện nhanh
1. Khởi động lại server (reset dữ liệu).
2. B1, B2: chạy Login User rồi Get profile, xem body.
3. B3: GET `/api/products/2`, xem `price` có dấu nháy.
4. B4: POST `/api/apply-coupon` với `{"code":"SAVE10","total_amount":1000000,"user_id":2}`.
5. B5: đăng nhập user thường, gọi GET `/api/admin/users`.
6. B6: tạo một đơn (Checkout), rồi GET `/api/orders/{id}` và chọn No Auth.
7. B7: GET `/api/products/99999`.
8. B8: POST `/api/products` và chọn No Auth.

---

## 7. Điểm không khớp giữa đặc tả, ứng dụng mobile và backend

| Nội dung | Đặc tả (`api_specification.md`) | Ứng dụng mobile | Backend thực tế |
|---|---|---|---|
| Endpoint `POST /api/coupon-usage` | Không có | Có gọi sau khi checkout có dùng mã | Có, trả `{message: "Usage recorded"}` |
| Body của checkout | `total_amount`, `shipping_address` | `items`, `total_amount`, `coupon_id` (không gửi `shipping_address`) | Chấp nhận cả hai kiểu; đơn tạo từ payload mobile có `shipping_address` là `null` |
| Giỏ hàng `/api/cart` | Có | Không gọi (giỏ hàng giữ trong app) | Có |
| Response login | `token`, `user` | Đọc `token`, `user` | Thêm trường `message` |
| Token cho `apply-coupon` | Không cần | Không gửi token | Không yêu cầu token |
| Token cho `GET /api/orders/{id}` | Cần | Không dùng endpoint này | Không yêu cầu token (B6) |

Ghi chú: danh sách đơn hàng không chứa các món hàng, nên chưa xác định được backend có lưu hoặc xử lý trường `items` mà mobile gửi lên hay không.

---

## 8. Ghi nhận bổ sung

- `resetToken` chỉ gồm 4 chữ số và được trả thẳng trong response của `forgot-password` (đặc tả cũng ghi như vậy), nên dễ bị dò.
- Payload của JWT sau khi giải mã chỉ gồm `id`, `role`, `iat`, không có `exp` (thời điểm hết hạn).
- Nhiều thao tác ghi dữ liệu (thêm, sửa, xóa) đều trả 200 và chỉ có `message`, không có mã trạng thái riêng cho trường hợp tạo mới (201).
- Mọi lỗi nghiệp vụ trong các request đã chạy đều trả 200, nên các công cụ chỉ kiểm tra mã trạng thái không thể phát hiện.

---

## 9. Giả thuyết từ đọc code, chưa kiểm chứng bằng Postman

| Giả thuyết | Cần kiểm tra |
|---|---|
| `PUT /api/users/me` nhận trường `role` trong body, cho phép tự nâng quyền | Gửi thêm `"role":"admin"` rồi xem Get profile |
| Mỗi lần đăng nhập sai cộng 2 lần thử thay vì 1, và khóa tạm thời | Đăng nhập sai trên tài khoản dùng thử, quan sát `login_attempts` |
| Tìm kiếm `GET /api/products?search=` nối chuỗi trực tiếp vào câu SQL | Thử `search=%27` và quan sát lỗi |
| Hủy đơn chỉ chặn trạng thái `delivered` và `canceled`, đơn đang `shipping` vẫn hủy được | Admin chuyển đơn sang `shipping` rồi hủy |
| Admin chuyển trạng thái tùy ý, kể cả `canceled` sang `delivered` | Thử các chuyển trạng thái không hợp lệ |
| Mã giảm giá kiểm tra số tiền tối thiểu bằng `>` thay vì `>=` | Thử đơn đúng bằng mức tối thiểu |
| Backend tin giá trị `total_amount` do client gửi ở checkout | Gửi `total_amount` nhỏ hơn thực tế |
| Backend tin `price` do client gửi khi thêm vào giỏ | Gửi giá thấp hơn thật |
| Xem đơn của người khác chỉ cần biết id | Đăng nhập user khác rồi gọi `/api/orders/{id}` |

---

## 10. Hạn chế và việc tiếp theo

### Hạn chế của lần chạy này
- Các request chạy tuần tự bằng tay, chưa chạy bằng Collection Runner hay Newman.
- Thứ tự thư mục trong collection chưa tối ưu cho Runner (ví dụ Cancel order nằm trước Admin update status).
- Dữ liệu chưa được reset giữa các lần chạy lặp, nên các assertion phụ thuộc số lượng (5 sản phẩm, 3 danh mục) chỉ đúng trên dữ liệu mới.
- Chưa có kiểm tra JSON Schema, chưa có kiểm thử theo dữ liệu (CSV).

### Việc tiếp theo
1. Sắp xếp lại thứ tự request, chạy bằng Collection Runner trên dữ liệu vừa reset.
2. Thêm kiểm tra JSON Schema (checkpoint) cho các response chính.
3. Thêm kiểm thử theo dữ liệu (data-driven) cho đăng nhập bằng tệp CSV.
4. Kiểm chứng các giả thuyết ở mục 9.
5. Chạy tự động bằng Newman và xuất báo cáo HTML.
6. Chuyển đặc tả sang OpenAPI (`openapi.yaml`) và đối chiếu với collection.
7. Xây hợp đồng Pact cho ứng dụng mobile dựa trên các field mà mobile thật sự đọc.

---

## 11. Hướng dẫn tái lập

1. Clone repo `ttbhanh/eshop-sut`, vào thư mục `backend`, chạy `npm install`.
2. Chạy `node server.js` (thấy dòng `Server is running on http://localhost:3000`).
3. Mở Postman, chọn Import, chọn `eshop_api_postman_collection.json`.
4. Vào tab Variables của collection, kiểm tra `baseUrl` là `http://localhost:3000`.
5. Chạy theo thứ tự: Login User, Login Admin, rồi lần lượt các request theo mục 4. Các request phụ thuộc biến (`orderId`, `newProductId`...) cần chạy sau request tạo ra biến đó.
6. Muốn chạy lại từ đầu: dừng và khởi động lại server để reset dữ liệu.

Lưu ý: các response mẫu trong collection chứa token và mật khẩu của tài khoản thử nghiệm. Đây là dữ liệu giả của hệ thống test cục bộ.
