---
marp: true
theme: default
paginate: true
header: "CS423 / CSC15003 — Software Testing · Seminar T06: API & Contract Testing"
footer: "Nhóm 11 — FIT@HCMUS · Nguyễn Hoàng Anh Tú - Nguyễn Quốc Kỳ - Hà Quốc Kiên"
style: |
  section {
    background-color: #ffffff;
    color: #111827;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 25px;
    padding: 38px 55px;
  }
  h1 {
    color: #0f172a;
    font-size: 38px;
    margin-bottom: 18px;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 8px;
  }
  h2 {
    color: #1e3a8a;
    font-size: 30px;
  }
  h3 {
    color: #1d4ed8;
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 6px;
  }
  table {
    font-size: 19px;
    width: 100%;
    border-collapse: collapse;
    margin-top: 12px;
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
    font-size: 20px;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 18px;
    line-height: 1.35;
  }
  .highlight-box {
    background-color: #f8fafc;
    border-left: 5px solid #2563eb;
    padding: 10px 18px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
---

<!-- Slide 1: Title Slide -->
<!-- _paginate: false -->
<!-- _header: "" -->
<!-- _footer: "" -->

<br><br>

# T06 — API & Contract Testing

**Môn học:** CS423 / CSC15003 — Kiểm thử Phần mềm (Software Testing)  
**Khoa Công nghệ Thông tin — Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM**  

<div class="highlight-box">

**Nhóm thực hiện: Nhóm 11**
* **Nguyễn Hoàng Anh Tú** (MSSV: 23120183) — *Pact C1/C2, Newman P3, Slides*
* **Nguyễn Quốc Kỳ** (MSSV: 23120138) — *Karate K1/K2/K3, Pact C3*
* **Hà Quốc Kiên** (MSSV: 23120056) — *Postman P1/P2, AI Agent Testing, Report*

**Giảng viên hướng dẫn:** M.Sc Hồ Tuấn Thanh  
*Thời lượng trình bày: 30 phút (Lý thuyết chuyên sâu & Live Demo)*
</div>

---

<!-- Slide 2: Agenda -->

# Mục Tiêu & Cấu Trúc Buổi Seminar

1. **Tổng Quan Về API Testing:** Bản chất, 4 trọng tâm kiểm thử & giải phẫu HTTP
2. **Công Cụ 1 — Postman & Newman CLI:** Từ kiểm thử thủ công đến CI/CD
   * Cấu trúc Collection, Variables Scopes & Scripting Sandbox
   * Kỹ thuật Token Chaining & Data-Driven CSV
   * Demo Kịch bản P1, P2 & P3 (Newman HTML Extra Dashboard)
3. **Công Cụ 2 — Karate Framework:**
   * K1 Smoke (Fuzzy Matcher) & K2 Data-Driven (Bắt 2 bug SUT)
   * K3 Stateful Shopping Workflow (Login $\rightarrow$ Cart $\rightarrow$ Checkout)
4. **Công Cụ 3 — Lý Thuyết Contract Testing & Pact JS:**
   * Bản chất Contract Testing & Vì sao nó sống còn trong Microservices?
   * Demo C1 (Consumer Contract), C2 (Provider Verification), C3 (Bắt Breaking Change)
5. **So Sánh Tổng Hợp 3 Công Cụ, Hướng AI & Kết Luận:**

---

<!-- Slide 3: API Testing Fundamentals -->

# Tổng Quan Về API Testing: Bản Chất & Phân Loại

<div class="grid-2">
<div>

### 1. Bản chất của API Testing
* Kiểm thử tại tầng trung gian (**Business Logic Layer**), độc lập với UI.
* **Shift-Left Testing:** Phát hiện lỗi sớm ngay khi backend vừa viết xong endpoint, không cần chờ hoàn thiện giao diện Web/Mobile.
* Tốc độ thực thi nhanh gấp 10–50 lần so với UI Test, ổn định, không bị "flaky" khi UI đổi CSS/Layout.

</div>
<div>

### 2. 4 Trọng tâm kiểm thử cốt lõi
* **Functional Testing:** Kiểm tra mã trạng thái HTTP, tính chính xác của dữ liệu và nghiệp vụ.
* **Schema Validation:** Kiểm tra kiểu dữ liệu (`number`, `string`), các trường bắt buộc/tùy chọn.
* **Negative & Boundary:** Dữ liệu trống, sai định dạng, vượt giới hạn số, SQLi, mã 400/404.
* **Security & Auth:** Kiểm tra xác thực Token, phân quyền Admin vs Customer (401 Unauthorized, 403 Forbidden).

</div>
</div>

<div class="highlight-box">
Kim tự tháp kiểm thử hiện đại: API Testing chiếm tỷ trọng lớn nhờ chi phí vận hành thấp và độ bao phủ cao.
</div>

---

<!-- Slide 4: HTTP Request & Response Anatomy -->

# Giải Phẫu HTTP Request/Response & Cơ Chế Kiểm Thử

```text
HTTP REQUEST                                           HTTP RESPONSE
+------------------------------------------------+     +------------------------------------------------+
| POST /api/cart HTTP/1.1                        |     | HTTP/1.1 200 OK                                |
| Host: localhost:3000                           |     | Content-Type: application/json; charset=utf-8  |
| Authorization: Bearer eyJhbGciOi...            |     | X-Response-Time: 12ms                          |
| Content-Type: application/json                 |     +------------------------------------------------+
+------------------------------------------------+     | {                                              |
| { "productId": 1, "quantity": 2 }              |     |   "success": true, "cartId": 101,              |
+------------------------------------------------+     |   "items": [ { "id": 1, "qty": 2 } ]          |
                                                       | }                                              |
                                                       +------------------------------------------------+
```

### 3 Thành phần kinh điển trong một ca kiểm thử API:
1. **Setup & Pre-request:** Chuẩn bị dữ liệu đầu vào, mã hóa mật khẩu, sinh timestamp, chuẩn bị token.
2. **Execution:** Gửi request HTTP tương ứng với Method, Path, Headers và Body.
3. **Checkpoints & Assertions:** Đo lường Response Status, Response Time ($< 500\text{ms}$), Schema & Data Integrity.

---

<!-- Slide 5: Postman Architecture & Ecosystem -->

# Chuyên Sâu Postman: Hệ Sinh Thái & Kiến Trúc Nền Tảng

Postman không chỉ là công cụ gửi HTTP request đơn thuần, mà là một **Nền Tảng API Testing Hoàn Chỉnh**:

<div class="grid-2">
<div>

### 1. Tổ chức phân cấp Collection
* **Workspace $\rightarrow$ Collection $\rightarrow$ Folders $\rightarrow$ Requests**.
* Quản lý API mạch lạc theo từng phân hệ nghiệp vụ: `Auth`, `Products`, `Cart`, `Checkout`.
* Lưu trữ và chia sẻ đặc tả API, mock server trong nhóm phát triển.

### 2. Thứ bậc biến số (Variables Scopes)
* `Global` $\rightarrow$ `Collection` $\rightarrow$ `Environment` $\rightarrow$ `Data` $\rightarrow$ `Local`.
* Cho phép chuyển đổi môi trường tức thì giữa **Local (`localhost:3000`)**, **Staging**, và **Production**.

</div>
<div>

### 3. Scripting Engine (JavaScript Sandbox)
* Tích hợp Node-like sandbox, hỗ trợ đầy đủ thư viện `Lodash`, `CryptoJS`, `moment`.
* Khung kiểm thử chuẩn **Chai.js BDD** (`pm.test()`, `pm.expect()`).
* **Hai điểm can thiệp mã nguồn:**
  * **Pre-request Script:** Chạy *trước khi* request gửi đi (tạo dynamic payload, tính chữ ký số).
  * **Tests Script:** Chạy *sau khi* nhận response (bắt assertion, lưu token).

</div>
</div>

---

<!-- Slide 6: Postman Advanced Techniques -->

# Kỹ Thuật Nâng Cao: Token Chaining & Data-Driven

<div class="grid-2">
<div>

### 1. Token Chaining (Quản lý phiên)
* Trích xuất JWT Token tự động từ API Đăng nhập và lưu vào Environment:
```javascript
pm.test("Login success & save token", function() {
    pm.response.to.have.status(200);
    var jsonData = pm.response.json();
    pm.environment.set("jwt_token", jsonData.token);
});
```
* Các API sau (Cart, Checkout) chỉ cần khai báo header dùng biến:  
  `Authorization: Bearer {{jwt_token}}`
* Không bao giờ phải copy-paste token thủ công!

</div>
<div>

### 2. Data-Driven Testing (Nạp CSV/JSON)
* Cho phép thực thi 1 request lặp lại hàng trăm lần với các bộ dữ liệu khác nhau:
```javascript
// Đọc dữ liệu từ file login_data.csv
var expectedStatus = pm.iterationData.get("status");
pm.test("Status matches test case", function() {
    pm.response.to.have.status(expectedStatus);
});
```
* **Ứng dụng trên EShop:**
  * `login_data.csv`: Test tài khoản đúng, sai pass, tài khoản rỗng.
  * `product_ids.csv`: Quét biên ID hợp lệ và không hợp lệ.

</div>
</div>

---

<!-- Slide 7: Demo Postman P1, P2 & Newman P3 -->

# Demo Postman (P1, P2) & Tự Động Hóa Newman CLI (P3)

<div class="grid-2">
<div>

### Demo Kịch bản P1 & P2:
* **P1 (Basic):** `POST /api/auth/login` (Lưu token) $\rightarrow$ `GET /api/products` (Mã 200, Content-Type JSON).
* **P2 (Runner & Checkpoints):**
  * Nạp file `product_ids.csv` quét kiểm thử biên.
  * Checkpoint SLA: `pm.expect(responseTime).to.be.below(200);`
  * Checkpoint Schema: Đảm bảo đủ các trường bắt buộc.

</div>
<div>

### Demo Kịch bản P3: Newman CLI CI/CD
* Chạy headless hoàn toàn trong terminal:
```bash
newman run eshop_api_all_tests.json \
  -e local_env.json -d login_data.csv \
  --reporters cli,htmlextra
```
* Tích hợp tự động vào GitHub Actions / GitLab CI.
* Xuất báo cáo trực quan **HTML Extra Dashboard** với đầy đủ biểu đồ Pass/Fail.

</div>
</div>

<div class="highlight-box">
🎬 <b>Minh chứng Video Demo:</b> Clip P1 (Setup & Basic), Clip P2 (Data-driven Runner) và Clip P3 (Newman CLI CI/CD).
</div>

---

<!-- Slide 8: Karate K1 & K2 -->

# Công Cụ 2: Karate Framework — K1 Smoke & K2 Data-Driven

<div class="grid-2">
<div>

### K1: Smoke Test (`products.feature`)
* Kiểm thử nhanh tính sẵn sàng của `GET /api/products`.
* Fuzzy Schema Validation:
  ```cucumber
  Given path '/api/products'
  When method get
  Then status 200
  And match response == '#[]'
  And match each response == 
    { id: '#number', name: '#string', 
      price: '#number', stock: '#number' }
  ```
</div>

<div>

### K2: Data-Driven & Bắt Bug SUT
* Sử dụng bảng `Examples` kiểm thử nhiều ID.
* **Phát hiện 2 lỗi thực tế của SUT EShop:**
  1. **Lỗi 404:** Truy vấn ID không tồn tại (`id = 999`), hệ thống trả về **HTTP 200 `{}`** thay vì **404 Not Found**.
  2. **Lỗi Schema:** Một số sản phẩm trả về `price` dạng String (`"99.00"`) thay vì kiểu Number.
</div>
</div>

<div class="highlight-box">
Lệnh chạy Maven: <code>mvn test -Dtest=EshopTest#testProducts</code> &rarr; Tự động sinh báo cáo HTML trực quan.
</div>

---

<!-- Slide 9: Karate K3 Stateful Workflow -->

# Karate Framework — K3 Stateful Shopping Workflow

### Kiểm thử luồng mua hàng E2E phức tạp có trạng thái (Stateful Token Chaining)

```cucumber
Scenario: Stateful Purchase Workflow (Login -> Cart -> Checkout)
  # 1. Đăng nhập và trích xuất Authentication Token
  Given path '/api/login'
  And request { email: 'test@eshop.com', password: 'Test1234!' }
  When method post
  Then status 200
  * def authToken = response.token

  # 2. Truyền token vào header để thêm hàng vào giỏ
  Given path '/api/cart'
  And header Authorization = 'Bearer ' + authToken
  And request { productId: 1, quantity: 2 }
  When method post
  Then status 200

  # 3. Tiến hành thanh toán và xác minh đơn hàng
  Given path '/api/checkout'
  And header Authorization = 'Bearer ' + authToken
  When method post
  Then status 200
  And match response.status == 'SUCCESS'
```

---

<!-- Slide 10: Contract Testing Theory -->

# Lý Thuyết Contract Testing: Bản Chất & Vì Sao Nó Cần Thiết?

<div class="grid-2">
<div>

### 1. Contract Testing là gì?
* Là phương pháp kiểm thử **sự thỏa thuận giao tiếp** giữa:
  * **Consumer:** Web, Mobile, Microservice
  * **Provider:** Backend

### 2. Sự bế tắc của E2E Testing
* Dựng môi trường tích hợp đầy đủ rất tốn kém, vận hành chậm chạp (vài chục phút).
* Thường xuyên bị lỗi giả (**Flaky**) do nghẽn mạng, cơ sở dữ liệu không đồng bộ.

</div>
<div>

### 3. Vấn đề "API Drift" trong Microservices
* Backend và Frontend được phát triển bởi các nhóm độc lập theo Agile Sprints.
* Backend tự ý thay đổi
* Mock Server tĩnh hoặc Swagger Docs không phát hiện được sự sai lệch này.

</div>
</div>

<div class="highlight-box">
Contract Testing cho phép kiểm thử Consumer và Provider <b>hoàn toàn độc lập (Decoupled)</b> nhưng vẫn đảm bảo 100% không bị gãy vỡ khi ghép nối thật!
</div>

---

<!-- Slide 11: Pact Architecture & C1, C2 -->

# Consumer-Driven Contract Testing — Pact C1 & C2

```text
[ GIAI ĐOẠN 1: CONSUMER TEST ]
+---------------------+      GET /api/products (Expected)       +--------------------+
| EShop Mobile Client | -------------------------------------> |  Pact Mock Server  | ---> Sinh hợp đồng JSON:
+---------------------+ <------------------------------------- +--------------------+      EShopMobile-EShopBackend.json
                             Mock Response (id, name, price)                                       |
[ GIAI ĐOẠN 2: PROVIDER VERIFICATION ]                                                             |
+---------------------+      Replay HTTP Request                                                   v
|  Actual Node SUT    | <------------------------------------- +--------------------+
| (EShop Backend:3000)| -------------------------------------> |   Pact Verifier    | ---> Đối soát 100% (Pass!)
+---------------------+      Actual Response                   +--------------------+
```

* **Kịch bản C1 (`npm run test:consumer`):** Mobile Client định nghĩa hợp đồng kỳ vọng.
* **Kịch bản C2 (`npm run test:provider`):** Backend SUT xác thực tuân thủ hợp đồng: `1 interaction, 0 failures` (PASS).

---

<!-- Slide 12: Pact C3 Breaking Change -->

# Demo Pact JS — Kịch Bản C3: Bắt Lỗi Breaking Change

### Tình huống sự cố thực tế: Backend tự ý đổi tên trường `price` $\rightarrow$ `unit_price`
* Lệnh chạy: `npm run test:breaking` (tại `tests/pact/breaking-change/verify-breaking.js`)

```text
Verifying a pact between EShopMobile and EShopBackend
  GET /api/products (Breaking Change Simulation)
    returns a response which
      has a matching body FAILED
        $ Expected 'price' but got 'unit_price'

1 interaction, 1 failure
--> BREAKING CHANGE DETECTED AND BLOCKED AUTOMATICALLY!
```

> **Giá trị đột phá của Contract Testing:**  
> Bắt đứng lỗi vi phạm giao tiếp ngay tại CI/CD của Backend trong **vòng 1 giây**, mà **không cần deploy staging hay chạy app di động thật**!

---

<!-- Slide 13: Tools Comparison Matrix -->

# Ma Trận So Sánh Tổng Hợp: Postman vs Karate vs Pact JS

| Tiêu chí | Postman & Newman | Karate Framework | Pact JS (CDCT) |
|---|---|---|---|
| **Mục tiêu cốt lõi** | Thăm dò API, Functional & API Docs | E2E API Automation & Stateful Workflow | Consumer-Driven Contract Testing |
| **Cú pháp / Format** | JavaScript (GUI + Script) | Gherkin DSL (No-code / Low-code) | JavaScript / TypeScript (Code-first) |
| **Cơ chế Assertions** | `pm.test()`, Chai.js BDD | Native Fuzzy Matchers (`#number`, `#string`) | Contract Schema & Value Matchers |
| **Data-Driven** | CSV / JSON file qua Runner | Bảng `Examples` ngay trong Feature | Dựa trên Provider States |
| **Bắt Lỗi API Drift** | Không (phụ thuộc SUT online) | Không (phụ thuộc SUT online) | **CỰC MẠNH** (Bắt sai lệch ngay khi build) |
| **Hỗ trợ CI/CD** | Cực mạnh với Newman CLI | Maven / Gradle / JUnit 5 runner | Pact CLI / Pact Broker |
| **Tình huống sử dụng** | **Thăm dò nhanh, tài liệu hóa, manual** | **Tự động hóa luồng E2E phức tạp** | **Hệ thống Microservices nhiều team** |

---

<!-- Slide 14: AI Agent Testing -->

# Ứng Dụng AI Agent: Sinh Test Từ OpenAPI 3.0

```text
[ OpenAPI 3.0 Spec ] + [ AI Agent Testing Skill ]
               |
               v
      ( AI Prompt / Agent )
               |
               v
  [ Test Matrix & Scaffold Tests ]
               |
               v (Human Reviewer: Duyệt & Bổ sung ràng buộc nghiệp vụ)
               |
  [ Test Suite Thực Thi (Karate / Postman) ]
```

### Đánh giá năng lực của AI trong Testing:
* **Điểm mạnh (Pros):** Sinh toàn bộ khung ca test (scaffold), fuzzy schema assertion cho hàng chục endpoints chỉ trong vài giây. Tiết kiệm ~70% thời gian thiết lập ban đầu.
* **Điểm yếu / Failure Modes (Cons):** AI chỉ hiểu cấu trúc mô tả (Schema), **hoàn toàn mù mờ về ràng buộc nghiệp vụ ngầm** (Business Rules: ví dụ coupon hết hạn, trừ tồn kho âm, race condition). Bắt buộc phải có **Human-in-the-Loop** kiểm định.

---

<!-- Slide 15: Conclusions & QA -->
<!-- _paginate: false -->

# Kết Luận & Phiên Hỏi - Đáp (Q&A)

<div class="grid-2">
<div>

### 3 Bài học thực tiễn:
1. **API Testing là nền tảng:** Đảm bảo độ tin cậy của logic nghiệp vụ với tốc độ nhanh và chi phí thấp.
2. **Postman & Karate hỗ trợ bổ trợ:** Postman mạnh về khám phá & Newman CI; Karate chuyên biệt cho luồng E2E phức tạp.
3. **Pact giải quyết bài toán Microservices:** Xóa bỏ nguy cơ API Drift giữa các team phát triển độc lập.

</div>
<div>

### Q&A Session
Nhóm 11 chân thành cảm ơn Thầy Cô và các bạn!

</div>
</div>
