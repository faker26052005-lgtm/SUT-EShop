# FR-04 – Quản lý hồ sơ cá nhân · Bước 6: Nghiệp vụ, bảo mật, truy cập

Danh sách tự hỏi:
- [x] Truy cập: không token, token sai (AC-01, AC-02); chưa dựng được token hết hạn
- [x] Quyền: sửa hồ sơ người khác (BL-05 kiểm tra `id` trong body; ca user A/B ở mục 5.3)
- [x] Trường bị cấm đổi: `email` (BL-03), `role` (BL-04), `id` (BL-05)
- [x] Tác dụng phụ: trường không gửi (BL-02 và cột side-effect ở mọi test), nội dung response (mục 5.3)
- [ ] Tính toán, thời gian, trạng thái: không áp dụng cho FR-04
- [x] Lặp lại: gửi lại dữ liệu y hệt, không có giá trị kiểm thử thêm (đã chạy thử, xem `08`)

## 5.1 Test case
| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- |
| BL-01 | Cập nhật cả 3 trường hợp lệ | `{"name": "Ten Moi", "phone": "0911111111", "shipping_address": "Dia chi moi"}` | 2xx, cả 3 trường lưu đúng | R1 |
| BL-02 | Chỉ gửi một trường thì các trường còn lại phải giữ nguyên | Đặt hồ sơ gốc, rồi gửi `{"phone": "0922222222"}` | `phone` đổi; `name` và `shipping_address` giữ nguyên (giả định A1, `clarifications` mục 8) | R1 |
| BL-03 | Không đổi được email | `{"email": "hacker@evil.com"}` | Email giữ nguyên (bỏ qua hoặc từ chối đều chấp nhận, `clarifications` mục 9) | R3 |
| BL-04 | Không tự đổi được `role` | `{"role": "admin"}` | `role` vẫn là `user` | R5, SEC-06 |
| BL-05 | Gửi kèm `id` không được ghi đè | `{"id": 1, "name": "X"}` | `id` tài khoản không đổi | R4 |
| AC-01 | Không có token | `{"name": "X"}`, bỏ header `Authorization` | 401 hoặc 403, dữ liệu không đổi | R6, SEC-02 |
| AC-02 | Token sai | `{"name": "X"}`, header `Bearer abc.def.ghi` | 401 hoặc 403, dữ liệu không đổi | R6, SEC-02 |

Tổng: 7 test. Cùng với 20 test ở `03` và 7 test ở `04`, bộ test FR-04 có **34 test**.

## 5.2 Kiểm tra tác dụng phụ (áp dụng cho mọi test)
Sau mỗi test, ngoài kiểm tra theo kỳ vọng, script còn kiểm tra các trường `name`, `phone`, `shipping_address` **không có trong body** có giữ nguyên không. Kết quả ghi ở cột side-effect của `06`, tách khỏi verdict, vì một test có thể PASS ở tiêu chí riêng nhưng vẫn làm mất dữ liệu.

## 5.3 Ca đề xuất bổ sung (chưa tính vào 34 test)
Các ca này đến từ bước AI gap analysis và đã chạy thử trên một bản clone `main` trong sandbox (bạn cần chạy lại trên máy bạn). Nếu quyết định đưa vào bộ cuối thì phải cập nhật số liệu ở `06`, `07`, `09` và `BUG_LIST.md`.

| ID đề xuất | Mô tả | Kỳ vọng (theo SRS) | Kết quả đã chạy thử | Nhận định |
| :--- | :--- | :--- | :--- | :--- |
| BL-06 | Response của `GET /api/users/me` không chứa mật khẩu và trường nhạy cảm | Không có `password`, `reset_token`; không lưu plaintext (SEC-01) | Response chứa `password` đúng bằng mật khẩu đã đăng ký | FAIL, bug mới (`bugs/FR-04-BUG-04.md`) |
| BL-07 | Tính nguyên tử: `name` hợp lệ + `phone` 9 số | 4xx, hồ sơ không đổi (R2) | HTTP 200, lưu cả hai | FAIL, cùng nguyên nhân BUG-01 |
| AC-03 | Cô lập user: user A cập nhật, hồ sơ user B không đổi | Hồ sơ B giữ nguyên (R4) | B không bị ảnh hưởng | PASS |
| (UI) | `name` chứa `<script>` hiển thị trên giao diện web | Được escape, không thực thi (R7, SEC-04) | `GET` trả nguyên văn (đúng, vì escape thuộc UI) | Cần kiểm thử trên giao diện web, chưa thực hiện |
| (type) | `name` là số, `shipping_address` là object | CẦN LÀM RÕ (SRS không nêu kiểu) | Lưu `12345` và `[object Object]` | Đưa vào câu hỏi làm rõ nếu cần |

## 5.4 Ca của AI bị loại
SE-01 (đơn hàng cũ không đổi địa chỉ): cần feature đặt hàng và SRS FR-04 không có yêu cầu này. SE-04 (`updated_at`): `GET /api/users/me` không có trường này. SE-05 (gửi lại dữ liệu y hệt): không thêm giá trị. DT-22 (token hết hạn): không dựng được token hết hạn khi không có khóa ký.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| FR-04-06 | Sinh test nghiệp vụ, bảo mật, truy cập (prompt trung lập) |
| FR-04-07 | Câu hỏi thăm dò về tác dụng phụ và trạng thái khác |

## Tôi đã rà soát / sửa gì so với output AI

- Chốt kỳ vọng rõ ràng cho `email` và `role` (AI để CẦN LÀM RÕ ở Bước 4, chỉ chốt ở Bước 6). Chốt kỳ vọng BL-02 theo giả định A1 và gắn với câu hỏi làm rõ; AI để CẦN LÀM RÕ.
- Bỏ SEC-03 (XSS) khỏi test API vì AI kỳ vọng JSON phải escape, trong khi SEC-04 yêu cầu escape ở giao diện; chuyển sang mục cần kiểm thử trên UI.
- Loại SE-01, SE-04, SE-05 và phần `is_active`, `created_at` của SE-03 vì dùng trường hoặc yêu cầu không có trong SRS/API; giữ phần `id` thành BL-05.
- Đưa AC-01 (cô lập user) và SE-02 (tính nguyên tử) của AI vào mục ca đề xuất vì có giá trị; thêm BL-06 từ việc quan sát response.
- AI luôn gửi đủ 3 trường nên che tác dụng phụ; thêm kiểm tra side-effect áp dụng cho mọi test (mục 5.2).
- TODO: xác nhận và viết lại phần rà soát bằng lời của bạn
