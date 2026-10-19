# Ví dụ mẫu: Domain Testing & BVA cho FR-01 (Đăng ký tài khoản)

> **FR:** FR-01 — Đăng ký tài khoản (Account Registration)
> **Nền tảng:** Web Client (`http://localhost:5173/register`)
> **Nguồn đặc tả:** SUT/eshop-sut/README.md, Mục 2 — FR-01

---

## Bước 1 — Xác định các biến đầu vào

| # | Tên biến | Kiểu dữ liệu | Bắt buộc | Mô tả ràng buộc |
|---|----------|---------------|----------|------------------|
| 1 | Họ Tên (name) | String | Có | Phải cung cấp. Không có ràng buộc cụ thể về format hay độ dài trong đặc tả. |
| 2 | Email | String | Có | Định dạng hợp lệ (`user@domain.com`). Phải là duy nhất trong hệ thống. Trường phải dùng `type="email"`. |
| 3 | Mật khẩu (password) | String | Có | Tối thiểu 8 ký tự. Ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt trong tập {`@`, `$`, `!`, `%`, `*`, `?`, `&`}. |
| 4 | Xác nhận mật khẩu (confirm_password) | String | Có | Phải khớp hoàn toàn với trường Mật khẩu. |

**Ràng buộc liên biến:**
- `confirm_password` phải bằng `password`.
- `email` phải chưa tồn tại trong CSDL.

---

## Bước 2 — Phân chia lớp tương đương (Equivalence Partitioning)

### Biến 1: Họ Tên (name)

| Mã lớp | Loại | Mô tả | Giá trị đại diện |
|--------|------|-------|-------------------|
| EC-N-V1 | Valid | Chuỗi ký tự hợp lệ (chữ cái, khoảng trắng) | `Nguyen Van A` |
| EC-N-I1 | Invalid | Rỗng / không nhập | `""` |
| EC-N-I2 | Invalid | Chỉ chứa khoảng trắng | `"   "` |

### Biến 2: Email

| Mã lớp | Loại | Mô tả | Giá trị đại diện |
|--------|------|-------|-------------------|
| EC-E-V1 | Valid | Đúng format, chưa tồn tại trong hệ thống | `newuser@gmail.com` |
| EC-E-I1 | Invalid | Rỗng / không nhập | `""` |
| EC-E-I2 | Invalid | Sai format (thiếu @) | `usergmail.com` |
| EC-E-I3 | Invalid | Sai format (thiếu domain) | `user@` |
| EC-E-I4 | Invalid | Sai format (thiếu phần tên) | `@gmail.com` |
| EC-E-I5 | Invalid | Email đã tồn tại trong hệ thống | `test@eshop.com` |

### Biến 3: Mật khẩu (password)

| Mã lớp | Loại | Mô tả | Giá trị đại diện |
|--------|------|-------|-------------------|
| EC-PW-V1 | Valid | Đủ tất cả ràng buộc (≥8 ký tự, hoa, thường, số, đặc biệt) | `Test@123` |
| EC-PW-I1 | Invalid | Rỗng / không nhập | `""` |
| EC-PW-I2 | Invalid | Dưới 8 ký tự (nhưng có đủ loại ký tự) | `Te@1ab` (6 ký tự) |
| EC-PW-I3 | Invalid | Thiếu chữ hoa | `test@123` |
| EC-PW-I4 | Invalid | Thiếu chữ thường | `TEST@123` |
| EC-PW-I5 | Invalid | Thiếu chữ số | `Test@abc` |
| EC-PW-I6 | Invalid | Thiếu ký tự đặc biệt | `Test1234` |
| EC-PW-I7 | Invalid | Ký tự đặc biệt nằm ngoài tập cho phép (ví dụ `#`, `^`, `~`) | `Test#123` |

### Biến 4: Xác nhận mật khẩu (confirm_password)

| Mã lớp | Loại | Mô tả | Giá trị đại diện |
|--------|------|-------|-------------------|
| EC-CP-V1 | Valid | Khớp hoàn toàn với password | (giống password) |
| EC-CP-I1 | Invalid | Không khớp với password | `Test@124` (khác 1 ký tự) |
| EC-CP-I2 | Invalid | Rỗng (trong khi password có giá trị) | `""` |

---

## Bước 3 — Test Case từ lớp tương đương (Domain Testing)

### Positive Test Cases

| TC-ID | Mô tả | Name | Email | Password | Confirm | Expected |
|-------|-------|------|-------|----------|---------|----------|
| TC-D01 | Tất cả hợp lệ | `Nguyen Van A` | `nva@gmail.com` | `Test@123` | `Test@123` | Đăng ký thành công, chuyển sang trang Đăng nhập |

### Negative Test Cases (mỗi TC chỉ 1 biến Invalid)

| TC-ID | EC Source | Biến Invalid | Name | Email | Password | Confirm | Expected |
|-------|-----------|-------------|------|-------|----------|---------|----------|
| TC-D02 | EC-N-I1 | Name rỗng | `""` | `nva@gmail.com` | `Test@123` | `Test@123` | Báo lỗi: Họ tên bắt buộc |
| TC-D03 | EC-N-I2 | Name toàn khoảng trắng | `"   "` | `nva@gmail.com` | `Test@123` | `Test@123` | Báo lỗi: Họ tên không hợp lệ |
| TC-D04 | EC-E-I1 | Email rỗng | `Nguyen A` | `""` | `Test@123` | `Test@123` | Báo lỗi: Email bắt buộc |
| TC-D05 | EC-E-I2 | Email thiếu @ | `Nguyen A` | `usergmail.com` | `Test@123` | `Test@123` | Báo lỗi: Email không hợp lệ |
| TC-D06 | EC-E-I3 | Email thiếu domain | `Nguyen A` | `user@` | `Test@123` | `Test@123` | Báo lỗi: Email không hợp lệ |
| TC-D07 | EC-E-I4 | Email thiếu tên | `Nguyen A` | `@gmail.com` | `Test@123` | `Test@123` | Báo lỗi: Email không hợp lệ |
| TC-D08 | EC-E-I5 | Email đã tồn tại | `Nguyen A` | `test@eshop.com` | `Test@123` | `Test@123` | Báo lỗi: Email đã được sử dụng |
| TC-D09 | EC-PW-I1 | Password rỗng | `Nguyen A` | `nva@gmail.com` | `""` | `""` | Báo lỗi: Mật khẩu bắt buộc |
| TC-D10 | EC-PW-I3 | Thiếu chữ hoa | `Nguyen A` | `nva@gmail.com` | `test@123` | `test@123` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ hoa |
| TC-D11 | EC-PW-I4 | Thiếu chữ thường | `Nguyen A` | `nva@gmail.com` | `TEST@123` | `TEST@123` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ thường |
| TC-D12 | EC-PW-I5 | Thiếu chữ số | `Nguyen A` | `nva@gmail.com` | `Test@abc` | `Test@abc` | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ số |
| TC-D13 | EC-PW-I6 | Thiếu ký tự đặc biệt | `Nguyen A` | `nva@gmail.com` | `Test1234` | `Test1234` | Báo lỗi: Mật khẩu phải có ký tự đặc biệt |
| TC-D14 | EC-PW-I7 | Ký tự đặc biệt ngoài tập | `Nguyen A` | `nva@gmail.com` | `Test#123` | `Test#123` | Báo lỗi: Ký tự đặc biệt không hợp lệ |
| TC-D15 | EC-CP-I1 | Confirm khác password | `Nguyen A` | `nva@gmail.com` | `Test@123` | `Test@124` | Báo lỗi: Xác nhận mật khẩu không khớp |
| TC-D16 | EC-CP-I2 | Confirm rỗng | `Nguyen A` | `nva@gmail.com` | `Test@123` | `""` | Báo lỗi: Xác nhận mật khẩu bắt buộc |

---

## Bước 4 — Xác định điểm biên (BVA)

### Biến: Độ dài mật khẩu (ràng buộc: ≥ 8 ký tự)

| Điểm biên | Giá trị (chuỗi ký tự mẫu) | Độ dài | Kỳ vọng |
|---|---|---|---|
| Min - 1 | `Te@1abc` | 7 ký tự | Invalid |
| Min (biên dưới) | `Te@1abcd` | 8 ký tự | Valid |
| Min + 1 | `Te@1abcde` | 9 ký tự | Valid |
| Nominal | `Testing@1234` | 12 ký tự | Valid |

> Lưu ý: Đặc tả không quy định giới hạn trên cho mật khẩu. Do đó không có
> biên trên chính thức. Tuy nhiên, nên bổ sung test case với chuỗi rất dài
> (ví dụ 256 ký tự) để kiểm tra hệ thống có xử lý được không.

### Biến: Email (ràng buộc: format `user@domain.com`, duy nhất)

Email là biến kiểu format chứ không phải kiểu khoảng giá trị liên tục, nên BVA
truyền thống (min/max) không áp dụng trực tiếp. Thay vào đó, test các biên
format:

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Biên format: 1 ký tự trước @ | `a@gmail.com` | Valid |
| Biên format: 1 ký tự sau @ | `user@g.c` | Phụ thuộc HTML5 email validation |
| Email cực dài (254 ký tự — RFC 5321 max) | `aaa...aaa@domain.com` (254 ký tự) | Valid |
| Email vượt 254 ký tự | `aaa...aaa@domain.com` (255 ký tự) | Invalid |

### Biến: Họ tên (name)

Đặc tả không quy định giới hạn min/max cụ thể, nhưng nên test:

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| 1 ký tự | `A` | Valid (giá trị tối thiểu có ý nghĩa) |
| Chuỗi rất dài | 256 ký tự | Xem hệ thống có chặn không |

---

## Bước 5 — Test Case BVA

| TC-ID | Nguồn BVA | Biến | Input | Độ dài/Giá trị | Expected |
|-------|-----------|------|-------|-----------------|----------|
| TC-B01 | Min-1 (Password length) | Password | `Te@1abc` | 7 ký tự | Báo lỗi: mật khẩu quá ngắn |
| TC-B02 | Min (Password length) | Password | `Te@1abcd` | 8 ký tự | Đăng ký thành công |
| TC-B03 | Min+1 (Password length) | Password | `Te@1abcde` | 9 ký tự | Đăng ký thành công |
| TC-B04 | Nominal (Password length) | Password | `Testing@1234` | 12 ký tự | Đăng ký thành công |
| TC-B05 | Extreme max (Password length) | Password | (256 ký tự, có đủ loại ký tự) | 256 ký tự | Xem hệ thống có chấp nhận không |
| TC-B06 | Min valid (Name) | Name | `A` | 1 ký tự | Đăng ký thành công |
| TC-B07 | Extreme max (Name) | Name | (256 ký tự) | 256 ký tự | Xem hệ thống có chấp nhận không |
| TC-B08 | Min format (Email) | Email | `a@g.co` | Ngắn nhất hợp lệ | Đăng ký thành công |

---

## Bước 6 — Bảng Test Case tổng hợp cuối cùng

| TC-ID | Nguồn gốc | Mô tả | Preconditions | Input Data | Test Steps | Expected Result | Actual Result | Pass/Fail |
|-------|-----------|-------|---------------|------------|------------|-----------------|---------------|-----------|
| TC-FR01-D01 | Domain/Positive | Đăng ký với tất cả dữ liệu hợp lệ | Chưa có tài khoản với email này | Name: `Nguyen Van A`, Email: `nva@gmail.com`, Password: `Test@123`, Confirm: `Test@123` | 1. Mở `http://localhost:5173/register` 2. Điền đầy đủ form 3. Bấm nút "Đăng ký" | Đăng ký thành công, chuyển hướng sang trang Đăng nhập | (chưa chạy) | - |
| TC-FR01-D02 | Domain/EC-N-I1 | Họ tên rỗng | - | Name: `""`, Email: `nva@gmail.com`, Password: `Test@123`, Confirm: `Test@123` | 1. Mở /register 2. Để trống Họ tên 3. Điền các trường khác hợp lệ 4. Bấm "Đăng ký" | Hiển thị lỗi: "Họ tên bắt buộc" | (chưa chạy) | - |
| TC-FR01-D03 | Domain/EC-E-I2 | Email sai format (thiếu @) | - | Name: `Nguyen A`, Email: `usergmail.com`, Password: `Test@123`, Confirm: `Test@123` | 1. Mở /register 2. Nhập email sai format 3. Bấm "Đăng ký" | Hiển thị lỗi: "Email không hợp lệ" | (chưa chạy) | - |
| TC-FR01-D04 | Domain/EC-E-I5 | Email đã tồn tại | Tài khoản `test@eshop.com` đã có trong CSDL | Name: `Nguyen A`, Email: `test@eshop.com`, Password: `Test@123`, Confirm: `Test@123` | 1. Mở /register 2. Nhập email đã tồn tại 3. Bấm "Đăng ký" | Hiển thị lỗi: "Email đã được sử dụng" | (chưa chạy) | - |
| TC-FR01-D05 | Domain/EC-PW-I3 | Password thiếu chữ hoa | - | Name: `Nguyen A`, Email: `nva@gmail.com`, Password: `test@123`, Confirm: `test@123` | 1. Mở /register 2. Nhập password thiếu chữ hoa 3. Bấm "Đăng ký" | Hiển thị lỗi mật khẩu | (chưa chạy) | - |
| TC-FR01-D06 | Domain/EC-PW-I6 | Password thiếu ký tự đặc biệt | - | Name: `Nguyen A`, Email: `nva@gmail.com`, Password: `Test1234`, Confirm: `Test1234` | 1. Mở /register 2. Nhập password không có ký tự đặc biệt 3. Bấm "Đăng ký" | Hiển thị lỗi mật khẩu | (chưa chạy) | - |
| TC-FR01-D07 | Domain/EC-PW-I7 | Ký tự đặc biệt ngoài tập cho phép | - | Name: `Nguyen A`, Email: `nva@gmail.com`, Password: `Test#123`, Confirm: `Test#123` | 1. Mở /register 2. Nhập password với `#` thay vì `@$!%*?&` 3. Bấm "Đăng ký" | Hiển thị lỗi: ký tự đặc biệt không hợp lệ | (chưa chạy) | - |
| TC-FR01-D08 | Domain/EC-CP-I1 | Confirm password không khớp | - | Name: `Nguyen A`, Email: `nva@gmail.com`, Password: `Test@123`, Confirm: `Test@124` | 1. Mở /register 2. Nhập confirm khác password 3. Bấm "Đăng ký" | Hiển thị lỗi: "Mật khẩu xác nhận không khớp" | (chưa chạy) | - |
| TC-FR01-B01 | BVA/Min-1 (PW length) | Password 7 ký tự (dưới biên) | - | Name: `Nguyen A`, Email: `nva@gmail.com`, Password: `Te@1abc` (7), Confirm: `Te@1abc` | 1. Mở /register 2. Nhập password 7 ký tự 3. Bấm "Đăng ký" | Hiển thị lỗi: mật khẩu quá ngắn | (chưa chạy) | - |
| TC-FR01-B02 | BVA/Min (PW length) | Password 8 ký tự (biên dưới) | Chưa có tài khoản | Name: `Nguyen A`, Email: `b02@gmail.com`, Password: `Te@1abcd` (8), Confirm: `Te@1abcd` | 1. Mở /register 2. Nhập password 8 ký tự 3. Bấm "Đăng ký" | Đăng ký thành công | (chưa chạy) | - |
| TC-FR01-B03 | BVA/Min+1 (PW length) | Password 9 ký tự | Chưa có tài khoản | Name: `Nguyen A`, Email: `b03@gmail.com`, Password: `Te@1abcde` (9), Confirm: `Te@1abcde` | 1. Mở /register 2. Nhập password 9 ký tự 3. Bấm "Đăng ký" | Đăng ký thành công | (chưa chạy) | - |
| TC-FR01-B04 | BVA/Extreme (PW length) | Password 256 ký tự | Chưa có tài khoản | Name: `Nguyen A`, Email: `b04@gmail.com`, Password: (256 ký tự, đủ loại), Confirm: (khớp) | 1. Mở /register 2. Nhập password cực dài 3. Bấm "Đăng ký" | Xem hệ thống phản hồi | (chưa chạy) | - |
| TC-FR01-B05 | BVA/Min (Name) | Họ tên 1 ký tự | Chưa có tài khoản | Name: `A`, Email: `b05@gmail.com`, Password: `Test@123`, Confirm: `Test@123` | 1. Mở /register 2. Nhập tên 1 ký tự 3. Bấm "Đăng ký" | Đăng ký thành công | (chưa chạy) | - |

---

## Self-Review Checklist

- [x] Đã liệt kê đủ 4 biến đầu vào: name, email, password, confirm_password.
- [x] Mỗi biến có ít nhất 1 lớp Valid và 1+ lớp Invalid.
- [x] Mỗi test case Negative chỉ vi phạm đúng 1 biến.
- [x] Các điểm biên của password length đã được test: 7 (min-1), 8 (min), 9 (min+1).
- [x] Đã xem xét: rỗng, email đã tồn tại, ký tự đặc biệt ngoài tập cho phép.
- [x] Mỗi test case có đủ: ID, Input, Steps, Expected, Actual, Verdict.
- [ ] Actual Result và Pass/Fail sẽ được điền sau khi thực thi test trên EShop.
