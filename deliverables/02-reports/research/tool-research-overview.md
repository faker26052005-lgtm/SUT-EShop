# Tổng Quan Công Cụ & Hướng Sử Dụng — API & Contract Testing cho EShop (T06)

---

## 0. Bối cảnh: đề T06 yêu cầu gì

| Nhóm yêu cầu | Nội dung trong brief |
|---|---|
| Công cụ truyền thống (chọn 1 làm chính) | Postman, RestAssured, Karate, Pact |
| Hướng AI (bắt buộc, chọn ≥ 1) | Sinh test từ OpenAPI, Postbot, ChatGPT/Claude cho negative test |
| Mục tiêu học tập (mỗi thành viên) | Postman collection (auth, products, cart, orders) → RestAssured **hoặc** Karate → sinh lại bộ test bằng AI từ OpenAPI → 1 Pact consumer test giữa mobile và backend → bàn về contract testing bổ sung hay thay thế API testing truyền thống |
| Milestone S3 | Collection có chained token; sinh scaffold từ `api_specification.yaml` rồi so sánh; 1 Pact provider verification trên backend Node; ghi 5 contract violations |
| Chấm điểm | Demo phải có ≥ 1 tính năng công cụ truyền thống **và** ≥ 1 tính năng AI; User Guide có mục *failure modes* (3 cách công cụ có thể đánh lừa người dùng) |


---

## 1. Danh sách công cụ

| Công cụ | Vai trò | Loại | Ngôn ngữ / runtime | Độ khó với nhóm | Gắn với mục tiêu nào trong brief |
|---|---|---|---|---|---|
| Postman + Newman | Kiểm thử API thủ công và script, chạy CI | Truyền thống | GUI + JS (tab Tests); Newman cần Node | Thấp | Collection, chained token |
| Karate | Kiểm thử API dạng Gherkin | Truyền thống | Java (Maven/Gradle hoặc standalone) | Trung bình | Chuyển sang Karate/RestAssured |
| REST Assured | DSL Java cho REST | Truyền thống | Java + JUnit/TestNG | Trung bình – cao | Chuyển sang Karate/RestAssured |
| Pact (pact-js) | Consumer-driven contract testing | Contract | JS/TS (Node) | Cao | 1 consumer test + provider verification |
| PactFlow / Pact Broker | Lưu contract, ma trận tương thích, `can-i-deploy` | Contract | SaaS hoặc Docker | Trung bình | Phần broker của Pact |
| AI: Claude / ChatGPT | Sinh OpenAPI, sinh test, sinh negative test, chuyển đổi giữa các định dạng | AI | Chat | Thấp | Hướng AI |
| AI: Postbot | AI ngay trong Postman (assertion, tài liệu) | AI | Trong Postman | Thấp | Hướng AI |
| AI: PactFlow AI | Sinh test contract từ OpenAPI, traffic hoặc code | AI + Contract | SaaS | Trung bình | Hướng AI, gắn Pact |
| Công cụ bổ trợ (Schemathesis, Portman, Spectral, Bruno...) | Xem mục 7 | Bổ trợ | Khác nhau | Khác nhau | Tùy chọn |


---

## 2. Postman + Newman

### 2.1 Là gì, dùng để làm gì
- Postman là ứng dụng gửi request và viết script kiểm thử API. Collection gom các request theo thư mục; environment/collection variables giữ base URL và token.
- Newman là CLI chạy collection không cần giao diện, dùng trong CI. `newman-reporter-htmlextra` xuất báo cáo HTML.

### 2.2 Cách dùng cho EShop
1. Tạo collection `EShop API` với base URL `{{baseUrl}} = http://localhost:3000`.
2. Chia thư mục: `Auth`, `Products`, `Cart`, `Orders`, `Coupons`, `Admin`.
3. Chained token: request `POST /api/login` lưu token vào collection variable; các request sau dùng `Authorization: Bearer {{token}}`.

```javascript
// Tab Tests của POST /api/login
pm.test("Login trả 200", () => pm.response.to.have.status(200));
const body = pm.response.json();
pm.test("Có token dạng chuỗi", () => pm.expect(body.token).to.be.a("string"));
pm.collectionVariables.set("token", body.token);
```

4. Kiểm tra schema (dùng cho phần "contract kiểu schema"):

```javascript
// Ví dụ: response GET /api/products/:id   danh sách field phải lấy từ response thật của backend
const schema = {
  type: "object",
  required: ["id", "name", "price"],
  properties: { id: { type: "number" }, name: { type: "string" }, price: { type: "number" } }
};
pm.test("Schema khớp contract", () => pm.response.to.have.jsonSchema(schema));
```

5. Chạy bằng Newman:

```bash
npm i -g newman newman-reporter-htmlextra
newman run EShop.postman_collection.json -e local.postman_environment.json -r cli,htmlextra
```
Newman trả exit code khác 0 khi có test fail, có thể dùng làm "cổng" trong GitHub Actions.

### 2.3 Điểm mạnh / hạn chế
- Mạnh: dễ dùng, trực quan, cả nhóm đã quen, báo cáo HTML tốt cho demo.
- Hạn chế: không có khái niệm consumer/provider hay broker; schema phải bảo trì thủ công; collection lưu cloud khó đưa vào Git nếu không xuất file JSON.

### 2.4 Gói miễn phí 
- Các nguồn đọc được ngày 28/09/2026 **không thống nhất** về số người dùng gói Free (có nguồn nói 1 người từ tháng 3/2026, có nguồn nói 3 người). `[TODO]` mở trang pricing chính thức của Postman để xác nhận.
- Một nguồn thứ cấp liệt kê Free có giới hạn khoảng 25 lượt chạy collection/tháng trên cloud. Nếu đúng, dùng **Newman chạy local** để không bị giới hạn này. `[TODO]` xác minh Newman local có bị tính vào giới hạn không.
- Nếu Free chỉ 1 người: mỗi thành viên dùng tài khoản riêng, chia sẻ collection qua file `.json` trong repo Git.

### 2.5 Failure modes (gợi ý cho User Guide)
- Test "pass" vì chỉ kiểm tra status 200 mà không kiểm tra body.
- Schema viết tay lỗi thời so với backend nên báo pass sai.
- Biến collection giữ token cũ giữa các lần chạy, dẫn tới kết quả không lặp lại được.

---

## 3. Karate

### 3.1 Là gì
Framework kiểm thử API viết bằng cú pháp kiểu Gherkin, có sẵn assertion JSON, chạy song song, báo cáo HTML, hỗ trợ REST/GraphQL và có thể dùng cho mock và performance. Cần Java; có bản standalone dành cho nhóm không muốn viết code Java.

### 3.2 Cách dùng cho EShop
```gherkin
Feature: EShop - đăng nhập và xem sản phẩm

Background:
  * url baseUrl

Scenario: Đăng nhập lấy token
  Given path 'api', 'login'
  And request { email: 'test@eshop.com', password: 'Test1234!' }
  When method post
  Then status 200
  And match response.token == '#string'
  * def token = response.token

Scenario: Danh sách sản phẩm cần trả mảng
  Given path 'api', 'products'
  When method get
  Then status 200
  And match response == '#[]'
```
`baseUrl` đặt trong `karate-config.js`.

### 3.3 Lưu ý
- Karate đã có hai namespace (`com.intuit.karate` và `io.karatelabs`). `[TODO]` kiểm tra tài liệu chính thức để chọn đúng phiên bản và yêu cầu Java trước khi cài.
- Ưu điểm so với RestAssured: không cần viết code Java, dễ đọc cho báo cáo. Nhược điểm: vẫn phải cài JDK và Maven/Gradle.

### 3.4 Failure modes
- Kịch bản đọc rất giống "đúng" nên dễ bỏ sót assertion; `match` quá lỏng (`#present`) vẫn pass.
- Trạng thái chia sẻ giữa các scenario chạy song song có thể gây flaky (ví dụ giỏ hàng dùng chung một user).

---

## 4. REST Assured

### 4.1 Là gì
DSL Java để gọi và kiểm tra REST API, tích hợp JUnit/TestNG.

### 4.2 Phiên bản (đối chiếu 28/09/2026)
- Bản 6.0.0 (12/12/2025) nâng yêu cầu lên **Java 17+** và Groovy 5; bản 6.0.1 phát hành 10/07/2026.
- Nhánh 5.5.x vẫn còn được cập nhật (5.5.7 ngày 16/01/2026).

### 4.3 Cách dùng cho EShop
```java
String token = given().contentType(ContentType.JSON)
    .body(Map.of("email", "test@eshop.com", "password", "Test1234!"))
  .when().post("http://localhost:3000/api/login")
  .then().statusCode(200)
  .body("token", notNullValue())
  .extract().path("token");

given().header("Authorization", "Bearer " + token)
  .when().get("http://localhost:3000/api/orders/my-orders")
  .then().statusCode(200);
```

### 4.4 So sánh nhanh với Karate
| | Karate | REST Assured |
|---|---|---|
| Cần viết code Java | Không | Có |
| Độ dễ đọc trong báo cáo | Cao | Trung bình |
| Tích hợp JUnit/CI Java | Có | Rất tốt |
| Phù hợp nhóm mạnh JS | Ổn hơn | Ít |

`[TODO]` Nhóm chốt chọn một trong hai ở S1 và ghi lý do.

---

## 5. Pact (pact-js) + PactFlow

### 5.1 Ý tưởng
- **Consumer** (ở đây là mobile) viết test mô tả những gì nó cần từ API. Pact dựng mock server và sinh file contract JSON.
- **Provider** (backend Node/Express) chạy lại các request trong contract vào API thật; nếu response không đủ những gì consumer cần thì fail.
- Contract chỉ chứa phần consumer thực sự dùng nên backend vẫn được thêm field mới; chỉ đổi tên hoặc xóa field mà consumer cần mới bị chặn.

### 5.2 Consumer test cho mobile (khung tham khảo)
> Cú pháp theo `PactV3` của pact-js v11+; kiểm tra tài liệu theo phiên bản cài. Danh sách field của sản phẩm phải lấy từ response thật của backend.

```javascript
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { integer, string, like } = MatchersV3;

const provider = new PactV3({
  consumer: 'EShopMobile',
  provider: 'EShopBackend',
  dir: './pacts',
});

it('GET /api/products/:id trả id, name, price', () => {
  provider
    .given('sản phẩm id 1 tồn tại')
    .uponReceiving('yêu cầu lấy chi tiết sản phẩm 1')
    .withRequest({ method: 'GET', path: '/api/products/1' })
    .willRespondWith({
      status: 200,
      body: { id: integer(1), name: string('Sản phẩm mẫu'), price: like(100000) },
    });

  return provider.executeTest(async (mockServer) => {
    // Gọi HÀM API THẬT của app mobile, không gọi fetch thô
    const product = await getProduct(mockServer.url, 1);
    expect(product.id).toBe(1);
  });
});
```
Lưu ý quan trọng: test phải đi qua lớp gọi API của `frontend-mobile` (service/axios wrapper), chạy bằng Jest trong Node, **không chạy trên thiết bị**.

### 5.3 Provider verification cho backend
```javascript
const { Verifier } = require('@pact-foundation/pact');

new Verifier({
  providerBaseUrl: 'http://localhost:3000',
  provider: 'EShopBackend',
  pactUrls: ['./pacts/EShopMobile-EShopBackend.json'], // hoặc pactBrokerUrl + token
  stateHandlers: {
    'sản phẩm id 1 tồn tại': async () => { /* seed SQLite để có product id 1 */ },
  },
}).verifyProvider();
```
Điểm tốn công nhất: viết `stateHandlers` để dựng dữ liệu SQLite cho từng trạng thái.

### 5.4 PactFlow (đối chiếu trang pricing, 28/09/2026)
- Gói **Starter miễn phí**: không cần thẻ, **không giới hạn số user**, **2 integrations**, hỗ trợ Bi-Directional Contract Testing.
- Trang pricing ghi mọi gói đều có **AI-augmented contract testing** (sinh test từ OpenAPI, traffic hoặc code). Đây là ứng viên tốt cho phần AI.
- Trang pricing **không nhắc ưu đãi riêng cho sinh viên**, nên đừng viết "miễn phí cho sinh viên" trong proposal.
- Một "integration" hiểu là một cặp consumer–provider. Nhóm có 3 consumer (Web, Admin, Mobile) sẽ vượt giới hạn 2, một lý do nữa để thu nhỏ phạm vi về Mobile (và tối đa thêm 1 consumer).
- `[TODO]` xác nhận định nghĩa "integration" và giới hạn số contract/số lượt trong tài liệu PactFlow.
- Phương án thay thế: tự chạy Pact Broker bằng Docker (cần Postgres, tốn công cấu hình hơn).

### 5.5 `can-i-deploy`
Chỉ có ý nghĩa đầy đủ khi có khái niệm môi trường (staging/production) và ghi nhận deployment. Trong bài học có thể dùng dạng đơn giản: kiểm tra phiên bản mới nhất của consumer và provider có tương thích không.

### 5.6 Failure modes
- Contract chỉ phản ánh những gì consumer *đã viết*; nếu test consumer viết thiếu field thì backend đổi field đó vẫn pass.
- Dùng matcher quá lỏng (`like` mọi thứ) khiến contract không bắt được đổi kiểu dữ liệu ngoài ý muốn.
- Test gọi `fetch` thô thay vì hàm thật của app thì contract tách rời code mobile, pass mà app vẫn hỏng.
- Provider state dữ liệu giả không giống dữ liệu thật nên verification pass nhưng chạy thật vẫn lỗi.

---

## 6. Hướng AI

Brief yêu cầu ≥ 1 hướng AI, demo phải có cả phần truyền thống lẫn AI. Dưới đây là các hướng cụ thể áp dụng cho EShop.

### 6.1 Chuyển `api_specification.md` thành OpenAPI YAML
- **Vì sao cần:** repo chỉ có `api_specification.md`; brief nhắc `api_specification.yaml`. File YAML này còn dùng chung cho Postman (import), PactFlow BDCT, Schemathesis...
- **Cách làm:** đưa file md cho Claude/ChatGPT, yêu cầu xuất OpenAPI 3.0, sau đó **tự rà** các điểm dễ sai: response body (spec md hầu như không mô tả response), mã lỗi 400/401/403/404, quy tắc xác thực JWT.
- **Kỳ vọng:** AI điền được schema request rất nhanh nhưng thường **bịa response**; phải đối chiếu với response thật của backend.

### 6.2 Sinh bộ test từ OpenAPI rồi so sánh với collection viết tay (milestone S3)
Quy trình gợi ý: (1) AI sinh test từ YAML → (2) chạy → (3) so với collection viết tay: AI bắt được gì, bỏ sót gì. Ghi lại kết quả thành bảng để dùng cho báo cáo và Activity Worksheet.

### 6.3 Negative test và test nghiệp vụ bằng Claude/ChatGPT
Cho AI đọc SRS (FR/SEC) cùng spec và yêu cầu sinh payload xấu. Những chỗ **AI theo schema thường bỏ sót**, cần người viết:
| Nhóm | Ứng viên test (cần chạy thật để xác nhận SUT có lỗi hay không) |
|---|---|
| Checkout (FR-08) | Backend có tự tính lại tổng tiền không, hay tin `total_amount` client gửi? |
| Cart | `POST /api/cart` nhận `price` từ client: thử gửi giá thấp hơn thật |
| Coupon (FR-09) | 5 điều kiện C1–C5; biên `>=` ngưỡng tối thiểu; `apply-coupon` nhận `user_id` từ body thay vì JWT |
| Order state machine (FR-10) | Chuyển trạng thái sai (delivered → pending); user hủy đơn `shipping` |
| Phân quyền (FR-12, SEC-03) | Gọi `/api/admin/*` bằng token user thường; gọi khi không có token |
| Hồ sơ (SEC-06) | `PUT /api/users/me` cố ghi `role` |
| Đăng nhập (FR-02) | Khóa sau 3 lần sai, mở sau 30 giây, bộ đếm tăng đúng 1 |
| OTP (FR-03, SEC-07) | OTP dùng lại, dùng cho email khác, hết hạn |
| Import CSV (FR-16) | Một dòng lỗi thì toàn bộ rollback (all-or-nothing) |

### 6.4 Postbot
- Sinh assertion, tài liệu và test ngay trong Postman.
- Tài liệu Postman: dùng thử được trên mọi gói nhưng giới hạn **50 hoạt động/tháng/người** (theo trang FAQ chính thức). Với nhóm 3 người, cần phân bổ lượt dùng hợp lý, hoặc dùng Claude/ChatGPT cho phần sinh nhiều.

### 6.5 PactFlow AI
Sinh test contract từ OpenAPI, traffic hoặc code (trang pricing ghi có trong mọi gói). `[TODO]` thử trên tài khoản Starter và ghi lại: sinh được gì, chất lượng ra sao.

### 6.6 Nguyên tắc dùng AI (để đưa vào báo cáo)
- AI phủ tốt schema đã khai báo nhưng yếu ở luật nghiệp vụ, race condition và lạm dụng (coupon, phân quyền).
- Mọi test do AI sinh phải chạy thật và đọc lại; ghi rõ prompt, phiên bản model, và phần đã chỉnh tay.

---

## 7. Công cụ bổ trợ (tùy chọn, cần justification ở S1 nếu dùng)

| Công cụ | Dùng để làm gì | Ghi chú |
|---|---|---|
| Schemathesis | Sinh test tự động từ OpenAPI, tìm lỗi 500 và vi phạm schema | chưa đối chiếu phiên bản/cách cài |
| Portman | Sinh test contract vào Postman collection từ OpenAPI | Nêu trong file nghiên cứu ban đầu |
| Spectral | Lint file OpenAPI trước khi dùng | chưa xác minh |
| Specmatic | Test từ OpenAPI dạng no-code, kiểm tra tương thích ngược giữa 2 bản spec | Từ file nghiên cứu ban đầu; cần YAML chuẩn |
| Bruno | Thay thế Postman, collection lưu dạng file trong Git | Một nguồn đọc được nói nó nổi lên sau khi Postman siết gói Free; chưa xác minh |
| Spring Cloud Contract, Microcks | Không phù hợp (JVM / thiên về mock, nặng) | Ghi vào phần "đã cân nhắc và loại" của proposal |


---

## 8. Ghép công cụ với mục tiêu học tập và demo

| Mục tiêu / hạng mục brief | Công cụ đề xuất | Bằng chứng nộp |
|---|---|---|
| Postman collection (auth, products, cart, orders) + chained token | Postman + Newman | File collection, báo cáo htmlextra |
| Chuyển sang Karate hoặc RestAssured | Karate (hoặc RestAssured) | Feature files/test class, ảnh báo cáo |
| Sinh test từ OpenAPI bằng AI | Claude/ChatGPT (+ Postbot, PactFlow AI nếu dùng) | Prompt, YAML, bảng diff với collection viết tay |
| 1 Pact consumer test giữa mobile và backend | pact-js + PactFlow | File pact, ảnh ma trận PactFlow |
| Provider verification trên backend Node | pact-js Verifier | Log verification |
| 5 contract violations | Pact + Postman schema | Bảng 5 vi phạm (tên field, kiểu, bắt buộc/tùy chọn...) |
| Demo (5–8 phút) | 1 truyền thống + 1 AI | Screencast |

Gợi ý kịch bản demo ngắn: (1) Newman chạy collection xanh; (2) AI sinh thêm test negative, chỉ ra 1 lỗi nghiệp vụ; (3) đổi `price` thành `unit_price` ở backend, Pact provider verification đỏ.

---

## 9. Nguồn

**Đã đối chiếu (28/09/2026):**
- PactFlow pricing: https://pactflow.io/pricing
- Postbot usage limits (Postman Learning Center): https://learning.postman.com/help/faqs/postbot/is-postbot-usage-limited
- REST Assured: https://rest-assured.io/ và https://github.com/rest-assured/rest-assured

- Giới hạn gói Free của Postman (các nguồn thứ cấp mâu thuẫn nhau): https://costbench.com/software/developer-tools/postman/free-plan/
- Đổi namespace Karate (`com.intuit.karate` → `io.karatelabs`): chỉ thấy nhắc trong mô tả khóa học, cần xem tài liệu chính thức của Karate.

