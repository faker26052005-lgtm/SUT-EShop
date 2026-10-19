# FR-04 – Quản lý hồ sơ cá nhân · Bước 5: Boundary Value Analysis

> BVA hỏi: sát ranh giới giữa hai lớp thì hệ thống có xử lý đúng không?

## 4.1 Biến được chọn cho BVA và lý do
| Biến | Miền hợp lệ | Biên dưới | Biên trên | Lý do chọn |
| :--- | :--- | :-: | :-: | :--- |
| Độ dài `phone` | 10–11 chữ số | 10 | 11 | SRS nêu rõ hai biên |
| Chữ số đầu của `phone` | `0` | `0` | `0` | SRS yêu cầu bắt đầu bằng `0`; thử `0` và chữ số liền kề `1` |

**Không áp dụng BVA** cho:
- `name`, `shipping_address`: SRS không nêu biên độ dài. Khi GV/TA xác nhận giới hạn (`clarifications.md` mục 7) thì bổ sung bộ `max−1, max, max+1`.
- `email`, `role`, `id`, token: không có thứ tự hoặc miền số.

## 4.2 Bảng giá trị biên
Biến thể BVA: 3-value (`min−1, min, min+1, max−1, max, max+1`). TODO: đối chiếu slide bài giảng xem khóa học dạy biến thể nào và sửa lại nếu khác.

| Biến | min−1 | min | min+1 | max−1 | max | max+1 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: |
| Độ dài `phone` | 9 | 10 | 11 | 10 | 11 | 12 |

Miền chỉ có hai giá trị (10, 11) nên các giá trị trùng nhau và rút gọn thành `{9, 10, 11, 12}`. Thêm giá trị cực trị độ dài 1 (độ dài 0 đã có ở DT-09).

## 4.3 Test case BVA
| ID | Biến | Giá trị (và ý nghĩa) | Loại biên | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BV-01 | `phone` | `{"phone": "012345678"}` (9 chữ số) | min−1 (độ dài) | 4xx và dữ liệu không đổi | R2 |
| BV-02 | `phone` | `{"phone": "0123456789"}` (10 chữ số) | min (độ dài) | 2xx và dữ liệu lưu đúng | R2 |
| BV-03 | `phone` | `{"phone": "01234567890"}` (11 chữ số) | max (độ dài) | 2xx và dữ liệu lưu đúng | R2 |
| BV-04 | `phone` | `{"phone": "012345678901"}` (12 chữ số) | max+1 (độ dài) | 4xx và dữ liệu không đổi | R2 |
| BV-05 | `phone` | `{"phone": "0"}` (1 chữ số) | Cực trị độ dài | 4xx và dữ liệu không đổi | R2 |
| BV-06 | `phone` | `{"phone": "0987654321"}` (đầu `0`) | Biên hợp lệ của chữ số đầu | 2xx và dữ liệu lưu đúng | R2 |
| BV-07 | `phone` | `{"phone": "1987654321"}` (đầu `1`) | Sát biên không hợp lệ của chữ số đầu | 4xx và dữ liệu không đổi | R2 |

## 4.4 Phân biệt với Domain Testing
Domain Testing hỏi "giá trị này thuộc lớp nào?", BVA hỏi "sát ranh giới thì xử lý đúng không?". Bảng test của hai kỹ thuật được tách riêng theo yêu cầu của đề.

| Test BVA | Trùng lớp với | Quyết định |
| :--- | :--- | :--- |
| BV-02 (10 số) | DT-01 (lớp V1) | Giữ cả hai: giá trị khác nhau, BV-02 nhắm đúng biên dưới |
| BV-03 (11 số) | DT-02 (lớp V2) | Giữ cả hai: BV-03 nhắm đúng biên trên |
| BV-06 (đầu `0`) | DT-01, DT-02 | Giữ: kiểm tra riêng chữ số đầu |
| BV-07 (đầu `1`) | DT-03 (lớp I1) | Giữ: chữ số liền kề biên |
| BV-01, BV-04, BV-05 | Lớp I9, I10 (chỉ kiểm bằng BV) | Không trùng DT |

Chi phí chạy thêm rất thấp (mỗi test chỉ là một dòng dữ liệu) nên giữ để hai báo cáo độc lập đầy đủ.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| FR-04-05 | Phân tích BVA cho các biến có thứ tự |

## Tôi đã rà soát / sửa gì so với output AI
> BẢN NHÁP do Claude soạn bằng cách so output gốc của AI với tài liệu này. Hãy mở output gốc, xác nhận từng ý và viết lại bằng lời của bạn.

- AI áp dụng BVA cho `name` và `shipping_address` với giả định biên 1–255 (BV-05..08). Tài liệu này bỏ vì SRS không nêu biên.
- Thêm biên cho chữ số đầu của SĐT (BV-06, BV-07) và giá trị cực trị độ dài 1 (BV-05); AI chỉ xét độ dài.
- AI khuyên gộp các test BVA trùng DT; tài liệu này giữ cả hai vì đề yêu cầu hai báo cáo riêng và chi phí chạy thấp.
- AI tự chọn biến thể 3-value dựa vào ví dụ trong prompt (prompt còn `TODO`); cần đối chiếu bài giảng (xem `TODO` ở mục 4.2).
- TODO: xác nhận và viết lại phần rà soát bằng lời của bạn
