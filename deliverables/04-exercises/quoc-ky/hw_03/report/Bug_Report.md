# HW03 – Comprehensive Bug Report

**Course:** Software Testing (CSC13003) – FIT @ HCMUS  
**Student Name:** Nguyễn Quốc Kỳ  
**Student ID:** 23120138  
**Student Email:** `quockinguyen.lv@gmail.com`  
**GitHub Issue Repository:** [faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop/issues)  

---

## 1. Executive Defect Summary

This document consolidates all empirical defects discovered across **Task 1 (GUI Checklist Execution)**, **Task 2 (Usability Evaluation Sessions)**, and **Task 3 (Cross-Platform Testing)**. All reported bugs are tracked as official GitHub Issues with commit-pinned evidence screenshots.

### 1.1 Severity Classification Matrix

| Severity | Definition | Count | Percentage |
|---|---|---|---|
| **Blocker** | Severe defect preventing core functional completion (e.g. inability to checkout, data integrity violation). | *[e.g., 2]* | *[%]* |
| **Major** | Significant defect impairing user experience without total failure (e.g. silent click failures, layout breakage). | *[e.g., 3]* | *[%]* |
| **Minor** | Moderate functional or UI discrepancy with clear workaround (e.g. missing counter badges, unmasked input). | *[e.g., 2]* | *[%]* |
| **Cosmetic** | Minor visual defect, spacing, typography, or styling mismatch not impeding function. | *[e.g., 1]* | *[%]* |
| **Total** | | **[Total Bugs]** | **100%** |

### 1.2 Interface Aspect (IA) Distribution

| Interface Aspect | Discovered Bugs Count | Key Symptoms Observed |
|---|---|---|
| **IA-01: General UI Standards** | *[e.g., 2]* | Mobile table overflow, misalignment of pricing text. |
| **IA-02: Forms** | *[e.g., 2]* | Editable total payment input, password input rendering in cleartext. |
| **IA-03: Navigation** | *[e.g., 1]* | Missing cart item count in header navigation bar. |
| **IA-04: Feedback / State** | *[e.g., 2]* | First click on "Add to Cart" does nothing, abrupt native alert on auth check. |
| **Usability Defect** | *[e.g., 1]* | High participant friction due to lack of discount feedback confirmation. |

---

## 2. Bug Master Registry

| Bug ID | GitHub Issue # | Title | Affected Screen | Severity | Affected Platform(s) | Checklist / Finding Ref | Status |
|---|---|---|---|---|---|---|---|
| `BUG-01` | [#1](https://github.com/faker26052005-lgtm/SUT-EShop/issues/1) | `[Checkout] Total payment amount is an editable input` | Checkout | Blocker | Chrome, Firefox, Safari | `CHECKOUT-IA02-04` | Open |
| `BUG-02` | [#2](https://github.com/faker26052005-lgtm/SUT-EShop/issues/2) | `[ProductDetail] First click on Add to Cart does nothing` | Product Detail | Major | All Platforms | `PROD-IA04-01` / `UF-04` | Open |
| `BUG-03` | [#3](https://github.com/faker26052005-lgtm/SUT-EShop/issues/3) | `[ProductDetail] Add to Cart button hidden on mobile viewports` | Product Detail | Major | Safari / Mobile Viewport | `PROD-IA01-03` | Open |
| `BUG-04` | [#4](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4) | `[Cart] Header navigation lacks item quantity badge` | Header / Cart | Minor | All Platforms | `CART-IA03-02` / `UF-02` | Open |
| `BUG-05` | [#5](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5) | `[Cart] Unauthenticated checkout triggers abrupt native browser alert` | Cart | Minor | Chrome, Firefox, Safari | `CART-IA04-03` / `UF-03` | Open |
| `BUG-06` | *[Pending]* | *[Title for Bug 06]* | *[Screen]* | *[Severity]* | *[Platforms]* | *[Ref]* | Open |
| `BUG-07` | *[Pending]* | *[Title for Bug 07]* | *[Screen]* | *[Severity]* | *[Platforms]* | *[Ref]* | Open |

---

## 3. Detailed Bug Specifications

---

### [BUG-01] [Checkout] Total payment amount can be manually edited by customer

- **GitHub Issue:** [#1](https://github.com/faker26052005-lgtm/SUT-EShop/issues/1)
- **Checklist Item Ref:** `CHECKOUT-IA02-04`
- **Interface Aspect:** `IA-02 Forms`
- **Severity:** `Blocker`
- **Affected Platforms:** Google Chrome 124, Mozilla Firefox 125, Safari 17.4
- **Environment:** Linux / macOS / Windows, Frontend running on `http://localhost:5173`

#### Description
On the Checkout screen (`/checkout`), the order total is rendered inside an editable `<input type="number">` bound to state `editableTotal`. Any user can type a custom monetary value (e.g., `1000`), which is subsequently submitted to `/api/checkout` as `total_amount`, causing a critical business logic and security flaw.

#### Steps to Reproduce
1. Open the application at `http://localhost:5173`.
2. Add any product (e.g., "Giày thể thao Nam" priced at `500,000 ₫`) to cart.
3. Navigate to Cart and click **"Tiến hành thanh toán"**.
4. On `/checkout`, locate the field labeled **"Tổng tiền thanh toán (VND):"**.
5. Clear the value and type `1000`.
6. Click **"Xác Nhận Thanh Toán"**.

#### Expected Result
The total payment amount must be a read-only, non-editable formatted label (`500.000 ₫`), strictly calculated from server-side item prices and validated coupon rules.

#### Actual Result
The user can edit the input value freely, and the payment is processed for the altered amount.

#### Evidence
![BUG-01 Evidence](evidence/screenshots/FAILED_CHECKOUT-IA02-04_Chrome.png)  
*(Screenshot displays Browser, OS, localhost URL, and Student Email overlay: `quockinguyen.lv@gmail.com`)*

---

### [BUG-02] [ProductDetail] First click on "Thêm vào giỏ hàng" fails to add product

- **GitHub Issue:** [#2](https://github.com/faker26052005-lgtm/SUT-EShop/issues/2)
- **Checklist Item Ref:** `PROD-IA04-01` / Usability Finding `UF-04`
- **Interface Aspect:** `IA-04 Feedback / State`
- **Severity:** `Major`
- **Affected Platforms:** All Platforms (Desktop Chrome, Firefox, Safari)
- **Environment:** `http://localhost:5173/product/:id`

#### Description
When viewing a product detail page, clicking the "Thêm vào giỏ hàng" button for the first time produces no feedback and does not add the item to the cart context. The button only functions on the second click due to a flawed click counter logic.

#### Steps to Reproduce
1. Navigate to Home and click on any product card.
2. On `/product/:id`, click the green button labeled **"Thêm vào giỏ hàng"**.
3. Observe button state and navigate to `/cart`.

#### Expected Result
On the first click, the product should be added to the cart, and feedback ("Đã thêm") should appear immediately.

#### Actual Result
Nothing happens on the first click. The product is not added until the user clicks a second time.

#### Evidence
![BUG-02 Evidence](evidence/screenshots/FAILED_PROD-IA04-01_Chrome.png)  
*(Screenshot displays Browser, OS, localhost URL, and Student Email overlay: `quockinguyen.lv@gmail.com`)*

---

### [BUG-03] [ProductDetail] "Thêm vào giỏ hàng" button hidden on mobile viewports

- **GitHub Issue:** [#3](https://github.com/faker26052005-lgtm/SUT-EShop/issues/3)
- **Checklist Item Ref:** `PROD-IA01-03`
- **Interface Aspect:** `IA-01 General UI Standards`
- **Severity:** `Major`
- **Affected Platforms:** Safari Mobile / Expo Go / Mobile Viewport (<768px)
- **Environment:** Mobile Chrome / iOS Safari viewport (390 × 844)

#### Description
On mobile viewports, the primary call-to-action button "Thêm vào giỏ hàng" has a CSS class `bug-mobile-hidden` that sets `display: none` at small media queries, preventing mobile users from adding products to cart.

#### Steps to Reproduce
1. Open the application in responsive mode or on a mobile browser.
2. Navigate to any product detail page (`/product/:id`).
3. Scroll down past the quantity input.

#### Expected Result
The "Thêm vào giỏ hàng" button is visible, accessible, and sized appropriately for mobile touch interaction.

#### Actual Result
The button is completely hidden from the viewport.

#### Evidence
![BUG-03 Evidence](evidence/screenshots/FAILED_PROD-IA01-03_Mobile.png)  
*(Screenshot displays Browser, Mobile device emulation, localhost URL, and Student Email overlay: `quockinguyen.lv@gmail.com`)*

---

*(Additional Bug Detail Sheets BUG-04 to BUG-08 to be filled during Phase 4 & Phase 5 execution)*

---

## 4. GitHub Issues Verification Gallery

As mandated by §14 and §223 of [hw03.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/hw03.md#L223), all defects are maintained on the official GitHub Issues page:

### 4.1 GitHub Issues Index Overview
*[Insert screenshot of GitHub Issues index page showing all issues with labels: `bug`, `severity:xxx`, `IA-xx`, `platform:xxx`]*

![GitHub Issues Overview](evidence/screenshots/GITHUB_ISSUES_OVERVIEW.png)

### 4.2 Direct Issue Links
- **Issue #1:** `[Checkout] Total payment amount can be manually edited by customer` – [View on GitHub](https://github.com/faker26052005-lgtm/SUT-EShop/issues/1)
- **Issue #2:** `[ProductDetail] First click on Add to Cart fails to add product` – [View on GitHub](https://github.com/faker26052005-lgtm/SUT-EShop/issues/2)
- **Issue #3:** `[ProductDetail] Add to Cart button hidden on mobile viewports` – [View on GitHub](https://github.com/faker26052005-lgtm/SUT-EShop/issues/3)
- **Issue #4:** `[Cart] Header navigation lacks item quantity badge` – [View on GitHub](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4)
- **Issue #5:** `[Cart] Unauthenticated checkout triggers abrupt native browser alert` – [View on GitHub](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5)
- *(Additional issue links populated upon batch filing)*
