# FR-04-03 – FR-04 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:31:14 (UTC+0700) |
| Feature / bước | FR-04 – Bước 3 - chia lớp tương đương |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả BƯỚC 3 – Chia lớp tương đương (Equivalence Partitioning) cho từng biến đã xác định ở Bước 2.

Theo quy tắc của Domain Testing, đối với các lớp không hợp lệ, mỗi lớp chỉ vi phạm **đúng một điều kiện** để tránh lỗi che khuất (fault masking). Với lớp vi phạm kiểu dữ liệu, ta ghi chú rõ vì sai kiểu dữ liệu (ví dụ Integer thay vì String) thì các thuộc tính của chuỗi (như độ dài, ký tự đầu) không còn ý nghĩa để xét.

### 1. Biến `phone` (Nguồn: R1, R2)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **P_V1** | Có | Bắt đầu bằng `0`, 10 chữ số, toàn số. | `"0912345678"` | R2 |
| **P_V2** | Có | Bắt đầu bằng `0`, 11 chữ số, toàn số. | `"01234567890"` | R2 |
| **P_I1** | Không | Sai ký tự đầu: Ký tự đầu khác `0` (vẫn đúng 10 ký tự, toàn số). | `"1912345678"` | R2 |
| **P_I2** | Không | Vi phạm độ dài (ngắn): Chỉ có 9 chữ số (vẫn bắt đầu bằng `0`, toàn số). | `"091234567"` | R2 |
| **P_I3** | Không | Vi phạm độ dài (dài): Có 12 chữ số (vẫn bắt đầu bằng `0`, toàn số). | `"091234567890"` | R2 |
| **P_I4** | Không | Sai định dạng số: Chứa chữ cái/ký tự đặc biệt (vẫn bắt đầu bằng `0`, đúng 10 ký tự). | `"091234567a"` | R2 |
| **P_I5** | Không | Sai kiểu dữ liệu: Truyền kiểu Number thay vì String (*Không thể kết hợp xét độ dài/ký tự đầu vì là kiểu số nguyên*). | `912345678` | R2 |
| **P_U1** | CẦN LÀM RÕ | Chứa khoảng trắng/dấu gạch ngang (có độ dài lớn hơn 11 nếu tính cả khoảng trắng). | `"091 234 5678"` | R2 |
| **P_U2** | CẦN LÀM RÕ | Truyền chuỗi rỗng (empty). | `""` | R2 |
| **P_U3** | CẦN LÀM RÕ | Giá trị `null` (hoặc không truyền trường này). | `null` | R2 |

---

### 2. Biến `name` (Nguồn: R1, R7)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **N_V1** | Có | Chuỗi ký tự hợp lệ, độ dài trung bình. | `"Nguyen Van A"` | R1 |
| **N_I1** | Không | Sai kiểu dữ liệu: Truyền kiểu Number thay vì String. | `12345` | R1 |
| **N_U1** | CẦN LÀM RÕ | Vượt quá độ dài tối đa (max length của DB - do SRS không nêu). | `"A" * 256` | R1 |
| **N_U2** | CẦN LÀM RÕ | Chuỗi rỗng `""` (không rõ có bắt buộc nhập hay không). | `""` | R1 |
| **N_U3** | CẦN LÀM RÕ | Giá trị `null` / không truyền trường `name`. | `null` | R1 |
| **N_U4** | CẦN LÀM RÕ | Chứa ký tự thẻ HTML/Script. (*Về bản chất dữ liệu vào API là hợp lệ, việc escape chống XSS thực hiện ở UI theo R7, nhưng cần làm rõ API có reject trước không*). | `"<script>alert(1)</script>"` | R1, R7 |

---

### 3. Biến `shipping_address` (Nguồn: R1, R7)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **A_V1** | Có | Chuỗi địa chỉ hợp lệ thông thường. | `"123 Le Loi, Q1"` | R1 |
| **A_I1** | Không | Sai kiểu dữ liệu: Truyền object hoặc mảng thay vì String. | `{"street": "123"}` | R1 |
| **A_U1** | CẦN LÀM RÕ | Vượt quá độ dài tối đa. | `"A" * 500` | R1 |
| **A_U2** | CẦN LÀM RÕ | Chuỗi rỗng `""`. | `""` | R1 |
| **A_U3** | CẦN LÀM RÕ | Giá trị `null` / không truyền trường này. | `null` | R1 |

---

### 4. Biến `email` (Nguồn: R3)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **E_V1** | Có | Không truyền trường `email` trong JSON Body. | *(Không có trong body)* | R3 |
| **E_U1** | CẦN LÀM RÕ | Cố tình truyền `email` với giá trị mới. (*Cần làm rõ: API sẽ trả về lỗi HTTP 400 Bad Request, hay API tự động loại bỏ (ignore) trường này và trả về 200 OK?*) | `"hacked@gmail.com"` | R3 |

---

### 5. Biến `role` (Nguồn: R5)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **R_V1** | Có | Không truyền trường `role` trong JSON Body. | *(Không có trong body)* | R5 |
| **R_U1** | CẦN LÀM RÕ | Cố tình truyền trường `role` để leo thang đặc quyền. (*Giống biến email, cần làm rõ hành vi của hệ thống là báo lỗi hay ignore*). | `"admin"` | R5 |

---

### 6. Biến `Authorization` (Header) (Nguồn: R4, R6)

| Lớp | Hợp lệ? | Cách vi phạm / Mô tả | Giá trị đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **H_V1** | Có | JWT Token hợp lệ của user chính chủ đang thao tác (VD: User A). | `"Bearer <Token_User_A>"` | R4, R6 |
| **H_I1** | Không | Không có Header `Authorization` trong Request. | *(Bỏ trống header)* | R6 |
| **H_I2** | Không | Token sai định dạng (không có `Bearer `) / Chữ ký (Signature) bị sửa đổi hoặc invalid. | `"Bearer eyJhb...sai"` | R6 |
| **H_I3** | Không | Token hợp lệ về cấu trúc nhưng đã hết hạn (Expired). | `"Bearer <Expired_Token>"` | R6 |

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
