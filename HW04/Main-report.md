# HW04 - Automation Testing (EShop SUT) - Main report

Sinh viên: MSSV 23120056. Công cụ: Playwright (TypeScript), chạy Chromium, Firefox và WebKit. SUT: EShop (backend 3000, web khách 5173, admin 5174). Ba feature: **FR-04** (hồ sơ cá nhân), **FR-08** (thanh toán), **FR-13** (dashboard admin).

Báo cáo gồm hai phần: **Phần 1** tổng hợp kết quả automation và các phát hiện của cả ba feature; **Phần 2** là review / gap analysis của các script do AI sinh, cùng chi tiết các chỉnh sửa đã thực hiện.

---

## Phần 1. Automation report: tổng hợp phát hiện

### 1.1 Phạm vi và cách làm

- **Oracle:** kỳ vọng lấy từ SRS (`system_requirements_specification.md`, v2.0). Khi SRS hoặc API spec sai hay mâu thuẫn với hành vi đã kiểm chứng bằng Playwright thì hành vi đã kiểm chứng được coi là thông tin chính xác (xem `docs/spec-notes.md`). Chỗ SRS im lặng thì test ghi **CLARIFY**: ghi lại hành vi quan sát được, không làm test đỏ, không tự bịa kỳ vọng.
- **Data-driven:** mọi dữ liệu test nằm trong `data/*.json`, spec chỉ lặp qua các dòng dữ liệu và gọi helper.
- **Chạy tuần tự** (`workers: 1`, `fullyParallel: false`) vì SUT dùng một CSDL SQLite chung. Mỗi lượt chạy (feature x trình duyệt) sinh một báo cáo HTML riêng, tiêu đề có `Run by: 23120056` và thời điểm chạy.
- **Giao diện là nơi kiểm tra, API chỉ để dựng trạng thái và đọc lại kết quả:** tài khoản dùng một lần tạo qua API, giỏ hàng và checkout thao tác bằng UI, đơn đã lưu đọc lại bằng `GET /orders/my-orders` (oracle), tổng doanh thu tính lại từ `GET /api/admin/orders`.
- **Dạng assertion được dùng** (yêu cầu tối thiểu 3 dạng): so sánh giá trị (`toBe`, `toHaveLength`), trạng thái giao diện (`toBeVisible`, `toBeHidden`, `toBeDisabled`, `toHaveCount`, `toHaveValue`, `toContainText`, `toHaveURL`), và so sánh / điều kiện (`toBeGreaterThan`, `toContain`, `toBeNull`, `toBeUndefined`, `.not.toBe`, `expect.poll`).

### 1.2 Số liệu

| Feature | Test tự động hóa (một trình duyệt) | Lượt chạy | Thực thi (3 trình duyệt) | Pass | Fail | Bug |
| :-- | --: | --: | --: | --: | --: | --: |
| FR-04 | 26 | 3 | 78 | 54 | 24 | 3 |
| FR-08 | 15 | 3 | 45 | 33 | 12 | 3 |
| FR-13 | 19 | 3 | 57 | 33 | 24 | 3 |
| **Tổng** | **60** | **9** | **180** | **120** | **60** | **9** |

- Kết quả **giống hệt nhau trên cả ba trình duyệt** (FR-04: 8 đỏ, FR-08: 4 đỏ, FR-13: 8 đỏ mỗi lượt), nên không có bug riêng của một trình duyệt. 20 test đỏ khác nhau quy về 9 bug.
- Trong 40 test pass mỗi lượt có **7 ca của FR-04 (P07, P09, P14, F04-F07) chỉ ghi nhận hành vi, không assert kết quả** (CLARIFY). Vì vậy số pass có assertion thật là 33/60 mỗi lượt; số pass 40 chỉ đúng nếu tính cả các ca ghi nhận.
- Cấu trúc test: FR-04 gồm 14 ca số điện thoại (P01-P14), 7 ca tên/địa chỉ (F01-F07), 2 ca escape đầu ra (X01-X02), 3 ca truy cập và trường chỉ đọc (E01, A01, A02). FR-08 gồm C01-C15 (tổng tiền đã lưu, tổng bị sửa, tóm tắt đơn, giỏ sau thanh toán, thanh toán lỗi, khách chưa đăng nhập, giỏ rỗng, địa chỉ). FR-13 gồm S01-S13 (doanh thu và số đơn theo trạng thái, biên, đơn hỗn hợp, đi qua trạng thái bằng UI, trạng thái cuối) và A01-A06 (kiểm soát truy cập).

### 1.3 Bug tìm được

| Bug | Feature | Tiêu đề | Mức độ | Test | SRS | Issue |
| :-- | :-- | :-- | :-: | :-- | :-- | :-- |
| FR04-BUG-01 | FR-04 | Form hồ sơ từ chối SĐT hợp lệ (bắt đầu bằng 0, 10-11 chữ số) | High | P01-P04 | FR-04 | [#180](https://github.com/faker26052005-lgtm/SUT-EShop/issues/180) |
| FR04-BUG-02 | FR-04 | Form chấp nhận SĐT không bắt đầu bằng 0 | Medium | P05, P13 | FR-04 | [#181](https://github.com/faker26052005-lgtm/SUT-EShop/issues/181) |
| FR04-BUG-03 | FR-04 | Tên người dùng render như HTML ở header, chạy được script (XSS) | High | X01, X02 | SEC-04 | [#182](https://github.com/faker26052005-lgtm/SUT-EShop/issues/182) |
| FR08-BUG-01 | FR-08 | Server lưu tổng tiền do trình duyệt gửi (đơn bị đặt 0 hoặc 1 VND) | Critical | C05, C06 | FR-08 | [#183](https://github.com/faker26052005-lgtm/SUT-EShop/issues/183) |
| FR08-BUG-02 | FR-08 | Ô "Tổng tiền thanh toán" cho phép người dùng chỉnh sửa | High | C09 | FR-08 | [#184](https://github.com/faker26052005-lgtm/SUT-EShop/issues/184) |
| FR08-BUG-03 | FR-08 | Giỏ hàng không được xóa sau thanh toán thành công | High | C10 | FR-08 | [#185](https://github.com/faker26052005-lgtm/SUT-EShop/issues/185) |
| FR13-BUG-01 | FR-13 | Dashboard hiển thị "Tổng doanh thu" gấp đôi tổng các đơn Delivered | High | S01, S06-S09, S13 | FR-13 | [#186](https://github.com/faker26052005-lgtm/SUT-EShop/issues/186) |
| FR13-BUG-02 | FR-13 | Đơn Canceled vẫn có nút "Đánh dấu Đã giao" | High | S12 | FR-10 | [#187](https://github.com/faker26052005-lgtm/SUT-EShop/issues/187) |
| FR13-BUG-03 | FR-13 | Admin web không từ chối token của tài khoản thường | Critical | A04 | FR-12, SEC-03 | [#188](https://github.com/faker26052005-lgtm/SUT-EShop/issues/188) |

Phân bố mức độ: 2 Critical, 6 High, 1 Medium.

### 1.4 Phát hiện theo feature

**FR-04 - Hồ sơ cá nhân (3 bug).** Kiểm tra số điện thoại ở form (`Profile.jsx`) ngược với SRS: chấp nhận 9-10 chữ số bắt đầu bằng 1-9, từ chối số bắt đầu bằng 0 (SRS: bắt đầu bằng 0, 10-11 chữ số). Thông báo lỗi cũng nói "9-10 chữ số". Tên người dùng được đưa vào header bằng `dangerouslySetInnerHTML`, nên thẻ HTML được render và `onerror` chạy được (`window.__xss = 1`). Phần đúng: ô email bị khóa, khách chưa đăng nhập không dùng được trang hồ sơ, các dạng SĐT sai rõ ràng (chữ cái, thiếu hoặc thừa chữ số) đều bị từ chối, tên tiếng Việt có dấu và địa chỉ thường được lưu đúng.

**FR-08 - Thanh toán (3 bug).** Backend ghi thẳng `total_amount` từ body vào đơn mà không tính lại (đơn lưu 1 và 0 thay vì 58.000.000 và 30.000.000), trong khi trang thanh toán còn để người dùng sửa ô tổng tiền (`input type="number"` đang bật). Sau thanh toán thành công `clearCart` không được gọi nên giỏ vẫn còn hàng. Phần đúng: tổng đã lưu bằng tổng giá sản phẩm khi không bị sửa (1, 2, 3 sản phẩm, cùng sản phẩm hai lần), tóm tắt đơn đủ tên, số lượng, thành tiền, khách chưa đăng nhập bị chuyển sang trang đăng nhập hoặc bị server từ chối, thanh toán lỗi không tạo đơn và giỏ được giữ.

**FR-13 - Dashboard admin (3 bug).** Công thức doanh thu trong `App.jsx` là `sum + o.total_amount * 2` cho mỗi đơn Delivered nên hiển thị gấp đôi (cùng hiện tượng ở 1 VND, 200.000, 2.147.483.647 và đơn hỗn hợp). Đơn Canceled vẫn có nút "Đánh dấu Đã giao". Admin web mở được dashboard với token của tài khoản thường. Phần đúng: đơn pending, confirmed, shipping, canceled không cộng vào doanh thu; số đơn tăng đúng; đơn Delivered không có nút chuyển trạng thái; đăng nhập sai, tài khoản thường, không có token và token sai định dạng đều bị chặn ở form.

### 1.5 Chỗ SRS im lặng hoặc mâu thuẫn và hành vi quan sát được (CLARIFY)

| Feature | Điểm chưa rõ | Hành vi quan sát được trên SUT | Cách xử lý |
| :-- | :-- | :-- | :-- |
| FR-04 | SĐT rỗng (P14) | Bị từ chối, SĐT cũ được giữ | Ghi nhận |
| FR-04 | SĐT có khoảng trắng (P07) hoặc dấu gạch (P09) | Bị từ chối, SĐT cũ được giữ | Ghi nhận |
| FR-04 | Tên rỗng (F04) | Bị chặn bởi thuộc tính `required` của form (không có hộp thoại) | Ghi nhận |
| FR-04 | Tên toàn dấu cách (F05), địa chỉ rỗng (F06), tên 1000 ký tự (F07) | Cả ba được lưu, báo "Cập nhật thành công!" | Ghi nhận |
| FR-04 | Email "không đổi qua giao diện" và `role` "từ client" (SEC-06) có áp dụng cho API không | Áp dụng cho cả API (theo HW02) | Theo HW02 |
| FR-08 | Giỏ rỗng (C14) | Nút thanh toán bị ẩn, nhưng vào thẳng `/checkout` vẫn tạo được đơn (1 đơn) | Ghi nhận (HW02 coi là bug) |
| FR-08 | Địa chỉ giao hàng (C15): API spec có `shipping_address`, SRS FR-08 không nhắc | Trang thanh toán không có ô địa chỉ, đơn lưu `shipping_address = null` | Ghi nhận |
| FR-08 | `total_amount` trong body (API spec §4.3) mâu thuẫn với SRS (backend tự tính) | SUT lưu giá trị client gửi | Theo SRS, xác nhận bằng C05/C06 |
| FR-13 | Đơn Canceled có tính vào "Tổng số đơn" không (S05, S10) | Có tính (số đơn tăng 58 thành 59 khi thêm đơn Canceled) | Ghi nhận |
| FR-13 / FR-12 | Người không phải admin thì thấy gì (A01, A02) | Thông báo "Bạn không phải là admin!" và "Đăng nhập thất bại", form đăng nhập vẫn hiện | Chỉ ghi thông báo, không assert nội dung |
| FR-13 | Định dạng tiền, cách làm mới, dashboard khi chưa có đơn | Số được đọc bằng cách lấy chữ số, không phụ thuộc dấu phân cách; làm mới bằng tải lại trang | Theo `spec-notes.md` mục 7 |

### 1.6 Test không tự động hóa được qua giao diện

| Feature | Test case HW02 | Lý do |
| :-- | :-- | :-- |
| FR-04 | BL-02 (PUT ghi đè trường không gửi thành null) | Form luôn gửi cả ba trường, nên không tái hiện được trên giao diện. Chỉ làm được ở tầng API (HW02 đã phủ bằng Postman). |
| FR-04 | BL-04 (tự đổi `role` thành admin) | Giao diện không có chỗ đổi role. Chỉ làm được ở tầng API. |
| FR-04 | Lộ mật khẩu trong `GET /api/users/me` | Giao diện không hiển thị response. Chỉ làm được ở tầng API. |
| FR-04 | DT-08b, DT-08c (SĐT `null`, kiểu số) | Ô nhập luôn gửi chuỗi, không gửi được `null` hay số. |
| FR-04 | Token sai / hết hạn trên API | Ngoài phạm vi giao diện (HW02 đã phủ). |
| FR-08 | Số âm, số lượng 0, `total_amount` kiểu chuỗi, thiếu trường | Giao diện không gửi được những body này. Chỉ làm được ở tầng API (HW02 đã phủ). |
| FR-08 | `shipping_address` rỗng, `null`, số, chuỗi XSS (FR-08-BUG-05, BUG-08) | Trang thanh toán không có ô nhập địa chỉ, nên không nhập được từ giao diện. |
| FR-08 | Rò rỉ đơn giữa các tài khoản, chi tiết đơn không đầy đủ (BUG-06, BUG-07) | Giao diện chỉ hiển thị danh sách đơn của chính người dùng. Chỉ làm được ở tầng API. |
| FR-08 | Mã giảm giá | Thuộc FR-09, ngoài phạm vi của ba tính năng đã chọn. |
| FR-13 | DT-02, DT-04, DT-05 của FR-13 (checkout thiếu hoặc sai kiểu `total_amount`, thiếu `shipping_address`) | Giao diện không cho gửi những body này, chỉ làm được ở tầng API. HW02 đã phủ bằng Postman. |

Giới hạn khác của bộ test: C11 (thanh toán lỗi) dùng `page.route` trả 500 nên chỉ chứng minh client xử lý lỗi, không chứng minh hành vi của server khi lỗi thật; CSDL tích lũy thêm đơn sau mỗi lần chạy (không dọn), nên các số tuyệt đối ở S13 tăng dần và các ca khác dùng chênh lệch (delta) trước và sau.

### 1.7 Cách chạy lại

```
npm install -D @playwright/test
npx playwright install chromium firefox webkit
npm run test:all        # FR-04, FR-08, FR-13 x 3 trình duyệt = 9 lượt chạy
npm run summary         # ghi docs/test-summary.md
```

Cần bật đủ ba phần của SUT (backend 3000, web khách 5173, admin 5174) trước khi chạy; bộ test không tự kiểm tra SUT đã sẵn sàng (xem mục B-1 của FR-13 trong Phần 2).

---

## Phần 2. Review / gap analysis của script do AI sinh

### 2.1 Cách review

Script được review qua ba lượt, mỗi lượt bắt được một loại lỗi khác nhau:

1. **Chạy thử với server giả lập** (trước khi có SUT thật): AI tự phát hiện chỗ sai về cấu trúc trang và dữ liệu (mục A của từng feature).
2. **Chạy trên SUT thật:** phát hiện lỗi chỉ lộ ra khi có hành vi thật, như race condition của `alert()` hay assertion lấy từ mã nguồn thay vì SRS (mục B).
3. **Đọc lại toàn bộ spec và helper** (mục E): tìm selector mong manh, chờ cố định, assertion yếu hoặc rỗng, thiếu edge case. Lượt này có sự hỗ trợ của Claude (Anthropic); AI sinh script ban đầu: [điền tên AI đã dùng].

Nguyên nhân mỗi lỗi được gắn một trong ba loại: **P** = chất lượng prompt, **M** = hạn chế của model, **F** = đặc thù của feature/SUT. Phân loại dựa trên cách script được viết, không trích từ prompt gốc.

### 2.2 Tổng hợp theo nhóm lỗi

| Nhóm lỗi | Ví dụ cụ thể | Nơi gặp | Nguyên nhân chính |
| :-- | :-- | :-- | :-- |
| Chờ không đáng tin cậy (flaky wait) | Mốc đếm `alert()` lấy sau khi bấm (race, chỉ lộ trên Firefox/WebKit); `waitForTimeout(500)` ở X02; đọc số "0" trước khi dashboard tải xong | FR-04, FR-08, FR-13 | M, F |
| Selector mong manh | Class Tailwind `div.border.rounded`; `input[type="text"]...first()`; `xpath=following-sibling::p[1]`; `getByLabel` khi label không gắn với input | Cả ba | F, M |
| Assertion yếu hoặc rỗng | `digits()` đọc chuỗi không có số thành 0; vòng `for` trên danh sách có thể rỗng; chỉ kiểm tra thông báo thành công mà không đọc lại dữ liệu đã lưu; 7 ca CLARIFY không assert | Cả ba | M, P |
| Nhầm "hành vi hiện tại" với "hành vi yêu cầu" | Bắt buộc phải có hộp thoại báo lỗi, trong khi SRS chỉ yêu cầu từ chối | FR-04, FR-08 | M |
| Dữ liệu nền phụ thuộc bug | Test tên/địa chỉ dùng SĐT `912345678` (form chấp nhận nhưng không hợp lệ theo SRS) | FR-04 | M |
| Giả định về môi trường | Định dạng tiền do Node và trình duyệt tạo từ hai nguồn locale; SUT phải bật sẵn, không tự kiểm tra | FR-08, FR-13 | M, P |
| Thiếu edge case | Bấm thanh toán hai lần, đổi số lượng trước khi thanh toán, XSS ở web admin, dashboard khi CSDL rỗng | Cả ba | P, M |
| Quyết định trong ghi chú không thành test | `spec-notes.md` nói kiểm tra cả `GET /api/cart` nhưng C10 chỉ kiểm tra UI | FR-08 | P |

Nhận xét chung: phần lớn lỗi **M** (không biết môi trường thật, chọn cách dễ viết) và **F** (SUT không có id, `alert()` native, dữ liệu dùng chung) khó tránh nếu không có SUT thật để thử; lỗi **P** (quy ước selector, tiêu chí assertion, đối chiếu ghi chú với test) có thể giảm đáng kể bằng prompt rõ hơn (xem 2.6).

### 2.3 Review chi tiết theo feature

Trong bảng mục E, cột **Trạng thái** có bốn giá trị: **Đã sửa (chưa chạy lại)** = đã sửa trong code, đã qua kiểm tra kiểu và nạp được toàn bộ 180 test nhưng chưa chạy với SUT; **Chưa sửa** = chỉ ghi nhận; **Cần xác nhận** = phải kiểm tra thủ công trước khi quyết định; **Đã rút lại** = đề xuất ban đầu sai. Mã F1-F5 trỏ tới mục 2.4.

#### 2.3.1 FR-04 - Hồ sơ cá nhân

##### A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Định vị ô nhập bằng `getByLabel("Họ Tên")`. | Trong mã nguồn, thẻ `<label>` không gắn với `<input>`, nên `getByLabel` không tìm thấy gì. | Dùng placeholder (`VD: 0912345678`, `Nhập địa chỉ của bạn`) và `form input[type="text"]:not([disabled])` cho ô tên. |
| 2 | Chờ thông báo "Cập nhật thành công" như một phần tử trên trang. | Thông báo là hộp thoại `alert()` của trình duyệt, không nằm trong DOM. | Bắt bằng `page.on("dialog")` (xem mục B-1). |
| 3 | Gộp mọi trường hợp vào một test hồ sơ gốc dùng chung. | Một test lỗi làm hỏng dữ liệu của test sau (SĐT và tên bị ghi đè). | Mỗi test tạo tài khoản dùng một lần qua API (`newSession`) và đặt hồ sơ gốc bằng API. |

##### B. Sau khi chạy trên SUT thật

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Nhiều test của form (P01-P04, P06-P12, P14, F01, F03, X01, C11, C12, C13) | **Race condition khi bắt hộp thoại `alert()`**: helper nhớ số hộp thoại *sau* khi bấm nút. Hộp thoại do JavaScript của trang tự bật ngay lúc bấm đã bị tính vào mốc, nên helper chờ một hộp thoại "mới" và trả về `null`. Lần chạy đầu có 15/26 (FR-04) và 5-7/15 (FR-08) test đỏ, một phần chỉ đỏ trên firefox/webkit. | AI chỉ nghĩ đến trường hợp hộp thoại hiện *sau* một request bất đồng bộ; không có SUT thật để thử, nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ; tốc độ khác nhau giữa các trình duyệt làm lỗi chỉ hiện ở một số trình duyệt. | Đổi sang `clickAndWaitDialog` ghi nhớ vị trí trước khi bấm. Sau sửa: 3 trình duyệt cho kết quả giống hệt nhau (FR-04: 8 đỏ, FR-08: 4 đỏ, đều là bug thật). |
| 2 | P06-P12, C12 | **Assertion quá chặt so với SRS**: bắt buộc "phải có hộp thoại báo lỗi", trong khi SRS chỉ yêu cầu từ chối. | AI suy ra từ mã nguồn thay vì từ SRS (lẫn lộn "hành vi hiện tại" với "hành vi yêu cầu"). | Bỏ yêu cầu có hộp thoại; kiểm tra "không báo thành công" và (với hồ sơ) "số cũ vẫn được giữ". Nội dung thông báo ghi vào report dưới nhãn NOTE. |
| 3 | F01-F07 (tên, địa chỉ) | **Dữ liệu nền phụ thuộc vào bug**: để tách biến, các test tên/địa chỉ dùng số điện thoại nền `912345678` (form chấp nhận). Nhưng số này **không bắt đầu bằng 0**, tức là không hợp lệ theo SRS. Khi FR04-BUG-01/02 được sửa, các test này sẽ đỏ. | AI chọn dữ liệu "để test chạy được" theo hành vi của form hiện tại, không theo SRS. | Ghi lại làm hạn chế đã biết. Khi SUT sửa lỗi, đổi `fieldTests.phone` trong `data/fr04-baseline.json` thành `0912345678`. Không cần đổi code. |
| 4 | P14, F04-F07 | Trường hợp SRS im lặng (SĐT rỗng, tên rỗng/toàn dấu cách, địa chỉ rỗng, tên 1000 ký tự): AI dễ "bịa" kỳ vọng. | Đặc thù của SRS. | Đánh dấu CLARIFY: ghi lại hành vi quan sát được, không làm test đỏ. Kết quả: tên toàn dấu cách, địa chỉ rỗng và tên 1000 ký tự đều được lưu; tên rỗng bị chặn (`required`). |

##### E. Rà soát lại code

| # | Vị trí | Vấn đề | Vì sao AI bỏ sót | Đề xuất / cách sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | X02, `fr04-profile.spec.ts` dòng 114 | **Chờ cố định** `page.waitForTimeout(500)` trước khi đọc `window.__xss`. Sự kiện `onerror` của ảnh chạy bất đồng bộ và tốc độ mỗi trình duyệt khác nhau; khi SUT được sửa, test có thể pass vì chưa kịp chờ chứ không phải vì đã escape đúng. | Không có sự kiện nào để chờ khi escape đúng (không có request nào phát sinh), nên AI chọn khoảng chờ cố định, cách nhanh nhất. | Chờ `waitForLoadState('networkidle')` thay cho 500 ms; giữ kiểm tra DOM (`img` count 0) làm assertion chính. | M, F | Đã sửa (chưa chạy lại), F2 |
| 2 | `nameInput`, ô email | Selector theo vị trí: `form input[type="text"]:not([disabled]).first()` và `[type="text"][disabled]` cho email. Đúng chỉ vì ô tên đứng trước ô SĐT và ô email là `type="text"`; nếu SUT đổi thứ tự hoặc sửa email thành `type="email"` (SRS FR-22), cả hai selector hỏng. | Trang không có id/testid và `<label>` không gắn với input (mục A-1), AI chọn cách ít tốn công nhất. | Dùng placeholder hoặc `getByRole('textbox', { name })` nếu có; nếu không thì đề nghị thêm `data-testid`. | M, F | Chưa sửa (cần xác minh DOM thật) |
| 3 | `saveButton` | `getByRole('button', { name: 'Cập nhật' })` khớp theo chuỗi con; nếu trang có thêm nút như "Cập nhật mật khẩu" thì Playwright báo strict mode violation. FR-08 dùng `exact: true` còn FR-04 thì không (không nhất quán). | Mỗi spec được sinh riêng, không có quy ước selector chung trong prompt. | Thêm `exact: true` sau khi xác nhận tên accessible đầy đủ của nút (nếu là "Cập nhật hồ sơ" thì `exact: true` sẽ làm hỏng toàn bộ test). | P | Chưa sửa (chưa xác nhận tên nút) |
| 4 | F01-F03 | Chỉ kiểm tra dữ liệu đã lưu qua `GET /users/me`, không kiểm tra giao diện sau khi tải lại trang. Test có thể pass dù form hiển thị sai giá trị đã lưu. | Oracle qua API tiện hơn đọc giao diện. | Sau khi lưu: `page.reload()` rồi `expect(input).toHaveValue(value)`. | M | Chưa sửa (cần xác nhận form nạp lại SĐT và địa chỉ) |
| 5 | P07, P09, P14, F04-F07 | Các ca CLARIFY **không assert kết quả nào** nên luôn pass. Số "passed" của FR-04 (18/26) tính cả 7 ca này. | Quy ước "ghi nhận, không phán xét" được thêm sau, cách đếm không được sửa theo. | Báo cáo tách riêng "pass có assertion" (11) và "chỉ ghi nhận" (7) cho FR-04. | P | Xử lý trong `REPORT.md` (Phần 1) |
| 6 | Phạm vi X01/X02 | Chỉ kiểm tra tên ở header. Cùng tên đó còn hiển thị ở web admin (danh sách người dùng, đơn hàng), nơi XSS lưu trữ nguy hiểm hơn; chưa có ca nào kiểm tra. | Feature được hiểu hẹp theo trang hồ sơ. | Thêm ca: lưu tên có payload rồi mở danh sách người dùng ở admin (FR-19) và kiểm tra không có phần tử `img`. | M | Chưa sửa (ngoài phạm vi 3 FR) |
| 7 | Edge case thiếu | Chưa có: SĐT có khoảng trắng ở đầu/cuối (`' 0912345678'`), bấm "Cập nhật" hai lần liên tiếp, tên chứa chuỗi SQL (SEC-05, ví dụ `' OR 1=1 --`), tên dài đúng 255/256 ký tự. | AI ưu tiên bao phủ theo bảng HW02 nên không mở rộng ra ngoài. | Thêm dòng vào bảng dữ liệu của feature; không cần đổi code. | P | Chưa sửa |

#### 2.3.2 FR-08 - Thanh toán

##### A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | AI nói có thể chuẩn bị sẵn giỏ hàng qua API (`/api/cart`). | Sai: web khách giữ giỏ trong bộ nhớ React (`CartContext`), không dùng `/api/cart`. Chuẩn bị qua API sẽ không xuất hiện trên giao diện. | Thêm sản phẩm bằng giao diện (nút "Thêm vào giỏ"). API chỉ dùng để tạo tài khoản, đăng nhập và đọc lại đơn đã lưu. |
| 2 | Dùng `page.goto("/cart")` để mở giỏ. | `goto` tải lại trang nên giỏ bị xóa. | Chuyển trang bằng cách bấm liên kết "Giỏ hàng"; với ca vào thẳng trang thanh toán dùng `history.pushState` (không tải lại). |
| 3 | Chọn sản phẩm theo tên cố định. | Dữ liệu seed có thể khác giữa các máy. | Chọn theo vị trí trong danh sách (`picks` trong `data/fr08-checkout.json`), giá lấy từ `GET /products`. |

##### B. Sau khi chạy trên SUT thật

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Nhiều test của form (C11, C12, C13; chỉ đỏ trên firefox/webkit) | **Race condition khi bắt hộp thoại `alert()`**: helper nhớ số hộp thoại *sau* khi bấm nút. Hộp thoại do JavaScript của trang tự bật ngay lúc bấm đã bị tính vào mốc, nên helper chờ một hộp thoại "mới" và trả về `null`. Lần chạy đầu có 5-7/15 test đỏ tùy trình duyệt. | AI chỉ nghĩ đến trường hợp hộp thoại hiện *sau* một request bất đồng bộ; không có SUT thật để thử, nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ; tốc độ khác nhau giữa các trình duyệt làm lỗi chỉ hiện ở một số trình duyệt. | Đổi sang `clickAndWaitDialog` ghi nhớ vị trí trước khi bấm. Sau sửa: 3 trình duyệt cho kết quả giống hệt nhau (FR-08: 4 đỏ, đều là bug thật). |
| 2 | C12 | **Assertion quá chặt**: bắt buộc có hộp thoại yêu cầu đăng nhập, SRS chỉ yêu cầu chuyển sang trang đăng nhập. | AI lấy hành vi trong mã nguồn làm kỳ vọng. | Kiểm tra URL `/login`; nội dung thông báo ghi vào report (NOTE). |
| 3 | C14, C15 | Giỏ rỗng và địa chỉ giao hàng: SRS im lặng. Kết quả: ép vào trang thanh toán với giỏ rỗng vẫn tạo được đơn; trang thanh toán không có ô địa chỉ (đơn lưu `shipping_address = null`). | Đặc thù của SRS. | CLARIFY, ghi lại hành vi quan sát được. HW02 đã coi giỏ rỗng là bug (FR-08-BUG-04), nên có thể bổ sung `FR08-BUG-04` nếu muốn. |
| 4 | C05, C06 | Kiểm tra "tổng tiền đã lưu" phải qua đơn thật: AI ban đầu chỉ kiểm tra thông báo thành công trên giao diện, không đọc lại đơn đã lưu. | Thông báo thành công không chứng minh số tiền đúng. | Đọc lại đơn qua `GET /orders/my-orders` (oracle), so với tổng giá sản phẩm. Phát hiện: đơn lưu 1 và 0 thay vì 58000000 và 30000000. |

##### E. Rà soát lại code

| # | Vị trí | Vấn đề | Vì sao AI bỏ sót | Đề xuất / cách sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | `addToCartByUi` dòng 30 | Selector phụ thuộc class Tailwind: `div.border.rounded`. Đổi giao diện (đổi class) là hỏng toàn bộ FR-08. | Trang không có testid, AI chọn thứ có sẵn trong HTML. | Đi từ nút `getByRole('button', { name: 'Thêm vào giỏ', exact: true })` rồi lấy tên sản phẩm ở tổ tiên gần nhất, hoặc đề nghị thêm `data-testid`. | M, F | Chưa sửa |
| 2 | C07, dòng 91 | `page.locator('li')` đếm **mọi** `<li>` trên trang. Test pass chỉ vì trang xác nhận không có `li` nào khác (ví dụ trong thanh điều hướng). | Kiểm tra trên bản chạy được, không xét cấu trúc có thể đổi. | Giới hạn trong vùng tóm tắt đơn hàng (container có heading "Xác Nhận Đơn Hàng"). | M | Chưa sửa |
| 3 | C07, C08 (`toLocaleString()`) | Định dạng tiền do **Node** tạo (locale lấy từ môi trường của tiến trình Node), nhưng so với chuỗi do **trình duyệt** tạo (mặc định theo locale hệ thống của từng engine). Hai nơi lấy locale độc lập, không có gì bảo đảm khớp nhau (Node với `vi-VN` cho `58.000.000`, `en-US` cho `58,000,000`). Trên máy của bạn chúng khớp (C07/C08 xanh cả 3 trình duyệt), nhưng test không nên phụ thuộc vào máy chạy. FR-13 đã tránh bằng `digits()`, FR-08 thì chưa. | Model không biết môi trường chạy (Windows, locale Việt) và không có SUT để thử. | Cố định cả hai phía: `locale: 'en-US'` trong `playwright.config.ts` và `toLocaleString('en-US')` trong spec. | M, P | Đã sửa (chưa chạy lại), F3 |
| 4 | C05, C06, dòng 82 | **Assertion rỗng**: `for (const o of orders) expect(...)`. Nếu không có đơn nào được lưu thì vòng lặp không kiểm tra gì và test vẫn pass, kể cả khi trang đã hiện "Thanh toán thành công!" mà CSDL không có đơn. Comment nói "từ chối cũng đúng" là chủ ý, nhưng không có điều kiện bảo vệ. | AI muốn chấp nhận hai kết quả đúng (lưu đúng tổng, hoặc từ chối) mà không ràng buộc nhánh "từ chối". | Không có đơn chỉ được chấp nhận khi người dùng thấy thông báo lỗi (trang thành công mà không có đơn phải đỏ); luôn kiểm tra tối đa một đơn. | M | Đã sửa (chưa chạy lại), F4 |
| 5 | C10 so với `spec-notes.md` mục 1 | Ghi chú nói "kiểm tra cả giỏ trên giao diện lẫn `GET /api/cart`", nhưng C10 chỉ kiểm tra giao diện. FR08-BUG-03 do đó chỉ được xác nhận ở phía giao diện; nhận định "lỗi phía API" của HW02 chưa được Playwright kiểm lại. | Quyết định ghi trong ghi chú không được chuyển thành test. | Thêm bước đọc `GET /api/cart` sau thanh toán, hoặc sửa ghi chú cho đúng phạm vi. | P | Chưa sửa |
| 6 | C03 | Thêm cùng sản phẩm hai lần chỉ kiểm tra tổng đã lưu. Không kiểm tra giỏ gộp thành một dòng số lượng 2 (SRS FR-07) trước khi thanh toán. | Dữ liệu `picks: [0, 0]` dùng lại từ HW02 mà không thêm kỳ vọng về giao diện. | Ở trang giỏ hoặc trang xác nhận kiểm tra có đúng một dòng ` x 2 `. | M | Chưa sửa |
| 7 | C11 | Thanh toán lỗi được **giả lập** bằng `page.route` trả 500. Test chỉ chứng minh client xử lý lỗi tốt, không chứng minh server giữ giỏ hoặc không tạo đơn khi lỗi thật. | Không có cách gây lỗi thật trên SUT; AI không ghi rõ giới hạn này. | Ghi giới hạn vào báo cáo; không đổi code. | F | Xử lý trong `REPORT.md` (Phần 1) |
| 8 | Edge case thiếu | Chưa có: bấm "Xác Nhận Thanh Toán" hai lần liên tiếp (có tạo hai đơn không), đổi số lượng bằng +/- rồi thanh toán, xóa một dòng rồi thanh toán, tải lại trang `/checkout` (giỏ bị mất), token hết hạn giữa chừng, tổng tiền rất lớn. | Bảng HW02 thiên về kiểm thử API, AI ít nghĩ đến thao tác người dùng thật. | Thêm `mode` mới (ví dụ `double-submit`) và nhánh tương ứng trong spec. | P, M | Chưa sửa |

#### 2.3.3 FR-13 - Dashboard admin

##### A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Mọi ca so số hiển thị trên dashboard với **giá trị tuyệt đối** (tổng doanh thu tính từ API). | Database đã có đơn cũ nên nếu công thức doanh thu sai, cả các ca "đơn pending không cộng doanh thu" cũng đỏ vì số nền sai, che mất việc quy tắc đó vẫn đúng. | So **chênh lệch** của số hiển thị trước và sau khi tạo đơn (S01-S10). Một ca riêng S13 kiểm tra giá trị tuyệt đối. |
| 2 | Đọc số trên dashboard ngay sau khi mở trang. | Giao diện hiện "0" cho đến khi tải xong danh sách đơn, nên có thể đọc nhầm số 0 (đọc quá sớm). | Helper `waitDashboardLoaded` chờ số đơn khác 0, và `ensureAtLeastOneOrder` đảm bảo DB mới cũng có ít nhất một đơn. |

##### B. Sau khi chạy trên SUT thật

Lần chạy đầu trên SUT thật cho kết quả ổn định (11 đạt, 8 đỏ trên cả 3 trình duyệt), và cả 8 test đỏ đều là bug thật của SUT (xem mục D), nên không có chỗ nào phải sửa script vì kết quả sai. Hai điều đáng ghi:

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Cả bộ | Lần chạy đầu toàn bộ test lỗi `ECONNREFUSED` ở cổng 3000: backend chưa bật. Hạn chế: bộ test không tự kiểm tra SUT đã sẵn sàng, nên lỗi môi trường báo như một lỗi test. | AI không có SUT để thử. | Ghi trong hướng dẫn chạy: bật 3 phần SUT (3000, 5173, 5174) trước khi chạy. Có thể bổ sung bước kiểm tra sức khỏe nếu còn thời gian. |
| 2 | S13 | Giá trị tuyệt đối tăng dần qua các lần chạy vì DB tích lũy đơn (số liệu lớn, ví dụ 2148533648, 12891201888). | Đặc thù của feature (dữ liệu dùng chung). | S13 so với tổng tính từ `GET /api/admin/orders` ngay lúc đó, nên không phụ thuộc số cũ. Các ca khác dùng chênh lệch. |

##### E. Rà soát lại code

| # | Vị trí | Vấn đề | Vì sao AI bỏ sót | Đề xuất / cách sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | `digits()` trong `helpers/admin.ts` | Chuỗi không có chữ số (`NaN`, `-`, rỗng) bị đọc thành **0** vì `Number('')` là 0. Các ca "không đổi" S02-S05, S10 (`revenueDelta: 0`) có thể pass dù ô doanh thu hiển thị hỏng: trước và sau đều đọc ra 0. Chỉ các ca có giá trị lớn hơn 0 (S01, S06-S08, S13) mới bắt được. | `Number('')` trả 0 mà không báo lỗi; AI chỉ nghĩ đến các định dạng số hợp lệ. | Trả về `NaN` khi không có chữ số nào. (Ý định đầu là ném lỗi, nhưng trong `expect.poll` lỗi ném ra sẽ dừng poll ngay thay vì thử lại, nên chọn `NaN`; xem F1.) | M | Đã sửa (chưa chạy lại), F1 |
| 2 | `revenueTile`, `orderCountTile`, `goToTab`, `orderRow` | Selector theo cấu trúc DOM: `xpath=following-sibling::p[1]`, `li` lọc theo text, `tr` có ô `#id`. Đổi bố cục là hỏng; mất thẻ `p` thì đọc nhầm phần tử. | Admin web không có testid, giống FR-04 và FR-08. | Đề nghị thêm `data-testid` cho hai ô số liệu; nếu không thì giữ các giả định cấu trúc ở một chỗ (đã gom trong `admin.ts`). | F | Chưa sửa |
| 3 | `orderRow` (rủi ro) | CSDL tích lũy thêm đơn sau mỗi lần chạy (không dọn). Nếu bảng đơn hàng có phân trang hoặc sắp xếp từ cũ đến mới thì đơn vừa tạo có thể không nằm ở trang đầu và S09-S12 không tìm thấy hàng. Chưa xác nhận SUT có phân trang. | Đặc thù của dữ liệu dùng chung. | Kiểm tra thủ công; nếu có phân trang thì thêm bước tìm đơn (lọc hoặc chuyển trang). | F | Cần xác nhận |
| 4 | `openAdmin` | `waitForResponse(...).catch(() => null)` **nuốt lỗi**: nếu request tải đơn hàng không bao giờ xảy ra, test vẫn chạy tiếp và chỉ thất bại ở bước sau với thông báo khó hiểu. | AI sợ test bị treo nên bắt hết lỗi. | Khi không thấy request, ghi annotation `WARN` vào báo cáo thay vì im lặng. | M | Đã sửa (chưa chạy lại), F5 |
| 5 | `waitDashboardLoaded` | Phân biệt "đã tải xong" bằng heuristic "số đơn khác 0", nên phải có `ensureAtLeastOneOrder`. Dashboard khi chưa có đơn nào (`spec-notes.md` mục 7) không test được. | Giao diện hiện 0 trong lúc tải (mục A-2); AI né tình huống DB rỗng thay vì chờ tín hiệu tải xong. | Chờ response `GET /api/admin/orders` hoàn tất rồi mới đọc, thay vì dựa vào giá trị. | M, F | Chưa sửa |
| 6 | S11, S12 (`getByRole('button')` count 0) | Nhận xét ban đầu: assertion "không có nút nào" rộng, có thể đỏ giả nếu SUT thêm nút không liên quan; đề xuất thu hẹp theo tên các nút chuyển trạng thái (`ACTION_BUTTON`). **Đề xuất này sai và đã rút lại**: bug FR13-BUG-02 chính là nút "Đánh dấu Đã giao", không nằm trong `ACTION_BUTTON`; thu hẹp sẽ làm S12 bỏ sót bug. | Đề xuất ban đầu chưa đối chiếu với bug report; tự phát hiện khi rà lại. | Giữ nguyên assertion đếm mọi nút. Nếu sau này có nút vô hại thì loại trừ đích danh nút đó. | M | Đã rút lại (giữ nguyên code) |
| 7 | `captureDialogs` (admin và web) | Hai helper cùng tên nhưng khác hành vi: admin `dismiss()`, web `accept()`. Với `confirm()` (ví dụ xác nhận hủy đơn) hai hành vi cho kết quả ngược nhau. | Mỗi helper được sinh riêng. | Gộp thành một helper có tham số, hoặc đổi tên (`dismissDialogs` / `acceptDialogs`). | P | Chưa sửa |
| 8 | Edge case thiếu | Chưa có: dashboard khi CSDL rỗng; tự cập nhật khi đơn đổi trạng thái mà không tải lại; nhiều lần đăng nhập sai (khóa 30 giây, FR-02) ở màn hình admin; nhiều tab admin cùng lúc. | Phạm vi theo bảng HW02 và SRS im lặng ở các chỗ này. | Thêm khi SRS làm rõ; ghi rõ trong báo cáo là ngoài phạm vi. | P, F | Chưa sửa |

### Gợi ý cho video

Mục B ở trên ghi "không có chỗ nào phải sửa script", trong khi đề bài cần ít nhất một chỗ sửa để kể. Chỗ dễ kể nhất là **F1** (`digits()` ở mục E-1): ý định đầu là ném lỗi, nhưng đọc mã nguồn `expect.poll` của Playwright 1.65.1 cho thấy lỗi ném trong hàm poll làm poll dừng ngay thay vì thử lại, nên đổi sang `NaN`. Đây là ví dụ rõ về việc AI đề xuất một cách sửa nghe hợp lý nhưng chưa kiểm chứng. Chỉ chuyển trạng thái sang "Đã sửa" sau khi chạy lại cả 3 trình duyệt.

### 2.4 Chi tiết các chỉnh sửa đã thực hiện

Chỉ các thay đổi trong script được liệt kê ở đây. Mỗi mục gồm vấn đề, vì sao AI bỏ sót, mã trước và sau, và tác động.

#### Nhóm R: sửa sau lần chạy trên SUT thật (đã chạy lại trên SUT thật, kết quả nêu ở mục B của từng feature)

**R1 - Race condition khi bắt `alert()` (FR-04, FR-08; mục B-1).** Hộp thoại do JavaScript của trang tự bật ngay lúc bấm nút nên đã bị tính vào mốc đếm, helper chờ một hộp thoại "mới" và trả `null`. Lần chạy đầu 15/26 test FR-04 và 5-7/15 test FR-08 đỏ, một phần chỉ đỏ trên Firefox/WebKit. AI chỉ nghĩ đến trường hợp hộp thoại hiện sau một request bất đồng bộ, và không có SUT thật nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ. Sau sửa: ba trình duyệt cho kết quả giống hệt nhau.

Mã trước và sau của lỗi B-1 (dùng cho video):

```ts
// Bản nháp đầu của AI
await saveButton(page).click();
const message = await waitForDialog(dialogs);   // nhớ "số hộp thoại hiện có" SAU khi bấm

export async function waitForDialog(messages, ms = 3000) {
  const before = messages.length;               // <- đã tính cả hộp thoại vừa hiện ra trong lúc bấm
  await expect.poll(() => messages.length, { timeout: ms }).toBeGreaterThan(before);
  ...
}
```

```ts
// Bản sau khi sửa (tests/helpers/web.ts)
export async function clickAndWaitDialog(messages, target, ms = 4000) {
  const mark = messages.length;                 // nhớ vị trí TRƯỚC khi bấm
  await target.click();
  await expect.poll(() => messages.length, { timeout: ms }).toBeGreaterThan(mark);
  return messages[mark];
}
```

**R2 - Assertion quá chặt so với SRS (P06-P12, C12; mục B-2).** Bản đầu bắt buộc "phải có hộp thoại báo lỗi", trong khi SRS chỉ yêu cầu từ chối. Bản sửa kiểm tra "không báo thành công" và "số cũ vẫn được giữ", còn nội dung thông báo ghi vào báo cáo dưới nhãn NOTE.

**R3 - Chuyển từ giá trị tuyệt đối sang chênh lệch (FR-13; mục A-1).** Bản đầu so số trên dashboard với tổng tuyệt đối tính từ API; vì DB đã có đơn cũ, một công thức sai làm cả các ca "đơn pending không cộng doanh thu" đỏ theo, che mất việc quy tắc đó vẫn đúng. Bản sửa so chênh lệch trước và sau khi tạo đơn (S01-S10), một ca riêng S13 kiểm tra giá trị tuyệt đối.

**R4 - Kiểm tra tổng tiền qua đơn đã lưu (C05, C06; mục B-4).** Bản đầu chỉ kiểm tra thông báo thành công trên giao diện, không chứng minh số tiền đúng. Bản sửa đọc lại đơn qua `GET /orders/my-orders` và so với tổng giá sản phẩm; nhờ đó phát hiện đơn lưu 1 và 0 thay vì 58.000.000 và 30.000.000.

#### Nhóm F: sửa sau khi rà soát lại code (mục E)

**F1 - `digits()` không được đọc "không có số" thành 0 (FR-13, `tests/helpers/admin.ts`).**
Vấn đề: `Number('')` là 0, nên khi ô doanh thu hiển thị `NaN`, `-` hay rỗng, hàm trả 0. Các ca "không đổi" (S02-S05, S10, kỳ vọng chênh lệch 0) đọc 0 trước và 0 sau nên vẫn pass. Vì AI chỉ nghĩ đến các định dạng số hợp lệ, lỗi đọc số bị biến thành "doanh thu không đổi".

```ts
// Trước
export const digits = (text: string): number => Number((text.match(/\d/g) ?? []).join(''));

// Sau
export const digits = (text: string): number => {
  const found = text.match(/\d/g);
  // "NaN", "-" hay ô rỗng KHÔNG được đọc thành 0.
  return found ? Number(found.join('')) : NaN;
};
```

Một chi tiết đáng ghi lại: ý định đầu là **ném lỗi** khi không có chữ số. Khi đọc mã nguồn `expect.poll` của Playwright 1.65.1 (phiên bản khóa trong `package-lock.json`), dòng `const value = await actual();` nằm ngoài khối `try/catch` làm poll thử lại, nên lỗi ném trong hàm poll **dừng poll ngay** thay vì thử lại. Nếu ném lỗi, một trạng thái tạm thời của ô số liệu sẽ biến thành thất bại cứng (thêm flaky). Trả `NaN` thì `NaN - base` không bao giờ bằng giá trị kỳ vọng, poll tiếp tục thử rồi hết giờ với thông báo "Expected: 0, Received: NaN". Đây là ví dụ AI (và người review) đề xuất một cách sửa nghe hợp lý nhưng chưa kiểm chứng.
Tác động: khi ô số liệu đọc được, kết quả không đổi; khi ô hỏng, các ca delta 0 giờ đỏ thay vì pass giả.

**F2 - Bỏ chờ cố định `waitForTimeout(500)` (FR-04 X02, `tests/fr04-profile.spec.ts`).**
Vấn đề: sự kiện `onerror` của `<img src=x>` chạy bất đồng bộ; trên trình duyệt chậm hơn, 500 ms có thể chưa đủ, và khi SUT được sửa, test có thể pass vì chưa kịp chờ chứ không phải vì đã escape đúng. Không có sự kiện nào để chờ trong trường hợp escape đúng (không có request phát sinh), nên AI chọn khoảng chờ cố định.

```ts
// Trước
await page.waitForTimeout(500);
expect(await page.evaluate(() => (window as any).__xss), 'script from the name must not run').toBeUndefined();

// Sau
// Wait for the page (and a possible <img src=x> request + its onerror) to settle instead of sleeping 500 ms.
await page.waitForLoadState('networkidle');
expect(await page.evaluate(() => (window as any).__xss), 'script from the name must not run').toBeUndefined();
```

Giới hạn cần nói thẳng: Playwright ghi `networkidle` là **DISCOURAGED**, và bản thân nó cũng là "500 ms không có kết nối mạng", nên vẫn có yếu tố thời gian. Cách này chấp nhận được ở đây vì không có tín hiệu DOM cho việc "một script lẽ ra không chạy đã không chạy"; assertion chính vẫn là kiểm tra DOM (`img` count 0). Khi SUT còn lỗi, kết quả không đổi (`Received: 1`).

**F3 - Cố định locale cho định dạng tiền (FR-08, `tests/fr08-checkout.spec.ts`, `playwright.config.ts`).**
Vấn đề: C07 và C08 so chuỗi tiền do **Node** tạo (`toLocaleString()` lấy locale từ môi trường tiến trình) với chuỗi do **trình duyệt** tạo (mặc định theo locale hệ thống của từng engine). Hai nơi lấy locale độc lập: `Intl.NumberFormat('vi-VN')` cho `58.000.000` còn `en-US` cho `58,000,000`. Trên máy hiện tại hai phía khớp (C07/C08 xanh cả ba trình duyệt) nhưng kết quả test không nên phụ thuộc vào máy chạy. FR-13 đã tránh bằng `digits()`, FR-08 thì chưa, nên hai file không nhất quán. Model không biết môi trường chạy và không có SUT để thử.

```ts
// Trước
await expect(items.nth(i)).toContainText(Number(chosen[i].price).toLocaleString());
await expect(page.getByText(`Tổng thanh toán: ${sum(chosen).toLocaleString()} ₫`)).toBeVisible();

// Sau
const money = (n: number) => Number(n).toLocaleString('en-US');
await expect(items.nth(i)).toContainText(money(chosen[i].price));
await expect(page.getByText(`Tổng thanh toán: ${money(sum(chosen))} ₫`)).toBeVisible();
```

```ts
// playwright.config.ts, thêm vào `use`
locale: 'en-US', // money / number formats shown by the SUT must not depend on the OS language of the machine
```

Tác động: không đổi trên máy hiện tại; loại bỏ nguy cơ đỏ giả khi chạy trên máy khác. Đây là sửa phòng ngừa, chưa có lần đỏ nào được ghi nhận vì lỗi này.

**F4 - Assertion rỗng ở C05, C06 (FR-08, `tests/fr08-checkout.spec.ts`).**
Vấn đề: `for (const o of orders) expect(...)` không kiểm tra gì khi `orders` rỗng. Nếu không có đơn nào được lưu thì test vẫn pass, kể cả khi giao diện đã hiện "Thanh toán thành công!" (UI báo thành công nhưng không có đơn). Comment trong code nói đây là chủ ý (từ chối cũng là hành vi đúng) nhưng không ràng buộc nhánh "từ chối" phải đi kèm thông báo lỗi. Bước chờ phía trên chỉ yêu cầu có trang thành công **hoặc** có hộp thoại, nên không chặn trường hợp này.

```ts
// Trước
for (const o of orders) expect(Number(o.total_amount)).toBe(sum(chosen));

// Sau
expect(orders.length, 'a single checkout must create at most one order').toBeLessThanOrEqual(1);
if (orders.length === 0) {
  // storing nothing is acceptable only as a visible refusal (error alert); a success page with no stored order must fail
  expect(dialogs.length, 'a refused checkout must show an error to the user').toBeGreaterThan(0);
}
for (const o of orders) expect(Number(o.total_amount)).toBe(sum(chosen));
```

Tác động: C05 và C06 vẫn đỏ vì FR08-BUG-01 (đơn lưu 1 và 0 thay vì tổng giỏ). Khi SUT được sửa và từ chối yêu cầu bị sửa tổng, test chỉ pass nếu có thông báo lỗi; khi SUT sửa bằng cách bỏ qua giá trị client và lưu đúng tổng thì vẫn pass. Phạm vi còn lại: nếu server từ chối vì lý do khác (ví dụ phiên đăng nhập hỏng) thì C05/C06 vẫn có thể pass, nhưng khi đó C01-C04 (thanh toán bình thường) sẽ đỏ.

**F5 - `openAdmin` không được nuốt lỗi im lặng (FR-13, `tests/helpers/admin.ts`).**
Vấn đề: `waitForResponse(...).catch(() => null)` bắt mọi lỗi; nếu request `GET /api/admin/orders` không bao giờ xảy ra, test vẫn chạy tiếp và chỉ thất bại ở bước sau với thông báo khó hiểu. AI sợ test bị treo nên bắt hết lỗi.

```ts
// Trước
await page.goto(ADMIN_URL);
if (ordersLoaded) await ordersLoaded;

// Sau
await page.goto(ADMIN_URL);
if (ordersLoaded && (await ordersLoaded) === null) {
  // Not fatal here (waitDashboardLoaded decides), but it must be visible in the report instead of being swallowed.
  test.info().annotations.push({ type: 'WARN', description: 'GET /api/admin/orders was not observed within 10 s after opening the admin web' });
}
```

Tác động: không đổi kết quả pass/fail; báo cáo HTML hiển thị cảnh báo khi dashboard được mở mà request đơn hàng không xuất hiện.

#### Đề xuất đã rút lại

**Thu hẹp assertion ở S11, S12.** Nhận xét ban đầu cho rằng `getByRole('button')` count 0 quá rộng và đề xuất chỉ đếm các nút trong `ACTION_BUTTON`. Khi đối chiếu với bug report FR13-BUG-02, nút bị phát hiện là "Đánh dấu Đã giao", không thuộc `ACTION_BUTTON`; thu hẹp sẽ làm S12 bỏ sót chính bug đó. Giữ nguyên code. Bài học: đề xuất của AI về việc "thắt chặt" hay "nới lỏng" assertion cần đối chiếu lại với bug đã biết trước khi áp dụng.

### 2.5 Kiểm chứng sau chỉnh sửa

Đã làm: kiểm tra kiểu toàn bộ `tests/` bằng `tsc --strict`, nạp danh sách test bằng `playwright test --list` (60 test mỗi trình duyệt, 180 test tổng cộng, khớp `docs/test-summary.md`), và thử riêng hàm `digits` với các chuỗi `6,200,000 ₫`, `6.200.000 ₫`, `NaN`, rỗng, `0 ₫`. **Chưa chạy các test với SUT thật** sau các chỉnh sửa F1-F5.

Kết quả kỳ vọng khi chạy lại `npm run test:all` (nếu khác, đó là regression do chỉnh sửa):

| Feature | Executed / lượt | Passed | Failed | Kết quả chạy lại |
| :-- | --: | --: | --: | :-- |
| FR-04 | 26 | 18 | 8 | [điền sau khi chạy lại] |
| FR-08 | 15 | 11 | 4 | [điền sau khi chạy lại] |
| FR-13 | 19 | 11 | 8 | [điền sau khi chạy lại] |

### 2.6 Bài học và khuyến nghị cho prompt

- **Cung cấp môi trường thật:** nói rõ hệ điều hành, locale, cách bật SUT, và đưa cho AI đoạn mã nguồn giao diện liên quan; phần lớn lỗi R1, R2 và các lỗi selector đến từ việc AI không thấy SUT.
- **Chốt quy ước một lần cho cả bộ:** selector (role + `exact: true`, không dùng class), cách chờ (không `waitForTimeout`), cách đọc số (chỉ lấy chữ số, `NaN` nếu không có), cách đặt tên và gắn nhãn CLARIFY.
- **Yêu cầu assertion không rỗng:** mỗi nhánh của test phải có ít nhất một assertion; vòng lặp trên danh sách phải kiểm tra danh sách không rỗng khi cần.
- **Đối chiếu ghi chú với test:** mỗi quyết định trong `spec-notes.md` cần có test tương ứng hoặc ghi chú phạm vi (như C10).
- **Kiểm chứng đề xuất sửa trước khi áp dụng:** cả ý định "ném lỗi" ở F1 lẫn đề xuất thu hẹp assertion ở S11/S12 đều cần đọc mã nguồn thư viện hoặc đối chiếu bug đã biết.
- **Review ngoài bằng một AI khác:** lượt rà soát lại code bắt được các lỗi mà chính lượt sinh code không thấy (nhóm assertion yếu, chờ cố định, thiếu edge case), nên nên đưa vào quy trình.
