---
sut: EShop
aliases: [eshop-sut, SUT-EShop]
upstream_repo: https://github.com/ttbhanh/eshop-sut
issue_repo: https://github.com/faker26052005-lgtm/SUT-EShop
source: EShop specification (hw03.md) and frontend-web source code
verified: yes, 2026-11-03
---

# EShop Screen-to-Requirement Map

This mapping connects EShop application screens to course Functional Requirements (FR) and Interface Aspects (IA). All four Interface Aspects (**IA-01** General UI standards, **IA-02** Forms, **IA-03** Navigation, **IA-04** Feedback / state) apply across all screens.

## Primary Scope Screens (Student: 23120138 - Nguyễn Quốc Kỳ)

| Screen | Aliases | Pool | Platform | FRs | Elements |
|---|---|---|---|---|---|
| Cart | shopping cart, basket, giỏ hàng | B | Web (user) | FR-07 | Header ("Giỏ Hàng"), items table (Sản phẩm, Giá, Số lượng, Thành tiền, Thao tác), delete button ("Xóa"), subtotal ("Tổng tạm tính: ... ₫"), continue shopping link ("← Mua tiếp"), checkout navigation button ("Tiến hành thanh toán"), empty state ("Giỏ hàng của bạn đang trống") |
| Checkout | order confirmation, thanh toán, place order | B | Web (user) | FR-08, FR-09 | Header ("Xác Nhận Đơn Hàng"), order item list, editable total input ("Tổng tiền thanh toán (VND)"), coupon input ("Nhập mã giảm giá..."), apply coupon button ("Áp dụng"), coupon error banner, coupon success breakdown banner, grand total display, checkout confirmation button ("Xác Nhận Thanh Toán"), success view ("Thanh toán thành công!") |

## Additional SUT Reference Screens

| Screen | Aliases | Pool | Platform | FRs | Elements |
|---|---|---|---|---|---|
| Home / Products | product listing, search, trang chủ | A | Web (user) | FR-05 | Search bar, category filters, product cards (title, price, image, add-to-cart button), pagination |
| Product Detail | product view, chi tiết sản phẩm | A | Web (user) | FR-06 | Product gallery/image, title, price, description, quantity selector, add-to-cart button, back link |
| Login | sign in, đăng nhập | A | Web (user) | FR-02 | Username/email input, password input, login submit button, link to registration, link to forgot password |
| Register | sign up, đăng ký | A | Web (user) | FR-01 | Full name, email, password, confirm password, submit button, link to login |
| Forgot Password | password reset, quên mật khẩu | A | Web (user) | FR-03 | Email input, reset code input, new password inputs, submit buttons |
| Profile | user profile, thông tin cá nhân | A | Web (user) | FR-04 | User details view/edit, address, phone number, save button |
| Order History | my orders, lịch sử đơn hàng | B | Web (user) | FR-10, FR-11 | Order list table, order status badges, item summary, total price, timestamp |
| Admin Dashboard | admin overview | C | Web (admin) | FR-12, FR-13 | Navigation drawer, summary cards (revenue, orders, users, products), recent activities |
| Admin Categories | category management | C | Web (admin) | FR-14 | Category list table, add category modal/form, edit/delete actions |
| Admin Products | product management | C | Web (admin) | FR-15, FR-16 | Product table, create product form, CSV file import input, edit/delete actions |
| Admin Coupons | coupon management | C | Web (admin) | FR-17 | Coupon code table, discount type/value inputs, expiry date, usage limit, status toggle |
| Admin Orders | order management | C | Web (admin) | FR-18 | Order table, status dropdown/stepper, customer information, order details |
| Admin Users | user management | C | Web (admin) | FR-19 | User list, role assignment, account status toggle |
| Mobile Home / Catalog | expo home | D | Mobile App | FR-05, FR-06 | Mobile product grid, search, bottom tab navigation, cart badge |
