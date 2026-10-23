# Các lời nhắc nhiệm vụ (dán lần lượt, mỗi bước một lượt)

Thay `[RUN-ID]` bằng tên lần chạy (ví dụ `run-01-coupon`) và `[PHẠM VI]` bằng nhóm chức năng cần test (ví dụ `đăng nhập, áp mã giảm giá`).

## Bước 1. Sinh test matrix (pha 1 và 2, rồi dừng)

```
Áp dụng skill api-test-design. Phạm vi: [PHẠM VI]. Tên lần chạy: [RUN-ID].

Chuẩn bị thư mục (làm trước, nếu thư mục đã tồn tại thì dừng lại và báo tôi):
1. Tạo executions/[RUN-ID]/.
2. Chép executions/_template/result.md và executions/_template/conversation.md vào đó
   (chưa chép test-matrix.md, vì bạn sẽ sinh nó ở dưới).
3. Điền đầu hai tệp đó những mục bạn biết chắc: Agent/công cụ = Antigravity, tên và phiên bản mô hình
   của chính bạn, chế độ = "có nạp skill và rule", Karate 1.5.2, Java 17.
   Mục nào bạn không biết chắc (ngày giờ, hệ điều hành) thì để nguyên chỗ trống, đừng đoán.

Rồi đọc inputs/srs.md, inputs/openapi.yaml, inputs/sample-data.md và làm pha 1 và pha 2:
rút quy tắc, tạo executions/[RUN-ID]/test-matrix.md theo mẫu executions/_template/test-matrix.md.
Để trống cột Duyệt. Sau đó DỪNG và báo "chờ duyệt". Chưa viết Karate.
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

Người khởi động máy chủ EShop **mới**, rồi nói "chạy" và dán lời nhắc sau (hoặc tự chạy lệnh trong mục "Lệnh chạy" của `references/karate-guide.md` rồi chỉ nhờ Agent điền kết quả):

```
Chạy: máy chủ EShop đã được tôi khởi động mới. Hãy chạy các feature của [RUN-ID] bằng lệnh ở mục
"Lệnh chạy" trong references/karate-guide.md (đúng hệ điều hành của tôi), rồi điền
executions/[RUN-ID]/result.md từ báo cáo. Phân loại từng ca đỏ (HT, HT-mới, KY, SC).
Không sửa assertion để xanh. Không tự bật hay tắt máy chủ.
```

**Người làm:** với mỗi ca đỏ và mỗi ca xanh đáng ngờ, kiểm chứng bằng gọi API trực tiếp rồi mới ghi vào `result.md`. Lưu hội thoại vào `conversation.md`.
