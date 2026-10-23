## I. Giới thiệu

#### **PHÂN ĐOẠN 1.1: LỜI CHÀO, GIỚI THIỆU BẢN THÂN & NHIỆM VỤ SEMINAR**

#### 1. Thao tác hiển thị màn hình:

- **00:00 – 00:30:** Chiếu Slide Tiêu đề chính thức của Video:
    - **Tên trường & Môn học:** *Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (FIT@HCMUS) — Môn Kiểm thử phần mềm*.
    - **Chủ đề Seminar:** *T06 · API Testing & Contract Testing*.
    - **Tiêu đề Video:** *Kiểm Thử API Tự Động Toàn Diện Với Karate Framework (Bộ kịch bản K1, K2 & K3)*.
    - **Thông tin người trình bày:** *Nguyễn Quốc Kỳ — MSSV: 23120138 — Nhóm 11*.

#### 2. Lời thoại thuyết minh (Script):

> *"Xin kính chào Thầy và tất cả các bạn!
> 
> 
> Mình tên là **Nguyễn Quốc Kỳ**, MSSV **23120138**, đại diện Nhóm 11 tham gia Seminar môn Kiểm thử phần mềm với Chủ đề T06: **API Testing & Contract Testing**.
> 
> Trong cấu trúc đồ án của nhóm, bên cạnh kịch bản kiểm thử hợp đồng Pact JS và các kịch bản kiểm thử giao diện Postman, mình đảm nhiệm phụ trách trọn vẹn bộ kiểm thử API tự động bằng mã nguồn (Code-based API Testing) sử dụng **Karate Framework phiên bản 1.4.1** kết hợp Java 17 và JUnit 5."*
> 

---

#### **PHÂN ĐOẠN 1.2: ĐỊNH VỊ KARATE FRAMEWORK & ĐỘNG LỰC GIẢI PHÁP**

#### 1. Thao tác hiển thị màn hình:

- **00:30 – 00:55:** Chuyển sang Slide 02 hiển thị 3 ưu thế cốt lõi của Karate:
    - **1. BDD DSL không tầng trung gian:** Cú pháp Gherkin bản địa hóa giao thức HTTP, không cần viết Step Definitions.
    - **2. Schema Validation bản địa:** Hệ thống Fuzzy Matchers xử lý linh hoạt dữ liệu động.
    - **3. Tự động hóa CI/CD tự nhiên:** Mã nguồn văn bản thuần (Git-friendly), chạy trực tiếp qua Maven CLI.

#### 2. Lời thoại thuyết minh (Script):

> *"Vì sao chúng ta lựa chọn Karate Framework cho phần kiểm thử API bằng mã nguồn?
> 
> Trong các dự án phần mềm hiện đại, việc kiểm thử API qua giao diện đồ họa rất thuận tiện cho giai đoạn khám phá ban đầu, nhưng khi bước vào giai đoạn kiểm thử hồi quy tự động trong đường ống CI/CD, kiểm thử bằng mã nguồn (Code-based API Testing) trở thành yêu cầu tất yếu.
> 
> Karate Framework nổi bật nhờ cú pháp BDD dạng Gherkin tự nhiên, tích hợp thẳng giao thức HTTP vào kịch bản mà không đòi hỏi tạo các lớp Step Definitions trung gian phức tạp. Đồng thời, Karate hỗ trợ sẵn hệ thống xác thực Schema mạnh mẽ và khả năng tích hợp mượt mà vào Maven CLI để chạy tự động trên mọi môi trường."*
> 

---

#### **PHÂN ĐOẠN 1.3: GIỚI THIỆU SUT ESHOP & LỘ TRÌNH 3 KỊCH BẢN K1, K2, K3**

#### 1. Thao tác hiển thị màn hình:

- **00:55 – 01:20:** Chiếu Sơ đồ kiến trúc hệ thống **EShop SUT** (Node.js/Express + SQLite) kết nối với 3 khối kịch bản Karate:
    - **K1 (@smoke):** Endpoint Catalog `GET /api/products` (Smoke Test & Schema Check).
    - **K2 (@data-driven):** Endpoint Chi tiết `GET /api/products/:id` (Data-Driven & Bắt khiếm khuyết SUT).
    - **K3 (@e2e):** Phân hệ Mua sắm (`/register` → `/login` → `/cart` → `/checkout` → `/my-orders` & ca Negative Security).

#### 2. Lời thoại thuyết minh (Script):

> *"Hệ thống kiểm thử mục tiêu của chúng ta là ứng dụng thương mại điện tử **EShop SUT**. Trong video này, mình sẽ dẫn dắt Thầy và các bạn đi qua trọn vẹn 3 cấp độ kiểm thử được nhóm thiết kế bài bản:
> 
> - **Kịch bản K1:** Kiểm tra tính sẵn sàng (Smoke Test) và xác thực cấu trúc dữ liệu (Schema Validation) của danh mục sản phẩm.
> - **Kịch bản K2:** Ứng dụng kỹ thuật Data-Driven Testing để bao phủ các ca biên và ghi nhận trung thực 2 khiếm khuyết sai lệch đặc tả của hệ thống EShop.
> - **Kịch bản K3:** Kiểm thử chuỗi mua sắm hoàn chỉnh từ đầu đến cuối (End-to-End Workflow) có xác thực JWT Token, cô lập dữ liệu động và kiểm thử bảo mật.
> 
> Không để Thầy và các bạn đợi lâu, ngay sau đây chúng ta sẽ cùng đi vào phân tích các nguyên lý hoạt động cốt lõi của Karate!"*
> 

## II. Lý thuyết và nguyên lý

#### **PHÂN ĐOẠN 2.1: TRIẾT LÝ BDD DSL KHÔNG TẦNG TRUNG GIAN (01:15 – 01:45)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide so sánh kiến trúc giữa hai trường phái kiểm thử API:
    - **Bên trái (Mô hình truyền thống - Cucumber + REST-Assured):** Sơ đồ 3 tầng cồng kềnh: File `.feature` → Tầng trung gian Step Definitions (`@Given`, `@When` viết bằng Java) → HTTP Client.
    - **Bên phải (Mô hình Karate Framework):** Sơ đồ tinh gọn: File `.feature` giao tiếp trực tiếp với HTTP Engine qua các từ khóa bản địa (`Given path`, `When method`, `Then status`, `And match`).

#### 2. Lời thoại thuyết minh (Script):

> *"Để làm chủ bộ công cụ Karate, trước tiên chúng ta cần nắm vững các nguyên lý nền tảng:
> 
> 
> **Nguyên lý cốt lõi thứ nhất là Cú pháp BDD DSL không tầng trung gian (No Step Definitions):** Trong các framework BDD truyền thống như Cucumber kết hợp REST-Assured, kiểm thử viên buộc phải viết mã Java trung gian (gọi là Step Definitions) để ánh xạ từng câu chữ Gherkin thành các lệnh HTTP. Điều này gây tốn kém thời gian bảo trì và tạo ra lượng mã thừa (boilerplate code) khổng lồ.
> 
> Karate đã tạo ra một cuộc cách mạng khi tích hợp sẵn giao thức HTTP trực tiếp vào cú pháp Gherkin. Các từ khóa `Given path`, `When method post`, `Then status 200` và `And match` trực tiếp gửi nhận dữ liệu mạng mà không cần bất kỳ tầng glue code Java nào. Nhờ đó, kịch bản kiểm thử vừa đóng vai trò là tài liệu đặc tả sống (Living Documentation) cho Business Analyst, vừa là mã nguồn tự động hóa có thể chạy được ngay."*
> 

---

#### **PHÂN ĐOẠN 2.2: CƠ CHẾ CHECKPOINTS & SCHEMA VALIDATION VỚI FUZZY MATCHERS (01:45 – 02:15)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Bảng tra cứu hệ thống **Fuzzy Matchers** của Karate:
    - `#number`: Khớp số nguyên hoặc số thực.
    - `#string`: Khớp chuỗi ký tự bất kỳ.
    - `#boolean`: Khớp giá trị `true/false`.
    - `#[]`: Khớp cấu trúc mảng JSON (`JSON Array`).
    - `contains deep`: Khớp lồng sâu các thuộc tính mà không đòi hỏi toàn bộ object.
- Bên cạnh là ví dụ so sánh: Kiểm tra tĩnh (Hardcoded static value) dễ vỡ ↔ Kiểm tra động bằng Fuzzy Matcher bền vững.

#### 2. Lời thoại thuyết minh (Script):

> *"**Nguyên lý thứ hai là Cơ chế Checkpoints và Schema Validation bằng Fuzzy Matchers:** Trong kiểm thử API thực tế, dữ liệu phản hồi thường mang tính biến động cao (Dynamic Data) — ví dụ như ID tự tăng, mã JWT token hay dấu thời gian (timestamps). Nếu chúng ta kiểm thử bằng cách so khớp cứng (Hardcoding giá trị tĩnh), bài test sẽ bị gãy vụn ngay khi chạy ở môi trường khác.
> 
> 
> Karate giải quyết triệt để bài toán này thông qua hệ thống **Fuzzy Matchers**: Thay vì so sánh giá trị cụ thể, Karate cho phép chúng ta kiểm chứng tính toàn vẹn của cấu trúc dữ liệu:
> 
> - Sử dụng `#[]` để khẳng định response bắt buộc phải là một mảng JSON.
> - Khai báo schema lồng nhau với `#number`, `#string` để bảo đảm mọi trường dữ liệu trả về đều đúng định dạng kỹ thuật.
> - Sử dụng `contains deep` để kiểm tra sự tồn tại của dữ liệu nghiệp vụ cốt lõi mà không bị ảnh hưởng khi server bổ sung thêm các trường thông tin phụ."*

---

#### **PHÂN ĐOẠN 2.3: NGUYÊN LÝ DATA-DRIVEN TESTING — CHARACTERIZATION VS SPEC TEST (02:15 – 02:45)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 06:
    - Sơ đồ nguyên lý Data-Driven: Tham số hóa từ bảng `Examples:` vào khung kịch bản `Scenario Outline`.
    - Phân biệt rõ hai mục đích kiểm thử:
        - **Characterization Test (Baseline Test):** Ghi nhận hành vi hiện tại của SUT làm mốc đối soát hồi quy (ID 2 giá tiền là chuỗi `#string`, ID 9999 trả về 200 OK).
        - **Specification Test (Spec Test):** Khẳng định hành vi chuẩn theo đặc tả (ID 9999 phải là 404), khi test FAIL mới là bằng chứng phát hiện bug.

#### 2. Lời thoại thuyết minh (Script):

> *"**Nguyên lý thứ ba là Data-Driven Testing kết hợp phân biệt mục đích kiểm thử:**
> 
> Bằng cách sử dụng `Scenario Outline`, Karate tách biệt hoàn toàn giữa logic kiểm thử và dữ liệu đầu vào. Mỗi dòng trong bảng `Examples` đại diện cho một vòng lặp kiểm thử độc lập.
> 
> Ở đây, chúng ta cần phân biệt rõ hai loại bài test:
> - **Thứ nhất là Characterization Test (hay Baseline Test):** Mục tiêu là ghi nhận chính xác hành vi thực tế hiện tại của hệ thống EShop làm mốc đối soát — ví dụ ghi nhận việc backend trả về trường giá tiền dạng chuỗi ở ID 2 và trả về mã 200 kèm object rỗng ở ID 9999.
> - **Thứ hai là Specification Test:** Là bài test áp đặt hành vi đúng chuẩn đặc tả — ví dụ chuẩn RESTful yêu cầu ID không tồn tại phải trả về mã 404 Not Found. Khi chạy Spec Test này, bài test sẽ FAIL và chính thất bại đó là bằng chứng phát hiện lỗi minh bạch để làm việc với đội ngũ phát triển.
> 
> Đồng thời, một lưu ý kỹ thuật quan trọng: Để kiểm tra object rỗng, cú pháp `match response contains {}` luôn đúng với mọi object; vì vậy chúng ta cần dùng so khớp tuyệt đối `match response == {}` để khẳng định response thực sự rỗng."*

---

#### **PHÂN ĐOẠN 2.4: NGUYÊN LÝ STATEFUL WORKFLOW & TEST DATA ISOLATION (K3) (02:45 – 03:10)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 07: Sơ đồ luồng trạng thái 7 bước của kịch bản K3:
    - `Email động (Timestamp)` → `1. Register` → `2. Login (Trích JWT)` → `3-5. Giỏ hàng (Header Bearer)` → `6. Checkout` → `7. Đối soát đơn hàng`.
    - Nhánh phụ ca bảo mật: Request vào `/api/cart` không Header `Authorization` → Chặn đứng HTTP 401.

#### 2. Lời thoại thuyết minh (Script):

> *"**Nguyên lý thứ tư là Stateful Workflow Testing và Cô lập dữ liệu (Kịch bản K3):**
> 
> Khác với các bài test đơn lẻ (Stateless), một chuỗi mua sắm thương mại điện tử đòi hỏi việc xâu chuỗi dữ liệu trạng thái qua nhiều endpoint liên tiếp.
> 
> Karate hỗ trợ lưu trữ biến nội tại và truyền dữ liệu liền mạch:
> - Trích xuất Token từ phản hồi Đăng nhập và tự động đính kèm vào Header `Authorization: Bearer` cho toàn bộ các request giỏ hàng và thanh toán tiếp theo.
> - **Kỹ thuật cô lập dữ liệu (Test Data Isolation):** Cơ sở dữ liệu EShop áp đặt ràng buộc duy nhất trên trường email (`UNIQUE email`). Nếu dùng email cố định, các lần chạy test lặp lại trên CI/CD sẽ bị lỗi trùng lặp tài khoản (`Duplicate Email Error`). Do đó, kịch bản gọi Java runtime để sinh email động theo timestamp: `karate_k3_<timestamp>@eshop.com`.
> - Đồng thời, kịch bản kết hợp ca kiểm thử bảo mật (Negative Security Test) để khẳng định cơ chế bảo vệ giỏ hàng bằng JWT hoạt động đúng tiêu chuẩn."*

---

#### **PHÂN ĐOẠN 2.5: LUẬN ĐIỂM RECORD & PLAYBACK VÀ KIỂM CHỨNG ĐA TẦNG (03:10 – 03:30)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 08:
    - Khái niệm "Playback" trong Code-based Testing: Tự động hóa Replay kịch bản `.feature` qua Maven CLI / CI/CD Pipeline.
    - Chiến lược kiểm chứng 3 tầng hạn chế bẫy "Xanh ảo" (False Positive):
        - Tầng 1: HTTP Status Check (`status 200/401`).
        - Tầng 2: Structure Check (`match response == '#[]'`, `assert response.length > 0`).
        - Tầng 3: Schema & Deep Match (`#number`, `#string`, `contains deep`).

#### 2. Lời thoại thuyết minh (Script):

> *"**Nguyên lý thứ năm là Luận điểm về Record & Playback và Kiểm chứng đa tầng:**
> 
> - **Về tiêu chí Record & Playback:** Trong kiểm thử dựa trên mã nguồn, tính năng 'Playback' chính là việc tái hiện (Replay) tự động 100% các kịch bản văn bản thuần thông qua Maven CLI và CI/CD runner. Điều này loại bỏ hoàn toàn sự phụ thuộc vào thao tác thu phát thủ công dễ sai sót trên giao diện đồ họa.
> - **Về bẫy Xanh Ảo (False Positive):** Hiện tượng này xuất hiện khi kịch bản chỉ kiểm tra sơ sài mã trạng thái HTTP 200 mà bỏ qua nội dung payload. Nhờ chiến lược kiểm chứng 3 tầng: kết hợp kiểm tra Status, duyệt cấu trúc mảng và áp đặt Schema nghiêm ngặt, bộ test Karate hạn chế tối đa nguy cơ báo thành công giả tạo."*

---

#### **PHÂN ĐOẠN 2.6: GIỚI THIỆU MA TRẬN K2 TRƯỚC KHI VÀO DEMO (03:30 – 03:45)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 09: Bảng ma trận 3 ca kiểm thử K2 (ID 1 Happy Path, ID 2 Characterization lệch kiểu String, ID 9999 Characterization mã 200 + Object rỗng).
- Highlight dòng ghi chú kỹ thuật: Dùng `match response == {}` để khẳng định object rỗng.

#### 2. Lời thoại thuyết minh (Script):

> *"Trước khi bước vào màn hình thực nghiệm, xin mời Thầy và các bạn quan sát bảng ma trận kịch bản K2 trên Slide 09:
> - Ca 1 kiểm thử trường hợp chuẩn mực với giá tiền kiểu số.
> - Ca 2 ghi nhận thực tế backend trả về giá tiền kiểu chuỗi.
> - Ca 3 ghi nhận biên khi ID không tồn tại trả về mã 200 kèm object rỗng `match response == {}`.
> 
> Ngay sau đây, chúng ta sẽ chuyển sang cửa sổ làm việc trực tiếp để quan sát mã nguồn và thực thi bộ test trên Terminal!"*

## III. Demo

#### **PHÂN ĐOẠN 0: GIỚI THIỆU & GIẢI THÍCH CẤU TRÚC CÁC FILE KỊCH BẢN**

#### 1. Thao tác hiển thị màn hình:

- Mở VS Code (Light Theme, phóng to chữ 17pt). Mở cây thư mục `tests/karate/src/test/java/eshop/`.
- **Thao tác 1:** Mở file `products.feature`:
    - Cuộn chuột lướt qua Scenario K1: Highlight dòng tag `@k1 @smoke`, checkpoint mảng `match response == '#[]'` và khối schema validation `response[0] contains {...}`.
    - Cuộn xuống Scenario Outline K2: Highlight tag `@k2 @data-driven` và bảng `Examples:` gồm 3 dòng dữ liệu (ID = 1, 2, 9999).
- **Thao tác 2:** Mở chuyển sang file `auth-cart-checkout.feature`:
    - Highlight tag `@k3 @e2e @smoke` và lướt qua 7 bước nghiệp vụ (Step 1 Register với timestamp → Step 2 Login lấy token → Step 3 Products → Step 4 Add Cart → Step 5 Verify Cart → Step 6 Checkout → Step 7 My Orders).
    - Highlight nhanh kịch bản phụ phía dưới: `@k3 @security @negative` (truy cập giỏ hàng không truyền token).

#### 2. Lời thoại thuyết minh (Script):

> *"Trước khi bấm máy thực thi, mình xin điểm nhanh cấu trúc của 2 file kịch bản Gherkin nòng cốt trong bộ test Karate:
> 
> 
> **1. File thứ nhất là `products.feature`:** Quản lý toàn bộ kiểm thử cho danh mục sản phẩm (Product Catalog):
> 
> - Ở kịch bản **K1 (@smoke)**: Chúng ta kiểm tra mã HTTP 200, khẳng định phản hồi là một mảng JSON không rỗng và kiểm tra tính hợp lệ của Schema dữ liệu thông qua các Fuzzy Matchers như `#number`, `#string`.
> - Ở kịch bản **K2 (@data-driven)**: Chúng ta sử dụng `Scenario Outline` cùng bảng `Examples` để kiểm thử 3 ca: ca hợp lệ chuẩn mực (ID 1), ca phát hiện khiếm khuyết giá tiền bị đổi thành chuỗi (ID 2), và ca biên truy vấn ID không tồn tại (ID 9999).
> 
> **2. File thứ hai là `auth-cart-checkout.feature`:** Đây là kịch bản **K3 (@e2e)** mô phỏng trọn vẹn chuỗi mua sắm phức tạp của người dùng qua 7 bước liên hoàn:
> 
> - Điểm đặc biệt là Karate cho phép sinh dữ liệu động bằng Java runtime: tạo email ngẫu nhiên theo timestamp để đảm bảo tính độc lập tuyệt đối giữa các lần chạy, tránh bị khóa tài khoản.
> - Kế tiếp, kịch bản trích xuất `authToken` từ phản hồi đăng nhập, tự động gắn vào Header `Bearer Token` cho các bước Thêm giỏ hàng, Thanh toán (Checkout) và Đối soát lịch sử đơn hàng.
> - Cuối file là một ca kiểm thử bảo mật (**Security Negative Test**): đảm bảo API giỏ hàng phải chặn đứng mã lỗi 401 Unauthorized nếu không có token hợp lệ."*

### **Phân đoạn 1. KIỂM TRA SẴN SÀNG & THIẾT LẬP MÔI TRƯỜNG**

#### 1. Thao tác hiển thị màn hình:

- Bố cục màn hình: Nửa trái mở VS Code (file `tests/karate/src/test/java/eshop/products.feature`), nửa phải mở Terminal.
- Tại Terminal, chạy lệnh kiểm tra kết nối tới SUT EShop:
    
    ```
    bash
    
    curl-I http://localhost:3000/api/products
    ```
    
- Dừng 1 giây để người xem thấy dòng phản hồi `HTTP/1.1 200 OK`.

#### 2. Lời thoại thuyết minh (Script):

> *"Bây giờ, mình sẽ tiến hành thực thi và phân tích kết quả kiểm thử bộ đôi kịch bản K1 và K2 trực tiếp trên terminal.
> 
> 
> Trước tiên, mình cần kiểm tra tính sẵn sàng của hệ thống Backend SUT EShop đang chạy trên cổng 3000 thông qua lệnh curl: `curl -I http://localhost:3000/api/products`
> 
> Máy chủ phản hồi mã trạng thái HTTP 200 OK. Môi trường kiểm thử đã hoàn toàn sẵn sàng!"*
> 

### **PHÂN ĐOẠN 4.2: THỰC THI LƯỢT 1 — BASELINE TEST K1 & K2 (PASS 100%)**

#### 1. Thao tác hiển thị màn hình:

- Tại Terminal, di chuyển vào thư mục kiểm thử Karate và kích hoạt lệnh thực thi:
    
    ```
    bash
    
    cd tests/karate
    mvn test -Dkarate.options="classpath:eshop/products.feature"
    ```
    
- Chờ Maven biên dịch và chạy qua JUnit 5 (khoảng 2–3 giây).
- Khi kết quả in ra, cuộn chậm terminal:
    - Dừng lại tại phần **HTTP Wire Logs** (các dòng có tiền tố `1 > GET` và `1 < 200 OK` do `logback-test.xml` in ra).
    - Dừng lại ở kết quả từng kịch bản: K1 (`Get all products returns a valid array and schema`) và 3 ca kiểm thử của K2 (`Scenario Outline`).
    - Dừng lại ở dòng tổng kết cuối cùng: `BUILD SUCCESS` (Scenarios: 4 passed, 0 failed).

#### 2. Lời thoại thuyết minh (Script):

> *"Tại thư mục `tests/karate`, mình kích hoạt bộ kiểm thử bằng Maven CLI: `mvn test -Dkarate.options="classpath:eshop/products.feature"`
> 
> 
> Quá trình chạy đã hoàn tất! Hãy cùng phân tích nhật ký thực thi trên màn hình:
> 
> - **Thứ nhất, đối với Kịch bản K1 (@smoke):** Nhờ cấu hình `logback-test.xml`, Karate hiển thị minh bạch toàn bộ HTTP Wire Logs. Request gửi đi là `GET /api/products`, server phản hồi HTTP 200 OK kèm mảng danh mục sản phẩm. Checkpoint `match response == '#[]'` và điều kiện `assert response.length > 0` đều vượt qua thành công. Đặc biệt, schema của phần tử đầu tiên đã được kiểm chứng chuẩn xác từng kiểu dữ liệu: `id` là số, `name` là chuỗi, `price` là số.
> - **Thứ hai, đối với Kịch bản K2 (@data-driven):** Karate tự động thực thi 3 vòng lặp tương ứng với 3 ca kiểm thử:
>     - *Ca ID = 1 (iPhone 15 Pro Max):* Happy Path chuẩn mực, giá trị `price` là số nguyên `30000000`, khớp với matcher `#number`.
>     - *Ca ID = 2 (Samsung S24 Ultra):* Karate ghi nhận trường `price` bị chuyển thành chuỗi `"28000000"`. Đây chính là **Khiếm khuyết nghiệp vụ số 1 (Discrepancy 1)** của backend EShop. Kịch bản của nhóm ghi nhận trung thực bằng matcher `#string` thay vì cố tình sửa dữ liệu để ép xanh.
>     - *Ca ID = 9999 (Ca biên - Boundary):* Khi truy vấn sản phẩm không tồn tại, backend SUT trả về HTTP 200 kèm một object rỗng `{}` thay vì mã 404 Not Found. Kịch bản K2 ghi nhận trung thực **Khiếm khuyết nghiệp vụ số 2 (Discrepancy 2)**.
> 
> Kết quả: **Toàn bộ 4 Scenarios đều PASSED 100%**, với thời gian thực thi cực nhanh, chỉ mất chưa tới 40 mili-giây!"*
> 

#### **PHÂN ĐOẠN 4.3: CHẠY KỊCH BẢN K3 — WORKFLOW E2E MUA HÀNG & BẢO MẬT (06:40 – 07:35)**

#### 1. Thao tác hiển thị màn hình:

- Tại Terminal, chạy kịch bản K3:
    
    ```
    bash
    
    mvn test -D karate.options="classpath:eshop/auth-cart-checkout.feature"
    ```
    
- Khi log chạy qua, cuộn chậm terminal để chỉ rõ các bước chuyển giao dữ liệu (State Sharing):
    - Dòng tạo email: `karate_k3_<timestamp>@eshop.com`.
    - Dòng response chứa JWT: `token: "eyJhbGciOi..."`.
    - Dòng request giỏ hàng có Header: `Authorization: Bearer eyJhbGci...`.
    - Dòng checkout trả về `orderId`.
    - Dòng `GET /api/cart` không token bị trả về `status: 401`.
- Dừng ở thông báo `BUILD SUCCESS` (2 scenarios passed).

#### 2. Lời thoại thuyết minh (Script):

> *"Tiếp theo là phần thử thách phức tạp nhất: **Kịch bản K3 — Chuỗi mua sắm E2E có xác thực và bảo mật**. Mình chạy lệnh: `mvn test -Dkarate.options="classpath:eshop/auth-cart-checkout.feature"`
> 
> 
> *(Chỉ chuột vào từng bước trên log terminal)*
> 
> Đây chính là nơi sức mạnh của Karate được thể hiện vượt trội so với các công cụ kiểm thử thông thường:
> 
> - **Bước 1 & 2:** Karate khởi tạo một tài khoản mới tinh với email timestamp động, sau đó đăng nhập và trích xuất chuỗi JWT Token lưu vào biến `authToken`.
> - **Bước 3 & 4:** Karate lấy danh mục sản phẩm, tự động lấy `id`, `name`, `price` của món hàng đầu tiên và gửi request `POST /api/cart` với Header `Authorization: Bearer`.
> - **Bước 5 & 6:** Sau khi xác minh giỏ hàng chứa đúng món hàng vừa thêm bằng `contains deep`, kịch bản thực hiện `POST /api/checkout` và trích xuất `orderId` vừa sinh ra.
> - **Bước 7:** Gọi `GET /api/orders/my-orders` để đối soát đơn hàng trong lịch sử, kiểm tra trạng thái đơn hàng là `pending` và địa chỉ giao hàng khớp 100%.
> - **Kịch bản Bảo mật:** Tiếp ngay sau đó, kịch bản Negative Test gọi vào giỏ hàng mà không truyền Token, Karate xác nhận server trả về chính xác HTTP 401 Unauthorized.
> 
> Toàn bộ 7 bước nghiệp vụ liên hoàn cùng ca kiểm thử bảo mật đã **PASSED trọn vẹn**, chứng minh khả năng duy trì trạng thái (State Management) cực kỳ mạnh mẽ của Karate mà không cần viết một dòng mã Java phức tạp nào!"*
> 

---

#### **PHÂN ĐOẠN 4.4: MINH HỌA SPECIFICATION TEST BẮT LỖI SAI LỆCH ĐẶC TẢ (07:15 – 07:50)**

#### 1. Thao tác hiển thị màn hình:

- Chuyển sang cửa sổ VS Code, mở `products.feature`.
- Cuộn xuống dòng 44 (Ca ID = 9999).
- Sửa giá trị `expectedStatus` từ `200` thành `404` (áp chuẩn RESTful). Nhấn `Ctrl + S`.
- Chuyển sang Terminal, chạy lại lệnh:
    
    ```bash
    mvn test -Dkarate.options="classpath:eshop/products.feature"
    ```
    
- Dừng hình khi terminal xuất hiện thông báo lỗi màu đỏ rực. Trỏ chuột highlight vào dòng log:
    
    ```text
    status code was: 200, expected: 404, response: {}
    BUILD FAILURE
    ```
    
- Chuyển lại VS Code, nhấn `Ctrl + Z` hoàn nguyên về `200`, nhấn `Ctrl + S`.
- **Thao tác quan trọng tại Terminal:** Chạy lại toàn bộ test suite để nạp lại baseline sạch:
    
    ```bash
    mvn test
    ```
    
- Quan sát thông báo: **`BUILD SUCCESS`** (Cả 2 features, 6 scenarios đều Passed 100%).

#### 2. Lời thoại thuyết minh (Script):

> *"Để làm rõ hơn sự khác biệt giữa Characterization Test và Specification Test:
> 
> Tại dòng 44 của kịch bản K2, mình sẽ chuyển đổi ca ID = 9999 từ việc ghi nhận hành vi hiện tại sang một **Specification Test chuẩn mực**: sửa `expectedStatus` từ `200` thành `404` theo đúng tài liệu thiết kế RESTful.
> 
> Mình lưu file và kích hoạt kiểm thử: `mvn test -Dkarate.options="classpath:eshop/products.feature"`
> 
> *(Chỉ chuột vào màn hình)* Ngay lập tức, Maven dừng tiến trình và báo **BUILD FAILURE**! Dòng log chỉ rõ: `status code was: 200, expected: 404, response: {}`.
> 
> Thử nghiệm này khẳng định: Bộ test Karate phát hiện rất nhạy bén khi hành vi hệ thống bị lệch khỏi kỳ vọng đặc tả. Khi chúng ta siết chặt các ràng buộc kỹ thuật, kịch bản sẽ bắt trọn lỗi của Backend và ngăn chặn việc lọt lỗi ra bản phát hành.
> 
> Bây giờ, mình hoàn nguyên kỳ vọng về `200` để giữ toàn vẹn baseline, và chạy lại lệnh `mvn test` toàn bộ suite để hệ thống nạp lại trạng thái xanh sạch 100%."*
> 

---

#### **PHÂN ĐOẠN 4.5: TRỰC QUAN HÓA TOÀN BỘ TRÊN BÁO CÁO KARATE HTML (07:50 – 08:30)**

#### 1. Thao tác hiển thị màn hình:

- Chuyển sang trình duyệt Google Chrome (toàn màn hình):
    - Mở file báo cáo tổng thể: `tests/karate/target/karate-reports/karate-summary.html`.
    - Trỏ chuột vào chỉ số: **2 Features, 6 Scenarios Passed 100%, 0 Failed**.
    - Nhấp mở `eshop.products.html`: Cuộn xem các step xanh lá, mở rộng xem trường `"price": "28000000"` ở ca ID = 2 và `{}` ở ca ID = 9999.
    - Nhấp chuyển sang `eshop.auth-cart-checkout.html`: Mở rộng xem chuỗi Request/Response của bước đăng nhập lấy JWT và bước thanh toán đơn hàng.

#### 2. Lời thoại thuyết minh (Script):

> *"Sau khi toàn bộ suite đã hoàn tất, chúng ta hãy cùng chiêm ngưỡng báo cáo HTML độc lập do chính Karate tự động sinh ra tại `karate-summary.html`:
> 
> - Trang tổng quan ghi nhận trọn vẹn cả 2 feature files (`products` và `auth-cart-checkout`), **100% Passed trên toàn bộ 6 scenarios**, với tổng thời gian thực thi của toàn bộ suite chỉ khoảng 350 mili-giây.
> - Khi mở chi tiết `eshop.products.html`: Từng bước Gherkin đều có màu xanh lục trực quan. Mọi dữ liệu JSON payload đều được format rõ ràng, lưu giữ bằng chứng cụ thể về 2 điểm sai lệch đặc tả của SUT để làm việc với đội ngũ Backend Dev.
> - Khi chuyển sang `eshop.auth-cart-checkout.html`: Chúng ta có thể kiểm tra chi tiết toàn bộ HTTP Wire Logs từ token JWT cho đến mã đơn hàng vừa tạo.
> 
> Báo cáo này chính là **Bằng chứng kiểm thử (Test Evidence)** độc lập và minh bạch nhất, sẵn sàng đính kèm trực tiếp vào ticket báo cáo lỗi."*

---

## IV. Tổng kết & Đánh giá Cân bằng

#### **PHÂN ĐOẠN 5.1: KẾT QUẢ THỰC NGHIỆM & KHIẾM KHUYẾT SUT (08:30 – 09:00)**

#### 1. Thao tác hiển thị màn hình:

- Chuyển lại màn hình Slide 10: Hiển thị bảng tổng hợp kết quả HTML và 2 khiếm khuyết được phát hiện của SUT EShop.

#### 2. Lời thoại thuyết minh (Script):

> *"Quay trở lại với Slide 10, mình xin tổng kết các kết quả thực nghiệm đạt được:
> 
> Thông qua việc kết hợp các kịch bản K1, K2 và K3, nhóm đã thiết lập được một bộ kiểm thử tự động hóa toàn diện cho EShop.
> 
> Bộ test không chỉ xác nhận tính sẵn sàng của hệ thống, mà còn lập hồ sơ đối soát cụ thể cho 2 khiếm khuyết thực tế:
> 1. Trường giá tiền bị ép kiểu thành chuỗi ở các ID số chẵn.
> 2. Endpoint truy vấn ID không tồn tại phản hồi HTTP 200 kèm object rỗng thay vì mã chuẩn 404 Not Found."*

---

#### **PHÂN ĐOẠN 5.2: MÔ HÌNH BỔ TRỢ ĐA TẦNG & CÁC HẠN CHẾ THỰC TẾ (09:00 – 09:35)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 11:
    - Bên trái: Sơ đồ phối hợp bổ trợ 3 công cụ (Postman $\leftrightarrow$ Pact $\leftrightarrow$ Karate).
    - Bên phải: 4 hạn chế thực tế của Karate Framework cần lưu ý.

#### 2. Lời thoại thuyết minh (Script):

> *"Từ những trải nghiệm thực tế, nhóm nhận thấy mỗi công cụ trong đề tài đều có vị trí bổ trợ riêng trong một chiến lược kiểm thử đa tầng:
> - **Postman** rất tối ưu cho giai đoạn khám phá ban đầu và debug nhanh từng endpoint.
> - **Pact** tập trung giải quyết bài toán kiểm thử hợp đồng, bảo đảm tính tương thích giữa các microservices.
> - Còn **Karate Framework** phát huy thế mạnh lớn nhất ở tầng kiểm thử hồi quy tự động và kiểm thử chuỗi nghiệp vụ có trạng thái tích hợp vào CI/CD.
> 
> Tuy nhiên, một cách khách quan, Karate cũng có những **hạn chế thực tế** mà các đội ngũ kỹ thuật cần cân nhắc:
> - Framework đòi hỏi môi trường chạy Java và công cụ Maven.
> - Cú pháp DSL riêng biệt cần thời gian làm quen và sẽ khó debug hơn so với viết mã Java hay JavaScript thuần khi gặp các tình huống ngoại lệ phức tạp.
> - Khả năng hỗ trợ trên các IDE hiện tại chủ yếu phụ thuộc vào extension của bên thứ ba, và công cụ không hỗ trợ tính năng tự động ghi nhận (Record) thao tác mạng trực tiếp."*

---

#### **PHÂN ĐOẠN 5.3: TỔNG KẾT, CẢM ƠN & KẾT THÚC VIDEO (09:35 – 10:00)**

#### 1. Thao tác hiển thị màn hình:

- Chiếu Slide 12: Tổng kết & Cảm ơn.
- Chuyển webcam sang toàn màn hình (Full Screen), hiển thị người trình bày chào kết thúc.

#### 2. Lời thoại thuyết minh (Script):

> *"Tóm lại, bộ ba kịch bản K1, K2 và K3 đã chứng minh Karate Framework là một giải pháp kiểm thử API bằng mã nguồn mạnh mẽ, tinh gọn và rất thiết thực cho các dự án phần mềm hiện đại.
> 
> Toàn bộ mã nguồn kiểm thử và tài liệu kỹ thuật đã được nhóm lưu trữ đầy đủ trong thư mục `tests/karate/`.
> 
> Phần trình bày của mình về Karate Framework đến đây là kết thúc. Xin chân thành cảm ơn Thầy và tất cả các bạn đã chú ý lắng nghe và theo dõi. Rất mong nhận được những đóng góp và câu hỏi thảo luận từ Thầy và các bạn. Xin kính chào và hẹn gặp lại!"*