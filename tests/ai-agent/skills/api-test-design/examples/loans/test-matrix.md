# Test matrix: run-example-loans

Phạm vi: FR-XX Mượn sách (API giả)
Nguồn: SRS giả mục FR-XX, OpenAPI giả `/api/loans`

## 1. Quy tắc

| Mã | Quy tắc | Nguồn | Phủ qua API |
|----|---------|-------|-------------|
| R01 | Mượn sách thường hợp lệ trả 201, hạn 14 ngày | SRS FR-XX | Có |
| R02 | Mượn sách hiếm trả 201, hạn 7 ngày | SRS FR-XX | Có |
| R03 | Cuốn thứ 3 vẫn mượn được | SRS FR-XX | Có |
| R04 | Cuốn thứ 4 bị từ chối 409 | SRS FR-XX | Có |
| R05 | book_id không tồn tại trả 404 | OpenAPI | Có |
| R06 | Thiếu book_id trả 400 | OpenAPI | Có |
| R07 | Không token trả 401 | SRS FR-XX | Có |
| R08a | Thành viên gọi GET /api/loans trả 403 | SRS FR-XX | Có |
| R08b | Thủ thư gọi GET /api/loans trả 200 và thấy khoản mượn | SRS FR-XX | Có |
| R09 | Thành viên không được hủy khoản mượn của người khác, trả 403 | SRS FR-XX | Có |

## 2. Test matrix

| ID | Endpoint | Nhóm | Quy tắc | Kỳ vọng | Nguồn kỳ vọng | Assertion chính | Duyệt | Ghi chú |
|----|----------|------|---------|---------|---------------|-----------------|-------|---------|
| LN01 | POST /api/loans | 1 | R01 | 201, loan_days = 14 (sách id 1 là sách thường) | SRS | status 201; loan_days == 14 | Y | |
| LN02 | POST /api/loans | 1 | R02 | 201, loan_days = 7 (sách id 2 là sách hiếm) | SRS | status 201; loan_days == 7 | Y | |
| LN03 | POST /api/loans | 2 | R03 | Ba lần mượn liên tiếp đều 201 | SRS | status 201 ở mỗi lần | Y | Tài khoản tạm |
| LN04 | POST /api/loans | 2 | R04 | Ba lần đầu 201, lần thứ 4 là 409 | OpenAPI | status 409; error chứa 'tối đa 3' | Y | Có bước đối chứng |
| LN05 | POST /api/loans | 4 | R05 | 404 | Không nêu | status 404; error là chuỗi | Y | |
| LN06 | POST /api/loans | 3 | R06 | 400 khi body rỗng | Không nêu | status 400; error là chuỗi | Y | |
| LN07 | POST /api/loans | 5 | R07 | 401, error = 'Unauthorized' | OpenAPI | status 401; error == 'Unauthorized' | Y | |
| LN08 | GET /api/loans | 5 | R08a | 403, error = 'Forbidden' | OpenAPI | status 403; error == 'Forbidden' | Y | |
| LN09 | GET /api/loans | 1 | R08b | 200, danh sách chứa khoản mượn vừa tạo | SRS | status 200; contains loan_id | Y | Ghi bằng tài khoản tạm, đọc bằng adminToken |
| LN10 | DELETE /api/loans/{id} | 5 | R09 | 403, error = 'Forbidden' khi thành viên khác hủy khoản mượn | OpenAPI | status 403; error == 'Forbidden' | Y | Nhắm vào khoản mượn tạm của tài khoản tạm owner, không dùng id có sẵn; dọn dẹp trước khi kiểm |

## 3. Mâu thuẫn và điểm chưa rõ

- SRS không nêu thông báo lỗi cho book_id sai và body rỗng, nên LN05 và LN06 chỉ kiểm mã và error là chuỗi.

## 4. Quy ước dữ liệu

- Tài khoản mẫu chỉ đọc: `userToken` (thành viên), `adminToken` (thủ thư).
- Ca ghi dùng tài khoản tạm `u`.
