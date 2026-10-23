# Lưu vết các lần chạy

Mỗi lần chạy một thư mục riêng, đặt tên `run-<số>-<phạm vi>`, ví dụ `run-01-coupon`:

```
executions/run-01-coupon/
├── test-matrix.md     # Agent sinh, người điền cột Duyệt
├── features/          # Karate feature do Agent sinh sau khi matrix được duyệt
├── report/            # Báo cáo Karate sau khi chạy
├── result.md          # Người điền, từ _template/result.md
└── conversation.md    # (bắt buộc) hội thoại với Agent, kèm tên và phiên bản mô hình
```

Bắt đầu một lần chạy mới: chép ba tệp trong `_template/` (`test-matrix.md`, `result.md`, `conversation.md`) vào thư mục mới.
Giữ lại mọi lần chạy, kể cả lần hỏng: đó là bằng chứng.
