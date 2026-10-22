# Báo Cáo Minh Chứng Kết Quả Thực Hiện — Tuần 05
# Member: Nguyễn Quốc Kỳ (MSSV: 23120138)

- **Họ và tên:** Nguyễn Quốc Kỳ  
- **MSSV:** 23120138  
- **Git Username:** `quocky05`  
- **Vai trò:** Thành viên Nhóm 11 — Phụ trách Karate Framework (K1-K3), Pact C3 breaking change & Biên tập Video Demo  
- **Tuần thực hành:** 05 (Tương ứng Tuần lý thuyết 06)  

---

## 1. Tổng Hợp Đóng Góp Kỹ Thuật

Trong giai đoạn hoàn thiện chuẩn bị cho mốc nộp Seminar W06 ($\ge 90\%$), các kịch bản Karate Framework và Contract Testing đã được hoàn tất:

| Mã hạng mục | Kịch bản / Công việc | Trạng thái | Minh chứng đính kèm |
| :---: | :--- | :---: | :--- |
| **K1** | Smoke Test `GET /api/products` (Karate Fuzzy Matchers `#array`, `#number`) | Hoàn thành | `tests/karate/src/test/java/eshop/products.feature` |
| **K2** | Data-driven Test `GET /api/products/<id>` (Phát hiện lỗi ID âm trả về 500 thay vì 400) | Hoàn thành | `tests/karate/src/test/java/eshop/products.feature` |
| **K3** | Stateful Workflow E2E (Login ➔ Token Chaining ➔ Cart ➔ Checkout) | Hoàn thành | `tests/karate/src/test/java/eshop/auth-cart-checkout.feature` |
| **C3** | Pact Breaking Change (Phối hợp với Tú mô phỏng đổi tên field `price` ➔ `unit_price`) | Hoàn thành | `tests/pact/breaking-change/verify-breaking.js` |
| **DOC** | Hướng dẫn chạy Karate qua Maven Wrapper (`mvn test`) | Hoàn thành | `tests/karate/README.md` |

---

## 2. Hướng Dẫn Thực Thi & Tái Lập (Reproduction)

```bash
# 1. Khởi động Backend SUT EShop
cd backend
npm start

# 2. Chạy toàn bộ Karate Test Suite
cd ../tests/karate
./mvnw test -Dtest=EshopTestRunner

# 3. Xem báo cáo Karate HTML trực quan
# Mở file: tests/karate/target/karate-reports/karate-summary.html
```
