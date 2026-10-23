# Báo cáo đánh giá bộ skill api-test-design qua lần chạy run-01-coupon (FR-09)

*Tác giả: Hà Quốc Kiên · Ngày chạy: 23/10/2026 · Trạng thái: hoàn thành

## 1. Tóm tắt

Báo cáo ghi lại một lần chạy đủ ba bước của workflow có người duyệt (sinh test matrix, sinh Karate feature, chạy và đánh giá) trên phạm vi FR-09 (mã giảm giá) của EShop. Công cụ: skill `api-test-design` trên Antigravity, Karate 1.5.2, Java 17.

Kết quả chính:

- Agent đề xuất 13 ca, người duyệt giữ nguyên cả 13. Karate chạy 13 scenario trong 655 ms: 8 đạt, 5 đỏ.
- Trong 5 ca đỏ có 4 lỗi hệ thống thật (AC01, AC03, AC07, AC11) và 1 lỗi script (AC10). Cả 4 lỗi thật đã có trong báo cáo Postman trước đó (B4, B14, B26, B24), nên lần chạy này **không phát hiện lỗi mới**.
- Đối chiếu lại bằng một collection Postman riêng cho FR-09 (cùng 13 ca, 23/10/2026): khớp Karate ở 12/13 ca. Ca lệch duy nhất là AC10 (Karate đỏ, Postman đạt), xác nhận AC10 là lỗi script của Karate chứ không phải lỗi hệ thống (mục 5.5).
- Với 5 lỗi đã biết thuộc ba endpoint trong phạm vi, workflow bắt được 4 (B4, B14, B24, B26) và chưa bắt được B23.
- Quy trình năm pha và hai điểm dừng được giữ đúng. Có ba vấn đề chất lượng: kỳ vọng của AC08, AC09, AC10 không lấy từ SRS và OpenAPI; AC10 có lỗi script mà bước duyệt và `check_coverage.py` không bắt được; nhật ký chỉ cho thấy một trong năm ca đỏ được gọi API trực tiếp để kiểm chứng.
- Đây là một lần chạy, một mô hình, một phạm vi, và ba trong bốn lỗi tìm được trùng với kịch bản mẫu của chính skill. Vì vậy chưa đủ cơ sở để kết luận skill hiệu quả hơn cách làm khác (phần 8).

## 2. Mục tiêu và phạm vi

Mục tiêu: đánh giá xem skill có giúp agent sinh test có truy vết, kỳ vọng đúng theo đặc tả và bắt được lỗi thật hay không, và vai trò của người duyệt trong quy trình.

Phạm vi lần chạy: FR-09 (áp mã giảm giá) với ba endpoint: `POST /api/apply-coupon`, `GET /api/coupons`, `POST /api/coupon-usage`. Hệ thống kiểm thử: EShop (`ttbhanh/eshop-sut`, Node.js + Express + SQLite).

Mốc so sánh: báo cáo kiểm thử Postman của chính nhóm (collection chính ngày 13/10/2026, bộ test tổng hợp ngày 15/10/2026, lỗi B1 đến B33).

## 3. Bộ skill và quy trình

Skill `api-test-design` bắt agent làm theo năm pha, có hai điểm dừng cho người:

| Pha | Nội dung | Người |
| --- | --- | --- |
| 1 | Đọc `srs.md`, `openapi.yaml`, `sample-data.md`; rút quy tắc nghiệp vụ |  |
| 2 | Sinh `test-matrix.md` có truy vết |  |
| 3 | **Dừng, chờ duyệt** (Y/S/N) | Duyệt matrix |
| 4 | Sinh Karate feature cho ca đã duyệt; chạy `check_coverage.py` | Đọc feature |
| 5 | **Dừng, chờ lệnh "chạy"**; chạy, điền `result.md`, phân loại ca đỏ | Quyết định chạy, kiểm chứng ca đỏ |

Quy tắc cốt lõi của skill: kỳ vọng chỉ lấy từ SRS và OpenAPI (SRS thắng khi hai bên khác nhau); không bịa dữ liệu; assertion chặt; không phá dữ liệu mẫu; không sửa test cho xanh. Ngoài skill có hai rule của Antigravity (vai trò và bốn điều cấm; ghi nhật ký hội thoại) và ba lời nhắc theo bước trong `prompts/tasks.md`.

## 4. Môi trường thực hiện

| Hạng mục | Giá trị |
| --- | --- |
| Công cụ | Antigravity |
| Mô hình | Gemini 3.8 Flash |
| Karate, Java | Karate 1.5.2, Java 17 |
| Hệ điều hành | Windows (PowerShell) |
| SUT | `node server.js`, `http://localhost:3000`, khởi động mới trước khi chạy |
| Thời điểm chạy | 23/10/2026 15:06:35 (theo báo cáo Karate) |
| Lệnh chạy | `java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -t "~@slow" -o ../executions/run-01-coupon/report ../executions/run-01-coupon/features` |
| Tổng thời gian ba bước (người và agent) | 10' 32'' |
| Đối chiếu sau chạy | Postman, collection `eshop_fr09_coupon_karate_crosscheck.postman_collection.json` (mục 5.5) |

## 5. Kết quả

### 5.1. Test matrix

Agent rút 11 quy tắc (R01 đến R11), đề xuất 13 ca, phủ đủ sáu nhóm ca của skill:

| Nhóm ca | Ca | Số ca |
| --- | --- | --- |
| 1. Đường đi đúng | AC01, AC02, AC12 | 3 |
| 2. Giá trị biên | AC03, AC04 | 2 |
| 3. Dữ liệu sai, thiếu | AC08, AC09 | 2 |
| 4. Vi phạm quy tắc nghiệp vụ | AC05, AC06 | 2 |
| 5. Phân quyền, bảo mật | AC07, AC11, AC13 | 3 |
| 6. Trạng thái, luồng nhiều bước | AC10 | 1 |

Phân bố theo endpoint: `apply-coupon` 10 ca (AC01 đến AC10), `GET /api/coupons` 2 ca (AC11, AC12), `coupon-usage` 1 ca trực tiếp (AC13) và 1 ca gián tiếp (AC10).

Agent ghi ba điểm mâu thuẫn hoặc chưa rõ, người duyệt chấp nhận cả ba đề xuất:

1. OpenAPI ghi `apply-coupon` không cần đăng nhập (`security: []`), SRS FR-09 C4 yêu cầu đăng nhập. Agent theo SRS, nên AC07 kỳ vọng 401.
2. Dữ liệu mẫu không có mã `is_active = 0` và API không tạo được, nên ca "mã bị vô hiệu hóa" không phủ được; AC06 kiểm mã không tồn tại.
3. SRS C5 không nêu mã HTTP khi hết lượt dùng; agent chọn 400.

Người duyệt: 13 ca Y, 0 ca S, 0 ca N, 0 ca thêm mới, 0 assertion yếu được bắt ở bước duyệt.

### 5.2. Kết quả chạy

| Chỉ số | Giá trị |
| --- | --- |
| Số scenario | 13 |
| Đạt | 8 (AC02, AC04, AC05, AC06, AC08, AC09, AC12, AC13) |
| Đỏ | 5 (AC01, AC03, AC07, AC10, AC11) |
| Thời gian | 655 ms |
| `check_coverage.py` trước khi chạy | 0 LỖI, 0 CẢNH BÁO |

&#91;Hình 1: ảnh chụp `karate-summary.html` cho thấy 8 đạt, 5 đỏ\]

### 5.3. Phân loại ca đỏ

Bảng dưới dùng phân loại đã đối chiếu với báo cáo Postman. Tệp `result.md` gốc gắn nhãn `HT-mới` cho bốn lỗi hệ thống vì agent không có danh sách lỗi; sau đối chiếu cả bốn là lỗi đã có mã (`HT`).

| ID | Triệu chứng | Nguyên nhân (theo `result.md`) | Loại | Mã lỗi |
| --- | --- | --- | --- | --- |
| AC01 | `discount_amount` = -9.000.000, kỳ vọng 100.000 | Công thức giảm giá phần trăm sai | HT | B4 (Postman ghi cùng giá trị -9.000.000) |
| AC03 | 400 tại đúng ngưỡng 300.000, kỳ vọng 200 | So sánh `>` thay vì `>=` (FR-09 C3) | HT | B14 |
| AC07 | 200 khi không có token, kỳ vọng 401 | Endpoint không gắn xác thực (FR-09 C4) | HT | B26 |
| AC10 | 200, kỳ vọng 400 | Lỗi script: `user_id: u.id` (cần `'#(u.id)'`) | SC (đã xác nhận bằng Postman, chưa chạy lại Karate) | liên quan B23 |
| AC11 | 200 với user thường, kỳ vọng 403 | `GET /api/coupons` không kiểm tra role admin | HT | B24 (phần xem danh sách mã) |

Về AC10: kịch bản tạo tài khoản tạm, ghi nhận một lượt dùng SAVE10 (giới hạn mỗi người là 1) rồi áp mã lần nữa. Theo `result.md`, agent gọi trực tiếp `apply-coupon` với `user_id` của tài khoản tạm và nhận 400 đúng kỳ vọng, nên kết luận lỗi nằm ở script. Chẩn đoán này đã được xác nhận độc lập bằng collection Postman ở mục 5.5: với `user_id` đúng của tài khoản tạm, backend trả 400 đúng SRS C5. Tuy vậy Karate vẫn chưa được chạy lại sau khi sửa script, nên ca C5 (giới hạn lượt dùng) **chưa được Karate kiểm tra thành công lần nào**.

### 5.4. Ca xanh đáng ngờ

- **AC09** (`total_amount` = -100.000): test đạt vì phản hồi 400 chứa "chưa đủ giá trị tối thiểu". Đó là thông báo của nhánh so sánh ngưỡng, không phải của kiểm tra dữ liệu không hợp lệ. OpenAPI khai báo `total_amount` có `minimum: 0`, tức số âm phải bị từ chối như dữ liệu sai, nhưng không nêu thông báo lỗi. Test mã hóa hành vi quan sát được thay vì kỳ vọng theo đặc tả. Agent tự đánh dấu ca này là đáng ngờ.
- **AC08** (thiếu trường): đạt, nhưng chuỗi kỳ vọng "Vui lòng nhập mã giảm giá" không có trong SRS hay OpenAPI (xem 7.2).

### 5.5. Đối chiếu lại bằng collection Postman riêng cho FR-09

Để kiểm tra lại các ca Karate do AI sinh ra, nhóm dựng một collection Postman một request (`eshop_fr09_coupon_karate_crosscheck.postman_collection.json`), bấm Send là chạy đủ 13 ca AC01 đến AC13 với cùng dữ liệu và mã ca. Kỳ vọng làm theo đề xuất 1 ở mục 9: chỉ lấy từ SRS và OpenAPI; ca nào tài liệu không nêu thông báo lỗi (AC07, AC08, AC09, AC10) chỉ kiểm mã trạng thái và `response.error` là chuỗi; các ca có ví dụ trong OpenAPI (AC04, AC05, AC06, AC11, AC13) giữ chuỗi lỗi. AC10 tự tạo tài khoản tạm và áp mã với `user_id` đúng. Chạy ngày 23/10/2026 trên server khởi động mới.

| ID | Karate | Postman | Khớp | Ghi chú |
| --- | --- | --- | --- | --- |
| AC01 | Đỏ | Đỏ | Khớp | `discount_amount` = -9.000.000, kỳ vọng 100.000 (B4) |
| AC02 | Đạt | Đạt | Khớp | |
| AC03 | Đỏ | Đỏ | Khớp | 400 tại đúng ngưỡng 300.000, kỳ vọng 200 (B14) |
| AC04 | Đạt | Đạt | Khớp | |
| AC05 | Đạt | Đạt | Khớp | |
| AC06 | Đạt | Đạt | Khớp | |
| AC07 | Đỏ | Đỏ | Khớp | 200 khi không có token, kỳ vọng 401 (B26) |
| AC08 | Đạt | Đạt | Khớp | |
| AC09 | Đạt (đáng ngờ) | Đạt | Khớp | Postman không còn kiểm chuỗi, nên vẫn đạt dù lý do 400 chưa rõ (xem dưới) |
| AC10 | **Đỏ** | **Đạt** | **Lệch** | Karate đỏ do lỗi script; Postman với `user_id` đúng: ghi nhận 200, áp mã lần hai 400 |
| AC11 | Đỏ | Đỏ | Khớp | 200 với user thường, kỳ vọng 403 (B24) |
| AC12 | Đạt | Đạt | Khớp | |
| AC13 | Đạt | Đạt | Khớp | |

Kết quả: 9 ca đạt, 4 ca đỏ (AC01, AC03, AC07, AC11). Nhận xét:

- Bốn lỗi hệ thống thật (B4, B14, B26, B24) có hai bằng chứng độc lập, từ Karate và từ Postman.
- Lần đối chiếu này bù phần kiểm chứng ca đỏ bằng gọi API trực tiếp mà mục 7.2 (vấn đề 6) chỉ ra còn thiếu. Đây là bước do người làm thêm, không phải do agent thực hiện.
- AC10: chẩn đoán trong `result.md` (lỗi ở `user_id: u.id`) được xác nhận. C5 hiện có bằng chứng từ Postman nhưng chưa có bằng chứng từ Karate; cần sửa script thành `'#(u.id)'` và chạy lại.
- AC09 vẫn là ca xanh đáng ngờ. Để khẳng định đạt vì lý do sai (nhánh so sánh ngưỡng chứ không phải kiểm tra dữ liệu âm), cần xem dòng log thật của AC09 trong Postman Console: [điền nội dung `error` thực tế].
- Số liệu "bắt được 4/5 lỗi đã biết" ở mục 6 không đổi: B23 vẫn chưa có ca nào bắt (collection giữ đúng 13 ca để đối chiếu).

[Hình 7: ảnh Test Results của collection FR-09 (9 đạt, 4 đỏ)]

## 6. Đối chiếu với kiểm thử Postman

Báo cáo Postman ghi các lỗi liên quan tới ba endpoint trong phạm vi như sau:

| Lỗi Postman | Mô tả | Kết quả trong run-01 |
| --- | --- | --- |
| B4 | Giảm giá phần trăm tính sai | AC01 đỏ: bắt được |
| B14 | Từ chối đơn đúng bằng ngưỡng tối thiểu | AC03 đỏ: bắt được |
| B26 | `apply-coupon` không yêu cầu đăng nhập | AC07 đỏ: bắt được |
| B24 (phần `GET /api/coupons`) | User thường xem được danh sách mã | AC11 đỏ: bắt được |
| B23 | Bỏ `user_id` để lách giới hạn lượt dùng | Không có ca riêng; AC10 đỏ do lỗi script: **chưa bắt được** |

Số liệu rút ra (theo danh sách 5 lỗi trên, do người viết báo cáo tự lập từ báo cáo Postman):

- Bắt được 4/5 lỗi đã biết trong phạm vi; không có lỗi mới.
- Trong 5 ca đỏ: 4 là lỗi hệ thống thật, 1 là lỗi script, 0 là sai kỳ vọng.
- Điểm khác biệt có thể nói là của workflow: mã lỗi B không có trong đầu vào (đã làm sạch bằng `make_agent_openapi.py`), kỳ vọng số tiền tính theo công thức SRS, và mọi ca có truy vết về quy tắc.

Lưu ý: cả hai cách làm đều tham khảo mã nguồn `server.js` (báo cáo Postman nói rõ điều này; nhật ký cho thấy agent cũng xem `server.js` chín lần). Vì vậy so sánh này không phải so sánh giữa "có đọc mã" và "không đọc mã".

## 7. Đánh giá bộ skill

### 7.1. Điểm mạnh (có bằng chứng trong lần chạy)

1. **Giữ đúng quy trình và điểm dừng.** Lượt 1 dừng sau khi sinh matrix, lượt 2 dừng trước khi chạy, lượt 3 chạy sau lệnh "chạy". Không có dấu hiệu agent sửa assertion để test xanh: AC10 vẫn đỏ.
2. **Truy vết đầy đủ.** 13/13 ca duyệt có scenario mang thẻ `@ID` trùng matrix; `check_coverage.py` báo sạch.
3. **Áp đúng thứ tự ưu tiên tài liệu.** Với `apply-coupon`, agent chọn SRS thay vì OpenAPI (AC07 kỳ vọng 401), ghi mâu thuẫn vào matrix. Đây chính là điểm mâu thuẫn nhóm đã ghi ở báo cáo Postman (mục 7).
4. **Kỳ vọng số tiền tính theo công thức.** AC01 (100.000 và 900.000) và AC03 (30.000 và 270.000) tính từ SRS, không chép từ phản hồi; hai ca này bắt được B4 và B14.
5. **Ghi nhận giới hạn dữ liệu.** Agent nhận ra không phủ được mã `is_active = 0` và ghi vào matrix thay vì tự bịa.
6. **Phủ đủ sáu nhóm ca**, mỗi endpoint có ca đường đúng hoặc ca âm tính/bảo mật.
7. **Chạy được trên Karate 1.5.2 và Java 17** bằng đúng lệnh trong tài liệu.

### 7.2. Vấn đề phát hiện

1. **Kỳ vọng không chỉ đến từ SRS và OpenAPI.** Trong lượt 2, agent mở `server.js` chín lần và tìm `authenticateToken` trước khi viết feature. Chuỗi kỳ vọng của AC08 ("Vui lòng nhập mã giảm giá") và AC10 ("đã đạt giới hạn") không xuất hiện trong `srs.md` và `openapi.yaml` (đã tìm trong bản đầu vào của bộ skill), còn AC09 dùng thông báo của nhánh lỗi sai. Quy tắc cốt lõi 1 của skill nói kỳ vọng chỉ lấy từ SRS và OpenAPI, nhưng không nói rõ có được đọc mã nguồn hay không.
2. **Matrix và feature không khớp ở assertion.** Matrix ghi `response.error == '#present'` cho AC08, AC09, AC10, nhưng feature dùng chuỗi cụ thể. Người duyệt matrix không thể biết chuỗi đó từ đâu ra.
3. **Lỗi script AC10 lọt qua mọi lớp kiểm tra.** Agent viết `user_id: u.id` trong khi hướng dẫn Karate của skill dùng cú pháp `'#(biến)'`. `check_coverage.py` chỉ kiểm cấu trúc (có `@ID`, có `match`, không chỉ kiểm kiểu) nên không bắt được; bước đọc feature của người cũng không bắt được. Lỗi chỉ lộ ở lần chạy.
4. **Bước duyệt chưa tạo thay đổi nào trong lần chạy này.** 13 ca Y, 0 sửa, 0 loại, 0 thêm. Ba vấn đề trên không bị phát hiện ở bước duyệt hay bước đọc feature. Chưa đủ dữ liệu để kết luận bước duyệt có giá trị hay không; cần một bảng kiểm cụ thể cho người duyệt (phần 9).
5. **Bỏ sót ca "bỏ trường tùy chọn".** `design-rules.md` có mục "Lách luật bằng cách bỏ một trường tùy chọn", nhưng matrix không có ca gọi `apply-coupon` không kèm `user_id`. Đây là lý do B23 không được bắt (OpenAPI còn ghi `user_id` là `nullable`, nên đây cũng là điểm đặc tả mơ hồ cần ghi vào mục mâu thuẫn).
6. **Kiểm chứng ca đỏ bằng API trực tiếp chưa đầy đủ.** Skill yêu cầu mỗi ca đỏ phải kiểm chứng bằng gọi API trực tiếp. Trong nhật ký, chỉ thấy các lời gọi trực tiếp cho AC10; `result.md` ghi "Có" cho cả 5 ca, nhưng với AC01, AC03, AC07, AC11 lời giải thích dựa vào đọc `server.js` và đối chiếu Postman trước đó. Phần thiếu này đã được bù bằng collection Postman ở mục 5.5 (cho cả 5 ca đỏ), nhưng đó là bước do người làm thêm.
7. **Phân loại sai nhãn do thiếu danh sách lỗi.** `result.md` ghi AC01 là loại `HT` nhưng mã lỗi `HT-mới` (mâu thuẫn trong cùng một dòng), và gắn `HT-mới` cho cả bốn lỗi đã có mã B. Tệp này cần được sửa cho khớp bảng 5.3.
8. **Một số điểm vận hành.** Agent phải tìm thư mục `executions` bằng lệnh tìm kiếm vì workspace là thư mục gốc repo EShop chứ không phải thư mục `ai-workflow`. `check_coverage.py` phải chạy lại với `PYTHONIOENCODING=utf-8` (nhiều khả năng do lỗi mã hóa console Windows khi in tiếng Việt). Agent còn đọc trực tiếp `database.sqlite` bằng các lệnh `node` để chẩn đoán AC10; skill chưa nói có cho phép hay không.
9. **Nhật ký hội thoại chưa nguyên văn.** `conversation.md` ghi các lời nhắc còn nguyên chỗ giữ `[PHẠM VI]`, `[RUN-ID]`, trong khi agent vẫn làm đúng thư mục `run-01-coupon`. Cần kiểm tra lại tệp này trước khi dùng làm bằng chứng.

## 8. Hạn chế và đe dọa tính hợp lệ

- **Một lần chạy, một mô hình, một phạm vi.** Không thể suy ra tính ổn định. Cùng đầu vào chạy lại có thể cho matrix khác.
- **Trùng với kịch bản mẫu của skill.** `examples/coupon.feature` đã có các ca SAVE10 1.000.000, đơn đúng ngưỡng 300.000 và gọi không token. README của bộ skill ghi các ví dụ này đã khớp B4, B14, B26. Nhật ký cho thấy agent mở một tệp `coupon.feature` trước khi sinh matrix (nhiều khả năng là tệp ví dụ). Vì vậy 3 trong 4 lỗi bắt được có thể là do mô phỏng ví dụ, không phải khám phá độc lập; chỉ AC11 (B24) nằm ngoài ví dụ.
- **Độ phủ.** Phạm vi chỉ gồm ba endpoint; các lỗi mã giảm giá ở phía admin (B29, B11 phần mã giảm giá) nằm ngoài phạm vi và không được tính.
- **Quy mô nhỏ.** 13 ca; tỉ lệ 4/5 có độ bất định lớn.

## 9. Đề xuất cải tiến

1. **Làm rõ nguồn kỳ vọng.** Thêm vào quy tắc cốt lõi: không đọc mã nguồn SUT hay cơ sở dữ liệu để rút kỳ vọng; thông báo lỗi chỉ lấy từ SRS và OpenAPI. Khi tài liệu không nêu thông báo, ca chỉ kiểm mã trạng thái và `response.error == '#string'`, đồng thời ghi "SRS không nêu" vào matrix. Nếu muốn cho phép đọc mã để chẩn đoán ca đỏ (pha 5), nói rõ là chỉ dùng ở pha 5.
2. **Bắt buộc matrix và feature khớp assertion.** Thêm một bước hoặc kiểm tra trong `check_coverage.py` cảnh báo khi cột "Assertion chính" của matrix khác với assertion trong feature (ví dụ chuỗi cụ thể không có trong matrix).
3. **Chặn lỗi cú pháp biến.** Thêm vào mục "Việc không làm" của `karate-guide.md`: không dùng biến trần trong thân JSON (`user_id: u.id`), luôn dùng `'#(u.id)'`. Thêm cảnh báo vào `check_coverage.py` cho các dòng `request {...}` chứa giá trị dạng `tên.thuộc_tính` không nằm trong dấu nháy.
4. **Bảng kiểm cho người duyệt.** Thêm vào README hoặc `executions/README.md`: kiểm chuỗi lỗi có nguồn trong tài liệu, kiểm ca "bỏ từng trường tùy chọn", kiểm biến trong thân request, kiểm khớp matrix và feature.
5. **Yêu cầu bằng chứng kiểm chứng.** Cột "Đã kiểm chứng" trong `result.md` phải kèm yêu cầu và phản hồi thực tế (hoặc ảnh chụp), không chỉ chữ "Có".
6. **Thêm bước đối chiếu lỗi đã biết sau khi chạy.** Bước này do người làm (không đưa danh sách lỗi cho agent), để phân loại `HT` và `HT-mới` đúng.
7. **Sửa `check_coverage.py` để chạy tốt trên Windows**: ép mã hóa `utf-8` cho đầu ra.
8. **Đổi ví dụ.** Dùng ví dụ không trùng phạm vi đánh giá, hoặc đánh giá trên phạm vi khác (ví dụ FR-10 đơn hàng, nơi Postman có B21, B22).
9. **Chạy lặp lại.** Chạy lại cùng phạm vi 3 lần và ít nhất một mô hình khác, để đo độ ổn định.
10. **Kiểm chứng độc lập.** Khi một ca đỏ nghi là lỗi script, chạy lại cùng kỳ vọng bằng một công cụ khác (như collection Postman ở mục 5.5) trước khi kết luận là lỗi hệ thống hay lỗi script; cách này đã tách được AC10.

## 10. Kết luận

Trong một lần chạy trên FR-09, bộ skill đã giữ đúng quy trình có người duyệt, sinh được matrix có truy vết với kỳ vọng số tiền tính theo công thức SRS, và bắt được 4 trong 5 lỗi đã biết của ba endpoint, không có lỗi mới. Các điểm yếu chủ yếu nằm ở nguồn của kỳ vọng (đọc mã nguồn, chuỗi lỗi ngoài tài liệu), ở các kiểm tra tự động chưa đủ để bắt lỗi script, và ở bằng chứng kiểm chứng ca đỏ. Kết quả hiện chỉ đủ để mô tả hành vi của bộ skill ở lần chạy này; để đánh giá hiệu quả cần chạy lại Karate sau khi sửa AC10 (Postman đã xác nhận AC10 là lỗi script, mục 5.5), thêm mốc so sánh và thử trên phạm vi không trùng với ví dụ.

## Phụ lục A. Danh sách 13 ca

| ID | Endpoint | Nhóm | Kỳ vọng | Kết quả |
| --- | --- | --- | --- | --- |
| AC01 | POST /api/apply-coupon | 1 | SAVE10, 1.000.000: giảm 100.000, còn 900.000 | Đỏ |
| AC02 | POST /api/apply-coupon | 1 | BIGBUY, 1.000.000: giảm 50.000, còn 950.000 | Đạt |
| AC03 | POST /api/apply-coupon | 2 | SAVE10, đúng 300.000: giảm 30.000, còn 270.000 | Đỏ |
| AC04 | POST /api/apply-coupon | 2 | SAVE10, 299.999: 400 | Đạt |
| AC05 | POST /api/apply-coupon | 4 | EXPIRED: 400, hết hạn | Đạt |
| AC06 | POST /api/apply-coupon | 4 | NOSUCHCODE: 404 | Đạt |
| AC07 | POST /api/apply-coupon | 5 | Không token: 401 | Đỏ |
| AC08 | POST /api/apply-coupon | 3 | Thiếu trường: 400 | Đạt |
| AC09 | POST /api/apply-coupon | 3 | total\_amount âm: 400 | Đạt (đáng ngờ) |
| AC10 | POST /api/apply-coupon, /api/coupon-usage | 6 | Hết lượt dùng: 400 | Đỏ (lỗi script) |
| AC11 | GET /api/coupons | 5 | User thường: 403 | Đỏ |
| AC12 | GET /api/coupons | 1 | Admin xem danh sách: 200 | Đạt |
| AC13 | POST /api/coupon-usage | 5 | Không token: 401 | Đạt |
