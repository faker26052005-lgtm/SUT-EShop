# Tóm Tắt Bài Giảng S07: Test Case (Thiết Kế & Trình Bày Ca Kiểm Thử)
**Môn học:** Software Testing (CSC13003) - FIT@HCMUS  
**Nguồn tham chiếu chính thức:** `S07_Test Case.pdf`

---

## 1. Định Nghĩa Test Case (What is a Test Case?)

* **Theo Cem Kaner, Faulk, Nguyen (Testing Computer Software):**
  > *"A test that (ideally) executes a single well defined test objective."*  
  > (Một phép thử lý tưởng thực thi một mục tiêu kiểm thử đơn lẻ, được định nghĩa rõ ràng).
* **Theo chuẩn IEEE 729-1983:**
  > *"A specific set of test data and associated procedures developed for a particular objective."*  
  > (Một tập dữ liệu kiểm thử cụ thể và các quy trình liên kết được xây dựng cho một mục tiêu cụ thể).

---

## 2. Vì Sao Phải Viết Test Case? (Why Write Test Case?)

1. **Accountability (Trách nhiệm giải trình):** Minh chứng rõ ràng ai đã kiểm tra phần nào và vào thời điểm nào.
2. **Reproducibility (Khả năng tái lập):** Bất kỳ ai đọc test case cũng có thể thực hiện lại chính xác các bước để tái hiện kết quả.
3. **Tracking (Theo dõi tiến độ):** Theo dõi mức độ hoàn thành kiểm thử và chất lượng tính năng.
4. **Automation (Tự động hóa):** Làm kịch bản nền tảng để viết automation script (Selenium, Playwright, Cypress).
5. **To find bugs (Tìm lỗi):** Giúp bẫy lỗi có hệ thống thay vì test mò mẫm.
6. **To verify tests are executed correctly:** Đảm bảo việc kiểm thử tuân thủ đúng yêu cầu đặc tả.
7. **To measure test coverage:** Đo lường độ bao phủ yêu cầu (Requirements Traceability Matrix).

---

## 3. Các Thành Phần Cốt Lõi Của Test Case (Test Case Essentials)

Một Test Case chuẩn mực bắt buộc phải có đầy đủ các thành phần sau (Slide 4 - 7):

### 3.1. Mã Định Danh (Test Case ID)
* Định danh duy nhất cho từng test case (ví dụ: `TC-FR01-D01`, `TC-FR01-B01`). Phân biệt rõ ràng với `Bug ID`.

### 3.2. Tiêu Đề / Mục Tiêu Kiểm Thử (Objective / Title)
* **Cú pháp chuẩn mực bắt buộc (Objective Syntax):**
  $$\mathbf{Action} + \mathbf{Function} + \mathbf{Operating\ Condition}$$
  * **Action:** Hành động kiểm thử (`Verify`, `Test`, `Validate`, `Execute`, `Check`...).
  * **Function:** Tính năng, màn hình, hoặc điểm kiểm tra (`Registration`, `Coupon Application`, `Product Creation`...).
  * **Operating Condition:** Dữ liệu đầu vào hoặc điều kiện cụ thể (`with valid credentials`, `with empty Name`, `with invalid email missing @`, `with boundary 8 chars`...).
  * *Ví dụ:*
    * `Verify Registration with Valid Credentials (Baseline)`
    * `Test Registration with Empty Name`
    * `Validate Registration with Numeric Name`
    * `Test Registration with Malformed Email '_@)'`

### 3.3. Các Bước Thực Hiện (Steps & Pre-conditions)
* **Pre-condition (Tiền điều kiện):** Trạng thái hệ thống trước khi test (ví dụ: `Hệ thống sẵn sàng, người dùng chưa đăng nhập, CSDL đã reset seed data`).
* **Test Steps:** Các bước hành động tuần tự rõ ràng (ví dụ: `1. Truy cập /register. 2. Nhập các trường... 3. Nhấp nút Đăng ký`).

### 3.4. Dữ liệu Kiểm thử (Test Data)
* Giá trị cụ thể của từng biến đầu vào (`Name`, `Email`, `Password`, `Confirm Password`...).

### 3.5. Kết Quả Mong Đợi (Expected Result / Validation Point)
* Nêu rõ trạng thái, thông báo, hành vi mà hệ thống **phải** hiển thị theo đặc tả.

### 3.6. Kết Quả Thực Tế (Observed / Actual Result)
* Ghi lại chính xác những gì xảy ra trên SUT khi thực thi test case. Nếu có áp dụng kỹ thuật **Cô lập lỗi (Fault Isolation / Workaround)**, phải ghi chú minh bạch tại đây.

### 3.7. Trạng Thái Đánh Giá (Status / Verdict)
* `Passed`, `Failed`, `Blocked`, `Skipped`.

---

## 4. Mẫu Trình Bày Test Case Chuẩn (Test Case Template - Slide 8)

| TC ID | Description (Test Objective) | Steps (Pre-conditions & Steps) | Expected Result | Observed / Actual Result | Status |
|:---|:---|:---|:---|:---|:---:|
| `TC001` | *Action + Function + Operating Condition* | **Pre-condition:** ...<br>**Steps:**<br>1. Action 1<br>2. Action 2 | *What your program is supposed to do* | *What you get when executing the test case* | `Passed` / `Failed` |

---

## 5. Tiêu Chí Một Test Case Tốt (What is a Good Test Case? - Slide 9)

* **Accurate (Chính xác):** Kiểm tra đúng thứ nó được thiết kế để kiểm tra.
* **Economical (Tiết kiệm):** Không có bước thừa thãi.
* **Repeatable, reusable (Tái sử dụng):** Thực hiện lại được nhiều lần mà không phụ thuộc vào trạng thái ngẫu nhiên.
* **Traceable (Truy xuất nguồn gốc):** Liên kết trực tiếp tới mã đặc tả (FR-01, FR-09...).
* **Appropriate (Phù hợp):** Phù hợp với môi trường kiểm thử (Web, Mobile, API).
* **Self standing (Độc lập):** Người khác đọc vào tự làm được, không phụ thuộc vào người viết.
* **Self cleaning (Tự dọn dẹp):** Tự reset dữ liệu CSDL sau khi test xong (Teardown).
