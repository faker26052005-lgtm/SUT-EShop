# FR-08 – Thanh toán (Checkout) · AI gap analysis

## Bước 9: AI gap analysis

### 9.1 So sánh bộ test của AI và bộ cuối

| Chỉ số | Số lượng / Nhận xét |
| :--- | :-: |
| Test case AI sinh ra | 64 (Bước 4: 30, Bước 5: 18, Bước 6: 11, Bước 7: 5) |
| Bộ cuối (đã chạy) | 41 (29 DT, 3 BV, 5 AC, 4 BL) |
| Ca AI có mà bộ cuối không chạy | 23 (DT-30; 15 ca BV; BL-04, 05, 06, 07, 08, 10, 11) |
| Trùng nhau trong AI (AI tự nhận ở Bước 5) | 4 cặp: BV-02/DT-08, BV-04/DT-15, BV-10/DT-21, BV-12/DT-19 |
| Trùng AI không tự phát hiện | DT-01 = DT-07 = DT-12 = DT-28 (cùng body checkout hợp lệ); DT-02 = AC-01; DT-19 = DT-24 (cùng body); AC-05 gộp DT-04 và DT-05 |
| Trùng còn lại trong bộ cuối | DT-01/07/12/28 và DT-02/AC-01 |
| Bộ cuối: AI đã có đủ | 38 / 41 |
| Bộ cuối: AI có một phần | 3 / 41 (DT-01, DT-24, BL-01) |
| Bộ cuối: AI bỏ sót | 0 / 41 |
| Ca AI có mà bộ cuối chưa chạy (đáng cân nhắc) | 3 (BL-04, BL-06, BL-07; xem 9.5) |
| Điểm cần kiểm chứng ngoài cả hai bộ | 1 (xem 9.6) |

Lưu ý: cả 41 ca của bộ cuối đều bắt nguồn từ ca AI sinh ra, nên bộ cuối là tập con đã chỉnh sửa của bộ AI và không phải chuẩn độc lập. Số "AI bỏ sót = 0" chỉ cho biết người test không thêm ca mới, không chứng minh AI đã phủ đủ.

Xử lý của người test:
- Giữ DT-08, DT-15, DT-21, ngược với đề xuất của AI ở Bước 5 (giữ BV-02, BV-04, BV-10). Các ca DT-10, 15, 18, 21, 23, 26 được gắn nhãn BV tương ứng.
- Loại hoặc gộp 15 ca BV, gồm các ca dựa trên biên tự giả định 255 và 999 (trừ BV-08).
- Loại DT-30 và BL-11, chuyển thành câu hỏi Phụ lục A #13 và #14.
- Đổi setup BL-01 thành 2 × 150k = 300k; đổi DT-24 sang `quantity = 1` để không trùng DT-19.
- Chuyển các mục CẦN LÀM RÕ của Bước 1 thành "giả định tạm" (mục 1.4) kèm 14 câu hỏi Phụ lục A. Cả 14 câu đều truy được về ca AI đánh dấu CẦN LÀM RÕ.

### 9.2 Đối chiếu từng test của bộ cuối

Mức khớp: **Đủ** (AI có ca tương đương, kỳ vọng khớp), **Một phần** (AI có ca nhưng khác giá trị, setup hoặc quan sát), **Thiếu** (AI không có).

| Test bộ cuối | Ca tương ứng của AI | Mức khớp | Kết quả / Ghi chú |
| :--- | :--- | :-: | :--- |
| DT-01 | DT-01, BL-02 | Một phần | AI chỉ kỳ vọng 2xx. Việc kiểm giỏ sau checkout (nguồn của FAIL, BUG-03) do bộ cuối thêm vào; AI chỉ có ở BL-02. |
| DT-02 | DT-02, AC-01 | Đủ | PASS 401. Trùng AC-01. |
| DT-03 | DT-03 | Đủ | PASS 403. |
| DT-04, DT-05 | DT-04, DT-05 | Đủ | PASS 403. Input là chuỗi giả, xem 9.3 #3. |
| DT-06 | DT-06 | Đủ | CẦN LÀM RÕ (403). |
| DT-07 | DT-07 | Đủ | PASS. Cùng body với DT-01, 12, 28. |
| DT-08 | DT-08, BV-02 | Đủ | PASS, DB lưu 200000. AI tự mâu thuẫn: DT-08 kỳ vọng 2xx còn BV-02 (cùng input `0`) là CẦN LÀM RÕ. |
| DT-09 | DT-09 | Đủ | FAIL vì kỳ vọng 4xx suy diễn (9.4). |
| DT-10, DT-11 | DT-10, DT-11, BV-01 | Đủ | CẦN LÀM RÕ, trả 200. |
| BV-03 | BV-03 | Đủ | PASS. |
| DT-12 | DT-12 | Đủ | PASS. Trùng input DT-01. |
| DT-13 | DT-13 (và BL-06) | Đủ | PASS ở mức API. Phần hiển thị UI (SEC-04) thuộc BL-06, bộ cuối không chạy. |
| DT-14 | DT-14 | Đủ | FAIL vì kỳ vọng 4xx suy diễn. |
| DT-15, DT-16, DT-17 | DT-15, DT-16, DT-17 | Đủ | CẦN LÀM RÕ, trả 200. |
| BV-05 | BV-05 | Đủ | PASS. |
| BV-08 | BV-08 | Đủ | CẦN LÀM RÕ. Dựa trên biên 255 AI tự giả định. |
| DT-18 | DT-18, BV-09 | Đủ | CẦN LÀM RÕ. Nhãn BV-09 nhưng input là 1000 ký tự, không phải 256. |
| DT-19 | DT-19 | Đủ | PASS. |
| DT-20 | DT-20 | Đủ | FAIL vì kỳ vọng 4xx suy diễn. |
| DT-21, DT-22, DT-23 | DT-21, DT-22, DT-23 (BV-10, BV-15) | Đủ | CẦN LÀM RÕ. |
| DT-24 | DT-24 | Một phần | Body của AI trùng DT-19 (`quantity = 2`); bộ cuối đổi thành 1. PASS. |
| DT-25 | DT-25 | Đủ | FAIL vì kỳ vọng 4xx suy diễn. |
| DT-26, DT-27 | DT-26, DT-27 (BV-16) | Đủ | CẦN LÀM RÕ. |
| DT-28 | DT-28 | Đủ | PASS. Trùng input DT-01. |
| DT-29 | DT-29 | Đủ | CẦN LÀM RÕ, trả 200 (đơn 0đ). |
| AC-01 → AC-04 | AC-01 → AC-04 | Đủ | PASS 401. |
| AC-05 | AC-05 | Đủ | PASS 403. Ca gộp "hỏng hoặc hết hạn". |
| BL-01 | BL-01 | Một phần | FAIL, nhưng giỏ đã tích dồn nên kết quả bị nhiễu (9.3 #2). Setup đổi 200k → 300k. |
| BL-02 | BL-02 | Đủ | FAIL (BUG-03), giỏ còn 45 món. |
| BL-03 | BL-03 | Đủ | PASS, giỏ giữ nguyên. |
| BL-05 | BL-09 | Đủ | PASS, `rò rỉ = false`. |

### 9.3 Ca và vấn đề AI xử lý yếu hoặc bỏ sót, và vì sao

| # | Vấn đề | Vì sao AI yếu / bỏ sót | Nhóm nguyên nhân | Bằng chứng |
| :-: | :--- | :--- | :-: | :--- |
| 1 | Yêu cầu R4 bị diễn giải lại. SRS ghi "không chấp nhận giá trị `total_amount` do client gửi lên"; Bước 1 viết thành "bỏ qua". Hai cách hiểu (bỏ qua hoặc từ chối) không được đưa vào CẦN LÀM RÕ. | Hệ quả: 6 ca của cùng biến `total_amount` có 3 kiểu kỳ vọng: 2xx (DT-08, BL-01, BV-03), 4xx (DT-09) và CẦN LÀM RÕ (DT-10, DT-11, BV-01, BV-02). | Giới hạn của AI (phụ: Prompt không yêu cầu trích nguyên văn) | FR-08-01, 03, 04, 05; Phụ lục A #9, #10 chưa hỏi |
| 2 | Trạng thái giỏ hàng không được cô lập giữa các test. | Prompt Bước 2 chỉ hỏi "cách dựng", AI không đặt bước đưa giỏ về trạng thái ban đầu. Sau BUG-03 giỏ tích dồn (23 → 45 → 46 món) nên tổng tiền kỳ vọng của BL-01 (300k) không còn đúng. | Độ phức tạp của feature (phụ: Prompt) | `results.md`: DT-01, BL-02, BL-03; ghi chú BL-01 |
| 3 | Các lớp token lỗi chỉ dùng chuỗi giả. | `invalid_sig`, `expired_token`, `revoked_token` không phải JWT thật nên đều bị từ chối cùng một kiểu (403). PASS ở DT-05 không chứng minh token hết hạn bị chặn; CLARIFY ở DT-06 vô nghĩa. | Độ phức tạp của feature (không có API logout/khóa tài khoản) | FR-08-03, 04; DT-03 → DT-06 và AC-05 đều 403 |
| 4 | `price` do client gửi trong `POST /api/cart`. | Mọi ca `price` chỉ xét kiểu, 0 và âm. Không có ca nào xét việc "tính lại tổng từ giỏ" vẫn dựa trên giá client cung cấp (đặt `price` thấp rồi checkout). SRS không nói giá lấy từ đâu. | Giới hạn của AI | FR-08-01 (API 4.2), FR-08-04. **Chưa chạy**, chỉ là đề xuất |
| 5 | Side-effect của đơn hàng xuất hiện muộn. | AI có BL-02, BL-03 (giỏ) từ Bước 6, nhưng chi tiết đơn, trường tự sinh, bất biến dữ liệu chỉ xuất hiện khi prompt Bước 7 yêu cầu rà side-effect (BL-07 → BL-10). | Prompt | FR-08-06, 07 |

### 9.4 AI sai hoặc bịa

- **Đổi nghĩa SRS:** R4 "không chấp nhận" thành "bỏ qua" (FR-08-01), rồi coi đó là sự thật ở các bước sau, kể cả ghi chú Bước 3 "backend tự tính lại và bỏ qua giá trị client". Người test cũng nhận lại cách hiểu này ở Phụ lục A, nhưng chưa hỏi giảng viên.
- **Kỳ vọng suy diễn:** DT-09, DT-14, DT-20, DT-25 kỳ vọng 4xx cho sai kiểu dữ liệu dù SRS không nêu ràng buộc kiểu. Cả 4 ca đều FAIL; chúng chiếm 4/7 FAIL, nên số FAIL phụ thuộc vào kỳ vọng AI tự đặt. DT-09 còn mâu thuẫn với R4 theo cách AI hiểu (nếu giá trị bị bỏ qua thì chuỗi cũng phải bị bỏ qua).
- **Mâu thuẫn giữa các bước:** DT-08 (2xx) và BV-02 (CẦN LÀM RÕ) cùng input `total_amount = 0`. Đề xuất "giữ BV-02, loại DT-08" ở Bước 5 sẽ làm mất kỳ vọng 2xx.
- **Bịa giới hạn:** `shipping_address` max 255, `quantity` max 999, `price` min 1, tự ghi là "giả định chuẩn hệ thống" (FR-08-05). Sinh BV-07 → BV-09, BV-13 → BV-15; BV-08 vẫn còn trong bộ cuối.
- **Khẳng định về cài đặt, bị kết quả bác bỏ:** AI viết các lớp sai kiểu "bị chặn tại tầng API Schema Validator" (C2.3, C3.3, C4.2, C5.2 ở FR-08-03). Thực tế SUT không có validation này (DT-09, 14, 20, 25 đều trả 200).
- **Dùng kiến thức hệ thống ngoài SRS:** dựng trạng thái bằng cách sửa DB (DT-30, BL-10, BL-11, "Admin đổi giá trong DB"); Bước 2 ghi "cập nhật lại giá/kho ở DB".
- **Bịa trường và kỳ vọng:** BL-08 dùng `order_id`, `created_at`, `status` không có trong SRS hay API (response thực tế trả `orderId`). BL-10 đưa kỳ vọng "giữ giá 100k" từ yêu cầu SRS không có, nặng hơn BL-11 (đã ghi CẦN LÀM RÕ). Ngoài ra `price` do client gửi nên "Admin đổi giá" gần như không có nghĩa với API này.
- **Ca không dựng được black-box:** DT-05, DT-06 (token hết hạn, bị khóa), DT-30, BL-10, BL-11.
- **Vi phạm quy tắc "mỗi test một điều kiện":** AC-05 ("không hợp lệ hoặc hết hạn"); C2.2 ("`0` hoặc `999999`").
- **Tuyên bố quá mức:** Bước 5 kết luận loại ca trùng "vẫn giữ nguyên coverage 100%" trong khi bảng biên dựa trên giới hạn tự bịa và AI bỏ sót nhóm trùng ở 9.1.

### 9.5 Ca của AI mà bộ cuối chưa chạy

| Ca của AI | Lý do bỏ (suy ra) | Đánh giá | Đề xuất |
| :--- | :--- | :--- | :--- |
| BL-07 (đơn mới chứa đủ SP từ giỏ) | Không rõ | Khả thi black-box qua `GET /api/orders/my-orders`. BUG-06 đang không có ca nào chạy | **Không chạy** Nếu API doc không nêu nội dung đơn thì ghi kỳ vọng CẦN LÀM RÕ |
| BL-06 (XSS hiển thị UI) | Không chạy được bằng Postman | DT-13 chỉ chứng minh API lưu chuỗi. BUG-08 (SEC-04) phụ thuộc kiểm tra UI | **Chạy thủ công trên UI trong UI testing**, có ảnh chụp |
| BL-04 (UI hiển thị danh sách SP), BL-05 của AI (ô `total_amount` disabled) | Không chạy được bằng Postman | BL-04 vẫn nằm trong `domain_testing.md` nhưng không có kết quả | **Không chạy** |
| BL-08 (trường tự sinh) | Bịa trường | Bỏ đúng | Không cần |
| BL-10, BL-11, DT-30 | Cần DB, ngoài SRS | Bỏ đúng | Giữ ở Phụ lục A #13, #14 |
| BV-07, 13, 14 (BV-09, 15 gộp vào DT) | Biên tự giả định | Bỏ đúng. BV-08 còn lại nên ghi rõ là khảo sát, hoặc gộp vào DT-18 | |
| BV-06, 11, 12, 17, 18 | In-point cùng lớp hợp lệ | Bỏ hợp lý | |
| BV-01, 02, 04, 10, 16 | Trùng input với DT | Gộp hợp lý | |

### 9.6 Đối chiếu bug với bằng chứng và điểm cần kiểm chứng

Bảng dưới đối chiếu danh sách bug (Bước 8) với kết quả Folder A. Bằng chứng của Folder B (Bug Reproduction) không có trong các file này.

| Bug | Ca liên quan | Kết quả trong Folder A | Nhận xét |
| :--- | :--- | :--- | :--- |
| BUG-01 (Critical): checkout khi chưa đăng nhập / token sai | AC-01, DT-04 | **PASS** (401, 403) | Kết quả ngược với mô tả bug. Cần bằng chứng Folder B, nếu không thì bỏ. |
| BUG-02 (High): tin `total_amount` của client | DT-07, BL-01 | BL-01 FAIL: client gửi 1, DB lưu **200000** (không phải 1) | Dữ liệu không cho thấy backend tin client; cái sai là tổng lưu ≠ 300k, và kết quả bị nhiễu do giỏ tích dồn. Ngoài ra ID BUG-02 còn được gắn cho DT-09, 20, 25 (thiếu validate kiểu), là vấn đề khác. |
| BUG-03 (Critical): giỏ không xóa sau checkout | DT-01, BL-02 | **FAIL** (giỏ còn 23, 45 món) | Bằng chứng vững. AI đã sinh BL-02 từ Bước 6. Hai ca FAIL cùng một bug. |
| BUG-04 (High): checkout giỏ rỗng | DT-29 | CẦN LÀM RÕ (200, đơn 0đ) | Phụ thuộc giả định "giỏ rỗng không được phép" (Phụ lục A #1, chưa hỏi). Verdict CLARIFY nhưng bug đặt High. |
| BUG-05 (High): địa chỉ rỗng/null/sai kiểu | DT-14 → DT-17 | DT-14 FAIL (kỳ vọng suy diễn); DT-15, 16, 17 CẦN LÀM RÕ | Mô tả bug chỉ nói rỗng/null nhưng bảng gắn thêm DT-14 (sai kiểu). Phụ thuộc giả định "địa chỉ bắt buộc" (Phụ lục A #2 → #4). |
| BUG-06 (Medium): chi tiết đơn thiếu SP | BL-01 | Không có ca nào kiểm chi tiết đơn | BL-07 (ca đúng mục đích) đã bị loại. Chưa có bằng chứng. |
| BUG-07 (Critical): rò rỉ đơn giữa tài khoản | BL-05 | **PASS**, `rò rỉ = false` | Kết quả ngược với mô tả bug. |
| BUG-08 (Medium): XSS không escape | DT-13 | PASS ở mức API | Cần kiểm tra UI (BL-06) mới kết luận được SEC-04. |

Kết luận phần này: trong Folder A chỉ BUG-03 có bằng chứng đầy đủ; BUG-02 có bằng chứng một phần; BUG-01 và BUG-07 bị kết quả phủ nhận; BUG-06 và BUG-08 thiếu ca chạy.

**Điểm cần kiểm chứng (chưa phải bug):** DT-08 (client gửi 0) và BL-01 (client gửi 1) đều lưu `200000` trong khi giỏ đang tích dồn nhiều món (23 → 45). Nếu backend thật sự tính lại từ toàn bộ giỏ thì tổng không thể giữ nguyên như vậy. Cần gọi `GET /api/cart` ngay trước mỗi checkout để xác định backend đang tính tổng từ đâu. Đây là điểm hai bộ test chưa soi tới.

### 9.7 Kết luận

**AI làm tốt:**
- Ma trận xác thực: DT-02 → DT-05 và AC-01 → AC-05, trong đó AC-02 → AC-04 phủ cả các endpoint khác. Kết quả: không có lỗ hổng.
- BL-01, BL-02, BL-03: bắt được lỗi R5 (BUG-03) và lỗi tổng tiền từ Bước 6.
- BL-09 (cách ly dữ liệu): ca hay dù không có bug.
- Danh sách CẦN LÀM RÕ: cả 14 câu hỏi của Phụ lục A đều bắt nguồn từ ca AI đánh dấu. Việc AI không tự đoán kỳ vọng cho phần SRS im lặng là đúng quy tắc.

**AI yếu:**
- Đổi nghĩa SRS rồi áp dụng không nhất quán (R4).
- Đặt kỳ vọng 4xx cho sai kiểu dữ liệu, và khẳng định có schema validator.
- Bịa giới hạn (255, 999, price ≥ 1), trường (`order_id`, `created_at`, `status`) và kỳ vọng (BL-10).
- Thiết kế test không cô lập trạng thái giỏ, dùng chuỗi giả cho các lớp token.
- Side-effect đơn hàng chỉ xuất hiện ở Bước 7.
- Bỏ sót nhóm trùng và tuyên bố "coverage 100%".

**Điều chỉnh prompt lần sau:**
- Bước 1: "Trích nguyên văn từng yêu cầu. Nếu diễn giải khác nguyên văn (ví dụ 'không chấp nhận' thành 'bỏ qua'), ghi cả hai cách hiểu vào CẦN LÀM RÕ."
- Bước 3 và 4: "Chỉ kỳ vọng 4xx khi SRS hoặc API doc nêu ràng buộc. Sai kiểu mà SRS im lặng thì ghi CẦN LÀM RÕ. Không giả định tầng validation nào của hệ thống."
- Bước 5: "Nếu SRS không nêu biên trên hoặc dưới, ghi 'không có biên xác định để test'. Không dùng 255, 999 hay MAX_INT."
- Bước 2 và 4: "Mỗi test ghi rõ trạng thái giỏ ban đầu và cách đưa về trạng thái đó bằng API. Không dùng DB. Nếu không dựng được thì đánh dấu 'không khả thi black-box'."
- Bước 2: "Liệt kê side-effect của mỗi thao tác ghi (giỏ, đơn, người sở hữu) ngay từ bước này."
- Bước 4 và 6: "Mọi ca của cùng một biến phải theo cùng cách hiểu đã chốt ở Bước 1."
- Không thêm rule "dùng common sense" vào prompt. Giả định ngoài SRS (giỏ rỗng, địa chỉ bắt buộc) ghi ở phía tester, kèm câu hỏi giảng viên, và chỉ đặt mức bug sau khi có xác nhận.
