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

Chúng ta sẽ tạo toàn bộ mã nguồn kiểm thử Karate trong thư mục độc lập `artifacts/demo/karate/` để tách biệt hoàn toàn với mã nguồn backend SUT.

```
artifacts/demo/karate/
├── pom.xml
├── README.md
└── src
    └── test
        └── java
            ├── eshop
            │   ├── EshopTest.java
            │   ├── auth-cart-checkout.feature
            │   └── products.feature
            ├── karate-config.js
            └── logback-test.xml
```

---

### Component 1: Cấu hình Dự án & Test Runner (Maven & Karate Core)

Tạo khung dự án Maven chuẩn cho Karate 1.4.1 (phiên bản ổn định cao, tương thích tốt với Java 17+ và JUnit 5).

#### [NEW] [pom.xml](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/pom.xml)
- Cấu hình groupId `com.eshop`, artifactId `karate-demo`, Java 17.
- Khai báo dependency `com.intuit.karate:karate-junit5:1.4.1`.
- Cấu hình build `<testResources>` để Maven copy các file `.feature` từ `src/test/java` vào classpath khi build.
- Cấu hình `maven-surefire-plugin` hỗ trợ chạy test song song hoặc theo từng feature.

#### [NEW] [karate-config.js](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/src/test/java/karate-config.js)
- Thiết lập hàm khởi tạo cấu hình môi trường Karate.
- Đặt `baseUrl: 'http://localhost:3000'`.
- Cấu hình timeouts: `connectTimeout: 5000`, `readTimeout: 5000`.
- Hỗ trợ truyền biến môi trường `-Dkarate.env` nếu cần đổi base URL linh hoạt.

#### [NEW] [EshopTest.java](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/src/test/java/eshop/EshopTest.java)
- JUnit 5 Test Runner sử dụng `@Karate.Test`.
- Quét và thực thi toàn bộ các file `.feature` trong package `eshop` và các thư mục con (kể cả thư mục `generated` do AI của Kiên sinh ra sau này).

#### [NEW] [logback-test.xml](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/src/test/java/logback-test.xml)
- Cấu hình Logback để hiển thị log HTTP Request/Response rõ ràng trong terminal và file log, tránh spam log không cần thiết.

---

### Component 2: Kịch bản Kiểm thử Tính năng (Feature Files)

#### [NEW] [products.feature](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/src/test/java/eshop/products.feature)
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

#### [NEW] [auth-cart-checkout.feature](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/src/test/java/eshop/auth-cart-checkout.feature)
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

#### [NEW] [README.md](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate/README.md)
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
  - Hướng dẫn bàn giao cho Kiên: Quy ước đặt file test do AI Agent sinh ra vào thư mục `artifacts/demo/karate/src/test/java/eshop/generated/` để Maven tự động nhận diện và chạy được ngay.

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
   cd /home/quocky05/academy/software-testing/eshop-sut/backend
   node server.js
   ```
3. **Thực thi bộ test Karate:**
   ```bash
   cd /home/quocky05/academy/software-testing/eshop-sut/artifacts/demo/karate
   mvn clean test
   ```
4. **Kiểm tra kết quả và báo cáo:**
   - Xác nhận log trên terminal hiển thị đầy đủ các Scenario pass/fail theo đúng kịch bản.
   - Kiểm tra file `target/karate-reports/karate-summary.html` được sinh ra đầy đủ.

### Manual Verification
- Xác minh kịch bản lỗi có chủ đích (K2 intentional mismatch): Cố tình đổi assertion `status 201` cho `GET /api/products/1` để quan sát báo cáo lỗi màu đỏ, sau đó đổi lại `200` để báo cáo xanh trở lại.
- Xác minh dữ liệu trong database SQLite: Sau khi chạy K3, kiểm tra bảng `orders` để đảm bảo đơn hàng mới thực sự được tạo với đúng `user_id` và `total_amount`.
