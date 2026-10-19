# CHECKLIST

## A. Quy trình cho MỖI feature (mỗi bước = 1 commit)

Bắt đầu: `python3 scripts/hw.py new-feature FR-09 "Mã giảm giá" B`

| # | Bước | File | Commit message gợi ý |
| :-: | :--- | :--- | :--- |
| 0 | Chuẩn bị môi trường (chạy SUT, import Postman) | `06` mục 6.1 | `chore(FR-xx): setup SUT and test environment` |
| 1 | Trích yêu cầu | `01_requirements.md` | `docs(FR-xx): extract requirements` |
| 2 | Xác định biến | `02_variables.md` | `docs(FR-xx): identify input variables and constraints` |
| 3 | Domain Testing: lớp tương đương | `03` mục 3.1 | `docs(FR-xx): equivalence partitions` |
| 4 | Domain Testing: test case | `03` mục 3.2–3.3 | `test(FR-xx): domain testing test cases` |
| 5 | Boundary Value Analysis | `04` | `test(FR-xx): boundary value analysis` |
| 6 | Nghiệp vụ / bảo mật / truy cập | `05` | `test(FR-xx): business, security and access control cases` |
| 7 | Thực thi và ghi kết quả | `06` | `test(FR-xx): execute tests and record results` |
| 8 | Gom bug theo nguyên nhân gốc + tạo GitHub Issue | `07`, `bugs/` | `docs(FR-xx): root-cause grouping and bug reports` |
| 9 | AI gap analysis | `08` | `docs(FR-xx): AI gap analysis` |
| 10 | Tổng kết + câu hỏi làm rõ | `09`, `clarifications.md` | `docs(FR-xx): test summary and clarification questions` |

## B. Quy tắc khi dùng AI

- Một chat riêng cho mỗi feature. Mỗi bước một prompt riêng (không gộp).
- Ngay sau mỗi lần dùng AI: `python3 scripts/hw.py new-entry FR-xx "Bước 3 - lớp tương đương" --tool "Claude Sonnet 5.5"`
  rồi dán prompt + output gốc (chưa sửa) vào file vừa tạo. Script tự ghi ngày giờ.
- Chỉ đưa AI đoạn SRS + API spec. KHÔNG đưa đáp án/bản mẫu trước khi AI sinh test, nếu không phần AI gap analysis mất ý nghĩa.
- Sau mỗi bước ghi mục "Tôi đã rà soát / sửa gì" (bằng chứng human review, cũng là tài liệu ôn vấn đáp).
- Gặp AI sai/thiếu: ghi ngay vào bảng "Nhật ký sự cố AI" trong `ai_audit/AI_CRITIQUE.md`.

## C. Quy tắc khi chạy test

- Mỗi test dùng user mới; kiểm tra bằng cách đọc lại dữ liệu sau khi gửi, không chỉ nhìn mã HTTP.
- Mỗi test chỉ vi phạm một điều kiện.
- Chỗ SRS im lặng → ghi `CẦN LÀM RÕ`, không mở bug, ghi vào `clarifications.md`.
- PASS không có nghĩa là không có tác dụng phụ: ghi riêng cột side-effect.
- Test đỏ ≠ bug: gom theo nguyên nhân gốc trước khi mở Issue. Mỗi Issue có ảnh chụp.

## D. Trước khi nộp (thiếu bất kỳ tài liệu bắt buộc nào = 0 điểm; không nhận nộp trễ)

- [ ] Báo cáo chính (Markdown + PDF): Domain Testing + BVA cho từng feature
- [ ] Báo cáo bug + ảnh chụp trang GitHub Issues
- [ ] AI Critique (200–300 từ) và AI Audit Report (Markdown + PDF)
- [ ] Git commit log dạng text (`git_log.txt`)
- [ ] `README.md`: bảng tự đánh giá + test summary + link video demo
- [ ] Agent Skill + video demo (YouTube)
- [ ] Đã chạy `python3 scripts/hw.py check` (không còn TODO / thiếu file)
- [ ] Đã đóng gói: `python3 scripts/hw.py package <MSSV> <điểm 3 chữ số>`
- [ ] Đã khai báo AI đầy đủ; không sao chép prompt/bài của bạn khác (cả hai bên đều 0 điểm)
- [ ] Chuẩn bị vấn đáp 5–7 phút (có thể bị gọi ngẫu nhiên): giải thích được từng bước đã làm
