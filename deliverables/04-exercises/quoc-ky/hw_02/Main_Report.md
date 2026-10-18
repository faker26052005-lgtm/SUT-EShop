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
- **Tỷ lệ bao phủ VEP:** $100\%$ ($5/5$ phân vùng VEP đã có Test Case).
- **Tỷ lệ bao phủ IEP:** $100\%$ ($6/6$ phân vùng IEP với đơn lỗi Single Fault).
- **Tỷ lệ bao phủ BVA:** $100\%$ (Đầy đủ On/Off/In cho cả 2 ranh giới số lần và thời gian).

### 2.6 Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT (Step 6 Deliverables)
- **Khoảng trống AI (AI Gap Analysis):** Khi thiết kế ban đầu, AI thường chỉ tạo trường hợp "sai 3 lần" nhưng quên kịch bản "nhập đúng ở lần thứ 3 thì bộ đếm có được reset hay không", và thường bỏ qua điểm biên thời gian vi sai $\epsilon=1s$ ($29s$ vs $31s$).
- **Giả thuyết lỗi SUT (Defect Hypotheses):**
  - Backend SQLite chưa lưu trữ trường `failed_login_attempts` hoặc không có cơ chế `locked_until` $\to$ Tài khoản không hề bị khóa dù nhập sai 10 lần.
  - Phản hồi API trả về `401 Unauthorized` có kèm message `"Mật khẩu không đúng"` hoặc `"Email không tồn tại"` $\to$ Vi phạm điều khoản bảo mật "không để lộ chi tiết nguyên nhân" của SRS FR-02.

---

## 3. TÍNH NĂNG B (POOL B): FR-07 – GIỎ HÀNG (SHOPPING CART)

### 3.1 Bước 1: Nhận diện biến đầu vào & Ràng buộc
> **Trích dẫn đặc tả SRS FR-07:**
> - Hiển thị danh sách sản phẩm với các cột: Sản phẩm, Đơn giá, Số lượng (có nút +/- để chỉnh), Thành tiền, Thao tác.
> - Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới.
> - Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện.
> - Có nút Tiếp tục mua sắm để quay về trang chủ.
> - Tổng tiền hiển thị nhãn chính xác: "Tổng cộng" (không phải "Tổng tạm tính").
> - Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng.

| Variable ID | Tên biến | Kiểu dữ liệu | Bắt buộc? | Bước nhảy ($\epsilon$) | Ràng buộc nghiệp vụ theo đặc tả |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `VAR-07-01` | `quantity` | Integer | Có | 1 | Số nguyên dương $\ge 1$; không vượt quá tồn kho `stock_quantity`. |
| `VAR-07-02` | `unit_price` | Integer / ₫ | Hệ thống | 1 ₫ | Đơn giá sản phẩm lấy từ CSDL (số dương). |
| `VAR-07-03` | `subtotal` | Integer / ₫ | Hệ thống | 1 ₫ | $Subtotal = unit\_price \times quantity$. |
| `VAR-07-04` | `action_decrement`| Click | Tương tác | N/A | Bấm nút `-` khi `quantity = 1` $\to$ Cần kích hoạt dialog xác nhận xóa hay khóa chặn? |
| `VAR-07-05` | `cart_state` | Boolean | Hệ thống | N/A | Trống (`empty`) vs Có hàng (`items > 0`). |

### 3.2 Bước 2: Phân vùng tương đương
| Partition ID | Biến / Điều kiện | Phân lớp tương đương | Phân loại | Giá trị đại diện | Hành vi mong đợi |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `EP-07-01` | `quantity` | Số lượng hợp lệ trong khoảng $[1, \text{Stock}]$ | VEP | $quantity = 2$ | Cập nhật số lượng và tính lại tiền |
| `EP-07-02` | `quantity` | Số lượng bằng 0 | IEP | $quantity = 0$ | Không cho phép nhập hoặc hiện xác nhận xóa |
| `EP-07-03` | `quantity` | Số lượng âm | IEP | $quantity = -1$ | Chặn không cho nhập/tự động điều chỉnh về 1 |
| `EP-07-04` | `quantity` | Số lượng vượt quá tồn kho | IEP | $quantity = \text{Stock} + 5$ | Báo lỗi không đủ tồn kho |
| `EP-07-05` | `quantity` | Số lượng là số thập phân | IEP | $quantity = 1.5$ | Từ chối ký tự `.` / `,` |
| `EP-07-06` | `cart_state` | Giỏ hàng trống | VEP | 0 sản phẩm | Hiển thị hình minh họa và thông báo rõ ràng |
| `EP-07-07` | `total_label` | Nhãn nhan đề tổng tiền | VEP | "Tổng cộng" | Hiển thị chính xác nhãn "Tổng cộng" |

### 3.3 Bước 3: Phân tích giá trị biên (BVA)
| Boundary ID | Biến / Điều kiện | Ranh giới | Phương pháp | On-point | Off-point | In-point |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- |
| `BVA-07-01` | Biên dưới số lượng ($Quantity \ge 1$) | $Quantity = 1$ | 3-Value ($\epsilon=1$) | $Q = 1$ (Hợp lệ) | $Q = 0$ (Không hợp lệ/Xóa) | $Q = 2$ (Hợp lệ) |
| `BVA-07-02` | Biên trên số lượng ($Quantity \le Stock$) | $Quantity = Stock$ | 3-Value ($\epsilon=1$) | $Q = Stock$ (Hợp lệ) | $Q = Stock + 1$ (Vượt kho) | $Q = Stock - 1$ (Hợp lệ) |
| `BVA-07-03` | Nút `-` chuyển đổi $1 \to 0$ | $Q = 1 \to 0$ | Transition BVA | Bấm `-` tại $Q=1$ | Hiện dialog xác nhận xóa | Không giảm âm |

### 3.4 Bước 4: Thiết kế kịch bản kiểm thử
| TC ID | Kịch bản kiểm thử | Tiền điều kiện & Các bước | Test Data | Mã EP/BVA | Kết quả mong đợi (SRS) | Trạng thái thực thi |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `TC_FR07_01` | Thêm sản phẩm và xem tính tiền chuẩn | Giỏ có 1 SP giá 100.000₫. Nhập số lượng = 2. | $Q = 2$ | `EP-07-01` | Thành tiền: 200.000₫; Tổng tiền nhãn: "Tổng cộng". | *Chờ thực thi* |
| `TC_FR07_02` | Giảm số lượng từ 2 về 1 (On-point Min) | Đang có $Q=2$, bấm nút `-`. | $Q = 1$ | `BVA-07-01-ON` | Số lượng giảm về 1, thành tiền cập nhật. | *Chờ thực thi* |
| `TC_FR07_03` | Bấm nút `-` tại số lượng 1 (Ranh giới xóa) | Đang có $Q=1$, bấm nút `-`. | $Q = 1 \to 0$ | `BVA-07-03` | Hệ thống phải hiện dialog xác nhận trước khi xóa SP. | *Chờ thực thi* |
| `TC_FR07_04` | Xóa sản phẩm bằng nút Xóa | Bấm nút thùng rác/Xóa tại dòng sản phẩm. | Click Xóa | SRS FR-07 | Hiển thị Dialog xác nhận; hủy bỏ thì giữ nguyên. | *Chờ thực thi* |
| `TC_FR07_05` | Đặt số lượng đạt mức tồn kho tối đa | Sản phẩm có Stock = 10. Nhập $Q = 10$. | $Q = 10$ | `BVA-07-02-ON` | Chấp nhận số lượng 10; tính đúng tổng tiền. | *Chờ thực thi* |
| `TC_FR07_06` | Nhập số lượng vượt tồn kho 1 đơn vị | Sản phẩm có Stock = 10. Nhập $Q = 11$. | $Q = 11$ | `BVA-07-02-OFF`| Chặn hoặc thông báo vượt quá số lượng trong kho. | *Chờ thực thi* |
| `TC_FR07_07` | Nhập số âm trực tiếp vào ô số lượng | Nhập trực tiếp `-1` vào ô số lượng. | $Q = -1$ | `EP-07-03` | Không cho phép nhập hoặc tự phục hồi về 1. | *Chờ thực thi* |
| `TC_FR07_08` | Kiểm tra trạng thái giỏ hàng trống | Xóa hết sản phẩm trong giỏ. | Giỏ rỗng | `EP-07-06` | Có hình minh họa và thông báo giỏ hàng trống. | *Chờ thực thi* |
| `TC_FR07_09` | Kiểm tra nhãn hiển thị Tổng tiền | Có sản phẩm trong giỏ, quan sát footer giỏ. | UI Inspect | `EP-07-07` | Hiển thị đúng nhãn "Tổng cộng", không dùng "Tổng tạm tính". | *Chờ thực thi* |

### 3.5 Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ
- Bao phủ 100% các phân vùng số lượng âm, 0, hợp lệ, vượt kho, giỏ rỗng, nhãn tổng tiền.
- Bao phủ đầy đủ On/Off/In cho cả biên dưới và biên trên tồn kho.

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
