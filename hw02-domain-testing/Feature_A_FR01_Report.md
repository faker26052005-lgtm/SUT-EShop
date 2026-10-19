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
* **EC-NAME-I3 (Invalid - Robustness):** Chuỗi chỉ chứa toàn chữ số (Numeric-only string). *Đại diện:* `"12345678"`.
* **EC-NAME-I4 (Invalid - Robustness/Security):** Chuỗi chứa ký tự đặc biệt nguy hiểm / mã HTML / XSS payload. *Đại diện:* `"<script>alert(1)</script>"`.

#### 2.2. Biến `email` (Email)
* **EC-EMAIL-V1 (Valid):** Đúng định dạng email chuẩn và chưa tồn tại trong CSDL. *Đại diện:* `"valid.user@gmail.com"`.
* **EC-EMAIL-I1 (Invalid):** Email rỗng `""`.
* **EC-EMAIL-I2 (Invalid):** Thiếu ký tự `@` (ví dụ: `"usergmail.com"`).
* **EC-EMAIL-I3 (Invalid):** Thiếu phần tên người dùng trước `@` (ví dụ: `"@gmail.com"`).
* **EC-EMAIL-I4 (Invalid):** Thiếu phần tên miền sau `@` (ví dụ: `"user@"`).
* **EC-EMAIL-I5 (Invalid):** Email đã tồn tại trong CSDL (ví dụ: `"test@eshop.com"` - tài khoản seed sẵn).
* **EC-EMAIL-I6 (Invalid - Robustness):** Email chứa ký tự đặc biệt bất hợp pháp sai chuẩn RFC 5322 trong local-part. *Đại diện:* `"user#$!%@gmail.com"`.
* **EC-EMAIL-I7 (Invalid - Robustness):** Cú pháp email dị biệt / phi lý (ví dụ: domain chỉ là dấu đóng ngoặc đơn, không có FQDN hay TLD). *Đại diện:* `"_@)"`.

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

> [!IMPORTANT]
> **Thiết lập Bộ Chuẩn Cô Lập Lỗi (Baseline Setup & Single Fault Assumption):**
> * **Bộ Giá Trị Chuẩn theo Đặc tả (SRS Golden Baseline Input):** 
>   * `Name`: `"Nguyen Van A"` *(Họ tên hợp lệ chuẩn)*
>   * `Email`: `"validuser@gmail.com"` *(Dùng chung một địa chỉ email cố định duy nhất cho TẤT CẢ các test case khi Email là biến hợp lệ)*
>   * `Password`: `"ValidPass@123"` *(Thiết kế chuẩn đặc tả FR-01: $\ge 8$ ký tự, có hoa, thường, số, ký tự đặc biệt `@`, không khoảng trắng)*
>   * `Confirm Password`: `"ValidPass@123"` *(Khớp 100% với Password)*
> * **Kỹ thuật Thực thi Cô lập lỗi trên SUT (Execution Workaround):**
>   * Do SUT dính lỗi `BUG-FR01-01` (regex cấm `@` và bắt buộc dấu cách) và `BUG-FR01-02` (thiếu trường Confirm Password), việc nhập `ValidPass@123` sẽ bị chặn ngay tại ô Mật khẩu, gây ra hiện tượng **Lỗi che giấu lỗi (Error Masking)**.
>   * Vì vậy, khi kiểm tra các biến mục tiêu khác (**Họ Tên** hoặc **Email**), Tester áp dụng mật khẩu workaround `"ValidPass 123"` tại thời điểm submit để thông chốt giao diện, giúp đưa dữ liệu xuống Backend nhằm **cô lập 100% hành vi kiểm thử của biến mục tiêu**.

| TC-ID | Phân loại | Biến & Lớp kiểm tra | Name | Email (Dùng chung) | Password (Chuẩn SRS) | Confirm Password | Kết quả mong đợi | Kết quả thực tế & Cô lập lỗi | Đánh giá |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---:|
| **TC-FR01-D01** | Positive | **SRS Baseline All Valid** | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công; chuyển hướng sang `/login`. | **FAILED.** Form thiếu trường Confirm Password (BUG-FR01-02). Nhập `ValidPass@123` bị regex lỗi chặn và báo "Mật khẩu quá yếu!" (BUG-FR01-01). Không chuyển trang. *(Workaround thông chốt: `ValidPass 123`)*. | **FAILED** |
| **TC-FR01-D02** | Negative | **Name:** `EC-NAME-I1` (Name rỗng) | `""` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi yêu cầu nhập Họ Tên; từ chối submit. | **Cô lập lỗi:** Email và Password giữ chuẩn Baseline. Trình duyệt kích hoạt HTML5 `required` trên Họ Tên, hiển thị tooltip cảnh báo và chặn form. | **PASSED** |
| **TC-FR01-D03** | Negative | **Name:** `EC-NAME-I2` (Name khoảng trắng) | `"   "` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi Họ Tên không hợp lệ; từ chối submit. | **Cô lập lỗi:** Email giữ cố định Baseline; Password dùng workaround `ValidPass 123` để cô lập biến Họ Tên. SUT không trim khoảng trắng, form cho submit và Backend lưu chuỗi khoảng trắng vào CSDL. | **FAILED** |
| **TC-FR01-D17** | Robustness / Negative | **Name:** `EC-NAME-I3` (Name toàn số) | `"12345678"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi Họ tên chỉ được chứa chữ cái; từ chối submit. | **Cô lập lỗi:** Email giữ cố định Baseline; Password dùng workaround `ValidPass 123` để cô lập biến Họ Tên. SUT thiếu regex kiểm tra ký tự; form cho submit và Backend lưu chuỗi số vào CSDL. | **FAILED** |
| **TC-FR01-D18** | Robustness / Security | **Name:** `EC-NAME-I4` (Name script XSS) | `"<script>alert(1)</script>"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi ký tự không hợp lệ; chặn nguy cơ Stored XSS. | **Cô lập lỗi:** Email giữ cố định Baseline; Password dùng workaround `ValidPass 123`. Form và Backend không sanitize; chấp nhận lưu nguyên vẹn chuỗi script XSS vào CSDL. | **FAILED** |
| **TC-FR01-D04** | Negative | **Email:** `EC-EMAIL-I1` (Email rỗng) | `"Nguyen Van A"` | `""` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi yêu cầu nhập Email; từ chối submit. | **Cô lập lỗi:** Name và Password giữ chuẩn Baseline. Thuộc tính HTML5 `required` trên Email chặn submit form. | **PASSED** |
| **TC-FR01-D05** | Negative | **Email:** `EC-EMAIL-I2` (Email thiếu @) | `"Nguyen Van A"` | `"invalidemail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. Input dùng `type="text"` và thiếu regex; Backend chấp nhận lưu email thiếu `@` vào CSDL. | **FAILED** |
| **TC-FR01-D06** | Negative | **Email:** `EC-EMAIL-I3` (Thiếu username) | `"Nguyen Van A"` | `"@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. Thiếu validate định dạng; Backend chấp nhận lưu `@gmail.com` vào CSDL. | **FAILED** |
| **TC-FR01-D07** | Negative | **Email:** `EC-EMAIL-I4` (Thiếu domain) | `"Nguyen Van A"` | `"user@"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. Thiếu validate định dạng; Backend chấp nhận lưu `user@` vào CSDL. | **FAILED** |
| **TC-FR01-D08** | Negative | **Email:** `EC-EMAIL-I5` (Email trùng lặp) | `"Nguyen Van A"` | `"test@eshop.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi Email đã được sử dụng (HTTP 409). | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. Bảng users thiếu UNIQUE và Backend không check trùng; cho phép đăng ký trùng email. | **FAILED** |
| **TC-FR01-D19** | Robustness / Negative | **Email:** `EC-EMAIL-I6` (Ký tự cấm RFC) | `"Nguyen Van A"` | `"user#$!%@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi định dạng email không hợp lệ (RFC 5322). | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. SUT không kiểm tra ký tự cấm; chấp nhận lưu email chứa `#$!%` vào CSDL. | **FAILED** |
| **TC-FR01-D20** | Robustness / Negative | **Email:** `EC-EMAIL-I7` (Cú pháp phi lý `_@)`) | `"Nguyen Van A"` | `"_@)"` | `"ValidPass@123"` | `"ValidPass@123"` | Báo lỗi cấu trúc email không hợp lệ (domain phi lý). | **Cô lập lỗi:** Name giữ cố định Baseline; Password dùng workaround `ValidPass 123`. SUT chấp nhận hoàn toàn `_@)` và lưu thẳng vào CSDL (nguy cơ crash mail server). | **FAILED** |
| **TC-FR01-D09** | Negative | **Password:** `EC-PWD-I1` (Password rỗng) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `""` | `"ValidPass@123"` | Báo lỗi yêu cầu nhập Mật khẩu. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline. Input Password có HTML5 `required` chặn submit. | **PASSED** |
| **TC-FR01-D10** | Negative | **Password:** `EC-PWD-I3` (Thiếu chữ hoa) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"validpass@123"` | `"validpass@123"` | Báo lỗi Mật khẩu phải có ít nhất 1 chữ in hoa. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline; chỉ đổi Password thiếu chữ hoa. Regex phát hiện thiếu chữ hoa; báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D11** | Negative | **Password:** `EC-PWD-I4` (Thiếu chữ thường) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"VALIDPASS@123"` | `"VALIDPASS@123"` | Báo lỗi Mật khẩu phải có ít nhất 1 chữ in thường. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline; chỉ đổi Password thiếu chữ thường. Regex phát hiện thiếu chữ thường; báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D12** | Negative | **Password:** `EC-PWD-I5` (Thiếu chữ số) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass@abc"` | `"ValidPass@abc"` | Báo lỗi Mật khẩu phải có ít nhất 1 chữ số. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline; chỉ đổi Password thiếu chữ số. Regex phát hiện thiếu chữ số; báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D13** | Negative | **Password:** `EC-PWD-I6` (Thiếu ký tự đặc biệt) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass1234"` | `"ValidPass1234"` | Báo lỗi Mật khẩu phải chứa ký tự đặc biệt `@$!%*?&`. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline; Password không có ký tự đặc biệt. SUT từ chối mật khẩu không có ký tự đặc biệt, báo lỗi 'Mật khẩu quá yếu!' và chặn submit. | **PASSED** |
| **TC-FR01-D14** | Negative | **Password:** `EC-PWD-I7` (Ký tự đặc biệt ngoài tập) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass#123"` | `"ValidPass#123"` | Báo lỗi Ký tự đặc biệt ngoài tập cho phép. | **Cô lập lỗi:** Name và Email giữ cố định chuẩn Baseline; Password chứa ký tự `#`. Regex cấm phát hiện `#`, báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D15** | Negative | **Confirm:** `EC-CFM-I1` (Confirm không khớp) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"Different@456"` | Báo lỗi: Mật khẩu xác nhận không khớp. | **Cô lập lỗi:** Name, Email, Password giữ cố định chuẩn Baseline. Form hoàn toàn thiếu trường Xác nhận mật khẩu theo FR-01 (BUG-FR01-02). | **FAILED** |
| **TC-FR01-D16** | Negative | **Confirm:** `EC-CFM-I2` (Confirm rỗng) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `""` | Báo lỗi yêu cầu xác nhận mật khẩu. | **Cô lập lỗi:** Name, Email, Password giữ cố định chuẩn Baseline. Form hoàn toàn thiếu trường Xác nhận mật khẩu theo FR-01 (BUG-FR01-02). | **FAILED** |

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

### Bước 5: Thiết kế và Thực thi Test Cases BVA (Áp dụng Cô Lập Lỗi)

| TC-ID | Điểm biên | Giá trị kiểm thử cụ thể | Name | Email (Dùng chung) | Password (Chuẩn SRS) | Confirm Password | Kết quả mong đợi | Kết quả thực tế & Cô lập lỗi | Đánh giá |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---:|
| **TC-FR01-B01** | Độ dài MK = `LB - 1` (7 ký tự) | 7 ký tự: `"V@1aAbc"` | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"V@1aAbc"` | `"V@1aAbc"` | Báo lỗi: Mật khẩu tối thiểu 8 ký tự. | **Cô lập lỗi:** Name, Email giữ Baseline; chỉ giảm độ dài Password xuống 7. Regex yêu cầu `{8,}` chặn submit và báo "Mật khẩu quá yếu!". | **PASSED** |
| **TC-FR01-B02** | Độ dài MK = `LB` (8 ký tự) | 8 ký tự chuẩn spec: `"V@1aAbcd"` | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"V@1aAbcd"` | `"V@1aAbcd"` | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Name, Email giữ Baseline. Do BUG-FR01-01 regex cấm `@`, mật khẩu 8 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". *(Nếu dùng workaround "V 1aAbcd" thì thành công).* | **FAILED** |
| **TC-FR01-B03** | Độ dài MK = `LB + 1` (9 ký tự) | 9 ký tự chuẩn spec: `"V@1aAbcde"` | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"V@1aAbcde"` | `"V@1aAbcde"` | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Name, Email giữ Baseline. Do BUG-FR01-01 regex cấm `@`, mật khẩu 9 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". | **FAILED** |
| **TC-FR01-B04** | Độ dài MK = Nominal (12 ký tự) | 12 ký tự chuẩn spec: `"ValidPass@12"` | `"Nguyen Van A"` | `"validuser@gmail.com"` | `"ValidPass@12"` | `"ValidPass@12"` | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Name, Email giữ Baseline. Do BUG-FR01-01 regex cấm `@`, mật khẩu 12 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". | **FAILED** |
| **TC-FR01-B05** | Độ dài MK = Extreme (256 ký tự) | 256 ký tự (có hoa, thường, số, `@`) | `"Nguyen Van A"` | `"validuser@gmail.com"` | `256 ký tự` | `256 ký tự` | Hệ thống xử lý an toàn, không crash server. | **Cô lập lỗi:** Name, Email giữ Baseline. SUT tiếp nhận an toàn chuỗi 256 ký tự, CSDL lưu an toàn không crash. *(Lưu ý: Mật khẩu bị lưu plaintext vi phạm SEC-01).* | **PASSED** |
| **TC-FR01-B06** | Độ dài Tên = `LB` (1 ký tự) | Tên 1 ký tự: `"A"` | `"A"` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công (chấp nhận tên ngắn hợp lệ). | **Cô lập lỗi:** Email giữ Baseline; Password dùng workaround `ValidPass 123`. Form và Backend chấp nhận họ tên 1 ký tự `"A"`, tạo tài khoản thành công. | **PASSED** |
| **TC-FR01-B07** | Độ dài Tên = Extreme (256 ký tự) | Chuỗi tên dài 256 ký tự | `256 ký tự` | `"validuser@gmail.com"` | `"ValidPass@123"` | `"ValidPass@123"` | Không vỡ layout giao diện, lưu an toàn vào CSDL. | **Cô lập lỗi:** Email giữ Baseline; Password dùng workaround `ValidPass 123`. Hệ thống tiếp nhận an toàn chuỗi tên 256 ký tự, CSDL lưu an toàn. | **PASSED** |
| **TC-FR01-B08** | Email ngắn nhất hợp lệ | Email ngắn: `"a@b.co"` (6 ký tự) | `"Nguyen Van A"` | `"a@b.co"` | `"ValidPass@123"` | `"ValidPass@123"` | Đăng ký thành công. | **Cô lập lỗi:** Name giữ Baseline; Password dùng workaround `ValidPass 123`. Hệ thống chấp nhận email ngắn nhất hợp lệ 6 ký tự và tạo tài khoản thành công. | **PASSED** |

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
5. **Bỏ sót kiểm thử Độ bền vững & Tập ký tự (Spec-bound Bias in Robustness Testing):**
   * AI có thiên kiến chỉ sinh test case bám sát mặt chữ của đặc tả mà bỏ qua các miền kiểm thử độ bền vững ngoại lai (Robustness Classes) và rủi ro bảo mật:
     * Họ tên là toàn chữ số (`"12345678"`).
     * Họ tên chứa ký tự đặc biệt / mã HTML độc hại (`"<script>alert(1)</script>"`).
     * Email chứa ký tự cấm sai chuẩn RFC 5322 (`"user#$!%@gmail.com"`).
     * Email có cú pháp dị biệt phi lý (`"_@)"` với domain chỉ là một dấu ngoặc đơn đóng không có FQDN/TLD).
   * **Vai trò của Con người (Human-in-the-Loop) & Kỹ thuật Cô lập lỗi (Fault Isolation):** Thông qua phản biện sâu, con người đã đưa các trường hợp này vào kiểm thử và áp dụng kỹ thuật cô lập lỗi (dùng password workaround để vượt qua `BUG-FR01-01`), chứng minh được SUT cho bypass toàn bộ dữ liệu sai hỏng này vào CSDL.

---

## 5. Danh Mục Bugs Thực Tế Được Phát Hiện (Bug Findings)

Từ việc đối soát giữa Đặc tả và Mã nguồn thực tế của EShop, phát hiện **6 BUGS quan trọng** (2 Critical, 2 Major, 1 Minor, 1 Trivial):

| Bug ID | Tên lỗi | Mức độ | Mô tả vi phạm đặc tả |
|:---|:---|:---:|:---|
| **BUG-FR01-01** | Regex mật khẩu sai hoàn toàn so với đặc tả | **Critical** | Frontend dùng regex đòi hỏi dấu cách (`\s`) và cấm ký tự đặc biệt, khiến mật khẩu hợp lệ (`ValidPass@123`) bị từ chối, còn mật khẩu có dấu cách (`ValidPass 123`) lại được chấp nhận. |
| **BUG-FR01-02** | Thiếu hoàn toàn trường Xác nhận mật khẩu | **Major** | Giao diện `/register` không có input Xác nhận mật khẩu theo yêu cầu bắt buộc của FR-01. |
| **BUG-FR01-03** | Trường Email không dùng `type="email"` | **Minor** | Vi phạm FR-02 và FR-22 (Input email đang đặt là `type="text"`). |
| **BUG-FR01-04** | Nút Đăng ký sai màu quy chuẩn UI | **Trivial** | Nút dùng màu đỏ (`bg-red-500`) thay vì màu xanh dương theo FR-21. |
| **BUG-FR01-05** | Backend không hề validate mật khẩu và email | **Critical** | API `POST /api/register` nhận dữ liệu và `INSERT` thẳng vào SQLite mà không kiểm tra độ dài, regex, hay mã hóa mật khẩu (vi phạm SEC-01). |
| **BUG-FR01-06** | Không kiểm tra tập ký tự Họ Tên và Email (chấp nhận số, XSS, cú pháp phi lý `_@)`) | **Major** | SUT không sanitize và validate tập ký tự cho phép; chấp nhận Họ tên toàn số (`12345678`), chuỗi mã script độc hại, và email phi lý `_@)` (nguy cơ Stored XSS và crash SMTP). |

---

## 6. Tổng Kết Thực Thi Test FR-01 (Execution Summary)

* **Tổng số test cases thiết kế & thực thi:** **28 Test Cases** (20 Domain Testing + 8 Boundary Value Analysis).
* **Số test case PASSED:** **13 / 28 (46.4%)**
* **Số test case FAILED:** **15 / 28 (53.6%)**
  * *Domain Testing (20 TCs):* 8 PASSED, 12 FAILED (Bao gồm các lỗi nghiêm trọng: regex mật khẩu chặn mật khẩu chuẩn, không trim khoảng trắng họ tên, email sai định dạng/trùng lặp/chứa ký tự cấm/cú pháp phi lý `_@)` vẫn cho qua, họ tên toàn số hoặc chứa mã script vẫn lưu vào CSDL, và thiếu trường Xác nhận mật khẩu).
  * *BVA Testing (8 TCs):* 5 PASSED, 3 FAILED (Các ca kiểm thử biên mật khẩu hợp lệ 8, 9, 12 ký tự bị FAIL gián tiếp do BUG-FR01-01 regex sai; trong khi biên độ dài cực đại 256 ký tự và biên họ tên/email tối thiểu được hệ thống tiếp nhận an toàn).


