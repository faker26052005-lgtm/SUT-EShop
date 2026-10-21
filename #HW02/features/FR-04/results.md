# FR-04 – Quản lý hồ sơ cá nhân · Kết quả

## Bước 7: Thực thi và kết quả

### 7.1 Môi trường
- Hệ điều hành, Node, phiên bản Postman: Window, các phần mềm dùng phiên bản mới nhất
- SUT: main branch; reset dữ liệu bằng `node database.js` trước khi chạy
- Collection: `tests/postman/FR-04/FR04.postman_collection.json` (folder C: bấm Send liên tiếp)

### 7.2 Cách chạy
Mỗi lần bấm Send ở C1 chạy một test: tạo user mới, đặt hồ sơ gốc (`Ten Goc` / `0900000000` / `Dia chi goc`), gửi body của test, rồi đọc lại hồ sơ để chấm. C2 tổng hợp kết quả.

### 7.3 Bảng kết quả
Verdict: `PASS` (đúng SRS) / `FAIL` (sai SRS) / `CẦN LÀM RÕ` (SRS không nêu, chưa kết luận, KHÔNG tính là PASS).
Cột side-effect liệt kê trường **không gửi** nhưng bị đổi. Một test có thể PASS mà vẫn có side-effect.

| ID | HTTP | Verdict | Quan sát (dữ liệu đọc lại) | Side-effect | Bug |
| :--- | :-: | :-: | :--- | :--- | :-: |
| DT-01 | 200 | PASS | phone lưu `0912345678` | name, shipping_address |  |
| DT-02 | 200 | PASS | phone lưu `09123456789` | name, shipping_address |  |
| DT-03 | 200 | FAIL | phone lưu `9123456789` | name, shipping_address | BUG-01 |
| DT-04 | 200 | FAIL | phone lưu `09123abcde` | name, shipping_address | BUG-01 |
| DT-05 | 200 | FAIL | phone lưu `0912 345 678` | name, shipping_address | BUG-01 |
| DT-06 | 200 | FAIL | phone lưu `+84912345678` | name, shipping_address | BUG-01 |
| DT-07 | 200 | FAIL | phone lưu `0912-345-678` | name, shipping_address | BUG-01 |
| DT-08 | 200 | FAIL | gửi number, lưu chuỗi `912345678` | name, shipping_address | BUG-01 |
| DT-08b | 200 | FAIL | gửi `true`, lưu `1` | name, shipping_address | BUG-01 |
| DT-08c | 200 | FAIL | gửi mảng, lưu `[object Object]` | name, shipping_address | BUG-01 |
| DT-08d | 200 | CẦN LÀM RÕ | gửi `null`, lưu `null` | name, shipping_address |  |
| DT-09 | 200 | CẦN LÀM RÕ | phone lưu chuỗi rỗng | name, shipping_address |  |
| BV-01 | 200 | FAIL | 9 số, lưu `012345678` | name, shipping_address | BUG-01 |
| BV-02 | 200 | PASS | 10 số, lưu `0123456789` | name, shipping_address |  |
| BV-03 | 200 | PASS | 11 số, lưu `01234567890` | name, shipping_address |  |
| BV-04 | 200 | FAIL | 12 số, lưu `012345678901` | name, shipping_address | BUG-01 |
| BV-05 | 200 | FAIL | 1 số, lưu `0` | name, shipping_address | BUG-01 |
| BV-06 | 200 | PASS | đầu `0`, lưu `0987654321` | name, shipping_address |  |
| BV-07 | 200 | FAIL | đầu `1`, lưu `1987654321` | name, shipping_address | BUG-01 |
| DT-10 | 200 | PASS | name lưu `Nguyen Van A` | phone, shipping_address |  |
| DT-11 | 200 | PASS | name lưu `Nguyễn Văn Ánh` | phone, shipping_address |  |
| DT-12 | 200 | CẦN LÀM RÕ | name lưu chuỗi rỗng | phone, shipping_address |  |
| DT-13 | 200 | CẦN LÀM RÕ | name lưu 3 khoảng trắng | phone, shipping_address |  |
| DT-14 | 200 | CẦN LÀM RÕ | name lưu `<b>x</b>` | phone, shipping_address |  |
| DT-15 | 200 | PASS | địa chỉ lưu đúng | name, phone |  |
| DT-16 | 200 | CẦN LÀM RÕ | địa chỉ lưu chuỗi rỗng | name, phone |  |
| DT-17 | 200 | CẦN LÀM RÕ | name lưu đủ 1000 ký tự | phone, shipping_address |  |
| BL-01 | 200 | PASS | cả 3 trường lưu đúng | — |  |
| BL-02 | 200 | FAIL | chỉ phone đổi; name và địa chỉ thành `null` | name, shipping_address | BUG-02 |
| BL-03 | 200 | PASS | email giữ nguyên | name, phone, shipping_address |  |
| BL-04 | 200 | FAIL | role đổi `user` → `admin` | name, phone, shipping_address | BUG-03 |
| BL-05 | 200 | PASS | id tài khoản không đổi, name lưu `X` | phone, shipping_address |  |
| AC-01 | 401 | PASS | không token bị từ chối | — |  |
| AC-02 | 403 | PASS | token sai bị từ chối | — |  |

### 7.4 Tổng hợp
Bảng số liệu tổng hợp nằm ở Bước 10 bên dưới (một nơi duy nhất).

Có 31 trên 34 test kèm side-effect (BUG-02). Số liệu tính từ dữ liệu mẫu; đối chiếu lại với dòng TỔNG ở request C2 của bạn.

## Bước 8: Gom test đỏ theo nguyên nhân gốc

Có 14 test FAIL nhưng chỉ có 3 bug. Cách gom: hỏi "các test này sai vì cùng một chỗ trong hệ thống không?".

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm | GitHub Issue |
| :--- | :--- | :--- | :-: | :--- | :--- |
| FR-04-BUG-01 | Không có bước kiểm tra SĐT (và không kiểm tra kiểu dữ liệu) | DT-03, DT-04, DT-05, DT-06, DT-07, DT-08, DT-08b, DT-08c, BV-01, BV-04, BV-05, BV-07 (12 test) | High | FR-04: SĐT bắt đầu 0, 10–11 chữ số | https://github.com/faker26052005-lgtm/SUT-EShop/issues/43 |
| FR-04-BUG-02 | Cập nhật hồ sơ ghi đè mọi trường; trường không gửi thành `null` | BL-02 (và side-effect ở 31 test) | High | FR-04 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/44 |
| FR-04-BUG-03 | Server nhận mọi trường trong body, kể cả `role` (Mass Assignment) | BL-04 | Critical | FR-04, SEC-06 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/45 |

Kiểm tra: 12 + 1 + 1 = 14 test FAIL, khớp bảng kết quả. Mọi test đỏ đều thuộc một nguyên nhân gốc.

Mục "side-effect" không phải 31 bug riêng: đó là biểu hiện của BUG-02 ở các test khác.

## Bước 10: Tổng kết

| Chỉ số | Số lượng |
| :--- | :-: |
| Pool | A |
| Test case thiết kế | 34 (Domain 20, BVA 7, Business 5, Access 2) |
| Đã chạy | 34 |
| Passed | 13 |
| Failed | 14 |
| Cần làm rõ | 7 |
| Chưa chạy | 0 |
| Số bug | 3 |


## Phụ lục A: Câu hỏi cần làm rõ với GV/TA

Mỗi chỗ SRS im lặng là một dòng. Không mở bug cho các mục này. Mục 1–7 ứng với 7 test CẦN LÀM RÕ, mục 8–9 là các giả định đằng sau những verdict PASS/FAIL ở trên.

| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tôi | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `phone = ""` (DT-09) | SĐT có bắt buộc không, có xóa được SĐT không | HTTP 200, lưu chuỗi rỗng | SĐT là trường tùy chọn, xóa được; nếu thế thì không phải bug | Chưa hỏi |
| 2 | `phone = null` (DT-08d) | Giống mục 1, với giá trị null | HTTP 200, lưu `null` | Như mục 1 | Chưa hỏi |
| 3 | `name = ""` (DT-12) | Họ Tên có bắt buộc không | HTTP 200, lưu rỗng | Họ Tên không được rỗng (nếu đúng thì đây là bug) | Chưa hỏi |
| 4 | `name = "   "` (DT-13) | Chuỗi toàn khoảng trắng có tính là rỗng không | HTTP 200, lưu nguyên | Như mục 3 | Chưa hỏi |
| 5 | `name = "<b>x</b>"` (DT-14) | Server có phải lọc HTML không, hay chỉ cần UI escape khi hiển thị (SEC-04) | HTTP 200, lưu nguyên thẻ HTML | Server lưu nguyên, UI phải escape; TODO kiểm tra thêm trên giao diện web | Chưa hỏi |
| 6 | `shipping_address = ""` (DT-16) | Địa chỉ mặc định có bắt buộc không | HTTP 200, lưu rỗng | Địa chỉ là trường tùy chọn | Chưa hỏi |
| 7 | `name` dài 1000 ký tự (DT-17) | Có giới hạn độ dài tên/địa chỉ không | HTTP 200, lưu đủ 1000 ký tự | Chưa có giả định về giới hạn | Chưa hỏi |
| 8 | Cập nhật một phần (BL-02) | `PUT /api/users/me` chỉ gửi một trường thì các trường còn lại giữ nguyên hay bị xóa | Các trường không gửi bị đặt thành `null` | A1: phải giữ nguyên (BUG-02 phụ thuộc giả định này) | Chưa hỏi |
| 9 | Gửi `email` (BL-03) | "Email không được thay đổi qua giao diện": áp dụng cho cả API không; nếu gửi email thì nên bỏ qua (200) hay từ chối (4xx) | HTTP 200 nhưng email không đổi | Bỏ qua trường email là chấp nhận được, nên tính PASS | Chưa hỏi |
