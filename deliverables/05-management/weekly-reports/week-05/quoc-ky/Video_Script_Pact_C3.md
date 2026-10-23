# KỊCH BẢN THUYẾT MINH VIDEO: PACT CONTRACT TESTING (KỊCH BẢN C3)
## Chủ đề: Consumer-Driven Contract Testing với Pact JS — Kịch bản C3: Breaking Change Verification & CI/CD Deployment Gate
**Người thực hiện:** Nguyễn Quốc Kỳ (MSSV: 23120138) — Nhóm 11  
**Môn học:** Kiểm thử phần mềm — FIT@HCMUS  
**Slide tương ứng:** [Slide_Outline_Pact_C3.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/05-management/weekly-reports/week-05/quoc-ky/Slide_Outline_Pact_C3.md)  
**Thời lượng dự kiến:** ~10 – 11 phút

---

## I. Giới thiệu & Bối cảnh (00:00 – 02:30)

### **PHÂN ĐOẠN 1.1: LỜI CHÀO, GIỚI THIỆU BẢN THÂN & PHÂN CÔNG NHIỆM VỤ (00:00 – 00:30)**

- **[Visual / Khung hình]:**
    - Bật webcam toàn cảnh hoặc góc nhỏ (Picture-in-Picture).
    - Chiếu **Slide 01**: *"Seminar Kiểm thử Phần mềm: Consumer-Driven Contract Testing với Pact (Kịch bản C3 - Breaking Change Verification)"*.
    - Hiển thị thông tin nhóm: Nhóm 11 — Khoa Công nghệ Thông tin, FIT@HCMUS.
        - Nguyễn Quốc Kỳ (MSSV: 23120138): Trình bày chính, thiết kế kịch bản C3.
        - Nguyễn Hoàng Anh Tú (MSSV: 23120167): Kịch bản C1 (Consumer Test sinh hợp đồng), C2 (Provider Verify cơ bản) & Review chéo mã nguồn.
- **[Lời thoại / Voice]:**
    
    > *"Xin kính chào Thầy và tất cả các bạn! Mình tên là **Nguyễn Quốc Kỳ**, mã số sinh viên **23120138**, đại diện cho **Nhóm 11** — Khoa Công nghệ Thông tin, Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM tham gia Seminar môn Kiểm thử phần mềm với Chủ đề T06: API Testing & Contract Testing.
    > 
    > Trong đề tài Consumer-Driven Contract Testing của nhóm, bạn **Nguyễn Hoàng Anh Tú** đã hoàn thành kịch bản C1 — xây dựng Consumer Test để đóng gói hợp đồng, cũng như kịch bản C2 — thiết lập Provider Verification cơ bản và thực hiện review chéo mã nguồn.
    > 
    > Hôm nay, mình sẽ phụ trách trình bày và thực nghiệm **Kịch bản C3**: Kiểm soát tiến hóa phần mềm, mô phỏng Breaking Changes và kiểm chứng cơ chế Deployment Gate của Pact trong quy trình tích hợp liên tục CI/CD."*

---

### **PHÂN ĐOẠN 1.2: BÀI TOÁN BREAKING CHANGE & GIỚI HẠN CỦA HTTP 200 OK (00:30 – 01:10)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 02**: Bài toán thực tế trong tiến hóa phần mềm (Software Evolution).
    - Đồ họa hiển thị sự cố: Backend Developer refactor đổi tên trường `price` → `unit_price`, hoặc format tiền tệ `"30.000.000 ₫"`.
    - Minh họa góc nhìn Client: Mobile App nhận `product.price === undefined` → Tính tổng tiền giỏ hàng ra `NaN` hoặc Crash app.
- **[Lời thoại / Voice]:**
    
    > *"Trong thực tế phát triển phần mềm theo kiến trúc Microservices hay Client-Server, sự tiến hóa của hệ thống (Software Evolution) là điều tất yếu. Khi nhóm Backend tối ưu hóa cơ sở dữ liệu hoặc tái cấu trúc API, rất dễ vô tình đổi tên một trường dữ liệu — ví dụ đổi trường giá tiền `price` thành `unit_price`, hoặc tự ý format lại kiểu dữ liệu thành chuỗi để tiện hiển thị.
    > 
    > Đây chính là nguồn gốc của **Breaking Change** — những thay đổi từ phía Backend làm phá vỡ sự tương thích với ứng dụng Consumer đang chạy ổn định của người dùng ngoài thực tế.
    > 
    > Vấn đề nan giải ở đây là: Khi đổi tên trường, máy chủ Backend vẫn xử lý thành công và phản hồi mã trạng thái **HTTP 200 OK**. Nếu các bài kiểm thử API chức năng thông thường chỉ kiểm tra status code mà thiếu assertion chặt chẽ về cấu trúc payload, bài test vẫn sẽ báo PASS. Nhưng ngoài thực tế, ứng dụng di động đang mong đợi trường `price` sẽ nhận về `undefined`, khiến phép tính tổng tiền giỏ hàng bị biến thành `NaN` hoặc gây văng ứng dụng.
    > 
    > Một bài test Postman tử tế vẫn có thể viết script kiểm tra kiểu dữ liệu, nhưng câu hỏi cốt lõi là: **Ai là người định nghĩa kỳ vọng đó?** Tester tự phán đoán đơn phương hay chính Consumer đưa ra yêu cầu? Đó chính là lý do chúng ta cần đến Contract Testing."*

---

### **PHÂN ĐOẠN 1.3: CONSUMER-DRIVEN CONTRACT TESTING (CDCT) & SO SÁNH VỚI E2E (01:10 – 01:45)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 03**: Sơ đồ luồng CDCT (Consumer ↔ File Hợp đồng JSON ↔ Provider) và bảng so sánh CDCT vs E2E Testing.
- **[Lời thoại / Voice]:**
    
    > *"Phương pháp **Consumer-Driven Contract Testing (CDCT)** giải quyết triệt để bài toán này với công cụ tiêu chuẩn công nghiệp là **Pact**.
    > 
    > Khác với kiểm thử End-to-End (E2E) truyền thống vốn đòi hỏi phải dựng toàn bộ hệ thống Web, Mobile, Gateway và Database rất cồng kềnh, chạy chậm và dễ chập chờn (flaky tests), CDCT cho phép Consumer và Provider kiểm thử tính tương thích **hoàn toàn độc lập**:
    > - **Consumer là bên dẫn dắt:** Ứng dụng di động `EShopMobile` định nghĩa chính xác cấu trúc dữ liệu mà nó thực sự cần để hiển thị và đóng gói thành tệp hợp đồng JSON tiêu chuẩn (`pacts/EShopMobile-EShopBackend.json`).
    > - **Provider đối soát:** Quá trình Provider Verification sẽ phát lại (*replay*) các request trong hợp đồng trực tiếp vào Backend thật để đối soát, với tốc độ mili-giây và kết quả hoàn toàn xác định."*

---

### **PHÂN ĐOẠN 1.4: MỤC TIÊU CỦA KỊCH BẢN C3 & KHÁI NIỆM DEPLOYMENT GATE (01:45 – 02:15)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 06**: Mô hình CI/CD Pipeline có chốt chặn Provider Verification (Deployment Gate).
    - Khung ghi chú phạm vi: *Phạm vi đồ án: Local Provider Verification (Exit Code) | Hướng mở rộng công nghiệp: Pact Broker & can-i-deploy*.
- **[Lời thoại / Voice]:**
    
    > *"Mục tiêu của **Kịch bản C3** hôm nay là chứng minh cách Pact hoạt động như một **Deployment Gate** tự động: Bất kỳ bản build Backend nào làm vi phạm hợp đồng đã thỏa thuận sẽ khiến Verifier trả về mã lỗi khác 0, lập tức dừng pipeline CI/CD và từ chối triển khai lên Production.
    > 
    > Ở phạm vi đồ án này, nhóm tập trung chứng minh cơ chế gác cổng tại chỗ (Local Provider Verification). Trong quy trình công nghiệp hoàn chỉnh, cơ chế này sẽ được mở rộng kết hợp với **Pact Broker** và công cụ CLI **can-i-deploy** để đối soát ma trận phiên bản giữa các môi trường triển khai."*

---

### **PHÂN ĐOẠN 1.5: LỘ TRÌNH 2 PHƯƠNG PHÁP THỰC NGHIỆM (02:15 – 02:30)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 07**: Lộ trình 2 phương pháp demo thực nghiệm:
        - *Phương pháp 1:* Thao tác trực tiếp trên Backend SUT thật (cổng 3000) và SQLite thật.
        - *Phương pháp 2:* Bộ Runner tự động hóa CI/CD khép kín (`pact-c3-runner.js` trên cổng 3005).
- **[Lời thoại / Voice]:**
    
    > *"Phần thực nghiệm hôm nay sẽ mang đến cả hai góc nhìn:
    > - **Phương pháp 1:** Thực hiện trực tiếp trên dịch vụ backend thật của EShop đang chạy ở cổng 3000 với database SQLite thật, can thiệp mã nguồn bằng công cụ CLI để quan sát Pact bắt lỗi.
    > - **Phương pháp 2:** Sử dụng bộ Runner tự động trên cổng 3005, mô phỏng chu trình kiểm soát tự động trước khi triển khai trong pipeline CI/CD.
    > 
    > Ngay sau đây, xin mời Thầy và các bạn cùng điểm qua cấu trúc tệp hợp đồng và nguyên lý so khớp!"*

---

## II. Lý thuyết & Nguyên lý (02:30 – 03:30)

### **PHÂN ĐOẠN 2.1: GIẢI PHÁU TỆP HỢP ĐỒNG JSON, MATCHING RULES & PROVIDER STATE (02:30 – 03:00)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 04**: Trích đoạn file `pacts/EShopMobile-EShopBackend.json`, highlight 3 phần: định danh hai bên, `providerStates` và `matchingRules`.
- **[Lời thoại / Voice]:**
    
    > *"Tiêu chuẩn đối soát của chúng ta nằm ở tệp hợp đồng `EShopMobile-EShopBackend.json` do kịch bản C1 sinh ra.
    > 
    > Có 3 điểm kỹ thuật cốt lõi cần lưu ý:
    > 1. Định danh rõ Consumer là `EShopMobile` và Provider là `EShopBackend` cho endpoint `GET /api/products/1`.
    > 2. Khái niệm **Provider State** với thông điệp: `'product with ID 1 exists'`. Đây là tiền điều kiện môi trường yêu cầu Provider phải đảm bảo sản phẩm ID 1 sẵn sàng trong cơ sở dữ liệu SQLite trước khi chạy test.
    > 3. Quy tắc so khớp lỏng (**Loose Coupling Matcher**): trường `price` được gắn quy tắc `{ match: 'integer' }`. Quy định này bắt buộc Backend phải trả về trường `price` và kiểu dữ liệu phải là số nguyên để tính toán giỏ hàng.
    > 
    > Xin lưu ý rằng hợp đồng hiện tại chỉ mới đăng ký bảo vệ cho sản phẩm ID 1, đây chính là giới hạn phạm vi hợp đồng mà Consumer đã xác định."*

---

### **PHÂN ĐOẠN 2.2: PHÂN LOẠI THAY ĐỔI API & LỢI ÍCH XÓA TRƯỜNG AN TOÀN (03:00 – 03:30)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 05**: Bảng phân loại 2 nhóm: Breaking Changes (Đỏ) vs Non-breaking Changes (Xanh).
- **[Lời thoại / Voice]:**
    
    > *"Trong kiểm thử hợp đồng, chúng ta phân biệt rõ 2 nhóm thay đổi:
    > 
    > **1. Nhóm Phá Vỡ Hợp Đồng (Breaking Changes):**
    > - Đổi tên hoặc xóa trường Consumer đang dùng (ví dụ `price` → `unit_price`).
    > - Sai lệch kiểu dữ liệu: ví dụ trường `price` bị chuyển từ số nguyên sang chuỗi hiển thị `'30.000.000 ₫'`. Đây là lỗi rò rỉ định dạng giao diện vào dữ liệu API thô, khiến phép nhân tính tiền giỏ hàng bị `NaN`.
    > - Đổi mã trạng thái HTTP, xóa endpoint hoặc thêm tham số bắt buộc.
    > 
    > **2. Nhóm Thay Đổi An Toàn (Non-breaking Changes):**
    > - Bổ sung trường mới như `brand: 'Apple'`: Theo nguyên lý Postel, Pact sẽ tự động bỏ qua các trường mà Consumer không yêu cầu.
    > - **Đặc biệt, lợi ích mạnh nhất của CDCT là Xóa trường an toàn (Safe Field Removal):** Backend có thể tự tin dọn dẹp các trường dữ liệu cũ không còn dùng trong database nếu kiểm tra thấy không có Consumer nào đăng ký trong hợp đồng, loại bỏ hoàn toàn sự phỏng đoán mơ hồ.
    > 
    > Nắm vững các nguyên lý trên, ngay sau đây chúng ta sẽ bước vào phần demo thực nghiệm!"*

---

## III. Demo Thực nghiệm (03:30 – 08:30)

### 1. Phương pháp 1: Thực nghiệm Trực tiếp trên SUT Backend Thật (Cổng 3000) (03:30 – 06:45)

#### **BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG & KIỂM CHỨNG BASELINE (03:30 – 04:15)**

- **[Thao tác màn hình]:**
    - Bố cục màn hình chia đôi:
        - Nửa trái mở VS Code (`backend/server.js`).
        - Nửa phải mở 2 Terminal:
            - **Terminal 1 (Trái):** `cd backend && node server.js` (Lắng nghe cổng 3000).
            - **Terminal 2 (Phải):** `cd tests/pact`.
    - Tại Terminal 2, chạy lệnh kiểm chứng ban đầu:
        ```bash
        npm run test:provider
        ```
    - Quan sát: Terminal 1 in log truy vấn database SQLite thật, Terminal 2 in log xanh `has a matching body (OK)` $\rightarrow$ `VERIFICATION SUCCESSFUL`.
- **[Lời thoại thuyết minh]:**
    
    > *"Sau đây mình xin demo trực tiếp Phương pháp 1: Thao tác trên Backend SUT thật của EShop cổng 3000 và cơ sở dữ liệu SQLite thật.
    > 
    > Ở Terminal 1 bên trái, server backend đã sẵn sàng. Tại Terminal 2 bên phải, mình chạy lệnh đối soát ban đầu: `npm run test:provider`.
    > 
    > Pact Verifier đóng vai trò Consumer, gửi request `GET /api/products/1` thật vào server. Như các bạn thấy, Backend đã nhận request và truy vấn SQLite thật. Kết quả trả về **XANH 100%**.
    > 
    > Điều này khẳng định ở trạng thái bình thường (Baseline), Backend đáp ứng hoàn hảo hợp đồng đã ký."*

---

#### **BƯỚC 2: TIÊM LỖI #1 — ĐỔI TÊN TRƯỜNG DỮ LIỆU (04:15 – 05:05)**

- **[Thao tác màn hình]:**
    1. Tại Terminal 2, gõ lệnh đột biến:
        ```bash
        npm run demo:mutate:rename
        ```
    2. Chuyển sang màn hình VS Code, trỏ chuột vào dòng 169 file `backend/server.js`: Trường `price` đã bị đổi thành `unit_price`.
    3. Terminal 1: Bấm `Ctrl + C` và gõ lại `node server.js` để nạp code mới *(lưu ý: khi biên tập video có thể cắt gọn đoạn chờ này)*.
    4. Terminal 2: Chạy lại lệnh đối soát:
        ```bash
        npm run test:provider
        ```
    5. Dừng hình khi Pact in ra dòng thông báo lỗi màu đỏ rực. Trỏ chuột highlight vào dòng:
        ```text
        Actual map is missing the following keys: price
        ```
- **[Lời thoại thuyết minh]:**
    
    > *"Bây giờ, mình giả lập tình huống thực tế: Lập trình viên Backend tái cấu trúc mã nguồn và đổi tên trường `price` thành `unit_price`. Mình thực thi lệnh: `npm run demo:mutate:rename`.
    > 
    > Trên màn hình code, các bạn thấy trường `price` đã bị đổi thành `unit_price`. Xin lưu ý rằng API này **vẫn phản hồi mã HTTP 200 OK**.
    > 
    > Mình khởi động lại server và chạy lại đối soát: `npm run test:provider`.
    > 
    > Ngay lập tức, Pact Verifier đã **BÁO ĐỎ VÀ CHẶN ĐỨNG BẢN BUILD**! Thông báo lỗi chỉ rõ: `Actual map is missing the following keys: price`.
    > 
    > Nhờ có Pact trong pipeline CI/CD, bản build lỗi này bị chặn đứng, ngăn chặn sự cố ứng dụng di động bị crash vì `product.price === undefined`."*

---

#### **BƯỚC 3: TIÊM LỖI #2 — SAI LỆCH KIỂU DỮ LIỆU (05:05 – 05:55)**

- **[Thao tác màn hình]:**
    1. Tại Terminal 2, gõ lệnh đột biến:
        ```bash
        npm run demo:mutate:type
        ```
    2. Mở `backend/server.js`, chỉ vào dòng `price: "30.000.000 ₫"`.
    3. Terminal 1: Bấm `Ctrl + C` và gõ lại `node server.js`.
    4. Terminal 2: Chạy lại:
        ```bash
        npm run test:provider
        ```
    5. Dừng hình khi terminal xuất hiện lỗi đỏ, trỏ chuột highlight vào dòng:
        ```text
        Expected '30.000.000 ₫' (String) to be an integer number
        ```
- **[Lời thoại thuyết minh]:**
    
    > *"Tiếp theo, mình thử nghiệm dạng Breaking Change thứ hai: **Sai lệch kiểu dữ liệu**. Mình gõ: `npm run demo:mutate:type`.
    > 
    > Trong file `server.js`, lập trình viên đã tự ý định dạng giá tiền thành chuỗi hiển thị tiền tệ `'30.000.000 ₫'`.
    > 
    > Mình khởi động lại server và chạy lại kiểm chứng: `npm run test:provider`.
    > 
    > Pact Verifier một lần nữa **CHẶN ĐỨNG BẢN BUILD** với thông báo lỗi: `Expected '30.000.000 ₫' (String) to be an integer number`.
    > 
    > Ràng buộc hợp đồng quy định `price` phải là số nguyên để tính tiền giỏ hàng (`price * quantity`). Việc trả về String sẽ khiến phép nhân ra `NaN`, và Pact đã bắt trọn vẹn lỗi này."*

---

#### **BƯỚC 4: HOÀN NGUYÊN MÃ NGUỒN & ĐÁNH GIÁ PHƯƠNG PHÁP 1 (05:55 – 06:45)**

- **[Thao tác màn hình]:**
    1. Terminal 2 gõ lệnh khôi phục:
        ```bash
        npm run demo:restore
        ```
    2. Terminal 1: Restart lại `node server.js`.
    3. Terminal 2: Chạy lại đối soát:
        ```bash
        npm run test:provider
        ```
    4. Quan sát: Pact báo xanh `VERIFICATION SUCCESSFUL` trở lại 100%.
- **[Lời thoại thuyết minh]:**
    
    > *"Cuối cùng, để đưa hệ thống về trạng thái an toàn, mình khôi phục mã nguồn bằng lệnh: `npm run demo:restore`. File `server.js` được hoàn nguyên nguyên bản từ bản backup. Mình restart server và chạy lại test.
    > 
    > Kết quả: **HỆ THỐNG XANH TRỞ LẠI 100%**.
    > 
    > Qua Phương pháp 1, chúng ta thấy rõ Pact bắt lỗi rất chân thực ngay trên code và database thật của EShop.
    > 
    > Tuy nhiên, trong môi trường triển khai thực tế như **GitHub Actions hay GitLab CI**, lập trình viên không thể ngồi mở terminal ra gõ lệnh sửa code hay restart server thủ công. Mọi thứ phải diễn ra hoàn toàn tự động.
    > 
    > Vì vậy, nhóm mình đã phát triển **Phương pháp thứ hai: Bộ điều phối kiểm thử tự động (`pact-c3-runner.js`)**."*

---

### 2. Phương pháp 2: Tự Động Hóa CI/CD Bằng Stub Runner (Cổng 3005) (06:45 – 08:30)

#### **PHẦN 1: GIẢI THÍCH THIẾT KẾ KỸ THUẬT & BẢN CHẤT STUB PROVIDER (06:45 – 07:15)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 08**: Kiến trúc `pact-c3-runner.js` trên cổng 3005 và máy trạng thái `currentMode`.
- **[Lời thoại thuyết minh]:**
    
    > *"Trước khi chạy lệnh, mình xin giải thích rõ bản chất kỹ thuật của Phương pháp 2 trên Slide 08:
    > 
    > Để kiểm chứng khả năng phát hiện lỗi tự động trong CI/CD mà không gây rủi ro làm biến dạng database SQLite thật ở cổng 3000, nhóm sử dụng một Express Server điều khiển độc lập chạy trên cổng 3005.
    > 
    > **Về bản chất kỹ thuật:** Server này đóng vai trò là một **Stub Provider phục vụ kỹ thuật Fault Injection**: Nó cho phép chuyển đổi linh hoạt biến `currentMode` qua các trạng thái `BASELINE`, `MUTATION_RENAME`, `MUTATION_TYPE`, `MUTATION_NON_BREAKING` và `ROLLBACK`.
    > 
    > Mục tiêu của phương pháp này là **kiểm tra chính độ nhạy của cổng kiểm soát (Testing the Verification Gate itself)** trong một chu trình tự động khép kín chỉ với 1 câu lệnh duy nhất."*

---

#### **PHẦN 2: THỰC THI & PHÂN TÍCH NHẬT KÝ 5 PHA (07:15 – 08:00)**

- **[Thao tác màn hình]:**
    - Mở Terminal tích hợp tại thư mục `tests/pact`.
    - Gõ lệnh tự động:
        ```bash
        npm run test:c3
        ```
    - Terminal chạy và in ra từng pha. Cuộn chuột chậm rãi theo từng phần log:
        - Pha 1: Baseline Verification $\rightarrow$ Pass.
        - Pha 2A: Field Rename $\rightarrow$ Blocked (`missing required key "price"`).
        - Pha 2B: Type Mismatch $\rightarrow$ Blocked (`Expected integer but received string`).
        - Pha 2C: Non-breaking Change (thêm `brand: 'Apple'`) $\rightarrow$ Pass an toàn.
        - Pha 3: Rollback & Re-verify $\rightarrow$ Pass 100%.
- **[Lời thoại thuyết minh]:**
    
    > *"Tại thư mục `tests/pact`, mình kích hoạt toàn bộ quy trình bằng lệnh: `npm run test:c3`.
    > 
    > Hãy cùng theo dõi nhật ký thực thi trên màn hình:
    > - **Pha 1 — Baseline:** Server ở chế độ dữ liệu chuẩn `price: 30000000 [Integer]`, kết quả đối soát Pass 100%.
    > - **Pha 2A — Tiêm lỗi Đổi tên trường:** Server chuyển sang `unit_price`, Pact Verifier lập tức chặn đứng với thông báo thiếu trường `price`.
    > - **Pha 2B — Tiêm lỗi Sai kiểu:** Server trả về chuỗi tiền tệ, Pact Verifier chặn đứng vì vi phạm kiểu Integer.
    > - **Pha 2C — Thay đổi An toàn (Non-breaking):** Server bổ sung trường `brand: 'Apple'`, Pact tự động bỏ qua và cho bài test PASS an toàn theo nguyên lý Postel.
    > - **Pha 3 — Hoàn nguyên:** Server tự động trở về Baseline, hệ thống phục hồi trạng thái xanh hoàn toàn."*

---

#### **PHẦN 3: ĐỌC BẢNG TỔNG KẾT & LƯU Ý PHÁN QUYẾT BLOCKED (08:00 – 08:30)**

- **[Thao tác màn hình]:**
    - Dừng lại ở bảng `console.table(results)` hiển thị ở cuối terminal:
        ```text
        ┌─────────┬────────────────────────────────────┬────────────────┬───────────┬──────────────────────────────────┐
        │ (index) │ phase                              │ expected       │ actual    │ verdict                          │
        ├─────────┼────────────────────────────────────┼────────────────┼───────────┼──────────────────────────────────┤
        │ 0       │ 'Pha 1: Baseline'                  │ 'PASS'         │ 'PASS'    │ 'ĐẠT (Hợp đồng toàn vẹn)'        │
        │ 1       │ 'Pha 2A: Rename price->unit_price' │ 'BLOCK (FAIL)' │ 'BLOCKED' │ 'ĐẠT (Bắt đúng breaking change)' │
        │ 2       │ 'Pha 2B: Type Integer->String'     │ 'BLOCK (FAIL)' │ 'BLOCKED' │ 'ĐẠT (Bắt đúng type mismatch)'   │
        │ 3       │ 'Pha 2C: Add brand (Non-breaking)' │ 'PASS'         │ 'PASS'    │ 'ĐẠT (Tiến hóa an toàn)'         │
        │ 4       │ 'Pha 3: Rollback & Re-verify'      │ 'PASS'         │ 'PASS'    │ 'ĐẠT (Hệ thống an toàn)'         │
        └─────────┴────────────────────────────────────┴────────────────┴───────────┴──────────────────────────────────┘
        ```
- **[Lời thoại thuyết minh]:**
    
    > *"Ở cuối terminal, runner xuất ra bảng ma trận tổng hợp kết quả: Cả 5 giai đoạn đều có kết quả thực tế khớp hoàn toàn với kỳ vọng.
    > 
    > 💡 **Một lưu ý kỹ thuật chuyên sâu:** Nếu runner chỉ bắt lỗi chung chung mà không kiểm tra nội dung error log, hệ thống rất dễ gặp bẫy 'đúng kết quả nhưng sai lý do' — ví dụ server sập hoặc lỗi mạng cũng khiến bài test fail và báo BLOCKED nhầm. Trong kịch bản này, runner của nhóm đã đối soát chính xác nội dung thông báo lỗi trước khi đưa ra phán quyết ĐẠT."*

---

## IV. Tổng kết & Đánh giá Cân bằng (08:30 – 10:15)

### **PHÂN ĐOẠN 4.1: MA TRẬN KẾT QUẢ & ĐÁNH GIÁ DEPLOYMENT GATE (08:30 – 09:00)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 09**: Ma trận đánh giá kết quả kiểm thử toàn diện.
- **[Lời thoại / Voice]:**
    
    > *"Quay trở lại với Slide 09, bảng ma trận kết quả đã khẳng định:
    > - Cả 2 biến thể lỗi phá vỡ hợp đồng nguy hiểm đều bị chặn đứng thành công.
    > - Thay đổi an toàn bổ sung trường được cho phép thông qua mà không gây cản trở tiến trình phát triển.
    > - Toàn bộ quy trình diễn ra trong chưa đầy 3 giây, hoàn toàn không để lại rác dữ liệu trên hệ thống.
    > 
    > Điều này chứng minh Pact JS hoạt động hiệu quả như một Deployment Gate tự động trong pipeline CI/CD."*

---

### **PHÂN ĐOẠN 4.2: ĐÚC KẾT GIÁ TRỊ, HẠN CHẾ THỰC TẾ & HƯỚNG PHÁT TRIỂN (09:00 – 09:45)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 10**: Đúc kết giá trị, hạn chế thực tế và hướng phát triển.
- **[Lời thoại / Voice]:**
    
    > *"Từ toàn bộ quá trình nghiên cứu và thực nghiệm kịch bản C3, nhóm xin đúc kết 3 điểm quan trọng:
    > 
    > **1. Về giá trị thực tiễn:** CDCT giúp loại bỏ sự phụ thuộc vào các môi trường E2E cồng kềnh, đồng thời mang lại lợi ích lớn nhất là giúp Backend tự tin xóa các trường dữ liệu cũ không còn dùng mà không sợ làm gãy ứng dụng client.
    > 
    > **2. Về hạn chế thực tế:** Phạm vi bảo vệ của hợp đồng phụ thuộc hoàn toàn vào những gì Consumer đã đăng ký. Ví dụ hợp đồng hiện tại chỉ bảo vệ cho endpoint sản phẩm ID 1, chưa bao phủ các ID khác. Đồng thời, Provider phải duy trì các hàm Provider State đồng bộ với database thật.
    > 
    > **3. Về hướng phát triển công nghiệp:** Trong môi trường doanh nghiệp quy mô lớn, hệ thống cần được tích hợp với **Pact Broker tập trung** và sử dụng lệnh CLI **can-i-deploy** để đối soát ma trận tương thích giữa nhiều dịch vụ trước mỗi đợt phát hành lên Staging và Production."*

---

### **PHÂN ĐOẠN 4.3: TỔNG KẾT, CẢM ƠN & KẾT THÚC VIDEO (09:45 – 10:15)**

- **[Visual / Khung hình]:**
    - Chiếu **Slide 11**: Tổng kết & Cảm ơn.
    - Chuyển webcam sang toàn màn hình (Full Screen), người trình bày mỉm cười chào kết thúc.
- **[Lời thoại / Voice]:**
    
    > *"Tóm lại, Kịch bản C3 đã hoàn thành trọn vẹn mục tiêu kiểm chứng khả năng phát hiện Breaking Change và ngăn chặn lỗi phá vỡ hợp đồng của Pact JS.
    > 
    > Toàn bộ mã nguồn kiểm thử và tài liệu hướng dẫn đã được nhóm lưu trữ đầy đủ trong thư mục `tests/pact/`.
    > 
    > Phần trình bày của mình về Pact Contract Testing đến đây xin được kết thúc. Xin chân thành cảm ơn Thầy và tất cả các bạn đã chú ý lắng nghe và theo dõi. Rất mong nhận được những góp ý và câu hỏi thảo luận từ Thầy và các bạn. Xin kính chào và hẹn gặp lại!"*