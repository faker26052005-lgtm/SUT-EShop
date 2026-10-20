# FR-09 – Mã giảm giá (Coupon) · Kết quả

> File này gộp Bước 7 (thực thi), Bước 8 (nguyên nhân gốc), Bước 10 (tổng kết) và Phụ lục A (câu hỏi làm rõ).
> **Trạng thái:** mới có kết quả của 37/51 test (đến BV-10). 14 test còn lại (BV-11..17, BL-01..07) ghi `CHƯA CHẠY`, cần chạy rồi cập nhật bảng 7.3, mục 7.4, Bước 8 và Bước 10.

## Bước 7: Thực thi và kết quả

### 7.1 Môi trường
- Hệ điều hành, Node, phiên bản Postman: TODO
- SUT: commit TODO; reset dữ liệu bằng `node database.js` trước khi chạy: TODO
- Collection: `tests/postman/FR-09/FR09.postman_collection.json` (folder C: bấm Send liên tiếp)
- Giờ chạy (nhóm BV-13..15 cần chạy trong 07:00–23:59 giờ VN): TODO

### 7.2 Cách chạy
Mỗi lần bấm Send ở C1 chạy một test: tạo user mới (và user B nếu cần), dựng trạng thái (mã tùy chỉnh bằng admin, lượt dùng trước đó), gọi `POST /api/apply-coupon`, chấm kết quả, rồi so `GET /api/orders/my-orders` và `GET /api/cart` trước/sau để tìm tác dụng phụ. C2 tổng hợp kết quả.

### 7.3 Bảng kết quả
Verdict: `PASS` (đúng SRS) / `FAIL` (sai SRS) / `CẦN LÀM RÕ` (SRS không nêu, chưa kết luận, KHÔNG tính là PASS) / `CHƯA CHẠY`.
Cột side-effect cho biết đơn hàng hoặc giỏ hàng có bị đổi sau khi áp mã.

| ID | HTTP | Verdict | Quan sát | Side-effect | Bug |
| :--- | :-: | :-: | :--- | :--- | :-: |
| DT-01 | 200 | FAIL | discount=-4.500.000, final=5.000.000 (kỳ vọng 50.000 / 450.000) | không | BUG-01 |
| DT-02 | 200 | PASS | discount=50.000, final=550.000 | không |  |
| DT-03 | 200 | PASS | discount=100.000, final=300.000 | không |  |
| DT-04 | 404 | PASS | bị từ chối, không có discount | không |  |
| DT-05 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-06 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-07 | 404 | PASS | bị từ chối, không có discount | không |  |
| DT-08 | 404 | CẦN LÀM RÕ | từ chối: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa" (không cắt khoảng trắng) | không |  |
| DT-09 | 404 | CẦN LÀM RÕ | từ chối như DT-08 (phân biệt hoa/thường) | không |  |
| DT-10 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-11 | 404 | CẦN LÀM RÕ | từ chối như DT-08 | không |  |
| DT-12 | 404 | PASS | coi như mã không tồn tại, không lỗi SQL | không |  |
| DT-13 | 404 | PASS | coi như mã không tồn tại | không |  |
| DT-14 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-15 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-16 | 400 | PASS | bị từ chối, không có discount | không |  |
| DT-17 | 200 | CẦN LÀM RÕ | chấp nhận chuỗi "500000": discount=-4.500.000, final=5.000.000 (sai công thức như BUG-01) | không |  |
| DT-18 | 200 | CẦN LÀM RÕ | chấp nhận 500000.5: discount=-4.500.005, final=5.000.005,5 | không |  |
| DT-19 | 400 | CẦN LÀM RÕ | từ chối: "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫" (null bị coi như số nhỏ) | không |  |
| DT-20 | 200 | FAIL | discount=-90.000.000.000, final=100.000.000.000 (kỳ vọng 1.000.000.000 / 9.000.000.000) | không | BUG-01 |
| DT-21 | 200 | CẦN LÀM RÕ | chấp nhận `user_id` của B với token của A (kết quả có giá trị sai như BUG-01) | không |  |
| DT-22 | 200 | CẦN LÀM RÕ | chấp nhận `user_id` = 999999 | không |  |
| DT-23 | 200 | CẦN LÀM RÕ | chấp nhận `user_id` = -1 | không |  |
| DT-24 | 200 | CẦN LÀM RÕ | chấp nhận `user_id` dạng chuỗi | không |  |
| DT-25 | 200 | CẦN LÀM RÕ | chấp nhận khi thiếu `user_id` | không |  |
| AC-01 | 200 | FAIL | không token vẫn 200, discount=-4.500.000, final=5.000.000 | không | BUG-03 |
| AC-02 | 200 | FAIL | token sai vẫn 200, discount=-4.500.000, final=5.000.000 | không | BUG-03 |
| BV-01 | 400 | PASS | 299.999 bị từ chối | không |  |
| BV-02 | 400 | FAIL | 300.000 (đúng ngưỡng) bị từ chối, kỳ vọng 200 | không | BUG-02 |
| BV-03 | 200 | FAIL | discount=-2.700.009, final=3.000.010 (kỳ vọng 30.000,1 / 270.000,9) | không | BUG-01 |
| BV-04 | 400 | PASS | 499.999 bị từ chối | không |  |
| BV-05 | 400 | FAIL | 500.000 (đúng ngưỡng) bị từ chối, kỳ vọng 200 | không | BUG-02 |
| BV-06 | 200 | PASS | discount=50.000, final=450.001 | không |  |
| BV-07 | 400 | PASS | 299.999 bị từ chối | không |  |
| BV-08 | 400 | FAIL | 300.000 (đúng ngưỡng) bị từ chối, kỳ vọng 200 | không | BUG-02 |
| BV-09 | 200 | PASS | discount=100.000, final=200.001 | không |  |
| BV-10 | 200 | FAIL | lần 2 vẫn 200 (kỳ vọng từ chối); phụ thuộc giả định A | không | BUG-04 (Draft) |
| BV-11 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-12 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-13 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-14 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-15 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-16 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BV-17 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-01 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-02 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-03 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-04 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-05 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-06 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |
| BL-07 | TODO | CHƯA CHẠY | TODO (chạy tiếp từ `idx = 37`) | TODO |  |

### 7.4 Tổng hợp
Số liệu tổng hợp nằm ở Bước 10 bên dưới (một nơi duy nhất).

Không có test nào trong 37 test đã chạy làm đổi đơn hàng hay giỏ hàng (dòng TỔNG của C2: "có side-effect 0"). Chưa có số liệu cho 14 test còn lại.

### 7.5 Ảnh cần chụp
- TODO: ảnh tổng hợp Test Results của C2 (đặt ở `evidence/FR-09/C2_tong-hop.png`)
- TODO: ảnh bug (xem mục "Bằng chứng" trong từng file `bugs/FR-09-BUG-0x.md`)

## Bước 8: Gom test đỏ theo nguyên nhân gốc

Có 9 test FAIL nhưng chỉ có 4 bug. Cách gom: hỏi "các test này sai vì cùng một chỗ trong hệ thống không?".

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm | GitHub Issue |
| :--- | :--- | :--- | :-: | :--- | :--- |
| FR-09-BUG-01 | Công thức mã percent sai: `discount_amount = −9 × total`, `final_amount` lớn hơn tổng đơn | DT-01, DT-20, BV-03 (3 test) | Critical | FR-09: công thức percent và final_amount | TODO |
| FR-09-BUG-02 | Ngưỡng tối thiểu so sánh `>` thay vì `>=` | BV-02, BV-05, BV-08 (3 test) | Medium | FR-09 C3 | TODO |
| FR-09-BUG-03 | `apply-coupon` không kiểm tra JWT | AC-01, AC-02 (2 test) | High | FR-09 C4, SEC-02 | TODO |
| FR-09-BUG-04 (Draft) | Không giới hạn số lần dùng mã trên mỗi user (phụ thuộc giả định A) | BV-10 (1 test; BV-11, BV-12, BL-02..06 chưa chạy) | Medium | FR-09 C5 | TODO |

Kiểm tra: 3 + 3 + 2 + 1 = 9 test FAIL, khớp bảng kết quả. Mọi test đỏ đều thuộc một nguyên nhân gốc.

Một số test CẦN LÀM RÕ (DT-17, DT-21..25) cũng trả giá trị sai như BUG-01, nhưng chúng không FAIL vì công thức mà vì chưa có kỳ vọng, nên không nằm trong bug này.

- [ ] Mỗi bug đã có ảnh chụp
- [ ] Đã tạo GitHub Issue cho mỗi bug và điền link
- [x] Các ca CẦN LÀM RÕ (11 ca) không bị mở thành bug
- [ ] Chạy nốt 14 test còn lại rồi cập nhật bảng này; xác nhận giả định A trước khi chốt BUG-04

## Bước 10: Tổng kết

| Chỉ số | Số lượng |
| :--- | :-: |
| Pool | B |
| Test case thiết kế | 51 (Domain 25, BVA 17, Business 7, Access 2) |
| Đã chạy | 37 |
| Passed | 17 |
| Failed | 9 |
| Cần làm rõ | 11 |
| Chưa chạy | 14 (BV-11..17, BL-01..07) |
| Số bug | 4 (trong đó BUG-04 ở trạng thái Draft) |

## Phụ lục A: Câu hỏi cần làm rõ với GV/TA

Mỗi chỗ SRS im lặng là một dòng. Không mở bug cho các mục này. Mục 1–11 ứng với 11 test CẦN LÀM RÕ đã chạy; mục 12–16 là các giả định và test CẦN LÀM RÕ chưa chạy.

| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tôi | Trạng thái |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | `code = " SAVE10 "` (DT-08) | Có cắt khoảng trắng hai đầu không | HTTP 404, coi như không tồn tại | Không cắt; từ chối là chấp nhận được | Chưa hỏi |
| 2 | `code = "save10"` (DT-09) | Có phân biệt hoa/thường không | HTTP 404 | Phân biệt hoa/thường | Chưa hỏi |
| 3 | `code = 123` (DT-11) | Mã sai kiểu xử lý thế nào | HTTP 404 | Từ chối là hợp lý | Chưa hỏi |
| 4 | `total_amount = "500000"` (DT-17) | Chuỗi số có được chấp nhận không | HTTP 200, ép thành số | Nên từ chối vì R9 ghi kiểu number (nếu đúng thì là bug) | Chưa hỏi |
| 5 | `total_amount = 500000.5` (DT-18) | Có chấp nhận số thập phân không, làm tròn thế nào | HTTP 200 | Chưa có giả định | Chưa hỏi |
| 6 | `total_amount = null` (DT-19) | Null xử lý thế nào | HTTP 400, báo chưa đủ giá trị tối thiểu | Từ chối là hợp lý | Chưa hỏi |
| 7 | `user_id` của người khác (DT-21) | `user_id` trong body có phải khớp user trong token không | HTTP 200 | Phải khớp; nếu đúng thì đây là lỗ hổng (liên quan BUG-03) | Chưa hỏi |
| 8 | `user_id = 999999` (DT-22) | `user_id` không tồn tại xử lý thế nào | HTTP 200 | Như mục 7 | Chưa hỏi |
| 9 | `user_id = -1` (DT-23) | `user_id` âm xử lý thế nào | HTTP 200 | Như mục 7 | Chưa hỏi |
| 10 | `user_id` dạng chuỗi (DT-24) | Sai kiểu xử lý thế nào | HTTP 200 | Như mục 7 | Chưa hỏi |
| 11 | Thiếu `user_id` (DT-25) | `user_id` có bắt buộc không | HTTP 200 | Như mục 7 | Chưa hỏi |
| 12 | "Đã dùng mã" (BV-10, BUG-04) | Lượt dùng tính khi apply thành công hay khi đặt hàng | Lần apply thứ 2 vẫn 200 | A: mỗi lần apply thành công là một lượt (BUG-04 phụ thuộc giả định này) | Chưa hỏi |
| 13 | Mã lỗi khi vi phạm C1–C5 | HTTP status và cấu trúc JSON lỗi | Thấy 400 và 404 tùy trường hợp | Chỉ kiểm tra 4xx và không có `discount_amount` | Chưa hỏi |
| 14 | `fixed` lớn hơn tổng đơn (BV-17, chưa chạy) | `final_amount` bằng 0 hay âm, có cho áp không | TODO | Chưa có giả định | Chưa hỏi |
| 15 | Làm tròn percent (BL-01, chưa chạy) | Làm tròn số lẻ thế nào | TODO | Cho lệch nhỏ hơn 1 | Chưa hỏi |
| 16 | Ngày hết hạn (BV-13..15, chưa chạy) | So ngày theo giờ VN hay UTC; ngày hết hạn đúng hôm nay (đã có "phải trước" nên kỳ vọng từ chối) | TODO | Dùng giờ máy chủ; chạy trong 07:00–23:59 giờ VN | Chưa hỏi |
