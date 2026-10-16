# 📋 Chuẩn bị Buổi Gặp Mặt Lần 1 — Seminar API & Contract Testing

> **Thời điểm**: Tuần 2–3 | **Chủ đề**: T06 – API Testing & Contract Testing  
> **Rủi ro**: Trừ **1đ/10đ** nếu không có thành viên tham dự hoặc chuẩn bị sơ sài

---

## Tổng quan: Danh sách tài liệu cần có

| # | Tài liệu | Trạng thái | Mức độ ưu tiên |
|---|---|---|---|
| 1 | Slide phác thảo nội dung seminar | ❌ Chưa có | 🔴 Bắt buộc |
| 2 | Phác thảo nội dung lý thuyết | ❌ Chưa có | 🔴 Bắt buộc |
| 3 | Danh sách & so sánh công cụ dự kiến | ✅ Đã có chi tiết | 🟢 Hoàn thành |
| 4 | Kế hoạch phân công + tiến độ | ❌ Chưa có | 🔴 Bắt buộc |
| 5 | Kịch bản demo dự kiến (3 kịch bản) | ❌ Chưa có | 🔴 Bắt buộc |
| 6 | Phân tích chủ đề + kiến trúc EShop | ✅ Đã có | 🟢 Hoàn thành |
| 7 | Câu hỏi dự kiến hỏi GV | ❌ Chưa có | 🟡 Nên có |

---

## ✅ Đã có — Dùng ngay được

### Tài liệu 3 – Danh sách & so sánh công cụ
File: [`Tool_Research_Overview.md`](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/Tool_Research_Overview.md)

Đã có đầy đủ:
- Bảng 8 công cụ với vai trò, độ khó, mapping với mục tiêu brief
- Hướng dùng chi tiết cho EShop: Postman/Newman, Karate, REST Assured, Pact, PactFlow, AI
- Failure modes của từng công cụ
- Ghép công cụ với milestone và bằng chứng nộp

### Tài liệu 6 – Phân tích chủ đề + kiến trúc EShop
File: [`analysis_api_contract_testing.md`](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/analysis_api_contract_testing.md)

Đã có đầy đủ:
- Kiến trúc 1 Provider – 3 Consumers (Web, Admin, Mobile)
- So sánh 5 công cụ theo bối cảnh EShop
- Khuyến nghị Pact làm tool chính + Postman làm backup
- Lộ trình 4 tuần thực hành (Pact)

---

## ❌ Còn thiếu — Cần bổ sung

---

### Tài liệu 1 – Slide phác thảo

> **Vai trò**: Tài liệu đầu mối GV đọc. Thể hiện nhóm đã hiểu chủ đề và có kế hoạch.

**Hướng làm:**

Slide không cần hoàn thiện nhưng phải đủ các mục sau (khoảng 15–20 trang):

```
Trang 1:   Tiêu đề + Tên nhóm + Thành viên
Trang 2:   Mục tiêu seminar — nhóm định dạy gì cho lớp?
Trang 3:   Chủ đề là gì? (API Testing + Contract Testing, định nghĩa nhanh)
Trang 4:   Tại sao chủ đề này quan trọng? (pain point thực tế)
Trang 5:   Kiến trúc EShop — 1 Provider, 3 Consumers
Trang 6:   Bản đồ nội dung lý thuyết dự kiến (mindmap hoặc outline)
Trang 7:   Danh sách công cụ khảo sát (bảng tóm tắt từ Tool_Research_Overview)
Trang 8:   Công cụ được chọn & lý do (Pact + Postman)
Trang 9:   Kịch bản demo dự kiến (3 kịch bản)
Trang 10:  Hướng AI (Postbot, ChatGPT/Claude, PactFlow AI)
Trang 11:  Timeline + Phân công thành viên
Trang 12:  Câu hỏi cho GV
```

**Lưu ý trình bày**: chữ to, rõ, **nền trắng chữ đen** (yêu cầu tường minh trong file seminar).

---

### Tài liệu 2 – Phác thảo nội dung lý thuyết

> **Vai trò**: Cho GV thấy nhóm hiểu *bản chất* vấn đề, không chỉ biết chạy tool.

**Hướng làm** — Viết dưới dạng outline, không cần đầy đủ ngay:

#### Phần A — API Testing (nền tảng)
- API là gì trong ngữ cảnh microservice/multi-consumer?
- Phân loại kiểm thử API: functional, schema conformance, contract
- Vị trí trong Test Pyramid (unit → integration → API → E2E)
- Công cụ phổ biến và khi nào dùng loại nào

#### Phần B — Contract Testing (trọng tâm)
- **Vấn đề cốt lõi**: API trả HTTP 200 nhưng client vẫn crash
  - Ví dụ: backend đổi `price` → `unit_price`, functional test pass nhưng Mobile App crash khi checkout
- **Consumer-Driven Contract Testing (CDCT)**:
  - Consumer viết test mô tả những gì *nó cần* từ Provider
  - Pact sinh file contract JSON (chỉ chứa phần Consumer dùng)
  - Provider chạy lại contract để verify
- **Khái niệm cần giải thích**: Consumer, Provider, Pact file, Pact Broker, `can-i-deploy`
- **So sánh**: Schema Testing (Postman) vs CDCT (Pact) — khi nào dùng cái nào?

#### Phần C — AI trong API/Contract Testing
- Sinh OpenAPI spec từ Markdown bằng AI
- Sinh test case (positive + negative) từ OpenAPI
- Giới hạn của AI: yếu ở business logic, race condition, lạm dụng coupon/phân quyền
- Nguyên tắc: AI sinh → người review → chạy thật → ghi lại

**Gợi ý tham khảo nhanh**: đọc trang đầu của [api-contract-testing-tools-research.md](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/api-contract-testing-tools-research.md) để lấy định nghĩa chuẩn.

---

### Tài liệu 4 – Kế hoạch phân công + tiến độ

> **Vai trò**: Thể hiện tinh thần làm việc nhóm có quy trình (yêu cầu tường minh trong file seminar).

**Hướng làm** — Điền tên thành viên thật vào template sau:

#### Timeline theo milestone bắt buộc

| Milestone | Deadline | Nội dung | Ghi chú |
|---|---|---|---|
| Gặp GV lần 1 | Tuần 2–3 | Slide phác thảo + outline lý thuyết + danh sách tool | Trừ 1đ nếu sơ sài |
| Sprint 1 | Tuần 3–4 | Setup công cụ, lý thuyết, viết Consumer test đầu tiên | |
| Sprint 2 | Tuần 4–5 | Provider verification, demo AI, negative test | |
| **Nộp điểm** | **Tuần 6** | Slide đầy đủ, báo cáo, video demo, bài tập áp dụng | Trừ 3đ nếu thiếu/sơ sài |
| Trình bày thử | Trước tuần seminar | Gặp GV lần 2 để nhận góp ý | Trừ 4đ nếu bỏ qua |
| **Nộp cuối** | **Tuần 12** | Bản hiệu chỉnh hoàn chỉnh | |

#### Phân công thành viên

| Thành viên | Phần trách nhiệm chính | Phần hỗ trợ |
|---|---|---|
| [Tên TV1] | Lý thuyết API Testing + Postman/Newman demo | Review slide |
| [Tên TV2] | Pact (pact-js) Consumer & Provider tests | Báo cáo chi tiết |
| [Tên TV3] | Hướng AI (Postbot, ChatGPT/Claude, PactFlow AI) | Bài tập áp dụng |

> **Lưu ý**: Cần kèm minh chứng hoạt động (commit Git, ảnh chụp công việc) — yêu cầu tường minh trong file seminar.

**Công cụ quản lý nhóm đề xuất**: GitHub Projects / Trello / Notion (chọn 1, thể hiện trong slide)

---

### Tài liệu 5 – Kịch bản demo (3 kịch bản theo yêu cầu seminar)

> **Vai trò**: Cho GV thấy nhóm có kế hoạch demo cụ thể, không phải demo ngẫu hứng.  
> Yêu cầu seminar: `cài đặt → cơ bản (Record & Playback, Data-driven, Checkpoint) → phức tạp`.

---

#### 🎬 Kịch bản 1 — Cài đặt & Chạy lần đầu

**Công cụ**: Postman + Newman | **Thời lượng demo dự kiến**: ~5 phút

| Bước | Hành động | Kết quả kỳ vọng |
|---|---|---|
| 1 | Cài Postman, import `api_specification.md` | Collection EShop xuất hiện trong Postman |
| 2 | Gửi `GET /api/products` thủ công | Response 200, danh sách sản phẩm |
| 3 | Cài Newman: `npm i -g newman newman-reporter-htmlextra` | Newman sẵn sàng chạy CLI |
| 4 | Chạy `newman run EShop.collection.json -r htmlextra` | Báo cáo HTML xanh toàn bộ |

**Điểm yếu cần chỉ ra**: Test pass vì chỉ check status 200, không check body → dẫn vào kịch bản 2.

---

#### 🎬 Kịch bản 2 — Chức năng cơ bản (Data-driven + Checkpoint + AI)

**Công cụ**: Postman (chained token, schema) + Postbot | **Thời lượng**: ~8 phút

| Bước | Hành động | Yếu tố seminar |
|---|---|---|
| 1 – Chained token | `POST /api/login` → lưu token vào variable → dùng trong các request sau | Record & Playback |
| 2 – Data-driven | Chạy test với nhiều bộ dữ liệu (đúng/sai/biên) bằng CSV runner | Data-driven |
| 3 – Checkpoint | Thêm JSON schema assertion vào `GET /api/products/:id` | Checkpoint |
| 4 – Postbot AI | Dùng Postbot sinh assertion tự động, so sánh với viết tay | Hướng AI |

**Điểm yếu cần chỉ ra**: Schema viết tay lỗi thời, không phát hiện được breaking change từ phía Provider → dẫn vào kịch bản 3 với Pact.

---

#### 🎬 Kịch bản 3 — Luồng phức tạp (Contract Testing + Breaking Change)

**Công cụ**: Pact (pact-js) + PactFlow + AI (ChatGPT/Claude) | **Thời lượng**: ~10 phút

**Luồng chính (Pact)**:

```
[Mobile App] viết Consumer test
      ↓ pact-js sinh file contract JSON
[Pact Broker / PactFlow] lưu contract
      ↓
[Backend Node.js] chạy Provider verification
      ↓
PactFlow: ma trận tương thích Consumer ↔ Provider ✅ GREEN
      ↓
[LIVE CHANGE] Đổi `price` → `unit_price` trong backend
      ↓
GitHub Actions chạy → Provider verification ❌ FAIL
PactFlow: `can-i-deploy` → CANNOT DEPLOY
```

**Luồng AI (ChatGPT/Claude)**:

```
[Input] api_specification.md + FR-08 Checkout, FR-09 Coupon
      ↓ Prompt: "Sinh negative test cases cho các luồng nghiệp vụ"
[Output] Test cases: giá âm, coupon hết hạn, phân quyền sai
      ↓ Chạy thật trên EShop backend
[Kết quả] Ghi lại: AI bắt được gì, bỏ sót gì
```

**Key message cho lớp**: *"API trả HTTP 200 nhưng Mobile App vẫn crash — đây là loại lỗi Contract Testing giải quyết mà functional testing bỏ qua."*

---

### Tài liệu 7 – Câu hỏi dự kiến hỏi GV (nên có)

> Thể hiện nhóm đã suy nghĩ nghiêm túc và chủ động.

Các câu hỏi gợi ý:

1. Nhóm dự kiến dùng **Pact làm tool chính**, Postman làm backup — GV có góp ý gì về lựa chọn này không?
2. Phần AI, nhóm dự kiến dùng **ChatGPT/Claude + Postbot + PactFlow AI** — mức demo nào là đủ?
3. **Bài tập áp dụng** nên ở mức độ nào? Lớp cần tự cài tool hay chỉ hiểu kịch bản?
4. Về **`can-i-deploy`**: trong ngữ cảnh môn học (không có staging/production thật), demo theo cách nào là phù hợp?
5. Nhóm có nên demo **thất bại** (contract violated) live hay quay video trước?

---

## 🗓️ Checklist trước buổi gặp

- [ ] Slide phác thảo (≥ 12 trang, nền trắng chữ đen)
- [ ] Outline lý thuyết (Phần A + B + C ở trên)
- [ ] Danh sách công cụ chọn và lý do → *dùng từ Tool_Research_Overview.md*
- [ ] Bảng phân công thành viên (điền tên thật)
- [ ] Timeline các milestone (từ bảng ở Tài liệu 4)
- [ ] 3 kịch bản demo phác thảo (ít nhất đến mức "sẽ demo gì")
- [ ] Danh sách câu hỏi hỏi GV
- [ ] Ít nhất **1 thành viên** đã cài thử Postman/pact-js để biết khó khăn thực tế

---

## 🔗 Tài liệu tham khảo nội bộ đã có

| File | Nội dung |
|---|---|
| [Tool_Research_Overview.md](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/Tool_Research_Overview.md) | Khảo sát 8 công cụ, cách dùng, failure modes |
| [analysis_api_contract_testing.md](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/analysis_api_contract_testing.md) | So sánh tool, kiến trúc EShop, kịch bản demo ấn tượng |
| [api-contract-testing-tools-research.md](file:///home/quocky05/academy/software-testing/eshop-sut/artifacts/api-contract-testing-tools-research.md) | Nghiên cứu chuyên sâu (dùng để viết lý thuyết) |
| [api_specification.md](file:///home/quocky05/academy/software-testing/eshop-sut/api_specification.md) | Spec 30+ endpoint của EShop (dùng để tạo OpenAPI YAML + test) |
