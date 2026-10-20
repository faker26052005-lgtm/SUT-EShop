# FR-09-06 – FR-09 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:45:09 (UTC+0700) |
| Feature / bước | FR-09 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 6 - Test Case Nghiệp vụ, Bảo mật và Truy cập, tập trung vào **các yêu cầu chưa được kiểm tra (hoặc chưa kiểm tra sâu) trong Bước 4 và 5**, đặc biệt là **tính chính xác của công thức tính tiền** (R6, R7, R8) và các **kịch bản phân quyền/bảo mật đặc thù**.

### Bảng Test Case (Nghiệp vụ, Bảo mật, Truy cập)


| ID | Mô tả | Cách dựng & Input | Kỳ vọng theo SRS | Mã YC |
| --- | --- | --- | --- | --- |
| **BL-01** | Kiểm tra công thức tính giảm giá loại **`percent`**. | **Cách dựng:** Dùng tài khoản user hợp lệ (Token user).<br>**Input Body:** `{"code":"SAVE10","total_amount":500000,"user_id":1}` | HTTP 200 OK. JSON trả về có:<br>- `discount_amount` = 50000 (10% của 500k)<br>- `final_amount` = 450000 | R6, R8 |
| **BL-02** | Kiểm tra công thức tính giảm giá loại **`fixed`**. | **Cách dựng:** Dùng tài khoản user hợp lệ.<br>**Input Body:** `{"code":"VIP100","total_amount":400000,"user_id":1}` | HTTP 200 OK. JSON trả về có:<br>- `discount_amount` = 100000<br>- `final_amount` = 300000 | R7, R8 |
| **BL-03** | Kiểm tra công thức tính khi giảm giá **`fixed` > `total_amount`** (Trường hợp CẦN LÀM RÕ 2). | **Cách dựng:**<br>1. Dùng token Admin gọi API tạo mã: `{"code":"MINUS200","type":"fixed","discount_value":200000,"min_order_amount":100000,...}`<br>2. Dùng token User áp dụng mã trên.<br>**Input Body:** `{"code":"MINUS200","total_amount":150000,"user_id":1}` | CẦN LÀM RÕ (API trả `final_amount` = 0 hay -50000, có cho phép áp dụng không). | R7, R8 |
| **BL-04** | Kiểm tra bảo mật **Hiển thị / Escape (XSS)** ở Response (bổ sung cho DT-07). | **Cách dựng:** Gửi mã chứa XSS payload và xem thông báo lỗi do API trả về (nếu API echo lại input).<br>**Input Body:** `{"code":"<b>NOTEXIST</b>","total_amount":500000,"user_id":1}` | Nếu JSON response trả về error message có chứa mã `code` người dùng vừa nhập, chuỗi này phải được encode hợp lệ (không trả về chuỗi HTML gốc) để phòng ngừa XSS khi UI parse lỗi. | R10 (SEC-04) |
| **BL-05** | Kiểm tra xử lý **SQL Injection** khi mã giảm giá hợp lệ nhưng có chứa nháy đơn (Kiểm tra Parameterized Query). | **Cách dựng:**<br>1. Dùng token Admin gọi API tạo mã có chứa dấu nháy đơn: `{"code":"NEW'YEAR",...}`<br>2. Dùng token User áp dụng.<br>**Input Body:** `{"code":"NEW'YEAR",...}` | HTTP 200 OK. Hệ thống truy vấn CSDL chính xác mã `NEW'YEAR` mà không bị lỗi cú pháp SQL, chứng tỏ đã dùng Parameterized Query chuẩn. | R11 (SEC-05) |
| **AC-01** | Kiểm tra phân quyền truy cập - **Dùng Token Admin cho hành động của User**. | **Cách dựng:** Dùng API login lấy JWT Token của **Admin** (`admin@eshop.com`). Dùng token này để gọi API áp dụng mã (thường dành cho KH).<br>**Input Header:** `Authorization: Bearer <Admin_Token>`<br>**Body:** `{"code":"SAVE10",...}` | CẦN LÀM RÕ. SRS không cấm Admin mua hàng, nhưng cần xác nhận Admin có được phép gọi API `/api/apply-coupon` hay API này chỉ dành riêng cho role User. | R4 |
| **AC-02** | Kiểm tra phân quyền truy cập - **Dùng Token User để quản lý mã**. | **Cách dựng:** Dùng API login lấy JWT Token của **User** (`test@eshop.com`). Dùng token này gọi API của Admin.<br>**Endpoint:** `POST /api/admin/coupons`<br>**Input Header:** `Authorization: Bearer <User_Token>` | HTTP 403 Forbidden (hoặc 401). Hành động bị từ chối do API này chỉ dành cho tài khoản Admin. | YC Phân Quyền |

*(Lưu ý: Các test case liên quan đến "Token không có / sai / hết hạn" và "Tấn công SQLi phá hoại logic" đã được bao phủ toàn diện tại DT-06, DT-18, DT-19, DT-20 trong Bước 4 nên không được nhắc lại ở đây để tránh trùng lặp.)*

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
