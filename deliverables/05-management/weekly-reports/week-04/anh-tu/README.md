# Weekly Report Submission Guide — Week 02
# Hướng dẫn Nộp Báo cáo Tuần 02

## Cấu trúc thư mục

```
week-02/
├── Git_Commit_Log_Total.md          ← [CHUNG] [TEXT] AI scan - Git log toàn project
├── Git_Commit_Log_Total.html        ← [CHUNG] [VISUAL] GV đọc - HTML dashboard
├── task-board.png                   ← [CHUNG] Task board tiến độ nhóm
├── anh-tu/                          ← THƯ MỤC CÁ NHÂN (Nguyễn Hoàng Anh Tú)
│   ├── AI_Usage_Declaration.md      ← [TEXT] Tuyên bố sử dụng AI
│   ├── AI_Usage_Declaration.html    ← [VISUAL] HTML trực quan hóa AI usage
│   ├── Weekly_Technical_Report.md   ← Báo cáo kỹ thuật Pact Testing (C1, C2, C3)
│   ├── README.md                    ← File hướng dẫn này
│   ├── screenshots/                 ← Bổ sung screenshot kịch bản C1, C2, C3
│   └── demo/                        ← Bổ sung video demo Pact testing
├── Ha_Quoc_Kien/                    ← Thư mục cá nhân của Hà Quốc Kiên
└── quoc-ky/                         ← Thư mục cá nhân của Nguyễn Quốc Kỳ
```

## Checklist Nộp Bài

### ✅ Đã hoàn thành
- [x] AI_Usage_Declaration.md (text cho AI scan)
- [x] AI_Usage_Declaration.html (visualization cho GV)
- [x] Git_Commit_Log_Total.md (text cho AI scan)
- [x] Git_Commit_Log_Total.html (visualization với contribution chart)
- [x] Weekly_Technical_Report.md (báo cáo kỹ thuật)

### ⏳ Còn thiếu — Cần bổ sung thủ công
- [ ] **Screenshots** — Chụp màn hình terminal khi chạy C1/C2/C3 → lưu vào `screenshots/`
- [ ] **Demo video** — Quay màn hình chạy toàn bộ 3 kịch bản → lưu vào `demo/`
- [ ] **Điền MSSV** — Kỳ và Kiên cần bổ sung MSSV trong `Git_Commit_Log_Total.md`

## Cách chụp screenshot nhanh
1. Mở terminal, chạy từng lệnh C1/C2/C3
2. Nhấn `Win + Shift + S` (Snip & Sketch) để chụp vùng màn hình
3. Paste vào Paint hoặc dùng `screenshots/` của VS Code

## Cách convert HTML → PDF (nếu cần nộp PDF)
- Mở file `.html` trong Chrome
- Nhấn `Ctrl + P` → chọn "Save as PDF"
- Lưu vào cùng thư mục với tên tương ứng

## Ghi chú
- **File .md** được dùng để AI có thể đọc và scan nội dung (text-based)
- **File .html** được dùng để GV đọc dễ hơn với bảng và màu sắc
- Cả hai phải được commit lên repo trước deadline
