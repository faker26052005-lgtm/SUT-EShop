# Output template for `FRxx_test_design.md`

Use these headings and table headers exactly (the checker reads them).

```
# FR-xx – <name> · Test design

## Bước 0: FR slice            (A. SRS, B. SEC / liên quan, C. API — verbatim)

## Bước 1: Trích yêu cầu
### 1.1 Bảng yêu cầu
| Mã | Nội dung | Nguồn | Loại |
| R1 | ... | FR-xx | nghiệp vụ |
### 1.2 Endpoint
### 1.3 CẦN LÀM RÕ

## Bước 2: Biến
### 2.1 Biến đầu vào  | Biến | Vị trí | Kiểu | Ràng buộc SRS | SRS im lặng | Có thứ tự? | Vai trò |
### 2.2 Biến trạng thái
### 2.3 Đầu ra quan sát

## Bước 3: Lớp tương đương
### <variable>
| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
| C1.1 | Hợp lệ | – | ... | R1 |

## Bước 4: Test case Domain Testing
| ID | Lớp | Mô tả | Input | Kỳ vọng | Mã YC |
| DT-01 | C1.1 | ... | ... | 2xx và dữ liệu được lưu đúng | R1 |

## Bước 5: Boundary Value Analysis
### 5.1 Biến chọn / loại và lý do
### 5.2 Bảng giá trị biên
### 5.3 Test case BVA     | ID | Biến | Giá trị | Ý nghĩa | Kỳ vọng | Mã YC |
### 5.4 Trùng với DT và quyết định giữ/loại

## Bước 6: Nghiệp vụ, bảo mật, truy cập
| ID | Mô tả | Cách dựng và input | Kỳ vọng | Mã YC |     (AC-01…, BL-01…)

## Bước 7: Side-effect
(checklist answers + new BL tests)

## Danh sách test cuối cùng (sau khi loại trùng)   ← the list that gets automated
```

## AI-usage log file (one per step), if requested
```
# <FR>-<nn> – <FR> · <step name>

| Trường | Giá trị |
| :-- | :-- |
| Công cụ AI | <tool/model> |
| Ngày giờ | <YYYY-MM-DD HH:MM:SS (UTC+0700)> |
| Feature / bước | <FR> – <step> |
| Chat / phiên | <session name> |
| Commit liên quan | |

## Prompt (nguyên văn)
## Output của AI (nguyên văn, CHƯA chỉnh sửa)
## Rà soát của tôi (human review)
- Chấp nhận: Có/Không
- Các chỉnh sửa trong AI_gap_analysis
```
