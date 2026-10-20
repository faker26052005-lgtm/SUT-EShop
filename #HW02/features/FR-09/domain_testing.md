# FR-09 – Mã giảm giá (Coupon) · Domain Testing

> File này gộp Bước 1, 2, 3–4 và 6. Bước 5 (BVA) nằm ở `bva.md`; Bước 7, 8, 10 ở `results.md`; Bước 9 ở `ai_gap_analysis.md`.

## Bước 1: Trích yêu cầu

> Log AI nguyên văn: `ai_audit/entries/FR-09/01_...`
> Nguồn: SRS mục FR-09, SEC-02, SEC-04, SEC-05; `api_specification.md` mục 5.1 (dựng dữ liệu: 1.1, 1.2, 6.4).

### 1.1 Trích nguyên văn từ SRS
**FR-09: Mã Giảm Giá (Coupon).** Áp dụng khi cả 5 điều kiện cùng thỏa: C1 mã tồn tại và `is_active = 1`; C2 ngày hiện tại **trước** `expired_at`; C3 tổng đơn **>=** `min_order_amount`; C4 có JWT hợp lệ; C5 số lần đã dùng **<** `max_uses_per_user`.
Công thức: percent → `discount_amount = total × discount_value / 100`; fixed → `discount_amount = discount_value`; `final_amount = total − discount_amount`.

| Mã | Loại | Giá trị | Ngưỡng tối thiểu | Hạn | Số lần/người |
| :--- | :--- | :--- | :--- | :--- | :--- |
| SAVE10 | percent | 10% | 300.000 | 2099-12-31 | 1 |
| BIGBUY | fixed | 50.000 | 500.000 | 2099-12-31 | 1 |
| VIP100 | fixed | 100.000 | 300.000 | 2099-12-31 | 2 |
| EXPIRED | percent | 20% | 100.000 | 2020-01-01 | 1 |

| Mã | Nội dung |
| :--- | :--- |
| SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ. |
| SEC-04 | Dữ liệu user nhập khi hiển thị trên UI phải được escape, không dùng `innerHTML` trực tiếp. |
| SEC-05 | Truy vấn CSDL phải dùng Parameterized Query. |

### 1.2 Bảng yêu cầu
| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Mã phải tồn tại và đang hoạt động | C1 | Nghiệp vụ |
| R2 | Ngày hiện tại phải trước `expired_at` | C2 | Nghiệp vụ |
| R3 | `total_amount >= min_order_amount` | C3 | Nghiệp vụ |
| R4 | Phải có JWT hợp lệ | C4, SEC-02 | Truy cập |
| R5 | Số lần đã dùng < `max_uses_per_user` | C5 | Nghiệp vụ |
| R6 | percent: discount = total × value / 100 | Công thức | Nghiệp vụ |
| R7 | fixed: discount = value | Công thức | Nghiệp vụ |
| R8 | final = total − discount | Công thức | Nghiệp vụ |
| R9 | Body gồm `code` (string), `total_amount` (number), `user_id` (number) | API 5.1 | Input |
| R10 | Dữ liệu người dùng nhập không được thực thi khi hiển thị | SEC-04 | Bảo mật |
| R11 | Truy vấn dùng Parameterized Query | SEC-05 | Bảo mật |

### 1.3 Endpoint liên quan
| Method | Đường dẫn | Token | Body |
| :--- | :--- | :--- | :--- |
| POST | `/api/apply-coupon` | Có | `code`, `total_amount`, `user_id` |
| POST | `/api/register`, `/api/login` | Không | dựng user và token |
| POST | `/api/admin/coupons` | Admin | dựng mã tùy ý |

### 1.4 Giả định và chỗ SRS im lặng
| # | Điểm CẦN LÀM RÕ | Cách xử lý trong test |
| :--- | :--- | :--- |
| A | "Đã dùng mã" tính khi nào (apply thành công hay khi đặt hàng)? | **Giả định A**: mỗi lần apply-coupon thành công là 1 lượt. Ghi vào Phụ lục A. |
| B | Mã lỗi và cấu trúc JSON khi vi phạm C1–C5 | Chỉ kỳ vọng 4xx và không có `discount_amount`. |
| C | `fixed` lớn hơn total: final = 0 hay âm, có cho áp không | BV-17 CẦN LÀM RÕ |
| D | `code` có phân biệt hoa/thường, có cắt khoảng trắng | DT-08, DT-09 CẦN LÀM RÕ |
| E | `user_id` trong body khác user trong token | DT-21..25 CẦN LÀM RÕ; ảnh hưởng lên lượt dùng xem BL-05, BL-06 |
| F | `total_amount` kiểu chuỗi / thập phân / null / quá lớn | DT-17..20 |
| G | Cách làm tròn khi percent ra số lẻ | BL-01, BV-03 cho lệch < 1 |
| H | So ngày hết hạn theo giờ VN hay UTC | Chạy BV-13..15 trong 07:00–23:59 giờ VN |
| I | Apply có tạo đơn / đổi giỏ hàng không (API chỉ nói "tính toán") | Kiểm tra tác dụng phụ ở mọi test |

## Bước 2: Xác định biến

### 2.1 Biến đầu vào
| Biến | Vị trí | Kiểu | Ràng buộc SRS | SRS im lặng | BVA |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `code` | body | string | tồn tại, active, còn hạn | rỗng, khoảng trắng, hoa/thường, độ dài, null, kiểu | Không (không có biên số) |
| `total_amount` | body | number | `>= min_order_amount` | 0, âm, thập phân, chuỗi, null, quá lớn | Có |
| `user_id` | body | number | dùng để đếm lượt | khác token, không tồn tại, âm, chuỗi, thiếu | Không (định danh) |
| `Authorization` | header | Bearer | JWT hợp lệ | sai, thiếu | Không |

### 2.2 Biến trạng thái / điều kiện ẩn
| Trạng thái | Cách dựng |
| :--- | :--- |
| User + token (A, B) | register → login; mỗi test dùng user mới để lượt dùng độc lập |
| Mã giảm giá tùy ý (hạn, fixed lớn...) | Admin `POST /api/admin/coupons` |
| Lượt đã dùng | Gọi apply-coupon thành công trước (giả định A) |
| Ngày hết hạn | Đặt `expired_at` = hôm qua / hôm nay / ngày mai, không chỉnh đồng hồ server |

### 2.3 Đầu ra cần quan sát
HTTP status; JSON (`discount_amount`, `final_amount`); không có `discount_amount` khi bị từ chối; không tạo đơn / đổi giỏ hàng (so `GET /api/orders/my-orders` và `GET /api/cart` trước và sau).

### 2.4 Nguyên tắc
Test không dựng được bằng API (user dùng 3 lần, đổi đồng hồ server, `is_active = 0`, token hết hạn) không đưa vào bộ test; ghi ở mục 3.4.

## Bước 3–4: Chia lớp tương đương và test case Domain Testing

### 3.1 Lớp tương đương
| Biến | Lớp hợp lệ | Lớp không hợp lệ |
| :--- | :--- | :--- |
| `code` | mã tồn tại, active, còn hạn (percent / fixed) | không tồn tại; hết hạn; rỗng; khoảng trắng; null; sai kiểu; payload SQL/HTML |
| `total_amount` | >= min của mã | < min; 0; âm (0 và âm đều nhỏ hơn mọi min trong dữ liệu mẫu nên vi phạm C3) |
| `total_amount` (SRS im lặng) | | chuỗi; thập phân; null; rất lớn (CẦN LÀM RÕ) |
| `user_id` | id của chính user trong token | (CẦN LÀM RÕ) của người khác; không tồn tại; âm; chuỗi; thiếu |
| Token | JWT hợp lệ | thiếu; sai |

### 3.2 Test case Domain Testing (25 test)
| ID | Mô tả | Cách dựng & input | Kỳ vọng theo SRS | Mã YC |
| :--- | :--- | :--- | :--- | :--- |
| DT-01 | SAVE10 hợp lệ (percent), tổng 500,000 | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.000 | R6,R8 |
| DT-02 | BIGBUY hợp lệ (fixed), tổng 600,000 | user A (mới); token của A. Body: `{"code": "BIGBUY", "total_amount": 600000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=550.000 | R7,R8 |
| DT-03 | VIP100 hợp lệ (fixed), tổng 400,000 | user A (mới); token của A. Body: `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}` | 200; discount_amount=100.000, final_amount=300.000 | R7,R8 |
| DT-04 | Mã không tồn tại | user A (mới); token của A. Body: `{"code": "NOTEXIST", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R1 |
| DT-05 | Mã hết hạn EXPIRED (chỉ vi phạm C2) | user A (mới); token của A. Body: `{"code": "EXPIRED", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R2 |
| DT-06 | Mã rỗng | user A (mới); token của A. Body: `{"code": "", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R9 |
| DT-07 | Mã toàn khoảng trắng | user A (mới); token của A. Body: `{"code": "   ", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R9 |
| DT-08 | Mã có khoảng trắng hai đầu ' SAVE10 ' (CẦN LÀM RÕ có cắt khoảng trắng không) | user A (mới); token của A. Body: `{"code": " SAVE10 ", "total_amount": 500000, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-09 | Mã sai hoa/thường 'save10' (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "save10", "total_amount": 500000, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R1 |
| DT-10 | code = null | user A (mới); token của A. Body: `{"code": null, "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R9 |
| DT-11 | code sai kiểu (số 123) | user A (mới); token của A. Body: `{"code": 123, "total_amount": 500000, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-12 | code chứa SQL injection (SEC-05) | user A (mới); token của A. Body: `{"code": "' OR '1'='1", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R11 |
| DT-13 | code chứa thẻ script (không tồn tại) | user A (mới); token của A. Body: `{"code": "<script>alert(1)</script>", "total_amount": 500000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R10,R11 |
| DT-14 | SAVE10, tổng 250,000 < ngưỡng 300,000 (chỉ vi phạm C3) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 250000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| DT-15 | SAVE10, tổng = 0 | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 0, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| DT-16 | SAVE10, tổng âm -100,000 | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": -100000, "user_id": <id A>}` | 4xx, không có `discount_amount` | R3 |
| DT-17 | total_amount là chuỗi '500000' (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": "500000", "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-18 | total_amount thập phân 500000.5 (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000.5, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-19 | total_amount = null (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": null, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-20 | SAVE10, tổng rất lớn 10,000,000,000 (SRS không nêu giới hạn) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 10000000000, "user_id": <id A>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R6 |
| DT-21 | token user A, user_id của user B (CẦN LÀM RÕ) | user A (mới), user B (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id B>}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R4,R5 |
| DT-22 | user_id không tồn tại 999999 (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": 999999}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-23 | user_id âm -1 (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": -1}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-24 | user_id là chuỗi (id của chính mình dạng chuỗi) (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": "<id A dạng chuỗi>"}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |
| DT-25 | thiếu user_id (CẦN LÀM RÕ) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 500000}` | **CẦN LÀM RÕ** (SRS không nêu kỳ vọng; ghi lại hành vi thực tế) | R9 |

### 3.3 Kết hợp nhiều biến
Mỗi test chỉ vi phạm **một** điều kiện, các biến còn lại hợp lệ (ví dụ DT-05 chỉ vi phạm C2, DT-14 chỉ vi phạm C3) để khi FAIL biết ngay nguyên nhân.

### 3.4 Lớp đã cân nhắc nhưng không đưa vào
- `is_active = 0`: API quản trị không có trường `is_active` (chỉ thêm mã và xóa mã) nên không dựng được.
- User đã dùng 3+ lần, đổi giờ hệ thống, token hết hạn: không dựng được qua API.
- Admin tạo trùng mã / xóa mã / user thường gọi API quản trị: thuộc chức năng quản trị mã giảm giá, không phải FR-09.

## Bước 6: Nghiệp vụ, bảo mật, truy cập

> Log AI nguyên văn: `ai_audit/entries/FR-09/06_...`

### 6.1 Test case
| ID | Mô tả | Cách dựng & input | Kỳ vọng theo SRS | Mã YC |
| :--- | :--- | :--- | :--- | :--- |
| BL-01 | Làm tròn: SAVE10 với 333,333 (33,333.3) (CẦN LÀM RÕ cách làm tròn) | user A (mới); token của A. Body: `{"code": "SAVE10", "total_amount": 333333, "user_id": <id A>}` | 200; discount_amount = total × 10% (cho lệch làm tròn < 1), final = total − discount | R6 |
| BL-02 | Hai user độc lập: A dùng SAVE10 rồi, B vẫn dùng được | user A (mới), user B (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}`; token của B. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id B>}` | 200; discount_amount=50.000, final_amount=450.000 | R5 |
| BL-03 | Lần áp mã bị từ chối (tổng thấp) không tiêu hao lượt | user A (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 100000, "user_id": <id A>}`; token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.000 | R5 |
| BL-04 | Dùng SAVE10 không làm mất lượt VIP100 | user A (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}`; token của A. Body: `{"code": "VIP100", "total_amount": 400000, "user_id": <id A>}` | 200; discount_amount=100.000, final_amount=300.000 | R5 |
| BL-05 | Vượt lượt bằng user_id người khác: A đã dùng SAVE10, gọi lại với user_id của B | user A (mới), user B (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}`; token của A. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id B>}` | 4xx, không có `discount_amount` | R5,R4 |
| BL-06 | A gọi với user_id của B không được tiêu hao lượt của B | user A (mới), user B (mới); trước đó A gọi `{"code": "SAVE10", "total_amount": 500000, "user_id": <id B>}`; token của B. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id B>}` | 200; discount_amount=50.000, final_amount=450.000 | R5,R4 |
| BL-07 | Mã có dấu nháy đơn (SEC-05, tham số hóa) | Admin tạo mã percent 10, min 0, expired_at xa (2099), mã chứa dấu nháy đơn; user A (mới); token của A. Body: `{"code": "<mã tạo bằng admin>", "total_amount": 500000, "user_id": <id A>}` | 200; discount_amount=50.000, final_amount=450.000 | R11 |
| AC-01 | Không có token (C4) | user A (mới); không gửi token. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}` | 401 hoặc 403, không có `discount_amount` | R4 |
| AC-02 | Token sai (C4) | user A (mới); token sai. Body: `{"code": "SAVE10", "total_amount": 500000, "user_id": <id A>}` | 401 hoặc 403, không có `discount_amount` | R4 |

### 6.2 Kiểm tra tác dụng phụ (áp dụng cho mọi test)
Sau mỗi lần gọi, so sánh `GET /api/orders/my-orders` và `GET /api/cart` với trước đó; apply-coupon chỉ "tính toán", không được tạo đơn hay đổi giỏ hàng. Collection ghi thành assertion `[SIDE-EFFECT]` riêng cho mỗi test.

### 6.3 Ca của AI bị loại hoặc điều chỉnh
| Ca của Gemini | Xử lý | Lý do |
| :--- | :--- | :--- |
| BL-01, BL-02 (công thức) | Gộp vào DT-01..03 | Trùng test hợp lệ |
| BL-04 (XSS ở response) | Chuyển thành DT-13 | Chỉ quan sát được ở mức API; SEC-04 (escape khi hiển thị) cần test UI, thuộc dự án UI riêng |
| AC-01 (Admin gọi apply-coupon) | Bỏ | SRS không cấm, không có kỳ vọng |
| AC-02 (User gọi API quản trị) | Chuyển sang request B5, ghi riêng | Thuộc chức năng quản trị, không tính vào FR-09 |
| User dùng 3 lần, đổi ngày hiện tại | Bỏ | Không dựng được |
