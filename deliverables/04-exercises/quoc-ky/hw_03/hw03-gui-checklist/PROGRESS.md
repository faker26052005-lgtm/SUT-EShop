# HW03 GUI Checklist Progress Tracker

## Session & Project Overview
- **Student:** 23120138 – Nguyễn Quốc Kỳ (`quockinguyen.lv@gmail.com`)
- **SUT:** EShop ([SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))
- **Screens in Scope:** `Cart` (Pool B: FR-07), `Checkout` (Pool B: FR-08, FR-09)
- **Target Platforms:** BrowserStack (Chrome, Firefox, Safari)
- **Audit Tool:** `hw-ai-audit`

## Phase Tracking

| Phase | Description | Status | Gate / Checkpoint Notes |
|---|---|---|---|
| Phase 1: Scope & Mapping | Map FRs, enumerate UI elements, capture reference context | **PASSED** | Checkpoint 1 passed: FR mapping verified, context created, reference screenshots collected. |
| Phase 2: Seed Taxonomy | Select IA categories for Cart & Checkout | **PASSED** | Checkpoint 2 passed: All 4 IAs seeded with canonical categories; Main menu included per student request. |
| Phase 3: Initial Checklist | AI generates 48-60 items across IA-01..IA-04 | **PASSED** | Checkpoint 3 passed: 85 items generated across all 4 IAs (IA-01: 23, IA-02: 27, IA-03: 17, IA-04: 18), all strict rules applied. |
| Phase 4: Review & Deduplication | Student reviews AI items (Keep/Edit/Reject) | **PASSED** | Checkpoint 4 passed: Rà soát toàn diện 4 IAs, chốt 70 items chính thức (Cart: 22, Checkout: 48). Đã loại bỏ/gộp 19 items trùng lặp/backend, ghi đầy đủ lý do từ chối. Đã audit Artifacts #13-#16 vào AI_Audit_Report.md. |
| Phase 5: Gap Analysis | Student adds human items + reasons why AI missed them | **PASSED** | Checkpoint 5 passed: Thêm 3 items Source: Human (H-01, H-02, H-05) bù đắp vùng mù AI (a11y touch target, a11y E2E keyboard flow, localization dấu chấm phân cách). Cập nhật 3 sửa nhỏ (contrast ratio measurement & whitespace). Tổng checklist đạt 73 items (70 AI + 3 Human). |
| Phase 6: Execution Sheet | Multi-platform execution on Chrome, Firefox, Safari | **IN PROGRESS (Chrome: 73/73 DONE; Firefox: 73/73 DONE)** | Hoàn thành thực thi 100% trên cả Chrome và Firefox: 73/73 items (51 Passed, 22 Failed, 0 N/A trên mỗi nền tảng). Đã đồng bộ chi tiết vào `checklist.xlsx` và `checklist.md`. Tiếp tục thực thi trên Safari (BrowserStack). |
| Phase 7: Bugs & Summary | File GitHub issues, reconcile counts, cross-platform matrix | PENDING | Batch issue creation + test summary. |

## Checkpoint 1 Gate Review (Phase 1: Scope)
- [x] Every screen has an FR mapping in `screen-maps/eshop.md` (Cart $\rightarrow$ FR-07, Checkout $\rightarrow$ FR-08, FR-09).
- [x] Every chosen screen has a usable description in `screen-context/` (`cart.md`, `checkout.md`).
- [x] Reference screenshots captured for all key states in `screen-context/images/`:
  - `cart_default.png`, `cart_empty.png`
  - `checkout_default.png`, `checkout_coupon-error.png`, `checkout_coupon-success.png`, `checkout_success.png`
- [x] Unique scope confirmed within student group (Cart + Checkout).
- [x] Scope plausibility: 2 feature-rich transaction screens easily support > 40 granular checklist items across all 4 IAs.

## Checkpoint 2 Gate Review (Phase 2: Seed Taxonomy)
- [x] Every IA (IA-01, IA-02, IA-03, IA-04) has at least one relevant category selected.
- [x] Taxonomy names strictly adhere to course canonical taxonomy (`Reference: taxonomy` in `SKILL.md`).
- [x] `Main menu` added under IA-03 per student instruction to verify Navbar and brand link on Cart and Checkout.
- [x] Omitted categories explained and verified against SUT context (no Breadcrumbs, no multi-step wizard, no mandatory fields in current UI).

## Checkpoint 3 Gate Review (Phase 3: Initial Checklist)
- [x] All 85 items have all required fields filled (ID, Screen, IA, Category, Preconditions/Test Data, Check, Expected Result, Observed, Priority, Priority Rationale, Technical Notes).
- [x] Each IA meets or exceeds floor of ~8 items (IA-01: 23, IA-02: 27, IA-03: 17, IA-04: 18; Total: 85 items).
- [x] Expected results describe purely observable visual/behavioral outcomes (no Tailwind/CSS class names).
- [x] Empirical real SUT data used across all items (`Samsung Galaxy S24 Ultra` 28,000,000 ₫, `iPhone 15 Pro Max` 30,000,000 ₫, valid coupons `SAVE10`, `BIGBUY`, `VIP100`, expired coupon `EXPIRED`, real URLs).
- [x] Strict binary testability enforced (no "hoặc", "đúng chuẩn", "gọn gàng", "phù hợp").
- [x] Separate items for distinct element states (button disabled/enabled, empty/populated inputs, hover/idle).
- [x] Draft items persisted to `checklist.md`.

## Checkpoint 5 Gate Review (Phase 5: Gap Analysis)
- [x] Total verified checklist items = 73 (vượt xa yêu cầu > 40 items của đề bài).
- [x] Mỗi item do con người thêm đều có nguyên văn lý do sinh viên đánh giá vì sao AI bỏ sót (vùng mù đo đạc kích thước thực tế vùng bấm trên màn hình cảm ứng, kiểm tra hoàn tất luồng toàn trình bằng bàn phím thay vì chỉ kiểm tra thứ tự Tab, và chuẩn định dạng số bản địa hóa vi-VN thay vì chỉ nhìn tính nhất quán nội bộ SUT).
- [x] Mỗi phân nhóm giao diện (IA) đều đạt và vượt xa ngưỡng tối thiểu (~8 items): IA-01 có 23 items, IA-02 có 19 items, IA-03 có 19 items, IA-04 có 12 items.
- [x] Dữ liệu quan sát thực tế (Observed) và số đo DevTools được ghi nhận chính xác theo thực nghiệm, không tự suy đoán (Observed H-01: 57x24 px & 25x24 px; H-02: PASS; H-05: FAIL; cùng 2 số đo tương phản bổ sung: CART-IA01-04 đạt 2.44:1, CHCK-IA01-05 đạt 2.94:1).

## Checkpoint 6 Gate Review (Phase 6: Execution Sheet)
- [x] Multi-platform execution sheet `checklist.xlsx` được khởi tạo thành công với 73 items (15 cột chuẩn: ID, Screen, IA, Category, Check, Expected result, Priority, Source, Why AI missed it, Result: Chrome, Result: Firefox, Result: Safari, Notes, Screenshot ref, Bug ID).
- [x] Cột kết quả kiểm thử được cấu hình Data Validation dropdown giới hạn nghiêm ngặt `Passed,Failed` (khởi tạo trống hoàn toàn để sinh viên điền).
- [x] Sheet `Summary` chứa công thức Excel tự động tính số lượng Designed, Executed, Passed, Failed cho 3 nền tảng Chrome, Firefox, Safari.
- [x] File Markdown copy `checklist.md` được đồng bộ cấu trúc 14 cột phục vụ báo cáo và theo dõi.
- [x] Bản nháp chi tiết đầy đủ ghi chú kỹ thuật, lý do priority và quan sát ban đầu được lưu trữ an toàn tại `checklist_draft_p3_p5.md`.
- [x] Thực thi hoàn tất trên Google Chrome (Desktop): 73/73 items được kiểm tra thực tế, ghi nhận kết quả 51 Passed, 22 Failed, 0 N/A.
- [x] Toàn bộ 22 mục `Failed` trên Chrome có ghi chú thực tế chi tiết tại cột Notes và đường dẫn ảnh minh chứng `evidence/screenshots/FAILED_<ID>_Chrome.png` tại cột Screenshot ref.
- [x] Thực thi hoàn tất trên Mozilla Firefox (Gecko Desktop): 73/73 items được kiểm tra thực tế, ghi nhận kết quả 51 Passed, 22 Failed, 0 N/A.
- [x] Toàn bộ 22 mục `Failed` trên Firefox có ghi chú thực tế chi tiết (tiền tố `Firefox:`) và đường dẫn ảnh minh chứng `evidence/screenshots/FAILED_<ID>_Firefox.png` tại cột Screenshot ref.
- [x] Không có ô Result nào do AI tự ý điền (toàn bộ kết quả đều do sinh viên quan sát và quyết định Pass/Fail trên SUT thực tế).
- [ ] Thực thi trên Safari (WebKit engine qua BrowserStack).

## Log of Rejected AI Items (For Oral Defense)

| Item ID | Screen | IA | Category | Original Check / Intent | Reason for Rejection (Student Decision) |
|---|---|---|---|---|---|
| `CART-IA01-03` | Cart | IA-01 | `Layout and alignment` | Độ rộng khung chứa nội dung giỏ hàng | Expected "dàn rộng 100%" mâu thuẫn giao diện thật; không có requirement quy định độ rộng; khác biệt layout giữa Cart và Checkout là lựa chọn thiết kế UI. |
| `CART-IA01-11` | Cart | IA-01 | `Labels` | Chuỗi nhãn hiển thị tổng tiền tạm tính | Kiểm tra chuỗi tĩnh, không có tiêu chuẩn độc lập; ý nhất quán quy cách viết hoa đã nằm trong `CART-IA01-10`. |
| `CHCK-IA01-02` | Checkout | IA-01 | `Layout and alignment` | Độ rộng và căn lề của khung thẻ Checkout | Expected lấy từ code (max-w-lg ~512px), không có requirement quy định độ rộng; khác biệt độ rộng giữa Cart và Checkout là lựa chọn thiết kế UI, tương tự CART-IA01-03. |
| `CART-IA02-01` | Cart | IA-02 | `Field order and Tab sequence` | Thứ tự di chuyển tiêu điểm phím Tab qua các phần tử trên Cart | Cart không có form / ô nhập liệu; nội dung kiểm tra thứ tự Tab được chuyển sang IA-03 (`Focus order`). |
| `CHCK-IA02-04` | Checkout | IA-02 | `Data validation (EP/BVA boundaries)` | Cố nhập số âm -500000 vào ô tổng tiền | Trùng lặp với 03 (cùng mục tiêu kiểm tra ô chỉ đọc, chỉ khác giá trị nhập); gộp thành test data biên số âm trong `CHCK-IA02-03`. |
| `CHCK-IA02-05` | Checkout | IA-02 | `Data validation (EP/BVA boundaries)` | Cố nhập số thập phân 28000000.5 vào ô tổng tiền | Trùng lặp với 03 (cùng mục tiêu kiểm tra ô chỉ đọc, chỉ khác giá trị nhập); gộp thành test data số thập phân trong `CHCK-IA02-03`. |
| `CHCK-IA02-06` | Checkout | IA-02 | `Data validation (EP/BVA boundaries)` | Cố nhập số cực đại 999999999999 vào ô tổng tiền | Trùng lặp với 03 (cùng mục tiêu kiểm tra ô chỉ đọc, chỉ khác giá trị nhập); gộp thành test data số nguyên cực đại trong `CHCK-IA02-03`. |
| `CHCK-IA02-07` | Checkout | IA-02 | `Data validation (EP/BVA boundaries)` | Cố gõ ký tự chữ "abc", số mũ "e", dấu "-" vào ô tổng tiền | Trùng lặp với 03 (cùng mục tiêu kiểm tra ô chỉ đọc, chỉ khác giá trị nhập); gộp thành test data ký tự phi số trong `CHCK-IA02-03`. |
| `CHCK-IA02-09` | Checkout | IA-02 | `Input constraints` | Nhấn phím mũi tên Lên/Xuống hoặc cuộn chuột trong ô tổng tiền | Trùng lặp với 08 (cùng mục tiêu kiểm tra ô chỉ đọc không đổi số, chỉ khác thao tác); gộp vào `CHCK-IA02-08`. |
| `CHCK-IA02-15` | Checkout | IA-02 | `Control state vs. data state` | Sửa giá trị ô tổng tiền về 0 rồi bấm Xác Nhận Thanh Toán | Màn hình xác nhận thành công (`success === true`) trong `Checkout.jsx` chỉ hiện text "Thanh toán thành công! Cảm ơn bạn..." và nút "Quay lại trang chủ", hoàn toàn không hiển thị số tiền của đơn hàng đã đặt; không thể quan sát giá trị đơn hàng trên UI (thuần backend logic). |
| `CHCK-IA02-23` | Checkout | IA-02 | `Field order and Tab sequence` | Thứ tự di chuyển tiêu điểm khi đi lùi bằng Shift+Tab | Trùng lặp với 21/22, chỉ là chiều ngược của thứ tự Tab; gộp bước kiểm tra Shift+Tab vào `CHCK-IA02-22`. |
| `CHCK-IA02-25` | Checkout | IA-02 | `Focus on the right object` | Hành vi tiêu điểm khi nhấp vào nhãn của ô tổng tiền | Trùng cơ chế liên kết label-input với `CHCK-IA02-24`; Expected "không nhận focus vì chỉ đọc" sai (ô readonly vẫn nhận focus theo chuẩn web); tính chỉ đọc đã được kiểm tra ở `CHCK-IA02-03` và `08`. |
| `CHCK-IA03-09 (cũ)` | Checkout | IA-03 | `Focus order` | Thứ tự tiêu điểm phím Tab trên màn hình hoàn tất đơn hàng | Màn hình thành công chỉ có Navbar và một liên kết ("Quay lại trang chủ"), rủi ro giao diện thấp, cơ chế Tab màn hình đơn giản đã kiểm soát bởi `CART-IA03-09`. Thay thế bằng item Focus order trên form chính của `/checkout`. |
| `CART-IA04-04 (cũ)` | Cart | IA-04 | `State transitions` | Sự chuyển đổi trạng thái giao diện từ giỏ trống sang có bảng SP | Chỉ là chiều ngược của `CART-IA04-01` và phụ thuộc luồng thêm vào giỏ ở trang chủ (ngoài phạm vi Cart/Checkout). Đã thay thế bằng item State transitions chuyển từ lỗi sang thành công trên Checkout (`CHCK-IA04-12`). |
| `CHCK-IA04-03` | Checkout | IA-04 | `Error messages` | Thông báo lỗi khi đơn hàng chưa đạt giá trị tối thiểu của mã BIGBUY | Điều kiện test chỉ đạt được bằng cách sửa ô tổng tiền (ô không được phép sửa theo requirement); giỏ hàng hợp lệ tối thiểu 28,000,000 ₫ không bao giờ dưới 500,000 ₫; là rule backend không có cách kích hoạt hợp lệ qua UI thực tế. |
| `CHCK-IA04-06 (cũ)` | Checkout | IA-04 | `Loading and empty states` | Nút "Áp dụng" đổi sang "..." và mờ đi khi mạng chậm | Trùng lặp với `CHCK-IA02-18` (đã kiểm tra toàn diện trạng thái disabled và nhãn "..." của nút). |
| `CHCK-IA04-07 (cũ)` | Checkout | IA-04 | `Loading and empty states` | Nút "Xác Nhận Thanh Toán" đổi sang "Đang xử lý..." khi mạng chậm | Trùng lặp với `CHCK-IA02-19` (đã kiểm tra toàn diện trạng thái disabled và nhãn "Đang xử lý..."). |
| `CHCK-IA04-09 (cũ)` | Checkout | IA-04 | `Currency of data on screen` | F5 reload trên màn hình Checkout | Trùng cơ chế với `CART-IA04-03` (state chỉ lưu trong RAM React nên F5 làm mất giỏ hàng); chỉ giữ 1 item F5 đại diện trên Cart. |
| `CHCK-IA04-11 (cũ)` | Checkout | IA-04 | `State transitions` | Form thanh toán unmount hoàn toàn trên cùng container khi thành công | Trùng lặp với `CHCK-IA04-05` (kiểm tra form biến mất và thay bằng view thành công); "unmount cùng container" là chi tiết DOM/React nội bộ không quan sát được trên UI. |

> **Ghi chú IA-03 Đợt 1 (Cart Navigation):** Toàn bộ 9 items đều được giữ lại (0 reject) vì không có item nào trùng lặp hoặc vi phạm ranh giới kiểm tra backend; các item tập trung trực diện vào hành vi điều hướng thực tế và luồng phím Tab của giỏ hàng.
