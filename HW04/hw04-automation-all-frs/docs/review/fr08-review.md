# FR-08 (Thanh toán) - Review và gap analysis của script do AI sinh

Mục đích: ghi lại chỗ AI viết sai hoặc thiếu và chỗ đã sửa. Phần này vào báo cáo chính, là nguyên liệu cho AI Critique (200-300 từ) và nội dung kể trong video.


## A. AI tự phát hiện khi chạy thử với server giả lập

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | AI nói có thể chuẩn bị sẵn giỏ hàng qua API (`/api/cart`). | Sai: web khách giữ giỏ trong bộ nhớ React (`CartContext`), không dùng `/api/cart`. Chuẩn bị qua API sẽ không xuất hiện trên giao diện. | Thêm sản phẩm bằng giao diện (nút "Thêm vào giỏ"). API chỉ dùng để tạo tài khoản, đăng nhập và đọc lại đơn đã lưu. |
| 2 | Dùng `page.goto("/cart")` để mở giỏ. | `goto` tải lại trang nên giỏ bị xóa. | Chuyển trang bằng cách bấm liên kết "Giỏ hàng"; với ca vào thẳng trang thanh toán dùng `history.pushState` (không tải lại). |
| 3 | Chọn sản phẩm theo tên cố định. | Dữ liệu seed có thể khác giữa các máy. | Chọn theo vị trí trong danh sách (`picks` trong `data/fr08-checkout.json`), giá lấy từ `GET /products`. |

## B. Sau khi chạy trên SUT thật

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Nhiều test của form (C11, C12, C13, chỉ đỏ trên firefox/webkit) | **Race condition khi bắt hộp thoại `alert()`**: helper nhớ số hộp thoại *sau* khi bấm nút. Hộp thoại do JavaScript của trang tự bật ngay lúc bấm đã bị tính vào mốc, nên helper chờ một hộp thoại "mới" và trả về `null`. Lần chạy đầu có 15/26 (FR-04) và 5-7/15 (FR-08) test đỏ, một phần chỉ đỏ trên firefox/webkit. | AI chỉ nghĩ đến trường hợp hộp thoại hiện *sau* một request bất đồng bộ; không có SUT thật để thử, nên không thấy khác biệt giữa `alert` đồng bộ và bất đồng bộ; tốc độ khác nhau giữa các trình duyệt làm lỗi chỉ hiện ở một số trình duyệt. | Đổi sang `clickAndWaitDialog` ghi nhớ vị trí trước khi bấm. Sau sửa: 3 trình duyệt cho kết quả giống hệt nhau (FR-04: 8 đỏ, FR-08: 4 đỏ, đều là bug thật). |
| 2 | C12 | **Assertion quá chặt**: bắt buộc có hộp thoại yêu cầu đăng nhập, SRS chỉ yêu cầu chuyển sang trang đăng nhập. | AI lấy hành vi trong mã nguồn làm kỳ vọng. | Kiểm tra URL `/login`; nội dung thông báo ghi vào report (NOTE). |
| 3 | C14, C15 | Giỏ rỗng và địa chỉ giao hàng: SRS im lặng. Kết quả: ép vào trang thanh toán với giỏ rỗng vẫn tạo được đơn; trang thanh toán không có ô địa chỉ (đơn lưu `shipping_address = null`). | Đặc thù của SRS. | CLARIFY, ghi lại hành vi quan sát được. HW02 đã coi giỏ rỗng là bug (FR-08-BUG-04), nên có thể bổ sung `FR08-BUG-04` nếu muốn. |
| 4 | C05, C06 | Kiểm tra "tổng tiền đã lưu" phải qua đơn thật: AI ban đầu chỉ kiểm tra thông báo thành công trên giao diện, không đọc lại đơn đã lưu. | Thông báo thành công không chứng minh số tiền đúng. | Đọc lại đơn qua `GET /orders/my-orders` (oracle), so với tổng giá sản phẩm. Phát hiện: đơn lưu 1 và 0 thay vì 58000000 và 30000000. |

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
| Số âm, số lượng 0, `total_amount` kiểu chuỗi, thiếu trường | Giao diện không gửi được những body này. Chỉ làm được ở tầng API (HW02 đã phủ). |
| `shipping_address` rỗng, `null`, số, chuỗi XSS (FR-08-BUG-05, BUG-08) | Trang thanh toán không có ô nhập địa chỉ, nên không nhập được từ giao diện. |
| Rò rỉ đơn giữa các tài khoản, chi tiết đơn không đầy đủ (BUG-06, BUG-07) | Giao diện chỉ hiển thị danh sách đơn của chính người dùng. Chỉ làm được ở tầng API. |
| Mã giảm giá | Thuộc FR-09, ngoài phạm vi của ba tính năng đã chọn. |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| FR08-BUG-01 Server lưu tổng tiền từ client | C05, C06 | (điền link) | `bugs/screenshots/FR08-BUG-01-*.png` |
| FR08-BUG-02 Ô tổng tiền sửa được | C09 | (điền link) | `bugs/screenshots/FR08-BUG-02-*.png` |
| FR08-BUG-03 Giỏ không xóa sau thanh toán | C10 | (điền link) | `bugs/screenshots/FR08-BUG-03-*.png` |
