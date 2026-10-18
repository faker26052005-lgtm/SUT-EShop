# BÁO CÁO PHÁT HIỆN LỖI (DEFECT / BUG REPORT) – HỆ THỐNG ESHOP

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Repository GitHub của nhóm:** [Nhóm 11 – EShop Seminar & Testing](https://github.com/ttbhanh/eshop-sut)  
> **Tài liệu đối chiếu đặc tả:** [`specs/system_requirements_specification.md`](../../specs/system_requirements_specification.md)  
> **Ngày báo cáo:** 18/10/2026

---

## 1. TỔNG HỢP & THỐNG KÊ LỖI (DEFECT METRICS DASHBOARD)

### 1.1 Thống Kê Theo Mức Độ Nghiêm Trọng (Severity) & Phân Hệ
| Phân hệ / Pool | Mã FR | Tên tính năng | Critical | Major | Medium | Minor | Tổng số Bug |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Pool A (Web/Auth)** | **FR-02** | Đăng nhập & Khóa tài khoản | 1 | 1 | 0 | 0 | **2** |
| **Pool B (Web/Cart)** | **FR-07** | Giỏ hàng (Shopping Cart) | 0 | 1 | 1 | 0 | **2** |
| **Pool C (Admin/Coupon)** | **FR-17** | Quản lý Mã Giảm Giá | 0 | 2 | 0 | 0 | **2** |
| **Pool D (Mobile/Order)** | **FR-20 & FR-10**| Hủy đơn hàng theo trạng thái | 1 | 0 | 1 | 0 | **2** |
| **TỔNG CỘNG** | | | **2** | **4** | **2** | **0** | **8** |

### 1.2 Bảng Ma Trận Truy Vết Lỗi (Traceability: Test Case ↔ Bug ID ↔ GitHub Issue)
| Bug ID | Tóm tắt lỗi | Tính năng | TC phát hiện | Mức độ | GitHub Issue | Trạng thái |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `BUG-FR02-01` | Tài khoản không bị khóa sau 3 lần đăng nhập sai liên tiếp | FR-02 | `TC_FR02_05` | Critical | [Issue #12](https://github.com/ttbhanh/eshop-sut/issues/12) | Open |
| `BUG-FR02-02` | Thông báo lỗi tiết lộ thông tin mật khẩu sai thay vì thông báo chung | FR-02 | `TC_FR02_02` | Major | [Issue #13](https://github.com/ttbhanh/eshop-sut/issues/13) | Open |
| `BUG-FR07-01` | Bấm nút giảm (-) tại số lượng 1 tự xóa sản phẩm không có dialog xác nhận | FR-07 | `TC_FR07_03` | Major | [Issue #14](https://github.com/ttbhanh/eshop-sut/issues/14) | Open |
| `BUG-FR07-02` | Footer giỏ hàng hiển thị nhãn "Tổng tạm tính" thay vì "Tổng cộng" | FR-07 | `TC_FR07_09` | Medium | [Issue #15](https://github.com/ttbhanh/eshop-sut/issues/15) | Open |
| `BUG-FR17-01` | Form Admin cho phép nhập `min_order_amount = -1` và lưu thành công | FR-17 | `TC_FR17_05` | Major | [Issue #16](https://github.com/ttbhanh/eshop-sut/issues/16) | Open |
| `BUG-FR17-02` | Không ràng buộc Unique mã Coupon, cho phép tạo trùng lặp | FR-17 | `TC_FR17_08` | Major | [Issue #17](https://github.com/ttbhanh/eshop-sut/issues/17) | Open |
| `BUG-FR20-01` | Đơn hàng đã ở trạng thái `shipping` nhưng User vẫn bấm Hủy được trên Mobile | Mobile | `TC_MOB_03` | Critical | [Issue #18](https://github.com/ttbhanh/eshop-sut/issues/18) | Open |
| `BUG-FR20-02` | Sau khi hủy thành công, trạng thái không tự refresh sang `canceled` | Mobile | `TC_MOB_01` | Medium | [Issue #19](https://github.com/ttbhanh/eshop-sut/issues/19) | Open |

---

## 2. BÁO CÁO CHI TIẾT TỪNG LỖI (DETAILED DEFECT TICKETS)

### 2.1 Các lỗi thuộc Pool A: FR-02 – Đăng nhập & Khóa tài khoản

#### [BUG-FR02-01] Tài khoản không bị khóa sau 3 lần đăng nhập sai liên tiếp

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-01` |
| **Tiêu đề Bug** | `[FR-02][Web] Account lockout mechanism fails to trigger after 3 consecutive invalid login attempts` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Chrome 124 • Linux |
| **Mức độ (Severity)** | **Critical** (Lỗ hổng bảo mật Brute-force/Credential stuffing) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | `TC_FR02_05` (BVA On-point $N = 3$) |
| **GitHub Issue Link** | [Issue #12: [FR-02] Account not locked after 3 failed logins](https://github.com/ttbhanh/eshop-sut/issues/12) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Tài khoản người dùng đã tồn tại: `test@eshop.com` / `Test1234!`.
- Bộ đếm `failed_attempts` ban đầu bằng 0 (tài khoản bình thường).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt truy cập `http://localhost:5173/login`.
2. Nhập Email: `test@eshop.com`.
3. Lần 1: Nhập Mật khẩu sai: `WrongPass1!` $\to$ Bấm "Đăng nhập".
4. Lần 2: Nhập Mật khẩu sai: `WrongPass2!` $\to$ Bấm "Đăng nhập".
5. Lần 3: Nhập Mật khẩu sai: `WrongPass3!` $\to$ Bấm "Đăng nhập".
6. Lần 4: Nhập Mật khẩu đúng: `Test1234!` $\to$ Bấm "Đăng nhập".

**3. Dữ liệu thử nghiệm (Test Data):**
- Email: `test@eshop.com`
- Passwords: `WrongPass1!`, `WrongPass2!`, `WrongPass3!` (sai), `Test1234!` (đúng).

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS:* "Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân."
- Tại lần thử 3, hệ thống phải kích hoạt trạng thái tạm khóa 30 giây.
- Tại lần thử 4 (dù mật khẩu đúng), hệ thống vẫn phải từ chối đăng nhập và báo tài khoản đang bị tạm khóa.

**5. Kết quả thực tế (Actual Result):**
- Tại lần thử 3, hệ thống vẫn chỉ báo lỗi sai mật khẩu.
- Tại lần thử 4 với mật khẩu đúng, hệ thống cho phép đăng nhập thành công ngay lập tức và cấp JWT Token mà không hề tạm khóa.

**6. Bằng chứng kiểm thử (Screenshots):**
- *Ảnh chụp trên giao diện SUT:*  
  ![Lỗi đăng nhập sai lần 3 không bị khóa](./screenshots/bug_fr02_01_actual.png)
- *Ảnh chụp GitHub Issue đã tạo:*  
  ![GitHub Issue #12](./screenshots/bug_fr02_01_github_issue.png)

**7. Phân tích nguyên nhân & Khắc phục:**
- **Nguyên nhân:** Backend Express controller (`backend/src/controllers/authController.js`) chưa cài đặt logic đếm số lần sai trong database hoặc bộ nhớ cache để phạt lockout.
- **Khắc phục:** Thêm trường `failed_login_attempts` và `locked_until` vào bảng `users`. Trả về HTTP 429 khi đang trong 30 giây phạt.

---

#### [BUG-FR02-02] Thông báo lỗi tiết lộ thông tin mật khẩu sai thay vì thông báo chung

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-02` |
| **Tiêu đề Bug** | `[FR-02][Web] Detailed error message exposes credential validation specifics violating SRS privacy rule` |
| **Mức độ (Severity)** | **Major** (User Enumeration vulnerability) |
| **Test Case phát hiện** | `TC_FR02_02` |
| **GitHub Issue Link** | [Issue #13: [FR-02] Error message reveals password error details](https://github.com/ttbhanh/eshop-sut/issues/13) |

**1. Các bước tái hiện:**
1. Truy cập `http://localhost:5173/login`.
2. Nhập Email: `test@eshop.com`, Mật khẩu: `SaiMatKhau123!`.
3. Bấm "Đăng nhập".

**2. Kết quả mong đợi (SRS FR-02):**
> *Trích dẫn SRS:* "Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân."
- Thông báo lỗi chung: "Email hoặc mật khẩu không chính xác".

**3. Kết quả thực tế:**
- Hệ thống thông báo rõ: "Mật khẩu không chính xác" (cho phép kẻ tấn công biết email đã tồn tại trong CSDL).

**4. Bằng chứng kiểm thử:**
- *Ảnh chụp minh chứng:* `screenshots/bug_fr02_02_actual.png`

---

### 2.2 Các lỗi thuộc Pool B: FR-07 – Giỏ hàng (Shopping Cart)

#### [BUG-FR07-01] Nút giảm (-) tại số lượng 1 tự xóa sản phẩm mà không hiện Dialog xác nhận

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-01` |
| **Tiêu đề Bug** | `[FR-07][Web] Decrementing quantity to 0 deletes product immediately without confirmation dialog` |
| **Mức độ (Severity)** | **Major** (Vi phạm quy chuẩn trải nghiệm người dùng theo SRS) |
| **Test Case phát hiện** | `TC_FR07_03` (Transition BVA $1 \to 0$) |
| **GitHub Issue Link** | [Issue #14: [FR-07] Missing confirmation modal when removing item via minus button](https://github.com/ttbhanh/eshop-sut/issues/14) |

**1. Các bước tái hiện:**
1. Thêm 1 sản phẩm vào giỏ hàng (`Quantity = 1`).
2. Vào trang giỏ hàng `http://localhost:5173/cart`.
3. Bấm nút giảm `-` tại cột Số lượng.

**2. Kết quả mong đợi (SRS FR-07):**
> *Trích dẫn SRS:* "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."
- Khi số lượng giảm về 0 (tương đương thao tác xóa), hệ thống phải bật Dialog hỏi người dùng: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?".

**3. Kết quả thực tế:**
- Sản phẩm biến mất lập tức khỏi giỏ hàng mà không hề hiển thị bất kỳ Dialog xác nhận nào.

**4. Bằng chứng kiểm thử:**
- *Ảnh chụp minh chứng:* `screenshots/bug_fr07_01_actual.png`

---

#### [BUG-FR07-02] Footer giỏ hàng hiển thị sai nhãn ("Tổng tạm tính" thay vì "Tổng cộng")

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-02` |
| **Tiêu đề Bug** | `[FR-07][Web] Cart summary uses incorrect label 'Tổng tạm tính' instead of 'Tổng cộng'` |
| **Mức độ (Severity)** | **Medium** (Sai lệch giao diện so với SRS) |
| **Test Case phát hiện** | `TC_FR07_09` |
| **GitHub Issue Link** | [Issue #15: [FR-07] Cart footer label mismatch](https://github.com/ttbhanh/eshop-sut/issues/15) |

**1. Kết quả mong đợi (SRS FR-07):**
> *Trích dẫn SRS:* "Tổng tiền hiển thị nhãn chính xác: **'Tổng cộng'** (không phải 'Tổng tạm tính')."

**2. Kết quả thực tế:**
- Giao diện web hiển thị chữ "Tổng tạm tính: ... ₫".

---

### 2.3 Các lỗi thuộc Pool C: FR-17 – Quản lý Mã Giảm Giá (Admin)

#### [BUG-FR17-01] Form Admin cho phép nhập `min_order_amount = -1` và lưu thành công

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR17-01` |
| **Tiêu đề Bug** | `[FR-17][Admin] Coupon creation form accepts negative min_order_amount (-1)` |
| **Mức độ (Severity)** | **Major** (Lỗi logic biên số học) |
| **Test Case phát hiện** | `TC_FR17_05` (BVA Off-point $M = -1$) |
| **GitHub Issue Link** | [Issue #16: [FR-17] Negative min_order_amount accepted](https://github.com/ttbhanh/eshop-sut/issues/16) |

**1. Các bước tái hiện:**
1. Đăng nhập Admin (`admin@eshop.com` / `Admin123!`).
2. Vào mục Quản lý Mã giảm giá `http://localhost:5174/coupons`.
3. Bấm "Thêm mã giảm giá mới".
4. Điền: Code = `NEGMIN`, Type = `fixed`, Discount = `10000`, Min order amount = `-1`.
5. Bấm Lưu.

**2. Kết quả mong đợi (SRS FR-17):**
> *Trích dẫn SRS:* "Các trường bắt buộc: ... `min_order_amount` (>= 0)".
- Hệ thống từ chối và báo lỗi: "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0".

**3. Kết quả thực tế:**
- Hệ thống tạo thành công mã giảm giá với `min_order_amount = -1`.

---

#### [BUG-FR17-02] Không kiểm tra trùng lặp mã coupon khi tạo mới

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR17-02` |
| **Tiêu đề Bug** | `[FR-17][Admin] Duplicate coupon code creation allowed without uniqueness validation` |
| **Mức độ (Severity)** | **Major** (Tính toàn vẹn dữ liệu) |
| **Test Case phát hiện** | `TC_FR17_08` |
| **GitHub Issue Link** | [Issue #17: [FR-17] Duplicate coupon code](https://github.com/ttbhanh/eshop-sut/issues/17) |

**1. Kết quả mong đợi (SRS FR-17):**
> *Trích dẫn SRS:* "Các trường bắt buộc: `code` (duy nhất)".

**2. Kết quả thực tế:**
- Cho phép tạo 2 coupon cùng mang tên `SAVE10`.

---

### 2.4 Các lỗi thuộc Pool D: Mobile (FR-20 & FR-10) – Hủy đơn hàng theo trạng thái

#### [BUG-FR20-01] Đơn hàng ở trạng thái `shipping` vẫn cho phép User bấm Hủy trên Mobile

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR20-01` |
| **Tiêu đề Bug** | `[FR-20][Mobile] Order in 'shipping' status can still be canceled by customer on Mobile App` |
| **Mức độ (Severity)** | **Critical** (Vi phạm ràng buộc chuyển đổi trạng thái State Machine) |
| **Test Case phát hiện** | `TC_MOB_03` (BVA State Transition Boundary) |
| **GitHub Issue Link** | [Issue #18: [FR-20] Order in shipping status can be canceled on Mobile](https://github.com/ttbhanh/eshop-sut/issues/18) |

**1. Kết quả mong đợi (SRS FR-10 & FR-20):**
> *Trích dẫn SRS:* "Khi đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy – chỉ Admin mới có thể thao tác."
- Trên màn hình chi tiết đơn hàng của Mobile App, nút "Hủy đơn" phải bị ẩn hoặc bị vô hiệu hóa khi trạng thái là `shipping`.

**2. Kết quả thực tế:**
- Nút "Hủy đơn" vẫn hiển thị màu đỏ và bấm được. Khi bấm xác nhận, đơn hàng bị đổi thành `canceled` thành công.

---

#### [BUG-FR20-02] Sau khi hủy đơn thành công, giao diện Mobile không tự làm mới trạng thái

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR20-02` |
| **Tiêu đề Bug** | `[FR-20][Mobile] Order status does not automatically update after cancellation` |
| **Mức độ (Severity)** | **Medium** (Lỗi đồng bộ trạng thái giao diện) |
| **Test Case phát hiện** | `TC_MOB_01` |
| **GitHub Issue Link** | [Issue #19: [FR-20] Status not refreshed after order cancel](https://github.com/ttbhanh/eshop-sut/issues/19) |

---

## 3. PHÂN TÍCH NGUYÊN NHÂN LỖI & ĐÁNH GIÁ CHẤT LƯỢNG SUT

### 3.1 Phân Loại Lỗi Theo Bản Chất Kỹ Thuật
1. **Lỗi vi phạm giá trị biên (Boundary Off-by-one & Unbounded Inputs):**
   - Không kiểm soát biên dưới số học ($\ge 0$ và $> 0$ ở trường Coupon).
2. **Lỗi không thực thi State Machine (State Transition Bypass):**
   - Tầng UI và API chưa đồng bộ chặt chẽ với sơ đồ chuyển đổi trạng thái ở FR-10, cho phép User hủy đơn đã xuất kho (`shipping`).
3. **Lỗi bảo mật & Tiết lộ thông tin (Information Leakage & Lockout Absence):**
   - Thiếu cơ chế tạm khóa chống tấn công Brute-force tài khoản; phản hồi thông tin lỗi quá chi tiết.

### 3.2 Đánh Giá Chung Về Hệ Thống EShop
Hệ thống EShop đáp ứng tốt các luồng chức năng thông thường (Happy Path), nhưng bộc lộ nhiều lỗ hổng tại các điểm biên nghiệp vụ, xác thực đơn lỗi đầu vào và bảo vệ trạng thái đơn hàng. Kỹ thuật **Domain Testing** và **Boundary Value Analysis** đã chứng minh tính hiệu quả vượt trội khi phát hiện trúng các điểm yếu này.
