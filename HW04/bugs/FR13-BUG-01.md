# FR13-BUG-01

**Tiêu đề Issue:** `[FR-13] Dashboard hiển thị "Tổng doanh thu" gấp đôi tổng tiền các đơn Delivered`

| Trường | Giá trị |
| :--- | :--- |
| Bug ID | FR13-BUG-01 |
| Mức độ | High |
| Feature | FR-13 – Dashboard admin |
| Yêu cầu SRS bị vi phạm | FR-13: doanh thu là tổng `total_amount` của các đơn có trạng thái Delivered |
| Môi trường | Windows, Playwright 3 trình duyệt (Chromium, Firefox, WebKit), Admin web localhost:5174, Backend localhost:3000 |
| Nền tảng | Chromium, Firefox, WebKit |
| Test liên quan | S01, S06, S07, S08, S09, S13 (`tests/fr13-dashboard.spec.ts`) |
| GitHub Issue | https://github.com/faker26052005-lgtm/SUT-EShop/issues/186 |
| Trạng thái | Open |

## Các bước tái hiện
1. Đăng nhập Admin web (`http://localhost:5174`) bằng `admin@eshop.com`, mở tab **Dashboard** và ghi lại giá trị **Tổng doanh thu (Delivered)**.
2. Với tài khoản khách, tạo một đơn hàng có `total_amount` = 200000 (`POST /api/checkout`).
3. Trong tab **Đơn hàng**, chuyển đơn đó lần lượt: Xác nhận, Giao hàng, Hoàn thành (trạng thái **Đã giao**).
4. Quay lại **Dashboard** và so sánh với giá trị ở bước 1.

## Kết quả thực tế
Doanh thu tăng **400000**, tức gấp đôi giá trị đơn hàng. Cùng một hiện tượng ở mọi giá trị thử:

| Test | Giá trị đơn / tổng mong đợi | Dashboard hiển thị |
| :--- | --: | --: |
| S01 | 200000 | 400000 |
| S06 | 1 | 2 |
| S08 (2 đơn Delivered) | 550000 | 1100000 |
| S09 (đi hết luồng trên UI) | 180000 | 360000 |
| S07 | 2147483647 | 4294967294 |
| S13 (tổng toàn hệ thống) | 2148533648 | 4297067296 |

Kết quả giống nhau trên Chromium, Firefox và WebKit. Các đơn Pending, Confirmed, Shipping và Canceled không làm doanh thu thay đổi (S02–S05, S10 đều pass), nên lỗi chỉ xuất hiện khi tính các đơn Delivered.

## Kết quả mong đợi (theo SRS)
Doanh thu tăng đúng bằng `total_amount` của đơn vừa chuyển sang Delivered (ví dụ +200000).

## Nguyên nhân nghi ngờ
Trong `frontend-admin/src/App.jsx` (khoảng dòng 217–220), phép tính doanh thu là `sum + o.total_amount * 2` cho mỗi đơn có `status === "delivered"`.

## Bằng chứng
Cần chụp (đặt trong `bugs/screenshots/`):
- `FR13-BUG-01-dashboard.png`: Dashboard sau khi đơn 200000 được giao, thể hiện giá trị 400000.
- `FR13-BUG-01-test-failed.png`: ảnh test S01 fail từ `test-results/` hoặc từ report HTML (thể hiện `Expected: 200000, Received: 400000`).
