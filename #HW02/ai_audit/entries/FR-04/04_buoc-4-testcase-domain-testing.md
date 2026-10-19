# FR-04-04 – FR-04 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:32:51 (UTC+0700) |
| Feature / bước | FR-04 – Bước 4 - Testcase domain testing |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là BƯỚC 4 – Danh sách Test Case áp dụng Domain Testing (Chia lớp tương đương) dựa trên các lớp đã phân tích ở Bước 3.

**Quy tắc chung được áp dụng (Single Fault Assumption):**
Đối với các test case không hợp lệ hoặc cần làm rõ, chỉ có **duy nhất 1 biến vi phạm**, các biến còn lại đều sử dụng giá trị hợp lệ chuẩn sau:

* `name`: `"Nguyen Van A"`
* `shipping_address`: `"123 Le Loi, Q1"`
* `phone`: `"0912345678"`
* Header `Authorization`: `Bearer <Token_Hợp_Lệ>` (Trừ các test case thuộc nhóm H)

### Bảng Test Case Domain Testing


| ID | Lớp | Mô tả | Input (Header & Body JSON cụ thể) | Kỳ vọng theo SRS | Mã yêu cầu |
| --- | --- | --- | --- | --- | --- |
| **DT-01** | P_V1, N_V1, A_V1, E_V1, R_V1, H_V1 | Happy path: Cập nhật thành công với tất cả dữ liệu hợp lệ (phone 10 số). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | 2xx và dữ liệu được lưu đúng | R1, R2, R3, R4, R5, R6 |
| **DT-02** | P_V2 | phone hợp lệ với 11 số. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"01234567890"}` | 2xx và dữ liệu được lưu đúng | R2 |
| **DT-03** | P_I1 | phone sai ký tự đầu (khác `0`). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"1912345678"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-04** | P_I2 | phone vi phạm độ dài (9 số). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"091234567"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-05** | P_I3 | phone vi phạm độ dài (12 số). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"091234567890"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-06** | P_I4 | phone chứa ký tự chữ. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"091234567a"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-07** | P_I5 | phone sai kiểu dữ liệu (Number). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":912345678}` | 4xx và dữ liệu không đổi | R2 |
| **DT-08** | P_U1 | phone chứa khoảng trắng/dấu. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"091 234 5678"}` | CẦN LÀM RÕ | R2 |
| **DT-09** | P_U2 | phone truyền chuỗi rỗng. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":""}` | CẦN LÀM RÕ | R2 |
| **DT-10** | P_U3 | phone truyền `null`. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":null}` | CẦN LÀM RÕ | R2 |
| **DT-11** | N_I1 | name sai kiểu dữ liệu (Number). | `Header: Bearer <Valid_Token>`<br>`{"name":12345,"shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | 4xx và dữ liệu không đổi | R1 |
| **DT-12** | N_U1 | name vượt quá độ dài DB (giả sử >255). | `Header: Bearer <Valid_Token>`<br>`{"name":"A... (256 ký tự)","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | CẦN LÀM RÕ | R1 |
| **DT-13** | N_U2, N_U3 | name truyền rỗng/không truyền. | `Header: Bearer <Valid_Token>`<br>`{"name":"","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | CẦN LÀM RÕ | R1 |
| **DT-14** | N_U4 | name chứa thẻ script/XSS. | `Header: Bearer <Valid_Token>`<br>`{"name":"<script>alert(1)</script>","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | CẦN LÀM RÕ | R1, R7 |
| **DT-15** | A_I1 | shipping_address sai kiểu (Object). | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":{"street":"123"},"phone":"0912345678"}` | 4xx và dữ liệu không đổi | R1 |
| **DT-16** | A_U1 | shipping_address quá dài. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"A... (500 ký tự)","phone":"0912345678"}` | CẦN LÀM RÕ | R1 |
| **DT-17** | A_U2, A_U3 | shipping_address truyền rỗng/không truyền. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"","phone":"0912345678"}` | CẦN LÀM RÕ | R1 |
| **DT-18** | E_U1 | Cố tình truyền thêm trường `email`. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678","email":"hacked@gmail.com"}` | CẦN LÀM RÕ | R3 |
| **DT-19** | R_U1 | Cố tình truyền thêm trường `role`. | `Header: Bearer <Valid_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678","role":"admin"}` | CẦN LÀM RÕ | R5 |
| **DT-20** | H_I1 | Gọi API không có Header Token. | `Header: (Không có)`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | 4xx và dữ liệu không đổi | R6 |
| **DT-21** | H_I2 | Header Token bị sai/sửa đổi. | `Header: Bearer Invalid.Token.Here`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | 4xx và dữ liệu không đổi | R6 |
| **DT-22** | H_I3 | Header Token đã hết hạn. | `Header: Bearer <Expired_Token>`<br>`{"name":"Nguyen Van A","shipping_address":"123 Le Loi, Q1","phone":"0912345678"}` | 4xx và dữ liệu không đổi | R6 |


## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
