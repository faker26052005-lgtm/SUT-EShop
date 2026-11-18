# FR-08 (Thanh toán) - Review và gap analysis của script do AI sinh

## A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | AI nói có thể chuẩn bị sẵn giỏ hàng qua API (`/api/cart`). | Sai: web khách giữ giỏ trong bộ nhớ React (`CartContext`), không dùng `/api/cart`. Chuẩn bị qua API sẽ không xuất hiện trên giao diện. | Thêm sản phẩm bằng giao diện (nút "Thêm vào giỏ"). API chỉ dùng để tạo tài khoản, đăng nhập và đọc lại đơn đã lưu. |
| 2 | Dùng `page.goto("/cart")` để mở giỏ. | `goto` tải lại trang nên giỏ bị xóa. | Chuyển trang bằng cách bấm liên kết "Giỏ hàng"; với ca vào thẳng trang thanh toán dùng `history.pushState` (không tải lại). |
| 3 | Chọn sản phẩm theo tên cố định. | Dữ liệu seed có thể khác giữa các máy. | Chọn theo vị trí trong danh sách (`picks` trong `data/fr08-checkout.json`), giá lấy từ `GET /products`. |

## B. Sau khi chạy trên SUT thật

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Nhiều test của form (C11, C12, C13; chỉ đỏ trên firefox/webkit) | **Race condition khi bắt hộp thoại `alert()`**: helper nhớ số hộp thoại *sau* khi bấm nút. Hộp thoại do JavaScript của trang tự bật ngay lúc bấm đã bị tính vào mốc, nên helper chờ một hộp thoại "mới" và trả về `null`. Lần chạy đầu có 5-7/15 test đỏ tùy trình duyệt. | AI chỉ nghĩ đến trường hợp hộp thoại hiện *sau* một request bất đồng bộ; không có SUT thật để thử, nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ; tốc độ khác nhau giữa các trình duyệt làm lỗi chỉ hiện ở một số trình duyệt. | Đổi sang `clickAndWaitDialog` ghi nhớ vị trí trước khi bấm. Sau sửa: 3 trình duyệt cho kết quả giống hệt nhau (FR-08: 4 đỏ, đều là bug thật). |
| 2 | C12 | **Assertion quá chặt**: bắt buộc có hộp thoại yêu cầu đăng nhập, SRS chỉ yêu cầu chuyển sang trang đăng nhập. | AI lấy hành vi trong mã nguồn làm kỳ vọng. | Kiểm tra URL `/login`; nội dung thông báo ghi vào report (NOTE). |
| 3 | C14, C15 | Giỏ rỗng và địa chỉ giao hàng: SRS im lặng. Kết quả: ép vào trang thanh toán với giỏ rỗng vẫn tạo được đơn; trang thanh toán không có ô địa chỉ (đơn lưu `shipping_address = null`). | Đặc thù của SRS. | CLARIFY, ghi lại hành vi quan sát được. HW02 đã coi giỏ rỗng là bug (FR-08-BUG-04), nên có thể bổ sung `FR08-BUG-04` nếu muốn. |
| 4 | C05, C06 | Kiểm tra "tổng tiền đã lưu" phải qua đơn thật: AI ban đầu chỉ kiểm tra thông báo thành công trên giao diện, không đọc lại đơn đã lưu. | Thông báo thành công không chứng minh số tiền đúng. | Đọc lại đơn qua `GET /orders/my-orders` (oracle), so với tổng giá sản phẩm. Phát hiện: đơn lưu 1 và 0 thay vì 58000000 và 30000000. |

Mã trước và sau của lỗi B-1:

```ts
// Bản nháp đầu của AI
await confirmButton(page).click();
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
| Số âm, số lượng 0, `total_amount` kiểu chuỗi, thiếu trường | Giao diện không gửi được những body này. Chỉ làm được ở tầng API (HW02 đã phủ). |
| `shipping_address` rỗng, `null`, số, chuỗi XSS (FR-08-BUG-05, BUG-08) | Trang thanh toán không có ô nhập địa chỉ, nên không nhập được từ giao diện. |
| Rò rỉ đơn giữa các tài khoản, chi tiết đơn không đầy đủ (BUG-06, BUG-07) | Giao diện chỉ hiển thị danh sách đơn của chính người dùng. Chỉ làm được ở tầng API. |
| Mã giảm giá | Thuộc FR-09, ngoài phạm vi của ba tính năng đã chọn. |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| FR08-BUG-01 Server lưu tổng tiền từ client | C05, C06 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/183 | `bugs/screenshots/FR08-BUG-01-*.png` |
| FR08-BUG-02 Ô tổng tiền sửa được | C09 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/184 | `bugs/screenshots/FR08-BUG-02-*.png` |
| FR08-BUG-03 Giỏ không xóa sau thanh toán | C10 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/185 | `bugs/screenshots/FR08-BUG-03-*.png` |

## E. Rà soát lại code (đọc script và helper sau các lần chạy)

Mục này là phần AI Critique: những chỗ script do AI sinh còn yếu dù test đã chạy ra kết quả đúng. Cột **Loại** ghi nguyên nhân: **P** = chất lượng prompt (prompt không nói rõ môi trường, quy ước hoặc tiêu chí), **M** = hạn chế của model (không chạy được SUT, không biết môi trường, chọn selector dễ viết), **F** = đặc thù của feature/SUT (không có id, `alert()` native, dữ liệu dùng chung). Phân loại là nhận định dựa trên cách script được viết, không trích từ prompt gốc.

| # | Vị trí | Vấn đề | Vì sao AI bỏ sót | Đề xuất / cách sửa | Loại |
| :-: | :-- | :-- | :-- | :-- | :-: |
| 1 | `addToCartByUi` dòng 30 | Selector phụ thuộc class Tailwind: `div.border.rounded`. Đổi giao diện (đổi class) là hỏng toàn bộ FR-08. | Trang không có testid, AI chọn thứ có sẵn trong HTML. | Đi từ nút `getByRole('button', { name: 'Thêm vào giỏ', exact: true })` rồi lấy tên sản phẩm ở tổ tiên gần nhất, hoặc đề nghị thêm `data-testid`. | M, F | Chưa sửa |
| 2 | C07, dòng 91 | `page.locator('li')` đếm **mọi** `<li>` trên trang. Test pass chỉ vì trang xác nhận không có `li` nào khác (ví dụ trong thanh điều hướng). | Kiểm tra trên bản chạy được, không xét cấu trúc có thể đổi. | Giới hạn trong vùng tóm tắt đơn hàng (container có heading "Xác Nhận Đơn Hàng"). | M |
| 3 | C07, C08 (`toLocaleString()`) | Định dạng tiền do **Node** tạo (locale lấy từ môi trường của tiến trình Node), nhưng so với chuỗi do **trình duyệt** tạo (mặc định theo locale hệ thống của từng engine). Hai nơi lấy locale độc lập, không có gì bảo đảm khớp nhau (Node với `vi-VN` cho `58.000.000`, `en-US` cho `58,000,000`). Trên máy của bạn chúng khớp (C07/C08 xanh cả 3 trình duyệt), nhưng test không nên phụ thuộc vào máy chạy. FR-13 đã tránh bằng `digits()`, FR-08 thì chưa. | Model không biết môi trường chạy (Windows, locale Việt) và không có SUT để thử. | Cố định cả hai phía: `locale: 'en-US'` trong `playwright.config.ts` và `toLocaleString('en-US')` trong spec. | M, P |
| 4 | C05, C06, dòng 82 | **Assertion rỗng**: `for (const o of orders) expect(...)`. Nếu không có đơn nào được lưu thì vòng lặp không kiểm tra gì và test vẫn pass, kể cả khi trang đã hiện "Thanh toán thành công!" mà CSDL không có đơn. Comment nói "từ chối cũng đúng" là chủ ý, nhưng không có điều kiện bảo vệ. | AI muốn chấp nhận hai kết quả đúng (lưu đúng tổng, hoặc từ chối) mà không ràng buộc nhánh "từ chối". | Không có đơn chỉ được chấp nhận khi người dùng thấy thông báo lỗi (trang thành công mà không có đơn phải đỏ); luôn kiểm tra tối đa một đơn. | M |
| 5 | C10 so với `spec-notes.md` mục 1 | Ghi chú nói "kiểm tra cả giỏ trên giao diện lẫn `GET /api/cart`", nhưng C10 chỉ kiểm tra giao diện. FR08-BUG-03 do đó chỉ được xác nhận ở phía giao diện; nhận định "lỗi phía API" của HW02 chưa được Playwright kiểm lại. | Quyết định ghi trong ghi chú không được chuyển thành test. | Thêm bước đọc `GET /api/cart` sau thanh toán, hoặc sửa ghi chú cho đúng phạm vi. | P |
| 6 | C03 | Thêm cùng sản phẩm hai lần chỉ kiểm tra tổng đã lưu. Không kiểm tra giỏ gộp thành một dòng số lượng 2 (SRS FR-07) trước khi thanh toán. | Dữ liệu `picks: [0, 0]` dùng lại từ HW02 mà không thêm kỳ vọng về giao diện. | Ở trang giỏ hoặc trang xác nhận kiểm tra có đúng một dòng ` x 2 `. | M |
| 7 | C11 | Thanh toán lỗi được **giả lập** bằng `page.route` trả 500. Test chỉ chứng minh client xử lý lỗi tốt, không chứng minh server giữ giỏ hoặc không tạo đơn khi lỗi thật. | Không có cách gây lỗi thật trên SUT; AI không ghi rõ giới hạn này. | Ghi giới hạn vào báo cáo; không đổi code. | F |
| 8 | Edge case thiếu | Chưa có: bấm "Xác Nhận Thanh Toán" hai lần liên tiếp (có tạo hai đơn không), đổi số lượng bằng +/- rồi thanh toán, xóa một dòng rồi thanh toán, tải lại trang `/checkout` (giỏ bị mất), token hết hạn giữa chừng, tổng tiền rất lớn. | Bảng HW02 thiên về kiểm thử API, AI ít nghĩ đến thao tác người dùng thật. | Thêm `mode` mới (ví dụ `double-submit`) và nhánh tương ứng trong spec. | P, M |
