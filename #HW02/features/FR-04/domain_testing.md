# FR-04 – Quản lý hồ sơ cá nhân · Domain Testing

## Bước 1: Trích yêu cầu

### 1.1 Trích nguyên văn từ SRS
**FR-04: Quản lý hồ sơ cá nhân**
- Người dùng đã đăng nhập có thể cập nhật: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
- **Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ 10–11 chữ số.
- Email không được phép thay đổi qua giao diện.
- Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính `role`.

| Mã | Nội dung |
| :--- | :--- |
| SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ. |
| SEC-04 | Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp. |
| SEC-06 | API cập nhật hồ sơ không được cho phép thay đổi trường `role` từ client. |

### 1.2 Bảng yêu cầu
| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Người dùng đã đăng nhập cập nhật được Họ Tên, SĐT, Địa chỉ giao hàng mặc định | FR-04 | Nghiệp vụ |
| R2 | SĐT hợp lệ: bắt đầu bằng `0`, dài 10–11 chữ số | FR-04 | Input |
| R3 | Email không được thay đổi | FR-04 | Nghiệp vụ |
| R4 | Chỉ cập nhật hồ sơ của chính mình | FR-04 | Truy cập |
| R5 | Không tự thay đổi được `role` | FR-04, SEC-06 | Bảo mật |
| R6 | API phải có JWT hợp lệ | SEC-02 | Bảo mật / Truy cập |
| R7 | Dữ liệu người dùng nhập phải được escape khi hiển thị trên UI | SEC-04 | Bảo mật (chỉ kiểm tra được ở giao diện web) |

### 1.3 Endpoint liên quan
| Method | Endpoint | Cần token? | Body / tham số |
| :--- | :--- | :-: | :--- |
| GET | `/api/users/me` | Có | Không có |
| PUT | `/api/users/me` | Có | `name`, `shipping_address`, `phone` (JSON) |
| POST | `/api/register` | Không | `name`, `email`, `password` (dùng để dựng user cho test) |
| POST | `/api/login` | Không | `email`, `password` (lấy token) |

Hai endpoint cuối không thuộc FR-04, chỉ dùng để tạo user mới và token trước mỗi test.

### 1.4 Giả định và chỗ SRS im lặng
Chi tiết câu hỏi gửi GV/TA nằm ở Phụ lục A của `results.md`.

| # | Điều chưa rõ | Giả định tạm | Đã hỏi GV/TA? |
| :-: | :--- | :--- | :-: |
| 1 | SĐT rỗng hoặc `null` có hợp lệ không (Phụ lục A mục 1, 2) | SĐT là trường tùy chọn | Chưa |
| 2 | Họ Tên rỗng, toàn khoảng trắng có hợp lệ không (mục 3, 4) | Họ Tên không được rỗng | Chưa |
| 3 | Họ Tên chứa HTML: server có lọc không (mục 5) | Server lưu nguyên, UI phải escape (SEC-04) | Chưa |
| 4 | Địa chỉ rỗng có hợp lệ không (mục 6) | Địa chỉ là trường tùy chọn | Chưa |
| 5 | Độ dài tối đa của tên và địa chỉ (mục 7) | Không có giả định về giới hạn | Chưa |
| 6 | Gửi một trường thì các trường còn lại giữ hay mất (mục 8, **giả định A1**) | Phải giữ nguyên | Chưa |
| 7 | "Email không đổi qua giao diện" có áp dụng cho API không; gửi email thì bỏ qua hay từ chối (mục 9) | Bỏ qua trường email là chấp nhận được | Chưa |

Diễn giải: SRS viết "qua giao diện" cho email nhưng SEC-06 viết "từ client" cho `role`. Khi test qua API, mình coi cả hai yêu cầu áp dụng cho API.

## Bước 2: Xác định biến

### 2.1 Biến đầu vào
| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `phone` | body | chuỗi | Bắt đầu bằng `0`, 10–11 chữ số (R2) | Khoảng trắng, dấu gạch, `+84`; rỗng, `null`; kiểu khác chuỗi | **Có**: độ dài (10–11), chữ số đầu |
| `name` | body | chuỗi | Cập nhật được (R1) | Rỗng, toàn khoảng trắng, HTML, độ dài tối đa, dấu tiếng Việt | Không (SRS không nêu biên) |
| `shipping_address` | body | chuỗi | Cập nhật được (R1) | Rỗng, độ dài tối đa | Không (SRS không nêu biên) |
| `email` | body | chuỗi | Không được đổi (R3) | Gửi lên thì bỏ qua hay từ chối | Không |
| `role` | body | chuỗi | Không được tự đổi (R5, SEC-06) | Gửi lên thì bỏ qua hay từ chối | Không |
| `id` | body | số | Chỉ cập nhật hồ sơ của chính mình (R4) | Gửi `id` khác thì xử lý thế nào | Không |
| `Authorization` | header | JWT | Phải hợp lệ (R6, SEC-02) | Token hết hạn | Không |

### 2.2 Biến trạng thái / điều kiện ẩn
| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| Token và vai trò của người gọi | Quyết định có gọi được API không, và `role` ban đầu là `user` | `POST /api/register` rồi `POST /api/login`, mỗi test dùng một user mới |
| Hồ sơ hiện tại (`name`, `phone`, `shipping_address`) | Cần để kiểm tra trường được gửi lưu đúng và trường không gửi giữ nguyên | Sau khi đăng nhập, `PUT` hồ sơ gốc: `Ten Goc` / `0900000000` / `Dia chi goc` |
| Quyền sở hữu dữ liệu (R4) | Cập nhật phải ghi đúng vào hồ sơ của người gọi | Dùng token của user A, đối chiếu user B (xem ca đề xuất ở mục 6.3) |

Không truy cập CSDL trực tiếp (black-box): mọi trạng thái đều đọc lại qua `GET /api/users/me`.

### 2.3 Đầu ra cần quan sát
- Mã HTTP và nội dung `message` của `PUT`.
- Sau mỗi `PUT`, gọi `GET /api/users/me` và so với trạng thái trước:
  - trường đã gửi: có lưu đúng giá trị không;
  - trường **không gửi** (`name`, `phone`, `shipping_address`): có bị đổi không (kiểm tra side-effect);
  - `email`, `role`, `id`: có bị đổi không.
- Các trường có trong response của `GET`: có trường nhạy cảm nào không nên xuất hiện không (ví dụ mật khẩu). Đây là điểm bị bỏ sót ở lần đầu, xem `ai_gap_analysis.md` mục 9.6.

### 2.4 Nguyên tắc
Chỗ SRS im lặng ghi `CẦN LÀM RÕ`, đã chuyển sang Phụ lục A của `results.md`, không tự bịa kỳ vọng.

## Bước 3–4: Chia lớp tương đương và test case Domain Testing

### 3.1 Lớp tương đương theo từng biến

#### Biến `phone` (R2)
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
| I9 | ✘ | Quá ngắn (< 10 chữ số) | `012345678` | BV-01 (xem `bva.md`) |
| I10 | ✘ | Quá dài (> 11 chữ số) | `012345678901` | BV-04 (xem `bva.md`) |
| U1 | CẦN LÀM RÕ | Chuỗi rỗng | `""` | DT-09 |
| U2 | CẦN LÀM RÕ | `null` | `null` | DT-08d |

#### Biến `name` (R1)
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Test |
| :--- | :-: | :--- | :--- | :--- |
| N-V1 | ✔ | Tên thường, không dấu | `Nguyen Van A` | DT-10 |
| N-V2 | ✔ | Tên có dấu tiếng Việt | `Nguyễn Văn Ánh` | DT-11 |
| N-U1 | CẦN LÀM RÕ | Rỗng | `""` | DT-12 |
| N-U2 | CẦN LÀM RÕ | Toàn khoảng trắng | `"   "` | DT-13 |
| N-U3 | CẦN LÀM RÕ | Chứa HTML (UI phải escape theo SEC-04) | `<b>x</b>` | DT-14 |
| N-U4 | CẦN LÀM RÕ | Rất dài (SRS không nêu giới hạn) | 1000 ký tự `A` | DT-17 |

#### Biến `shipping_address` (R1)
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Test |
| :--- | :-: | :--- | :--- | :--- |
| A-V1 | ✔ | Địa chỉ thường | `123 Le Loi, Q1, TP.HCM` | DT-15 |
| A-U1 | CẦN LÀM RÕ | Rỗng | `""` | DT-16 |

Các biến `email`, `role`, `id` và token được kiểm tra ở mục Bước 6 bên dưới vì kỳ vọng của chúng là về trạng thái hệ thống, không phải về lớp giá trị.

### 3.2 Test case Domain Testing
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

### 3.3 Kết hợp nhiều biến
- Mỗi test **chỉ gửi đúng trường đang kiểm tra**, không gửi kèm các trường hợp lệ khác. Cách này tách biệt biến đang xét và giúp phát hiện tác dụng phụ lên các trường không gửi (kiểm tra riêng ở cột side-effect).
- Mỗi test dùng một user mới, hồ sơ gốc `Ten Goc` / `0900000000` / `Dia chi goc`.
- Các điều kiện của FR-04 độc lập với nhau, không có tổ hợp phức tạp nên không cần bảng quyết định.

### 3.4 Lớp đã cân nhắc nhưng chưa đưa vào bộ 34 test
- `name` / `shipping_address` sai kiểu (số, object): SRS không nêu ràng buộc kiểu cho hai trường này nên kỳ vọng sẽ là CẦN LÀM RÕ. Đã chạy thử ở mục 6.3.
- Trường bị thiếu hẳn trong body: được bao phủ gián tiếp bởi mọi test chỉ gửi một trường.

## Bước 6: Nghiệp vụ, bảo mật, truy cập

Danh sách câu hỏi:
- [x] Truy cập: không token, token sai (AC-01, AC-02); chưa dựng được token hết hạn
- [x] Quyền: sửa hồ sơ người khác (BL-05 kiểm tra `id` trong body; ca user A/B ở mục 6.3)
- [x] Trường bị cấm đổi: `email` (BL-03), `role` (BL-04), `id` (BL-05)
- [x] Tác dụng phụ: trường không gửi (BL-02 và cột side-effect ở mọi test), nội dung response (mục 6.3)
- [ ] Tính toán, thời gian, trạng thái: không áp dụng cho FR-04
- [x] Lặp lại: gửi lại dữ liệu y hệt, không có giá trị kiểm thử thêm (đã chạy thử, xem `ai_gap_analysis.md`)

### 6.1 Test case
| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- |
| BL-01 | Cập nhật cả 3 trường hợp lệ | `{"name": "Ten Moi", "phone": "0911111111", "shipping_address": "Dia chi moi"}` | 2xx, cả 3 trường lưu đúng | R1 |
| BL-02 | Chỉ gửi một trường thì các trường còn lại phải giữ nguyên | Đặt hồ sơ gốc, rồi gửi `{"phone": "0922222222"}` | `phone` đổi; `name` và `shipping_address` giữ nguyên (giả định A1, Phụ lục A mục 8) | R1 |
| BL-03 | Không đổi được email | `{"email": "hacker@evil.com"}` | Email giữ nguyên (bỏ qua hoặc từ chối đều chấp nhận, Phụ lục A mục 9) | R3 |
| BL-04 | Không tự đổi được `role` | `{"role": "admin"}` | `role` vẫn là `user` | R5, SEC-06 |
| BL-05 | Gửi kèm `id` không được ghi đè | `{"id": 1, "name": "X"}` | `id` tài khoản không đổi | R4 |
| AC-01 | Không có token | `{"name": "X"}`, bỏ header `Authorization` | 401 hoặc 403, dữ liệu không đổi | R6, SEC-02 |
| AC-02 | Token sai | `{"name": "X"}`, header `Bearer abc.def.ghi` | 401 hoặc 403, dữ liệu không đổi | R6, SEC-02 |

Tổng: 7 test. Cùng với 20 test ở Bước 3–4 và 7 test ở `bva.md`, bộ test FR-04 có **34 test**.

### 6.2 Kiểm tra tác dụng phụ (áp dụng cho mọi test)
Sau mỗi test, ngoài kiểm tra theo kỳ vọng, script còn kiểm tra các trường `name`, `phone`, `shipping_address` **không có trong body** có giữ nguyên không. Kết quả ghi ở cột side-effect ở Bước 7 (`results.md`), tách khỏi verdict, vì một test có thể PASS ở tiêu chí riêng nhưng vẫn làm mất dữ liệu.

### 6.3 Ca đề xuất bổ sung (chưa tính vào 34 test)
Các ca này đến từ bước AI gap analysis và đã chạy thử trên một bản clone `main` trong sandbox (bạn cần chạy lại trên máy bạn). Nếu quyết định đưa vào bộ cuối thì phải cập nhật số liệu ở `results.md` và `BUG_LIST.md`.

| ID đề xuất | Mô tả | Kỳ vọng (theo SRS) | Kết quả đã chạy thử | Nhận định |
| :--- | :--- | :--- | :--- | :--- |
| BL-06 | Response của `GET /api/users/me` không chứa mật khẩu và trường nhạy cảm | Không có `password`, `reset_token`; không lưu plaintext (SEC-01) | Response chứa `password` đúng bằng mật khẩu đã đăng ký | FAIL, bug mới (`bugs/FR-04-BUG-04.md`) |
| BL-07 | Tính nguyên tử: `name` hợp lệ + `phone` 9 số | 4xx, hồ sơ không đổi (R2) | HTTP 200, lưu cả hai | FAIL, cùng nguyên nhân BUG-01 |
| AC-03 | Cô lập user: user A cập nhật, hồ sơ user B không đổi | Hồ sơ B giữ nguyên (R4) | B không bị ảnh hưởng | PASS |
| (UI) | `name` chứa `<script>` hiển thị trên giao diện web | Được escape, không thực thi (R7, SEC-04) | `GET` trả nguyên văn (đúng, vì escape thuộc UI) | Cần kiểm thử trên giao diện web, chưa thực hiện |
| (type) | `name` là số, `shipping_address` là object | CẦN LÀM RÕ (SRS không nêu kiểu) | Lưu `12345` và `[object Object]` | Đưa vào câu hỏi làm rõ nếu cần |

### 6.4 Ca của AI bị loại
SE-01 (đơn hàng cũ không đổi địa chỉ): cần feature đặt hàng và SRS FR-04 không có yêu cầu này. SE-04 (`updated_at`): `GET /api/users/me` không có trường này. SE-05 (gửi lại dữ liệu y hệt): không thêm giá trị. DT-22 (token hết hạn): không dựng được token hết hạn khi không có khóa ký.
