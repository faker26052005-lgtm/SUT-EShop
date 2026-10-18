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
| TC ID | Kịch bản kiểm thử | Tiền điều kiện & Các bước thực hiện | Dữ liệu đầu vào | Mã EP/BVA bao phủ | Kết quả mong đợi (SRS) | Trạng thái thực thi |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| `TC_FR02_01` | Đăng nhập thành công với tài khoản đúng | User `test@eshop.com` chưa bị khóa. Nhập email/pass đúng $\to$ Submit. | `test@eshop.com` / `Test1234!` | `EP-02-01`, `EP-02-05` | Thành công, chuyển trang, cấp JWT. | *Chờ thực thi* |
| `TC_FR02_02` | Đăng nhập sai lần 1 (Dưới ngưỡng khóa) | Nhập đúng email, sai mật khẩu lần 1. | `test@eshop.com` / `WrongPass1!` | `EP-02-06`, `EP-02-08` | Báo lỗi chung; bộ đếm tăng lên 1; chưa khóa. | *Chờ thực thi* |
| `TC_FR02_03` | Đăng nhập sai lần 2 (Off-point số lần thử) | Nhập tiếp sai mật khẩu lần 2. | `test@eshop.com` / `WrongPass2!` | `EP-02-08`, `BVA-02-01-OFF` | Báo lỗi chung; bộ đếm tăng lên 2; chưa khóa. | *Chờ thực thi* |
| `TC_FR02_04` | Đăng nhập đúng ở lần 3 (Reset bộ đếm) | Sau 2 lần sai, nhập đúng mật khẩu. | `test@eshop.com` / `Test1234!` | `EP-02-05`, `EP-02-08` | Đăng nhập thành công; bộ đếm reset về 0. | *Chờ thực thi* |
| `TC_FR02_05` | Đăng nhập sai lần 3 liên tiếp (On-point khóa) | Nhập sai liên tiếp 3 lần. | `test@eshop.com` / `WrongPass3!` | `EP-02-09`, `BVA-02-01-ON` | Kích hoạt khóa 30s; báo lỗi không lộ nguyên nhân. | *Chờ thực thi* |
| `TC_FR02_06` | Đăng nhập khi đang bị tạm khóa ở giây thứ 29 (Off-point thời gian) | Thử đăng nhập đúng tại mốc $t = 29s$ sau khi bị khóa. | `test@eshop.com` / `Test1234!` | `EP-02-10`, `BVA-02-02-OFF` | Từ chối đăng nhập; báo tài khoản đang bị tạm khóa. | *Chờ thực thi* |
| `TC_FR02_07` | Đăng nhập sau khi hết 30s tạm khóa ở giây thứ 31 (In-point thời gian) | Đợi đến $t = 31s$ sau khi bị khóa, nhập mật khẩu đúng. | `test@eshop.com` / `Test1234!` | `EP-02-11`, `BVA-02-02-IN` | Mở khóa thành công, cấp JWT và chuyển hướng. | *Chờ thực thi* |
| `TC_FR02_08` | Email sai định dạng HTML5 (Single fault) | Nhập email thiếu `@`, mật khẩu đúng. | `invalidemail.com` / `Test1234!` | `EP-02-02` | Trình duyệt/UI chặn submit theo `type="email"`. | *Chờ thực thi* |
| `TC_FR02_09` | Để trống email (Single fault) | Để trống email, nhập mật khẩu đúng. | `""` / `Test1234!` | `EP-02-03` | Báo lỗi trường email bắt buộc. | *Chờ thực thi* |
| `TC_FR02_10` | Để trống mật khẩu (Single fault) | Nhập đúng email, để trống mật khẩu. | `test@eshop.com` / `""` | `EP-02-07` | Báo lỗi trường mật khẩu bắt buộc. | *Chờ thực thi* |

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
