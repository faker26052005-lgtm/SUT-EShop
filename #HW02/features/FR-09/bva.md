# FR-09 – Mã giảm giá (Coupon) · Boundary Value Analysis

## Bước 5: Boundary Value Analysis

> Log AI nguyên văn: `ai_audit/entries/FR-09/05_...`. Biến thể: **3-value** (min−1, min, min+1, max−1, max, max+1), theo giảng viên.

### 5.1 Biến được chọn cho BVA và lý do
| Biến | Chọn? | Lý do |
| :--- | :--- | :--- |
| `total_amount` so với `min_order_amount` | Có | Số, biên `>=` rõ ràng (R3) |
| Số lần đã dùng | Có | Số đếm, biên `< max_uses_per_user` (R5) |
| `expired_at` so với hôm nay | Có | Có thứ tự thời gian, biên "trước" (R2) |
| Chênh lệch fixed so với total | Có | Biên khi discount = total (R7, R8) |
| `code`, `user_id`, token | Không | SRS không nêu biên nghiệp vụ |

### 5.2 Bảng giá trị biên
| Biến | Biên | Giá trị |
| :--- | :--- | :--- |
| total (SAVE10, min 300.000) | min | 299.999 / 300.000 / 300.001 |
| total (BIGBUY, min 500.000) | min | 499.999 / 500.000 / 500.001 |
| total (VIP100, min 300.000) | min | 299.999 / 300.000 / 300.001 |
| lượt đã dùng (SAVE10, max 1) | max | đã dùng 1 (= max, phải bị từ chối) |
| lượt đã dùng (VIP100, max 2) | max−1, max | đã dùng 1 (còn được dùng) / đã dùng 2 (phải bị từ chối) |
| `expired_at` | hôm nay | hôm qua / hôm nay / ngày mai |
| fixed so với total | discount = total | 150.000 so với 150.000 (final 0); 200.000 so với 150.000 |

Ghi chú: mức "max+1" (đã dùng 3 lần) không dựng được vì đến lần thứ 3 hệ thống phải từ chối; mức "đã dùng 0" đã nằm ở DT-01..03. Biên của ngày được dựng bằng cách đặt `expired_at` quanh ngày hôm nay (không đổi đồng hồ server).

### 5.3 Test case BVA (17 test)
| ID | Mô tả | Cách dựng & input | Kỳ vọng theo SRS | Mã YC |
| :--- | :--- | :--- | :--- | :--- |
| BV-01 | SAVE10: 299,999 (min-1) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 299999, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| BV-02 | SAVE10: 300,000 (min) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 300000, "user_id": <id A>}` | 200; discount_amount=30.000, final_amount=270.000 | R3,R6 |
| BV-03 | SAVE10: 300,001 (min+1) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 300001, "user_id": <id A>}` | 200; discount_amount = total × 10% (cho lệch làm tròn < 1), final = total − discount | R3,R6 |
| BV-04 | BIGBUY: 499,999 (min-1) | user A (mới); token của A. Body: `{"code": "BIGBUY", "total_amount": 499999, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| BV-05 | BIGBUY: 500,000 (min) | user A (mới); token của A. Body: `{"code": "BIGBUY", "total_amount": 500000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.000 | R3,R7 |
| BV-06 | BIGBUY: 500,001 (min+1) | user A (mới); token của A. Body: `{"code": "BIGBUY", "total_amount": 500001, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.001 | R3,R7 |
| BV-07 | VIP100: 299,999 (min-1) | user A (mới); token của A. Body: `{"code": "VIP100", "total_amount": 299999, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| BV-08 | VIP100: 300,000 (min) | user A (mới); token của A. Body: `{"code": "VIP100", "total_amount": 300000, "user_id": <id A>}` | 200; discount_amount=100.000, final_amount=200.000 | R3,R7 |
| BV-09 | VIP100: 300,001 (min+1) | user A (mới); token của A. Body: `{"code": "VIP100", "total_amount": 300001, "user_id": <id A>}` | 200; discount_amount=100.000, final_amount=200.001 | R3,R7 |
| BV-10 | SAVE10 (tối đa 1): lần 2, đã dùng 1 = max (giả định A: 'dùng' = áp dụng thành công) | user A (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}`; token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R5 |
| BV-11 | VIP100 (tối đa 2): lần 2, đã dùng 1 = max-1 | user A (mới); trước đó A gọi `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}`; token của A. Body: `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}` | 200; discount_amount=100.000, final_amount=300.000 | R5 |
| BV-12 | VIP100 (tối đa 2): lần 3, đã dùng 2 = max | user A (mới); trước đó A gọi `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}`; trước đó A gọi `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}`; token của A. Body: `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R5 |
| BV-13 | expired_at = hôm qua | Admin tạo mã percent 10, min 100.000, expired_at hôm qua; user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R2 |
| BV-14 | expired_at = hôm nay ('phải trước' nên bị từ chối) | Admin tạo mã percent 10, min 100.000, expired_at hôm nay; user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R2 |
| BV-15 | expired_at = ngày mai | Admin tạo mã percent 10, min 100.000, expired_at ngày mai; user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 500000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.000 | R2 |
| BV-16 | fixed 150,000 = tổng 150,000 (final = 0) | Admin tạo mã fixed 150.000, min 100.000, expired_at xa (2099); user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 150000, "user_id": <id A>}` | 200; discount_amount=150.000, final_amount=0 | R7,R8 |
| BV-17 | fixed 200,000 > tổng 150,000 (final âm? CẦN LÀM RÕ) | Admin tạo mã fixed 200.000, min 100.000, expired_at xa (2099); user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 150000, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R7,R8 |

### 5.4 Phân biệt với Domain Testing
| BVA | DT liên quan | Giữ? |
| :--- | :--- | :--- |
| BV-01 | DT-14 (250.000) | Giữ cả hai: DT-14 đại diện lớp, BV-01 kiểm tra toán tử `>=` |
| BV-13 | DT-05 (EXPIRED) | Giữ cả hai: DT-05 dùng mã có sẵn, BV-13 kiểm tra sát biên |
| BV-12 | (không có DT tương ứng) | Giữ |

Mình không bỏ DT như Gemini đề xuất ở Bước 5: DT đại diện cho lớp, BVA kiểm tra toán tử so sánh, hai mục đích khác nhau.
