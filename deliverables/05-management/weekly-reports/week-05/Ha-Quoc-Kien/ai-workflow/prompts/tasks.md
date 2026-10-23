# Các lời nhắc nhiệm vụ (dán lần lượt, mỗi bước một lượt)

Thay `[RUN-ID]` bằng tên lần chạy (ví dụ `run-01-coupon`) và `[PHẠM VI]` bằng nhóm chức năng cần test (ví dụ `đăng nhập, áp mã giảm giá`).

## Bước 1. Sinh test matrix (pha 1 và 2, rồi dừng)

```
Áp dụng skill api-test-design. Đọc inputs/srs.md, inputs/openapi.yaml, inputs/sample-data.md.
Phạm vi: [PHẠM VI]. Tên lần chạy: [RUN-ID].
Làm pha 1 và pha 2: rút quy tắc, rồi tạo executions/[RUN-ID]/test-matrix.md theo mẫu
executions/_template/test-matrix.md. Để trống cột Duyệt. Sau đó DỪNG và báo "chờ duyệt".
Chưa viết Karate.
```

**Người làm:** mở `test-matrix.md`, điền cột Duyệt (Y, S, N) và ghi chú, kiểm cả mục "Mâu thuẫn và điểm chưa rõ". Đếm số ca Y, S, N, thêm để điền `result.md`.

## Bước 2. Sinh Karate cho ca đã duyệt (pha 4, rồi dừng)

```
Matrix [RUN-ID] đã duyệt. Làm pha 4: sinh Karate feature vào executions/[RUN-ID]/features/ cho các ca có
Duyệt là Y hoặc S (ca S sửa theo ghi chú), bỏ ca N. Mỗi Scenario có thẻ @ID trùng matrix.
Viết theo references/karate-guide.md và examples/. Sau đó chạy script check_coverage.py và sửa đến khi
hết LỖI. Rồi DỪNG, báo kết quả script. Chưa chạy test.
```

**Người làm:** đọc từng feature. Tìm assertion chỉ kiểm mã trạng thái, ca không đọc lại sau khi ghi, thao tác phá hủy trên tài khoản mẫu. Sửa hoặc yêu cầu Agent sửa.

## Bước 3. Chạy và đánh giá (pha 5, chỉ sau khi người cho phép)

Người tự chạy Karate (xem `README.md`) hoặc nói với Agent:

```
Chạy: máy chủ EShop đã được khởi động mới. Hãy chạy các feature của [RUN-ID] bằng lệnh trong
references/karate-guide.md, rồi điền executions/[RUN-ID]/result.md. Phân loại từng ca đỏ
(HT, HT-mới, KY, SC). Không sửa assertion để xanh.
```

**Người làm:** với mỗi ca đỏ và mỗi ca xanh đáng ngờ, kiểm chứng bằng gọi API trực tiếp rồi mới ghi vào `result.md`.
