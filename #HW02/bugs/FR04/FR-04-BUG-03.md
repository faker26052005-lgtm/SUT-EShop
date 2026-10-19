# FR-04-BUG-03

**Tiêu đề Issue:** `[FR-04] PUT /api/users/me cho phép người dùng tự đổi role thành admin (SEC-06)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR-04-BUG-03 |
| Mức độ | **Critical** (leo thang đặc quyền) |
| Feature | FR-04 – Quản lý hồ sơ cá nhân |
| Yêu cầu SRS bị vi phạm | FR-04: "không thể tự thay đổi thuộc tính `role`"; SEC-06 |
| Môi trường | Backend localhost:3000 (`node server.js`), SUT commit TODO (chạy `git rev-parse --short HEAD` trong thư mục eshop-sut) |
| Test case liên quan | BL-04 |
| GitHub Issue | TODO (link) |
| Trạng thái | Open |

## Các bước tái hiện
1. Postman, mở folder **B**: chạy **B1 (Register)** rồi **B2 (Login)** để có user mới và token.
2. Ở **B3**, sửa body như bên dưới rồi bấm **Send**.
3. Bấm **Send ở B4 (GET /users/me)** để xem dữ liệu đã lưu thật.

Body ở bước 2:
```json
{ "role": "admin" }
```

## Kết quả thực tế
HTTP 200 `{"message":"Profile updated"}`. `GET /api/users/me` cho thấy **`role` đổi từ `user` thành `admin`**.

## Kết quả mong đợi
`role` giữ nguyên là `user` (server bỏ qua hoặc từ chối trường `role`).

## Bằng chứng
Cần chụp:
- `FR-04-BUG-03-before.png`: GET cho thấy `role = user`.
- `FR-04-BUG-03-request.png`: B3 gửi `{"role":"admin"}`, thấy HTTP 200.
- `FR-04-BUG-03-after.png`: GET cho thấy `role = admin`.
- TODO: ảnh trang GitHub Issue.

## Ghi chú
- Đây là lỗi kiểu Mass Assignment: server nhận trực tiếp mọi trường trong body.
- Bất kỳ người dùng đã đăng nhập nào cũng tự nâng quyền được, không cần điều kiện đặc biệt.
- Khi kiểm tra tác động, thấy `GET /api/admin/users` trả 200 cả với user thường (`role = user`). Đó là vấn đề phân quyền admin riêng, không thuộc FR-04. Cần theo dõi khi test các feature admin (FR-12, FR-15) và không dùng nó làm bằng chứng cho bug này.
