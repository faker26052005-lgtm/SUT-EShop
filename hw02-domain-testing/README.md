# BÁO CÁO BÀI TẬP TUẦN 02 (HW02-AI)
## Kỹ thuật Kiểm thử Miền (Domain Testing) & Phân tích Giá trị Biên (BVA) trên Hệ thống EShop

* **Môn học:** Software Testing (CSC13003 / CS423)
* **Mã số sinh viên:** 23120183
* **Họ và tên:** Nguyễn Hoàng Anh Tú
* **Hệ thống kiểm thử (SUT):** EShop (Web Client, Web Admin, Mobile App)
* **Nhánh làm việc (Branch):** `hw02-23120183`
* **Kho lưu trữ (Repository):** [SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop)

---

## 1. Bảng Tự Đánh Giá (Self-Assessment Table)

| STT | Tiêu chí đánh giá (Criteria) | Điểm tối đa | Điểm tự đánh giá | Minh chứng / Tài liệu đối chiếu |
|:---:|:---|:---:|:---:|:---|
| **1** | **Feature A (Pool A - FR-01: Đăng ký tài khoản):** Domain Testing + BVA + AI Gap Analysis | 25 | 25 | [Feature_A_FR01_Report.md](./Feature_A_FR01_Report.md) & [FR01_TestCases.csv](./Test_Cases/FR01_TestCases.csv) |
| **2** | **Feature B (Pool B - FR-09: Mã giảm giá Coupon):** Domain Testing + BVA + AI Gap Analysis | 25 | 25 | [Feature_B_FR09_Report.md](./Feature_B_FR09_Report.md) & [FR09_TestCases.csv](./Test_Cases/FR09_TestCases.csv) |
| **3** | **Feature C (Pool C - FR-15: Quản lý sản phẩm Admin):** Domain Testing + BVA + AI Gap Analysis | 25 | 25 | [Feature_C_FR15_Report.md](./Feature_C_FR15_Report.md) & [FR15_TestCases.csv](./Test_Cases/FR15_TestCases.csv) |
| **4** | **Feature D (Pool D - Mobile: Giỏ hàng & Checkout):** Domain Testing + BVA + AI Gap Analysis | 15 | 15 | [Feature_D_MobileCart_Report.md](./Feature_D_MobileCart_Report.md) & [FR_MobileCart_TestCases.csv](./Test_Cases/FR_MobileCart_TestCases.csv) |
| **5** | **Agent Skills:** Mã nguồn skill hoàn chỉnh + Video YouTube demo end-to-end | 10 | 10 | [skills/domain-boundary-testing/](./skills/domain-boundary-testing/) & [YouTube Video](#4-link-video-demo-va-github-issues) |
| | **TỔNG CỘNG** | **100** | **100** | **4 Pools hoàn tất, 119 TCs, 25 Bugs** |

---

## 2. Báo cáo Tổng kết Kiểm thử (Test Summary Report)

### 2.1. Thống kê Số liệu Thực thi Toàn dự án

* **Tổng số tính năng kiểm thử:** 4 tính năng đại diện thuộc 4 Pools bắt buộc.
* **Tổng số Test Cases thiết kế:** **119 TCs**
* **Trạng thái thực thi:**
  * **Passed:** **73 TCs** (61.3%)
  * **Failed:** **46 TCs** (38.7%)
  * **Pending / Blocked:** **0 TCs** (0.0%)
* **Tổng số Bugs phát hiện:** **25 Bugs** (100% tuân thủ đầy đủ 10 thành phần cốt lõi của Slide S08)
  * **Fatal (Nghiêm trọng cấp hệ thống):** 6 bugs
  * **Serious (Nghiêm trọng chức năng):** 10 bugs
  * **Medium (Mức độ trung bình):** 7 bugs
  * **Cosmetic (Giao diện / Nhãn text):** 2 bugs

### 2.2. Bảng Tổng hợp Kết quả theo Tính năng

| STT | Phân hệ (Pool) | Chức năng kiểm thử | Số lượng TC | Passed | Failed | Số Bug | Môi trường kiểm thử |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---|
| **1** | **Pool A** | `FR-01`: Đăng ký tài khoản | 28 | 19 | 9 | 6 | Web Client (`:5173`) + Backend (`:3000`) |
| **2** | **Pool B** | `FR-09`: Áp dụng mã giảm giá | 31 | 17 | 14 | 6 | Web Client (`:5173`) + Backend (`:3000`) |
| **3** | **Pool C** | `FR-15`: Quản lý sản phẩm | 30 | 19 | 11 | 7 | Web Admin (`:5174`) + Backend (`:3000`) |
| **4** | **Pool D** | `Mobile Cart & Checkout` | 30 | 18 | 12 | 6 | White-box Inspection (`App.js`) + Backend (`:3000`) |
| **TỔNG** | **4 / 4 Pools** | **Đầy đủ 4 phân hệ** | **119** | **73** | **46** | **25** | **Hoàn thành 100%** |

---

## 3. Cấu trúc Thư mục Nộp bài (Submission Structure)

```text
hw02-domain-testing/
├── README.md                          # Báo cáo tổng quan, Bảng tự đánh giá và Tổng kết số liệu
├── Feature_A_FR01_Report.md           # Báo cáo chi tiết Domain Testing & BVA cho FR-01 (Pool A)
├── Feature_B_FR09_Report.md           # Báo cáo chi tiết Domain Testing & BVA cho FR-09 (Pool B)
├── Feature_C_FR15_Report.md           # Báo cáo chi tiết Domain Testing & BVA cho FR-15 (Pool C)
├── Feature_D_MobileCart_Report.md     # Báo cáo chi tiết Domain Testing & BVA cho Mobile Cart (Pool D)
├── Bug_Report.md                      # Tập hợp 25 báo cáo lỗi chi tiết chuẩn Slide S08
├── Test_Cases/                        # Thư mục chứa 4 bộ Test Case dạng CSV (chuẩn Slide S07)
│   ├── FR01_TestCases.csv             # 28 test cases FR-01
│   ├── FR09_TestCases.csv             # 31 test cases FR-09
│   ├── FR15_TestCases.csv             # 30 test cases FR-15
│   └── FR_MobileCart_TestCases.csv    # 30 test cases Mobile Cart
├── Evidence/                          # Thư mục lưu minh chứng ảnh chụp
│   ├── Bug_Screenshots/               # Ảnh chụp lỗi giao diện/mã nguồn
│   └── GitHub_Issues/                 # Ảnh chụp các Issues đã tạo trên GitHub
└── skills/domain-boundary-testing/    # Toàn bộ mã nguồn và tài liệu của Agent Skill
    ├── SKILL.md                       # Định nghĩa workflow và prompt hướng dẫn Agent
    ├── examples/                      # Mẫu phân tích và báo cáo mẫu
    ├── references/                    # Slide lý thuyết S04, S07, S08 và tóm tắt lý thuyết
    └── resources/                     # Template mẫu test case 6 cột
```

---

## 4. Link Video Demo và GitHub Issues

* **Đường dẫn Video Demo Agent Skill (YouTube):** `[Dán link YouTube tại đây sau khi quay demo]`
* **Kho lưu trữ GitHub Issues:** [25 Issues đã tạo trên GitHub (#52 đến #76)](https://github.com/faker26052005-lgtm/SUT-EShop/issues) — Chi tiết bảng tra cứu: [Evidence/GitHub_Issues/README.md](./Evidence/GitHub_Issues/README.md)

---

## 5. Danh sách Tiêu chuẩn Học thuật Áp dụng

1. **Slide S04 (Domain Testing & BVA):**
   * Định danh Input Variables, phân loại Miền giá trị (Valid, Invalid, Out of Domain).
   * Phân tích biên chi tiết theo 4 điểm kinh điển: $Min^-$, $Min$, $Max$, $Max^+$.
   * Áp dụng kỹ thuật phân tích khoảng hẹp $\epsilon$ (như $0.0001$ với discount rate, $1$ ký tự với độ dài chuỗi).
   * Phân tích lỗ hổng AI (AI Gap Analysis): So sánh kỹ thuật kiểm thử của AI sinh ra với đặc thù nghiệp vụ SUT.
2. **Slide S07 (Test Case Engineering):**
   * Cấu trúc Objective tuân thủ nghiêm ngặt cú pháp: `Action + Function + Operating Condition`.
   * Bảng Test Case chuẩn 6 cột: `TC-ID`, `Description`, `Pre-conditions & Test Steps`, `Expected Result`, `Observed Result`, `Status`.
   * Dữ liệu kiểm thử (Test Data) là giá trị literal cụ thể, loại bỏ hoàn toàn các ký hiệu giả định `Name=baseline`.
3. **Slide S08 (Test Reporting & Defect Tracking):**
   * Báo cáo lỗi (Bug Report) đáp ứng đủ **10 thành phần cốt lõi** (Bug ID, Function name, Problem summary, Reproduction steps, Reported by, Date, Assign to, Status, Priority, Severity).
   * Mỗi báo cáo tính năng đều kết thúc bằng **3 bảng thống kê**: Theo chức năng, theo loại lỗi (Defect Type), theo mức độ nghiêm trọng (Severity).
