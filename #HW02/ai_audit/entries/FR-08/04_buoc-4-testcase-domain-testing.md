# FR-08-04 – FR-08 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:41:32 (UTC+0700) |
| Feature / bước | FR-08 – Bước 4 - Testcase domain testing |
| Chat / phiên | FR8 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là bảng test case cho **BƯỚC 4 – DOMAIN TESTING**, được sinh từ các lớp tương đương ở Bước 3. Mỗi test case chỉ vi phạm duy nhất một điều kiện (các biến/trạng thái còn lại đều giữ ở giá trị hợp lệ chuẩn).

### Bảng Test Case Domain Testing

| ID | Lớp | Mô tả | Input (Header / Endpoint / Body JSON) | Kỳ vọng theo SRS | Mã YC |
| --- | --- | --- | --- | --- | --- |
| **DT-01** | C1.1 | Checkout thành công với Token hợp lệ và dữ liệu chuẩn | **Header:** `Authorization: Bearer <valid_token>`<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 2xx và dữ liệu được lưu đúng | R1, R6, R8 |
| **DT-02** | C1.2 | Checkout khi thiếu Header Authorization | **Header:** *(Không truyền)*<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |
| **DT-03** | C1.3 | Checkout với Header thiếu tiền tố `Bearer ` | **Header:** `Authorization: <valid_token>`<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |
| **DT-04** | C1.4 | Checkout với Token có chữ ký không hợp lệ | **Header:** `Authorization: Bearer invalid_signature`<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |
| **DT-05** | C1.5 | Checkout với Token đã hết hạn | **Header:** `Authorization: Bearer expired_token`<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R1, R6 |
| **DT-06** | C1.6 | Checkout với Token của tài khoản đã bị khóa/logout | **Header:** `Authorization: Bearer revoked_token`<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | CẦN LÀM RÕ | R1, R6 |
| **DT-07** | C2.1 | `total_amount` khớp với tổng tiền giỏ hàng (200,000) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 2xx và dữ liệu được lưu đúng | R2, R4 |
| **DT-08** | C2.2 | `total_amount` do client gửi sai lệch với giỏ hàng (`0`) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 0, "shipping_address": "123 Le Loi, TP.HCM"}` | 2xx và dữ liệu được lưu đúng | R2, R4 |
| **DT-09** | C2.3 | `total_amount` sai kiểu dữ liệu (String) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": "200000", "shipping_address": "123 Le Loi, TP.HCM"}` | 4xx và dữ liệu không đổi | R2, R4 |
| **DT-10** | C2.4 | `total_amount` truyền số âm (`-100000`) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": -100000, "shipping_address": "123 Le Loi, TP.HCM"}` | CẦN LÀM RÕ | R2, R4 |
| **DT-11** | C2.5 | `total_amount` bị thiếu hoặc truyền `null` | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": null, "shipping_address": "123 Le Loi, TP.HCM"}` | CẦN LÀM RÕ | R2, R4 |
| **DT-12** | C3.1 | `shipping_address` là chuỗi văn bản chuẩn | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 2xx và dữ liệu được lưu đúng | R8 |
| **DT-13** | C3.2 | `shipping_address` chứa thẻ script HTML/JS (chống XSS) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "<script>alert('XSS')</script>"}` | 2xx và dữ liệu được lưu đúng | R7, R8 |
| **DT-14** | C3.3 | `shipping_address` sai kiểu dữ liệu (Number) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": 12345}` | 4xx và dữ liệu không đổi | R8 |
| **DT-15** | C3.4 | `shipping_address` là chuỗi rỗng `""` | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": ""}` | CẦN LÀM RÕ | R8 |
| **DT-16** | C3.5 | `shipping_address` chỉ chứa khoảng trắng `"   "` | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "   "}` | CẦN LÀM RÕ | R8 |
| **DT-17** | C3.6 | `shipping_address` truyền `null` | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": null}` | CẦN LÀM RÕ | R8 |
| **DT-18** | C3.7 | `shipping_address` có độ dài vượt ngưỡng (1000 ký tự) | **Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "<1000_chars_string>"}` | CẦN LÀM RÕ | R8 |
| **DT-19** | C4.1 | Thêm sản phẩm vào giỏ với `quantity` hợp lệ | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2}` | 2xx và dữ liệu được lưu đúng | R2 |
| **DT-20** | C4.2 | Thêm sản phẩm vào giỏ với `quantity` sai kiểu (String) | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": "2"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-21** | C4.3 | Thêm sản phẩm vào giỏ với `quantity` bằng 0 | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 0}` | CẦN LÀM RÕ | R2 |
| **DT-22** | C4.4 | Thêm sản phẩm vào giỏ với `quantity` số âm (`-1`) | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": -1}` | CẦN LÀM RÕ | R2 |
| **DT-23** | C4.5 | Thêm sản phẩm vào giỏ với `quantity` cực lớn (`999999`) | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 999999}` | CẦN LÀM RÕ | R2 |
| **DT-24** | C5.1 | Thêm sản phẩm vào giỏ với `price` hợp lệ | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 100000, "quantity": 2}` | 2xx và dữ liệu được lưu đúng | R2 |
| **DT-25** | C5.2 | Thêm sản phẩm vào giỏ với `price` sai kiểu (String) | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": "100000", "quantity": 2}` | 4xx và dữ liệu không đổi | R2 |
| **DT-26** | C5.3 | Thêm sản phẩm vào giỏ với `price` bằng 0 | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": 0, "quantity": 2}` | CẦN LÀM RÕ | R2 |
| **DT-27** | C5.4 | Thêm sản phẩm vào giỏ với `price` số âm (`-50000`) | **Endpoint:** `POST /api/cart`<br>**Body:** `{"id": 1, "name": "Sản phẩm A", "price": -50000, "quantity": 2}` | CẦN LÀM RÕ | R2 |
| **DT-28** | C6.1 | Checkout khi giỏ hàng có ít nhất 1 sản phẩm | **Trạng thái:** Giỏ hàng có 1 SP A<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | 2xx và dữ liệu được lưu đúng | R2, R3, R4, R5 |
| **DT-29** | C6.2 | Checkout khi giỏ hàng rỗng | **Trạng thái:** Giỏ hàng rỗng (0 SP)<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 0, "shipping_address": "123 Le Loi, TP.HCM"}` | CẦN LÀM RÕ | R2, R5 |
| **DT-30** | C6.3 | Checkout khi giá sản phẩm bị thay đổi ở DB ngay trước checkout | **Trạng thái:** SP A đổi giá từ 100k lên 150k ở DB<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 200000, "shipping_address": "123 Le Loi, TP.HCM"}` | CẦN LÀM RÕ | R2, R4 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
