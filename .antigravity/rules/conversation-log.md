---
trigger: always_on
description: Ghi nhật ký hội thoại của mỗi lần chạy test vào executions/<run-id>/conversation.md. Xóa file này nếu không cần nhật ký.
---

# Nhật ký hội thoại

Khi đã có tên lần chạy, sau mỗi lượt trả lời hãy **thêm vào cuối** `executions/<run-id>/conversation.md` (tạo file nếu chưa có):

```
## Lượt <N>
**Người:** <câu người dùng gửi, nguyên văn>
**Agent (tóm tắt):** <tối đa 5 dòng: đã làm gì, hỏi gì, đang chờ gì>
**Tệp đổi:** <danh sách đường dẫn tạo hoặc sửa, hoặc "không">
```

- Chỉ thêm, không sửa hay xóa nội dung đã ghi, không sửa phần đầu file (người điền mô hình, ngày giờ).
- Không ghi phân tích hay kết luận vào đây. Kết quả nằm ở `result.md`.
- Không ghi nhật ký vào tệp nào khác.
