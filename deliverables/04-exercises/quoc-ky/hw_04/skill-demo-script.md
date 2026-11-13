# KỊCH BẢN CHI TIẾT VIDEO TRÌNH BÀY AGENT SKILL (HW04)

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Agent Skill:** `playwright-automation-coach`  
> **Tính năng demo:** FR-02 (Đăng nhập & Khóa tài khoản)  

---

## TỔNG QUAN CHIẾN LƯỢC TRÌNH BÀY

1. **Phần 1: Giới thiệu Tổng quan về Agent Skill (Skill Overview)**
   - Triết lý cốt lõi: *Reviewer Gatekeeper Protocol* (AI-first có kỷ luật, không phải hộp đen).
   - Quy trình 9 giai đoạn (9-Phase Staged Workflow).
   - Hệ sinh thái công cụ bổ trợ: `scripts/`, `references/`, `assets/`.
2. **Phần 2: Thực thi Demo từng Phase (Live Walkthrough trên FR-02)**
   - Đi tuần tự từ Phase 1 đến Phase 9.
   - Mỗi phase gồm: **Thao tác cần thực hiện** và **Nội dung nói trong video** (Mục đích $\rightarrow$ AI làm gì $\rightarrow$ Con người review gì $\rightarrow$ Kết quả đạt được).
   - **Spotlight Student Fix:** Thuyết minh lỗi Stateful Interference (`45ced00`) và False Green Compromise (`86d8124`) được lồng ghép trực tiếp vào **Phase 6**.

---

## PHẦN 1: GIỚI THIỆU TỔNG QUAN VỀ AGENT SKILL (SKILL OVERVIEW)

### MỤC 1.1: TRIẾT LÝ VẬN HÀNH & BẢN CHẤT CỦA SKILL

* **Thao tác cần thực hiện:**
  1. Mở VS Code, mở rộng thư mục `.agents/skills/playwright-automation-coach/`.
  2. Mở file `SKILL.md`, cuộn tới phần **Bảng phân chia vai trò (Reviewer Gatekeeper Protocol)**.

* **Nội dung nói trong video:**
  > "Kính thưa Thầy/Cô, trong bài tập HW04 về Web Automation Testing, nếu chúng ta chỉ đưa một yêu cầu chung chung cho AI như 'hãy viết toàn bộ test script cho tính năng này', AI sẽ trở thành một 'hộp đen' sinh code rất mất kiểm soát — nó thường hardcode dữ liệu, dùng selector CSS dễ gãy, dùng sleep cố định và không biết cách ly dữ liệu.
  > 
  > Để khắc phục triệt để vấn đề này, em đã xây dựng Agent Skill **`playwright-automation-coach`**.
  > 
  > Bản chất của skill này là triển khai mô hình **Reviewer Gatekeeper Protocol (Người gác cổng)**:
  > - AI không bao giờ được tự tiện viết một mạch từ đầu đến cuối, mà bị bắt buộc phải hoạt động tuần tự qua từng giai đoạn và tuân thủ nguyên tắc **'Hỏi trước khi áp dụng' (Ask-Before-Apply)**. Mọi đề xuất tạo file, sửa code hay chạy lệnh đều phải được giải thích trước.
  > - Sinh viên đóng vai trò là Gatekeeper: Trực tiếp thẩm định tại mỗi Checkpoint, phản biện các sai sót của AI, sửa đổi mã nguồn và chịu trách nhiệm cao nhất về kết quả kiểm thử."

### MỤC 1.2: QUY TRÌNH HOẠT ĐỘNG (WORKFLOW 9 GIAI ĐOẠN)

* **Thao tác cần thực hiện:**
  1. Mở file `references/phases.md` hoặc sơ đồ Mermaid trong `SKILL.md`.
  2. Dùng chuột chỉ lần lượt qua 4 chặng của quy trình.

* **Nội dung nói trong video:**
  > "Về mặt quy trình (Workflow), skill không thực hiện ngẫu nhiên mà dẫn dắt quá trình tự động hóa qua **9 giai đoạn kế thừa chặt chẽ**, được chia thành 4 chặng logic:
  > 
  > - **Chặng 1: Chuẩn bị & Bóc tách Dữ liệu (Phase 1, 2, 3):** Bắt đầu từ việc thiết lập môi trường SUT local, AI phân tích bảng test case HW02 để sinh viên chọn lọc ra danh sách $\ge 12$ ca kiểm thử, sau đó bóc tách 100% dữ liệu ra file JSON độc lập theo mô hình Data-driven.
  > - **Chặng 2: Xây dựng Mã nguồn Kiểm thử (Phase 4):** AI sinh bản thảo (AI Draft) cho Page Object Model và Test Spec Playwright, tuân thủ tiêu chuẩn Semantic Locators và phối hợp $\ge 3$ kiểu assertion khác nhau.
  > - **Chặng 3: Thực thi Đa Trình Duyệt & Phản biện Con người (Phase 5, 6):** Thực thi 9 lượt chạy thực tế trên Chromium, Firefox, WebKit để xuất báo cáo HTML mang danh tính sinh viên. Ngay sau đó, sinh viên dừng lại rà soát (Human Review), chỉ ra các lỗi sai của AI, viết bản sửa lỗi (`fix`) và lập báo cáo Gap Analysis.
  > - **Chặng 4: Quản lý Lỗi, Lịch sử Git & Thẩm định Đóng gói (Phase 7, 8, 9):** Phân định lỗi SUT thật để mở GitHub Issues, đảm bảo lịch sử Git có $\ge 8$ commit sửa test rõ ràng, và dùng công cụ tự động để thẩm định toàn bộ gói bài nộp."

### MỤC 1.3: CÁC THÀNH PHẦN BỔ TRỢ TRONG SKILL & GIẢI THÍCH VAI TRÒ

* **Thao tác cần thực hiện:**
  1. Lần lượt mở và chỉ vào 3 thư mục con bên trong skill: `scripts/`, `references/`, và `assets/`.
  2. Mở file mã nguồn tương ứng khi nhắc đến từng thành phần.

* **Nội dung nói trong video:**
  > "Skill không chỉ là một tài liệu lý thuyết, mà được cấu thành từ một **hộp công cụ kỹ thuật hoàn chỉnh** gồm 3 nhóm thành phần bổ trợ chính:
  > 
  > **Thứ nhất là Thư mục Công cụ Tự động (`scripts/`):**
  > - File `tc_to_json.py`: Đây là script Python giúp tự động hóa việc đọc các bảng Markdown Test Case từ HW02 và chuyển đổi thành các file JSON chuẩn schema. Script này giúp bóc tách trường `input` và gom toàn bộ kết quả kỳ vọng vào object `expected`, giúp loại bỏ hoàn toàn việc nhập liệu thủ công dễ sai sót.
  > - File `check_requirements.py`: Đây là 'Quality Gate' nội bộ. Một script thẩm định tự động kiểm tra quét toàn diện 100% điều kiện cứng của đề bài: từ số lượng test case, cấu trúc data-driven, sự hiện diện của $\ge 3$ loại assertion, đủ 9 báo cáo HTML với metadata `Run by: 23120138` và timestamp ISO, cho đến việc đếm số commit sửa file `.spec.ts` của chính tác giả.
  > 
  > **Thứ hai là Thư viện Tri thức Tham chiếu (`references/`):**
  > - File `phases.md`: Quy định chi tiết mục tiêu, đầu vào, đầu ra và tiêu chí vượt qua của từng Checkpoint trong 9 phase.
  > - File `review-checklist.md`: 5 tiêu chuẩn vàng giúp sinh viên bắt lỗi AI: kiểm tra selector bền vững, loại bỏ sleep cố định, đa dạng assertion, cô lập dữ liệu người dùng và đối chiếu đặc tả SRS.
  > - File `assertion-patterns.md` & `selector-and-wait-rules.md`: Định hình chuẩn kỹ thuật Playwright: ưu tiên dùng `getByRole`, `getByLabel` thay cho CSS selector dễ vỡ; thay `waitForTimeout` bằng Web-first assertions tự động retry; kết hợp đa dạng các nhóm assertion URL, Text, Visibility và Network response.
  > - File `eshop-sut.md`: Cung cấp tri thức đặc thù về hệ thống SUT EShop mà AI thông thường không biết: ví dụ như đặc điểm giỏ hàng chỉ lưu ở React state chứ không qua backend API, sự sai lệch giữa mã nguồn khóa tài khoản 180 giây so với SRS 30 giây, và các cổng dịch vụ local.
  > - File `test-selection.md`: Hướng dẫn phân loại testability theo 3 trạng thái (`automate`, `automate_expected_failure`, `blocked_deferred`) và 3 tầng kiểm thử (`ui_e2e`, `api`, `integration`).
  > 
  > **Thứ ba là Thư viện Bản mẫu Chuẩn hóa (`assets/`):**
  > - File `playwright.config.ts`: Cấu hình mẫu sẵn cho 3 trình duyệt, thiết lập tuần tự `workers: 1`, tắt `retries` để không che giấu lỗi flaky, và nhúng mã số sinh viên vào tiêu đề báo cáo HTML.
  > - File `fixtures.ts`: Chứa các hàm tiện ích backend quan trọng như `registerFreshUser()` giúp tạo người dùng mới độc lập cho mỗi test case (tránh bị kẹt bộ đếm khóa tài khoản), hay hàm xóa sạch coupon sau khi test.
  > - File `run-all.mjs`: Bộ điều phối chạy tuần tự 9 browser runs và đồng bộ timestamp phục vụ báo cáo.
  > - File `features.json`: Bản đồ định tuyến ánh xạ giữa mã tính năng, cổng dịch vụ, file data JSON và file test spec."

---

## PHẦN 2: THỰC THI DEMO CHI TIẾT TỪNG PHASE (TRÊN TÍNH NĂNG FR-02)

---

### PHASE 1: Phạm vi & Môi trường kiểm thử (Scope & Environment)
* **Thao tác cần thực hiện:**
  1. Mở Terminal, gõ `curl -I http://localhost:5173` và `curl -I http://localhost:3000` (hoặc mở trình duyệt thấy trang EShop đang chạy).
  2. Mở file `.env` trên VS Code, chỉ chuột vào các biến `BASE_URL`, `API_URL` và `STUDENT_ID=23120138`.
* **Nội dung nói trong video:**
  > - **Mục đích:** Thiết lập môi trường thực thi cục bộ cho SUT EShop và định cấu hình các biến môi trường cần thiết, tránh hardcode URL trong mã nguồn.
  > - **AI sẽ làm gì:** Cung cấp template `.env.example`, hướng dẫn cấu hình biến môi trường và kiểm tra kết nối tới các dịch vụ.
  > - **Con người review gì:** Trực tiếp khởi động SUT bằng script `./run_servers.sh`; xác nhận các cổng Web `:5173`, Admin `:5174`, API `:3000` đang hoạt động ổn định; đảm bảo tính năng FR-02 không bị chọn trùng với thành viên khác trong nhóm.
  > - **Kết quả đạt được:** File `.env` hoàn chỉnh, hệ sinh thái SUT sẵn sàng cho việc kiểm thử tự động.

---

### PHASE 2: Lựa chọn Test Case để Tự động hóa (Test Case Selection)
* **Thao tác cần thực hiện:**
  1. Mở file `docs/main-report.md`, cuộn tới bảng danh sách 24 test case của FR-02 (`TC_FR02_01` $\rightarrow$ `TC_FR02_24`).
  2. Chỉ chuột vào cột phân loại `automation_decision` (`automate`, `automate_expected_failure`).
* **Nội dung nói trong video:**
  > - **Mục đích:** Tuyển chọn danh sách $\ge 12$ test case từ HW02, phân loại rõ ràng tính khả thi kiểm thử (Testability) và phân tầng kiểm thử (`ui_e2e`, `api`, `integration`).
  > - **AI sẽ làm gì:** Đọc bảng test case từ `../hw_02/Main_Report.md`, phân tích tài liệu đặc tả SRS và đề xuất phân loại theo 3 trạng thái: `automate` (kỳ vọng Pass), `automate_expected_failure` (kỳ vọng Fail do lỗi SUT), và `blocked_deferred`.
  > - **Con người review gì:** Đóng vai trò Gatekeeper: Kiểm tra tính bao phủ (đủ 4 nhóm: positive, negative, boundary và edge cases). Đặc biệt áp dụng nguyên tắc: *Test case dù SUT có lỗi (như lỗi khóa 180s thay vì 30s) thì vẫn bắt buộc phải tự động hóa và gắn nhãn `automate_expected_failure` để phản ánh đúng lỗi phần mềm, tuyệt đối không được bỏ qua*.
  > - **Kết quả đạt được:** Danh sách toàn vẹn 24 test case của FR-02 được sinh viên phê duyệt Checkpoint 2.

---

### PHASE 3: Tách dữ liệu kiểm thử (Test Data Files - Data Driven)
* **Thao tác cần thực hiện:**
  1. Mở Terminal, chạy lệnh trích xuất:
     ```bash
     python3 .agents/skills/playwright-automation-coach/scripts/tc_to_json.py --fr FR-02
     ```
  2. Mở file `data/fr02-login.json` trên VS Code, cuộn lướt qua một số bản ghi và chỉ vào cấu trúc object `expected`.
* **Nội dung nói trong video:**
  > - **Mục đích:** Tách rời 100% dữ liệu kiểm thử ra khỏi mã nguồn test script, phục vụ kiểm thử hướng dữ liệu (Data-driven testing).
  > - **AI sẽ làm gì:** Sử dụng script `tc_to_json.py` để bóc tách bảng Markdown thành file JSON chuẩn schema: gồm ID, title, input và gom toàn bộ kết quả mong đợi vào object `expected`.
  > - **Con người review gì:** Rà soát tính hợp lệ của JSON; đảm bảo không nhúng CSS selector thô hay mã Playwright vào dữ liệu; đối chiếu các giá trị `expected` với đặc tả SRS gốc thay vì chép theo hành vi sai của ứng dụng.
  > - **Kết quả đạt được:** File `data/fr02-login.json` hoàn chỉnh với 24 test case độc lập.

---

### PHASE 4: Sinh mã nguồn Test Script & Page Object (Script Generation)
* **Thao tác cần thực hiện:**
  1. Mở song song 2 file: `pages/login.page.ts` và `tests/fr02-login.spec.ts`.
  2. Chỉ vào cấu trúc vòng lặp `for (const tc of testCases)` đọc dữ liệu từ JSON.
  3. Chỉ vào các assertion: `toHaveURL`, `toBeVisible`, `toHaveText` và kiểm tra response API.
* **Nội dung nói trong video:**
  > - **Mục đích:** Xây dựng khung Page Object Model (POM) và Playwright Spec theo kiến trúc Data-Driven lặp qua dữ liệu JSON.
  > - **AI sẽ làm gì:** Đề xuất bản nháp mã nguồn (AI Draft) cho Page Object và file spec, định nghĩa các locator và các bước thao tác UI.
  > - **Con người review gì:**
  >   1. Tiêu chuẩn Locator: Ép AI dùng **Accessible Semantic Locators** (`getByRole`, `getByLabel`, `getByPlaceholder`), cấm triệt để CSS class hay XPath tuyệt đối.
  >   2. Tiêu chuẩn Assertion: Bắt buộc kết hợp **$\ge 3$ kiểu assertion khác nhau** (URL, Text, Visibility, Network response).
  >   3. Cấm tuyệt đối việc sử dụng `page.waitForTimeout()` gây flaky test.
  > - **Kết quả đạt được:** Bản thảo ban đầu được commit lên Git với thông điệp: `test(FR-02): generate AI draft for TC_FR02_01-12`.

---

### PHASE 5: Chạy Đa Trình Duyệt & Xuất Báo Cáo (Multi-Browser Runs)
* **Thao tác cần thực hiện:**
  1. Mở file `playwright.config.ts`, chỉ vào 3 project: `chromium`, `firefox`, `webkit` và cấu hình `workers: 1`, `retries: 0`.
  2. Mở Terminal, gõ lệnh chạy kiểm thử:
     ```bash
     npx playwright test tests/fr02-login.spec.ts --project=chromium
     ```
  3. Mở trình duyệt xem file `reports/fr02-login/chromium/index.html`.
  4. **Phóng to và chỉ rõ vào góc trên báo cáo:**
     - Chuỗi định danh: **`Run by: 23120138`**.
     - Chuỗi **ISO Timestamp** ghi nhận thời gian chạy thực tế trên máy.
* **Nội dung nói trong video:**
  > - **Mục đích:** Thực thi bộ kiểm thử trên cả 3 engine trình duyệt chính (Chromium, Firefox, WebKit) và xuất báo cáo HTML mang danh tính sinh viên để chứng minh tính xác thực.
  > - **AI sẽ làm gì:** Cấu hình file `playwright.config.ts`, nhúng metadata `Run by` và timestamp vào tiêu đề báo cáo HTML.
  > - **Con người review gì:** Trực tiếp bấm chạy test trên máy local; thiết lập `workers: 1` để chạy tuần tự tránh xung đột bộ đếm khóa tài khoản; tắt `retries` để phản ánh đúng tính ổn định của test; kiểm tra báo cáo HTML xuất ra không bị can thiệp thủ công.
  > - **Kết quả đạt được:** 3 bộ báo cáo HTML độc lập cho 3 trình duyệt hiển thị đầy đủ thông tin định danh `Run by: 23120138`.

---

### PHASE 6: Rà soát & Sửa lỗi do AI sinh (Review & Gap Analysis)
*(👉 ĐÂY LÀ ĐIỂM NHẤN TRỌNG TÂM: LỒNG GHÉP THUYẾT MINH LỖI CỦA AI VÀ CÁCH FIX)*
* **Thao tác cần thực hiện:**
  1. Mở Terminal, gõ lệnh xem Git diff của commit sửa lỗi:
     ```bash
     git show 45ced00
     ```
     *(Màn hình hiện rõ code đỏ bị xóa và code xanh được thêm vào)*.
  2. Mở file `docs/main-report.md` tại bảng Gap Analysis (Mục 2.2).
* **Nội dung nói trong video:**
  > - **Mục đích:** Thể hiện năng lực kiểm soát và phản biện của sinh viên; phát hiện các điểm yếu trong bản nháp của AI; trực tiếp sửa mã nguồn và lập bảng phân tích khoảng cách (Gap Analysis).
  > - **AI sẽ làm gì:** Cung cấp checklist rà soát (`review-checklist.md`) và gợi ý phân loại lỗi.
  > - **Con người review gì (THUYẾT MINH SPOTLIGHT):**
  >   > "Tại Phase 6 này, em đã trực tiếp rà soát toàn bộ code AI và phát hiện một lỗi kiến trúc cực kỳ nghiêm trọng: **Stateful Interference & Lockout Collision (Commit `45ced00`)**:
  >   > 
  >   > 1. **Lỗi của AI:** AI Draft ban đầu dùng chung một tài khoản tĩnh `test@eshop.com` cho tất cả các ca kiểm thử. Khi thực hiện các ca negative test nhập sai mật khẩu liên tiếp, tài khoản bị khóa 180 giây trên server SQLite. Hậu quả là các ca positive test ngay sau đó (dù nhập đúng mật khẩu) đều bị **FAIL OAN** với mã lỗi HTTP 403 Forbidden thay vì HTTP 200.
  >   > 2. **Nguyên nhân AI sai:** AI mặc định database luôn sạch ở mỗi lần chạy, thiếu nhận thức về 'side-effect' tích lũy trên server đối với các tính năng có lưu trạng thái như bộ đếm đăng nhập sai.
  >   > 3. **Hậu quả nếu không sửa:** Test suite bị flaky, các test case bị phụ thuộc lẫn nhau, vi phạm nguyên tắc độc lập kiểm thử (Test Isolation).
  >   > 4. **Cách em đã sửa:** Em đã tái cấu trúc lại test suite, viết helper API `registerFreshUser()` trong `fixtures.ts`. Trước mỗi test case, helper này tự động tạo một user mới với email ngẫu nhiên kèm UUID, cô lập hoàn toàn bộ đếm và trạng thái khóa giữa các ca kiểm thử.
  >   > 5. **Bên cạnh đó (Commit `86d8124`):** Em còn phát hiện AI thỏa hiệp (False Green) khi tự ý giảm số lần nhập sai từ 3 xuống 2 để test pass theo bug của server. Em đã kiên quyết khôi phục gửi đủ 3 lần sai theo đúng đặc tả SRS để bắt trọn bug của SUT."
  > - **Kết quả đạt được:** Mã nguồn test ổn định 100%, commit fix riêng biệt `fix(FR-02): replace fragile locators and isolate users via api helper` và bảng Gap Analysis đầy đủ trong báo cáo.

---

### PHASE 7: Phân định Lỗi & Báo cáo Bug SUT (Defects & Bug Reports)
* **Thao tác cần thực hiện:**
  1. Mở file `docs/bug-report.md` trên VS Code.
  2. Mở trình duyệt sang trang GitHub Issues của repo, chỉ vào Issue lỗi khóa tài khoản 180s kèm ảnh chụp bằng chứng.
* **Nội dung nói trong video:**
  > - **Mục đích:** Phân định rõ ràng giữa lỗi do script test viết sai với lỗi thật của ứng dụng EShop theo tài liệu SRS; ghi nhận bug lên GitHub Issues.
  > - **AI sẽ làm gì:** Hỗ trợ soạn thảo khung mô tả bug theo định dạng chuẩn Markdown.
  > - **Con người review gì:** Trực tiếp đối chiếu hành vi thực tế của SUT với tài liệu đặc tả `specs/system_requirements_specification.md`. Xác nhận lỗi `BUG-FR02-01` (SUT khóa tài khoản 180 giây trong khi SRS quy định chỉ phạt 30 giây). Giữ nguyên kết quả mong đợi theo SRS để test fail và ghi nhận bug, tuyệt đối không sửa test để che giấu lỗi.
  > - **Kết quả đạt được:** File `docs/bug-report.md` và các GitHub Issue được tạo thành công kèm ảnh chụp màn hình bằng chứng.

---

### PHASE 8: Lịch sử Git & Commit Log (Git Hygiene)
* **Thao tác cần thực hiện:**
  1. Mở Terminal, gõ lệnh:
     ```bash
     git log --author="Nguyen Quoc Ky" --pretty=format:"%h | %an | %ad | %s" --date=iso -n 10
     ```
  2. Mở file `docs/git-commit-log.txt`.
* **Nội dung nói trong video:**
  > - **Mục đích:** Minh chứng quá trình làm việc thực chất, minh bạch và đáp ứng tiêu chuẩn tối thiểu $\ge 8$ commit sửa file test (`.spec.ts`) do chính sinh viên thực hiện.
  > - **AI sẽ làm gì:** Hướng dẫn cú pháp commit chuẩn Conventional Commits (`test(...)`, `fix(...)`).
  > - **Con người review gì:** Trực tiếp thực hiện các commit, kiểm soát sự tách bạch giữa commit sinh nháp của AI (`test(...)`) và các commit sửa lỗi của sinh viên (`fix(...)`); xuất lịch sử git lọc theo tên tác giả Nguyễn Quốc Kỳ.
  > - **Kết quả đạt được:** Lịch sử Git chuẩn mực, file `docs/git-commit-log.txt` phản ánh trung thực toàn bộ tiến trình can thiệp và sửa đổi mã nguồn.

---

### PHASE 9: Đóng gói & Thẩm định Toàn diện (Packaging & Self-Assessment)
* **Thao tác cần thực hiện:**
  1. Mở Terminal, gõ lệnh chạy tool thẩm định:
     ```bash
     python3 .agents/skills/playwright-automation-coach/scripts/check_requirements.py
     ```
  2. Chỉ vào màn hình terminal hiển thị kết quả: **`ALL AUTOMATED CHECKS PASSED (100%)`**.
  3. Mở file `README.md`, chỉ vào bảng Self-Assessment Table (đạt 100/100 điểm).
* **Nội dung nói trong video:**
  > - **Mục đích:** Thẩm định tự động toàn diện mọi điều kiện cứng của đề bài trước khi đóng gói nộp bài.
  > - **AI sẽ làm gì:** Cung cấp script thẩm định tự động `check_requirements.py`.
  > - **Con người review gì:** Trực tiếp chạy script thẩm định; đối chiếu lại danh mục hồ sơ nộp bài (báo cáo Markdown, PDF, link video YouTube unlisted, link repo GitHub); tự đánh giá điểm số công tâm trên file `README.md`.
  > - **Kết quả đạt được:** 100% tiêu chí cứng đều vượt qua; gói nộp bài được đóng gói đúng định dạng `23120138_HW04_AI_Automation_100.zip`.
