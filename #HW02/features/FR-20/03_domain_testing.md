# FR-20 – Mobile: Đăng ký và Hủy đơn · Bước 3–4: Domain Testing

> Quy tắc: mỗi test chỉ vi phạm ĐÚNG MỘT điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn (baseline: name=Nguyen Van A, email mới, password=Abcdef1!, confirm giống password).
> **Hai tầng:** cột "Tầng" cho biết ca chạy trên app (UI), gọi thẳng API, hoặc cả hai. `confirmPassword` không có trong body của `POST /api/register`, nên ca xác nhận mật khẩu chỉ kiểm được ở UI.
> TODO: đối chiếu với slide bài giảng và ghi rõ nếu giảng viên dùng thuật ngữ hoặc thứ tự bước khác.

## 3.1 Lớp tương đương theo từng biến

### Biến: `name` (Họ tên)
| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Chuỗi thường | `Nguyen Van A` | R1 |
| V2 | ✔ | Có dấu tiếng Việt | `Nguyễn Văn Ánh` | R1 |
| I1 | ✘ | Rỗng (thiếu trường bắt buộc) | `""` | R1 |
| U1 | ? | Toàn khoảng trắng | `"   "` | CẦN LÀM RÕ |
| U2 | ? | Chứa HTML | `<b>x</b>` | CẦN LÀM RÕ |
| U3 | ? | Rất dài | 1000 ký tự | CẦN LÀM RÕ |

### Biến: `email`
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

### Biến: `password`
| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1–V7 | ✔ | Đủ 4 loại, ký tự đặc biệt lần lượt là `! @ $ % * ? &` (mỗi phần tử của tập liệt kê là một lớp) | `Abcdef1!` … `Abcdef1&` | R5 |
| I1 | ✘ | Thiếu chữ hoa | `abcdef1!` | R5 |
| I2 | ✘ | Thiếu chữ thường | `ABCDEF1!` | R5 |
| I3 | ✘ | Thiếu chữ số | `Abcdefg!` | R5 |
| I4 | ✘ | Thiếu ký tự đặc biệt | `Abcdefg1` | R5 |
| I5 | ✘ | Ký tự đặc biệt ngoài tập (giả định #3) | `Abcdef1#` | R5 |
| I6 | ✘ | Khoảng trắng thay ký tự đặc biệt (giả định #3) | `Abcdef1 ` | R5 |
| I7 | ✘ | Rỗng | `""` | R1 |
| U1 | ? | Rất dài | 500 ký tự | CẦN LÀM RÕ |

### Biến: `confirmPassword` (chỉ UI)
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Khớp hoàn toàn | giống password | R6 |
| I1 | ✘ | Khác ở ký tự cuối | `Abcdef1?` | R6 |
| I2 | ✘ | Rỗng | `""` | R6 |
| I3 | ✘ | Chỉ khác hoa/thường | `abcdef1!` | R6 |

### Biến: đơn hàng khi hủy
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | Đơn của mình, `pending` | | R8 |
| V2 | ✔ | Đơn của mình, `confirmed` | | R8 |
| I1 | ✘ | `shipping` | | R9 |
| I2 | ✘ | `delivered` | | R10 |
| I3 | ✘ | `canceled` | | R10 |
| I4 | ✘ | Id không tồn tại | `999999` | R11 |
| I5 | ✘ | Id không phải số | `abc` | R11 |
| I6 | ✘ | Thiếu/sai token; đơn người khác | xem AC-C01..03 trong file 05 | R12, R14 |

Gợi ý rà soát lớp: sai kiểu, null / thiếu trường, rỗng, toàn khoảng trắng, quá dài, ký tự đặc biệt, giá trị âm / 0, giá trị không tồn tại.

## 3.2 Test case Domain Testing

### Đăng ký (34 ca)
| ID | Mô tả | Input / cách dựng | Kỳ vọng (theo SRS) | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-R01 | Baseline: mọi trường hợp lệ | name=Nguyen Van A; email=mới; pw=Abcdef1!; confirm=giống | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R1-R7 | UI+API |
| DT-R02 | Họ tên có dấu tiếng Việt | name=Nguyễn Văn Ánh | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R1 | UI+API |
| DT-R03 | Họ tên rỗng | name="" | Từ chối + thông báo lỗi; không tạo tài khoản | R1 | UI+API |
| DT-R04 | Họ tên toàn khoảng trắng | name="   " | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R05 | Họ tên chứa HTML | name=<b>x</b> | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R06 | Họ tên rất dài (1000 ký tự) | name=A×1000 | CẦN LÀM RÕ (#1) | R1 | UI+API |
| DT-R07 | Email hợp lệ dạng khác | email=user.name@domain.com | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R2 | UI+API |
| DT-R08 | Email thiếu @ | email=userdomain.com | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R09 | Email thiếu phần domain | email=user@ | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R10 | Email thiếu phần local | email=@domain.com | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R11 | Email thiếu đuôi miền | email=user@domain | CẦN LÀM RÕ (#8) | R2 | UI+API |
| DT-R12 | Email có khoảng trắng | email=us er@domain.com | Từ chối + thông báo lỗi; không tạo tài khoản | R2 | UI+API |
| DT-R13 | Email rỗng | email="" | Từ chối + thông báo lỗi; không tạo tài khoản | R1 | UI+API |
| DT-R14 | Email đã tồn tại | email=test@eshop.com | Từ chối + thông báo lỗi; không tạo tài khoản | R3 | UI+API |
| DT-R15 | Email trùng khác hoa/thường | email=TEST@ESHOP.COM | CẦN LÀM RÕ (#4) | R3 | UI+API |
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

### Hủy đơn (7 ca)
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

## 3.3 Kết hợp nhiều biến
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

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
