# FR-04 – Quản lý hồ sơ cá nhân · AI gap analysis

## Bước 9: AI gap analysis

### 9.1 So sánh bộ test của AI và bộ cuối cùng
| Chỉ số | Số lượng |
| :--- | :-: |
| Test case AI sinh ra | 41 (Bước 4: 22, Bước 5: 8, Bước 6: 6, Bước 7: 5) |
| Trong đó trùng nhau | 4 (BV-01..04 của AI trùng DT-04, DT-01, DT-02, DT-05) |
| Bộ cuối: AI đã có đủ | 23 / 34 |
| Bộ cuối: AI có một phần | 5 / 34 |
| Bộ cuối: AI bỏ sót | 6 / 34 |
| Ca AI có mà bộ cuối chưa có (đáng bổ sung) | 3 (xem mục 9.5) |
| Phát hiện mới ngoài cả hai bộ | 1 (xem mục 9.6) |

Lưu ý: "bộ cuối" của FR-04 có nguồn gốc từ bản mẫu của giảng viên cộng các ca bổ sung, nên đây không phải chuẩn độc lập. Với các feature chính thức, bộ cuối là bộ do chính bạn rà soát.

### 9.2 Đối chiếu từng test của bộ cuối
Mức khớp: **Đủ** (có ca tương đương), **Một phần** (có ca nhưng khác kỳ vọng hoặc khác giá trị), **Thiếu**.

| Test bộ cuối | Ca tương ứng của AI | Mức khớp | Ghi chú |
| :--- | :--- | :-: | :--- |
| DT-01 | AI DT-01, BV-02 | Đủ |  |
| DT-02 | AI DT-02, BV-03 | Đủ |  |
| DT-03 | AI DT-03 | Đủ | AI dùng `1912345678`, bộ cuối dùng `9123456789` |
| DT-04 | AI DT-06 | Đủ |  |
| DT-05 | AI DT-08 | Một phần | AI gộp khoảng trắng và dấu gạch vào một ca và để CẦN LÀM RÕ, trong khi SRS nói "chữ số" nên đáng lẽ kỳ vọng 4xx |
| DT-06 | — | Thiếu | AI không có lớp định dạng quốc tế `+84` |
| DT-07 | AI DT-08 | Một phần | Như DT-05 |
| DT-08 | AI DT-07 | Đủ | Cả hai đều dùng số `912345678`, chưa tách riêng lỗi kiểu khỏi lỗi đầu số và độ dài |
| DT-08b | — | Thiếu | Ca bổ sung của người test (sai kiểu boolean); không bắt buộc theo kỹ thuật EP |
| DT-08c | — | Thiếu | Ca bổ sung của người test (sai kiểu mảng); không bắt buộc theo kỹ thuật EP |
| DT-08d | AI DT-10 | Đủ |  |
| DT-09 | AI DT-09 | Đủ |  |
| BV-01 | AI BV-01, DT-04 | Đủ |  |
| BV-02 | AI BV-02 | Đủ |  |
| BV-03 | AI BV-03 | Đủ |  |
| BV-04 | AI BV-04, DT-05 | Đủ |  |
| BV-05 | — | Thiếu | Độ dài 1 của `phone`. BV-05 của AI là biên của `name` |
| BV-06 | AI DT-01, BV-02 | Đủ | Mọi SĐT hợp lệ đều bắt đầu bằng 0 |
| BV-07 | AI DT-03 | Đủ | Cùng lớp "10 số, đầu khác 0" |
| DT-10 | AI DT-01 | Đủ |  |
| DT-11 | — | Thiếu | AI bỏ sót lớp hợp lệ tên có dấu tiếng Việt |
| DT-12 | AI DT-13 | Đủ | AI gộp "rỗng" và "không truyền" trong một test nhưng body chỉ thử rỗng |
| DT-13 | — | Thiếu | AI không có lớp chuỗi toàn khoảng trắng |
| DT-14 | AI DT-14 | Đủ |  |
| DT-15 | AI DT-01 | Đủ |  |
| DT-16 | AI DT-17 | Đủ | Như DT-12 |
| DT-17 | AI DT-12 | Một phần | AI thử 256 ký tự dựa trên giả định `VARCHAR(255)` (SRS không nêu) |
| BL-01 | AI DT-01, BL-01 | Đủ |  |
| BL-02 | AI BL-02 | Một phần | AI nêu đúng chỗ mơ hồ nhưng để CẦN LÀM RÕ, không chốt kỳ vọng |
| BL-03 | AI SEC-01, DT-18 | Đủ |  |
| BL-04 | AI SEC-02, DT-19 | Đủ |  |
| BL-05 | AI SE-03 | Một phần | AI gộp `id` với trường tự bịa `is_active` trong cùng một test |
| AC-01 | AI DT-20 | Đủ |  |
| AC-02 | AI DT-21 | Đủ |  |

### 9.3 Ca và bug AI bỏ sót, và vì sao
| # | Ca / vấn đề bỏ sót | Vì sao AI bỏ sót | Nhóm nguyên nhân (đề xuất) | Bằng chứng |
| :-: | :--- | :--- | :-: | :--- |
| 1 | DT-06: SĐT dạng `+84...` | AI chỉ xét lỗi ký tự thông thường, không nghĩ đến định dạng quốc tế; đầu vào cũng không nói đây là hệ thống Việt Nam | Giới hạn của AI (phụ: Prompt) | FR-04-03 |
| 2 | DT-11: tên có dấu tiếng Việt (lớp hợp lệ) | Đầu vào không cho biết ngữ cảnh tiếng Việt nên AI chỉ chọn tên không dấu | Prompt | FR-04-03 |
| 3 | DT-13: tên toàn khoảng trắng | Lớp chuẩn của chuỗi nhưng AI không liệt kê; Prompt 3 cũng không đưa checklist lớp chuỗi | Giới hạn của AI | FR-04-03 |
| 4 | BV-05: SĐT độ dài 1 | Prompt chỉ yêu cầu biên 3-value, không yêu cầu giá trị cực trị | Prompt | FR-04-05 |
| 5 | DT-08b/08c: sai kiểu boolean, mảng | Theo EP chỉ cần một đại diện cho lớp "sai kiểu", nên AI không sai kỹ thuật. Các ca này bắt lỗi ép kiểu của cài đặt (`true` → `1`, mảng → `[object Object]`), chỉ lộ khi chạy | Độ phức tạp của feature | Kết quả chạy |
| 6 | DT-05/07: khoảng trắng và dấu gạch bị để CẦN LÀM RÕ | AI quá thận trọng. SRS ghi "chữ số" nên kỳ vọng hợp lý là 4xx; hệ quả là nếu chỉ theo AI thì lỗi này không được kết luận | Giới hạn của AI | FR-04-03, FR-04-04 |
| 7 | Mọi test của AI đều gửi đủ 3 trường hợp lệ → che mất BUG-02 (trường không gửi bị xóa) | Cách thiết kế test: chỉ BL-02 mới gửi một trường, mà kỳ vọng lại để CẦN LÀM RÕ; không có kiểm tra "trường không gửi giữ nguyên" nào khác | Độ phức tạp của feature (phụ: Prompt) | FR-04-04, FR-04-06 |
| 8 | **BUG-04: `GET /api/users/me` trả mật khẩu dạng plaintext và các trường nhạy cảm** | Không bộ nào (AI, bản mẫu, bộ cuối) xem xét nội dung response, chỉ xem dữ liệu đã gửi. Prompt 2 hỏi "đầu ra cần quan sát" nhưng AI chỉ liệt kê mã HTTP và dữ liệu vừa cập nhật | Độ phức tạp của feature (phụ: Prompt) | FR-04-02, mục 9.6 |

### 9.4 AI sai hoặc bịa (nguyên liệu cho AI Critique)
- **Vi phạm chỉ dẫn "không dùng kiến thức về cài đặt":** giả định `VARCHAR(255)` để chọn biên 255/256 (FR-04-03, 04, 05); cách dựng test yêu cầu chèn bản ghi bằng SQL, trong khi test black-box không truy cập CSDL (FR-04-02).
- **Bịa trường và yêu cầu:** `is_active`, `created_at`, `updated_at` (SE-03, SE-04) không có trong `GET /api/users/me`; SE-01 gắn nguồn "FR-04 (Logic EShop)" không tồn tại trong SRS; SE-03 gắn sai SEC-04 (đó là yêu cầu escape khi hiển thị).
- **Kỳ vọng suy diễn:** DT-11 và DT-15 (tên số, địa chỉ object) kỳ vọng 4xx dù SRS không nêu ràng buộc kiểu cho hai trường này. SEC-03 kỳ vọng JSON trả về phải escape, nhưng SEC-04 nói về lúc hiển thị trên UI.
- **Mâu thuẫn giữa các bước:** ở Bước 4, `email` và `role` ghi CẦN LÀM RÕ (DT-18, DT-19), trong khi Bước 6 chốt đúng kỳ vọng "giữ nguyên" (SEC-01, SEC-02). R5 vốn đã rõ ràng.
- **Nịnh và hiểu sai ở Bước 7:** mở đầu bằng lời khen ("vô cùng sắc bén"), cuối bài cảm ơn "đã phát hiện điểm thiếu sót" dù chính AI viết ra các ca đó. AI còn tuyên bố các "trường không gửi" đã được kiểm tra qua SEC-01/02 và BL-02, trong khi câu hỏi nói về `name`, `phone`, `shipping_address`, và BL-02 chưa chốt kỳ vọng.
- **Ca không thực hiện được:** DT-22 (token hết hạn) không dựng được khi không có khóa ký và thời hạn token.
- **Trộn nhiều điều kiện trong một test:** SE-03 gửi `id` và `is_active` cùng lúc; DT-13 và DT-17 gộp "rỗng" với "không truyền" nhưng chỉ thử rỗng.

### 9.5 Ca của AI mà bộ cuối chưa có, đã chạy thử
| Ca của AI | Kết quả thực tế | Đánh giá |
| :--- | :--- | :--- |
| SE-02 (nguyên tử): `name` hợp lệ + `phone` 9 số | HTTP 200, lưu cả hai (`phone` = `091234567`) | **FAIL** theo R2, cùng nguyên nhân BUG-01. Nên thêm vào bộ cuối |
| AC-01 (cô lập user): user A cập nhật, xem user B | B không bị ảnh hưởng | **PASS**. Nên thêm để kiểm tra R4 đúng nghĩa |
| DT-11: `name = 12345` (number) | HTTP 200, lưu `12345` | CẦN LÀM RÕ (SRS không nêu kiểu cho `name`) |
| DT-15: `shipping_address = {"street":"123"}` | HTTP 200, lưu `[object Object]` (dữ liệu hỏng) | CẦN LÀM RÕ; nên thêm vào bộ cuối cùng nhóm câu hỏi kiểu dữ liệu |
| DT-12 / DT-16: tên 256, địa chỉ 500 ký tự | HTTP 200, lưu đủ | CẦN LÀM RÕ (SRS không nêu độ dài tối đa) |
| SE-03: `id=999`, `is_active=false`, `name` | `id` vẫn giữ nguyên; `is_active` không tồn tại | Phần `id` tương đương BL-05; phần `is_active` là trường bịa |
| SEC-03: `name = <script>...` rồi GET | GET trả nguyên văn, không escape trong JSON | Phù hợp với SEC-04 (escape ở UI). Cần kiểm tra trên giao diện web để kết luận |
| SE-05: gửi lại dữ liệu y hệt | HTTP 200 | Không có giá trị kiểm thử thêm |
| SE-01, SE-04, DT-22 | Không thực hiện | SE-01 cần đơn hàng (feature khác, SRS FR-04 không yêu cầu); SE-04 cần trường `updated_at` không có trong GET; DT-22 không dựng được token hết hạn |

### 9.6 Phát hiện mới (BUG-04)
`GET /api/users/me` trả về các trường `password`, `reset_token`, `login_attempts`, `locked_until`. Giá trị `password` **trùng đúng mật khẩu gốc `Pass1234!`** đã dùng khi đăng ký, tức là mật khẩu được lưu và trả về dạng plaintext, trái với SEC-01 ("Mật khẩu không được lưu dưới dạng plaintext"). Chi tiết xem `bugs/FR-04-BUG-04.md`.

### 9.7 Kết luận
- AI làm tốt: các lớp cơ bản của SĐT, biên độ dài, bảo mật `role`/`email`, cô lập giữa các user, tính nguyên tử.
- AI yếu: ngữ cảnh địa phương (`+84`, dấu tiếng Việt), thận trọng quá mức (để CẦN LÀM RÕ cả những chỗ SRS đã đủ rõ), bịa trường và yêu cầu, thiết kế test che tác dụng phụ, và không nhìn vào nội dung response.
- Điều chỉnh prompt lần sau: cho ngữ cảnh hệ thống; đưa checklist lớp cho kiểu chuỗi; yêu cầu "liệt kê mọi trường trong response và nói trường nào không nên xuất hiện"; yêu cầu mỗi test ghi rõ trạng thái các trường không gửi.
- TODO: viết lại phần kết luận bằng lời của bạn.
