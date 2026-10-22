# Báo Cáo Kỹ Thuật Postman & AI Agent — Tuần 05
# Member: Hà Quốc Kiên (MSSV: 23120056)

- **Họ và tên:** Hà Quốc Kiên  
- **MSSV:** 23120056  
- **Git Username:** `kienha5`  
- **Vai trò:** Thành viên Nhóm 11 — Phụ trách Postman (P1, P2), CSV Data-Driven Testing & Nghiên cứu AI Agent  
- **Tuần thực hành:** 05 (Tương ứng Tuần lý thuyết 06)  

---

## 1. Các Hạng Mục Kỹ Thuật Đã Thực Hiện

### 1.1. Postman Functional Testing (P1 & P2)
- **P1 (Basic / Smoke Test):** Kiểm tra endpoint danh sách sản phẩm `GET /api/products`, assert HTTP Status 200, thời gian phản hồi `< 500ms`, kiểm tra kiểu dữ liệu mảng JSON.
- **P2 (Stateful Token Chaining):** Gọi `POST /api/auth/login`, dùng Postman Tests script để trích xuất `response.json().token`, gán tự động vào biến môi trường `pm.environment.set("jwt_token", ...)` và đính kèm vào header `Authorization: Bearer {{jwt_token}}` của các request tiếp theo.

### 1.2. CSV Data-Driven Testing
- Thiết lập tệp dữ liệu kiểm thử CSV:
  - `login_data.csv`: Kiểm thử đăng nhập với các ca thành công, sai mật khẩu, tài khoản không tồn tại, email sai định dạng.
  - `product_ids.csv`: Kiểm thử lấy chi tiết sản phẩm với danh sách ID hợp lệ và biên (ID không tồn tại, ID âm, chuỗi chữ).
- Chạy tự động thông qua Collection Runner và Newman CLI.

### 1.3. Nghiên Cứu & Thực Nghiệm AI Agent
- Đánh giá khả năng của các mô hình AI trong việc phân tích tệp đặc tả OpenAPI (`openapi.yaml`) và sinh tự động Postman test scripts.
- Thử nghiệm các chiến lược prompt (Prompt không ràng buộc vs. Prompt có kèm SRS và quy tắc kiểm thử biên) để đo lường độ chính xác và tỷ lệ bao phủ.

---

## 2. Hướng Dẫn Thực Thi Bằng Lệnh (Command Guide)

```bash
# Chạy Postman Collection với Newman CLI
newman run tests/postman/eshop_api_all_tests.postman_collection.json \
  -d deliverables/05-management/weekly-reports/week-05/Ha-Quoc-Kien/api-tests/data/login_data.csv \
  --reporters cli,html \
  --reporter-html-export newman-report.html
```
