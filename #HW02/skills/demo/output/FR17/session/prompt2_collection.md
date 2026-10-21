# FR-17 – Quản lý Mã Giảm Giá · Xây dựng Postman Collection và Dry-Run

| Trường | Giá trị |
| :-- | :-- |
| Công cụ AI | Antigravity IDE (Google DeepMind) / Claude 3.7 Sonnet & Gemini 3.8 Flash |
| Ngày giờ | 2026-10-21 09:33:26 (UTC+0700) |
| Feature / bước | FR-17 – Collection test và Dry-run (postman-api-test-suite) |
| Chat / phiên | FR17 Test Suite Automation Session |
| Commit liên quan | |

## Prompt (nguyên văn)
```
Dùng skill postman-api-test-suite để tạo Postman collection từ FR17_test_design.md.

Yêu cầu:
1. Đọc FR17_response_samples.md. Nếu thiếu field cần dùng (ví dụ id của mã giảm giá), gọi thêm API thật bằng curl để xác nhận. Không đọc source code hệ thống.
2. Chỉ tự động hóa các ca API của bản thiết kế cuối cùng (sau khi khử trùng DT/BV); ca UI để vào danh sách thủ công. Không đổi kỳ vọng nào để test pass.
3. Viết tests.json, sinh FR17_API_postman_collection.json bằng build_collection.py.
4. Chạy dry_run.js với http://localhost:3000 và lưu toàn bộ output vào FR17_run_output.txt. Nếu có dòng ERROR thì sửa tests.json hoặc script (không đổi kỳ vọng), sinh lại và chạy lại, tối đa 3 vòng.
5. Khi không còn ERROR, điền bugs trong tests.json cho các ca FAIL có điều khoản SRS (mỗi nguyên nhân gốc một nhóm) và sinh lại collection.
6. Cuối cùng liệt kê các file đã tạo, số PASS / FAIL / CẦN LÀM RÕ, và các ca thủ công chưa chạy.
```

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
```
Đã hoàn thành toàn bộ quy trình của skill postman-api-test-suite cho tính năng FR-17: Quản lý Mã Giảm Giá (Coupon CRUD).

### 1. Danh sách các file đã tạo
Tất cả các file được lưu tại: #HW02/skills/demo/output/FR17/
1. tests.json: File đặc tả test suite gồm 34 ca kiểm thử API (DT, BV, AC, BL) và 4 nhóm tái hiện bug có điều khoản SRS tương ứng.
2. FR17_API_postman_collection.json: Collection Postman v2.1 hoàn chỉnh gồm Folder A (RUN ALL) và Folder B (Tái hiện bug).
3. FR17_run_output.txt: Lưu toàn bộ kết quả thực thi kiểm thử từ script dry_run.js với http://localhost:3000.

### 2. Kết quả kiểm thử thực tế (Dry-Run với http://localhost:3000)
| Phân loại | Số lượng | Tỷ lệ | Chi tiết |
| :--- | :---: | :---: | :--- |
| PASS | 13 | 38.2% | DT-01, DT-02, DT-15, BV-03, BV-05, BV-06, AC-01, AC-02, AC-03, AC-05, BL-01, BL-02, BL-03 |
| FAIL | 17 | 50.0% | DT-03, DT-04, DT-05, DT-06, DT-07, DT-08, DT-09, DT-10, DT-11, DT-12, DT-16, BV-01, BV-02, BV-04, BV-07, AC-04, AC-06 |
| CẦN LÀM RÕ | 4 | 11.8% | DT-13, DT-14, BL-04, BL-05 |
| LỖI SCRIPT (ERROR) | 0 | 0% | Toàn bộ script chạy thông suốt, không có lỗi runtime/cú pháp |
| TỔNG CỘNG | 34 | 100% | (34 ca API sau khi khử trùng DT/BV) |

### 3. Phân nhóm Bug theo nguyên nhân gốc (Folder B trong Postman)
17 ca FAIL đều có điều khoản SRS bị vi phạm và được gom thành 4 nhóm bug:
- FR-17-BUG-01 (R1, R3): Thiếu kiểm tra quyền Admin (RBAC) — User thường vẫn tạo được (AC-04) và xóa được coupon (AC-06) với HTTP 200.
- FR-17-BUG-02 (R4, R6, R7, R8, R9, R10): Thiếu validation dữ liệu đầu vào khi tạo coupon.
- FR-17-BUG-03 (R5): Trùng mã giảm giá gây lỗi máy chủ 500 — Trùng code không được controller xử lý mà ném SQLITE_CONSTRAINT.
- FR-17-BUG-04 (R12): Xóa coupon không tồn tại trả về HTTP 200 thành công thay vì 404/400.

### 4. Danh sách các ca UI thủ công chưa chạy (chạy thủ công trên trình duyệt)
1. UI-01: Kiểm tra form thêm mã giảm giá mới trên trang quản trị có đầy đủ các trường nhập liệu.
2. UI-02: Kiểm tra hộp thoại xác nhận khi click nút Xóa.
3. UI-03: Kiểm tra hiển thị trực quan trạng thái của mã giảm giá trên bảng danh sách.
```

### Danh sách lệnh đã chạy và kết quả thật
- **Lệnh tạo collection**:
  ```bash
  python .agents/skills/postman-api-test-suite/scripts/build_collection.py tests.json -o FR17_API_postman_collection.json
  ```
  *Kết quả thật*: `wrote FR17_API_postman_collection.json: 34 tests, 4 bug folders`
- **Lệnh chạy dry-run**:
  ```bash
  node .agents/skills/postman-api-test-suite/scripts/dry_run.js FR17_API_postman_collection.json http://localhost:3000
  ```
  *Kết quả thật*:
  ```text
  {"PASS":13,"FAIL":17,"CLARIFY":4,"ERROR":0}
  Chạy lúc: 2026-10-21T02:46:27.059Z | baseUrl: http://localhost:3000 | PASS 13 | FAIL 17 | CẦN LÀM RÕ 4
  ```

### Danh sách file đã tạo
- `tests.json` (31,328 bytes)
- `FR17_API_postman_collection.json` (69,532 bytes)
- `FR17_run_output.txt` (9,243 bytes)
- `FR17_response_samples.md` (2,875 bytes)

## Rà soát của tôi (human review)
- Chấp nhận: Có/Không
- Các chỉnh sửa trong AI_gap_analysis:
