# FR-20 – Mobile: Đăng ký và Hủy đơn · AI gap analysis

## Bước 9: AI gap analysis

### 9.1 So sánh bộ test của AI và bộ cuối
| Chỉ số | Số lượng |
| :--- | :-: |
| Test case AI sinh ra | 42 (Bước 4: 25, Bước 5: 6, Bước 6: 7, Bước 7: 4) |
| Trong đó trùng nhau | 6 (BV-PWD-01 trùng DT-REG-11; BV-NAM-01 trùng DT-REG-02; BV-PWD-02/03 và BV-NAM-02/03 cùng lớp hợp lệ với DT-REG-01, AI khuyến nghị giữ) |
| Giữ nguyên (có trong bộ cuối, cùng lớp, cùng kỳ vọng) | 29 |
| Sửa lại | 3 (xem bảng dưới) |
| Loại bỏ | 10 (xem bảng dưới) |
| Bộ cuối: AI đã có đủ | 34 / 63 |
| Bộ cuối: AI có một phần | 5 / 63 |
| Bộ cuối: AI bỏ sót (tôi bổ sung) | 24 / 63 |
| Ca AI có mà bộ cuối chưa có (đáng bổ sung) | 3, cộng 1 ca cần đổi cách làm (xem mục 9.5) |
| Phát hiện mới ngoài cả hai bộ | 0 (xem mục 9.6) |

Theo từng bước:

| Bước | AI sinh | Giữ nguyên | Sửa lại | Loại bỏ |
| :--- | :-: | :-: | :-: | :-: |
| 4 – Domain Testing | 25 | 22 | 2 | 1 |
| 5 – BVA | 6 | 3 | 1 | 2 |
| 6 – Nghiệp vụ, bảo mật, truy cập | 7 | 2 | 0 | 5 |
| 7 – Kiểm tra lại (tác dụng phụ) | 4 | 2 | 0 | 2 |
| **Tổng** | **42** | **29** | **3** | **10** |

- **Sửa lại (3):** DT-REG-04 (đổi 256 thành 1000 ký tự, thành DT-R06); DT-REG-09 (đổi email tồn tại từ `test@domain.com` thành tài khoản mẫu thật `test@eshop.com`, thành DT-R14); BV-NAM-02 (kỳ vọng "2xx" đổi thành CẦN LÀM RÕ, thành BV-R06).
- **Loại bỏ (10):** DT-REG-03 (`name` là số, kỳ vọng 4xx là suy diễn); BV-NAM-01 (trùng DT-R03); BV-NAM-03 (không thêm giá trị); BL-01, BL-02, AC-03 (dùng API Admin, thuộc nhóm hỗ trợ dựng dữ liệu, không thuộc FR-20); BL-04 (cần truy cập CSDL, trái black-box); AC-02 (không dựng được token hết hạn); SC-02, SC-04 (xem 9.5, trong đó SC-02 đáng bổ sung lại).

Lưu ý: "bộ cuối" của FR-20 là bộ 63 test do chính bạn rà soát (Domain 41, BVA 7, Business 12, Access 3). "AI bỏ sót" nghĩa là AI không có ca tương đương, chưa chắc là AI sai.

### 9.2 Đối chiếu từng test của bộ cuối
Mức khớp: **Đủ** (có ca tương đương), **Một phần** (có ca nhưng khác kỳ vọng hoặc không tách được điều kiện), **Thiếu**.

| Test bộ cuối | Ca tương ứng của AI | Mức khớp | Ghi chú |
| :--- | :--- | :-: | :--- |
| DT-R01 | AI DT-REG-01 | Đủ | AI ghi thêm "password được hash trong DB", không quan sát được khi black-box (9.4) |
| DT-R02 | — | Thiếu | AI chỉ dùng tên không dấu (lớp hợp lệ tên tiếng Việt) |
| DT-R03 | AI DT-REG-02, BV-NAM-01 | Đủ | |
| DT-R04 | — | Thiếu | Bước 1 có nêu "trim khoảng trắng" nhưng không thành lớp hay test |
| DT-R05 | — | Thiếu | Lớp "ký tự đặc biệt" của `name` có ở Bước 3 nhưng rơi ở Bước 4 |
| DT-R06 | AI DT-REG-04 | Đủ | AI dùng 256 ký tự, bộ cuối dùng 1000; cùng lớp "rất dài", cùng CẦN LÀM RÕ |
| DT-R07 | AI DT-REG-01 | Đủ | Cùng lớp email hợp lệ |
| DT-R08..R10 (3) | AI DT-REG-06, 07, 08 | Đủ | |
| DT-R11 | — | Thiếu | `user@domain` (không có đuôi miền); AI chỉ xét `user@` |
| DT-R12 | — | Thiếu | Lớp "email có khoảng trắng" có ở Bước 3 (CẦN LÀM RÕ) nhưng không có test ở Bước 4 |
| DT-R13 | AI DT-REG-05 | Đủ | |
| DT-R14 | AI DT-REG-09 | Đủ | AI dùng `test@domain.com`, tài khoản mẫu thật là `test@eshop.com` |
| DT-R15 | — | Thiếu | AI không xét phân biệt hoa/thường |
| DT-R16 (`!`) | AI BV-PWD-02, 03 | Đủ | `Aa1!bcde` dùng đúng `!` |
| DT-R17 (`@`) | AI DT-REG-01 | Một phần | `@` chỉ xuất hiện cùng `!` trong `Password123!@`, không tách được |
| DT-R18..R22 (5: `$ % * ? &`) | — | Thiếu | AI coi "ký tự đặc biệt hợp lệ" là một lớp duy nhất |
| DT-R23..R26 (4) | AI DT-REG-12..15 | Đủ | |
| DT-R27 | — | Thiếu | Ký tự ngoài tập SRS (`#`) |
| DT-R28 | AI DT-REG-10 | Đủ | |
| DT-R29 | — | Thiếu | Lớp "chứa khoảng trắng" ở Bước 3 dùng `Pass 123!@` (vẫn đủ ký tự đặc biệt) nên khác ca này, và Bước 4 cũng bỏ |
| DT-R30 | — | Thiếu | Bước 3 có lớp "quá dài" cho password, Bước 4 chỉ có test cho `name` |
| DT-R31 | AI DT-REG-16 | Đủ | |
| DT-R32 | — | Thiếu | Lớp "xác nhận bỏ trống" có ở Bước 3, rơi ở Bước 4 |
| DT-R33 | AI DT-REG-17 | Đủ | |
| DT-R34 | — | Thiếu | Chỉ có ở danh sách "đầu ra cần quan sát" Bước 2, không thành test |
| DT-C01..C06 (6) | AI DT-CAN-01..06 | Đủ | DT-CAN-03 chạm đúng BUG-05 |
| DT-C07 | — | Thiếu | Lớp `id = "abc"` có ở Bước 3, Bước 4 chỉ có `999999` |
| BV-R01 | AI BV-PWD-01, DT-REG-11 | Đủ | |
| BV-R02 | AI BV-PWD-02 | Đủ | |
| BV-R03 | AI BV-PWD-03 | Đủ | |
| BV-R04 | — | Thiếu | Độ dài 1 của password; Prompt 5 chỉ yêu cầu biên 3-value |
| BV-R05 | AI BV-PWD-02 | Đủ | `Aa1!bcde` đã có đúng 1 chữ hoa, 1 số, 1 ký tự đặc biệt |
| BV-R06 | AI BV-NAM-02 | Một phần | AI có ca nhưng chốt kỳ vọng 2xx; SRS không nêu độ dài tối thiểu của tên |
| BV-C01 | — | Thiếu | AI không đưa trạng thái đơn vào BVA và không xét biên thời gian |
| BL-R01 | AI DT-REG-01 | Đủ | Là một phần kỳ vọng ("chuyển sang Đăng nhập"), không phải test riêng |
| BL-R02 | AI SC-01 | Một phần | SC-01 có đăng nhập nhưng chỉ để kiểm role, không kiểm "đăng nhập bằng tài khoản vừa đăng ký" |
| BL-R03 | — | Thiếu | Bấm Đăng ký hai lần |
| BL-R04 | — | Thiếu | Che mật khẩu chỉ nằm ở danh sách quan sát Bước 2 |
| BL-R05 | DT-REG-02, 05..10 (một phần kỳ vọng) | Một phần | AI chốt "lỗi nằm trên nút Submit" ở nhiều ca, không đánh dấu CẦN LÀM RÕ về FR-22 trên mobile; không có test dấu `*` |
| BL-R06 | AI SC-01 | Đủ | AI kỳ vọng "200 hoặc 400", nhưng bước kiểm role bằng API Admin đúng ý |
| BL-C01 | AI BL-03 | Đủ | |
| BL-C02 | AI SC-03 | Đủ | |
| BL-C03 | — | Thiếu | Nút Hủy chỉ hiện ở `pending`/`confirmed` |
| BL-C04 | — | Thiếu | Bấm Hủy hai lần |
| BL-C05 | — | Thiếu | AI BL-01/BL-02 chỉ thử Admin trên `canceled` và `pending`, không thử `shipping` → `canceled` |
| BL-C06 | AI BL-03 | Một phần | AI chỉ kiểm nhãn và màu của "Đã hủy", không đủ 5 trạng thái |
| AC-C01 | AI DT-CAN-08 | Đủ | |
| AC-C02 | AI AC-01 | Đủ | AI chốt 401, SRS không nêu mã |
| AC-C03 | AI DT-CAN-07 | Đủ | |

Kiểm tra: Đủ 17 (đăng ký) + 6 (hủy đơn) + 4 (BVA) + 4 (nghiệp vụ) + 3 (truy cập) = 34; Một phần 1 + 0 + 1 + 3 + 0 = 5; Thiếu 16 + 1 + 2 + 5 + 0 = 24; tổng 63.

### 9.3 Ca và bug AI bỏ sót, và vì sao
| # | Ca / vấn đề bỏ sót | Vì sao AI bỏ sót | Nhóm nguyên nhân (đề xuất) | Bằng chứng |
| :-: | :--- | :--- | :-: | :--- |
| 1 | DT-R02: tên có dấu tiếng Việt (lớp hợp lệ) | Prompt không cho ngữ cảnh hệ thống Việt Nam nên AI chỉ chọn tên không dấu | Prompt | FR-20-03 |
| 2 | DT-R18..R22: từng ký tự đặc biệt `$ % * ? &` | AI gộp "ký tự đặc biệt hợp lệ" thành một lớp (đại diện `!@`). Nếu cài đặt thiếu một ký tự trong tập thì bộ của AI không lộ | Prompt (Prompt 3 không yêu cầu mỗi phần tử của tập liệt kê là một lớp) | FR-20-03, FR-20-04 |
| 3 | DT-R04, R11, R15, R27: tên toàn khoảng trắng, `user@domain`, email trùng khác hoa/thường, ký tự `#` | AI không có các lớp này. Riêng khoảng trắng AI có nêu ở Bước 1 nhưng không biến thành lớp | Giới hạn của AI | FR-20-01, FR-20-03 |
| 4 | DT-R05, R12, R29, R30, R32, DT-C07: lớp có ở Bước 3 nhưng không có test ở Bước 4 | AI không bám yêu cầu "mỗi lớp ít nhất một test". Tổng cộng 8 lớp của Bước 3 bị rơi: `name` ký tự đặc biệt, `email` sai kiểu, `email` có khoảng trắng, `password` quá dài, `password` có khoảng trắng, xác nhận bỏ trống, `id` = "abc", `id` âm | Giới hạn của AI (phụ: Prompt, vì không yêu cầu bảng đối chiếu lớp và test) | FR-20-03 so với FR-20-04 |
| 5 | DT-R34, BL-R04, BL-R05, BL-C03, BL-C06 (phần còn lại): kiểm tra ở UI | Prompt 4 yêu cầu "input (body JSON cụ thể)" nên test nghiêng hẳn về API. AI liệt kê quan sát UI ở Bước 2 nhưng không biến thành test. Với FR-22, AI chốt luôn "lỗi trên nút Submit" thay vì CẦN LÀM RÕ | Prompt | FR-20-02, FR-20-04, FR-20-06 |
| 6 | BV-R04: password độ dài 1 | Prompt chỉ yêu cầu biên 3-value, không yêu cầu giá trị cực trị | Prompt | FR-20-05 |
| 7 | BV-C01: trạng thái đơn đổi ngay lúc user thao tác | Bước 5 AI chỉ chọn độ dài `password` và `name` làm biến BVA, không coi trạng thái đơn là biến có thứ tự (`pending` < `confirmed` < `shipping` < `delivered`) và không nghĩ tới biên thời gian | Độ phức tạp của feature (phụ: Giới hạn của AI) | FR-20-02, FR-20-05 |
| 8 | BL-R03, BL-C04: bấm hai lần liên tiếp | Prompt 7 hỏi về tác dụng phụ của thao tác ghi; AI trả lời theo hướng trường ẩn, trường khác, bản ghi khác, không xét lặp lại thao tác. BL-R03 chính là ca lộ BUG-03 (2 tài khoản cùng email) | Độ phức tạp của feature (phụ: Prompt) | FR-20-07 |
| 9 | BL-C05: Admin hủy đơn `shipping` | AI không nhận ra mơ hồ của FR-10: sơ đồ không có mũi tên `shipping` → `canceled`, nhưng văn bản nói "chỉ Admin mới có thể thao tác". Thực tế hệ thống từ chối HTTP 400 (Phụ lục A mục 9) | Giới hạn của AI | FR-20-01, FR-20-06 |
| 10 | Chỗ SRS mơ hồ AI không nêu: ký tự đặc biệt ngoài tập (#3), email hoa/thường (#4), FR-22 có áp dụng cho mobile không (#5), `user@domain` (#8), Admin hủy `shipping` (#9) | Trong 9 mục của Phụ lục A, AI chỉ nêu được 4 (#1 tên, #2 độ dài tối đa password, #6 mã lỗi/thông báo, #7 hoàn tồn kho); bỏ sót 5 mục còn lại | Giới hạn của AI | FR-20-01, FR-20-07 |

### 9.4 AI sai hoặc bịa
- **Vi phạm chỉ dẫn "không dùng kiến thức về cài đặt" / black-box:** BL-04 yêu cầu "truy cập trực tiếp vào Database" để xem mật khẩu đã hash (FR-20-06); DT-REG-01 kỳ vọng "dữ liệu User được tạo trong DB, password được hash" và Bước 2 ghi "kiểm tra DB hoặc tài liệu kiến trúc" (FR-20-02, FR-20-04).
- **Tự chốt điều chính AI đã đánh dấu CẦN LÀM RÕ:** Bước 1 hỏi "Xác nhận mật khẩu xử lý ở Frontend hay Backend?", nhưng Bước 3 đặt tên biến là "Frontend" và DT-REG-16/17 kỳ vọng "API không được gọi" (FR-20-01, 03, 04). Tương tự, Bước 1 và 3 để độ dài `name` là CẦN LÀM RÕ, còn Bước 5 lại kết luận biên dưới "ngầm định là 1" và kỳ vọng 2xx cho BV-NAM-02/03 (FR-20-05).
- **Dữ liệu sai so với tài liệu:** Bước 2 và DT-REG-09 dùng `test@domain.com` làm tài khoản "đã tồn tại", trong khi tài khoản mẫu theo đặc tả là `test@eshop.com` (`test@domain.com` chỉ là email ví dụ trong body đăng ký). Nếu chạy đúng như AI viết, ca này có thể không đại diện cho "email đã tồn tại" (FR-20-02, 04).
- **Kỳ vọng suy diễn, SRS không nêu:** DT-REG-03 (`name` là số) kỳ vọng 4xx dù SRS không nêu kiểu; DT-REG-09 ghi "Conflict" và Bước 2 liệt kê 409; AC-01/AC-02 chốt 401 trong khi SRS chỉ nói "phải yêu cầu JWT hợp lệ" (FR-20-02, 04, 06).
- **Kỳ vọng nửa vời:** DT-CAN-07 "Forbidden/Not Found", AC-03 "403 (hoặc 401)", SC-01 "200 OK (hoặc 400 tùy logic)", trong khi Prompt 4 yêu cầu kỳ vọng chỉ thuộc một trong ba dạng (FR-20-04, 06, 07).
- **Bỏ rơi lớp giữa các bước:** 8 lớp ở Bước 3 không có test ở Bước 4 (liệt kê ở mục 9.3 hàng 4), dù Prompt 4 yêu cầu "mỗi lớp ít nhất một test" (FR-20-03, 04).
- **Ca không thực hiện được:** AC-02 (token hết hạn) kêu "đợi token hết hạn" nhưng không biết thời hạn token hay khóa ký (FR-20-06).
- **Ca ngoài phạm vi:** SC-04 (giỏ hàng có được làm trống sau checkout) thuộc checkout, là API hỗ trợ dựng dữ liệu, không thuộc FR-20; BL-01, BL-02, AC-03 cũng dùng API Admin thuộc nhóm hỗ trợ (FR-20-06, 07).
- **Điểm AI làm đúng, để đối chiếu:** Bước 7 chủ động không bịa test về tồn kho vì SRS không nêu, và đề xuất được test chống mass assignment (SC-01) và cô lập bản ghi (SC-03).

### 9.5 Ca của AI mà bộ cuối chưa có


| Ca của AI | Kết quả thực tế | Đánh giá / đề xuất |
| :--- | :--- | :--- |
| BL-01: Admin đổi đơn `canceled` sang `shipping`/`pending` | Không chạy | **Đáng bổ sung.** Kỳ vọng rõ theo FR-10 (4xx, trạng thái giữ nguyên). Bộ cuối chỉ thử đơn kết thúc bằng user (DT-C04, C05), chưa thử Admin. Lưu ý API Admin thuộc nhóm hỗ trợ nên cần cân nhắc phạm vi |
| SC-02: hủy đơn không làm đổi các trường khác (tổng tiền, ngày đặt, địa chỉ) | Không chạy | **Đáng bổ sung.** Là kiểm tra tác dụng phụ trên chính bản ghi đơn, liên quan đến các trường hiển thị ở FR-11 |
| AC-03: user thường gọi API Admin đổi trạng thái | Không chạy | **Cân nhắc.** Kiểm SEC-03 (role `admin`), bộ cuối chưa có; ngoài phạm vi trực tiếp của hai chức năng |
| BL-04: mật khẩu không lưu plaintext (SEC-01) | Không thực hiện được (cần CSDL) | **Cần đổi cách làm.** Bộ cuối chưa có test nào cho SEC-01. Bản black-box: xem response của `POST /api/login` ("thông tin user") có trả trường mật khẩu không, và đối chiếu với mật khẩu đã dùng khi đăng ký |
| DT-REG-03: `name = 12345` | Không chạy | SRS không nêu kiểu cho `name`; nếu chạy, ghi CẦN LÀM RÕ thay vì 4xx như AI kỳ vọng |
| BL-02: Admin hủy đơn `pending` | Không chạy | Giá trị thấp; thao tác này đã dùng khi dựng dữ liệu |
| BV-NAM-01 / BV-NAM-03 | Không chạy | BV-NAM-01 trùng DT-R03; BV-NAM-03 (tên 2 ký tự) không thêm giá trị |
| AC-02: token hết hạn | Không thực hiện được | Không dựng được vì không biết thời hạn token và khóa ký |
| SC-04: giỏ hàng sau checkout | Không thực hiện | Ngoài phạm vi FR-20, SRS im lặng |

### 9.6 Bug thực tế và bộ test của AI

| Bug | Ca của AI cùng nguyên nhân | Ca AI bỏ sót |
| :--- | :--- | :--- |
| FR-20-BUG-01 (không kiểm tra trường bắt buộc) | DT-REG-02, 05, 10 | không có |
| FR-20-BUG-02 (không kiểm tra định dạng email) | DT-REG-06, 07, 08 | DT-R12 (email có khoảng trắng) |
| FR-20-BUG-03 (cho đăng ký trùng email) | DT-REG-09 | BL-R03 (bấm đăng ký hai lần) |
| FR-20-BUG-04 (không áp dụng luật mật khẩu mạnh) | DT-REG-11..15, BV-PWD-01 | BV-R04, DT-R27, DT-R29 |
| FR-20-BUG-05 (user hủy được đơn `shipping`) | DT-CAN-03 | BV-C01 |

### 9.7 Kết luận
- AI làm tốt: các lớp cơ bản của đăng ký (thiếu từng loại ký tự, biên 7/8/9, định dạng email, bỏ trống), 5 trạng thái đơn và các ca truy cập (không token, token sai, đơn của người khác); Bước 7 đề xuất được test mass assignment và cô lập bản ghi.
- AI yếu: bỏ rơi lớp giữa Bước 3 và Bước 4; không có ngữ cảnh địa phương (tên có dấu); gộp một tập liệt kê thành một lớp; không nhận ra mâu thuẫn trong FR-10 (`shipping` → `canceled`) và 5/9 chỗ mơ hồ; tự chốt kỳ vọng suy diễn hoặc kỳ vọng nửa vời; vi phạm black-box (truy cập CSDL); gần như bỏ qua tầng UI, thao tác lặp và biên thời gian.
- Điều chỉnh prompt lần sau: cho ngữ cảnh hệ thống (tiếng Việt, tài khoản mẫu); ở Bước 3 đưa checklist lớp cho chuỗi (rỗng, toàn khoảng trắng, dấu, HTML, rất dài, ký tự ngoài tập) và yêu cầu mỗi phần tử của tập liệt kê là một lớp; ở Bước 4 yêu cầu bảng đối chiếu "lớp → ID test" và giải thích lớp nào chưa có test; ở Bước 1 yêu cầu đối chiếu sơ đồ với văn bản để chỉ ra mâu thuẫn; ở Bước 5 yêu cầu thêm giá trị cực trị và xét biến trạng thái có thứ tự, kể cả biên thời gian; ở Bước 6 và 7 yêu cầu nêu rõ tầng (UI hay API), thao tác lặp, và cách kiểm SEC-01 mà không truy cập CSDL.
