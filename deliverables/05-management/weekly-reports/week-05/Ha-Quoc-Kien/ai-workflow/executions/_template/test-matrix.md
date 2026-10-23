# Test matrix: <tên lần chạy>

- Lần chạy: `<run-id>`  | Ngày: `<...>`  | Phạm vi: `<các nhóm chức năng>`
- Agent / mô hình: `<...>`  | Người duyệt: `<...>`

## 1. Quy tắc nghiệp vụ và bảo mật

| Mã | Quy tắc | Căn cứ |
|---|---|---|
| R01 | `<quy tắc kiểm tra được qua API>` | FR-xx |

## 2. Test matrix

Cột **Duyệt** do người điền: `Y` giữ nguyên, `S` sửa theo ghi chú (rồi coi như duyệt), `N` bỏ. Agent **không** điền cột này.

| ID | Endpoint | Nhóm ca (1 đến 6) | Căn cứ | Kỳ vọng (theo SRS) | Assertion chính | Duyệt | Ghi chú người duyệt |
|---|---|---|---|---|---|---|---|
| AC01 | POST /api/apply-coupon | 1 | FR-09, R01 | 200; giảm 10%, 1.000.000 còn 900.000 | status, discount_amount, final_amount | | |

## 3. Bảng phủ

| Endpoint | Các ca |
|---|---|
| POST /api/apply-coupon | AC01 |

## 4. Mâu thuẫn và điểm chưa rõ

| # | Nội dung | Agent đề xuất | Người quyết định |
|---|---|---|---|
| 1 | `<ví dụ: OpenAPI ghi không cần đăng nhập, SRS yêu cầu đăng nhập>` | theo SRS | |
