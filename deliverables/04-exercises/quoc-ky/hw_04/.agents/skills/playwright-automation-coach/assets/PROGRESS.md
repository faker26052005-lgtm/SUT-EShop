# Tiến độ thực hiện HW04 Automation Testing

> **Sinh viên:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138  
> **Lớp:** 23CLC02  
> **Khởi tạo:** 2026-11-11  

---

## 1. Trạng thái các Phase

| Phase | Tên giai đoạn | Trạng thái | Ngày hoàn thành | Ghi chú / Quyết định |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Scope & Environment | `[ ] Chưa bắt đầu` | | FR-02 (Web), FR-07 (Web), FR-17 (Admin) |
| **Phase 2** | Test Case Selection | `[ ] Chưa bắt đầu` | | Lấy từ HW02 Main_Report.md (≥ 12 TC/feature) |
| **Phase 3** | Test Data Separation | `[ ] Chưa bắt đầu` | | Tách ra data/fr02-login.json, fr07-cart.json, fr17-coupon.json |
| **Phase 4** | Script Generation & Review | `[ ] Chưa bắt đầu` | | Page Objects, Data-driven Specs, ≥ 3 assertion patterns |
| **Phase 5** | Multi-Browser Runs (9 runs) | `[ ] Chưa bắt đầu` | | Chromium, Firefox, WebKit; Run by: 23120138; ISO timestamp |
| **Phase 6** | Human Review & Gap Analysis | `[ ] Chưa bắt đầu` | | Đối chiếu AI weaknesses, sửa lỗi, ghi docs/main-report.md |
| **Phase 7** | Bug Reporting & Issues | `[ ] Chưa bắt đầu` | | Đối chiếu SRS và HW02, tạo GitHub Issues kèm screenshot |
| **Phase 8** | Git History & Commit Log | `[ ] Chưa bắt đầu` | | ≥ 8 commit sửa spec, xuất docs/git-commit-log.txt |
| **Phase 9** | Package & Self-Assessment | `[ ] Chưa bắt đầu` | | Đóng gói zip, hoàn thiện README.md và PDF |

---

## 2. Nhật ký Quyết định (Decision Log)

- **Quyết định 1 (2026-11-11):** Sử dụng các tính năng từ HW02 gồm: FR-02 (Pool A - Web/API), FR-07 (Pool B - Web), FR-17 (Pool C - Admin).
- **Quyết định 2 (2026-11-11):** Chiến lược reset dữ liệu:
  - Reseed database bằng `node database.js` trước toàn bộ suite run.
  - FR-02 tạo tài khoản mới độc lập cho mỗi test qua `POST /api/register` để tránh xung đột đếm lỗi và khóa.
  - FR-07 dựa vào state giỏ hàng in-memory của React (`CartContext`), tự động sạch khi tạo page mới.
  - FR-17 tạo coupon mới qua API và xóa sạch trong `afterEach` qua `DELETE /api/admin/coupons/:id`.

---

## 3. Các mục Ghi đè (Overrides) nếu có
*(Ghi lại bất kỳ tiêu chí nào được sinh viên chủ động bỏ qua hoặc điều chỉnh kèm lý do)*
