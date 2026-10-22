# Weekly Report Submission Guide — Week 05 (Thực hành) / Week 06 (Lý thuyết)
# Hướng Dẫn & Danh Mục Nộp Báo Cáo Tuần 05

**Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
**Chủ đề Seminar:** T06 · API Testing & Contract Testing  
**Nhóm thực hiện:** Nhóm 11  
**Quy ước tuần:** Tuần thực hành 05 tương ứng Tuần lý thuyết 06 (Mốc nộp $\ge 90\%$ nội dung Seminar).

---

## 1. Cấu Trúc Thư Mục Báo Cáo Tuần 05

```text
week-05/
├── README.md                            ← [File này] Hướng dẫn tổng quan và checklist nộp bài
├── Git_Commit_Log_Total.md              ← [CHUNG] [TEXT] Log commit tổng hợp của toàn nhóm (AI scan)
├── Git_Commit_Log_Total.html            ← [CHUNG] [VISUAL] Dashboard thống kê commit trực quan (GV đọc)
├── seminar-gantt-chart.mmd              ← [CHUNG] Sơ đồ Gantt tiến độ công việc tuần 05
├── task-board.png                       ← [CHUNG] Ảnh chụp bảng Kanban/Task Board tuần 05
├── anh-tu/                              ← THƯ MỤC CÁ NHÂN: Nguyễn Hoàng Anh Tú - faker26052005-lgmt (23120183)
│   ├── README.md                        ← Hướng dẫn & checklist cá nhân
│   ├── Weekly_Technical_Report.md       ← Báo cáo kỹ thuật tuần 05 (Pact C1-C3, Newman CLI, Slide W06)
│   ├── AI_Usage_Declaration.md          ← Tuyên bố & nhật ký sử dụng AI tuần 05
│   └── screenshots/                     ← Ảnh chụp màn hình minh chứng
├── quoc-ky/                             ← THƯ MỤC CÁ NHÂN: Nguyễn Quốc Kỳ - quocky05 (23120138)
│   ├── README.md                        ← Hướng dẫn & checklist cá nhân
│   ├── evidence-summary.md              ← Báo cáo kỹ thuật Karate K1-K3, Pact C3 breaking change
│   ├── AI_Usage_Declaration.md          ← Tuyên bố & nhật ký sử dụng AI tuần 05
│   ├── quocky-git-commit-logs.md        ← Log commit cá nhân
│   └── evidences/                       ← Ảnh chụp màn hình & minh chứng thực thi
└── Ha_Quoc_Kien/                        ← THƯ MỤC CÁ NHÂN: Hà Quốc Kiên - kienha5 (23120056)
    ├── README.md                        ← Hướng dẫn & checklist cá nhân
    ├── Postman_Test_Report.md           ← Báo cáo kỹ thuật Postman P1-P2, CSV Data-driven & AI Agent
    ├── AI_Usage_Declaration.md          ← Tuyên bố & nhật ký sử dụng AI tuần 05
    └── evidences/                       ← Minh chứng thực thi Postman & AI Prompt
```

---

## 2. Checklist Các Hạng Mục Cần Hoàn Thành Cho Tuần 05

### ✅ Trụ cột 1: Git Commit Log
- [x] Bảng map `Git Username ↔ MSSV ↔ Họ và tên ↔ Nhiệm vụ chính`.
- [x] Trích xuất danh sách commit không merge (`git log --no-merges`) của 3 thành viên.
- [x] Dashboard HTML trực quan hóa tỷ lệ commit đóng góp.

### ✅ Trụ cột 2: AI Usage Declaration
- [x] Tuyên bố cam kết liêm chính học thuật (Academic Integrity & Category 5).
- [x] Bảng tổng kết số lượt tương tác AI, prompt yêu cầu, kết quả và kiểm chứng (Human-in-the-loop).
- [x] Nhật ký chat log chi tiết của từng thành viên trong thư mục cá nhân.

### ✅ Trụ cột 3: Báo cáo Kỹ thuật & Minh chứng
- [x] Báo cáo kỹ thuật từng phần hành (Pact JS, Karate Framework, Postman CSV, AI Agent).
- [x] Minh chứng hình ảnh (terminal output, html report, pass/fail verification) trong thư mục `screenshots/` hoặc `evidences/`.
- [x] Cập nhật tiến độ Gantt Chart và ảnh chụp Kanban Task Board.

---

## 3. Quy Ước Đóng Gói Nộp Bài (.zip)

Khi nộp qua hệ thống Portal/Moodle theo yêu cầu của Giảng viên:
- **Tên file nén:** `Group11-05.zip` (theo quy ước tuần thực hành thứ 5).
- Đảm bảo có đầy đủ cả file `.md` (để hệ thống AI scan) và file `.html` / `.png` (để Giảng viên chấm trực quan).
