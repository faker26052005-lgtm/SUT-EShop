---
name: domain-boundary-testing
description: >-
  Áp dụng kỹ thuật Domain Testing và Boundary Value Analysis (BVA) để thiết kế
  bộ test case hoàn chỉnh cho một Functional Requirement (FR) của hệ thống EShop.
  Sử dụng skill này khi người dùng yêu cầu phân tích domain, phân tích giá trị
  biên, sinh test case, hoặc áp dụng kỹ thuật kiểm thử miền cho một FR cụ thể.
---

# Domain Testing & Boundary Value Analysis Skill

## Mục tiêu

Khi được kích hoạt, skill này thực hiện **quy trình 6 bước** chuẩn hóa cho một
Functional Requirement (FR) cụ thể của hệ thống EShop, rồi xuất ra bộ test case
hoàn chỉnh ở định dạng Markdown table.

## Đầu vào bắt buộc

Trước khi bắt đầu, hãy thu thập đủ 3 thông tin sau từ người dùng:

1. **Mã FR** — ví dụ: `FR-01`, `FR-09`, `FR-15`.
2. **Đặc tả chính thức** — đọc từ file
   [README.md](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/README.md) của
   EShop SUT. Nếu cần thêm chi tiết kỹ thuật, đọc thêm
   [api_specification.md](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/api_specification.md)
   và mã nguồn backend
   [server.js](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/backend/server.js).
3. **Nền tảng kiểm thử** — Web Client (`:5173`) / Web Admin (`:5174`) / Mobile
   App (Expo).

> Nếu người dùng chỉ cung cấp mã FR, hãy tự đọc đặc tả từ README.md và xác
> định nền tảng phù hợp dựa trên Pool mà FR thuộc về.

---

## QUY TRÌNH 6 BƯỚC

---

### PHẦN A: DOMAIN TESTING (Kiểm thử miền)

> Tham khảo lý thuyết chi tiết tại:
> - Bài giảng môn học S04: [S04_Domain_Testing_Notes.md](./references/S04_Domain_Testing_Notes.md)
> - Bài giảng môn học S07 (Test Case): [S07_Test_Case_Notes.md](./references/S07_Test_Case_Notes.md)
> - Bài giảng môn học S08 (Test Report): [S08_Test_Report_Notes.md](./references/S08_Test_Report_Notes.md)
> - Tài liệu mở rộng: [domain-testing-theory.md](./references/domain-testing-theory.md)

#### Bước 1 — Xác định các biến đầu vào (Input Variables)

Đọc kỹ đặc tả FR trong README.md của EShop. Liệt kê **TẤT CẢ** các trường dữ
liệu (fields) mà người dùng có thể nhập vào hoặc hệ thống cần xử lý. Không
được bỏ sót bất kỳ biến nào có ràng buộc trong đặc tả.

Với mỗi biến, xác định:

- Tên biến
- Kiểu dữ liệu (string / number / date / boolean / enum)
- Bắt buộc hay tùy chọn
- Mô tả ràng buộc (constraints) — trích dẫn chính xác từ đặc tả

**Xuất bảng theo format:**

```markdown
| # | Tên biến | Kiểu dữ liệu | Bắt buộc | Mô tả ràng buộc |
|---|----------|---------------|----------|------------------|
| 1 | ...      | ...           | Có/Không | ...              |
```

#### Bước 2 — Phân chia các lớp tương đương (Equivalence Partitioning)

Với **MỖI** biến đầu vào ở Bước 1, phân chia miền giá trị thành:

- **Lớp hợp lệ (Valid EC):** Các nhóm giá trị mà hệ thống **PHẢI chấp nhận**
  theo đặc tả.
- **Lớp không hợp lệ (Invalid EC):** Các nhóm giá trị mà hệ thống **PHẢI từ
  chối** theo đặc tả.

**Nguyên tắc:**

- Mỗi lớp phải chứa các giá trị có hành vi tương đương nhau (hệ thống xử lý
  giống nhau).
- Nếu một biến có nhiều ràng buộc (ví dụ: password phải có chữ hoa VÀ chữ
  thường VÀ số VÀ ký tự đặc biệt), thì **mỗi ràng buộc** tạo ra ít nhất 1 lớp
  Invalid khi bị vi phạm.
- Đối với biến kiểu Enum, mỗi giá trị Enum hợp lệ là 1 lớp Valid riêng, và giá
  trị nằm ngoài Enum là 1 lớp Invalid.

**Xuất bảng theo format:**

```markdown
| Biến | Mã lớp | Loại | Mô tả | Giá trị đại diện |
|------|--------|------|-------|-------------------|
| Password | EC-PW-V1 | Valid | Đúng tất cả ràng buộc (≥8 ký tự, hoa, thường, số, đặc biệt) | `Test@123` |
| Password | EC-PW-I1 | Invalid | Thiếu ký tự đặc biệt | `Test1234` |
| Password | EC-PW-I2 | Invalid | Thiếu chữ hoa | `test@123` |
| ... | ... | ... | ... | ... |
```

#### Bước 3 — Thiết kế Test Case từ các lớp tương đương (Áp dụng Baseline Cô Lập Lỗi)

**Nguyên tắc thiết kế test case Domain Testing:**

1. **Positive test cases (lớp hợp lệ):** Có thể kết hợp nhiều lớp Valid trong
   cùng 1 test case.
2. **Negative test cases (lớp không hợp lệ):** Mỗi test case chỉ chứa **đúng
   1 biến** ở lớp Invalid, tất cả các biến còn lại giữ ở giá trị Valid. Điều
   này đảm bảo cô lập nguyên nhân lỗi (Single Fault Assumption).

**NGUYÊN LÝ BASELINE CÔ LẬP LỖI (Defect Isolation Baseline Principle):**

* **Thiết lập Test Case Chuẩn Ban Đầu (Golden Positive Baseline):**
  * Trước khi thiết kế các test case tìm lỗi, **bắt buộc phải xác định một Test Case Chuẩn Ban Đầu (All Valid)** chứa dữ liệu hoàn toàn hợp lệ, thỏa mãn 100% đặc tả (không có lỗi).
  * Bộ dữ liệu của Test Case Chuẩn này (ví dụ: Họ tên chuẩn, Email chuẩn, Mật khẩu chuẩn, Giá trị đơn hàng chuẩn...) sẽ đóng vai trò là **Baseline cố định** xuyên suốt cho toàn bộ tính năng.

* **Nguyên tắc Tái sử dụng Dữ liệu Baseline:**
  * Tất cả các test case dùng để phát hiện lỗi (Negative test case, Invalid class, Boundary test case) **phải tái sử dụng toàn bộ dữ liệu của Test Case Chuẩn Ban Đầu**, và **chỉ được sửa đổi duy nhất phần/biến cần kiểm tra**.
  * Giữ nguyên và dùng chung các giá trị hợp lệ cố định (ví dụ: giữ nguyên đúng 1 địa chỉ email baseline, 1 họ tên baseline...) để tránh gây nhiễu biến và đảm bảo nguyên tắc cô lập lỗi.

* **Sử dụng Workaround khi cần và Ghi chú Minh bạch:**
  * **Khi nào sử dụng:** Khi SUT có lỗi ở một trường khác (ví dụ: regex bị sai, thiếu input form, lỗi validation cục bộ) gây ra hiện tượng *Lỗi che giấu lỗi (Error Masking)* khiến form không thể submit để kiểm tra biến mục tiêu:
    * Cho phép áp dụng **Workaround** tại thời điểm thực thi để thông chốt dữ liệu, giúp request đi tới được tầng xử lý của biến mục tiêu (Client-side validation hoặc Backend API).
  * **Yêu cầu bắt buộc:**
    * Giữ nguyên giá trị thiết kế lý thuyết theo đặc tả trong cột dữ liệu kiểm thử.
    * **Bắt buộc phải có ghi chú rõ ràng** trong cột *Kết quả thực tế / Báo cáo* về việc sử dụng Workaround (nêu rõ lý do cần workaround, giá trị workaround là gì, và lỗi gốc gây ra hiện tượng che giấu lỗi).

---

### PHẦN B: BOUNDARY VALUE ANALYSIS (Phân tích giá trị biên)

> Tham khảo lý thuyết chi tiết tại:
> - Bài giảng môn học: [S04_Domain_Testing_Notes.md](./references/S04_Domain_Testing_Notes.md) (Mục 6: BVA)
> - Tài liệu mở rộng: [bva-theory.md](./references/bva-theory.md)

#### Bước 4 — Xác định các điểm biên cho từng biến

Với mỗi biến có miền giá trị liên tục hoặc giới hạn rõ ràng (min/max về độ
dài, giá trị số, ngày tháng, số lượng…), xác định các điểm biên.

**Áp dụng kỹ thuật BVA 2-value hoặc 3-value:**

- **2-value BVA (tiêu chuẩn):** Test tại điểm biên và điểm ngay bên kia biên.
  - Ví dụ biên dưới: `min - 1` (Invalid) và `min` (Valid).
  - Ví dụ biên trên: `max` (Valid) và `max + 1` (Invalid).
- **3-value BVA (mở rộng):** Thêm điểm ngay bên trong biên.
  - Ví dụ biên dưới: `min - 1` (Invalid), `min` (Valid), `min + 1` (Valid).

**Xuất bảng theo format:**

```markdown
| Biến | Ràng buộc | Min Invalid | Min Valid | Nominal | Max Valid | Max Invalid |
|------|-----------|-------------|-----------|---------|-----------|-------------|
| Độ dài Password | ≥ 8 ký tự | 7 ký tự | 8 ký tự | 12 ký tự | N/A (không giới hạn trên) | N/A |
| Giá sản phẩm | > 0 | 0 | 1 (hoặc 0.01) | 100000 | N/A | -1 |
| ... | ... | ... | ... | ... | ... | ... |
```

**Lưu ý đặc biệt cho các loại biên:**

- **Biên chuỗi:** Tính theo độ dài ký tự (0, 1, max, max+1).
- **Biên số:** Tính theo giá trị số (min-1, min, max, max+1).
- **Biên ngày:** Ngay trước hạn, đúng hạn, ngay sau hạn.
- **Biên đếm:** Số lần thử/sử dụng (max_uses - 1, max_uses, max_uses + 1).
- **Biên tập hợp:** Giỏ hàng rỗng (0 item), 1 item, nhiều item.

#### Bước 5 — Thiết kế Test Case BVA

Sinh test case cho **TẤT CẢ** các điểm biên đã xác định ở Bước 4. Mỗi điểm
biên cần ít nhất 1 test case.

---

### PHẦN C: TỔNG HỢP VÀ KIỂM TRA CHẤT LƯỢNG

#### Bước 6 — Xuất bảng Test Case tổng hợp cuối cùng (Theo Mẫu Slide S07)

Gộp tất cả test case từ Phần A (Domain) và Phần B (BVA) vào **một bảng tổng hợp
duy nhất**, đánh số TC-ID liên tục. Áp dụng chuẩn mẫu trình bày Test Case từ **Slide S07**:

**Format bảng tổng hợp cuối cùng:**

```markdown
| TC ID | Description (Action + Function + Operating Condition) | Steps (Pre-conditions & Test Steps) | Expected Result | Observed / Actual Result | Status |
|:---|:---|:---|:---|:---|:---:|
| TC-FR01-D01 | Verify Registration with Valid Credentials (Baseline) | **Pre-condition:** SUT sẵn sàng, CSDL reset seed data.<br>**Steps:**<br>1. Mở trang /register.<br>2. Nhập Name, Email, Password, Confirm.<br>3. Bấm Đăng ký. | Chuyển hướng sang trang /login | (Ghi lại kết quả thực tế trên SUT & ghi chú workaround nếu có) | Passed / Failed |
```

---

### PHẦN D: QUẢN LÝ LỖI & BÁO CÁO TỔNG KẾT (THEO CHUẨN S08)

#### 1. Quản lý Lỗi (Bug Report theo 10 Thành Phần Bắt Buộc - Slide S08)
Mỗi lỗi phát hiện được bắt buộc phải lập hồ sơ chi tiết theo 10 thành phần cốt lõi:
1. **Bug ID:** Mã định danh duy nhất (ví dụ: `BUG-FR01-01`). Khác với `Test Case ID`.
2. **Function name:** Tên chức năng/màn hình phát hiện lỗi.
3. **Problem summary:** Cú pháp chuẩn: `Test Objective + Actual result (vs. Expected result)`.
4. **How to reproduce the defect:**
   * **Environment:** Hệ điều hành, Trình duyệt, Nền tảng (OS, Browser, Device, Server Ports).
   * **Steps to Reproduce:** Các bước tuần tự `1, 2, 3...` kèm dữ liệu nhập cụ thể.
   * **Expected Behavior:** Hệ thống đáng lẽ phải xử lý như thế nào.
   * **Actual Behavior:** Hệ thống thực tế xử lý ra sao (kèm log, mã lỗi HTTP, bằng chứng lỗi).
5. **Reported by:** Họ tên và MSSV của Tester.
6. **Date:** Ngày ghi nhận lỗi.
7. **Assign to:** Người chịu trách nhiệm sửa (Frontend Dev / Backend Dev).
8. **Status:** `New` / `In-Progress` / `Fixed` / `Closed` / `Reopened`.
9. **Priority (Thời gian sửa):** `Immediate (Critical)` (1 ngày), `High` (2-4 ngày), `Medium` (5-8 ngày), `Low`.
10. **Severity (Mức độ nghiêm trọng):** `Fatal` (crash, mất data, bảo mật), `Serious` (tính năng chính), `Medium` (sai lệch nhỏ), `Cosmetic` (thẩm mỹ UI).

#### 2. Báo Cáo Tổng Kết Kiểm Thử (Test Summary Report - Slide S08)
Bắt buộc phải có 3 bảng thống kê chuẩn mực:
* **Thống kê theo Chức năng (Statistics by Function):** Số lượng Tested, Passed, Failed, Blocked, Skipped, Coverage %.
* **Thống kê theo Bản chất Lỗi (Statistics by Defect Type):** `Business logic`, `Coding logic`, `Data - Database integrity`, `Feature missing`, `Security - Access Control`, `User Interface`.
* **Thống kê theo Mức độ Nghiêm trọng (Statistics by Defect Severity):** Tỷ lệ phân bổ `Fatal`, `Serious`, `Medium`, `Cosmetic`.

---

## CHECKLIST KIỂM TRA CHẤT LƯỢNG (Self-Review)

Sau khi hoàn thành Bước 6 và Phần D, hãy tự kiểm tra bộ test case theo danh sách sau:

- [ ] **Đầy đủ biến:** Đã liệt kê tất cả biến đầu vào có trong đặc tả?
- [ ] **Đầy đủ lớp tương đương:** Mỗi ràng buộc có ít nhất 1 lớp Valid và 1 lớp Invalid?
- [ ] **Baseline chuẩn ban đầu:** Đã xác lập Test Case Chuẩn Ban Đầu (All Valid) làm mỏ neo cố định?
- [ ] **Cô lập lỗi & Tái sử dụng Baseline:** Mỗi test case tìm lỗi có tái sử dụng toàn bộ dữ liệu hợp lệ từ Baseline và chỉ thay đổi duy nhất phần/biến cần kiểm tra?
- [ ] **Cú pháp tiêu đề chuẩn S07:** Tiêu đề test case có tuân thủ đúng `Action + Function + Operating Condition` không?
- [ ] **Mẫu bảng test case chuẩn S07:** Bảng có đầy đủ: TC ID, Description, Steps (Pre-conditions & Steps), Expected Result, Observed Result, Status?
- [ ] **Hồ sơ lỗi chuẩn 10 thành phần S08:** Mỗi bug có đủ 10 trường thông tin (Problem summary, How to reproduce, Priority, Severity...)?
- [ ] **Thống kê báo cáo S08:** Đã có đủ bảng thống kê theo Chức năng, Defect Type và Defect Severity?
- [ ] **Minh bạch Workaround:** Nếu dùng workaround để bypass lỗi che giấu lỗi, đã ghi chú giải thích rõ ràng và minh bạch trong cột kết quả thực tế chưa?
- [ ] **Đầy đủ biên:** Tất cả điểm biên (min, min±1, max, max±1) đều có test case?
- [ ] **Trường hợp đặc biệt & Bảo mật:** Đã xem xét chuỗi rỗng `""`, khoảng trắng `"   "`, XSS `<script>`, số, ký tự đặc biệt ngoài tập?
- [ ] **Tự dọn dẹp (Self-cleaning):** Đã chạy teardown dọn dẹp CSDL sau khi test xong?

---

## Ví dụ mẫu

Xem ví dụ output hoàn chỉnh cho FR-01 tại:
[sample-fr01-output.md](./examples/sample-fr01-output.md)
