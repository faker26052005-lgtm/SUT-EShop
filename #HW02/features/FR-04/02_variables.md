# FR-04 – Quản lý hồ sơ cá nhân · Bước 2: Xác định biến

## 2.1 Biến đầu vào
| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `phone` | body | chuỗi | Bắt đầu bằng `0`, 10–11 chữ số (R2) | Khoảng trắng, dấu gạch, `+84`; rỗng, `null`; kiểu khác chuỗi | **Có**: độ dài (10–11), chữ số đầu |
| `name` | body | chuỗi | Cập nhật được (R1) | Rỗng, toàn khoảng trắng, HTML, độ dài tối đa, dấu tiếng Việt | Không (SRS không nêu biên) |
| `shipping_address` | body | chuỗi | Cập nhật được (R1) | Rỗng, độ dài tối đa | Không (SRS không nêu biên) |
| `email` | body | chuỗi | Không được đổi (R3) | Gửi lên thì bỏ qua hay từ chối | Không |
| `role` | body | chuỗi | Không được tự đổi (R5, SEC-06) | Gửi lên thì bỏ qua hay từ chối | Không |
| `id` | body | số | Chỉ cập nhật hồ sơ của chính mình (R4) | Gửi `id` khác thì xử lý thế nào | Không |
| `Authorization` | header | JWT | Phải hợp lệ (R6, SEC-02) | Token hết hạn | Không |

## 2.2 Biến trạng thái / điều kiện ẩn
| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| Token và vai trò của người gọi | Quyết định có gọi được API không, và `role` ban đầu là `user` | `POST /api/register` rồi `POST /api/login`, mỗi test dùng một user mới |
| Hồ sơ hiện tại (`name`, `phone`, `shipping_address`) | Cần để kiểm tra trường được gửi lưu đúng và trường không gửi giữ nguyên | Sau khi đăng nhập, `PUT` hồ sơ gốc: `Ten Goc` / `0900000000` / `Dia chi goc` |
| Quyền sở hữu dữ liệu (R4) | Cập nhật phải ghi đúng vào hồ sơ của người gọi | Dùng token của user A, đối chiếu user B (xem ca đề xuất ở `05` mục 5.3) |

Không truy cập CSDL trực tiếp (black-box): mọi trạng thái đều đọc lại qua `GET /api/users/me`.

## 2.3 Đầu ra cần quan sát
- Mã HTTP và nội dung `message` của `PUT`.
- Sau mỗi `PUT`, gọi `GET /api/users/me` và so với trạng thái trước:
  - trường đã gửi: có lưu đúng giá trị không;
  - trường **không gửi** (`name`, `phone`, `shipping_address`): có bị đổi không (kiểm tra side-effect);
  - `email`, `role`, `id`: có bị đổi không.
- Các trường có trong response của `GET`: có trường nhạy cảm nào không nên xuất hiện không (ví dụ mật khẩu). Đây là điểm bị bỏ sót ở lần đầu, xem `08_ai_gap_analysis.md` mục 8.6.

## 2.4 Nguyên tắc
Chỗ SRS im lặng ghi `CẦN LÀM RÕ`, đã chuyển sang `clarifications.md`, không tự bịa kỳ vọng.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| FR-04-02 | Xác định biến, biến trạng thái, đầu ra cần quan sát |

## Tôi đã rà soát / sửa gì so với output AI
> BẢN NHÁP do Claude soạn bằng cách so output gốc của AI với tài liệu này. Hãy mở output gốc, xác nhận từng ý và viết lại bằng lời của bạn.

- AI xếp `name` và `shipping_address` vào nhóm có thể áp dụng BVA với giả định biên 1–255. Tài liệu này đổi thành "Không" vì SRS không nêu biên nào.
- Bổ sung biến `id` trong body (R4), mà AI không liệt kê.
- Bỏ cách dựng bằng SQL vào CSDL mà AI đề xuất: kiểm thử black-box chỉ dùng `register`, `login` và `GET` để đọc lại.
- Bổ sung vào đầu ra cần quan sát: nội dung response của `GET` (phát hiện sau ở bước gap analysis).
- TODO: xác nhận và viết lại phần rà soát bằng lời của bạn
