# FR-09 – Mã giảm giá (Coupon) · AI gap analysis

## Bước 9: AI gap analysis (BẢN NHÁP)

> Log AI nguyên văn: `ai_audit/entries/FR-09/01_...` đến `07_...`

> Đây là bản nháp để bạn đối chiếu với output gốc, kiểm tra từng dòng và viết lại bằng lời của bạn. Các nhận định "nhóm nguyên nhân" là đề xuất, bạn tự quyết định.
> Nguồn AI: Gemini 3.1 Pro, 7 entry `FR-09-01` đến `FR-09-07`, ngày 2026-10-20 (từ 06:35).
> Bản nháp này do Claude hỗ trợ soạn; cần khai báo việc dùng Claude trong audit (ví dụ entry với scope GENERAL).
> Số liệu thực thi chỉ tính 37/51 test đã chạy; các test chưa chạy được ghi rõ.

### 9.1 So sánh bộ test của AI và bộ cuối cùng
| Chỉ số | Số lượng |
| :--- | :-: |
| Test case AI sinh ra | 40 (Bước 4: 20, Bước 5: 9, Bước 6: 7, Bước 7: 4) |
| Trong đó trùng nhau | 1 trong cùng bộ của AI (BL-01 trùng DT-01); ở Bước 5 AI tự chỉ ra 3 cặp trùng lớp (DT-04/BV-09, DT-05/BV-05, DT-10/BV-01) |
| Bộ cuối: AI đã có đủ | 22 / 51 |
| Bộ cuối: AI có một phần | 9 / 51 |
| Bộ cuối: AI bỏ sót | 20 / 51 |
| Ca AI có mà bộ cuối chưa có | 4 (SE-01..SE-04, xem mục 9.5) |
| Phát hiện mới ngoài cả hai bộ | 0 trong 37 test đã chạy (cập nhật sau khi chạy nốt 14 test) |

Lưu ý: "bộ cuối" do mình thiết kế sau khi đọc output của AI, nên so sánh này có thiên lệch về phía bộ AI.

### 9.2 Đối chiếu từng test của bộ cuối
Mức khớp: **Đủ** (có ca tương đương), **Một phần** (có ca nhưng khác kỳ vọng hoặc giá trị), **Thiếu**.

| ID | Nội dung | Mức khớp | Ca của AI | Ghi chú |
| :--- | :--- | :-: | :--- | :--- |
| DT-01 | SAVE10 hợp lệ (percent), tổng 500,000 | Đủ | DT-01, BL-01 | BL-01 có giá trị cụ thể (50.000 / 450.000), DT-01 chỉ ghi "2xx" |
| DT-02 | BIGBUY hợp lệ (fixed), tổng 600,000 | Một phần | BL-02 | AI chỉ dùng VIP100, không dùng BIGBUY |
| DT-03 | VIP100 hợp lệ (fixed), tổng 400,000 | Đủ | BL-02 |  |
| DT-04 | Mã không tồn tại | Đủ | DT-02 |  |
| DT-05 | Mã hết hạn EXPIRED (chỉ vi phạm C2) | Đủ | DT-04 |  |
| DT-06 | Mã rỗng | Một phần | DT-08 | AI để CẦN LÀM RÕ; bộ cuối kỳ vọng 4xx |
| DT-07 | Mã toàn khoảng trắng | Một phần | Bước 3 | Có ở Bước 3 nhưng không có test ở Bước 4 |
| DT-08 | Mã có khoảng trắng hai đầu ' SAVE10 ' (CẦN LÀM RÕ có cắt khoảng trắng không) | Thiếu | — | Khoảng trắng hai đầu |
| DT-09 | Mã sai hoa/thường 'save10' (CẦN LÀM RÕ) | Đủ | DT-09 |  |
| DT-10 | code = null | Thiếu | — | code = null |
| DT-11 | code sai kiểu (số 123) | Thiếu | — | code sai kiểu |
| DT-12 | code chứa SQL injection (SEC-05) | Đủ | DT-06, BL-05 |  |
| DT-13 | code chứa thẻ script (không tồn tại) | Đủ | DT-07, BL-04 |  |
| DT-14 | SAVE10, tổng 250,000 < ngưỡng 300,000 (chỉ vi phạm C3) | Đủ | DT-10 |  |
| DT-15 | SAVE10, tổng = 0 | Một phần | DT-11 | AI để CẦN LÀM RÕ; 0 nhỏ hơn mọi ngưỡng nên C3 đã quyết |
| DT-16 | SAVE10, tổng âm -100,000 | Một phần | DT-12 | Như DT-15 |
| DT-17 | total_amount là chuỗi '500000' (CẦN LÀM RÕ) | Đủ | DT-13 |  |
| DT-18 | total_amount thập phân 500000.5 (CẦN LÀM RÕ) | Thiếu | — | Số thập phân chỉ được nhắc ở Bước 1–2, không có test |
| DT-19 | total_amount = null (CẦN LÀM RÕ) | Thiếu | — | total = null |
| DT-20 | SAVE10, tổng rất lớn 10,000,000,000 (SRS không nêu giới hạn) | Thiếu | — | Giá trị rất lớn |
| DT-21 | token user A, user_id của user B (CẦN LÀM RÕ) | Đủ | DT-14 |  |
| DT-22 | user_id không tồn tại 999999 (CẦN LÀM RÕ) | Đủ | DT-15 |  |
| DT-23 | user_id âm -1 (CẦN LÀM RÕ) | Đủ | DT-16 |  |
| DT-24 | user_id là chuỗi (id của chính mình dạng chuỗi) (CẦN LÀM RÕ) | Đủ | DT-17 |  |
| DT-25 | thiếu user_id (CẦN LÀM RÕ) | Thiếu | — | Thiếu `user_id` |
| AC-01 | Không có token (C4) | Đủ | DT-18 |  |
| AC-02 | Token sai (C4) | Đủ | DT-20 |  |
| BV-01 | SAVE10: 299,999 (min-1) | Đủ | BV-01 |  |
| BV-02 | SAVE10: 300,000 (min) | Đủ | BV-02 |  |
| BV-03 | SAVE10: 300,001 (min+1) | Đủ | BV-03 |  |
| BV-04 | BIGBUY: 499,999 (min-1) | Thiếu | — | AI chỉ làm biên cho SAVE10 |
| BV-05 | BIGBUY: 500,000 (min) | Thiếu | — | Như BV-04 |
| BV-06 | BIGBUY: 500,001 (min+1) | Thiếu | — | Như BV-04 |
| BV-07 | VIP100: 299,999 (min-1) | Thiếu | — | Như BV-04 |
| BV-08 | VIP100: 300,000 (min) | Thiếu | — | Như BV-04 |
| BV-09 | VIP100: 300,001 (min+1) | Thiếu | — | Như BV-04 |
| BV-10 | SAVE10 (tối đa 1): lần 2, đã dùng 1 = max (giả định A: 'dùng' = áp dụng thành công) | Một phần | SE-01 | AI để CẦN LÀM RÕ (có nêu đúng nghi vấn) |
| BV-11 | VIP100 (tối đa 2): lần 2, đã dùng 1 = max-1 | Đủ | BV-04 | Bảng đúng nhưng phần giải thích của AI mâu thuẫn |
| BV-12 | VIP100 (tối đa 2): lần 3, đã dùng 2 = max | Đủ | BV-05, DT-05 |  |
| BV-13 | expired_at = hôm qua | Một phần | BV-09 | AI dùng ngày cố định 2024-12-31, không dựng được |
| BV-14 | expired_at = hôm nay ('phải trước' nên bị từ chối) | Một phần | BV-08 | AI để CẦN LÀM RÕ; SRS ghi "phải trước" nên kỳ vọng từ chối |
| BV-15 | expired_at = ngày mai | Một phần | BV-07 | Như BV-13 |
| BV-16 | fixed 150,000 = tổng 150,000 (final = 0) | Thiếu | — | Biên discount = total |
| BV-17 | fixed 200,000 > tổng 150,000 (final âm? CẦN LÀM RÕ) | Đủ | BL-03 |  |
| BL-01 | Làm tròn: SAVE10 với 333,333 (33,333.3) (CẦN LÀM RÕ cách làm tròn) | Thiếu | — | Làm tròn |
| BL-02 | Hai user độc lập: A dùng SAVE10 rồi, B vẫn dùng được | Thiếu | — | Hai user độc lập |
| BL-03 | Lần áp mã bị từ chối (tổng thấp) không tiêu hao lượt | Thiếu | — | Lần bị từ chối không tiêu hao lượt |
| BL-04 | Dùng SAVE10 không làm mất lượt VIP100 | Thiếu | — | Mã này không làm mất lượt mã khác |
| BL-05 | Vượt lượt bằng user_id người khác: A đã dùng SAVE10, gọi lại với user_id của B | Thiếu | — | AI (DT-14) chỉ hỏi `user_id` khác token, không nghĩ đến vượt lượt |
| BL-06 | A gọi với user_id của B không được tiêu hao lượt của B | Thiếu | — | Như BL-05 |
| BL-07 | Mã có dấu nháy đơn (SEC-05, tham số hóa) | Đủ | BL-05 |  |

### 9.3 Ca và bug AI bỏ sót, và vì sao
| # | Ca / vấn đề bỏ sót | Vì sao AI bỏ sót | Nhóm nguyên nhân (đề xuất) | Bằng chứng |
| :-: | :--- | :--- | :-: | :--- |
| 1 | BV-04..09: biên của BIGBUY và VIP100 (chỉ làm biên SAVE10) | Prompt 5 chỉ nêu "giả sử SAVE10" và không yêu cầu làm cho từng mã; AI lấy một đại diện | Prompt | FR-09-05 |
| 2 | BL-05, BL-06: gọi với `user_id` người khác để vượt hoặc tiêu hao lượt | AI chỉ coi đây là câu hỏi "có đối chiếu không" (DT-14) và để CẦN LÀM RÕ, không nối với C5 | Giới hạn của AI | FR-09-03, 04 |
| 3 | BL-02..04: độc lập giữa user và giữa các mã, lần bị từ chối không tiêu lượt | Prompt 7 hỏi trạng thái khác bị đổi nhưng AI chỉ nhìn các thao tác ghi của quản trị (SE-02..04), không nhìn các lần apply | Độ phức tạp của feature (phụ: Prompt) | FR-09-07 |
| 4 | Tác dụng phụ của apply lên đơn hàng và giỏ hàng | AI không nghĩ đến dữ liệu liên quan ngoài mã giảm giá | Giới hạn của AI | FR-09-07 |
| 5 | DT-08, DT-10, DT-11, DT-18..20, DT-25: khoảng trắng hai đầu, null, sai kiểu `code`, thập phân, rất lớn, thiếu `user_id` | Các lớp "biên của kiểu dữ liệu" không nằm trong checklist; prompt không đưa checklist lớp cho chuỗi và số | Prompt | FR-09-03, 04 |
| 6 | BV-16: biên discount = total | AI chỉ xét BL-03 (fixed lớn hơn), không xét đúng bằng | Giới hạn của AI | FR-09-06 |
| 7 | BL-01: làm tròn khi percent ra số lẻ | AI không xét phép tính ngoài ví dụ tròn | Giới hạn của AI | FR-09-06 |
| 8 | Chấm giá trị trả về của DT-01 | DT-01 chỉ kỳ vọng "2xx và dữ liệu được lưu đúng" (câu mẫu từ prompt của FR khác), không có số tiền; chỉ BL-01 mới có số cụ thể | Prompt | FR-09-04, 06 |

Cả bốn nhóm bug đều có ca tương ứng trong bộ AI nếu chạy: BUG-01 qua BL-01, BUG-02 qua BV-02 (chỉ SAVE10), BUG-03 qua DT-18 và DT-20, và BUG-04 qua SE-01 (nhưng chỉ ở dạng CẦN LÀM RÕ). Bộ AI không bỏ sót các bug này; nó yếu ở độ phủ (biên các mã khác, tác dụng phụ, giả mạo `user_id`) và ở kỳ vọng.

### 9.4 AI sai hoặc bịa (nguyên liệu cho AI Critique)
- **Vi phạm chỉ dẫn "không dùng kiến thức về cài đặt":** Bước 3 dùng mã `INACTIVE10` ("cần admin tạo") với `is_active = 0`, nhưng API quản trị không có trường `is_active` nên không dựng được. Bước 4 (DT-03) giữ ca này, và DT-19 (token hết hạn) cũng không dựng được vì không có khóa ký hay thời hạn token.
- **Ca đòi trạng thái không điều khiển được:** Bước 5 đổi "ngày hiện tại" (2024-12-30, 2024-12-31, 2025-01-01) và dùng "đã dùng 3 lần"; mình không thể đổi đồng hồ server, chỉ đặt `expired_at` quanh ngày hôm nay.
- **Hiểu sai `< max_uses_per_user`:** phần giải thích của Bước 5 viết "tối đa chỉ được dùng 1 lần, lần thứ 2 sẽ lỗi" cho VIP100 (tối đa 2), mâu thuẫn với bảng của chính nó (BV-04 đã dùng 1 lần được 2xx).
- **Đề xuất sai về loại test:** Bước 5 đề nghị bỏ DT-04, DT-05, DT-10 để chỉ giữ BVA. Hai kỹ thuật có mục đích khác nhau (đại diện lớp và kiểm tra toán tử), nên bỏ là mất độ phủ.
- **Quá thận trọng:** DT-11, DT-12 (tổng bằng 0, tổng âm) để CẦN LÀM RÕ dù C3 đã quyết định: mọi ngưỡng trong dữ liệu mẫu đều lớn hơn 0.
- **Dùng sai nguồn yêu cầu:** BL-04 kỳ vọng response JSON phải encode HTML (gắn SEC-04), trong khi SEC-04 nói về việc hiển thị trên UI. AC-02 và SE-02..04 kiểm tra API quản trị, ngoài phạm vi FR-09.
- **Kỳ vọng chung chung từ prompt mẫu:** nhiều ca ghi "2xx và dữ liệu được lưu đúng" trong khi apply-coupon chỉ tính toán và không lưu gì; không có số tiền cụ thể để chấm.
- **Trùng lặp:** BL-01 trùng DT-01 và BL-02 là một lớp hợp lệ khác chỉ với giá trị khác.
- **Lỗi của chính mình khi ghi log (không phải của AI):** prompt Bước 1 còn `{FR_09}`, prompt Bước 5 còn TODO biến thể BVA, tiêu đề file Bước 2 ghi nhầm "chia lớp tương đương", chat/commit của Bước 5 và 6 còn TODO.

### 9.5 Ca của AI mà bộ cuối chưa có
| Ca của AI | Kết quả | Đánh giá |
| :--- | :--- | :--- |
| SE-01: gọi apply lần 2 để xem lượt dùng tăng | Tương đương BV-10: lần 2 vẫn 200 | AI nêu đúng nghi vấn nhưng để CẦN LÀM RÕ; bộ cuối dùng giả định A và mở BUG-04 (Draft) |
| SE-02: admin tạo mã không có `is_active`, user áp dụng ngay | Chưa chạy trực tiếp; BV-13..16 tạo mã bằng admin và áp dụng được thì gián tiếp chứng minh | Không cần thêm test riêng |
| SE-03: admin tạo trùng mã | Không thực hiện | Ngoài FR-09 (quản trị mã giảm giá) |
| SE-04: admin xóa mã rồi apply | Không thực hiện | Ngoài FR-09, nhưng có thể thêm nếu giảng viên coi là liên quan C1 |
| AC-01 (Admin gọi apply-coupon) | Không thực hiện | SRS không cấm, không có kỳ vọng |

### 9.6 Phát hiện mới
Trong 37 test đã chạy không có phát hiện nào nằm ngoài cả hai bộ. Cần cập nhật sau khi chạy nốt 14 test còn lại (BV-11..17, BL-01..07).

### 9.7 Kết luận (nháp)
- AI làm tốt: phân lớp cho `code`, `total_amount`, `user_id`, token; biên của SAVE10; nêu đúng các điểm SRS mơ hồ (hoa/thường, `<` hay `<=`, `user_id` khác token, final âm); và nghi vấn lượt dùng ở SE-01.
- AI yếu: chỉ làm biên cho một mã; đề xuất ca không dựng được (mã `is_active = 0`, đổi ngày hệ thống, token hết hạn); hiểu nhầm giải thích `<` ở Bước 5; kỳ vọng sao chép "dữ liệu được lưu đúng"; kiểm tra tác dụng phụ chỉ ở API quản trị; chưa nối `user_id` giả mạo với giới hạn lượt dùng.
- Điều chỉnh prompt lần sau: nêu rõ "chỉ dùng trạng thái dựng được bằng API đã liệt kê"; yêu cầu BVA cho từng mã, không chọn đại diện; yêu cầu mỗi test ghi giá trị số tiền kỳ vọng cụ thể; cho checklist lớp cho chuỗi và số; hỏi riêng "một lần gọi bị từ chối có làm đổi trạng thái của user khác hoặc của mã khác không".
- TODO: viết lại phần kết luận bằng lời của bạn.
