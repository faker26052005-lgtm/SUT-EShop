# FR13-BUG-02

**Tiêu đề Issue:** `[FR-13/FR-10] Đơn hàng đã hủy (Canceled) vẫn có nút "Đánh dấu Đã giao" trong danh sách đơn`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR13-BUG-02 |
| Mức độ | High |
| Feature | FR-13 – Dashboard admin (quản lý đơn hàng, FR-10) |
| Yêu cầu SRS bị vi phạm | FR-10: Delivered và Canceled là trạng thái cuối, không được chuyển tiếp |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Admin web localhost:5174, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | S12 (`tests/fr13-dashboard.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/187 |
| Trạng thái | Open |

## Các bước tái hiện
1. Với tài khoản khách, tạo một đơn hàng mới (trạng thái Chờ xác nhận).
2. Đăng nhập Admin web (`http://localhost:5174`) bằng `admin@eshop.com`, mở tab **Đơn hàng** và bấm **Hủy** cho đơn đó (trạng thái **Đã hủy**).
3. Nhìn vào cột thao tác của dòng đơn vừa hủy.

## Kết quả thực tế
Dòng đơn hàng có 1 nút thao tác (theo mã nguồn là **"Đánh dấu Đã giao"**). Test S12 báo `Expected: 0, Received: 1` khi đếm các nút trong dòng đơn (ví dụ đơn #15). Kết quả giống nhau trên cả ba trình duyệt.

## Kết quả mong đợi (theo SRS)
Đơn đã hủy là trạng thái cuối, giao diện không hiển thị thao tác chuyển trạng thái nào cho đơn này.

## Nguyên nhân nghi ngờ
Trong `frontend-admin/src/App.jsx` (khoảng dòng 862–869) có đoạn `o.status === "canceled"` hiển thị nút "Đánh dấu Đã giao" gọi `updateOrderStatus(o.id, "delivered")`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR13-BUG-02-order-row.png`: dòng đơn "Đã hủy" có nút "Đánh dấu Đã giao".
- `FR13-BUG-02-test-failed.png`: ảnh test S12 fail (`Expected: 0, Received: 1`).
