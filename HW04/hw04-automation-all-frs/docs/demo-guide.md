# Hướng dẫn quay video demo (HW04)

Cấu trúc video theo yêu cầu: **(A)** demo từ đầu đến cuối và giải thích kết quả; **(B)** chọn một chỗ sai tiêu biểu của script AI, sửa trực tiếp, chạy lại và so sánh kết quả.

Tài liệu này không nằm trong báo cáo chính.

**Quy ước:** [ĐÃ CHẠY] = đã chạy thử khi chuẩn bị tài liệu và có kết quả thật; [CẦN ĐO] / [CẦN THỬ] = cần SUT thật hoặc chưa được kiểm chứng, hãy chạy thử một lần trước khi quay.

---

## 1. Chọn chỗ sai để sửa trực tiếp

**Đề xuất: lỗi race condition khi bắt `alert()` (mục B-1 trong báo cáo, mã R1).** Lý do:

- Đây là lỗi **thật**, chỉ lộ ra khi chạy trên SUT thật, và file review của bạn đã đánh dấu "dùng cho video".
- Là chỗ duy nhất trong các sửa mà **kết quả pass/fail trên SUT thật thay đổi** nên so sánh trước/sau nhìn thấy ngay. Các sửa F1-F5 (mục E) đều giữ nguyên số test đỏ, nên chỉ dùng làm phương án phụ.
- Giải thích đơn giản: hộp thoại do JavaScript của trang tự bật ngay lúc bấm nút, nên mốc "số hộp thoại hiện có" phải lấy **trước** khi bấm. Sửa chỉ là dời một dòng.
- Helper dùng chung cho FR-04 và FR-08 nên một chỗ sửa ảnh hưởng nhiều test.

**Lưu ý trung thực về con số.** Bản nháp đầu của AI có 15/26 test FR-04 đỏ, nhưng con số đó gồm cả lỗi "assertion quá chặt" (R2). Patch `demo/patches/R1-dialog-race.patch` chỉ tái tạo riêng lỗi race, nên số test đỏ giả khi tái tạo sẽ **nhỏ hơn 15**. Dự kiến những test yêu cầu thông báo thành công sẽ đỏ giả (F01-F03 của FR-04, có thể thêm C11 của FR-08), mỗi test chờ khoảng 4 giây rồi trả `null`. [CẦN ĐO] Hãy đo trước khi quay và dùng số bạn đo được.

**Phương án dự phòng.** Nếu khi đo, bản "trước" chỉ khác bản "sau" từ 0 đến 2 test (quá ít để so sánh), dùng **F1** làm chỗ sửa trực tiếp (phụ lục A). F1 có bản demo chạy được không cần SUT, nên so sánh trước/sau luôn rõ.

---

## 2. Chuẩn bị trước khi quay

1. Bật đủ SUT: backend `3000`, web khách `5173`, admin `5174`.
2. Chép các file trong gói cập nhật vào repo và commit để có điểm quay lại:
   ```
   git add -A
   git commit -m "HW04: review fixes"
   ```
3. Chạy thử trọn quy trình (mục 3 và 4) một lần, ghi lại: thời gian mỗi lệnh, số test đỏ ở bản "trước" và bản "sau" trên **cả ba trình duyệt**, rồi chọn trình duyệt có khác biệt rõ nhất (theo ghi chú của bạn, một phần test đỏ giả chỉ xuất hiện trên Firefox và WebKit).
4. Xóa kết quả thử: `git checkout -- .` (nếu đã commit ở bước 2 thì quay về bản đã sửa), xóa thư mục `reports/` và `demo-out/` để video bắt đầu sạch.
5. Dàn màn hình: một cửa sổ terminal (PowerShell) cỡ chữ lớn, một editor mở sẵn `tests/helpers/web.ts` và `demo/patches/R1-dialog-race.patch`, một trình duyệt cho báo cáo HTML.
6. Đề bài trong repo không ghi thời lượng tối đa của video; nếu có giới hạn, dùng kế hoạch rút gọn ở mục 3 (đánh dấu "có thể rút").

---

## 3. Phần A: demo từ đầu đến cuối (khoảng 8-10 phút)

| Mốc | Việc làm trên màn hình | Nói gì |
| :-: | :-- | :-- |
| A1 (0:00-0:40) | Chạy `npm run whoami` và mở `README.md` | Giới thiệu bài, MSSV, ba feature FR-04, FR-08, FR-13 trên SUT EShop. Lệnh `whoami` là bằng chứng chạy trên máy của bạn |
| A2 (0:40-2:00) | Mở thư mục repo: `tests/`, `tests/helpers/`, `data/`, `docs/`, `bugs/`. Mở `data/fr13-dashboard.json` (một dòng) và đối chiếu với `tests/fr13-dashboard.spec.ts` | Test viết theo dạng data-driven: dữ liệu nằm trong JSON, spec chỉ lặp qua từng dòng. Chỉ ra ba dạng assertion: so sánh giá trị (`toBe`), trạng thái giao diện (`toBeVisible`), so sánh/điều kiện (`toBeGreaterThan`, `expect.poll`) |
| A3 (2:00-2:30) | Mở nhanh `http://localhost:5173` (web khách) và `http://localhost:5174` (admin) | SUT đang chạy ở ba cổng. Có thể rút |
| A4 (2:30-5:30) | Chạy một lượt, ví dụ FR-13 trên Chromium: `node scripts/run-matrix.js fr13 chromium` | Giải thích output: `✓` là pass, `✘` là fail. Fail ở đây là **kỳ vọng**, mỗi test đỏ là một hành vi sai so với SRS. Cuối output ghi số passed và failed (kỳ vọng FR-13: 8 đỏ, 11 xanh). Nếu lượt chạy lâu, quay sẵn và tua hoặc chạy trước rồi chỉ trình bày kết quả |
| A5 (5:30-8:30) | `npx playwright show-report reports/fr13-chromium`. Chỉ tiêu đề báo cáo (`Run by: 23120056` và thời điểm chạy). Mở test S01 (đỏ): `Expected` và `Received`, ảnh chụp lúc fail. Mở S02 (xanh). Mở S05 (annotation CLARIFY) | S01: doanh thu hiển thị gấp đôi tổng các đơn Delivered, tương ứng FR13-BUG-01 (issue #186). S02: đơn pending không cộng vào doanh thu, đúng SRS. S05: SRS không nói đơn Canceled có tính vào "Tổng số đơn" không, nên test chỉ ghi lại hành vi quan sát được, không phán xét |
| A6 (8:30-9:30) | Mở `REPORT.md` (Phần 1, mục 1.3 bảng bug) và chạy `npm run summary`, rồi mở `docs/test-summary.md` | Tổng hợp cả ba feature: 60 test mỗi trình duyệt, 9 lượt chạy, 180 lượt thực thi, 120 pass và 60 fail, quy về 9 bug (2 Critical, 6 High, 1 Medium). Kết quả giống hệt nhau trên ba trình duyệt nên không có bug riêng của một trình duyệt. Phần FR-04 và FR-08 trình bày qua bảng này vì không có thời gian chạy lại |

Ghi chú: để `npm run summary` ra đủ số liệu ba feature, cần đã chạy trước `npm run test:all` (kết quả nằm ở `reports/_json`).

---

## 4. Phần B: sửa trực tiếp một lỗi và so sánh (khoảng 4-5 phút)

### B1. Giới thiệu lỗi (khoảng 1 phút)

Mở mục B-1 trong `docs/review/fr04-review.md` (hoặc `REPORT.md` mục 2.4, nhóm R1) và mở `tests/helpers/web.ts`. Nói:

"Bản script đầu của AI bắt hộp thoại `alert()` như sau: bấm nút, rồi nhớ số hộp thoại đang có, rồi chờ có thêm một hộp thoại mới. Nhưng hộp thoại của trang này hiện ra ngay trong lúc bấm, nên khi mình nhớ số hộp thoại thì nó đã được tính rồi. Test chờ một hộp thoại không bao giờ đến, hết 4 giây rồi trả `null`, và những test mong đợi thông báo thành công bị đỏ giả. Lỗi này chỉ lộ ra khi chạy trên SUT thật, vì AI không có SUT để thử."

### B2. Chạy bản TRƯỚC khi sửa (khoảng 1 phút, cắt đoạn chờ)

```
git apply -R demo/patches/R1-dialog-race.patch
node scripts/run-matrix.js fr04,fr08 firefox
New-Item -ItemType Directory -Force demo-out | Out-Null
Copy-Item reports\_json\fr04-firefox.json demo-out\before-fr04-firefox.json
Copy-Item reports\_json\fr08-firefox.json demo-out\before-fr08-firefox.json
```

Dòng đầu đưa script về bản trước khi sửa: mở `tests/helpers/web.ts` để chỉ dòng `const mark` đang nằm **sau** `await target.click()`. Sau khi chạy, chỉ vào các test đỏ lạ: nội dung lỗi dạng `Expected: "Cập nhật thành công!" Received: null`. [CẦN ĐO] Trên SUT không phải lúc nào cũng đúng chính xác như vậy; hãy chạy thử trước.

### B3. Sửa trực tiếp (khoảng 1 phút)

Sửa ngay trên màn hình trong `tests/helpers/web.ts`: dời dòng `const mark = messages.length;` lên **trước** `await target.click();`, thêm comment giải thích. Hai cách:

- Gõ tay (khuyến nghị cho video): đây là thay đổi hai dòng.
- Hoặc `git apply demo/patches/R1-dialog-race.patch` rồi mở file để chỉ vào chỗ đã đổi.

### B4. Chạy lại và so sánh (khoảng 1-2 phút)

```
node scripts/run-matrix.js fr04,fr08 firefox
node demo/compare-runs.js demo-out\before-fr04-firefox.json reports\_json\fr04-firefox.json
node demo/compare-runs.js demo-out\before-fr08-firefox.json reports\_json\fr08-firefox.json
```

Script so sánh in ba nhóm: **RED -> GREEN** (đỏ giả đã biến mất nhờ bản sửa), **GREEN -> RED** (hồi quy, phải bằng 0) và **STILL RED** (bug thật của SUT). Phần FR-04 sau sửa phải còn đúng 8 test đỏ: P01-P05, P13, X01, X02 (3 bug FR04-BUG-01, 02, 03), giống nhau trên cả ba trình duyệt. [ĐÃ CHẠY] Script `compare-runs.js` đã được thử trên file JSON thật của Playwright (có dữ liệu giả lập hai bản trước/sau).

Bảng so sánh mẫu để điền vào video (số "trước" là số bạn đo):

| Chỉ số (FR-04, Firefox) | Trước khi sửa | Sau khi sửa |
| :-- | :-: | :-: |
| Test đỏ | [CẦN ĐO] | 8 |
| Test xanh | [CẦN ĐO] | 18 |
| Đỏ giả (đã biến mất) | [CẦN ĐO] | 0 |
| Đỏ thật (bug của SUT) | 8 | 8 |

### B5. Chốt (khoảng 30 giây)

"Điểm quan trọng: sau khi sửa, số test đỏ còn lại đúng bằng số bug thật. Trước khi sửa, nhiều test đỏ nhưng không phải vì SUT sai mà vì script sai, và nếu mình không review thì mình sẽ báo nhầm bug. Các chỗ AI sai hoặc bỏ sót khác, như chờ cố định, assertion rỗng, selector mong manh, được ghi trong báo cáo mục 2.3 và 2.4."

### Câu hỏi có thể gặp

- **Sao lỗi này chỉ lộ trên SUT thật?** Vì AI viết theo giả định hộp thoại hiện sau khi bấm; hộp thoại thật hiện ngay trong lúc bấm.
- **Sao khác nhau giữa các trình duyệt?** Thời điểm hộp thoại được xử lý khác nhau giữa các engine, nên một phần đỏ giả chỉ xuất hiện ở Firefox và WebKit (theo ghi nhận của lần chạy thật).
- **Lỗi này thuộc loại nào?** M (hạn chế của model: không có SUT để thử) và F (đặc thù feature: `alert()` native chạy đồng bộ).

---

## 5. Khôi phục sau khi quay

```
git status
git checkout -- .          # về lại bản đã commit ở mục 2 (đã sửa)
Remove-Item -Recurse -Force demo-out
```

---

## Thuật ngữ cần nhớ (nói được trong 10 giây mỗi cái)

- **Flaky wait:** chờ theo thời gian cố định (ví dụ 500 ms) thay vì chờ một sự kiện cụ thể; có lúc đủ, có lúc không, nên test lúc đỏ lúc xanh hoặc báo pass giả.
- **Assertion rỗng (vacuous):** assertion mà trong một số tình huống không kiểm tra gì cả, nên test vẫn pass dù hệ thống sai (ví dụ vòng `for` trên danh sách rỗng).
- **`expect.poll`:** hàm của Playwright gọi đi gọi lại một hàm cho tới khi giá trị khớp hoặc hết giờ; dùng để chờ một con số trên giao diện cập nhật xong.
- **Locale:** quy tắc định dạng theo vùng, ví dụ `58,000,000` (en-US) hay `58.000.000` (vi-VN).
- **Pass giả / đỏ giả:** pass giả là test xanh dù hệ thống sai; đỏ giả là test đỏ dù hệ thống đúng.

---

## Phụ lục A. Các sửa F1-F5 (phương án phụ)

Các sửa này đến từ lượt review thứ ba (mục E trong báo cáo). Chúng giữ nguyên số test đỏ trên SUT thật nên không dùng làm phần sửa trực tiếp chính; dùng khi cần phương án dự phòng (F1) hoặc muốn nói thêm. Quay lại trạng thái trước/sau của từng sửa: `git apply -R demo/patches/<tên>.patch` và `git apply demo/patches/<tên>.patch`. Các patch độc lập với nhau và đã được thử áp dụng, hoàn tác, áp dụng lại. Nếu `git apply` báo lỗi trên Windows, thêm `--ignore-whitespace` hoặc gõ tay.

### F1. `digits()` không được đọc "không có số" thành 0 (FR-13)

**File:** `tests/helpers/admin.ts`, patch `demo/patches/F1-digits.patch`.

**Lời giải thích (khoảng 40 giây):**
"Hàm `digits` đọc số từ ô doanh thu trên dashboard. Bản AI sinh ra dùng `Number('')`, mà `Number('')` bằng 0. Nghĩa là nếu ô hiển thị `NaN`, dấu gạch hoặc rỗng, hàm vẫn trả về 0. Các test kiểu 'doanh thu không đổi' như S02 đến S05 và S10 so sánh số trước và số sau, cả hai đều đọc ra 0, nên chênh lệch bằng 0 và test pass, dù chẳng đọc được gì. Mình sửa để khi không có chữ số nào thì trả về `NaN`, và `NaN` thì không bao giờ bằng 0."

**Các bước demo:**

1. **Demo không cần SUT** [ĐÃ CHẠY]:
   ```
   npx playwright test -c demo/playwright.demo.config.ts
   ```
   Kết quả thật khi chạy:
   ```
   old: before=0 after=0 delta=0
   ✓ 1. OLD digits(): a broken tile reads as 0, so "revenue did not change" passes with nothing read
   new: before=NaN after=NaN delta=NaN
   ✓ 2. NEW digits(): the same broken tile is NaN, so the same check can no longer pass
   throwing version ended after 7 ms (the tile became readable only after 1500 ms)
   ✘ 3. THROWING version inside expect.poll: the poll stops at the first bad read (no retry)
   NaN version passed after 1867 ms
   ✓ 4. NaN version inside expect.poll: the poll keeps retrying and passes once the tile is readable
   4 passed
   ```
   Cách giải thích từng dòng:
   - **Test 1:** bản cũ, ô hỏng đọc ra 0 và 0, chênh lệch 0, kiểm tra "không đổi" **pass** (đây là điểm yếu).
   - **Test 2:** bản mới, cùng ô hỏng đọc ra `NaN`, chênh lệch `NaN`; trong test thật câu `toBe(0)` sẽ **fail**.
   - **Test 3 và 4** (mục "cú rẽ"): ý định đầu của mình là cho hàm **ném lỗi** khi không có số. Nhưng `expect.poll` của Playwright 1.65.1 khi gặp lỗi ném ra sẽ dừng ngay (7 ms) thay vì thử lại, trong khi ô số liệu thật có thể đọc được chỉ sau vài trăm mili giây. Dấu `✘` ở test 3 là **thất bại có chủ ý** (test được đánh dấu `test.fail()`, nên tổng vẫn là 4 passed). Với `NaN`, poll tiếp tục thử và pass sau khoảng 1,9 giây khi ô đã có số.
2. Mở `demo/patches/F1-digits.patch` để cho thấy dòng trước và sau.
3. (Tùy chọn, cần SUT) [CẦN THỬ] Cho thấy sửa xong thì test thật không bị ảnh hưởng:
   ```
   git apply -R demo/patches/F1-digits.patch
   npx playwright test tests/fr13-dashboard.spec.ts -g "S02|S13" --project=chromium
   git apply demo/patches/F1-digits.patch
   npx playwright test tests/fr13-dashboard.spec.ts -g "S02|S13" --project=chromium
   ```
   Cả hai lần đều ra cùng kết quả (S02 pass, S13 fail vì FR13-BUG-01). Giải thích: sửa này không đổi kết quả khi ô đọc được; nó chỉ chặn pass giả khi ô hỏng.

**Câu hỏi có thể gặp:** "Sao không cho ném lỗi?" Trả lời bằng Test 3 và 4. "Test nào bắt được ô hỏng trước đây?" Chỉ các test có giá trị lớn hơn 0 (S01, S06-S08, S13); các ca "không đổi" thì không.

---

### F4. Vòng `for` rỗng ở C05 và C06 (FR-08)

**File:** `tests/fr08-checkout.spec.ts`, patch `demo/patches/F4-orders-guard.patch`.

**Lời giải thích (khoảng 40 giây):**
"C05 và C06 sửa ô tổng tiền thành 1 hoặc 0 rồi thanh toán, và kiểm tra đơn đã lưu có đúng tổng giỏ hàng không. Code ban đầu viết `for (const o of orders) expect(...)`. Nếu danh sách đơn rỗng thì vòng lặp không chạy, không có assertion nào, và test pass. Điều này kể cả khi giao diện đã hiện 'Thanh toán thành công' mà thực tế không lưu đơn nào. Mình thêm hai điều kiện: tối đa một đơn, và nếu không có đơn thì bắt buộc phải có thông báo lỗi cho người dùng."

**Các bước demo:**

1. Mở patch, chỉ vào vòng `for` cũ và hai `expect` mới.
2. Chạy test thật, nó vẫn đỏ vì bug FR08-BUG-01 (đơn được lưu với tổng 1 và 0) [CẦN THỬ]:
   ```
   npx playwright test tests/fr08-checkout.spec.ts -g "C05|C06" --project=chromium
   ```
   Kết quả kỳ vọng: `Expected: 58000000, Received: 1` và `Expected: 30000000, Received: 0`. Nói rõ: sửa này **không làm test xanh**, nó làm test chặt hơn.
3. (Tùy chọn) Mô phỏng tình huống "trang báo thành công nhưng không có đơn" [CẦN THỬ, chưa kiểm chứng]: tạm thêm đoạn này vào `case 'checkout'`, ngay sau dòng `await toCheckoutByUi(page);` (nhớ xóa sau khi quay):
   ```ts
   await page.route('**/api/checkout', (route) =>
     route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok' }) }));
   ```
   Kỳ vọng: nếu giao diện coi phản hồi 200 là thành công, bản cũ pass (vòng `for` rỗng), bản mới fail với thông báo `a refused checkout must show an error to the user`. Nếu giao diện không hiện trang thành công thì bỏ phần này và chỉ giải thích bằng code.

**Giới hạn nên nói thẳng:** nếu server từ chối vì một lý do khác (ví dụ phiên đăng nhập hỏng) thì C05/C06 vẫn có thể pass, nhưng khi đó C01-C04 (thanh toán bình thường) sẽ đỏ.

---

### F2. Bỏ `waitForTimeout(500)` ở X02 (FR-04)

**File:** `tests/fr04-profile.spec.ts`, patch `demo/patches/F2-networkidle.patch`.

**Lời giải thích (khoảng 40 giây):**
"X02 kiểm tra tên người dùng có chứa thẻ `img` với `onerror` thì script có chạy không. Sự kiện `onerror` chạy bất đồng bộ, sau khi trình duyệt thử tải ảnh. Bản cũ chờ cố định nửa giây rồi mới kiểm tra. Trên máy hoặc trình duyệt chậm hơn, nửa giây có thể chưa đủ, và khi SUT được sửa, test có thể pass chỉ vì chưa kịp chờ. Mình thay bằng chờ trang tải xong và hết hoạt động mạng. Cách này vẫn dựa một phần vào thời gian, và chính Playwright ghi `networkidle` là không khuyến khích; nhưng ở đây không có sự kiện nào khác để chờ khi script không được chạy. Vì vậy kiểm tra chính vẫn là kiểm tra phần tử `img` không xuất hiện trên trang."

**Các bước demo:**

1. Mở patch, chỉ dòng `waitForTimeout(500)` bị thay bằng `waitForLoadState('networkidle')`.
2. Chạy test trước và sau [CẦN THỬ]:
   ```
   git apply -R demo/patches/F2-networkidle.patch
   npx playwright test tests/fr04-profile.spec.ts -g "X02" --project=chromium
   git apply demo/patches/F2-networkidle.patch
   npx playwright test tests/fr04-profile.spec.ts -g "X02" --project=chromium
   ```
   Kết quả kỳ vọng: cả hai lần X02 đều **fail** với `script from the name must not run`, `Received: 1` (bug FR04-BUG-03 còn đó). Nói rõ: sửa này nhằm tránh pass giả **sau khi** SUT được sửa, nên hôm nay chưa thấy khác biệt trên kết quả.

---

### F3. Cố định locale cho định dạng tiền (FR-08)

**File:** `tests/fr08-checkout.spec.ts` và `playwright.config.ts`, patch `demo/patches/F3-locale.patch`.

**Lời giải thích (khoảng 40 giây):**
"Test so sánh chuỗi tiền do Node tạo ra với chuỗi tiền do trình duyệt hiển thị. Hai bên lấy locale từ hai nguồn độc lập: Node từ môi trường tiến trình, trình duyệt từ hệ thống của nó. Cùng số 58 triệu có thể là `58,000,000` hay `58.000.000` tùy locale. Trên máy mình hai bên đang khớp nên C07 và C08 xanh, nhưng kết quả test không nên phụ thuộc vào máy chạy. Mình cố định cả hai phía về `en-US`. Đây là sửa phòng ngừa, chưa có lần đỏ nào được ghi nhận vì lý do này."

**Các bước demo:**

1. Cho thấy hai định dạng khác nhau [ĐÃ CHẠY]:
   ```
   node -e "console.log(new Intl.NumberFormat('vi-VN').format(58000000), (58000000).toLocaleString('en-US'))"
   ```
   Kết quả thật: `58.000.000 58,000,000`.
2. Mở patch: `locale: 'en-US'` trong `playwright.config.ts` và hàm `money()` trong spec.
3. Chạy C07 và C08 vẫn xanh [CẦN THỬ]:
   ```
   npx playwright test tests/fr08-checkout.spec.ts -g "C07|C08" --project=chromium
   ```
4. (Tùy chọn, minh họa vì sao phải cố định) [CẦN THỬ, chưa kiểm chứng]: tạm đổi `locale: 'en-US'` thành `locale: 'vi-VN'` trong `playwright.config.ts`, chạy lại lệnh trên. Nếu trang hiển thị `58.000.000` thì C07 và C08 sẽ đỏ vì test đang kỳ vọng `58,000,000`; đổi lại `en-US` thì xanh. Nhớ khôi phục sau khi quay.

---

### F5. `openAdmin` không được nuốt lỗi (FR-13)

**File:** `tests/helpers/admin.ts`, patch `demo/patches/F5-warn.patch`.

**Lời giải thích (khoảng 30 giây):**
"Khi mở trang admin, helper chờ request tải danh sách đơn hàng và bắt mọi lỗi bằng `catch(() => null)`. Nếu request này không bao giờ xảy ra, test vẫn chạy tiếp và chỉ hỏng ở bước sau với thông báo khó hiểu, nên người đọc không biết nguyên nhân thật. Mình thêm một cảnh báo `WARN` vào báo cáo HTML khi không thấy request. Kết quả pass hay fail không đổi, chỉ thêm thông tin."

**Các bước demo:**

1. Mở patch, chỉ phần `catch(() => null)` và đoạn `annotations.push` mới.
2. (Tùy chọn) Thấy cảnh báo trong báo cáo [CẦN THỬ, chưa kiểm chứng]: tạm thêm vào `openAdmin`, ngay trước `await page.goto(ADMIN_URL);`:
   ```ts
   await page.route('**/api/admin/orders', (route) => route.abort());
   ```
   Chạy `npx playwright test tests/fr13-dashboard.spec.ts -g "S01" --project=chromium`, rồi mở báo cáo bằng `npx playwright show-report reports/latest`. Test sẽ đỏ (dashboard không tải được) và trong chi tiết test có annotation `WARN`. Với bản cũ (`git apply -R demo/patches/F5-warn.patch`) không có dòng cảnh báo này. Xóa đoạn tạm sau khi quay.
