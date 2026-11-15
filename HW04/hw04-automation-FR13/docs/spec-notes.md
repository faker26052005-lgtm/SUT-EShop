# Ghi chú về SRS / API spec (chỗ sai hoặc không rõ) và cách bộ test xử lý

Nguồn: `system_requirements_specification.md` (v2.0, 2026-05-14) và `api_specification.md`.
Quy ước: kỳ vọng của test lấy từ SRS. Kết quả HW02 được coi là đã kiểm chứng. Chỗ SRS im lặng hoặc mâu thuẫn thì test ghi **CLARIFY** (ghi lại hành vi quan sát được, không làm test fail), không tự bịa kỳ vọng.

| # | Feature | Vấn đề trong spec | Cách xử lý trong HW04 |
| :-: | :-: | :-- | :-- |
| 1 | FR-08 | API spec §4.1-4.2 mô tả giỏ hàng phía server (`/api/cart`), SRS FR-08 chỉ nói "giỏ hàng được xóa" mà không nói giỏ nào (server hay giao diện). | Phải làm rõ khi viết test FR-08: kiểm tra cả giỏ trên giao diện lẫn `GET /api/cart` (kết quả HW02: BUG-03 ở phía API). |
| 2 | FR-08 | API spec §4.3 cho `total_amount` trong body checkout, nhưng SRS FR-08 yêu cầu backend tự tính và không chấp nhận giá trị client. Hai tài liệu mâu thuẫn nhau. | Theo SRS (HW02 FR-08-BUG-02). Trên giao diện: ô tổng tiền không được cho sửa. |
| 3 | FR-08 / FR-04 | `shipping_address` xuất hiện trong API spec §4.3 nhưng SRS FR-08 không nhắc tới địa chỉ; FR-04 có "địa chỉ giao hàng mặc định". Không rõ địa chỉ của đơn lấy từ hồ sơ hay nhập lúc thanh toán. | CLARIFY. Không dựng test "bắt buộc nhập địa chỉ" khi chưa chắc. |
| 4 | FR-04 | "Email không được đổi **qua giao diện**" (FR-04) khác "role **từ client**" (SEC-06): phạm vi áp dụng cho API không rõ. | Theo cách HW02 đã chốt (áp dụng cho cả API). |
| 5 | FR-04 | SĐT: SRS chỉ nói "bắt đầu bằng 0, 10-11 chữ số"; không nói khoảng trắng, `+84`, rỗng, `null`. | Các ca này là CLARIFY, các ca vi phạm rõ ràng (9 hoặc 12 chữ số, không bắt đầu bằng 0, có chữ cái) là kỳ vọng cứng. |
| 6 | FR-13 | "Tổng số đơn hàng" có tính đơn `canceled` không? SRS không nói. | CLARIFY ở S05 và S10 (ghi lại số hiển thị). Các ca còn lại dùng chênh lệch số đơn khi không có đơn hủy. |
| 7 | FR-13 | SRS không nói định dạng số tiền, cách làm mới số liệu, hay dashboard hiển thị gì khi chưa có đơn. | Số được đọc bằng cách lấy các chữ số, nên không phụ thuộc dấu phân cách của từng trình duyệt. Làm mới: các ca tải lại trang để đọc. |
| 8 | FR-12 / FR-13 | SRS chỉ nói admin web "chỉ dành cho admin", không nói người không phải admin thì thấy gì (về trang đăng nhập? báo lỗi?). | A04: kỳ vọng "không hiện dashboard" (diễn giải hợp lý của FR-12 và SEC-03). Không khẳng định màn hình thay thế cụ thể. Thông báo lỗi chỉ ghi lại. |
| 9 | FR-10 / FR-13 | `delivered` và `canceled` là trạng thái kết thúc, nhưng SRS không nói giao diện admin có được hiện nút chuyển trạng thái cho đơn đó hay không. | S11, S12 diễn giải "không được chuyển sang trạng thái khác" là "giao diện không đưa ra hành động nào". Đây là ca mới của HW04, HW02 mới chỉ kiểm tra API. |
| 10 | Chung | API spec không mô tả response của `GET /api/admin/orders` và `POST /api/checkout`. | Helper dựa trên cấu trúc quan sát được ở HW02 (`orderId`, `total_amount`, `status`). Nếu SUT đổi, chỉ cần sửa `tests/helpers/api.ts`. |
| 11 | Chung | Đăng nhập sai nhiều lần có thể khóa tài khoản (FR-02). | Ca đăng nhập sai dùng tài khoản dùng một lần (`registerThrowawayUser`), không bao giờ dùng `admin@eshop.com` hay `test@eshop.com`. |
