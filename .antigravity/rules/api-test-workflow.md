---
trigger: always_on
description: Luật nền khi thiết kế, viết và chạy test API Karate cho EShop SUT. Luôn áp dụng.
---

# Luật nền cho test API

Khi người dùng nói về test API, test contract, Karate, matrix hoặc một lần chạy (`run-...`), làm theo skill `api-test-design` tại `.agents/skills/api-test-design/SKILL.md`. Nếu skill không được nạp tự động, hãy mở file đó và đọc trước khi làm bất cứ việc gì. Việc đầu tiên của mỗi cuộc trò chuyện mới là kiểm tra môi trường bằng `doctor.py` (Pha 0 trong skill); không tự cài phần mềm nếu người chưa yêu cầu. Skill tự cho biết đang ở pha nào dựa trên trạng thái thư mục `executions/<run-id>/`, nên người dùng không cần nhắc pha.

## Sáu điều không bao giờ làm

1. Không đọc mã nguồn hệ thống, danh sách lỗi đã biết, collection Postman, kết quả của các `executions/run-*` khác, hay `README.md` và `DEMO.md` ở gốc workspace. Kỳ vọng chỉ đến từ `inputs/`.
2. Không viết feature khi cột `Duyệt` của matrix chưa được người điền đủ. Không chạy test khi người chưa nói "chạy".
3. Không sửa kỳ vọng cho khớp với hành vi thật. Ca đỏ giữ nguyên là đỏ.
4. Không ghi "đã kiểm chứng", không gán mã lỗi, không điền cột `Duyệt` hay `Người xác nhận`.
5. Không đổi hoặc xóa dữ liệu mẫu trong `inputs/sample-data.md`. Ca ghi, đổi quyền, xóa dùng dữ liệu tạm tự tạo theo hướng dẫn trong skill. Điều này áp dụng cả với ca **âm tính** (không có quyền, không có token): nếu hệ thống lỗi, thao tác sẽ thành công thật, nên đối tượng bị tác động vẫn phải là dữ liệu tạm.
6. Không tự bật máy chủ, không sửa `inputs/`, không đổi mã nguồn hệ thống.

Chưa rõ phạm vi, tên lần chạy hoặc điều khoản tài liệu thì hỏi người một câu hoặc ghi vào mục "Mâu thuẫn và điểm chưa rõ" của matrix, không đoán.
