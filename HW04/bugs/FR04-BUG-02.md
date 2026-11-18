# FR04-BUG-02

**Tiêu đề Issue:** `[FR-04] Form hồ sơ chấp nhận số điện thoại không bắt đầu bằng 0`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR04-BUG-02 |
| Mức độ | Medium |
| Feature | FR-04 – Hồ sơ cá nhân |
| Yêu cầu SRS bị vi phạm | FR-04: số điện thoại phải bắt đầu bằng 0 |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Web khách localhost:5173, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | P05, P13 (`tests/fr04-profile.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/181 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập web khách và mở trang **Hồ sơ của bạn**.
2. Nhập vào ô **Số điện thoại** `9123456789` (hoặc `1987654321`).
3. Bấm **Cập nhật**.

## Kết quả thực tế
Hộp thoại "Cập nhật thành công!" hiện ra, số điện thoại không bắt đầu bằng 0 được chấp nhận. Giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Số không bắt đầu bằng 0 bị từ chối, hiển thị thông báo lỗi và hồ sơ giữ nguyên số cũ.

## Nguyên nhân nghi ngờ
Cùng nguyên nhân với FR04-BUG-01: biểu thức kiểm tra trong `Profile.jsx` yêu cầu chữ số đầu từ 1–9.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR04-BUG-02-success.png`: hộp thoại thành công khi nhập `9123456789`.
- `FR04-BUG-02-test-failed.png`: test P05 fail (`Expected: not "Cập nhật thành công!"`).
