# FR-17 – Quản lý Mã Giảm Giá · Thiết kế kiểm thử (Domain Testing & BVA)

| Trường | Giá trị |
| :-- | :-- |
| Công cụ AI | Antigravity IDE (Google DeepMind) / Claude 3.7 Sonnet |
| Ngày giờ | 2026-10-21 09:28:48 (UTC+0700) |
| Feature / bước | FR-17 – Thiết kế test (domain-bva-test-design) |
| Chat / phiên | FR17 Test Suite Automation Session |
| Commit liên quan | |

## Prompt (nguyên văn)
```
Dùng skill domain-bva-test-design để thiết kế test cho FR-17.

Đầu vào duy nhất: system_requirements_specification.md và api_specification.md trong workspace (đọc cả hai; Base URL và tài khoản mặc định lấy từ đó). Không đọc source code của hệ thống, chỉ dùng HTTP.
```

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
```
✅ RESULT: OK — 0 warnings, 0 errors.

File đã được lưu tại: FR17_test_design.md

### Tóm tắt kết quả

36 test cases (sau khi loại trùng BV-08, BV-09):

| Prefix | Ý nghĩa | Số lượng |
|--------|---------|---------|
| DT-01…16 | Domain Testing (lớp tương đương) | 16 |
| BV-01…07 | Boundary Value Analysis (3 biến số) | 7 |
| AC-01…06 | Access Control (thiếu/sai token, sai format, sai role / giả mạo) | 6 |
| BL-01…05 | Business logic + side-effect | 5 |
| BL-05 | Double delete (side-effect mới) | (trong BL) |

| Kỳ vọng | Số |
|---------|---|
| 2xx và dữ liệu được lưu đúng | 10 |
| 4xx và dữ liệu không đổi | 22 |
| CẦN LÀM RÕ | 4 (expired_at quá khứ, sai định dạng, is_active mass-assign, double delete) |

9 mục CẦN LÀM RÕ đã được liệt kê tại Bước 1.3 để chuyển cho giảng viên/BA trước khi chạy test.
```

### Danh sách lệnh đã chạy và kết quả thật
- **Lệnh thực thi**:
  ```bash
  python .agents/skills/domain-bva-test-design/scripts/check_design.py #HW02/skills/demo/output/FR17/FR17_test_design.md
  ```
- **Kết quả thật**:
  ```text
  RESULT: OK
  0 warnings, 0 errors
  ```

### Danh sách file đã tạo
- `FR17_test_design.md` (25,533 bytes)

## Rà soát của tôi (human review)
- Chấp nhận: Có/Không
- Các chỉnh sửa trong AI_gap_analysis:
