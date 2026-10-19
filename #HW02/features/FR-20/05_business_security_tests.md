# FR-20 – Mobile: Đăng ký và Hủy đơn · Bước 6: Nghiệp vụ, bảo mật, truy cập

Tự hỏi lần lượt (đánh dấu đã xét):
- [x] Truy cập: không token, token sai (AC-C01, AC-C02)
- [x] Quyền: thao tác trên dữ liệu của người khác (AC-C03)
- [x] Trường bị cấm đổi qua payload: `role` khi đăng ký (BL-R06)
- [x] Tác dụng phụ: hủy một đơn không đổi đơn khác (BL-C02)
- [ ] Tính toán: không áp dụng cho hai chức năng này
- [x] Lặp lại / thứ tự / số lần: bấm hai lần (BL-R03, BL-C04)
- [x] Thời gian / trạng thái: đổi trạng thái ngay lúc thao tác (BV-C01), nhãn và màu (BL-C01, BL-C06)

| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req | Tầng |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BL-R01 | Đăng ký thành công thì chuyển sang màn Đăng nhập | Dùng DT-R01 | Màn hiện tại là Đăng nhập | R7 | UI |
| BL-R02 | Đăng nhập bằng tài khoản vừa đăng ký | login với DT-R01 | Đăng nhập thành công | R7 | UI+API |
| BL-R03 | Bấm Đăng ký hai lần liên tiếp | Double tap với dữ liệu hợp lệ | Chỉ có 1 tài khoản; không lỗi 5xx | R3 | UI+API |
| BL-R04 | Mật khẩu bị che ký tự khi nhập | Quan sát ô mật khẩu | Ký tự bị che | R15 | UI |
| BL-R05 | Dấu `*` ở trường bắt buộc, lỗi nằm trên nút Đăng ký | Quan sát form | CẦN LÀM RÕ (#5) | R15 | UI |
| BL-R06 | Gửi kèm role=admin khi đăng ký | body thêm `role:"admin"` | Tài khoản tạo ra có role `user` (SEC-06) | R5* | API |
| BL-C01 | Sau khi hủy, lịch sử hiển thị 'Đã hủy' đúng màu | Hủy đơn `pending` rồi mở Lịch sử | Nhãn tiếng Việt + màu riêng | R13 | UI |
| BL-C02 | Tác dụng phụ: hủy một đơn không đổi đơn khác | Có 2 đơn; hủy đơn 1 | Đơn 2 giữ nguyên trạng thái | R8 | UI+API |
| BL-C03 | Nút Hủy chỉ hiện ở `pending`/`confirmed` | Xem 5 đơn ở 5 trạng thái | Nút chỉ có ở 2 trạng thái đầu | R8 | UI |
| BL-C04 | Bấm Hủy hai lần liên tiếp | Double tap trên đơn `pending` | Lần 2 bị từ chối hoặc bỏ qua; không 5xx | R10 | UI+API |
| BL-C05 | Admin hủy đơn `shipping` | PUT /api/admin/orders/:id/status status=canceled | CẦN LÀM RÕ (sơ đồ không có mũi tên shipping→canceled nhưng FR-10 nói 'chỉ Admin mới thao tác') | R9 | API |
| BL-C06 | Nhãn trạng thái tiếng Việt, mỗi trạng thái một màu | Xem lịch sử với 5 trạng thái | 5 nhãn tiếng Việt; màu phân biệt | R13 | UI |
| AC-C01 | Hủy đơn không có token | PUT cancel không header | 401/403; đơn không đổi | R14 | API |
| AC-C02 | Hủy đơn với token sai | Bearer abc.def.ghi | 401/403; đơn không đổi | R14 | API |
| AC-C03 | Hủy đơn của người khác | Token user B, đơn của user A | Từ chối; đơn của A không đổi | R12 | API |


---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
