# Kịch bản demo — API & Contract Testing với EShop

> **Mục đích tài liệu:** chốt trước với giảng viên phạm vi nhóm sẽ tìm hiểu, thực hành và quay video; đồng thời là hướng dẫn để một thành viên khác có thể dựng lại demo. Đây là kế hoạch dự kiến. Những phiên bản, lệnh, kết quả thực tế và ảnh/video sẽ được cập nhật sau khi nhóm chạy thử.
>
> **Trạng thái:** bản kế hoạch chi tiết để xin góp ý. Thay các mục `[CẬP NHẬT SAU KHI CHỐT]` bằng thông tin thật trước khi nộp chính thức.

## 1. Mục tiêu, phạm vi và nguyên tắc

Seminar hướng dẫn người học kiểm thử API của EShop và nhận biết rủi ro tương thích giữa một API Provider với các Consumer. Demo phải cho thấy đầy đủ quá trình chuẩn bị, viết/cấu hình test, chạy test, đọc kết quả, xử lý lỗi và giới hạn của công cụ; không chỉ chiếu kết quả cuối cùng.

### 1.1 Phạm vi dự kiến

| Thành phần | Vai trò trong demo | Phần sẽ thực hành |
|---|---|---|
| Postman | Công cụ chính cho API testing | Collection, environment, request, script/assertion, data-driven runner, export/import |
| Newman | Chạy Collection từ command line | Chạy lặp lại, exit code, báo cáo HTML/CLI; đưa test vào bước tự động hóa |
| Pact JS | Công cụ chính cho consumer-driven contract testing | Consumer test, Pact file, Provider verification, breaking change |
| Pact Broker/PactFlow | Chia sẻ contract và xem tương thích, nếu cấu hình khả thi | Publish/version, ma trận tương thích, `can-i-deploy` ở mức minh họa |
| AI Agent platform đã chọn | Hướng AI bắt buộc | Nạp Skill, đọc spec/requirement, tạo test matrix và Karate feature, chạy test qua công cụ, tổng hợp report |
| Karate | Công cụ API testing thứ ba | Java/Maven, feature Gherkin, assertions, data-driven testing, workflow EShop và report |

**Phạm vi đã chốt:** Postman/Newman, Karate và Pact là ba công cụ testing được thực hành; AI là hướng áp dụng bắt buộc và trình bày riêng. Newman là runner bổ trợ của Postman: P1–P3 bao phủ workflow Postman, P3 tập trung CLI/automation. Mỗi công cụ chính có ba kịch bản: cài đặt, cơ bản và luồng phức tạp.

### 1.2 Nguyên tắc xây dựng demo

- Chọn ít endpoint nhưng giải thích và kiểm thử đủ sâu; ưu tiên `GET /api/products`, `GET /api/products/:id`, `POST /api/login`, `GET /api/cart`, `POST /api/checkout`.
- Mỗi kết luận trong video dựa trên kết quả nhóm tự chạy trên EShop. Phân biệt hành vi hiện tại của SUT với hành vi mong muốn theo đặc tả.
- Test có thể chạy lại từ trạng thái đã mô tả. Ghi rõ dữ liệu, biến môi trường, điều kiện database và lệnh chạy.
- Bản ghi hình có thuyết minh, con trỏ/terminal dễ đọc, nền sáng, chữ tối; không để lộ mật khẩu, token, secret, thông tin cá nhân hoặc API key.
- Dùng test data riêng. Các thao tác ghi/xóa dữ liệu chạy trên database demo; nêu bước cleanup hoặc khôi phục trạng thái.
- AI chỉ đề xuất nội dung. Thành viên review, sửa, chạy và ghi lại đúng/sai/thiếu trước khi đưa kết quả vào bài.

## 2. Bối cảnh EShop và luồng demo

Backend Node/Express cung cấp API cho frontend và các ứng dụng tiêu thụ giả lập. Trong demo, một Consumer Mobile được mô phỏng bằng client JS nhỏ gọi API lấy thông tin sản phẩm. Đây là mô hình minh họa quan hệ Consumer–Provider, không khẳng định project hiện có một ứng dụng Mobile hoàn chỉnh.


### 2.1 Endpoint dự kiến và lưu ý từ mã nguồn hiện tại

| Endpoint | Dùng cho | Quan sát cần xác nhận khi chạy |
|---|---|---|
| `GET /api/products` | Request đầu tiên, response/list assertion | Đặc tả kỳ vọng danh sách; kiểm tra response thực tế và dữ liệu DB trước khi ghi cứng expected values |
| `GET /api/products/:id` | Schema/checkpoint và Pact | Mã nguồn hiện trả `{}` với HTTP 200 khi không tìm thấy sản phẩm; một số product ID chẵn có `price` chuyển thành chuỗi. Dùng như ví dụ lỗi/độ không nhất quán nếu tái hiện được; không mô tả đó là hành vi đúng |
| `POST /api/login` | Data-driven test và token chaining | Tạo hoặc xác nhận trước user test; thành công trả token, lỗi thông tin xác thực dự kiến trả 401 |
| `GET /api/cart` | Xác thực bearer token | Cần token hợp lệ; request thiếu token giúp demo checkpoint lỗi 401 |
| `POST /api/cart`, `POST /api/checkout` | Luồng nghiệp vụ nhiều bước | Kiểm tra route, body, dữ liệu và tác động DB trước khi chốt expected result; dùng database demo |

Đặc tả hiện có là `api_specification.md` dạng Markdown, không phải OpenAPI YAML/JSON. Vì vậy, không ghi “import Markdown vào Postman” như một bước chắc chắn. Nhóm sẽ hoặc tạo OpenAPI YAML/JSON từ đặc tả rồi review thủ công, hoặc tạo Collection trực tiếp. Nếu trình bày sinh test từ OpenAPI thì phải lưu spec đó và chỉ rõ nó do nhóm chuyển đổi, đã đối chiếu với API nào.

## 3. Ma trận đáp ứng yêu cầu seminar

| Yêu cầu | Vị trí trong tài liệu/video | Bằng chứng dự kiến |
|---|---|---|
| Tìm hiểu 2–3 công cụ | Mục 4 (Postman/Newman), mục 5 (Pact), mục 7 (Karate); mục 6 là hướng AI riêng | Báo cáo, hướng dẫn, source và video theo công cụ |
| Mỗi công cụ có lý thuyết, thuật ngữ, chức năng, nguyên lý | Mở đầu mỗi mục công cụ và lời dẫn từng clip | Slide/báo cáo và glossary |
| Mỗi công cụ có ít nhất 3 kịch bản: cài đặt, cơ bản, phức tạp | Postman/Newman: P1–P3; Pact: C1–C3; Karate: K1–K3 | Clip/chapter riêng |
| Record/playback, data-driven, checkpoints | P2 (Postman) và K2 (Karate: Scenario Outline/Examples, assertions) | Collection, data file, feature file, assertions, report |
| Mức tự động/semi-automated | P2–P3, C2–C3, AI1 (Agent áp dụng Skill, tạo/chạy Karate test sau human review) | Lệnh, test code, log, report và Agent trace |
| AI có demo cụ thể, tổng quát hóa/tái sử dụng | AI1: dùng lại Skill trên operation hai; Agent tạo/chạy test; con người review | SKILL.md, task log, matrix, generated feature, report và review |
| Điểm yếu/failure modes | Cuối từng clip/công cụ | Bảng failure modes, ví dụ pass sai/flaky/coverage thiếu |
| Video do nhóm tự trải nghiệm | Tất cả clip | Ngày chạy, commit/hash, người thực hiện, raw log |

> **Cách đếm công cụ:** Postman/Newman là một workflow (Postman tạo/chạy Collection; Newman thực thi Collection trong CLI). Karate và Pact là hai công cụ chính còn lại. Nếu thầy tính Newman độc lập, xác nhận P3 có đủ là demo automation hay cần ba kịch bản riêng.

## 4. Postman và Newman — phạm vi tìm hiểu, nội dung và clip

### 4.1 Phạm vi tìm hiểu Postman

Nhóm sẽ tìm hiểu và trình bày đủ các nội dung sau, với mức sâu là người học có thể tự tạo, chạy và sửa một bộ API test cơ bản cho EShop:

1. **Khái niệm và vị trí sử dụng:** API request/response; Collection; folder; request method, URL, params, headers, body; response status/header/body; khác biệt giữa gửi request thủ công và kiểm thử có assertion.
2. **Workspace và cấu hình:** tạo/mở collection; environment; collection/environment/local variables; `{{baseUrl}}`; secret/token không ghi cố định vào repo; export/import file.
3. **HTTP và nội dung API cần cho demo:** method, status code, JSON, query/path parameter, bearer token; cách đọc lỗi và phân biệt lỗi HTTP với assertion fail.
4. **Viết kiểm thử:** pre-request script khi cần; tab Scripts/Tests theo phiên bản Postman; `pm.test`, kiểm tra status, JSON field, kiểu dữ liệu, giá trị, header; kiểm tra schema nếu dùng; assertion đủ chặt và tránh kiểm tra quá lỏng.
5. **Tổ chức test:** thứ tự request; data dependency; token chaining; test độc lập/lặp lại; dữ liệu test và cleanup.
6. **Record/playback:** tạo/lưu request và collection, chạy lại request/collection bằng Collection Runner; giải thích đây là lưu và phát lại request, không phải bằng chứng bao phủ mọi hành vi.
7. **Data-driven:** Runner với CSV/JSON; xác định cột/biến, số lần chạy, dữ liệu hợp lệ/không hợp lệ/biên; xem kết quả từng iteration.
8. **Checkpoints:** status, body, schema, business invariant đơn giản; có ca phải fail; đọc chi tiết assertion fail.
9. **Tự động hóa với Newman:** cài local/dev dependency hoặc cách đã chốt; chạy exported collection và environment/data; exit code; reporter; dùng trong CI ở mức minh họa.
10. **Import/generate và OpenAPI:** nếu dùng thì chỉ import OpenAPI YAML/JSON tương thích; mô tả kiểm tra spec và chỉnh collection sinh ra. Không coi `api_specification.md` là OpenAPI.
11. **Chia sẻ và quản lý phiên bản:** collection/environment an toàn, xuất file JSON vào Git; loại bỏ token/secret; review diff để tránh phụ thuộc cloud workspace.
12. **Đánh giá, giới hạn, failure modes:** status 200 nhưng body sai; dữ liệu/state không sạch; token cũ; test script assertion sai/lỏng; schema thủ công lỗi thời; chạy độc lập pass nhưng chạy cả collection fail do thứ tự; Postman schema validation không tương đương Pact CDCT.

### 4.2 Clip P1 — Cài đặt, cấu hình và request đầu tiên

**Thời lượng dự kiến:** 5–7 phút. **Mục tiêu:** người xem tự dựng được Postman và gửi request đến EShop.

**Chuẩn bị:** backend chạy; Postman cài sẵn hoặc ghi rõ trang tải và phiên bản; có `baseUrl` local; chưa cần tài khoản đăng nhập.

| Thứ tự | Thao tác hiển thị | Lời giải thích | Kết quả mong đợi / bằng chứng |
|---|---|---|---|
| 1 | Giới thiệu SUT, base URL và mục tiêu clip | Postman là API client có thể tổ chức request thành Collection và thêm test script | Người xem biết API đang được kiểm thử |
| 2 | Mở Postman, tạo workspace/collection `EShop API Demo` | Nêu collection/folder/request; lưu trữ để chạy lại | Collection xuất hiện trong sidebar |
| 3 | Tạo environment `EShop Local`, đặt `baseUrl=http://localhost:3000` | Giải thích biến giúp đổi môi trường mà không sửa từng URL | Request dùng `{{baseUrl}}` |
| 4 | Tạo `GET {{baseUrl}}/api/products`, gửi request | Chỉ ra method, URL, response status, headers, body | Backend trả response; ghi đúng status/body thực tế đã quan sát |
| 5 | Lưu request vào Collection, gửi lại | Đây là thao tác lưu và phát lại request | Lần chạy sau tái hiện được request |
| 6 | Export Collection/environment mẫu nếu tiện | Chia sẻ artifact; kiểm tra file không có token/secret | File export lưu trong thư mục demo |

**Cách kết thúc:** nêu rằng nhìn thấy 200 chưa đủ để kết luận response đúng; clip kế tiếp sẽ thêm assertion và dữ liệu.

**Failure mode được nói đến:** server chưa chạy/nhầm port; environment chưa chọn; collection chỉ kiểm tra được việc gửi request chứ chưa tự xác nhận body.

### 4.3 Clip P2 — Collection Runner, token chaining, data-driven và checkpoints

**Thời lượng dự kiến:** 8–12 phút. **Mục tiêu:** minh họa thao tác cơ bản và test tự động lặp lại.

**Chuẩn bị:** user test được tạo sẵn; file CSV/JSON với dữ liệu test đã xác nhận; collection có login và một request xác thực. Để không khóa user do nhầm mật khẩu, dữ liệu login sai dùng số lần chạy hạn chế hoặc user riêng.

| Thứ tự | Thao tác hiển thị | Nội dung cần giải thích | Expected result |
|---|---|---|---|
| 1 | Mở `POST /api/login`, gửi credentials test | Request body JSON; response thành công; token là dữ liệu dùng cho request kế tiếp | Nhận token dạng string (xác minh theo response thật) |
| 2 | Thêm script lưu token vào collection/environment variable | Chỉ lưu sau login thành công; không hardcode token | Variable `token` được tạo/cập nhật |
| 3 | Thêm `GET /api/cart` với `Authorization: Bearer {{token}}` | Chained request; cần nêu thứ tự và dữ liệu phụ thuộc | Với token hợp lệ response đạt status/shape đã kiểm tra |
| 4 | Thêm ca gọi `/api/cart` không có token hoặc token không hợp lệ | Negativo auth; không chỉ kiểm tra status mà xác nhận response không trả dữ liệu bảo vệ | Kết quả theo backend hiện tại, dự kiến 401 cho thiếu token và 403 cho token sai |
| 5 | Tạo data file cho test input phù hợp, ví dụ login: tài khoản hợp lệ và tài khoản sai trên user test riêng | Data-driven là chạy cùng test với nhiều input; không biến data file thành nhiều test copy-paste | Runner thể hiện từng iteration và pass/fail rõ |
| 6 | Thêm checkpoints cho `GET /api/products` hoặc sản phẩm đã xác nhận tồn tại | Check status, response là array/object, trường cần thiết và kiểu dữ liệu; chọn assertion đúng với dữ liệu thật | Test fail nếu field/kiểu dữ liệu lệch contract đã khai báo |
| 7 | Chạy Collection Runner, xem iteration, assertions, lỗi | Record/playback ở cấp collection; data-driven; checkpoint | Lưu ảnh/log kết quả tổng và một test fail được chủ động tái hiện |

**Test script minh họa** (điều chỉnh tên field/kiểu theo response thực tế và phiên bản Postman):

```javascript
pm.test("HTTP status is successful", () => {
  pm.response.to.have.status(200);
});

const body = pm.response.json();
pm.test("Response has product fields consumed by this test", () => {
  pm.expect(body).to.have.property("id");
  pm.expect(body).to.have.property("name");
  pm.expect(body).to.have.property("price");
});
```

Đây chỉ là khung. Nếu endpoint trả danh sách thì lặp qua item; nếu kiểm tra chi tiết sản phẩm, chọn ID đã xác minh. Có thể thêm assertion schema nếu nhóm đã kiểm tra cú pháp/runtime hiện hành.

**Minh họa một lỗi có chủ đích:** đổi tên assertion thành field không tồn tại, hoặc gửi request với token bỏ trống; giải thích assertion fail là tín hiệu hữu ích. Khôi phục test sau khi ghi hình.

**Failure modes:** test lấy `200` làm tiêu chí duy nhất; token stale do chạy riêng request; thứ tự chạy phụ thuộc state; CSV có biến sai tên; assertion kiểm tra field nhưng bỏ qua type/nullability; test data gây tác động tồn tại sau lần chạy.

### 4.4 Clip P3 — Newman chạy tự động và kiểm tra breaking/schema mismatch

**Thời lượng dự kiến:** 7–10 phút. **Mục tiêu:** chạy collection không cần thao tác GUI từng request và đọc báo cáo.

**Chuẩn bị:** Collection/environment đã export; Newman cài trong môi trường demo theo cách nhóm xác nhận; backend đang chạy; có report output path. Không cài mới dependency trong lúc quay nếu không cần kết nối mạng.

| Thứ tự | Thao tác hiển thị | Expected result / điểm giải thích |
|---|---|---|
| 1 | Mở terminal tại thư mục demo và chỉ ra file Collection/environment | Người xem thấy đầu vào đã version-control |
| 2 | Chạy Newman với collection, environment và reporter nhóm đã cài | Các request được thực thi theo thứ tự; log nêu request/assertion |
| 3 | Mở report HTML/CLI | Tổng số request/test pass/fail; giải thích exit code để CI dùng được |
| 4 | Tạo mismatch có kiểm soát trong assertion hoặc test fixture (không sửa production backend trong đoạn này nếu không cần) | Một assertion fail sẽ tạo report đỏ/non-zero; nói rõ đây là schema/API check, không phải Pact |
| 5 | Khôi phục fixture/test, chạy lại | Report xanh xác nhận có thể lặp lại |

**Lệnh dự kiến:** điền sau khi nhóm chốt đường dẫn và reporter đã cài, ví dụ `npx newman run <collection.json> -e <environment.json> -r cli,htmlextra`. Không cam kết tên reporter nếu chưa cài và chạy thử.

**Minh chứng:** collection JSON đã loại secret; file environment mẫu; output command; report HTML; ảnh exit code pass/fail. Newman không kiểm tra tốt hơn các assertion mà nhóm đã viết; test yếu vẫn có thể pass trong CI.

## 5. Pact JS — phạm vi tìm hiểu, nội dung và clip

### 5.1 Phạm vi tìm hiểu Pact

1. **Mục tiêu và vị trí:** kiểm tra tương thích của một tương tác Consumer–Provider; bổ sung cho unit/API/schema/integration test theo mục tiêu, không thay toàn bộ các loại test.
2. **Thuật ngữ:** Consumer, Provider, interaction, provider state, mock server, Pact/contract file, verification, Broker, version/tag/environment và deployment matrix.
3. **Nguyên lý consumer-driven:** Consumer mô tả request và response mà nó cần; test chạy với mock server Pact; framework tạo Pact JSON; Provider verification phát lại interaction vào provider thật và so response với contract.
4. **Consumer test có ý nghĩa:** test phải gọi lớp client/service mà ứng dụng sử dụng, không chỉ tự viết một request giả để tạo Pact; assertion ứng dụng cần dùng response đúng cách.
5. **Matchers và contract scope:** giá trị ví dụ so với matcher; field bắt buộc/kiểu dữ liệu; tránh contract quá rộng (khóa Provider) hoặc quá lỏng (không bảo vệ Consumer).
6. **Provider verification:** `providerBaseUrl`, `pactUrls` hoặc Broker, request filter nếu có, provider state setup/teardown, kết quả từng interaction.
7. **Dữ liệu/state:** cách tạo sản phẩm cần thiết; trạng thái không được giả định tồn tại; tính idempotent; cleanup và database riêng.
8. **Breaking/compatible changes:** đổi/xóa field Consumer dùng; thêm field không dùng; thay đổi kiểu dữ liệu; verifier cho biết phạm vi vi phạm.
9. **Broker/CI:** publish/version pacts, xem tương thích nhiều Consumer/Provider, `can-i-deploy`; chỉ demo khi account/credential đã hoạt động, tuyệt đối không quay token.
10. **Failure modes/giới hạn:** Pact chỉ bảo vệ các interaction được mô tả; state handler tạo state sai; Consumer test không gọi code client thật; contract quá lỏng/rộng; Provider verification không chạy trên đúng version/deployment; database dùng chung gây flaky.

### 5.2 Luồng tương tác được chọn

Consumer giả lập: `EShopMobile`. Provider: `EShopBackend`. Interaction đầu tiên dự kiến là `GET /api/products/:id`, vì có response nhỏ, dễ giải thích việc client phụ thuộc vào `id`, `name`, `price`.

Trước khi viết contract, nhóm phải chạy endpoint với một ID cụ thể và ghi response. Backend hiện có nhánh response khác kiểu cho ID chẵn và trả object rỗng nhưng status 200 khi không tìm thấy ID. Nhóm sẽ chọn ID/interaction ổn định, rồi quyết định demo hành vi hiện tại như một lỗi SUT hay chuẩn hóa test fixture; không được viết sample field/type rồi coi như response đã xác nhận.

Nếu Provider verification qua HTTP không thể seed SQLite ổn định, giảm scope xuống một interaction đọc dữ liệu có sẵn và tạo state handler rõ ràng. Nếu cần route khác, chốt sau khi chạy thử và cập nhật tài liệu.

### 5.3 Clip C1 — Cài đặt Pact JS và hiểu cấu trúc Consumer/Provider

**Thời lượng dự kiến:** 6–8 phút. **Mục tiêu:** người xem biết project test Pact gồm những gì và chạy được một test khung.

| Thứ tự | Thao tác hiển thị | Nội dung cần giải thích | Expected result |
|---|---|---|---|
| 1 | Trình bày sơ đồ EShopMobile (Consumer) → HTTP API → EShopBackend (Provider) | Ai định nghĩa nhu cầu, ai verify | Người xem phân biệt hai vai trò |
| 2 | Mở thư mục demo, `package.json`, test runner và cấu hình Pact | Runtime, dependency và nơi lưu generated Pact | Cấu hình khớp phiên bản package đã cài |
| 3 | Mở Consumer client/service tối thiểu được dùng trong test | Vì sao gọi API qua client code mô phỏng app | Thấy đường đi từ consumer code tới mock server |
| 4 | Chạy test khung đầu tiên | Pact tạo mock server/test output; lỗi setup sẽ được đọc | Test runner khởi chạy thành công |
| 5 | Mở file Pact sinh ra | Consumer, Provider, request/response interaction, metadata | File có interaction tương ứng |

**Bằng chứng:** dependency lockfile, test code, Pact JSON mẫu, log chạy. Không đưa `node_modules` vào tài liệu; hướng dẫn cài đặt bằng lệnh tái lập.

**Failure modes:** Node/native dependency chưa phù hợp; test không gọi client code thật; Pact JSON cũ còn sót khiến người xem nhầm kết quả mới; mock server port/cleanup.

### 5.4 Clip C2 — Consumer test sinh contract và Provider verification thành công

**Thời lượng dự kiến:** 8–12 phút. **Mục tiêu:** đi hết vòng Consumer tạo contract → Provider kiểm tra contract.

| Thứ tự | Thao tác hiển thị | Nội dung cần giải thích | Expected result |
|---|---|---|---|
| 1 | Mở Consumer test và nêu interaction: request `GET /api/products/<id>`; response có field mà mobile dùng | Contract là nhu cầu đã kiểm thử của consumer, không phải toàn bộ DB/API | Scope tối thiểu của interaction rõ ràng |
| 2 | Khai báo provider state: sản phẩm id xác định tồn tại | State handler chuẩn bị precondition, không dựa vào database tùy tiện | Data fixture sẵn sàng |
| 3 | Gọi service/client mobile bằng base URL mock server của Pact | Test nên exercise code client thật | Consumer test pass và sinh Pact JSON mới |
| 4 | Đọc Pact JSON: method/path/status/headers/body/matcher | JSON này là artifact chia sẻ để verify | Các field đúng với assertion và response đã chọn |
| 5 | Khởi động backend EShop trên DB demo và chạy Provider verifier | Verifier phát lại request vào provider thật; state handler cần thực hiện setup | Verification pass nếu Provider đáp ứng interaction |
| 6 | Mở verifier output, chỉ interaction nào đã pass | Một contract pass chỉ bảo đảm interaction được mô tả | Có log/report lưu làm minh chứng |

**Lệnh dự kiến:** điền sau khi thống nhất scripts trong `package.json`, ví dụ `npm run pact:consumer` và `npm run pact:provider`. Nêu rõ thư mục chạy lệnh.

**Minh chứng:** source Consumer, state handler, Pact JSON được tạo ở lần chạy này, output Consumer và Provider. Hash/commit của source được ghi vào manifest demo.

### 5.5 Clip C3 — Phát hiện breaking change và (tùy chọn) Broker/deployment check

**Thời lượng dự kiến:** 8–12 phút. **Mục tiêu:** chứng minh một thay đổi tương thích bị phát hiện, và giải thích vai trò của Broker.

| Thứ tự | Thao tác hiển thị | Nội dung cần giải thích | Expected result |
|---|---|---|---|
| 1 | Chạy trạng thái baseline: consumer contract và Provider verification pass | Có kết quả xanh trước thay đổi | Lưu log baseline |
| 2 | Áp dụng một diff có chủ đích, ví dụ đổi response key `price` thành `unit_price` trong nhánh demo/fixture | Chỉ thay đổi field mà Consumer thực sự cần; nêu rõ phạm vi và cách hoàn nguyên | Diff nhỏ, có thể revert |
| 3 | Chạy Provider verification lại với cùng contract và state | Provider hiện tại bị so với nhu cầu Consumer đã publish/sinh | Verification fail tại body field/interaction liên quan |
| 4 | Đọc lỗi và liên hệ với tác động ứng dụng | Không chỉ báo đỏ; chỉ ra client phụ thuộc `price` sẽ không tìm thấy field | Người xem hiểu lý do fail |
| 5 | Hoàn nguyên thay đổi và chạy lại | Xác nhận test hỏng do breaking change vừa tiêm | Baseline pass lại |
| 6 (tùy chọn) | Publish Pact vào Broker/PactFlow, xem matrix và `can-i-deploy` | Broker quản lý phiên bản/quan hệ giữa Consumer và Provider; lệnh deployment check chỉ có ý nghĩa theo metadata/version/environment | Clip hiển thị trạng thái tương thích hoặc dùng recording dự phòng nếu dịch vụ mạng không ổn |

**An toàn thao tác:** diff chỉ trên branch demo; ghi hash trước/sau; không sửa trực tiếp database production (không có production trong demo); revert ngay sau clip. Nếu muốn sửa backend thật trong live demo, làm ở worktree/branch riêng và có lệnh hoàn nguyên đã thử.

**Failure modes:** thay đổi sai path không làm test fail; test không kiểm tra field; Pact file cũ; provider state không seed đúng sản phẩm; verifier gọi nhầm server/port; contract có thể pass nhưng business rule không được test.

## 6. AI trong API/Contract Testing — Skill và Agent

Phần này trình bày AI như một workflow kiểm thử tái sử dụng, không chỉ là prompt sinh test. **Skill** chứa quy trình và tiêu chí chất lượng dùng lại được; **Agent** nhận nhiệm vụ, đọc đầu vào, áp dụng Skill, gọi công cụ tạo/chạy test và tổng hợp kết quả. Nhóm review output và chịu trách nhiệm với test được đưa vào báo cáo.

### 6.1 Phạm vi tìm hiểu

#### Skill dự kiến: api-test-design

Tạo Skill ở artifacts/demo/ai/skills/api-test-design/SKILL.md. Đây là bộ chỉ dẫn ổn định được Agent nạp khi làm nhiệm vụ kiểm thử API, không phải prompt dùng một lần. Nhóm phải đăng ký/nạp Skill theo đúng cơ chế của Agent platform đã chọn và cho thấy Agent thực sự dùng Skill trong lần chạy; chỉ mở hoặc đính kèm file SKILL.md chưa đủ chứng minh Skill được áp dụng. Skill cần yêu cầu Agent:

1. Đọc OpenAPI đã review và yêu cầu nghiệp vụ; xác định operation, inputs, response, preconditions và nguồn của expected result.
2. Không tự bịa endpoint, status, schema, dữ liệu hoặc business rule. Nếu spec và backend khác nhau, ghi discrepancy và đánh dấu cần review.
3. Đề xuất test matrix gồm positive, negative và boundary cases; mỗi ca ghi requirement/operation, input, expected status/body/assertion, data setup và assumptions.
4. Chọn assertion cụ thể cho field, type, structure và business invariant; tránh chỉ kiểm tra status hoặc match quá lỏng.
5. Sinh Karate feature theo project/version được chỉ định; theo naming convention; tách scenario có side effect.
6. Nêu test không chạy được do thiếu state/data thay vì tự giả định để làm test pass.
7. Không ghi credentials, token, API key hoặc dữ liệu cá nhân vào source, output hay log.
8. Không sửa backend. Chỉ tạo/đề xuất test trong output folder được chỉ định.
9. Trước khi chạy, trình bày file/lệnh để thành viên review; sau khi chạy, đọc report và tóm tắt kết quả, không tự đổi expected để biến fail thành pass.

#### Agent và phạm vi quyền

Ghi rõ Agent platform/runtime và phiên bản trong artifacts. Agent điều phối workflow và dùng Skill trên. Trong demo, Agent được phép đọc OpenAPI/requirement/fixture đã chỉ định; tạo test matrix, Karate feature và summary trong artifacts/demo/ai/generated; đề xuất lệnh chạy; sau khi người demo duyệt test và lệnh, chạy Karate rồi đọc report.

Agent không sửa backend, database schema, OpenAPI gốc hoặc expected result đã duyệt. Thành viên xem diff trước khi giữ file sinh ra. Đây là workflow bán tự động có human-in-the-loop.

#### Đầu vào và độ tin cậy

api_specification.md hiện là Markdown, không phải OpenAPI. Nếu chọn sinh test từ OpenAPI, nhóm tạo eshop.openapi.yaml, đối chiếu với route/backend và review trước khi giao Agent. Có thể bổ sung yêu cầu nghiệp vụ đã xác nhận; không để Agent tự xem implementation hiện tại là đặc tả đúng.

Dùng một operation để tạo test chính, sau đó dùng lại cùng Skill trên operation thứ hai để kiểm tra tính tái sử dụng. Chọn operation thứ hai có data ổn định và side effect kiểm soát được. Lưu nguồn expected result để tách lỗi Agent khỏi discrepancy của SUT.

### 6.2 Clip AI1 — Agent dùng Skill sinh, chạy và đánh giá Karate tests

**Thời lượng dự kiến:** 10–15 phút. **Mục tiêu:** thể hiện Skill được tái sử dụng, Agent dùng công cụ để làm test và nhóm xác minh kết quả trên EShop.

**Chuẩn bị:** Skill file; OpenAPI/requirement đã review; project Karate và backend chạy được; output folder riêng; fixture không chứa dữ liệu thật. Chuẩn bị operation chính và operation thứ hai để thử tính tái sử dụng.

| Bước | Thao tác hiển thị | Nội dung giải thích | Kết quả/bằng chứng |
|---|---|---|---|
| 1 | Giới thiệu task, input spec và operation | Nêu nguồn yêu cầu và hành vi backend quan sát được | Input có nguồn/phạm vi |
| 2 | Mở SKILL.md, chỉ quy tắc test matrix, trace expected, format Karate và giới hạn quyền | Skill là hướng dẫn tái sử dụng, không phải prompt một lần | Skill file được lưu |
| 3 | Giao task cho Agent, chỉ ra Skill được nạp/áp dụng | Agent điều phối đọc, phân tích, tạo test và dùng công cụ | Lưu task/invocation log |
| 4 | Agent phân tích input và đề xuất test matrix trước khi tạo code | Human checkpoint: review operation, expected, assumptions, data | Matrix gồm positive/negative/boundary và traceability |
| 5 | Người demo duyệt matrix; Agent tạo Karate feature trong output folder | Agent chỉ viết test, không sửa backend/spec | Generated feature và diff |
| 6 | Review test/lệnh; người demo xác nhận trước khi Agent chạy | Thể hiện human-in-the-loop | Lưu review/approval |
| 7 | Agent chạy Karate; mở console/report | Test trên SUT; output AI không thay thế test run | Lệnh, report, pass/fail |
| 8 | Đối chiếu với spec/backend; phân loại output đúng, cần sửa, sai, không chạy được hoặc bỏ sót | Đánh giá chất lượng thay vì chỉ xem code | Review matrix có lý do |
| 9 | Giao operation thứ hai và dùng lại Skill, không viết lại chỉ dẫn | Kiểm tra tính tái sử dụng/tổng quát hóa | Lưu output lần hai |
| 10 | Kết luận phần Agent làm được và phần reviewer phải quyết định | AI hỗ trợ, nhóm vẫn chịu trách nhiệm | Nêu limitation/evidence |

Task mẫu cho Agent (thay tên file/operation trước khi quay):

    Use the api-test-design Skill.
    Read only the reviewed OpenAPI and requirement files listed for this task.
    First return a traceable test matrix; do not write files or run commands yet.
    After human review, generate Karate features only under the approved output folder.
    Do not modify backend code, source specification, or expected results.
    Show the exact test command and wait for approval before running it.
    After execution, summarize each case, its result, and report location.
    Repeat the analysis for a second operation using the same Skill.

**Deliverables:** test matrix; Karate feature do Agent sinh; review diff; command; Karate report; bảng đánh giá output; Agent task/execution log; minh chứng dùng lại Skill trên operation thứ hai. Không quay token, secret hoặc dữ liệu cá nhân.

**Failure modes:**

- Skill thiếu quy tắc/lỗi thời làm Agent lặp lại lỗi có hệ thống.
- Agent đọc nhầm spec/implementation, suy diễn expected hoặc bỏ assumptions.
- Agent sinh Karate syntax sai version hoặc assertion quá lỏng.
- Agent ghi file ngoài output folder, chạy lệnh chưa duyệt hoặc đọc nhầm report cũ.
- Test fail do defect/data setup nhưng Agent diễn giải nhầm nguyên nhân.
- Một operation pass không chứng minh Skill tổng quát; cần operation thứ hai và review của nhóm.

## 7. Karate — phạm vi tìm hiểu, nội dung và clip

### 7.1 Mục tiêu và phạm vi

Karate là framework kiểm thử API với cú pháp Gherkin/DSL để mô tả HTTP request, gọi API, kiểm tra response và chạy scenario bằng Java runtime. Nhóm chọn Karate để bổ sung code-based API testing bên cạnh Postman/Newman; Pact đảm nhiệm contract testing.

Người học sau phần này có thể dựng project tối thiểu, cấu hình base URL, viết/chạy feature, kiểm tra response, chạy nhiều bộ dữ liệu, thực hiện workflow EShop có authentication, đọc report và nhận biết giới hạn.

Nhóm sẽ tìm hiểu: 

1.  vị trí Karate trong API testing và vai trò DSL/Java/Maven; 
2. cài đặt, dependency, runner, karate-config.js, feature files, report; 
3. cú pháp Feature/Background/Scenario/Scenario Outline/Examples và Given/When/Then; 
4. HTTP method, path/query, JSON body, headers, bearer token; 
5.  assertions JSON, field/type/array và match chặt/lỏng; 
6. base URL, data-driven, quản lý credentials/token; 
7. chaining nhiều request và test có state; 
8. chạy feature/suite, đọc lỗi/report, CLI/CI; 
9. so sánh với Postman/Newman; 
10. failure modes: assertion lỏng, expected sai, shared state, phụ thuộc thứ tự, runtime không khớp, side effect không cleanup, log lộ token.

Ngoài phạm vi demo: UI/browser, performance/load, toàn bộ endpoint, mọi tính năng Java/Maven và protocol ngoài HTTP REST. Không ghi tính năng chưa thực hành là kết quả của nhóm.

### 7.2 Project và cấu hình

Đặt source riêng để không sửa backend Node:

    artifacts/demo/karate/
      pom.xml
      src/test/java/
        karate-config.js
        eshop/
          products.feature
          auth-cart-checkout.feature
          EshopTest.java
      README.md

README ghi JDK/Maven/Karate version đã dùng, backend startup, test data, lệnh chạy, expected result và report path. Không commit target/, token hay dữ liệu cá nhân. Cấu hình base URL trong karate-config.js hoặc environment variable. Chỉ ghi command/DSL sau khi chạy thử với phiên bản đã chọn.

### 7.3 Clip K1 — Cài đặt và test đầu tiên

**Thời lượng:** 6–8 phút. **Mục tiêu:** người xem dựng project và chạy feature EShop đầu tiên.

**Chuẩn bị:** JDK/Maven version đã chốt; nếu quay offline thì ghi trước bước tải dependency; backend local hoạt động. Trong clip trình bày prerequisite và lệnh khởi tạo/cài dependency thực tế, đồng thời ghi java -version và mvn -version.

| Bước | Thao tác | Giải thích | Kết quả/minh chứng |
|---|---|---|---|
| 1 | Giới thiệu SUT và Karate/Java/Maven | Vai trò DSL, runtime, build tool | Phân biệt thành phần |
| 2 | Tạo hoặc mở project Karate, cài dependency từ pom.xml và chỉ cấu hình/runner | Java/Maven, dependency và version đã pin | Project cài/build được từ hướng dẫn |
| 3 | Mở karate-config.js, chỉ base URL | Tách config khỏi feature | URL trỏ EShop |
| 4 | Mở products.feature, giải thích Feature/Scenario/Background/Given-When-Then | Cấu trúc test | Người xem đọc được |
| 5 | Gọi GET /api/products, assert status và response dạng array | Request/checkpoint | Pass theo response thực tế |
| 6 | Chạy lệnh Maven/runner đã xác minh từ project sạch, để thấy dependency resolution và test execution | Cài đặt có thể tái lập, không chỉ mở source có sẵn | Exit status/report |
| 7 | Mở report và chỉ kết quả | Bằng chứng thực thi | Lưu log/report/commit |

Feature minh họa (cú pháp cần khớp phiên bản):

    Feature: EShop product API
    Background:
      * url baseUrl
    Scenario: List products returns an array
      Given path 'api', 'products'
      When method get
      Then status 200
      And match response == '#[]'

Failure modes: JDK/Maven mismatch; backend/base URL sai; assert array không xác nhận field/type; report cũ bị nhầm với lần chạy hiện tại.

### 7.4 Clip K2 — Assertions và data-driven

**Thời lượng:** 8–12 phút. **Mục tiêu:** kiểm tra response và chạy cùng test với nhiều input.

**Chuẩn bị:** xác nhận product ID tồn tại/không tồn tại và response thật; credentials riêng nếu test login. Backend có login attempts/khóa tài khoản, nên không lặp sai trên user dùng chung.

| Bước | Thao tác | Giải thích | Kết quả mong đợi |
|---|---|---|---|
| 1 | Dùng path parameter cho GET /api/products/:id | Tạo request qua path segments | Request đúng endpoint |
| 2 | Thêm status, field, type và shape assertions | Checkpoint phản ánh requirement | Hợp lệ pass; mismatch fail |
| 3 | Thêm case ID không tồn tại, đối chiếu spec | Backend có thể trả 200 và object rỗng; implementation khác expected behavior | Ghi discrepancy, không ép xanh |
| 4 | Tạo Scenario Outline/Examples cho ID hợp lệ, không hợp lệ, biên | Mỗi row là iteration | Report hiện từng input |
| 5 | Chạy feature và đọc assertion failures | Data-driven/checkpoint | Lỗi cụ thể được chỉ ra |
| 6 | Tạo mismatch có chủ đích rồi khôi phục | Đỏ/xanh tái lập | Lưu log cả hai lần |

Outline là khung; thay placeholder bằng input/expected đã xác minh trước khi quay:

    Scenario Outline: Product lookup follows expected contract
      Given path 'api', 'products', productId
      When method get
      Then status <expectedStatus>
      Examples:
        | productId | expectedStatus |
        | <existingId> | 200 |

Không để placeholder trong clip nộp. Nếu backend lệch spec, ghi test đỏ là discrepancy; không sửa expected để ép xanh. Login data-driven chỉ dùng với user riêng; token chain nằm ở K3.

Failure modes: match lỏng; expected lấy từ implementation thay vì requirement; ID/DB không ổn định; login sai khóa user; seed data ngầm.

### 7.5 Clip K3 — Workflow EShop có authentication

**Thời lượng:** 8–12 phút. **Mục tiêu:** tự động kiểm tra nhiều endpoint và dữ liệu được tạo.

Luồng demo:

    POST /api/login → lấy token
    GET /api/products → chọn product fixture
    POST /api/cart → thêm item bằng bearer token
    GET /api/cart → xác nhận item
    POST /api/checkout → tạo order trong DB demo
    GET /api/orders/my-orders → xác nhận order thuộc user test

Cart lưu in-memory; checkout ghi order vào SQLite. Dùng backend/database demo riêng và ghi reset strategy. Checkout nhận total_amount do client gửi, vì vậy luồng minh họa chaining/auth/state, không chứng minh server tính giá an toàn hoặc đúng nghiệp vụ.

| Bước | Thao tác | Giải thích | Kết quả/minh chứng |
|---|---|---|---|
| 1 | Login bằng user fixture; assert status/token string | User riêng, token không hardcode | Token lấy từ response |
| 2 | Gán token vào biến scenario | Dùng response cho request sau | Không dùng token cũ |
| 3 | GET products, chọn fixture ổn định | Chaining có kiểm soát | Tìm được sản phẩm |
| 4 | POST cart có Authorization và body item | Header auth/JSON body | Item được thêm |
| 5 | GET cart, assert item/quantity | Checkpoint workflow | Item tồn tại |
| 6 | POST checkout với total/address test, lưu orderId | Side effect trong DB demo | Có orderId |
| 7 | GET my-orders cùng token, xác nhận order mới | Qua nhiều endpoint | Order thuộc user |
| 8 | Mở report và nêu cleanup/reset | Tái lập, không để data rác | Report/cleanup note lưu |

Negative branch: scenario độc lập gọi GET cart thiếu Authorization và kiểm tra 401; chỉ thêm token sai/403 sau khi xác minh. Ghi command Maven/runner thực tế sau khi thử. Failure modes: token sai, fixture thiếu, cart mất khi backend restart, mỗi run tạo order, state dùng chung chạy song song, total do client gửi. Dùng user riêng, ghi orderId, reset DB và tránh chạy song song workflow stateful.

### 7.6 So sánh Karate với Postman/Newman

| Tiêu chí | Postman/Newman | Karate |
|---|---|---|
| Author test | GUI và JavaScript | Feature/DSL text |
| Khám phá API | Trực quan | Ít trực quan |
| Quản lý Git | Export Collection | Feature/config dạng text |
| Data-driven | Runner CSV/JSON | Scenario Outline/Examples |
| Automation | Newman CLI | Maven/runner |
| Setup | Nhẹ | Cần Java/Maven |
| Failure mode | Token stale/assertion yếu | Match lỏng/shared state/runtime sai |

Kết luận dựa trên setup time, độ dễ đọc, khả năng tái chạy và lỗi nhóm thực sự gặp; không kết luận công cụ nào tốt hơn trong mọi trường hợp.

## 8. Danh sách clip dự kiến và kế hoạch ghi hình

| Clip | Tên dự kiến | Công cụ | Nội dung chính | Thời lượng |
|---|---|---|---|---:|
| P1 | Postman: setup và request đầu tiên | Postman | Environment, collection, gọi EShop, lưu/phát lại | 5–7 phút |
| P2 | Postman: assertions, auth chain và data-driven | Postman | Chaining, data file, checkpoints, Runner | 8–12 phút |
| P3 | Newman: chạy collection và đọc report | Newman | CLI, automation, pass/fail, failure modes | 7–10 phút |
| C1 | Pact: cài đặt và cấu trúc consumer/provider | Pact JS | Setup, thuật ngữ, test khung, Pact JSON | 6–8 phút |
| C2 | Pact: consumer contract và provider verification | Pact JS | Consumer test, state, sinh contract, verify | 8–12 phút |
| C3 | Pact: breaking change và compatibility | Pact JS, Broker tùy chọn | Tiêm lỗi, verifier fail, revert; Broker nếu sẵn sàng | 8–12 phút |
| AI1 | Agent dùng Skill sinh, chạy và đánh giá Karate tests | Agent + api-test-design Skill + Karate | Skill, matrix, feature, human review, report, tái sử dụng | 10–15 phút |
| K1 | Karate: cài đặt và test đầu tiên | Karate | Java/Maven, cấu trúc, feature, report | 6–8 phút |
| K2 | Karate: assertions và data-driven | Karate | Match, Scenario Outline/Examples, test âm | 8–12 phút |
| K3 | Karate: workflow authentication | Karate | Login, token, cart, checkout, orders, cleanup | 8–12 phút |

Mỗi clip có: tiêu đề, mục tiêu, phiên bản/runtime, file và lệnh, lời dẫn/thuyết minh, thao tác trên màn hình, expected result, điểm cần giải thích, lỗi có chủ đích, kết luận, caption hoặc chapter, thời lượng thực tế và link sau khi upload. Có thể ghép các clip thành video dài, nhưng vẫn ghi chapter riêng để giảng viên dễ đối chiếu.

## 9. Kịch bản chạy thử và quản lý dữ liệu

### 9.1 Checklist trước mỗi lần chạy

- [ ] Đúng commit/branch của demo; ghi commit hash và ngày chạy.
- [ ] Backend chạy đúng base URL/port; xác nhận endpoint bằng một request smoke thủ công.
- [ ] Database là bản demo; test user/product tồn tại; biết cách reset/khôi phục.
- [ ] Collection, environment, Pact file, Karate feature, Skill và Agent input đúng phiên bản; không dùng artifact stale.
- [ ] Token được tạo trong phiên chạy hiện tại; không dán token cũ vào video.
- [ ] Lệnh cài/chạy đã thử trong môi trường sạch hoặc có ghi prerequisite.
- [ ] Test baseline pass; failure injection fail đúng lý do; revert xong baseline pass lại.
- [ ] Report được lưu vào output có ngày/commit; video không quay secret, personal data hay terminal ngoài phạm vi.

### 9.2 Dữ liệu và cleanup

Điền trước khi quay:

| Dữ liệu | Giá trị/nguồn | Setup | Cleanup/reset |
|---|---|---|---|
| Base URL | `http://localhost:3000` theo tài liệu project | Backend local | Dừng process sau demo |
| User test | `[email giả lập]` | `[seed/đăng ký một lần]` | `[reset DB hoặc dùng user chuyên dụng]` |
| Product Pact | `[ID đã xác nhận]` | `[seed state handler]` | `[khôi phục fixture]` |
| CSV/JSON data | `[đường dẫn file]` | Commit vào repo | Không chứa thông tin thật |
| Contract breaking change | Diff trên branch demo | Ghi hash trước/sau | Revert và chạy baseline |

Không sử dụng tài khoản thật, token thật hay dữ liệu khách hàng. Nếu reset database, chỉ reset bản demo và ghi rõ tác động.

## 10. Bộ failure modes cần trình bày

| Công cụ | Tình huống dễ gây hiểu nhầm | Cách demo/giảm rủi ro |
|---|---|---|
| Postman | Chỉ assert HTTP 200 nên body sai vẫn pass | Thêm field/type/body assertion; tạo mismatch có chủ đích |
| Postman | Token cũ, environment sai hoặc thứ tự collection tạo kết quả không lặp lại | Tạo token trong cùng run; xác nhận environment; ghi thứ tự request |
| Postman | Schema thủ công lỗi thời hoặc lỏng | Đối chiếu spec/backend; chỉ ra test vẫn có thể xanh khi schema sai |
| Newman | CLI pass/fail phụ thuộc collection export/version khác GUI | Commit file export; chạy đúng file trong video; lưu lệnh và hash |
| Karate | Match quá lỏng khiến test xanh giả | Rà assertions theo requirement, tạo mismatch và đọc report |
| Karate | Shared state/cart in-memory/order tồn tại gây flaky | User/database demo riêng; không chạy song song workflow phụ thuộc state; reset |
| Karate | JDK/Maven/framework version không tương thích | Pin phiên bản, ghi prerequisite, chạy command từ môi trường sạch |
| Pact | Consumer test không gọi code client thật | Dùng service/client wrapper được Consumer sử dụng |
| Pact | Provider state không seed dữ liệu xác định | State handler/fixture rõ, DB demo riêng, verifier chạy lại được |
| Pact | Contract quá hẹp hoặc quá rộng | Chỉ khai báo field thật sự dùng; thảo luận tradeoff và matcher |
| Pact | Tưởng Pact kiểm tra mọi nghiệp vụ/API | Nói rõ phạm vi là interaction; vẫn cần API/business/security tests |
| Broker/PactFlow | Contract/version/environment publish nhầm làm matrix sai | Ghi version/branch; kiểm tra trước clip; không đưa token vào repo/video |
| AI/Agent | Agent bịa endpoint/expected hoặc bỏ business rule | Skill buộc trace nguồn; review matrix trước khi sinh/chạy |

## 11. Deliverables và bằng chứng cần lưu

```text
artifacts/demo/
  postman/
    EShop.postman_collection.json
    local.postman_environment.example.json
    test-data.csv
  openapi/
    eshop.openapi.yaml                 # nếu nhóm chọn hướng OpenAPI
  karate/
    pom.xml
    src/test/java/
    README.md
  pact/
    consumer-tests/                    # hoặc đường dẫn source thực tế
    pacts/                              # Pact JSON sinh ra
    provider-verification.log
  ai/
    README.md                         # Agent platform/version, cách nạp Skill và tái chạy
    skills/
      api-test-design/
        SKILL.md
    agent/
      task.md
      execution-log.md
    inputs/
      reviewed-requirements.md
    generated/
      test-matrix.md
      karate-feature-files/
    review/
      output-assessment.md
  reports/
    karate-report/                    # report path thực tế theo runner
    newman-report.html
    test-run-manifest.md
  videos/
    README.md                          # tiêu đề, chapter, link, người thực hiện
```

Trong `test-run-manifest.md`, ghi ngày chạy, OS/runtime/tool version, commit hash, lệnh đã chạy, endpoint/base URL, trạng thái backend/database, số pass/fail và đường dẫn log. Không commit secrets, token hoặc dữ liệu cá nhân.

## 12. Tiến độ và phân công cần điền

| Công việc | Người chính | Người review | Đầu ra | Hạn |
|---|---|---|---|---|
| Ghi nhận phạm vi công cụ đã chốt với GV và đối chiếu rubric | `[Tên]` | `[Tên]` | Phản hồi GV, phạm vi đã chốt | `[Ngày]` |
| Postman/Newman: collection, data, assertions, report | `[Tên]` | `[Tên]` | P1–P3 và artifacts | `[Ngày]` |
| Pact: Consumer, Provider verification, breaking change | `[Tên]` | `[Tên]` | C1–C3 và Pact JSON/log | `[Ngày]` |
| AI: xây Skill, cấu hình Agent task, review/chạy Karate tests | [Tên] | [Tên] | SKILL.md, task log, matrix, generated feature/report, AI1 | [Ngày] |
| Karate: project, features, workflow và report | Người phụ trách | Reviewer | K1–K3, source, report, README | Ngày |
| Quay, biên tập, rà secret/chữ/thuyết minh | `[Tên]` | Cả nhóm | Video và link | `[Ngày]` |



## 13. Điều kiện hoàn tất tài liệu trước khi nộp

- [ ] Giảng viên đã góp ý/chốt phạm vi công cụ; cập nhật mục 1.1 và mục 13.
- [ ] Tất cả clip dự kiến có người phụ trách, thời lượng và đầu ra cụ thể.
- [ ] Postman/Newman, Pact và Karate đều có ba clip: cài đặt, chức năng cơ bản, luồng phức tạp.
- [ ] Postman có record/playback, data-driven, checkpoints và Newman run.
- [ ] Karate có project cài được, feature files, data-driven, assertions, workflow và report.
- [ ] Pact có contract sinh từ Consumer, Provider verification và breaking change có thể tái hiện.
- [ ] AI demo có Skill file và Agent task/log; Agent tạo test, được review trước khi chạy Karate, lưu report và đánh giá output.
- [ ] Dùng lại cùng Skill trên operation thứ hai để chứng minh khả năng tái sử dụng.
- [ ] Endpoint, data, lệnh, expected result đã được chạy thử và cập nhật từ `[dự kiến]` thành `[đã xác nhận]`.
- [ ] Artifact và video có commit/hash, log; secret và dữ liệu cá nhân đã được loại bỏ.
- [ ] Slide dẫn đến đúng video/clip và các clip có lời thuyết minh rõ ràng.


