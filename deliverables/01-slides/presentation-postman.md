---
marp: true
theme: default
paginate: true
header: "CS423 / CSC15003 — Software Testing · Seminar T06: API & Contract Testing"
footer: "Nhóm 11 — FIT@HCMUS — Postman & Newman API Testing"
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

<!-- Slide 1: Bốn Tầng Kiểm Thử API -->

# 1. Kiểm Thử API: Bốn Tầng Cần Kiểm Tra

Một API có thể dễ dàng vượt qua **Tầng 1 (HTTP 200 OK)** nhưng vẫn **hỏng hoàn toàn ở 3 tầng còn lại**:

<div class="grid-2">
<div class="card">

### Tầng 1 — Mã trạng thái HTTP (Status Code)
* Kiểm tra cơ bản: Server có phản hồi đúng mã `200`, `201`, `400`, `401`, `403`, `404` hay không.
* **Cạm bẫy:** Mã 200 chỉ xác nhận kết nối thành công, không chứng minh dữ liệu bên trong là đúng.

### Tầng 2 — Cấu trúc dữ liệu (Data Schema)
* Kiểm tra định dạng JSON, sự hiện diện của các trường bắt buộc (`id`, `name`, `price`, `token`).
* Đảm bảo kiểu dữ liệu nhất quán (ví dụ: `price` phải là `number`, không được lúc số lúc chuỗi).

</div>
<div class="card">

### Tầng 3 — Quy tắc nghiệp vụ (Business Rules)
* Logic tính toán: Tổng tiền đơn hàng, trừ tỷ lệ mã giảm giá, tính giá trị tối thiểu (`min_order_amount`).
* Luồng trạng thái: Chuyển đổi trạng thái đơn (`pending` $\rightarrow$ `confirmed` $\rightarrow$ `shipping` $\rightarrow$ `delivered`), kiểm soát tồn kho và giới hạn lượt dùng mã.

### Tầng 4 — An toàn & Bảo mật (Security & Auth)
* Xác thực & Phân quyền (RBAC): User không được gọi API Admin, không tự đổi `role`.
* Bảo vệ dữ liệu nhạy cảm: Tuyệt đối không rò rỉ `password`, `reset_token`; ngăn ngừa SQL Injection.

</div>
</div>

<div class="highlight-box">
💡 <b>Luận điểm cốt lõi:</b> Kiểm thử API không bao giờ được dừng lại ở việc kiểm tra HTTP Status Code!
</div>

<!--
Ghi chú thuyết trình:
- Mở đầu bằng cách chỉ ra thói quen sai lầm phổ biến: nhiều tester chỉ viết pm.response.to.have.status(200) rồi kết luận API đạt.
- Giải thích mô hình 4 tầng: Tầng 1 (Transport), Tầng 2 (Contract/Schema), Tầng 3 (Domain Logic), Tầng 4 (Security).
- Nhấn mạnh: Thực nghiệm trên EShop cho thấy 38/38 request đều trả về HTTP 200, nhưng bên dưới chứa đến 42 khiếm khuyết nghiệp vụ và bảo mật.
-->

---

<!-- Slide 2: Bốn Khối Chức Năng Postman Nhóm Sử Dụng -->

# 2. Postman: Bốn Khối Chức Năng Cốt Lõi

Nhóm khai thác Postman như một **Nền tảng Tự động hóa Toàn diện** thay vì công cụ GUI thủ công:

<div class="grid-2">
<div class="card">

### 1. Collection & Xác thực phân tầng
* Tổ chức API mạch lạc theo từng phân hệ nghiệp vụ: `Auth`, `Products`, `Cart`, `Orders`, `Coupons`, `Admin`.
* Cấu hình Bearer Token ở cấp Collection (`{{userToken}}`); toàn bộ request con tự động kế thừa xác thực.

### 2. Biến số & Chained Token
* Quản lý biến linh hoạt qua Collection Variables (`baseUrl`, `userToken`, `adminToken`, `orderId`).
* **Chained Token:** Tự động trích xuất JWT từ response Login và truyền vào các request tiếp theo mà không cần copy-paste thủ công.

</div>
<div class="card">

### 3. Assertions theo SRS (`pm.test`)
* Viết kịch bản kiểm thử Chai.js BDD theo **hành vi mong đợi của đặc tả (SRS)**, không chạy theo code lỗi hiện tại của SUT.
* **Nguyên tắc vàng:** Assertion đỏ nghĩa là hệ thống có lỗi lệch đặc tả, biến bộ test thành Living Specification.

### 4. Runner & Kiểm thử Một Lần Send
* Hỗ trợ thực thi hàng loạt với Newman CLI / Collection Runner.
* Đột phá với request `00 RUN ALL`: Sử dụng `pm.sendRequest` chạy toàn bộ 229 lượt gọi kiểm thử chỉ bằng **một lần bấm Send duy nhất**.

</div>
</div>

<div class="highlight-box">
⚙️ Khung kiểm thử chuẩn mực: Chained Token thông suốt + Assertions hướng đặc tả SRS.
</div>

<!--
Ghi chú thuyết trình:
- Trình bày 4 vũ khí chính mà nhóm thiết lập trên Postman.
- Nhấn mạnh điểm 3: Khác biệt quan trọng nhất trong tư duy kiểm thử của nhóm là viết assertion theo SRS (System Requirement Specification). Nếu SUT làm sai, test phải đỏ để chỉ ra bug, tuyệt đối không sửa assertion để "làm đẹp" báo cáo.
- Giới thiệu request 00 RUN ALL giúp demo cực nhanh trong 4 giây mà không cần cấu hình Runner phức tạp.
-->

---

<!-- Slide 3: SUT EShop & Hai Collection Kiểm Thử -->

# 3. SUT EShop & Kiến Trúc Hai Postman Collection

Phạm vi khảo sát: **30 endpoint theo đặc tả** + **1 endpoint thực tế app Mobile đang gọi** (`POST /api/coupon-usage`):

| Tiêu chí | Collection chính (`v3.1`) | Bộ test tổng hợp (`all_tests`) |
|---|---|---|
| **File minh chứng** | `tests/postman/collections/eshop_api_postman_collection_v3.1.json` | `tests/postman/collections/eshop_api_all_tests.postman_collection.json` |
| **Mục tiêu cốt lõi** | Khảo sát chi tiết từng endpoint, lưu response mẫu (Examples), kiểm thử luồng có trạng thái & Data-driven CSV | Kiểm chứng hồi quy toàn diện, quét sạch 42 lỗi SUT & bảo mật, tự động tạo và dọn dẹp dữ liệu |
| **Cấu trúc kịch bản** | **68 requests** (38 request chính + 28 request thư mục Errors + 2 request Data-driven) | **1 request duy nhất (`00 RUN ALL`)**, bên trong kích hoạt chuỗi 201 lệnh `pm.sendRequest` |
| **Lượt gọi (Newman)** | **68 requests** | **229 requests** (bao gồm request kích hoạt và các cuộc gọi con) |
| **Tổng số Assertions** | **130 assertions** | **131 assertions** |
| **Kết quả thực tế** | **18 Đỏ (Failed) · 112 Xanh (Passed)** | **68 Đỏ (Failed) · 63 Xanh (Passed)** |
| **Cách chạy** | Chạy từng request tuần tự, Runner, hoặc Newman | Bấm **Send** 1 lần duy nhất trong Postman hoặc Newman CLI |

<!--
Ghi chú thuyết trình:
- Giải thích vì sao nhóm xây dựng 2 collection song song:
  + Collection v3.1: Dành cho lập trình viên và kiểm thử viên khám phá hệ thống, có lưu sẵn response mẫu (examples) cho từng request làm tài liệu sống (living documentation).
  + Collection all_tests: Tối ưu cho kiểm thử hồi quy tốc độ cao. Toàn bộ logic gói gọn trong 1 request, tự tạo user/data tạm thời và tự dọn dẹp (cleanup) khi chạy xong.
- Nêu rõ số liệu đã được xác thực chính xác trên SUT thật bằng Newman CLI.
-->

---

<!-- Slide 4: Vòng Đời Request & Cơ Chế Chained Token -->

# 4. Vòng Đời Request & Cơ Chế Chained Token Tự Động

Mỗi request trong Postman trải qua chu trình 4 giai đoạn khép kín, đảm bảo phiên làm việc liên tục:

<div class="grid-2">
<div>

### Chu trình 4 bước của một Request
1. **Pre-request Script:**
   * Sinh dữ liệu động (timestamp, email ngẫu nhiên).
   * Ví dụ: `pm.collectionVariables.set("newUserEmail", "user" + Date.now() + "@test.com");`
2. **Gửi HTTP Request:**
   * Tự động đính kèm `Bearer {{userToken}}` kế thừa từ Collection Header.
3. **Nhận HTTP Response:**
   * Nhận Payload, Headers và Status Code từ backend SUT.
4. **Tests Script & Assertions:**
   * Kiểm tra mã trạng thái, JSON Schema và SLA thời gian.
   * Trích xuất ID / Token lưu vào biến cho các bước sau.

</div>
<div>

### Cơ chế Token Chaining tự động
```javascript
// Tại Tests Script của Request "Login User":
pm.test("Status 200 & lưu token", function () {
    pm.response.to.have.status(200);
    var res = pm.response.json();
    pm.expect(res.token).to.be.a("string");
    // Lưu token vào biến Collection
    pm.collectionVariables.set("userToken", res.token);
});

// Các request tiếp theo (Cart, Checkout):
// Header tự động nhận: Authorization: Bearer {{userToken}}
```

* **Lợi ích:** Toàn bộ luồng `Login` $\rightarrow$ `Add Cart` $\rightarrow$ `Checkout` $\rightarrow$ `Get Orders` vận hành tự động 100%, không cần can thiệp thủ công.

</div>
</div>

<!--
Ghi chú thuyết trình:
- Minh họa trực quan vòng đời xử lý request: Postman không chỉ bắn request đơn lẻ mà là một máy ảo JavaScript hoàn chỉnh.
- Làm rõ cơ chế Token Chaining: Chỉ cần chạy Login một lần, token tự động chảy qua các request sau thông qua biến userToken.
- Nhấn mạnh rằng điều này loại bỏ hoàn toàn việc copy-paste token thủ công giữa các request.
-->

---

<!-- Slide 5: Kết Quả Kiểm Thử Sơ Bộ & Phân Loại Lỗi -->

# 5. Kết Quả Kiểm Thử Sơ Bộ & Phân Loại 42 Lỗi SUT

Toàn bộ **38/38 request chính của luồng nghiệp vụ đều trả về HTTP 200**, che giấu hàng loạt khiếm khuyết:

<div class="grid-2">
<div>

### Thống kê thực thi trên SUT thật
* **Collection chính (`v3.1`):** **18 Đỏ / 130 Assertions** (112 Xanh) trên 68 requests.
* **Bộ test tổng hợp (`all_tests`):** **68 Đỏ / 131 Assertions** (63 Xanh) trên 229 requests.
* **Tự động hóa CI/CD:** Tích hợp pipeline GitHub Actions qua `.github/workflows/postman-ci.yml`, xuất báo cáo HTML Extra tự động.

### Hiện tượng 38/38 Request trả HTTP 200
* Kể cả khi không có Token hoặc truy cập tài nguyên bị cấm, backend vẫn trả mã 200 OK.
* Nhờ các assertions ngữ nghĩa theo SRS, Postman đã vạch trần toàn bộ các lỗi tiềm ẩn này.

</div>
<div>

### Phân loại 42 Lỗi (B1 – B42) & 3 Ghi nhận
* 🔴 **10 Lỗi Mức Cao (High):**
  * Lộ mật khẩu plaintext (B1, B2); Tính sai giảm giá (B4); Leo quyền Admin (B5, B15); Bỏ qua Auth (B6, B8); Thanh toán giỏ rỗng (B13); SQL Injection (B17); Bỏ qua phân quyền API Admin (B24).
* 🟡 **22 Lỗi Mức Trung Bình (Medium):**
  * Đăng ký trùng email (B9); Giá kiểu String (B3); Client thao túng giá giỏ hàng (B19); Giỏ hàng không xóa sau checkout (B20); Vi phạm chuyển đổi trạng thái đơn (B21, B22, B23); Import lỗi không rollback (B32)...
* 🟢 **10 Lỗi Mức Thấp (Low):**
  * Không tìm thấy sản phẩm trả 200 `{}` (B7); Nhận body rác (B18); Khóa tài khoản sai ngưỡng (B27); Lộ lỗi DB 500 (B29)...
* 🛡️ **3 Ghi nhận bảo mật:** JWT thiếu hạn `exp` (O2), Secret Key lộ mã nguồn (O3), Thông điệp coupon hết hạn (O4).

</div>
</div>

<!--
Ghi chú thuyết trình:
- Nhấn mạnh con số ấn tượng: 42 lỗi hệ thống đã được nhóm phát hiện, phân loại và lập bảng minh chứng chi tiết.
- Nêu rõ sự đối lập gay gắt: 38/38 request đều trả HTTP 200, nhưng tỷ lệ assertion đỏ lên tới 18/130 (bộ chính) và 68/131 (bộ tổng hợp).
- Bổ sung thông tin: Bộ test này hiện đã được tích hợp chạy tự động trên GitHub Actions CI (postman-ci.yml).
-->

---

<!-- Slide 6: Bốn Lỗi SUT Tiêu Biểu Bị Phát Hiện -->

# 6. Bốn Lỗi Tiêu Biểu: Khi HTTP 200 Che Giấu Khiếm Khuyết

Minh chứng trực quan 4 khiếm khuyết nghiêm trọng nhất của hệ thống SUT được Postman vạch trần:

<div class="grid-2">
<div class="card-red">

### 🔴 Lỗi B1: Đăng nhập lộ mật khẩu (Mức Cao)
* **API:** `POST /api/login` · **HTTP thực tế:** `200 OK`
* **Triệu chứng:** Response trả về object `user` chứa nguyên vẹn trường `password: "Test1234!"` (và cả `Admin123!`) dạng chữ rõ!
* **Vi phạm SRS:** FR-01, SEC-01 cấm tuyệt đối trả mật khẩu trong response. Kiểm tra HTTP Status hoàn toàn không bắt được lỗi này.

### 🔴 Lỗi B4: Tính giảm giá âm (Mức Cao)
* **API:** `POST /api/apply-coupon` · **HTTP thực tế:** `200 OK`
* **Triệu chứng:** Đơn hàng **1.000.000 ₫** áp mã `SAVE10` (giảm 10%). Kỳ vọng: giảm 100.000 ₫, phải trả 900.000 ₫.
* **Thực tế SUT:** Trả về `discount_amount: -9000000`, thành tiền `final_amount: 10000000` (giảm âm 9 triệu, tiền tăng gấp 10 lần!).

</div>
<div class="card-red">

### 🔴 Lỗi B5: Thiếu phân quyền Admin (Mức Cao)
* **API:** `GET /api/admin/users` · **HTTP thực tế:** `200 OK`
* **Triệu chứng:** Đăng nhập bằng tài khoản User thường (`role: user`), sau đó gọi API lấy toàn bộ danh sách người dùng.
* **Thực tế SUT:** Backend trả trọn vẹn danh sách user kèm email, quyền hạn; hoàn toàn không chặn `403 Forbidden` (vi phạm SEC-03).

### 🔴 Lỗi B17: Lỗ hổng SQL Injection (Mức Cao)
* **API:** `GET /api/products?search=...` · **HTTP:** `200 / 500`
* **Triệu chứng:** Backend nối chuỗi SQL trực tiếp:  
  `WHERE name LIKE '%${searchQuery}%'`
* **Thực tế SUT:** Truyền `'` làm sập server trả lỗi HTML 500; truyền `zzz' OR 1=1 --` bị bypass trả về toàn bộ sản phẩm (vi phạm SEC-05).

</div>
</div>

<div class="highlight-box">
⚠️ <b>Cả B1, B4, B5 đều trả HTTP 200!</b> Nếu chỉ kiểm tra status code, cả 3 lỗi nghiêm trọng này đều bị bỏ lọt.
</div>

<!--
Ghi chú thuyết trình:
- Phân tích chi tiết từng ca lỗi:
  + B1 là lỗi an ninh cơ bản nhưng cực kỳ nguy hiểm.
  + B4 là lỗi tính toán logic phần trăm: công thức backend bị nhân nhầm khiến người mua bị tính tiền gấp 10 lần mà HTTP vẫn trả 200.
  + B5 cho thấy hệ thống chỉ kiểm tra token hợp lệ chứ không kiểm tra Role của token.
  + B17 là lỗ hổng Injection kinh điển do cộng chuỗi SQL thô.
- Nhắc lại: Kiểm tra status code = xanh (Pass giả). Chỉ có assertion sâu vào thân JSON mới bắt được lỗi thực tế!
-->

---

<!-- Slide 7: Kết Luận & Định Vị Vai Trò Công Cụ -->

# 7. Kết Luận: Bài Học Thực Tiễn & Giới Hạn Của Postman

Ba bài học cốt lõi từ thực nghiệm kiểm thử API EShop và định vị vị trí của Postman trong chiến lược QA:

<div class="grid-2">
<div>

### Ba bài học rút ra từ thực nghiệm
1. **Mã trạng thái HTTP là chưa đủ:**
   * Cần kiểm tra đa tầng: Schema validation, giá trị nghiệp vụ, và quyền truy cập.
   * Status 200 có thể che giấu lỗi tính tiền âm hoặc lộ mật khẩu.
2. **Assertions biến bộ test thành Living Spec:**
   * Viết assertions bám sát SRS biến bộ test Postman thành **đặc tả chạy được (Executable Specification)**.
   * Tự động phát hiện ngay khi backend bị lệch chuẩn nghiệp vụ.
3. **Tự động hóa hoàn toàn trên CI/CD:**
   * Tích hợp Newman CLI vào GitHub Actions (`.github/workflows/postman-ci.yml`) đảm bảo kiểm tra hồi quy liên tục mỗi lần push code.

</div>
<div>

### Định vị khách quan & Giới hạn công cụ
* **Ưu thế vượt trội của Postman:**
  * Khám phá API nhanh chóng, tài liệu hóa trực quan, tạo response mẫu (mock examples), dễ sử dụng cho toàn team.
* **Những hạn chế cố hữu:**
  * **Chạy thủ công:** Chạy tay phụ thuộc giao diện; cần Newman CLI để chạy headless trong CI/CD.
  * **Không bắt được API Drift với Mobile:** Postman đứng từ phía server kiểm tra tĩnh, không thể cam kết tính tương thích thời gian thực với ứng dụng Mobile $\rightarrow$ **Cần Pact JS (CDCT)**.
  * **Khó quản lý luồng nghiệp vụ lớn:** Viết kịch bản E2E phức tạp bằng mã JavaScript trong sandbox cồng kềnh $\rightarrow$ **Cần bổ trợ bởi Karate Framework (BDD DSL)**.

</div>
</div>

<div class="highlight-box">
🎯 <b>Chiến lược kiểm thử hiện đại:</b> Kết hợp hiệp đồng <b>Postman</b> (Khám phá & CI) + <b>Karate</b> (E2E) + <b>Pact</b> (Contract).
</div>

<!--
Ghi chú thuyết trình:
- Tóm tắt 3 kết luận then chốt của phần Postman: mã trạng thái không đủ, test là đặc tả sống, và tự động hóa CI/CD.
- Đánh giá khách quan 2 mặt của Postman: rất mạnh để thăm dò, viết test ban đầu, nhưng không phải chiếc đũa thần cho mọi bài toán.
- Chuyển giao mạch lạc sang phần sau: Chính vì Postman không giải quyết được bài toán tương thích Consumer-Provider giữa Mobile và Backend nên nhóm cần Pact JS; và để viết kịch bản E2E mạch lạc không code rườm rà, nhóm đã triển khai Karate Framework.
-->
