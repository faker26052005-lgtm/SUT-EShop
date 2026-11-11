# Kịch bản Video Demo Agent Skill (HW04)

Tài liệu này cung cấp kịch bản chi tiết từng phút cho sinh viên **Nguyễn Quốc Kỳ (MSSV: 23120138)** khi quay video demo sử dụng Agent Skill `playwright-automation-coach` trên một tính năng hoàn chỉnh (thời lượng khuyến nghị: 5 – 7 phút).

---

## 1. Yêu cầu Bắt buộc Trước khi Quay
- [ ] Mở terminal, chạy lệnh chứng minh danh tính:
  ```bash
  whoami && hostname
  git config user.name && git config user.email
  ```
- [ ] Đảm bảo SUT EShop đang chạy local (`./run_servers.sh`: Backend :3000, Web :5173, Admin :5174).
- [ ] Chọn 1 tính năng hoàn chỉnh để demo: Khuyến nghị **FR-02 (Đăng nhập & Khóa tài khoản)** hoặc **FR-17 (Quản lý Coupon Admin)**.
- [ ] Giọng nói thuyết minh bằng tiếng Việt, âm thanh rõ ràng.

---

## 2. Kịch bản Thuyết minh Chi tiết (Timeline)

### Phút 0:00 – 0:45: Mở đầu & Chứng minh Danh tính
- **Hành động trên màn hình:**
  1. Mở terminal, gõ `whoami && hostname`.
  2. Gõ `git config user.name && git config user.email`.
  3. Mở file `GEMINI.md` hoặc `README.md` chỉ rõ MSSV `23120138` và họ tên Nguyễn Quốc Kỳ.
- **Lời thoại gợi ý:**
  > "Xin chào Thầy/Cô và các bạn trợ giảng. Em là Nguyễn Quốc Kỳ, MSSV 23120138, sinh viên lớp 23CLC02. Hôm nay em xin trình bày video demo bài tập HW04 môn Kiểm thử Phần mềm: Tự động hóa kiểm thử giao diện web đa trình duyệt sử dụng Playwright và Agent Skill `playwright-automation-coach`."

### Phút 0:45 – 1:45: Giới thiệu Agent Skill & Input đầu vào
- **Hành động trên màn hình:**
  1. Mở thư mục `.agents/skills/playwright-automation-coach/`.
  2. Mở file `SKILL.md` và `assets/features.json`.
  3. Mở file `../hw_02/Main_Report.md` chỉ vào bảng test case `TC_FR02_01` đến `TC_FR02_24`.
- **Lời thoại gợi ý:**
  > "Để không biến AI thành một 'hộp đen' sinh toàn bộ code mất kiểm soát, em đã thiết kế Agent Skill `playwright-automation-coach` với quy trình 9 giai đoạn nghiêm ngặt. Đầu vào của skill là bảng test case đã được thiết kế kỹ lưỡng từ HW02. Skill sẽ hướng dẫn trích xuất dữ liệu ra file JSON, tạo Page Object, sinh spec Playwright theo mô hình data-driven và cấu hình chạy trên 3 trình duyệt."

### Phút 1:45 – 3:00: Thực thi Chuyển đổi Dữ liệu & Sinh Code Spec
- **Hành động trên màn hình:**
  1. Chạy script chuyển đổi:
     ```bash
     python3 scripts/tc_to_json.py --fr FR-02
     ```
  2. Mở file `data/fr02-login.json` vừa sinh ra, chỉ ra cấu trúc data-driven (không hardcode mảng dữ liệu trong spec).
  3. Mở file Page Object `pages/login.page.ts` và Spec `tests/fr02-login.spec.ts`.
  4. Chỉ rõ 3 kiểu assertion khác nhau: `toHaveURL`, `toBeVisible`, `toHaveText` và kiểm tra HTTP status từ network response.
- **Lời thoại gợi ý:**
  > "Em sử dụng script `tc_to_json.py` để trích xuất các test case từ HW02 thành `data/fr02-login.json`. Mỗi dòng dữ liệu chứa đủ ID, title, input và expected result. Spec đọc dữ liệu này và lặp qua từng case. Ở đây em sử dụng các locator có khả năng phục hồi cao như `getByRole`, `getByLabel` và áp dụng 4 kiểu assertion khác nhau."

### Phút 3:00 – 4:15: Thuyết minh Phần Human Review & Sửa Lỗi do AI Sinh
- **Hành động trên màn hình:**
  1. Mở `git diff` hoặc chỉ vào commit đã fix:
     ```bash
     git show HEAD  # hoặc commit sửa lỗi AI
     ```
  2. Mở file `docs/main-report.md` (mục Gap Analysis).
  3. Giải thích ít nhất 1 lỗi cụ thể mà AI sinh sai và sinh viên đã sửa lại:
     - *Ví dụ 1:* AI sử dụng selector dễ vỡ bằng CSS class hoặc text tuyệt đối không hỗ trợ tiếng Việt có dấu. Em đã sửa thành `getByLabel(/email/i)`.
     - *Ví dụ 2:* AI ban đầu dùng `page.waitForTimeout(3000)` để chờ phản hồi. Em đã thay thế bằng web-first assertion tự động retry: `await expect(loginPage.errorAlert).toBeVisible()`.
     - *Ví dụ 3:* AI hardcode tài khoản dùng chung làm fail các test đếm số lần sai. Em đã bổ sung helper `registerFreshUser()` để cách ly từng test.
- **Lời thoại gợi ý:**
  > "Đây là phần quan trọng nhất của bài tập: Sự can thiệp và kiểm soát của con người. Khi AI sinh nháp lần đầu, AI đã mắc lỗi dùng selector CSS dễ gãy và dùng fixed timeout. Em đã rà soát lại theo `review-checklist.md`, thực hiện commit bản sửa `fix(FR-02): replace fixed waits with web-first assertions` và ghi nhận phân tích khoảng cách vào `docs/main-report.md`."

### Phút 4:15 – 5:30: Chạy Đa Trình Duyệt & Kiểm tra Báo cáo HTML
- **Hành động trên màn hình:**
  1. Chạy runner:
     ```bash
     npx playwright test tests/fr02-login.spec.ts --project=chromium
     # Hoặc chạy node scripts/run-all.mjs
     ```
  2. Mở thư mục `reports/fr02-login/` xem 3 báo cáo của Chromium, Firefox, WebKit.
  3. Mở `reports/fr02-login/chromium/index.html` trên trình duyệt:
     - Phóng to tiêu đề hiển thị: **`Run by: 23120138`** cùng **ISO Timestamp**.
  4. Chạy script thẩm định:
     ```bash
     python3 scripts/check_requirements.py
     ```
     Chỉ ra kết quả "All automated checks passed".
- **Lời thoại gợi ý:**
  > "Bây giờ em tiến hành chạy test trên cả 3 trình duyệt Chromium, Firefox và WebKit. Báo cáo HTML được tự động xuất ra thư mục riêng biệt. Như Thầy/Cô thấy trên màn hình, tiêu đề báo cáo hiển thị rõ ràng chuỗi 'Run by: 23120138' cùng timestamp thực tế lúc chạy. Script kiểm tra `check_requirements.py` xác nhận toàn bộ 100% tiêu chí cứng của bài tập đều đạt."

### Phút 5:30 – 6:00: Kết luận
- **Hành động trên màn hình:**
  1. Mở `git log --oneline -n 10` chứng minh có các commit `test(...)`, `fix(...)` tách bạch.
  2. Mở `docs/bug-report.md` nếu có bug thật.
- **Lời thoại gợi ý:**
  > "Agent Skill đã hỗ trợ đắc lực việc chuẩn hóa quy trình test, đồng thời lịch sử Git chứng minh sự rà soát nghiêm túc từ phía sinh viên. Em xin chân thành cảm ơn Thầy/Cô đã theo dõi."
