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
| FR04-BUG-01 Form từ chối SĐT hợp lệ | P01-P04 | (điền link) | `bugs/screenshots/FR04-BUG-01-*.png` |
| FR04-BUG-02 Form nhận SĐT không bắt đầu bằng 0 | P05, P13 | (điền link) | `bugs/screenshots/FR04-BUG-02-*.png` |
| FR04-BUG-03 Tên render thành HTML (XSS) | X01, X02 | (điền link) | `bugs/screenshots/FR04-BUG-03-*.png` |
