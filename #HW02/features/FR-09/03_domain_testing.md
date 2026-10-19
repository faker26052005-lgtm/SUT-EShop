# FR-09 – Mã giảm giá · Bước 3–4: Domain Testing

> Ý tưởng: chia mọi giá trị của một biến thành các lớp mà hệ thống phải xử lý như nhau, rồi chọn MỘT đại diện cho mỗi lớp.
> Quy tắc: mỗi test chỉ vi phạm ĐÚNG MỘT điều kiện. Tự kiểm: đại diện của tôi có đang vi phạm hai điều kiện cùng lúc không?
> Đối chiếu với slide bài giảng và ghi rõ nếu giảng viên dùng thuật ngữ hoặc thứ tự bước khác.

## 3.1 Lớp tương đương theo từng biến
### Biến: TODO
| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Req |
| :--- | :-: | :--- | :--- | :--- |
| V1 | ✔ | TODO | | |
| I1 | ✘ | TODO | | |

Gợi ý rà soát lớp: sai kiểu, null / thiếu trường, rỗng, toàn khoảng trắng, quá dài, ký tự đặc biệt, giá trị âm / 0, giá trị không tồn tại.

## 3.2 Test case Domain Testing
| ID | Lớp | Mô tả | Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-01 | | | | | |

Kỳ vọng nhận một trong: `2xx + dữ liệu lưu đúng`, `4xx + dữ liệu không đổi`, `CẦN LÀM RÕ`.

## 3.3 Kết hợp nhiều biến
Ghi cách xử lý: mỗi lần chỉ sai một biến, các biến còn lại dùng giá trị hợp lệ chuẩn.
Nếu feature có nhiều điều kiện kết hợp, thêm bảng quyết định:

| Tổ hợp | Điều kiện 1 | Điều kiện 2 | ... | Kết quả mong đợi |
| :--- | :-: | :-: | :-: | :--- |
| TODO | | | | |

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
