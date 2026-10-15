# Karate Framework API Test Suite — EShop SUT

Thư mục này chứa toàn bộ mã nguồn kiểm thử API tự động sử dụng **Karate Framework 1.4.1** (kết hợp Java 17 và JUnit 5) cho hệ thống backend **EShop SUT** (Node.js/Express + SQLite).

- **Phụ trách chính:** Nguyễn Quốc Kỳ (K1, K2, K3)
- **Reviewer & Tích hợp AI:** Hà Quốc Kiên (AI Agent — AI1)

---

## 1. Yêu Cầu Môi Trường (Prerequisites)

Trước khi thực thi bộ kiểm thử, đảm bảo máy của bạn đã cài đặt các công cụ sau:

1. **Java Development Kit (JDK):** OpenJDK 17 LTS trở lên
   ```bash
   java -version
   ```
2. **Apache Maven:** Phiên bản 3.8 trở lên
   ```bash
   mvn -version
   ```
3. **Node.js & npm:** Để khởi động backend SUT EShop
   ```bash
   node -v
   npm -v
   ```

---

## 2. Khởi Động Backend SUT (EShop)

Backend cần được chạy tại `http://localhost:3000` trước khi thực hiện test:

```bash
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/backend
node server.js
```

Kiểm tra trạng thái server:
```bash
curl http://localhost:3000/api/products
```

---

## 3. Cấu Trúc Dự Án Karate

```text
tests/karate/
├── pom.xml                                  # Cấu hình Maven & dependency Karate JUnit 5 (1.4.1)
├── README.md                                # Tài liệu hướng dẫn thực thi & bàn giao
└── src
    └── test
        └── java
            ├── eshop
            │   ├── EshopTest.java           # JUnit 5 Test Runner chính
            │   ├── products.feature         # Kịch bản K1 (Smoke/Array) & K2 (Data-Driven/Discrepancies)
            │   ├── auth-cart-checkout.feature # Kịch bản K3 (End-to-End Shopping Workflow & Security)
            │   └── generated/               # Thư mục tích hợp nhận feature do AI Agent của Kiên sinh ra
            ├── karate-config.js             # Cấu hình môi trường toàn cục (baseUrl: http://localhost:3000)
            └── logback-test.xml             # Cấu hình log format (DEBUG: hiển thị đầy đủ HTTP Wire Logs)
```

---

## 4. Hướng Dẫn Thực Thi Kiểm Thử (Execution Guide)

Di chuyển vào thư mục kiểm thử Karate:
```bash
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/karate
```

### 4.1. Chạy Toàn Bộ Test Suite (K1, K2, K3 + Generated)
```bash
mvn clean test
```

### 4.2. Chạy Từng Feature Đơn Lẻ
- **Chạy kịch bản Products (K1 & K2):**
  ```bash
  mvn test -Dkarate.options="classpath:eshop/products.feature"
  ```
- **Chạy kịch bản Mua hàng & Authentication (K3):**
  ```bash
  mvn test -Dkarate.options="classpath:eshop/auth-cart-checkout.feature"
  ```

### 4.3. Chạy Theo Tag Lựa Chọn
- Chỉ chạy các test Smoke/K1:
  ```bash
  mvn test -Dkarate.options="--tags @k1"
  ```
- Chỉ chạy các test Data-Driven/K2:
  ```bash
  mvn test -Dkarate.options="--tags @k2"
  ```
- Chỉ chạy kịch bản Workflow/K3:
  ```bash
  mvn test -Dkarate.options="--tags @k3"
  ```

---

## 5. Xem Báo Cáo Kết Quả Kiểm Thử (HTML Reports)

Sau khi hoàn tất lệnh `mvn test`, Karate sẽ tự động tạo báo cáo trực quan dạng HTML tại:

- **Báo cáo tổng quan:**
  `tests/karate/target/karate-reports/karate-summary.html`
- **Báo cáo chi tiết kịch bản:**
  - `target/karate-reports/eshop.products.html`
  - `target/karate-reports/eshop.auth-cart-checkout.html`

Mở báo cáo bằng trình duyệt:
```bash
google-chrome target/karate-reports/karate-summary.html
# hoặc mở bằng bất kỳ trình duyệt web nào
```

Báo cáo hiển thị:
- Thời gian phản hồi (Response Time) từng request.
- Toàn bộ HTTP Wire Logs (Headers, Request Body, Response Body).
- Trạng thái từng bước Gherkin (`Passed` xanh / `Failed` đỏ).

---

## 6. Ghi Nhận Bất Đồng Bộ SUT (Recorded SUT Discrepancies)

Trong quá trình thực thi, các kịch bản kiểm thử ghi nhận chính xác các hành vi lệch đặc tả (discrepancy) của backend EShop mà không cố tình ép xanh:

1. **Bug 1 (`price` dạng String):** `GET /api/products/2` (`Samsung Galaxy S24 Ultra`) trả về `price` dạng String (`"28000000"`) thay vì kiểu Number. Kịch bản K2 kiểm tra chính xác giá trị này và gắn ghi chú discrepancy.
2. **Bug 2 (Mã lỗi 404 bị thiếu):** `GET /api/products/9999` trả về HTTP `200 OK` kèm object rỗng `{}` thay vì trả về HTTP `404 Not Found`. Kịch bản K2 ghi nhận hành vi thực tế.
3. **Cơ chế Khóa Tài khoản (Account Lockout):** Đăng nhập sai 2 lần liên tiếp dẫn đến khóa tài khoản 3 phút (`login_attempts >= 3`). Kịch bản K3 giải quyết vấn đề này bằng cách khởi tạo user ngẫu nhiên theo timestamp (`karate_k3_<timestamp>@eshop.com`) để đảm bảo giỏ hàng sạch và kiểm thử hoàn toàn độc lập.

---

## 7. Quy Ước Bàn Giao & Tích Hợp Cho AI Task (Kiên — AI1)

Bộ khung Karate đã được thiết kế sẵn để tích hợp tự động với AI Agent của Kiên:

1. **Vị trí đặt test sinh tự động:**
   Tất cả các file `.feature` do AI Agent sinh ra phải được lưu vào thư mục:
   `src/test/java/eshop/generated/`
2. **Cơ chế tự động phát hiện (Auto-Discovery):**
   `EshopTest.java` runner quét toàn bộ package `eshop` đệ quy (`relativeTo(getClass())`). Vì vậy, bất kỳ file `.feature` hợp lệ nào được đặt vào `eshop/generated/` sẽ **tự động được Maven biên dịch và thực thi** trong lệnh `mvn test` mà không cần sửa mã nguồn Java runner.
3. **Lệnh chạy riêng cho các test do AI sinh:**
   ```bash
   mvn test -Dkarate.options="classpath:eshop/generated"
   ```
