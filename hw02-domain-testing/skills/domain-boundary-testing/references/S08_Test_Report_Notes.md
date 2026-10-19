# Tóm Tắt Bài Giảng S08: Test Report & Bug Report (Báo Cáo Kiểm Thử & Quản Lý Lỗi)
**Môn học:** Software Testing (CSC13003) - FIT@HCMUS  
**Nguồn tham chiếu chính thức:** `S08_Test Report.pdf`

---

## 1. Vòng Đời Của Lỗi (Bug / Defect Life Cycle)

Quy trình chuẩn xử lý một lỗi phần mềm (Slide 3):
1. **New:** Tester phát hiện lỗi và khởi tạo bug report.
2. **Analysis / Triage:** Quản lý dự án / Tech Lead phân tích:
   * Nếu không phải lỗi $\rightarrow$ **Rejected** (Bác bỏ).
   * Nếu nằm ngoài phạm vi $\rightarrow$ **Deferred** (Hoãn lại phiên bản sau).
   * Nếu đã có người báo $\rightarrow$ **Duplicate** (Trùng lặp).
   * Nếu hợp lệ $\rightarrow$ Chuyển trạng thái **In-Progress** cho Developer sửa.
3. **Fixed:** Developer sửa xong mã nguồn.
4. **Retest:** Tester tiến hành kiểm thử lại (Retest):
   * Nếu kiểm thử đạt $\rightarrow$ **Closed** (Đóng lỗi).
   * Nếu vẫn còn lỗi $\rightarrow$ **Re-opened** (Mở lại).

---

## 2. Báo Cáo Lỗi (Bug Report) & 10 Thành Phần Bắt Buộc

* **Châm ngôn của Cem Kaner:**
  > *"The point of writing a problem report (bug report) is to get bugs fixed."*  
  > (Mục đích duy nhất của việc viết báo cáo lỗi là để lỗi được lập trình viên sửa).
* **Đặc tính của một Bug Report tốt (Slide 13):**
  * `Written` (Văn bản rõ ràng), `Numbered` (Có mã định danh), `Simple` (Đơn giản), `Understandable` (Dễ hiểu), `Reproducible` (Tái hiện được), `Legible` (Mạch lạc), `Non-judgmental` (Khách quan, không phán xét cá nhân).

### 10 Thành Phần Cốt Lõi (10 Bug Report Essentials - Slide 5 - 12):

1. **Bug ID:** Mã định danh duy nhất (ví dụ: `BUG-FR01-01`). Khác với `Test Case ID`.
2. **Function name:** Tên chức năng/màn hình phát hiện lỗi (ví dụ: `FR-01: Đăng ký tài khoản`).
3. **Problem summary:** Tóm tắt lỗi theo cú pháp chuẩn mực:
   $$\mathbf{Test\ Objective} + \mathbf{Actual\ Result} \ (\text{vs. } \mathbf{Expected\ Result})$$
   *Ví dụ:* *"Register Account: Accepts email missing @ instead of returning validation error"*.
4. **How to reproduce the defect (Các bước tái hiện):**
   * **Environment:** Hệ điều hành, Trình duyệt, Nền tảng (ví dụ: `Windows 11, Google Chrome 120, Node.js v20, Backend Port 3000`).
   * **Steps to Reproduce:** Các bước tuần tự `1, 2, 3...` kèm dữ liệu nhập cụ thể.
   * **Expected Behavior:** Hệ thống đáng lẽ phải xử lý như thế nào.
   * **Actual Behavior:** Hệ thống thực tế xử lý ra sao (kèm log, mã lỗi HTTP, chụp màn hình).
5. **Reported by:** Họ tên và MSSV của Tester (ví dụ: `Nguyễn Hoàng Anh Tú - 23120183`).
6. **Date:** Ngày ghi nhận lỗi.
7. **Assign to:** Người chịu trách nhiệm sửa (Frontend Dev / Backend Dev).
8. **Status:** `New` / `In-Progress` / `Fixed` / `Closed` / `Reopened`.
9. **Priority (Mức độ ưu tiên sửa chữa - Thời gian khắc phục):**
   * **Immediate (Critical):** Phải sửa ngay lập tức hoặc trong 01 ngày (gây thiệt hại nghiêm trọng).
   * **High:** Phải sửa trong 02 - 04 ngày (ảnh hưởng tính năng chính).
   * **Medium:** Sửa trong 05 - 08 ngày (sai lệch nhỏ so với yêu cầu).
   * **Low:** Sửa sau (ảnh hưởng rất nhỏ đến vận hành).
10. **Severity (Mức độ nghiêm trọng - Tác động kỹ thuật):**
    * **Fatal:** Gây sập hệ thống (crash server), mất mát dữ liệu, lỗ hổng bảo mật nghiêm trọng.
    * **Serious:** Ảnh hưởng trực tiếp tính năng chính (ví dụ: cho phép người dùng bypass validation, không kiểm tra trùng lặp).
    * **Medium:** Sai lệch nhỏ so với đặc tả (ví dụ: giao diện lỗi trên mobile, sai kiểu dữ liệu input).
    * **Cosmetic:** Lỗi thẩm mỹ rất nhỏ (sai màu sắc nút, thứ tự tab, lỗi chính tả).

---

## 3. Báo Cáo Tổng Kết Kiểm Thử (Test Summary Report)

Bao gồm 4 phần chính (Slide 17 - 21):
1. **Summary:** Tóm tắt phạm vi và kết quả hoạt động kiểm thử.
2. **Test Case Result Report:** Bảng số liệu thống kê test case theo chức năng.
3. **Defect Report:** Danh mục lỗi chi tiết theo 10 thành phần.
4. **Open Points:** Các điểm tồn đọng, rủi ro chưa kiểm thử hết.

### Các Bảng Thống Kê Chuẩn Mực Bắt Buộc:

#### A. Thống Kê Theo Chức Năng (Statistics by Function - Slide 18):
| No | Feature / Function | Tested | Passed | Failed | Blocked | Skipped | Total | Test Coverage |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | FR-01: Account Registration | 28 | 13 | 15 | 0 | 0 | 28 | 100% |

#### B. Phân Loại Lỗi Theo Bản Chất Kỹ Thuật (Statistics by Defect Type - Slide 19):
* `Business logic` (Lỗi nghiệp vụ)
* `Coding logic` (Lỗi logic lập trình)
* `Data - Database integrity` (Lỗi toàn vẹn CSDL, thiếu UNIQUE)
* `Feature missing` (Thiếu tính năng, thiếu trường form)
* `Security - Access Control` (Lỗi bảo mật, plaintext password)
* `User Interface` (Lỗi giao diện, sai kiểu input HTML5, sai màu nút)

#### C. Thống Kê Theo Mức Độ Nghiêm Trọng (Statistics by Defect Severity - Slide 21):
* `Fatal`
* `Serious`
* `Medium`
* `Cosmetic`
