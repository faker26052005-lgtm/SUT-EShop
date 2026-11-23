---
marp: true
theme: default
paginate: true
header: "CS423 / CSC15003 — Software Testing · Seminar T06: API & Contract Testing"
footer: "Nhóm 11 — FIT@HCMUS — AI-Augmented API Testing (Agentic Workflow)"
style: |
  section {
    background-color: #ffffff;
    color: #111827;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 24px;
    padding: 36px 52px;
  }
  h1 {
    color: #0f172a;
    font-size: 34px;
    margin-bottom: 16px;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 8px;
  }
  h2 {
    color: #1e3a8a;
    font-size: 28px;
  }
  h3 {
    color: #1d4ed8;
    font-size: 22px;
    margin-top: 8px;
    margin-bottom: 6px;
  }
  table {
    font-size: 18px;
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    font-weight: bold;
  }
  td {
    border: 1px solid #cbd5e1;
    padding: 7px 10px;
  }
  code {
    background-color: #f1f5f9;
    color: #0f172a;
    font-family: 'Consolas', monospace;
    font-size: 19px;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 17px;
    line-height: 1.35;
  }
  .highlight-box {
    background-color: #f8fafc;
    border-left: 5px solid #2563eb;
    padding: 8px 16px;
    margin: 10px 0;
    border-radius: 0 6px 6px 0;
    font-size: 20px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
  }
  .card {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-top: 4px solid #2563eb;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 19px;
  }
  .card h3 {
    margin-top: 0;
    margin-bottom: 6px;
    font-size: 20px;
    color: #1e3a8a;
  }
  .card ul {
    margin: 0;
    padding-left: 18px;
  }
  .card li {
    margin-bottom: 5px;
    line-height: 1.3;
  }
  .card-red {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-top: 4px solid #dc2626;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 19px;
  }
  .card-red h3 {
    margin-top: 0;
    margin-bottom: 6px;
    font-size: 20px;
    color: #b91c1c;
  }
  .card-red ul {
    margin: 0;
    padding-left: 18px;
  }
  .card-red li {
    margin-bottom: 5px;
    line-height: 1.3;
  }
---

<!-- Slide 1: Tiếp Cận Kiểm Thử Bằng AI Agent -->

# 1. Kiểm Thử Với AI Agent: Từ Prompting Đến Agentic Workflow

Cách tiếp cận kiểm thử API bằng Trí tuệ Nhân tạo thế hệ mới: **Kiểm soát chặt chẽ thay vì phó mặc hoàn toàn cho AI**:

<div class="grid-2">
<div class="card">

### Giới hạn của Prompting thuần túy (Zero-shot)
* **Ảo giác nghiệp vụ (Hallucination):** AI tự bịa endpoint, tự đoán tham số và tự chế thông điệp lỗi không có thật.
* **Xanh giả (False Positive):** AI đọc code hiện tại của backend rồi viết test nắn theo lỗi của server, khiến báo cáo xanh nhưng hệ thống vẫn sai.
* **Mất kiểm soát:** Không có tính truy vết (Traceability), không có cơ chế rà soát dữ liệu mẫu, dễ phá hỏng CSDL khi chạy.

</div>
<div class="card">

### Giải pháp: Agentic Workflow với Skill chuyên biệt
* **Tự động hóa theo quy trình (`api-test-design`):** Ép AI tuân thủ nghiêm ngặt các pha làm việc và tiêu chuẩn kiểm thử.
* **Độc lập với mã nguồn:** Kỳ vọng chỉ được phép rút ra từ tài liệu gốc (`srs.md` và `openapi.yaml`), tuyệt đối không đọc code backend.
* **Human-in-the-Loop:** Con người giữ vai trò phê duyệt then chốt trước khi AI sinh mã kịch bản và thực thi trên SUT.

</div>
</div>

<div class="highlight-box">
💡 <b>Mục tiêu cốt lõi:</b> Dùng AI để tìm ra lỗi thật của hệ thống dựa trên đặc tả SRS, không nắn test theo hành vi hiện tại của code!
</div>

<!--
Ghi chú thuyết trình:
- Mở đầu bằng sự khác biệt giữa hai cách làm: Hỏi đáp ChatGPT thông thường (prompting) vs Hệ thống AI Agentic có định hướng (workflow-driven).
- Nêu rõ vấn đề lớn nhất của AI trong testing: AI có xu hướng đọc code backend rồi viết assertion theo code backend, khiến test luôn Pass giả.
- Giới thiệu triết lý Human-in-the-loop: Tận dụng tốc độ sinh mã của AI nhưng đặt dưới sự giám sát và phê duyệt nghiêm ngặt của kỹ sư QA.
-->

---

<!-- Slide 2: Kiến Trúc Bộ Skill & Quy Trình 3 Pha -->

# 2. Bộ Skill `api-test-design` & Quy Trình Có Kiểm Soát

Kiến trúc quy trình 3 Pha với **2 Điểm dừng bắt buộc (Gateways)** do Kỹ sư QA phê duyệt:

<div class="grid-2">
<div>

### Ba pha thực thi của AI Agent
* **Pha 0 — Kiểm tra môi trường (`doctor.py`):**
  * Tự động rà soát Python 3.9+, Java 17, Karate JAR, Node.js và tính toàn vẹn của thư mục `inputs/`.
* **Pha A — Phân tích đặc tả & Lập Test Matrix:**
  * Bóc tách SRS thành các quy tắc nguyên tử (Atomic Rules).
  * Lập ma trận kiểm thử phủ đủ 6 nhóm ca (Đường đúng, Biên, Dữ liệu sai, Nghiệp vụ, Bảo mật, Trạng thái).
* **Pha B — Sinh mã kịch bản Karate Framework:**
  * Tự động sinh `features/*.feature` dựa trên các ca được duyệt; kiểm soát chất lượng bằng `check_coverage.py`.
* **Pha C — Thực thi & Phân tích lỗi (`result.md`):**
  * Chạy qua `run_karate.py`, phân loại nguyên nhân gốc (`HT?` lỗi hệ thống, `KY?` kỳ vọng sai, `MT?` môi trường).

</div>
<div>

### Hai Điểm dừng kiểm soát (Gateways)
```text
  [inputs/] -> srs.md, openapi.yaml, sample-data.md
      │
  [Pha A] Sinh Test Matrix (Traceability 1-1)
      │
  🛑 ĐIỂM DỪNG 1: QA Review & Duyệt Ma Trận (Y / S / N)
      │
  [Pha B] Sinh Feature Karate (check_coverage.py: 0 Lỗi)
      │
  🛑 ĐIỂM DỪNG 2: Reset SUT Server & Lệnh "Chạy"
      │
  [Pha C] Chạy Karate -> Báo cáo summary.md & result.md
```

* **Quyền lực của QA:** Agent chỉ viết code cho ca được đánh dấu `Y` hoặc `S`; ca `N` bị loại bỏ hoàn toàn khỏi kịch bản.

</div>
</div>

<div class="highlight-box">
⚙️ <b>Kiểm soát chất lượng hai lớp:</b> Phê duyệt ma trận trước khi code + Reset máy chủ trước khi chạy.
</div>

<!--
Ghi chú thuyết trình:
- Trình bày lưu đồ 3 pha khép kín. Nhấn mạnh 2 điểm dừng (Stop gates).
- Điểm dừng 1 ngăn chặn AI sinh code rác: Con người xem ma trận, chỉnh sửa kỳ vọng, loại bỏ ca không cần thiết trước khi cho AI viết code.
- Điểm dừng 2 đảm bảo môi trường sạch: Máy chủ EShop phải được khởi động lại để CSDL về trạng thái seed chuẩn trước khi chạy test.
-->

---

<!-- Slide 3: Thực Nghiệm Run 01 & Test Matrix -->

# 3. Thực Nghiệm Run 01: Phạm Vi FR-09 & Traceability Matrix

Áp dụng thực chiến trên phân hệ **FR-09: Mã giảm giá (Coupons)** và các API quản trị liên quan:

| Tiêu chí | Thông số thực tế Run 01 (`run-01-coupon`) |
|---|---|
| **Phạm vi khảo sát** | **5 Endpoints:** `POST /api/apply-coupon`, `POST /api/coupon-usage`, `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/{id}` |
| **Quy tắc nguyên tử** | **29 quy tắc (R01 – R13d):** Bóc tách độc lập từ SRS FR-09, FR-12 và OpenAPI specs |
| **Tổng số ca đề xuất** | **28 ca kiểm thử (CP01 – CP28):** Phủ toàn diện 6 nhóm kiểm thử chuẩn mực |
| **Kết quả phê duyệt** | **20 ca Duyệt nguyên bản (`Y`) · 7 ca Chỉnh sửa (`S`) · 1 ca Loại bỏ (`N`) · 1 ca Bổ sung (`[THÊM]`)** |
| **Chất lượng kiểm tra** | Script `check_coverage.py` xác nhận: **Sạch 100% lỗi cú pháp và 0 cảnh báo** |
| **Thời gian thực hiện** | Hoàn thành toàn bộ ma trận và bộ 27 kịch bản kiểm thử trong **dưới 10 phút** |

<div class="highlight-box">
📋 <b>Ma trận truy vết (Traceability Matrix):</b> Mỗi ca kiểm thử đều gắn chặt với đúng 1 quy tắc đặc tả và 1 thẻ ID duy nhất (`@CPxx`).
</div>

<!--
Ghi chú thuyết trình:
- Giới thiệu phạm vi Run 01: Kiểm thử toàn diện module Coupon từ góc độ người dùng (Checkout, Apply, Usage) đến góc độ Admin (CRUD Coupon).
- Giải thích 7 ca 'S' (Chỉnh sửa): Con người chủ động chỉnh sửa kỳ vọng để siết chặt điều kiện biên, cô lập dữ liệu và bổ sung ca kiểm tra token sai định dạng (CP28).
- Nhấn mạnh ca CP16 được đánh dấu 'N' (Loại bỏ) vì tài liệu OpenAPI không định nghĩa hành vi khi coupon_id không tồn tại -> tránh việc AI suy đoán lung tung.
-->

---

<!-- Slide 4: Kỹ Thuật Viết Test Của AI Agent -->

# 4. Kỹ Thuật Viết Test Của AI: Cô Lập Âm Tính & An Toàn Dữ Liệu

Bộ skill áp đặt các nguyên tắc thiết kế kịch bản tự động hóa cấp cao, loại trừ hoàn toàn lỗi phụ:

<div class="grid-2">
<div class="card">

### 1. Cô lập ca âm tính (Single Fault Isolation)
* Khi kiểm thử dữ liệu sai (ví dụ: `total_amount` âm ở CP12), nếu dùng mã có sẵn với ngưỡng 300k thì hệ thống sẽ từ chối vì chưa đủ ngưỡng $\rightarrow$ **Xanh giả!**
* **Giải pháp của AI:** Tự tạo mã tạm có `min_order_amount = -1.000.000`, áp thử số tiền âm rồi dọn dẹp $\rightarrow$ Đảm bảo ca chỉ rớt vì đúng lý do số âm!

### 2. Cách ly tài khoản mẫu & Dữ liệu tạm
* Tuyệt đối không dùng tài khoản mẫu (`test@eshop.com`) cho các ca ghi nhận lượt dùng (CP08, CP09, CP13).
* Gọi `helpers/create-user.feature` tự sinh user động `tmp_user_<timestamp>@eshop.com` để thử nghiệm.

</div>
<div class="card">

### 3. Chuẩn hóa nội suy biến JSON (`'#(var)'`)
* Karate không nội suy tên biến trần trong JSON payload.
* Toàn bộ tham số nhúng đều bọc cú pháp nghiêm ngặt:  
  `request { code: '#(tmpCode)', user_id: '#(u.id)' }`

### 4. Dọn dẹp an toàn trước khi kiểm tra (Safe Cleanup)
* Trong ca xóa/sửa (CP20, CP25, CP26), lưu mã trạng thái vào biến `delStatus = responseStatus`, thực hiện lệnh dọn dẹp, **rồi mới assert**.
* Tránh hiện tượng rác CSDL tồn đọng khi một bước kiểm thử bị gãy giữa chừng.

</div>
</div>

<div class="highlight-box">
🛡️ <b>Kỷ luật kiểm thử nghiêm ngặt:</b> Không để lại rác dữ liệu và không tạo ra các ca Pass giả do trùng lặp điều kiện.
</div>

<!--
Ghi chú thuyết trình:
- Phân tích kỹ thuật cô lập lỗi ở CP12: Đây là kỹ thuật kiểm thử rất sâu mà tester con người đôi khi bỏ qua. Nếu không tạo mã có ngưỡng âm, test sẽ pass vì lỗi ngưỡng chứ không phải vì bắt được số âm.
- Nhấn mạnh quy tắc dọn dẹp (cleanup): Karate dừng ngay khi gặp assertion fail, nếu để lệnh dọn dẹp ở cuối thì khi test đỏ dữ liệu rác sẽ vĩnh viễn nằm lại trong SQLite.
-->

---

<!-- Slide 5: Kết Quả Thực Thi Run 01 Trên SUT Thật -->

# 5. Kết Quả Thực Thi: 17 Xanh · 10 Đỏ Trên SUT EShop

Karate 1.5.2 thực thi toàn bộ **27 kịch bản trong 3.24 giây**, bóc trần hàng loạt lỗi tiềm ẩn:

<div class="grid-2">
<div>

### Thống kê thực thi trên SUT thật
* **Tổng số ca thực thi:** **27 scenarios** (bỏ qua ca `@slow`, loại bỏ CP16).
* **Kết quả chung:** **17 Xanh (Passed) · 10 Đỏ (Failed)**.
* **Thời gian thực thi:** **3.24 giây** (tốc độ cao, tối ưu cho CI/CD).
* **Phân loại nguyên nhân:** 100% (10/10) ca đỏ đều được xác nhận là **Lỗi hệ thống thật của SUT (`HT?`)**, không có lỗi script do test sai!

### Hiện tượng "HTTP 200 che giấu lỗi"
* Tương tự Postman, **7/10 ca đỏ** của Run 01 đều có phản hồi **HTTP 200 OK** từ backend!
* Nếu chỉ kiểm tra status code, cả 7 khiếm khuyết nghiêm trọng này đều bị bỏ lọt hoàn toàn.

</div>
<div>

### Phát hiện chấn động: Lỗ hổng RBAC toàn diện
Kiểm thử tự động vạch trần hệ thống phân quyền bị vô hiệu hóa tại toàn bộ các endpoint Coupon Admin:

* 🔓 **User thường xem được danh sách mã Admin:**  
  `GET /api/coupons` với `userToken` trả về `200 OK` (CP19 đỏ, kỳ vọng 403).
* 🔓 **User thường tạo được mã giảm giá Admin:**  
  `POST /api/admin/coupons` với `userToken` tạo thành công coupon vào CSDL (CP22 đỏ, kỳ vọng 403).
* 🔓 **User thường xóa được mã giảm giá Admin:**  
  `DELETE /api/admin/coupons/{id}` với `userToken` xóa thành công coupon (CP26 đỏ, kỳ vọng 403).

</div>
</div>

<div class="highlight-box">
⚠️ <b>Kết luận an ninh:</b> Backend có middleware xác thực đăng nhập nhưng <b>quên hoàn toàn middleware kiểm tra vai trò (Role Check)!</b>
</div>

<!--
Ghi chú thuyết trình:
- Công bố số liệu thực nghiệm: 17 Passed, 10 Failed.
- Nhấn mạnh: Cả 10 ca đỏ đều là lỗi thật của SUT, chứng tỏ năng lực sinh test cực kỳ chuẩn xác của AI khi được trang bị skill và quy trình chặt chẽ.
- Chỉ ra lỗ hổng bảo mật nghiêm trọng: User thường có đầy đủ quyền hạn của Admin đối với module Coupon.
-->

---

<!-- Slide 6: Bốn Lỗi Tiêu Biểu Bị AI Vạch Trần -->

# 6. Bốn Lỗi Tiêu Biểu: Khi AI Bắt Lỗi SUT EShop

Minh chứng 4 lỗi nghiêm trọng nhất của SUT được phát hiện độc lập qua kịch bản Karate của Agent:

<div class="grid-2">
<div class="card-red">

### 🔴 Lỗi CP01: Tính giảm giá âm (Mức Cao)
* **API:** `POST /api/apply-coupon` · **HTTP:** `200 OK`
* **Kỳ vọng SRS:** Đơn 500.000 ₫ giảm 10% (`SAVE10`) $\rightarrow$ Giảm 50.000 ₫, phải trả 450.000 ₫.
* **Thực tế SUT:** `discount_amount: -4500000`, `final_amount: 5000000` (giảm âm 4.5 triệu, tiền tăng gấp 10 lần!).
* **Trùng khớp:** Hoàn toàn khớp với lỗi **B4** mà Postman đã ghi nhận.

### 🔴 Lỗi CP03: Sai lệch giá trị biên (Mức Trung bình)
* **API:** `POST /api/apply-coupon` · **HTTP:** `400 Bad Request`
* **Kỳ vọng SRS:** Điều kiện C3 ghi rõ: Tổng đơn **>= (lớn hơn hoặc bằng)** ngưỡng 300.000 ₫ $\rightarrow$ Đơn đúng 300.000 ₫ phải được chấp nhận (200).
* **Thực tế SUT:** Bị từ chối 400 báo *"chưa đủ giá trị tối thiểu"*. Backend dùng so sánh lớn hơn hẳn (`>`) thay vì `>=`.

</div>
<div class="card-red">

### 🔴 Lỗi CP07: Bỏ qua xác thực C4 (Mức Cao)
* **API:** `POST /api/apply-coupon` · **HTTP:** `200 OK`
* **Kỳ vọng SRS:** Điều kiện C4: *"Đã đăng nhập: Người dùng phải có JWT Token hợp lệ"* $\rightarrow$ Không có token phải trả 401.
* **Thực tế SUT:** Không gửi Authorization header nhưng server vẫn trả về 200 thành công!
* **Nguyên nhân:** Backend làm theo OpenAPI (`security: []`) mà quên yêu cầu của SRS.

### 🔴 Lỗi CP22: Leo quyền tạo Coupon (Mức Cao)
* **API:** `POST /api/admin/coupons` · **HTTP:** `200 OK`
* **Kỳ vọng SRS:** FR-12 yêu cầu chỉ Admin mới có quyền tạo mã $\rightarrow$ User thường phải nhận `403 Forbidden`.
* **Thực tế SUT:** Đăng nhập tài khoản User thường gửi request tạo mã $\rightarrow$ Server tạo thành công và trả về `id: 7`!

</div>
</div>

<div class="highlight-box">
🎯 Các lỗi được phát hiện hoàn toàn độc lập thông qua việc đối chiếu đặc tả SRS và OpenAPI!
</div>

<!--
Ghi chú thuyết trình:
- Đi sâu vào 4 case study thực tế:
  + CP01 là lỗi logic toán học tai hại.
  + CP03 là lỗi biên kinh điển (Off-by-one bug).
  + CP07 là sự xung đột giữa tài liệu OpenAPI và SRS mà AI đã phát hiện ra.
  + CP22 là lỗi leo quyền nghiêm trọng nhất (Privilege Escalation).
- Nhấn mạnh: AI không hề được nạp sẵn danh sách bug, toàn bộ lỗi được phát hiện nhờ các assertion viết chuẩn theo SRS!
-->

---

<!-- Slide 7: Kết Luận & Định Vị Vai Trò Human-In-The-Loop -->

# 7. Kết Luận: Vai Trò Cốt Lõi Của Human-In-The-Loop

Bài học thực tiễn rút ra từ mô hình cộng tác giữa **Kỹ sư QA** và **AI Agent** trong kiểm thử phần mềm:

<div class="grid-2">
<div>

### Ba bài học cốt lõi từ thực nghiệm
1. **AI là công cụ tăng tốc vượt trội:**
   * Tiết kiệm **~70% thời gian** viết boilerplate code, JSON schema, curl commands và kịch bản Karate.
   * Tính toán công thức số học chính xác và bao phủ giá trị biên tốt hơn con người làm thủ công.
2. **Kỳ vọng phải độc lập với mã nguồn:**
   * Tuyệt đối không cho AI đọc code backend khi sinh test. Kỳ vọng bắt buộc phải lấy từ tài liệu đặc tả (SRS/OpenAPI).
3. **Bộ skill đóng vai trò "hàng rào bảo vệ" (Guardrails):**
   * Ngăn ngừa AI sinh assertion lỏng lẻo (`!= null`, `#string`) và buộc AI phải cách ly dữ liệu tạm an toàn.

</div>
<div>

### Định vị vai trò: Human-in-the-Loop là bắt buộc
* **AI không thay thế Kỹ sư QA:**
  * AI không thể tự quyết định khi tài liệu có mâu thuẫn hoặc mơ hồ (như ca CP16 hay việc ưu tiên SRS trước OpenAPI).
  * Con người bắt buộc phải là chốt chặn phê duyệt ma trận (Review Gate) để thẩm định tính đúng đắn của ca kiểm thử.
* **Sự chuyển dịch vai trò của Tester:**
  * Kỹ sư QA chuyển từ việc gõ kịch bản thủ công sang vai trò **Kiến trúc sư kiểm thử (Test Architect)**: Đặt ra quy tắc, thiết lập ràng buộc và đánh giá rủi ro.

</div>
</div>

<div class="highlight-box">
🤝 <b>Mô hình cộng tác tối ưu:</b> Kỹ sư QA định hướng & phê chuẩn + AI Agent phân tích đặc tả & sinh mã tự động.
</div>

<!--
Ghi chú thuyết trình:
- Đúc kết thông điệp kết thúc của phần thuyết trình AI:
  + AI rất mạnh, rất nhanh (sinh 27 ca test chuẩn chỉnh trong vài phút).
  + Nhưng AI không có tư duy phản biện nghiệp vụ: Nếu tài liệu sai hoặc mơ hồ, AI sẽ bị kẹt hoặc đoán mò.
- Khẳng định tương lai của nghề QA: Kỹ sư kiểm thử không bị thay thế, mà được nâng tầm thành người kiến tạo và kiểm duyệt quy trình tự động hóa với sự trợ giúp của AI Agents.
-->
