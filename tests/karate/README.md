# Karate Framework API Test Suite
- **Phụ trách chính:** Kỳ (K1, K2, K3), Kiên (hỗ trợ/review).
- **Yêu cầu môi trường:** OpenJDK 17+, Apache Maven 3.8+.
- **Lệnh thực thi:**
  - Chạy toàn bộ test suite: `mvn clean test`
  - Chạy feature đơn lẻ: `mvn test -Dkarate.options="classpath:eshop/products.feature"`
- **Báo cáo HTML:** `target/karate-reports/karate-summary.html`
- **Tích hợp AI Agent:** Các feature do AI Agent của Kiên sinh ra sẽ đặt tại `src/test/java/eshop/generated/`.
