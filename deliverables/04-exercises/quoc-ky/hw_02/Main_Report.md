# BÁO CÁO BÀI TẬP HW02: KIỂM THỬ MIỀN (DOMAIN TESTING) & PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) TRÊN HỆ THỐNG ESHOP

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop (Web, Admin, Mobile, Backend REST API)  
> **Tài liệu đặc tả nguồn (SRS):** [`specs/system_requirements_specification.md`](../../specs/system_requirements_specification.md)  
> **Ngày báo cáo:** 18/10/2026

---

## 1. TỔNG QUAN & PHƯƠNG PHÁP LUẬN KIỂM THỬ

### 1.1 Mục Tiêu & Cơ Sở Lý Thuyết
Báo cáo này trình bày quy trình thiết kế kịch bản kiểm thử hộp đen (Black-box Test Design) áp dụng hai kỹ thuật cốt lõi:
1. **Phân vùng tương đương (Equivalence Partitioning - EP) theo ISTQB FL v4.0 §4.2.1:**
   - Phân chia miền dữ liệu của từng biến đầu vào thành các lớp tương đương hợp lệ (**Valid Equivalence Partitions - VEP**) và các lớp tương đương không hợp lệ (**Invalid Equivalence Partitions - IEP**).
   - **Nguyên tắc Giả định Đơn lỗi (Single Fault Assumption):** Khi kiểm thử một lớp không hợp lệ (IEP), chỉ cho phép duy nhất một tham số mang giá trị sai; tất cả các tham số còn lại bắt buộc phải giữ giá trị hợp lệ cơ sở để tránh hiện tượng che giấu lỗi (error masking).
2. **Phân tích giá trị biên (Boundary Value Analysis - BVA) theo ISTQB FL v4.0 §4.2.2:**
   - Xác định hành vi của hệ thống tại các ranh giới của các tập hợp có thứ tự (ordered domains: số, độ dài chuỗi, ngày tháng, thời gian).
   - Áp dụng kỹ thuật **2-Value BVA** (On-point và Off-point) và mở rộng **3-Value BVA** (bổ sung In-point) với bước vi sai nhỏ nhất $\epsilon$.
   - **Định nghĩa các điểm:**
     - **On-point:** Giá trị nằm chính xác trên đường biên giới.
     - **Off-point:** Giá trị gần nhất với biên nằm ở phía đối diện (ngoài vùng nếu On nằm trong, hoặc trong vùng nếu On nằm ngoài).
     - **In-point:** Giá trị nằm liền kề bên trong phân vùng.

### 1.2 Nguyên Tắc "Đặc Tả Là Căn Cứ Duy Nhất" (Specification as Sole Truth)
- Mọi điều kiện, thông báo lỗi, mã trạng thái HTTP và kết quả mong đợi (Expected Results) đều được trích dẫn trực tiếp từ tài liệu đặc tả `specs/system_requirements_specification.md`.
- Sự sai lệch giữa hành vi thực tế của SUT EShop và tài liệu đặc tả được xác định là một khiếm khuyết (Defect/Bug).

### 1.3 Danh Sách 4 Tính Năng Được Lựa Chọn
| Pool | Mã FR | Tên chức năng | Phân hệ | Đặc điểm kiểm thử biên & miền dữ liệu |
| :--- | :--- | :--- | :--- | :--- |
| **Pool A** | **FR-02** | Đăng nhập & Khóa tài khoản *(Login & Account Lockout)* | Web / API | Biên số lần thử sai ($N \ge 3$); Biên thời gian phạt 30 giây ($29s, 30s, 31s$); Miền email/password. |
| **Pool B** | **FR-07** | Giỏ hàng *(Shopping Cart)* | Web | Biên số lượng ($0, 1, 2, \text{stock}$); Chuyển đổi trạng thái $1 \to 0$; Tính toán số học thành tiền ($Price \times Quantity$). |
| **Pool C** | **FR-17** | Quản lý Mã Giảm Giá *(Coupon CRUD - Admin)* | Admin / API | Ràng buộc bất đẳng thức: `min_order_amount >= 0`, `max_uses_per_user >= 1`, `discount_value > 0`, biên `percent` ($0\%, 1\%, 100\%, 101\%$), biên ngày `expired_at`. |
| **Pool D** | **FR-20 & FR-10** | Hủy đơn hàng theo trạng thái *(Cancel Order - Mobile)* | Mobile / API | Kiểm thử miền trạng thái hữu hạn theo State Machine: `pending`, `confirmed` (hủy được) vs. `shipping`, `delivered`, `canceled` (bị chặn hủy). |

---

## 2. TÍNH NĂNG A (POOL A): FR-02 – ĐĂNG NHẬP & KHÓA TÀI KHOẢN

### 2.1 Bước 1: Nhận diện biến đầu vào & Ràng buộc (Step 1 Deliverables)
> **Trích dẫn đặc tả SRS FR-02:**
> - Người dùng nhập Email và Mật khẩu.
> - Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị.
> - Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân.
> - Đăng nhập thành công trả về JWT Token. Token được lưu phía client và gửi kèm tất cả các yêu cầu có xác thực qua header `Authorization: Bearer <token>`.
> - Trường email phải dùng `type="email"` (có validate HTML5 format).

| Variable ID | Variable Name | Data Type | Mandatory? | Precision ($\epsilon$) | Specification Constraint (Quote) | Assumptions / Ambiguities |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| `VAR-02-01` | `email` | String | Có | 1 char | Trích dẫn SRS FR-02: *"Người dùng nhập Email và Mật khẩu."* và *"Trường email phải dùng `type="email"` (có validate HTML5 format)."* (Đối chiếu FR-01: *"Email phải có định dạng hợp lệ (`user@domain.com`)"*) | Cần có tài khoản tồn tại trong CSDL (`test@eshop.com`); SRS không nêu độ dài tối đa $\to$ Áp dụng chuẩn RFC 5321 / RFC 3696: tối đa 254 ký tự; Trình duyệt validate format HTML5 trước khi submit; Backend `POST /api/login` cần validate tính hợp lệ. |
| `VAR-02-02` | `password` | String | Có | 1 char | Trích dẫn SRS FR-02: *"Người dùng nhập Email và Mật khẩu."* (Đối chiếu FR-01: *"Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt"*) | Khớp với mật khẩu đã băm trong CSDL. Form đăng nhập không chặn mật khẩu yếu khi gõ, chỉ kiểm tra tính xác thực. SRS không nêu cận trên $\to$ Áp dụng chuẩn an toàn OWASP ASVS: tối đa 255 ký tự để chống tấn công DoS tính toán hash. Mật khẩu mẫu: `Test1234!`. |
| `VAR-02-03` | `failed_attempts` | Integer | Hệ thống | 1 lần | Trích dẫn SRS FR-02: *"Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị."* và *"Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây"* | Biến trạng thái đếm số lần sai liên tiếp theo từng tài khoản (`email`). Đăng nhập thành công trước khi đạt ngưỡng 3 lần sẽ reset bộ đếm về 0. |
| `VAR-02-04` | `lockout_time` | Seconds | Hệ thống | 1 giây | Trích dẫn SRS FR-02: *"tài khoản bị tạm khóa 30 giây (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân."* | Thời gian phạt tính từ lúc đăng nhập sai lần thứ 3 ($T = 30s$). Trong thời gian này, mọi thử nghiệm đăng nhập đều bị từ chối; sau 30s tài khoản tự động mở khóa. Thông báo lỗi phải trung tính để bảo mật. |

### 2.2 Bước 2: Phân vùng tương đương (Step 2 Deliverables)

> **Nguyên tắc Giả định Đơn lỗi (Single Fault Assumption - ISTQB FL §4.2.1):**
> Khi kiểm thử một phân vùng không hợp lệ (IEP), chỉ duy nhất 1 điều kiện hoặc biến đầu vào mang giá trị lỗi; toàn bộ các tham số còn lại phải được giữ ở giá trị hợp lệ cơ sở (Baseline) nhằm cô lập nguyên nhân từ chối và ngăn chặn hiện tượng che giấu lỗi (error masking).

| Class ID | Variable / Constraint | Domain / Sub-condition | Type (VEP / IEP) | Representative Value | Single-Fault Baseline / Rationale |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `EP-02-01` | `email` | Định dạng hợp lệ và tài khoản tồn tại trong CSDL | VEP | `test@eshop.com` | Baseline hợp lệ chuẩn; kết hợp với mật khẩu hợp lệ để đăng nhập thành công. |
| `EP-02-02` | `email` | Định dạng không hợp lệ theo HTML5/RFC (thiếu `@`, ký tự cấm) | IEP | `testeshop.com` | `password = "Test1234!"` (hợp lệ). Cô lập lỗi do cú pháp email; HTML5/UI validate chặn submit trước khi gửi API. |
| `EP-02-03` | `email` | Chuỗi rỗng / để trống trường bắt buộc | IEP | `""` | `password = "Test1234!"` (hợp lệ). Cô lập lỗi thiếu trường bắt buộc email. |
| `EP-02-04` | `email` | Chuỗi chỉ chứa khoảng trắng (Whitespace-only) | IEP | `"     "` | `password = "Test1234!"` (hợp lệ). Cô lập lỗi chuỗi rỗng ngụy trang; HTML5 trim/pattern hoặc backend từ chối. |
| `EP-02-04b`| `email` | Độ dài vượt quá giới hạn tối đa RFC 5321 ($Len > 254$) | IEP | Email dài 255 ký tự | `password = "Test1234!"` (hợp lệ). Cô lập lỗi tràn trường email; hệ thống từ chối hoặc báo lỗi định dạng. |
| `EP-02-05` | `email` | Định dạng hợp lệ nhưng tài khoản không tồn tại | IEP | `notfound@eshop.com` | `password = "Test1234!"` (hợp lệ). Kiểm tra phản hồi bảo mật chung, không làm lộ thông tin tài khoản chưa tồn tại. |
| `EP-02-06` | `password` | Mật khẩu khớp chính xác với tài khoản | VEP | `Test1234!` | `email = "test@eshop.com"`. Đáp ứng đầy đủ thông tin xác thực, cấp JWT token. |
| `EP-02-07` | `password` | Mật khẩu sai / không khớp CSDL | IEP | `WrongPass1!` | `email = "test@eshop.com"` (hợp lệ). Cô lập lỗi sai mật khẩu; hệ thống tăng bộ đếm thất bại đúng 1 đơn vị. |
| `EP-02-08` | `password` | Mật khẩu để trống | IEP | `""` | `email = "test@eshop.com"` (hợp lệ). Cô lập lỗi thiếu trường bắt buộc mật khẩu. |
| `EP-02-09` | `password` | Mật khẩu chỉ chứa khoảng trắng (Whitespace-only) | IEP | `"    "` | `email = "test@eshop.com"` (hợp lệ). Cô lập lỗi chuỗi rỗng ngụy trang cho password; hệ thống từ chối xác thực. |
| `EP-02-09b`| `password` | Độ dài vượt quá giới hạn an toàn OWASP ($Len > 255$) | IEP | Mật khẩu dài 256 ký tự | `email = "test@eshop.com"` (hợp lệ). Cô lập lỗi tràn bộ đệm tính toán hash; hệ thống xử lý an toàn không treo máy. |
| `EP-02-10` | `failed_attempts` | Số lần đăng nhập sai dưới ngưỡng ($1 \le N \le 2$), sau đó nhập đúng | VEP | $N = 1$ hoặc $N = 2 \to$ nhập đúng `Test1234!` | Tài khoản `test@eshop.com`. Kiểm tra sequence: đăng nhập đúng sau $1$ hoặc $2$ lần sai phải thành công và reset $N \to 0$. |
| `EP-02-11` | `failed_attempts` | Số lần sai đạt hoặc vượt ngưỡng lần đầu ($N \ge 3$) | IEP | $N = 3$ | Nhập sai liên tiếp 3 lần trên cùng tài khoản `test@eshop.com`. Kích hoạt tạm khóa 30 giây lần đầu. |
| `EP-02-12` | `failed_attempts` | Chu kỳ khóa lặp lại (Second lockout cycle sau khi hết lần 1) | IEP | Hết khóa 1 $\to$ sai tiếp 3 lần | Tài khoản `test@eshop.com`. Kiểm tra thời gian phạt lần 2 có bị lũy tiến (escalate/backoff) hay giữ nguyên 30s theo SRS. |
| `EP-02-13a` | `lockout_time` | Đang trong thời gian tạm khóa ($0 \le t < 30s$) – Nhập đúng pass | IEP | $t = 15s$ / pass đúng `Test1234!` | Tài khoản đang bị khóa. Dù người dùng nhập đúng mật khẩu vẫn bị từ chối (HTTP 403); không mở khóa sớm. |
| `EP-02-13b` | `lockout_time` | Đang trong thời gian tạm khóa ($0 \le t < 30s$) – Nhập sai pass | IEP | $t = 15s$ / pass sai `WrongPass!` | Tài khoản đang bị khóa. Từ chối đăng nhập; kiểm tra xem lần thử sai này có reset lại bộ đếm 30s (timer reset) hay không. |
| `EP-02-14` | `lockout_time` | Đã hết thời gian tạm khóa ($t \ge 30s$) | VEP | $t = 31s$ | Tài khoản tự động giải tỏa tạm khóa; nhập đúng mật khẩu `Test1234!` đăng nhập thành công. |

> **Xác nhận về Trạng thái Tài khoản (Account Status: Banned / Inactive):**
> - **Đối chiếu Đặc tả SRS:** Tài liệu SRS (`specs/system_requirements_specification.md`) và CSDL SUT (`users` table: `id, name, email, password, role, login_attempts, locked_until, reset_token, shipping_address, phone`) **hoàn toàn không hỗ trợ** trạng thái tài khoản bị cấm (`banned`) hay vô hiệu hóa (`inactive`).
> - **Kết luận phân loại:** Trạng thái duy nhất điều khiển quyền truy cập tài khoản trong FR-02 là **Tạm khóa do đăng nhập sai (`locked_until`)**. Tình huống tài khoản bị cấm/vô hiệu hóa sẽ được ghi nhận vào phần **Khoảng trống Đặc tả & Giả thuyết Khám phá (Step 6 Gap Analysis)** thay vì lớp tương đương nghiệp vụ bắt buộc.

### 2.3 Bước 3: Phân tích giá trị biên (Step 3 Deliverables)

> **Phương pháp tiếp cận Phân tích Giá trị Biên (ISTQB FL §4.2.2):**
> Áp dụng kỹ thuật **3-Value BVA** cho các miền có thứ tự (số nguyên, thời gian, độ dài chuỗi) với bước vi sai nhỏ nhất ($\epsilon$).
> - **On-point:** Giá trị nằm chính xác trên ranh giới phân hoạch.
> - **Off-point:** Giá trị nằm sát biên nhất ở phía đối diện (ngoài vùng nếu On nằm trong; hoặc trong vùng nếu On nằm ngoài).
> - **In-point:** Giá trị nằm liền kề bên trong phân vùng cần kiểm thử.

| Boundary ID | Variable / Field | Boundary Rule | BVA Method | On-point (Value/Type) | Off-point (Value/Type) | In-point (Value/Type) |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `BVA-02-01` | `failed_attempts` | $N \ge 3$ (Ngưỡng khóa tài khoản do nhập sai liên tiếp) | 3-Value ($\epsilon=1\text{ lần}$) | $N = 3$ [Invalid - Khóa]<br/>Nhập sai đúng lần thứ 3 $\to$ Kích hoạt tạm khóa 30s. | $N = 2$ [Valid - Chưa khóa]<br/>Nhập sai 2 lần ($3 - 1$) $\to$ Cảnh báo lỗi, chưa bị khóa. | $N = 4$ [Invalid - Đang khóa]<br/>Cố tình thử tiếp khi đã đạt ngưỡng $\to$ Giữ trạng thái khóa. |
| `BVA-02-02` | `lockout_time` | $t \ge 30s$ (Ngưỡng tự động giải tỏa tạm khóa tài khoản) | 3-Value ($\epsilon=1\text{ giây}$) | $t = 30s$ [Valid - Mở khóa]<br/>Đúng mốc 30 giây $\to$ Biên chuyển đổi từ khóa sang mở. | $t = 29s$ [Invalid - Vẫn khóa]<br/>Sát biên mở 1s ($30 - 1$) $\to$ Vẫn đang bị khóa, từ chối login. | $t = 31s$ [Valid - Mở khóa]<br/>Sau mở khóa 1s ($30 + 1$) $\to$ Đăng nhập đúng thành công, cấp JWT. |
| `BVA-02-03` | `password.length` | $Len \ge 8$ (Độ dài mật khẩu tối thiểu - đối chiếu FR-01) | 3-Value ($\epsilon=1\text{ char}$) | $Len = 8$ [Valid]<br/>`"Pass123!"` (đúng 8 ký tự). | $Len = 7$ [Invalid]<br/>`"Pass12!"` ($8 - 1$ ký tự, dưới ngưỡng tối thiểu). | $Len = 9$ [Valid]<br/>`"Pass1234!"` ($8 + 1$ ký tự, trên ngưỡng tối thiểu). |
| `BVA-02-04` | `login_sequence` | $N = 1, 2$ (Ngưỡng reset bộ đếm trước khi chạm mốc khóa) | 3-Value Transition | $N = 2 \to$ Đúng [Valid]<br/>Sai 2 lần rồi nhập đúng $\to$ Login thành công, reset $N \to 0$. | $N = 3 \to$ Sai [Invalid]<br/>Sai tiếp lần 3 $\to$ Vượt biên chịu lỗi, tài khoản bị tạm khóa 30s. | $N = 1 \to$ Đúng [Valid]<br/>Sai 1 lần rồi nhập đúng $\to$ Login thành công, reset $N \to 0$. |
| `BVA-02-05` | `email.length` | $Len \le 254$ ký tự (Cận trên độ dài theo chuẩn RFC 5321 / RFC 3696) | 3-Value ($\epsilon=1\text{ char}$) | $Len = 254$ [Valid]<br/>Email đúng chuẩn dài đúng 254 ký tự. | $Len = 255$ [Invalid]<br/>Email dài 255 ký tự ($254 + 1$, vượt chuẩn RFC). | $Len = 253$ [Valid]<br/>Email dài 253 ký tự ($254 - 1$, cận kề trong vùng hợp lệ). |
| `BVA-02-06` | `password.length` | $Len \le 255$ ký tự (Cận trên độ dài an toàn theo OWASP ASVS) | 3-Value ($\epsilon=1\text{ char}$) | $Len = 255$ [Valid]<br/>Mật khẩu dài đúng 255 ký tự. | $Len = 256$ [Invalid]<br/>Mật khẩu dài 256 ký tự ($255 + 1$, vượt ngưỡng an toàn). | $Len = 254$ [Valid]<br/>Mật khẩu dài 254 ký tự ($255 - 1$, cận kề trong vùng hợp lệ). |

### 2.4 Bước 4: Thiết kế kịch bản kiểm thử (Step 4 Deliverables)

> **Phương pháp luận Thiết kế Kịch bản Kiểm thử (Theo `Comprehensive Guide: How to Write Test Cases`):**
> 1. **Cú pháp Định danh Mục tiêu (Title / Objective Formula):** Mọi kịch bản kiểm thử đều tuân thủ công thức chuẩn:
>    $$\text{Action (Hành động)} + \text{Function (Chức năng)} + \text{Operating Condition (Điều kiện vận hành)}$$
> 2. **Nguyên tắc Giả định Đơn lỗi (Single Fault Isolation):** Mỗi kịch bản Negative chỉ kích hoạt đúng 1 điều kiện không hợp lệ; tất cả các biến khác giữ nguyên giá trị hợp lệ cơ sở (Baseline).
> 3. **Tính Tự dọn dẹp (Self-Cleaning / Teardown):** Mỗi kịch bản có trạng thái (Stateful) đều bao gồm bước hoàn trả trạng thái CSDL SQLite để đảm bảo tính độc lập tuyệt đối giữa các lượt kiểm thử.
> 4. **Điểm kiểm chứng đa tầng (Multi-tier Validation Points):** Kết quả mong đợi phân tách rõ ràng 4 tầng: Giao diện Web (UI), Giao diện Lập trình (API), Trạng thái CSDL (Database), và Tuân thủ An toàn Thông tin (Security).

---

#### 2.4.1 Bảng Tổng Hợp Kịch Bản Kiểm Thử & Ma Trận Truy Vết (Overview Traceability Matrix)

| TC ID | Test Case Objective ($\text{Action} + \text{Function} + \text{Condition}$) | Phân loại | Mã EP bao phủ | Mã BVA bao phủ | Dữ liệu đầu vào & Baseline | Kết quả cốt lõi (Core Expected) | Trạng thái |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| `TC_FR02_01` | Verify login authentication with valid registered credentials on Web & API | Positive (VEP) | `EP-02-01`, `EP-02-06` | `BVA-02-03-IN` | `test@eshop.com` / `Test1234!` ($Len=9$) | HTTP 200, JWT token, redirect `/` | *Chờ thực thi* |
| `TC_FR02_02` | Verify login authentication with boundary password length exactly 8 chars | Positive (BVA) | `EP-02-01`, `EP-02-06` | `BVA-02-03-ON` | `test@eshop.com` / `Pass123!` ($Len=8$) | HTTP 200, xác thực thành công | *Chờ thực thi* |
| `TC_FR02_03` | Validate consecutive failure counter increment on attempt N=1 (Below threshold) | Negative (IEP) | `EP-02-07` | `BVA-02-04-IN` | `test@eshop.com` / `WrongPass1!` | HTTP 401, `login_attempts = 1`, chưa khóa | *Chờ thực thi* |
| `TC_FR02_04` | Validate consecutive failure counter increment on attempt N=2 (Boundary Off-point) | Negative (BVA) | `EP-02-07` | `BVA-02-01-OFF`, `BVA-02-04-ON` | `test@eshop.com` / `WrongPass2!` | HTTP 401, `login_attempts = 2`, chưa khóa | *Chờ thực thi* |
| `TC_FR02_05` | Verify failure counter reset to 0 upon submitting correct password after N=2 failures | Positive (Seq) | `EP-02-06`, `EP-02-10` | `BVA-02-04-ON` | `test@eshop.com` / `Test1234!` | HTTP 200, reset `login_attempts = 0` | *Chờ thực thi* |
| `TC_FR02_06` | Validate account lockout activation upon reaching threshold N=3 consecutive failures | Negative (BVA) | `EP-02-07`, `EP-02-11` | `BVA-02-01-ON`, `BVA-02-04-OFF` | `test@eshop.com` / `WrongPass3!` | HTTP 401/403, khóa đúng 30 giây | *Chờ thực thi* |
| `TC_FR02_07` | Validate login rejection when submitting correct password during lockout at t=15s | Negative (IEP) | `EP-02-13a` | `BVA-02-02-OFF` | `test@eshop.com` / `Test1234!` ($t=15s$) | HTTP 403 Forbidden, từ chối mở sớm | *Chờ thực thi* |
| `TC_FR02_08` | Validate lockout timer non-reset behavior when submitting wrong password at t=15s | Negative (IEP) | `EP-02-13b` | N/A (State Probe) | `test@eshop.com` / `WrongPassMid!` ($t=15s$) | HTTP 403, timer 30s KHÔNG bị reset | *Chờ thực thi* |
| `TC_FR02_09` | Validate lockout rejection enforcement at boundary offset t=29s (1s before unlock) | Negative (BVA) | `EP-02-13a` | `BVA-02-02-OFF` ($t=29s$) | `test@eshop.com` / `Test1234!` ($t=29s$) | HTTP 403 Forbidden, vẫn đang bị khóa | *Chờ thực thi* |
| `TC_FR02_10` | Verify automatic account unlock transition at exact boundary expiration t=30s | Positive (BVA) | `EP-02-14` | `BVA-02-02-ON` ($t=30s$) | `test@eshop.com` / `Test1234!` ($t=30s$) | HTTP 200 OK, mở khóa, cấp JWT | *Chờ thực thi* |
| `TC_FR02_11` | Verify login authentication success at boundary offset t=31s (1s after unlock) | Positive (BVA) | `EP-02-14` | `BVA-02-02-IN` ($t=31s$) | `test@eshop.com` / `Test1234!` ($t=31s$) | HTTP 200 OK, đăng nhập thành công | *Chờ thực thi* |
| `TC_FR02_12` | Validate lockout duration non-escalation behavior on repeated second lockout cycle | Negative (IEP) | `EP-02-12` | `BVA-02-01-ON` | 3 lần thử sai liên tiếp lần 2 | Khóa lần 2 vẫn đúng 30s (không backoff) | *Chờ thực thi* |
| `TC_FR02_13` | Validate rejection of additional login attempt N=4 while already in lockout | Negative (BVA) | `EP-02-11` | `BVA-02-01-IN` ($N=4$) | `test@eshop.com` / `WrongPass4!` | HTTP 403 Forbidden, giữ nguyên khóa | *Chờ thực thi* |
| `TC_FR02_14` | Validate rejection of invalid email format lacking '@' symbol (Single Fault) | Negative (IEP) | `EP-02-02` | N/A (Format) | `testeshop.com` / `Test1234!` | HTML5 validation tooltip / HTTP 400 | *Chờ thực thi* |
| `TC_FR02_15` | Validate rejection of empty email field on Web Client & API (Single Fault) | Negative (IEP) | `EP-02-03` | N/A (Required) | `""` / `Test1234!` | HTML5 `required` tooltip / HTTP 400 | *Chờ thực thi* |
| `TC_FR02_16` | Validate rejection of email containing only whitespace characters (Single Fault) | Negative (IEP) | `EP-02-04` | N/A (Whitespace) | `"     "` / `Test1234!` | Báo lỗi định dạng email / HTTP 400 | *Chờ thực thi* |
| `TC_FR02_17` | Validate rejection of email exceeding RFC 5321 max length 254 chars (Single Fault) | Negative (BVA) | `EP-02-04b` | `BVA-02-05-OFF` ($Len=255$) | Email 255 chars / `Test1234!` | Báo lỗi chuỗi quá dài / HTTP 400 | *Chờ thực thi* |
| `TC_FR02_18` | Verify acceptance of email with maximum allowable RFC 5321 length of 254 chars | Positive (BVA) | `EP-02-01` | `BVA-02-05-ON` ($Len=254$) | Email 254 chars / `Test1234!` | HTTP 200 OK, xác thực thành công | *Chờ thực thi* |
| `TC_FR02_19` | Validate generic error response when submitting non-existent email (Single Fault) | Negative (IEP) | `EP-02-05` | N/A (Account) | `notfound@eshop.com` / `Test1234!` | HTTP 401, không lộ email chưa tồn tại | *Chờ thực thi* |
| `TC_FR02_20` | Validate rejection of empty password field on Web Client & API (Single Fault) | Negative (IEP) | `EP-02-08` | N/A (Required) | `test@eshop.com` / `""` | HTML5 `required` tooltip / HTTP 400 | *Chờ thực thi* |
| `TC_FR02_21` | Validate rejection of password containing only whitespace characters (Single Fault) | Negative (IEP) | `EP-02-09` | N/A (Whitespace) | `test@eshop.com` / `"    "` | HTTP 401 Unauthorized, tăng đếm sai | *Chờ thực thi* |
| `TC_FR02_22` | Validate rejection of password below minimum 8 chars length at Len=7 (Single Fault) | Negative (BVA) | `EP-02-07` | `BVA-02-03-OFF` ($Len=7$) | `test@eshop.com` / `Pass12!` ($Len=7$) | HTTP 401 Unauthorized, tăng đếm sai | *Chờ thực thi* |
| `TC_FR02_23` | Validate handling of password exceeding OWASP max length at Len=256 (Single Fault) | Negative (BVA) | `EP-02-09b` | `BVA-02-06-OFF` ($Len=256$) | `test@eshop.com` / Pass 256 chars | HTTP 401/400, không bị treo CPU DoS | *Chờ thực thi* |
| `TC_FR02_24` | Verify acceptance of password with maximum safe OWASP length of 255 chars | Positive (BVA) | `EP-02-06` | `BVA-02-06-ON` ($Len=255$) | `test@eshop.com` / Pass 255 chars | HTTP 200 OK, băm và khớp thành công | *Chờ thực thi* |

---

#### 2.4.2 Hồ Sơ Đặc Tả Chi Tiết Các Kịch Bản Kiểm Thử Phức Tạp & Chuyển Trạng Thái (Detailed Test Specification Cards)

Dưới đây là đặc tả chi tiết 6 phân đoạn vận hành (Tracking, Objective, Environment, Test Data, Procedure, Multi-tier Validation Points, Teardown) cho các nhóm kịch bản phức tạp:

##### Nhóm 1: Xác thực Cơ sở & Reset Bộ Đếm Thử Sai (Baseline & Counter Reset Sequence)

###### Test Case `TC_FR02_01`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_01` | **Priority:** High (P1) | **Target Component:** Web Client (`:5173`) & Backend API (`POST /api/login`)
  - **Traceability:** SRS FR-02 (Item 1, 4), API Spec §1.2 | **Coverage IDs:** `EP-02-01`, `EP-02-06`, `BVA-02-03-IN`
- **2. Test Objective:** Verify user login authentication with valid registered credentials on Web Client & REST API.
- **3. Pre-conditions & Environment:**
  - Hệ thống EShop đang chạy (`backend: 3000`, `frontend-web: 5173`).
  - Tài khoản `test@eshop.com` tồn tại trong SQLite với mật khẩu `Test1234!`.
  - Trạng thái CSDL ban đầu: `login_attempts = 0`, `locked_until = NULL`.
  - Client chưa lưu token đăng nhập (`localStorage.getItem('token') === null`).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"`
- **5. Step-by-Step Procedure:**
  1. Truy cập trình duyệt đến trang đăng nhập `http://localhost:5173/login`.
  2. Nhập `test@eshop.com` vào ô "Email" (hoặc "Username").
  3. Nhập `Test1234!` vào ô "Mật khẩu".
  4. Nhấn nút "Sign In" (gửi yêu cầu `POST /api/login`).
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Trình duyệt tự động chuyển hướng về trang chủ `http://localhost:5173/`. Header hiển thị thông tin người dùng và nút "Đăng xuất". Không xuất hiện thông báo lỗi màu đỏ.
  - *API / Network:* Endpoint `POST /api/login` trả về mã trạng thái `200 OK`. Response JSON chứa: `message: "Login successful"`, chuỗi `token` định dạng JWT hợp lệ, và đối tượng `user` (`email: "test@eshop.com"`, `role: "user"`).
  - *Client Storage:* `localStorage.getItem('token')` được gán chuỗi JWT không rỗng.
  - *Database State:* Trường `login_attempts` giữ nguyên giá trị `0`, `locked_until` là `NULL`.
- **7. Teardown & Clean-up:** Xóa `localStorage.removeItem('token')` trên trình duyệt để đưa phiên làm việc về trạng thái ẩn danh.

###### Test Case `TC_FR02_04`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_04` | **Priority:** High (P1) | **Target Component:** Backend API & Web Client
  - **Traceability:** SRS FR-02 (Item 2, 3) | **Coverage IDs:** `EP-02-07`, `BVA-02-01-OFF` ($N=2$), `BVA-02-04-ON`
  - **Single-Fault Isolation:** Email hợp lệ chuẩn `test@eshop.com`; biến lỗi duy nhất là mật khẩu sai lần thứ 2.
- **2. Test Objective:** Validate consecutive failure counter increment on attempt N=2 (Boundary Off-point before lockout).
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` vừa hoàn thành bước thử sai lần 1 (`login_attempts = 1`, `locked_until = NULL`).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "WrongPass2!"`
- **5. Step-by-Step Procedure:**
  1. Giữ nguyên email `test@eshop.com`.
  2. Nhập mật khẩu sai lần 2: `WrongPass2!`.
  3. Nhấn "Sign In" (gửi request `POST /api/login`).
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Hiển thị thông báo lỗi cảnh báo đăng nhập thất bại. Form vẫn cho phép tiếp tục nhập, không xuất hiện thông báo tài khoản bị khóa.
  - *API / Network:* HTTP Status code trả về `401 Unauthorized`. Body JSON: `{"error": "Invalid email or password"}` (hoặc tương đương).
  - *Database State:* Truy vấn CSDL `SELECT login_attempts, locked_until FROM users WHERE email='test@eshop.com'`: `login_attempts` tăng từ 1 lên **đúng 2** đơn vị ($N=2$); `locked_until` vẫn là `NULL`.
  - *Security:* Phản hồi lỗi trung tính, không tiết lộ số lần thử sai còn lại hay mật khẩu sai bao nhiêu ký tự.
- **7. Teardown & Clean-up:** Giữ nguyên trạng thái $N=2$ nếu chuẩn bị thực thi `TC_FR02_05` hoặc `TC_FR02_06`.

###### Test Case `TC_FR02_05`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_05` | **Priority:** High (P1) | **Target Component:** Backend API & Database State
  - **Traceability:** SRS FR-02 (Quy tắc "liên tiếp" & Reset bộ đếm) | **Coverage IDs:** `EP-02-06`, `EP-02-10`, `BVA-02-04-ON`
- **2. Test Objective:** Verify failure counter reset to 0 upon submitting correct password after N=2 consecutive failures.
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` đang tích lũy đúng 2 lần thử sai ($N=2$ từ `TC_FR02_04`), chưa bị khóa (`locked_until = NULL`).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"` (mật khẩu chính xác)
- **5. Step-by-Step Procedure:**
  1. Tại ô mật khẩu, xóa chuỗi sai và nhập chính xác: `Test1234!`.
  2. Nhấn "Sign In" để gửi request đăng nhập.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Đăng nhập thành công, chuyển hướng về `/`.
  - *API / Network:* HTTP Status `200 OK`, cấp JWT token hợp lệ.
  - *Database State:* Bộ đếm thất bại được reset hoàn toàn về **0** (`UPDATE users SET login_attempts = 0, locked_until = NULL`). Xác nhận qua câu lệnh: `SELECT login_attempts FROM users WHERE email='test@eshop.com'` trả về `0`.
- **7. Teardown & Clean-up:** Đăng xuất tài khoản, xóa token khỏi `localStorage`.

---

##### Nhóm 2: Kích Hoạt Khóa Tạm Thời & Thăm Dò Trong Thời Gian Khóa (Lockout Activation & Active Window Probes)

###### Test Case `TC_FR02_06`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_06` | **Priority:** Critical (P0) | **Target Component:** Backend Security & Lockout Timer
  - **Traceability:** SRS FR-02 (Item 2, 3) | **Coverage IDs:** `EP-02-07`, `EP-02-11`, `BVA-02-01-ON` ($N=3$), `BVA-02-04-OFF`
  - **Single-Fault Isolation:** Email chuẩn `test@eshop.com`; mật khẩu sai liên tiếp lần thứ 3.
- **2. Test Objective:** Validate account lockout activation upon reaching threshold N=3 consecutive failures (Boundary On-point).
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` đang ở mốc $N=2$ lần sai liên tiếp.
- **4. Test Data:** `email = "test@eshop.com"`, `password = "WrongPass3!"`
- **5. Step-by-Step Procedure:**
  1. Nhập mật khẩu sai lần thứ 3: `WrongPass3!`.
  2. Ghi nhận thời điểm gửi request: $T_{trigger} = \text{Date.now()}$.
  3. Nhấn "Sign In" (gửi `POST /api/login`).
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Hiển thị thông báo tài khoản bị tạm khóa (ví dụ: *"Tài khoản đã bị tạm khóa do nhập sai nhiều lần"*).
  - *API / Network:* Trả về HTTP `401 Unauthorized` hoặc `403 Forbidden`. Không trả về JWT token.
  - *Database State:* `login_attempts` đạt mốc **3** ($N=3$); trường `locked_until` được gán giá trị thời gian bằng đúng **$T_{trigger} + 30\text{ giây}$** (sai số cho phép $\le 1$ giây của môi trường demo, trích dẫn SRS: *"tài khoản bị tạm khóa 30 giây"*).
  - *Security:* Thông báo lỗi không để lộ chi tiết cấu hình nội bộ hoặc thời gian khóa chính xác nếu hệ thống áp dụng thông báo an toàn.
- **7. Teardown & Clean-up:** Duy trì mốc khóa để tiếp tục thực hiện chuỗi test `TC_FR02_07` $\to$ `TC_FR02_11`.

###### Test Case `TC_FR02_07`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_07` | **Priority:** High (P1) | **Target Component:** Lockout Guard Middleware
  - **Traceability:** SRS FR-02 (Item 3) | **Coverage IDs:** `EP-02-13a`, `BVA-02-02-OFF` (Active window $0 \le t < 30s$)
- **2. Test Objective:** Validate login rejection when submitting correct password during lockout period at elapsed time t=15s.
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` đang trong thời gian bị tạm khóa từ `TC_FR02_06`.
  - Thời gian trôi qua kể từ lúc khóa: chính xác 15 giây ($t = 15s < 30s$).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"` (mật khẩu hoàn toàn chính xác)
- **5. Step-by-Step Procedure:**
  1. Đợi đồng hồ đếm đến giây thứ 15 sau khi khóa ($t = 15s$).
  2. Nhập mật khẩu đúng: `Test1234!`.
  3. Nhấn "Sign In".
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Giao diện tiếp tục báo lỗi tài khoản đang bị khóa; tuyệt đối không cho phép đăng nhập hoặc chuyển hướng.
  - *API / Network:* HTTP Status code trả về **`403 Forbidden`**. JSON Error chứa thông báo về việc tài khoản đang bị tạm khóa.
  - *Database State:* CSDL giữ nguyên mốc `locked_until` ban đầu; tài khoản không được mở khóa sớm.
- **7. Teardown & Clean-up:** Tiếp tục giữ khóa để thực thi test `TC_FR02_08`.

###### Test Case `TC_FR02_08`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_08` | **Priority:** High (P1) | **Target Component:** Lockout Timer Integrity Probe
  - **Traceability:** SRS FR-02 | **Coverage IDs:** `EP-02-13b` (State Probe theo yêu cầu kiểm thử miền)
- **2. Test Objective:** Validate lockout timer non-reset behavior when submitting incorrect password at elapsed time t=15s.
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` đang bị khóa; thời gian trôi qua: $t = 15s$.
- **4. Test Data:** `email = "test@eshop.com"`, `password = "WrongPassMidLock!"` (mật khẩu không chính xác)
- **5. Step-by-Step Procedure:**
  1. Tại mốc $t = 15s$, gửi request đăng nhập với mật khẩu sai `WrongPassMidLock!`.
  2. Ghi nhận phản hồi và kiểm tra giá trị cột `locked_until` trong SQLite.
- **6. Multi-tier Validation Points (Expected Results):**
  - *API / Network:* Trả về HTTP `403 Forbidden`.
  - *Database State:* **Không được phép cập nhật lại `locked_until` thành $t + 30s$ mới!** Mốc hết hạn khóa `locked_until` phải giữ nguyên mốc $T_{trigger} + 30s$ ban đầu. (Hệ thống không được phạt cộng dồn đè lên timer hiện có trừ khi có đặc tả rõ ràng).
- **7. Teardown & Clean-up:** Giữ nguyên để kiểm tra điểm biên hết hạn 30s ở các TC tiếp theo.

---

##### Nhóm 3: Kiểm Chứng Ranh Giới Hết Hạn Tạm Khóa & Mở Khóa Tự Động (Boundary Unlock Transitions)

###### Test Case `TC_FR02_09`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_09` | **Priority:** High (P1) | **Target Component:** Lockout Boundary Precision Check
  - **Traceability:** SRS FR-02 (Thời gian khóa 30 giây) | **Coverage IDs:** `EP-02-13a`, `BVA-02-02-OFF` ($t = 29s$)
- **2. Test Objective:** Validate lockout rejection enforcement at boundary offset t=29s (1s before unlock threshold).
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` bị khóa tại thời điểm $T_0$.
  - Đợi đồng hồ đếm đúng 29 giây ($t = 29s$).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"`
- **5. Step-by-Step Procedure:**
  1. Tại đúng mốc $t = 29s$ (sai số $< 200\text{ms}$ bằng automated script hoặc quan sát timestamp), gửi request đăng nhập.
- **6. Multi-tier Validation Points (Expected Results):**
  - *API / Network:* HTTP Status code trả về **`403 Forbidden`**.
  - *Database State:* `Date.now() < new Date(user.locked_until)` vẫn thỏa mãn $\to$ Hệ thống chặn yêu cầu xác thực.
- **7. Teardown & Clean-up:** Chờ tiếp 1 giây để thực hiện `TC_FR02_10`.

###### Test Case `TC_FR02_10`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_10` | **Priority:** Critical (P0) | **Target Component:** Lockout Boundary On-point Transition
  - **Traceability:** SRS FR-02 (Thời gian khóa 30 giây) | **Coverage IDs:** `EP-02-14`, `BVA-02-02-ON` ($t = 30s$)
- **2. Test Objective:** Verify automatic account unlock transition at exact boundary expiration t=30s.
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` bị khóa tại $T_0$.
  - Đồng hồ đếm thời gian chạm mốc đúng 30 giây ($t = 30s$).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"`
- **5. Step-by-Step Procedure:**
  1. Tại mốc $t = 30s$, gửi request đăng nhập với mật khẩu đúng `Test1234!`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Đăng nhập thành công, tự động chuyển trang về `/`.
  - *API / Network:* HTTP Status code trả về **`200 OK`**, cấp JWT token mới.
  - *Database State:* Khóa tự động hết hiệu lực (`Date.now() >= new Date(user.locked_until)`), `login_attempts` được reset về `0`, `locked_until` được giải phóng.
- **7. Teardown & Clean-up:** Xóa token phiên làm việc.

###### Test Case `TC_FR02_11`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_11` | **Priority:** Normal (P2) | **Target Component:** Post-lockout Stability
  - **Traceability:** SRS FR-02 | **Coverage IDs:** `EP-02-14`, `BVA-02-02-IN` ($t = 31s$)
- **2. Test Objective:** Verify login authentication success at boundary offset t=31s (1s after unlock threshold).
- **3. Pre-conditions & Environment:**
  - Đã trôi qua 31 giây kể từ thời điểm tài khoản bị khóa ($t = 31s > 30s$).
- **4. Test Data:** `email = "test@eshop.com"`, `password = "Test1234!"`
- **5. Step-by-Step Procedure:**
  1. Gửi request đăng nhập tại mốc $t = 31s$.
- **6. Multi-tier Validation Points (Expected Results):**
  - *API / Network:* HTTP Status `200 OK`, cấp JWT token bình thường.
  - *Database State:* Hệ thống hoạt động ở trạng thái bình thường ổn định.
- **7. Teardown & Clean-up:** Đăng xuất tài khoản.

###### Test Case `TC_FR02_12`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_12` | **Priority:** Medium (P2) | **Target Component:** Lockout Policy Verification
  - **Traceability:** SRS FR-02 (Chu kỳ khóa lặp lại) | **Coverage IDs:** `EP-02-12`, `BVA-02-01-ON`
- **2. Test Objective:** Validate lockout duration non-escalation behavior on repeated second lockout cycle.
- **3. Pre-conditions & Environment:**
  - Tài khoản `test@eshop.com` vừa kết thúc chu kỳ khóa thứ nhất và đã được giải tỏa hoàn toàn.
- **4. Test Data:** Gửi 3 lần mật khẩu sai liên tiếp: `Wrong1!`, `Wrong2!`, `Wrong3!`.
- **5. Step-by-Step Procedure:**
  1. Thực hiện 3 lần đăng nhập sai liên tiếp trên cùng tài khoản.
  2. Ghi nhận thời điểm khóa lần 2 và kiểm tra thời hạn `locked_until`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Hành vi theo SRS:* SRS FR-02 không định nghĩa cơ chế phạt lũy tiến (Exponential Backoff). Do đó, thời gian tạm khóa lần 2 vẫn phải là **đúng 30 giây** (`locked_until = now + 30s`).
  - *Ghi chú đánh giá:* Nếu SUT tự động tăng lên 60s hay 180s mà không có trong SRS, đây là một điểm sai lệch cần ghi nhận vào Bug Report.
- **7. Teardown & Clean-up:** Chạy script khôi phục CSDL SQLite: `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE email = 'test@eshop.com'`.

---

##### Nhóm 4: Phân Vùng Đơn Lỗi & Biên Chuỗi Độ Dài (Single-Fault & String Length Boundaries)

###### Test Case `TC_FR02_16`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_16` | **Priority:** Medium (P2) | **Target Component:** Client & Server Input Validation
  - **Traceability:** SRS FR-02 (Item 5: `type="email"` HTML5) | **Coverage IDs:** `EP-02-04` (Whitespace-only)
  - **Single-Fault Isolation:** Mật khẩu hợp lệ `Test1234!`; biến lỗi duy nhất là email chỉ gồm khoảng trắng.
- **2. Test Objective:** Validate rejection of email input containing only whitespace characters on Web Client & API.
- **3. Pre-conditions & Environment:** Form đăng nhập mở tại `http://localhost:5173/login`.
- **4. Test Data:** `email = "     "`, `password = "Test1234!"`
- **5. Step-by-Step Procedure:**
  1. Nhập 5 dấu cách `"     "` vào ô Email.
  2. Nhập mật khẩu đúng `Test1234!`.
  3. Bấm "Sign In".
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Client:* Trình duyệt kích hoạt HTML5 validation yêu cầu điền trường hợp lệ hoặc form tự trim khoảng trắng và báo lỗi định dạng email. Không cho phép gửi request hợp lệ.
  - *API / Network (nếu bypass UI):* Backend trả về HTTP `400 Bad Request` hoặc `401 Unauthorized`.
- **7. Teardown & Clean-up:** Xóa trắng ô input.

###### Test Case `TC_FR02_17` & `TC_FR02_18` (Biên Độ Dài Email Chuẩn RFC 5321)
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_17` (Off-point: 255 chars) & `TC_FR02_18` (On-point: 254 chars)
  - **Traceability:** RFC 5321 §4.5.3.1.3 & SRS FR-02 | **Coverage IDs:** `BVA-02-05-OFF`, `BVA-02-05-ON`, `EP-02-04b`
  - **Single-Fault Isolation:** Giữ mật khẩu hợp lệ cơ sở; chỉ biến đổi độ dài chuỗi email.
- **2. Test Objective:** Validate boundary rejection at Len=255 and acceptance at Len=254 for email inputs according to RFC 5321 standards.
- **3. Test Data:**
  - `TC_FR02_18` (On-point): Email dài đúng 254 ký tự: `"a"*243 + "@eshop.com"`.
  - `TC_FR02_17` (Off-point): Email dài đúng 255 ký tự: `"a"*244 + "@eshop.com"`.
- **4. Multi-tier Validation Points (Expected Results):**
  - Với chuỗi 254 ký tự (`TC_FR02_18`): Hệ thống chấp nhận chuỗi đầu vào để xác thực (HTTP 200 nếu đã seed tài khoản, hoặc HTTP 401 do chưa có user nhưng không bị lỗi tràn buffer/bad request format).
  - Với chuỗi 255 ký tự (`TC_FR02_17`): Hệ thống từ chối do vượt quá độ dài chuẩn email quốc tế RFC 5321 (HTTP 400 Bad Request hoặc chặn trên giao diện); không gây lỗi sập server `500 Internal Server Error`.
- **5. Teardown & Clean-up:** Xóa sạch dữ liệu test.

###### Test Case `TC_FR02_22` & `TC_FR02_23` (Biên Độ Dài Mật Khẩu Min 8 & Max 255)
- **1. Tracking Information:**
  - **TC ID:** `TC_FR02_22` (Min Off-point: 7 chars) & `TC_FR02_23` (Max Off-point: 256 chars)
  - **Traceability:** SRS FR-01/02 & OWASP ASVS | **Coverage IDs:** `BVA-02-03-OFF` ($Len=7$), `BVA-02-06-OFF` ($Len=256$)
- **2. Test Objective:** Validate rejection of sub-minimum 7-char password and graceful handling of 256-char password exceeding OWASP limits.
- **3. Test Data:**
  - `TC_FR02_22`: `email = "test@eshop.com"`, `password = "Pass12!"` (7 ký tự, thiếu 1 ký tự so với quy tắc mật khẩu mạnh).
  - `TC_FR02_23`: `email = "test@eshop.com"`, `password = "P"*254 + "1!"` (256 ký tự).
- **4. Multi-tier Validation Points (Expected Results):**
  - Với mật khẩu 7 ký tự (`TC_FR02_22`): HTTP 401 Unauthorized, tăng bộ đếm sai thêm 1 đơn vị.
  - Với mật khẩu 256 ký tự (`TC_FR02_23`): Hệ thống xử lý an toàn, phản hồi trong thời gian $\le 1$ giây, không làm treo thread Node.js do tính toán băm chuỗi cực đại (chống Hash DoS).
- **5. Teardown & Clean-up:** Khôi phục `login_attempts = 0` nếu cần.

### 2.5 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ (Step 5 Deliverables)

> **Mục tiêu kiểm định:** Xác minh tính toàn diện của bộ kiểm thử bằng cách ánh xạ 100% các phân vùng tương đương (VEP / IEP) và các giá trị biên (On / Off / In) tới ít nhất một kịch bản kiểm thử cụ thể.

#### 5.1. Bảng Độ Bao Phủ Phân Vùng Tương Đương (Equivalence Partition Coverage)

| Class ID | Variable / Field | Type | Mô tả phân vùng tương đương | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `EP-02-01` | `email` | **VEP** | Email đúng định dạng và tài khoản tồn tại trong CSDL | `TC_FR02_01`, `TC_FR02_02`, `TC_FR02_18` | **Covered** |
| `EP-02-02` | `email` | **IEP** | Email không đúng định dạng cú pháp HTML5/RFC (thiếu `@`) | `TC_FR02_14` | **Covered** |
| `EP-02-03` | `email` | **IEP** | Email để trống / chuỗi rỗng (`""`) | `TC_FR02_15` | **Covered** |
| `EP-02-04` | `email` | **IEP** | Email chỉ chứa toàn khoảng trắng (`"     "`) | `TC_FR02_16` | **Covered** |
| `EP-02-04b`| `email` | **IEP** | Email vượt độ dài tối đa chuẩn RFC 5321 ($Len > 254$) | `TC_FR02_17` | **Covered** |
| `EP-02-05` | `email` | **IEP** | Email đúng cú pháp nhưng chưa đăng ký trong CSDL | `TC_FR02_19` | **Covered** |
| `EP-02-06` | `password` | **VEP** | Mật khẩu khớp chính xác với tài khoản trong CSDL | `TC_FR02_01`, `TC_FR02_02`, `TC_FR02_05`, `TC_FR02_24` | **Covered** |
| `EP-02-07` | `password` | **IEP** | Mật khẩu sai / không khớp CSDL | `TC_FR02_03`, `TC_FR02_04`, `TC_FR02_06`, `TC_FR02_22` | **Covered** |
| `EP-02-08` | `password` | **IEP** | Mật khẩu để trống / chuỗi rỗng (`""`) | `TC_FR02_20` | **Covered** |
| `EP-02-09` | `password` | **IEP** | Mật khẩu chỉ chứa toàn khoảng trắng (`"    "`) | `TC_FR02_21` | **Covered** |
| `EP-02-09b`| `password` | **IEP** | Mật khẩu vượt độ dài an toàn OWASP ASVS ($Len > 255$) | `TC_FR02_23` | **Covered** |
| `EP-02-10` | `failed_attempts` | **VEP** | Thử sai dưới ngưỡng ($1 \le N \le 2$), nhập đúng $\to$ reset về 0 | `TC_FR02_05` | **Covered** |
| `EP-02-11` | `failed_attempts` | **IEP** | Số lần sai đạt/vượt ngưỡng ($N \ge 3$) $\to$ kích hoạt khóa | `TC_FR02_06`, `TC_FR02_13` | **Covered** |
| `EP-02-12` | `failed_attempts` | **IEP** | Chu kỳ khóa lặp lại lần 2 (Second lockout cycle) | `TC_FR02_12` | **Covered** |
| `EP-02-13a` | `lockout_time` | **IEP** | Trong thời gian tạm khóa ($0 \le t < 30s$) – Thử pass đúng | `TC_FR02_07`, `TC_FR02_09` | **Covered** |
| `EP-02-13b` | `lockout_time` | **IEP** | Trong thời gian tạm khóa ($0 \le t < 30s$) – Thử pass sai (timer probe) | `TC_FR02_08` | **Covered** |
| `EP-02-14` | `lockout_time` | **VEP** | Hết thời gian tạm khóa ($t \ge 30s$) – Tự động mở khóa | `TC_FR02_10`, `TC_FR02_11` | **Covered** |

---

#### 5.2. Bảng Độ Bao Phủ Phân Tích Giá Trị Biên (Boundary Value Coverage)

| Boundary ID | Biến / Điều kiện | Điểm biên (Point Type) | Giá trị kiểm thử | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `BVA-02-01` | Ngưỡng số lần thử sai ($N \ge 3$) | **On-point** | $N = 3$ (Kích hoạt khóa) | `TC_FR02_06`, `TC_FR02_12` | **Covered** |
| | | **Off-point** | $N = 2$ (Chưa bị khóa) | `TC_FR02_04` | **Covered** |
| | | **In-point** | $N = 4$ (Đang bị khóa) | `TC_FR02_13` | **Covered** |
| `BVA-02-02` | Thời gian tạm khóa ($t \ge 30s$) | **On-point** | $t = 30s$ (Ranh giới mở khóa) | `TC_FR02_10` | **Covered** |
| | | **Off-point** | $t = 29s$ (Vẫn bị khóa) | `TC_FR02_07`, `TC_FR02_09` | **Covered** |
| | | **In-point** | $t = 31s$ (Đã mở khóa) | `TC_FR02_11` | **Covered** |
| `BVA-02-03` | Độ dài mật khẩu min ($Len \ge 8$) | **On-point** | $Len = 8$ (`Pass123!`) | `TC_FR02_02` | **Covered** |
| | | **Off-point** | $Len = 7$ (`Pass12!`) | `TC_FR02_22` | **Covered** |
| | | **In-point** | $Len = 9$ (`Test1234!`) | `TC_FR02_01` | **Covered** |
| `BVA-02-04` | Sequence reset ($N = 1, 2$) | **On-point** | $N = 2 \to$ Đúng (Reset 0) | `TC_FR02_04`, `TC_FR02_05` | **Covered** |
| | | **Off-point** | $N = 3 \to$ Sai (Khóa 30s) | `TC_FR02_06` | **Covered** |
| | | **In-point** | $N = 1 \to$ Sai ($N$ tăng 1) | `TC_FR02_03` | **Covered** |
| `BVA-02-05` | Email max RFC ($Len \le 254$) | **On-point** | $Len = 254$ (Max hợp lệ) | `TC_FR02_18` | **Covered** |
| | | **Off-point** | $Len = 255$ (Vượt chuẩn RFC) | `TC_FR02_17` | **Covered** |
| | | **In-point** | $Len = 253$ (Cận biên trong) | `TC_FR02_01` | **Covered** |
| `BVA-02-06` | Pass max OWASP ($Len \le 255$) | **On-point** | $Len = 255$ (Max an toàn) | `TC_FR02_24` | **Covered** |
| | | **Off-point** | $Len = 256$ (Vượt ngưỡng an toàn) | `TC_FR02_23` | **Covered** |
| | | **In-point** | $Len = 254$ (Cận biên trong) | `TC_FR02_01` | **Covered** |

---

#### 5.3. Bảng Tổng Hợp Chỉ Số Độ Bao Phủ (Coverage Summary)

| Chỉ số kiểm thử (Metric) | Tổng số nhận diện | Đã bao phủ (Covered) | Chưa bao phủ / Bị chặn | Tỷ lệ bao phủ (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Phân vùng hợp lệ (VEP)** | 4 | 4 | 0 | **100.0%** |
| **Phân vùng không hợp lệ (IEP)** | 13 | 13 | 0 | **100.0%** |
| **Giá trị biên (On / Off / In Points)** | 18 | 18 | 0 | **100.0%** |
| **Tổng số kịch bản kiểm thử (Test Cases)** | 24 | 24 | 0 | **100.0%** |
| **Bảo đảm Giả định Đơn lỗi (Single-Fault Isolation)** | 13 / 13 IEPs | 13 | 0 | **100.0%** |

### 2.6 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT (Step 6 Deliverables)

> **Mục đích:** Cung cấp minh chứng cho **Mục 6 Task 3 (AI Gap Analysis)** và làm luận cứ cho **Mục 10 (AI Critique)** của bài tập HW02, phân tách rạch ròi giữa kịch bản kiểm thử theo đặc tả và các giả thuyết khiếm khuyết nội bộ hệ thống.

#### 6.1. Bảng Phân Tích Khoảng Trống Kiểm Thử Của AI (AI Gap Analysis)

| Hạng mục / Điều kiện kiểm thử | Nguyên nhân AI bỏ sót hoặc gặp khó khăn | Hiệu chỉnh của con người (Human Fix Applied) | Căn cứ Tiêu chuẩn & Kỹ thuật Kiểm thử |
| :--- | :--- | :--- | :--- |
| **Chuỗi khoảng trắng (Whitespace-only Strings)** | Mô hình AI mặc định coi chuỗi rỗng (`""`) là đủ cho phân vùng không hợp lệ; bỏ qua trường hợp chuỗi chỉ chứa dấu cách (`"     "`) có thể ngụy trang vượt qua validation lỏng lẻo. | Bổ sung phân vùng `EP-02-04` và `EP-02-09` kèm các test case kiểm tra cơ chế trim/reject (`TC_FR02_16`, `TC_FR02_21`). | **ISTQB FL §4.2.1:** Phân chia triệt để các lớp tương đương của dữ liệu chuỗi (Null vs Empty vs Whitespace). |
| **Tuần tự chuyển trạng thái & Reset bộ đếm ($N \to 0$)** | AI thiết kế kiểm thử theo tư duy tĩnh (Stateless input mapping), chỉ xét các giá trị riêng lẻ ($N=1, 2, 3$) mà bỏ quên kiểm chứng chuỗi tương tác thời gian (Temporal sequence). | Thiết lập kịch bản `TC_FR02_05` (`BVA-02-04-ON`): đăng nhập đúng sau 2 lần sai để xác nhận biến trạng thái `login_attempts` phải được reset về 0. | **ISTQB FL §4.2.4 & §4.2.1:** Kiểm thử chuyển đổi trạng thái kết hợp phân vùng điều kiện tuần tự. |
| **Thăm dò Reset Timer trong thời gian khóa ($0 \le t < 30s$)** | Do SRS chỉ nêu thời gian khóa 30 giây mà không mô tả hành vi khi có request sai trong lúc khóa, AI mặc định chỉ trả về 403 mà không đánh giá nguy cơ timer bị reset kéo dài vô cớ. | Bổ sung kịch bản thăm dò `TC_FR02_08` (`EP-02-13b`) để xác nhận lần thử sai trong lúc đang khóa không được phép reset lại đồng hồ đếm 30s ban đầu. | **Exploratory State Testing:** Kiểm tra tính toàn vẹn của máy trạng thái và bộ đếm thời gian phạt. |
| **Cận trên độ dài chuỗi (Email & Password Max Length)** | Đặc tả SRS không ghi rõ độ dài tối đa cho Email/Password; AI có xu hướng dừng lại ở việc không test cận trên (Open-ended boundary). | Con người chủ động truy nguyên chuẩn RFC 5321 (Email $\le 254$ ký tự) và chuẩn an toàn OWASP ASVS (Password $\le 255$ ký tự để chống DoS băm mật khẩu); bổ sung `BVA-02-05` và `BVA-02-06`. | **ISTQB FL §4.2.2 & RFC 5321 / OWASP ASVS:** Bổ sung các giá trị biên kỹ thuật dựa trên tiêu chuẩn quốc tế khi đặc tả ngầm định. |
| **Trạng thái tài khoản Bị cấm / Vô hiệu hóa (Banned/Inactive)** | Khi người dùng đề xuất kiểm thử trạng thái banned/inactive, AI cần kiểm chứng chéo với tài liệu SRS và cấu trúc CSDL thực tế thay vì tự tiện bịa đặt kịch bản nghiệp vụ. | Con người và AI rà soát mã nguồn CSDL SQLite (`backend/database.js`), xác nhận bảng `users` không có trường `status`/`banned`; chuyển trạng thái này sang mục Khoảng trống Đặc tả. | **Nguyên tắc "Đặc tả là căn cứ duy nhất":** Không tự ý bịa đặt trạng thái hệ thống khi SRS không hỗ trợ. |

---

#### 6.2. Danh Sách Giả Thuyết Khiếm Khuyết Thăm Dò Trên SUT (Candidate Defect Hypotheses)

> *Ghi chú: Toàn bộ các giả thuyết dưới đây được gắn nhãn `[Exploratory - Unconfirmed Hypothesis - Requires SUT execution]` và sẽ được kiểm chứng thực tế trong Giai đoạn 3 trên hệ thống EShop đang chạy.*

| Hypothesis ID | Khu vực kiểm thử (Target Area) | Mô tả giả thuyết lỗi (Description) | Kỳ vọng theo đặc tả (Spec Expected) | Dự đoán hành vi thực tế (Hypothesized Actual) | Bước kiểm chứng trên SUT (Verification Step) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `HYP-02-01` | Backend API (`server.js:54`) | Bộ đếm số lần sai tăng sai bước nhảy ($+2$ thay vì $+1$) | SRS FR-02: *"Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị."* | Backend thực hiện phép tính `newAttempts = user.login_attempts + 2` $\to$ Nhập sai lần 1 đã nhảy lên 2, sai lần 2 đã chạm mốc 4 và khóa ngay lập tức! | Thực thi `TC_FR02_03` & `TC_FR02_04`, kiểm tra trực tiếp cột `login_attempts` trong file `database.sqlite` sau lần sai thứ 1. |
| `HYP-02-02` | Backend Lockout (`server.js:57`) | Thời gian khóa thực tế sai lệch nghiêm trọng so với đặc tả demo | SRS FR-02: *"Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo)."* | Mã nguồn backend gán `Date.now() + 180000` (180 giây = 3 phút)! Người dùng bị khóa tới 3 phút thay vì 30 giây. | Thực thi `TC_FR02_10` tại mốc $t = 30s$; nếu backend vẫn trả về HTTP 403 đến phút thứ 3 thì giả thuyết được xác nhận. |
| `HYP-02-03` | Frontend UI (`Login.jsx:30, 40`) | Sai thuộc tính `type` của ô input Email và Password | SRS FR-02: *"Trường email phải dùng `type="email"` (có validate HTML5 format)."* Mật khẩu phải ẩn ký tự (`type="password"`). | Input email dùng `type="text"` (mất validate HTML5); input password dùng `type="text"` làm lộ mật khẩu dạng bản rõ (plaintext) trên màn hình! | Mở DevTools Elements trên `http://localhost:5173/login`, inspect thẻ `<input>` của trường Email và Password. |
| `HYP-02-04` | Frontend UI (`Login.jsx:24`) | Tiêu đề giao diện Đăng nhập bị hiển thị sai thành "Đăng Ký" | Giao diện đăng nhập phải hiển thị tiêu đề nhất quán: "Đăng Nhập" hoặc "Sign In". | Mã nguồn React hardcode: `<h2 ...>Đăng Ký</h2>` tại trang Login gây hoang mang cho người dùng. | Mở `http://localhost:5173/login` trên trình duyệt và quan sát thẻ `<h2>` đầu trang. |
| `HYP-02-05` | Backend State (`server.js:48, 54`) | Bộ đếm thử sai không được tự động giải phóng sau khi hết hạn 30s | Sau khi hết 30s khóa, nếu người dùng thử lại sai 1 lần thì phải tính là lần sai thứ 1 ($N=1$). | CSDL không tự reset `login_attempts` khi hết hạn. Nếu người dùng nhập sai tiếp, `newAttempts = 3 + 2 = 5` và lập tức bị khóa tiếp lần 2 chỉ sau đúng 1 lần thử sai! | Thực thi `TC_FR02_12` sau khi hết thời gian khóa lần 1; quan sát số lần thử cần thiết để kích hoạt khóa lần 2. |

---

## 3. TÍNH NĂNG B (POOL B): FR-07 – GIỎ HÀNG (SHOPPING CART)

### 3.1 Bước 1: Nhận diện biến đầu vào & Ràng buộc (Step 1 Deliverables)
> **Trích dẫn đặc tả SRS FR-07 (Giỏ hàng):**
> - Hiển thị danh sách sản phẩm với các cột: **Sản phẩm**, **Đơn giá**, **Số lượng** (có nút +/- để chỉnh), **Thành tiền**, **Thao tác**.
> - Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới.
> - Nút **Xóa sản phẩm** phải có dialog xác nhận trước khi thực hiện.
> - Có nút **Tiếp tục mua sắm** để quay về trang chủ.
> - Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính").
> - Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng.
>
> *(Đối chiếu SRS FR-06: "Có ô nhập Số lượng (chỉ nhận số nguyên dương, tối thiểu là 1). Nút Thêm vào giỏ hàng — sau khi bấm hiển thị phản hồi trực quan"; SRS FR-08: "Tổng tiền thanh toán được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.")*

| Variable ID | Variable Name | Data Type | Mandatory? | Precision ($\epsilon$) | Specification Constraint (Quote) | Assumptions / Ambiguities |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| `VAR-07-01` | `product_id` (hoặc sản phẩm trong giỏ) | Integer | Có | 1 | Trích dẫn SRS FR-07: *"Hiển thị danh sách sản phẩm với các cột: Sản phẩm..."* và *"Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."* | Sản phẩm phải tồn tại trong CSDL (`products` table). Phân biệt 2 tình huống: thêm sản phẩm mới (chưa có trong giỏ $\to$ tạo dòng mới) và thêm sản phẩm trùng lặp (đã có trong giỏ $\to$ cộng dồn số lượng vào dòng hiện tại). |
| `VAR-07-02` | `quantity` (Số lượng sản phẩm) | Integer | Có | 1 đơn vị | Trích dẫn SRS FR-07: *"Số lượng (có nút +/- để chỉnh)"* (Đối chiếu FR-06: *"Có ô nhập Số lượng (chỉ nhận số nguyên dương, tối thiểu là 1)"*) | Số nguyên dương $quantity \ge 1$. Đặc tả SRS không định nghĩa số lượng tối đa hay ràng buộc tồn kho (`stock_quantity`) trong CSDL (bảng `products` thực tế không có cột tồn kho). Cần kiểm tra cận biên số học, nhập số 0, số âm, số thập phân hoặc chuỗi phi số. |
| `VAR-07-03` | `unit_price` (Đơn giá sản phẩm) | Integer / ₫ | Hệ thống | 1 ₫ | Trích dẫn SRS FR-07: *"cột: Sản phẩm, Đơn giá..."* | Lấy trực tiếp từ bảng `products.price` trong CSDL; là số nguyên dương $> 0$. Người dùng không được phép chỉnh sửa đơn giá trên giao diện giỏ hàng. |
| `VAR-07-04` | `subtotal` (Thành tiền từng dòng) | Integer / ₫ | Hệ thống | 1 ₫ | Trích dẫn SRS FR-07: *"cột: ... Thành tiền"* | Công thức tính toán: $Subtotal = unit\_price \times quantity$. Cập nhật tức thời (reactive) khi thay đổi số lượng. |
| `VAR-07-05` | `total_amount` & `total_label` (Tổng tiền & Nhãn hiển thị) | Compound (Integer & String) | Hệ thống | 1 ₫ / Text | Trích dẫn SRS FR-07: *"Tổng tiền hiển thị nhãn chính xác: 'Tổng cộng' (không phải 'Tổng tạm tính')."* | Tổng tiền bằng tổng các thành tiền: $Total = \sum Subtotal$. Nhãn văn bản hiển thị cạnh số tiền tổng bắt buộc phải là `"Tổng cộng"`; bất kỳ nhãn nào như `"Tổng tạm tính"` hay `"Subtotal"` đều bị coi là lỗi vi phạm đặc tả. |
| `VAR-07-06` | `cart_state` (Trạng thái giỏ hàng) | Categorical | Hệ thống | N/A | Trích dẫn SRS FR-07: *"Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng."* | Trạng thái hiển thị gồm 2 miền: Trống ($Items = 0$) và Có sản phẩm ($Items \ge 1$). Khi giỏ trống, hệ thống bắt buộc phải hiển thị đồng thời cả hình minh họa (illustration image) và câu thông báo rõ ràng. |
| `VAR-07-07` | `button_decrement_action` (Thao tác nút `-` tại biên số lượng) | Interaction / Action | Tương tác | N/A | Trích dẫn SRS FR-07: *"Số lượng (có nút +/- để chỉnh)"* và *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."* | Khi $quantity > 1$, bấm `-` giảm 1 đơn vị. Khi $quantity = 1$, bấm `-` là điểm biên chuyển đổi trạng thái: hệ thống cần disable nút hoặc nếu xem là hành vi xóa sản phẩm thì bắt buộc phải kích hoạt dialog xác nhận xóa, không được tự ý xóa mà không hỏi hoặc giảm về 0 / số âm. |
| `VAR-07-08` | `button_delete_action` & `dialog_confirmation` (Nút Xóa & Dialog xác nhận) | Boolean (Confirm / Cancel) | Tương tác | N/A | Trích dẫn SRS FR-07: *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."* | Bấm nút "Xóa" bắt buộc phải hiển thị dialog xác nhận. Nếu người dùng chọn Hủy (`Cancel`), giữ nguyên sản phẩm trong giỏ; chỉ khi chọn Đồng ý (`Confirm`), sản phẩm mới bị xóa khỏi giỏ và tính lại tổng tiền. |
| `VAR-07-09` | `continue_shopping_navigation` (Nút Tiếp tục mua sắm) | Action / Route | Tương tác | N/A | Trích dẫn SRS FR-07: *"Có nút Tiếp tục mua sắm để quay về trang chủ."* | Nút bấm hoặc liên kết điều hướng phải đưa người dùng quay trở lại trang chủ (`/`) một cách an toàn mà không làm mất trạng thái giỏ hàng. |

#### 3.2 Bước 2: Phân vùng tương đương (Step 2 Deliverables)

> **Nguyên tắc Giả định Đơn lỗi (Single Fault Assumption - ISTQB FL §4.2.1) & Tách bạch Phạm vi Kiểm thử:**
> - **Phân tách rõ ràng 3 lớp khái niệm:** Để đảm bảo số liệu đo lường độ bao phủ EP mang ý nghĩa chuẩn xác và không bị thổi phồng, thiết kế phân tách rõ giữa: (1) Các phân vùng tương đương biến đầu vào thực thụ (Input EPs); (2) Các quy tắc nghiệp vụ, chuyển trạng thái và kịch bản tương tác (State & Interaction Rules); và (3) Các điểm kiểm chứng giao diện / giả thuyết khiếm khuyết (Assertions & Defect Probes).
> - **Nguyên tắc Single-Fault Isolation:** Khi kiểm thử một phân vùng không hợp lệ (IEP), chỉ duy nhất 1 điều kiện hoặc biến mang giá trị sai; toàn bộ các tham số còn lại bắt buộc phải giữ ở giá trị hợp lệ cơ sở (Baseline).
> - **Căn cứ đặc tả:** Căn cứ duy nhất là SRS FR-07 và FR-06. Số lượng $Q$ là số nguyên dương $Q \ge 1$ (không tự ý đặt cận trên 99 khi SRS không quy định).

#### 3.2.1 Bảng Phân Vùng Tương Đương Biến Đầu Vào (Pure Input Equivalence Partitions)

| Class ID | Variable / Input | Domain / Sub-condition | Type (VEP / IEP) | Representative Value | Single-Fault Baseline / Rationale |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `EP-07-01` | `product_id` | Mã sản phẩm hợp lệ và tồn tại trong CSDL | VEP | `id = 1` (iPhone 15 Pro Max) | Giỏ hàng ban đầu chưa có sản phẩm ID 1. Hệ thống tạo thêm đúng 1 dòng mới trong bảng giỏ hàng với số lượng ban đầu. |
| `EP-07-02` | `product_id` | Mã sản phẩm đúng định dạng số nhưng không tồn tại trong CSDL | IEP | `id = 9999` | Gửi request thêm sản phẩm với ID không tồn tại. Cô lập lỗi ID không có trong CSDL; hệ thống từ chối hoặc trả về lỗi 404/400. |
| `EP-07-03` | `product_id` | Mã sản phẩm sai định dạng / sai kiểu dữ liệu (Malformed ID) | IEP | `id = "abc"` (hoặc `-1`) | Request gửi qua API `POST /api/cart` hoặc route. Cô lập lỗi sai kiểu dữ liệu (String/Negative thay vì positive integer); hệ thống từ chối dữ liệu rác. |
| `EP-07-04` | `quantity` | Số lượng nguyên dương hợp lệ ($Q \in \mathbb{Z}, Q \ge 1$) | VEP | $Q = 2$ | Sản phẩm hợp lệ trong giỏ. Đặc tả SRS FR-06/FR-07 quy định: *"chỉ nhận số nguyên dương, tối thiểu là 1"*, không đặt cận trên 99 hay giới hạn tồn kho. Cập nhật số lượng và tính lại thành tiền. |
| `EP-07-05` | `quantity` | Số lượng bằng 0 ($Q = 0$) | IEP | $Q = 0$ | Sản phẩm hợp lệ trong giỏ. Cô lập vi phạm quy tắc số nguyên dương tối thiểu là 1; hệ thống từ chối hoặc yêu cầu xác nhận xóa, không được lưu $Q=0$. |
| `EP-07-06` | `quantity` | Số lượng là số nguyên âm ($Q < 0$) | IEP | $Q = -1$ (hoặc $-5$) | Sản phẩm hợp lệ trong giỏ. Cô lập lỗi số âm; hệ thống từ chối hoặc tự động phục hồi về 1, không làm âm tổng tiền giỏ hàng. |
| `EP-07-07` | `quantity` | Chuỗi rỗng / để trống ô số lượng | IEP | $Q = \text{""}$ | Sản phẩm hợp lệ trong giỏ. Cô lập lỗi thiếu giá trị bắt buộc; hệ thống chặn submit hoặc khôi phục giá trị hợp lệ trước đó. |
| `EP-07-08` | `quantity` | Chuỗi chỉ chứa khoảng trắng (Whitespace-only) | IEP | $Q = \text{"   "}$ | Sản phẩm hợp lệ trong giỏ. Cô lập lỗi chuỗi rỗng ngụy trang; hệ thống chặn submit hoặc trim và báo lỗi. |
| `EP-07-09` | `quantity` | Ký tự phi số (Chữ cái, ký hiệu đặc biệt) | IEP | $Q = \text{"abc"}$ hoặc $\text{"@#\$"}$ | Sản phẩm hợp lệ trong giỏ. Input `type="number"` hoặc validator chặn ký tự chữ, không để xảy ra lỗi tính toán `NaN`. |
| `EP-07-10` | `quantity` | Số thập phân / số thực không nguyên | IEP | $Q = 1.5$ (hoặc $2.5$) | Sản phẩm hợp lệ trong giỏ. Cô lập lỗi vi phạm quy tắc "chỉ nhận số nguyên dương" (FR-06/FR-07); từ chối dấu chấm/phẩy thập phân. |
| `EP-07-11` | `quantity` | Bị bỏ khuyết hoặc giá trị `null` trong payload API | IEP | `quantity: null` hoặc omitted | Gửi request `POST /api/cart` không truyền `quantity` hoặc truyền `null`. Cô lập lỗi khuyết trường bắt buộc; backend trả về lỗi 400. |
| `EP-07-12` | `quantity` | Số nguyên cực lớn kiểm thử độ bền số học (Robustness / Stress) | IEP (Stress) | $Q = 10^9$ (1 tỷ đơn vị) | Sản phẩm hợp lệ trong giỏ. Kiểm tra độ bền hệ thống, không để tràn số nguyên JavaScript hoặc biến thành `Infinity`. |

#### 3.2.2 Bảng Phân Tích Quy Tắc Nghiệp Vụ, Trạng Thái & Tương Tác (Business Rules, State & Interaction Scenarios)

| Rule / State ID | Hạng mục | Quy tắc nghiệp vụ & Hành vi tương tác | Phân loại | Dữ liệu / Kịch bản đại diện | Kết quả mong đợi theo Đặc tả SRS |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `RULE-07-01` | Trùng sản phẩm | Thêm sản phẩm đã tồn tại sẵn trong giỏ hàng | Business Rule | Giỏ đã có SP1 ($Q=1$). Thêm tiếp SP1 với $Q_{add}=1$. | Tăng số lượng thành $Q = 1 + 1 = 2$ trên cùng dòng sản phẩm; tuyệt đối **không tạo dòng mới** (SRS FR-07). |
| `RULE-07-02` | Thành tiền dòng | Tính toán Thành tiền cho từng dòng sản phẩm | Calculation Rule | SP1: Đơn giá $30.000.000\text{ ₫}$, Số lượng $2$ | Công thức: $Subtotal = unit\_price \times quantity = 60.000.000\text{ ₫}$. Cập nhật tức thời khi đổi số lượng. |
| `RULE-07-03` | Tổng tiền giỏ | Tính toán Tổng tiền toàn bộ giỏ hàng | Calculation Rule | SP1 ($Subtotal = 60.000.000\text{ ₫}$) + SP2 ($Subtotal = 6.000.000\text{ ₫}$) | Công thức: $Total = \sum Subtotal = 66.000.000\text{ ₫}$. |
| `STATE-07-01` | Trạng thái giỏ | Giỏ hàng có sản phẩm ($Items \ge 1$) | Valid State | Giỏ có 1 hoặc nhiều mặt hàng | Hiển thị bảng chi tiết gồm đủ 5 cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác; cùng tổng tiền và nút thanh toán. |
| `STATE-07-02` | Trạng thái giỏ | Giỏ hàng trống hoàn toàn ($Items = 0$) | Valid State | Giỏ rỗng ($0$ sản phẩm) | Ẩn bảng sản phẩm; bắt buộc hiển thị đồng thời cả **hình minh họa** (illustration) và thông báo giỏ hàng trống rõ ràng. |
| `ACTION-07-01` | Nút `-` | Bấm nút `-` khi số lượng lớn hơn 1 ($Q > 1$) | Interaction | Đang có $Q=2$, click nút `-` | Số lượng giảm đúng 1 đơn vị ($Q = 1$), thành tiền và tổng tiền lập tức cập nhật lại. |
| `ACTION-07-02` | Nút `-` | Bấm nút `-` khi số lượng chạm biên tối thiểu ($Q = 1$) | State Transition / Ambiguity | Đang có $Q=1$, click nút `-` | **Ghi nhận độ mơ hồ đặc tả:** SRS FR-07 không nêu rõ nút `-` sẽ bị vô hiệu hóa (disabled) để giữ $Q \ge 1$ hay sẽ kích hoạt dialog xác nhận xóa sản phẩm. Hệ thống tuyệt đối không được tự ý xóa không hỏi hoặc giảm âm. |
| `ACTION-07-03` | Nút "Xóa" | Bấm nút "Xóa" $\to$ Xác nhận Đồng ý (Confirm) | Interaction / Modal | Click Xóa $\to$ Click "OK / Confirm" trên dialog | Hiển thị dialog xác nhận; khi bấm OK, dòng sản phẩm bị xóa khỏi giỏ và cập nhật lại tổng tiền. |
| `ACTION-07-04` | Nút "Xóa" | Bấm nút "Xóa" $\to$ Hủy bỏ thao tác (Cancel) | Interaction / Modal | Click Xóa $\to$ Click "Cancel / Hủy" trên dialog | Hiển thị dialog xác nhận; khi bấm Cancel, sản phẩm vẫn được bảo toàn nguyên vẹn trong giỏ hàng. |
| `ACTION-07-05` | Điều hướng | Bấm nút "Tiếp tục mua sắm" | Navigation | Click link/button "Tiếp tục mua sắm" | Trình duyệt chuyển hướng an toàn về trang chủ (`/`), giỏ hàng được bảo toàn. |

#### 3.2.3 Bảng Điểm Kiểm Chứng Giao Diện & Giả Thuyết Khiếm Khuyết SUT (UI Assertions & Defect Probes)

| Assertion ID | Hạng mục kiểm chứng | Yêu cầu bắt buộc của SRS FR-07 | Dấu hiệu vi phạm (Potential SUT Defect) | Phương pháp kiểm chứng |
| :--- | :--- | :--- | :--- | :--- |
| `ASSERT-07-01` | Nhãn Tổng tiền | Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính"). | Giao diện hiển thị nhãn `"Tổng tạm tính:"` hoặc `"Subtotal"`. | Quan sát văn bản hiển thị cạnh số tiền tổng ở footer giỏ hàng. |
| `ASSERT-07-02` | Dialog xác nhận xóa | Nút Xóa sản phẩm phải có **dialog xác nhận** trước khi thực hiện. | Bấm nút Xóa thì sản phẩm biến mất ngay lập tức mà không xuất hiện bất kỳ dialog xác nhận nào. | Click nút Xóa tại dòng sản phẩm và kiểm tra sự xuất hiện của popup/dialog xác nhận. |
| `ASSERT-07-03` | Hình minh họa giỏ trống | Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng. | Giao diện giỏ hàng trống chỉ có dòng chữ thông báo mà hoàn toàn không có thẻ hình ảnh (`<img>`/SVG minh họa). | Xóa hết sản phẩm trong giỏ và kiểm tra cây DOM xem có thẻ ảnh minh họa hay không. |

### 3.3 Bước 3: Phân tích giá trị biên (Step 3 Deliverables - BVA)

> **Phương pháp tiếp cận Phân tích Giá trị Biên (ISTQB FL §4.2.2):**
> - **Lựa chọn phương pháp:** Áp dụng kỹ thuật **3-Value BVA** (On-point, Off-point, In-point) cho các miền giá trị có thứ tự và ranh giới chuyển tiếp trạng thái với bước vi sai nhỏ nhất ($\epsilon$).
> - **Định nghĩa các điểm biên:**
>   - **On-point:** Giá trị nằm chính xác trên đường phân định ranh giới.
>   - **Off-point:** Giá trị nằm sát biên nhất ở phía đối diện (ngay ngoài biên nếu On nằm trong; hoặc ngay trong nếu On nằm ngoài).
>   - **In-point:** Giá trị nằm liền kề bên trong phân vùng cần kiểm thử.
> - **Ghi chú về Cận trên Số lượng (Upper Bound Confirmation):** Đối chiếu đặc tả SRS FR-06 và FR-07, hệ thống **không quy định giới hạn tồn kho (`stock_quantity`) hay cận trên số lượng tối đa**. Do đó, miền số lượng có biên dưới đóng $[1$ và biên trên mở $+\infty)$. Thiết kế tập trung vào biên dưới hợp lệ, ranh giới chuyển tiếp số lượng, ranh giới trạng thái số mặt hàng trong giỏ, và kiểm thử độ bền số học cực hạn.

| Boundary ID | Variable / Field | Boundary Rule | BVA Method | On-point (Value/Type) | Off-point (Value/Type) | In-point (Value/Type) |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `BVA-07-01` | `quantity` | $Q \ge 1$ (Ngưỡng số lượng nguyên dương tối thiểu theo SRS FR-06/FR-07) | 3-Value ($\epsilon=1\text{ đơn vị}$) | $Q = 1$ [Valid - On-point]<br/>Số lượng tối thiểu hợp lệ; hiển thị đúng thành tiền. | $Q = 0$ [Invalid - Off-point]<br/>$1 - 1 = 0$, vi phạm điều kiện $Q \ge 1$; chặn không cho lưu hoặc yêu cầu xác nhận. | $Q = 2$ [Valid - In-point]<br/>$1 + 1 = 2$, nằm liền kề bên trong vùng hợp lệ. |
| `BVA-07-02` | `cart_items_count` | $Items \ge 1 \leftrightarrow Items = 0$ (Ranh giới chuyển tiếp trạng thái Giỏ rỗng vs Giỏ có hàng) | 3-Value State Transition ($\epsilon=1\text{ SP}$) | $Items = 1$ [Valid Non-Empty]<br/>Còn đúng 1 SP trong giỏ $\to$ Hiển thị bảng chi tiết, thành tiền, tổng tiền. | $Items = 0$ [Valid Empty]<br/>$1 - 1 = 0$ (sau khi xóa SP cuối) $\to$ Ẩn bảng; hiển thị hình minh họa và thông báo giỏ rỗng. | $Items = 2$ [Valid Non-Empty]<br/>$1 + 1 = 2$ SP trong giỏ $\to$ Hiển thị nhiều dòng và cộng dồn tổng tiền. |
| `BVA-07-03` | `button_decrement_action` | $Q = 1 \xrightarrow{\text{click } -} \text{Chuyển tiếp}$ (Ranh giới thao tác nút `-` tại mốc tối thiểu) | 3-Value Transition | Bấm nút `-` tại $Q = 1$ [Boundary Event]<br/>Hệ thống disable nút `-` hoặc kích hoạt dialog xác nhận xóa. | Giảm âm $Q \le 0$ [Invalid Behavior]<br/>Nếu bấm `-` mà số lượng giảm về 0 hoặc số âm mà không hỏi, vi phạm SRS. | Bấm nút `-` tại $Q = 2$ [Valid Event]<br/>$2 - 1 = 1$, số lượng giảm về 1 bình thường. |
| `BVA-07-04` | `quantity.format` | $Q \in \mathbb{Z}^+$ (Ranh giới số nguyên vs số thập phân kề cận mốc tối thiểu) | 3-Value Real ($\epsilon=0.1$) | $Q = 1.0$ [Valid - On-point]<br/>Số nguyên chuẩn xác $Q = 1$. | $Q = 0.9$ hoặc $Q = 1.1$ [Invalid - Off-point]<br/>Số thập phân kề cận; hệ thống từ chối hoặc không nhận dấu chấm/phẩy. | $Q = 2.0$ [Valid - In-point]<br/>Số nguyên hợp lệ tiếp theo. |
| `BVA-07-05` | `quantity.robustness` | $Q \le 2^{53}-1$ (Ngưỡng an toàn số nguyên JavaScript `MAX_SAFE_INTEGER`) | Robustness Boundary ($\epsilon=1$) | $Q = 9.007.199.254.740.991$ [On-point]<br/>Giá trị nguyên lớn nhất an toàn trong JS; không gây lỗi tràn số. | $Q = 9.007.199.254.740.992$ [Off-point]<br/>Vượt ngưỡng an toàn JS; kiểm tra hệ thống không bị lỗi crash hoặc `Infinity`. | $Q = 9.007.199.254.740.990$ [In-point]<br/>Giá trị kề cận trong ngưỡng an toàn. |

### 3.4 Bước 4: Thiết kế kịch bản kiểm thử (Step 4 Deliverables)

> **Phương pháp luận Thiết kế Kịch bản Kiểm thử (Theo `Comprehensive Guide: How to Write Test Cases`):**
> 1. **Cú pháp Định danh Mục tiêu (Title / Objective Formula):** Tuân thủ công thức:
>    $$\text{Action (Hành động)} + \text{Function (Chức năng)} + \text{Operating Condition (Điều kiện vận hành)}$$
> 2. **Nguyên tắc Giả định Đơn lỗi (Single Fault Isolation):** Mọi kịch bản Negative (IEP hoặc Off-point) chỉ kích hoạt đúng 1 điều kiện sai; các biến còn lại giữ nguyên giá trị hợp lệ cơ sở (Baseline).
> 3. **Tính Tự dọn dẹp (Self-Cleaning / Teardown):** Khôi phục trạng thái giỏ hàng rỗng sau mỗi kịch bản để đảm bảo tính độc lập tuyệt đối giữa các lượt test.
> 4. **Điểm kiểm chứng đa tầng (Multi-tier Validation Points):** Phân tách rõ kỳ vọng ở các tầng: Giao diện Web (UI), Giao diện Lập trình (API), Trạng thái CSDL / Context (Data State), và Tuân thủ Đặc tả SRS (Specification Adherence).

---

#### 3.4.1 Bảng Tổng Hợp Kịch Bản Kiểm Thử & Ma Trận Truy Vết (Overview Traceability Matrix)

| TC ID | Test Case Objective ($\text{Action} + \text{Function} + \text{Condition}$) | Phân loại | Mã EP / Rule bao phủ | Mã BVA bao phủ | Dữ liệu đầu vào & Baseline | Kết quả cốt lõi (Core Expected) | Trạng thái |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| `TC_FR07_01` | Verify adding a new valid product to empty cart on Web & API | Positive (VEP) | `EP-07-01`, `STATE-07-01` | `BVA-07-01-ON`, `BVA-07-02-ON` | Giỏ rỗng; thêm `id = 1` (iPhone 15, giá 30tr), $Q = 1$ | Tạo đúng 1 dòng trong giỏ, hiển thị đủ 5 cột, Thành tiền 30tr, Tổng 30tr. | *Chờ thực thi* |
| `TC_FR07_02` | Verify adding duplicate product increments quantity without creating new row | Positive (Rule) | `RULE-07-01`, `EP-07-04` | `BVA-07-01-IN` ($Q=2$) | Giỏ đã có `id = 1` ($Q=1$); thêm tiếp `id = 1` ($Q_{add}=1$) | Số lượng tăng $1 \to 2$ trên dòng hiện tại, vẫn duy trì đúng 1 dòng; Thành tiền 60tr. | *Chờ thực thi* |
| `TC_FR07_03` | Validate rejection when adding well-formed non-existent product ID (Single Fault) | Negative (IEP) | `EP-07-02` | N/A (Product DB) | `id = 9999`, $Q = 1$ | Báo lỗi không tìm thấy sản phẩm; không thêm bản ghi rác vào giỏ. | *Chờ thực thi* |
| `TC_FR07_04` | Validate rejection when submitting malformed product ID via API (Single Fault) | Negative (IEP) | `EP-07-03` | N/A (Format/Type) | `id = "abc"` (hoặc `-1`), $Q = 1$ gửi qua `POST /api/cart` | HTTP 400 Bad Request; từ chối xử lý dữ liệu sai kiểu. | *Chờ thực thi* |
| `TC_FR07_05` | Validate rejection of quantity zero input on Cart item (Boundary Off-point) | Negative (BVA) | `EP-07-05` | `BVA-07-01-OFF` ($Q=0$) | Giỏ có SP1; sửa ô số lượng thành $Q = 0$ | Chặn không cho nhập 0, hoặc tự khôi phục về 1, hoặc hiện dialog hỏi xóa; không lưu $Q=0$. | *Chờ thực thi* |
| `TC_FR07_06` | Validate rejection of negative integer quantity input (Single Fault) | Negative (IEP) | `EP-07-06` | N/A (Negative Range) | Giỏ có SP1; nhập $Q = -1$ (hoặc $-5$) | Chặn ký tự `-` hoặc tự khôi phục về 1; không để thành tiền âm. | *Chờ thực thi* |
| `TC_FR07_07` | Validate rejection of empty or whitespace quantity input (Single Fault) | Negative (IEP) | `EP-07-07`, `EP-07-08` | N/A (Required) | Giỏ có SP1; xóa trắng ô số lượng ($Q = \text{""}$ hoặc $\text{"   "}$) | Chặn submit hoặc tự động khôi phục về giá trị hợp lệ trước đó. | *Chờ thực thi* |
| `TC_FR07_08` | Validate rejection of non-numeric string characters in quantity field (Single Fault) | Negative (IEP) | `EP-07-09` | N/A (Format) | Giỏ có SP1; gõ ký tự chữ `$Q = \text{"abc"}$` | Input `type="number"` chặn ký tự chữ; không làm xuất hiện lỗi `NaN`. | *Chờ thực thi* |
| `TC_FR07_09` | Validate rejection of decimal quantity near lower boundary (Boundary Off-point) | Negative (BVA) | `EP-07-10` | `BVA-07-04-OFF` ($Q=1.5$) | Giỏ có SP1; nhập số thập phân $Q = 1.5$ (hoặc $0.9 / 1.1$) | Chặn ký tự dấu `.` / `,`; chỉ chấp nhận số nguyên dương $Q \in \mathbb{Z}^+$. | *Chờ thực thi* |
| `TC_FR07_10` | Validate API rejection when quantity is omitted or null in payload (Single Fault) | Negative (IEP) | `EP-07-11` | N/A (Payload) | `POST /api/cart` với payload thiếu `quantity` hoặc `quantity: null` | HTTP 400 Bad Request; backend bắt buộc trường số lượng nguyên dương. | *Chờ thực thi* |
| `TC_FR07_11` | Validate system robustness against extremely large integer quantity (Robustness) | Robustness | `EP-07-12` | `BVA-07-05` ($Q=10^9$) | Giỏ có SP1; nhập $Q = 10^9$ | Hệ thống xử lý an toàn không treo máy, không gây tràn số JS hay biến thành `Infinity`. | *Chờ thực thi* |
| `TC_FR07_12` | Verify arithmetic calculation of line subtotals and cart total for multiple items | Positive (Calc) | `RULE-07-02`, `RULE-07-03` | `BVA-07-02-IN` ($Items=2$) | SP1 (30tr, $Q=2$) + SP2 (AirPods 6tr, $Q=1$) | Thành tiền SP1: 60tr; SP2: 6tr; Tổng tiền: 66.000.000 ₫ (khớp công thức $\sum Subtotal$). | *Chờ thực thi* |
| `TC_FR07_13` | Verify quantity decrement via '-' button when quantity exceeds minimum (Normal) | Positive (Action) | `ACTION-07-01` | `BVA-07-03-IN` ($Q=2 \to 1$) | Đang có SP1 với $Q = 2$; bấm nút `-` | Số lượng giảm về $Q = 1$; Thành tiền giảm từ 60tr về 30tr; Tổng tiền cập nhật tương ứng. | *Chờ thực thi* |
| `TC_FR07_14` | Validate boundary decrement behavior via '-' button at minimum quantity Q=1 (Probe) | Boundary / Probe | `ACTION-07-02` | `BVA-07-03-ON` ($Q=1$) | Đang có SP1 với $Q = 1$; bấm nút `-` | Nút `-` bị disabled HOẶC bật dialog xác nhận xóa; tuyệt đối KHÔNG tự ý giảm âm $Q \le 0$. | *Chờ thực thi* |
| `TC_FR07_15` | Verify item removal upon confirming delete dialog (Interaction Flow) | Positive (Action) | `ACTION-07-03` | N/A (Delete Flow) | Giỏ có 2 SP; bấm "Xóa" tại SP1 $\to$ Bấm "OK / Đồng ý" trên dialog | Dialog xác nhận xuất hiện; sau khi xác nhận, SP1 bị xóa khỏi giỏ, tổng tiền cập nhật lại. | *Chờ thực thi* |
| `TC_FR07_16` | Verify item retention upon cancelling delete dialog (Interaction Flow) | Positive (Action) | `ACTION-07-04` | N/A (Cancel Flow) | Giỏ có 1 SP; bấm "Xóa" $\to$ Bấm "Cancel / Hủy" trên dialog | Dialog xác nhận xuất hiện; sau khi bấm Cancel, SP vẫn giữ nguyên vẹn trong giỏ hàng. | *Chờ thực thi* |
| `TC_FR07_17` | Verify empty cart state display upon deleting last remaining item (State Boundary) | Positive (State) | `STATE-07-02` | `BVA-07-02-OFF` ($Items=0$) | Giỏ còn đúng 1 SP ($Items=1$); xóa SP đó khỏi giỏ $\to Items=0$ | Ẩn bảng sản phẩm; bắt buộc hiển thị đồng thời cả **hình minh họa** và thông báo giỏ rỗng. | *Chờ thực thi* |
| `TC_FR07_18` | Validate total amount UI label matches required "Tổng cộng" text (UI Assertion) | Negative / Probe | `ASSERT-07-01` | N/A (UI String) | Giỏ có sản phẩm; quan sát nhãn hiển thị cạnh số tiền tổng | Nhãn hiển thị chính xác là `"Tổng cộng"`; cấm hiển thị `"Tổng tạm tính"` (SRS FR-07). | *Chờ thực thi* |
| `TC_FR07_19` | Validate enforcement of confirmation dialog before product deletion (Safety Probe) | Negative / Probe | `ASSERT-07-02` | N/A (Safety Check) | Giỏ có sản phẩm; bấm nút "Xóa" tại dòng sản phẩm | Bắt buộc phải bật dialog xác nhận; nếu SP bị xóa ngay không hỏi $\to$ Defect vi phạm SRS. | *Chờ thực thi* |
| `TC_FR07_20` | Verify navigation back to home page via "Tiếp tục mua sắm" button (Navigation Flow) | Positive (Nav) | `ACTION-07-05` | N/A (Routing) | Tại trang giỏ hàng (`/cart`), bấm nút "Tiếp tục mua sắm" | Trình duyệt chuyển hướng về trang chủ (`/`), giỏ hàng vẫn được bảo toàn nguyên trạng. | *Chờ thực thi* |

---

#### 3.4.2 Hồ Sơ Đặc Tả Chi Tiết 100% Các Kịch Bản Kiểm Thử (Detailed Test Specification Cards for All 20 TCs)

Dưới đây là hồ sơ đặc tả chi tiết 7 phân đoạn chuẩn (*Tracking Information, Objective, Pre-conditions & Environment, Test Data, Procedure, Multi-tier Validation Points, Teardown & Clean-up*) cho toàn bộ 20 kịch bản kiểm thử trong ma trận:

---

##### Nhóm 1: Thao Tác Thêm Sản Phẩm & Quy Tắc Dòng Giỏ Hàng (Product Addition & Line Item Rules)

###### Test Case `TC_FR07_01`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_01` | **Priority:** High (P1) | **Target:** Web Frontend (`/cart`) & Backend API (`/api/cart`)
  - **Traceability:** SRS FR-07 (Item 1), API Spec §4.1, §4.2 | **Coverage IDs:** `EP-07-01`, `STATE-07-01`, `BVA-07-01-ON`, `BVA-07-02-ON`
- **2. Test Objective:** Verify adding a new valid product to empty cart on Web & API with exact 5 columns rendering.
- **3. Pre-conditions & Environment:**
  - Hệ thống EShop đang chạy (Backend `:3000`, Web `:5173`).
  - Giỏ hàng của người dùng đang trống hoàn toàn (`cart.length === 0`).
  - CSDL có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`, đơn giá `30.000.000 ₫`).
- **4. Test Data:** `id = 1`, `quantity = 1`
- **5. Step-by-Step Procedure:**
  1. Mở trình duyệt, truy cập trang chi tiết sản phẩm: `http://localhost:5173/products/1`.
  2. Quan sát ô nhập số lượng (mặc định là 1).
  3. Nhấn nút "Thêm vào giỏ hàng".
  4. Điều hướng vào trang giỏ hàng `http://localhost:5173/cart`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI / Table Structure:* Trang `/cart` hiển thị bảng danh sách sản phẩm với đầy đủ **đúng 5 cột**:
    1. **Sản phẩm:** Tên sản phẩm "iPhone 15 Pro Max" kèm ảnh thu nhỏ (thumbnail).
    2. **Đơn giá:** Hiển thị `30.000.000 ₫`.
    3. **Số lượng:** Hiển thị số `1` kèm hai nút tương tác `+` và `-` để điều chỉnh.
    4. **Thành tiền:** Hiển thị `30.000.000 ₫` ($30tr \times 1$).
    5. **Thao tác:** Hiển thị nút "Xóa" (hoặc icon thùng rác).
  - *UI / Summary:* Footer hiển thị nhãn "Tổng cộng" kèm số tiền `30.000.000 ₫`. Nút "Tiến hành thanh toán" và "Tiếp tục mua sắm" sẵn sàng.
  - *Context State:* Mảng giỏ hàng chứa đúng 1 phần tử `{ id: 1, name: "iPhone 15 Pro Max", price: 30000000, quantity: 1 }`.
- **7. Teardown & Clean-up:** Xóa sản phẩm khỏi giỏ hàng hoặc refresh state để đưa giỏ về rỗng.

###### Test Case `TC_FR07_02`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_02` | **Priority:** High (P1) | **Target:** Web Frontend & Context State
  - **Traceability:** SRS FR-07 (Item 2: *"Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới"*)
  - **Coverage IDs:** `RULE-07-01`, `EP-07-04`, `BVA-07-01-IN` ($Q=2$)
- **2. Test Objective:** Verify adding duplicate product increments quantity without creating new row.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng đã có sẵn sản phẩm ID 1 (`iPhone 15 Pro Max`) với số lượng $Q = 1$.
- **4. Test Data:** `id = 1`, `quantity = 1`
- **5. Step-by-Step Procedure:**
  1. Từ trang chủ hoặc danh mục, truy cập lại trang chi tiết `http://localhost:5173/products/1`.
  2. Giữ nguyên số lượng là 1, nhấn nút "Thêm vào giỏ hàng" lần thứ hai.
  3. Mở trang giỏ hàng `http://localhost:5173/cart`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI Table:* Bảng giỏ hàng vẫn duy trì **chính xác 1 dòng sản phẩm duy nhất** (không xuất hiện dòng thứ 2 cho cùng iPhone 15 Pro Max).
  - *Quantity & Price:*
    - Cột Số lượng hiển thị giá trị tăng lên: $Q = 1 + 1 = 2$.
    - Cột Thành tiền tự động nhân đôi: $30.000.000 \times 2 = 60.000.000\text{ ₫}$.
    - Tổng tiền giỏ hàng hiển thị `60.000.000 ₫`.
  - *SUT Verification Alert:* Nếu giỏ hàng tạo ra 2 dòng riêng biệt cho cùng sản phẩm ID 1, đây là lỗi vi phạm trực tiếp SRS FR-07 (Defect trong `CartContext.jsx`).
- **7. Teardown & Clean-up:** Xóa toàn bộ sản phẩm để dọn dẹp state.

###### Test Case `TC_FR07_03`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_03` | **Priority:** Medium (P2) | **Target:** Web Client & Backend API
  - **Traceability:** SRS FR-07 (Item 1), API Spec §4.2 | **Coverage IDs:** `EP-07-02`
  - **Single-Fault Isolation:** `quantity = 1` (hợp lệ); biến sai duy nhất là `product_id = 9999` không tồn tại trong CSDL.
- **2. Test Objective:** Validate rejection when adding well-formed non-existent product ID.
- **3. Pre-conditions & Environment:**
  - CSDL SQLite không chứa sản phẩm có `id = 9999`.
- **4. Test Data:** `id = 9999`, `quantity = 1`
- **5. Step-by-Step Procedure:**
  1. Mở trình duyệt truy cập route sản phẩm giả định: `http://localhost:5173/products/9999`.
  2. Hoặc gửi HTTP `POST /api/cart` với body JSON: `{"id": 9999, "price": 100000, "quantity": 1}` kèm Authorization header.
  3. Quan sát phản hồi trên giao diện và trong Network tab.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Giao diện hiển thị thông báo "Sản phẩm không tồn tại", nút "Thêm vào giỏ hàng" không hoạt động hoặc bị ẩn.
  - *API:* Endpoint trả về HTTP `404 Not Found` hoặc `400 Bad Request`.
  - *Cart State:* Giỏ hàng không bị thêm bản ghi rác mang ID 9999.
- **7. Teardown & Clean-up:** Không cần dọn dẹp nếu không có dữ liệu chèn vào.

###### Test Case `TC_FR07_04`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_04` | **Priority:** Medium (P2) | **Target:** Backend API (`POST /api/cart`)
  - **Traceability:** API Spec §4.2 | **Coverage IDs:** `EP-07-03`
  - **Single-Fault Isolation:** `quantity = 1` (hợp lệ); biến sai duy nhất là `id = "abc"` sai kiểu dữ liệu.
- **2. Test Objective:** Validate rejection when submitting malformed product ID via API.
- **3. Pre-conditions & Environment:**
  - Backend EShop đang chạy tại cổng 3000. Có JWT token của người dùng hợp lệ.
- **4. Test Data:** `id = "abc"` (hoặc `-1`), `price = 100000`, `quantity = 1`
- **5. Step-by-Step Procedure:**
  1. Gửi request `POST http://localhost:3000/api/cart` kèm Header `Authorization: Bearer <token>`.
  2. Body JSON truyền: `{"id": "abc", "price": 100000, "quantity": 1}`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *API:* Endpoint trả về mã trạng thái `400 Bad Request` với thông báo lỗi rõ ràng về định dạng ID.
  - *Backend State:* Mảng `userCarts` không lưu trữ đối tượng chứa ID sai kiểu dữ liệu.
- **7. Teardown & Clean-up:** Reset giỏ hàng qua `GET /api/cart` nếu cần.

---

##### Nhóm 2: Kiểm Thử Miền Dữ Liệu & Giá Trị Biên Của Số Lượng (Quantity EP & BVA Negative Testing)

###### Test Case `TC_FR07_05`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_05` | **Priority:** High (P1) | **Target:** Web Frontend (`Cart.jsx`)
  - **Traceability:** SRS FR-06, FR-07 (Tối thiểu là 1) | **Coverage IDs:** `EP-07-05`, `BVA-07-01-OFF` ($Q=0$)
  - **Single-Fault Isolation:** Sản phẩm ID 1 hợp lệ; biến sai duy nhất là số lượng $Q = 0$.
- **2. Test Objective:** Validate rejection of quantity zero input on Cart item (Boundary Off-point).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng đang có 1 sản phẩm ID 1 với $Q = 1$.
- **4. Test Data:** `quantity = 0`
- **5. Step-by-Step Procedure:**
  1. Truy cập trang giỏ hàng `http://localhost:5173/cart`.
  2. Nhấp vào ô số lượng của sản phẩm ID 1.
  3. Xóa số `1` và gõ `0`.
  4. Nhấn Enter hoặc nhấp chuột ra ngoài ô nhập (blur).
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Hệ thống từ chối lưu giá trị 0; tự động phục hồi về 1 HOẶC hiển thị dialog hỏi "Bạn có muốn xóa sản phẩm này?".
  - *Cart State:* Tuyệt đối không lưu dòng sản phẩm có $Q = 0$ và thành tiền = 0 ₫ trong bảng.
- **7. Teardown & Clean-up:** Khôi phục giỏ hàng rỗng.

###### Test Case `TC_FR07_06`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_06` | **Priority:** High (P1) | **Target:** Web Frontend & Backend API
  - **Traceability:** SRS FR-06, FR-07 (*"chỉ nhận số nguyên dương, tối thiểu là 1"*) | **Coverage IDs:** `EP-07-06`
  - **Single-Fault Isolation:** Sản phẩm ID 1 hợp lệ; biến sai duy nhất là số lượng âm $Q = -1$.
- **2. Test Objective:** Validate rejection of negative integer quantity input (Single Fault).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1.
- **4. Test Data:** `quantity = -1` (hoặc `-5`)
- **5. Step-by-Step Procedure:**
  1. Tại ô số lượng của sản phẩm, gõ `-1`.
  2. Hoặc gửi API `POST /api/cart` với `quantity: -1`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Input chặn ký tự dấu trừ `-` hoặc tự động reset về 1; hiển thị cảnh báo số lượng phải $\ge 1$.
  - *Arithmetic Check:* Thành tiền và Tổng tiền giỏ hàng tuyệt đối không bị tính ra số âm.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_07`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_07` | **Priority:** Medium (P2) | **Target:** Web Frontend (`Cart.jsx`)
  - **Traceability:** SRS FR-07 (Trường số lượng bắt buộc) | **Coverage IDs:** `EP-07-07`, `EP-07-08`
  - **Single-Fault Isolation:** Sản phẩm hợp lệ; ô số lượng bị xóa trắng thành chuỗi rỗng `""` hoặc chỉ có khoảng trắng `"   "`.
- **2. Test Objective:** Validate rejection of empty or whitespace quantity input.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1 ($Q = 1$).
- **4. Test Data:** `quantity = ""` (chuỗi rỗng) hoặc `"   "` (khoảng trắng)
- **5. Step-by-Step Procedure:**
  1. Mở `/cart`.
  2. Bôi đen toàn bộ số trong ô số lượng và nhấn Backspace để xóa sạch.
  3. Nhấp chuột ra ngoài ô nhập (onBlur).
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Ô số lượng tự động khôi phục về giá trị hợp lệ gần nhất ($Q = 1$).
  - *Calculation Safety:* Thành tiền và Tổng tiền không bị biến thành `NaN ₫` hay `0 ₫`.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_08`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_08` | **Priority:** Medium (P2) | **Target:** Web Frontend Input Control
  - **Traceability:** SRS FR-06 (*"chỉ nhận số nguyên dương"*) | **Coverage IDs:** `EP-07-09`
  - **Single-Fault Isolation:** Sản phẩm hợp lệ; nhập ký tự chữ/ký hiệu đặc biệt vào ô số lượng.
- **2. Test Objective:** Validate rejection of non-numeric string characters in quantity field.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1.
- **4. Test Data:** `quantity = "abc"` hoặc `"@#$"`
- **5. Step-by-Step Procedure:**
  1. Nhấp chuột vào ô số lượng của sản phẩm.
  2. Cố tình gõ chuỗi chữ `abc` hoặc paste ký tự đặc biệt `@#$`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Ô nhập liệu không hiển thị các ký tự chữ cái (do có `type="number"` hoặc input filter).
  - *Safety:* Giá trị số lượng trong state vẫn là số nguyên hợp lệ; không gây crash ứng dụng.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_09`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_09` | **Priority:** High (P1) | **Target:** Web Frontend & Validation Rule
  - **Traceability:** SRS FR-06, FR-07 (*"chỉ nhận số nguyên dương"*) | **Coverage IDs:** `EP-07-10`, `BVA-07-04-OFF` ($Q=1.5$)
  - **Single-Fault Isolation:** Sản phẩm hợp lệ; số lượng là số thập phân $Q = 1.5$.
- **2. Test Objective:** Validate rejection of decimal quantity near lower boundary (Boundary Off-point).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1.
- **4. Test Data:** `quantity = 1.5` (hoặc `0.9`, `1.1`)
- **5. Step-by-Step Procedure:**
  1. Nhập `1.5` (hoặc `1,5`) vào ô số lượng.
  2. Nhấn Enter hoặc chuyển tab.
- **6. Multi-tier Validation Points (Expected Results):**
  - *UI:* Input chặn ký tự dấu chấm/phẩy hoặc hiển thị thông báo lỗi "Số lượng phải là số nguyên".
  - *Safety:* Thành tiền không xuất hiện phần lẻ thập phân gây sai lệch tiền tệ VND (ví dụ không cho phép $30tr \times 1.5 = 45tr$ khi bán mặt hàng nguyên chiếc).
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_10`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_10` | **Priority:** Medium (P2) | **Target:** Backend REST API (`POST /api/cart`)
  - **Traceability:** API Spec §4.2 | **Coverage IDs:** `EP-07-11`
  - **Single-Fault Isolation:** `id` và `price` hợp lệ; trường `quantity` bị null hoặc khuyết hoàn toàn trong payload.
- **2. Test Objective:** Validate API rejection when quantity is omitted or null in payload.
- **3. Pre-conditions & Environment:**
  - Backend `:3000` đang hoạt động, có token xác thực.
- **4. Test Data:** Payload JSON: `{"id": 1, "price": 30000000, "quantity": null}` hoặc `{"id": 1, "price": 30000000}`
- **5. Step-by-Step Procedure:**
  1. Dùng Postman hoặc cURL gửi `POST /api/cart` với payload trên.
- **6. Multi-tier Validation Points (Expected Results):**
  - *API:* HTTP Status `400 Bad Request`. Body JSON thông báo trường `quantity` là bắt buộc và phải là số nguyên dương.
  - *State:* Không đẩy bản ghi không có số lượng vào giỏ hàng.
- **7. Teardown & Clean-up:** Không có dữ liệu rác cần dọn.

###### Test Case `TC_FR07_11`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_11` | **Priority:** Low (P3) | **Target:** System Robustness & JS Number Range
  - **Traceability:** Tiêu chuẩn ổn định số học (Robustness) | **Coverage IDs:** `EP-07-12`, `BVA-07-05`
  - **Single-Fault Isolation:** Số lượng cực lớn $Q = 10^9$ (1 tỷ đơn vị).
- **2. Test Objective:** Validate system robustness against extremely large integer quantity.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1.
- **4. Test Data:** `quantity = 1000000000` ($10^9$)
- **5. Step-by-Step Procedure:**
  1. Nhập `1000000000` vào ô số lượng của sản phẩm.
  2. Quan sát khả năng phản hồi của giao diện.
- **6. Multi-tier Validation Points (Expected Results):**
  - *System:* Ứng dụng không bị đứng hình, không tràn bộ nhớ CPU/RAM.
  - *Display:* Thành tiền không hiển thị `Infinity` hoặc `NaN`; hiển thị cảnh báo vượt giới hạn giao dịch nếu có.
- **7. Teardown & Clean-up:** Đưa giỏ hàng về rỗng.

---

##### Nhóm 3: Kiểm Chứng Tính Toán Số Học Thành Tiền & Tổng Cộng (Subtotal & Total Calculation Verification)

###### Test Case `TC_FR07_12`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_12` | **Priority:** High (P1) | **Target:** Business Logic & Arithmetic Calculation
  - **Traceability:** SRS FR-07 (Cột Thành tiền & Nhãn Tổng cộng) | **Coverage IDs:** `RULE-07-02`, `RULE-07-03`, `BVA-07-02-IN` ($Items=2$)
- **2. Test Objective:** Verify arithmetic calculation of line subtotals and cart total for multiple items.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng rỗng ban đầu.
  - Có 2 sản phẩm trong CSDL: SP1 (iPhone 15, giá `30.000.000 ₫`) và SP2 (AirPods Pro, giá `6.000.000 ₫`).
- **4. Test Data:** SP1 với $Q_1 = 2$; SP2 với $Q_2 = 1$
- **5. Step-by-Step Procedure:**
  1. Thêm SP1 vào giỏ với số lượng 2.
  2. Thêm SP2 vào giỏ với số lượng 1.
  3. Truy cập vào trang giỏ hàng `http://localhost:5173/cart`.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Thành tiền dòng 1:* $30.000.000 \times 2 = 60.000.000\text{ ₫}$.
  - *Thành tiền dòng 2:* $6.000.000 \times 1 = 6.000.000\text{ ₫}$.
  - *Tổng tiền giỏ hàng:* $60.000.000 + 6.000.000 = 66.000.000\text{ ₫}$ (khớp chính xác công thức $Total = \sum Subtotal$).
- **7. Teardown & Clean-up:** Xóa cả 2 sản phẩm khỏi giỏ.

---

##### Nhóm 4: Nút Bấm Điều Chỉnh Số Lượng & Ranh Giới Chuyển Tiếp (Quantity Adjustment & Decrement Transition)

###### Test Case `TC_FR07_13`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_13` | **Priority:** High (P1) | **Target:** Web Frontend Interactive Controls
  - **Traceability:** SRS FR-07 (*"Số lượng (có nút +/- để chỉnh)"*) | **Coverage IDs:** `ACTION-07-01`, `BVA-07-03-IN` ($Q=2 \to 1$)
- **2. Test Objective:** Verify quantity decrement via '-' button when quantity exceeds minimum (Normal Action).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có sản phẩm ID 1 đang mang số lượng $Q = 2$.
- **4. Test Data:** Thao tác click nút `-` khi $Q = 2$
- **5. Step-by-Step Procedure:**
  1. Vào `/cart`.
  2. Tìm nút `-` cạnh ô số lượng của sản phẩm ID 1.
  3. Nhấn nút `-` một lần duy nhất.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Số lượng:* Giảm từ 2 xuống đúng `1`.
  - *Thành tiền:* Tự động giảm từ 60tr xuống `30.000.000 ₫`.
  - *Tổng tiền:* Tự động giảm từ 60tr xuống `30.000.000 ₫`.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_14`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_14` | **Priority:** Medium (P2) | **Target:** Web Frontend Interactive Controls
  - **Traceability:** SRS FR-07 (Item 1, 3: Nút +/- và Dialog xác nhận xóa) | **Coverage IDs:** `ACTION-07-02`, `BVA-07-03-ON` ($Q=1$)
- **2. Test Objective:** Validate boundary decrement behavior via '-' button at minimum quantity Q=1 (State Transition Probe).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm ID 1 với số lượng đúng bằng $Q = 1$.
- **4. Test Data:** Click nút `-` khi $Q = 1$
- **5. Step-by-Step Procedure:**
  1. Vào `/cart`.
  2. Nhấn nút `-` tại dòng sản phẩm đang có số lượng 1.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Chuẩn hành vi chấp nhận được:*
    - **Phương án A (Disable):** Nút `-` bị vô hiệu hóa (`disabled`), không cho phép giảm dưới 1.
    - **Phương án B (Confirm Delete):** Nút `-` kích hoạt dialog xác nhận xóa sản phẩm tương tự nút Xóa.
  - *Hành vi vi phạm nghiêm trọng (Defect):*
    - Giảm số lượng về $Q = 0$ hoặc số âm ($-1$) làm thành tiền âm.
    - Tự động xóa sản phẩm ngay lập tức mà không có bất kỳ dialog xác nhận nào.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

---

##### Nhóm 5: Thao Tác Xóa Sản Phẩm, Hộp Thoại Xác Nhận & Giỏ Hàng Trống (Delete Flow, Confirmation Dialog & Empty Cart State)

###### Test Case `TC_FR07_15`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_15` | **Priority:** High (P1) | **Target:** Web Frontend Modal & State
  - **Traceability:** SRS FR-07 (Item 3: *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện"*) | **Coverage IDs:** `ACTION-07-03`
- **2. Test Objective:** Verify item removal upon confirming delete dialog (Interaction Flow).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 2 sản phẩm (SP1 giá 30tr, SP2 giá 6tr; Tổng: 36tr).
- **4. Test Data:** Thao tác click "Xóa" tại SP1 $\to$ Click "OK / Confirm"
- **5. Step-by-Step Procedure:**
  1. Mở `/cart`.
  2. Tại dòng SP1, nhấn nút "Xóa".
  3. Khi hộp thoại xác nhận hiện lên, nhấn nút "OK" (hoặc "Xóa / Confirm").
- **6. Multi-tier Validation Points (Expected Results):**
  - *Dialog:* Hộp thoại xác nhận hiển thị rõ ràng trước khi xóa.
  - *Table:* Dòng SP1 biến mất khỏi bảng giỏ hàng; SP2 vẫn giữ nguyên.
  - *Tổng tiền:* Cập nhật tức thời còn `6.000.000 ₫`.
- **7. Teardown & Clean-up:** Xóa nốt SP2 để đưa giỏ về rỗng.

###### Test Case `TC_FR07_16`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_16` | **Priority:** High (P1) | **Target:** Web Frontend Modal Interaction
  - **Traceability:** SRS FR-07 (Item 3) | **Coverage IDs:** `ACTION-07-04`
- **2. Test Objective:** Verify item retention upon cancelling delete dialog (Interaction Flow).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có 1 sản phẩm SP1 ($Q = 1$).
- **4. Test Data:** Click "Xóa" $\to$ Click "Cancel / Hủy"
- **5. Step-by-Step Procedure:**
  1. Mở `/cart`.
  2. Nhấn nút "Xóa" tại dòng SP1.
  3. Khi hộp thoại xác nhận hiện lên, nhấn nút "Cancel" (hoặc "Hủy").
- **6. Multi-tier Validation Points (Expected Results):**
  - *Dialog:* Hộp thoại đóng lại.
  - *Table:* Dòng sản phẩm SP1 vẫn hiển thị nguyên vẹn, số lượng vẫn là 1, tổng tiền không đổi.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_17`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_17` | **Priority:** High (P1) | **Target:** Web Frontend State Transition (`Cart.jsx`)
  - **Traceability:** SRS FR-07 (Item 6: *"Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng"*) | **Coverage IDs:** `STATE-07-02`, `BVA-07-02-OFF` ($Items=0$), `ASSERT-07-03`
- **2. Test Objective:** Verify empty cart state display upon deleting last remaining item with both illustration and message.
- **3. Pre-conditions & Environment:**
  - Giỏ hàng còn đúng 1 sản phẩm duy nhất ($Items = 1$).
- **4. Test Data:** Xóa sản phẩm cuối cùng $\to Items = 0$
- **5. Step-by-Step Procedure:**
  1. Mở `/cart`.
  2. Nhấn "Xóa" sản phẩm duy nhất và xác nhận xóa.
  3. Quan sát giao diện giỏ hàng sau khi xóa.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Bảng danh mục:* Ẩn bảng sản phẩm và tổng tiền.
  - *Thông báo văn bản:* Hiển thị câu thông báo rõ ràng (ví dụ: *"Giỏ hàng của bạn đang trống"*).
  - *Hình minh họa:* **Bắt buộc phải có thẻ hình ảnh minh họa** (thẻ `<img>` hoặc SVG minh họa giỏ hàng rỗng). Nếu chỉ có dòng chữ đơn điệu $\to$ Defect vi phạm SRS FR-07.
  - *Liên kết:* Có nút/link "Tiếp tục mua sắm" dẫn về trang chủ.
- **7. Teardown & Clean-up:** Không cần dọn dẹp.

---

##### Nhóm 6: Điểm Kiểm Chứng Giao Diện & Điều Hướng Hệ Thống (UI Assertions, Safety Probes & Navigation)

###### Test Case `TC_FR07_18`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_18` | **Priority:** Medium (P2) | **Target:** Web Frontend UI Text (`Cart.jsx`)
  - **Traceability:** SRS FR-07 (Item 5: *"Tổng tiền hiển thị nhãn chính xác: 'Tổng cộng' (không phải 'Tổng tạm tính')"*) | **Coverage IDs:** `ASSERT-07-01`
- **2. Test Objective:** Validate total amount UI label matches required "Tổng cộng" text (UI Assertion).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có ít nhất 1 sản phẩm hợp lệ.
- **4. Test Data:** Footer giỏ hàng
- **5. Step-by-Step Procedure:**
  1. Thêm 1 sản phẩm vào giỏ và mở `/cart`.
  2. Quan sát chuỗi ký tự hiển thị cạnh số tiền tổng ở cuối bảng.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Nhãn văn bản:* Bắt buộc phải là **"Tổng cộng"** (hoặc `"Tổng cộng:"`).
  - *Defect Detection:* Nếu giao diện hiển thị nhãn là **"Tổng tạm tính"** hoặc **"Subtotal"** $\to$ Ghi nhận Defect vi phạm trực tiếp yêu cầu SRS FR-07.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_19`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_19` | **Priority:** High (P1) | **Target:** Web Frontend Deletion Safety
  - **Traceability:** SRS FR-07 (Item 3: *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện"*) | **Coverage IDs:** `ASSERT-07-02`
- **2. Test Objective:** Validate enforcement of confirmation dialog before product deletion (Safety Probe).
- **3. Pre-conditions & Environment:**
  - Giỏ hàng có sản phẩm.
- **4. Test Data:** Thao tác click nút "Xóa"
- **5. Step-by-Step Procedure:**
  1. Vào `/cart`.
  2. Nhấn nút "Xóa" tại dòng sản phẩm và quan sát màn hình.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Hộp thoại xác nhận:* Bắt buộc phải xuất hiện dialog xác nhận trước khi xóa.
  - *Defect Detection:* Nếu sản phẩm bị xóa lập tức mà không có bất kỳ dialog nào hỏi ý kiến người dùng $\to$ Ghi nhận Defect vi phạm an toàn thao tác SRS FR-07.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

###### Test Case `TC_FR07_20`
- **1. Tracking Information:**
  - **TC ID:** `TC_FR07_20` | **Priority:** Medium (P2) | **Target:** Web Frontend Routing & Navigation
  - **Traceability:** SRS FR-07 (Item 4: *"Có nút Tiếp tục mua sắm để quay về trang chủ"*) | **Coverage IDs:** `ACTION-07-05`
- **2. Test Objective:** Verify navigation back to home page via "Tiếp tục mua sắm" button (Navigation Flow).
- **3. Pre-conditions & Environment:**
  - Người dùng đang đứng tại trang giỏ hàng `http://localhost:5173/cart`.
  - Giỏ hàng có 1 sản phẩm ID 1.
- **4. Test Data:** Click nút "Tiếp tục mua sắm" (hoặc "← Mua tiếp")
- **5. Step-by-Step Procedure:**
  1. Tại trang giỏ hàng `/cart`, tìm nút hoặc liên kết "Tiếp tục mua sắm".
  2. Nhấp chuột vào nút/liên kết này.
- **6. Multi-tier Validation Points (Expected Results):**
  - *Routing:* URL trình duyệt chuyển hướng an toàn về trang chủ `http://localhost:5173/`.
  - *State Preservation:* Dữ liệu sản phẩm trong giỏ hàng vẫn được lưu giữ nguyên vẹn, không bị mất khi quay lại `/cart`.
- **7. Teardown & Clean-up:** Dọn dẹp giỏ hàng.

### 3.5 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ (Step 5 Deliverables)

> **Mục tiêu Kiểm chứng Độ bao phủ (ISTQB FL §4.2.1 & §4.2.2):**
> Xác nhận toàn bộ 100% các phân vùng biến đầu vào (VEP/IEP), các quy tắc nghiệp vụ/chuyển trạng thái, các điểm kiểm chứng khiếm khuyết giao diện, và các điểm biên On/Off/In đều được kiểm thử trực tiếp bởi ít nhất một kịch bản trong ma trận 20 Test Cases.

---

#### 3.5.1 Bảng Độ Bao Phủ Phân Vùng Tương Đương Biến Đầu Vào (Pure Input EP Coverage)

| Class ID | Variable / Input | Type | Mô tả phân vùng tương đương | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `EP-07-01` | `product_id` | **VEP** | Mã sản phẩm hợp lệ và tồn tại trong CSDL | `TC_FR07_01` | **Covered** |
| `EP-07-02` | `product_id` | **IEP** | Mã sản phẩm đúng định dạng số nhưng không tồn tại trong CSDL (`id = 9999`) | `TC_FR07_03` | **Covered** |
| `EP-07-03` | `product_id` | **IEP** | Mã sản phẩm sai định dạng / sai kiểu dữ liệu (`id = "abc"` hoặc `-1`) | `TC_FR07_04` | **Covered** |
| `EP-07-04` | `quantity` | **VEP** | Số lượng nguyên dương hợp lệ ($Q \in \mathbb{Z}, Q \ge 1$) | `TC_FR07_01`, `TC_FR07_02`, `TC_FR07_12` | **Covered** |
| `EP-07-05` | `quantity` | **IEP** | Số lượng bằng 0 ($Q = 0$) | `TC_FR07_05` | **Covered** |
| `EP-07-06` | `quantity` | **IEP** | Số lượng là số nguyên âm ($Q < 0$) | `TC_FR07_06` | **Covered** |
| `EP-07-07` | `quantity` | **IEP** | Chuỗi rỗng / để trống trường số lượng (`""`) | `TC_FR07_07` | **Covered** |
| `EP-07-08` | `quantity` | **IEP** | Chuỗi chỉ chứa toàn khoảng trắng (`"   "`) | `TC_FR07_07` | **Covered** |
| `EP-07-09` | `quantity` | **IEP** | Ký tự phi số (Chữ cái, ký hiệu đặc biệt) | `TC_FR07_08` | **Covered** |
| `EP-07-10` | `quantity` | **IEP** | Số thập phân / số thực không nguyên ($Q = 1.5$) | `TC_FR07_09` | **Covered** |
| `EP-07-11` | `quantity` | **IEP** | Bị bỏ khuyết hoặc giá trị `null` trong payload API | `TC_FR07_10` | **Covered** |
| `EP-07-12` | `quantity` | **IEP** | Số nguyên cực lớn kiểm thử độ bền số học ($Q = 10^9$) | `TC_FR07_11` | **Covered** |

---

#### 3.5.2 Bảng Độ Bao Phủ Quy Tắc Nghiệp Vụ, Trạng Thái & Tương Tác (State, Rule & Interaction Coverage)

| Rule / State ID | Hạng mục | Mô tả quy tắc & kịch bản tương tác | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- | :---: |
| `RULE-07-01` | Trùng sản phẩm | Thêm SP trùng lặp phải cộng dồn số lượng, không tạo dòng mới | `TC_FR07_02` | **Covered** |
| `RULE-07-02` | Thành tiền dòng | Công thức số học $Subtotal = unit\_price \times quantity$ | `TC_FR07_01`, `TC_FR07_02`, `TC_FR07_12` | **Covered** |
| `RULE-07-03` | Tổng tiền giỏ | Công thức tổng tiền toàn giỏ $Total = \sum Subtotal$ | `TC_FR07_01`, `TC_FR07_12` | **Covered** |
| `STATE-07-01` | Trạng thái giỏ | Giỏ hàng có sản phẩm ($Items \ge 1$), hiển thị đủ 5 cột | `TC_FR07_01`, `TC_FR07_12` | **Covered** |
| `STATE-07-02` | Trạng thái giỏ | Giỏ hàng trống ($Items = 0$), hiển thị cả thông báo và hình minh họa | `TC_FR07_17` | **Covered** |
| `ACTION-07-01` | Nút `-` | Bấm nút `-` khi $Q > 1 \to$ giảm số lượng 1 đơn vị, tính lại tiền | `TC_FR07_13` | **Covered** |
| `ACTION-07-02` | Nút `-` | Bấm nút `-` tại ranh giới $Q = 1 \to$ disable hoặc dialog xác nhận xóa | `TC_FR07_14` | **Covered** |
| `ACTION-07-03` | Nút "Xóa" | Bấm Xóa $\to$ Xác nhận OK $\to$ Xóa sản phẩm khỏi giỏ, tính lại tiền | `TC_FR07_15` | **Covered** |
| `ACTION-07-04` | Nút "Xóa" | Bấm Xóa $\to$ Xác nhận Cancel $\to$ Giữ nguyên vẹn sản phẩm | `TC_FR07_16` | **Covered** |
| `ACTION-07-05` | Điều hướng | Bấm nút "Tiếp tục mua sắm" $\to$ Chuyển về trang chủ (`/`), bảo toàn giỏ | `TC_FR07_20` | **Covered** |

---

#### 3.5.3 Bảng Độ Bao Phủ Điểm Kiểm Chứng Giao Diện & Giả Thuyết Khiếm Khuyết (UI Assertions Coverage)

| Assertion ID | Hạng mục kiểm chứng | Yêu cầu bắt buộc của SRS FR-07 | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- | :---: |
| `ASSERT-07-01` | Nhãn Tổng tiền | Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính") | `TC_FR07_18` | **Covered** |
| `ASSERT-07-02` | Dialog xác nhận xóa | Nút Xóa sản phẩm phải có **dialog xác nhận** trước khi thực hiện | `TC_FR07_19` | **Covered** |
| `ASSERT-07-03` | Hình minh họa giỏ trống | Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng | `TC_FR07_17` | **Covered** |

---

#### 3.5.4 Bảng Độ Bao Phủ Phân Tích Giá Trị Biên (Boundary Value Coverage - On/Off/In Points)

| Boundary ID | Biến / Điều kiện | Điểm biên (Point Type) | Giá trị kiểm thử | Covered by TC ID(s) | Trạng thái (Status) |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `BVA-07-01` | Biên dưới số lượng ($Q \ge 1$) | **On-point** | $Q = 1$ (Số lượng min hợp lệ) | `TC_FR07_01`, `TC_FR07_13`, `TC_FR07_14` | **Covered** |
| | | **Off-point** | $Q = 0$ (Không hợp lệ, vi phạm $Q \ge 1$) | `TC_FR07_05` | **Covered** |
| | | **In-point** | $Q = 2$ (Liền kề trong vùng hợp lệ) | `TC_FR07_02`, `TC_FR07_12` | **Covered** |
| `BVA-07-02` | Ranh giới số lượng SP trong giỏ ($Items \ge 1 \leftrightarrow 0$) | **On-point** | $Items = 1$ (Còn đúng 1 SP, giỏ có hàng) | `TC_FR07_01`, `TC_FR07_16` | **Covered** |
| | | **Off-point** | $Items = 0$ (Giỏ rỗng, chuyển giao diện) | `TC_FR07_17` | **Covered** |
| | | **In-point** | $Items = 2$ (Nhiều SP, cộng dồn tổng tiền) | `TC_FR07_12`, `TC_FR07_15` | **Covered** |
| `BVA-07-03` | Ranh giới chuyển tiếp nút `-` ($Q = 1 \to 0$) | **On-point** | Bấm nút `-` tại $Q = 1$ (Điểm chuyển tiếp) | `TC_FR07_14` | **Covered** |
| | | **Off-point** | Giảm âm $Q \le 0$ (Hành vi sai, vi phạm SRS) | `TC_FR07_14` | **Covered** |
| | | **In-point** | Bấm nút `-` tại $Q = 2 \to 1$ (Giảm hợp lệ) | `TC_FR07_13` | **Covered** |
| `BVA-07-04` | Ranh giới số nguyên vs số thực kề cận ($Q \in \mathbb{Z}^+$) | **On-point** | $Q = 1.0$ (Số nguyên chuẩn xác) | `TC_FR07_01` | **Covered** |
| | | **Off-point** | $Q = 1.5$ (hoặc $0.9/1.1$, số thập phân bị từ chối) | `TC_FR07_09` | **Covered** |
| | | **In-point** | $Q = 2.0$ (Số nguyên hợp lệ tiếp theo) | `TC_FR07_02` | **Covered** |
| `BVA-07-05` | Giới hạn an toàn số nguyên JS (`MAX_SAFE_INTEGER`) | **On-point** | $Q = 9.007.199.254.740.991$ | `TC_FR07_11` | **Covered** |
| | | **Off-point** | $Q = 9.007.199.254.740.992$ (Vượt ngưỡng) | `TC_FR07_11` | **Covered** |
| | | **In-point** | $Q = 10^9$ (Số cực lớn trong ngưỡng) | `TC_FR07_11` | **Covered** |

---

#### 3.5.5 Bảng Tổng Hợp Chỉ Số Độ Bao Phủ (Coverage Summary)

| Chỉ số kiểm thử (Metric) | Tổng số nhận diện | Đã bao phủ (Covered) | Chưa bao phủ / Bị chặn | Tỷ lệ bao phủ (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Phân vùng hợp lệ (VEP)** | 2 | 2 | 0 | **100.0%** |
| **Phân vùng không hợp lệ (IEP)** | 10 | 10 | 0 | **100.0%** |
| **Tổng số phân vùng tương đương biến (Input EPs)** | 12 | 12 | 0 | **100.0%** |
| **Quy tắc nghiệp vụ & Trạng thái (Rules & States)** | 5 | 5 | 0 | **100.0%** |
| **Kịch bản tương tác & Điều hướng (Actions & Navigation)** | 5 | 5 | 0 | **100.0%** |
| **Điểm kiểm chứng giao diện & Khiếm khuyết (Assertions)** | 3 | 3 | 0 | **100.0%** |
| **Giá trị biên (On / Off / In Points)** | 15 | 15 | 0 | **100.0%** |
| **Tổng số kịch bản kiểm thử (Test Cases)** | 20 | 20 | 0 | **100.0%** |
| **Bảo đảm Giả định Đơn lỗi (Single-Fault Isolation)** | 10 / 10 IEPs | 10 | 0 | **100.0%** |

### 3.6 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT
- **Khoảng trống AI:** AI thường chỉ test trường hợp gõ số mà bỏ qua việc click nút bấm `+` và `-`, đặc biệt là sự kiện chuyển tiếp trạng thái khi click `-` tại mốc 1 đơn vị.
- **Giả thuyết lỗi SUT:**
  - Nhãn hiển thị vẫn để mặc định là "Tổng tạm tính" (Subtotal) thay vì "Tổng cộng".
  - Bấm nút `-` khi số lượng là 1 sẽ xóa ngay sản phẩm mà không hề hiện Dialog xác nhận theo yêu cầu SRS.
  - Cho phép người dùng gõ số lượng âm vào ô input trên giao diện web.

---

## 4. TÍNH NĂNG C (POOL C): FR-17 – QUẢN LÝ MÃ GIẢM GIÁ (COUPON CRUD - ADMIN)

### 4.1 Bước 1: Nhận diện biến đầu vào & Ràng buộc
> **Trích dẫn đặc tả SRS FR-17:**
> - Admin có thể Thêm / Xem / Xóa mã giảm giá.
> - Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1).

| Variable ID | Tên biến | Kiểu dữ liệu | Bắt buộc? | Bước nhảy ($\epsilon$) | Ràng buộc đặc tả SRS |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `VAR-17-01` | `code` | String | Có | N/A | Bắt buộc, duy nhất (unique), không rỗng. |
| `VAR-17-02` | `type` | Enum | Có | N/A | Chỉ nhận giá trị: `percent` hoặc `fixed`. |
| `VAR-17-03` | `discount_value` | Number | Có | 1 / 1% | Dương ($> 0$). Nếu `percent` thì trong khoảng $(0, 100\%]$. |
| `VAR-17-04` | `min_order_amount`| Number | Có | 1 ₫ | Lớn hơn hoặc bằng 0 ($\ge 0$). |
| `VAR-17-05` | `max_uses_per_user`| Integer | Có | 1 | Lớn hơn hoặc bằng 1 ($\ge 1$). |
| `VAR-17-06` | `expired_at` | DateTime | Có | 1 ngày | Ngày hết hạn của coupon (so với hiện tại). |

### 4.2 Bước 2: Phân vùng tương đương (Single Fault Assumption)
| Partition ID | Biến | Phân lớp tương đương | Loại | Giá trị đại diện | Hành vi mong đợi |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `EP-17-01` | `code` | Mã hợp lệ và chưa tồn tại | VEP | `DISCOUNT2026` | Chấp nhận |
| `EP-17-02` | `code` | Mã đã tồn tại trong CSDL | IEP | `SAVE10` | Báo lỗi trùng lặp mã |
| `EP-17-03` | `code` | Mã để trống | IEP | `""` | Báo lỗi bắt buộc |
| `EP-17-04` | `type` | Loại `percent` | VEP | `'percent'` | Áp dụng tính theo % |
| `EP-17-05` | `type` | Loại `fixed` | VEP | `'fixed'` | Áp dụng trừ tiền cố định |
| `EP-17-06` | `discount_value` | Giá trị dương hợp lệ | VEP | $10\%$ hoặc $50.000₫$ | Chấp nhận |
| `EP-17-07` | `discount_value` | Giá trị bằng 0 | IEP | $0$ | Từ chối (phải $> 0$) |
| `EP-17-08` | `discount_value` | Giá trị âm | IEP | $-10$ | Từ chối |
| `EP-17-09` | `discount_value` | % vượt quá 100% | IEP | $101\%$ | Từ chối đối với `percent` |
| `EP-17-10` | `min_order_amount` | Giá trị $\ge 0$ | VEP | $0₫, 100.000₫$ | Chấp nhận |
| `EP-17-11` | `min_order_amount` | Giá trị âm | IEP | $-1₫$ | Từ chối (phải $\ge 0$) |
| `EP-17-12` | `max_uses_per_user`| Số lần $\ge 1$ | VEP | $1, 5$ | Chấp nhận |
| `EP-17-13` | `max_uses_per_user`| Số lần bằng 0 hoặc âm | IEP | $0$ | Từ chối (phải $\ge 1$) |
| `EP-17-14` | `expired_at` | Ngày trong tương lai | VEP | $Ngày mai$ | Chấp nhận |
| `EP-17-15` | `expired_at` | Ngày trong quá khứ | IEP | $Hôm qua$ | Từ chối hoặc cảnh báo |

### 4.3 Bước 3: Phân tích giá trị biên (BVA)
| Boundary ID | Biến | Điều kiện biên | Mode BVA | On-point | Off-point | In-point |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `BVA-17-01` | `discount_value` | $> 0$ (Exclusive) | 3-Value ($\epsilon=1$) | $V = 0$ (Invalid) | $V = 1$ (Valid) | $V = 2$ (Valid) |
| `BVA-17-02` | `discount_value` (%) | $\le 100\%$ (Inclusive) | 3-Value ($\epsilon=1\%$) | $V = 100\%$ (Valid) | $V = 101\%$ (Invalid) | $V = 99\%$ (Valid) |
| `BVA-17-03` | `min_order_amount` | $\ge 0$ (Inclusive) | 3-Value ($\epsilon=1$) | $M = 0$ (Valid) | $M = -1$ (Invalid) | $M = 1$ (Valid) |
| `BVA-17-04` | `max_uses_per_user`| $\ge 1$ (Inclusive) | 3-Value ($\epsilon=1$) | $U = 1$ (Valid) | $U = 0$ (Invalid) | $U = 2$ (Valid) |

### 4.4 Bước 4: Thiết kế kịch bản kiểm thử
| TC ID | Kịch bản kiểm thử | Tiền điều kiện & Các bước | Test Data | Mã EP/BVA | Kết quả mong đợi (SRS) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `TC_FR17_01` | Tạo coupon percent hợp lệ biên 100% | Đăng nhập Admin. Nhập đủ thông tin hợp lệ với giảm 100%. | `type=percent`, `val=100`, `min=0`, `uses=1` | `BVA-17-02-ON`, `BVA-17-03-ON` | Tạo thành công | *Chờ thực thi* |
| `TC_FR17_02` | Tạo coupon percent với giá trị 101% | Giữ các trường hợp lệ, nhập giảm 101%. | `val=101%` (các trường khác chuẩn) | `BVA-17-02-OFF` | Hệ thống từ chối | *Chờ thực thi* |
| `TC_FR17_03` | Tạo coupon với `discount_value = 0` | Giữ các trường hợp lệ, nhập giá trị = 0. | `val=0` | `BVA-17-01-ON` | Từ chối vì phải $> 0$ | *Chờ thực thi* |
| `TC_FR17_04` | Tạo coupon với `min_order_amount = 0` | Giữ các trường hợp lệ, ngưỡng tối thiểu = 0. | `min_order=0` | `BVA-17-03-ON` | Chấp nhận ($\ge 0$) | *Chờ thực thi* |
| `TC_FR17_05` | Tạo coupon với `min_order_amount = -1` | Giữ các trường hợp lệ, nhập ngưỡng = -1. | `min_order=-1` | `BVA-17-03-OFF` | Báo lỗi không hợp lệ | *Chờ thực thi* |
| `TC_FR17_06` | Tạo coupon với `max_uses_per_user = 1` | Giữ các trường hợp lệ, số lượt dùng = 1. | `max_uses=1` | `BVA-17-04-ON` | Chấp nhận ($\ge 1$) | *Chờ thực thi* |
| `TC_FR17_07` | Tạo coupon với `max_uses_per_user = 0` | Giữ các trường hợp lệ, số lượt dùng = 0. | `max_uses=0` | `BVA-17-04-OFF` | Báo lỗi phải $\ge 1$ | *Chờ thực thi* |
| `TC_FR17_08` | Tạo coupon trùng mã `code` đã có | Dùng lại mã `SAVE10` đã có trong hệ thống. | `code=SAVE10` | `EP-17-02` | Báo lỗi mã coupon đã tồn tại | *Chờ thực thi* |
| `TC_FR17_09` | Để trống mã coupon `code` | Để trống trường code. | `code=""` | `EP-17-03` | Báo lỗi bắt buộc nhập code | *Chờ thực thi* |

### 4.5 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ
- Bao phủ đầy đủ toàn bộ các điều kiện bất đẳng thức toán học $V > 0, V \le 100\%, M \ge 0, U \ge 1$.
- 100% test cases âm tuân thủ chặt chẽ Single Fault Assumption.

### 4.6 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT
- **Khoảng trống AI:** AI thường không phân biệt ngữ cảnh giữa `percent` và `fixed` khi xét biên `discount_value` (với `fixed` thì có thể lên hàng triệu đồng, nhưng `percent` bị chặn cứng ở 100%).
- **Giả thuyết lỗi SUT:**
  - Form Admin không validate số âm cho `min_order_amount` $\to$ Gửi API nhận luôn `-1`.
  - Backend API `POST /api/coupons` không kiểm tra `UNIQUE(code)` dẫn tới crash SQL hoặc sinh 2 coupon trùng mã.

---

## 5. TÍNH NĂNG D (POOL D - MOBILE): FR-20 & FR-10 – HỦY ĐƠN HÀNG THEO TRẠNG THÁI

### 5.1 Bước 1: Nhận diện biến & Miền trạng thái đơn hàng
> **Trích dẫn đặc tả SRS FR-10 & FR-20:**
> - Đơn hàng có 5 trạng thái: `pending` $\to$ `confirmed` $\to$ `shipping` $\to$ `delivered`, và trạng thái hủy `canceled`.
> - User chỉ được phép tự hủy đơn khi đơn ở trạng thái `pending` hoặc `confirmed`.
> - Khi đơn hàng đã ở trạng thái `shipping`, User không được phép tự hủy – chỉ Admin mới thao tác được.
> - Trạng thái `delivered` và `canceled` là trạng thái kết thúc (Final States) – không được phép chuyển sang bất kỳ trạng thái nào khác.
> - Mọi chuyển đổi không hợp lệ phải trả về lỗi với thông báo phù hợp.

| Variable ID | Tên biến | Kiểu dữ liệu | Bắt buộc? | Miền giá trị cho phép |
| :--- | :--- | :--- | :---: | :--- |
| `VAR-20-01` | `current_order_status` | Enum | Có | `pending`, `confirmed`, `shipping`, `delivered`, `canceled` |
| `VAR-20-02` | `user_role` | Enum | Có | `user` (Mobile App Client) |
| `VAR-20-03` | `target_transition` | Action | Tương tác | Yêu cầu hủy: chuyển sang `canceled` |

### 5.2 Bước 2: Phân vùng tương đương (State Domain Partitioning)
| Partition ID | Miền trạng thái | Mô tả lớp tương đương | Phân loại | Hành vi của nút Hủy trên Mobile |
| :--- | :--- | :--- | :---: | :--- |
| `EP-20-01` | `{pending, confirmed}` | Trạng thái cho phép User hủy đơn | VEP | Nút "Hủy đơn" hiển thị và kích hoạt (Active) |
| `EP-20-02` | `{shipping}` | Đang giao hàng - Cấm User tự hủy | IEP | Nút "Hủy đơn" bị ẩn/disable; chặn API |
| `EP-20-03` | `{delivered}` | Đã giao hàng thành công (Final state) | IEP | Nút "Hủy đơn" bị ẩn; cấm chuyển trạng thái |
| `EP-20-04` | `{canceled}` | Đơn đã hủy trước đó (Final state) | IEP | Nút "Hủy đơn" bị ẩn; cấm chuyển trạng thái |

### 5.3 Bước 3: Phân tích giá trị biên chuyển đổi trạng thái (State Transition BVA)
| Transition ID | Điểm chuyển giao trạng thái | Bản chất biên | Kỳ vọng hệ thống (SRS) |
| :--- | :--- | :--- | :--- |
| `BVA-20-01` | `confirmed` $\to$ `canceled` | Biên hợp lệ cuối cùng cho User hủy | Cho phép hủy, cập nhật trạng thái sang `canceled` |
| `BVA-20-02` | `confirmed` $\to$ `shipping` | Ranh giới cấm User hủy đơn | Khi Admin chuyển sang `shipping`, User lập tức mất quyền hủy |
| `BVA-20-03` | `shipping` $\to$ `canceled` (bởi User) | Điểm ngoài biên (Invalid transition) | Trả về HTTP 400/403 kèm thông báo không được phép hủy |
| `BVA-20-04` | `delivered` $\to$ `canceled` | Final state boundary | Tuyệt đối không cho phép đổi trạng thái |

### 5.4 Bước 4: Thiết kế kịch bản kiểm thử
| TC ID | Kịch bản kiểm thử | Tiền điều kiện & Các bước thực hiện | Test Data | Mã EP/BVA | Kết quả mong đợi (SRS) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `TC_MOB_01` | User hủy đơn hàng ở trạng thái `pending` | Đơn hàng vừa đặt, status = `pending`. Mở Mobile App $\to$ Bấm "Hủy đơn". | Order `pending` | `EP-20-01` | Hủy thành công, trạng thái đổi thành `canceled`. | *Chờ thực thi* |
| `TC_MOB_02` | User hủy đơn hàng ở trạng thái `confirmed` (Biên hợp lệ) | Đơn đã được Admin xác nhận (`confirmed`). Mở Mobile $\to$ Bấm "Hủy đơn". | Order `confirmed` | `EP-20-01`, `BVA-20-01` | Hủy thành công, trạng thái đổi thành `canceled`. | *Chờ thực thi* |
| `TC_MOB_03` | Kiểm tra giao diện Mobile khi đơn ở `shipping` | Đơn chuyển sang `shipping`. Mở chi tiết đơn trên Mobile. | Order `shipping` | `EP-20-02`, `BVA-20-02` | Nút "Hủy đơn" phải bị ẩn hoặc vô hiệu hóa. | *Chờ thực thi* |
| `TC_MOB_04` | Bypass gọi API hủy khi đơn đang ở `shipping` | Đơn đang `shipping`. Dùng Postman gửi request cancel bằng JWT của User. | Order `shipping` | `BVA-20-03` | Backend từ chối với lỗi rõ ràng; giữ nguyên `shipping`. | *Chờ thực thi* |
| `TC_MOB_05` | Thử hủy đơn hàng đã giao (`delivered`) | Đơn có status = `delivered`. Gửi yêu cầu hủy đơn. | Order `delivered`| `EP-20-03`, `BVA-20-04` | Hệ thống báo lỗi; không thể đổi trạng thái final. | *Chờ thực thi* |
| `TC_MOB_06` | Thử hủy đơn hàng đã hủy (`canceled`) | Đơn đã ở trạng thái `canceled`. Thử gọi action hủy tiếp. | Order `canceled` | `EP-20-04` | Hệ thống báo lỗi hoặc không thực hiện action dư thừa. | *Chờ thực thi* |

### 5.5 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ
- Bao phủ toàn diện 5 trạng thái trong sơ đồ State Machine của FR-10.
- Kiểm thử chéo cả tầng UI Mobile (nút hiển thị/disable) lẫn tầng Backend API (chống bypass).

### 5.6 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT
- **Khoảng trống AI:** AI thường chỉ thiết kế kiểm thử trên giao diện (UI click) mà bỏ quên trường hợp gửi request trực tiếp vào Backend API để kiểm tra tính toàn vẹn của State Machine.
- **Giả thuyết lỗi SUT:**
  - Nút "Hủy đơn" vẫn hiển thị khi đơn đã sang trạng thái `shipping`.
  - Backend API không kiểm tra trạng thái hiện tại trước khi cập nhật `status = 'canceled'`, cho phép hủy mọi lúc.

---

## 6. TỔNG HỢP KẾT QUẢ THỰC THI & PHÁT HIỆN LỖI (DEFECT LOG)

*Phần này sẽ được cập nhật số liệu thực tế sau khi chạy toàn bộ test cases trên SUT EShop.*

| Chỉ số | Số lượng | Tỷ lệ (%) |
| :--- | :---: | :---: |
| **Tổng số Test Cases thiết kế** | 34 | 100% |
| **Số Test Cases Đạt (Passed)** | -- | --% |
| **Số Test Cases Thất bại (Failed - Phát hiện lỗi)** | -- | --% |
| **Số Test Cases Bị chặn (Blocked)** | -- | --% |

---

## 7. TÀI LIỆU THAM KHẢO
1. **ISTQB FL v4.0 (2023):** Foundation Level Syllabus – Section 4.2.1 (Equivalence Partitioning) & Section 4.2.2 (Boundary Value Analysis).
2. **EShop SRS Specification:** `specs/system_requirements_specification.md`.
3. **FIT@HCMUS HW02 Instructions:** `2026.HW02.Domain Testing_En.md`.
