# Danh sách bug

| Bug ID | Feature | Tiêu đề | Mức độ | Test liên quan | Issue |
| :--- | :--- | :--- | :-: | :--- | :-: |
| FR04-BUG-01 | FR-04 – Hồ sơ cá nhân | Form hồ sơ từ chối số điện thoại hợp lệ (bắt đầu bằng 0, 10–11 chữ số) | High | P01, P02, P03, P04 (`tests/fr04-profile.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/180 |
| FR04-BUG-02 | FR-04 – Hồ sơ cá nhân | Form hồ sơ chấp nhận số điện thoại không bắt đầu bằng 0 | Medium | P05, P13 (`tests/fr04-profile.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/181 |
| FR04-BUG-03 | FR-04 – Hồ sơ cá nhân | Tên người dùng được render như HTML ở header, chạy được script (XSS) | High | X01, X02 (`tests/fr04-profile.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/182 |
| FR08-BUG-01 | FR-08 – Thanh toán | Server lưu tổng tiền do trình duyệt gửi lên (đơn có thể bị đặt giá 0 hoặc 1 VND) | Critical | C05, C06 (`tests/fr08-checkout.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/183 |
| FR08-BUG-02 | FR-08 – Thanh toán | Ô "Tổng tiền thanh toán" trên trang xác nhận đơn hàng cho phép người dùng chỉnh sửa | High | C09 (`tests/fr08-checkout.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/184 |
| FR08-BUG-03 | FR-08 – Thanh toán | Giỏ hàng không được xóa sau khi thanh toán thành công | High | C10 (`tests/fr08-checkout.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/185 |
| FR13-BUG-01 | FR-13 – Dashboard admin | Dashboard hiển thị "Tổng doanh thu" gấp đôi tổng tiền các đơn Delivered | High | S01, S06, S07, S08, S09, S13 (`tests/fr13-dashboard.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/186 |
| FR13-BUG-02 | FR-13 – Dashboard admin (quản lý đơn hàng, FR-10) | Đơn hàng đã hủy (Canceled) vẫn có nút "Đánh dấu Đã giao" trong danh sách đơn | High | S12 (`tests/fr13-dashboard.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/187 |
| FR13-BUG-03 | FR-13 – Dashboard admin (phân quyền, FR-12, SEC-03) | Admin web không từ chối token của tài khoản thường, không hiển thị form đăng nhập admin | Critical | A04 (`tests/fr13-dashboard.spec.ts`) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/188 |
