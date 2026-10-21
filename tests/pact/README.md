# Pact JS — Consumer-Driven Contract Testing Suite

- **Chủ đề:** API Testing & Contract Testing (Seminar T06 — FIT@HCMUS)
- **Hệ thống SUT:** EShop (Consumer: `EShopMobile` — Provider: `EShopBackend`)
- **Thành viên phụ trách chính:** **Nguyễn Hoàng Anh Tú** (C1, C2), **Nguyễn Quốc Kỳ** (C3)

---

## 1. Cấu Trúc Thư Mục

```text
tests/pact/
├── consumer/
│   ├── product-client.js           # Client HTTP mô phỏng tầng Service của EShopMobile
│   └── product.consumer.test.js    # Kịch bản C1: Consumer Test sinh hợp đồng Pact JSON
├── provider/
│   └── verify.js                   # Kịch bản C2: Provider Verification đối soát với Backend thật
├── pacts/
│   └── EShopMobile-EShopBackend.json # File hợp đồng chính thức do C1 sinh ra
├── breaking-change/
│   ├── pact-c3-runner.js           # Kịch bản C3: Trình điều phối 3 pha tiêm lỗi & rollback tự động
│   ├── verify-breaking.js          # Script mô phỏng nhanh vi phạm hợp đồng (cổng 3001)
│   └── Pact_C3_Execution_Guide.md  # Tài liệu kỹ thuật chuyên sâu về Breaking Change (Nguyễn Quốc Kỳ)
├── package.json                    # Cấu hình thư viện (@pact-foundation/pact v13, mocha, chai)
└── README.md                       # Tài liệu hướng dẫn thực thi
```

---

## 2. Hướng Dẫn Thực Thi Từng Kịch Bản (Commands)

Cài đặt thư viện trước khi chạy (chỉ cần chạy 1 lần):
```bash
npm install
```

### Kịch bản C1: Consumer Test & Sinh Hợp Đồng (`EShopMobile`)
Client Mobile khai báo kỳ vọng đối với endpoint `GET /api/products/1` (bắt buộc phải có `id`, `name`, và đặc biệt `price` phải là kiểu `Number`).
```bash
npm run test:consumer
```
* **Kết quả:** Pact khởi tạo Mock Server ngầm, thực thi test và tự động sinh file hợp đồng: [`pacts/EShopMobile-EShopBackend.json`](./pacts/EShopMobile-EShopBackend.json).

### Kịch bản C2: Provider Verification (`EShopBackend`)
Backend Node.js/Express đọc file hợp đồng trên và bắn request thật vào server backend để đối soát tính tương thích.
```bash
npm run test:provider
```
* **Kết quả:** Script tự động thăm dò cổng 3000 (khởi động backend nếu chưa chạy), đối chiếu schema và in ra kết quả `VERIFICATION SUCCESSFUL (Hợp đồng khớp 100%)`.

### Kịch bản C3: Phát Hiện Breaking Change & Khôi Phục (3 Pha Toàn Diện)
Phụ trách chính bởi: **Nguyễn Quốc Kỳ** (MSSV: 23120138). Thực hiện quy trình đối soát khép kín:
1. **Pha 1 (Baseline):** Xác minh Provider đáp ứng 100% hợp đồng.
2. **Pha 2 (Mutation):** Tiêm 2 dạng breaking change kinh điển:
   - *Dạng 1:* Đổi tên trường `price` $\to$ `unit_price` (HTTP 200 OK nhưng thiếu key bắt buộc).
   - *Dạng 2:* Sai lệch kiểu dữ liệu (trả về chuỗi format tiền tệ `'30.000.000 ₫'` thay vì số nguyên thô).
3. **Pha 3 (Rollback):** Tự động hoàn nguyên mã nguồn và xác nhận hệ thống an toàn trở lại.

```bash
# Chạy toàn bộ quy trình 3 pha C3 (Khuyến nghị):
npm run test:c3

# Hoặc chạy mô phỏng nhanh vi phạm đổi tên trường:
npm run test:breaking
```
* **Kết quả:** Pact Verifier lập tức chặn đứng cả 2 biến thể lỗi và in bảng tổng kết chi tiết:
  ```text
  Failures:
  1) $ -> Actual map is missing the following keys: price
  2) $.price -> Expected '30.000.000 ₫' (String) to be an integer number
  ```
  Nhờ có Pact, các bản build Backend lỗi này bị chặn đứng hoàn toàn trong pipeline CI/CD trước khi kịp deploy lên production làm sập ứng dụng Mobile của khách hàng! Chi tiết xem tại [`Pact_C3_Execution_Guide.md`](./breaking-change/Pact_C3_Execution_Guide.md).

---

## 3. Luận Điểm Cốt Lõi Về Failure Modes
1. **Kiểm thử chức năng (Postman) vs Contract Testing (Pact):** Postman chỉ kiểm tra xem Backend có sống và trả về dữ liệu hay không. Khi đổi `price` $\to$ `unit_price`, Postman vẫn báo PASS (vì status 200), nhưng Mobile App thực tế sẽ crash vì gọi `item.price` ra `undefined`. Pact là công cụ duy nhất bắt được lỗi này ở tầng tích hợp độc lập.
2. **Không phụ thuộc môi trường:** Consumer test (C1) chạy độc lập mà không cần bật Backend thật. Provider verification (C2) chạy độc lập mà không cần bật ứng dụng Mobile.
