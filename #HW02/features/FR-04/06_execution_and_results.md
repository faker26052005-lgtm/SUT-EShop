# FR-04 – Quản lý hồ sơ cá nhân · Bước 7: Thực thi và kết quả

## 6.1 Môi trường
- Hệ điều hành, Node, phiên bản Postman: TODO
- SUT: commit TODO; reset dữ liệu bằng `node database.js` trước khi chạy: TODO
- Collection: `tests/postman/FR-04/FR04.postman_collection.json` (folder C: bấm Send liên tiếp)

## 6.2 Cách chạy
Mỗi lần bấm Send ở C1 chạy một test: tạo user mới, đặt hồ sơ gốc (`Ten Goc` / `0900000000` / `Dia chi goc`), gửi body của test, rồi đọc lại hồ sơ để chấm. C2 tổng hợp kết quả.

## 6.3 Bảng kết quả
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

## 6.4 Tổng hợp
| Designed | Executed | Passed | Failed | Cần làm rõ | Not executed |
| :-: | :-: | :-: | :-: | :-: | :-: |
| 34 | 34 | 13 | 14 | 7 | 0 |

Có 31 trên 34 test kèm side-effect (BUG-02). Số liệu tính từ dữ liệu mẫu; đối chiếu lại với dòng TỔNG ở request C2 của bạn.

## 6.5 Ảnh cần chụp
- TODO: ảnh tổng hợp Test Results của C2 (đặt ở `evidence/FR-04/C2_tong-hop.png`)
- TODO: ảnh bug (xem mục "Bằng chứng" trong từng file `bugs/FR-04-BUG-0x.md`)
