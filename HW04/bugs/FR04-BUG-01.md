# FR04-BUG-01

**Tiêu đề Issue:** `[FR-04] Form hồ sơ từ chối số điện thoại hợp lệ (bắt đầu bằng 0, 10–11 chữ số)`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR04-BUG-01 |
| Mức độ | High |
| Feature | FR-04 – Hồ sơ cá nhân |
| Yêu cầu SRS bị vi phạm | FR-04: số điện thoại bắt đầu bằng 0 và có 10–11 chữ số là hợp lệ |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | P01, P02, P03, P04 (`tests/fr04-profile.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/180 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập web khách `http://localhost:5173` và mở trang **Hồ sơ của bạn**.
2. Nhập vào ô **Số điện thoại** một trong các giá trị: `0912345678`, `09123456789`, `0123456789`, `01234567890`.
3. Bấm **Cập nhật**.

## Kết quả thực tế
Hộp thoại hiện: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số." Hồ sơ không được báo thành công với cả bốn giá trị trên. Kết quả giống nhau trên Chromium, Firefox và WebKit.

## Kết quả mong đợi (theo SRS)
Các số trên là hợp lệ và phải được lưu, hộp thoại "Cập nhật thành công!" hiện ra. Thông báo lỗi cũng không được mâu thuẫn với SRS ("9-10 chữ số" thay vì 10–11 chữ số bắt đầu bằng 0).

## Nguyên nhân nghi ngờ
Trong `frontend-web/src/pages/Profile.jsx` (hàm `handleUpdate`) kiểm tra `/^[1-9][0-9]{8,9}$/`: bắt đầu bằng chữ số 1–9 và dài 9–10 chữ số, ngược với SRS.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR04-BUG-01-alert.png`: hộp thoại báo số không hợp lệ khi nhập `0912345678`.
- `FR04-BUG-01-test-failed.png`: test P01 fail (`Expected: "Cập nhật thành công!"`).
