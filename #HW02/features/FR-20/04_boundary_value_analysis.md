# FR-20 – Mobile: Đăng ký và Hủy đơn · Bước 5: Boundary Value Analysis

> BVA chỉ áp dụng cho biến có thứ tự hoặc là số. Biến thể dùng: **3-value** (min−1, min, min+1 và max−1, max, max+1); miền không có biên trên thì bỏ phần max.
> TODO: ghi lại biến thể BVA theo đúng cách giảng viên dạy (2-value / 3-value / robust).

## 4.1 Biến được chọn cho BVA và lý do
| Biến | Miền hợp lệ | Biên dưới | Biên trên | Lý do chọn |
| :--- | :--- | :--- | :--- | :--- |
| Độ dài `password` | ≥ 8 | 8 | không có (CẦN LÀM RÕ #2) | SRS nêu rõ "tối thiểu 8" (R4) |
| Độ dài `name` | ≥ 1 | 1 | không có | Chỉ biên 0/1 vì SRS chỉ nói bắt buộc (R1) |
| Trạng thái đơn (thứ tự: pending=1, confirmed=2, shipping=3, delivered=4) | {pending, confirmed} | pending | confirmed | Biên giữa `confirmed` và `shipping` (R8, R9) |

## 4.2 Bảng giá trị biên
| Biến | min−1 | min | min+1 | max−1 | max | max+1 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| Độ dài password | 7 | 8 | 9 | n/a | n/a | n/a |
| Độ dài name | 0 | 1 | 2 | n/a | n/a | n/a |
| Trạng thái đơn | không có (không có trạng thái trước `pending`) | pending | confirmed (= max) | pending | confirmed | shipping |

Miền trạng thái hẹp (chỉ 2 giá trị hợp lệ), nên min+1 trùng max và max−1 trùng min: gộp lại, nêu rõ trong báo cáo.

## 4.3 Test case BVA
| ID | Mô tả | Input | Kỳ vọng | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BV-R01 | Độ dài 7 (min−1), đủ 4 loại ký tự | pw=Abcde1! | Từ chối + thông báo lỗi; không tạo tài khoản | R4 | UI+API |
| BV-R02 | Độ dài 8 (min) | pw=Abcdef1! | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R4 | UI+API |
| BV-R03 | Độ dài 9 (min+1) | pw=Abcdefg1! | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R4 | UI+API |
| BV-R04 | Độ dài 1 | pw=A | Từ chối + thông báo lỗi; không tạo tài khoản | R4 | UI+API |
| BV-R05 | Độ dài 8, đúng 1 ký tự mỗi loại bắt buộc | pw=A1!bcdef | Thành công: tạo tài khoản, chuyển sang Đăng nhập | R4,R5 | UI+API |
| BV-R06 | Họ tên độ dài 1 (biên dưới) | name=A | CẦN LÀM RÕ (#1) | R1 | UI+API |

| ID | Mô tả | Input / cách dựng | Kỳ vọng | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BV-C01 | Biên thời gian: màn hình còn hiện đơn `confirmed`, admin vừa chuyển sang `shipping`, user bấm Hủy | Mở đơn confirmed trên app → admin PUT status=shipping → bấm Hủy | Từ chối; status giữ `shipping` | R8,R9 | UI+API |

Các điểm biên của trạng thái đơn được phủ bằng ca đã có ở Domain Testing (không chạy lặp): **pending = DT-C01 (min)**, **confirmed = DT-C02 (max)**, **shipping = DT-C03 (max+1)**, **delivered = DT-C04**. Biên độ dài tên rỗng (min−1) = DT-R03, độ dài mật khẩu 0 = DT-R28.

## 4.4 Phân biệt với Domain Testing
- BV-R01..R03 nằm cùng các lớp với DT-R23..R26 nhưng khác mục đích: chúng cố định thành phần ký tự (đủ 4 loại) và chỉ thay đổi **độ dài** để cô lập lỗi ở biên 8.
- BV-R05 kiểm đúng 1 ký tự mỗi loại ở đúng độ dài 8 (tổ hợp biên của hai luật R4 và R5).
- BV-C01 là biên **thời gian** của state machine (trạng thái đổi ngay lúc user thao tác), một loại lỗi Domain Testing tĩnh không bắt được.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
