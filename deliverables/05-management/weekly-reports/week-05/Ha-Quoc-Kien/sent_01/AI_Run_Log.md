# Ghi Nhận Thí Nghiệm AI Sinh Test 

## Điều kiện A (Prompt đơn giản)

### A.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | Gemini 3.1 Pro |
| Công cụ và loại tài khoản | Gemini 3.1 Pro (sinh code), Postman (chạy) |
| Ngày giờ | 16/10/2026 |
| Chế độ chat | Tạm thời, cô lập bằng cách vô hiệu hóa các chức năng thao khảo web và bộ nhớ cũ |
| Số lượt hỏi để có đủ code | 1 |
| Số dòng code | 250 dòng (219 dòng không trống, 212 dòng không tính comment) |
| Số test sinh ra | 29 (`pm.test` T01–T29; T03 và T24 nằm trong `if`) |
| Tệp lưu prompt và output | `ai_runs/A_prompt.txt`, `ai_runs/A_output.js` |

### A.2. Sửa tối thiểu (cú pháp/rule cơ bản) giữa lần chạy 1 và lần chạy 2

Không cần sửa. Vì vậy lần chạy 1 là kết quả chính thức.

### A.3. Kết quả chạy

| Chỉ số | Lần 1 (nguyên bản) | 
|---|---|
| Tổng số test | 30 | 
| Test đạt | 30 |
| Test đỏ | 0 |
| Lỗi script của AI (dòng `LỖI SCRIPT CỦA AI`) | 0 |
| Ảnh chụp Test Results | `ai_runs/A_run1.png` |

### A.4. Phân loại từng test đỏ (lần chạy 2)

Không có test đỏ (30/30 đạt, đã chạy lại và xác nhận).

### A.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi)

| Tên test | Vì sao đáng ngờ |
|---|---|
| T17 Coupons - Apply valid coupon | Gọi `/api/apply-coupon` không token và kỳ vọng 200, khóa chặt lỗi B26. Cũng không kiểm số tiền sau giảm nên che B4. |
| T18 Orders - Checkout | Gửi `total_amount` tùy ý, không kiểm tổng với giỏ, kỳ vọng 200 (khóa chặt B13). |
| T13 Cart - Add item | Client gửi cả `name` và `price`, test chấp nhận (khóa chặt B19). |
| T05 Users - Update profile | Chỉ kiểm 200, không đọc lại hồ sơ nên che B16. |
| T01, T04 Login/Get profile | Không kiểm phản hồi có lộ `password`/`reset_token` nên che B1, B2. |
| T02 Forgot password | Kỳ vọng `resetToken` nằm ngay trong phản hồi (lộ OTP) và coi đó là đúng. |

### A.6. Chấm điểm 30 mục

`D` = phát hiện, `L` = có test liên quan nhưng không đỏ, `K` = không có test.

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B1 | Login lộ mật khẩu | L | T01 Auth - Login successful (không kiểm trường password trong phản hồi) |
| B2 | Hồ sơ lộ mật khẩu và reset_token | L | T04 Users - Get profile (chỉ so email) |
| B3 | price kiểu chuỗi ở id chẵn | K |  |
| B4 | Giảm giá phần trăm sai | L | T17 Coupons - Apply valid coupon (chỉ kiểm `success`, không kiểm số tiền giảm) |
| B5 | User thường xem được danh sách người dùng | K |  |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | L | T21 Orders - Get order detail (chủ đơn, có token) |
| B7 | Sản phẩm không tồn tại trả 200 | K |  |
| B8 | Ghi sản phẩm không cần token | K |  |
| B9 | Đăng ký trùng email | K |  |
| B10 | Đăng ký không kiểm tra dữ liệu | K |  |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | K |  |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | K |  |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | L | T18 Orders - Checkout (happy path, tin total_amount) |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | K |  |
| B15 | Tự nâng quyền admin | K |  |
| B16 | Cập nhật hồ sơ xóa trường không gửi | L | T05 Users - Update profile (chỉ kiểm 200, không đọc lại) |
| B17 | SQL injection ở tìm kiếm | K |  |
| B18 | Giỏ hàng nhận body rỗng | K |  |
| B19 | Giỏ hàng tin giá client | L | T13 Cart - Add item (gửi giá đúng, không thử giá giả) |
| B20 | Giỏ không xóa sau thanh toán | K |  |
| B21 | Hủy được đơn đang shipping | K | T24 chỉ hủy đơn pending |
| B22 | Chuyển canceled sang delivered | K |  |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ user_id | K | T19 chỉ ghi 1 lần |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | K |  |
| B25 | Thêm cùng sản phẩm tạo dòng mới | K |  |
| B26 | apply-coupon không cần đăng nhập | L | T17 Apply valid coupon (gọi không token, kỳ vọng 200 → khóa chặt lỗi) |
| B27 | Khóa tài khoản sai ngưỡng | K |  |
| B28 | OTP chỉ 4 chữ số | K |  |
| B29 | Mã giảm giá trùng code trả 500 | K | T15 chỉ tạo 1 lần |
| O2 | JWT không có exp | K |  |

| Tổng kết | Số lượng |
|---|---|
| D (phát hiện) | 0 (đã xác nhận: 30/30 test đạt nên không phát hiện lỗi nào) |
| L (bỏ lọt) | 8 |
| K (không có test) | 22 |

---

## Điều kiện B (Prompt có hướng dẫn)

### B.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | Gemini 3.1 Pro |
| Công cụ và loại tài khoản | Gemini 3.1 Pro (sinh code), Postman (chạy) |
| Ngày giờ | 16/10/2026 |
| Chế độ chat | Tạm thời, cô lập bằng cách vô hiệu hóa các chức năng thao khảo web và bộ nhớ cũ |
| Số lượt hỏi để có đủ code | 2 |
| Số dòng code | 289 dòng (249 dòng không trống, 204 dòng không tính comment) |
| Số test sinh ra | 18 (`pm.test` T01–T18) |
| Tệp lưu prompt và output | `ai_runs/B_prompt.txt`, `ai_runs/B_output.js` |

### B.2. Sửa tối thiểu giữa lần chạy 1 và lần chạy 2

Không có. Vì vậy lần chạy 1 là kết quả chính thức. Code B gồm hai lượt trả lời ghép lại; điểm ghép nằm sau dòng `console.log("Hoàn thành phần 1...")`.

### B.3. Kết quả chạy

| Chỉ số | Lần 1 (nguyên bản) |
|---|---|
| Tổng số test | 19 |
| Test đạt | 7 |
| Test đỏ | 12 |
| Lỗi script của AI (dòng `LỖI SCRIPT CỦA AI`) | 0 |
| Ảnh chụp Test Results | `ai_runs/B_run1.png` |

### B.4. Phân loại từng test đỏ (lần chạy chính thức)

Loại: `HT` = lỗi hệ thống thật thuộc đáp án (mã B), `HT-mới` = lỗi hệ thống thật ngoài đáp án, `KY` = test sai kỳ vọng (báo động giả), `SC` = lỗi script của AI.

| Test | Thông báo lỗi | Loại | Mã |
|---|---|---|---|
| T01 Mật khẩu yếu | expected 200 to equal 400 | HT | B10 (đăng ký không kiểm tra dữ liệu, ở đây là mật khẩu) |
| T02 Trùng email | expected 200 to be one of [400, 409] | HT | B9 |
| T05 Mass assignment | expected 'admin' to equal 'user' | HT | B15 |
| T06 SĐT không hợp lệ | expected 200 to equal 400 | HT-mới | B30 (FR-04) |
| T08 Giá âm | expected 200 to equal 400 | HT-mới | B31 (FR-15) |
| T09 Import có dòng lỗi | expected 0 to be above 0 (`errors` rỗng, cả 2 dòng được thêm) | HT-mới | B32 (FR-16) |
| T10 Chống thao túng giá | expected 1000 to equal 30000000 | HT | B13 |
| T13 Vượt số lần dùng mã | expected 200 to be one of [400, 403] | KY | Backend cho ghi nhận nhiều lần ở `coupon-usage` rồi chặn ở `apply-coupon` (trả 400 "đã đạt giới hạn"); AI kỳ vọng sai chỗ chặn |
| T15 Hủy đơn shipping | expected 200 to be one of [400, 403] | HT | B21 |
| T16 IDOR đơn hàng | expected 200 to be one of [403, 404] | HT | B6 |
| T17 API admin bằng token user | expected 200 to equal 403 | HT | B5 |
| T18 Admin tự xóa | expected 200 to equal 400 | HT-mới | B33 (FR-19) |

Tổng: 7 HT thuộc đáp án, 4 HT-mới, 1 KY, 0 SC.

### B.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi)

| Tên test | Vì sao đáng ngờ |
|---|---|
| T07 SQL Injection | Chỉ kiểm 200 và không có chuỗi `SQLITE_ERROR`; nếu injection thành công và trả toàn bộ sản phẩm thì vẫn xanh. URL chứa ký tự đặc biệt không được encode. |
| T02 Trùng email | Chấp nhận cả 400 và 409, không kiểm nội dung lỗi. |
| T10 Price manipulation | Nhánh `if/else` chấp nhận mọi kết quả trừ trường hợp 200 mà tổng sai; nếu `orderId` không có thì vẫn có thể xanh. |
| T05 Mass assignment | Kỳ vọng 200 cho request chèn `role`/`id`; dùng chung `ctx.USER` nên có thể thay đổi dữ liệu user seed. **[đã xác nhận]** Sau khi chạy, `test@eshop.com` thành admin và mất `phone`, `shipping_address`. |
| T03 Khóa tài khoản | **[thêm]** Xanh, nhưng không bắt được B27: hệ thống khóa từ lần sai thứ 2, test gửi 3 lần sai rồi mới kiểm tra nên không phân biệt được ngưỡng 2 và 3. |
| T07 SQL Injection | **[đã xác nhận]** Xanh giả: chuỗi `' OR 1=1 --` thật sự trả toàn bộ sản phẩm (8 trên 8 trong lần thử) nhưng test chỉ kiểm 200 và không có `SQLITE_ERROR`. |
| T14 Nhảy cóc trạng thái | **[thêm]** Xanh đúng, nhưng chỉ thử pending sang delivered nên không bắt B22 (canceled sang delivered). |
| T11, T12 Mã giảm giá | **[thêm]** Gọi `apply-coupon` không token và kỳ vọng lỗi nghiệp vụ; không kiểm xác thực nên không bắt B26. |
| T18 Admin tự xóa | **[thêm]** Có tác hại: sau khi chạy, tài khoản admin bị xóa và không đăng nhập lại được cho đến khi khởi động lại server. |

### B.6. Chấm điểm 30 mục

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B1 | Login lộ mật khẩu | K |  |
| B2 | Hồ sơ lộ mật khẩu và reset_token | K | T05 chỉ đọc `role` |
| B3 | price kiểu chuỗi ở id chẵn | K |  |
| B4 | Giảm giá phần trăm sai | K |  |
| B5 | User thường xem được danh sách người dùng | D | T17 Chặn truy cập API Admin đối với tài khoản không có role admin |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | D | T16 Tránh IDOR (phần "không cần token" chưa được test) |
| B7 | Sản phẩm không tồn tại trả 200 | K |  |
| B8 | Ghi sản phẩm không cần token | K |  |
| B9 | Đăng ký trùng email | D | T02 Không cho phép đăng ký trùng email |
| B10 | Đăng ký không kiểm tra dữ liệu | D | T01 Mật khẩu yếu (cùng nguyên nhân: không kiểm tra dữ liệu đăng ký; chưa phủ email sai định dạng, name rỗng, body rỗng) |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | K | T08 là giá âm, không phải thiếu trường |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | K |  |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | D | T10 Chống Price Manipulation (chưa phủ giỏ rỗng) |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | L | T12 (gửi 499000 < 500000, không phải đúng ngưỡng 500000) |
| B15 | Tự nâng quyền admin | D | T05 Ngăn chặn Mass Assignment |
| B16 | Cập nhật hồ sơ xóa trường không gửi | K |  |
| B17 | SQL injection ở tìm kiếm | L | T07 (xanh giả: injection lọt và trả toàn bộ sản phẩm nhưng test chỉ kiểm 200 và không có "SQLITE_ERROR") |
| B18 | Giỏ hàng nhận body rỗng | K |  |
| B19 | Giỏ hàng tin giá client | K |  |
| B20 | Giỏ không xóa sau thanh toán | K |  |
| B21 | Hủy được đơn đang shipping | D | T15 User không được hủy đơn shipping |
| B22 | Chuyển canceled sang delivered | L | T14 (thử pending → delivered, không phải canceled → delivered) |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ user_id | L | T13 Vượt số lần dùng (có token, không thử bỏ user_id) |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | K | T17 chỉ phủ /api/admin/users (đã tính cho B5) |
| B25 | Thêm cùng sản phẩm tạo dòng mới | K |  |
| B26 | apply-coupon không cần đăng nhập | K | T11, T12 gọi không token nhưng không kiểm xác thực |
| B27 | Khóa tài khoản sai ngưỡng | L | T03 (xanh: 3 lần sai vẫn bị khóa nên test không phân biệt ngưỡng 2 và 3) |
| B28 | OTP chỉ 4 chữ số | K |  |
| B29 | Mã giảm giá trùng code trả 500 | K |  |
| O2 | JWT không có exp | K |  |

| Tổng kết | Số lượng |
|---|---|
| D (phát hiện) | 7 (đã xác nhận bằng chạy lại; B27 chuyển sang L) |
| L (bỏ lọt) | 5 (B14, B17, B22, B23, B27) |
| K (không có test) | 18 |

---

## So sánh A và B

| Chỉ số | A | B |
|---|---|---|
| Số test sinh ra | 29 | 18 |
| Số lỗi phát hiện (D) trên 30 mục | 0 | 7 |
| Số lỗi bỏ lọt (L) | 8 | 5 |
| Số lỗi không có test (K) | 22 | 18 |
| Số test đỏ là báo động giả (KY) | 0 | 1 (T13) |
| Số lỗi script (SC) | 0 | 0 (12 test đỏ của B là lỗi hệ thống hoặc báo động giả, không phải lỗi script) |
| Số test khóa chặt hành vi lỗi | 6 nhóm (mục A.5) | 4 nhóm (mục B.5) |
| Thời gian chạy bộ test | 2 giây | 2 giây |
| Thời gian từ lúc dán prompt đến lúc có kết quả chạy | ~30s | ~40s cho mỗi respond |
| Lỗi thật ngoài đáp án (không nằm trong 30 mục) | 0 | 4 (B30 đến B33) |

### Lỗi chỉ B phát hiện (A không)

| Mã | Vì sao B phát hiện được (SRS, dữ liệu mẫu, nhóm ca...) |
|---|---|
| B5 | B có nhóm "Phân quyền" (T17) dùng token user thường gọi API admin; A chỉ dùng token admin. |
| B6 | B có ca IDOR (T16) dùng token người khác; A chỉ xem đơn bằng token của chủ đơn. |
| B9 | B cố tình đăng ký trùng `test@eshop.com` (dữ liệu seed); A luôn tạo email mới. |
| B10 | B thử mật khẩu yếu (T01), bám FR-01 trong SRS (cùng nguyên nhân: đăng ký không kiểm tra dữ liệu). |
| B13 | B gửi `total_amount` thấp hơn giá thật (T10), bám FR-08. |
| B15 | B thử Mass Assignment (`role: admin`) trong T05, bám SEC-06. |
| B21 | B tạo đơn, chuyển sang shipping rồi thử hủy bằng user (T15), bám state machine FR-10. |

Nguyên nhân chung: prompt B đưa SRS (mã FR/SEC) và dữ liệu seed vào, nên AI sinh được ca âm tính, biên và bảo mật; prompt A chỉ cho ra luồng đúng, mọi assertion là `status == 200`.

### Lỗi thật ngoài đáp án mà B tìm thêm

Bốn lỗi này không nằm trong 30 mục, nhưng đều là vi phạm SRS và đã được kiểm chứng bằng lệnh gọi trực tiếp. Chúng nằm trong danh sách "yêu cầu SRS chưa kiểm thử" của báo cáo Postman, nên đây là kết quả của thí nghiệm: AI đã giúp bổ sung đáp án.

| Mã đề xuất | Lỗi | SRS | Test của B | Bằng chứng |
|---|---|---|---|---|
| B30 | `PUT /users/me` không kiểm tra số điện thoại | FR-04 | T06 | `phone: "9999"` trả 200 "Profile updated" |
| B31 | `POST /products` chấp nhận giá âm | FR-15 | T08 | `price: -50000` trả 200 "Product created" |
| B32 | Import không rollback và không kiểm tra giá | FR-16 | T09 | Import 1 dòng hợp lệ và 1 dòng `price: -100` trả "2/2 sản phẩm được thêm", `errors: []` |
| B33 | Admin xóa được chính tài khoản đang đăng nhập | FR-19 | T18 | `DELETE /admin/users/1` bằng token admin trả 200, sau đó đăng nhập admin trả 401 |

### Bảng phủ của AI nói nhiều hơn code

Ở điều kiện B, AI in bảng "mã FR/SEC → test" liệt kê T01 đến T28 và nói đạt "độ bao phủ 100%", nhưng code chỉ có 18 test (T01 đến T18). Các mục có trong bảng mà không có test trong code: chi tiết sản phẩm (FR-06), giỏ hàng (FR-07), danh mục (FR-14), thiếu trường bắt buộc và XSS ở sản phẩm (FR-15), quản lý mã giảm giá (FR-17), kiểm tra không đổi được email (FR-04), phần "dùng mã của người khác" (FR-09), và hai trong bốn ca trạng thái đơn (FR-10). Hệ quả: B không có test nào cho giỏ hàng, nên không thể bắt B18, B19, B20, B25. Bài học: phải đối chiếu bảng phủ của AI với code thực tế, vì bảng chỉ là lời khẳng định của AI.

### Lỗi cả hai điều kiện đều bỏ sót

| Mã | Vì sao AI bỏ sót | Case kiểm thử cần bổ sung thủ công trực tiếp |
|---|---|---|
| B1, B2 | Chỉ kiểm trường cần dùng, không kiểm trường không được có | Login/GET profile: `expect(json).to.not.have.property('password')` và `reset_token` |
| B3 | Không so kiểu dữ liệu từng phần tử | GET `/api/products`: mọi `price` phải là number |
| B4 | Chỉ kiểm `success` | `apply-coupon` loại percent: kiểm `final_amount` = total × (1 − %) |
| B7, B12 | Chỉ test id tồn tại | GET/PUT/DELETE với id không tồn tại phải trả 404 |
| B8, B24 | Luôn truyền token hợp lệ | POST/PUT/DELETE products, categories, coupons không token (401) và token user (403) |
| B11, B18 | Chỉ gửi payload đầy đủ | Body thiếu trường/rỗng cho products, categories, coupons, cart (400) |
| B14 | Thử dưới ngưỡng, không thử đúng ngưỡng | `total_amount` = `min_order_amount` phải được chấp nhận |
| B16 | Không đọc lại sau PUT | PUT chỉ gửi `name`, GET lại: `phone`, `shipping_address` còn nguyên |
| B17 | Assertion yếu | Search `' OR 1=1 --` trả danh sách rỗng, không phải toàn bộ sản phẩm |
| B19, B20, B25 | Không kiểm trạng thái giỏ | Giá giả trong giỏ; giỏ rỗng sau checkout; thêm cùng sản phẩm 2 lần phải gộp quantity |
| B22 | Chỉ thử một chuyển trạng thái sai | Đi hết ma trận trạng thái, gồm canceled → delivered |
| B23 | Không thử bỏ trường | `coupon-usage` không có `user_id`/token, dùng quá `max_uses_per_user` |
| B26 | A coi là đúng, B không kiểm | `apply-coupon` không token phải 401 |
| B28, O2 | Chỉ kiểm định dạng phản hồi | Độ dài OTP = 6; giải mã JWT kiểm có `exp` |
| B29 | Chỉ tạo coupon một lần | Tạo coupon trùng `code` phải trả 400/409, không phải 500 |

### Ba đến năm ca mà AI không đề xuất

1. Kiểm **cấu trúc phản hồi** (không lộ `password`, `reset_token`; `price` luôn là number; `Content-Type`): cả hai bản đều chỉ kiểm mã trạng thái và một vài trường.
2. **404 cho tài nguyên không tồn tại** ở GET/PUT/DELETE (B7, B12).
3. **Biên giá trị**: `total_amount` = `min_order_amount`, quantity = 0/âm, `max_uses_per_user` = ngưỡng đúng.
4. **Xác thực và phân quyền toàn diện**: ma trận (không token / user / admin) × từng endpoint ghi.
5. **Trạng thái sau thao tác**: giỏ sau checkout, hồ sơ sau PUT một phần, thêm cùng sản phẩm 2 lần.

### Kết luận (đã đối chiếu với kết quả chạy)

- Số liệu chính: A phát hiện 0 trên 30 mục (30/30 test đạt), B phát hiện 7 trên 30 mục và thêm 4 lỗi thật ngoài đáp án (B30 đến B33). Hai điều kiện dùng cùng mô hình, cùng spec, chỉ khác ở cách ra yêu cầu và việc đưa SRS cùng dữ liệu mẫu.
- A rộng nhưng nông: phủ đủ các endpoint (29 test, gồm giỏ hàng, danh mục, mã giảm giá) nhưng mọi kiểm tra chỉ là `status == 200`, nên không phát hiện lỗi nào. B sâu nhưng hẹp: nhắm vào bảo mật, nghiệp vụ và trạng thái, nhưng bỏ hẳn giỏ hàng, danh mục và chi tiết sản phẩm, nên các lỗi B18 đến B20, B25 không có test. Gợi ý: kết hợp bề rộng của A với chiều sâu của B, hoặc yêu cầu B kiểm tra mỗi endpoint có ít nhất một test dương và một test âm.
- Lỗi B bắt được đều có chung đặc điểm: cần biết quy tắc nghiệp vụ trong SRS (phân quyền, trạng thái đơn, kiểm tra dữ liệu đầu vào, thao túng giá). Lỗi cả hai bỏ sót thuộc ba nhóm: cấu trúc phản hồi (lộ mật khẩu, kiểu dữ liệu), điều kiện biên và công thức (giảm giá, đúng ngưỡng), và tình trạng sau thao tác (giỏ sau checkout, hồ sơ sau cập nhật một phần).
- AI có rủi ro riêng: bảng phủ nói nhiều hơn code (28 so với 18 test), một test đỏ là báo động giả (T13), hai test xanh giả (T07, T03), và test có tác hại (T05 biến tài khoản seed thành admin, T18 xóa tài khoản admin) nên phải khởi động lại server sau mỗi lần chạy.
- Giới hạn của thí nghiệm: mỗi điều kiện chỉ sinh một lần với một mô hình, kết quả có thể khác khi sinh lại. Spec đã khai báo sẵn mã 401, 403, 404, 400, nhưng A vẫn không sinh test nào cho các mã này, nên lợi thế của B đến từ cách ra yêu cầu chứ không chỉ từ SRS.
