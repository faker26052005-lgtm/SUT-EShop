---
screen: Checkout
slug: checkout
sut: EShop
platform: Web (user)
captured_at: 2026-11-03
source: observed in running app & frontend-web source code
---

# Screen Context: Checkout

## Overview
The Checkout screen (`/checkout`) handles order confirmation, review of selected products, total amount verification, discount coupon application, and final order placement.

## Elements
- **Header:**
  - Page title: `"Xác Nhận Đơn Hàng"` (`<h2 className="text-2xl font-bold mb-6">`)
- **Product Summary Section:**
  - Subheader: `"Sản phẩm:"` (`<h3 className="font-semibold mb-2">`)
  - Items list: `<ul className="list-disc pl-5">` rendering `{item.name} x {item.quantity} — {(item.price * item.quantity).toLocaleString()} ₫`
- **Editable Total Amount Section:**
  - Input label: `"Tổng tiền thanh toán (VND):"` (`<label className="font-semibold">`)
  - Total input: `<input type="number" value={editableTotal} ... className="border p-2 rounded text-red-600 font-bold" />`
  - Input behavior: Client state permits manual editing; edits trigger reset of previously applied coupon result and error messages.
- **Coupon Code Section:**
  - Container box: Gray card (`<div className="mb-6 p-4 bg-gray-50 border rounded">`)
  - Field label: `"Mã Giảm Giá"` (`<label className="font-semibold block mb-2">`)
  - Input field: `<input type="text" placeholder="Nhập mã giảm giá..." className="flex-1 border p-2 rounded uppercase" />`
  - Apply button: `"Áp dụng"` (`<button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50">`)
    - Disabled when `applyingCoupon` is true or `couponCode.trim()` is empty
    - Displays `"..."` during API call
  - Coupon error banner: `<p className="mt-2 text-red-600 text-sm">{couponError}</p>`
  - Coupon success breakdown: `<div className="mt-2 text-green-700 text-sm space-y-1">`
    - Confirmation: `✅ {couponResult.message}`
    - Savings breakdown: `"Tiết kiệm: {couponResult.discount_amount.toLocaleString()} ₫"`
    - Final total breakdown: `"Thành tiền: {couponResult.final_amount.toLocaleString()} ₫"`
- **Grand Total Display:**
  - Right-aligned summary: `<span className="font-bold text-xl">Tổng thanh toán: {amount.toLocaleString()} ₫</span>`
- **Order Placement Button:**
  - Submit control: `<button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50">`
  - Disabled during active checkout request
  - Displays `"Xác Nhận Thanh Toán"` when idle, and `"Đang xử lý..."` when loading
- **Success Confirmation View (conditional on `success === true`):**
  - Success header: `"Thanh toán thành công!"` (`<h2 className="text-3xl text-green-600 font-bold mb-4">`)
  - Confirmation text: `"Cảm ơn bạn đã mua sắm tại EShop."`
  - Return navigation button: `"Quay lại trang chủ"` (`<button onClick={() => navigate('/')} className="text-blue-600 hover:underline">`)

## States

| State | Image | Notes |
|---|---|---|
| `default` | `images/checkout_default.png` | Initial screen with cart items, editable total, coupon input, and active "Xác Nhận Thanh Toán" button. |
| `coupon_applying` | *(transient)* | During coupon API validation; coupon button shows `"..."` and is disabled. |
| `coupon_error` | `images/checkout_coupon-error.png` | Displays red inline error message below the coupon field (e.g., `"Không thể áp dụng mã"`, coupon not found, or expired coupon). |
| `coupon_success` | `images/checkout_coupon-success.png` | Displays green box showing discount amount and new net payable amount; grand total updates. |
| `order_submitting` | *(transient)* | During checkout API call; submit button changes label to `"Đang xử lý..."` and is disabled to prevent duplicate submissions. |
| `order_success` | `images/checkout_success.png` | Displays full-screen confirmation "Thanh toán thành công!" with button returning to homepage. |
| `order_error` | *(dialog)* | Triggered on server rejection; displays native popup `alert("Lỗi khi thanh toán: ...")`. |

## Notes
- **Editable Order Amount Flaw:** The total amount field is an interactive number input rather than a read-only computed value. This is a significant functional defect and edge-case testing point.
- **Seeded Test Coupons (from backend database):**
  - `SAVE10`: 10% discount, min order 300,000 ₫ (valid)
  - `BIGBUY`: 50,000 ₫ fixed discount, min order 500,000 ₫ (valid)
  - `VIP100`: 100,000 ₫ fixed discount, min order 300,000 ₫, max 2 uses per user (valid)
  - `EXPIRED`: 20% discount, min order 100,000 ₫, expired `2020-01-01` (invalid/expired)
