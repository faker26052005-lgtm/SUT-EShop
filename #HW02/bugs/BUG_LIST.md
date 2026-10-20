# Danh sách bug

| Bug ID | Feature | Tiêu đề | Mức độ | Test liên quan | Issue |
| :--- | :--- | :--- | :-: | :--- | :-: |
| FR-04-BUG-01 | FR-04 | PUT /users/me không validate SĐT | High | DT-03..08, DT-08b, DT-08c, BV-01, BV-04, BV-05, BV-07 | Open |
| FR-04-BUG-02 | FR-04 | PUT /users/me xóa các trường không gửi | High | BL-02 (+ side-effect 31 test) | Open |
| FR-04-BUG-03 | FR-04 | Tự đổi role thành admin | Critical | BL-04 | Open |
| FR-09-BUG-01 | FR-09 | POST /api/apply-coupon tính sai mã loại percent: discount_amount âm, final_amount lớn hơn tổng đơn (FR-09) | Critical | DT-01, DT-20, BV-03 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/77 |
| FR-09-BUG-02 | FR-09 | POST /api/apply-coupon từ chối khi total_amount bằng đúng min_order_amount (dùng > thay vì >=) (FR-09) | Medium | BV-02, BV-05, BV-08 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/78 |
| FR-09-BUG-03 | FR-09 | POST /api/apply-coupon không kiểm tra JWT: không token hoặc token sai vẫn nhận 200 (FR-09, SEC-02) | High | AC-01, AC-02 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/79 |
| FR-09-BUG-04 | FR-09 | POST /api/apply-coupon không giới hạn số lần dùng mã trên mỗi user (max_uses_per_user) (FR-09) | Medium | BV-10, BV-11, BV-12, BL-02, BL-03, BL-04, BL-05, BL-06 | (https://github.com/faker26052005-lgtm/SUT-EShop/issues/80) |
| FR-20-BUG-01 | FR-20 | Đăng ký không kiểm tra trường bắt buộc | High | DT-R03, R13, R28 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/47 |
| FR-20-BUG-02 | FR-20 | Đăng ký không kiểm tra định dạng email | High | DT-R08, R09, R10, R12 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/48 |
| FR-20-BUG-03 | FR-20 | Cho phép đăng ký trùng email | High | DT-R14, BL-R03 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/49 |
| FR-20-BUG-04 | FR-20 | Không áp dụng luật mật khẩu mạnh | High | DT-R23..R26, BV-R01, BV-R04 (+R27, R29) | https://github.com/faker26052005-lgtm/SUT-EShop/issues/50 |
| FR-20-BUG-05 | FR-20 | User tự hủy được đơn `shipping` | High | DT-C03, BV-C01 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/51 |

