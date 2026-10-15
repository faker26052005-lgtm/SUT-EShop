# Kế hoạch Triển khai Kiểm thử API với Karate Framework (K1, K2, K3)

Tài liệu này vạch ra chi tiết các bước thiết lập môi trường, cấu trúc dự án, viết kịch bản kiểm thử (Karate Feature Files) cho hệ thống EShop SUT (Node.js/Express + SQLite), đáp ứng đầy đủ yêu cầu của Giai đoạn 2 và cung cấp nền tảng phục vụ task AI Agent (AI1) của Kiên.

---

## User Review Required

> [!IMPORTANT]
> **Cài đặt môi trường Java & Maven:**
> Bạn hiện chưa cài đặt Java (JDK) và Maven trên máy Ubuntu. Karate yêu cầu Java Runtime (khuyến nghị OpenJDK 17 LTS) và Apache Maven để build & run test runner. 
> Trước khi chạy test, bạn cần cài đặt qua lệnh:
> ```bash
> sudo apt update && sudo apt install -y openjdk-17-jdk maven
> ```

> [!WARNING]
> **Cơ chế Khóa Tài khoản (Account Lockout) của Backend EShop:**
> Trong [server.js](file:///home/quocky05/academy/software-testing/eshop-sut/backend/server.js#L54-L62), nếu đăng nhập sai 2 lần liên tiếp, tài khoản sẽ bị khóa trong 3 phút (`login_attempts >= 3` tính cộng dồn +2 mỗi lần sai).
> Do đó, trong các kịch bản data-driven kiểm thử đăng nhập lỗi hoặc chạy lặp lại, chúng ta **không** dùng tài khoản chung (`test@eshop.com`) mà sử dụng tài khoản chuyên biệt hoặc kịch bản đăng ký tạm thời (`POST /api/register`) để không làm ảnh hưởng đến các thành viên khác đang test Postman.

---

## Open Questions

> [!NOTE]
> 1. **Cài đặt JDK & Maven:** Bạn có muốn tự cài đặt bằng lệnh `sudo apt install -y openjdk-17-jdk maven` trên terminal riêng, hay bạn muốn tôi đề xuất lệnh chạy trực tiếp tại đây khi bạn phê duyệt kế hoạch?
> 2. **Tài khoản test cho luồng K3:** Bạn muốn kịch bản K3 dùng sẵn tài khoản seed (`test@eshop.com` / `Test1234!`) hay tạo động một user mới qua `POST /api/register` ở đầu kịch bản để đảm bảo giỏ hàng hoàn toàn sạch mỗi lần chạy? (Khuyến nghị: Đăng ký user động theo timestamp để giỏ hàng và đơn hàng luôn độc lập).

---

## Proposed Changes

Chúng ta triển khai toàn bộ mã nguồn kiểm thử Karate trong thư mục chuẩn `tests/karate/` (theo đúng quy ước tại [REPOSITORY_STRUCTURE.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/REPOSITORY_STRUCTURE.md)) nhằm tách biệt hoàn toàn với mã nguồn backend SUT và các suite test khác (`postman/`, `pact/`, `ai-agent/`).

```
tests/karate/
├── pom.xml                                  # [ĐÃ TẠO] Cấu hình Maven & Karate 1.4.1
├── README.md                                # [ĐÃ TẠO] Hướng dẫn chạy và cấu hình
└── src
    └── test
        └── java
            ├── eshop
            │   ├── EshopTest.java           # [ĐÃ TẠO] JUnit 5 Runner
            │   ├── products.feature         # [CẦN TẠO] Kịch bản K1, K2
            │   ├── auth-cart-checkout.feature # [CẦN TẠO] Kịch bản K3
            │   └── generated/               # [ĐÃ TẠO] Thư mục nhận test từ AI của Kiên
            ├── karate-config.js             # [ĐÃ TẠO] Cấu hình môi trường & baseUrl
            └── logback-test.xml             # [ĐÃ TẠO] Cấu hình log format
```


---

### Component 1: Cấu hình Dự án & Test Runner (Maven & Karate Core)

Khung dự án Maven chuẩn cho Karate 1.4.1 (Java 17+ và JUnit 5) đã được tạo sẵn tại thư mục `tests/karate/`.

#### [SCAFFOLDED] [pom.xml](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/pom.xml)
- Cấu hình groupId `com.eshop`, artifactId `karate-demo`, Java 17.
- Dependency `com.intuit.karate:karate-junit5:1.4.1`.
- Cấu hình `<testResources>` copy các file `.feature` vào classpath khi build.
- Cấu hình `maven-surefire-plugin` hỗ trợ chạy test.

#### [SCAFFOLDED] [karate-config.js](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/src/test/java/karate-config.js)
- Hàm khởi tạo cấu hình môi trường Karate.
- Đặt `baseUrl: 'http://localhost:3000'`, `connectTimeout: 5000`, `readTimeout: 5000`.

#### [SCAFFOLDED] [EshopTest.java](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/src/test/java/eshop/EshopTest.java)
- JUnit 5 Test Runner sử dụng `@Karate.Test`.
- Quét và thực thi toàn bộ các file `.feature` trong package `eshop` và các thư mục con (bao gồm cả `generated/` do AI của Kiên sinh ra sau này).

#### [SCAFFOLDED] [logback-test.xml](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/src/test/java/logback-test.xml)
- Cấu hình Logback hiển thị log HTTP Request/Response rõ ràng.

---

### Component 2: Kịch bản Kiểm thử Tính năng (Feature Files)

#### [NEW] [products.feature](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/src/test/java/eshop/products.feature)
Phục vụ trực tiếp cho **Clip K1** và **Clip K2**:
- **Kịch bản K1 — Request đầu tiên & Response Array:**
  - `GET /api/products`
  - Assert status `200`
  - Assert `response == '#[]'` (mảng JSON)
  - Assert schema của phần tử đầu tiên: `id == '#number'`, `name == '#string'`, `price == '#number'`.
- **Kịch bản K2 — Assertions Nâng cao & Data-Driven (Scenario Outline):**
  - Sử dụng `Scenario Outline` với bảng `Examples`:
    - Case 1: ID hợp lệ lẻ (VD: `id = 1` - iPhone 15 Pro Max) ➔ Assert `status 200`, `price == '#number'`.
    - Case 2: ID hợp lệ chẵn (VD: `id = 2` - Samsung S24 Ultra) ➔ Backend có lỗi chuyển `price` thành dạng chuỗi (`price.toString()`). Kịch bản sẽ ghi nhận rõ ràng sự bất đồng bộ (discrepancy) này thay vì sửa sai expected.
    - Case 3: ID không tồn tại (`id = 9999`) ➔ Backend hiện trả `200 OK` kèm `{}` thay vì `404 Not Found`. Test sẽ assert theo hành vi quan sát được và gắn tag `@discrepancy`.
    - Case 4: Kịch bản mismatch có chủ đích (intentional failure) để trình chiếu trong video cách Karate báo lỗi assertion màu đỏ rõ ràng, sau đó hoàn nguyên để test xanh.

#### [NEW] [auth-cart-checkout.feature](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/src/test/java/eshop/auth-cart-checkout.feature)
Phục vụ trực tiếp cho **Clip K3** (Workflow mua hàng có trạng thái & Authentication):
- **Kịch bản Happy Path (End-to-End Shopping Workflow):**
  1. *Đăng ký / Đăng nhập:* Gửi `POST /api/login` (hoặc tạo user mới để tránh xung đột), trích xuất `token` từ response gán vào biến Karate `authToken`.
  2. *Lấy danh sách sản phẩm:* `GET /api/products`, chọn sản phẩm đầu tiên và lấy `id`, `name`, `price`.
  3. *Thêm vào giỏ hàng:* `POST /api/cart` kèm Header `Authorization: 'Bearer ' + authToken`, body chứa thông tin sản phẩm và `quantity: 1`. Assert message `"Added to cart"`.
  4. *Kiểm tra giỏ hàng:* `GET /api/cart` kèm Token, assert trong mảng giỏ hàng có chứa item vừa thêm.
  5. *Thực hiện thanh toán:* `POST /api/checkout` kèm Token và `shipping_address`, lưu lại `orderId` trả về từ response. Assert `response.orderId == '#number'`.
  6. *Xác nhận đơn hàng:* `GET /api/orders/my-orders` kèm Token, kiểm tra đơn hàng có `id == orderId` xuất hiện ở đầu danh sách.
- **Kịch bản Negative (Bảo mật & Phân quyền):**
  - Gọi `GET /api/cart` mà **không** truyền Header `Authorization` ➔ Assert trả về `401 Unauthorized` và `response.error == 'Unauthorized'`.

---

### Component 3: Tài liệu Hướng dẫn & Tích hợp với AI Task của Kiên

#### [SCAFFOLDED] [README.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate/README.md)
- Tài liệu chi tiết hướng dẫn:
  - Yêu cầu môi trường (Java 17, Maven 3.8+).
  - Lệnh khởi động backend EShop.
  - Lệnh thực thi toàn bộ test: `mvn clean test`.
  - Lệnh chạy từng feature riêng biệt:
    ```bash
    mvn test -Dkarate.options="classpath:eshop/products.feature"
    mvn test -Dkarate.options="classpath:eshop/auth-cart-checkout.feature"
    ```
  - Đường dẫn xem báo cáo trực quan HTML: `target/karate-reports/karate-summary.html`.
  - Hướng dẫn bàn giao cho Kiên: Quy ước đặt file test do AI Agent sinh ra vào thư mục `tests/karate/src/test/java/eshop/generated/` để Maven tự động nhận diện và chạy được ngay.

---

### Component 4: Quy trình Git Commit & Quản lý Minh chứng (Weekly Report Alignment)

Để đáp ứng đầy đủ yêu cầu tại [weekly-report-requirements.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/00-requirements/weekly-report-requirements.md), toàn bộ quá trình thực hiện kiểm thử Karate phải tuân thủ nghiêm ngặt các bước sau:

#### 1. Kiểm tra Danh tính Git (Git Author Identity)
Trước khi commit, xác nhận chính xác thông tin tác giả cá nhân của Kỳ:
```bash
git config user.name "Nguyen Quoc Ky"
git config user.email "nqky2407@gmail.com"
```
Đảm bảo thông tin này khớp với dòng ánh xạ ở đầu báo cáo `Git Commit Log Total.md`:
`Nguyen Quoc Ky <nqky2407@gmail.com> ↔ [MSSV] - Nguyễn Quốc Kỳ`.

#### 2. Chiến lược Commit Nguyên tử (Atomic Git Commits)
Không gom toàn bộ bài làm vào 1 commit lớn cuối cùng. Thực hiện commit tuần tự theo từng mốc công việc:
- **Commit 1 (K1 & K2):**
  ```bash
  git add tests/karate/src/test/java/eshop/products.feature
  git commit -m "feat(karate): add products.feature for smoke and data-driven tests (K1, K2)"
  ```
- **Commit 2 (K3):**
  ```bash
  git add tests/karate/src/test/java/eshop/auth-cart-checkout.feature
  git commit -m "feat(karate): add auth-cart-checkout.feature for e2e stateful workflow (K3)"
  ```
- **Commit 3 (Tài liệu & Kế hoạch cập nhật):**
  ```bash
  git add deliverables/02-reports/research/Phase2_Karate_Implementation_Plan.md tests/karate/README.md
  git commit -m "docs(karate): update implementation plan and test suite execution guide"
  ```
*Lưu ý vệ sinh Git:* Tuyệt đối không commit thư mục `target/` hoặc các file sinh tạm của Maven.

#### 3. Danh mục Thu thập Minh chứng Thực tế (Screenshots & Logs Checklist)
Trong lúc chạy test, chụp lại các màn hình minh chứng sau để lưu vào báo cáo tuần:
1. `java -version` và `mvn -version`.
2. Backend EShop chạy tại terminal (`node server.js` hiển thị port 3000).
3. Terminal chạy `mvn test` hiển thị kết quả các Scenario xanh (PASS).
4. Terminal chạy ca lỗi có chủ đích (K2 intentional mismatch) hiển thị assertion đỏ (FAIL), sau đó hoàn nguyên để test xanh.
5. Báo cáo HTML trực quan: Mở `target/karate-reports/karate-summary.html` trên trình duyệt và chụp tổng quan dashboard cùng chi tiết timeline.
6. Xác minh Database SQLite: Chụp dữ liệu bảng `orders` trước và sau khi chạy K3 để chứng minh đơn hàng thực sự được ghi vào CSDL.

#### 4. Ghi nhận Tự động Báo cáo AI Usage (AI Usage Declaration)
Sau khi hoàn thành các tương tác hoặc phiên làm việc, chạy skill `ai-usage-logger` để cập nhật tự động toàn bộ prompt, tool calls, và quyết định human review vào tài liệu nộp:
```bash
python3 ~/.gemini/config/skills/ai-usage-logger/scripts/extract_ai_usage.py --week 02
```
File kết quả được ghi nhận tại:
[deliverables/05-management/weekly-reports/week-02/AI Usage Declaration.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/05-management/weekly-reports/week-02/AI%20Usage%20Declaration.md)

#### 5. Ghi nhận Bất đồng bộ SUT (Discrepancies & Failure Modes)
Ghi chú chi tiết các lỗi của SUT EShop phát hiện qua kịch bản Karate để đưa vào slide thuyết trình và báo cáo cuối môn:
- Bug 1: `GET /api/products/2` trả về `price` dạng String thay vì Number.
- Bug 2: `GET /api/products/9999` trả về HTTP `200` kèm object rỗng `{}` thay vì HTTP `404 Not Found`.
- Bug 3: Đăng nhập sai 2 lần liên tiếp dẫn đến khóa tài khoản 3 phút (`login_attempts >= 3`).


---

## Verification Plan

### Automated Tests
1. **Kiểm tra môi trường:**
   ```bash
   java -version
   mvn -version
   ```
2. **Khởi động Backend SUT:**
   ```bash
   cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/backend
   node server.js
   ```
3. **Thực thi bộ test Karate:**
   ```bash
   cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate
   mvn clean test
   ```
4. **Kiểm tra kết quả và báo cáo HTML:**
   - Xác nhận log trên terminal hiển thị đầy đủ các Scenario pass/fail theo đúng kịch bản.
   - Kiểm tra file `target/karate-reports/karate-summary.html` được sinh ra đầy đủ.
5. **Kiểm tra lịch sử Git Commit:**
   ```bash
   git -C /home/quocky05/academy/software-testing/seminar/SUT-EShop log -n 5 --oneline
   ```
6. **Cập nhật & kiểm tra AI Usage Declaration:**
   ```bash
   python3 ~/.gemini/config/skills/ai-usage-logger/scripts/extract_ai_usage.py --week 02
   ```

### Manual Verification
- Xác minh kịch bản lỗi có chủ đích (K2 intentional mismatch): Cố tình đổi assertion `status 201` cho `GET /api/products/1` để quan sát báo cáo lỗi màu đỏ, sau đó đổi lại `200` để báo cáo xanh trở lại.
- Xác minh dữ liệu trong database SQLite: Sau khi chạy K3, kiểm tra bảng `orders` để đảm bảo đơn hàng mới thực sự được tạo với đúng `user_id` và `total_amount`.

