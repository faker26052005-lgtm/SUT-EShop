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
│   └── verify-breaking.js          # Kịch bản C3: Mô phỏng tiêm lỗi phá vỡ hợp đồng
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

### Kịch bản C3: Phát Hiện Breaking Change (Tiêm Lỗi Lệch Hợp Đồng)
Mô phỏng trường hợp lập trình viên Backend đổi tên trường `price` thành `unit_price` trong khi API vẫn trả về mã `HTTP 200 OK`.
```bash
npm run test:breaking
```
* **Kết quả:** Pact Verifier lập tức bắt lỗi:
  ```text
  Failures:
  1) Verifying a pact between EShopMobile and EShopBackend
     has a matching body (FAILED)
     $ -> Actual map is missing the following keys: price
  ```
  Nhờ có Pact, bản build Backend lỗi này sẽ bị chặn đứng trong pipeline CI/CD trước khi kịp deploy lên production làm sập ứng dụng Mobile của khách hàng!

---

## 3. Luận Điểm Cốt Lõi Về Failure Modes
1. **Kiểm thử chức năng (Postman) vs Contract Testing (Pact):** Postman chỉ kiểm tra xem Backend có sống và trả về dữ liệu hay không. Khi đổi `price` $\to$ `unit_price`, Postman vẫn báo PASS (vì status 200), nhưng Mobile App thực tế sẽ crash vì gọi `item.price` ra `undefined`. Pact là công cụ duy nhất bắt được lỗi này ở tầng tích hợp độc lập.
2. **Không phụ thuộc môi trường:** Consumer test (C1) chạy độc lập mà không cần bật Backend thật. Provider verification (C2) chạy độc lập mà không cần bật ứng dụng Mobile.
