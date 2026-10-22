# Weekly Technical Report — Week 05
# Báo Cáo Kỹ Thuật Cá Nhân Tuần 05

- **Họ và tên:** Nguyễn Hoàng Anh Tú  
- **MSSV:** 23120183  
- **Git Username:** `faker26052005-lgmt`  
- **Vai trò:** Thành viên Nhóm 11 — Phụ trách Pact Contract Testing (C1, C2, C3), Newman P3, Slide W06 & Báo cáo tổng hợp W06  
- **Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
- **Thời gian báo cáo:** Tuần thực hành 05 (Tương ứng Tuần lý thuyết 06) — 2026-10-22  

---

## 1. Nhiệm Vụ Phụ Trách Trong Tuần 05

1. **Hoàn thiện & Kiểm chứng Pact Contract Testing (C1, C2, C3):**
   - Kịch bản C1: Mobile Consumer Test sinh hợp đồng `EShopMobile-EShopBackend.json`.
   - Kịch bản C2: Provider Verification đối soát Backend thật `http://localhost:3000`.
   - Kịch bản C3: Breaking Change Simulation mô phỏng backend đổi trường `price` ➔ `unit_price`, chứng minh Pact chặn lỗi thành công.
2. **Postman / Newman CLI (P3):**
   - Thiết lập runner tự động qua Newman CLI xuất báo cáo HTML trực quan.
3. **Slide Thuyết Trình Seminar 30 Phút:**
   - Hoàn thiện bộ slide định dạng Marp Markdown tại `deliverables/01-slides/presentation.md` (15 slides chuẩn sư phạm, nền trắng chữ đen, tương thích ánh sáng phòng học).
4. **Báo Cáo Tổng Hợp Seminar W06 ($\ge 90\%$):**
   - Khởi tạo và chuẩn hóa cấu trúc báo cáo 8 phần tại `deliverables/02-reports/final-report.md`.

---

## 2. Kết Quả Kỹ Thuật Đạt Được

### 2.1. Pact Contract Testing
- Chạy kiểm thử thành công 100% trên local runtime:
  - `npm run test:consumer` ➔ PASS (1/1 test, tạo contract file).
  - `npm run test:provider` ➔ PASS (Provider verification thành công).
  - `npm run test:breaking` ➔ FAILED as expected (Bắt được phá vỡ hợp đồng).

### 2.2. Slide Presentation & Final Report
- File Slide: `deliverables/01-slides/presentation.md` (kèm file `README.md` hướng dẫn xuất PDF qua Marp CLI).
- File Báo cáo: `deliverables/02-reports/final-report.md` (chuẩn hóa toàn bộ heading từ mục 1 đến 8, loại bỏ phần lab thực hành theo yêu cầu thời lượng 30 phút).

---

## 3. Danh Mục Artifacts Tạo Mới & Cập Nhật

| Artifact | Đường dẫn | Mô tả |
|---|---|---|
| Slide Presentation (30m) | `deliverables/01-slides/presentation.md` | Bộ slide Marp Markdown 15 trang |
| Slide Guide | `deliverables/01-slides/README.md` | Hướng dẫn preview và export PDF |
| Báo cáo tổng hợp W06 | `deliverables/02-reports/final-report.md` | Báo cáo chi tiết toàn diện $\ge 90\%$ |
| Git Commit Log W05 | `deliverables/05-management/weekly-reports/week-05/Git_Commit_Log_Total.md` | Nhật ký commit toàn nhóm |
| Git Dashboard W05 | `deliverables/05-management/weekly-reports/week-05/Git_Commit_Log_Total.html` | Dashboard HTML trực quan hóa |
