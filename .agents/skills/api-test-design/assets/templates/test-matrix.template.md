# Test matrix: <run-id>

Phạm vi: <FR, endpoint>
Nguồn: `inputs/srs.md` (mục <...>), `inputs/openapi.yaml` (đường dẫn <...>)

## 1. Quy tắc

Mỗi quy tắc chỉ một điều kiện kiểm được. Cột `Phủ qua API` là `Có` nếu kiểm được qua API, `Không` nếu không (ghi lý do ở cột Nguồn).

| Mã | Quy tắc | Nguồn | Phủ qua API |
|----|---------|-------|-------------|
| R01 | <quy tắc> | SRS <mục> | Có |

## 2. Test matrix

`Nguồn kỳ vọng`: `SRS`, `OpenAPI` hoặc `Không nêu` (tài liệu không nêu nội dung thông báo; mã trạng thái chỉ suy ra từ quy ước chung cũng ghi `Không nêu`, giải thích ở Ghi chú). Cột `Assertion chính` luôn bắt đầu bằng mã trạng thái (`status 400; ...`). `Duyệt` do **người** điền: `Y` đồng ý, `S` đã sửa tại chỗ, `N` loại. Ca người thêm mới ghi `[THÊM]` ở đầu cột Ghi chú.

| ID | Endpoint | Nhóm | Quy tắc | Kỳ vọng | Nguồn kỳ vọng | Assertion chính | Duyệt | Ghi chú |
|----|----------|------|---------|---------|---------------|-----------------|-------|---------|
| XX01 | POST /api/... | 1 | R01 | <mã trạng thái và giá trị, tính bằng công thức SRS> | SRS | status 200; match <trường> == <giá trị> |  |  |

## 3. Mâu thuẫn và điểm chưa rõ

- <SRS và OpenAPI khác nhau ở đâu, chọn theo nguồn nào; chỗ tài liệu im lặng>

## 4. Quy ước dữ liệu

- Tài khoản mẫu chỉ để đọc hoặc thao tác an toàn: `userToken`, `adminToken`.
- Ca ghi dùng tài khoản tạm `u` từ `helpers/create-user.feature`.
- Dữ liệu tạm khác: <mô tả, tên có tiền tố `tmp`>
