# FR-09-01 – FR-09 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:35:06 (UTC+0700) |
| Feature / bước | FR-09 – Bước 1 - trích yêu cầu |
| Chat / phiên | FR09 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Bạn là kỹ sư kiểm thử phần mềm. Tôi sẽ kiểm thử black-box feature {FR_09} của hệ thống EShop bằng Domain Testing và Boundary Value Analysis. Ta làm theo từng bước, mỗi bước một yêu cầu riêng.

BƯỚC 1 – TRÍCH YÊU CẦU.
Dưới đây là đặc tả (SRS) và tài liệu API của feature. Chỉ dùng thông tin trong hai tài liệu này; không suy đoán thêm và không dùng kiến thức về cách hệ thống được cài đặt.

A. Trích SRS – FR-09: Mã Giảm Giá (Coupon)
Tại bước Checkout, người dùng có thể nhập mã giảm giá. Hệ thống áp dụng giảm giá dựa trên 5 điều kiện sau, tất cả phải thỏa mãn:
#Điều kiệnMô tảC1Mã tồn tạiMã phải có trong CSDL và đang hoạt động (is_active = 1)C2Còn hạn sử dụngNgày hiện tại phải trước expired_atC3Đủ ngưỡng đơn hàngTổng đơn hàng >= (lớn hơn hoặc bằng) min_order_amountC4Đã đăng nhậpNgười dùng phải có JWT Token hợp lệC5Chưa dùng hết lượtSố lần đã dùng mã này của user < max_uses_per_userCông thức tính giảm giá:
- Loại percent: discount_amount = total × discount_value / 100
- Loại fixed: discount_amount = discount_value
- final_amount = total - discount_amount
Mã giảm giá mẫu trong hệ thống:
MãLoạiGiá trịNgưỡng tối thiểuHạn dùngSố lần/ngườiSAVE10percent10%300,000 ₫2099-12-311BIGBUYfixed50,000 ₫500,000 ₫2099-12-311VIP100fixed100,000 ₫300,000 ₫2099-12-312EXPIREDpercent20%100,000 ₫2020-01-011B. Trích SRS – Yêu cầu bảo mật liên quan
MãNội dungSEC-02Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.SEC-04Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng innerHTML trực tiếp.SEC-05Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp.C. Trích tài liệu API – Mã Giảm Giá (Coupons)
5.1 Áp dụng mã giảm giá
- Endpoint: POST /api/apply-coupon
- Mô tả: Tính toán tổng tiền sau khi giảm. Trả về cấu trúc JSON chứa discount_amount và final_amount.
- Body (JSON):{  "code": "SAVE10",  "total_amount": 500000,  "user_id": 1}
D. API hỗ trợ dựng dữ liệu kiểm thử (không thuộc FR-09)
Tài khoản mặc định: Admin admin@eshop.com / Admin123!; User test@eshop.com / Test1234!. Các API quản trị yêu cầu Authorization: Bearer <token> của tài khoản Admin.
1.1 Đăng ký tài khoản
- Endpoint: POST /api/register
- Body (JSON):{  "name": "Nguyen Van A",  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): {"message": "User registered successfully", "id": 1}
1.2 Đăng nhập
- Endpoint: POST /api/login
- Body (JSON):{  "email": "test@domain.com",  "password": "Password123!"}
- Phản hồi thành công (200 OK): Trả về chuỗi JWT token và thông tin user.
6.4 Quản lý Mã Giảm Giá (Admin)
- Thêm mới mã: POST /api/admin/couponsBody (JSON):{  "code": "TET2025",  "type": "percent",  "discount_value": 15,  "min_order_amount": 200000,  "expired_at": "2025-01-31",  "max_uses_per_user": 1}
- Xóa mã: DELETE /api/admin/coupons/:id

Yêu cầu:
1. Lập bảng yêu cầu: Mã (R1, R2...), nội dung ngắn gọn, nguồn (mục SRS/SEC), loại (input / nghiệp vụ / bảo mật / truy cập).
2. Liệt kê endpoint liên quan: method, đường dẫn, có cần token không, body.
3. Liệt kê riêng các chỗ SRS im lặng hoặc mơ hồ (điều người kiểm thử cần biết để viết kỳ vọng nhưng SRS không nói). Mỗi chỗ ghi "CẦN LÀM RÕ" và không tự đoán kỳ vọng.
Chỉ trả về kết quả bước 1, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả phân tích và trích xuất yêu cầu cho tính năng Áp dụng Mã Giảm Giá (FR-09) theo đúng tài liệu bạn cung cấp.

## 1. Bảng Yêu Cầu (Requirements)

| Mã | Nội dung ngắn gọn | Nguồn | Loại |
| --- | --- | --- | --- |
| **R1** | Mã giảm giá phải tồn tại trong CSDL và `is_active = 1`. | A - C1 | Nghiệp vụ |
| **R2** | Ngày hiện tại phải trước `expired_at` của mã giảm giá. | A - C2 | Nghiệp vụ |
| **R3** | Tổng đơn hàng (`total_amount`) phải lớn hơn hoặc bằng `min_order_amount`. | A - C3 | Nghiệp vụ |
| **R4** | Người dùng phải gửi kèm JWT Token hợp lệ khi gọi API. | A - C4 / B - SEC-02 | Truy cập / Bảo mật |
| **R5** | Số lần đã dùng mã của user này phải nhỏ hơn `max_uses_per_user`. | A - C5 | Nghiệp vụ |
| **R6** | Tính giảm giá `percent`: `discount_amount` = `total` × `discount_value` / 100. | A - Công thức | Nghiệp vụ |
| **R7** | Tính giảm giá `fixed`: `discount_amount` = `discount_value`. | A - Công thức | Nghiệp vụ |
| **R8** | Tính tổng tiền cuối cùng: `final_amount` = `total` - `discount_amount`. | A - Công thức | Nghiệp vụ |
| **R9** | API nhận đầu vào (JSON) gồm: `code` (string), `total_amount` (number), `user_id` (number). | C - 5.1 | Input |
| **R10** | Dữ liệu `code` nhập vào khi hiển thị lên UI phải được escape, không dùng innerHTML. | B - SEC-04 | Bảo mật |
| **R11** | API phải dùng Parameterized Query để chống SQL Injection khi truy vấn CSDL. | B - SEC-05 | Bảo mật |

---

## 2. Endpoint Liên Quan

Đích kiểm thử chính của FR-09 là API áp dụng mã giảm giá.

* **Method:** `POST`
* **Đường dẫn (Path):** `/api/apply-coupon`
* **Yêu cầu Token:** Có (Theo điều kiện C4 và SEC-02, phải có JWT Token hợp lệ).
* **Body (JSON):**
```json
{
  "code": "string",
  "total_amount": "number",
  "user_id": "number"
}

```
---

## 3. Các Điểm SRS Im Lặng Hoặc Mơ Hồ

Dưới đây là những kịch bản không có quy định rõ ràng trong tài liệu, người kiểm thử không thể tự đoán kỳ vọng mà cần BA/Dev xác nhận:

* **CẦN LÀM RÕ 1:** Phản hồi của API (HTTP Status Code và cấu trúc JSON) khi *không* thỏa mãn các điều kiện C1 - C5 là gì? (Ví dụ: Trả về 400 Bad Request, 403 Forbidden hay 200 OK kèm error message?).
* **CẦN LÀM RÕ 2:** Nếu mã loại `fixed` có `discount_value` lớn hơn `total_amount` (Ví dụ: `total_amount` = 50.000đ nhưng giảm `fixed` 100.000đ), thì `final_amount` sẽ bằng 0 hay là số âm?
* **CẦN LÀM RÕ 3:** Đầu vào `code` có phân biệt chữ hoa/chữ thường không? (Ví dụ: "save10" có được coi là hợp lệ như "SAVE10" không?).
* **CẦN LÀM RÕ 4:** Điều kiện C2 ghi "Ngày hiện tại phải trước expired_at". Cụ thể là dùng toán tử nhỏ hơn (`<`) hay nhỏ hơn hoặc bằng (`<=`)? (Ví dụ: `expired_at` là 2024-12-31, thì đúng ngày 2024-12-31 mã còn dùng được không?).
* **CẦN LÀM RÕ 5:** Bảo mật logic: Trong body API `/api/apply-coupon` có truyền `user_id`, nhưng người dùng cũng đang gửi kèm JWT Token (chứa thông tin user). Có cơ chế kiểm tra chéo xem `user_id` trong body có khớp với user của Token không? Chuyện gì xảy ra nếu User A truyền JWT Token của mình nhưng lại gõ `user_id` của User B vào body?
* **CẦN LÀM RÕ 6:** Đầu vào `total_amount` có chấp nhận số 0, số âm, hoặc số thập phân không? Nếu truyền sai kiểu dữ liệu (vd: truyền string "500000"), API có tự động ép kiểu hay báo lỗi?

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
