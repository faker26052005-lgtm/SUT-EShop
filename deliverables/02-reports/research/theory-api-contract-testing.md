# Tài Liệu Lý Thuyết — API & Contract Testing

---

## Phần A — API Testing (Nền Tảng)

### A.1 API là gì trong ngữ cảnh microservice/multi-consumer

API (Application Programming Interface) là giao diện lập trình cho phép hai phần mềm giao tiếp với nhau theo một quy ước xác định trước (định dạng dữ liệu, endpoint, phương thức, mã lỗi). Trong kiến trúc microservice, một service đóng vai trò Provider (nhà cung cấp) có thể phục vụ đồng thời nhiều Consumer (bên tiêu thụ) khác nhau về công nghệ, đội ngũ phát triển và vòng đời phát hành. EShop là một ví dụ điển hình: backend Node.js/Express là Provider duy nhất, còn Web, Admin và Mobile là ba Consumer độc lập.

Điểm khác biệt cốt lõi so với API dùng nội bộ trong một ứng dụng nguyên khối (monolith) là: khi Provider và Consumer được phát triển và triển khai độc lập, một thay đổi ở Provider có thể làm hỏng Consumer mà không ai trong đội Provider biết trước, vì hai đội không chia sẻ cùng một codebase và không nhất thiết kiểm thử cùng nhau trước khi release.

### A.2 Kiến trúc REST cơ bản

REST (Representational State Transfer) là kiểu kiến trúc phổ biến nhất cho API hiện nay, dựa trên giao thức HTTP:

- **Phương thức HTTP (HTTP methods)**: GET (đọc, không thay đổi dữ liệu), POST (tạo mới), PUT/PATCH (cập nhật toàn bộ/một phần), DELETE (xóa).
- **Mã trạng thái (status code)**: nhóm 2xx là thành công (200 OK, 201 Created), 4xx là lỗi phía client (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict), 5xx là lỗi phía server (500 Internal Server Error).
- **Tính không trạng thái (statelessness)**: mỗi request phải chứa đủ thông tin để server xử lý mà không cần dựa vào trạng thái phiên trước đó lưu ở server; đây là lý do các API REST hiện đại thường dùng token (ví dụ JWT) đính kèm trong header thay vì session lưu server.
- **Tính idempotent**: một số phương thức (GET, PUT, DELETE) khi gọi lặp lại nhiều lần với cùng tham số phải cho kết quả cuối cùng giống nhau, khác với POST thường không đảm bảo tính chất này (gọi hai lần có thể tạo hai bản ghi).
- **Định dạng dữ liệu**: JSON là định dạng phổ biến nhất hiện nay cho request/response body.

Những khái niệm này là nền tảng để hiểu vì sao các bài kiểm thử API cần kiểm tra không chỉ "có trả lời hay không" mà còn "trả lời đúng ngữ nghĩa HTTP hay không" (ví dụ: xóa một tài nguyên không tồn tại nên trả 404 chứ không phải 200).

### A.3 Phân loại kiểm thử API

| Loại kiểm thử | Mục tiêu | Ví dụ với EShop |
|---|---|---|
| Functional testing | Kiểm tra API thực hiện đúng chức năng nghiệp vụ được mô tả | Đăng nhập đúng mật khẩu trả về token, sai mật khẩu trả về lỗi |
| Schema conformance testing | Kiểm tra cấu trúc response (kiểu dữ liệu, trường bắt buộc) có khớp với một schema định trước | Response của GET /api/products/:id có đúng field id, name, price theo kiểu số/chuỗi |
| Contract testing | Kiểm tra Provider có tiếp tục đáp ứng đúng những gì một Consumer cụ thể thực sự cần, dựa trên hợp đồng do chính Consumer định nghĩa | Backend đổi field price nhưng Mobile App vẫn cần field đó |
| Negative testing | Cố ý gửi dữ liệu sai, thiếu, hoặc vượt giới hạn để kiểm tra API xử lý lỗi đúng cách | Gửi giá trị âm cho price trong giỏ hàng |
| Security testing | Kiểm tra các lỗ hổng liên quan xác thực, phân quyền, injection | Gọi endpoint /api/admin bằng token của user thường |
| Performance/load testing | Kiểm tra khả năng chịu tải và thời gian phản hồi | Không phải trọng tâm của đề tài T06, chỉ nêu để hoàn thiện bức tranh |

Điểm cần phân biệt rõ, vì đây là câu hỏi cốt lõi của cả đề tài: schema conformance testing chỉ kiểm tra cấu trúc dữ liệu có đúng định dạng đã khai báo hay không, còn contract testing kiểm tra API có còn phù hợp với nhu cầu thực tế của từng Consumer cụ thể hay không — hai khái niệm dễ bị nhầm là một nhưng có phạm vi và cách vận hành khác nhau (xem chi tiết ở Phần B.7).

### A.4 Vị trí trong Test Pyramid

Test Pyramid là mô hình phân tầng các loại kiểm thử theo phạm vi và tốc độ thực thi:

```
          /\
         /  \
        /E2E \          ít, chậm, tốn kém, dễ flaky
       /------\          
      /  API   \        vừa phải, kiểm tra hợp đồng giữa các service
     /----------\        
    / Integration\      kiểm tra một service với các dependency trực tiếp (DB, service khác)
   /--------------\     
  /   Unit Test    \    nhiều, nhanh, rẻ, kiểm tra logic từng hàm/module
 /------------------\    

```

- **Unit test**: kiểm tra một hàm hoặc một module riêng lẻ, không phụ thuộc mạng hay hệ thống khác.
- **Integration test**: kiểm tra một service kết hợp với các thành phần trực tiếp phụ thuộc (ví dụ backend kết hợp với SQLite thật).
- **API test**: kiểm tra giao tiếp qua HTTP giữa các service, bao gồm cả functional testing, schema testing và contract testing.
- **E2E test**: kiểm tra toàn bộ luồng người dùng qua nhiều service và cả giao diện, tốn thời gian và tài nguyên nhất, dễ trở thành flaky test nếu phụ thuộc nhiều thành phần chạy đồng thời.

Contract testing được xem là một giải pháp nằm giữa integration test và E2E test: nó cho phép kiểm tra tính tương thích giữa hai service mà không cần khởi chạy đồng thời cả hai như E2E test đòi hỏi, nhờ đó nhanh hơn và ổn định hơn nhưng vẫn phát hiện được các lỗi tích hợp mà unit test không thể thấy.

### A.5 Công cụ phổ biến và khi nào dùng loại nào

| Công cụ | Loại kiểm thử chính | Khi nào nên dùng |
|---|---|---|
| Postman/Newman | Functional, schema conformance | Kiểm thử nhanh, trực quan, phù hợp giai đoạn đầu hoặc nhóm chưa quen code kiểm thử |
| Karate | Functional, schema conformance, có thể mở rộng performance | Muốn viết test dễ đọc theo Gherkin mà không cần thành thạo Java |
| RestAssured | Functional, tích hợp sâu vào test suite Java | Dự án đã dùng Java/JUnit, muốn test API nằm trong cùng pipeline build |
| Pact | Contract testing (CDCT) | Có nhiều Consumer với vòng đời phát hành khác nhau (đặc biệt Mobile), cần phát hiện breaking change sớm |
| Schemathesis, Specmatic | Sinh test tự động từ OpenAPI | Đã có tài liệu OpenAPI chuẩn và muốn kiểm tra độ phủ nhanh |

### A.6 Xác thực và phân quyền trong kiểm thử API

Phần lớn API hiện đại (bao gồm EShop) dùng JWT (JSON Web Token) để xác thực: người dùng đăng nhập một lần, nhận về token, sau đó đính kèm token này vào header Authorization của mọi request tiếp theo. Kiểm thử API cho các hệ thống này cần kỹ thuật "chained request" hoặc "chained token": request đăng nhập chạy trước, kết quả (token) được lưu vào biến, các request sau đọc lại biến đó thay vì đăng nhập lại mỗi lần. Đây chính là milestone "chained-token auth using collection variables" mà brief T06 yêu cầu cho Postman.

Kiểm thử phân quyền (authorization) là một dạng negative test đặc biệt quan trọng: không chỉ kiểm tra "người có quyền làm được gì" mà còn phải kiểm tra "người không có quyền có bị chặn đúng cách hay không" — ví dụ gọi endpoint dành cho admin bằng token của user thường phải trả về 403, không phải 200.

---

## Phần B — Contract Testing (Trọng Tâm)

### B.1 Vấn đề cốt lõi: API trả HTTP 200 nhưng client vẫn crash

Đây là luận điểm trung tâm mà cả đề tài xoay quanh. Một API có thể vượt qua toàn bộ bài kiểm thử chức năng (functional test) — tức là vẫn trả về đúng mã trạng thái HTTP, vẫn xử lý đúng nghiệp vụ — nhưng vẫn khiến một client cụ thể bị lỗi, vì cấu trúc dữ liệu trả về đã thay đổi theo cách client đó không xử lý được.

Ví dụ minh họa (dùng xuyên suốt cho demo và báo cáo): backend EShop đổi tên field price trong response của GET /api/products/:id thành unit_price. Nếu chỉ chạy functional test kiểu "gọi API, kiểm tra status 200", bài test này vẫn pass, vì server vẫn phản hồi đúng và không có lỗi ở tầng HTTP. Nhưng Mobile App, nếu đang đọc trực tiếp field price để hiển thị giá và tính tổng khi checkout, sẽ nhận về undefined hoặc gây lỗi runtime, dẫn đến crash ngay tại bước quan trọng nhất của hành trình mua hàng.

Nguyên nhân gốc rễ: functional testing và schema testing kiểm tra Provider theo góc nhìn của chính Provider (hoặc theo một schema tĩnh do người viết test tự định nghĩa), chứ không kiểm tra theo góc nhìn thực tế của từng Consumer đang tồn tại ngoài thị trường. Contract testing ra đời để lấp đúng khoảng trống này.

### B.2 Contract Testing là gì

Contract testing là kỹ thuật kiểm thử tập trung vào việc xác minh hai service (Consumer và Provider) có tuân thủ đúng một "hợp đồng" (contract) đã thỏa thuận về cách chúng giao tiếp với nhau, mà không cần chạy đồng thời cả hai hệ thống đầy đủ như E2E testing.

Phân biệt với hai khái niệm dễ nhầm lẫn:

- **Integration testing**: kiểm tra một service có tích hợp đúng với một dependency thật (ví dụ database thật, hoặc một service khác đang chạy thật). Integration testing cần cả hai hệ thống chạy đồng thời tại thời điểm test.
- **Mocking**: giả lập hành vi của một dependency để cô lập service đang test, nhưng bản mock thường do chính đội phát triển service đó tự viết dựa trên giả định của họ, không có cơ chế đảm bảo bản mock đó còn đúng với Provider thật theo thời gian — đây chính là rủi ro "mock drift" mà contract testing giải quyết được nhờ cơ chế verify tự động.

Contract testing giải quyết vấn đề bằng cách tách rời hai bước: (1) Consumer định nghĩa và lưu lại đúng những gì nó cần dưới dạng một tệp hợp đồng, độc lập với Provider; (2) Provider chạy lại các yêu cầu trong tệp hợp đồng đó vào chính API thật của mình để xác nhận vẫn đáp ứng đúng, độc lập với Consumer. Hai bước này chạy tách biệt về thời gian và không gian, nên nhanh và ổn định hơn E2E test.

### B.3 Consumer-Driven Contract Testing (CDCT)

CDCT là mô hình contract testing phổ biến nhất hiện nay, mà Pact triển khai. Nguyên lý cốt lõi: Consumer (chứ không phải Provider) là bên chủ động định nghĩa hợp đồng, dựa trên đúng những gì nó thực sự sử dụng.

Luồng hoạt động:

1. Đội phát triển Consumer (ví dụ Mobile App) viết một bài test mô tả: "khi tôi gọi GET /api/products/:id, tôi mong đợi nhận lại một response có các field id, name, price với kiểu dữ liệu tương ứng."
2. Khi chạy test này, Pact không gọi API thật mà dựng lên một mock server nội bộ theo đúng mô tả trên, và bài test của Consumer chạy nhắm vào mock server đó.
3. Nếu test pass, Pact tự động sinh ra một tệp hợp đồng dạng JSON (Pact file), ghi lại chính xác request và response đã được thỏa thuận.
4. Tệp hợp đồng này được publish lên một nơi lưu trữ trung tâm (Pact Broker hoặc PactFlow).
5. Ở phía Provider (backend), một bài test khác (Provider Verification) sẽ tải tệp hợp đồng về, phát lại (replay) chính xác các request trong đó vào API thật đang chạy, rồi so sánh response thật nhận được với những gì hợp đồng yêu cầu.
6. Nếu response thật không khớp — ví dụ thiếu field, sai kiểu dữ liệu — bài test Provider Verification sẽ fail, báo hiệu breaking change trước khi code được merge hoặc triển khai.

Điểm quan trọng cần nhấn mạnh trong báo cáo: hợp đồng chỉ chứa đúng phần dữ liệu mà Consumer thực sự dùng đến, không phải toàn bộ response. Vì vậy Provider vẫn được tự do thêm field mới mà không làm hỏng bất kỳ hợp đồng nào; chỉ có việc đổi tên, đổi kiểu, hoặc xóa field đang được một Consumer sử dụng mới bị phát hiện. Đây là lý do CDCT không cứng nhắc như việc khóa cứng toàn bộ schema.

### B.4 Các khái niệm cần giải thích

- **Consumer**: bên tiêu thụ API, chủ động định nghĩa hợp đồng theo nhu cầu thực tế của mình (trong EShop: Web, Admin, Mobile).
- **Provider**: bên cung cấp API, có trách nhiệm chạy lại và đáp ứng mọi hợp đồng đã được các Consumer công bố (trong EShop: backend Node.js/Express).
- **Pact file**: tệp JSON ghi lại một hợp đồng cụ thể, gồm các "interaction" (mỗi interaction là một cặp request-response được kỳ vọng).
- **Matcher**: thay vì yêu cầu response phải khớp chính xác từng giá trị cụ thể (ví dụ id phải đúng bằng 1), Pact cho phép dùng matcher để chỉ yêu cầu đúng kiểu dữ liệu hoặc đúng định dạng (ví dụ "id phải là một số nguyên", "price phải là một số"), giúp hợp đồng linh hoạt hơn và ít bị vỡ vì những thay đổi dữ liệu không quan trọng.
- **Provider state**: một cơ chế cho phép Consumer khai báo trạng thái dữ liệu cần có trước khi một interaction cụ thể được xác minh (ví dụ "sản phẩm id 1 tồn tại trong hệ thống"); phía Provider triển khai một "state handler" tương ứng để chuẩn bị đúng dữ liệu đó (ví dụ seed một bản ghi vào SQLite) trước khi chạy verification.
- **Pact Broker**: một server trung tâm dùng để lưu trữ, quản lý phiên bản các Pact file, hiển thị ma trận tương thích giữa các phiên bản Consumer và Provider, lưu kết quả verification, và cung cấp webhook để tự động kích hoạt các hành động khác (ví dụ chạy lại build) khi có hợp đồng mới hoặc kết quả verify mới.
- **PactFlow**: dịch vụ Pact Broker dạng đám mây (SaaS) do đội ngũ Pact phát triển, có thêm giao diện trực quan và các tính năng nâng cao như AI-augmented contract testing.
- **can-i-deploy**: một lệnh dòng lệnh (CLI) truy vấn Pact Broker để trả lời câu hỏi "phiên bản này của Consumer/Provider có an toàn để triển khai lên một môi trường cụ thể hay không", dựa trên toàn bộ kết quả verification đã ghi nhận giữa các phiên bản liên quan. Đây là cơ chế cổng kiểm soát (gate) thường được gắn vào pipeline CI/CD trước bước deploy thật.
- **Environment và tag/branch**: Pact Broker cho phép gắn nhãn một phiên bản Consumer/Provider với một môi trường cụ thể (ví dụ "production", "staging") hoặc một nhánh Git, giúp can-i-deploy biết chính xác đang so sánh phiên bản nào với phiên bản nào.

### B.5 Provider Verification và can-i-deploy trong thực hành

Provider Verification là bài test chạy phía backend, có nhiệm vụ: (1) khởi động backend thật (hoặc một tiến trình test tương đương) ở một cổng nhất định, (2) tải toàn bộ Pact file liên quan từ Broker hoặc từ đường dẫn cục bộ, (3) với mỗi interaction trong Pact file, thiết lập provider state tương ứng (nếu có), sau đó gửi đúng request đã ghi trong hợp đồng vào backend thật, (4) so sánh response thật nhận được với response được mô tả trong hợp đồng (dùng đúng matcher đã khai báo), (5) publish kết quả verification (pass/fail) trở lại Broker.

can-i-deploy sau đó truy vấn Broker: "phiên bản Provider sắp deploy này đã được verify thành công với phiên bản mới nhất của mọi Consumer đang chạy ở môi trường production hay chưa?" Nếu bất kỳ Consumer nào chưa được verify thành công, lệnh trả về "cannot deploy" và pipeline CI/CD nên dừng lại trước khi deploy thật.

### B.6 Bi-Directional Contract Testing (BDCT)

Ngoài mô hình CDCT truyền thống (cần cả Consumer lẫn Provider viết test và verify lẫn nhau), Pact/PactFlow còn hỗ trợ một mô hình thay thế gọi là Bi-Directional Contract Testing. Ở mô hình này, thay vì Provider phải chạy lại từng interaction của Consumer, hệ thống so sánh tĩnh giữa: (a) tài liệu đặc tả OpenAPI do Provider công bố, và (b) bản tóm tắt những gì Consumer thực sự sử dụng (rút ra từ Pact file của Consumer). Nếu tài liệu OpenAPI không còn bao phủ đủ những gì Consumer cần, hệ thống sẽ cảnh báo, mà không cần Provider phải tự viết và chạy một bài test verification riêng.

BDCT phù hợp khi đội Provider chưa sẵn sàng đầu tư viết Provider Verification test, nhưng đã có sẵn tài liệu OpenAPI được duy trì tốt. Nhóm có thể nhắc đến mô hình này như một phương án mở rộng hoặc một điểm so sánh trong phần thảo luận, không bắt buộc phải triển khai.

### B.7 So sánh Schema Testing (Postman) và CDCT (Pact)

| Tiêu chí | Schema Testing (Postman + JSON Schema) | CDCT (Pact) |
|---|---|---|
| Ai định nghĩa "đúng" | Người viết test tự định nghĩa một schema tĩnh, dựa trên hiểu biết chủ quan tại thời điểm viết | Chính Consumer định nghĩa, dựa trên những gì nó thực sự dùng, tại thời điểm chạy test của Consumer |
| Phạm vi kiểm tra | Toàn bộ cấu trúc response so với schema đã khai báo | Chỉ phần response mà một Consumer cụ thể thực sự tiêu thụ |
| Cơ chế phát hiện lỗi | So sánh response thật với schema tại thời điểm gọi API | So sánh response thật với hợp đồng đã publish, có lưu vết theo từng phiên bản Consumer/Provider |
| Phát hiện Consumer nào bị ảnh hưởng | Không — chỉ biết response sai schema, không biết ảnh hưởng đến ai | Có — biết chính xác Consumer nào (và phiên bản nào) sẽ bị ảnh hưởng |
| Bảo trì khi hệ thống lớn dần | Người viết test phải tự cập nhật schema thủ công khi API thay đổi | Hợp đồng tự cập nhật mỗi khi Consumer chạy lại test của chính nó |
| Cổng kiểm soát triển khai (deployment gate) | Dựa trên exit code của lần chạy test, không có khái niệm môi trường hay phiên bản | can-i-deploy, có khái niệm môi trường, phiên bản, lịch sử verify |
| Ngưỡng tiếp cận | Rất thấp | Trung bình đến cao |

Khi nào dùng schema testing: giai đoạn đầu dự án, khi số lượng Consumer còn ít hoặc chưa xác định rõ, hoặc khi muốn có một lớp kiểm tra nhanh, dễ bảo trì cho một bên duy nhất (ví dụ chỉ kiểm tra chính backend có tuân thủ đúng tài liệu API của nó).

Khi nào dùng CDCT: khi có nhiều Consumer với vòng đời phát hành khác nhau (đặc biệt khi có Mobile App, vì các phiên bản cũ có thể tồn tại rất lâu ngoài thị trường như đã nêu ở A.1), và muốn có cơ chế tự động ngăn chặn việc deploy một thay đổi phá vỡ tương thích với bất kỳ Consumer nào đang hoạt động.

Hai kỹ thuật không loại trừ nhau: một hệ thống trưởng thành thường dùng cả hai, schema testing cho việc kiểm tra nhanh hằng ngày, CDCT cho việc đảm bảo tương thích trước khi deploy.

### B.8 Phân loại breaking change thường gặp

| Loại thay đổi | Ví dụ | Vì sao gây lỗi cho Consumer |
|---|---|---|
| Đổi tên field | price thành unit_price | Consumer đọc theo tên field cũ, nhận về undefined |
| Đổi kiểu dữ liệu | category_id từ số sang chuỗi | Consumer thực hiện phép toán hoặc so sánh sai kiểu |
| Xóa field | Bỏ imageUrl khỏi response sản phẩm | Consumer đang hiển thị ảnh sẽ không còn dữ liệu để hiển thị |
| Đổi cấu trúc lồng nhau | items từ mảng chuyển thành object có key là id | Code duyệt mảng (.map, .forEach) của Consumer bị lỗi |
| Thêm field bắt buộc vào request | Checkout yêu cầu thêm shipping_method mà trước đó không bắt buộc | Consumer chưa cập nhật sẽ gửi thiếu field, bị Provider từ chối |
| Đổi mã trạng thái HTTP | Đổi từ trả 200 kèm lỗi trong body sang trả 422 | Consumer đang chỉ kiểm tra status 200 sẽ xử lý sai luồng lỗi |


### B.9 Hạn chế của Contract Testing

- Hợp đồng chỉ phản ánh đúng những gì Consumer *đã viết test cho*; nếu bài test của Consumer viết thiếu, một breaking change ở phần bị bỏ sót đó sẽ không bị phát hiện.
- Contract testing không thay thế được E2E testing hoàn toàn: nó không kiểm tra được các lỗi phát sinh từ việc nhiều service phối hợp với nhau trong một luồng nghiệp vụ dài (ví dụ luồng thanh toán đi qua nhiều service khác nhau).
- Cần đầu tư hạ tầng (Pact Broker/PactFlow) và cần kỷ luật duy trì để tránh tình trạng hợp đồng lỗi thời không phản ánh đúng Consumer thật.
- Nếu test của Consumer gọi thẳng vào tầng HTTP thô (ví dụ fetch trực tiếp) thay vì đi qua đúng lớp gọi API thật mà ứng dụng đang dùng, hợp đồng có thể tách rời khỏi hành vi thật của ứng dụng, khiến verification pass nhưng ứng dụng thật vẫn lỗi.

---

## Phần C — AI Trong API/Contract Testing

### C.1 Sinh OpenAPI spec từ Markdown bằng AI

Nhiều dự án, bao gồm EShop, có tài liệu API ở dạng Markdown mô tả bằng ngôn ngữ tự nhiên thay vì một tệp đặc tả chuẩn hóa như OpenAPI (YAML/JSON). Việc chuyển đổi thủ công tốn thời gian và dễ sai sót khi liệt kê hàng chục endpoint. AI (Claude, ChatGPT) có thể đọc tài liệu Markdown và sinh ra bản OpenAPI 3.0 tương ứng khá nhanh, đặc biệt tốt ở phần suy luận cấu trúc request body từ mô tả bằng lời.

Hạn chế cần lưu ý: tài liệu Markdown gốc thường mô tả kỹ phần request nhưng ít mô tả chi tiết response, nên AI dễ "bịa" cấu trúc response dựa trên suy đoán hợp lý thay vì dữ kiện thật. Bước bắt buộc sau khi AI sinh xong là đối chiếu lại với response thật (bằng cách gọi API thật hoặc đọc mã nguồn backend) trước khi dùng tệp OpenAPI này làm đầu vào cho các công cụ khác.

### C.2 Sinh test case (positive + negative) từ OpenAPI

Từ một tệp OpenAPI đã có, AI có thể sinh ra bộ test case bao gồm cả positive test (đường đi đúng, dữ liệu hợp lệ) và negative test (dữ liệu sai, thiếu, vượt giới hạn) dựa trên các ràng buộc được khai báo trong schema (kiểu dữ liệu, required, min/max, enum...). Đây là cách nhanh nhất để đạt độ phủ cao trên bề mặt API đã được đặc tả rõ ràng.

Quy trình khuyến nghị cho milestone S3 của brief: (1) đưa tệp OpenAPI cho AI, yêu cầu sinh scaffold test (Postman collection hoặc Karate feature); (2) chạy thử bộ test này; (3) so sánh (diff) với bộ test do người viết tay để xác định phần nào AI phủ được, phần nào bỏ sót; (4) ghi lại kết quả so sánh này làm bằng chứng học thuật cho hoạt động Spec-to-Tests Sprint.

### C.3 AI tích hợp sẵn trong công cụ kiểm thử

- **Postbot**: tính năng AI tích hợp trực tiếp trong Postman, có thể gợi ý assertion cho một request đã chọn, giải thích response, hoặc sinh tài liệu mô tả cho request/collection.
- **PactFlow AI**: tính năng AI tích hợp trong PactFlow, có thể hỗ trợ sinh consumer test, review test hiện có, và một số thao tác liên quan đến bi-directional contract testing; một phần tính năng yêu cầu tài khoản PactFlow Cloud.

### C.4 Giới hạn của AI trong kiểm thử API/contract

AI cho độ phủ cao đối với những gì đã được khai báo tường minh trong schema (kiểu dữ liệu, trường bắt buộc, giới hạn giá trị cơ bản), nhưng yếu ở ba nhóm vấn đề mà brief T06 cũng nhấn mạnh:

- **Business logic (luật nghiệp vụ)**: những quy tắc không nằm trong schema kỹ thuật mà nằm trong tài liệu SRS hoặc trong đầu người phát triển. Ví dụ: tổng tiền của đơn hàng phải do backend tự tính lại chứ không được tin vào giá trị client gửi; điều kiện áp dụng một mã giảm giá; giới hạn số lần thử đăng nhập sai. AI đọc riêng schema OpenAPI sẽ không biết những ràng buộc này, trừ khi được cung cấp thêm tài liệu SRS/business rules.
- **Race condition**: các lỗi chỉ xuất hiện khi nhiều request chạy đồng thời (ví dụ hai request đặt hàng cùng lúc cho sản phẩm chỉ còn 1 tồn kho). AI sinh test tuần tự thông thường không tự phát hiện được nhóm lỗi này, cần người thiết kế kịch bản đặc biệt.
- **Lạm dụng nghiệp vụ (abuse case)**: các kịch bản mà kẻ tấn công hoặc người dùng cố tình khai thác lỗ hổng logic, ví dụ dùng lại một mã giảm giá nhiều lần, gửi user_id giả trong body thay vì lấy từ JWT để chiếm quyền người khác, hoặc gọi API theo trình tự bất thường để bỏ qua một bước kiểm tra. Đây là nhóm test khó sinh tự động vì đòi hỏi tư duy đối kháng (adversarial thinking) mà AI không có động cơ tự suy ra nếu không được nhắc rõ.

### C.5 Nguyên tắc sử dụng AI có trách nhiệm

Quy trình khuyến nghị, áp dụng xuyên suốt mọi hướng AI của đề tài: AI sinh -> người review -> chạy thật -> ghi lại.

1. **AI sinh**: dùng AI để sinh spec, test case, hoặc payload negative test, với prompt rõ ràng, có đính kèm ngữ cảnh cần thiết (schema, luật nghiệp vụ nếu có).
2. **Người review**: đọc lại toàn bộ output của AI trước khi chạy, đối chiếu với tài liệu gốc (SRS, mã nguồn) để loại bỏ phần AI suy đoán sai hoặc bịa dữ liệu.
3. **Chạy thật**: mọi test do AI sinh phải được chạy thật trên hệ thống, không được đưa vào báo cáo nếu chưa xác minh kết quả thực tế.
4. **Ghi lại**: lưu lại prompt đã dùng, phiên bản model, và phần nào là do AI sinh nguyên bản, phần nào do người chỉnh sửa lại — đây là yêu cầu về tính minh bạch khi dùng AI trong một sản phẩm học thuật, đồng thời cũng là nội dung cần có trong User_Guide.md và các hạng mục [AI-02]/[AI-03]/[AI-04].

Ngoài ra, cần lưu ý về mặt bảo mật và quyền riêng tư khi đưa tài liệu đặc tả hoặc dữ liệu mẫu cho các công cụ AI chạy trên cloud: tránh đưa dữ liệu thật của người dùng (nếu có), chỉ dùng dữ liệu giả lập khi cần ví dụ minh họa.

---

## Phần D — Thuật Ngữ Tổng Hợp

| Thuật ngữ | Giải thích ngắn |
|---|---|
| Provider | Bên cung cấp API (backend) |
| Consumer | Bên tiêu thụ API (Web, Admin, Mobile) |
| Contract / Pact file | Tệp mô tả những gì Consumer kỳ vọng từ Provider |
| Pact Broker / PactFlow | Nơi lưu trữ, quản lý phiên bản và hiển thị kết quả verify của các hợp đồng |
| Provider Verification | Bài test phía Provider, phát lại các interaction trong hợp đồng vào API thật |
| Provider State | Trạng thái dữ liệu cần thiết lập trước khi verify một interaction cụ thể |
| Matcher | Quy tắc so khớp linh hoạt (theo kiểu dữ liệu/định dạng) thay vì so khớp giá trị chính xác |
| can-i-deploy | Lệnh kiểm tra một phiên bản có an toàn để triển khai hay không, dựa trên lịch sử verify |
| CDCT | Consumer-Driven Contract Testing — Consumer chủ động định nghĩa hợp đồng |
| BDCT | Bi-Directional Contract Testing — so sánh tĩnh giữa OpenAPI của Provider và nhu cầu của Consumer |
| Breaking change | Thay đổi ở Provider làm một hoặc nhiều Consumer đang dùng bị lỗi |
| Schema conformance testing | Kiểm tra response có đúng cấu trúc dữ liệu đã khai báo tĩnh hay không |
| Flaky test | Bài test cho kết quả không nhất quán giữa các lần chạy dù không có thay đổi mã nguồn |
| Chained token/request | Kỹ thuật dùng kết quả của một request (ví dụ token đăng nhập) làm đầu vào cho các request sau |

---

## Nguồn Tham Khảo

1. What is Contract Testing and its Significance? - BrowserStack, https://www.browserstack.com/guide/contract-testing
2. Contract Testing Tools: Pact vs Spring Cloud Contract, https://totalshiftleft.ai/blog/contract-testing-for-microservices
3. Pact documentation, https://docs.pact.io/
4. Provider Verification - Pact Docs, https://docs.pact.io/implementation_guides/javascript/docs/provider
5. Pact Broker overview, https://docs.pact.io/pact_broker
6. Comparisons with other tools - Pact Docs, https://docs.pact.io/getting_started/comparisons
7. Bi-Directional Contract Testing with Pact, https://qaskills.sh/blog/bidirectional-contract-testing-pact-2026
8. PactFlow AI Assistant Skill - Pact Docs, https://docs.pact.io/ai_tools/pactflow-skill
9. Sharing Pacts with the Pact Broker - Pact Docs, https://docs.pact.io/getting_started/sharing_pacts
10. API Contract Testing: Techniques, Tools, and Best Practices, https://www.accelq.com/blog/api-contract-testing/
11. Is Postbot usage limited? - Postman Learning Center, https://learning.postman.com/help/faqs/postbot/is-postbot-usage-limited
12. PactFlow Pricing & Plans, https://pactflow.io/pricing
13. Mark Winteringham, API Testing in Action, Chương 4 và 9 (Ebook) https://www.slideshare.net/slideshow/testing-web-apis-1st-edition-mark-winteringham/277136630
14. EShop repository, https://github.com/ttbhanh/eshop-sut
