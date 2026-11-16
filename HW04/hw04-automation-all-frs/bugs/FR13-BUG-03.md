# FR13-BUG-03

**Tiêu đề Issue:** `[FR-13/FR-12] Admin web không từ chối token của tài khoản thường, không hiển thị form đăng nhập admin`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR13-BUG-03 |
| Mức độ | Critical |
| Feature | FR-13 – Dashboard admin (phân quyền, FR-12, SEC-03) |
| Yêu cầu SRS bị vi phạm | FR-12 / SEC-03: chỉ tài khoản có role admin được vào trang quản trị |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Admin web localhost:5174, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | A04 (`tests/fr13-dashboard.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/188 |
| Trạng thái | Open |

## Các bước tái hiện
1. Gọi `POST /api/login` với tài khoản thường `test@eshop.com` để lấy JWT (token của user, không phải admin).
2. Mở Admin web `http://localhost:5174`, trong DevTools đặt `localStorage.setItem('adminToken', '<JWT của user>')`.
3. Tải lại trang.

## Kết quả thực tế
Form **Admin Login** không xuất hiện (test A04 chờ 7 giây không thấy tiêu đề "Admin Login"). Giao diện quản trị được mở với token của tài khoản thường. Kết quả giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Với token không có quyền admin, Admin web phải từ chối và hiển thị lại form đăng nhập admin (không hiển thị Dashboard hay danh sách đơn).

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR13-BUG-03-admin-opened.png`: Admin web đang mở khi dùng token của tài khoản thường.
- `FR13-BUG-03-test-failed.png`: ảnh test A04 fail (`getByRole('heading', { name: 'Admin Login' })` not found).
