---
name: api-test-design
description: Thiết kế test matrix có truy vết (traceability) và sinh Karate feature cho một REST API từ đặc tả OpenAPI và SRS, theo quy trình có người duyệt. Dùng khi người dùng nhờ sinh test, lập test matrix hoặc kiểm thử tự động một API từ tài liệu đặc tả.
---

# api-test-design

Mục tiêu: tìm **càng nhiều lỗi thật** của API càng tốt, bằng test có kỳ vọng lấy từ đặc tả, có người duyệt trước khi chạy.

## Đầu vào bắt buộc

Đọc **cả ba** tệp trong `inputs/`: `srs.md`, `openapi.yaml`, `sample-data.md`.
- **SRS là nguồn chuẩn.** Khi SRS và OpenAPI mâu thuẫn, kỳ vọng theo SRS và ghi chỗ mâu thuẫn vào mục "Mâu thuẫn và điểm chưa rõ" của matrix.
- Thiếu một trong ba tệp thì dừng lại và báo người dùng, đừng đoán.

## Quy trình năm pha (không nhảy pha)

**Pha 1. Nạp và rút quy tắc.** Đọc đầu vào, liệt kê quy tắc kiểm tra được qua API (R01, R02, ...), mỗi quy tắc kèm mã tham chiếu (FR-xx, SEC-xx).

**Pha 2. Sinh test matrix.** Tạo `executions/<run-id>/test-matrix.md` từ mẫu `executions/_template/test-matrix.md`. Mỗi dòng là một ca test: ID, endpoint, nhóm ca, căn cứ, kỳ vọng theo SRS, assertion chính. Để trống cột "Duyệt". Quy tắc thiết kế ca: xem `references/design-rules.md`.

**Pha 3. DỪNG, chờ người duyệt.** Báo: "Matrix đã xong, chờ duyệt." Không viết Karate khi chưa có ca nào được duyệt. Cột "Duyệt": `Y` giữ nguyên, `S` sửa theo ghi chú rồi coi như duyệt, `N` bỏ.

**Pha 4. Sinh Karate cho ca đã duyệt.** Ghi vào `executions/<run-id>/features/<nhóm>.feature`. Mỗi `Scenario` gắn đúng một thẻ `@ID` trùng với matrix. Viết theo `references/karate-guide.md` và theo phong cách của các ví dụ trong `examples/`. Sau đó chạy:
`python <thư mục chứa SKILL.md này>/scripts/check_coverage.py executions/<run-id>`
(chạy từ thư mục gốc của dự án) và sửa cho đến khi không còn LỖI; với CẢNH BÁO thì xem xét từng cái.

**Pha 5. DỪNG, người quyết định chạy.** Người đọc feature rồi mới cho chạy. Chỉ chạy khi người nói rõ "chạy". Sau khi chạy, điền `executions/<run-id>/result.md` từ mẫu `executions/_template/result.md` và phân loại từng ca đỏ.

## Quy tắc cốt lõi

1. **Kỳ vọng chỉ lấy từ SRS và OpenAPI.** Không gọi thử hệ thống rồi viết kỳ vọng theo điều quan sát được. Chỗ tài liệu không nêu: ghi "SRS không nêu" vào matrix để người quyết, không tự đoán.
2. **Không bịa dữ liệu.** Chỉ dùng tài khoản, id, mã giảm giá có trong `sample-data.md`.
3. **Assertion chặt.** Không chấp nhận ca chỉ kiểm mã 200. Kiểm cả nội dung phản hồi, trường không được xuất hiện, và đọc lại dữ liệu sau khi ghi.
4. **Đủ nhóm ca.** Mỗi endpoint có ít nhất một ca đường đi đúng và một ca âm tính hoặc bảo mật.
5. **Không phá dữ liệu mẫu.** Không xóa, đổi quyền hay đổi mật khẩu hai tài khoản mẫu. Ca cần thao tác đó thì tạo tài khoản tạm bằng `POST /api/register`.
6. **Mỗi ca độc lập.** Không dùng dữ liệu do ca khác tạo ra.
7. **Không sửa test cho xanh.** Ca đỏ do hệ thống sai thì giữ nguyên và báo, không nới assertion.

## Khi không chắc

Ghi câu hỏi vào mục "Mâu thuẫn và điểm chưa rõ" của matrix và dừng ở pha hiện tại. Hỏi người dùng, đừng tự quyết.
