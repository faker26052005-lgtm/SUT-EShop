# FR-04 (Hồ sơ cá nhân) - Review và gap analysis của script do AI sinh

Mục đích: ghi lại chỗ AI viết sai hoặc thiếu và chỗ đã sửa. Phần này vào báo cáo chính, là nguyên liệu cho AI Critique (200-300 từ) và nội dung kể trong video.


## A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Định vị ô nhập bằng `getByLabel("Họ Tên")`. | Trong mã nguồn, thẻ `<label>` không gắn với `<input>`, nên `getByLabel` không tìm thấy gì. | Dùng placeholder (`VD: 0912345678`, `Nhập địa chỉ của bạn`) và `form input[type="text"]:not([disabled])` cho ô tên. |
| 2 | Chờ thông báo "Cập nhật thành công" như một phần tử trên trang. | Thông báo là hộp thoại `alert()` của trình duyệt, không nằm trong DOM. | Bắt bằng `page.on("dialog")` (xem mục B-1). |
| 3 | Gộp mọi trường hợp vào một test hồ sơ gốc dùng chung. | Một test lỗi làm hỏng dữ liệu của test sau (SĐT và tên bị ghi đè). | Mỗi test tạo tài khoản dùng một lần qua API (`newSession`) và đặt hồ sơ gốc bằng API. |

## B. Sau khi chạy trên SUT thật

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Nhiều test của form (P01-P04, P06-P12, P14, F01, F03, X01, C11, C12, C13) | **Race condition khi bắt hộp thoại `alert()`**: helper nhớ số hộp thoại *sau* khi bấm nút. Hộp thoại do JavaScript của trang tự bật ngay lúc bấm đã bị tính vào mốc, nên helper chờ một hộp thoại "mới" và trả về `null`. Lần chạy đầu có 15/26 (FR-04) và 5-7/15 (FR-08) test đỏ, một phần chỉ đỏ trên firefox/webkit. | AI chỉ nghĩ đến trường hợp hộp thoại hiện *sau* một request bất đồng bộ; không có SUT thật để thử, nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ; tốc độ khác nhau giữa các trình duyệt làm lỗi chỉ hiện ở một số trình duyệt. | Đổi sang `clickAndWaitDialog` ghi nhớ vị trí trước khi bấm. Sau sửa: 3 trình duyệt cho kết quả giống hệt nhau (FR-04: 8 đỏ, FR-08: 4 đỏ, đều là bug thật). |
| 2 | P06-P12, C12 | **Assertion quá chặt so với SRS**: bắt buộc "phải có hộp thoại báo lỗi", trong khi SRS chỉ yêu cầu từ chối. | AI suy ra từ mã nguồn thay vì từ SRS (lẫn lộn "hành vi hiện tại" với "hành vi yêu cầu"). | Bỏ yêu cầu có hộp thoại; kiểm tra "không báo thành công" và (với hồ sơ) "số cũ vẫn được giữ". Nội dung thông báo ghi vào report dưới nhãn NOTE. |
| 3 | F01-F07 (tên, địa chỉ) | **Dữ liệu nền phụ thuộc vào bug**: để tách biến, các test tên/địa chỉ dùng số điện thoại nền `912345678` (form chấp nhận). Nhưng số này **không bắt đầu bằng 0**, tức là không hợp lệ theo SRS. Khi FR04-BUG-01/02 được sửa, các test này sẽ đỏ. | AI chọn dữ liệu "để test chạy được" theo hành vi của form hiện tại, không theo SRS. | Ghi lại làm hạn chế đã biết. Khi SUT sửa lỗi, đổi `fieldTests.phone` trong `data/fr04-baseline.json` thành `0912345678`. Không cần đổi code. |
| 4 | P14, F04-F07 | Trường hợp SRS im lặng (SĐT rỗng, tên rỗng/toàn dấu cách, địa chỉ rỗng, tên 1000 ký tự): AI dễ "bịa" kỳ vọng. | Đặc thù của SRS. | Đánh dấu CLARIFY: ghi lại hành vi quan sát được, không làm test đỏ. Kết quả: tên toàn dấu cách, địa chỉ rỗng và tên 1000 ký tự đều được lưu; tên rỗng bị chặn (`required`). |

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

## C. Test không tự động hóa được / chưa tự động hóa

| Test case HW02 | Lý do |
| :-- | :-- |
| BL-02 (PUT ghi đè trường không gửi thành null) | Form luôn gửi cả ba trường, nên không tái hiện được trên giao diện. Chỉ làm được ở tầng API (HW02 đã phủ bằng Postman). |
| BL-04 (tự đổi `role` thành admin) | Giao diện không có chỗ đổi role. Chỉ làm được ở tầng API. |
| Lộ mật khẩu trong `GET /api/users/me` | Giao diện không hiển thị response. Chỉ làm được ở tầng API. |
| DT-08b, DT-08c (SĐT `null`, kiểu số) | Ô nhập luôn gửi chuỗi, không gửi được `null` hay số. |
| Token sai / hết hạn trên API | Ngoài phạm vi giao diện (HW02 đã phủ). |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| FR04-BUG-01 Form từ chối SĐT hợp lệ | P01-P04 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/180 | `bugs/screenshots/FR04-BUG-01-*.png` |
| FR04-BUG-02 Form nhận SĐT không bắt đầu bằng 0 | P05, P13 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/181 | `bugs/screenshots/FR04-BUG-02-*.png` |
| FR04-BUG-03 Tên render thành HTML (XSS) | X01, X02 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/182 | `bugs/screenshots/FR04-BUG-03-*.png` |


## E. Rà soát lại code (đọc script và helper, bổ sung sau các lần chạy)

Mục này là phần AI Critique: những chỗ script do AI sinh còn yếu dù test đã chạy ra kết quả đúng. Cột **Loại** ghi nguyên nhân: **P** = chất lượng prompt (prompt không nói rõ môi trường, quy ước hoặc tiêu chí), **M** = hạn chế của model (không chạy được SUT, không biết locale, thiên về chọn selector dễ viết), **F** = đặc thù của feature/SUT (không có id, alert() native, dữ liệu dùng chung). Phân loại là nhận định dựa trên cách script được viết, không phải trích từ prompt gốc; hãy chỉnh lại cho khớp prompt bạn thực sự đã dùng.
Cột **Trạng thái**: "Đề xuất" nghĩa là phát hiện khi đọc code, chưa sửa và chưa chạy lại trên SUT thật; chỉ chuyển thành "Đã sửa" sau khi chạy lại cả 3 trình duyệt.

| # | Vị trí | Vấn đề (loại) | Vì sao AI bỏ sót | Đề xuất sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | X02, `fr04-profile.spec.ts` dòng 114 | **Chờ cố định** `page.waitForTimeout(500)` trước khi kiểm tra `window.__xss`. Sự kiện `onerror` của ảnh chạy bất đồng bộ, WebKit/Firefox chậm hơn Chromium; khi SUT được sửa, test có thể pass vì chưa kịp chờ chứ không phải vì đã escape đúng (flaky wait, có thể báo pass giả). | Chờ một khoảng cố định là cách nhanh nhất để "cho script có thời gian chạy"; không có tín hiệu sự kiện để chờ vì khi escape đúng thì không có request nào phát sinh. | Lấy kiểm tra DOM làm assertion chính (`locator('img')` count 0, đã có), chờ `waitForLoadState('networkidle')` thay cho 500 ms, và ghi rõ giới hạn của kiểm tra `__xss` trong báo cáo. | M, F | Đề xuất |
| 2 | `nameInput`, ô email | Selector theo vị trí: `form input[type="text"]:not([disabled]).first()` và `[type="text"][disabled]` cho email. Đúng chỉ vì ô tên đứng trước ô SĐT và ô email là `type="text"`. SRS FR-22 yêu cầu email dùng `type="email"`, nên khi SUT sửa theo SRS, cả hai selector đều hỏng. | Trang không có id/testid và `<label>` không gắn với input (đã ghi ở mục A-1), AI chọn cách ít tốn công nhất. | Dùng placeholder hoặc `getByRole('textbox', { name })` nếu có; nếu không, đề nghị thêm `data-testid`. Ít nhất đặt các selector này vào một chỗ và ghi chú giả định. | M, F | Đề xuất |
| 3 | `saveButton` | `getByRole('button', { name: 'Cập nhật' })` khớp theo chuỗi con. Nếu trang có thêm nút như "Cập nhật mật khẩu" thì Playwright báo strict mode violation. FR-08 đã dùng `exact: true` nhưng FR-04 thì không (không nhất quán giữa các file). | Mỗi spec được sinh riêng, không có quy ước chung về selector. | Thêm `exact: true`; đưa quy ước selector vào prompt ("role + exact"). | P | Đề xuất |
| 4 | F01-F03 | Chỉ kiểm tra dữ liệu lưu qua `GET /users/me`, không kiểm tra giao diện sau khi tải lại trang. Test có thể pass dù form hiển thị sai giá trị đã lưu. | Oracle qua API tiện hơn đọc giao diện. | Sau khi lưu: `page.reload()` rồi `expect(nameInput).toHaveValue(value)` (và tương tự với SĐT, địa chỉ). | M | Đề xuất |
| 5 | P14, F04-F07 | Các ca CLARIFY **không có assertion nào** nên luôn pass. Số "passed" trong `test-summary.md` (18/26) tính cả 5 ca này, nên tỷ lệ pass bị thổi phồng. | Quy ước "ghi nhận, không phán xét" được thêm sau, không ai sửa cách đếm. | Trong báo cáo tách riêng "pass có assertion" và "chỉ ghi nhận (CLARIFY)"; hoặc gán tag riêng cho các ca này. | P | Đề xuất |
| 6 | `data/fr04-phone.json` P07, P09 (và P08) | Dữ liệu **mâu thuẫn với `spec-notes.md` mục 5**: ghi chú nói khoảng trắng và `+84` là CLARIFY, nhưng P07 (`0912 345 678`) và P09 (`0912-345-678`) đang là `reject` cứng, P08 (`+84912345678`) cũng vậy. Test hiện pass vì SUT từ chối cả ba, nên không bị phát hiện. | Ghi chú và dữ liệu được viết ở hai thời điểm khác nhau, không được đối chiếu lại. | P08 không bắt đầu bằng 0 nên reject là hợp lý theo chữ SRS. P07, P09 nên đổi thành `clarify` (hoặc sửa `spec-notes.md` cho khớp). | M | Đề xuất |
| 7 | Dòng 137, `newSession` | Dữ liệu nằm cứng trong code: tên `'Ten Dang Nhap'` (spec) và mật khẩu `'Throwaway1!'`, tên `'HW04 User'` (helper). Đề bài yêu cầu dữ liệu test nằm ngoài script. | Chỉ dữ liệu theo từng ca được đưa vào JSON, giá trị "phụ" thì bị bỏ quên. | Chuyển sang `data/fr04-misc.json` / `data/accounts.json` (khóa `throwaway`). | P | Đề xuất |
| 8 | Phạm vi X01/X02 | Chỉ kiểm tra tên ở header. Cùng một tên được hiển thị ở web admin (danh sách người dùng, đơn hàng), nơi XSS lưu trữ nguy hiểm hơn; chưa có ca nào kiểm tra. | Feature được hiểu hẹp theo trang hồ sơ. | Thêm ca: lưu tên có payload rồi mở danh sách người dùng ở admin (FR-19) và kiểm tra không có phần tử `img`. | M | Đề xuất |
| 9 | Edge case thiếu | Chưa có: SĐT có khoảng trắng ở đầu/cuối (`' 0912345678'`), số Unicode, bấm "Cập nhật" hai lần liên tiếp, tên chứa chuỗi SQL (SEC-05, ví dụ `' OR 1=1 --`), tên dài đúng 255/256 ký tự. | AI ưu tiên bao phủ theo bảng HW02 nên không mở rộng ra ngoài. | Thêm dòng vào `fr04-phone.json` / `fr04-fields.json`; không cần đổi code. | P | Đề xuất |
| 10 | Đăng nhập ở A02 | Selector dùng nhãn tiếng Anh `Username` và nút `Sign In`. SRS FR-21 yêu cầu giao diện nhất quán tiếng Việt, nên đây có dấu hiệu là lỗi GUI chưa được báo. AI dùng nhãn này làm selector mà không đánh dấu là lệch spec. | AI lấy nhãn từ mã nguồn, không đối chiếu với SRS. | Kiểm tra thủ công; nếu đúng là lệch spec thì mở thêm bug (hoặc ghi vào CLARIFY). | M | Cần xác nhận |
