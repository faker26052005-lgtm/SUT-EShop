# KỊCH BẢN CHI TIẾT VIDEO TRÌNH BÀY AGENT SKILL (HW04)

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên thực hiện:** Nguyễn Quốc Kỳ  
> **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Agent Skill:** `playwright-automation-coach`  
> **Tính năng demo:** FR-02 (Đăng nhập & Khóa tài khoản)  

---

## TỔNG QUAN CHIẾN LƯỢC TRÌNH BÀY

1. **Phần 1: Tổng quan về Agent Skill**
   - Triết lý cốt lõi: *Reviewer Gatekeeper Protocol* (AI-first có kỷ luật, không phải hộp đen).
   - Quy trình 9 giai đoạn (9-Phase Staged Workflow).
   - Cấu trúc thư mục skill và vai trò của các thành phần bổ trợ (`scripts/`, `references/`, `assets/`).
2. **Phần 2: Thực thi Demo từng Phase (Live Walkthrough trên FR-02)**
   - Đi tuần tự từ Phase 1 đến Phase 9.
   - Mỗi phase nêu rõ 4 yếu tố: **Mục đích** $\rightarrow$ **AI làm gì** $\rightarrow$ **Con người review gì** $\rightarrow$ **Kết quả đạt được (Artifact)**.
3. **Phần 3: Spotlight – Thuyết minh lỗi của AI và cách sinh viên sửa (Human Review)**
   - **Vị trí trình bày tối ưu:** Lồng ghép trực tiếp vào **Phase 6 (Review & Gap Analysis)** để mạch video liền mạch, logic và thuyết phục nhất.

---

## PHẦN 1: TỔNG QUAN VỀ AGENT SKILL (OVERALL ARCHITECTURE & WORKFLOW)

*(Thao tác màn hình: Mở VS Code tại thư mục `.agents/skills/playwright-automation-coach/`)*

### 1. Triết lý & Mục tiêu của Skill
* **Lời thoại:**
  > "Kính thưa Thầy/Cô, để giải quyết bài toán Automation Testing cho hệ thống EShop theo đúng định hướng AI-First mà không biến AI thành một 'hộp đen' sinh code mất kiểm soát, em đã xây dựng Agent Skill mang tên **`playwright-automation-coach`**.
  > 
  > Triết lý cốt lõi của skill này là **Reviewer Gatekeeper Protocol** (Mô hình Người gác cổng): AI chỉ đóng vai trò là một trợ lý kỹ thuật có kỷ luật, thực hiện từng bước tuần tự. Sinh viên là người nắm quyền kiểm soát tối cao, trực tiếp thẩm định, phê duyệt ở mỗi Checkpoint và chịu trách nhiệm toàn bộ về mã nguồn cuối cùng."

### 2. Sơ đồ Quy trình 9 Giai đoạn (9-Phase Staged Workflow)
*(Thao tác màn hình: Mở file `SKILL.md` lướt qua sơ đồ Mermaid hoặc mở `references/phases.md`)*
* **Lời thoại:**
  > "Quy trình của skill được chuẩn hóa thành 9 giai đoạn kế thừa nhau một cách chặt chẽ:
  > - **Phase 1:** Xác định Phạm vi & Thiết lập môi trường kiểm thử.
  > - **Phase 2:** Phân loại & Tuyển chọn Test Case từ HW02.
  > - **Phase 3:** Trích xuất Dữ liệu kiểm thử độc lập dạng JSON (Data-driven).
  > - **Phase 4:** Sinh mã nguồn Page Object Model và Test Spec Playwright.
  > - **Phase 5:** Thực thi kiểm thử Đa trình duyệt (Chromium, Firefox, WebKit).
  > - **Phase 6:** Sinh viên rà soát (Human Review), sửa lỗi AI và phân tích khoảng cách.
  > - **Phase 7:** Phân định lỗi SUT thật và báo cáo Bug lên GitHub Issues.
  > - **Phase 8:** Quản lý lịch sử Git minh bạch chuẩn Conventional Commits.
  > - **Phase 9:** Thẩm định tự động và đóng gói hồ sơ nộp bài."

### 3. Các thành phần bổ trợ trong Skill & Vai trò cụ thể
*(Thao tác màn hình: Mở rộng cây thư mục `.agents/skills/playwright-automation-coach/`)*
* **Lời thoại:**
  > "Để hỗ trợ quy trình vận hành trơn tru và chuẩn xác, skill được cấu trúc thành các thành phần chuyên biệt:
  > 
  > 1. **File điều phối trung tâm (`SKILL.md`):** Là bản hướng dẫn tổng thể, quy định ranh giới trách nhiệm giữa AI và sinh viên, cùng tiêu chí của 9 Checkpoint phê duyệt.
  > 
  > 2. **Thư mục Công cụ tự động (`scripts/`):**
  >    - `tc_to_json.py`: Script tự động trích xuất các bảng test case từ báo cáo HW02 thành các file JSON chuẩn cấu trúc data-driven, giúp tiết kiệm thời gian nhập liệu thủ công.
  >    - `check_requirements.py`: Công cụ kiểm tra độc lập, tự động quét toàn bộ project để thẩm định 100% điều kiện cứng của đề bài (số test case, các loại assertion, số lượt chạy 3 browser, metadata 'Run by' và số commit Git của tác giả).
  > 
  > 3. **Thư mục Tài liệu tham chiếu tri thức (`references/`):**
  >    - `phases.md`: Quy định chi tiết từng bước thực hiện và tiêu chuẩn nghiệm thu của từng phase.
  >    - `review-checklist.md`: 5 tiêu chuẩn vàng giúp sinh viên rà soát lỗi của AI về selector, sleep, assertion, cô lập dữ liệu và đối chiếu SRS.
  >    - `assertion-patterns.md` & `selector-and-wait-rules.md`: Các mẫu assertion chất lượng cao và quy tắc dùng semantic locators thay thế CSS selector dễ vỡ.
  >    - `eshop-sut.md`: Cung cấp tri thức đặc thù về hệ thống SUT EShop (cổng dịch vụ, state giỏ hàng React, cơ chế khóa tài khoản).
  > 
  > 4. **Thư mục Bản mẫu (`assets/`):** Chứa các template mẫu sẵn như `playwright.config.ts` (cấu hình đa browser), `fixtures.ts` (helper API cô lập dữ liệu), `run-all.mjs` (runner tự động 9 browser runs) và schema dữ liệu mẫu."

---

## PHẦN 2: THỰC THI DEMO CHI TIẾT TỪNG PHASE (TRÊN TÍNH NĂNG FR-02)

---

### PHASE 1: Phạm vi & Môi trường kiểm thử (Scope & Environment)
* **Mục đích:** Xác lập rõ ràng tính năng cần test, bảo đảm hệ thống SUT hoạt động ổn định và các biến môi trường được nạp đúng.
* **AI sẽ làm gì:** Hướng dẫn cấu hình file `.env` từ template `assets/.env.example`, kiểm tra các cổng dịch vụ local (`:3000`, `:5173`, `:5174`) và gói thư viện Playwright.
* **Con người cần review gì:** Kiểm tra xem SUT EShop trên máy local đã khởi động chưa bằng lệnh `./run_servers.sh`; xác nhận không chọn trùng tính năng với các thành viên khác trong nhóm.
* **Kết quả đạt được (Artifact):** File `.env` hoàn chỉnh; hệ thống SUT sẵn sàng nhận request kiểm thử.
*(Thao tác màn hình: Mở file `.env` hoặc terminal gõ `curl http://localhost:5173` để thấy SUT đang phản hồi)*.

---

### PHASE 2: Lựa chọn Test Case để Tự động hóa (Test Case Selection)
* **Mục đích:** Chọn lọc ra **ít nhất 12 test case** từ HW02, phân loại rõ ràng tính khả thi kiểm thử (testability).
* **AI sẽ làm gì:** Đọc bảng test case `TC_FR02_xx` từ HW02, đề xuất danh sách phân loại theo 3 trạng thái: `automate` (kỳ vọng PASS), `automate_expected_failure` (kỳ vọng FAIL do SUT có lỗi/khác SRS), và `blocked_deferred` (chưa thể test tự động).
* **Con người cần review gì:** Đóng vai trò Gatekeeper: Đảm bảo nguyên tắc *"Test fail do bug của SUT vẫn phải tự động hóa"* chứ không được bỏ qua; rà soát tính bao phủ gồm đủ ca positive, negative, boundary và edge cases.
* **Kết quả đạt được (Artifact):** Danh sách 24 test case của FR-02 được gắn nhãn phân loại chuẩn xác, được sinh viên phê duyệt Checkpoint 2.

---

### PHASE 3: Tách dữ liệu kiểm thử (Test Data Files - Data Driven)
* **Mục đích:** Tách rời 100% dữ liệu test ra khỏi mã nguồn script kiểm thử theo đúng yêu cầu đề bài.
* **AI sẽ làm gì:** Cung cấp script `tc_to_json.py` và hỗ trợ ánh xạ cấu trúc dữ liệu gồm ID, Title, Type, Input và gom kết quả mong đợi vào object `expected`.
* **Con người cần review gì:** Kiểm tra cấu trúc file JSON: không chứa mã thực thi, không nhúng selector CSS thô vào dữ liệu, đảm bảo tính nhất quán của schema.
* **Kết quả đạt được (Artifact):** File `data/fr02-login.json` hợp lệ, chứa toàn bộ dữ liệu kiểm thử độc lập.
*(Thao tác màn hình: Mở file `data/fr02-login.json` lướt qua các object dữ liệu)*.

---

### PHASE 4: Sinh mã nguồn Test Script & Page Object (Script Generation)
* **Mục đích:** Xây dựng mã nguồn kiểm thử tự động theo mô hình Page Object Model (POM) và data-driven spec.
* **AI sẽ làm gì:** Đề xuất mã nguồn nháp (draft) cho `pages/login.page.ts` và `tests/fr02-login.spec.ts`, viết vòng lặp đọc file JSON.
* **Con người cần review gì:**
  1. Kiểm tra selector: Bắt buộc dùng Semantic Locators (`getByRole`, `getByLabel`, `getByPlaceholder`), cấm tuyệt đối XPath và CSS class layout.
  2. Kiểm tra Assertion: Bắt buộc phối hợp **$\ge 3$ kiểu assertion khác nhau** (`toHaveURL`, `toBeVisible`, `toHaveText`, network response status).
  3. Cấm triệt để việc dùng `page.waitForTimeout()` cố định.
* **Kết quả đạt được (Artifact):** Bản nháp test script được commit lên Git với thông điệp: `test(FR-02): generate AI draft for TC_FR02_01-12`.
*(Thao tác màn hình: Mở file `pages/login.page.ts` và `tests/fr02-login.spec.ts`)*.

---

### PHASE 5: Chạy Đa Trình Duyệt & Xuất Báo Cáo (Multi-Browser Runs)
* **Mục đích:** Kiểm thử tính tương thích của web trên 3 engine trình duyệt chính và sinh báo cáo HTML có định danh sinh viên.
* **AI sẽ làm gì:** Cấu hình `playwright.config.ts` với 3 project: `chromium`, `firefox`, `webkit`, chèn metadata `Run by: 23120138` và ISO timestamp.
* **Con người cần review gì:** Trực tiếp thực thi test trên máy thật; xác nhận test chạy tuần tự (`workers: 1`, `retries: 0`) để không làm xung đột dữ liệu bộ đếm đăng nhập.
* **Kết quả đạt được (Artifact):** 3 thư mục báo cáo HTML độc lập trong `reports/fr02-login/` cho cả 3 trình duyệt.
*(Thao tác màn hình: Chạy lệnh test trên Terminal, sau đó mở file `reports/fr02-login/chromium/index.html` trên trình duyệt, phóng to vào dòng "Run by: 23120138" và timestamp)*.

---

### PHASE 6: Rà soát & Sửa lỗi do AI sinh (Review & Gap Analysis)
*(👉 TRỌNG TÂM: LỒNG GHÉP THUYẾT MINH PHẦN 3 VÀO ĐÂY)*
* **Mục đích:** Thể hiện vai trò phản biện của con người, phát hiện lỗi sai trong bản nháp của AI, trực tiếp sửa mã nguồn và lập báo cáo khoảng cách.
* **AI sẽ làm gì:** Cung cấp bảng đối chiếu theo `review-checklist.md` và gợi ý phân loại lỗi.
* **Con người cần review gì:** Trực tiếp rà soát từng dòng code, tìm ra các điểm yếu điển hình của AI (như selector dễ gãy, wait cố định, không cô lập dữ liệu) và sửa lại hoàn chỉnh.
* **Kết quả đạt được (Artifact):** Commit sửa lỗi riêng biệt trên Git (`fix(FR-02): ...`) và bảng phân tích khoảng cách trong `docs/main-report.md`.

---

## PHẦN 3: SPOTLIGHT – THUYẾT MINH LỖI CỦA AI VÀ CÁCH SINH VIÊN SỬA (LỒNG TRONG PHASE 6)

*(Thao tác màn hình: Mở tab Git Diff hoặc gõ lệnh `git show <commit_fix>` để chiếu sự khác biệt giữa code AI sinh nháp và code sinh viên đã sửa)*

### Khung Thuyết minh Lỗi Điển hình (Template):
* **Lời thoại mẫu:**
  > "Tại Checkpoint 6 này, em xin thuyết minh chi tiết một lỗi điển hình mà AI đã mắc phải trong quá trình sinh mã nguồn:
  > 
  > 1. **Lỗi do AI sinh ra:** 
  >    - *(Ví dụ 1 về Chờ đợi):* AI có thói quen chèn `await page.waitForTimeout(3000)` sau khi bấm nút Đăng nhập để chờ phản hồi từ server.
  >    - *(Ví dụ 2 về Cô lập dữ liệu):* AI dùng chung một tài khoản `test@eshop.com` cho toàn bộ các test case đăng nhập sai liên tiếp.
  > 
  > 2. **Nguyên nhân tại sao AI sai:** 
  >    - Do mô hình AI học từ các kho mã nguồn phổ thông trên mạng, nơi nhiều lập trình viên có thói quen xấu dùng hardcoded sleep thay vì web-first wait. Đồng thời AI không nhận thức được việc SUT EShop có cơ chế khóa tài khoản tích lũy trên server theo thời gian thực.
  > 
  > 3. **Hậu quả nếu không sửa:** 
  >    - Việc dùng sleep cố định vi phạm nghiêm trọng quy định đề bài (bị cấm waitForTimeout), làm test chạy rất chậm và dễ bị flaky khi mạng lag. Việc dùng chung user làm cho các test case sau bị kẹt ở trạng thái tài khoản bị khóa 180s của test case trước, dẫn đến kết quả sai lệch hàng loạt.
  > 
  > 4. **Cách sinh viên can thiệp và sửa đổi:** 
  >    - Em đã loại bỏ hoàn toàn `waitForTimeout`, thay thế bằng **Web-first Assertion tự động retry**: `await expect(loginPage.errorMessage).toBeVisible()`.
  >    - Bổ sung helper API `registerFreshUser()` trong `fixtures.ts` để mỗi test case tự sinh một email độc lập, cô lập hoàn toàn bộ đếm lỗi đăng nhập.
  > 
  > 5. **Minh chứng Git:** Em đã tách riêng thành commit `fix(FR-02): replace fixed sleep and isolate test users` trên Git để chứng minh sự can thiệp của con người."

---

### PHASE 7: Phân định Lỗi & Báo cáo Bug SUT (Defects & Bug Reports)
* **Mục đích:** Phân loại rõ ràng giữa lỗi do script test viết sai và lỗi thật của hệ thống EShop theo tài liệu đặc tả SRS.
* **AI sẽ làm gì:** Hỗ trợ định dạng khung báo cáo bug theo mẫu chuẩn Markdown.
* **Con người cần review gì:** Đối chiếu với `specs/system_requirements_specification.md` và các bug đã báo ở HW02 (ví dụ: thời gian khóa tài khoản thực tế là 180s nhưng SRS ghi 30s). Xác nhận đây là lỗi thật của SUT chứ không sửa kỳ vọng của test để 'ép' cho test pass.
* **Kết quả đạt được (Artifact):** File `docs/bug-report.md` và các GitHub Issue được tạo kèm ảnh chụp bằng chứng trong `evidence/`.
*(Thao tác màn hình: Mở file `docs/bug-report.md` hoặc mở trang GitHub Issues trên trình duyệt)*.

---

### PHASE 8: Lịch sử Git & Commit Log (Git Hygiene)
* **Mục đích:** Minh chứng quá trình làm việc độc lập, minh bạch và đáp ứng tiêu chuẩn tối thiểu $\ge 8$ commit sửa file test do chính sinh viên thực hiện.
* **AI sẽ làm gì:** Gợi ý cú pháp commit message chuẩn Conventional Commits.
* **Con người cần review gì:** Trực tiếp thực hiện lệnh git commit, đảm bảo thông điệp rõ ràng (`test(...)`, `fix(...)`), tách bạch giữa commit nháp của AI và commit fix của mình.
* **Kết quả đạt được (Artifact):** File `docs/git-commit-log.txt` được xuất ra từ lịch sử git thật của tác giả.
*(Thao tác màn hình: Gõ `git log --author="Nguyen Quoc Ky" --oneline -n 10` trên Terminal)*.

---

### PHASE 9: Đóng gói & Thẩm định Toàn diện (Packaging & Self-Assessment)
* **Mục đích:** Đảm bảo toàn bộ gói bài nộp thỏa mãn 100% tiêu chí đề bài trước khi nộp lên Moodle.
* **AI sẽ làm gì:** Cung cấp script tự động hóa thẩm định `check_requirements.py`.
* **Con người cần review gì:** Chạy script kiểm tra, rà soát lại checklist nộp bài (báo cáo PDF, link video, bảng tự đánh giá 100/100 trong `README.md`).
* **Kết quả đạt được (Artifact):** Toàn bộ tiêu chí đạt màu xanh; đóng gói file zip đúng định dạng: `23120138_HW04_AI_Automation_100.zip`.
*(Thao tác màn hình: Gõ lệnh và chạy trực tiếp trên terminal:
`python3 .agents/skills/playwright-automation-coach/scripts/check_requirements.py`
chỉ vào kết quả ALL CHECKS PASSED)*.
