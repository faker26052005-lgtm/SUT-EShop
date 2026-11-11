# HW03-AI – GUI & Usability (EShop)

| Hạng mục | Nội dung |
|---|---|
| Sinh viên | Hà QUốc Kiên – MSSV: 23120056 |
| SUT | EShop – https://github.com/ttbhanh/eshop-sut |
| GitHub Issues (bug) | https://github.com/faker26052005-lgtm/SUT-EShop/issues |

## 1. Bảng tự đánh giá

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Task 1 – GUI Checklist (design + execution + bug report) | 30 | 28 |
| 2 | Task 2 – Usability Evaluation (task scenario + 7 sessions + analysis) | 40 | 30 |
| 3 | Task 3 – Cross-Browser / Cross-Platform (≥ 3 platforms) | 20 |12 |
| 4 | Agent Skills | 10 | 0 |
| | **Total** | **100** | 70 |

## 2. Test summary

### 2.1 Số liệu tổng hợp

| Chỉ số | Giá trị |
|---|---|
| Số màn hình đã kiểm thử | 3 (Register, Login, Profile) |
| Số flow đã đánh giá usability | 1 (tìm kiếm sản phẩm → xem kết quả → mở chi tiết sản phẩm) |
| Số mục checklist đã thiết kế | 51 (46 do AI sinh sau rà soát + 5 tự bổ sung) |
| Số mục checklist đã thực thi | 51 |
| Passed | 29 |
| Failed | 22 |
| Số bug | 15 (2 High, 5 Medium, 8 Low) |
| Số người tham gia usability | 7 (cộng 1 người cho buổi pilot) |
| Điểm SUS trung bình | 44,6 |
| Số nền tảng đã kiểm thử | 3 (Firefox 157, Chrome 159, Safari 27) |
| Video demo | Xem mục 2.3 |

Passed/Failed ở bảng trên là kết quả Task 1 (Firefox 157). Kết quả trên từng nền tảng:

| Nền tảng | Passed | Failed |
|---|---|---|
| Firefox 157 (Windows) | 29 | 22 |
| Chrome 159 (Windows) | 28 | 23 |
| Safari 27 (macOS, BrowserStack Live) | 29 | 22 |

Ghi chú: 22 mục Failed được gộp thành 14 bug (GUI-BUG-01 đến 14). GUI-BUG-15 là bug riêng của Chrome, phát hiện ở Task 3 (mục UI-50).

### 2.2 Kết quả theo task

| Task | Kết quả chính |
|---|---|
| Task 1 – GUI Checklist | 51 mục bao phủ IA-01 đến IA-04; 22 mục Failed, gộp thành 14 bug. Hai bug High: không đăng ký được (GUI-BUG-01) và không cập nhật được hồ sơ (GUI-BUG-03). |
| Task 2 – Usability | 7/7 người hoàn thành nhiệm vụ (6 độc lập, 1 có gợi ý nhẹ); SUS trung bình 44,6; 5/7 người không tin tưởng thông tin ở trang chi tiết sản phẩm. |
| Task 3 – Cross-platform | 14 bug từ Task 1 tái hiện giống nhau trên cả 3 nền tảng; 1 bug riêng của Chrome (mật khẩu dán vào bị hiển thị rõ). |

### 2.3 Video

Toàn bộ video nằm trong một thư mục Google Drive: https://drive.google.com/drive/folders/16Ca2PacjcAI1iX1kxKJz5SRSw_oRPboI?usp=drive_link

## 3. Cấu trúc bài nộp

| Tài liệu | File |
|---|---|
| Báo cáo chính (Markdown + PDF): checklist, usability, cross-platform | `HW03_Main_Report.md` / `.pdf` |
| Bug Report (kèm ảnh trang GitHub Issues) | HW03_Bug_Report.md |
| AI Audit Report và AI Critique (Markdown + PDF) | 00_AI_AUDIT_REPORT.md |
| Git commit log (file text) | commit_log.txt |
| Excel checklist (51 mục) và test summary | HW03_Task1_Checklist.csv |
| Kết quả Task 3 (51 mục × 3 nền tảng) | `HW03_Task3_Results.csv` |
| Bằng chứng usability (kịch bản, ghi chú quan sát, phiếu SUS, video, bảng 7 người) | HW03_Task2_Evidence.md |
| Ảnh chụp cross-browser (45 ảnh) | Thư mục `Task-3/screenshots/` |
