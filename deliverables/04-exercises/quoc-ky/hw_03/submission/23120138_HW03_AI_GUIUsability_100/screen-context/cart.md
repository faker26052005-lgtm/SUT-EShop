---
screen: Cart
slug: cart
sut: EShop
platform: Web (user)
captured_at: 2026-11-03
source: observed in running app & frontend-web source code
---

# Screen Context: Cart

## Overview
The Shopping Cart screen (`/cart`) displays the products added by the user during their browsing session, line item calculations, subtotal, and entry point to order checkout.

## Elements
- **Header:**
  - Page title: `"Giỏ Hàng"` (`<h2 className="text-2xl font-bold mb-6">`)
- **Cart Items Table:**
  - Table element: `<table className="w-full text-left mb-6">`
  - Column headers (`<thead>`):
    - `"Sản phẩm"` (`<th>`)
    - `"Giá"` (`<th>`)
    - `"Số lượng"` (`<th>`)
    - `"Thành tiền"` (`<th>`)
    - `"Thao tác"` (`<th>`)
  - Item row (`<tbody> <tr>`):
    - Product title: Text display of `item.name`
    - Unit price: Formatted Vietnamese currency `{Number(item.price).toLocaleString()} ₫`
    - Quantity: Static text display of `{item.quantity}` (no stepper or edit input)
    - Line total: Formatted calculation `{(Number(item.price) * item.quantity).toLocaleString()} ₫`
    - Item removal control: `"Xóa"` action button (`<button className="text-red-500 hover:text-red-700">`) bound to `removeFromCart(index)`
- **Order Subtotal Section:**
  - Label: `"Tổng tạm tính:"` (`<div className="text-xl font-bold">`)
  - Amount: Highlighted in red with Vietnamese currency symbol (`<span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>`)
- **Action & Navigation Controls:**
  - Return to shopping: `"← Mua tiếp"` button link (`<Link to="/" className="border px-4 py-2 rounded text-gray-600 hover:bg-gray-50">`)
  - Proceed to checkout: `"Tiến hành thanh toán"` button (`<button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">`) bound to `handleCheckout()`
- **Empty Cart Container (conditional):**
  - Empty heading: `"Giỏ hàng của bạn đang trống"` (`<h2 className="text-2xl mb-4">`)
  - Continue link: `"Tiếp tục mua sắm"` (`<Link to="/" className="text-blue-600 hover:underline">`)

## States

| State | Image | Notes |
|---|---|---|
| `empty` | `images/cart_empty.png` | Rendered when `cart.length === 0`. Displays empty placeholder message and redirect link; table and checkout controls unmounted. |
| `default` | `images/cart_default.png` | Rendered when cart contains $\ge 1$ items. Displays full item table, line totals, subtotal in VND, and action buttons. |
| `unauthenticated_checkout` | *(dialog)* | Triggered when clicking `"Tiến hành thanh toán"` without active login session. Emits native `alert("Bạn cần đăng nhập để thanh toán!")` and routes to `/login`. |

## Notes
- **No Inline Quantity Modification:** The current UI renders `{item.quantity}` as static text. Users cannot increment/decrement quantity directly on `/cart`; items must be deleted and re-added.
- **Currency & Localization:** All price fields utilize `toLocaleString()` formatted with `₫` suffix.
- **Coupon Separation:** Coupon redemption is not part of `/cart`; coupon input is located exclusively on `/checkout`.
