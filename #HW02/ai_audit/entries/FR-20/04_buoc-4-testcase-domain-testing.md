# FR-20-04 – FR-20 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:38:18 (UTC+0700) |
| Feature / bước | FR-20 – Bước 4 - Testcase domain testing |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là Test Case cho tính năng Đăng ký và Hủy đơn hàng áp dụng kỹ thuật Domain Testing (Phân lớp tương đương).

Ở bước này, mỗi Test Case chỉ vi phạm **duy nhất một điều kiện** của một lớp không hợp lệ, các biến khác đều dùng giá trị chuẩn (Họ tên: "Nguyen Van A", Email: "newuser@domain.com", Password: "Password123!@").

### Bảng Test Case - Tính năng Đăng ký (`POST /api/register`)

| ID | Biến vi phạm (Lớp) | Mô tả Test Case (Mỗi test chỉ vi phạm 1 điều kiện) | Input (JSON Body / Hành động) | Kết quả mong đợi (Expected Result) | Mã Yêu Cầu |
| --- | --- | --- | --- | --- | --- |
| **DT-REG-01** | *Không (Lớp Hợp lệ chuẩn)* | Đăng ký thành công với tất cả dữ liệu hợp lệ | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "Password123!@"}`. (UI: Confirm pwd khớp hoàn toàn). | 200 OK. Dữ liệu User được tạo trong DB. Password được hash (không lưu plaintext). UI chuyển hướng sang trang Đăng nhập. | R1, R2, R3, R4, R5, R8 |
| **DT-REG-02** | `name` (Bỏ trống) | Đăng ký thất bại do bỏ trống Họ Tên | `{"name": "", "email": "newuser@domain.com", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R1, R6, R7 |
| **DT-REG-03** | `name` (Sai kiểu dữ liệu) | Đăng ký thất bại do `name` truyền vào dạng số (Test API) | `{"name": 12345, "email": "newuser@domain.com", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. | R1 |
| **DT-REG-04** | `name` (Độ dài tối đa) | CẦN LÀM RÕ hành vi khi `name` quá dài (VD: 256 ký tự) | `{"name": "A...A" (256 chars), "email": "...", "password": "..."}` | CẦN LÀM RÕ. | R1 |
| **DT-REG-05** | `email` (Bỏ trống) | Đăng ký thất bại do bỏ trống Email | `{"name": "Nguyen Van A", "email": "", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R1, R6, R7 |
| **DT-REG-06** | `email` (Thiếu `@`) | Đăng ký thất bại do Email sai định dạng (thiếu @) | `{"name": "Nguyen Van A", "email": "newuserdomain.com", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R2 |
| **DT-REG-07** | `email` (Thiếu domain) | Đăng ký thất bại do Email sai định dạng (thiếu domain) | `{"name": "Nguyen Van A", "email": "newuser@", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R2 |
| **DT-REG-08** | `email` (Thiếu user) | Đăng ký thất bại do Email sai định dạng (thiếu user prefix) | `{"name": "Nguyen Van A", "email": "@domain.com", "password": "Password123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R2 |
| **DT-REG-09** | `email` (Đã tồn tại) | Đăng ký thất bại do Email đã tồn tại trong hệ thống | `{"name": "Nguyen Van B", "email": "test@domain.com", "password": "Password123!@"}` | 4xx Client Error (Conflict). Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R2 |
| **DT-REG-10** | `password` (Bỏ trống) | Đăng ký thất bại do bỏ trống Mật khẩu | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": ""}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R1, R6, R7 |
| **DT-REG-11** | `password` (< 8 ký tự) | Đăng ký thất bại do Mật khẩu có độ dài dưới 8 ký tự | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "Pas12!@"}` *(7 ký tự, nhưng đủ 4 loại)* | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R3 |
| **DT-REG-12** | `password` (Thiếu chữ hoa) | Đăng ký thất bại do Mật khẩu thiếu chữ In hoa | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "pass123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R3 |
| **DT-REG-13** | `password` (Thiếu chữ thường) | Đăng ký thất bại do Mật khẩu thiếu chữ In thường | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "PASS123!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R3 |
| **DT-REG-14** | `password` (Thiếu số) | Đăng ký thất bại do Mật khẩu thiếu chữ số | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "Password!@"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R3 |
| **DT-REG-15** | `password` (Thiếu ký tự đặc biệt) | Đăng ký thất bại do Mật khẩu thiếu ký tự đặc biệt | `{"name": "Nguyen Van A", "email": "newuser@domain.com", "password": "Password123"}` | 4xx Client Error. Dữ liệu không đổi. UI: Lỗi hiển thị trên nút Submit. | R3 |
| **DT-REG-16** | `confirm_password` (Không khớp) | UI chặn submit do Xác nhận mật khẩu sai khác 1 ký tự | Form: Pwd = `"Password123!@"`, Confirm Pwd = `"Password123!#"` | API không được gọi. UI hiển thị lỗi báo không khớp trên nút Submit. | R4, R7 |
| **DT-REG-17** | `confirm_password` (Sai case) | UI chặn submit do Xác nhận mật khẩu khác chữ Hoa/Thường | Form: Pwd = `"Password123!@"`, Confirm Pwd = `"password123!@"` | API không được gọi. UI hiển thị lỗi báo không khớp trên nút Submit. | R4, R7 |

---

### Bảng Test Case - Tính năng Hủy đơn hàng (`PUT /api/orders/:id/cancel`)

*Setup mặc định: Đăng nhập User A lấy JWT Token. Tạo sẵn các đơn hàng ID `1` (pending), `2` (confirmed), `3` (shipping), `4` (delivered), `5` (canceled) thuộc về User A, và đơn hàng ID `6` (pending) thuộc về User B.*

| ID | Trạng thái / Lớp vi phạm | Mô tả Test Case | Input (Endpoint / Action) | Kết quả mong đợi (Expected Result) | Mã Yêu Cầu |
| --- | --- | --- | --- | --- | --- |
| **DT-CAN-01** | Hợp lệ (`pending`) | Hủy thành công đơn hàng đang ở trạng thái `pending` của chính mình. | Gửi User A Token; Gọi `PUT /api/orders/1/cancel` | 2xx Success. Trạng thái đơn ID `1` chuyển thành `canceled` trong DB. | R9, R11 |
| **DT-CAN-02** | Hợp lệ (`confirmed`) | Hủy thành công đơn hàng đang ở trạng thái `confirmed` của chính mình. | Gửi User A Token; Gọi `PUT /api/orders/2/cancel` | 2xx Success. Trạng thái đơn ID `2` chuyển thành `canceled` trong DB. | R9, R11 |
| **DT-CAN-03** | Không hợp lệ (`shipping`) | Hủy thất bại đơn hàng đang ở trạng thái `shipping`. | Gửi User A Token; Gọi `PUT /api/orders/3/cancel` | 4xx Client Error. Dữ liệu không đổi (vẫn là `shipping`). | R10 |
| **DT-CAN-04** | Không hợp lệ (`delivered`) | Hủy thất bại đơn hàng đã giao (`delivered`). | Gửi User A Token; Gọi `PUT /api/orders/4/cancel` | 4xx Client Error. Dữ liệu không đổi (vẫn là `delivered`). | R10 |
| **DT-CAN-05** | Không hợp lệ (`canceled`) | Hủy thất bại đơn hàng đã bị hủy từ trước (`canceled`). | Gửi User A Token; Gọi `PUT /api/orders/5/cancel` | 4xx Client Error. Dữ liệu không đổi (vẫn là `canceled`). | R10 |
| **DT-CAN-06** | ID không tồn tại | Cố gắng hủy một ID đơn hàng không tồn tại trong DB. | Gửi User A Token; Gọi `PUT /api/orders/999999/cancel` | 4xx Client Error (Not Found). Dữ liệu không đổi. | R9 |
| **DT-CAN-07** | Sai quyền (User khác) | Cố gắng hủy đơn hàng hợp lệ (`pending`) của người dùng khác. | Gửi User A Token; Gọi `PUT /api/orders/6/cancel` | 4xx Client Error (Forbidden/Not Found). Đơn ID `6` không bị hủy. | R11, FR-11 |
| **DT-CAN-08** | Không có Token | Cố gắng gọi API hủy đơn nhưng không truyền Header Authorization. | Bỏ Authorization Header; Gọi `PUT /api/orders/1/cancel` | 4xx Client Error (Unauthorized). Dữ liệu không đổi. | R11, SEC-02 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
