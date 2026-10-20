# BÁO CÁO KIỂM THỬ: FEATURE B — FR-09: ÁP DỤNG MÃ GIẢM GIÁ (DISCOUNT COUPONS)

* **Phân hệ (Pool):** Pool B — Shopping Cart and Checkout
* **Chức năng:** FR-09: Mã giảm giá (Discount coupons)
* **Nền tảng kiểm thử:** Web Client (`http://localhost:5173/checkout`) & Backend API (`http://localhost:3000/api/apply-coupon`)
* **Tiêu chuẩn học thuật áp dụng:**
  * **Slide S04:** Domain Testing & Boundary Value Analysis (BVA)
  * **Slide S07:** Test Case Essentials, Objective Syntax (`Action + Function + Operating Condition`) & Template 6 cột
  * **Slide S08:** Bug Report 10 Essentials & Test Summary Report 3-table Statistics

---

## 1. Cơ sở Đặc tả Nghiệp vụ (SRS Baseline)

Trích xuất trực tiếp từ tài liệu đặc tả [specs/system_requirements_specification.md](file:///c:/Coding/SoftwareTesting/Seminar/src/eshop-sut/specs/system_requirements_specification.md) (Mục 4 - FR-09):

Tại bước Checkout, người dùng có thể nhập mã giảm giá. Hệ thống áp dụng giảm giá dựa trên **5 điều kiện** sau, tất cả phải thỏa mãn đồng thời:

| # | Tên điều kiện | Ràng buộc nghiệp vụ theo đặc tả |
|:---:|:---|:---|
| **C1** | **Mã tồn tại & Active** | Mã phải có trong CSDL và đang hoạt động (`is_active = 1`). Không được để trống. |
| **C2** | **Còn hạn sử dụng** | Ngày hiện tại phải trước ngày hết hạn (`now < expired_at`). |
| **C3** | **Đủ ngưỡng đơn hàng** | Tổng giá trị đơn hàng **>= (lớn hơn hoặc bằng)** `min_order_amount`. |
| **C4** | **Đã đăng nhập** | Người dùng phải có JWT Token hợp lệ khi thực hiện áp dụng mã. |
| **C5** | **Chưa dùng hết lượt** | Số lần đã dùng mã này của user < `max_uses_per_user` (kiểm tra trong bảng `coupon_usage`). |

### Công thức tính giảm giá theo đặc tả:
* Loại phần trăm (`percent`): $\text{discount\_amount} = \text{total} \times \frac{\text{discount\_value}}{100}$
* Loại số tiền cố định (`fixed`): $\text{discount\_amount} = \text{discount\_value}$
* Số tiền thanh toán cuối cùng: $\text{final\_amount} = \text{total} - \text{discount\_amount}$

### Danh mục mã giảm giá mẫu trong CSDL (Database Seeds):
| Mã Coupon | Loại giảm giá | Giá trị | Ngưỡng tối thiểu (`min_order_amount`) | Hạn dùng (`expired_at`) | Giới hạn (`max_uses_per_user`) |
|:---|:---|:---|:---:|:---:|:---:|
| `SAVE10` | `percent` | 10% | 300,000 ₫ | 2099-12-31 | 1 lần/user |
| `BIGBUY` | `fixed` | 50,000 ₫ | 500,000 ₫ | 2099-12-31 | 1 lần/user |
| `VIP100` | `fixed` | 100,000 ₫ | 300,000 ₫ | 2099-12-31 | 2 lần/user |
| `EXPIRED` | `percent` | 20% | 100,000 ₫ | 2020-01-01 (Đã hết hạn) | 1 lần/user |

---

## 2. Phần A: Domain Testing (Kiểm thử miền)

### Bước 1: Xác định biến đầu vào & đầu ra (Inputs & Outputs)
Áp dụng Nguyên tắc Bước 1 (Slide S04):

| STT | Tên biến | Kiểu dữ liệu | Bắt buộc | Ràng buộc nghiệp vụ (Constraints) |
|:---:|:---|:---|:---:|:---|
| **1** | `code` (Mã giảm giá) | String | Có | Không rỗng; không khoảng trắng; tồn tại trong bảng `coupons`; `is_active = 1`. |
| **2** | `total_amount` (Tổng tiền) | Number (VND) | Có | Phải là số dương; phải $\ge \text{min\_order\_amount}$ của mã coupon đang áp dụng. |
| **3** | `auth_token` / `JWT` | String (Header) | Có | Token hợp lệ của user đang đăng nhập (Điều kiện C4). |
| **4** | `user_id` | Integer | Có | Trích xuất từ JWT; định danh người dùng đối chiếu bảng `coupon_usage`. |
| **5** | `expired_at` (Trạng thái hạn) | DateTime | Có | Thuộc tính của mã; ngày hiện tại phải $<$ `expired_at` (Điều kiện C2). |
| **6** | `usage_count` (Lượt đã dùng) | Integer | Có | Đếm từ `coupon_usage`; phải $<$ `max_uses_per_user` (Điều kiện C5). |
| **Out 1** | `discount_amount` | Number (VND) | - | Số tiền được giảm, tính chính xác theo loại `fixed` hoặc `percent`. |
| **Out 2** | `final_amount` | Number (VND) | - | Tổng tiền sau giảm (`total_amount - discount_amount`). |
| **Out 3** | Thông báo thành công | String / UI | - | Hiển thị thông báo thành công và số tiền tiết kiệm. |
| **Out 4** | Thông báo lỗi | String / HTTP 4xx | - | Hiển thị thông báo từ chối tương ứng khi vi phạm bất kỳ điều kiện nào (C1–C5). |

---

### Bước 2: Phân chia các lớp tương đương (Equivalence Partitioning)

#### 2.1. Biến `code` (Mã giảm giá)
* **EC-CODE-V1 (Valid):** Mã hợp lệ, tồn tại và đang active (`"BIGBUY"`).
* **EC-CODE-I1 (Invalid):** Mã rỗng `""`.
* **EC-CODE-I2 (Invalid):** Mã chỉ chứa khoảng trắng `"   "`.
* **EC-CODE-I3 (Invalid):** Mã không tồn tại trong hệ thống (`"NONEXISTENT"`).
* **EC-CODE-I4 (Invalid):** Mã tồn tại nhưng đã bị vô hiệu hóa (`is_active = 0`).
* **EC-CODE-I5 (Invalid - Format):** Mã viết thường (`"bigbuy"`) gửi trực tiếp tới API.
* **EC-CODE-I6 (Invalid - Security):** Mã chứa mã độc SQL Injection (`"' OR '1'='1"`).
* **EC-CODE-I7 (Invalid - Security):** Mã chứa script XSS (`"<script>alert(1)</script>"`).

#### 2.2. Biến `total_amount` (Tổng tiền đơn hàng đối với mã BIGBUY có min = 500,000 ₫)
* **EC-TOTAL-V1 (Valid Nominal):** Lớn hơn ngưỡng tối thiểu (`600,000 ₫`).
* **EC-TOTAL-V2 (Valid Boundary):** Đúng bằng ngưỡng tối thiểu (`500,000 ₫`).
* **EC-TOTAL-I1 (Invalid):** Nhỏ hơn ngưỡng tối thiểu (`400,000 ₫`).
* **EC-TOTAL-I2 (Invalid):** Bằng 0 (`0 ₫`).
* **EC-TOTAL-I3 (Invalid):** Giá trị âm (`-100 ₫`).

#### 2.3. Biến `auth_token` & `user_id` (Điều kiện C4 & Xác thực người dùng)
* **EC-AUTH-V1 (Valid):** Người dùng đã đăng nhập với JWT token hợp lệ của tài khoản (`user_id = 2`).
* **EC-AUTH-I1 (Invalid):** Khách vãng lai chưa đăng nhập (không gửi Token / `user_id = null`).
* **EC-AUTH-I2 (Invalid - Security):** Token JWT hết hạn hoặc chữ ký không hợp lệ.
* **EC-AUTH-I3 (Invalid - Security):** Client gửi `user_id` giả mạo trong request body khác với payload trong JWT (ID Spoofing).

#### 2.4. Biến `expired_at` (Hạn sử dụng - Điều kiện C2)
* **EC-EXP-V1 (Valid):** Mã còn hạn sử dụng (`2099-12-31`).
* **EC-EXP-I1 (Invalid):** Mã đã quá hạn sử dụng (`2020-01-01` — Mã `EXPIRED`).

#### 2.5. Biến `usage_count` (Số lượt sử dụng - Điều kiện C5)
* **EC-USE-V1 (Valid):** Chưa sử dụng lần nào (`usage_count = 0`).
* **EC-USE-V2 (Valid):** Đã dùng nhưng chưa hết lượt (`VIP100` max 2 lần, đã dùng 1 lần).
* **EC-USE-I1 (Invalid):** Đã dùng hết số lượt cho phép (`BIGBUY` max 1 lần, đã dùng 1 lần).

#### 2.6. Biến `type` & Công thức tính giảm giá
* **EC-TYPE-V1 (Valid Fixed):** Loại `fixed` (`BIGBUY` giảm 50,000 ₫).
* **EC-TYPE-V2 (Valid Percent):** Loại `percent` (`SAVE10` giảm 10%).

---

### Bước 3: Thiết kế Test Case & Thiết Lập Bộ Chuẩn Cô Lập Lỗi (Single Fault Assumption)

> [!IMPORTANT]
> **Bộ Giá Trị Chuẩn Cô Lập Lỗi (Golden Positive Baseline Input):**
> * **Mã Coupon:** `"BIGBUY"` *(Loại fixed 50,000 ₫; ngưỡng tối thiểu: 500,000 ₫; còn hạn 2099; chưa dùng)*.
> * **Tổng tiền đơn hàng:** `600,000 ₫` *(Lớn hơn ngưỡng 500,000 ₫ để thỏa mãn điều kiện C3)*.
> * **Tài khoản đăng nhập:** `test@eshop.com` / `Test1234!` *(User ID: 2, có JWT token hợp lệ)*.
> * **Số lần đã dùng:** `0` *(Chưa từng dùng mã `BIGBUY`)*.
> 
> **Kỹ thuật Workaround & Cô lập lỗi trên SUT:**
> * SUT dính lỗi nghiêm trọng tại mã giảm giá theo phần trăm `SAVE10` (`BUG-FR09-01`: code dùng công thức `total * (1 - discount_value)` làm giá tăng gấp 10 lần).
> * Do đó, khi kiểm thử các điều kiện khác (C1, C2, C3, C4, C5), Tester cố định sử dụng mã `BIGBUY` (loại `fixed`) làm Baseline để **cô lập nguyên nhân gây lỗi**, tránh bị hiện tượng lỗi che giấu lỗi (*Error Masking*).

---

### Bước 4: Tinh gọn & Loại bỏ dư thừa (Domain Reduction Table)

| STT | Cặp kiểm thử xem xét | Hành vi hệ thống | Quyết định tinh gọn | Lý do kỹ thuật |
|:---:|:---|:---|:---:|:---|
| 1 | Mã `""` vs Mã `"   "` | Đều không có ký tự hợp lệ | **Giữ cả 2** | `""` kiểm tra validation rỗng; `"   "` kiểm tra hàm `trim()`. |
| 2 | SQL Injection vs XSS | Xử lý chuỗi mã coupon | **Giữ cả 2** | Kiểm tra 2 lỗ hổng bảo mật độc lập (SQLite Injection vs UI Injection). |
| 3 | Khách chưa đăng nhập vs Token giả | Vi phạm C4 | **Giữ cả 2** | Phân biệt luồng Guest bình thường và luồng tấn công cố tình giả mạo JWT. |

---

## 3. Phần B: Phân Tích Giá Trị Biên (Boundary Value Analysis - BVA)

Áp dụng phân tích giá trị biên cho 3 biến cốt lõi:

### 3.1. Phân tích biên biến `total_amount` (Ngưỡng tối thiểu của mã `BIGBUY` là 500,000 ₫)
* **$Min - 1$:** `499,999 ₫` $\rightarrow$ Kỳ vọng: Từ chối áp dụng (thiếu 1 đồng).
* **$Min$ (Điểm biên quyết định):** `500,000 ₫` $\rightarrow$ Kỳ vọng: **Chấp nhận áp dụng** (giảm 50,000 ₫, còn 450,000 ₫).
* **$Min + 1$:** `500,001 ₫` $\rightarrow$ Kỳ vọng: Chấp nhận áp dụng.
* **$Nominal$:** `600,000 ₫` $\rightarrow$ Kỳ vọng: Chấp nhận áp dụng (Baseline).
* **$Extreme Upper$:** `1,000,000,000 ₫` (1 tỷ đồng) $\rightarrow$ Kỳ vọng: Hệ thống tính toán an toàn, không tràn số.
* **$Zero$:** `0 ₫` $\rightarrow$ Kỳ vọng: Báo lỗi đơn hàng rỗng/không hợp lệ.
* **$Negative$:** `-100 ₫` $\rightarrow$ Kỳ vọng: Báo lỗi số tiền không hợp lệ.

### 3.2. Phân tích biên biến `usage_count` (Giới hạn của mã `VIP100` là max 2 lần/user)
* **Biên Min ($0$ lần đã dùng):** Thực hiện áp dụng lần 1 $\rightarrow$ Kỳ vọng: Thành công (1/2).
* **Biên trong ($1$ lần đã dùng):** Thực hiện áp dụng lần 2 $\rightarrow$ Kỳ vọng: Thành công (2/2).
* **Điểm biên chạm ngưỡng ($2$ lần đã dùng):** Thực hiện áp dụng lần 3 $\rightarrow$ Kỳ vọng: Từ chối với thông báo đã đạt giới hạn 2 lần.
* **Biên ngoài ($3$ lần đã dùng):** Thực hiện áp dụng lần 4 $\rightarrow$ Kỳ vọng: Từ chối.

### 3.3. Phân tích biên biến thời gian `expired_at`
* **Trước hạn:** Ngày `2099-12-31` $\rightarrow$ Hợp lệ.
* **Sau hạn:** Ngày `2020-01-01` (Mã `EXPIRED`) $\rightarrow$ Từ chối báo hết hạn.

---

## 4. Phần C: Thiết Kế & Thực Thi Bộ Test Case Chuẩn Hóa (Theo Mẫu Slide S07)

### Bảng Thực Thi Test Case Chuẩn Hóa (Mẫu 6 cột Slide S07 Slide 8):

| TC ID | Description (Test Objective)<br>*(Syntax: Action + Function + Operating Condition)* | Pre-conditions & Test Steps | Expected Result | Observed / Actual Result | Status |
|:---|:---|:---|:---|:---|:---:|
| **TC-FR09-D01** | **Verify Coupon Application with Valid Fixed Coupon (SRS Baseline)** | **Pre-condition:** SUT sẵn sàng, CSDL reset sạch, User `test@eshop.com` đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Mở `/checkout`. 2. Nhập mã `'BIGBUY'`. 3. Bấm 'Áp dụng'. | Áp dụng thành công; Giảm 50,000 ₫; Thành tiền: 550,000 ₫. | **PASSED.** Hệ thống trả về `success: true`, `discount_amount: 50000`, `final_amount: 550000`. | **PASSED** |
| **TC-FR09-D02** | **Verify Coupon Application with Valid Percentage Coupon (SAVE10)** | **Pre-condition:** CSDL reset sạch, User đã đăng nhập.<br>**Test Data:** Code: `'SAVE10'`, Total: `400000`, User ID: `2`.<br>**Steps:** 1. Mở `/checkout`. 2. Nhập mã `'SAVE10'`. 3. Bấm 'Áp dụng'. | Áp dụng thành công; Giảm 10% (40,000 ₫); Thành tiền: 360,000 ₫. | **FAILED.** SUT tính toán sai nghiêm trọng: `discount_amount: -3600000`, `final_amount: 4000000` (giá tăng gấp 10 lần do code dùng `total * (1 - 10)` tại `server.js:406`) (`BUG-FR09-01`). | **FAILED** |
| **TC-FR09-D03** | **Test Coupon Application with Empty Code** | **Pre-condition:** User đã đăng nhập, Total: `600000`.<br>**Test Data:** Code: `''`.<br>**Steps:** 1. Mở `/checkout`. 2. Để trống ô mã. 3. Quan sát nút và bấm Áp dụng. | Nút Áp dụng bị disable; API từ chối với HTTP 400. | **PASSED.** Nút bấm bị vô hiệu hóa; nếu gọi API trực tiếp trả về HTTP 400: `"Vui lòng nhập mã giảm giá"`. | **PASSED** |
| **TC-FR09-D04** | **Test Coupon Application with Whitespace-only Code** | **Pre-condition:** User đã đăng nhập, Total: `600000`.<br>**Test Data:** Code: `'   '`.<br>**Steps:** 1. Mở `/checkout`. 2. Nhập toàn khoảng trắng. 3. Bấm Áp dụng. | Từ chối; báo lỗi mã không hợp lệ. | **PASSED.** Frontend disable nút; Backend trả về HTTP 404 `"Mã giảm giá không tồn tại..."`. | **PASSED** |
| **TC-FR09-D05** | **Test Coupon Application with Non-existent Code** | **Pre-condition:** User đã đăng nhập, Total: `600000`.<br>**Test Data:** Code: `'NONEXISTENT'`.<br>**Steps:** 1. Nhập mã `'NONEXISTENT'`. 2. Bấm Áp dụng. | Báo lỗi: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" (HTTP 404). | **PASSED.** Backend trả về HTTP 404 kèm thông báo lỗi chính xác. | **PASSED** |
| **TC-FR09-D06** | **Test Coupon Application with Inactive Code (is_active = 0)** | **Pre-condition:** CSDL có mã `INACTIVE` với `is_active = 0`.<br>**Test Data:** Code: `'INACTIVE'`, Total: `600000`.<br>**Steps:** 1. Nhập mã `'INACTIVE'`. 2. Bấm Áp dụng. | Báo lỗi mã không tồn tại hoặc bị vô hiệu hóa. | **PASSED.** Câu truy vấn SQL lọc `is_active = 1`, trả về HTTP 404. | **PASSED** |
| **TC-FR09-D07** | **Validate Coupon Application with Expired Coupon (EXPIRED - C2)** | **Pre-condition:** User đã đăng nhập, Total: `200000`.<br>**Test Data:** Code: `'EXPIRED'`, Total: `200000`, User ID: `2`.<br>**Steps:** 1. Nhập mã `'EXPIRED'`. 2. Bấm Áp dụng. | Báo lỗi: "Mã giảm giá đã hết hạn" (HTTP 400). | **PASSED.** Backend so sánh `expiry < now` và trả về HTTP 400: `"Mã giảm giá đã hết hạn"`. | **PASSED** |
| **TC-FR09-D08** | **Validate Coupon Application with Total Below Minimum Order (C3)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'` (min 500k), Total: `400000`.<br>**Steps:** 1. Nhập total 400k. 2. Nhập mã `'BIGBUY'`. 3. Bấm Áp dụng. | Báo lỗi đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ (HTTP 400). | **PASSED.** Backend từ chối với HTTP 400: `"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫..."`. | **PASSED** |
| **TC-FR09-D09** | **Validate Coupon Application with Unauthenticated Guest User (C4)** | **Pre-condition:** Khách chưa đăng nhập (không có JWT Token).<br>**Test Data:** Code: `'BIGBUY'`, Total: `600000`, User ID: `null`.<br>**Steps:** 1. Chưa đăng nhập, vào checkout. 2. Nhập mã `'BIGBUY'`. 3. Bấm Áp dụng. | Báo lỗi yêu cầu đăng nhập (HTTP 401 Unauthorized) theo điều kiện C4. | **FAILED.** SUT cho phép khách vãng lai áp dụng mã thành công (`success: true`) mà không hề kiểm tra JWT token (`BUG-FR09-03`). | **FAILED** |
| **TC-FR09-D10** | **Validate Usage Limit on Single-use Coupon on Second Attempt (C5)** | **Pre-condition:** User đã sử dụng mã `BIGBUY` 1 lần.<br>**Test Data:** Code: `'BIGBUY'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng lại mã `'BIGBUY'`. 2. Bấm Áp dụng. | Báo lỗi: Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn) (HTTP 400). | **PASSED.** Backend đếm `usage_count >= 1` trong bảng `coupon_usage` và chặn với HTTP 400. | **PASSED** |
| **TC-FR09-D11** | **Validate Usage Limit on Multi-use Coupon on Third Attempt (VIP100 - C5)** | **Pre-condition:** User đã sử dụng mã `VIP100` 2 lần.<br>**Test Data:** Code: `'VIP100'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng lần thứ 3 mã `'VIP100'`. 2. Bấm Áp dụng. | Báo lỗi: Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn) (HTTP 400). | **PASSED.** Backend từ chối chính xác khi số lượt dùng đạt mức trần `max_uses_per_user = 2`. | **PASSED** |
| **TC-FR09-D12** | **Test Coupon Application with Lowercase Code 'bigbuy' via API** | **Pre-condition:** User đã đăng nhập, Total: `600000`.<br>**Test Data:** Code: `'bigbuy'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Gửi request API với code chữ thường. | Hệ thống chấp nhận không phân biệt hoa thường hoặc chuẩn hóa tự động. | **FAILED.** Backend truy vấn `WHERE code = ?` phân biệt hoa thường, từ chối mã hợp lệ bằng HTTP 404 (`BUG-FR09-07`). | **FAILED** |
| **TC-FR09-D13** | **Validate Coupon Security against SQL Injection Payload** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Code: `"' OR '1'='1"`, Total: `600000`.<br>**Steps:** 1. Nhập payload SQLi vào ô mã. 2. Bấm Áp dụng. | Hệ thống xử lý an toàn; báo mã không tồn tại. | **PASSED.** Backend sử dụng parameterized query `[code]`, trả về HTTP 404 an toàn. | **PASSED** |
| **TC-FR09-D14** | **Validate Coupon Security against Stored/Reflected XSS in Code** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Code: `"<script>alert(1)</script>"`, Total: `600000`.<br>**Steps:** 1. Nhập payload XSS. 2. Bấm Áp dụng. | Mã độc không thực thi; hiển thị thông báo an toàn. | **PASSED.** Giao diện React escape chuỗi tự động; Backend trả về 404 an toàn. | **PASSED** |
| **TC-FR09-D15** | **Validate Security against User ID Spoofing in API Body** | **Pre-condition:** User ID `2` đang đăng nhập với JWT token của mình.<br>**Test Data:** Gửi request body với `user_id: 999` (ID giả mạo).<br>**Steps:** 1. Gọi `POST /api/apply-coupon` với `user_id: 999`. | Backend từ chối hoặc chỉ lấy ID từ JWT token; không tin tưởng body client. | **FAILED.** Backend nhận trực tiếp `user_id` từ request body (`req.body.user_id`), cho phép bypass giới hạn lượt dùng bằng ID giả (`BUG-FR09-04`). | **FAILED** |
| **TC-FR09-D16** | **Verify Coupon Usage Recording Transaction Atomicity** | **Pre-condition:** Áp dụng mã `BIGBUY` thành công trên giỏ hàng.<br>**Test Data:** Code: `'BIGBUY'`, Checkout cart.<br>**Steps:** 1. Submit checkout `/api/checkout`. 2. Chặn request `/api/coupon-usage`. | Ghi nhận lượt dùng coupon phải nằm trong cùng 1 transaction đặt hàng tại backend. | **FAILED.** Frontend gọi 2 API rời rạc; nếu client ngắt kết nối sau bước 1, đơn hàng tạo thành công nhưng coupon không bị trừ lượt dùng (`BUG-FR09-06`). | **FAILED** |
| **TC-FR09-D17** | **Validate System Integrity when Discount Exceeds Order Total** | **Pre-condition:** SUT có mã giảm fixed 100,000 ₫.<br>**Test Data:** Total: `80000`, Discount: `100000`.<br>**Steps:** 1. Áp dụng mã có discount > total. | `final_amount` được chặn ở mức tối thiểu 0 ₫. | **FAILED.** Code tính `total_amount - discount_amount` không dùng `Math.max(0, ...)`, dẫn đến tổng tiền thanh toán bị âm (`-20,000 ₫`) (`BUG-FR09-08`). | **FAILED** |
| **TC-FR09-D18** | **Verify Checkout UI Integrity against Direct Total Amount Editing** | **Pre-condition:** Mở trang Checkout `/checkout`.<br>**Test Data:** Sản phẩm trong giỏ: 2 sản phẩm tổng 300,000 ₫.<br>**Steps:** 1. Quan sát trường "Tổng tiền thanh toán". 2. Thử gõ trực tiếp số khác. | Ô tổng tiền phải là read-only theo đặc tả FR-08 (line 105 & 107). | **FAILED.** Form hiển thị `<input type="number">` cho phép người dùng tự do chỉnh sửa tổng tiền thanh toán theo ý muốn trước khi áp coupon (`BUG-FR09-05`). | **FAILED** |
| **TC-FR09-B01** | **Verify Total Amount at Boundary - 1 (499,999 ₫ for BIGBUY)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `499999`, User ID: `2`.<br>**Steps:** 1. Nhập total `499999`. 2. Áp dụng mã. | Báo lỗi đơn hàng chưa đủ 500,000 ₫ (HTTP 400). | **PASSED.** Hệ thống từ chối chính xác với HTTP 400. | **PASSED** |
| **TC-FR09-B02** | **Verify Total Amount at Minimum Boundary (500,000 ₫ - Spec Min)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `500000`, User ID: `2`.<br>**Steps:** 1. Nhập total đúng `500000`. 2. Áp dụng mã. | Áp dụng thành công; Giảm 50,000 ₫; Còn 450,000 ₫ (theo C3: $\ge \text{min}$). | **FAILED.** SUT dùng toán tử `total_amount > coupon.min_order_amount` (dấu `>`), từ chối sai đơn hàng 500,000 ₫ bằng thông báo "chưa đủ giá trị tối thiểu 500,000 ₫" (`BUG-FR09-02`). | **FAILED** |
| **TC-FR09-B03** | **Verify Total Amount at Boundary + 1 (500,001 ₫ for BIGBUY)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `500001`, User ID: `2`.<br>**Steps:** 1. Nhập total `500001`. 2. Áp dụng mã. | Áp dụng thành công; Giảm 50,000 ₫; Còn 450,001 ₫. | **PASSED.** Hệ thống chấp nhận thành công do $500,001 > 500,000$. | **PASSED** |
| **TC-FR09-B04** | **Verify Total Amount at Nominal (600,000 ₫ for BIGBUY)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Nhập total `600000`. 2. Áp dụng mã. | Áp dụng thành công; Giảm 50,000 ₫; Còn 550,000 ₫. | **PASSED.** Hệ thống chấp nhận và tính toán chính xác. | **PASSED** |
| **TC-FR09-B05** | **Validate Total Amount Robustness at Extreme Upper Boundary (1,000,000,000 ₫)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `1000000000`, User ID: `2`.<br>**Steps:** 1. Nhập total 1 tỷ đồng. 2. Áp dụng mã. | Áp dụng thành công, không tràn số; Thành tiền: 999,950,000 ₫. | **PASSED.** Hệ thống tiếp nhận an toàn, không bị tràn số nguyên. | **PASSED** |
| **TC-FR09-B06** | **Verify Total Amount at Zero (0 ₫)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `0`, User ID: `2`.<br>**Steps:** 1. Nhập total `0`. 2. Áp dụng mã. | Báo lỗi đơn hàng chưa đủ giá trị tối thiểu (HTTP 400). | **PASSED.** Bị chặn chính xác với HTTP 400. | **PASSED** |
| **TC-FR09-B07** | **Verify Total Amount at Negative Value (-100 ₫)** | **Pre-condition:** User đã đăng nhập.<br>**Test Data:** Code: `'BIGBUY'`, Total: `-100`, User ID: `2`.<br>**Steps:** 1. Nhập total `-100`. 2. Áp dụng mã. | Báo lỗi số tiền đơn hàng không hợp lệ (HTTP 400). | **PASSED.** Bị chặn với HTTP 400 do không thỏa ngưỡng tối thiểu. | **PASSED** |
| **TC-FR09-B08** | **Verify Usage Count Boundary at Lower Bound (0 used - 1st use of VIP100)** | **Pre-condition:** User ID `2` chưa từng dùng mã `VIP100`.<br>**Test Data:** Code: `'VIP100'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng mã lần đầu. | Áp dụng thành công; Giảm 100,000 ₫; Còn 500,000 ₫. | **PASSED.** Hệ thống cho phép sử dụng lần 1 thành công. | **PASSED** |
| **TC-FR09-B09** | **Verify Usage Count Inside Boundary (1 used - 2nd use of VIP100)** | **Pre-condition:** User ID `2` đã dùng mã `VIP100` 1 lần.<br>**Test Data:** Code: `'VIP100'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng mã lần 2. | Áp dụng thành công; Giảm 100,000 ₫; Còn 500,000 ₫. | **PASSED.** Hệ thống cho phép sử dụng lần 2 thành công. | **PASSED** |
| **TC-FR09-B10** | **Verify Usage Count Boundary at Limit (2 used - 3rd use of VIP100)** | **Pre-condition:** User ID `2` đã dùng mã `VIP100` đủ 2 lần.<br>**Test Data:** Code: `'VIP100'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng mã lần 3. | Báo lỗi: Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn) (HTTP 400). | **PASSED.** Hệ thống đối chiếu `usage_count >= 2`, từ chối chính xác với HTTP 400. | **PASSED** |
| **TC-FR09-B11** | **Verify Usage Count Boundary Beyond Limit (3 used - 4th use of VIP100)** | **Pre-condition:** User ID `2` đã dùng mã `VIP100` 3 lần (cố tình inject).<br>**Test Data:** Code: `'VIP100'`, Total: `600000`, User ID: `2`.<br>**Steps:** 1. Áp dụng mã lần 4. | Từ chối với HTTP 400. | **PASSED.** Hệ thống từ chối chính xác với HTTP 400. | **PASSED** |
| **TC-FR09-B12** | **Verify Expiry Date Boundary for Valid Date (2099-12-31)** | **Pre-condition:** User đã đăng nhập, Total: `600000`.<br>**Test Data:** Code: `'BIGBUY'`, Hạn: `2099-12-31`.<br>**Steps:** 1. Áp dụng mã. | Áp dụng thành công do ngày hiện tại < 2099. | **PASSED.** Hệ thống xác nhận mã còn hạn thành công. | **PASSED** |
| **TC-FR09-B13** | **Verify Expiry Date Boundary for Past Date (2020-01-01 - EXPIRED)** | **Pre-condition:** User đã đăng nhập, Total: `200000`.<br>**Test Data:** Code: `'EXPIRED'`, Hạn: `2020-01-01`.<br>**Steps:** 1. Áp dụng mã `'EXPIRED'`. | Báo lỗi: "Mã giảm giá đã hết hạn" (HTTP 400). | **PASSED.** Hệ thống phát hiện quá hạn và từ chối chính xác. | **PASSED** |

---

## 5. Phần D: Phân Tích Khoảng Trống Của AI (AI Gap Analysis)

Khi sử dụng các công cụ AI thông thường (ChatGPT/Claude/Copilot) chỉ với prompt sơ sài *"viết test case cho mã giảm giá EShop"*, AI thường bỏ sót các lỗi nghiêm trọng sau:

1. **Bỏ sót lỗi sai công thức tính toán phần trăm trong code (`BUG-FR09-01`):**
   * *Thực tế:* File `server.js` dòng 406 tính: `total_amount * (1 - coupon.discount_value)`. Với `discount_value = 10`, công thức trở thành nhân với $-9$, biến giảm giá thành tăng giá gấp 10 lần. AI thông thường mặc định code tính đúng công thức toán và chỉ viết test case lý thuyết.
2. **Bỏ sót lỗi lệch dấu toán tử so sánh biên (`BUG-FR09-02`):**
   * *Thực tế:* File `server.js` dòng 385 dùng toán tử `>` (`total_amount > min_order_amount`) thay vì `>=`. Đơn hàng có giá trị đúng 500,000 ₫ bị từ chối sai lệch. Nếu không chạy Boundary Value Analysis tại chính xác điểm $Min$, tester sẽ không phát hiện ra.
3. **Bỏ sót lỗ hổng xác thực & Spoofing ID (Security Defect `BUG-FR09-03` & `BUG-FR09-04`):**
   * *Thực tế:* API `/api/apply-coupon` là public, nhận `user_id` từ request body thay vì trích xuất từ JWT token xác thực (vi phạm C4). Kẻ gian có thể giả mạo `user_id` khác để qua mặt giới hạn số lần sử dụng.
4. **Bỏ sót lỗi thiết kế giao diện cho phép sửa trực tiếp tổng tiền (`BUG-FR09-05`):**
   * *Thực tế:* Giao diện [Checkout.jsx](file:///c:/Coding/SoftwareTesting/Seminar/src/eshop-sut/frontend-web/src/pages/Checkout.jsx#L93-L103) có ô `<input type="number">` cho phép khách hàng tự sửa tổng tiền trước khi bấm áp mã và thanh toán, vi phạm đặc tả FR-08.
5. **Bỏ sót lỗi bất đồng bộ khi ghi nhận lượt sử dụng (`BUG-FR09-06`):**
   * *Thực tế:* Ghi nhận coupon usage là một API gọi riêng (`/api/coupon-usage`) do client kích hoạt sau thanh toán, không nằm trong transaction đặt hàng tại backend. Nếu client drop mạng hoặc chặn request này, coupon dùng 1 lần có thể dùng lại vô số lần.

---

## 6. Phần E: Báo Cáo Lỗi Độc Lập (Chuẩn 10 Yếu Tố Bài Giảng Slide S08)

### BUG-FR09-01: Sai công thức toán học khi tính giảm giá theo phần trăm (SAVE10)
1. **Bug ID:** `BUG-FR09-01`
2. **Function name:** `FR-09: Tính toán giảm giá theo phần trăm (Backend API)`
3. **Problem summary:** `Calculate Percentage Discount: Backend multiplies total by negative factor (1 - discount_value) instead of (total * discount_value / 100), increasing order total 10-fold.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `http://localhost:3000/api/apply-coupon`, Node.js Express.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/apply-coupon` với body: `{"code": "SAVE10", "total_amount": 400000, "user_id": 2}`.
     2. Quan sát kết quả JSON trả về.
   * **Expected Behavior:** Giảm 10% của 400,000 ₫ là 40,000 ₫; `discount_amount: 40000`, `final_amount: 360000`.
   * **Actual Behavior:** Hệ thống trả về `discount_amount: -3600000`, `final_amount: 4000000` (khách hàng bị đội giá gấp 10 lần).
   * **Root Cause & Code Reference:** Tại file `backend/server.js` dòng 406:
     ```javascript
     discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
     ```
     Với `coupon.discount_value = 10`, `(1 - 10) = -9`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Backend Developer
8. **Status:** `Open`
9. **Priority:** `Immediate (Critical)` — Tính toán sai tiền của khách hàng, đe dọa hoạt động kinh doanh.
10. **Severity:** `Fatal`

---

### BUG-FR09-02: Sai toán tử so sánh ngưỡng tối thiểu (sử dụng '>' thay vì '>=')
1. **Bug ID:** `BUG-FR09-02`
2. **Function name:** `FR-09: Kiểm tra ngưỡng giá trị tối thiểu (Backend API)`
3. **Problem summary:** `Validate Minimum Order Amount: Backend uses strict inequality '>' instead of '>=', falsely rejecting orders exactly equal to min_order_amount.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `:5173` & Backend `:3000`.
   * **Steps to Reproduce:**
     1. Nhập đơn hàng có tổng tiền đúng `500,000 ₫`.
     2. Nhập mã `'BIGBUY'` (có `min_order_amount = 500,000 ₫`).
     3. Nhấp "Áp dụng".
   * **Expected Behavior:** Hệ thống chấp nhận mã hợp lệ vì $500,000 \ge 500,000$ (thỏa mãn điều kiện C3).
   * **Actual Behavior:** Hệ thống từ chối với HTTP 400: *"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"*.
   * **Root Cause & Code Reference:** Tại `backend/server.js` dòng 385:
     ```javascript
     if (total_amount > coupon.min_order_amount) { // Thiếu dấu =
     ```
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Backend Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

### BUG-FR09-03: Endpoint áp dụng coupon không yêu cầu xác thực JWT (Vi phạm C4)
1. **Bug ID:** `BUG-FR09-03`
2. **Function name:** `FR-09: Xác thực người dùng khi áp coupon (Security / API)`
3. **Problem summary:** `Authenticate Coupon Application: POST /api/apply-coupon lacks authenticateToken middleware, violating C4 requirement.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `:3000`.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/apply-coupon` với body `{"code": "BIGBUY", "total_amount": 600000}` mà không kèm header `Authorization: Bearer <token>`.
   * **Expected Behavior:** Backend trả về HTTP 401 Unauthorized yêu cầu đăng nhập theo quy định C4.
   * **Actual Behavior:** Backend trả về HTTP 200 thành công cho khách vãng lai.
   * **Root Cause:** Route `app.post("/api/apply-coupon", ...)` trong `server.js` thiếu middleware `authenticateToken`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Backend Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

### BUG-FR09-04: Backend nhận user_id từ request body gây nguy cơ ID Spoofing
1. **Bug ID:** `BUG-FR09-04`
2. **Function name:** `FR-09: Kiểm soát định danh người dùng (Security / API)`
3. **Problem summary:** `Authorize User Identity: Backend trusts client-provided user_id in body instead of extracting from verified JWT token, allowing quota bypass.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `:3000`.
   * **Steps to Reproduce:**
     1. Tài khoản A (User ID 2) đã dùng hết lượt mã `BIGBUY`.
     2. Gửi request với body `{"code": "BIGBUY", "total_amount": 600000, "user_id": 999}`.
   * **Expected Behavior:** Backend lấy `req.user.id` từ token, phát hiện đã hết lượt và từ chối.
   * **Actual Behavior:** Backend truy vấn `user_id = 999`, không thấy lịch sử dùng và cho phép áp dụng thành công.
   * **Root Cause:** `server.js:370` lấy `const { code, total_amount, user_id } = req.body;`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Backend Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

### BUG-FR09-05: Giao diện Checkout cho phép người dùng tự do nhập và sửa tổng tiền thanh toán
1. **Bug ID:** `BUG-FR09-05`
2. **Function name:** `FR-08 / FR-09: Toàn vẹn dữ liệu đơn hàng (Web Client / Security)`
3. **Problem summary:** `Enforce Order Total Integrity: Checkout page exposes an editable input for total amount, allowing price tampering.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `http://localhost:5173/checkout`.
   * **Steps to Reproduce:**
     1. Mở trang Checkout.
     2. Tại ô "Tổng tiền thanh toán (VND)", gõ trực tiếp số tiền `600,000 ₫` (mặc dù giỏ hàng chỉ có món 50,000 ₫).
     3. Nhập mã `'BIGBUY'` và bấm Áp dụng.
   * **Expected Behavior:** Tổng tiền thanh toán là trường chỉ đọc (read-only), tự động tính từ giỏ hàng (theo đặc tả FR-08 dòng 105).
   * **Actual Behavior:** Input cho phép sửa tự do, người dùng có thể kích hoạt các mã giảm giá giá trị cao hoặc giảm giá tiền thanh toán tùy ý.
   * **Root Cause:** `frontend-web/src/pages/Checkout.jsx` dòng 93-103 render `<input type="number" value={editableTotal} onChange=... />`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Fullstack Developer
8. **Status:** `Open`
9. **Priority:** `Immediate (Critical)`
10. **Severity:** `Fatal`

---

### BUG-FR09-06: Ghi nhận lượt sử dụng coupon tách rời khỏi transaction thanh toán
1. **Bug ID:** `BUG-FR09-06`
2. **Function name:** `FR-09: Quản lý tính nguyên tử của giao dịch (Architecture / Fullstack)`
3. **Problem summary:** `Persist Coupon Usage: Frontend executes separate uncoordinated call to /api/coupon-usage, risking unrecorded single-use coupons.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client `:5173` & Backend `:3000`.
   * **Steps to Reproduce:**
     1. Áp dụng mã `BIGBUY` (mã dùng 1 lần) và tiến hành đặt hàng.
     2. Dùng DevTools chặn request thứ hai gửi tới `/api/coupon-usage` sau khi `/api/checkout` đã thành công.
   * **Expected Behavior:** Đơn hàng và việc ghi nhận trừ lượt dùng coupon phải nằm chung trong 1 transaction nguyên tử tại Backend.
   * **Actual Behavior:** Đơn hàng được tạo thành công nhưng bảng `coupon_usage` không có bản ghi nào, người dùng có thể tiếp tục dùng mã này cho các đơn hàng tiếp theo.
   * **Root Cause:** `Checkout.jsx` dòng 54-59 thực hiện 2 request HTTP độc lập thay vì backend xử lý trong cùng 1 transaction.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-20
7. **Assign to:** Fullstack Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

## 7. Phần F: Báo Cáo Tổng Kết Kiểm Thử (Test Summary Report - Chuẩn Slide S08)

### 7.1. Bảng Thống Kê Theo Chức Năng (Statistics by Function - Slide S08 Slide 18)

| No | Items (Function) | Tested | Passed | Failed | Blocked | Skipped | Total TCs | Test Coverage |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **FR-09: Discount Coupons** | **31** | **23** | **8** | **0** | **0** | **31** | **100%** |
| | *— Domain Testing Cases* | 18 | 12 | 6 | 0 | 0 | 18 | 100% |
| | *— Boundary Value Analysis (BVA)* | 13 | 11 | 2 | 0 | 0 | 13 | 100% |

---

### 7.2. Bảng Thống Kê Lỗi Theo Bản Chất Kỹ Thuật (Statistics by Defect Type - Slide S08 Slide 19)

| Defect Type (Bản chất lỗi) | Fatal | Serious | Medium | Cosmetic | Tổng số Lỗi | Tỷ lệ (%) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Calculation & Logic (Công thức phần trăm sai)** | 1 | 0 | 0 | 0 | **1** | 16.7% |
| **Boundary Value Defect (Toán tử `>` thay vì `>=`)** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **Security - Authentication & Spoofing (Thiếu JWT, Fake ID)** | 0 | 2 | 0 | 0 | **2** | 33.3% |
| **Architecture & Integrity (Ghi nhận usage không atomic)** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **User Interface & Tampering (Input sửa trực tiếp tổng tiền)** | 1 | 0 | 0 | 0 | **1** | 16.7% |
| **TỔNG CỘNG** | **2** | **4** | **0** | **0** | **6 Bugs** | **100%** |

---

### 7.3. Bảng Thống Kê Lỗi Theo Mức Độ Nghiêm Trọng (Statistics by Defect Severity - Slide S08 Slide 21)

| Mức độ nghiêm trọng (Severity) | Định nghĩa theo bài giảng S08 | Số lượng phát hiện | Tỷ lệ (%) |
|:---|:---|:---:|:---:|
| **Fatal** | Gây thiệt hại tài chính, cho phép gian lận giá tiền đơn hàng, công thức tính toán sai làm tăng giá 10 lần | 2 | 33.3% |
| **Serious** | Vi phạm điều kiện đặc tả C3, C4; lỗ hổng bảo mật ID Spoofing; không đảm bảo tính nguyên tử | 4 | 66.7% |
| **Medium** | Lỗi xử lý nghiệp vụ nhẹ không gây mất an toàn dữ liệu | 0 | 0% |
| **Cosmetic** | Lỗi hiển thị giao diện | 0 | 0% |
| **TỔNG CỘNG** | | **6 Bugs** | **100%** |
