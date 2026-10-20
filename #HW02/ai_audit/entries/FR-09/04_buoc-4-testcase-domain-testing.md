# FR-09-04 – FR-09 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 06:41:27 (UTC+0700) |
| Feature / bước | FR-09 – Bước 4 - Testcase domain testing |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 4 - Danh sách các Test Case áp dụng kỹ thuật Domain Testing (Chia lớp tương đương) dựa trên các phân tích từ Bước 3.

*Lưu ý cấu hình chuẩn (Valid State) cho các test case vi phạm 1 điều kiện:*

* Header `Authorization`: Gửi kèm JWT Token hợp lệ của user có `id = 1`.
* API Body chuẩn: `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}`. Mã "SAVE10" đang active, còn hạn, user 1 chưa hết lượt, ngưỡng tối thiểu 300.000đ.

### Bảng Test Case (Domain Testing)

| ID | Lớp (Partition) | Mô tả (Chỉ vi phạm 1 điều kiện) | Input (JSON Body) | Kỳ vọng (Theo yêu cầu) | Mã YC |
| --- | --- | --- | --- | --- | --- |
| **DT-01** | Hợp lệ toàn bộ | Gửi request với tất cả các thông tin và trạng thái đều hợp lệ. | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | 2xx và dữ liệu được lưu đúng | R1,2,3,4,5,9 |
| **DT-02** | Mã không tồn tại | Gửi request với mã `code` không có trong CSDL. | `{"code": "NOTEXIST", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R1 |
| **DT-03** | Mã không active | Gửi request với mã `code` có trong CSDL nhưng `is_active = 0`. | `{"code": "INACTIVE10", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R1 |
| **DT-04** | Mã đã hết hạn | Gửi request với mã `code` có `expired_at` trong quá khứ. | `{"code": "EXPIRED", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R2 |
| **DT-05** | Hết lượt dùng | Gửi request với mã mà user 1 đã dùng đạt mức `max_uses_per_user`. | `{"code": "VIP100", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R5 |
| **DT-06** | Mã chứa SQLi | Truyền payload SQL Injection vào trường `code`. | `{"code": "' OR 1=1--", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R11 |
| **DT-07** | Mã chứa XSS | Truyền thẻ HTML/JS vào trường `code`. | `{"code": "<script>alert(1)</script>", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R10 |
| **DT-08** | Chuỗi rỗng | Truyền `code` là chuỗi rỗng. | `{"code": "", "total_amount": 500000, "user_id": 1}` | CẦN LÀM RÕ | R1, 9 |
| **DT-09** | Sai hoa thường | Truyền `code` đúng chữ nhưng sai in hoa/in thường. | `{"code": "save10", "total_amount": 500000, "user_id": 1}` | CẦN LÀM RÕ | R1 |
| **DT-10** | Dưới ngưỡng mua | Gửi đơn hàng có `total_amount` nhỏ hơn `min_order_amount`. | `{"code": "SAVE10", "total_amount": 250000, "user_id": 1}` | 4xx và dữ liệu không đổi | R3 |
| **DT-11** | Total bằng 0 | Gửi `total_amount` bằng 0. | `{"code": "SAVE10", "total_amount": 0, "user_id": 1}` | CẦN LÀM RÕ | R3, 9 |
| **DT-12** | Total âm | Gửi `total_amount` là số âm. | `{"code": "SAVE10", "total_amount": -100000, "user_id": 1}` | CẦN LÀM RÕ | R3, 9 |
| **DT-13** | Sai kiểu Total | Truyền `total_amount` dưới dạng String thay vì Number. | `{"code": "SAVE10", "total_amount": "500000", "user_id": 1}` | CẦN LÀM RÕ | R9 |
| **DT-14** | Sai ID token | Truyền `user_id` khác với user_id lưu bên trong JWT Token. | `{"code": "SAVE10", "total_amount": 500000, "user_id": 2}` | CẦN LÀM RÕ | R4, 9 |
| **DT-15** | ID không tồn tại | Truyền `user_id` là một user không có trong CSDL. | `{"code": "SAVE10", "total_amount": 500000, "user_id": 999999}` | CẦN LÀM RÕ | R9 |
| **DT-16** | ID âm | Truyền `user_id` là số âm. | `{"code": "SAVE10", "total_amount": 500000, "user_id": -1}` | CẦN LÀM RÕ | R9 |
| **DT-17** | Sai kiểu ID | Truyền `user_id` dưới dạng String thay vì Number. | `{"code": "SAVE10", "total_amount": 500000, "user_id": "1"}` | CẦN LÀM RÕ | R9 |
| **DT-18** | Không có Token | Không gửi Header `Authorization` (Body hợp lệ). | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R4 |
| **DT-19** | Token hết hạn | Gửi Header `Authorization` chứa Token đã hết hạn. | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R4 |
| **DT-20** | Token sai format | Gửi Header `Authorization` chứa chuỗi không phải JWT. | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | 4xx và dữ liệu không đổi | R4 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
