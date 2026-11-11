# Chi tiết 9 Giai đoạn của Quy trình Playwright Automation Coach

Tài liệu này chi tiết hóa từng bước thực hiện, mục tiêu và điều kiện thông qua (checkpoint criteria) cho 9 phase của bài tập HW04.

---

## Phase 1: Phạm vi & Môi trường kiểm thử (Scope & Environment)
**Mục tiêu:** Thống nhất 3 tính năng từ HW02, môi trường thực thi và cấu hình base URL.

1. **Chọn tính năng:**
   - Pool A: **FR-02** (Đăng nhập & Khóa tài khoản) – Web / Backend API.
   - Pool B: **FR-07** (Giỏ hàng) – Web frontend (`CartContext`).
   - Pool C: **FR-17** (Quản lý mã giảm giá Admin) – Admin web / Backend API.
2. **Kiểm tra môi trường:**
   - SUT EShop chạy local bằng `./run_servers.sh`: Web `:5173`, Admin `:5174`, API `:3000`.
   - Cài đặt Playwright: `npm install && npx playwright install`.
   - Cấu hình file `.env` từ `assets/.env.example`.
3. **Checkpoint 1 đạt khi:**
   - Xác định đủ 3 tính năng, các cổng dịch vụ hoạt động, không trùng lặp với thành viên khác trong nhóm.

---

## Phase 2: Lựa chọn Test Case để Tự động hóa (Test Case Selection)
**Mục tiêu:** Danh sách có căn cứ gồm **≥ 12 test case tự động hóa** cho mỗi tính năng.

1. **Nguồn test case:** Bắt đầu từ bảng test case đã thiết kế ở HW02 (`../hw_02/Main_Report.md`).
2. **Tiêu chí chọn:**
   - Các case lặp đi lặp lại nhiều tập dữ liệu (data-driven candidates): xác thực form, biên độ dài, biên số lượng, biên tỷ lệ %.
   - Các case chuyển đổi trạng thái quan trọng: đăng nhập sai dẫn đến khóa tài khoản, thêm sản phẩm thay đổi tổng giỏ hàng, tạo và áp dụng mã giảm giá.
3. **Các case không tự động hóa (Not Automated):**
   - Các case phụ thuộc thời gian chờ server quá dài (ví dụ: chờ 180s mở khóa ở FR-02).
   - Phải ghi nhận rõ ràng vào bảng "Test Cases Not Automated" trong `docs/main-report.md` kèm lý do kỹ thuật.
4. **Checkpoint 2 đạt khi:**
   - Mỗi tính năng có ≥ 12 case sẵn sàng tự động hóa với đầy đủ ID định dạng `TC_<FR>_<NN>` (ví dụ: `TC_FR02_01`), loại test (positive, negative, edge), và kết quả mong đợi xác thực từ SRS.

---

## Phase 3: Tách dữ liệu kiểm thử (Test Data Files)
**Mục tiêu:** Toàn bộ dữ liệu kiểm thử nằm ngoài mã nguồn test script.

1. Sử dụng script `scripts/tc_to_json.py` để trích xuất khung dữ liệu từ `../hw_02/Main_Report.md` ra:
   - `data/fr02-login.json`
   - `data/fr07-cart.json`
   - `data/fr17-coupon.json`
2. Cấu trúc mỗi bản ghi:
   ```json
   {
     "id": "TC_FR02_01",
     "title": "Verify login with valid credentials",
     "type": "positive",
     "username": "test@eshop.com",
     "password": "Test1234!",
     "expectedStatus": 200,
     "expectedUrl": "/"
   }
   ```
3. Sinh viên đối chiếu từng giá trị `expected*` với tài liệu `specs/system_requirements_specification.md`, không sao chép hành vi sai hiện tại của SUT.
4. **Checkpoint 3 đạt khi:**
   - 3 file JSON tồn tại trong `data/`, không có file test nào chứa mảng dữ liệu nội tuyến (inline array), mỗi bản ghi map chính xác với ID ở Phase 2.

---

## Phase 4: Sinh mã nguồn Test Script (Script Generation)
**Mục tiêu:** Xây dựng Page Object và Playwright Spec từng tính năng một, lặp qua dữ liệu JSON.

1. **Page Object (`pages/*.page.ts`):**
   - Áp dụng ưu tiên locator: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`.
   - Tránh tuyệt đối CSS selector dài, chuỗi XPath tuyệt đối, hoặc class ngẫu nhiên.
   - Không sử dụng `page.waitForTimeout()` cố định; luôn sử dụng web-first chờ có điều kiện.
2. **Data-driven Spec (`tests/*.spec.ts`):**
   - Đọc dữ liệu từ `data/<feature>.json`.
   - Lặp qua từng row bằng `for (const tc of testCases) { test(..., async ({ page }) => { ... }); }`.
   - Tên test bắt buộc chứa ID HW02: `${tc.id} [${tc.type}] ${tc.title}`.
   - Áp dụng **≥ 3 kiểu assertion khác nhau** (ví dụ: `toHaveURL`, `toBeVisible`, `toHaveText`, `toHaveCount`, HTTP response status).
3. **Quy tắc Git:**
   - Commit bản nháp do AI sinh trước: `test(<feature>): generate AI draft for TC_<feature>_01-12`.
   - Sau đó sinh viên review và commit bản sửa riêng để làm bằng chứng cho Phase 6.
4. **Checkpoint 4 đạt khi:**
   - Cả 3 file spec và page object biên dịch thành công, chạy được ít nhất trên Chromium và phủ đủ ≥ 12 case/feature.

---

## Phase 5: Chạy Đa Trình Duyệt & Xuất Báo Cáo (Multi-Browser Runs)
**Mục tiêu:** 9 lần chạy thực tế (3 feature x 3 trình duyệt) với báo cáo HTML mang danh tính sinh viên.

1. Cấu hình `playwright.config.ts`:
   - 3 project trình duyệt: `chromium`, `firefox`, `webkit`.
   - `retries: 0` (bắt buộc: không retry để tránh che giấu lỗi flaky).
   - `workers: 1` (đảm bảo tính tuần tự, tránh xung đột khóa tài khoản hoặc coupon).
   - HTML report title và metadata chứa: `Run by: 23120138` và ISO timestamp.
2. Thực thi:
   - Chạy toàn bộ bằng: `node scripts/run-all.mjs`.
   - Hoặc chạy lẻ từng feature: `STUDENT_ID=23120138 npx playwright test tests/fr02-login.spec.ts --project=chromium`.
3. Kiểm tra kết quả:
   - Chạy `python3 scripts/check_requirements.py`.
   - Mở file `reports/<feature>/<browser>/index.html` xác nhận tiêu đề hiển thị `Run by: 23120138` và timestamp.
4. **Checkpoint 5 đạt khi:**
   - Đủ 9 thư mục báo cáo tương ứng 9 lần chạy thật trên máy sinh viên, không có báo cáo nào bị can thiệp thủ công.

---

## Phase 6: Rà soát & Phân tích Khoảng cách (Review & Gap Analysis)
**Mục tiêu:** Sinh viên rà soát mã nguồn AI sinh, sửa lỗi, và viết phân tích khoảng cách bằng chính ngôn ngữ của mình.

### 5 Tiêu chí Đánh giá Script cần Chỉnh sửa:
1. **Độ bền vững của Selector (Locators):** Thay thế CSS class dài, layout-dependent (`button.btn-primary.mt-2`, `div > span:nth-child(2)`) và XPath tuyệt đối bằng **Accessible Locators** (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`).
2. **Cơ chế chờ đợi & Triệt tiêu Flakiness (Waits):** Loại bỏ 100% `page.waitForTimeout()` hoặc `sleep()` cố định (bị đề bài cấm). Thay bằng **Web-first Assertions** tự động retry (`await expect(locator).toBeVisible()`) hoặc `page.waitForResponse()`.
3. **Chất lượng & Đa dạng Assertion:** Bắt buộc phối hợp $\ge 3$ nhóm assertion khác nhau (`toHaveURL`, `toBeVisible`, `toHaveText`, network response status); thay thế các assertion yếu (`toBeTruthy`, non-retrying) bằng web-first retry assertions.
4. **Cách ly Dữ liệu & Trạng thái (Test Independence):** Loại bỏ việc dùng chung tài khoản cố định gây kẹt counter khóa 180s (FR-02); tích hợp API helper `registerFreshUser()` để mỗi test có 1 user riêng; bổ sung hook `afterEach` xóa coupon test (FR-17).
5. **Độ chính xác theo Đặc tả SRS:** Kết quả mong đợi phải bám sát `specs/system_requirements_specification.md`, không sao chép theo hành vi lỗi hiện tại của app. Nếu app khác SRS thì expected vẫn giữ theo SRS để ghi nhận bug.

### Các bước thực hiện:
1. Đối chiếu mã nguồn AI Draft với 5 tiêu chí trên và checklist chi tiết tại [`references/review-checklist.md`](review-checklist.md).
2. Ghi nhận vào bảng Gap Analysis trong `docs/main-report.md`:
   | STT | Feature | Case ID | Lỗi của AI | Phân loại | Cách sinh viên sửa | Nguyên nhân AI mắc lỗi |
   | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
3. **Quy tắc quan trọng:** AI chỉ gợi ý phân loại; sinh viên phải tự viết cột nguyên nhân và chọn ra ít nhất 1 lỗi điển hình để thuyết minh trong video demo.
4. **Checkpoint 6 đạt khi:**
   - Bảng phân tích khoảng cách có đầy đủ các mục sửa thực tế, kèm diff tương ứng trong Git (`fix(...)`).

---

## Phase 7: Quản lý Thất bại & Báo cáo Bug (Defects & Bug Reports)
**Mục tiêu:** Phân định lỗi script và lỗi SUT thật; tạo GitHub Issues có ảnh chụp minh chứng.

1. Với mỗi test fail:
   - Nếu do script test viết sai hoặc selector sai: Sửa script (quay lại Phase 6).
   - Nếu do SUT vi phạm tài liệu SRS: Đây là **lỗi thật (genuine defect)**.
2. Đối chiếu:
   - So sánh với SRS `specs/system_requirements_specification.md`.
   - So sánh với lỗi đã báo ở HW02 (`../hw_02/Bug_Report.md`).
3. Quy trình báo bug:
   - Soạn thảo theo mẫu `assets/bug-report.md` và lưu vào `docs/bug-report.md`.
   - Tạo GitHub Issue trên repo của sinh viên kèm ảnh chụp màn hình lấy từ thư mục `evidence/`.
   - Ghi mã Issue vào báo cáo.
4. **Checkpoint 7 đạt khi:**
   - Toàn bộ test fail được phân loại; các bug thật đều có GitHub Issue hợp lệ kèm bằng chứng.

---

## Phase 8: Lịch sử Git & Commit Log (Git Hygiene)
**Mục tiêu:** Lịch sử commit minh bạch với **≥ 8 commit có sửa đổi file test (`.spec.ts`) do chính sinh viên tạo**.

1. Áp dụng Conventional Commits: `<type>(<scope>): <subject>` (tiếng Anh, thể mệnh lệnh, ≤ 72 ký tự).
2. Tách bạch giữa commit sinh nháp của AI và commit sửa lỗi của sinh viên:
   ```
   test(FR-02): generate AI draft for TC_FR02_01-12
   fix(FR-02): replace CSS selectors with accessible getByRole
   fix(FR-02): replace fixed sleep with waitForResponse network assertion
   test(FR-07): add boundary quantity cases to fr07-cart.json
   fix(FR-07): assert calculated row subtotal instead of static text
   test(FR-17): add admin coupon management test suite
   fix(FR-17): isolate coupon tests using afterEach cleanup helper
   chore(config): configure 3 browser projects with Run-by metadata
   ```
3. Xuất file log lọc theo tác giả Nguyễn Quốc Kỳ:
   ```bash
   git log --author="Nguyen Quoc Ky" --pretty=format:"%h | %an | %ad | %s" --date=iso -- . > docs/git-commit-log.txt
   ```
4. **Checkpoint 8 đạt khi:**
   - Script `check_requirements.py` xác nhận có ≥ 8 commit sửa spec thuộc tác giả và file `docs/git-commit-log.txt` tồn tại.

---

## Phase 9: Đóng gói & Tự đánh giá (Packaging & Submission)
**Mục tiêu:** Bộ hồ sơ hoàn chỉnh, không thiếu bất kỳ tài liệu bắt buộc nào.

1. Hoàn thiện `docs/main-report.md` (Markdown và xuất PDF).
2. Viết `docs/ai-critique.md` (200 – 300 từ) và `docs/ai-audit-report.md` (Markdown + PDF).
3. Cập nhật `README.md` với bảng tự đánh giá (A: 25đ, B: 25đ, C: 25đ, Video: 15đ, Skills: 10đ) và bảng tổng kết test summary.
4. Đính kèm link YouTube unlisted (demo test và demo skill).
5. Đặt tên file zip: `23120138_HW04_AI_Automation_<SelfAssessedGrade>.zip` (ví dụ: `23120138_HW04_AI_Automation_095.zip`).
6. **Checkpoint 9 đạt khi:** Đầy đủ checklist nộp bài theo mục 12 của `GEMINI.md`.
