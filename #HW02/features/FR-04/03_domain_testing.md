# FR-04 – Quản lý hồ sơ cá nhân · Bước 3–4: Domain Testing

> Ý tưởng: chia mọi giá trị của một biến thành các lớp mà hệ thống phải xử lý như nhau, rồi chọn một đại diện cho mỗi lớp.
> Quy tắc: mỗi test chỉ vi phạm đúng một điều kiện.

## 3.1 Lớp tương đương theo từng biến

### Biến `phone` (R2)
| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Test |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | 10 chữ số, bắt đầu `0` | `0912345678` | DT-01 |
| V2 | ✔ | 11 chữ số, bắt đầu `0` | `09123456789` | DT-02 |
| I1 | ✘ | Bắt đầu khác `0` (vẫn 10 chữ số) | `9123456789` | DT-03 |
| I2 | ✘ | Chứa chữ cái | `09123abcde` | DT-04 |
| I3 | ✘ | Có khoảng trắng | `0912 345 678` | DT-05 |
| I4 | ✘ | Dạng quốc tế `+84` (vi phạm cả "đầu `0`" và "toàn chữ số", không tách riêng được) | `+84912345678` | DT-06 |
| I5 | ✘ | Ký tự đặc biệt (dấu gạch) | `0912-345-678` | DT-07 |
| I6 | ✘ | Sai kiểu: số. JSON không giữ được số `0` đầu nên giá trị này vi phạm thêm cả đầu số và độ dài | `912345678` | DT-08 |
| I7 | ✘ | Sai kiểu: boolean | `true` | DT-08b |
| I8 | ✘ | Sai kiểu: mảng | `["0912345678"]` | DT-08c |
| I9 | ✘ | Quá ngắn (< 10 chữ số) | `012345678` | BV-01 (xem `04`) |
| I10 | ✘ | Quá dài (> 11 chữ số) | `012345678901` | BV-04 (xem `04`) |
| U1 | CẦN LÀM RÕ | Chuỗi rỗng | `""` | DT-09 |
| U2 | CẦN LÀM RÕ | `null` | `null` | DT-08d |

### Biến `name` (R1)
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Test |
| :--- | :-: | :--- | :--- | :--- |
| N-V1 | ✔ | Tên thường, không dấu | `Nguyen Van A` | DT-10 |
| N-V2 | ✔ | Tên có dấu tiếng Việt | `Nguyễn Văn Ánh` | DT-11 |
| N-U1 | CẦN LÀM RÕ | Rỗng | `""` | DT-12 |
| N-U2 | CẦN LÀM RÕ | Toàn khoảng trắng | `"   "` | DT-13 |
| N-U3 | CẦN LÀM RÕ | Chứa HTML (UI phải escape theo SEC-04) | `<b>x</b>` | DT-14 |
| N-U4 | CẦN LÀM RÕ | Rất dài (SRS không nêu giới hạn) | 1000 ký tự `A` | DT-17 |

### Biến `shipping_address` (R1)
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Test |
| :--- | :-: | :--- | :--- | :--- |
| A-V1 | ✔ | Địa chỉ thường | `123 Le Loi, Q1, TP.HCM` | DT-15 |
| A-U1 | CẦN LÀM RÕ | Rỗng | `""` | DT-16 |

Các biến `email`, `role`, `id` và token được kiểm tra ở `05_business_security_tests.md` vì kỳ vọng của chúng là về trạng thái hệ thống, không phải về lớp giá trị.

## 3.2 Test case Domain Testing
Kỳ vọng nhận một trong: `2xx và dữ liệu lưu đúng`, `4xx và dữ liệu không đổi`, `CẦN LÀM RÕ`.

| ID | Lớp | Mô tả | Input (body gửi lên) | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-01 | V1: 10 chữ số, đầu 0 | SĐT hợp lệ 10 số | `{"phone": "0912345678"}` | 2xx và dữ liệu lưu đúng | R2 |
| DT-02 | V2: 11 chữ số, đầu 0 | SĐT hợp lệ 11 số | `{"phone": "09123456789"}` | 2xx và dữ liệu lưu đúng | R2 |
| DT-03 | I1: đầu khác 0 | SĐT 10 số, không bắt đầu bằng 0 | `{"phone": "9123456789"}` | 4xx và dữ liệu không đổi | R2 |
| DT-04 | I2: chứa chữ cái | SĐT có chữ cái | `{"phone": "09123abcde"}` | 4xx và dữ liệu không đổi | R2 |
| DT-05 | I3: có khoảng trắng | SĐT có khoảng trắng | `{"phone": "0912 345 678"}` | 4xx và dữ liệu không đổi | R2 |
| DT-06 | I4: dạng quốc tế | SĐT dạng `+84` | `{"phone": "+84912345678"}` | 4xx và dữ liệu không đổi | R2 |
| DT-07 | I5: ký tự đặc biệt | SĐT có dấu gạch | `{"phone": "0912-345-678"}` | 4xx và dữ liệu không đổi | R2 |
| DT-08 | I6: sai kiểu số | SĐT gửi dạng number | `{"phone": 912345678}` | 4xx và dữ liệu không đổi | R2 |
| DT-08b | I7: sai kiểu boolean | SĐT gửi dạng boolean (ca bổ sung) | `{"phone": true}` | 4xx và dữ liệu không đổi | R2 |
| DT-08c | I8: sai kiểu mảng | SĐT gửi dạng mảng (ca bổ sung) | `{"phone": ["0912345678"]}` | 4xx và dữ liệu không đổi | R2 |
| DT-08d | U2: `null` | SĐT là `null` | `{"phone": null}` | CẦN LÀM RÕ | R2 |
| DT-09 | U1: rỗng | SĐT là chuỗi rỗng | `{"phone": ""}` | CẦN LÀM RÕ | R2 |
| DT-10 | N-V1: tên thường | Họ Tên thường | `{"name": "Nguyen Van A"}` | 2xx và dữ liệu lưu đúng | R1 |
| DT-11 | N-V2: tên có dấu | Họ Tên có dấu tiếng Việt | `{"name": "Nguyễn Văn Ánh"}` | 2xx và dữ liệu lưu đúng | R1 |
| DT-12 | N-U1: tên rỗng | Họ Tên rỗng | `{"name": ""}` | CẦN LÀM RÕ | R1 |
| DT-13 | N-U2: toàn khoảng trắng | Họ Tên toàn khoảng trắng | `{"name": "   "}` | CẦN LÀM RÕ | R1 |
| DT-14 | N-U3: chứa HTML | Họ Tên chứa thẻ HTML | `{"name": "<b>x</b>"}` | CẦN LÀM RÕ | R1, R7 |
| DT-15 | A-V1: địa chỉ thường | Địa chỉ hợp lệ | `{"shipping_address": "123 Le Loi, Q1, TP.HCM"}` | 2xx và dữ liệu lưu đúng | R1 |
| DT-16 | A-U1: địa chỉ rỗng | Địa chỉ rỗng | `{"shipping_address": ""}` | CẦN LÀM RÕ | R1 |
| DT-17 | N-U4: tên rất dài | Họ Tên 1000 ký tự | `{"name": "<chuỗi gồm 1000 ký tự A>"}` | CẦN LÀM RÕ | R1 |

Tổng: 20 test (17 test gốc DT-01..DT-17 cộng 3 test bổ sung DT-08b, DT-08c, DT-08d để tách riêng lỗi kiểu dữ liệu).

## 3.3 Kết hợp nhiều biến
- Mỗi test **chỉ gửi đúng trường đang kiểm tra**, không gửi kèm các trường hợp lệ khác. Cách này tách biệt biến đang xét và giúp phát hiện tác dụng phụ lên các trường không gửi (kiểm tra riêng ở cột side-effect).
- Mỗi test dùng một user mới, hồ sơ gốc `Ten Goc` / `0900000000` / `Dia chi goc`.
- Các điều kiện của FR-04 độc lập với nhau, không có tổ hợp phức tạp nên không cần bảng quyết định.

## 3.4 Lớp đã cân nhắc nhưng chưa đưa vào bộ 34 test
- `name` / `shipping_address` sai kiểu (số, object): SRS không nêu ràng buộc kiểu cho hai trường này nên kỳ vọng sẽ là CẦN LÀM RÕ. Đã chạy thử ở `05` mục 5.3.
- Trường bị thiếu hẳn trong body: được bao phủ gián tiếp bởi mọi test chỉ gửi một trường.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| FR-04-03 | Chia lớp tương đương cho từng biến |
| FR-04-04 | Sinh test case Domain Testing |

## Tôi đã rà soát / sửa gì so với output AI
> BẢN NHÁP do Claude soạn bằng cách so output gốc của AI với tài liệu này. Hãy mở output gốc, xác nhận từng ý và viết lại bằng lời của bạn.

- Thêm lớp mà AI bỏ sót: `+84` (I4), tên có dấu tiếng Việt (N-V2), tên toàn khoảng trắng (N-U2), sai kiểu boolean và mảng (I7, I8).
- Tách "khoảng trắng" và "dấu gạch" thành hai lớp; AI gộp thành một lớp CẦN LÀM RÕ. SRS ghi "chữ số" nên kỳ vọng của hai lớp này là 4xx.
- Bỏ giả định `VARCHAR(255)` (tên 256 ký tự, địa chỉ 500 ký tự), thay bằng một test tên dài 1000 ký tự ở mức CẦN LÀM RÕ.
- Chuyển ca `email`, `role` và token từ nhóm DT sang `05` với kỳ vọng rõ ràng (AI để CẦN LÀM RÕ ở DT-18, DT-19). Bỏ ca token hết hạn vì không dựng được.
- Mỗi test chỉ gửi trường đang kiểm tra, khác với AI luôn gửi đủ cả 3 trường.
- TODO: xác nhận và viết lại phần rà soát bằng lời của bạn
