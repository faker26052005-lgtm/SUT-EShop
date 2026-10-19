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
> - Bài giảng môn học: [S04_Domain_Testing_Notes.md](./references/S04_Domain_Testing_Notes.md)
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

#### Bước 3 — Thiết kế Test Case từ các lớp tương đương

**Nguyên tắc thiết kế test case Domain Testing:**

1. **Positive test cases (lớp hợp lệ):** Có thể kết hợp nhiều lớp Valid trong
   cùng 1 test case.
2. **Negative test cases (lớp không hợp lệ):** Mỗi test case chỉ chứa **đúng
   1 biến** ở lớp Invalid, tất cả các biến còn lại giữ ở giá trị Valid. Điều
   này đảm bảo cô lập nguyên nhân lỗi.

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

#### Bước 6 — Xuất bảng Test Case tổng hợp cuối cùng

Gộp tất cả test case từ Phần A (Domain) và Phần B (BVA) vào **một bảng tổng hợp
duy nhất**, đánh số TC-ID liên tục. Phân biệt nguồn gốc của từng test case
(Domain hay BVA).

**Format bảng tổng hợp cuối cùng:**

```markdown
| TC-ID | Nguồn gốc | Mô tả | Preconditions | Input Data | Test Steps | Expected Result | Actual Result | Pass/Fail |
|-------|-----------|-------|---------------|------------|------------|-----------------|---------------|-----------|
| TC-FR01-D01 | Domain/EC-PW-V1 | Đăng ký với mật khẩu hợp lệ | Chưa có tài khoản | Name: "Nguyen A", Email: "a@test.com", Password: "Test@123", Confirm: "Test@123" | 1. Mở /register 2. Điền form 3. Bấm Đăng ký | Chuyển hướng sang trang Đăng nhập | (chưa chạy) | - |
| TC-FR01-B01 | BVA/Min-Invalid | Mật khẩu 7 ký tự (dưới biên) | Chưa có tài khoản | Password: "Te@1abc" (7 ký tự) | 1. Mở /register 2. Điền form 3. Bấm Đăng ký | Báo lỗi: mật khẩu quá ngắn | (chưa chạy) | - |
```

---

## CHECKLIST KIỂM TRA CHẤT LƯỢNG (Self-Review)

Sau khi hoàn thành Bước 6, hãy tự kiểm tra bộ test case theo danh sách sau.
Nếu phát hiện thiếu sót, quay lại bước tương ứng để bổ sung.

- [ ] **Đầy đủ biến:** Đã liệt kê tất cả biến đầu vào có trong đặc tả?
- [ ] **Đầy đủ lớp tương đương:** Mỗi ràng buộc có ít nhất 1 lớp Valid và 1 lớp
      Invalid?
- [ ] **Cô lập lỗi:** Mỗi test case Invalid chỉ vi phạm đúng 1 biến?
- [ ] **Đầy đủ biên:** Tất cả điểm biên (min, min±1, max, max±1) đều có test
      case?
- [ ] **Trường hợp đặc biệt:** Đã xem xét các giá trị: chuỗi rỗng `""`, null,
      khoảng trắng `"   "`, ký tự Unicode/emoji, ký tự HTML `<script>`, SQL
      injection `' OR 1=1 --`?
- [ ] **Trường hợp nghiệp vụ:** Đã xem xét: trùng lặp dữ liệu (email đã tồn
      tại), quan hệ giữa các biến (password ≠ confirm password), trạng thái hệ
      thống (đã đăng nhập vs chưa đăng nhập)?
- [ ] **Format chuẩn:** Mỗi test case có đủ: TC-ID, Input, Steps, Expected,
      Actual, Verdict?

---

## Ví dụ mẫu

Xem ví dụ output hoàn chỉnh cho FR-01 tại:
[sample-fr01-output.md](./examples/sample-fr01-output.md)
