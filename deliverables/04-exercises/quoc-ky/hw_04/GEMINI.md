# GEMINI.md – HW04 Automation Testing (HW04-AI)

## 1. Bối cảnh
- Môn Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS. Bài **HW04**: automation test giao diện web của SUT **EShop** (`https://github.com/ttbhanh/eshop-sut`).
- Bài cá nhân. Sinh viên: **Nguyễn Quốc Kỳ**, StudentID: **23120138**, lớp 23CLC02.
- 3 feature (lấy từ HW02, chỉ web, không dùng Pool D):
  | Pool | FR | Tên | Nguồn test case HW02 |
  | :-- | :-- | :-- | :-- |
  | A | **FR-02** | Đăng nhập & khóa tài khoản | `../hw_02/Main_Report.md` (`TC_FR02_xx`, 24 TC) |
  | B | **FR-07** | Giỏ hàng | `../hw_02/Main_Report.md` (`TC_FR07_xx`) |
  | C | **FR-17** | Quản lý mã giảm giá (Admin web) | `../hw_02/Main_Report.md` (`TC_FR17_xx`) |
- Tham chiếu: `../hw_02/README.md` (feature selection), `materials/hw04.md` (đề bài).
- Ngôn ngữ giao tiếp và tài liệu: **tiếng Việt**. Code, tên biến, commit message: tiếng Anh.

## 2. Vai trò của AI
- AI là trợ lý có kỷ luật, không phải hộp đen. Làm **từng bước**: phân tích feature → chọn test case từ HW02 → thiết kế file data → sinh script → review → chạy → báo cáo. **Cấm** dùng một prompt chung chung kiểu "viết toàn bộ script".
- Mọi output của AI phải để tôi review. Không tự coi là đúng.
- **Không bịa** kết quả chạy, số liệu, log, report, screenshot. Chỉ báo cáo số liệu từ lần chạy thật.
- Chưa chắc hành vi SUT thì kiểm tra trực tiếp trên SUT hoặc hỏi tôi, không đoán.
- Khi hành vi SUT lệch SRS, đối chiếu `specs/system_requirements_specification.md` rồi mới kết luận là bug.

## 3. Tech stack (cố định)
- Playwright + TypeScript (`@playwright/test`).
- Reporter: Playwright HTML reporter.
- Test data: file **JSON** riêng trong `data/`.
- Browser: `chromium`, `firefox`, `webkit` (3 project trong `playwright.config.ts`).
- SUT chạy local bằng npm: `./run_servers.sh` ở thư mục gốc `SUT-EShop` (Backend `:3000`, Web `:5173`, Admin `:5174`).
- Base URL lấy từ biến môi trường, không hardcode: `BASE_URL=http://localhost:5173` (web), `ADMIN_URL=http://localhost:5174` (admin), `API_URL=http://localhost:3000` (setup/cleanup).
- Tài khoản mặc định: admin `admin@eshop.com` / `Admin123!`; user `test@eshop.com` / `Test1234!`. Đọc từ biến môi trường hoặc file `.env`, không rải trong spec.
- **Chiến lược reset dữ liệu** (SUT không có endpoint reset/unlock):
  - Mức suite: dừng server, chạy `node database.js` (drop + seed lại), khởi động lại server trước mỗi lần chạy đầy đủ. Không reseed khi test đang chạy song song.
  - FR-02: mỗi test tự `POST /api/register` user mới (email duy nhất) để cách ly bộ đếm và khóa tài khoản.
  - FR-07: giỏ hàng web chỉ nằm trong React state (`CartContext`), **không** gọi `/api/cart` và mất khi tải lại trang. Mỗi test mở page mới nên giỏ tự sạch, không cần dọn. Chỉ cần đăng nhập (user mới qua `/api/register`) khi test tới bước checkout.
  - FR-17: tạo coupon mã duy nhất qua `POST /api/admin/coupons`, xóa bằng `DELETE /api/admin/coupons/:id` trong `afterEach`.
  - Setup/cleanup gọi API qua `request` fixture; phần được kiểm thử vẫn đi qua UI.
- Lưu ý: code SUT khóa tài khoản **180s**, SRS ghi **30s**. Đối chiếu bug HW02 trước khi báo lại. Test hết khóa dùng `page.clock` chỉ tua được phía trình duyệt, không tua được server; nếu không automate được thì ghi vào `docs/main-report.md`.

## 4. Cấu trúc thư mục
```
hw_04/
├── GEMINI.md
├── README.md                  # self-assessment + test summary + link video
├── materials/hw04.md
├── playwright.config.ts
├── package.json
├── data/                      # fr02-login.json, fr07-cart.json, fr17-coupon.json
├── pages/                     # Page Object
├── tests/
│   ├── fr02-login.spec.ts
│   ├── fr07-cart.spec.ts
│   └── fr17-coupon.spec.ts
├── reports/<feature>/<browser>/   # HTML report mỗi lần chạy
├── docs/
│   ├── main-report.md         # automation report + gap analysis
│   ├── ai-audit-report.md
│   ├── ai-critique.md         # 200–300 từ
│   ├── bug-report.md
│   └── git-commit-log.txt
├── evidence/                  # screenshot bug và GitHub Issues
└── .agents/skills/            # Agent Skill data-driven, multi-browser
```

## 5. Quy tắc viết test (bắt buộc)
1. Mỗi feature có **≥ 12 test case** tự động hóa (positive, negative, edge đều tính).
2. **Data-driven**: toàn bộ dữ liệu nằm trong `data/*.json`; spec đọc file rồi lặp. **Cấm** hardcode mảng hay object dữ liệu trong spec.
3. Dùng **≥ 3 kiểu assertion khác nhau** (ví dụ `toHaveURL`, `toBeVisible`, `toHaveText`, `toHaveCount`, `toHaveValue`, kiểm tra response hoặc trạng thái).
4. Selector ưu tiên `getByRole`, `getByLabel`, `getByTestId`. Tránh CSS/XPath dài và dễ vỡ.
5. Không dùng `waitForTimeout`/sleep cố định (ngoại lệ: test khóa 30s ở FR-02 có thể cần chờ thời gian thật hoặc dùng clock mocking; phải ghi lý do).
6. Mỗi test độc lập, tự chuẩn bị và dọn dữ liệu (ví dụ reset bộ đếm đăng nhập sai, làm trống giỏ hàng, xóa coupon test).
7. Tên test chứa ID từ HW02 (`TC_FR02_01`...) để truy vết.
8. Test fail vì **lỗi thật của SUT** thì **không sửa test cho pass**; ghi nhận thành bug.
9. Test case không automate được thì ghi vào `docs/main-report.md` kèm lý do.

## 6. Quy tắc report
- Mỗi feature chạy trên 3 browser (**≥ 9 run**). Mỗi run xuất HTML report riêng.
- Report phải hiện **"Run by: 23120138"** (title, header hoặc metadata) cùng **timestamp ISO 8601**.
- Report phải do lần chạy thật sinh ra, **cấm chỉnh tay hay làm giả**.

## 7. Bug và GitHub Issues
- Mỗi bug thật: ghi vào `docs/bug-report.md` và tạo GitHub Issue kèm screenshot.
- Mẫu: Title, Môi trường (browser/OS), Steps, Expected, Actual, Severity, Test case liên quan, Screenshot.
- Đối chiếu bug đã báo ở HW02 để tránh trùng; nếu trùng thì ghi tham chiếu.

## 8. Git
- Dùng lại **repo nhóm** (`origin`: `git@github.com:faker26052005-lgtm/SUT-EShop.git`), thư mục `deliverables/04-exercises/quoc-ky/hw_04/`. Repo phải **public**.
- **≥ 8 commit có sửa file test** (`.spec.ts`) **do tôi (Nguyễn Quốc Kỳ) tạo**; commit chỉ sửa README hay PDF không tính. Chỉ commit file trong `hw_04/`, không đụng file của thành viên khác.
- **Commit convention** (Conventional Commits, tiếng Anh, thể mệnh lệnh, ≤ 72 ký tự):
  `<type>(<scope>): <subject>`
  - `type`: `test` (thêm/sửa spec, data), `fix` (sửa lỗi script do review AI), `refactor` (page object, cấu trúc), `chore` (config, package), `docs` (report, audit), `feat` (skill, helper).
  - `scope`: `FR-02` | `FR-07` | `FR-17` | `config` | `skill` | `report` | `audit` | `hw04`.
  - Ví dụ: `test(FR-02): generate AI draft for TC_FR02_01-12`, `fix(FR-02): replace CSS selector with getByPlaceholder`, `test(FR-07): move quantity cases into fr07-cart.json`, `chore(config): add 3 browser projects and Run by metadata`.
  - Mỗi commit sửa spec chỉ làm một việc. Tách commit "bản AI sinh" và commit "bản tôi đã review/sửa" để lộ rõ phần fix. Không commit `node_modules`, `.env`, `test-results`.
- Xuất log lọc theo tác giả và thư mục (xem lệnh bên dưới).
- Commit nhỏ, có ý nghĩa, ví dụ `test(FR-07): add quantity boundary cases`, `fix(test): replace fragile selector`.
- Xuất log (chạy trong `hw_04/`, `--author` phải khớp tên git của tôi): `git log --author="<tên git>" --pretty=format:"%h | %an | %ad | %s" --date=iso -- . > docs/git-commit-log.txt`.

## 9. AI Audit
- Sau mỗi phiên AI, ghi vào `docs/ai-audit-report.md`: tên tool, ngày giờ, prompt, output, và phần tôi đã sửa.
- Có khai báo: *"I use AI tools for the following tasks"*.
- Ghi riêng các lỗi của AI (selector dễ vỡ, assertion yếu, thiếu edge case, flaky wait) kèm nguyên nhân (prompt, giới hạn model, đặc thù feature) để làm gap analysis.
- Có thể dùng lại skill `hw-ai-audit` đã làm ở HW02.

## 10. Việc AI không được làm thay
- Tạo hoặc chỉnh HTML report, video, log chạy.
- Quay video demo (≥ 5 phút, giọng tôi, có face-cam hoặc `whoami` + `hostname`).
- Tự đánh giá điểm.
- Copy prompt hoặc bài của sinh viên khác.

## 11. Agent Skill
- Tạo skill cho workflow data-driven, multi-browser (đầu vào: bảng test case; đầu ra: file data JSON, spec, config, report có "Run by").
- Kèm video YouTube demo dùng skill trên một feature hoàn chỉnh.

## 12. Deliverables và checklist nộp
Tên zip: `23120138_HW04_AI_Automation_<SelfGrade 3 chữ số>.zip`

- [ ] Main report (MD + PDF) gồm automation report và gap analysis
- [ ] Link repo GitHub public (scripts, data, HTML reports)
- [ ] HTML report đa browser, có "Run by: 23120138" và ISO timestamp
- [ ] Link YouTube unlisted (demo ≥ 5 phút, tiếng Việt, có 1 fix được thuyết minh)
- [ ] AI Critique (200–300 từ) và AI Audit (MD + PDF)
- [ ] Git commit log (txt), ≥ 8 commit có sửa spec
- [ ] Bug report kèm screenshot GitHub Issues
- [ ] README.md: bảng self-assessment (A 25, B 25, C 25, Video 15, Skills 10) và test summary (số feature, TC automated/executed/passed/failed, số browser run, số bug, link video)
- [ ] Skill và link video skill

## 13. Điểm cần xác nhận
- [x] Cách chạy SUT: npm, `./run_servers.sh` (xem mục 3)
- [x] Tài khoản test: xem mục 3
- [x] Cách reset dữ liệu: xem mục 3
- [x] Repo GitHub: dùng lại repo nhóm `faker26052005-lgtm/SUT-EShop`
- [ ] Xác nhận repo nhóm đang **public**
- [ ] Xác nhận tên/email git local (`git config user.name`) khớp để lọc commit log
- [x] Giỏ hàng (FR-07) chỉ lưu ở state trình duyệt (đã kiểm tra `CartContext.jsx`)
- [ ] Đối chiếu bug khóa 180s/30s với bug đã báo ở HW02
