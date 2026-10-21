# FR-17 – MANIFEST Gói Nộp Bài Kiểm Thử Tự Động Hóa

Gói tài liệu và mã kiểm thử tính năng **FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)**.

---

## Danh mục tệp tin và kích thước

| STT | Tên tệp tin | Kích thước (bytes) | Bước tạo / Vai trò | Mô tả tóm tắt |
| :-: | :--- | :---: | :--- | :--- |
| 1 | `system_requirements_specification.md` | 16,759 | Đầu vào (Input) | Đặc tả yêu cầu nghiệp vụ hệ thống SUT-EShop (FR-17 mục 2.17, quy định admin, ràng buộc dữ liệu R1–R13, SEC-02/03). |
| 2 | `api_specification.md` | 5,895 | Đầu vào (Input) | Đặc tả giao diện lập trình ứng dụng (REST API endpoints, auth header, payload body, mã trạng thái HTTP). |
| 3 | `FR17_test_design.md` | 25,533 | Prompt 1 (Test Design) | Thiết kế kiểm thử hộp đen toàn diện theo skill `domain-bva-test-design` (Step 0→7, phân tích DT/BVA, ma trận khử trùng). Đạt `RESULT: OK`. |
| 4 | `FR17_response_samples.md` | 2,787 | Prompt 2 (API Investigation) | Mẫu phản hồi API thực tế thu thập từ máy chủ `http://localhost:3000` phục vụ xác minh cấu trúc dữ liệu và schema response. |
| 5 | `tests.json` | 31,328 | Prompt 2 (Postman Suite) | Tập tin JSON đặc tả 34 ca test tự động và cấu hình 4 nhóm bug tái hiện theo schema của skill `postman-api-test-suite`. |
| 6 | `FR17_API_postman_collection.json` | 69,532 | Prompt 2 (Postman Suite) | Postman Collection v2.1 sinh tự động bởi `build_collection.py`, gồm Folder A (RUN ALL 34 tests) và Folder B (4 bug repro folders). |
| 7 | `FR17_run_output.txt` | 9,243 | Prompt 2 (Execution Log) | Toàn bộ log chạy thật collection qua `dry_run.js` đối với máy chủ cục bộ (PASS 13, FAIL 17, CẦN LÀM RÕ 4, ERROR 0). |
| 8 | `FR17_results.md` | 11,927 | Prompt 3 (Reporting) | Báo cáo kiểm thử tổng kết, phân nhóm 4 bug theo nguyên nhân gốc, phụ lục 4 câu hỏi cần làm rõ, chi tiết bug write-up. Đạt `RESULT: CONSISTENT`. |
| 9 | `session/prompt1_test_design.md` | 2,240 | Prompt 1 (Session Log) | AI-usage log ghi lại thông tin model, prompt nguyên văn, lệnh và kết quả thực thi của phiên thiết kế test. |
| 10 | `session/prompt2_collection.md` | 5,055 | Prompt 2 (Session Log) | AI-usage log ghi lại thông tin model, prompt nguyên văn, lệnh và kết quả thực thi của phiên tạo collection và dry-run. |
| 11 | `session/prompt3_report.md` | 6,468 | Prompt 3 (Session Log) | AI-usage log ghi lại thông tin model, prompt nguyên văn, lệnh và kết quả thực thi của phiên lập báo cáo kết quả. |
| 12 | `MANIFEST.md` | ~2,500 | Đóng gói (Packaging) | Bảng kê danh mục tệp tin, kích thước và nguồn gốc quy trình thực hiện. |

---

## Tóm tắt số liệu kiểm thử
- **Tổng ca test thiết kế**: 36 ca (34 ca API thực thi + 2 ca BVA `BV-08`, `BV-09` đã khử trùng gộp vào `DT-01`, `DT-02`) + 3 ca UI kiểm tra thủ công trên trình duyệt.
- **Tổng ca API tự động hóa**: 34 ca.
- **Kết quả thực thi**:
  - **PASS**: 13 ca (38.2%)
  - **FAIL**: 17 ca (50.0%) → Vi phạm điều khoản SRS R1, R3, R4, R5, R6, R7, R8, R9, R10, R12 và SEC-03, được gom thành 4 nhóm Bug.
  - **CẦN LÀM RÕ**: 4 ca (11.8%) → SRS im lặng, không tính là Bug.
  - **LỖI SCRIPT (ERROR)**: 0 ca (0%).
