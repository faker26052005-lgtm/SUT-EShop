# BÁO CÁO KIỂM THỬ: FEATURE A — FR-01: ĐĂNG KÝ TÀI KHOẢN (ACCOUNT REGISTRATION)

* **Phân hệ (Pool):** Pool A — Authentication, Categories, and Products
* **Chức năng:** FR-01: Đăng ký tài khoản
* **Nền tảng kiểm thử:** Web Client (`http://localhost:5173/register`) & Backend API (`http://localhost:3000/api/register`)
* **Kỹ thuật áp dụng:** Domain Testing (Equivalence Partitioning) & Boundary Value Analysis (BVA) theo chuẩn bài giảng CSC13003 (Slide S04).

---

## 1. Cơ sở Đặc tả Nghiệp vụ (SRS Baseline)

Trích xuất từ [SUT/eshop-sut/README.md](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/README.md):
1. **Dữ liệu bắt buộc:** Người dùng phải cung cấp **Họ Tên**, **Email**, **Mật khẩu**.
2. **Quy tắc Email:** Phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong hệ thống. Trường email phải dùng `type="email"`.
3. **Quy tắc Mật khẩu mạnh:**
   * Tối thiểu 8 ký tự.
   * Chứa ít nhất: 1 chữ hoa (`[A-Z]`), 1 chữ thường (`[a-z]`), 1 chữ số (`[0-9]`), và 1 ký tự đặc biệt thuộc tập: `@`, `$`, `!`, `%`, `*`, `?`, `&`.
4. **Quy tắc Xác nhận Mật khẩu:** Phải có trường **Xác nhận mật khẩu** — hệ thống từ chối nếu hai trường không khớp.
5. **Điều hướng:** Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập.

---

## 2. Phần A: Domain Testing (Kiểm thử miền)

### Bước 1: Xác định biến đầu vào & đầu ra (Inputs & Outputs)
Dựa theo Nguyên tắc Bước 1 của Slide S04:

| STT | Tên biến | Kiểu dữ liệu | Bắt buộc | Ràng buộc nghiệp vụ (Constraints) |
|:---:|:---|:---|:---:|:---|
| **1** | `name` (Họ Tên) | String | Có | Không được để trống; chuỗi ký tự hợp lệ. |
| **2** | `email` (Email) | String | Có | Định dạng email hợp lệ (`user@domain.com`); duy nhất trong CSDL. |
| **3** | `password` (Mật khẩu) | String | Có | Độ dài $\ge 8$; chứa đủ 4 thành phần: chữ hoa, chữ thường, số, ký tự đặc biệt trong tập `{@, $, !, %, *, ?, &}`. |
| **4** | `confirm_password` (Xác nhận MK) | String | Có | Phải khớp 100% với giá trị của `password`. |
| **Out 1** | Thông báo thành công & Chuyển trang | Redirect / Msg | - | Chuyển hướng sang `/login`. |
| **Out 2** | Thông báo lỗi (Error message) | Text | - | Hiển thị thông báo lỗi cụ thể khi vi phạm bất kỳ ràng buộc nào. |

---

### Bước 2: Phân chia các lớp tương đương (Equivalence Partitioning)
Áp dụng 4 quy tắc phân lớp từ bài giảng (Range, Set of values, Must-be condition, Splitting rule):

#### 2.1. Biến `name` (Họ Tên)
* **EC-NAME-V1 (Valid):** Chuỗi ký tự chữ cái hợp lệ (độ dài thông thường, có thể có khoảng trắng). *Đại diện:* `"Nguyen Van A"`.
* **EC-NAME-I1 (Invalid):** Chuỗi rỗng `""` (Không nhập).
* **EC-NAME-I2 (Invalid):** Chuỗi chỉ toàn khoảng trắng `"   "`.

#### 2.2. Biến `email` (Email)
* **EC-EMAIL-V1 (Valid):** Đúng định dạng email chuẩn và chưa tồn tại trong CSDL. *Đại diện:* `"valid.user@gmail.com"`.
* **EC-EMAIL-I1 (Invalid):** Email rỗng `""`.
* **EC-EMAIL-I2 (Invalid):** Thiếu ký tự `@` (ví dụ: `"usergmail.com"`).
* **EC-EMAIL-I3 (Invalid):** Thiếu phần tên người dùng trước `@` (ví dụ: `"@gmail.com"`).
* **EC-EMAIL-I4 (Invalid):** Thiếu phần tên miền sau `@` (ví dụ: `"user@"`).
* **EC-EMAIL-I5 (Invalid):** Email đã tồn tại trong CSDL (ví dụ: `"test@eshop.com"` - tài khoản seed sẵn).

#### 2.3. Biến `password` (Mật khẩu)
* **EC-PWD-V1 (Valid):** Thỏa mãn đồng thời cả 5 điều kiện (độ dài $\ge 8$, có hoa, thường, số, ký tự đặc biệt cho phép). *Đại diện:* `"ValidPass@123"`.
* **EC-PWD-I1 (Invalid):** Mật khẩu rỗng `""`.
* **EC-PWD-I2 (Invalid):** Độ dài $< 8$ ký tự (dù có đủ 4 loại ký tự). *Đại diện:* `"V@1aA"` (5 ký tự).
* **EC-PWD-I3 (Invalid):** Thiếu chữ cái in hoa (chỉ có thường, số, ký tự đặc biệt). *Đại diện:* `"validpass@123"`.
* **EC-PWD-I4 (Invalid):** Thiếu chữ cái in thường (chỉ có hoa, số, ký tự đặc biệt). *Đại diện:* `"VALIDPASS@123"`.
* **EC-PWD-I5 (Invalid):** Thiếu chữ số (chỉ có hoa, thường, ký tự đặc biệt). *Đại diện:* `"ValidPass@abc"`.
* **EC-PWD-I6 (Invalid):** Thiếu ký tự đặc biệt (chỉ có chữ và số). *Đại diện:* `"ValidPass123"`.
* **EC-PWD-I7 (Invalid):** Ký tự đặc biệt nằm ngoài tập cho phép (ví dụ dùng `#`, `^`, `~`, `<` thay vì `@$!%*?&`). *Đại diện:* `"ValidPass#123"`.

#### 2.4. Biến `confirm_password` (Xác nhận mật khẩu)
* **EC-CFM-V1 (Valid):** Giá trị trùng khớp hoàn toàn với `password`.
* **EC-CFM-I1 (Invalid):** Giá trị khác với `password` (sai khác dù chỉ 1 ký tự). *Đại diện:* `"ValidPass@124"`.
* **EC-CFM-I2 (Invalid):** Để trống trường xác nhận mật khẩu `""`.

---

### Bước 3: Thiết kế Test Cases từ Lớp Tương Đương (Domain Test Cases)
* **Nguyên tắc bao phủ:**
  * Positive Test Case kết hợp tất cả các lớp Valid trong 1 test case.
  * Mỗi Negative Test Case chỉ được vi phạm **duy nhất 1 lớp Invalid**, các biến còn lại giữ nguyên ở lớp Valid.

| TC-ID | Phân loại | Lớp kiểm tra | Name | Email | Password | Confirm Password | Kết quả mong đợi (Expected Result) |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **TC-FR01-D01** | Positive | `EC-NAME-V1, EC-EMAIL-V1, EC-PWD-V1, EC-CFM-V1` | `"Nguyen Van A"` | `"newuser_d01@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công; chuyển hướng sang trang `/login`. |
| **TC-FR01-D02** | Negative | `EC-NAME-I1` (Name rỗng) | `""` | `"newuser_d02@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi yêu cầu nhập Họ Tên; từ chối submit. |
| **TC-FR01-D03** | Negative | `EC-NAME-I2` (Name khoảng trắng) | `"   "` | `"newuser_d03@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi Họ Tên không hợp lệ; từ chối submit. |
| **TC-FR01-D04** | Negative | `EC-EMAIL-I1` (Email rỗng) | `"Nguyen Van A"` | `""` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi yêu cầu nhập Email; từ chối submit. |
| **TC-FR01-D05** | Negative | `EC-EMAIL-I2` (Email thiếu @) | `"Nguyen Van A"` | `"invalidemail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. |
| **TC-FR01-D06** | Negative | `EC-EMAIL-I3` (Email thiếu username) | `"Nguyen Van A"` | `"@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. |
| **TC-FR01-D07** | Negative | `EC-EMAIL-I4` (Email thiếu domain) | `"Nguyen Van A"` | `"user@"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. |
| **TC-FR01-D08** | Negative | `EC-EMAIL-I5` (Email đã tồn tại) | `"Nguyen Van A"` | `"test@eshop.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi "Email đã được sử dụng" hoặc tương đương; mã HTTP 400/409. |
| **TC-FR01-D09** | Negative | `EC-PWD-I1` (Password rỗng) | `"Nguyen Van A"` | `"newuser_d09@gmail.com"` | `""` | `""` | Báo lỗi yêu cầu nhập Mật khẩu. |
| **TC-FR01-D10** | Negative | `EC-PWD-I3` (Thiếu chữ hoa) | `"Nguyen Van A"` | `"newuser_d10@gmail.com"` | `"validpass@123"` | `"validpass@123"` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ in hoa. |
| **TC-FR01-D11** | Negative | `EC-PWD-I4` (Thiếu chữ thường) | `"Nguyen Van A"` | `"newuser_d11@gmail.com"` | `"VALIDPASS@123"` | `"VALIDPASS@123"` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ in thường. |
| **TC-FR01-D12** | Negative | `EC-PWD-I5` (Thiếu chữ số) | `"Nguyen Van A"` | `"newuser_d12@gmail.com"` | `"ValidPass@abc"` | `"ValidPass@abc"` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ số. |
| **TC-FR01-D13** | Negative | `EC-PWD-I6` (Thiếu ký tự đặc biệt) | `"Nguyen Van A"` | `"newuser_d13@gmail.com"` | `"ValidPass1234"` | `"ValidPass1234"` | Báo lỗi: Mật khẩu phải chứa ký tự đặc biệt trong tập quy định. |
| **TC-FR01-D14** | Negative | `EC-PWD-I7` (Ký tự đặc biệt ngoài tập) | `"Nguyen Van A"` | `"newuser_d14@gmail.com"` | `"ValidPass#123"` | `"ValidPass#123"` | Báo lỗi: Ký tự đặc biệt không nằm trong tập `@$!%*?&`. |
| **TC-FR01-D15** | Negative | `EC-CFM-I1` (Confirm không khớp) | `"Nguyen Van A"` | `"newuser_d15@gmail.com"` | `"ValidPass@123"` | `"Different@456"` | Báo lỗi: Mật khẩu xác nhận không khớp. |
| **TC-FR01-D16** | Negative | `EC-CFM-I2` (Confirm rỗng) | `"Nguyen Van A"` | `"newuser_d16@gmail.com"` | `"ValidPass@123"` | `""` | Báo lỗi yêu cầu xác nhận mật khẩu. |

---

## 3. Phần B: Boundary Value Analysis (Phân tích giá trị biên)

### Bước 4: Xác định các điểm biên (Boundary Points)
Áp dụng mô hình biên theo Slide S04 (Lower Boundary `LB`, Upper Boundary `UB`, `LB-1`, `LB+1`, `UB-1`, `UB+1`, và Extreme values):

| Biến kiểm thử | Điều kiện biên | LB - 1 (Invalid) | LB (Min Valid) | LB + 1 (Valid) | Nominal (Điển hình) | Extreme / UI Max |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Độ dài Mật khẩu** | $\ge 8$ ký tự | **7 ký tự** | **8 ký tự** | **9 ký tự** | **12 ký tự** | **256 ký tự** |
| **Độ dài Họ Tên** | Chuỗi không rỗng | **0 ký tự** (Rỗng) | **1 ký tự** | **2 ký tự** | **15 ký tự** | **256 ký tự** |
| **Độ dài Email** | Format chuẩn | Rỗng (0 ký tự) | 6 ký tự (`a@b.co`) | 12 ký tự | 20 ký tự | 255 ký tự |

---

### Bước 5: Thiết kế Test Cases BVA

| TC-ID | Điểm biên | Giá trị kiểm thử cụ thể | Name | Email | Password | Confirm Password | Kết quả mong đợi (Expected Result) |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **TC-FR01-B01** | Độ dài MK = `LB - 1` (7 ký tự) | 7 ký tự (có đủ 4 loại ký tự): `"V@1aAbc"` | `"Nguyen A"` | `"bva01@gmail.com"` | `"V@1aAbc"` | `"V@1aAbc"` | Báo lỗi: Mật khẩu tối thiểu 8 ký tự. |
| **TC-FR01-B02** | Độ dài MK = `LB` (8 ký tự) | 8 ký tự (vừa chạm biên dưới): `"V@1aAbcd"` | `"Nguyen A"` | `"bva02@gmail.com"` | `"V@1aAbcd"` | `"V@1aAbcd"` | Đăng ký thành công; chuyển hướng `/login`. |
| **TC-FR01-B03** | Độ dài MK = `LB + 1` (9 ký tự) | 9 ký tự: `"V@1aAbcde"` | `"Nguyen A"` | `"bva03@gmail.com"` | `"V@1aAbcde"` | `"V@1aAbcde"` | Đăng ký thành công; chuyển hướng `/login`. |
| **TC-FR01-B04** | Độ dài MK = Nominal (12 ký tự) | 12 ký tự: `"ValidPass@12"` | `"Nguyen A"` | `"bva04@gmail.com"` | `"ValidPass@12"` | `"ValidPass@12"` | Đăng ký thành công; chuyển hướng `/login`. |
| **TC-FR01-B05** | Độ dài MK = Extreme (256 ký tự) | 256 ký tự (có đủ hoa, thường, số, `@`) | `"Nguyen A"` | `"bva05@gmail.com"` | `256 ký tự` | `256 ký tự` | Hệ thống xử lý an toàn (hash bcrypt bình thường, không crash server). |
| **TC-FR01-B06** | Độ dài Tên = `LB` (1 ký tự) | Tên 1 ký tự: `"A"` | `"A"` | `"bva06@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công (chấp nhận tên ngắn hợp lệ). |
| **TC-FR01-B07** | Độ dài Tên = Extreme (256 ký tự) | Chuỗi tên dài 256 ký tự | `256 ký tự` | `"bva07@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Không vỡ layout giao diện, lưu an toàn vào CSDL. |
| **TC-FR01-B08** | Email ngắn nhất hợp lệ | Email ngắn: `"a@b.co"` | `"Nguyen A"` | `"a@b.co"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công. |

---

## 4. Phần C: Phân Tích Khoảng Trống của AI (AI Gap Analysis)

Khi sử dụng các công cụ AI thông thường (ChatGPT/Claude/Copilot) chỉ với prompt chung chung *"hãy sinh test case cho chức năng đăng ký EShop"*, AI thường bỏ sót các điểm cốt lõi sau:

1. **Bỏ sót sự che giấu lỗi do Regex sai trong mã nguồn (Code-level flaw):**
   * *Thực tế trong source code:* File [frontend-web/src/pages/Register.jsx](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/frontend-web/src/pages/Register.jsx#L15) sử dụng biến `flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/`.
   * Regex này **bắt buộc có khoảng trắng (`\s`)** và **chặn tất cả ký tự đặc biệt (`@$!%*?&`)**!
   * AI nếu chỉ đọc spec bên ngoài sẽ thiết kế test case có `@`, và khi chạy thực tế sẽ bị FAIL mà không hiểu tại sao. AI cần được hướng dẫn kiểm tra chéo (cross-check) với implementation.
2. **Bỏ sót trường Confirm Password:**
   * AI thường giả định form đăng ký đã có đủ trường Xác nhận Mật khẩu, nhưng thực tế giao diện Web EShop **quên code hoàn toàn trường này**!
3. **Bỏ sót vi phạm chuẩn kiểu dữ liệu HTML5 (FR-22):**
   * Input email trên UI dùng `type="text"` thay vì `type="email"`. AI thường chỉ tập trung vào logic backend mà bỏ qua các thuộc tính kiểm thử giao diện (UI Form Requirements).
4. **Bỏ sót tập ký tự đặc biệt bị giới hạn:**
   * Đặc tả chỉ cho phép 7 ký tự đặc biệt cụ thể `{@, $, !, %, *, ?, &}`. AI thường giả định mọi ký tự đặc biệt chuẩn (như `#`, `^`, `_`, `-`) đều hợp lệ, dẫn đến thiết kế thiếu test case `EC-PWD-I7`.

---

## 5. Danh Mục Bugs Thực Tế Được Phát Hiện (Bug Findings)

Từ việc đối soát giữa Đặc tả và Mã nguồn thực tế của EShop, phát hiện **4 BUGS nghiêm trọng**:

| Bug ID | Tên lỗi | Mức độ | Mô tả vi phạm đặc tả |
|:---|:---|:---:|:---|
| **BUG-FR01-01** | Regex mật khẩu sai hoàn toàn so với đặc tả | **Critical** | Frontend dùng regex đòi hỏi dấu cách (`\s`) và cấm ký tự đặc biệt, khiến mật khẩu hợp lệ (`ValidPass@123`) bị từ chối, còn mật khẩu có dấu cách (`ValidPass 123`) lại được chấp nhận. |
| **BUG-FR01-02** | Thiếu hoàn toàn trường Xác nhận mật khẩu | **Major** | Giao diện `/register` không có input Xác nhận mật khẩu theo yêu cầu bắt buộc của FR-01. |
| **BUG-FR01-03** | Trường Email không dùng `type="email"` | **Minor** | Vi phạm FR-02 và FR-22 (Input email đang đặt là `type="text"`). |
| **BUG-FR01-04** | Nút Đăng ký sai màu quy chuẩn UI | **Trivial** | Nút dùng màu đỏ (`bg-red-500`) thay vì màu xanh dương theo FR-21. |
| **BUG-FR01-05** | Backend không hề validate mật khẩu và email | **Critical** | API `POST /api/register` nhận dữ liệu và `INSERT` thẳng vào SQLite mà không kiểm tra độ dài, regex, hay mã hóa mật khẩu (vi phạm SEC-01). |
