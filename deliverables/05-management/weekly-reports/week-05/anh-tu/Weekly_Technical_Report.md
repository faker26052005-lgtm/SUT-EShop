# Weekly Technical Report — Week 05
# Báo Cáo Kỹ Thuật Cá Nhân Tuần 05

- **Họ và tên:** Nguyễn Hoàng Anh Tú  
- **MSSV:** 23120183  
- **Git Username:** `faker26052005-lgmt`  
- **Vai trò:** Thành viên Nhóm 11 — Phụ trách Pact Contract Testing (C1, C2, C3), Newman P3, Slide W06 & Báo cáo tổng hợp W06  
- **Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
- **Thời gian báo cáo:** Tuần thực hành 05 (Tương ứng Tuần lý thuyết 06) — 2026-10-23  

---

## 1. Nhiệm Vụ Phụ Trách Trong Tuần 05

1. **Hoàn thiện & Kiểm chứng Pact Contract Testing (C1, C2, C3):**
   - Kịch bản C1: Mobile Consumer Test sinh hợp đồng `EShopMobile-EShopBackend.json`.
   - Kịch bản C2: Provider Verification đối soát Backend thật `http://localhost:3000`.
   - Kịch bản C3: Breaking Change Simulation mô phỏng backend đổi trường `price` ➔ `unit_price`, chứng minh Pact chặn lỗi thành công.
2. **Postman / Newman CLI (P3):**
   - Thiết lập runner tự động qua Newman CLI xuất báo cáo HTML Dashboard trực quan bằng `newman-reporter-htmlextra`.
3. **Slide Thuyết Trình Seminar (PowerPoint & Markdown):**
   - Hoàn thiện bộ slide trình chiếu chính thức `deliverables/01-slides/presentation.pptx` (đầy đủ nội dung, hình ảnh minh họa, định dạng chuẩn thuyết trình).
   - Duy trì bản Marp Markdown tại `deliverables/01-slides/presentation.md` (15 slides chuẩn sư phạm, nền trắng chữ đen).
4. **Báo Cáo Tổng Hợp Seminar W06 ($\ge 90\%$):**
   - Khởi tạo và chuẩn hóa cấu trúc báo cáo 8 phần tại `deliverables/02-reports/final-report.md`.
5. **Video Thuyết Trình & Kịch Bản Demo:**
   - Hoàn thành video lý thuyết Contract Testing & Trọn bộ Demo Pact JS.
   - Chuẩn hóa danh mục video và cập nhật các liên kết YouTube vào `deliverables/03-demo-videos/demo-links.md`.

---

## 2. Kết Quả Kỹ Thuật Đạt Được

### 2.1. Pact Contract Testing
- Chạy kiểm thử thành công 100% trên local runtime:
  - `npm run test:consumer` ➔ PASS (1/1 test, tạo contract file `EShopMobile-EShopBackend.json`).
  - `npm run test:provider` ➔ PASS (Provider verification đối soát thành công với backend Express thật).
  - `npm run test:breaking` ➔ FAILED as expected (Phát hiện chính xác lỗi lệch trường `price` ➔ `unit_price`).

### 2.2. Newman CLI & Visual HTML Dashboard (P3)
- Tự động hóa bộ Collection `eshop_api_postman_collection_v3.json` qua dòng lệnh.
- Xuất báo cáo HTML Dashboard trực quan với `newman-reporter-htmlextra`, hỗ trợ biểu đồ tỷ lệ Pass/Fail, phân tích thời gian phản hồi và lọc lỗi chi tiết.

### 2.3. Slide Presentation & Final Report
- File Slide PPTX: `deliverables/01-slides/presentation.pptx` (Trình bày đầy đủ các phần: Giới thiệu, API Testing, Contract Testing, Demo & Kết luận).
- File Slide Markdown: `deliverables/01-slides/presentation.md` (kèm file `README.md` hướng dẫn xuất PDF qua Marp CLI).
- File Báo cáo: `deliverables/02-reports/final-report.md` (chuẩn hóa toàn bộ heading từ mục 1 đến 8, đạt độ hoàn thiện $\ge 90\%$).

### 2.4. Video Demo & Bảng Danh Sách Video
- Hoàn thành quay và đăng tải video Thuyết trình lý thuyết Contract Testing và Demo thực hành Pact.
- Chuẩn hóa cấu trúc 2 bảng phân loại rõ ràng trong `deliverables/03-demo-videos/demo-links.md`.

---

## 3. Danh Mục Artifacts Tạo Mới & Cập Nhật

| Artifact | Đường dẫn | Mô tả |
|---|---|---|
| Slide Presentation (PPTX) | `deliverables/01-slides/presentation.pptx` | File trình chiếu chính thức của nhóm |
| Slide Presentation (Marp) | `deliverables/01-slides/presentation.md` | Bộ slide Marp Markdown 15 trang |
| Slide Guide | `deliverables/01-slides/README.md` | Hướng dẫn preview và export PDF |
| Danh sách Video Demo | `deliverables/03-demo-videos/demo-links.md` | Bảng tổng hợp link YouTube các video lý thuyết & kịch bản demo |
| Báo cáo tổng hợp W06 | `deliverables/02-reports/final-report.md` | Báo cáo chi tiết toàn diện $\ge 90\%$ |
| Git Commit Log W05 (MD) | `deliverables/05-management/weekly-reports/week-05/Git_Commit_Log_Total.md` | Nhật ký commit toàn nhóm cập nhật mới nhất (39 commits) |
| Git Dashboard W05 (HTML) | `deliverables/05-management/weekly-reports/week-05/Git_Commit_Log_Total.html` | Dashboard HTML trực quan hóa tỷ lệ commit |
| Sơ đồ Gantt tiến độ | `deliverables/05-management/weekly-reports/week-05/seminar-gantt-chart.mmd` | Biểu đồ Mermaid tiến độ theo tuần |
