# FR-04 – Quản lý hồ sơ cá nhân · Bước 8: Gom test đỏ theo nguyên nhân gốc

Có 14 test FAIL nhưng chỉ có 3 bug. Cách gom: hỏi "các test này sai vì cùng một chỗ trong hệ thống không?".

| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm | GitHub Issue |
| :--- | :--- | :--- | :-: | :--- | :--- |
| FR-04-BUG-01 | Không có bước kiểm tra SĐT (và không kiểm tra kiểu dữ liệu) | DT-03, DT-04, DT-05, DT-06, DT-07, DT-08, DT-08b, DT-08c, BV-01, BV-04, BV-05, BV-07 (12 test) | High | FR-04: SĐT bắt đầu 0, 10–11 chữ số | TODO |
| FR-04-BUG-02 | Cập nhật hồ sơ ghi đè mọi trường; trường không gửi thành `null` | BL-02 (và side-effect ở 31 test) | High | FR-04 (giả định A1, chờ xác nhận) | TODO |
| FR-04-BUG-03 | Server nhận mọi trường trong body, kể cả `role` (Mass Assignment) | BL-04 | Critical | FR-04, SEC-06 | TODO |

Kiểm tra: 12 + 1 + 1 = 14 test FAIL, khớp bảng kết quả. Mọi test đỏ đều thuộc một nguyên nhân gốc.

Mục "side-effect" không phải 31 bug riêng: đó là biểu hiện của BUG-02 ở các test khác.

- [ ] Mỗi bug đã có ảnh chụp
- [ ] Đã tạo GitHub Issue cho mỗi bug và điền link
- [x] Các ca CẦN LÀM RÕ (7 ca) không bị mở thành bug
