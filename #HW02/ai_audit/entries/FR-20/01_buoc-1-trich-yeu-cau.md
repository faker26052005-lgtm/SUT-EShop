# FR-20-01 – FR-20 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:27:42 (UTC+0700) |
| Feature / bước | FR-20 – Bước 1 - trích yêu cầu |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Bạn là kỹ sư kiểm thử phần mềm. Tôi sẽ kiểm thử black-box feature {FR_20} của hệ thống EShop bằng Domain Testing và Boundary Value Analysis. Ta làm theo từng bước, mỗi bước một yêu cầu riêng.

BƯỚC 1 – TRÍCH YÊU CẦU.
Dưới đây là đặc tả (SRS) và tài liệu API của feature. Chỉ dùng thông tin trong hai tài liệu này; không suy đoán thêm và không dùng kiến thức về cách hệ thống được cài đặt.

OVERVIEW:
A. Trích SRS – FR-20: Tính năng Mobile
Phân hệ Mobile là ứng dụng React Native + Expo. Phạm vi kiểm thử: hai chức năng Đăng ký và Hủy đơn hàng.
- Đầy đủ các chức năng: Xem sản phẩm, Đăng nhập, Đăng xuất, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
- Chức năng Hủy đơn hàng tuân theo đúng State Machine ở FR-10 (chỉ được hủy khi pending hoặc confirmed).
B. Trích SRS – Các yêu cầu liên quan
FR-01: Đăng ký tài khoản
- Người dùng phải cung cấp: Họ Tên, Email, Mật khẩu.
- Email phải có định dạng hợp lệ (user@domain.com) và là duy nhất trong hệ thống.
- Yêu cầu mật khẩu mạnh: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@, $, !, %, *, ?, &).
- Phải có trường Xác nhận mật khẩu — hệ thống từ chối nếu hai trường không khớp.
- Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập.
FR-10: Trạng thái Đơn hàng (Order State Machine)
Đơn hàng có 5 trạng thái và phải tuân theo sơ đồ chuyển đổi sau:
                 [Admin xác nhận]          [Admin giao hàng]      [Admin hoàn tất]
  ┌──────────┐ ─────────────────► ┌───────────┐ ──────────────► ┌──────────┐ ──────────► ┌───────────┐
  │ pending  │                    │ confirmed │                  │ shipping │             │ delivered │
  └──────────┘                    └───────────┘                  └──────────┘             └───────────┘
       │                               │
       │ [User/Admin hủy]              │ [User/Admin hủy]
       ▼                               ▼
  ┌──────────┐                    ┌──────────┐
  │ canceled │                    │ canceled │
  └──────────┘                    └──────────┘
Ràng buộc trạng thái kết thúc (Final States):
- Trạng thái delivered và canceled là trạng thái kết thúc — không được phép chuyển sang bất kỳ trạng thái nào khác.
- Khi đơn hàng đã ở trạng thái shipping, User không được phép tự hủy — chỉ Admin mới có thể thao tác.
- Mọi chuyển đổi không hợp lệ phải trả về lỗi với thông báo phù hợp.
FR-11: Xem lịch sử đơn hàng (User)
- Người dùng chỉ xem được đơn hàng của chính mình.
- Hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại.
- Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc.
FR-22: Form Requirements (liên quan tới form Đăng ký)
- Tất cả trường bắt buộc phải có ký hiệu * bên cạnh nhãn.
- Trường Email phải dùng type="email".
- Trường Mật khẩu phải dùng type="password" (không hiển thị rõ).
- Thông báo lỗi phải xuất hiện trên nút submit, không phải bên dưới.
Yêu cầu bảo mật
MãNội dungSEC-01Mật khẩu không được lưu dưới dạng plaintext.SEC-02Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.SEC-03API Admin phải kiểm tra role = 'admin' trong Token, không chỉ kiểm tra sự tồn tại của Token.C. Trích tài liệu API
1.1 Đăng ký tài khoản
- Endpoint: POST /api/register
- Body (JSON):{  "name": "Nguyen Van A",  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): {"message": "User registered successfully", "id": 1}
1.2 Đăng nhập
- Endpoint: POST /api/login
- Body (JSON):{  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): Trả về chuỗi JWT token và thông tin user.
4. Giỏ hàng & Đơn hàng (Cart & Orders)
Yêu cầu Header: Authorization: Bearer <token>
4.4 Lấy lịch sử đơn hàng cá nhân
- Endpoint: GET /api/orders/my-orders
4.5 Lấy chi tiết một đơn hàng
- Endpoint: GET /api/orders/:id
4.6 Hủy đơn hàng
- Endpoint: PUT /api/orders/:id/cancel
- Mô tả: Chuyển trạng thái đơn hàng sang canceled. Chỉ được thực hiện khi đơn hàng chưa giao.
D. API hỗ trợ dựng dữ liệu kiểm thử (không thuộc FR-20)
Tài khoản mặc định: Admin admin@eshop.com / Admin123!; User test@eshop.com / Test1234!. Các API quản trị yêu cầu Authorization: Bearer <token> của tài khoản Admin.
4.1 Lấy giỏ hàng
- Endpoint: GET /api/cart
4.2 Thêm vào giỏ hàng
- Endpoint: POST /api/cart
- Body (JSON):{  "id": 1,  "name": "Sản phẩm A",  "price": 100000,  "quantity": 2}
4.3 Đặt hàng (Checkout)
- Endpoint: POST /api/checkout
- Body (JSON):{  "total_amount": 200000,  "shipping_address": "123 Le Loi, TP.HCM"}
6.2 Quản lý Đơn hàng (Admin)
- Lấy danh sách đơn hàng: GET /api/admin/orders
  - Cập nhật trạng thái đơn hàng: PUT /api/admin/orders/:id/statusBody (JSON): {"status": "confirmed"} (Các trạng thái: pending, confirmed, shipping, delivered, canceled).

Yêu cầu:
1. Lập bảng yêu cầu: Mã (R1, R2...), nội dung ngắn gọn, nguồn (mục SRS/SEC), loại (input / nghiệp vụ / bảo mật / truy cập).
2. Liệt kê endpoint liên quan: method, đường dẫn, có cần token không, body.
3. Liệt kê riêng các chỗ SRS im lặng hoặc mơ hồ (điều người kiểm thử cần biết để viết kỳ vọng nhưng SRS không nói). Mỗi chỗ ghi "CẦN LÀM RÕ" và không tự đoán kỳ vọng.
Chỉ trả về kết quả bước 1, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Bảng Trích Xuất Yêu Cầu

| Mã | Nội dung yêu cầu | Nguồn | Loại yêu cầu |
| --- | --- | --- | --- |
| **R1** | Người dùng cung cấp: Họ Tên, Email, Mật khẩu, Xác nhận mật khẩu. | FR-01 | Input |
| **R2** | Email phải có định dạng hợp lệ (user@domain.com) và là duy nhất trong hệ thống. | FR-01 | Input / Business |
| **R3** | Mật khẩu tối thiểu 8 ký tự, gồm ít nhất: 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt (@, $, !, %, *, ?, &). | FR-01 | Input |
| **R4** | Trường Xác nhận mật khẩu phải khớp với Mật khẩu, nếu không hệ thống từ chối. | FR-01 | Input / Business |
| **R5** | Đăng ký thành công, người dùng được chuyển hướng tới trang Đăng nhập. | FR-01 | Business |
| **R6** | Các trường bắt buộc có dấu `*` cạnh nhãn; Email dùng `type="email"`; Mật khẩu dùng `type="password"`. | FR-22 | UI / Input |
| **R7** | Thông báo lỗi của form xuất hiện trên nút submit, không phải bên dưới. | FR-22 | UI |
| **R8** | Mật khẩu không được lưu dưới dạng plaintext. | SEC-01 | Security |
| **R9** | User chỉ được phép Hủy đơn hàng khi trạng thái là `pending` hoặc `confirmed`. | FR-20, FR-10 | Business |
| **R10** | User không được tự hủy khi đơn đang ở `shipping`, `delivered`, hoặc đã `canceled`. Mọi thao tác sai trạng thái trả về lỗi. | FR-10 | Business |
| **R11** | Chức năng Hủy đơn hàng yêu cầu xác thực bằng JWT Token hợp lệ của chính user đó. | SEC-02, Mục 4 | Access / Security |

---

### 2. Các Endpoint Liên Quan

| Tính năng | Method | Endpoint | Yêu cầu Token | Body (JSON) / Param |
| --- | --- | --- | --- | --- |
| **Đăng ký** | POST | `/api/register` | Không | `{"name": "...", "email": "...", "password": "..."}` |
| **Hủy đơn** | PUT | `/api/orders/:id/cancel` | Có (User) | Không có body (truyền ID trên URL) |

*(Lưu ý: Các endpoint sinh dữ liệu như `/api/login`, `/api/checkout`, `/api/admin/orders/:id/status` sẽ được dùng làm preconditions để setup test data).*

---

### 3. Các Điểm Mơ Hồ / Thiếu Thông Tin (CẦN LÀM RÕ)

* **CẦN LÀM RÕ:** Trường "Xác nhận mật khẩu" (Confirm Password) được xử lý hoàn toàn ở Frontend hay Backend? Tài liệu API `POST /api/register` không định nghĩa trường này trong Payload.
* **CẦN LÀM RÕ:** Giới hạn độ dài (Min/Max length) và ký tự cho phép của trường "Họ Tên".
* **CẦN LÀM RÕ:** Giới hạn độ dài tối đa của trường "Email" và "Mật khẩu".
* **CẦN LÀM RÕ:** Việc xử lý khoảng trắng (whitespace). Mật khẩu có cho phép khoảng trắng không? Email và Họ Tên có được tự động trim() khoảng trắng ở hai đầu khi gửi API không?
* **CẦN LÀM RÕ:** Thông điệp lỗi (Error Messages) cụ thể cho từng trường hợp là gì (Ví dụ: sai định dạng email, mật khẩu yếu, email trùng lặp, chuyển trạng thái sai)? Tài liệu chỉ ghi "trả về lỗi với thông báo phù hợp" nhưng không có nội dung text mong đợi để assert.
* **CẦN LÀM RÕ:** Nút "Hủy đơn hàng" trên Mobile được đặt ở màn hình Danh sách lịch sử đơn hàng, hay bắt buộc phải vào Chi tiết đơn hàng mới được hủy?
* **CẦN LÀM RÕ:** Có yêu cầu user nhập "Lý do hủy đơn" không? API hiện tại không có body, đồng nghĩa với việc không gửi lý do xuống Backend, nhưng UI có thể có popup hỏi xác nhận.

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
