# Các lời nhắc nhiệm vụ (dán lần lượt, mỗi bước một lượt)

Thay `[RUN-ID]` bằng tên lần chạy (ví dụ `run-01-coupon`) và `[PHẠM VI]` bằng nhóm chức năng cần test (ví dụ `đăng nhập, áp mã giảm giá`).

Mở khung chat của Agent, gõ lần lượt:

| Bước | Bạn gõ | Agent làm | Bạn làm tiếp |
|---|---|---|---|
| 1 | `Bắt đầu run-[ID], phạm vi: FR-[ID]` | Lập `executions/run-01-coupon/test-matrix.md`, rồi dừng | Đọc ma trận. Điền cột `Duyệt` **cho mọi dòng**: `Y` đồng ý, `S` bạn đã sửa dòng đó, `N` loại. Ca bạn tự thêm ghi `[THÊM]` đầu cột Ghi chú. Đọc kỹ mục 3 (chỗ tài liệu mâu thuẫn) |
| 2 | `Đã duyệt matrix` | Viết feature Karate, tự kiểm tra, rồi dừng | Khởi động lại EShop (mục 3) |
| 3 | `Chạy` | Chạy Karate, tạo `report/summary.md` và `result.md` | Xác nhận từng ca đỏ trong `result.md` (bên dưới) |