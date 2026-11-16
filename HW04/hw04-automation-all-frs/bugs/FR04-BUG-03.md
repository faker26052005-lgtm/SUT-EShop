# FR04-BUG-03

**Tiêu đề Issue:** `[FR-04] Tên người dùng được render như HTML ở header, chạy được script (XSS)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR04-BUG-03 |
| Mức độ | High |
| Feature | FR-04 – Hồ sơ cá nhân |
| Yêu cầu SRS bị vi phạm | SEC-04: dữ liệu người dùng nhập phải được escape khi hiển thị |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | X01, X02 (`tests/fr04-profile.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/182 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập web khách và mở trang **Hồ sơ của bạn**.
2. Đặt **Họ Tên** là `<b>x</b>`, bấm **Cập nhật** rồi tải lại trang. Nhìn lời chào ở header.
3. Lặp lại với tên `<img src=x onerror="window.__xss=1">`, tải lại trang rồi chạy `window.__xss` trong Console.

## Kết quả thực tế
- Với `<b>x</b>`, header hiển thị "Chào, x" (thẻ được render thành chữ in đậm chứ không hiện nguyên văn).
- Với payload `<img onerror>`, `window.__xss` có giá trị `1`: mã script đã chạy.
Giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Header hiển thị đúng văn bản `Chào, <b>x</b>` (đã escape) và không có mã nào chạy từ tên người dùng.

## Nguyên nhân nghi ngờ
Trong `frontend-web/src/App.jsx` (khoảng dòng 27) header dùng `dangerouslySetInnerHTML={{ __html: "Chào, ${user.name}" }}`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR04-BUG-03-header.png`: header hiển thị "Chào, x" in đậm.
- `FR04-BUG-03-xss.png`: Console với `window.__xss` trả về `1`.
- `FR04-BUG-03-test-failed.png`: test X02 fail (`Received: 1`).
