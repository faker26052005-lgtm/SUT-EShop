# Đề Xuất Nội Dung Thuyết Trình Video Demo (Karate K1-K2 & Pact C3)

- **Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS
- **Chủ đề Seminar:** T06 · API Testing & Contract Testing
- **Người thực hiện:** **Nguyễn Quốc Kỳ (MSSV: 23120138)** — Nhóm 11
- **Phạm vi đảm nhiệm thuyết minh video:** 
  - Công cụ 1: **Karate Framework** (Kịch bản K1 & K2 theo phân công thuyết minh cá nhân; kịch bản K3 Workflow do nhóm/thành viên khác đảm nhiệm trong video riêng)
  - Công cụ 2: **Pact JS** (Kịch bản C3: Breaking Change Verification)
- **Vị trí lưu trữ:** `deliverables/05-management/weekly-reports/week-05/quoc-ky/Video_Content_Proposal.md`

---

## MỤC ĐÍCH TÀI LIỆU

Tài liệu này xác định **khung nội dung cốt lõi, các luận điểm kỹ thuật và dẫn chứng thực nghiệm** cần nói trong 2 video trình bày riêng biệt, bám sát cấu trúc chuẩn mực của môn học:
$$\text{Giới thiệu} \longrightarrow \text{Lý thuyết} \longrightarrow \text{Giải thích thiết kế} \longrightarrow \text{Thực thi \& Đánh giá công cụ}$$

---

# VIDEO 1: KIỂM THỬ API TỰ ĐỘNG VỚI KARATE FRAMEWORK (K1 & K2)

- **Thời lượng dự kiến:** 7 – 9 phút
- **Phạm vi kịch bản:** K1 (Cài đặt, Smoke Test & Schema Check) và K2 (Advanced Assertions, Data-Driven & Bắt lỗi SUT Discrepancies)
- **Hệ thống SUT:** EShop Product Catalog (`GET /api/products`, `GET /api/products/:id`)
- **Tập tin minh chứng:** `tests/karate/src/test/java/eshop/products.feature`

---

### I. NỘI DUNG PHẦN GIỚI THIỆU (Introduction)
*Mục tiêu: Định vị công cụ, xác định vai trò của thành viên và phạm vi kiểm thử.*

1. **Thông tin cá nhân & Phân công nhiệm vụ:**
   - Giới thiệu bản thân: Nguyễn Quốc Kỳ (MSSV: 23120138), Nhóm 11.
   - Nêu rõ phân công nhiệm vụ cá nhân: Thiết lập & thuyết minh video cho 2 kịch bản Karate K1 (Smoke Test & Schema Check) và K2 (Data-Driven & Discrepancies); kịch bản K3 (Authenticated Shopping Workflow) thuộc bộ test suite EShop do nhóm/thành viên khác trình bày riêng.
2. **Khái niệm & Vị trí của Karate Framework trong đề tài:**
   - Định nghĩa: Karate là framework kiểm thử API tự động dạng mã nguồn (Code-based API Testing), sử dụng cú pháp DSL kế thừa từ Cucumber BDD, chạy trên nền Java runtime (kết hợp Maven và JUnit 5).
   - **Lý do lựa chọn Karate bên cạnh Postman:**
     - So với Postman: Karate lưu trữ kịch bản dưới dạng văn bản thuần (`.feature`), quản lý trực tiếp bằng Git Version Control mà không cần xuất/nhập JSON qua GUI, không phụ thuộc vào cloud workspace.
     - So với REST-Assured: Karate viết theo cú pháp Gherkin tự nhiên, không đòi hỏi viết code Java boilerplate phức tạp (như POJO, DTO, serialization/deserialization).
3. **Phạm vi SUT áp dụng trong video:**
   - Giới thiệu ngắn gọn module Quản lý danh mục sản phẩm của backend EShop: Endpoint lấy toàn bộ sản phẩm (`GET /api/products`) và truy vấn chi tiết theo ID (`GET /api/products/:id`).

---

### II. NỘI DUNG PHẦN LÝ THUYẾT & NGUYÊN LÝ (Theory & Principles)
*Mục tiêu: Trình bày kiến thức nền tảng về Smoke Test, Gherkin API, Checkpoint Schema, Data-Driven và các bẫy kiểm thử.*

1. **Bản chất của Kịch bản K1 — Vì sao là Smoke Test?**
   - **Khái niệm Smoke Test:** Là bộ kiểm thử chạy siêu nhanh (vài mili-giây), kiểm tra các điều kiện "sống còn" (Survival / Critical conditions) của hệ thống trước khi kích hoạt các bộ kiểm thử nặng hơn:
     - Dịch vụ có đang chạy và phản hồi thành công không (`status 200`)?
     - Cấu trúc phản hồi cơ bản có nguyên vẹn không (Mảng JSON `#[]`)?
     - Cơ sở dữ liệu danh mục có bị rỗng không (`assert response.length > 0`)?
   - **Phân biệt với các loại kiểm thử khác:**
     - *Phân biệt với Regression Test (Kiểm thử hồi quy):* Regression test (như kịch bản K3) kiểm thử toàn diện các luồng nghiệp vụ tương tác sâu, stateful (Login $\to$ Giỏ hàng $\to$ Checkout), trong khi Smoke test chỉ kiểm tra nhanh bề mặt.
     - *Phân biệt với Exhaustive Schema Validation:* Smoke test chỉ kiểm tra cấu trúc cơ bản của phần tử đại diện đầu tiên, không quét sâu vào toàn bộ thuộc tính, regex format hay ràng buộc giá trị biên của tất cả sản phẩm.
2. **Cú pháp Gherkin BDD trong kiểm thử API:**
   - Karate loại bỏ hoàn toàn tầng "Step Definitions" trung gian của Cucumber.
   - Ý nghĩa các từ khóa: `Given` (thiết lập URL, path, headers), `When` (phát sinh hành vi HTTP Method), `Then` (xác thực mã status), `And` (bổ sung assertions).
3. **Cơ chế Checkpoints & Schema Validation (Fuzzy Matchers):**
   - Khái niệm Schema Validation: Kiểm tra cấu trúc khung và kiểu dữ liệu thay vì kiểm tra giá trị cố định (hardcoded values).
   - Hệ thống **Fuzzy Matchers** trong Karate:
     - `#array` hoặc `#[]`: Xác thực mảng JSON.
     - `#number`: Xác thực trường là số (ID, giá tiền, số lượng).
     - `#string`: Xác thực trường là chuỗi ký tự (tên, mô tả, ảnh).
     - `#boolean`, `#present`, `#notnull`: Kiểm tra sự tồn tại và tính hợp lệ.
   - Phân biệt toán tử so sánh: `match response == ...` (khớp tuyệt đối) vs `match response contains ...` (khớp bao hàm/linh hoạt).
4. **Nguyên lý Data-Driven Testing trong Karate:**
   - Tách biệt logic kịch bản khỏi tập dữ liệu kiểm thử.
   - Sử dụng `Scenario Outline` kết hợp bảng `Examples:`. Mỗi dòng trong bảng là một Test Iteration độc lập (bao phủ: Happy path, SUT Discrepancy, Boundary).
5. **Các Bẫy Thường Gặp & Điểm Yếu (Gắn liền với dự án thực tế EShop):**
   - **Bẫy False Positive (Báo thành công giả tạo):** Viết matcher quá lỏng (chỉ assert status 200 hoặc dùng `contains` mà không kiểm tra độ dài mảng) dẫn đến test vẫn PASS dù backend trả dữ liệu rỗng hoặc sai nghiệp vụ.
   - **Bẫy Flaky Test (Minh họa từ EShop thật):**
     - *Tình huống:* Backend EShop có cơ chế khóa tài khoản (`login_attempts >= 3` sẽ khóa 3 phút) và giỏ hàng lưu in-memory. Nếu kịch bản kiểm thử dùng một tài khoản cố định `admin@eshop.com`, lần chạy 1 pass nhưng lần chạy 2 có thể fail do bị khóa tài khoản hoặc giỏ hàng tồn tại item từ lần test trước $\to$ Test bị chập chờn (flaky).
     - *Giải pháp:* Khởi tạo user ngẫu nhiên theo timestamp (`karate_<timestamp>@eshop.com`) và dùng database SQLite demo riêng có baseline backup.
   - **Bẫy Môi trường (Minh họa từ EShop thật):**
     - *Tình huống:* Máy người chấm hoặc thành viên khác dùng Java 8 hoặc Java 21 không tương thích với runtime của `karate-core 1.4.1` (yêu cầu JDK 17 LTS), hoặc quên chạy `node server.js` khiến port 3000 chưa mở, dẫn đến lỗi `Connection Refused` cho toàn bộ test suite.
6. **Luận điểm về Record & Playback trong Karate (Đáp ứng tiêu chuẩn Bộ môn):**
   - *Đối chiếu với Postman:* Postman cho phép Record request qua proxy và Replay qua Collection Runner trên giao diện GUI.
   - *Triết lý của Karate:* Karate theo đuổi trường phái *Code-based API Testing*. Tính năng "Playback" trong Karate được hiện thực hóa qua cơ chế Replay kịch bản văn bản thuần (`.feature`) qua Maven Surefire Runner hoặc phát lại Mock Server (`karate.start()`). Điều này loại bỏ sự phụ thuộc vào thao tác thu âm thủ công dễ gãy (brittle UI recording), đảm bảo 100% kịch bản được quản lý phiên bản qua Git và tái lập hoàn hảo trong CI/CD pipeline.

---

### III. NỘI DUNG PHẦN GIẢI THÍCH THIẾT KẾ & MÃ NGUỒN (Explanation & Design)
*Mục tiêu: Mổ xẻ chi tiết kiến trúc dự án, cấu hình, đối chiếu trực quan với Postman và làm rõ bản chất Characterization Test.*

1. **Cấu trúc dự án & Cấu hình:**
   - File `pom.xml`: Khai báo `karate-junit5` (v1.4.1), plugin Maven Surefire.
   - File `karate-config.js`: Khởi tạo biến toàn cục `baseUrl: 'http://localhost:3000'`. Tách cấu hình môi trường khỏi kịch bản kiểm thử để dễ chuyển đổi giữa Local/Staging/CI.
   - File runner `EshopTest.java`: JUnit 5 Runner quét tự động đệ quy toàn bộ thư mục `eshop/`, sẵn sàng nhận diện test do AI Agent sinh ra (`eshop/generated/`).
2. **Đối chiếu trực quan Karate $\longleftrightarrow$ Postman (Dùng chính Collection của nhóm):**
   *Minh chứng đối soát:* File collection của bạn Kiên `deliverables/05-management/weekly-reports/week-04/Ha_Quoc_Kien/eshop api.postman_collection_v2.json`.

   | Tiêu chí | Postman (Collection của nhóm) | Karate Framework (`products.feature`) | Ưu thế thực tế của Karate |
   | :--- | :--- | :--- | :--- |
   | **1. Data-Driven** | Tách rời file ngoài CSV/JSON (`data/login_data.csv`), cần dùng GUI Runner hoặc Newman flag `-d data.json`, script phải gọi `pm.iterationData.get("key")`. | Bảng `Examples:` nhúng thẳng bên dưới `Scenario Outline` trong file `.feature`. | Trực quan, dễ đọc, dữ liệu đi liền với kịch bản, không phải quản lý file phụ trợ rời rạc. |
   | **2. Version Control** | Xuất ra 1 file JSON khổng lồ (>200KB, hàng nghìn dòng) chứa cả metadata, UUID, URL, script. Rất dễ bị Git conflict không thể resolve bằng tay, dễ lộ token nếu sơ suất commit. | Tách thành các file text `.feature` theo module (`products.feature`, `auth-cart-checkout.feature`), cấu trúc theo dòng gọn gàng. | Diff dòng lệnh cực kỳ rõ ràng, tuân thủ Git-flow chuẩn mực như source code dự án. |
   | **3. Schema Validation** | Phải tự code JavaScript với thư viện Ajv hoặc viết JSON Schema object cồng kềnh với hàng chục dòng `tv4.validate(...)` hoặc `pm.expect(...)`. | Cung cấp Fuzzy Matchers cực kỳ tinh gọn ngay trên DSL: `match response[0] contains { id: '#number', name: '#string', price: '#number' }`. | Cú pháp súc tích, dễ bảo trì, ai cũng đọc hiểu được mà không cần chuyên gia JavaScript. |

3. **Giải thích Kịch bản K1 (`@k1 @smoke`):**
   - Endpoint: `GET /api/products`.
   - Phân tích 4 Checkpoints: `status 200`, `match response == '#[]'`, `assert response.length > 0`, và kiểm tra schema phần tử đầu tiên `response[0] contains {...}` (đủ 6 trường: `id`, `name`, `price`, `description`, `imageUrl`, `category_id`).
4. **Giải thích Kịch bản K2 (`@k2 @data-driven`) & Bản chất Characterization Test:**
   - Tên kịch bản: *Query product by ID with boundary & discrepancy assertions*.
   - **Bản chất "Ghi nhận hành vi SUT" (Characterization Test):**
     - Đây là kỹ thuật kiểm thử ghi nhận lại trạng thái thực tế của hệ thống tại thời điểm kiểm thử làm baseline.
     - **Lưu ý mấu chốt:** *Test xanh (PASS) KHÔNG đồng nghĩa với việc SUT đang hoạt động đúng theo đặc tả nghiệp vụ!*
     - **Quy trình xử lý chuẩn mực trong QA:**
       1. Đánh dấu tag phân loại: `@known-issue` hoặc `@discrepancy`.
       2. Ghi nhận lỗi vào **Bug Report** gửi cho đội phát triển SUT với đầy đủ log/payload làm bằng chứng.
       3. Thiết kế song song kịch bản **test theo đặc tả (Specification-compliant Test)** — ví dụ kỳ vọng trả về `404 Not Found` (với ID 9999) hoặc `price` phải là kiểu số — để test này **FAIL có chủ đích (Intentional Failure)**, đóng vai trò như một chốt chặn phát hiện bug cho đến khi Backend sửa xong.
   - **Phân tích 3 ca kiểm thử trong bảng `Examples:`:**
     - **Ca 1 (ID = 1 - iPhone 15 Pro Max):** Happy path chuẩn mực, `price` là `#number`.
     - **Ca 2 (ID = 2 - Samsung Galaxy S24 Ultra):** Ghi nhận khiếm khuyết SUT: Backend EShop tự ý ép kiểu `price` thành chuỗi String (`"28000000"`). Test ghi nhận kỳ vọng thực tế `{ price: '#string' }`.
     - **Ca 3 (ID = 9999 - Boundary / Non-existent ID):** Ghi nhận khiếm khuyết SUT: Backend trả về `200 OK` kèm `{}` thay vì `404 Not Found`.
   - **Minh họa Lỗi có chủ đích (Intentional Failure Demo):**
     - Để minh họa trực quan khả năng phát hiện lỗi của Karate: Trong video, người trình bày sẽ sửa tạm thời kỳ vọng của ca ID = 9999 thành `expectedStatus: 404` (theo đúng chuẩn REST đặc tả).
     - Khi chạy lại lệnh test, Karate sẽ lập tức báo **FAIL (Đỏ)** trực quan trên terminal và báo cáo HTML (`status code was: 200, expected: 404`).
     - Sau khi giải thích cơ chế bắt lỗi bug detector, kịch bản được hoàn nguyên về `{ expectedStatus: 200, expectedMatch: {} }` để khôi phục trạng thái xanh toàn vẹn.

---

### IV. NỘI DUNG PHẦN THỰC THI & ĐÁNH GIÁ (Execution & Evaluation)
*Mục tiêu: Thực hiện demo trực tiếp, soi terminal logs, duyệt báo cáo HTML và đánh giá toàn diện công cụ.*

1. **Chuẩn bị môi trường & Chạy lệnh CLI:**
   - Kiểm tra backend đang chạy trên cổng 3000: `curl -I http://localhost:3000/api/products`.
   - Thực thi lệnh Maven:
     ```bash
     cd tests/karate
     mvn test -Dkarate.options="classpath:eshop/products.feature"
     ```
2. **Phân tích Terminal Wire Logs & Quy trình Thử nghiệm 2 Lượt (Xanh - Đỏ - Xanh):**
   - **Lượt 1 (Baseline PASS 100%):** Chỉ ra quá trình Maven biên dịch và JUnit 5 khởi động. Đọc trực tiếp HTTP Wire Logs: URL request, Request Headers, Response Status (200), Response Headers và Payload JSON trả về. Xác nhận 4 scenarios (1 của K1 và 3 iterations của K2) đều đạt trạng thái PASSED.
   - **Lượt 2 (Intentional Failure - Bắt lỗi đỏ):** Chỉnh sửa ca ID = 9999 kỳ vọng status 404. Chạy lại `mvn test`, dừng hình chỉ rõ thông báo lỗi màu đỏ trên console: `status code was: 200, expected: 404`.
   - **Hoàn nguyên:** Đưa kịch bản trở lại baseline để bộ test phục hồi trạng thái xanh 100%.
3. **Phân tích Báo cáo HTML trực quan (Karate Reports):**
   - Mở file `target/karate-reports/karate-summary.html`: Tỷ lệ pass 100%, thời gian thực thi của suite.
   - Mở file `target/karate-reports/eshop.products.html`: Xem chi tiết từng step màu xanh; đối soát payload của ca ID = 2 (`price: "28000000"`) và ca ID = 9999 (trả `{}` với status 200); đồng thời chỉ ra vị trí hiển thị lỗi step màu đỏ khi xảy ra vi phạm assertion.
4. **Đánh Giá Toàn Diện Về Karate Framework:**
   - **Giải quyết vấn đề gì?** Cung cấp giải pháp kiểm thử API tự động hóa dạng mã nguồn hoàn chỉnh, tích hợp sẵn HTTP client, JSON assertions, data-driven và báo cáo HTML trực quan mà không cần ghép nối nhiều thư viện rời rạc.
   - **Khi nào NÊN dùng?**
     - Khi dự án muốn áp dụng BDD/Gherkin để cả QA, Developer và Product Owner đều đọc hiểu được kịch bản kiểm thử.
     - Khi kiểm thử các chuỗi nghiệp vụ (Workflow) phức tạp cần truyền token, chaining dữ liệu và validate JSON Schema động.
     - Khi muốn tích hợp kiểm thử API vào CI/CD pipeline chuẩn mực thông qua Maven Surefire.
   - **Khi nào KHÔNG NÊN dùng?**
     - Khi nhóm chỉ cần thăm dò API nhanh (Ad-hoc API exploration) hoặc debug thủ công từng request $\implies$ Postman tiện lợi hơn rất nhiều.
     - Khi hệ thống kiểm thử là thuần Java Unit Test ở tầng Controller/Service $\implies$ MockMvc hoặc REST-Assured tích hợp sâu với Spring Context tốt hơn.
     - Khi kiểm thử tương thích hợp đồng giữa các Microservices độc lập $\implies$ Karate không thay thế được Pact (CDCT).
   - **Lý do kỹ thuật (Trade-offs):** Karate yêu cầu cài đặt môi trường Java/Maven (nặng hơn Node.js/Postman); việc viết script phức tạp trong Gherkin đòi hỏi phải hiểu cơ chế nhúng JavaScript của Karate.

---
---

# VIDEO 2: KIỂM THỬ HỢP ĐỒNG & PHÁT HIỆN BREAKING CHANGE VỚI PACT JS (C3)

- **Thời lượng dự kiến:** 8 – 10 phút
- **Phạm vi kịch bản:** Kịch bản C3 (Phát hiện Breaking Changes & Mô hình 3 Pha Khép Kín: Pha 1 Baseline - Pha 2 gồm 3 biến thể Mutation/Non-breaking - Pha 3 Rollback)
- **Hệ thống SUT:** EShop (Consumer: `EShopMobile` — Provider: `EShopBackend`)
- **Tập tin minh chứng:** `tests/pact/pacts/EShopMobile-EShopBackend.json`, `tests/pact/breaking-change/pact-c3-runner.js`, `Pact_C3_Execution_Guide.md`

---

### I. NỘI DUNG PHẦN GIỚI THIỆU (Introduction)
*Mục tiêu: Giới thiệu công cụ Pact, lý do lựa chọn và đặt ra bài toán thực tế về Breaking Changes.*

1. **Thông tin cá nhân & Nhiệm vụ:**
   - Giới thiệu bản thân: Nguyễn Quốc Kỳ (MSSV: 23120138), phụ trách kịch bản C3; Nguyễn Hoàng Anh Tú là người review và phụ trách C1/C2.
2. **Giới thiệu công cụ Pact & Lý do lựa chọn:**
   - **Định nghĩa:** Pact là framework mã nguồn mở tiêu chuẩn công nghiệp (de-facto standard) cho Consumer-Driven Contract Testing (CDCT), hỗ trợ đa ngôn ngữ (JavaScript, Java, Go, Python, C#...) dựa trên lõi chung Pact Rust FFI.
   - **Lý do lựa chọn Pact:** Cho phép các đội ngũ phát triển Consumer (Mobile/Web) và Provider (Backend) kiểm thử tính tương thích tích hợp độc lập mà **không cần dựng toàn bộ môi trường End-to-End Test cồng kềnh, tốn kém và chậm chạp**.
3. **Bài toán thực tế trong tiến hóa phần mềm (Software Evolution):**
   - Trong kiến trúc Microservices và Client-Server, các nhóm phát triển Provider (Backend) thường xuyên tái cấu trúc API, đổi tên trường hoặc tối ưu hóa dữ liệu.
   - Định nghĩa **Breaking Change**: Xảy ra khi Provider thay đổi API làm cho Consumer (`EShopMobile`) đang chạy bình thường bị lỗi ngoài dự kiến.
4. **Giới hạn chết người của Functional API Testing (Postman/Newman):**
   - Khi Backend đổi tên trường `price` thành `unit_price`, server vẫn trả về mã trạng thái **HTTP 200 OK**.
   - Test Postman kiểm tra `pm.response.to.have.status(200)` vẫn báo **PASSED** (False Positive - Xanh ảo).
   - **Hậu quả ngoài Production:** Ứng dụng di động khi đọc `product.price` sẽ nhận `undefined`. Khi thực hiện phép nhân tính tổng tiền (`price * quantity`), kết quả trả về `NaN` hoặc gây crash màn hình giỏ hàng của khách hàng!
5. **Mục tiêu của Kịch bản C3:**
   - Chứng minh cách **Pact JS** hoạt động như một **Deployment Gate** tự động đối soát và chặn đứng bản build lỗi ngay tại CI/CD pipeline trước khi ra Production.

---

### II. NỘI DUNG PHẦN LÝ THUYẾT & NGUYÊN LÝ (Theory & Principles)
*Mục tiêu: Sơ đồ luồng toàn diện, nguyên lý CDCT, Matching Rules, phân loại thay đổi và phân tích thận trọng về Rust FFI Coercion.*

1. **Sơ đồ Luồng Hoạt Động Toàn Diện (End-to-End Workflow Diagram):**
   ```text
   [Consumer Test (C1)] ──> Sinh [Pact File JSON] ──> [Provider Verify (C2/C3)]
                                                              │
                                                       (Pact Broker)
                                                              │
                                                              ▼
                                                 Lệnh [can-i-deploy] ──> Deploy to Production
   ```
   - Giải thích luồng: Consumer viết test với Mock Server để sinh ra hợp đồng Pact JSON $\to$ Provider Verify đọc hợp đồng đối soát với backend thật $\to$ Kết quả được đẩy lên Pact Broker để kiểm tra ma trận tương thích qua lệnh `can-i-deploy`.

2. **Nguyên lý Matching Rules — Vì sao so khớp theo Kiểu (Type) thay vì Giá trị (Value)?**
   - Trong file hợp đồng, trường `$.price` được gắn matcher `{ match: "integer" }` thay vì cố định giá trị `30000000`.
   - **Ý nghĩa kỹ thuật (Loose Coupling):** Trong thực tế, dữ liệu sản phẩm luôn biến động (giá thay đổi theo khuyến mại, ID tăng dần). Consumer chỉ cần đảm bảo nhận đúng *cấu trúc và kiểu dữ liệu* để ứng dụng chạy không lỗi, không trói buộc Provider phải trả về đúng con số 30.000.000, giúp Provider tự do cập nhật dữ liệu mà không làm vỡ hợp đồng.

3. **Phân loại các dạng thay đổi API:**
   - **Dạng 1: Field Renamed / Missing Property:** Provider đổi tên `price` $\to$ `unit_price`. Mobile bị lỗi `undefined` $\implies$ Pact Verifier đánh **FAIL & CHẶN ĐỨNG**.
   - **Dạng 2: Data Type Mismatch:** Provider tự ý format tiền tệ thành chuỗi `'30.000.000 ₫'` thay vì số nguyên `30000000`. Phép tính ra `NaN` $\implies$ Pact Verifier đánh **FAIL & CHẶN ĐỨNG**.
   - **Non-breaking Change:** Provider thêm trường mới `brand: "Apple"`. Pact tự động bỏ qua vì Consumer không khai báo dùng $\implies$ **PASS** (An toàn, cho phép Provider thoải mái tiến hóa tính năng).

4. **Đánh giá thực nghiệm thận trọng về Cơ chế Coercion của Pact Rust FFI:**
   - *Cách diễn đạt khoa học & thận trọng:*
     > *"Trong quá trình thực nghiệm đối soát của nhóm với thư viện `@pact-foundation/pact` V3 (sử dụng lõi Rust FFI), chúng tôi quan sát thấy rằng khi trường dữ liệu được khai báo matcher `integer`, nếu Provider trả về một chuỗi chỉ thuần các ký tự số (như `"30000000"`), Rust parser nội bộ có xu hướng tự động ép kiểu chuỗi này thành số nguyên và coi là hợp lệ. Để kiểm chứng vi phạm kiểu dữ liệu cấp độ JSON Type (String vs Integer) một cách nghiêm ngặt và không phụ thuộc vào cơ chế parse ngầm, nhóm đã thiết kế ca kiểm thử với chuỗi định dạng tiền tệ `'30.000.000 ₫'`. Log đối soát thực tế tại Pha 2B đã ghi nhận lỗi vi phạm kiểu dữ liệu một cách rõ ràng và minh bạch."*

---

### III. NỘI DUNG PHẦN GIẢI THÍCH THIẾT KẾ KỸ THUẬT (Explanation & Design)
*Mục tiêu: Phân tích file hợp đồng JSON, kiến trúc Mock Server và Quy trình 4 Pha mở rộng.*

1. **Phân tích Tệp Hợp Đồng JSON (`EShopMobile-EShopBackend.json`):**
   - Consumer: `EShopMobile`, Provider: `EShopBackend`.
   - Request mong đợi: `GET /api/products/1`, Accept `application/json`.
   - Provider State: `product with ID 1 exists`.
   - Response mong đợi: `status 200`, Body mẫu có `price: 30000000`.
   - Ràng buộc `matchingRules`: Quy tắc `$.price` có matcher `{ match: "integer" }`.
2. **Kiến trúc Server Mock có kiểm soát (`createControllableServer`) & Biện giải kỹ thuật:**
   - Thiết kế Express Server trên cổng `3005` trong `pact-c3-runner.js`.
   - Sử dụng biến trạng thái `currentMode` để chuyển đổi linh hoạt phản hồi của server.
   - **Biện giải kỹ thuật (Technical Defense):** Việc sử dụng cổng 3005 là *giải pháp cô lập vi sai (Differential Isolation)*: Cho phép kiểm thử tự động, lặp lại tức thì và cô lập hoàn toàn, tránh gây tác dụng phụ (side-effects) làm biến đổi database SQLite của backend chính cổng 3000.
   - **Kết nối với Backend thật:** Kịch bản đối soát trên cổng 3005 mô phỏng chính xác 100% route `GET /api/products/:id` của backend EShop. Nhóm cũng đã phát triển sẵn script `npm run test:c3:live` (ghi nhận trong `Pact_C3_Execution_Guide.md`) để có thể chạy trực tiếp trên backend EShop thật cổng 3000 bất cứ lúc nào.
3. **Mô hình 3 Pha Khép Kín (Three-Phase Protocol) trong `pact-c3-runner.js`:**
   - **Pha 1 — Kiểm chứng Baseline (Baseline Verification):** `currentMode = 'BASELINE'`, trả về payload chuẩn (`price: 30000000 [Integer]`). Kết quả kỳ vọng: **PASS 100%** (Hợp đồng toàn vẹn).
   - **Pha 2 — Thử nghiệm Đột biến & Tiêm lỗi (Mutation Testing & Injection):**
     - **Bước 2A — Tiêm Breaking Change Đổi tên trường:** `currentMode = 'MUTATION_RENAME'`, trả về `unit_price: 30000000` (thiếu key `price`). Kết quả kỳ vọng: **FAIL & BLOCKED**.
     - **Bước 2B — Tiêm Breaking Change Sai lệch kiểu dữ liệu:** `currentMode = 'MUTATION_TYPE'`, trả về `price: '30.000.000 ₫'`. Kết quả kỳ vọng: **FAIL & BLOCKED**.
     - **Bước 2C — Tiêm Non-breaking Change (Thêm trường mới):** `currentMode = 'MUTATION_NON_BREAKING'`, bổ sung `brand: "Apple"`. Kết quả kỳ vọng: **PASS** (Chứng minh Pact cho phép mở rộng dữ liệu an toàn).
   - **Pha 3 — Tự động hoàn nguyên (Auto-Rollback & Re-verification):** Đưa `currentMode` trở lại `BASELINE`. Kết quả kỳ vọng: **PASS phục hồi xanh**.

---

### IV. NỘI DUNG PHẦN THỰC THI & ĐÁNH GIÁ (Execution & Evaluation)
*Mục tiêu: Chạy runner tự động, phân tích log bắt lỗi của Rust FFI, đọc bảng tổng hợp và đánh giá toàn diện công cụ.*

1. **Thực thi script C3 trên Terminal:**
   - Chạy lệnh:
     ```bash
     cd tests/pact
     npm run test:c3
     ```
2. **Phân tích Nhật ký Console theo từng pha:**
   - **Pha 1 Log:** Đọc dòng `has a matching body (OK)` $\implies$ Xác nhận Baseline đạt chuẩn.
   - **Pha 2A Log:** Chỉ ra thông báo lỗi màu đỏ từ Pact FFI:
     ```text
     Failures: 1.1) has a matching body
            $ -> Actual map is missing the following keys: price
     [ERROR] pact-core: Verification unsuccessful
     ```
     $\implies$ Chặn đứng nguy cơ crash `undefined` trên mobile.
   - **Pha 2B Log:** Chỉ ra thông báo lỗi màu đỏ:
     ```text
     Failures: 1.1) has a matching body
            $.price -> Expected '30.000.000 ₫' (String) to be an integer number
     [ERROR] pact-core: Verification unsuccessful
     ```
     $\implies$ Chặn đứng nguy cơ tính tiền ra `NaN`.
   - **Pha 2C Log:** Đọc dòng `has a matching body (OK)` kèm thông báo: *Pact cho phép Provider thêm trường "brand" mà không làm vỡ hợp đồng*.
   - **Pha 3 Log:** Đọc dòng `has a matching body (OK)` $\implies$ Hệ thống xanh trở lại sau khi hoàn nguyên.
3. **Phân tích Bảng ma trận tổng hợp (`console.table`):**
   - Chiếu bảng tổng kết đầy đủ 5 dòng tương ứng với 5 bước thực nghiệm thuộc 3 pha (Baseline, Rename, Type Mismatch, Non-breaking, Rollback). Toàn bộ kết quả `actual` khớp 100% với `expected`.
4. **Đánh Giá Toàn Diện Về Pact JS & Contract Testing:**
   - **Giải quyết vấn đề gì?** Giải quyết triệt để bài toán tích hợp giữa các dịch vụ trong kiến trúc phân tán/microservices, tự động phát hiện Breaking Changes trước khi deploy mà không cần phụ thuộc vào môi trường End-to-End test dùng chung.
   - **Khi nào NÊN dùng?**
     - Khi hệ thống có nhiều Consumer (Web, iOS, Android, 3rd party) cùng tiêu thụ một tập hợp API Provider.
     - Khi các nhóm phát triển Provider và Consumer làm việc độc lập, release theo chu kỳ khác nhau (asynchronous deployment).
     - Khi muốn thiết lập chốt chặn tự động (Deployment Gate) trên CI/CD pipeline với Pact Broker.
   - **Khi nào KHÔNG NÊN dùng?**
     - Khi hệ thống là nguyên khối (Monolith), chỉ có một web app giao tiếp trực tiếp với database.
     - Khi cần kiểm thử logic nghiệp vụ sâu bên trong Backend (như thuật toán giảm giá, tính thuế, phân quyền) $\implies$ Phải dùng API Functional Testing (Postman/Karate) hoặc Unit/Integration Test.
     - Khi API là Public API mở cho hàng triệu người dùng không định danh $\implies$ Khó xác định danh tính cụ thể của từng Consumer để ký hợp đồng.
   - **Lý do kỹ thuật (Trade-offs):** Đòi hỏi sự thay đổi văn hóa làm việc giữa các team (Consumer-Driven mindset); chi phí thiết lập và bảo trì ban đầu cao hơn so với viết script Postman đơn giản; cần quản lý state handlers cẩn thận để tránh dữ liệu rác.

---

## BẢNG TỔNG HỢP SO SÁNH 2 VIDEO DEMO

| Tiêu chí | Video 1: Karate Framework (K1 & K2) | Video 2: Pact Contract Testing (C3) |
| :--- | :--- | :--- |
| **Trường phái kiểm thử** | BDD / Code-based Functional & Schema Testing | Consumer-Driven Contract Testing (CDCT) |
| **Trọng tâm lý thuyết** | Smoke test vs Regression, Fuzzy Matchers, Data-Driven, Bẫy Flaky, Record & Playback | Nguyên lý CDCT, Loose Coupling Matching Rules, Mô hình 3 Pha (2 dạng Breaking & 1 dạng Non-breaking), Deployment Gate |
| **Đối chiếu công cụ** | So sánh trực quan Karate $\leftrightarrow$ Postman (Data-driven, Git, Schema) | Chỉ rõ giới hạn của Postman (False Positive HTTP 200 OK) |
| **Bản chất ca kiểm thử** | Characterization Test (Ghi nhận trung thực 2 lỗi SUT Discrepancy) | Mutation & Verification Test (Tiêm lỗi và chặn lỗi tự động) |
| **Lệnh chạy demo** | `mvn test -Dkarate.options="classpath:eshop/products.feature"` | `npm run test:c3` |
| **Bằng chứng kết quả** | Báo cáo HTML trực quan (`karate-summary.html`), HTTP Wire Logs | Terminal logs bắt lỗi Pact Rust FFI, Bảng Console Table 5 bước thực nghiệm (3 pha) |
| **Thời lượng đề xuất** | 7 – 9 phút | 8 – 10 phút |
