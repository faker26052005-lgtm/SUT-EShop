# FR-20 – Mobile: Đăng ký và Hủy đơn · Domain Testing

## Bước 1: Trích yêu cầu

### 1.1 Trích nguyên văn từ SRS

**FR-01 (Đăng ký tài khoản)**

- Người dùng phải cung cấp: **Họ Tên**, **Email**, **Mật khẩu**.
- Email phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong hệ thống.
- **Yêu cầu mật khẩu mạnh**: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (`@`, `$`, `!`, `%`, `*`, `?`, `&`).
- Phải có trường **Xác nhận mật khẩu**, hệ thống từ chối nếu hai trường không khớp.
- Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập.

**FR-10 (Order State Machine)**

- Trạng thái `delivered` và `canceled` là **trạng thái kết thúc**, không được phép chuyển sang bất kỳ trạng thái nào khác.
- Khi đơn hàng đã ở trạng thái `shipping`, **User không được phép tự hủy**, chỉ Admin mới có thể thao tác.
- Mọi chuyển đổi không hợp lệ phải trả về lỗi với thông báo phù hợp.
- Sơ đồ: `pending → confirmed → shipping → delivered`; `pending` và `confirmed` có thể sang `canceled` (User/Admin hủy).

**FR-11 (Lịch sử đơn hàng)**

- Người dùng chỉ xem được đơn hàng của chính mình. Hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại. Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc.

**FR-20 (Mobile)**

- Đầy đủ các chức năng: Xem sản phẩm, Đăng nhập, Đăng xuất, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
- Chức năng Hủy đơn hàng tuân theo đúng State Machine ở FR-10 (chỉ được hủy khi `pending` hoặc `confirmed`).

**FR-22 (Form), liên quan tới form đăng ký**

- Trường bắt buộc có ký hiệu `*`; Email dùng `type="email"`; Mật khẩu dùng `type="password"`; thông báo lỗi xuất hiện **trên** nút submit.

**API spec**

- `POST /api/register` body `{name, email, password}`, thành công trả 200 `{message, id}`.
- `PUT /api/orders/:id/cancel`: chuyển đơn sang `canceled`; "Chỉ được thực hiện khi đơn hàng chưa giao".

### 1.2 Bảng yêu cầu

| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Đăng ký phải có Họ Tên, Email, Mật khẩu (bắt buộc) | FR-01 | input |
| R2 | Email đúng định dạng `user@domain.com` | FR-01 | input |
| R3 | Email duy nhất trong hệ thống | FR-01 | nghiệp vụ |
| R4 | Mật khẩu ≥ 8 ký tự | FR-01 | input (BVA) |
| R5 | Mật khẩu có ≥ 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt thuộc `@ $ ! % * ? &` | FR-01 | input |
| R6 | Có trường Xác nhận mật khẩu; từ chối nếu không khớp | FR-01 | input / UI |
| R7 | Đăng ký thành công thì chuyển tới màn Đăng nhập | FR-01 | nghiệp vụ / UI |
| R8 | Chỉ hủy được đơn ở `pending` hoặc `confirmed` | FR-20, FR-10 | nghiệp vụ |
| R9 | `shipping`: User không được tự hủy | FR-10 | nghiệp vụ |
| R10 | `delivered`, `canceled` là trạng thái kết thúc, không chuyển tiếp | FR-10 | nghiệp vụ |
| R11 | Chuyển đổi không hợp lệ phải trả lỗi kèm thông báo phù hợp | FR-10 | nghiệp vụ |
| R12 | Chỉ xem/thao tác đơn của chính mình | FR-11 | truy cập |
| R13 | Trạng thái hiển thị bằng tiếng Việt, phân biệt màu | FR-11 | UI |
| R14 | Mọi thao tác hủy phải có token hợp lệ | SEC (JWT) | truy cập |
| R15 | Trường bắt buộc có `*`, mật khẩu che ký tự, lỗi nằm trên nút submit | FR-22 | UI (**chưa rõ áp dụng cho mobile**) |

### 1.3 Endpoint liên quan

| Method | Endpoint | Cần token / role? | Body / tham số |
| :--- | :--- | :--- | :--- |
| POST | `/api/register` | Không | `{name, email, password}` |
| POST | `/api/login` | Không | `{email, password}` (dùng để kiểm "đăng ký xong đăng nhập được") |
| POST | `/api/cart`, `/api/orders` (checkout) | User | Dựng đơn hàng để test hủy đơn |
| GET | `/api/orders/my-orders` | User | Đọc lại trạng thái đơn |
| PUT | `/api/orders/:id/cancel` | User | Không có body |
| PUT | `/api/admin/orders/:id/status` | Admin | `{status}`: dựng trạng thái `confirmed/shipping/delivered` |

### 1.4 Giả định và chỗ SRS im lặng

| # | Điều chưa rõ | Giả định tạm | Đã hỏi GV/TA? |
| :-: | :--- | :--- | :-: |
| 1 | Họ Tên: độ dài tối thiểu/tối đa, ký tự cho phép, toàn khoảng trắng | Chỉ rỗng là không hợp lệ (R1); còn lại `CẦN LÀM RÕ` | Chưa |
| 2 | Mật khẩu: độ dài tối đa | Không có giới hạn; ca độ dài lớn ghi `CẦN LÀM RÕ` | Chưa |
| 3 | Ký tự đặc biệt ngoài `@$!%*?&` (ví dụ `#`) có tính là "ký tự đặc biệt" | Tập liệt kê là đầy đủ, `#` không thỏa R5 (ghi rõ giả định này trong báo cáo) | Chưa |
| 4 | Email trùng có phân biệt hoa/thường (`TEST@ESHOP.COM`) | `CẦN LÀM RÕ` | Chưa |
| 5 | FR-22 (dấu `*`, `type="email"`, lỗi ở trên nút) có áp dụng cho app mobile; tương đương `keyboardType`/`secureTextEntry` | `CẦN LÀM RÕ` cho phần dấu `*` và vị trí lỗi; che mật khẩu coi là bắt buộc | Chưa |
| 6 | Mã lỗi và thông báo khi hủy đơn không hợp lệ ("lỗi phù hợp") | Chấp nhận mọi mã 4xx kèm thông báo; dữ liệu đơn không đổi | Chưa |
| 7 | Hủy đơn có hoàn lại tồn kho sản phẩm không | Không có yêu cầu nên không test, ghi vào Phụ lục A của `results.md` | Chưa |

## Bước 2: Xác định biến

### 2.1 Biến đầu vào

| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `name` (Họ Tên) | form / body | chuỗi | Bắt buộc (R1) | độ dài, ký tự, toàn khoảng trắng | Độ dài (chỉ biên 0/1 vì chưa rõ max) |
| `email` | form / body | chuỗi | Đúng định dạng, duy nhất (R2, R3) | phân biệt hoa/thường | Không |
| `password` | form / body | chuỗi | ≥ 8 ký tự; 4 loại ký tự; tập đặc biệt `@$!%*?&` (R4, R5) | độ dài tối đa | **Độ dài (min = 8)** |
| `confirmPassword` | form | chuỗi | Phải có và khớp `password` (R6) | có gửi lên API không | Không |
| `orderId` | path | số nguyên | Phải là đơn của chính user (R12) | id không tồn tại, id không phải số | Không |
| Trạng thái đơn khi hủy | dữ liệu có sẵn | enum | `pending`, `confirmed` hủy được; `shipping`, `delivered`, `canceled` thì không (R8–R10) | | **Có thứ tự** (pending < confirmed < shipping < delivered) |

### 2.2 Biến trạng thái / điều kiện ẩn

| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| Email đã tồn tại | Quyết định R3 | Dùng `test@eshop.com` (dữ liệu mẫu), hoặc đăng ký một email rồi đăng ký lại |
| Trạng thái đơn | Quyết định hủy được hay không | Tạo đơn mới bằng user thử (checkout) → `pending`. Dùng token admin gọi `PUT /api/admin/orders/:id/status` lần lượt `confirmed`, `shipping`, `delivered`. Đơn `canceled`: hủy một đơn `pending` |
| Chủ đơn | R12 | Tạo đơn bằng user A, hủy bằng token user B |
| Token | R14 | Không token; token sai (`abc.def.ghi`); token hợp lệ |
| Tầng kiểm thử | Hành vi app khác hành vi API nếu validation nằm ở client | Mỗi ca chạy **ở app (UI)** và **gọi thẳng API**, ghi hai kết quả |

### 2.3 Đầu ra cần quan sát

- **Đăng ký:** thông báo lỗi trên app (nội dung và vị trí), có chuyển sang màn Đăng nhập không, mã HTTP và body từ API, tài khoản có thật sự được tạo không (thử đăng nhập bằng tài khoản vừa tạo).
- **Hủy đơn:** có nút Hủy hay không theo trạng thái, trạng thái đơn đọc lại bằng `GET /api/orders/my-orders`, nhãn tiếng Việt và màu, đơn của người khác có bị ảnh hưởng không.

### 2.4 Nguyên tắc

Chỗ SRS im lặng → ghi `CẦN LÀM RÕ` rồi chuyển sang Phụ lục A của `results.md`. Không tự bịa kỳ vọng.

## Bước 3–4: Chia lớp tương đương và test case Domain Testing

> Quy tắc: mỗi test chỉ vi phạm ĐÚNG MỘT điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn (baseline: name=Nguyen Van A, email mới, password=Abcdef1!, confirm giống password).
> **Hai tầng:** cột "Tầng" cho biết ca chạy trên app (UI), gọi thẳng API, hoặc cả hai. `confirmPassword` không có trong body của `POST /api/register`, nên ca xác nhận mật khẩu chỉ kiểm được ở UI.
> TODO: đối chiếu với slide bài giảng và ghi rõ nếu giảng viên dùng thuật ngữ hoặc thứ tự bước khác.

### 3.1 Lớp tương đương theo từng biến

#### Biến: `name` (Họ tên)

| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Chuỗi thường | `Nguyen Van A` | R1 |
| V2 | ✔ | Có dấu tiếng Việt | `Nguyễn Văn Ánh` | R1 |
| I1 | ✘ | Rỗng (thiếu trường bắt buộc) | `""` | R1 |
| U1 | ? | Toàn khoảng trắng | `"   "` | CẦN LÀM RÕ |
| U2 | ? | Chứa HTML | `<b>x</b>` | CẦN LÀM RÕ |
| U3 | ? | Rất dài | 1000 ký tự | CẦN LÀM RÕ |

#### Biến: `email`

| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Đúng định dạng, chưa tồn tại | `user.name@domain.com` | R2, R3 |
| I1 | ✘ | Thiếu `@` | `userdomain.com` | R2 |
| I2 | ✘ | Thiếu domain | `user@` | R2 |
| I3 | ✘ | Thiếu local | `@domain.com` | R2 |
| I4 | ✘ | Có khoảng trắng | `us er@domain.com` | R2 |
| I5 | ✘ | Rỗng | `""` | R1 |
| I6 | ✘ | Đã tồn tại | `test@eshop.com` | R3 |
| U1 | ? | Thiếu đuôi miền | `user@domain` | CẦN LÀM RÕ |
| U2 | ? | Trùng khác hoa/thường | `TEST@ESHOP.COM` | CẦN LÀM RÕ |

#### Biến: `password`

| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1–V7 | ✔ | Đủ 4 loại, ký tự đặc biệt lần lượt là `! @ $ % * ? &` (mỗi phần tử của tập liệt kê là một lớp) | `Abcdef1!` … `Abcdef1&` | R5 |
| I1 | ✘ | Thiếu chữ hoa | `abcdef1!` | R5 |
| I2 | ✘ | Thiếu chữ thường | `ABCDEF1!` | R5 |
| I3 | ✘ | Thiếu chữ số | `Abcdefg!` | R5 |
| I4 | ✘ | Thiếu ký tự đặc biệt | `Abcdefg1` | R5 |
| I5 | ✘ | Ký tự đặc biệt ngoài tập (giả định #3) | `Abcdef1#` | R5 |
| I6 | ✘ | Khoảng trắng thay ký tự đặc biệt (giả định #3) | `Abcdef1` | R5 |
| I7 | ✘ | Rỗng | `""` | R1 |
| U1 | ? | Rất dài | 500 ký tự | CẦN LÀM RÕ |

#### Biến: `confirmPassword` (chỉ UI)

| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Khớp hoàn toàn | giống password | R6 |
| I1 | ✘ | Khác ở ký tự cuối | `Abcdef1?` | R6 |
| I2 | ✘ | Rỗng | `""` | R6 |
| I3 | ✘ | Chỉ khác hoa/thường | `abcdef1!` | R6 |

#### Biến: đơn hàng khi hủy

| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Đơn của mình, `pending` | | R8 |
| V2 | ✔ | Đơn của mình, `confirmed` | | R8 |
| I1 | ✘ | `shipping` | | R9 |
| I2 | ✘ | `delivered` | | R10 |
| I3 | ✘ | `canceled` | | R10 |
| I4 | ✘ | Id không tồn tại | `999999` | R11 |
| I5 | ✘ | Id không phải số | `abc` | R11 |
| I6 | ✘ | Thiếu/sai token; đơn người khác | xem AC-C01..03 ở Bước 6 | R12, R14 |

Gợi ý rà soát lớp: sai kiểu, null / thiếu trường, rỗng, toàn khoảng trắng, quá dài, ký tự đặc biệt, giá trị âm / 0, giá trị không tồn tại.

### 3.2 Test case Domain Testing

#### Đăng ký (34 ca)

| ID | Mô tả | Input / cách dựng | Kỳ vọng (theo SRS) | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-R01 | Baseline: mọi trường hợp lệ | name=Nguyen Van A; email=mới; pw=Abcdef1!; confirm=giống | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R1-R7 | UI+API |
| DT-R02 | Họ tên có dấu tiếng Việt | name=Nguyễn Văn Ánh | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R1 | UI+API |
| DT-R03 | Họ tên rỗng | name="" | Từ chối + thông báo lỗi; không tạo tài khoản | R1 | UI+API |
| DT-R04 | Họ tên toàn khoảng trắng | name="   " | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R05 | Họ tên chứa HTML | name=<b>x</b> | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R06 | Họ tên rất dài (1000 ký tự) | name=A×1000 | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R07 | Email hợp lệ dạng khác | email=<user.name@domain.com> | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R2 | UI+API |
| DT-R08 | Email thiếu @ | email=userdomain.com | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R09 | Email thiếu phần domain | email=user@ | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R10 | Email thiếu phần local | email=@domain.com | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R11 | Email thiếu đuôi miền | email=user@domain | CẦN LÀM RÕ (#8) | R2 | UI+API |
| DT-R12 | Email có khoảng trắng | email=us <er@domain.com> | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R13 | Email rỗng | email="" | Từ chối + thông báo lỗi; không tạo tài khoản | R1 | UI+API |
| DT-R14 | Email đã tồn tại | email=<test@eshop.com> | Từ chối + thông báo lỗi; không tạo tài khoản | R3 | UI+API |
| DT-R15 | Email trùng khác hoa/thường | email=<TEST@ESHOP.COM> | CẦN LÀM RÕ (#4) | R3 | UI+API |
| DT-R16 | Ký tự đặc biệt hợp lệ `!` | pw=Abcdef1! | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R17 | Ký tự đặc biệt hợp lệ `@` | pw=Abcdef1@ | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R18 | Ký tự đặc biệt hợp lệ `$` | pw=Abcdef1$ | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R19 | Ký tự đặc biệt hợp lệ `%` | pw=Abcdef1% | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R20 | Ký tự đặc biệt hợp lệ `*` | pw=Abcdef1* | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R21 | Ký tự đặc biệt hợp lệ `?` | pw=Abcdef1? | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R22 | Ký tự đặc biệt hợp lệ `&` | pw=Abcdef1& | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R5 | UI+API |
| DT-R23 | Mật khẩu thiếu chữ hoa | pw=abcdef1! | Từ chối + thông báo lỗi; không tạo tài khoản | R5 | UI+API |
| DT-R24 | Mật khẩu thiếu chữ thường | pw=ABCDEF1! | Từ chối + thông báo lỗi; không tạo tài khoản | R5 | UI+API |
| DT-R25 | Mật khẩu thiếu chữ số | pw=Abcdefg! | Từ chối + thông báo lỗi; không tạo tài khoản | R5 | UI+API |
| DT-R26 | Mật khẩu thiếu ký tự đặc biệt | pw=Abcdefg1 | Từ chối + thông báo lỗi; không tạo tài khoản | R5 | UI+API |
| DT-R27 | Ký tự đặc biệt ngoài tập SRS | pw=Abcdef1# | Từ chối + thông báo lỗi; không tạo tài khoản (giả định #3) | R5 | UI+API |
| DT-R28 | Mật khẩu rỗng | pw="" | Từ chối + thông báo lỗi; không tạo tài khoản | R1 | UI+API |
| DT-R29 | Khoảng trắng thay ký tự đặc biệt | pw="Abcdef1 " | Từ chối + thông báo lỗi; không tạo tài khoản (giả định #3) | R5 | UI+API |
| DT-R30 | Mật khẩu rất dài hợp lệ về thành phần | pw=Abcdef1!+500 ký tự | CẦN LÀM RÕ (#2) | R4 | UI+API |
| DT-R31 | Xác nhận không khớp | pw=Abcdef1!; confirm=Abcdef1? | Từ chối + thông báo lỗi; không tạo tài khoản | R6 | UI |
| DT-R32 | Xác nhận rỗng | confirm="" | Từ chối + thông báo lỗi; không tạo tài khoản | R6 | UI |
| DT-R33 | Xác nhận chỉ khác hoa/thường | confirm=abcdef1! | Từ chối + thông báo lỗi; không tạo tài khoản | R6 | UI |
| DT-R34 | Form có ô Xác nhận mật khẩu | Quan sát màn Đăng ký | Có ô Xác nhận mật khẩu | R6 | UI |

#### Hủy đơn (7 ca)

| ID | Mô tả | Input / cách dựng | Kỳ vọng (theo SRS) | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-C01 | Hủy đơn `pending` của mình | status=pending | Thành công: status → canceled | R8 | UI+API |
| DT-C02 | Hủy đơn `confirmed` của mình | status=confirmed | Thành công: status → canceled | R8 | UI+API |
| DT-C03 | Hủy đơn `shipping` (user) | status=shipping | Từ chối + lỗi; status giữ `shipping` | R9 | UI+API |
| DT-C04 | Hủy đơn `delivered` | status=delivered | Từ chối + lỗi; status giữ `delivered` | R10 | UI+API |
| DT-C05 | Hủy lại đơn đã `canceled` | status=canceled | Từ chối + lỗi; status giữ `canceled` | R10 | UI+API |
| DT-C06 | Id đơn không tồn tại | orderId=999999 | 4xx + thông báo (CẦN LÀM RÕ mã cụ thể #6); không 5xx | R11 | API |
| DT-C07 | Id đơn không phải số | orderId=abc | 4xx, không 5xx (CẦN LÀM RÕ #6) | R11 | API |

Kỳ vọng nhận một trong: thành công + dữ liệu đúng, từ chối + dữ liệu không đổi, hoặc `CẦN LÀM RÕ`.

### 3.3 Kết hợp nhiều biến

- **Đăng ký:** mỗi lần chỉ sai một biến, các biến còn lại dùng baseline. Không kết hợp nhiều lỗi trong một test (kết hợp lỗi có thể che nhau).
- **Hủy đơn:** nhiều điều kiện độc lập nên dùng bảng quyết định:

| Tổ hợp | Trạng thái | Chủ đơn | Token | Kết quả mong đợi |
| :-: | :-: | :-: | :-: | :--- |
| 1 | pending | của mình | hợp lệ | Hủy thành công (DT-C01) |
| 2 | confirmed | của mình | hợp lệ | Hủy thành công (DT-C02) |
| 3 | shipping | của mình | hợp lệ | Từ chối (DT-C03) |
| 4 | delivered | của mình | hợp lệ | Từ chối (DT-C04) |
| 5 | canceled | của mình | hợp lệ | Từ chối (DT-C05) |
| 6 | pending | của người khác | hợp lệ | Từ chối (AC-C03) |
| 7 | pending | của mình | không có | 401/403 (AC-C01) |
| 8 | pending | của mình | sai | 401/403 (AC-C02) |

## Bước 6: Nghiệp vụ, bảo mật, truy cập

### 6.1 Danh sách tự hỏi

- [x] Truy cập: không token, token sai (AC-C01, AC-C02)
- [x] Quyền: thao tác trên dữ liệu của người khác (AC-C03)
- [x] Trường bị cấm đổi qua payload: `role` khi đăng ký (BL-R06)
- [x] Tác dụng phụ: hủy một đơn không đổi đơn khác (BL-C02)
- [ ] Tính toán: không áp dụng cho hai chức năng này
- [x] Lặp lại / thứ tự / số lần: bấm hai lần (BL-R03, BL-C04)
- [x] Thời gian / trạng thái: đổi trạng thái ngay lúc thao tác (BV-C01), nhãn và màu (BL-C01, BL-C06)

### 6.2 Test case

| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BL-R01 | Đăng ký thành công thì chuyển sang màn Đăng nhập | Dùng DT-R01 | Màn hiện tại là Đăng nhập | R7 | UI |
| BL-R02 | Đăng nhập bằng tài khoản vừa đăng ký | login với DT-R01 | Đăng nhập thành công | R7 | UI+API |
| BL-R03 | Bấm Đăng ký hai lần liên tiếp | Double tap với dữ liệu hợp lệ | Chỉ có 1 tài khoản; không lỗi 5xx | R3 | UI+API |
| BL-R04 | Mật khẩu bị che ký tự khi nhập | Quan sát ô mật khẩu | Ký tự bị che | R15 | UI |
| BL-R05 | Dấu `*` ở trường bắt buộc, lỗi nằm trên nút Đăng ký | Quan sát form | CẦN LÀM RÕ (#5) | R15 | UI |
| BL-R06 | Gửi kèm role=admin khi đăng ký | body thêm `role:"admin"` | Tài khoản tạo ra có role `user` (SEC-06) | R5* | API |
| BL-C01 | Sau khi hủy, lịch sử hiển thị 'Đã hủy' đúng màu | Hủy đơn `pending` rồi mở Lịch sử | Nhãn tiếng Việt + màu riêng | R13 | UI |
| BL-C02 | Tác dụng phụ: hủy một đơn không đổi đơn khác | Có 2 đơn; hủy đơn 1 | Đơn 2 giữ nguyên trạng thái | R8 | UI+API |
| BL-C03 | Nút Hủy chỉ hiện ở `pending`/`confirmed` | Xem 5 đơn ở 5 trạng thái | Nút chỉ có ở 2 trạng thái đầu | R8 | UI |
| BL-C04 | Bấm Hủy hai lần liên tiếp | Double tap trên đơn `pending` | Lần 2 bị từ chối hoặc bỏ qua; không 5xx | R10 | UI+API |
| BL-C05 | Admin hủy đơn `shipping` | PUT /api/admin/orders/:id/status status=canceled | CẦN LÀM RÕ (sơ đồ không có mũi tên shipping→canceled nhưng FR-10 nói 'chỉ Admin mới thao tác') | R9 | API |
| BL-C06 | Nhãn trạng thái tiếng Việt, mỗi trạng thái một màu | Xem lịch sử với 5 trạng thái | 5 nhãn tiếng Việt; màu phân biệt | R13 | UI |
| AC-C01 | Hủy đơn không có token | PUT cancel không header | 401/403; đơn không đổi | R14 | API |
| AC-C02 | Hủy đơn với token sai | Bearer abc.def.ghi | 401/403; đơn không đổi | R14 | API |
| AC-C03 | Hủy đơn của người khác | Token user B, đơn của user A | Từ chối; đơn của A không đổi | R12 | API |

Tổng: 15 test (12 BL và 3 AC). Cùng với 41 test ở Bước 3–4 (34 đăng ký, 7 hủy đơn) và 7 test ở `bva.md`, bộ test FR-20 có **63 test**.
