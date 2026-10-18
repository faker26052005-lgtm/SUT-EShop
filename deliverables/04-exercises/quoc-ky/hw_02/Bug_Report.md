# BÁO CÁO PHÁT HIỆN LỖI (DEFECT / BUG REPORT) – HỆ THỐNG ESHOP

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Repository GitHub của nhóm:** [Nhóm 11 – EShop Seminar & Testing](https://github.com/faker26052005-lgtm/SUT-EShop)  
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
| `BUG-FR02-01` | Bộ đếm số lần đăng nhập sai tăng 2 thay vì 1 đơn vị sau 1 lần thử sai | FR-02 | `TC_FR02_03` | Major | [Issue #4](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4) | Open |
| `BUG-FR02-02` | Khóa tài khoản sớm tại lần thử sai thứ 2 với thời gian phạt 180s thay vì 30s | FR-02 | `TC_FR02_04` | Critical | [Issue #5](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5) | Open |
| `BUG-FR07-01` | Bấm nút giảm (-) tại số lượng 1 tự xóa sản phẩm không có dialog xác nhận | FR-07 | `TC_FR07_03` | Major | [Issue #14](https://github.com/ttbhanh/eshop-sut/issues/14) | Open |
| `BUG-FR07-02` | Footer giỏ hàng hiển thị nhãn "Tổng tạm tính" thay vì "Tổng cộng" | FR-07 | `TC_FR07_09` | Medium | [Issue #15](https://github.com/ttbhanh/eshop-sut/issues/15) | Open |
| `BUG-FR17-01` | Form Admin cho phép nhập `min_order_amount = -1` và lưu thành công | FR-17 | `TC_FR17_05` | Major | [Issue #16](https://github.com/ttbhanh/eshop-sut/issues/16) | Open |
| `BUG-FR17-02` | Không ràng buộc Unique mã Coupon, cho phép tạo trùng lặp | FR-17 | `TC_FR17_08` | Major | [Issue #17](https://github.com/ttbhanh/eshop-sut/issues/17) | Open |
| `BUG-FR20-01` | Đơn hàng đã ở trạng thái `shipping` nhưng User vẫn bấm Hủy được trên Mobile | Mobile | `TC_MOB_03` | Critical | [Issue #18](https://github.com/ttbhanh/eshop-sut/issues/18) | Open |
| `BUG-FR20-02` | Sau khi hủy thành công, trạng thái không tự refresh sang `canceled` | Mobile | `TC_MOB_01` | Medium | [Issue #19](https://github.com/ttbhanh/eshop-sut/issues/19) | Open |

---

## 2. BÁO CÁO CHI TIẾT TỪNG LỖI (DETAILED DEFECT TICKETS)

### 2.1 Các lỗi thuộc Pool A: FR-02 – Đăng nhập & Khóa tài khoản

#### [BUG-FR02-01] Bộ đếm số lần đăng nhập sai tăng 2 thay vì 1 đơn vị sau 1 lần thử sai

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-01` |
| **Tiêu đề Bug** | `[FR-02][Backend API / SQLite DB] Failure counter increments by 2 instead of 1 upon invalid login attempt` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Linux |
| **Mức độ (Severity)** | **Major** (Sai lệch ngưỡng bảo mật khiến tài khoản bị khóa sớm ngoài ý muốn) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR02_03`](Main_Report.md#tc_fr02_03) (Thử sai lần 1 $N = 1$) |
| **GitHub Issue Link** | [Issue #4: [BUG] [FR-02][Backend API / SQLite DB] Failure counter increments by 2 instead of 1 upon invalid login attempt](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Tài khoản người dùng `test@eshop.com` tồn tại trong SQLite database với `login_attempts = 0`, `locked_until = NULL`.
- Backend server đang chạy tại `http://localhost:3000`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Gửi yêu cầu đăng nhập với email hợp lệ `test@eshop.com` và mật khẩu không chính xác `WrongPass1!`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"WrongPass1!"}'
   ```
2. Truy vấn SQLite kiểm tra giá trị cột `login_attempts` của tài khoản `test@eshop.com`:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "email": "test@eshop.com",
  "password": "WrongPass1!"
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS FR-02 (Item 2):* "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần đăng nhập sai liên tiếp lên đúng 1 đơn vị."
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized`.
- Trong CSDL SQLite, trường `login_attempts` phải tăng từ `0` lên **đúng `1`** ($N=1$). Trường `locked_until` tiếp tục giữ nguyên là `NULL`.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized` (`{"error":"Invalid email or password"}`).
- Tuy nhiên trong SQLite CSDL, trường `login_attempts` tăng từ `0` lên **`2`** ($N=2$) chỉ sau đúng 1 lần thử sai duy nhất. Điều này vi phạm quy tắc đếm tuần tự của SRS và khiến tài khoản bị khóa chỉ sau 2 lần thử sai thay vì 3 lần.
- HTTP Status Code: `401 Unauthorized`
- Database Mutation: `login_attempts` = 2, `locked_until` = null

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng terminal & database:*  
  ![Lỗi bộ đếm tăng 2 sau 1 lần thử sai](./screenshots/BUG_FR02_01_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/4](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `backend/server.js`, dòng 54.
- **Đoạn mã gây lỗi:**
  ```javascript
  const newAttempts = user.login_attempts + 2;
  ```
- **Khắc phục:** Sửa phép cộng thành tăng 1 đơn vị:
  ```javascript
  const newAttempts = user.login_attempts + 1;
  ```

---

#### [BUG-FR02-02] Khóa tài khoản sớm tại lần thử sai thứ 2 với thời gian phạt 180s thay vì 30s

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-02` |
| **Tiêu đề Bug** | `[FR-02][Backend API / SQLite DB] Premature account lockout triggered at attempt N=2 with excessive 180s duration` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Linux |
| **Mức độ (Severity)** | **Critical** (Khóa oan tài khoản người dùng hợp lệ và phạt thời gian vượt mức 6 lần quy định) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR02_04`](Main_Report.md#tc_fr02_04) (Thử sai lần 2 - Biên Off-point trước ngưỡng khóa) |
| **GitHub Issue Link** | [Issue #5: [BUG] [FR-02][Backend API / SQLite DB] Premature account lockout triggered at attempt N=2 with excessive 180s duration](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Tài khoản người dùng `test@eshop.com` đang tích lũy 1 lần đăng nhập sai trước đó: `login_attempts = 1`, `locked_until = NULL`.
- SUT backend đang chạy tại `http://localhost:3000`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Gửi yêu cầu đăng nhập lần thứ 2 với email `test@eshop.com` và mật khẩu không chính xác `WrongPass2!`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"WrongPass2!"}'
   ```
2. Truy vấn SQLite kiểm tra giá trị hai cột `login_attempts` và `locked_until` của tài khoản `test@eshop.com`:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "email": "test@eshop.com",
  "password": "WrongPass2!"
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS FR-02 (Mục 2 & 3):* "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần đăng nhập sai liên tiếp lên đúng 1 đơn vị. Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)."
- Tại lần thử sai thứ 2 ($N=2$, điểm Off-point trước ngưỡng khóa 3):
  - HTTP Status: `401 Unauthorized` (`{"error": "Invalid email or password"}`).
  - Trong CSDL SQLite: `login_attempts` phải tăng từ `1` lên **đúng `2`** ($N=2$).
  - Trường `locked_until` phải tiếp tục giữ nguyên là `NULL` (chưa kích hoạt khóa).
- Khi tài khoản đạt ngưỡng khóa ($N=3$), thời hạn phạt chỉ được là 30 giây.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized`.
- Tuy nhiên trong CSDL SQLite:
  - `login_attempts` bị tăng vọt từ `1` lên **`3`** (do lỗi logic `+ 2`).
  - Do `newAttempts >= 3`, hệ thống kích hoạt khóa tài khoản non ngay tại lần thử thứ 2 ($N=2$).
  - Thời hạn khóa `locked_until` bị đặt thành **180 giây** (`2026-10-18T17:38:17.793Z` so với thời điểm gửi `17:35:17 GMT`), dài gấp 6 lần quy định 30 giây của SRS.
- HTTP Status Code: `401 Unauthorized`
- Database Mutation: `login_attempts` = 3, `locked_until` = `2026-10-18T17:38:17.793Z` (+180s)

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng terminal & database:*  
  ![Minh chứng lỗi khóa tài khoản non và thời gian 180s](./screenshots/BUG_FR02_02_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/5](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `backend/server.js`, dòng 54–58.
- **Đoạn mã gây lỗi:**
  ```javascript
  const newAttempts = user.login_attempts + 2;
  let lockedUntil = null;
  if (newAttempts >= 3) {
    lockedUntil = new Date(Date.now() + 180000).toISOString();
  }
  ```
- **Khắc phục:** 
  1. Đổi phép cộng sang tăng 1 đơn vị: `user.login_attempts + 1`.
  2. Đổi thời gian khóa về đúng 30 giây theo SRS demo: `Date.now() + 30000`.
  ```javascript
  const newAttempts = user.login_attempts + 1;
  let lockedUntil = null;
  if (newAttempts >= 3) {
    lockedUntil = new Date(Date.now() + 30000).toISOString();
  }
  ```

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
