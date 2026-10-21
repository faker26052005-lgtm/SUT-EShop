# Báo Cáo Kỹ Thuật & Minh Chứng Hoàn Thiện Kịch Bản Pact C3 — Tuần 05

- **Họ và tên:** Nguyễn Quốc Kỳ  
- **MSSV:** 23120138  
- **Vai trò:** Thành viên Nhóm 11 (FIT@HCMUS) — Phụ trách chính Kịch bản Pact C3 (Breaking Change Verification) & Karate Suite  
- **Tác giả Git:** `Nguyen Quoc Ky <nqky2407@gmail.com>`  
- **Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
- **Chủ đề Seminar:** T06 · API Testing & Contract Testing  
- **Hệ thống SUT:** EShop (Consumer: `EShopMobile` — Provider: `EShopBackend`)  
- **Tuần thực hành:** 05 (Giai đoạn hoàn thiện và bổ sung toàn diện kịch bản C3 theo phân công Phase 2)  
- **Đường dẫn thư mục nộp:** `deliverables/05-management/weekly-reports/week-05/quoc-ky/`  

---

## 1. Bối Cảnh & Mục Tiêu Nộp Báo Cáo Tuần 05

### 1.1 Bối cảnh phân công công việc
Theo Bảng phân công công việc Giai đoạn 2 (`deliverables/05-management/task-assignment.md`):
- Anh Tú phụ trách chính **C1** (Consumer Test) và **C2** (Provider Verification).
- Bạn **Nguyễn Quốc Kỳ** phụ trách chính **C3** (*"Tạo Breaking Change, verify & Viết hướng dẫn (C3)"*).

Trong giai đoạn tuần 02–04, Nguyễn Quốc Kỳ đã tập trung xây dựng toàn bộ bộ kiểm thử tự động **Karate Framework** (K1, K2, K3) với workflow E2E phức tạp. Do đó, kịch bản C3 trước đây chỉ mới có một script thử nghiệm sơ bộ do anh Tú viết tạm (`verify-breaking.js` chạy server mockup riêng cổng 3001) và chưa có:
1. Đóng góp mã nguồn và commit chính thức mang tên tác giả **Nguyễn Quốc Kỳ**.
2. Kịch bản kiểm thử khép kín 3 pha chuẩn mực (*Baseline* $\to$ *Mutation* $\to$ *Rollback*).
3. Tài liệu hướng dẫn kỹ thuật chuyên sâu (`Pact_C3_Execution_Guide.md`).
4. Báo cáo minh chứng thực thi và nhật ký terminal đối soát chi tiết.

### 1.2 Mục tiêu đạt được trong Tuần 05
Trong Tuần 05, Nguyễn Quốc Kỳ đã triển khai trọn vẹn và hoàn thiện dứt điểm toàn bộ kịch bản **Pact C3**, đáp ứng 100% các tiêu chí chất lượng khắt khe của Seminar và Trụ cột 3 (Pillar 3) của môn học:
- [x] Thiết kế và lập trình trình điều phối kiểm thử 3 pha: `tests/pact/breaking-change/pact-c3-runner.js`.
- [x] Hiện thực 2 dạng Breaking Change kinh điển:
  - **Dạng 1:** Đổi tên trường dữ liệu bắt buộc (`price` $\to$ `unit_price`).
  - **Dạng 2:** Sai lệch kiểu dữ liệu (Data Type Mismatch: `price` từ Integer $\to$ String formatted currency `'30.000.000 ₫'`).
- [x] Cơ chế tự động hoàn nguyên (Auto-Rollback) đưa hệ thống trở lại trạng thái xanh.
- [x] Soạn thảo tài liệu hướng dẫn kỹ thuật chi tiết: `tests/pact/breaking-change/Pact_C3_Execution_Guide.md`.
- [x] Cập nhật tài liệu cấu hình `package.json`, `README.md` của bộ kiểm thử Pact.
- [x] Thu thập đầy đủ nhật ký thực thi (Terminal raw logs) làm minh chứng đối soát.

---

## 2. Bảng Tổng Hợp Công Việc & Đóng Góp Kỹ Thuật

| Mã hạng mục | Thành phần / Tập tin thực hiện | Người thực hiện | Trạng thái | Ý nghĩa kỹ thuật |
| :---: | :--- | :---: | :---: | :--- |
| **C3-RUNNER** | `tests/pact/breaking-change/pact-c3-runner.js` | **Nguyễn Quốc Kỳ** | Hoàn thành | Điều phối tự động quy trình 3 pha: Baseline PASS, Tiêm 2 dạng lỗi để Pact Verifier chặn đứng, và Tự động Rollback phục hồi xanh 100%. |
| **C3-GUIDE** | `tests/pact/breaking-change/Pact_C3_Execution_Guide.md` | **Nguyễn Quốc Kỳ** | Hoàn thành | Cung cấp tài liệu học thuật & thực hành chuyên sâu về Breaking Change, phân tích thông điệp lỗi của Pact FFI Rust Verifier, hướng dẫn sinh viên tái lập kết quả. |
| **C3-PKG** | `tests/pact/package.json` | **Nguyễn Quốc Kỳ** | Hoàn thành | Bổ sung lệnh chạy trực quan `npm run test:c3` bên cạnh `npm run test:breaking`. |
| **C3-DOC** | `tests/pact/README.md` | **Nguyễn Quốc Kỳ** | Hoàn thành | Cập nhật tài liệu tổng thể của test suite Pact, bổ sung cây thư mục và hướng dẫn kịch bản C3. |
| **MGMT** | `deliverables/05-management/task-assignment.md` | **Nguyễn Quốc Kỳ** | Hoàn thành | Cập nhật tiến độ task C3 từ "Dự kiến" sang "Hoàn thành" cho Nguyễn Quốc Kỳ. |
| **REPORT** | `deliverables/05-management/weekly-reports/week-05/quoc-ky/` | **Nguyễn Quốc Kỳ** | Hoàn thành | Đóng gói báo cáo tuần 05, nhật ký terminal, giải thích chuyên môn và minh chứng nộp bài. |

---

## 3. Kiến Trúc Kỹ Thuật & Nguyên Lý Kịch Bản Pact C3

### 3.1 Mô hình vận hành của Pact V3 Specification
Tệp hợp đồng chuẩn do Consumer `EShopMobile` sinh ra tại kịch bản C1:
```json
{
  "consumer": { "name": "EShopMobile" },
  "provider": { "name": "EShopBackend" },
  "interactions": [
    {
      "description": "a request for product with ID 1",
      "providerStates": [{ "name": "product with ID 1 exists" }],
      "request": {
        "method": "GET",
        "path": "/api/products/1",
        "headers": { "Accept": "application/json" }
      },
      "response": {
        "status": 200,
        "headers": { "Content-Type": "application/json; charset=utf-8" },
        "body": {
          "id": 1,
          "name": "iPhone 15 Pro Max",
          "price": 30000000,
          "description": "Điện thoại cao cấp của Apple",
          "imageUrl": "https://placehold.co/300x300/png?text=iPhone+15",
          "category_id": 1
        },
        "matchingRules": {
          "body": {
            "$.price": {
              "combine": "AND",
              "matchers": [{ "match": "integer" }]
            }
          }
        }
      }
    }
  ]
}
```

### 3.2 Quy trình 3 Pha Khép Kín trong `pact-c3-runner.js`
1. **Pha 1 — Baseline Verification:**
   - Provider trả về payload chuẩn (`price: 30000000 [Integer]`).
   - Pact Verifier thực thi request đối soát $\implies$ **Kết quả: PASS 100%**.
2. **Pha 2A — Tiêm Breaking Change #1 (Missing / Renamed Property):**
   - Lập trình viên Backend đổi tên trường `price` $\to$ `unit_price`.
   - HTTP Status vẫn trả về `200 OK`.
   - Pact Verifier phát hiện thiếu trường bắt buộc $\implies$ **Kết quả: FAILED & BLOCKED**.
   - Thông báo lỗi: `Actual map is missing the following keys: price`.
3. **Pha 2B — Tiêm Breaking Change #2 (Data Type Mismatch):**
   - Lập trình viên Backend tự ý format giá tiền thành chuỗi `'30.000.000 ₫'` thay vì số nguyên thô.
   - HTTP Status vẫn trả về `200 OK`.
   - Pact Verifier phát hiện sai lệch kiểu dữ liệu $\implies$ **Kết quả: FAILED & BLOCKED**.
   - Thông báo lỗi: `$.price -> Expected '30.000.000 ₫' (String) to be an integer number`.
4. **Pha 3 — Rollback & Re-verification:**
   - Hệ thống tự động hoàn nguyên về trạng thái chuẩn mực ban đầu.
   - Pact Verifier kiểm tra lại $\implies$ **Kết quả: PASS 100% (Phục hồi an toàn)**.

---

## 4. Nhật Ký Thực Thi Thực Tế (Raw Execution Logs & Terminal Output)

Toàn bộ quá trình chạy kiểm chứng bằng lệnh `npm run test:c3` được trích xuất trực tiếp từ terminal:

```text
==============================================================================
🚀 PACT CONTRACT TESTING - KỊCH BẢN C3: BREAKING CHANGE VERIFICATION
   Tác giả: Nguyễn Quốc Kỳ (MSSV: 23120138) | Nhóm 11 - Seminar T06
   Hệ thống: Consumer (EShopMobile) <---> Provider (EShopBackend)
==============================================================================

[Pact C3] Server Provider đối soát đang chạy trên cổng 3005...

------------------------------------------------------------------------------
📌 PHA 1: KIỂM CHỨNG BASELINE (BASELINE VERIFICATION)
   Điều kiện: Provider trả về dữ liệu chuẩn mực (price: 30000000 [Integer]).
------------------------------------------------------------------------------

Verifying a pact between EShopMobile and EShopBackend

  a request for product with ID 1 (0s loading, 33ms verification)
     Given product with ID 1 exists
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

✅ PHA 1 THÀNH CÔNG: Provider đáp ứng chính xác 100% hợp đồng của Consumer!

------------------------------------------------------------------------------
📌 PHA 2A: TIÊM BREAKING CHANGE #1 (FIELD RENAMED / MISSING PROPERTY)
   Hành vi: Developer Backend đổi tên trường "price" -> "unit_price".
   Quan sát: HTTP Status Code vẫn là 200 OK (Postman thông thường sẽ PASS).
------------------------------------------------------------------------------

Verifying a pact between EShopMobile and EShopBackend

  a request for product with ID 1 (0s loading, 23ms verification)
     Given product with ID 1 exists
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (FAILED)

Failures:

1) Verifying a pact between EShopMobile and EShopBackend Given product with ID 1 exists - a request for product with ID 1
    1.1) has a matching body
           $ -> Actual map is missing the following keys: price

There were 1 pact failures
[ERROR] pact-core: Verification unsuccessful

🎯 PHA 2A THÀNH CÔNG (CHẶN LỖI): Pact Verifier phát hiện vi phạm hợp đồng!
   Chi tiết lỗi bắt được: Actual map is missing required key "price"
   Tác động ứng dụng: Tránh được sự cố Mobile crash do product.price === undefined.

------------------------------------------------------------------------------
📌 PHA 2B: TIÊM BREAKING CHANGE #2 (DATA TYPE MISMATCH)
   Hành vi: Provider trả về trường "price" dưới dạng String "30.000.000 ₫".
   Quan sát: Tái hiện khiếm khuyết của SUT EShop Backend phát hiện ở Karate K2.
------------------------------------------------------------------------------

Verifying a pact between EShopMobile and EShopBackend

  a request for product with ID 1 (0s loading, 23ms verification)
     Given product with ID 1 exists
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (FAILED)

Failures:

1) Verifying a pact between EShopMobile and EShopBackend Given product with ID 1 exists - a request for product with ID 1
    1.1) has a matching body
           $.price -> Expected '30.000.000 ₫' (String) to be an integer number

There were 1 pact failures
[ERROR] pact-core: Verification unsuccessful

🎯 PHA 2B THÀNH CÔNG (CHẶN LỖI): Pact Verifier phát hiện vi phạm kiểu dữ liệu!
   Chi tiết lỗi bắt được: Expected integer but received string
   Tác động ứng dụng: Ngăn chặn lỗi tính toán sai lệch tổng tiền ở giỏ hàng Mobile.

------------------------------------------------------------------------------
📌 PHA 3: HOÀN NGUYÊN MÃ NGUỒN VÀ KIỂM CHỨNG LẠI (ROLLBACK & RE-VERIFICATION)
   Hành vi: Revert các commit lỗi, khôi phục lại trường "price" kiểu Integer.
------------------------------------------------------------------------------

Verifying a pact between EShopMobile and EShopBackend

  a request for product with ID 1 (0s loading, 22ms verification)
     Given product with ID 1 exists
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

✅ PHA 3 THÀNH CÔNG: Trạng thái hệ thống đã phục hồi hoàn toàn xanh!

==============================================================================
📊 BẢNG TỔNG HỢP KẾT QUẢ THỰC THI KỊCH BẢN PACT C3 (NHÓM 11 - NGUYỄN QUỐC KỲ)
==============================================================================
┌─────────┬────────────────────────────────────┬────────────────┬───────────┬──────────────────────────────────┐
│ (index) │ phase                              │ expected       │ actual    │ verdict                          │
├─────────┼────────────────────────────────────┼────────────────┼───────────┼──────────────────────────────────┤
│ 0       │ 'Pha 1: Baseline'                  │ 'PASS'         │ 'PASS'    │ 'ĐẠT (Hợp đồng toàn vẹn)'        │
│ 1       │ 'Pha 2A: Rename price->unit_price' │ 'BLOCK (FAIL)' │ 'BLOCKED' │ 'ĐẠT (Bắt đúng breaking change)' │
│ 2       │ 'Pha 2B: Type Integer->String'     │ 'BLOCK (FAIL)' │ 'BLOCKED' │ 'ĐẠT (Bắt đúng type mismatch)'   │
│ 3       │ 'Pha 3: Rollback & Re-verify'      │ 'PASS'         │ 'PASS'    │ 'ĐẠT (Hệ thống an toàn)'         │
└─────────┴────────────────────────────────────┴────────────────┴───────────┴──────────────────────────────────┘

💡 KẾT LUẬN CHUYÊN MÔN:
1. Functional API Testing (Postman/Newman thông thường) chỉ kiểm tra HTTP Status Code 200,
   dễ bỏ sót các thay đổi phá vỡ hợp đồng ngầm (False Positive).
2. Consumer-Driven Contract Testing (Pact JS) hoạt động như một "Deployment Gate",
   chặn đứng mọi bản build Provider vi phạm kỳ vọng Consumer trước khi ra Production!
==============================================================================

[Pact C3] Đã dọn dẹp và đóng server kiểm thử.
```

---

## 5. Phân Tích Chuyên Môn & Đối Sánh Phương Pháp Luận

### 5.1 False Positive trong Functional Testing vs Khả năng bảo vệ của Contract Testing
- **Kịch bản sự cố:** Một lập trình viên Backend quyết định tái cấu trúc cơ sở dữ liệu và đổi tên cột `price` thành `unit_price` trong bảng sản phẩm.
- **Phản ứng của Postman / Newman:** Kiểm thử viên chạy collection Newman trong CI/CD. Vì endpoint vẫn phản hồi mã `200 OK`, test script thông thường (`pm.response.to.have.status(200)`) sẽ báo **PASS**. Pipeline CI/CD cho phép deploy lên Production.
- **Thảm họa trên thiết bị người dùng:** Ứng dụng `EShopMobile` của hàng triệu người dùng khi mở màn hình chi tiết sản phẩm sẽ gọi `product.price`. Kết quả nhận về là `undefined`. Khi thêm vào giỏ hàng, tổng tiền tính ra `NaN`, nút Checkout bị vô hiệu hóa hoặc ứng dụng văng đột ngột (Crash).
- **Cách Pact ngăn chặn:** Ngay trong khâu kiểm thử Provider tại CI/CD của Backend, Pact Verifier đã chặn đứng bản build với thông báo:
  `Actual map is missing the following keys: price`.
  Nhờ đó, lập trình viên Backend buộc phải hoàn nguyên hoặc tạo phiên bản API mới (`/api/v2/products`) trước khi code được merge vào nhánh chính!

### 5.2 Mối liên hệ mật thiết giữa Kịch bản Pact C3 và Kịch bản Karate K2
Trong báo cáo Tuần 02 của Nguyễn Quốc Kỳ, ở kịch bản **Karate K2** (`tests/karate/src/test/java/eshop/products.feature`), Kỳ đã phát hiện một khiếm khuyết trong SUT EShop Backend:
```javascript
// Trích đoạn server.js của SUT EShop (Dòng 168):
if (row.id % 2 === 0) row.price = row.price.toString();
```
Tại các ID sản phẩm chẵn, Backend tự ý biến đổi `price` từ số (Integer) thành chuỗi (String). Kịch bản **Pact C3 Pha 2B** đã mô phỏng trực tiếp biến thể lỗi kiểu dữ liệu này và chứng minh rằng Pact Verifier chặn đứng tuyệt đối mọi hành vi vi phạm kiểu dữ liệu số nguyên. Điều này tạo nên tính liên kết học thuật chặt chẽ và nhất quán xuyên suốt giữa 2 công cụ mà Kỳ phụ trách (Karate & Pact).

---

## 6. Hướng Dẫn Tái Lập Kết Quả (Reproduction Guide)

Giảng viên và các thành viên nhóm có thể tái lập 100% kết quả trên bằng các lệnh sau:

```bash
# 1. Điều hướng vào thư mục kiểm thử Pact
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/pact

# 2. Cài đặt các thư viện cần thiết (nếu chưa cài)
npm install

# 3. Chạy Consumer Test để kiểm tra và sinh file hợp đồng C1 (nếu cần)
npm run test:consumer

# 4. Chạy Provider Verification đối soát trên SUT Backend chuẩn (C2)
npm run test:provider

# 5. Chạy toàn bộ Kịch bản C3 đối soát Breaking Change 3 pha (do Nguyễn Quốc Kỳ phát triển)
npm run test:c3
```

---
*Báo cáo được hoàn thiện ngày 21/10/2026 bởi Nguyễn Quốc Kỳ (MSSV: 23120138) — FIT@HCMUS.*
