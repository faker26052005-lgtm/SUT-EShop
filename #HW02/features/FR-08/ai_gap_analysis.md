# FR-08 – Thanh toán (Checkout) · AI gap analysis

## Bước 9: AI gap analysis

### 9.1 So sánh bộ test của AI và bộ cuối cùng

| Chỉ số | Số lượng / Nhận xét |
| :--- | :--- |
| **Test case AI sinh ra (thô)** | ~64 ca (Bao gồm rất nhiều ca trùng lặp giữa Bước 4 Domain Testing và Bước 5 BVA). |
| **Test case bộ cuối (con người chốt)** | **41 ca** (Đã lọc bỏ các ca trùng lặp, tối ưu hóa coverage). |
| **Trùng lặp do AI tạo ra** | AI tự sinh các ca hoàn toàn giống nhau về mặt ý nghĩa kiểm thử (VD: `total_amount = 0` ở cả DT-08 và BV-02; chuỗi rỗng `""` ở cả DT-15 và BV-04; `quantity = 0` ở DT-21 và BV-10). |
| **Xử lý của con người** | Con người đã can thiệp loại bỏ các ca DT trùng lặp, giữ lại ca BV để định danh chính xác điểm biên (Giữ BV-02, BV-04, BV-10; Loại DT-08, DT-15, DT-21). |

### 9.2 Đánh giá chất lượng sinh Test Case của AI (Đối chiếu)

Mức khớp: **Tốt** (AI phủ kín và chính xác), **Một phần** (AI có đề cập nhưng xử lý rập khuôn/thiếu thực tế), **Thiếu/Yếu** (AI không nhận diện được vấn đề cho đến khi con người chỉ ra hoặc thực thi).

| Nhóm Test / Vấn đề | Đánh giá AI | Ghi chú / Hành động của người test |
| :--- | :--- | :--- |
| **Ranh giới độ dài & Số học (BVA)** | **Tốt** | AI lập bảng 3-value chuẩn xác cho `total_amount`, độ dài chuỗi và `quantity`. |
| **Kiểm tra Token & Xác thực (AC)** | **Tốt** | AI vét cạn đủ các trường hợp thiếu token, sai tiền tố, sai chữ ký, hết hạn (AC-01 đến AC-05, DT-01 đến DT-05). |
| **Lỗi Schema (Sai kiểu dữ liệu)** | **Một phần** | AI đưa ra các ca sai kiểu (String cho số, Number cho chuỗi) nhưng luôn kỳ vọng "4xx và dữ liệu không đổi". Thực tế chạy Postman phát hiện Backend lỏng lẻo, nhận cả `shipping_address: 12345` (FR-08-BUG-05). |
| **Kiểm tra Side-effects (BL)** | **Yếu** | Ở 6 bước đầu, AI hoàn toàn bỏ quên các tác dụng phụ (xóa giỏ hàng, cách ly dữ liệu, sinh mã đơn). Chỉ khi con người "mớm" câu hỏi ở Bước 7, AI mới sinh ra BL-07 đến BL-11. |
| **Xử lý các điểm mơ hồ (SRS im lặng)** | **Một phần** | AI nhận diện rất tốt các điểm mù (địa chỉ rỗng, giỏ hàng rỗng, số âm). Tuy nhiên, AI quá máy móc khi gán tất cả là `CẦN LÀM RÕ` mà không dám đưa ra kỳ vọng giả định (VD: Giỏ rỗng thì dĩ nhiên phải fail). |

### 9.3 Ca và bug AI xử lý yếu / bỏ sót, và vì sao

| # | Vấn đề / Bug thực tế | Hạn chế của AI | Nhóm nguyên nhân |
| :-: | :--- | :--- | :--- |
| 1 | **BUG-02: Backend tin tưởng `total_amount` từ Client** | AI có sinh test case (DT-08, BL-01) nhưng AI mặc định tin rằng *nhà phát triển sẽ code đúng SRS* (backend tự tính). AI không lường được độ nghiêm trọng của lỗi này cho đến khi con người thực thi và bắt được Bug. | Tư duy "Happy-path" ngầm của AI đối với logic backend. |
| 2 | **BUG-03: Giỏ hàng không bị xóa sau khi Checkout** | AI bỏ quên hoàn toàn logic này ở các bước đầu tiên. Dù SRS ghi rành rành "giỏ hàng được xóa", AI không biến nó thành một "đầu ra cần quan sát" (Side-effect) nếu không bị ép ở Bước 7. | Hạn chế tự xâu chuỗi luồng dữ liệu (Data flow) giữa các API. |
| 3 | **BUG-04: Cho phép thanh toán đơn 0đ (Giỏ rỗng)** | AI nhận ra SRS không cấm giỏ rỗng (DT-29) nhưng lại xếp vào nhóm `CẦN LÀM RÕ`. Trong thực tế kiểm thử, tester sẽ đánh fail ngay lập tức (Critical Bug) vì phi logic nghiệp vụ. | Quá bám sát rập khuôn vào text của SRS, thiếu Common Sense (tri thức đời sống về e-commerce). |
| 4 | **Validation chuỗi lỏng lẻo (BUG-05)** | AI có test khoảng trắng, `null`, chuỗi rỗng nhưng không chốt kỳ vọng lỗi. | AI thận trọng quá mức. |

### 9.4 AI sai hoặc bịa (Nguyên liệu cho AI Critique)

- **Logic mâu thuẫn nội bộ về `total_amount`:** AI xác định đúng (theo SRS R4) là backend *bỏ qua* `total_amount` do client gửi lên. Nhưng ở các ca DT-10 (truyền số âm) hoặc DT-11 (truyền null), AI lại để kỳ vọng là `CẦN LÀM RÕ`. Nếu backend thực sự bỏ qua trường này, thì dù client có gửi số âm hay null, request vẫn phải Pass (200 OK) dựa trên tổng tiền giỏ hàng thực tế. Việc AI để `CẦN LÀM RÕ` chứng tỏ AI chưa thực sự hiểu bản chất của chữ "bỏ qua" (ignore payload).
- **Sinh ca kiểm thử không khả thi dạng Black-box:** AI đề xuất test ca `DT-06` (Token của tài khoản đã bị khóa/logout). Về mặt lý thuyết bảo mật là đúng, nhưng trong tài liệu API Bước 1 hoàn toàn không cung cấp API `/api/logout` hay API khóa tài khoản nào để setup trạng thái này.
- **Bịa thêm logic không có trong yêu cầu:** Ở Bước 7, AI tự biên tự diễn ca `BL-11` (Kiểm tra biến động tồn kho - Inventory Stock). Dù đây là tư duy tốt của một tester, nhưng nó vi phạm nghiêm ngặt rule "chỉ dùng thông tin trong SRS" đã giao ở prompt.

### 9.5 Các ca AI làm xuất sắc (Đáng ghi nhận)

- **Kiểm thử tính bất biến (Data Snapshot - BL-10):** Ở bước 7, AI đã tự nghĩ ra một kịch bản kinh điển trong E-commerce: *Nếu Admin đổi giá sản phẩm trên DB sau khi khách đã mua, lịch sử đơn hàng của khách có bị đổi theo không?* Đây là một ca test sâu sắc về Data Isolation và Snapshot mà tester con người đôi khi có thể bỏ sót.
- **Kiểm tra tính cách ly (Tenant Isolation - BL-09 / Lên bản cuối là BL-05):** AI thiết lập ca test User B cố gắng xem đơn hàng của User A. Rất chuẩn xác cho kiểm thử bảo mật API (IDOR).
- **Kịch bản XSS (DT-13):** AI chủ động dùng thẻ `<script>alert('XSS')</script>` vào trường `shipping_address` để verify yêu cầu SEC-04. (Và thực tế đã bắt được BUG-08).

### 9.6 Kết luận & Đề xuất cải tiến Prompt

**Điểm mạnh:** AI làm rất tốt việc cày xới các giá trị biên (BVA) và lập bảng tổ hợp các lỗi cơ bản (Auth, định dạng JSON).
**Điểm yếu:** 
1. Mù mờ về Side-effects (phải nhắc mới nhớ).
2. Quá ngây thơ, tin tưởng lập trình viên (không xoáy sâu vào các kịch bản backend lười validate).
3. Thiếu Common Sense về nghiệp vụ (không dám chốt lỗi giỏ hàng rỗng).

**Điều chỉnh Prompt cho các Feature tiếp theo:**
- **Thêm Rule về Common Sense:** *"Nếu SRS im lặng nhưng vi phạm logic đời thường nghiêm trọng (ví dụ: mua hàng không có sản phẩm, thanh toán số tiền âm), hãy tự động giả định đó là LỖI (4xx) thay vì CẦN LÀM RÕ."*
- **Thép Rule về Side-effects:** Ép AI ngay từ Bước 2 (Xác định biến) phải trả lời câu hỏi: *"Hành động này làm biến đổi dữ liệu ở những bảng/API nào khác?"* thay vì chờ đến Bước 7 mới hỏi.
- **Khuyến khích tư duy "Phá hoại" (Negative Thinking):** *"Hãy giả định Backend không tin cậy và lười validate. Hãy sinh các ca test cố tình lừa Backend bằng sai kiểu dữ liệu, thiếu trường bắt buộc."*