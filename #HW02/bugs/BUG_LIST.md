# Danh sách bug

| Bug ID | Feature | Tiêu đề | Mức độ | Test liên quan | Issue |
| :--- | :--- | :--- | :-: | :--- | :-: |
| FR-04-BUG-01 | FR-04 | PUT /users/me không validate SĐT | High | DT-03..08, DT-08b, DT-08c, BV-01, BV-04, BV-05, BV-07 | Open |
| FR-04-BUG-02 | FR-04 | PUT /users/me xóa các trường không gửi | High | BL-02 (+ side-effect 31 test) | Open |
| FR-04-BUG-03 | FR-04 | Tự đổi role thành admin | Critical | BL-04 | Open |
 FR-08-BUG-01 | FR-08 | Cho phép Checkout khi chưa đăng nhập hoặc Token không hợp lệ | Critical | AC-01, DT-04, AC-05 | Open |
| FR-08-BUG-02 | FR-08 | Backend tin tưởng total_amount do Client gửi lên thay vì tự tính lại từ giỏ hàng | High | DT-07, DT-08, BL-01 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/93 |
| FR-08-BUG-03 | FR-08 | Giỏ hàng KHÔNG được xóa tự động sau khi thanh toán thành công | Critical | DT-01, BL-01, BL-02 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/94 |
| FR-08-BUG-04 | FR-08 | Cho phép Checkout khi giỏ hàng rỗng (0 sản phẩm) | High | DT-26, DT-29 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/95 |
| FR-08-BUG-05 | FR-08 | Cho phép đặt hàng khi shipping_address rỗng hoặc null | High | DT-14, DT-15, DT-16, DT-17 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/96 |
| FR-08-BUG-06 | FR-08 | Chi tiết đơn hàng không lưu đúng/đầy đủ sản phẩm từ giỏ hàng | High | BL-01, BL-02 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/97 |
| FR-08-BUG-07 | FR-08 | Rò rỉ dữ liệu đơn hàng giữa các tài khoản người dùng khác nhau | Critical | BL-05 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/98 |
| FR-08-BUG-08 | FR-08 | Lưu vết kịch bản XSS trong shipping_address không escape / sanitize | High | DT-12, DT-13 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/99 |
| FR-09-BUG-01 | FR-09 | POST /api/apply-coupon tính sai mã loại percent: discount_amount âm, final_amount lớn hơn tổng đơn (FR-09) | Critical | DT-01, DT-20, BV-03 | 
| FR-09-BUG-01 | FR-09 | POST /api/apply-coupon tính sai mã loại percent: discount_amount âm, final_amount lớn hơn tổng đơn (FR-09) | Critical | DT-01, DT-20, BV-03 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/77 |
| FR-09-BUG-02 | FR-09 | POST /api/apply-coupon từ chối khi total_amount bằng đúng min_order_amount (dùng > thay vì >=) (FR-09) | Medium | BV-02, BV-05, BV-08 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/78 |
| FR-09-BUG-03 | FR-09 | POST /api/apply-coupon không kiểm tra JWT: không token hoặc token sai vẫn nhận 200 (FR-09, SEC-02) | High | AC-01, AC-02 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/79 |
| FR-09-BUG-04 | FR-09 | POST /api/apply-coupon không giới hạn số lần dùng mã trên mỗi user (max_uses_per_user) (FR-09) | Medium | BV-10, BV-11, BV-12, BL-02, BL-03, BL-04, BL-05, BL-06 | (https://github.com/faker26052005-lgtm/SUT-EShop/issues/80) |
| FR-13-BUG-01 | FR-13 | POST /api/checkout không validate total_amount và shipping_address | High | DT-02, DT-04, DT-05 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/90 |
| FR-13-BUG-02 | FR-13 | API Admin (/api/admin/orders) không kiểm tra role admin trong Token | Critical | AC-02, AC-05 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/91 |
| FR-15-BUG-01 | FR-15 | POST /api/products không validate Tên (bắt buộc, tối đa 255 ký tự) | High | DT-03, DT-04, DT-05, BV-01, BV-06, BV-07 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/81 |
| FR-15-BUG-02 | FR-15 | POST /api/products không validate Giá (bắt buộc, số dương > 0) | High | DT-11, DT-12, DT-13, DT-15, DT-16, DT-17, BV-08 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/82 |
| FR-15-BUG-03 | FR-15 | POST /api/products không validate Danh mục (bắt buộc, phải tồn tại) | High | DT-20, DT-21, DT-22, DT-23 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/83 |
| FR-15-BUG-04 | FR-15 | PUT /api/products/:id không validate Tên, Giá, Danh mục | High | DT-U02, DT-U03, DT-U05, DT-U06, DT-U08 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/84 |
| FR-15-BUG-05 | FR-15 | POST/PUT/DELETE /api/products không kiểm tra token và quyền admin | Critical | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/85 |
| FR-15-BUG-06 | FR-15 | GET/PUT/DELETE /api/products/:id với id không tồn tại vẫn trả thành công | Medium | DT-G02, DT-G03, DT-U10, DT-U11, DT-D02, DT-D03 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/86 |
| FR-15-BUG-07 | FR-15 | /api/products nối chuỗi vào truy vấn SQL, dễ bị SQL Injection | Critical | BL-05, BL-06 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/87 |
| FR-15-BUG-08 | FR-15 | PUT /api/products/:id làm thay đổi các sản phẩm khác | High | BL-02, DT-U01, BL-04 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/88 |
| FR-15-BUG-09 | FR-15 | DELETE /api/products/:id làm mất hoặc thay đổi các sản phẩm khác | Critical | DT-D01, BL-07 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/89 |
| FR-20-BUG-01 | FR-20 | Đăng ký không kiểm tra trường bắt buộc | High | DT-R03, R13, R28 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/47 |
| FR-20-BUG-02 | FR-20 | Đăng ký không kiểm tra định dạng email | High | DT-R08, R09, R10, R12 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/48 |
| FR-20-BUG-03 | FR-20 | Cho phép đăng ký trùng email | High | DT-R14, BL-R03 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/49 |
| FR-20-BUG-04 | FR-20 | Không áp dụng luật mật khẩu mạnh | High | DT-R23..R26, BV-R01, BV-R04 (+R27, R29) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/50 |
| FR-20-BUG-05 | FR-20 | User tự hủy được đơn `shipping` | High | DT-C03, BV-C01 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/51 |

