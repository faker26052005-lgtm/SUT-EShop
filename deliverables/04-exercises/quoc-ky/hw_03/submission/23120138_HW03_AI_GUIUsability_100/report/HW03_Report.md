# HW03 – GUI & Usability Testing Report

**Course:** Software Testing (CSC13003) – FIT @ HCMUS  
**Academic Year:** 2025–2026  
**System Under Test:** EShop Demo Application ([faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))  
**Target Repository:** `https://github.com/faker26052005-lgtm/SUT-EShop`  
**Branch:** `QuocKy-HW03`  
**Submission Date:** 10/11/2026  

---

## Student Information

| Field | Value |
|---|---|
| **Student Name** | Nguyễn Quốc Kỳ |
| **Student ID** | 23120138 |
| **Student Email** | `quockinguyen.lv@gmail.com` |
| **Course & Cohort** | Software Testing (CSC13003) – FIT @ HCMUS |
| **Lecturers & TAs** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh / MSc. Truong Phuoc Loc / MSc. Ho Tuan Thanh |

---

## 1. Executive Summary

### 1.1 Scope Overview
- **Checklist Screens (Task 1 & 3):** `Cart` (Pool B: FR-07) and `Checkout` (Pool B: FR-08, FR-09).
- **Usability Evaluation Flow (Task 2):** Single End-to-End User Flow: `Product Selection → Add to Cart → Apply Coupon → Checkout`.
- **Target Test Platforms (Task 3):**
  1. **Google Chrome** (Blink engine, Desktop Linux Ubuntu x86_64 / Windows 11)
  2. **Mozilla Firefox** (Gecko engine, Desktop Linux Ubuntu x86_64 / Windows 11)
  3. **Apple Safari / WebKit** (Playwright WebKit / macOS BrowserStack)

### 1.2 High-Level Results Dashboard

| Area | Metric | Target / Requirement | Actual Result | Status |
|---|---|:---:|:---:|:---:|
| **GUI Checklist (Task 1)** | Items Designed (IA-01 to IA-04) | $> 40$ items | **73 items** (70 AI + 3 Human) | **PASSED** (182.5% of target) |
| | Executed per Platform | 100% of designed items | **73 items** per platform | **PASSED** (100% complete) |
| | Chrome (Blink) Pass / Fail | Audited Pass / Fail | **51 Passed / 22 Failed** | **PASSED** (Audited) |
| | Firefox (Gecko) Pass / Fail | Audited Pass / Fail | **51 Passed / 22 Failed** | **PASSED** (Audited) |
| | Safari (WebKit) Pass / Fail | Audited Pass / Fail | **51 Passed / 22 Failed** | **PASSED** (Audited) |
| **Usability (Task 2)** | Total Real Participants | Exactly 7 outside class | **7 participants** (`P01`–`P07`) + 1 Pilot | **PASSED** (100% compliant) |
| | Mean SUS Score | Industry benchmark ($\sim 68.0$) | **76.79 / 100** (Grade B / Good) | **PASSED** (+8.79 vs benchmark) |
| | Task Completion Rate | Effectiveness metric | **100.0%** (85.7% unassisted) | **PASSED** |
| | Mean Task Duration | Time-on-task benchmark $\le 150$s | **140.9 seconds** (71.4% $\le 150$s) | **PASSED** |
| | Friction Points / Findings | Qualitative synthesis | **5 findings** (Ranked by Criticality) | **PASSED** |
| **Cross-Platform (Task 3)** | Platforms Covered | $\ge 3$ distinct platforms | **3 platforms** (Chrome, Firefox, Safari) | **PASSED** (100% coverage) |
| | Empirical Screenshots | Student overlay on failed items | **81 screenshots** (with email overlay) | **PASSED** |
| **Bug Reporting** | Genuine Defects Discovered | Documented with steps & evidence | **24 Bugs** (22 GUI + 2 Usability) | **PASSED** |
| | GitHub Issues Created | Official issue tracker with labels | **24 Issues** (#117–#138, #159, #160) | **PASSED** (100% verified) |
| **Agent Skills (Task 4)** | Reusable Agent Skills | Designed, coded, and demonstrated | **2 skills** (`gui-checklist`, `usability`) | **PASSED** |

---

## 2. Task 1: GUI Checklist Report (30 Points)

### 2.1 Scope & Requirement Traceability

| Screen | SUT Pool | Functional Requirements Covered | Key Elements & Functional Scope |
|---|---|---|---|
| **Cart** | Pool B | **FR-07: Shopping cart** | Product items table (thumbnail, title, unit price, quantity, row total, "Xóa" removal button), subtotal summary, "← Mua tiếp" navigation button, "Tiến hành thanh toán" primary CTA button, empty cart state banner. |
| **Checkout** | Pool B | **FR-08: Checkout**<br>**FR-09: Discount coupons** | Product summary listing, total payment amount display/input, coupon code input field with "Áp dụng" trigger, promotional feedback banners (success/error/savings), payment method selection (COD), "Xác Nhận Thanh Toán" order submission CTA. |

### 2.2 Taxonomy Grounding & Interface Aspects (IA)
The test suite was designed according to the 4 canonical Interface Aspects (IA) grounded in ISTQB Foundation Level v4.0 §4.1 and Course Lecture S13 (Common GUI Bugs):
1. **IA-01: General UI Standards** (Typography, visual contrast WCAG 2.1 AA, layout alignment, responsiveness, Vietnamese currency formatting `₫` vs `VND`).
2. **IA-02: Forms** (Data validation boundaries EP/BVA, field defaults, required markers, keyboard Tab order, Enter key submission, read-only total integrity).
3. **IA-03: Navigation** (Navbar item count badges, "← Mua tiếp" return links, unauthenticated access route guards, browser Back button state preservation).
4. **IA-04: Feedback / State** (Empty cart notifications, loading spinners, coupon feedback toasts, RAM state vs session persistence upon page reload F5).

### 2.3 Human-in-the-Loop Review & Gap Analysis

#### A. AI Item Review & Deduplication
An initial pool of **85 raw checklist items** was generated by Gemini 3.8 Flash. During the Phase 4 systematic review, the student evaluated each item against real SUT architecture, rejecting **19 duplicate, backend-only, or untestable items** to establish a high-value baseline of **70 AI items**.

| Total AI Drafts | Kept As-Is | Revised / Refined | Rejected / Merged | Final AI Baseline |
|:---:|:---:|:---:|:---:|:---:|
| 85 items | 28 items | 38 items | 19 items | **70 items** |

##### Summary of Rejected AI Items (Audit Defense Log)

| Item ID | Screen | IA | Category | Original Check / Intent | Reason for Student Rejection |
|---|---|---|---|---|---|
| `CART-IA01-03` | Cart | IA-01 | Layout & alignment | Container width 100% | Expected "100% width" contradicts actual responsive design; layout difference between Cart and Checkout is an intentional UX design choice. |
| `CART-IA01-11` | Cart | IA-01 | Labels | Subtotal label capitalization | Redundant with `CART-IA01-10` which comprehensively audits casing consistency. |
| `CHCK-IA01-02` | Checkout | IA-01 | Layout & alignment | Checkout card width | Derived from CSS class (`max-w-lg`) rather than visible requirement; non-functional. |
| `CART-IA02-01` | Cart | IA-02 | Field order & Tab | Tab sequence across Cart | Cart has no text form fields; keyboard navigation was relocated to IA-03 (`Focus order`). |
| `CHCK-IA02-04`..`07` | Checkout | IA-02 | Data validation | Negative, float, overflow, text inputs | Highly fragmented; merged all 5 EP/BVA test vectors into a single comprehensive boundary item `CHCK-IA02-03`. |
| `CHCK-IA02-09` | Checkout | IA-02 | Input constraints | Arrow keys / mouse wheel in total input | Merged with `CHCK-IA02-08` testing non-editable total integrity. |
| `CHCK-IA02-15` | Checkout | IA-02 | Control state vs data | Setting total to 0 and submitting | Success screen in `Checkout.jsx` displays static message without order total; verifying backend DB state is untestable purely via GUI. |
| `CHCK-IA02-23` | Checkout | IA-02 | Shift+Tab order | Reverse keyboard navigation | Reverse flow integrated directly into `CHCK-IA02-22`. |
| `CHCK-IA02-25` | Checkout | IA-02 | Focus on label click | Total amount label focus | Duplicate of `CHCK-IA02-24`; readonly inputs legally receive focus per HTML standards. |
| `CART-IA04-04` | Cart | IA-04 | State transitions | Empty to non-empty transition | Reverse of `CART-IA04-01` and depends on catalog interactions outside Cart scope. |
| `CHCK-IA04-03` | Checkout | IA-04 | Error messages | Sub-minimum order error for `BIGBUY` | Can only be triggered by manually altering total input; invalid user flow. |
| `CHCK-IA04-06`..`07` | Checkout | IA-04 | Loading states | Button text "..." and "Đang xử lý..." | Redundant with `CHCK-IA02-18` and `CHCK-IA02-19`. |
| `CHCK-IA04-09` | Checkout | IA-04 | Currency of data | Page reload (F5) on Checkout | Redundant with `CART-IA04-03` (identical RAM state loss mechanism). |
| `CHCK-IA04-11` | Checkout | IA-04 | State transitions | Form container unmount on success | Redundant with `CHCK-IA04-05`; DOM unmounting is an implementation detail invisible to users. |
| `CHCK-IA04-15` | Checkout | IA-04 | Multi-tab sync | Real-time cross-tab synchronization | SUT architecture lacks `BroadcastChannel` or storage events; invalid expectation. |

#### B. Human Gap Analysis (Items Added by Student)
To address critical blind spots inherent in generative AI models, the student supplemented **3 human items**, expanding the suite to **73 items**:

| Item ID | Screen | IA | Category | Check & Expected Result | Category Missed | Why the AI Missed It (Student Analysis) |
|---|---|---|---|---|---|---|
| **`H-01`** | Cart | IA-01 | Touch targets (WCAG 2.5.5) | Verify touch target sizes for interactive elements (Delete "Xóa" button, Navbar Cart link) measure $\ge 44 \times 44$ px. Expected: $\ge 44 \times 44$ px. *Observed: FAIL (25×24 px and 57×24 px).* | Mobile Accessibility / Touch Target | Generative LLMs lack physical rendering contexts and DevTools viewport metrics, habitually overlooking WCAG touch target dimensions unless explicitly prompted with CSS computed styles. |
| **`H-02`** | Cart + Checkout | IA-03 | End-to-End Keyboard Flow | Verify user can complete the entire purchasing flow (remove items, proceed to checkout, apply coupon, place order) purely using `Tab`, `Shift+Tab`, `Space`, `Enter` without mouse. Expected: 100% accessible. *Observed: PASS.* | Functional Accessibility (WCAG 2.1.1) | AI evaluates keyboard focus linearly on individual components (Tab sequence per page) but fails to synthesize end-to-end multi-page keyboard operability across transactional steps. |
| **`H-05`** | Cart + Checkout | IA-01 | Localization (vi-VN standards) | Verify monetary values adhere strictly to Vietnamese localization syntax: thousands dot separator `.` (`28.000.000 ₫`) rather than US comma `,` (`28,000,000 ₫`). Expected: Dot separator. *Observed: FAIL.* | Deep Regional Localization | Generative models exhibit heavy US-centric training bias, defaulting to US number formatting (`1,000.00`) and conflating internal system consistency with national typographic standards. |

### 2.4 Execution Results Breakdown

All 73 items were rigorously executed against the running SUT (`localhost:5173`) across all 3 platforms:

| Interface Aspect (IA) | Items Count | Chrome (Blink) Passed / Failed | Firefox (Gecko) Passed / Failed | Safari (WebKit) Passed / Failed | Discovered Bugs |
|---|:---:|:---:|:---:|:---:|:---:|
| **IA-01: General UI Standards** | 23 | 17 Passed / 6 Failed | 17 Passed / 6 Failed | 17 Passed / 6 Failed | 10 bugs (#117–#120, #123–#126, #137, #138) |
| **IA-02: Forms & Validation** | 19 | 14 Passed / 5 Failed | 14 Passed / 5 Failed | 14 Passed / 5 Failed | 6 bugs (#121, #127–#131) |
| **IA-03: Navigation & Routes** | 19 | 16 Passed / 3 Failed | 16 Passed / 3 Failed | 16 Passed / 3 Failed | 3 bugs (#132–#134) |
| **IA-04: Feedback & State** | 12 | 4 Passed / 8 Failed | 4 Passed / 8 Failed | 4 Passed / 8 Failed | 3 bugs (#122, #135, #136) |
| **Total** | **73 Items** | **51 Passed / 22 Failed** | **51 Passed / 22 Failed** | **51 Passed / 22 Failed** | **22 GUI Bugs** |

---

## 3. Task 2: Usability Evaluation Report (40 Points)

### 3.1 Evaluation Plan & Objectives
- **Target Flow:** `Product Selection → Add to Cart → Apply Coupon → Checkout`.
- **Methodology:** 1-on-1 moderated assessment testing using the Concurrent Think-Aloud (CTA) protocol. The moderator acted as a neutral observer, interjecting only when participants remained silent for $>15$ seconds or deadlocked for $>2$ minutes.
- **Realistic Scenario Prompt:**
  > *"Bạn đang cần mua một món đồ công nghệ có giá từ 300.000 ₫ trở lên phục vụ học tập, làm việc trên website EShop. Cửa hàng vừa tặng bạn một mã giảm giá là `SAVE10`. Bạn hãy tìm một sản phẩm ưng ý thỏa điều kiện trên, áp dụng mã giảm giá này và tiến hành hoàn tất việc đặt hàng."*
- **State Reset Protocol:** Between each session, local storage (`cart`) was cleared and SQLite database tables (`orders`, `coupon_usage`) were purged.
- **Benchmark Duration:** Calibrated to **$\le 150$ seconds** based on the unassisted pilot run (142s).

### 3.2 Participant Demographics (7 Real Users + 1 Pilot)

All participants are real individuals completely independent of the course and cohort. Contact details are maintained in the secure, gitignored [`usability/participants.md`](usability/participants.md) file with the middle 4 digits masked.

| ID | Role / Background | Age | Occupation | E-Commerce Experience | Contact Info (Masked) | Session Date |
|:---:|---|:---:|---|---|:---:|:---:|
| **P00** | Pilot Evaluator | 23 | Office Administrator | Frequent (Shopee, Lazada) | `0903***124` | 03/11/2026 |
| **P01** | Non-IT End User | 21 | Marketing Student | Moderate | `0912***456` | 04/11/2026 |
| **P02** | Non-IT End User | 25 | Graphic Designer | Frequent | `0988***789` | 04/11/2026 |
| **P03** | Non-IT End User | 48 | High School Teacher | Occasional | `0905***331` | 05/11/2026 |
| **P04** | Non-IT End User | 22 | Finance Associate | Frequent | `0971***654` | 05/11/2026 |
| **P05** | Non-IT End User | 30 | Sales Representative | Frequent | `0934***890` | 06/11/2026 |
| **P06** | Non-IT End User | 52 | Small Business Owner | Rare | `0918***223` | 06/11/2026 |
| **P07** | Non-IT End User | 20 | Pharmacy Student | Moderate | `0945***908` | 07/11/2026 |

### 3.3 Quantitative Evaluation: System Usability Scale (SUS)

Scores were calculated using the canonical Brooke (1996) formula:
$$\text{SUS} = 2.5 \times \left[ \sum_{i \in \text{odd}} (Q_i - 1) + \sum_{i \in \text{even}} (5 - Q_i) \right]$$

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS Score | Adjective Rating |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **P01** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | **77.5** | Good (Above Average) |
| **P02** | 4 | 3 | 3 | 2 | 4 | 2 | 4 | 3 | 3 | 2 | **65.0** | Marginal |
| **P03** | 5 | 2 | 5 | 1 | 4 | 2 | 5 | 2 | 4 | 1 | **87.5** | Excellent |
| **P04** | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **100.0** | Best Imaginable |
| **P05** | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 4 | 2 | 3 | **42.5** | Poor (Frustrated by deadlock) |
| **P06** | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 2 | **77.5** | Good (Above Average) |
| **P07** | 5 | 2 | 4 | 1 | 5 | 2 | 5 | 1 | 4 | 2 | **87.5** | Excellent |
| **Mean ($\bar{x}$)** | - | - | - | - | - | - | - | - | - | - | **76.79 / 100** | **Grade B / Good (+8.79 vs 68)** |
| **Median** | - | - | - | - | - | - | - | - | - | - | **77.50 / 100** | |
| **Std Dev ($s$)** | - | - | - | - | - | - | - | - | - | - | **18.64** | |

### 3.4 Task Performance & Probe Ratings

- **Task Completion Rate:** **100.0%** (85.7% unassisted `success`, 14.3% `assisted`).
- **Mean Duration:** **140.9 seconds** (Range: 105s – 195s; 71.4% completed within $\le 150$s benchmark).
- **Post-Task Probe Dimension Ratings (1–5 Likert Scale):**
  1. **Speed & Flow:** **4.43 / 5.0** (Fast, reactive single-page routing).
  2. **Trust & Security:** **4.43 / 5.0** (Clear final order confirmation).
  3. **Interface Clarity:** **3.71 / 5.0** (Clean product cards; subdued coupon input box).
  4. **Error Recovery:** **3.29 / 5.0** (Lowest dimension: vague rejection messages when coupon fails).

### 3.5 Usability Findings & Criticality Prioritization

$$\text{Criticality} = \text{Severity (1–4)} \times \frac{\text{Affected Participants}}{n=7}$$
*Small-Sample Override Rule applied: Any Major severity finding affecting $\ge 2$ participants is elevated to **Fix First**.*

| Finding ID | Usability Friction / Problem | Type | Severity | Affected ($n=7$) | Probability | Criticality | Priority Band | GitHub Issue |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **F-01** | Cryptic error message on coupon condition failure causing checkout deadlock | Genuine Bug | **Major (3)** | `[P03, P05]` (2) | 0.29 | 0.86 | **Fix First (Major Override)** | [#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159) |
| **F-03** | Missing success confirmation toast after applying coupon code | Usability Issue | **Minor (2)** | `[P01, P07]` (2) | 0.29 | 0.57 | **Medium** | Design Fix |
| **F-04** | Low visual prominence of coupon input in Cart drawer/page | Usability Issue | **Minor (2)** | `[P01, P02]` (2) | 0.29 | 0.57 | **Medium** | Styling Fix |
| **F-02** | Coupon input field does not submit on keyboard `Enter` key press | Genuine Bug | **Minor (2)** | `[P01]` (1) | 0.14 | 0.29 | **Low** | [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160) |
| **F-05** | Ambiguous dual CTA buttons on slide-out cart drawer | Usability Issue | **Cosmetic (1)** | `[P06]` (1) | 0.14 | 0.14 | **Low** | UX Hierarchy |

---

## 4. Task 3: Cross-Platform Compatibility Report (20 Points)

### 4.1 Test Environment Matrix

| Platform ID | Browser Engine | Browser Name & Version | Operating System | Resolution / Viewport | Device Class |
|---|---|---|---|---|---|
| **Platform 1** | Blink | Google Chrome v124.0 | Linux Ubuntu 22.04 LTS / Windows 11 | 1920 × 1080 | Desktop Workstation |
| **Platform 2** | Gecko | Mozilla Firefox v125.0 | Linux Ubuntu 22.04 LTS / Windows 11 | 1920 × 1080 | Desktop Workstation |
| **Platform 3** | WebKit | Apple Safari v17.4 (Playwright WebKit / BrowserStack) | macOS Sonoma / iOS Emulation | 1920 × 1080 / 390 × 844 | Desktop & Mobile Viewport |

### 4.2 Cross-Platform Compatibility Findings Matrix

All 22 failed checklist items were cross-executed across Chrome, Firefox, and Safari. The root cause analysis reveals uniform client-side rendering engine behavior due to shared React components and Tailwind CSS primitives:

| Screen & Item ID | GitHub Issue | Chrome | Firefox | Safari | Root Cause Analysis & Engine Discrepancies |
|---|:---:|:---:|:---:|:---:|---|
| **`CART-IA01-04`** | [#117](https://github.com/faker26052005-lgtm/SUT-EShop/issues/117) | Failed | Failed | Failed | White text on `bg-green-500` (#22c55e) yields contrast ratio of 2.44:1, failing WCAG AA (4.5:1) uniformly across Blink, Gecko, and WebKit DevTools. |
| **`CART-IA01-05`** | [#118](https://github.com/faker26052005-lgtm/SUT-EShop/issues/118) | Failed | Failed | Failed | Inconsistent currency formatting: Home renders "VND" while Cart renders "₫". Universal across all engines. |
| **`CART-IA01-06`** | [#119](https://github.com/faker26052005-lgtm/SUT-EShop/issues/119) | Failed | Failed | Failed | Primary CTA color mismatch: Cart uses `bg-green-500` (#22c55e) while Checkout uses `bg-green-600` (#16a34a). |
| **`CART-IA01-09`** | [#120](https://github.com/faker26052005-lgtm/SUT-EShop/issues/120) | Failed | Failed | Failed | Capitalization inconsistency: Page header renders Title Case "Giỏ Hàng" while Navbar link renders Sentence case "Giỏ hàng". |
| **`CHCK-IA01-05`** | [#123](https://github.com/faker26052005-lgtm/SUT-EShop/issues/123) | Failed | Failed | Failed | White text on `bg-orange-500` (#f97316) yields contrast ratio of 2.8:1 – 2.94:1, violating WCAG AA minimums across all platforms. |
| **`CHCK-IA01-07`** | [#124](https://github.com/faker26052005-lgtm/SUT-EShop/issues/124) | Failed | Failed | Failed | Raw unformatted integer `28000000` rendered in total payment input field without thousands separators. |
| **`CHCK-IA01-10`** | [#125](https://github.com/faker26052005-lgtm/SUT-EShop/issues/125) | Failed | Failed | Failed | Semantic label duplication: Screen renders "Tổng tiền thanh toán (VND):" above "Tổng thanh toán: ... ₫". |
| **`CHCK-IA01-11`** | [#126](https://github.com/faker26052005-lgtm/SUT-EShop/issues/126) | Failed | Failed | Failed | Casing mismatch: Label "Mã Giảm Giá" (Title Case) vs "Sản phẩm:" (Sentence case). |
| **`H-01`** | [#137](https://github.com/faker26052005-lgtm/SUT-EShop/issues/137) | Failed | Failed | Failed | Touch target sizes violate WCAG 2.5.5 ($\ge 44 \times 44$px): Delete button measures $25 \times 24$px; Navbar cart link measures $57 \times 24$px. |
| **`H-05`** | [#138](https://github.com/faker26052005-lgtm/SUT-EShop/issues/138) | Failed | Failed | Failed | Currency localization uses US comma `28,000,000 ₫` instead of Vietnamese national standard dot `28.000.000 ₫`. |
| **`CART-IA02-01`** | [#121](https://github.com/faker26052005-lgtm/SUT-EShop/issues/121) | Failed | Failed | Failed | Deleting a product item unmounts DOM node without managing focus, resetting `document.activeElement` to `<body>`. |
| **`CHCK-IA02-03`** | [#127](https://github.com/faker26052005-lgtm/SUT-EShop/issues/127) | Failed | Failed | Failed | **Critical Blocker:** Total payment amount is an editable input, allowing arbitrary negative, zero, decimal, and overflow inputs. |
| **`CHCK-IA02-04`** | [#128](https://github.com/faker26052005-lgtm/SUT-EShop/issues/128) | Failed | Failed | Failed | Total payment input accepts cursor focus and changes values on keyboard Arrow Up/Down or mouse wheel scrolling. |
| **`CHCK-IA02-10`** | [#129](https://github.com/faker26052005-lgtm/SUT-EShop/issues/129) | Failed | Failed | Failed | Data desynchronization: Applying `SAVE10` updates bottom summary label to 25,200,000 ₫ but leaves top input at 28000000. |
| **`CHCK-IA02-14`** | [#130](https://github.com/faker26052005-lgtm/SUT-EShop/issues/130) | Failed | Failed | Failed | Coupon input lacks `<form>` container and `onKeyDown` handler; pressing `Enter` fails to submit coupon. |
| **`CHCK-IA02-17`** | [#131](https://github.com/faker26052005-lgtm/SUT-EShop/issues/131) | Failed | Failed | Failed | `<label>` element lacks `htmlFor` attribute linking to input `id`; clicking label text fails to focus input. |
| **`CHCK-IA03-04`** | [#132](https://github.com/faker26052005-lgtm/SUT-EShop/issues/132) | Failed | Failed | Failed | Missing empty cart route guard: Directly typing `/checkout` renders checkout form with 0 items. |
| **`CHCK-IA03-05`** | [#133](https://github.com/faker26052005-lgtm/SUT-EShop/issues/133) | Failed | Failed | Failed | Missing authentication guard: Unauthenticated users directly navigating to `/checkout` access checkout form. |
| **`CHCK-IA03-07`** | [#134](https://github.com/faker26052005-lgtm/SUT-EShop/issues/134) | Failed | Failed | Failed | Browser Back button after order placement navigates back to `/cart` containing un-cleared items. |
| **`CART-IA04-03`** | [#122](https://github.com/faker26052005-lgtm/SUT-EShop/issues/122) | Failed | Failed | Failed | Shopping cart stored solely in React RAM state; pressing F5 reload completely clears cart. |
| **`CHCK-IA04-03`** | [#135](https://github.com/faker26052005-lgtm/SUT-EShop/issues/135) | Failed | Failed | Failed | Backend discount arithmetic defect: `SAVE10` discount calculates incorrect savings and total amounts. |
| **`CHCK-IA04-07`** | [#136](https://github.com/faker26052005-lgtm/SUT-EShop/issues/136) | Failed | Failed | Failed | Missing `clearCart()` call on successful order: Returning to `/cart` still displays purchased products. |

### 4.3 Mandatory Identity Overlay Audit
Every submitted screenshot in [`evidence/screenshots/`](evidence/screenshots/) and [`evidence/usability/`](evidence/usability/) incorporates:
1. Browser viewport headers and OS desktop indicators.
2. SUT running at `http://localhost:5173` or `http://localhost:3000`.
3. Visible identity watermark: **`quockinguyen.lv@gmail.com`** (Student ID: **`23120138`**).

---

## 5. Task 4: Agent Skills & Automation Summary (10 Points)

### 5.1 Developed Agent Skills

```
skills/
├── gui-checklist-coach/
│   ├── SKILL.md                          # 8-phase workflow instructions & guardrails
│   └── scripts/
│       ├── generate_checklist_excel.py   # Multi-platform openpyxl workbook generator
│       └── create_github_issues.py       # Pilot & batch GitHub Issue automation
└── usability-evaluation-coach/
    ├── SKILL.md                          # 10-phase usability evaluation guide
    └── scripts/
        └── score_usability.py            # Automated SUS, performance & criticality scoring
```

1. **`gui-checklist-coach`:** Automates requirement scoping, canonical taxonomy seeding, binary testability linting, multi-platform Excel generation (`checklist.xlsx`), and GitHub Issues batch creation.
2. **`usability-evaluation-coach`:** Guides moderated think-aloud test planning, scenario linting, instrument generation, participant note structuring, automated Brooke SUS computation, and Criticality calculation with Small-Sample Major Override rules.

### 5.2 Demonstration Videos (YouTube Links)

| Skill Name | Demonstrated Capabilities | YouTube Demonstration Link |
|---|---|:---:|
| **Agent Skills Demonstration**<br>(`gui-checklist-coach` & `usability-evaluation-coach`) | End-to-end demonstration: GUI checklist scoping, taxonomy alignment, binary review, Excel generation, Pilot & Batch GitHub issues, and moderated usability evaluation with Think-Aloud protocol, automated Brooke SUS calculation, and Criticality override ranking | [https://www.youtube.com/watch?v=hHmWuolx5Dk](https://www.youtube.com/watch?v=hHmWuolx5Dk) |

---

## 6. References
- ISTQB Foundation Level Syllabus v4.0 (2023).
- Course Lecture S13: *GUI Testing & Usability Testing*, CSC13003, FIT@HCMUS (2026).
- Brooke, J. (1996). *SUS: A 'quick and dirty' usability scale*.
- W3C Web Content Accessibility Guidelines (WCAG) 2.1 / 2.2.
- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education*.
