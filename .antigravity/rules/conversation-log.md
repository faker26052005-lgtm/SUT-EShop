---
trigger: always_on
description: Ghi nhật ký từng lượt hội thoại vào executions/<run-id>/conversation.md
---

# Quy tắc ghi nhật ký hội thoại

Mục đích: lưu vết mỗi lần chạy workflow kiểm thử để làm bằng chứng. Quy tắc này **không** thay đổi quy trình kiểm thử, không được làm bạn bỏ qua điểm dừng nào.

## Ghi vào đâu

- Tệp: `executions/<run-id>/conversation.md`, với `<run-id>` là thư mục `run-*` mà lượt này đang làm việc (ví dụ `run-01-coupon`).
- Nếu chưa có thư mục run hoặc chưa có `conversation.md` (ví dụ lượt đầu, trước khi bạn tạo thư mục), hãy ghi sau khi đã tạo xong. Vẫn không có thì bỏ qua việc ghi và báo người dùng một câu.
- Dùng công cụ tạo và sửa tệp. Không dùng lệnh terminal để ghi.

## Khi nào ghi

Ở **cuối mỗi lượt**, sau khi đã xong việc của lượt đó. Kể cả lượt chỉ dừng chờ duyệt hoặc chờ lệnh "chạy", và kể cả lượt có lỗi hay bị gián đoạn.

## Ghi gì

Thêm một mục mới ở cuối tệp theo mẫu:

```
## Lượt N

**Người:** <lời nhắc của người dùng ở lượt này, nguyên văn>

**Agent (tóm tắt):** <2 đến 5 dòng: đã làm gì; tệp đã tạo hoặc sửa;
kết quả script check_coverage.py nếu có; đang dừng ở đâu (chờ duyệt, chờ chạy, hết)>
```

- Lời người dùng: chép **nguyên văn**, không rút gọn, không sửa. Quá dài thì chép phần đầu và ghi `[rút gọn vì quá dài]`.
- Phần Agent: luôn ghi rõ là **tóm tắt**. Không được nói là nguyên văn.
- `N` là số lượt kế tiếp, lấy theo mục `## Lượt` cuối cùng trong tệp. Nếu mục `## Lượt 1` của mẫu còn trống (cả Người và Agent), điền vào đó thay vì thêm mục mới.
- Người dùng nhắn "tiếp tục" sau khi bị gián đoạn: ghi thêm `(lượt tiếp tục sau gián đoạn)` ở đầu mục.
- Không chép token đăng nhập, chuỗi JWT hay mật khẩu mới phát sinh trong lúc test. Thay bằng `[token]` hoặc `[mật khẩu]`. Tài khoản mẫu trong `inputs/sample-data.md` thì chép được.

## Không được làm

1. Không sửa hay xóa nội dung đã ghi ở các lượt trước.
2. Không sửa phần đầu tệp (tên mô hình, ngày giờ, chế độ): đó là phần người dùng điền.
3. Không tự quyết định đã đến lúc chạy test, duyệt matrix hay sinh Karate chỉ vì đang ghi nhật ký. Việc ghi nhật ký không thay đổi pha hiện tại của quy trình.
4. Không ghi nhật ký vào tệp khác (`result.md`, `test-matrix.md`).
