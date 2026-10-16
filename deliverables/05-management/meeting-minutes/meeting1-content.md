# Báo Cáo Tiến Độ Seminar
## Chủ đề: API Testing & Contract Testing

**Thực hiện:** Nhóm 11
**Thành viên:** Hà Quốc Kiên, Nguyễn Quốc Kỳ, Nguyễn Hoàng Anh Tú
*(Buổi gặp mặt GV lần 1)*

---

## 🎯 Mục tiêu Seminar

- **Nghiên cứu & Làm chủ:** Các framework kiểm thử API và Contract chuẩn công nghiệp (Postman, Pact, Karate).
- **Chia sẻ kiến thức:** Giúp lớp hiểu rõ bản chất API Testing, không chỉ dừng ở việc "Gửi request - Nhận response".
- **Giải quyết rủi ro thực tế:** Ứng dụng Contract Testing để ngăn chặn lỗi tích hợp giữa các microservices.
- **Tự động hóa & AI:** Xây dựng quy trình tự động và áp dụng AI Agent để tối ưu hóa việc tạo test.

---

## 📖 Giới thiệu Chủ đề

1. **API Testing:**
   - Kiểm tra tính đúng đắn của logic nghiệp vụ, cấu trúc dữ liệu, và mã trạng thái (Status Code).
   - Đảm bảo API hoạt động đúng theo đặc tả (Schema Conformance).

2. **Contract Testing:**
   - Đảm bảo **"sự cam kết" (Contract)** giữa Client (Consumer) và Server (Provider).
   - Đảm bảo khi một bên thay đổi code, bên kia không bị "gãy" (crash) đột ngột.

---

## ⚠️ Tại sao chủ đề này quan trọng? (Pain Point)

**Kịch bản thực tế thường gặp:**
- Backend tự ý đổi tên trường `price` thành `unit_price`.
- Nhóm QA chạy **Functional test (Postman)**: Backend vẫn trả về `HTTP 200 OK` ➔ *Test xanh, Pass!*
- Nhưng khi đưa lên Production, **Mobile App lập tức bị Crash** vì logic hiển thị không tìm thấy trường `price`.

👉 **Giải pháp:** Contract Testing sẽ phát hiện ra sự bất đồng bộ này ngay từ lúc code, trước khi được deploy.

---

## 🏗️ Kiến trúc Hệ thống Thực hành (EShop)

- **Provider (Bên cung cấp API):** 
  - `EShop Backend` (Xây dựng bằng Node.js/Express)
- **Consumers (Bên tiêu thụ API):** 
  - Web Frontend
  - Admin Portal
  - **EShopMobile** (Trọng tâm dùng để demo tương tác)

*Trọng tâm Demo: Mô phỏng tương tác và phá vỡ hợp đồng (Breaking Change) giữa `EShopMobile` và `EShop Backend`.*

---

## 🛠️ Khảo sát & Lựa chọn Công cụ

Đã khảo sát: *Postman, Newman, REST Assured, Karate, Pact, PactFlow, Swagger.*

**Lựa chọn 3 công cụ chính:**
1. **Postman + Newman:** Trực quan, phổ biến, mạnh mẽ cho API Testing cơ bản và tự động hóa qua CLI.
2. **Pact (Pact JS):** Framework chuẩn công nghiệp, thiết kế chuyên biệt để giải quyết bài toán Consumer-Driven Contract Testing (CDCT).
3. **Karate:** Framework kiểm thử Code-based (cú pháp Gherkin), cực kỳ mạnh khi test các luồng nghiệp vụ end-to-end (Workflow).

---

## 🎬 Kế hoạch Demo các công cụ

Nhóm dự kiến thực hành ba công cụ chính: **Postman/Newman**, **Pact JS** và **Karate**. Mỗi công cụ có ba clip: cài đặt/cấu hình, chức năng cơ bản và luồng phức tạp gắn với EShop. Newman là runner chạy Collection từ CLI, thuộc workflow Postman. Các clip dưới đây là kế hoạch; status, response, log và report sẽ được ghi nhận sau khi nhóm chạy thử, không xem kết quả dự kiến là kết quả đã xác minh.

Mỗi clip sẽ trình bày mục tiêu, tiền điều kiện, thao tác, kết quả quan sát được và ít nhất một giới hạn/failure mode. Kịch bản chi tiết, lệnh chạy, dữ liệu và checklist nằm trong [`demo-script.md`](demo-script.md).

### 1. Postman/Newman — API testing và tự động hóa

| Clip | Mục tiêu và thao tác | Kết quả/bằng chứng cần ghi nhận | Điểm cần lưu ý |
|---|---|---|---|
| **P1 — Cài đặt, cấu hình, request đầu tiên** | Mở Postman; tạo Collection và environment `EShop Local`; đặt `baseUrl`; gửi `GET {{baseUrl}}/api/products`; lưu request và chạy lại. | Phiên bản/cách cài đã dùng, Collection/environment mẫu, status và response thực tế, ảnh hoặc log lần chạy. | Lưu/phát lại request chưa phải là kiểm thử đầy đủ; `200` không tự chứng minh body đúng. |
| **P2 — Runner, data-driven và checkpoints** | Tạo test cho `POST /api/login`; chạy bộ dữ liệu CSV/JSON đã xác nhận; lưu token sau login thành công; gọi endpoint cần xác thực như `GET /api/cart`; kiểm tra status, field và kiểu dữ liệu bằng assertions; xem từng iteration và một lỗi có chủ đích. | File dữ liệu không chứa secret, scripts/assertions, kết quả từng lượt, lỗi assertion và cách đọc lỗi. | Nêu rõ thứ tự request và trạng thái phụ thuộc; dùng user test riêng để tránh khóa tài khoản; kiểm tra dữ liệu thực tế trước khi chốt expected. |
| **P3 — Newman và chạy tự động** | Export Collection/environment đã loại secret; chạy Newman từ terminal với reporter đã cài; xem log, exit code và report; tạo một mismatch trong fixture/assertion, chạy lại rồi khôi phục. | Collection JSON, command thực tế, report CLI/HTML và exit code của lần pass/fail. | Chỉ mô tả tích hợp CI hoặc chặn triển khai nếu nhóm đã cấu hình và kiểm chứng; Newman không bù được assertion yếu. |

### 2. Pact JS — Consumer-Driven Contract Testing

| Clip | Mục tiêu và thao tác | Kết quả/bằng chứng cần ghi nhận | Điểm cần lưu ý |
|---|---|---|---|
| **C1 — Cài đặt và cấu trúc Consumer/Provider** | Cài dependency Pact JS; giới thiệu Consumer giả lập `EShopMobile` và Provider `EShopBackend`; chạy test khung qua client/service của Consumer; mở Pact file được sinh. | Phiên bản/dependency, source test, Pact JSON và log chạy. | Test nên đi qua client code đại diện cho Consumer; không tạo contract bằng dữ liệu giả rồi coi đó là bằng chứng ứng dụng sử dụng API như vậy. |
| **C2 — Tạo contract và verification thành công** | Consumer mô tả interaction đọc sản phẩm, dự kiến `GET /api/products/:id`; xác định provider state/dữ liệu sản phẩm; chạy Consumer test để sinh Pact; chạy Provider verification trên EShop. | Request/response interaction, Pact file mới sinh, provider-state setup và kết quả verification thực tế. | Chọn ID và field sau khi kiểm tra backend. Mã nguồn hiện có thể trả `{}` với HTTP 200 khi không tìm thấy ID và có ID trả `price` dạng chuỗi; ghi nhận sai khác thay vì giả định contract luôn pass. |
| **C3 — Phát hiện breaking change** | Chạy baseline; trên branch/fixture demo đổi có chủ đích response field mà Consumer dùng (ví dụ `price` thành `unit_price`); chạy verification lại, đọc interaction fail, hoàn nguyên và chạy lại. | Diff trước/sau, log baseline/fail/khôi phục và Pact file được dùng. Có thể thêm Broker/`can-i-deploy` nếu đã cấu hình. | Verification fail cho thấy contract không còn thỏa mãn; không tự đồng nghĩa hệ thống đã chặn deploy. Chỉ khẳng định deployment gate nếu có cấu hình và bằng chứng tương ứng. |

### 3. Karate — API test bằng feature và workflow

| Clip | Mục tiêu và thao tác | Kết quả/bằng chứng cần ghi nhận | Điểm cần lưu ý |
|---|---|---|---|
| **K1 — Cài đặt và test đầu tiên** | Trình bày Java/Maven và phiên bản Karate đã chọn; mở project/runner và cấu hình `baseUrl`; viết/chạy feature gọi `GET /api/products`; mở report. | Hướng dẫn/lệnh tái lập, dependency/version, feature file, output và report của lần chạy. | Assert response shape/field đã xác nhận; test chỉ kiểm tra status hoặc mảng chưa chắc xác nhận đúng nghiệp vụ. |
| **K2 — Assertions và data-driven** | Kiểm tra status, field, kiểu dữ liệu và response; dùng `Scenario Outline`/`Examples` để chạy các input đã chuẩn bị, gồm trường hợp hợp lệ và không hợp lệ; xem kết quả từng case và một failure có chủ đích. | Feature, bảng test data, kết quả từng case và lỗi assertion. | Đối chiếu với đặc tả và hành vi backend; nếu chúng khác nhau, ghi nhận discrepancy thay vì sửa expected để ép test xanh. |
| **K3 — Workflow mua hàng có trạng thái** | Đăng nhập lấy token; lấy sản phẩm fixture; thêm sản phẩm vào giỏ; đọc lại giỏ; checkout; truy vấn/kiểm tra đơn hàng vừa tạo nếu endpoint và dữ liệu đã xác minh. | Feature workflow, token chaining trong lúc chạy, order ID, report và hướng dẫn reset/cleanup đã thử. | Cart hiện lưu in-memory, còn checkout ghi order vào SQLite. Vì vậy không tuyên bố cleanup database tự động nếu chưa kiểm chứng; dùng database/user demo riêng, ghi rõ tác động và cách khôi phục. |

### Phủ các kỹ thuật kiểm thử trong demo

- **Record/playback:** P1 lưu request/Collection và chạy lại; P2 dùng Collection Runner để phát lại cả workflow. Nhóm sẽ giải thích giới hạn của playback nếu không có assertions.
- **Data-driven:** P2 chạy Collection với CSV/JSON; K2 dùng `Scenario Outline`/`Examples` cho nhiều input.
- **Checkpoints:** P2 và K2 kiểm tra status, cấu trúc, field, kiểu dữ liệu hoặc điều kiện nghiệp vụ; mỗi phần có ít nhất một ví dụ assertion fail để cho thấy cách đọc kết quả.
- **Tự động hóa/bán tự động:** Newman và Karate chạy test qua command line; Pact tự động tạo/verify contract sau khi cấu hình; nhóm chuẩn bị dữ liệu và review kết quả. Phần nào còn cần thao tác thủ công sẽ được nêu rõ trong clip.

### Bằng chứng và giới hạn cần báo cáo

Với mỗi clip, nhóm lưu phiên bản công cụ, điều kiện chạy, dữ liệu đầu vào an toàn, source/Collection/contract/feature liên quan, command, log/report và ghi chú về lỗi đã tái hiện. Nêu rõ trường hợp test pass nhưng vẫn có thể bỏ sót lỗi, phụ thuộc dữ liệu hoặc trạng thái, assertion quá lỏng, contract chỉ bao phủ interaction đã khai báo, và rủi ro AI sinh expected/test chưa chính xác. Tất cả kết quả trong slide sẽ được cập nhật từ lần chạy thật của nhóm.

---

## 🤖 Demo áp dụng AI — Skill và Human-in-the-loop

Nhóm dự kiến dùng một AI Agent có sẵn cùng Skill chuyên biệt để hỗ trợ thiết kế và tạo Karate API tests. Mục tiêu demo là đánh giá quy trình có thể tái sử dụng, không chỉ trình chiếu code do AI sinh.

1. Chuẩn bị `SKILL.md` quy định nguồn input được phép đọc, cách lập test matrix có traceability, quy tắc không tự suy diễn expected, thư mục output và yêu cầu review.
2. Cung cấp yêu cầu cùng đặc tả đã được nhóm kiểm tra; yêu cầu Agent lập test matrix cho operation thứ nhất trước, chưa ghi file/chạy lệnh.
3. Thành viên review assumptions, test data và expected; sau khi duyệt mới yêu cầu Agent tạo Karate feature trong thư mục chỉ định.
4. Thành viên review diff và lệnh chạy; chạy test trên EShop; đối chiếu output của Agent với response thực tế, ghi nhận đúng/sai/thiếu và chỉnh sửa.
5. Dùng lại cùng Skill cho operation thứ hai, lưu đầu vào và kết quả để đánh giá mức độ tái sử dụng.

Đặc tả API hiện có là `api_specification.md` dạng Markdown, không phải OpenAPI YAML/JSON. Nếu demo yêu cầu OpenAPI, nhóm sẽ chuyển đổi, đối chiếu với API và lưu bản đã review; không mô tả Markdown hiện tại là OpenAPI. Bằng chứng dự kiến gồm Skill, test matrix, feature được sinh, diff review, command, report và log tác vụ đã loại bỏ thông tin nhạy cảm. Đây là kế hoạch; chỉ báo cáo khả năng và kết quả AI sau khi nhóm thực hiện và kiểm chứng.

---

## ❓ Câu hỏi & Thảo luận với Giảng Viên

1. Nhóm chọn 3 công cụ (Postman, Pact, Karate) để trình bày và demo, khối lượng này có bị quá tải trong thời lượng cho phép của seminar không?
2. Việc giả lập Client - Server trên cùng 1 máy (localhost) để mô phỏng Contract Testing có đạt yêu cầu đánh giá của bài tập?
3. Ở phần AI, thay vì chat thông thường, nhóm viết các "Skill" chuyên biệt để ép Agent tuân thủ quy trình sinh script tự động. Hướng tiếp cận này đã đáp ứng đủ kỳ vọng nâng cao của môn học chưa?
