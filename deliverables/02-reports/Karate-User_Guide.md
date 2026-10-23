# Hướng Dẫn Sử Dụng & Triển Khai Kiểm Thử API Với Karate Framework (User Guide)

> **Môn học:** CS423 / CSC15003 — Kiểm Thử Phần Mềm (Software Testing) · FIT@HCMUS  
> **Chủ đề Seminar:** T06 · API Testing & Contract Testing (Nhóm 11)  
> **Người biên soạn:** **Nguyễn Quốc Kỳ (MSSV: 23120138)**  
> **Hệ thống thử nghiệm (SUT):** EShop (Node.js/Express + SQLite)  
> **Vị trí mã nguồn kiểm thử:** [`tests/karate/`](../../tests/karate)  
> **Phiên bản Framework:** Karate JUnit 5 v1.4.1 (Java 17 LTS + Maven 3.8+)  

---

## Mục Lục 

1. [Phần 1: Giới Thiệu & Triết Lý Cốt Lõi Của Karate Framework](#phần-1-giới-thiệu--triết-lý-cốt-lõi-của-karate-framework)
2. [Phần 2: Yêu Cầu Môi Trường & Các Bước Cài Đặt (Prerequisites & Installation)](#phần-2-yêu-cầu-môi-trường--các-bước-cài-đặt-prerequisites--installation)
3. [Phần 3: Cấu Trúc Dự Án, Cấu Hình Môi Trường & Auto-Discovery Runner](#phần-3-cấu-trúc-dự-án-cấu-hình-môi-trường--auto-discovery-runner)
4. [Phần 4: Kịch Bản K1 — Smoke Test & Native Fuzzy Matchers (`products.feature`)](#phần-4-kịch-bản-k1--smoke-test--native-fuzzy-matchers-productsfeature)
5. [Phần 5: Kịch Bản K2 — Data-Driven Testing & Bắt 2 Lỗi SUT Thực Tế](#phần-5-kịch-bản-k2--data-driven-testing--bắt-2-lỗi-sut-thực-tế)
6. [Phần 6: Kịch Bản K3 — Stateful E2E Shopping Workflow & Bảo Mật (`auth-cart-checkout.feature`)](#phần-6-kịch-bản-k3--stateful-e2e-shopping-workflow--bảo-mật-auth-cart-checkoutfeature)
7. [Phần 7: Hướng Dẫn Thực Thi Dòng Lệnh CLI & Phân Tích Báo Cáo HTML](#phần-7-hướng-dẫn-thực-thi-dòng-lệnh-cli--phân-tích-báo-cáo-html)
8. [Phần 8: Failure Modes — 3 Bẫy Kỹ Thuật Khiến Karate Đánh Lừa Người Dùng](#phần-8-failure-modes--3-bẫy-kỹ-thuật-khiến-karate-đánh-lừa-người-dùng)

---

## Phần 1: Giới Thiệu & Triết Lý Cốt Lõi Của Karate Framework

### 1.1 Karate Framework Là Gì?
Karate là framework kiểm thử tự động mã nguồn mở độc đáo được phát triển bởi Peter Thomas (Intuit), kết hợp giữa cú pháp hành vi **Gherkin BDD** (Given - When - Then) và công cụ thực thi kiểm thử tích hợp trực tiếp trên máy ảo Java (JVM).

### 1.2 Triết lý "No-Code / Low-Code API Testing"
Khác biệt cốt lõi giữa Karate và Cucumber truyền thống:
- **Cucumber:** Chỉ cung cấp bộ phân tích cú pháp Gherkin. Kiểm thử viên bắt buộc phải viết mã Java (Step Definitions) đi kèm thư viện HttpClient hoặc RestAssured để gửi request và xử lý JSON.
- **Karate:** Tích hợp sẵn HTTP Client, JSON Engine, JSONPath, JavaScript Engine và Assertion Matchers ngay trong cú pháp Gherkin. **Kỹ sư QA hoàn toàn không cần viết bất kỳ dòng mã Java Step Definition nào.**


### 1.3 So sánh Karate vs Postman vs RestAssured

| Tiêu chí | Postman & Newman | RestAssured (Java) | Karate Framework |
|---|---|---|---|
| **Mô hình viết test** | JavaScript sandbox + GUI | Code-first (Java/Groovy DSL) | **Gherkin DSL (Low-code BDD)** |
| **Xác thực Schema** | Cần thư viện `tv4` / `ajv` dài dòng | Hamcrest Matchers + JsonSchemaValidator | **Native Fuzzy Matchers (`#number`, `#string`)** |
| **Hỗ trợ chuỗi Workflow** | Set biến môi trường thủ công qua script | Lưu biến trong TestContext / Java variable | **Gán biến tự nhiên qua `* def token = response.token`** |
| **Tích hợp CI/CD** | Cần cài Node.js + Newman | Maven / Gradle runner | **Maven Surefire / JUnit 5 chuẩn hóa** |
| **Đường cong học tập** | Rất thấp (GUI trực quan) | Trung bình (cần biết OOP Java) | **Rất thấp (đọc hiểu như văn bản nghiệp vụ)** |

---

## Phần 2: Yêu Cầu Môi Trường & Các Bước Cài Đặt (Prerequisites & Installation)

### 2.1 Yêu cầu hệ thống
Trước khi thực thi, máy trạm cần cài đặt:
1. **Java Development Kit (JDK):** OpenJDK 17 LTS trở lên.
   ```bash
   java -version
   # Kỳ vọng: openjdk version "17.0.x"
   ```
   *Lệnh cài đặt trên Ubuntu/Debian:*
   ```bash
   sudo apt update && sudo apt install -y openjdk-17-jdk
   ```
2. **Apache Maven:** Phiên bản 3.8+
   ```bash
   mvn -version
   # Kỳ vọng: Apache Maven 3.8.x hoặc cao hơn
   ```
   *Lệnh cài đặt trên Ubuntu/Debian:*
   ```bash
   sudo apt install -y maven
   ```
3. **Node.js & npm:** Để khởi động Backend SUT EShop.
   ```bash
   node -v   # v18+ hoặc v20+
   npm -v
   ```

### 2.2 Cấu hình Maven (`pom.xml`)
Khung dự án Karate 1.4.1 chuẩn JUnit 5 được cấu hình tại [`tests/karate/pom.xml`](../../tests/karate/pom.xml):

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.eshop</groupId>
    <artifactId>karate-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>17</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <karate.version>1.4.1</karate.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.intuit.karate</groupId>
            <artifactId>karate-junit5</artifactId>
            <version>${karate.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <testResources>
            <testResource>
                <directory>src/test/java</directory>
                <excludes>
                    <exclude>**/*.java</exclude>
                </excludes>
            </testResource>
        </testResources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.1.2</version>
            </plugin>
        </plugins>
    </build>
</project>
```

> [!NOTE]
> Cấu hình `<testResources>` là yếu tố sống còn: nó chỉ dẫn cho Maven đóng gói toàn bộ các tệp `.feature` nằm trong thư mục `src/test/java` vào classpath khi build, cho phép JUnit Runner tìm thấy kịch bản kiểm thử.

---

## Phần 3: Cấu Trúc Dự Án, Cấu Hình Môi Trường & Auto-Discovery Runner

### 3.1 Cấu trúc thư mục chuẩn
```text
tests/karate/
├── pom.xml                                  # Cấu hình dependencies & build Maven
├── README.md                                # Hướng dẫn tóm tắt
├── Karate-User_Guide.md                     # Sổ tay hướng dẫn sử dụng chuyên sâu
└── src
    └── test
        └── java
            ├── eshop
            │   ├── EshopTest.java           # JUnit 5 Test Runner chính
            │   ├── products.feature         # Kịch bản K1 (Smoke) & K2 (Data-Driven)
            │   ├── auth-cart-checkout.feature # Kịch bản K3 (Stateful E2E Workflow)
            │   └── generated/               # Nơi nhận kịch bản do AI Agent sinh ra
            ├── karate-config.js             # Cấu hình môi trường toàn cục
            └── logback-test.xml             # Cấu hình hiển thị HTTP Wire Logs
```

### 3.2 Cấu hình môi trường toàn cục (`karate-config.js`)
Karate tự động thực thi tệp JavaScript này trước mỗi kịch bản để thiết lập cấu hình:

```javascript
function fn() {
  var env = karate.env || 'dev';
  karate.log('karate.env active:', env);

  var config = {
    baseUrl: 'http://localhost:3000'
  };

  // Cấu hình thời gian chờ mạng (Network Timeouts)
  karate.configure('connectTimeout', 5000);
  karate.configure('readTimeout', 5000);

  return config;
}
```

### 3.3 Cơ chế Auto-Discovery Runner (`EshopTest.java`)
Điểm sáng tạo trong thiết kế của nhóm là cấu hình runner JUnit 5 có khả năng tự động khám phá:

```java
package eshop;

import com.intuit.karate.junit5.Karate;

class EshopTest {
    @Karate.Test
    Karate testAll() {
        return Karate.run().relativeTo(getClass());
    }
}
```

- Lệnh `Karate.run().relativeTo(getClass())` quét đệ quy toàn bộ thư mục `eshop/` và các thư mục con.
- **Ý nghĩa:** Khi thành viên Hà Quốc Kiên sử dụng AI Agent để sinh ra các file `.feature` mới tại `src/test/java/eshop/generated/`, Maven sẽ tự động nhận diện và chạy ngay trong lệnh `mvn test` mà không cần sửa bất kỳ dòng mã Java nào!

---

## Phần 4: Kịch Bản K1 — Smoke Test & Native Fuzzy Matchers (`products.feature`)

### 4.1 Mục tiêu
Xác thực tính sẵn sàng của endpoint danh mục sản phẩm `GET /api/products`, đảm bảo phản hồi trả về là một mảng JSON và mỗi phần tử đều tuân thủ cấu trúc dữ liệu quy chuẩn.

### 4.2 Mã kịch bản Gherkin
```cucumber
@products
Feature: EShop Product Catalog API

  Background:
    * url baseUrl

  @k1 @smoke
  Scenario: K1 - Get all products returns a valid array and schema
    # Bước 1: Gửi yêu cầu HTTP GET
    Given path 'api', 'products'
    When method get

    # Bước 2: Kiểm tra HTTP Status
    Then status 200

    # Bước 3: Xác thực cấu trúc mảng và mảng không rỗng
    And match response == '#[]'
    And assert response.length > 0

    # Bước 4: Kiểm tra Schema phần tử đầu tiên bằng Fuzzy Matchers
    And match response[0] contains
      """
      {
        "id": '#number',
        "name": '#string',
        "price": '#number',
        "description": '#string',
        "imageUrl": '#string',
        "category_id": '#number'
      }
      """
```

### 4.3 Cẩm nang cú pháp Fuzzy Matchers của Karate
Karate cung cấp hệ thống tiền tố kiểm tra kiểu dữ liệu cực mạnh:
- `'#[]'`: Khẳng định dữ liệu là một mảng (Array).
- `'#[10]'`: Khẳng định mảng có đúng 10 phần tử.
- `'#number'`: Khẳng định trường bắt buộc phải là số (Integer hoặc Float).
- `'#string'`: Khẳng định trường bắt buộc phải là chuỗi ký tự.
- `'#boolean'`: Khẳng định kiểu boolean (`true`/`false`).
- `'#array'`: Khẳng định mảng con.
- `'#object'`: Khẳng định đối tượng JSON.
- `'##number'`: Dạng tùy chọn (Optional) — chấp nhận kiểu số HOẶC giá trị `null` / không tồn tại.

---

## Phần 5: Kịch Bản K2 — Data-Driven Testing & Bắt 2 Lỗi SUT Thực Tế

### 5.1 Mục tiêu
Sử dụng kỹ thuật kiểm thử hướng dữ liệu (Data-Driven Testing) với bảng ma trận `Scenario Outline` và `Examples` để quét kiểm thử biên (Boundary Values) trên các ID sản phẩm khác nhau.

### 5.2 Mã kịch bản Gherkin
```cucumber
@k2 @data-driven
Scenario Outline: K2 - Query product by ID with boundary & discrepancy assertions: <testCase>
  Given path 'api', 'products', <productId>
  When method get
  Then status <expectedStatus>
  And match response contains <expectedMatch>

  Examples:
    | productId | expectedStatus | expectedMatch        | testCase                                                                        |
    | 1         | 200            | { price: '#number' } | Valid Odd ID - iPhone 15 Pro Max (Price is Number)                              |
    | 2         | 200            | { price: '#string' } | Valid Even ID - Samsung S24 Ultra (@discrepancy: Price converted to String)     |
    | 9999      | 200            | {}                   | Non-existent ID (@discrepancy: Returns 200 OK with empty object instead of 404) |
```

### 5.3 Giải phẫu mã nguồn SUT EShop & 2 Bug Bị Karate Bắt Trọn

Tại tệp [`backend/server.js`](../../backend/server.js) (dòng 165–170):
```javascript
app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});                     // <-- BUG 2: 200 OK thay vì 404
    if (row.id % 2 === 0) row.price = row.price.toString();         // <-- BUG 1: Ép kiểu string nếu ID chẵn
    res.json(row);
  });
});
```

1. **Bug 1: Lỗi Bất Đồng Bộ Kiểu Dữ Liệu (Schema Type Inconsistency):**
   - **Thực tế:** Sản phẩm ID chẵn (`id = 2`) bị backend ép kiểu thành String (`"28000000"`), trong khi ID lẻ (`id = 1`) trả về kiểu Number (`30000000`).
   - **Hậu quả:** Gây lỗi tính toán số học trên ứng dụng di động (ví dụ phép cộng chuỗi `'28000000' + 50000 = '2800000050000'`).
   - **Bắt lỗi với Karate:** Nếu viết assertion `match response.price == '#number'`, Karate sẽ đánh FAIL kịch bản tại dòng 2 với thông báo lỗi đỏ rực:  
     `actual: "28000000", expected: '#number', reason: not a number`.

2. **Bug 2: Vi phạm chuẩn RESTful HTTP Status (Missing 404 Not Found):**
   - **Thực tế:** Khi truy vấn ID không tồn tại (`id = 9999`), server trả về **HTTP 200 OK kèm body rỗng `{}`** thay vì **HTTP 404 Not Found**.
   - **Hậu quả:** Ứng dụng client tưởng truy vấn thành công, cố gắng đọc `product.name` dẫn đến lỗi Runtime `Cannot read properties of undefined` làm crash giao diện.

---

## Phần 6: Kịch Bản K3 — Stateful E2E Shopping Workflow & Bảo Mật (`auth-cart-checkout.feature`)

### 6.1 Giải pháp vượt rào cản SUT (Account Lockout Bypass)
Trong `backend/server.js` (dòng 60–65), SUT có cơ chế bảo mật: **đăng nhập sai quá 2 lần sẽ khóa tài khoản trong 3 phút**. Để kịch bản test có thể chạy lặp lại liên tục trong CI/CD mà không bị lỗi 403 `Tài khoản đã bị khóa`, kịch bản K3 áp dụng kỹ thuật **khởi tạo tài khoản động theo Timestamp**:
```cucumber
* def timestamp = java.lang.System.currentTimeMillis()
* def testEmail = 'karate_k3_' + timestamp + '@eshop.com'
```

### 6.2 Chuỗi 7 bước Happy Path nghiệp vụ hoàn chỉnh
```cucumber
@workflow
Feature: EShop Authenticated Shopping & Checkout Workflow (K3)

  Background:
    * url baseUrl

  @k3 @e2e @smoke
  Scenario: K3 - Complete End-to-End Shopping Workflow
    # Bước 1: Khởi tạo tài khoản động
    * def timestamp = java.lang.System.currentTimeMillis()
    * def testEmail = 'karate_k3_' + timestamp + '@eshop.com'
    * def testPassword = 'Password123!'
    * def registerPayload = { name: '#("Karate User " + timestamp)', email: '#(testEmail)', password: '#(testPassword)' }
    Given path 'api', 'register'
    And request registerPayload
    When method post
    Then status 200
    And match response.message == 'User registered successfully'

    # Bước 2: Đăng nhập lấy JWT Auth Token (Token Chaining)
    Given path 'api', 'login'
    And request { email: '#(testEmail)', password: '#(testPassword)' }
    When method post
    Then status 200
    And match response.token == '#string'
    * def authToken = response.token

    # Bước 3: Lấy danh mục và chọn sản phẩm đầu tiên
    Given path 'api', 'products'
    When method get
    Then status 200
    * def selectedProduct = response[0]
    * def selectedProductId = selectedProduct.id
    * def selectedProductPrice = selectedProduct.price

    # Bước 4: Thêm sản phẩm vào giỏ hàng với Bearer Token
    Given path 'api', 'cart'
    And header Authorization = 'Bearer ' + authToken
    And request { productId: '#(selectedProductId)', name: '#(selectedProduct.name)', price: '#(selectedProductPrice)', quantity: 1 }
    When method post
    Then status 200
    And match response.message == 'Added to cart'

    # Bước 5: Xác minh sản phẩm tồn tại trong giỏ hàng (Deep Assertion)
    Given path 'api', 'cart'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    And match response contains deep { productId: '#(selectedProductId)' }

    # Bước 6: Thanh toán đơn hàng (Checkout)
    * def shippingAddr = '227 Nguyen Van Cu, Ward 4, District 5, HCMC'
    Given path 'api', 'checkout'
    And header Authorization = 'Bearer ' + authToken
    And request { total_amount: '#(selectedProductPrice)', shipping_address: '#(shippingAddr)' }
    When method post
    Then status 200
    And match response.message == 'Checkout successful'
    And match response.orderId == '#number'
    * def generatedOrderId = response.orderId

    # Bước 7: Xác nhận đơn hàng trong lịch sử My Orders
    Given path 'api', 'orders', 'my-orders'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    And match response[0].id == generatedOrderId
    And match response[0].status == 'pending'
    And match response[0].shipping_address == shippingAddr
```

### 6.3 Kịch bản kiểm thử bảo mật tiêu cực (Security Negative Test)
```cucumber
  @k3 @security @negative
  Scenario: K3 - Security Negative Test: Accessing protected cart without token must return 401 Unauthorized
    Given path 'api', 'cart'
    When method get
    Then status 401
    And match response.error == 'Unauthorized'
```

---

## Phần 7: Hướng Dẫn Thực Thi Dòng Lệnh CLI & Phân Tích Báo Cáo HTML

### 7.1 Khởi động SUT Backend
Trước khi chạy test, đảm bảo Backend EShop đang lắng nghe tại cổng 3000:
```bash
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/backend
node server.js
```

### 7.2 Lệnh thực thi Karate Test Suite
Mở terminal tại thư mục `tests/karate`:
```bash
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate

# 1. Chạy toàn bộ test suite (K1, K2, K3 + Generated)
mvn clean test

# 2. Chạy riêng kịch bản Products (K1 & K2)
mvn test -Dkarate.options="classpath:eshop/products.feature"

# 3. Chạy riêng kịch bản Shopping Workflow (K3)
mvn test -Dkarate.options="classpath:eshop/auth-cart-checkout.feature"

# 4. Lọc theo Tag
mvn test -Dkarate.options="--tags @smoke"
mvn test -Dkarate.options="--tags @data-driven"
mvn test -Dkarate.options="--tags @security"
```

### 7.3 Báo cáo HTML trực quan (Karate Reports Dashboard)
Sau khi chạy xong, Karate tự động xuất báo cáo tại:
`tests/karate/target/karate-reports/karate-summary.html`

Mở xem báo cáo bằng trình duyệt:
```bash
google-chrome target/karate-reports/karate-summary.html
```

**Các thông tin quan trọng hiển thị trên Dashboard:**
1. **Summary Overview:** Tổng số Scenarios passed/failed, tỷ lệ phần trăm thành công, tổng thời gian thực thi (ms).
2. **HTTP Wire Logs:** Khi nhấp vào từng bước `When method ...`, báo cáo hiển thị trọn vẹn toàn bộ:
   - Request URL, HTTP Method.
   - Request Headers (chứa Bearer Token xác thực).
   - Request Body gửi đi.
   - Response Status Code, Response Time.
   - Toàn bộ Response Body JSON trả về.
3. **Failure Highlighting:** Bước nào bị lỗi assertion sẽ được viền đỏ nổi bật kèm so sánh chính xác giữa `expected` và `actual`.

---

## Phần 8: Failure Modes — 3 Bẫy Kỹ Thuật Khiến Karate Đánh Lừa Người Dùng

> **Yêu cầu bắt buộc theo Rubric T06:** Phần này chỉ rõ 3 trường hợp thực tế công cụ kiểm thử có thể đánh lừa kỹ sư QA (False Positives hoặc False Negatives).

### Bẫy 1: Nguy cơ bỏ sót lỗi do lạm dụng Matcher tùy chọn `##` (Optional Matcher False Positive)
- **Hành vi của Karate:** Khi sử dụng ký hiệu hai dấu thăng (`##`), Karate diễn giải trường đó là *Optional* (chấp nhận đúng kiểu dữ liệu, HOẶC giá trị `null`, HOẶC trường đó hoàn toàn không tồn tại trong JSON).
  ```cucumber
  # Kỳ vọng trường stock có thể có hoặc không
  And match response[0] contains { stock: '##number' }
  ```
- **Hậu quả đánh lừa:** Nếu lập trình viên Backend vô tình xóa mất trường `stock` khỏi cơ sở dữ liệu hoặc đổi tên thành `inventory_qty`, bài test của Karate **vẫn báo XANH (PASS 100%)**! Kiểm thử viên lầm tưởng API hoàn toàn ổn định nhưng thực chất người dùng không thể thấy số lượng hàng tồn kho.
- **Biện pháp phòng ngừa:** Đối với các trường bắt buộc theo đặc tả nghiệp vụ, bắt buộc phải dùng `#` đơn (ví dụ `stock: '#number'`). Chỉ dùng `##` cho các trường dữ liệu tùy chọn theo thiết kế (như `middle_name`, `discount_code`).

---

### Bẫy 2: So khớp mảng tuyệt đối gây lỗi giả khi cơ sở dữ liệu biến động (`match ==` Flaky Test)
- **Hành vi của Karate:** Cú pháp so khớp chính xác mảng `match response == [...]` hoặc so sánh trực tiếp mảng kỳ vọng Karate đòi hỏi **cả số lượng phần tử lẫn thứ tự các phần tử** phải khớp hoàn toàn 100%.
- **Hậu quả đánh lừa:** Trong môi trường thử nghiệm thực tế hoặc khi chạy song song nhiều suite test, nếu một test case trước đó tạo thêm sản phẩm mới vào database SQLite, lệnh kiểm tra mảng của kịch bản sau sẽ bị **FAIL oan uổng (False Negative / Flaky Test)**, dù logic API danh mục sản phẩm không hề bị lỗi.
- **Biện pháp phòng ngừa:** 
  - Sử dụng toán tử `contains` thay vì `==`: `match response contains deep { id: 1 }`.
  - Hoặc xác thực độ dài linh hoạt: `assert response.length > 0`.

---

### Bẫy 3: Bẫy ép kiểu ngầm (Type Coercion) trong biểu thức JavaScript `assert`
- **Hành vi của Karate:** Karate cho phép nhúng trực tiếp biểu thức JavaScript thông qua từ khóa `assert`. Trong JavaScript, toán tử so sánh bằng lỏng (`==`) tự động thực hiện ép kiểu (type coercion).
  ```cucumber
  # Giả sử response.price trả về String "28000000" (Bug SUT #1)
  * def price = response.price
  And assert price == 28000000   # JS tự động coerce "28000000" == 28000000 -> TRUE!
  ```
- **Hậu quả đánh lừa:** Đoạn assert trên sẽ **PASS**, khiến kỹ sư QA hoàn toàn bỏ sót khiếm khuyết kiểu dữ liệu nghiêm trọng của SUT (Bug 1)!
- **Biện pháp phòng ngừa:** Không dùng `assert` với toán tử so sánh giá trị cho việc xác thực schema. Luôn sử dụng từ khóa `match` bản địa của Karate:
  ```cucumber
  And match response.price == '#number'  # Karate Schema Engine bắt lỗi NGAY LẬP TỨC!
  ```

---
*Tài liệu kỹ thuật được hoàn thiện và kiểm chứng trực tiếp trên hệ thống SUT EShop bởi Nguyễn Quốc Kỳ (MSSV: 23120138) — FIT@HCMUS.*
