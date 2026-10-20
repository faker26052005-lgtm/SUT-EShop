# FR-20-06 – FR-20 · Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập)

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:41:44 (UTC+0700) |
| Feature / bước | FR-20 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 6 – TEST NGHIỆP VỤ, BẢO MẬT VÀ TRUY CẬP.
Dựa trên các yêu cầu ở bước 1 (đặc biệt các yêu cầu loại nghiệp vụ, bảo mật, truy cập), sinh thêm các test case chưa được bao phủ ở bước 4 và 5.
Bảng gồm: ID (BL-01... cho nghiệp vụ/bảo mật, AC-01... cho truy cập), mô tả, cách dựng và input, kỳ vọng theo SRS, mã yêu cầu. Chỉ dùng thông tin trong SRS và API

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là các Test Case tập trung vào kiểm thử Nghiệp vụ (Business Logic), Bảo mật (Security) và Phân quyền truy cập (Access Control), bao phủ các góc khuất chưa được kiểm tra bằng Domain Testing hay BVA ở hai bước trước.

### 1. Bảng Test Case Nghiệp vụ & Bảo mật (Business Logic & Security)

| ID | Mô tả | Cách dựng và Input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **BL-01** | Kiểm tra ràng buộc trạng thái kết thúc (Final State) với Admin. Đơn hàng đã hủy không thể phục hồi. | **Dựng:** Dùng API hoặc User thực hiện hủy đơn hàng ID `1` (`canceled`).<br>**Input:** Admin gọi `PUT /api/admin/orders/1/status` với body `{"status":"shipping"}` hoặc `{"status":"pending"}`. | Lỗi 4xx (Bad Request / Conflict). Đơn hàng không đổi trạng thái, trả về thông báo lỗi chuyển đổi không hợp lệ. | FR-10 |
| **BL-02** | Hủy đơn hàng thành công bằng quyền Admin. | **Dựng:** Tạo đơn hàng ID `2` (`pending`).<br>**Input:** Admin gọi API `PUT /api/admin/orders/2/status` với body `{"status":"canceled"}`. | Trả về 2xx OK. Đơn hàng chuyển sang trạng thái `canceled`. | FR-10 |
| **BL-03** | Hiển thị lịch sử đơn hàng trên Mobile UI sau khi người dùng hủy. | **Dựng:** User A thực hiện hủy đơn hàng thành công.<br>**Input:** User A gọi `GET /api/orders/my-orders` và mở màn hình Lịch sử đơn hàng. | Trạng thái đơn hàng vừa hủy phải hiển thị là "Đã hủy" (Tiếng Việt) và có màu sắc phân biệt với các trạng thái khác. | FR-11 |
| **BL-04** | Kiểm tra việc lưu trữ mật khẩu an toàn trong cơ sở dữ liệu. | **Dựng:** Gọi `POST /api/register` đăng ký User mới với mật khẩu `"Test1234!"`.<br>**Input:** Truy cập trực tiếp vào Database, truy vấn record của User vừa tạo. | Cột lưu trữ mật khẩu không được hiển thị `"Test1234!"` (phải là chuỗi đã được mã hóa/hashed). | SEC-01 |

---

### 2. Bảng Test Case Phân quyền và Truy cập (Access Control)

*Lưu ý: Test case "Không có Token" đã được bao phủ ở Bước 4 (`DT-CAN-08`).*

| ID | Mô tả | Cách dựng và Input | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AC-01** | Xác thực Token JWT bị sửa đổi (hoặc không hợp lệ). | **Dựng:** User A có đơn hàng ID `3` đang `pending`.<br>**Input:** Gọi `PUT /api/orders/3/cancel` với Header `Authorization: Bearer <token_bị_chế_sai_chữ_ký>`. | Lỗi 401 Unauthorized. Hệ thống từ chối thao tác, trạng thái đơn hàng không đổi. | SEC-02 |
| **AC-02** | Xác thực Token JWT đã hết hạn (Expired). | **Dựng:** User A có đơn hàng ID `4` đang `pending`. Đăng nhập lấy Token và đợi Token hết hạn.<br>**Input:** Gọi `PUT /api/orders/4/cancel` với Token đã hết hạn đó. | Lỗi 401 Unauthorized. Hệ thống từ chối thao tác, yêu cầu đăng nhập lại. | SEC-02 |
| **AC-03** | Ngăn chặn User gọi API quản trị của Admin (Kiểm tra Role). | **Dựng:** Dùng API Login lấy Token của **User thông thường** (`test@eshop.com`). Tạo đơn hàng ID `5` (`pending`).<br>**Input:** Dùng Token User này gọi API Admin `PUT /api/admin/orders/5/status` với body `{"status":"shipping"}`. | Lỗi 403 Forbidden (hoặc 401). Hành động bị chặn do Token không chứa role `admin`. Đơn hàng không bị đổi trạng thái. | SEC-03 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
