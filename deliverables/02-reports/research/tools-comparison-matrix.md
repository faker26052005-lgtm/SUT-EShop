# Phân Tích & Khuyến Nghị: API & Contract Testing cho EShop SUT

## Tổng Quan Project EShop

Project EShop là nền tảng e-commerce đa kênh với kiến trúc như sau:

| Thành phần | Công nghệ | Vai trò trong Contract Testing |
|---|---|---|
| **Backend API** | Node.js + Express + SQLite | **Provider** (nhà cung cấp API) |
| **Frontend Web** | React + Vite + Tailwind CSS | **Consumer 1** |
| **Web Admin** | React + Vite + Tailwind CSS | **Consumer 2** |
| **Mobile App** | React Native + Expo | **Consumer 3** (quan trọng nhất!) |

> [!IMPORTANT]
> Đây chính xác là kiến trúc **1 Provider – 3 Consumers** — bài toán điển hình mà Contract Testing được sinh ra để giải quyết. Backend Node.js phục vụ đồng thời Web, Admin Portal và Mobile App với vòng đời phát hành hoàn toàn khác nhau.

---

## Phân Tích 5 Tools Theo Bối Cảnh EShop

### 1. 🏆 Pact (pact-js)

**Mức phù hợp: ★★★★★ (Cao nhất về học thuật)**

**Tại sao phù hợp với EShop:**
- Backend là **Node.js** → dùng `pact-js` cho cả Provider lẫn Consumer tests một cách thuần nhất
- Mobile App (React Native) cũng là JS/TS → viết Consumer test cho Mobile bằng `pact-js` hoàn toàn tự nhiên
- Consumer-Driven Contract Testing (CDCT) giải quyết đúng vấn đề Mobile App bị lock phiên bản (các phiên bản cũ vẫn gọi backend)
- Kịch bản demo 3 giai đoạn (Pass → Breaking Change → Fail detected) rất ấn tượng cho báo cáo

**Mapping trực tiếp với EShop:**
```
Mobile App Consumer → Contract: chỉ cần id, name, price từ GET /api/products/:id
Web Consumer       → Contract: cần id, name, price, description, imageUrl, category_id
Admin Consumer     → Contract: cần toàn bộ fields
Backend Provider   → Verify: chạy lại tất cả contracts, phát hiện breaking change
```

**Rào cản:**
- Cần setup PactFlow (cloud) hoặc Pact Broker (self-hosted Docker)
- Learning curve về tư duy Consumer-Driven

**Giải pháp rào cản:** Dùng **PactFlow Free Plan** (miễn phí cho sinh viên/open source, có UI trực quan)

---

### 2. 🟡 Spring Cloud Contract

**Mức phù hợp: ★★☆☆☆ (Không phù hợp)**

**Lý do không phù hợp với EShop:**
- Backend là **Node.js**, không phải Spring Boot → Spring Cloud Contract chỉ tối ưu trong hệ sinh thái JVM
- Mobile (React Native) sẽ gặp khó khăn khi tích hợp WireMock stubs từ JAR file
- Technology lock-in vào Java hoàn toàn không match với stack của project

> [!CAUTION]
> **Loại bỏ khỏi danh sách cân nhắc.** Stack của EShop là Node.js + React + React Native — không có JVM ở bất kỳ đâu.

---

### 3. 🟢 Specmatic

**Mức phù hợp: ★★★★☆ (Cao, phù hợp nếu có OpenAPI spec tốt)**

**Tại sao phù hợp với EShop:**
- Hoạt động độc lập với ngôn ngữ (CLI/Docker) → không quan tâm Node.js hay gì
- Tận dụng trực tiếp `api_specification.md` (chuyển thành OpenAPI 3.0) làm contract
- "No-code testing" → phù hợp với nhóm muốn tập trung vào báo cáo hơn là viết code test
- Kiểm tra backward compatibility tự động giữa 2 phiên bản spec

**Hạn chế với EShop:**
- File `api_specification.md` hiện tại là Markdown, không phải OpenAPI YAML/JSON chuẩn → cần chuyển đổi trước
- Ít minh họa được khái niệm CDCT thuần túy (Consumer-Driven)
- Độ sâu học thuật về Contract Testing thấp hơn Pact

---

### 4. 🟡 Microcks

**Mức phù hợp: ★★★☆☆ (Trung bình, thiên về Mock hơn Contract)**

**Điểm phù hợp:**
- Hỗ trợ đa giao thức (REST API của EShop + potential Event-driven)
- Dashboard trực quan, dễ trình bày

**Hạn chế:**
- Yêu cầu Docker Compose nặng (MongoDB + Keycloak + Microcks server)
- Thiên về **API Mocking** hơn là **Contract Testing** thuần túy
- Không phân biệt được per-Consumer contracts (Mobile vs Web khác nhau)
- Overkill cho project học tập cấp độ môn học

---

### 5. 🟢 Postman + Newman

**Mức phù hợp: ★★★★☆ (Cao nhất về tính thực dụng và dễ trình bày)**

**Tại sao cực kỳ phù hợp với EShop:**
- File `api_specification.md` đã mô tả đầy đủ 30+ endpoints → dễ import vào Postman
- Tất cả sinh viên đã quen với Postman → onboarding = 0
- Newman chạy trong GitHub Actions CI/CD → demo pipeline rất ấn tượng
- `newman-reporter-htmlextra` tạo báo cáo HTML chuyên nghiệp cho slide
- Dễ dàng demo kịch bản: thay đổi response schema của backend → Newman báo lỗi

**Mapping với EShop:**
```javascript
// Tests tab trong Postman: kiểm tra contract schema
const schema = {
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    price: { type: "number" },
    // ...
  },
  required: ["id", "name", "price"]
};
pm.test("Response schema matches contract", () => {
  pm.response.to.have.jsonSchema(schema);
});
```

**Lưu ý quan trọng:** Phải trình bày rõ trong báo cáo sự khác biệt giữa Schema Conformance Testing (Postman) và CDCT thực thụ (Pact).

---

## Bảng So Sánh Cuối Cùng Theo Tiêu Chí EShop

| Tiêu Chí | Pact | Specmatic | Postman+Newman |
|---|---|---|---|
| **Phù hợp stack Node.js** | ✅ Xuất sắc | ✅ Tốt (độc lập) | ✅ Xuất sắc |
| **Hỗ trợ 3 Consumers (Web/Admin/Mobile)** | ✅ Native CDCT | ⚠️ Per-spec | ⚠️ Thủ công |
| **Độ khó setup** | Trung bình | Thấp | Cực thấp |
| **Chiều sâu học thuật** | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| **Chất lượng demo/báo cáo** | ★★★★★ | ★★★★☆ | ★★★★☆ |
| **Thời gian làm quen** | 1–2 tuần | 3–5 ngày | 1–2 ngày |
| **Khuyến nghị** | 🏆 Ưu tiên 1 | 🥈 Ưu tiên 2 | 🥉 Ưu tiên 3 (backup) |

---

## Khuyến Nghị Cuối Cùng

### 🏆 Lựa Chọn Tốt Nhất: **Pact (pact-js) + PactFlow**

Đây là lựa chọn tốt nhất về **mọi mặt** cho project EShop trong môn học Software Testing vì:

1. **Stack thuần JS/TS** — Backend Node.js, Web React, Mobile React Native đều dùng `pact-js`
2. **Demo ấn tượng nhất** — Network graph trên PactFlow hiển thị ma trận tương thích Consumer↔Provider trực quan
3. **Học thuật sâu nhất** — Chứng minh hiểu được bản chất CDCT, không chỉ "chạy được tool"
4. **Kịch bản demo hoàn hảo** với EShop:
   - `GET /api/products/:id` → Mobile App chỉ cần `{id, name, price}`, Web cần thêm `imageUrl`
   - Đổi tên field `price` → `unit_price` ở backend → **PactFlow chặn deploy ngay lập tức**
5. **Giải quyết đúng vấn đề thực tế** — Mobile App bị lock phiên bản, đây là pain point thực của EShop

### 🥈 Phương Án Dự Phòng: **Postman + Newman + Schema Validation**

Nếu thời gian gấp hoặc nhóm mạnh về demo hơn code, dùng phương án này. Vẫn rất ấn tượng nếu kết hợp GitHub Actions CI/CD pipeline.

---

## Lộ Trình 4 Tuần Thực Hành (Pact)

```
Tuần 1: Setup & Lý Thuyết
├── Đọc docs pact-js, hiểu khái niệm Consumer/Provider/Contract
├── Cài đặt pact-js, đăng ký PactFlow free account
└── Viết Consumer test đơn giản cho GET /api/products

Tuần 2: Consumer Tests
├── Mobile Consumer: GET /api/products/:id (chỉ cần id, name, price)
├── Web Consumer: GET /api/products/:id (cần đủ fields)
├── Xuất Pact files JSON, publish lên PactFlow
└── Xem ma trận tương thích trên PactFlow UI

Tuần 3: Provider Verification & CI/CD
├── Viết Provider verification tests cho Backend Node.js
├── Tích hợp vào GitHub Actions
├── Chạy can-i-deploy check
└── Kiểm tra toàn bộ matrix xanh ✅

Tuần 4: Breaking Change Demo & Báo Cáo
├── Đổi tên field `price` → `unit_price` trong backend
├── Chạy lại → Matrix đỏ ❌, deploy bị chặn
├── Chụp màn hình PactFlow, quay screencast cho slide
└── Viết báo cáo phân tích sự khác biệt CDCT vs Functional Testing
```

---

## Kịch Bản Demo Ấn Tượng Nhất Cho Buổi Bảo Vệ

```
1. [LIVE] Mở PactFlow dashboard → Tất cả ✅ GREEN
   → "Backend hiện tại tương thích với Web, Admin và Mobile App"

2. [LIVE] Sửa 1 dòng code trong backend/routes/products.js:
   Đổi  { id, name, price }
   Thành { id, name, unit_price }  ← chỉ đổi tên field

3. [LIVE] GitHub Actions chạy tự động → Provider verification FAIL
   → PactFlow: Mobile Consumer ❌ (vì Mobile cần field `price`)
   → can-i-deploy: "CANNOT DEPLOY"

4. [SLIDE] Giải thích: "Đây là loại lỗi không thể phát hiện bằng
   functional testing thông thường — backend vẫn trả về 200 OK,
   nhưng Mobile App sẽ crash khi người dùng checkout!"
```

> [!TIP]
> Đây chính xác là value proposition của Contract Testing: **API trả về HTTP 200 nhưng Mobile App vẫn crash** — một điều mà kiểm thử chức năng thông thường không bắt được.
