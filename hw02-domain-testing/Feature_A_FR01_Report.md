# BÁO CÁO KIỂM THỬ: FEATURE A — FR-01: ĐĂNG KÝ TÀI KHOẢN (ACCOUNT REGISTRATION)

* **Phân hệ (Pool):** Pool A — Authentication, Categories, and Products
* **Chức năng:** FR-01: Đăng ký tài khoản
* **Nền tảng kiểm thử:** Web Client (`http://localhost:5173/register`) & Backend API (`http://localhost:3000/api/register`)
* **Tiêu chuẩn học thuật áp dụng:**
  * **Slide S04:** Domain Testing & Boundary Value Analysis (BVA)
  * **Slide S07:** Test Case Essentials, Objective Syntax (`Action + Function + Condition`) & Template
  * **Slide S08:** Bug Report 10 Essentials & Test Summary Report Statistics

---

## 1. Cơ sở Đặc tả Nghiệp vụ (SRS Baseline)

Trích xuất từ tài liệu đặc tả [SUT/eshop-sut/README.md](file:///c:/Coding/SoftwareTesting/SUT/eshop-sut/README.md):
1. **Dữ liệu bắt buộc:** Người dùng phải cung cấp **Họ Tên**, **Email**, **Mật khẩu**.
2. **Quy tắc Email:** Phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong hệ thống. Trường email phải dùng `type="email"`.
3. **Quy tắc Mật khẩu mạnh:**
   * Tối thiểu 8 ký tự.
   * Chứa ít nhất: 1 chữ hoa (`[A-Z]`), 1 chữ thường (`[a-z]`), 1 chữ số (`[0-9]`), và 1 ký tự đặc biệt thuộc tập: `@`, `$`, `!`, `%`, `*`, `?`, `&`.
4. **Quy tắc Xác nhận Mật khẩu:** Phải có trường **Xác nhận mật khẩu** — hệ thống từ chối nếu hai trường không khớp.
5. **Điều hướng:** Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập (`/login`).

---

## 2. Phần A: Domain Testing (Kiểm thử miền)

### Bước 1: Xác định biến đầu vào & đầu ra (Inputs & Outputs)
Áp dụng Nguyên tắc Bước 1 (Slide S04):

| STT | Tên biến | Kiểu dữ liệu | Bắt buộc | Ràng buộc nghiệp vụ (Constraints) |
|:---:|:---|:---|:---:|:---|
| **1** | `name` (Họ Tên) | String | Có | Không được để trống; chuỗi ký tự hợp lệ; chỉ chứa chữ cái. |
| **2** | `email` (Email) | String | Có | Định dạng email hợp lệ theo RFC 5322 (`user@domain.com`); duy nhất trong CSDL; dùng `type="email"`. |
| **3** | `password` (Mật khẩu) | String | Có | Độ dài $\ge 8$; chứa đủ: hoa, thường, số, ký tự đặc biệt trong tập `{@, $, !, %, *, ?, &}`; không chứa khoảng trắng. |
| **4** | `confirm_password` (Xác nhận MK) | String | Có | Phải khớp 100% với giá trị của `password`. |
| **Out 1** | Thông báo thành công & Chuyển trang | Redirect / Msg | - | Chuyển hướng sang `/login`. |
| **Out 2** | Thông báo lỗi (Error message) | Text / Popup | - | Hiển thị thông báo lỗi cụ thể khi vi phạm bất kỳ ràng buộc nào; từ chối submit. |

---

### Bước 2: Phân chia các lớp tương đương (Equivalence Partitioning)
Áp dụng 4 quy tắc phân lớp từ bài giảng S04 (Range, Set of values, Must-be condition, Splitting rule):

#### 2.1. Biến `name` (Họ Tên)
* **EC-NAME-V1 (Valid):** Chuỗi ký tự chữ cái hợp lệ. *Đại diện:* `"Nguyen Van A"`.
* **EC-NAME-I1 (Invalid):** Chuỗi rỗng `""` (Không nhập).
* **EC-NAME-I2 (Invalid):** Chuỗi chỉ toàn khoảng trắng `"   "`.
* **EC-NAME-I3 (Invalid - Robustness):** Chuỗi chỉ chứa toàn chữ số. *Đại diện:* `"12345678"`.
* **EC-NAME-I4 (Invalid - Security):** Chuỗi chứa ký tự đặc biệt nguy hiểm / mã HTML XSS. *Đại diện:* `"<script>alert(1)</script>"`.

#### 2.2. Biến `email` (Email)
* **EC-EMAIL-V1 (Valid):** Đúng định dạng email chuẩn và chưa tồn tại trong CSDL. *Đại diện:* `"validuser@gmail.com"`.
* **EC-EMAIL-I1 (Invalid):** Email rỗng `""`.
* **EC-EMAIL-I2 (Invalid):** Thiếu ký tự `@` (ví dụ: `"invalidemail.com"`).
* **EC-EMAIL-I3 (Invalid):** Thiếu phần tên người dùng trước `@` (ví dụ: `"@gmail.com"`).
* **EC-EMAIL-I4 (Invalid):** Thiếu phần tên miền sau `@` (ví dụ: `"user@"`).
* **EC-EMAIL-I5 (Invalid):** Email đã tồn tại trong CSDL (ví dụ: `"test@eshop.com"`).
* **EC-EMAIL-I6 (Invalid - Robustness):** Email chứa ký tự cấm sai chuẩn RFC 5322 (ví dụ: `"user#$!%@gmail.com"`).
* **EC-EMAIL-I7 (Invalid - Robustness):** Cú pháp email dị biệt phi lý (ví dụ: `"_@)"` - domain chỉ là dấu đóng ngoặc đơn, không có FQDN/TLD).

#### 2.3. Biến `password` (Mật khẩu)
* **EC-PWD-V1 (Valid):** Thỏa mãn đồng thời cả 5 điều kiện (độ dài $\ge 8$, có hoa, thường, số, đặc biệt cho phép, không cách). *Đại diện:* `"ValidPass@123"`.
* **EC-PWD-I1 (Invalid):** Mật khẩu rỗng `""`.
* **EC-PWD-I2 (Invalid):** Độ dài $< 8$ ký tự (dù có đủ 4 loại ký tự). *Đại diện:* `"V@1aA"`.
* **EC-PWD-I3 (Invalid):** Thiếu chữ cái in hoa. *Đại diện:* `"validpass@123"`.
* **EC-PWD-I4 (Invalid):** Thiếu chữ cái in thường. *Đại diện:* `"VALIDPASS@123"`.
* **EC-PWD-I5 (Invalid):** Thiếu chữ số. *Đại diện:* `"ValidPass@abc"`.
* **EC-PWD-I6 (Invalid):** Thiếu ký tự đặc biệt. *Đại diện:* `"ValidPass1234"`.
* **EC-PWD-I7 (Invalid):** Ký tự đặc biệt nằm ngoài tập cho phép. *Đại diện:* `"ValidPass#123"`.

#### 2.4. Biến `confirm_password` (Xác nhận mật khẩu)
* **EC-CFM-V1 (Valid):** Giá trị trùng khớp hoàn toàn với `password`. *Đại diện:* `"ValidPass@123"`.
* **EC-CFM-I1 (Invalid):** Giá trị khác với `password`. *Đại diện:* `"Different@456"`.
* **EC-CFM-I2 (Invalid):** Để trống trường xác nhận mật khẩu `""`.

---

## 3. Phần B: Boundary Value Analysis (Phân tích giá trị biên)

### Bước 4: Xác định các điểm biên (Boundary Points)
Áp dụng mô hình biên theo Slide S04 (Lower Boundary `LB`, Upper Boundary `UB`, `LB-1`, `LB+1`, `UB-1`, `UB+1`, và Extreme values):

| Biến kiểm thử | Điều kiện biên | LB - 1 (Invalid) | LB (Min Valid) | LB + 1 (Valid) | Nominal (Điển hình) | Extreme / UI Max |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Độ dài Mật khẩu** | $\ge 8$ ký tự | **7 ký tự** (`V@1aAbc`) | **8 ký tự** (`V@1aAbcd`) | **9 ký tự** (`V@1aAbcde`) | **12 ký tự** (`ValidPass@12`) | **256 ký tự** |
| **Độ dài Họ Tên** | Chuỗi không rỗng | **0 ký tự** (Rỗng) | **1 ký tự** (`A`) | **2 ký tự** | **15 ký tự** | **256 ký tự** |
| **Độ dài Email** | Format chuẩn | Rỗng (0 ký tự) | **6 ký tự** (`a@b.co`) | 12 ký tự | 20 ký tự | 255 ký tự |

---

## 4. Phần C: Thiết Kế & Thực Thi Bộ Test Case Chuẩn Hóa (Theo Mẫu Slide S07)

> [!IMPORTANT]
> **Thiết lập Bộ Chuẩn Cô Lập Lỗi (Baseline Setup & Single Fault Assumption):**
> * **Bộ Giá Trị Chuẩn theo Đặc tả (SRS Golden Baseline Input):**
>   * `Name`: `"Nguyen Van A"` *(Cố định khi Name hợp lệ)*
>   * `Email`: `"validuser@gmail.com"` *(Dùng chung một địa chỉ email cố định duy nhất cho tất cả các test case khi Email là biến hợp lệ)*
>   * `Password`: `"ValidPass@123"` *(Thiết kế chuẩn đặc tả FR-01: $\ge 8$ ký tự, có hoa, thường, số, `@`, không khoảng trắng)*
>   * `Confirm Password`: `"ValidPass@123"` *(Khớp 100% với Password)*
> * **Kỹ thuật Thực thi Cô lập lỗi trên SUT (Execution Workaround):**
>   * Do SUT dính lỗi `BUG-FR01-01` (regex cấm `@` và bắt buộc dấu cách) và `BUG-FR01-02` (thiếu trường Confirm Password), việc nhập `ValidPass@123` sẽ bị chặn ngay tại ô Mật khẩu, gây ra hiện tượng **Lỗi che giấu lỗi (Error Masking)**.
>   * Vì vậy, khi kiểm tra các biến mục tiêu khác (**Họ Tên** hoặc **Email**), Tester áp dụng mật khẩu workaround `"ValidPass 123"` tại thời điểm submit để thông chốt giao diện, giúp đưa dữ liệu xuống Backend nhằm **cô lập 100% hành vi kiểm thử của biến mục tiêu**.

### Bảng Thực Thi Test Case Chuẩn Hóa (Test Case Template - Slide S07):

| TC ID | Description (Test Objective)<br>*(Syntax: Action + Function + Operating Condition)* | Pre-conditions & Test Steps | Expected Result | Observed / Actual Result | Status |
|:---|:---|:---|:---|:---|:---:|
| **TC-FR01-D01** | **Verify Registration with Valid Credentials (SRS Baseline)** | **Pre-condition:** SUT sẵn sàng, CSDL reset seed data.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"validuser@gmail.com"`, PW: `"ValidPass@123"`, Confirm: `"ValidPass@123"`.<br>**Steps:**<br>1. Mở `/register`.<br>2. Nhập form theo Test Data.<br>3. Bấm Đăng ký. | Đăng ký thành công; chuyển hướng sang `/login`. | **FAILED.** Form thiếu trường Confirm Password (`BUG-FR01-02`). Nhập `ValidPass@123` bị regex lỗi chặn và báo "Mật khẩu quá yếu!" (`BUG-FR01-01`). Không chuyển trang. *(Workaround thông chốt: `ValidPass 123`)*. | **FAILED** |
| **TC-FR01-D02** | **Test Registration with Empty Name** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `""`, Email: `"validuser@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Để trống Name, nhập Email và PW. 3. Bấm Đăng ký. | Báo lỗi yêu cầu nhập Họ Tên; từ chối submit. | **Cô lập lỗi:** Email và PW giữ Baseline. Trình duyệt kích hoạt HTML5 `required` trên Họ Tên, hiển thị tooltip cảnh báo và chặn form. | **PASSED** |
| **TC-FR01-D03** | **Test Registration with Whitespace Name** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"   "`, Email: `"validuser@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name khoảng trắng, Email baseline, PW baseline (dùng workaround `ValidPass 123`). 3. Bấm Đăng ký. | Báo lỗi Họ Tên không hợp lệ; từ chối submit. | **Cô lập lỗi:** Email giữ Baseline; PW dùng workaround `ValidPass 123`. SUT không trim khoảng trắng, form cho submit và Backend lưu chuỗi khoảng trắng vào CSDL. | **FAILED** |
| **TC-FR01-D17** | **Validate Registration with Numeric-only Name** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"12345678"`, Email: `"validuser@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name toàn số, Email baseline, PW workaround. 3. Bấm Đăng ký. | Báo lỗi Họ tên chỉ được chứa chữ cái; từ chối submit. | **Cô lập lỗi:** SUT thiếu regex kiểm tra ký tự Họ Tên; form cho submit và Backend lưu chuỗi số vào CSDL. | **FAILED** |
| **TC-FR01-D18** | **Validate Registration with Stored XSS Script in Name** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"<script>alert(1)</script>"`, Email: `"validuser@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name mã độc XSS, Email baseline, PW workaround. 3. Bấm Đăng ký. | Báo lỗi ký tự không hợp lệ; chặn mã độc XSS. | **Cô lập lỗi:** Form và Backend không sanitize đầu vào; chấp nhận lưu nguyên vẹn chuỗi script XSS vào CSDL. | **FAILED** |
| **TC-FR01-D04** | **Test Registration with Empty Email** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `""`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name, để trống Email, nhập PW. 3. Bấm Đăng ký. | Báo lỗi yêu cầu nhập Email; từ chối submit. | **Cô lập lỗi:** Name và PW giữ Baseline. Thuộc tính HTML5 `required` trên trường Email chặn submit form. | **PASSED** |
| **TC-FR01-D05** | **Test Registration with Email Missing @ Symbol** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"invalidemail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email thiếu `@`, PW workaround. 3. Bấm Đăng ký. | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Input dùng `type="text"` và thiếu regex format; Backend chấp nhận lưu email thiếu `@` vào CSDL. | **FAILED** |
| **TC-FR01-D06** | **Test Registration with Email Missing Username** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email thiếu user, PW workaround. 3. Bấm Đăng ký. | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Input thiếu validation; Backend chấp nhận lưu `@gmail.com` vào CSDL. | **FAILED** |
| **TC-FR01-D07** | **Test Registration with Email Missing Domain** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"user@"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email thiếu domain, PW workaround. 3. Bấm Đăng ký. | Báo lỗi định dạng email không hợp lệ. | **Cô lập lỗi:** Input thiếu validation; Backend chấp nhận lưu `user@` vào CSDL. | **FAILED** |
| **TC-FR01-D08** | **Validate Registration with Duplicate Existing Email** | **Pre-condition:** CSDL đã có tài khoản `test@eshop.com`.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"test@eshop.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email trùng, PW workaround. 3. Bấm Đăng ký. | Báo lỗi Email đã được sử dụng (HTTP 409). | **Cô lập lỗi:** Bảng users thiếu UNIQUE và Backend không check trùng; cho phép đăng ký trùng email. | **FAILED** |
| **TC-FR01-D19** | **Validate Registration with Email Containing RFC-illegal Characters** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"user#$!%@gmail.com"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email chứa ký tự cấm, PW workaround. 3. Bấm Đăng ký. | Báo lỗi định dạng email không hợp lệ (RFC 5322). | **Cô lập lỗi:** Input `type="text"` không chặn; Backend chấp nhận lưu email chứa `#$!%` vào CSDL. | **FAILED** |
| **TC-FR01-D20** | **Validate Registration with Malformed Nonsensical Email '_@)'** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"_@)"`, PW: `"ValidPass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email cú pháp phi lý `_@)`, PW workaround. 3. Bấm Đăng ký. | Báo lỗi cấu trúc email không hợp lệ (domain phi lý). | **Cô lập lỗi:** SUT chấp nhận hoàn toàn `_@)` và lưu thẳng vào CSDL (nguy cơ crash SMTP server). | **FAILED** |
| **TC-FR01-D09** | **Test Registration with Empty Password** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"Nguyen Van A"`, Email: `"validuser@gmail.com"`, PW: `""`.<br>**Steps:** 1. Mở `/register`. 2. Để trống PW. 3. Bấm Đăng ký. | Báo lỗi yêu cầu nhập Mật khẩu. | **Cô lập lỗi:** Name và Email giữ Baseline. Input Password có HTML5 `required` chặn submit. | **PASSED** |
| **TC-FR01-D10** | **Test Registration with Password Missing Uppercase Letter** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"validpass@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW thiếu chữ hoa. 3. Bấm Đăng ký. | Báo lỗi Mật khẩu phải có ít nhất 1 chữ in hoa. | **Cô lập lỗi:** Regex phát hiện thiếu chữ in hoa; hiển thị thông báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D11** | **Test Registration with Password Missing Lowercase Letter** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"VALIDPASS@123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW thiếu chữ thường. 3. Bấm Đăng ký. | Báo lỗi Mật khẩu phải có ít nhất 1 chữ in thường. | **Cô lập lỗi:** Regex phát hiện thiếu chữ in thường; hiển thị thông báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D12** | **Test Registration with Password Missing Digit** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass@abc"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW thiếu chữ số. 3. Bấm Đăng ký. | Báo lỗi Mật khẩu phải có ít nhất 1 chữ số. | **Cô lập lỗi:** Regex phát hiện thiếu chữ số; hiển thị thông báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D13** | **Validate Registration with Password Missing Special Character** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass1234"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW không có ký tự đặc biệt. 3. Bấm Đăng ký. | Báo lỗi Mật khẩu phải chứa ký tự đặc biệt `@$!%*?&`. | **Cô lập lỗi:** SUT từ chối mật khẩu không có ký tự đặc biệt, báo lỗi 'Mật khẩu quá yếu!' và chặn submit. | **PASSED** |
| **TC-FR01-D14** | **Validate Registration with Password Containing Outside Special Char** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass#123"`.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW chứa `#`. 3. Bấm Đăng ký. | Báo lỗi Ký tự đặc biệt ngoài tập cho phép. | **Cô lập lỗi:** Regex cấm phát hiện `#`, báo lỗi "Mật khẩu quá yếu!" và chặn submit. | **PASSED** |
| **TC-FR01-D15** | **Validate Registration with Confirm Password Mismatch** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass@123"`, Confirm: `"Different@456"`.<br>**Steps:** 1. Mở `/register`. 2. Cố gắng nhập Confirm khác PW. 3. Bấm Đăng ký. | Báo lỗi: Mật khẩu xác nhận không khớp. | **Cô lập lỗi:** Form hoàn toàn thiếu trường Xác nhận mật khẩu theo FR-01 (`BUG-FR01-02`). | **FAILED** |
| **TC-FR01-D16** | **Test Registration with Empty Confirm Password** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass@123"`, Confirm: `""`.<br>**Steps:** 1. Mở `/register`. 2. Để trống Confirm. 3. Bấm Đăng ký. | Báo lỗi yêu cầu xác nhận mật khẩu. | **Cô lập lỗi:** Form hoàn toàn thiếu trường Xác nhận mật khẩu theo FR-01 (`BUG-FR01-02`). | **FAILED** |
| **TC-FR01-B01** | **Verify Password Length at Lower Boundary - 1 (7 chars)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"V@1aAbc"` (7 ký tự).<br>**Steps:** 1. Mở `/register`. 2. Nhập PW 7 ký tự. 3. Bấm Đăng ký. | Báo lỗi: Mật khẩu tối thiểu 8 ký tự. | **Cô lập lỗi:** Regex yêu cầu `{8,}` chặn submit và báo "Mật khẩu quá yếu!". | **PASSED** |
| **TC-FR01-B02** | **Verify Password Length at Lower Boundary (8 chars - Spec Min)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"V@1aAbcd"` (8 ký tự).<br>**Steps:** 1. Mở `/register`. 2. Nhập PW 8 ký tự chuẩn spec. 3. Bấm Đăng ký. | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Do `BUG-FR01-01` regex cấm `@`, mật khẩu 8 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". *(Workaround `V 1aAbcd` thành công)*. | **FAILED** |
| **TC-FR01-B03** | **Verify Password Length at Lower Boundary + 1 (9 chars)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"V@1aAbcde"` (9 ký tự).<br>**Steps:** 1. Mở `/register`. 2. Nhập PW 9 ký tự chuẩn spec. 3. Bấm Đăng ký. | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Do `BUG-FR01-01` regex cấm `@`, mật khẩu 9 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". | **FAILED** |
| **TC-FR01-B04** | **Verify Password Length at Nominal (12 chars)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: `"ValidPass@12"` (12 ký tự).<br>**Steps:** 1. Mở `/register`. 2. Nhập PW 12 ký tự. 3. Bấm Đăng ký. | Đăng ký thành công; chuyển hướng `/login`. | **Cô lập lỗi:** Do `BUG-FR01-01` regex cấm `@`, mật khẩu 12 ký tự chuẩn spec bị từ chối sai với lỗi "Mật khẩu quá yếu!". | **FAILED** |
| **TC-FR01-B05** | **Validate Password Robustness at Extreme Upper Length (256 chars)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: Baseline, PW: chuỗi 256 ký tự.<br>**Steps:** 1. Mở `/register`. 2. Nhập PW 256 ký tự. 3. Bấm Đăng ký. | Hệ thống xử lý an toàn, không crash server. | **Cô lập lỗi:** SUT tiếp nhận an toàn chuỗi 256 ký tự, CSDL lưu an toàn không crash. *(Lưu ý: Mật khẩu bị lưu plaintext vi phạm SEC-01)*. | **PASSED** |
| **TC-FR01-B06** | **Verify Name Length at Lower Boundary (1 char)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: `"A"`, Email: Baseline, PW: Baseline.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name 1 ký tự, PW workaround. 3. Bấm Đăng ký. | Đăng ký thành công (chấp nhận tên ngắn hợp lệ). | **Cô lập lỗi:** Form và Backend chấp nhận họ tên 1 ký tự `"A"`, tạo tài khoản thành công. | **PASSED** |
| **TC-FR01-B07** | **Validate Name Robustness at Extreme Upper Length (256 chars)** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: chuỗi 256 ký tự, Email: Baseline, PW: Baseline.<br>**Steps:** 1. Mở `/register`. 2. Nhập Name 256 ký tự, PW workaround. 3. Bấm Đăng ký. | Không vỡ layout giao diện, lưu an toàn vào CSDL. | **Cô lập lỗi:** Hệ thống tiếp nhận an toàn chuỗi tên 256 ký tự, CSDL lưu an toàn. | **PASSED** |
| **TC-FR01-B08** | **Verify Email Length at Shortest Valid Length (6 chars 'a@b.co')** | **Pre-condition:** SUT sẵn sàng.<br>**Test Data:** Name: Baseline, Email: `"a@b.co"`, PW: Baseline.<br>**Steps:** 1. Mở `/register`. 2. Nhập Email 6 ký tự, PW workaround. 3. Bấm Đăng ký. | Đăng ký thành công. | **Cô lập lỗi:** Hệ thống chấp nhận email ngắn nhất hợp lệ 6 ký tự và tạo tài khoản thành công. | **PASSED** |

---

## 5. Phần D: Phân Tích Khoảng Trống Của AI (AI Gap Analysis)

Khi sử dụng các công cụ AI thông thường (ChatGPT/Claude/Copilot) chỉ với prompt chung chung *"hãy sinh test case cho chức năng đăng ký EShop"*, AI thường bỏ sót các điểm cốt lõi sau:

1. **Bỏ sót sự che giấu lỗi do Regex sai trong mã nguồn (Code-level flaw):**
   * *Thực tế:* File [Register.jsx](file:///c:/Coding/SoftwareTesting/Seminar/src/eshop-sut/frontend-web/src/pages/Register.jsx#L15) dùng `flawedStrongPasswordRegex` bắt buộc dấu cách (`\s`) và cấm ký tự đặc biệt (`@$!%*?&`).
   * AI nếu chỉ đọc đặc tả sẽ thiết kế test case có `@`, và khi chạy thực tế sẽ bị FAIL mà không hiểu tại sao. AI cần được hướng dẫn kiểm tra chéo (cross-check) với implementation.
2. **Bỏ sót trường Confirm Password:**
   * AI thường giả định form đăng ký đã có đủ trường Xác nhận Mật khẩu, nhưng thực tế giao diện Web EShop **quên code hoàn toàn trường này**!
3. **Bỏ sót vi phạm chuẩn kiểu dữ liệu HTML5 (FR-22):**
   * Input email trên UI dùng `type="text"` thay vì `type="email"`. AI thường chỉ tập trung vào logic backend mà bỏ qua các thuộc tính kiểm thử giao diện.
4. **Bỏ sót kiểm thử Độ bền vững & Tập ký tự (Spec-bound Bias in Robustness Testing):**
   * AI có thiên kiến chỉ sinh test case bám sát mặt chữ của đặc tả mà bỏ qua các miền kiểm thử độ bền vững ngoại lai (Robustness Classes) và rủi ro bảo mật:
     * Họ tên là toàn chữ số (`"12345678"`).
     * Họ tên chứa ký tự đặc biệt / mã HTML độc hại (`"<script>alert(1)</script>"`).
     * Email chứa ký tự cấm sai chuẩn RFC 5322 (`"user#$!%@gmail.com"`).
     * Email có cú pháp dị biệt phi lý (`"_@)"` với domain chỉ là một dấu ngoặc đơn đóng không có FQDN/TLD).
   * **Vai trò của Con người (Human-in-the-Loop) & Kỹ thuật Cô lập lỗi (Fault Isolation):** Thông qua phản biện sâu, con người đã đưa các trường hợp này vào kiểm thử và áp dụng kỹ thuật cô lập lỗi (dùng password workaround để vượt qua `BUG-FR01-01`), chứng minh được SUT cho bypass toàn bộ dữ liệu sai hỏng này vào CSDL.

---

## 6. Phần E: Danh Mục Hồ Sơ Lỗi (Bug Reports - Chuẩn 10 Thành Phần Slide S08)

Từ việc đối soát giữa Đặc tả và Mã nguồn thực tế của EShop, phát hiện **6 BUGS quan trọng** (được lập hồ sơ chi tiết theo chuẩn 10 thành phần của Slide S08):

### Hồ Sơ Chi Tiết Từng Lỗi:

#### BUG-FR01-01: Regex mật khẩu bắt buộc khoảng trắng và cấm ký tự đặc biệt
1. **Bug ID:** `BUG-FR01-01`
2. **Function name:** `FR-01: Đăng ký tài khoản (Frontend Web)`
3. **Problem summary:** `Verify Registration with Valid Password: Valid password 'ValidPass@123' is rejected with 'Mật khẩu quá yếu!' instead of being accepted.`
4. **How to reproduce the defect:**
   * **Environment:** Windows 11, Google Chrome 120+, Frontend Web port 5173, React 18.
   * **Steps to Reproduce:**
     1. Truy cập `http://localhost:5173/register`.
     2. Nhập Họ Tên: `"Nguyen Van A"`, Email: `"validuser@gmail.com"`.
     3. Nhập Mật khẩu: `"ValidPass@123"`.
     4. Bấm nút "Đăng ký".
   * **Expected Behavior:** Hệ thống chấp nhận mật khẩu hợp lệ có chứa ký tự `@` theo đặc tả FR-01 và gửi request lên backend.
   * **Actual Behavior:** Trình duyệt hiển thị popup thông báo lỗi *"Mật khẩu quá yếu!"*; form bị chặn không submit. Trong code `Register.jsx` dòng 15, regex `flawedStrongPasswordRegex` chứa `(?=.*\s)` đòi hỏi dấu cách và tập ký tự `[A-Za-z\d\s]` cấm hoàn toàn ký tự `@`.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Frontend Developer
8. **Status:** `Open`
9. **Priority:** `Immediate (Critical)`
10. **Severity:** `Serious`

---

#### BUG-FR01-02: Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu"
1. **Bug ID:** `BUG-FR01-02`
2. **Function name:** `FR-01: Đăng ký tài khoản (Frontend Web)`
3. **Problem summary:** `Validate Confirm Password input: Form completely lacks Confirm Password field instead of providing confirmation validation.`
4. **How to reproduce the defect:**
   * **Environment:** Windows 11, Chrome Browser, `http://localhost:5173/register`.
   * **Steps to Reproduce:**
     1. Mở trang `/register`.
     2. Quan sát các trường nhập liệu trên form đăng ký.
   * **Expected Behavior:** Form phải có 4 trường: Họ Tên, Email, Mật khẩu, Xác nhận Mật khẩu theo yêu cầu bắt buộc của FR-01.
   * **Actual Behavior:** Form chỉ có 3 ô input: `name`, `email`, `password`. Hoàn toàn không có ô `confirmPassword`, dẫn đến người dùng không có chốt chặn đối chiếu khi gõ nhầm mật khẩu.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Frontend Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

#### BUG-FR01-03: Trường Email không dùng `type="email"` và thiếu format validation
1. **Bug ID:** `BUG-FR01-03`
2. **Function name:** `FR-01: Đăng ký tài khoản (Frontend Web)`
3. **Problem summary:** `Test Email field validation: Email input uses type='text' instead of type='email', allowing invalid formats like 'invalidemail.com' to submit.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173.
   * **Steps to Reproduce:**
     1. Mở `/register`.
     2. Nhập Name: `"Nguyen Van A"`, Email: `"invalidemail.com"` (thiếu `@`), Mật khẩu workaround: `"ValidPass 123"`.
     3. Bấm "Đăng ký".
   * **Expected Behavior:** Trình duyệt hoặc form báo lỗi định dạng email không hợp lệ và chặn submit.
   * **Actual Behavior:** Form submit thành công vì input khai báo `type="text"` (dòng 48 file `Register.jsx`) và không có bất kỳ regex nào kiểm tra cú pháp email RFC 5322.
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Frontend Developer
8. **Status:** `Open`
9. **Priority:** `Medium`
10. **Severity:** `Medium`

---

#### BUG-FR01-04: Nút "Đăng ký" sai màu quy chuẩn thiết kế UI
1. **Bug ID:** `BUG-FR01-04`
2. **Function name:** `FR-01: Đăng ký tài khoản (Frontend UI)`
3. **Problem summary:** `Check Submit Button Styling: Register button uses red background (bg-red-500) instead of standard blue.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client port 5173.
   * **Steps to Reproduce:** Mở `/register` và quan sát nút "Đăng ký".
   * **Expected Behavior:** Nút hành động chính phải có màu xanh dương theo quy chuẩn thiết kế FR-21.
   * **Actual Behavior:** Nút hiển thị màu đỏ cảnh báo (`bg-red-500`).
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Frontend Developer
8. **Status:** `Open`
9. **Priority:** `Low`
10. **Severity:** `Cosmetic`

---

#### BUG-FR01-05: Backend không validate dữ liệu, không check trùng email, lưu mật khẩu plaintext
1. **Bug ID:** `BUG-FR01-05`
2. **Function name:** `FR-01: API Đăng ký tài khoản (Backend API)`
3. **Problem summary:** `Validate Register API security: Backend saves duplicate email and plaintext password without hashing instead of rejecting with HTTP 409 and hashing password.`
4. **How to reproduce the defect:**
   * **Environment:** Backend API `http://localhost:3000/api/register`, SQLite 3.
   * **Steps to Reproduce:**
     1. Gửi request `POST /api/register` với body: `{"name": "Nguyen Van A", "email": "test@eshop.com", "password": "ValidPass 123"}` (email đã tồn tại).
     2. Kiểm tra CSDL bảng `users`.
   * **Expected Behavior:** Backend trả về mã lỗi HTTP 409 Conflict báo email đã tồn tại; mật khẩu phải được băm bảo mật (SEC-01).
   * **Actual Behavior:** Backend trả về HTTP 200/201 tạo thành công. Bảng `users` trong `database.js` không có ràng buộc `UNIQUE` cho cột email và lưu mật khẩu dạng bản rõ (plaintext).
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Backend Developer
8. **Status:** `Open`
9. **Priority:** `Immediate (Critical)`
10. **Severity:** `Fatal`

---

#### BUG-FR01-06: Hệ thống không kiểm tra tập ký tự Họ Tên và Email (chấp nhận số, script XSS, cú pháp phi lý `_@)`)
1. **Bug ID:** `BUG-FR01-06`
2. **Function name:** `FR-01: Input Sanitization & Validation (Full Stack)`
3. **Problem summary:** `Validate Character Sets: SUT accepts numeric names, XSS script payloads, and malformed email '_@)' instead of enforcing strict character validation.`
4. **How to reproduce the defect:**
   * **Environment:** Web Client :5173 & Backend :3000.
   * **Steps to Reproduce:**
     1. Nhập Họ Tên: `"<script>alert(1)</script>"`, Email: `"_@)"`, Mật khẩu workaround: `"ValidPass 123"`.
     2. Bấm Đăng ký.
   * **Expected Behavior:** Hệ thống từ chối submit, báo lỗi họ tên chứa ký tự không hợp lệ và cấu trúc email không hợp lệ.
   * **Actual Behavior:** Cả Frontend và Backend đều không lọc (sanitize), lưu thẳng tài khoản với mã độc script và email phi lý `_@)` vào CSDL (nguy cơ Stored XSS và crash SMTP).
5. **Reported by:** Nguyễn Hoàng Anh Tú (MSSV: 23120183)
6. **Date:** 2026-10-19
7. **Assign to:** Fullstack Developer
8. **Status:** `Open`
9. **Priority:** `High`
10. **Severity:** `Serious`

---

## 7. Phần F: Báo Cáo Tổng Kết Kiểm Thử (Test Summary Report - Chuẩn Slide S08)

Áp dụng các bảng biểu thống kê chuẩn mực theo bài giảng S08:

### 7.1. Bảng Thống Kê Theo Chức Năng (Statistics by Function - Slide S08 Slide 18)

| No | Items (Function) | Tested | Passed | Failed | Blocked | Skipped | Total TCs | Test Coverage |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1** | **FR-01: Account Registration** | **28** | **13** | **15** | **0** | **0** | **28** | **100%** |
| | *— Domain Testing Cases* | 20 | 8 | 12 | 0 | 0 | 20 | 100% |
| | *— Boundary Value Analysis (BVA)* | 8 | 5 | 3 | 0 | 0 | 8 | 100% |

---

### 7.2. Bảng Thống Kê Lỗi Theo Bản Chất Kỹ Thuật (Statistics by Defect Type - Slide S08 Slide 19)

| Defect Type (Bản chất lỗi) | Fatal | Serious | Medium | Cosmetic | Tổng số Lỗi | Tỷ lệ (%) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Security - Access Control & Plaintext** | 1 | 0 | 0 | 0 | **1** | 16.7% |
| **Business logic & Regex validation** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **Feature missing (Thiếu Confirm Password)** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **Data - Database integrity (Thiếu UNIQUE)** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **Input Sanitization & Robustness (XSS, `_@)`)** | 0 | 1 | 0 | 0 | **1** | 16.7% |
| **User Interface (HTML5 type, Button color)** | 0 | 0 | 1 | 1 | **2** | 33.3% |
| **TỔNG CỘNG** | **1** | **4** | **1** | **1** | **6 Bugs** | **100%** |

---

### 7.3. Bảng Thống Kê Lỗi Theo Mức Độ Nghiêm Trọng (Statistics by Defect Severity - Slide S08 Slide 21)

| Mức độ nghiêm trọng (Severity) | Định nghĩa theo bài giảng S08 | Số lượng phát hiện | Tỷ lệ (%) |
|:---|:---|:---:|:---:|
| **Fatal** | Gây sập hệ thống, mất an toàn dữ liệu, lưu mật khẩu plaintext (SEC-01) | 1 | 16.7% |
| **Serious** | Ảnh hưởng tính năng chính: regex chặn người dùng hợp lệ, thiếu confirm password, thiếu UNIQUE, không sanitize | 4 | 66.7% |
| **Medium** | Sai lệch nhỏ đặc tả: input email dùng `type="text"` thay vì `type="email"` | 1 | 16.7% |
| **Cosmetic** | Lỗi thẩm mỹ giao diện: nút đăng ký màu đỏ (`bg-red-500`) thay vì màu xanh | 1 | 16.7% |
| **TỔNG CỘNG** | | **6 Bugs** | **100%** |
