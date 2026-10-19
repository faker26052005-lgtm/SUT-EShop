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
| **Pool A (Web/Auth)** | **FR-02** | Đăng nhập & Khóa tài khoản | 2 | 3 | 0 | 0 | **5** |
| **Pool B (Web/Cart)** | **FR-07** | Giỏ hàng (Shopping Cart) | 0 | 11 | 2 | 0 | **13** |
| **Pool C (Admin/Coupon)** | **FR-17** | Quản lý Mã Giảm Giá | 0 | 2 | 0 | 0 | **2** |
| **Pool D (Mobile/Order)** | **FR-20 & FR-10**| Hủy đơn hàng theo trạng thái | 1 | 0 | 1 | 0 | **2** |
| **TỔNG CỘNG** | | | **3** | **16** | **3** | **0** | **22** |

### 1.2 Bảng Ma Trận Truy Vết Lỗi (Traceability: Test Case ↔ Bug ID ↔ GitHub Issue)
| Bug ID | Tóm tắt lỗi | Tính năng | TC phát hiện | Mức độ | GitHub Issue | Trạng thái |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `BUG-FR02-01` | Bộ đếm số lần đăng nhập sai tăng 2 thay vì 1 đơn vị sau 1 lần thử sai | FR-02 | `TC_FR02_03` | Major | [Issue #4](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4) | Open |
| `BUG-FR02-02` | Khóa tài khoản sớm tại lần thử sai thứ 2 với thời gian phạt 180s thay vì 30s | FR-02 | `TC_FR02_04` | Critical | [Issue #5](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5) | Open |
| `BUG-FR02-03` | Bộ đếm số lần đăng nhập sai nhảy vọt lên 4 thay vì 3 tại lần thử sai thứ 3 | FR-02 | `TC_FR02_06` | Major | [Issue #6](https://github.com/faker26052005-lgtm/SUT-EShop/issues/6) | Open |
| `BUG-FR02-04` | Đăng nhập bằng mật khẩu đúng trong khi đang bị khóa vẫn thành công và tự gỡ khóa | FR-02 | `TC_FR02_07` | Critical | [Issue #7](https://github.com/faker26052005-lgtm/SUT-EShop/issues/7) | Open |
| `BUG-FR02-05` | Form đăng nhập dùng input type="text" cho email, bỏ qua hoàn toàn HTML5 format validation | FR-02 | `TC_FR02_14` | Major | [Issue #8](https://github.com/faker26052005-lgtm/SUT-EShop/issues/8) | Open |
| `BUG-FR07-01` | Nút "Thêm vào giỏ hàng" tại trang chi tiết sản phẩm bỏ qua lần bấm đầu tiên | FR-07 | `TC_FR07_01` | Major | [Issue #9](https://github.com/faker26052005-lgtm/SUT-EShop/issues/9) | Open |
| `BUG-FR07-02` | Thêm cùng sản phẩm tạo dòng mới riêng biệt thay vì tăng số lượng | FR-07 | `TC_FR07_02` | Major | [Issue #10](https://github.com/faker26052005-lgtm/SUT-EShop/issues/10) | Open |
| `BUG-FR07-03` | Endpoint POST /api/cart chấp nhận ID sản phẩm không tồn tại (9999) | FR-07 | `TC_FR07_03` | Major | [Issue #11](https://github.com/faker26052005-lgtm/SUT-EShop/issues/11) | Open |
| `BUG-FR07-04` | Endpoint POST /api/cart chấp nhận ID sai kiểu dữ liệu ("abc") không validate | FR-07 | `TC_FR07_04` | Major | [Issue #12](https://github.com/faker26052005-lgtm/SUT-EShop/issues/12) | Open |
| `BUG-FR07-05` | Nhập số lượng 0 hệ thống vẫn chấp nhận, lưu bản ghi có thành tiền 0 ₫ | FR-07 | `TC_FR07_05` | Major | [Issue #13](https://github.com/faker26052005-lgtm/SUT-EShop/issues/13) | Open |
| `BUG-FR07-06` | Hệ thống chấp nhận số lượng âm (-1), hiển thị thành tiền âm trong giỏ | FR-07 | `TC_FR07_06` | Major | [Issue #14](https://github.com/faker26052005-lgtm/SUT-EShop/issues/14) | Open |
| `BUG-FR07-07` | Xóa trống ô số lượng khiến giỏ hàng bị tính toán sai thành "NaN ₫" | FR-07 | `TC_FR07_07` | Major | [Issue #15](https://github.com/faker26052005-lgtm/SUT-EShop/issues/15) | Open |
| `BUG-FR07-08` | Nhập số lượng thập phân (1.5) được chấp nhận, giao diện tự làm tròn xuống 1 và API trả về 200 OK | FR-07 | `TC_FR07_09` | Major | [Issue #16](https://github.com/faker26052005-lgtm/SUT-EShop/issues/16) | Open |
| `BUG-FR07-09` | Endpoint POST /api/cart chấp nhận payload khuyết hoặc null trường quantity với 200 OK | FR-07 | `TC_FR07_10` | Major | [Issue #17](https://github.com/faker26052005-lgtm/SUT-EShop/issues/17) | Open |
| `BUG-FR07-10` | Bảng giỏ hàng thiếu hoàn toàn nút +/- để điều chỉnh số lượng sản phẩm theo đặc tả | FR-07 | `TC_FR07_13`, `TC_FR07_14` | Major | [Issue #18](https://github.com/faker26052005-lgtm/SUT-EShop/issues/18) | Open |
| `BUG-FR07-11` | Nút Xóa sản phẩm xóa trực tiếp không có dialog xác nhận theo yêu cầu SRS | FR-07 | `TC_FR07_15`, `TC_FR07_16` | Major | [Issue #19](https://github.com/faker26052005-lgtm/SUT-EShop/issues/19) | Open |
| `BUG-FR07-12` | Giao diện giỏ hàng trống chỉ có text thuần, thiếu hình ảnh minh họa theo đặc tả | FR-07 | `TC_FR07_17` | Medium | [Issue #20](https://github.com/faker26052005-lgtm/SUT-EShop/issues/20) | Open |
| `BUG-FR07-13` | Footer giỏ hàng hiển thị nhãn "Tổng tạm tính" thay vì "Tổng cộng" theo đặc tả | FR-07 | `TC_FR07_18` | Medium | [Issue #21](https://github.com/faker26052005-lgtm/SUT-EShop/issues/21) | Open |
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

#### [BUG-FR02-03] Bộ đếm số lần đăng nhập sai nhảy vọt lên 4 thay vì 3 tại lần thử sai thứ 3

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-03` |
| **Tiêu đề Bug** | `[FR-02][Backend API / SQLite DB] Failure counter jumps to 4 instead of 3 upon reaching consecutive failure threshold` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Linux |
| **Mức độ (Severity)** | **Major** (Sai lệch trạng thái bộ đếm bảo mật tại điểm On-point kích hoạt ngưỡng khóa) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR02_06`](Main_Report.md#tc_fr02_06) (Thử sai lần 3 - Điểm biên On-point kích hoạt ngưỡng khóa $N = 3$) |
| **GitHub Issue Link** | [Issue #6: [BUG] [FR-02][Backend API / SQLite DB] Failure counter jumps to 4 instead of 3 upon reaching consecutive failure threshold](https://github.com/faker26052005-lgtm/SUT-EShop/issues/6) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Tài khoản người dùng `test@eshop.com` đang tích lũy 2 lần đăng nhập sai trước đó: `login_attempts = 2`, `locked_until = NULL`.
- SUT backend đang hoạt động tại `http://localhost:3000`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Gửi yêu cầu đăng nhập lần thứ 3 liên tiếp với email `test@eshop.com` và mật khẩu không chính xác `WrongPass3!`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"WrongPass3!"}'
   ```
2. Truy vấn SQLite kiểm tra giá trị hai cột `login_attempts` và `locked_until` của tài khoản `test@eshop.com`:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "email": "test@eshop.com",
  "password": "WrongPass3!"
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS FR-02 (Mục 2 & 3):* "Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm số lần đăng nhập sai liên tiếp lên đúng 1 đơn vị. Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)."
- Tại lần thử sai thứ 3 ($N=3$, điểm On-point kích hoạt ngưỡng khóa):
  - HTTP Status: `401 Unauthorized` hoặc `403 Forbidden`.
  - Trong CSDL SQLite: `login_attempts` phải tăng từ `2` lên **đúng `3`** ($N=3$).
  - Trường `locked_until` được gán mốc hết hạn đúng $T_{trigger} + 30\text{ giây}$.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/login` trả về HTTP `401 Unauthorized`.
- Trong CSDL SQLite:
  - `login_attempts` bị tăng vọt từ `2` lên **`4`** ($N=4$) do lỗi logic `user.login_attempts + 2`.
  - `locked_until` được gán giá trị thời gian 180 giây (3 phút) sau đó thay vì 30 giây.
- HTTP Status Code: `401 Unauthorized`
- Database Mutation: `login_attempts` = 4, `locked_until` = `2026-10-18T17:49:37.416Z`

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng terminal & database:*  
  ![Minh chứng lỗi bộ đếm đạt 4 ở lần sai thứ 3](./screenshots/BUG_FR02_03_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/6](https://github.com/faker26052005-lgtm/SUT-EShop/issues/6)

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

#### [BUG-FR02-04] Đăng nhập bằng mật khẩu đúng trong khi đang bị khóa vẫn thành công và tự gỡ khóa

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-04` |
| **Tiêu đề Bug** | `[FR-02][Backend API / Security] Correct password bypasses active account lockout and clears lockout state` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Linux |
| **Mức độ (Severity)** | **Critical** (Lỗ hổng bảo mật nghiêm trọng: Bỏ qua cơ chế khóa tài khoản và tự giải phóng trạng thái phạt) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR02_07`](Main_Report.md#tc_fr02_07) (Thử đăng nhập bằng mật khẩu đúng trong thời gian khóa) |
| **GitHub Issue Link** | [Issue #7: [BUG] [FR-02][Backend API / Security] Correct password bypasses active account lockout and clears lockout state](https://github.com/faker26052005-lgtm/SUT-EShop/issues/7) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Tài khoản người dùng `test@eshop.com` đang trong thời gian bị tạm khóa (`locked_until` có giá trị trong tương lai).
- SUT backend đang chạy tại `http://localhost:3000`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Kiểm tra CSDL SQLite để xác nhận mốc `locked_until` của tài khoản `test@eshop.com` đang có hiệu lực trong tương lai.
2. Gửi yêu cầu đăng nhập với email `test@eshop.com` và mật khẩu đúng `Test1234!` trong thời gian tài khoản đang bị khóa:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@eshop.com","password":"Test1234!"}'
   ```
3. Truy vấn lại CSDL SQLite để kiểm tra xem tài khoản có bị gỡ khóa sớm hay không:
   ```bash
   SELECT id, email, login_attempts, locked_until FROM users WHERE email='test@eshop.com';
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "email": "test@eshop.com",
  "password": "Test1234!"
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS FR-02 (Mục 3):* "Trong thời gian tài khoản bị tạm khóa, mọi yêu cầu đăng nhập (kể cả khi nhập đúng thông tin) đều bị hệ thống từ chối."
- Endpoint `POST /api/login` trả về HTTP `403 Forbidden` (`{"error": "Tài khoản đã bị khóa. Vui lòng thử lại sau."}`).
- Tuyệt đối không cấp JWT token cho phiên làm việc.
- Trong CSDL SQLite, trường `locked_until` phải giữ nguyên, không được tự ý xóa hoặc mở khóa sớm.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/login` trả về HTTP `200 OK` (`{"message": "Login successful"}`).
- Cấp JWT token hợp lệ và cho phép người dùng đăng nhập thành công vào hệ thống.
- Trong CSDL SQLite, trường `locked_until` bị xóa về `NULL`, chấm dứt thời gian phạt khóa tài khoản ngay lập tức.
- HTTP Status Code: `200 OK`
- Database Mutation: `locked_until` = null (mở khóa trái phép)

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng terminal & database:*  
  ![Minh chứng lỗi vượt khóa khi nhập đúng mật khẩu](./screenshots/BUG_FR02_04_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/7](https://github.com/faker26052005-lgtm/SUT-EShop/issues/7)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `backend/server.js`, dòng 40–52.
- **Đoạn mã gây lỗi:**
  ```javascript
  if (user.locked_until && new Date() < new Date(user.locked_until)) {
    return res
      .status(403)
      .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
  }

  if (user.password === password) {
    db.run(
      "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?",
      [user.id],
    );
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
    res.json({ message: "Login successful", token, user });
  }
  ```
- **Nguyên nhân:**
  1. Khi chuỗi `locked_until` trong SQLite không có hậu tố `Z`, JavaScript diễn giải theo giờ Local (GMT+7), làm lệch 7 giờ so với `new Date()` (UTC), khiến điều kiện `new Date() < new Date(user.locked_until)` bị sai (false).
  2. Khi vượt qua điều kiện kiểm tra, khối `if (user.password === password)` lập tức thực thi câu lệnh SQL xóa `locked_until = NULL`, làm sụp đổ hoàn toàn cơ chế khóa bảo mật.
- **Khắc phục:** Chuẩn hóa so sánh múi giờ UTC hoặc ép định dạng ISO, và chặn hoàn toàn nhánh reset khi đang trong thời gian khóa:
  ```javascript
  const lockedTime = user.locked_until ? new Date(user.locked_until.includes('T') ? user.locked_until : user.locked_until.replace(' ', 'T') + 'Z') : null;
  if (lockedTime && new Date() < lockedTime) {
    return res
      .status(403)
      .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
  }
  ```

---

#### [BUG-FR02-05] Form đăng nhập dùng input type="text" cho email, bỏ qua hoàn toàn HTML5 format validation

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR02-05` |
| **Tiêu đề Bug** | `[FR-02][Web UI] Email input uses type="text" instead of type="email", bypassing HTML5 format validation` |
| **Chức năng (Feature)** | FR-02: Đăng nhập & Khóa tài khoản (Pool A) / Web Client UI |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v18.19 • Linux |
| **Mức độ (Severity)** | **Major** (Bỏ qua cơ chế validate định dạng email client-side bắt buộc theo đặc tả SRS) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR02_14`](Main_Report.md#tc_fr02_14) (Single-Fault Boundary: Email thiếu ký tự `@`) |
| **GitHub Issue Link** | [Issue #8: [BUG] [FR-02][Web UI] Email input uses type="text" instead of type="email", bypassing HTML5 format validation](https://github.com/faker26052005-lgtm/SUT-EShop/issues/8) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT Web frontend đang chạy tại `http://localhost:5173`.
- Người dùng truy cập trang đăng nhập `http://localhost:5173/login`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trang đăng nhập tại `http://localhost:5173/login`.
2. Tại trường nhập liệu email đầu tiên (đang gắn nhãn sai là "Username"), nhập chuỗi email không hợp lệ thiếu `@`: `testeshop.com`.
3. Tại ô mật khẩu, nhập `Test1234!`.
4. Bấm nút "Sign In" (hoặc nhấn Enter).

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "email": "testeshop.com",
  "password": "Test1234!"
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-02):**
> *Trích dẫn SRS FR-02 (Mục 5):* "Trường email phải dùng `type="email"` (có validate HTML5 format)."
- Trình duyệt hiển thị tooltip/cảnh báo HTML5: *"Please include an '@' in the email address..."* (hoặc tiếng Việt tương đương).
- Form bị chặn gửi ở Client, không gửi HTTP POST `/api/login` lên backend khi định dạng email sai.

**5. Kết quả thực tế (Actual Result):**
- Trường nhập email được lập trình với `type="text"` (nhãn là "Username") thay vì `type="email"`.
- Trình duyệt không kích hoạt HTML5 format validation, cho phép submit thẳng payload `testeshop.com` lên server.
- Backend nhận request sai định dạng và trả về HTTP `401 Unauthorized` (`{"error":"Invalid email or password"}`).
- *(Các lỗi giao diện liên quan phát hiện đồng thời: Tiêu đề trang đăng nhập hiển thị "Đăng Ký" thay vì "Đăng Nhập", và ô mật khẩu dùng `type="text"` làm lộ plaintext password).*
- HTTP Status Code: `401 Unauthorized`
- Client Behavior: Không kích hoạt HTML5 format validation

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng giao diện Web UI & API:*  
  ![Lỗi form login dùng type=text bỏ qua validate email](./screenshots/BUG_FR02_05_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/8](https://github.com/faker26052005-lgtm/SUT-EShop/issues/8)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `frontend-web/src/pages/Login.jsx`, các dòng 24, 28–35, 38–46.
- **Đoạn mã gây lỗi:**
  ```jsx
  <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-gray-700 mb-2">Username</label>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
    </div>
  ```
- **Khắc phục:** Sửa type thành `email`, nhãn thành "Email", sửa tiêu đề "Đăng Nhập", và ô mật khẩu dùng `type="password"`:
  ```jsx
  <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-gray-700 mb-2">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
    </div>
  ```

---

### 2.2 Các lỗi thuộc Pool B: FR-07 – Giỏ hàng (Shopping Cart)

#### [BUG-FR07-01] Nút "Thêm vào giỏ hàng" tại trang chi tiết sản phẩm bỏ qua lần bấm đầu tiên

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-01` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Add to cart button on Product Detail page ignores first click` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Làm gián đoạn luồng đặt hàng chính của khách hàng) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_01`](Main_Report.md#tc_fr07_01) (Verify adding a new valid product to empty cart) |
| **GitHub Issue Link** | [Issue #9: [BUG] [FR-07][Web UI] Add to cart button on Product Detail page ignores first click](https://github.com/faker26052005-lgtm/SUT-EShop/issues/9) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Giỏ hàng của người dùng đang hoàn toàn trống (`cart.length === 0`).
- SUT backend và frontend-web đang chạy tại `:3000` và `:5173`.
- CSDL có sản phẩm ID 1 (`iPhone 15 Pro Max`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập trang chi tiết sản phẩm: `http://localhost:5173/product/1`.
2. Giữ nguyên số lượng mặc định là `1`.
3. Nhấn nút "Thêm vào giỏ hàng" **1 lần duy nhất**.
4. Quan sát phản hồi trên giao diện (nút không chuyển sang "Đã thêm").
5. Nhấn vào mục "Giỏ hàng" trên thanh Header (`http://localhost:5173/cart`).

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "product_id": 1,
  "quantity": 1
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 1):* "Hiển thị danh sách sản phẩm với các cột: Sản phẩm, Đơn giá, Số lượng (có nút +/- để chỉnh), Thành tiền, Thao tác."
- Khi nhấn nút "Thêm vào giỏ hàng" trên trang chi tiết sản phẩm, nút phải đổi trạng thái xác nhận thành công ("Đã thêm"), sản phẩm được cập nhật vào CartContext.
- Trang giỏ hàng `/cart` hiển thị bảng gồm 1 dòng sản phẩm iPhone 15 Pro Max, đơn giá 30.000.000 ₫, số lượng 1, thành tiền 30.000.000 ₫ và tổng tiền 30.000.000 ₫.

**5. Kết quả thực tế (Actual Result):**
- Khi người dùng nhấn "Thêm vào giỏ hàng" lần đầu tiên, giao diện hoàn toàn không có phản hồi và sản phẩm không hề được đưa vào giỏ hàng.
- Khi điều hướng sang `/cart`, màn hình hiển thị: *"Giỏ hàng của bạn đang trống"*.
- Người dùng buộc phải nhấn nút lần thứ 2 liên tiếp thì sản phẩm mới được thêm vào.
- State Client: `cart` vẫn là mảng rỗng `[]` sau lần bấm đầu tiên.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bằng chứng giao diện Web UI:*  
  ![Giỏ hàng trống sau khi bấm thêm lần đầu](./screenshots/BUG_FR07_01_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/9](https://github.com/faker26052005-lgtm/SUT-EShop/issues/9)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `frontend-web/src/pages/ProductDetail.jsx`, các dòng 21–25.
- **Đoạn mã gây lỗi:**
  ```javascript
  const handleAddToCart = () => {
    if (clickCount === 0) {
      setClickCount(1);
      return; // Không làm gì cả ở lần đầu tiên
    }

    addToCart(product, parseInt(quantity));
    setAdded(true);
    setClickCount(0); // Reset lại
    setTimeout(() => setAdded(false), 2000);
  };
  ```
- **Khắc phục:** Loại bỏ điều kiện `clickCount === 0`, kích hoạt `addToCart` ngay trong lần nhấn đầu:
  ```javascript
  const handleAddToCart = () => {
    addToCart(product, parseInt(quantity));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  ```

---

#### [BUG-FR07-02] Thêm cùng sản phẩm tạo dòng mới riêng biệt thay vì tăng số lượng

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-02` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Adding duplicate product creates new row instead of incrementing quantity` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Vi phạm trực tiếp quy tắc gộp dòng sản phẩm theo SRS FR-07) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_02`](Main_Report.md#tc_fr07_02) (Verify adding duplicate product increments quantity without creating new row) |
| **GitHub Issue Link** | [Issue #10: [BUG] [FR-07][Web UI] Adding duplicate product creates new row instead of incrementing quantity](https://github.com/faker26052005-lgtm/SUT-EShop/issues/10) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Hệ thống backend và web đang hoạt động bình thường.
- Giỏ hàng của người dùng đã có sẵn 1 sản phẩm ID 1 (`iPhone 15 Pro Max`) với số lượng $Q = 1$.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Đảm bảo giỏ hàng đã có 1 sản phẩm `iPhone 15 Pro Max` ($Q=1$).
2. Từ trang chủ hoặc trang sản phẩm, thực hiện thao tác thêm tiếp sản phẩm `iPhone 15 Pro Max` lần thứ hai ($Q_{add}=1$).
3. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
4. Quan sát cấu trúc các dòng trong bảng giỏ hàng.

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "product_id": 1,
  "quantity_added": 1
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 2):* "Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."
- Bảng giỏ hàng duy trì **chính xác 1 dòng duy nhất** cho sản phẩm `iPhone 15 Pro Max`.
- Cột Số lượng tự động cộng dồn: $Q = 1 + 1 = 2$.
- Cột Thành tiền: $30.000.000 \times 2 = 60.000.000\text{ ₫}$.
- Tổng tiền hiển thị $60.000.000\text{ ₫}$.

**5. Kết quả thực tế (Actual Result):**
- Bảng giỏ hàng sinh ra **dòng thứ hai riêng biệt** cho cùng sản phẩm `iPhone 15 Pro Max`.
- Cả hai dòng đều hiển thị `Số lượng: 1` và `Thành tiền: 30,000,000 ₫`.
- Mặc dù tổng tiền cộng đúng thành $60.000.000\text{ ₫}$, nhưng việc tách thành 2 dòng riêng biệt vi phạm nghiêm trọng quy chuẩn UX và logic giỏ hàng của SRS.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp trước khi thêm (1 dòng):*  
  ![Giỏ hàng ban đầu 1 dòng](./screenshots/BUG_FR07_02_before.png)
- *Ảnh chụp sau khi thêm trùng lặp (Lỗi 2 dòng):*  
  ![Lỗi giỏ hàng tạo 2 dòng cho cùng sản phẩm](./screenshots/BUG_FR07_02_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/10](https://github.com/faker26052005-lgtm/SUT-EShop/issues/10)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `frontend-web/src/context/CartContext.jsx`, các dòng 8–10.
- **Đoạn mã gây lỗi:**
  ```javascript
  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]);
  };
  ```
- **Khắc phục:** Kiểm tra nếu sản phẩm đã tồn tại thì cộng dồn `quantity`, ngược lại mới append phần tử mới:
  ```javascript
  const addToCart = (product, quantity) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };
  ```

---

#### [BUG-FR07-03] Endpoint POST /api/cart chấp nhận ID sản phẩm không tồn tại (9999) mà không kiểm tra CSDL

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-03` |
| **Tiêu đề Bug** | `[FR-07][Backend API] Endpoint POST /api/cart accepts non-existent product ID (9999) without validation` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart API - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Lỗi toàn vẹn dữ liệu: cho phép lưu sản phẩm rác/không tồn tại vào giỏ hàng người dùng) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_03`](Main_Report.md#tc_fr07_03) (Validate rejection when adding well-formed non-existent product ID) |
| **GitHub Issue Link** | [Issue #11: [BUG] [FR-07][Backend API] Endpoint POST /api/cart accepts non-existent product ID (9999) without validation](https://github.com/faker26052005-lgtm/SUT-EShop/issues/11) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- Backend EShop đang chạy tại cổng `:3000`.
- Người dùng `test@eshop.com` có JWT Bearer token hợp lệ.
- CSDL SQLite hoàn toàn không chứa sản phẩm có `id = 9999`.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Lấy Bearer token đăng nhập cho tài khoản `test@eshop.com`.
2. Gửi request HTTP `POST /api/cart` kèm payload chứa `id = 9999`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 9999, "price": 100000, "quantity": 1}'
   ```
3. Gửi request `GET http://localhost:3000/api/cart` để kiểm tra giỏ hàng người dùng.
4. (Giao diện Web): Truy cập `http://localhost:5173/product/9999`.

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": 9999,
  "price": 100000,
  "quantity": 1
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07 & API Spec §4.2):**
> *Trích dẫn API Spec §4.2 & SRS FR-07:* "Từ chối thêm sản phẩm không tồn tại vào giỏ hàng."
- Backend bắt buộc phải truy vấn CSDL SQLite kiểm tra sự tồn tại của sản phẩm trước khi cập nhật giỏ hàng.
- Endpoint `POST /api/cart` phải từ chối request với mã lỗi HTTP `404 Not Found` hoặc `400 Bad Request` (`{"error": "Product not found"}`).
- Giỏ hàng của người dùng không được phép chứa ID 9999.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/cart` trả về HTTP `200 OK` (`{"message":"Added to cart"}`).
- Gọi `GET /api/cart` phát hiện bản ghi rác `{"id":9999, "price":100000, "quantity":1}` đã bị chèn trực tiếp vào mảng giỏ hàng của user.
- Trên giao diện Web:
  - Route `/product/9999` hiển thị thông báo thô: `"Sản phẩm không tồn tại (Lỗi trắng trang do data rỗng)"` do dev hardcode.
  - Route số nhiều `/products/9999` bị trắng trang hoàn toàn.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp terminal kiểm thử API (200 OK & chèn bản ghi 9999):*  
  ![API POST /api/cart chấp nhận ID 9999](./screenshots/BUG_FR07_03_api_terminal.png)
- *Ảnh chụp Web UI /product/9999:*  
  ![Web UI hiển thị lỗi rỗng data](./screenshots/BUG_FR07_03_ui_actual.png)
- *Ảnh chụp Web UI /products/9999 (Trắng trang):*  
  ![Trắng trang route số nhiều](./screenshots/BUG_FR07_03_route_plural.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/11](https://github.com/faker26052005-lgtm/SUT-EShop/issues/11)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `backend/server.js`, các dòng 290–295.
- **Đoạn mã gây lỗi:**
  ```javascript
  app.post("/api/cart", authenticateToken, (req, res) => {
    const userId = req.user.id;
    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push(req.body);
    res.json({ message: "Added to cart" });
  });
  ```
- **Khắc phục:** Thêm bước kiểm tra CSDL SQLite trước khi thêm vào giỏ:
  ```javascript
  app.post("/api/cart", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { id, quantity } = req.body;
    if (!id) return res.status(400).json({ error: "Product ID is required" });

    db.get("SELECT id, name, price FROM products WHERE id = ?", [id], (err, product) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!product) return res.status(404).json({ error: "Product not found" });

      if (!userCarts[userId]) userCarts[userId] = [];
      userCarts[userId].push({ ...product, quantity: quantity || 1 });
      res.json({ message: "Added to cart" });
    });
  });
  ```

---

#### [BUG-FR07-04] Endpoint POST /api/cart chấp nhận ID sai kiểu dữ liệu ("abc") mà không thực hiện Schema Validation

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-04` |
| **Tiêu đề Bug** | `[FR-07][Backend API] Endpoint POST /api/cart accepts malformed non-numeric product ID ("abc") without validation` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart API - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Vi phạm Schema/Type Validation, dẫn tới sai lệch kiểu dữ liệu trong state hệ thống) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_04`](Main_Report.md#tc_fr07_04) (Validate rejection when submitting malformed product ID via API) |
| **GitHub Issue Link** | [Issue #12: [BUG] [FR-07][Backend API] Endpoint POST /api/cart accepts malformed non-numeric product ID ("abc") without validation](https://github.com/faker26052005-lgtm/SUT-EShop/issues/12) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend đang chạy tại cổng `:3000`.
- Người dùng `test@eshop.com` có JWT Bearer token hợp lệ.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Lấy Bearer token đăng nhập cho tài khoản `test@eshop.com`.
2. Gửi request HTTP `POST /api/cart` kèm payload chứa `id = "abc"` (chuỗi ký tự):
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": "abc", "price": 100000, "quantity": 1}'
   ```
3. Gửi request `GET http://localhost:3000/api/cart` để kiểm tra giỏ hàng người dùng.

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": "abc",
  "price": 100000,
  "quantity": 1
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07 & API Spec §4.2):**
> *Trích dẫn API Spec §4.2:* "HTTP 400 Bad Request; từ chối xử lý dữ liệu sai kiểu."
- Backend API bắt buộc phải thực hiện Schema/Type Validation đối với trường `id`.
- Trường `id` phải là số nguyên dương ($id \in \mathbb{Z}^+$).
- Khi nhận ID mang định dạng chuỗi chữ không hợp lệ, hệ thống phải từ chối ngay với mã lỗi HTTP `400 Bad Request` (`{"error": "Invalid product ID format"}`).
- Giỏ hàng của người dùng không được phép lưu trữ phần tử chứa ID sai kiểu.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/cart` trả về HTTP `200 OK` (`{"message":"Added to cart"}`).
- Gọi `GET /api/cart` phát hiện bản ghi malformed `{"id":"abc", "price":100000, "quantity":1}` bị lưu thẳng vào mảng giỏ hàng của user.
- Backend hoàn toàn bỏ qua bước kiểm tra kiểu dữ liệu đầu vào.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp terminal kiểm thử API (200 OK & chèn bản ghi id="abc"):*  
  ![API POST /api/cart chấp nhận ID abc](./screenshots/BUG_FR07_04_actual.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/12](https://github.com/faker26052005-lgtm/SUT-EShop/issues/12)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:** File `backend/server.js`, các dòng 290–295.
- **Đoạn mã gây lỗi:**
  ```javascript
  app.post("/api/cart", authenticateToken, (req, res) => {
    const userId = req.user.id;
    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push(req.body);
    res.json({ message: "Added to cart" });
  });
  ```
- **Khắc phục:** Bổ sung bước kiểm tra số nguyên dương cho `id`:
  ```javascript
  app.post("/api/cart", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { id, quantity } = req.body;
    const numId = Number(id);

    if (!id || !Number.isInteger(numId) || numId <= 0) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    db.get("SELECT id, name, price FROM products WHERE id = ?", [numId], (err, product) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!product) return res.status(404).json({ error: "Product not found" });

      if (!userCarts[userId]) userCarts[userId] = [];
      userCarts[userId].push({ ...product, quantity: quantity || 1 });
      res.json({ message: "Added to cart" });
    });
  });
  ```

---

#### [BUG-FR07-05] Hệ thống chấp nhận số lượng 0 (Boundary Off-point), cho phép lưu bản ghi có thành tiền 0 ₫ vào giỏ hàng

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-05` |
| **Tiêu đề Bug** | `[FR-07][Web UI / API] Quantity zero (0) accepted, rendering zero-priced item and 200 OK` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Lỗi vi phạm giá trị biên BVA Off-point $Q=0$; tạo bản ghi đơn hàng vô nghĩa 0 ₫) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_05`](Main_Report.md#tc_fr07_05) (Validate rejection of quantity zero input on Cart item) |
| **GitHub Issue Link** | [Issue #13: [BUG] [FR-07][Web UI / API] Quantity zero (0) accepted, rendering zero-priced item and 200 OK](https://github.com/faker26052005-lgtm/SUT-EShop/issues/13) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- CSDL SQLite có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Tại ô nhập số lượng, xóa số 1 và nhập số `0` (Boundary Off-point).
3. Bấm nút "Thêm vào giỏ hàng".
4. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
5. Quan sát giá trị hiển thị tại các cột Số lượng, Thành tiền và Tổng tạm tính.
6. (API Verification):
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": 0}'
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": 0
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-06 & FR-07):**
> *Trích dẫn SRS FR-06 & FR-07:* "Số lượng sản phẩm trong giỏ hàng phải là số nguyên dương, tối thiểu là 1 ($Q \ge 1$)."
- Ô nhập số lượng trên Web Client phải có thuộc tính `min="1"`, chặn không cho nhập 0 hoặc tự động khôi phục về 1.
- API `POST /api/cart` phải từ chối `quantity = 0` với HTTP `400 Bad Request` (`{"error": "Quantity must be greater than or equal to 1"}`).
- Bảng giỏ hàng tuyệt đối không được phép lưu hoặc hiển thị dòng sản phẩm có $Q = 0$ và thành tiền = 0 ₫.

**5. Kết quả thực tế (Actual Result):**
- Input số lượng tại `ProductDetail.jsx` cho phép nhập `0` mà không hề có validation chặn lại.
- Bảng giỏ hàng hiển thị dòng sản phẩm với:
  - `Số lượng: 0`
  - `Thành tiền: 0 ₫`
  - `Tổng tạm tính: 0 ₫`
- Endpoint `POST /api/cart` trả về HTTP `200 OK` (`{"message":"Added to cart"}`) và lưu thẳng bản ghi $Q=0$ vào backend state.
- Ngoài ra, bảng `/cart` hiển thị text tĩnh `<td>{item.quantity}</td>`, hoàn toàn thiếu ô input hoặc hai nút `+` và `-` để điều chỉnh số lượng trực tiếp trong giỏ hàng.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp Web UI nhập Q=0:*  
  ![Nhập Q=0 trên trang chi tiết](./screenshots/BUG_FR07_05_input_zero.png)
- *Ảnh chụp bảng giỏ hàng lưu Q=0 và 0đ:*  
  ![Bảng giỏ hàng hiển thị Q=0](./screenshots/BUG_FR07_05_cart_zero.png)
- *Ảnh chụp terminal API trả về 200 OK:*  
  ![API POST /api/cart với Q=0 trả về 200 OK](./screenshots/BUG_FR07_05_api_terminal.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/13](https://github.com/faker26052005-lgtm/SUT-EShop/issues/13)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/ProductDetail.jsx`, dòng 56–62.
  - `frontend-web/src/pages/Cart.jsx`, dòng 47.
  - `backend/server.js`, dòng 290–295.
- **Khắc phục:**
  - Bổ sung `min="1"` và kiểm tra chặn giá trị `< 1` trên form.
  - Bổ sung validation kiểm tra `quantity >= 1` tại backend `server.js`:
    ```javascript
    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    ```

---

#### [BUG-FR07-06] Hệ thống chấp nhận số lượng âm (-1), hiển thị thành tiền âm và làm sai lệch tổng tiền giỏ hàng

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-06` |
| **Tiêu đề Bug** | `[FR-07][Web UI / API] Negative quantity (-1) accepted, producing negative subtotal and total amount` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Lỗi số học logic nghiêm trọng: cho phép số lượng âm dẫn tới thành tiền âm và tổng tiền âm) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_06`](Main_Report.md#tc_fr07_06) (Validate rejection of negative integer quantity input) |
| **GitHub Issue Link** | [Issue #14: [BUG] [FR-07][Web UI / API] Negative quantity (-1) accepted, producing negative subtotal and total amount](https://github.com/faker26052005-lgtm/SUT-EShop/issues/14) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- CSDL SQLite có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Tại ô nhập số lượng, xóa số 1 và nhập số âm `-1`.
3. Bấm nút "Thêm vào giỏ hàng".
4. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
5. Quan sát giá trị hiển thị tại các cột Số lượng, Thành tiền và Tổng tạm tính.
6. (API Verification):
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": -1}'
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": -1
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-06 & FR-07):**
> *Trích dẫn SRS FR-06 & FR-07:* "Số lượng sản phẩm trong giỏ hàng phải là số nguyên dương, tối thiểu là 1 ($Q \in \mathbb{Z}^+, Q \ge 1$)."
- Web UI input phải chặn nhập ký tự âm `-` hoặc tự động reset về 1 kèm cảnh báo lỗi.
- API `POST /api/cart` phải từ chối `quantity < 0` với HTTP `400 Bad Request` (`{"error": "Quantity must be a positive integer"}`).
- Bảng giỏ hàng tuyệt đối không bao giờ hiển thị số lượng âm hoặc thành tiền mang giá trị âm.

**5. Kết quả thực tế (Actual Result):**
- Input số lượng tại `ProductDetail.jsx` nhận ký tự âm `-1`.
- Bảng giỏ hàng hiển thị dòng sản phẩm với:
  - `Số lượng: -1`
  - `Thành tiền: -30,000,000 ₫` (tiền âm)
  - `Tổng tạm tính: -30,000,000 ₫` (tổng tiền âm phi lý)
- Endpoint `POST /api/cart` trả về HTTP `200 OK` (`{"message":"Added to cart"}`) và lưu thẳng bản ghi $Q=-1$ vào backend state.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp Web UI nhập Q = -1:*  
  ![Nhập Q=-1 trên trang chi tiết](./screenshots/BUG_FR07_06_input_negative.png)
- *Ảnh chụp bảng giỏ hàng lưu Q=-1 và tiền âm (-30tr):*  
  ![Bảng giỏ hàng hiển thị Q=-1 và -30tr](./screenshots/BUG_FR07_06_cart_negative.png)
- *Ảnh chụp terminal API trả về 200 OK:*  
  ![API POST /api/cart với Q=-1 trả về 200 OK](./screenshots/BUG_FR07_06_api_terminal.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/14](https://github.com/faker26052005-lgtm/SUT-EShop/issues/14)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/ProductDetail.jsx`, dòng 56–62.
  - `backend/server.js`, dòng 290–295.
- **Khắc phục:**
  - Chặn giá trị âm tại input:
    ```jsx
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
      className="border p-2 w-20 rounded"
    />
    ```
  - Thêm kiểm tra `quantity > 0` tại backend `server.js`:
    ```javascript
    const numQty = Number(quantity);
    if (!Number.isInteger(numQty) || numQty <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```

---

#### [BUG-FR07-07] Xóa trống ô số lượng khiến giỏ hàng bị tính toán sai thành "NaN ₫" và API chấp nhận chuỗi rỗng

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-07` |
| **Tiêu đề Bug** | `[FR-07][Web UI / API] Empty quantity accepted, corrupting cart table amounts to "NaN ₫"` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Lỗi hiển thị NaN phá vỡ tính năng tính toán giá trị đơn hàng) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_07`](Main_Report.md#tc_fr07_07) (Validate rejection of empty or whitespace quantity input) |
| **GitHub Issue Link** | [Issue #15: [BUG] [FR-07][Web UI / API] Empty quantity accepted, corrupting cart table amounts to "NaN ₫"](https://github.com/faker26052005-lgtm/SUT-EShop/issues/15) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- CSDL SQLite có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Bôi đen toàn bộ số trong ô số lượng và nhấn Backspace để xóa sạch (chuỗi rỗng `""`).
3. Bấm nút "Thêm vào giỏ hàng".
4. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
5. Quan sát giá trị hiển thị tại các cột Số lượng, Thành tiền và Tổng tạm tính.
6. (API Verification):
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": ""}'
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": ""
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07:* "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$)."
- Khi người dùng xóa rỗng ô số lượng và click ra ngoài hoặc submit, hệ thống phải tự động phục hồi về 1 hoặc chặn submit với cảnh báo trường bắt buộc.
- API `POST /api/cart` phải từ chối `quantity: ""` với HTTP `400 Bad Request` (`{"error": "Quantity is required and cannot be empty"}`).
- Bảng giỏ hàng tuyệt đối không được hiển thị giá trị `NaN` hoặc `NaN ₫`.

**5. Kết quả thực tế (Actual Result):**
- Ô nhập số lượng cho phép submit chuỗi rỗng `""`. Hàm `parseInt("")` trả về `NaN`.
- Bảng giỏ hàng hiển thị các giá trị lỗi tính toán:
  - `Số lượng: NaN`
  - `Thành tiền: NaN ₫`
  - `Tổng tạm tính: NaN ₫`
- Endpoint `POST /api/cart` trả về HTTP `200 OK` cho cả chuỗi rỗng `""` và chuỗi khoảng trắng `"   "`.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp Web UI xóa trống ô số lượng:*  
  ![Ô số lượng xóa trống](./screenshots/BUG_FR07_07_input_empty.png)
- *Ảnh chụp bảng giỏ hàng tính ra NaN ₫:*  
  ![Bảng giỏ hàng hiển thị NaN ₫](./screenshots/BUG_FR07_07_cart_nan.png)
- *Ảnh chụp terminal API trả về 200 OK:*  
  ![API POST /api/cart với quantity rỗng trả về 200 OK](./screenshots/BUG_FR07_07_api_terminal.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/15](https://github.com/faker26052005-lgtm/SUT-EShop/issues/15)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/ProductDetail.jsx`, dòng 27: `addToCart(product, parseInt(quantity));`.
  - `backend/server.js`, dòng 290–295.
- **Khắc phục:**
  - Trong `ProductDetail.jsx`: Fallback về 1 nếu input là NaN:
    ```javascript
    const parsedQty = parseInt(quantity, 10);
    const validQty = isNaN(parsedQty) || parsedQty < 1 ? 1 : parsedQty;
    addToCart(product, validQty);
    ```
  - Trong `backend/server.js`: Bổ sung kiểm tra trường bắt buộc:
    ```javascript
    if (quantity === undefined || quantity === null || String(quantity).trim() === "") {
      return res.status(400).json({ error: "Quantity is required" });
    }
    ```


---

#### [BUG-FR07-08] Nhập số lượng thập phân (1.5) được chấp nhận, giao diện tự làm tròn xuống 1 và API trả về 200 OK

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-08` |
| **Tiêu đề Bug** | `[FR-07][Web UI / API] Decimal quantity (1.5) accepted without integer validation, silently truncated on UI and returning 200 OK on API` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Sai lệch dữ liệu số lượng, tự động cắt xén giá trị của người dùng mà không có thông báo/xác nhận) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_09`](Main_Report.md#tc_fr07_09) (Validate rejection of decimal quantity near lower boundary) |
| **GitHub Issue Link** | [Issue #16: [BUG] [FR-07][Web UI / API] Decimal quantity (1.5) accepted without integer validation, silently truncated on UI and returning 200 OK on API](https://github.com/faker26052005-lgtm/SUT-EShop/issues/16) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- CSDL SQLite có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Nhập số lượng thập phân `1.5` vào ô số lượng.
3. Bấm nút "Thêm vào giỏ hàng". Nút đổi sang trạng thái "Đã thêm".
4. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
5. Quan sát cột Số lượng của sản phẩm (bị âm thầm cắt bớt thành `1` mà không hề có bất kỳ cảnh báo nào).
6. (API Verification):
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": 1.5}'
   ```

**3. Dữ liệu thử nghiệm (Test Data):**
```json
{
  "id": 1,
  "price": 30000000,
  "quantity": 1.5
}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07:* "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$, $Q \in \mathbb{N}^*$)."
- Form chi tiết sản phẩm trên Web UI phải ràng buộc kiểu số nguyên (ví dụ dùng thuộc tính `step="1"`) hoặc chặn submit và hiển thị thông báo lỗi yêu cầu nhập số nguyên dương.
- Hệ thống tuyệt đối không được tự ý âm thầm cắt bớt phần thập phân làm thay đổi số lượng người dùng yêu cầu mà không thông báo.
- API `POST /api/cart` phải từ chối `quantity: 1.5` với HTTP `400 Bad Request` (`{"error": "Quantity must be a positive integer"}`).

**5. Kết quả thực tế (Actual Result):**
- Web UI cho phép nhập và gửi `1.5`, sau đó hàm `parseInt(quantity, 10)` âm thầm ép kiểu thành `1`, dẫn tới giỏ hàng chỉ có 1 sản phẩm.
- Endpoint `POST /api/cart` trả về HTTP `200 OK` cho `quantity: 1.5` mà không hề có bước validate số nguyên.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp Web UI nhập số lượng 1.5:*  
  ![Ô số lượng nhập 1.5](./screenshots/BUG_FR07_08_input_decimal.png)
- *Ảnh chụp giỏ hàng bị âm thầm cắt thành 1:*  
  ![Bảng giỏ hàng âm thầm cắt thành 1](./screenshots/BUG_FR07_08_cart_truncated.png)
- *Ảnh chụp terminal API trả về 200 OK:*  
  ![API POST /api/cart với quantity 1.5 trả về 200 OK](./screenshots/BUG_FR07_08_api_terminal.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/16](https://github.com/faker26052005-lgtm/SUT-EShop/issues/16)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/ProductDetail.jsx`: Thẻ `<input type="number">` thiếu thuộc tính `step="1"`, và gọi `parseInt(quantity)` làm mất phần thập phân thay vì báo lỗi.
  - `backend/server.js`: Chưa kiểm tra điều kiện `Number.isInteger(quantity)`.
- **Khắc phục:**
  - Trong `ProductDetail.jsx`: Thêm `step="1"` và kiểm tra hợp lệ:
    ```javascript
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      alert("Số lượng phải là số nguyên dương.");
      return;
    }
    ```
  - Trong `backend/server.js`:
    ```javascript
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```


---

#### [BUG-FR07-09] Endpoint POST /api/cart chấp nhận payload khuyết hoặc null trường quantity với HTTP 200 OK

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-09` |
| **Tiêu đề Bug** | `[FR-07][REST API] POST /api/cart accepts omitted or null quantity payload with 200 OK without required field validation` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Vi phạm ràng buộc API schema & toàn vẹn dữ liệu giỏ hàng) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_10`](Main_Report.md#tc_fr07_10) (Validate API rejection when quantity is omitted or null in payload) |
| **GitHub Issue Link** | [Issue #17: [BUG] [FR-07][REST API] POST /api/cart accepts omitted or null quantity payload with 200 OK without required field validation](https://github.com/faker26052005-lgtm/SUT-EShop/issues/17) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend đang chạy tại `http://localhost:3000`.
- Tài khoản người dùng có token xác thực JWT hợp lệ.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Lấy token xác thực người dùng qua API login:
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   ```
2. Gửi request `POST /api/cart` với trường `quantity: null`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000, "quantity": null}'
   ```
3. Gửi request `POST /api/cart` khuyết hoàn toàn trường `quantity`:
   ```bash
   curl -i -s -X POST http://localhost:3000/api/cart \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"id": 1, "price": 30000000}'
   ```
4. Quan sát HTTP response status và body trả về.
5. Gọi `GET /api/cart` để kiểm tra mảng giỏ hàng lưu trong bộ nhớ server.

**3. Dữ liệu thử nghiệm (Test Data):**
```json
// Payload A (quantity null)
{"id": 1, "price": 30000000, "quantity": null}

// Payload B (khuyết quantity)
{"id": 1, "price": 30000000}
```

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07:* "Số lượng là trường thông tin bắt buộc và phải là số nguyên dương ($Q \ge 1$)."
- Backend REST API `POST /api/cart` phải kiểm tra schema dữ liệu đầu vào và từ chối các request thiếu hoặc null trường số lượng với HTTP `400 Bad Request` kèm body lỗi (ví dụ: `{"error": "Quantity is required and must be a positive integer"}`).
- CSDL / Bộ nhớ giỏ hàng không được ghi nhận các item thiếu thông tin số lượng.

**5. Kết quả thực tế (Actual Result):**
- Endpoint `POST /api/cart` trả về HTTP `200 OK` (`{"message":"Added to cart"}`) cho cả hai payload trên.
- Mảng giỏ hàng lưu trực tiếp các đối tượng lỗi: `{"id":1,"price":30000000,"quantity":null}` và `{"id":1,"price":30000000}`.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp terminal API trả về 200 OK cho cả payload null và khuyết quantity:*  
  ![API POST /api/cart với quantity null và khuyết quantity trả về 200 OK](./screenshots/BUG_FR07_09_api_terminal.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/17](https://github.com/faker26052005-lgtm/SUT-EShop/issues/17)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `backend/server.js`, dòng 290–295: Endpoint `POST /api/cart` thực hiện đẩy thẳng `req.body` vào `userCarts[userId]` mà không có bước validate schema.
- **Khắc phục:**
  - Kiểm tra tính hợp lệ của trường `quantity` trước khi lưu vào giỏ hàng:
    ```javascript
    const { id, quantity } = req.body;
    if (quantity === undefined || quantity === null || String(quantity).trim() === "") {
      return res.status(400).json({ error: "Quantity is required" });
    }
    const numQty = Number(quantity);
    if (!Number.isInteger(numQty) || numQty < 1) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }
    ```


---

#### [BUG-FR07-10] Bảng giỏ hàng thiếu hoàn toàn nút +/- để điều chỉnh số lượng sản phẩm theo đặc tả

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-10` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Cart table lacks '+' and '-' interactive buttons to adjust product quantity as specified in SRS` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Thiếu tính năng tương tác cốt lõi trên giao diện giỏ hàng) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_13`](Main_Report.md#tc_fr07_13), [`TC_FR07_14`](Main_Report.md#tc_fr07_14) (Kiểm chứng nút '-' tại biên số lượng tối thiểu $Q=1$) |
| **GitHub Issue Link** | [Issue #18: [BUG] [FR-07][Web UI] Cart table lacks '+' and '-' interactive buttons to adjust product quantity as specified in SRS](https://github.com/faker26052005-lgtm/SUT-EShop/issues/18) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- Giỏ hàng có sản phẩm `iPhone 15 Pro Max` với số lượng $Q = 2$.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Nhập số lượng `2`, bấm "Thêm vào giỏ hàng".
3. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
4. Quan sát cột "Số lượng" trong bảng danh sách sản phẩm.
5. Tìm kiếm nút bấm tương tác `-` hoặc `+` để điều chỉnh giảm số lượng sản phẩm từ 2 xuống 1.

**3. Dữ liệu thử nghiệm (Test Data):**
- Sản phẩm: `iPhone 15 Pro Max` (ID 1)
- Số lượng hiện tại: `2`
- Thao tác kỳ vọng: Bấm nút `-` để giảm xuống `1`.

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 1):* "Giỏ hàng hiển thị danh sách sản phẩm gồm: Tên sản phẩm, Đơn giá, **Số lượng (có nút +/- để chỉnh)**, Thành tiền, và nút Xóa."
- Tại cột "Số lượng", giao diện phải cung cấp các nút bấm tương tác (nút `-`, số lượng hiển thị, nút `+`) cho phép người dùng thay đổi số lượng trực tiếp trong giỏ mà không cần quay lại trang chi tiết sản phẩm.
- Khi bấm nút `-`, số lượng giảm từ 2 xuống 1, thành tiền và tổng tạm tính cập nhật giảm tương ứng.

**5. Kết quả thực tế (Actual Result):**
- Cột "Số lượng" trong file `Cart.jsx` chỉ render text thuần: `<td>{item.quantity}</td>`.
- Hoàn toàn không có bất kỳ nút `-` hay `+` nào trên bảng giỏ hàng. Người dùng không thể điều chỉnh số lượng sản phẩm.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp bảng giỏ hàng chỉ có số lượng tĩnh, thiếu nút +/-:*  
  ![Cột Số lượng chỉ hiển thị text tĩnh không có nút +/-](./screenshots/BUG_FR07_10_missing_adjustment_buttons.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/18](https://github.com/faker26052005-lgtm/SUT-EShop/issues/18)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/Cart.jsx`, dòng 47: `<td>{item.quantity}</td>`.
  - `frontend-web/src/context/CartContext.jsx`: Chưa xây dựng hàm cập nhật số lượng (`updateQuantity`).
- **Khắc phục:**
  - Trong `CartContext.jsx`, bổ sung hàm cập nhật số lượng:
    ```javascript
    const updateQuantity = (index, delta) => {
      setCart((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
      );
    };
    ```
  - Trong `Cart.jsx`, thay thế dòng hiển thị số lượng bằng bộ điều khiển tương tác:
    ```jsx
    <td className="py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(index, -1)}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(index, 1)}
          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
        >
          +
        </button>
      </div>
    </td>
    ```


---

#### [BUG-FR07-11] Nút Xóa sản phẩm xóa trực tiếp không có dialog xác nhận theo yêu cầu SRS

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-11` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Delete product button executes immediate deletion without required confirmation dialog` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Major** (Vi phạm an toàn thao tác người dùng, nguy cơ mất dữ liệu giỏ hàng do click nhầm) |
| **Mức ưu tiên (Priority)**| **High (P1)** |
| **Test Case phát hiện** | [`TC_FR07_15`](Main_Report.md#tc_fr07_15), [`TC_FR07_16`](Main_Report.md#tc_fr07_16) (Xác thực hủy thao tác xóa qua dialog xác nhận) |
| **GitHub Issue Link** | [Issue #19: [BUG] [FR-07][Web UI] Delete product button executes immediate deletion without required confirmation dialog](https://github.com/faker26052005-lgtm/SUT-EShop/issues/19) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- Giỏ hàng có ít nhất 2 sản phẩm (ví dụ: `Samsung Galaxy S24 Ultra` và `MacBook Pro M3`).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/cart`.
2. Định vị sản phẩm đầu tiên trong bảng giỏ hàng.
3. Nhấn nút màu đỏ "Xóa".
4. Quan sát: Xem hệ thống có bật hộp thoại xác nhận (modal hoặc `window.confirm`) trước khi xóa không.

**3. Dữ liệu thử nghiệm (Test Data):**
- Sản phẩm: `Samsung Galaxy S24 Ultra` (28.000.000 ₫)
- Thao tác: Bấm nút "Xóa"

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 3):* "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."
- Khi người dùng nhấn nút "Xóa", hệ thống bắt buộc phải hiển thị một hộp thoại cảnh báo/xác nhận (ví dụ: *"Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"*).
- Chỉ khi người dùng bấm "OK / Xác nhận", sản phẩm mới bị xóa khỏi giỏ. Nếu bấm "Hủy", sản phẩm vẫn được giữ nguyên.

**5. Kết quả thực tế (Actual Result):**
- Nút "Xóa" gắn trực tiếp hàm `removeFromCart(index)`.
- Không hề có hộp thoại xác nhận nào xuất hiện; sản phẩm bị xóa biến mất ngay lập tức khi người dùng vừa click chuột. Bất kỳ click nhầm nào cũng sẽ xóa mất sản phẩm của khách hàng mà không có cơ hội hủy thao tác.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp giỏ hàng trước khi bấm Xóa (2 sản phẩm):*  
  ![Giỏ hàng có 2 sản phẩm](./screenshots/BUG_FR07_11_before_delete.png)
- *Ảnh chụp giỏ hàng ngay sau khi bấm Xóa (sản phẩm biến mất không qua xác nhận):*  
  ![Sản phẩm bị xóa tức thì không có dialog](./screenshots/BUG_FR07_11_after_delete_no_dialog.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/19](https://github.com/faker26052005-lgtm/SUT-EShop/issues/19)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/Cart.jsx`, dòng 50–55:
    ```jsx
    <button
      onClick={() => removeFromCart(index)}
      className="text-red-500 hover:text-red-700"
    >
      Xóa
    </button>
    ```
- **Khắc phục:**
  - Bổ sung hàm kiểm tra xác nhận trước khi gọi `removeFromCart`:
    ```jsx
    const handleDeleteItem = (index, itemName) => {
      if (window.confirm(`Bạn có chắc chắn muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
        removeFromCart(index);
      }
    };
    ```
    và gắn vào nút: `<button onClick={() => handleDeleteItem(index, item.name)} ...>`


---

#### [BUG-FR07-12] Giao diện giỏ hàng trống chỉ có text thuần, thiếu hình ảnh minh họa theo đặc tả

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-12` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Empty cart state lacks required illustration image/graphic specified in SRS FR-07` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Medium** (Thiếu thành phần đồ họa minh họa theo quy chuẩn thiết kế UI của SRS) |
| **Mức ưu tiên (Priority)**| **Medium (P2)** |
| **Test Case phát hiện** | [`TC_FR07_17`](Main_Report.md#tc_fr07_17) (Verify empty cart state display upon deleting last remaining item) |
| **GitHub Issue Link** | [Issue #20: [BUG] [FR-07][Web UI] Empty cart state lacks required illustration image/graphic specified in SRS FR-07](https://github.com/faker26052005-lgtm/SUT-EShop/issues/20) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- Giỏ hàng ở trạng thái rỗng ($Items = 0$).

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/cart`.
2. Nếu giỏ đang có hàng, xóa hết để đưa giỏ về rỗng.
3. Quan sát giao diện thông báo giỏ hàng trống trên màn hình.
4. Kiểm tra sự hiện diện của hình ảnh đồ họa hoặc vector SVG minh họa giỏ hàng rỗng.

**3. Dữ liệu thử nghiệm (Test Data):**
- Trạng thái giỏ hàng: $Items = 0$

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 6):* "Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng."
- Trang giỏ hàng trống phải hiển thị hình ảnh đồ họa hoặc icon minh họa (thẻ `<img>` hoặc SVG) trực quan bên cạnh thông báo chữ và đường dẫn tiếp tục mua sắm.

**5. Kết quả thực tế (Actual Result):**
- Trong `Cart.jsx`, component chỉ render 2 dòng chữ đơn giản (`<h2>` và `<Link>`) ở giữa khoảng trắng:
  ```jsx
  <div className="text-center mt-10">
    <h2 className="text-2xl mb-4">Giỏ hàng của bạn đang trống</h2>
    <Link to="/" className="text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
  </div>
  ```
- Hoàn toàn không có hình ảnh hoặc icon minh họa nào được render.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp giao diện giỏ hàng trống thiếu hình minh họa:*  
  ![Giỏ hàng trống thiếu hình ảnh minh họa](./screenshots/BUG_FR07_12_empty_cart_no_illustration.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/20](https://github.com/faker26052005-lgtm/SUT-EShop/issues/20)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/Cart.jsx`, dòng 20–27.
- **Khắc phục:**
  - Bổ sung tài nguyên ảnh minh họa và căn chỉnh giao diện:
    ```jsx
    if (cart.length === 0) {
      return (
        <div className="text-center mt-10 flex flex-col items-center">
          <img
            src="/empty-cart.svg"
            alt="Giỏ hàng trống"
            className="w-48 h-48 mb-4 opacity-75"
          />
          <h2 className="text-2xl mb-4 font-semibold text-gray-700">Giỏ hàng của bạn đang trống</h2>
          <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Tiếp tục mua sắm
          </Link>
        </div>
      );
    }
    ```


---

#### [BUG-FR07-13] Footer giỏ hàng hiển thị nhãn "Tổng tạm tính" thay vì "Tổng cộng" theo đặc tả

| Trường thông tin | Chi tiết |
| :--- | :--- |
| **Bug ID** | `BUG-FR07-13` |
| **Tiêu đề Bug** | `[FR-07][Web UI] Cart footer displays incorrect label "Tổng tạm tính" instead of required "Tổng cộng" as specified in SRS FR-07` |
| **Chức năng (Feature)** | FR-07: Giỏ hàng (Shopping Cart - Pool B) |
| **Môi trường thử nghiệm**| Web: `http://localhost:5173` • Backend: `http://localhost:3000` • Node v24.21 • Linux |
| **Mức độ (Severity)** | **Medium** (Sai lệch nhãn hiển thị theo quy định kiểm thử định danh SRS) |
| **Mức ưu tiên (Priority)**| **Medium (P2)** |
| **Test Case phát hiện** | [`TC_FR07_18`](Main_Report.md#tc_fr07_18) (Validate total amount UI label matches required "Tổng cộng" text) |
| **GitHub Issue Link** | [Issue #21: [BUG] [FR-07][Web UI] Cart footer displays incorrect label "Tổng tạm tính" instead of required "Tổng cộng" as specified in SRS FR-07](https://github.com/faker26052005-lgtm/SUT-EShop/issues/21) |
| **Người báo cáo** | Nguyễn Quốc Kỳ (23120138) |

**1. Tiền điều kiện (Preconditions):**
- SUT backend và frontend-web đang hoạt động bình thường.
- Giỏ hàng có ít nhất 1 sản phẩm.

**2. Các bước tái hiện (Steps to Reproduce):**
1. Mở trình duyệt, truy cập `http://localhost:5173/cart`.
2. Quan sát phần tổng kết thành tiền ở góc dưới bên trái của bảng giỏ hàng.
3. Đọc nhãn văn bản đi kèm số tiền tổng.

**3. Dữ liệu thử nghiệm (Test Data):**
- Nhãn hiển thị tổng tiền tại footer giỏ hàng

**4. Kết quả mong đợi (Expected Result theo SRS FR-07):**
> *Trích dẫn SRS FR-07 (Mục 5):* "Tổng tiền hiển thị nhãn chính xác: **'Tổng cộng' (không phải 'Tổng tạm tính')**."
- Nhãn văn bản hiển thị phải là `"Tổng cộng"` hoặc `"Tổng cộng:"`.
- Tuyệt đối không hiển thị `"Tổng tạm tính"` hay `"Subtotal"`.

**5. Kết quả thực tế (Actual Result):**
- Giao diện giỏ hàng trong `Cart.jsx` render dòng chữ hardcode:
  ```jsx
  <div className="text-xl font-bold">
    Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
  </div>
  ```
- Nhãn hiển thị thực tế là `"Tổng tạm tính:"`, vi phạm trực diện điều cấm của đặc tả SRS FR-07.

**6. Bằng chứng kiểm thử (Screenshots & Logs):**
- *Ảnh chụp nhãn hiển thị sai thành Tổng tạm tính:*  
  ![Nhãn hiển thị sai thành Tổng tạm tính](./screenshots/BUG_FR07_13_wrong_label.png)
- *Đường dẫn GitHub Issue:* [https://github.com/faker26052005-lgtm/SUT-EShop/issues/21](https://github.com/faker26052005-lgtm/SUT-EShop/issues/21)

**7. Phân tích nguyên nhân & Khắc phục (Root Cause Analysis):**
- **Vị trí lỗi:**
  - `frontend-web/src/pages/Cart.jsx`, dòng 63.
- **Khắc phục:**
  - Đổi chuỗi text thành `"Tổng cộng:"`:
    ```jsx
    <div className="text-xl font-bold">
      Tổng cộng: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
    </div>
    ```

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
