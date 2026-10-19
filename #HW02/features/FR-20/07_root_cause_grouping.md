# FR-20 – Mobile - Đăng ký và Hủy đơn · Bước 8: Gom test đỏ theo nguyên nhân gốc

Nhiều test đỏ không có nghĩa là nhiều bug. Gom theo nguyên nhân gốc rồi mới mở Issue.

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm | GitHub Issue |
| :--- | :--- | :--- | :-: | :--- | :--- |
| FR-20-BUG-01 | `POST /api/register` không kiểm tra trường bắt buộc (name, email, password rỗng vẫn tạo tài khoản) | DT-R03, DT-R13, DT-R28 | High | FR-01: "phải cung cấp: Họ Tên, Email, Mật khẩu" | |
| FR-20-BUG-02 | `POST /api/register` không kiểm tra định dạng email | DT-R08, DT-R09, DT-R10, DT-R12 | High | FR-01: "Email phải có định dạng hợp lệ" | |
| FR-20-BUG-03 | `POST /api/register` cho phép đăng ký trùng email (không có ràng buộc duy nhất) | DT-R14, BL-R03 | High | FR-01: "Email ... là duy nhất trong hệ thống" | |
| FR-20-BUG-04 | `POST /api/register` không áp dụng luật mật khẩu mạnh (độ dài ≥ 8 và 4 loại ký tự) | DT-R23, R24, R25, R26, BV-R01, BV-R04; phụ thuộc giả định #3: DT-R27, DT-R29 | High | FR-01: "Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt" | |
| FR-20-BUG-05 | `PUT /api/orders/:id/cancel` cho user hủy đơn đang `shipping` (guard chỉ chặn `delivered` và `canceled`) | DT-C03, BV-C01 | High | FR-10: "đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy"; FR-20: chỉ hủy khi `pending`/`confirmed` | |

**Quy ước đếm:** 19 test đỏ là 19 *ca*, không phải 19 bug; chúng thuộc 5 nguyên nhân gốc. DT-R27 và DT-R29 dựa trên giả định #3 (`clarifications.md`): nếu GV xác nhận ký tự đặc biệt ngoài tập SRS vẫn hợp lệ thì loại hai ca này khỏi BUG-04 (bug vẫn còn nhờ 6 ca kia). BV-C01 cùng nguyên nhân với DT-C03 (không phải race condition: server không kiểm tra `shipping` ở bất kỳ thời điểm nào).

