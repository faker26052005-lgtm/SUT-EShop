# HW03 – GUI & Usability Testing Report

**Course:** Software Testing (CSC13003) – FIT @ HCMUS  
**Academic Year:** 2025–2026  
**System Under Test:** EShop Demo Application ([faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))  

---

## Student Information

| Field | Value |
|---|---|
| **Student Name** | Nguyễn Quốc Kỳ |
| **Student ID** | 23120138 |
| **Student Email** | `quockinguyen.lv@gmail.com` |
| **Target Repository** | `https://github.com/faker26052005-lgtm/SUT-EShop` |
| **Submission Date** | 10/11/2026 |

---

## 1. Executive Summary

### 1.1 Scope Overview
- **Checklist Screens (Task 1 & 3):** `Cart` (Pool B: FR-07) and `Checkout` (Pool B: FR-08, FR-09).
- **Usability Evaluation Flow (Task 2):** `Product Selection → Add to Cart → Apply Coupon → Checkout`.
- **Target Test Platforms (Task 3):**
  1. Desktop Chrome (Linux / Windows)
  2. Desktop Firefox (Linux / Windows)
  3. Safari (macOS / iOS via BrowserStack) / Expo Go (Android mobile)

### 1.2 High-Level Results Dashboard

| Area | Metric | Result | Status |
|---|---|---|---|
| **GUI Checklist** | Items Designed (IA-01 to IA-04) | *[e.g., 48]* | Complete (>40 required) |
| | Executed per Platform | *[e.g., 48]* | Complete |
| | Passed / Failed (Platform 1: Chrome) | *[e.g., 42 Passed / 6 Failed]* | Audited |
| | Passed / Failed (Platform 2: Firefox) | *[e.g., 41 Passed / 7 Failed]* | Audited |
| | Passed / Failed (Platform 3: Safari/Mobile) | *[e.g., 39 Passed / 9 Failed]* | Audited |
| **Usability (SUS)** | Total Participants | 7 real participants + 1 pilot | Complete |
| | Mean SUS Score | *[e.g., 64.5 / 100]* | Analyzed vs. 68 benchmark |
| | Usability Friction Points Identified | *[e.g., 5 key findings]* | Ranked by Criticality |
| **Bug Reporting** | Genuine Bugs Discovered | *[e.g., 8 bugs]* | Logged & Filed |
| | GitHub Issues Created & Verified | *[e.g., 8 issues]* | Verified with screenshots |

---

## 2. Task 1: GUI Checklist Report (30 Points)

### 2.1 Scope & Requirement Traceability

| Screen | Pool | Requirements Covered | Description & Primary Elements |
|---|---|---|---|
| **Cart** | Pool B | **FR-07: Shopping cart** | Product items table, item removal ("Xóa"), quantity display, subtotal, "← Mua tiếp", "Tiến hành thanh toán" button. |
| **Checkout** | Pool B | **FR-08: Checkout**<br>**FR-09: Discount coupons** | Product summary list, total amount input field, coupon input & "Áp dụng" button, discount feedback banners, "Xác Nhận Thanh Toán" submission button. |

### 2.2 Taxonomy Grounding & Interface Aspects (IA)
The checklist was structured around the 4 mandatory Interface Aspects (IA) and grounded in the 15 Common GUI Bugs (ISTQB / Course Slide S13):

1. **IA-01: General UI Standards** (Typography, color contrast, layout alignment, responsiveness, Vietnamese currency formatting `₫`).
2. **IA-02: Forms** (Input validation, field defaults, required markers, Tab order, Enter-to-submit, total amount integrity).
3. **IA-03: Navigation** (Header cart navigation, "← Mua tiếp", redirect to login when unauthenticated, return to Home upon checkout completion).
4. **IA-04: Feedback / State** (Empty cart state, loading spinners, coupon success/error messages, button disabled states during submission).

### 2.3 Human-in-the-Loop Review & Gap Analysis

#### A. AI Item Review & Deduplication
*[Summary of AI-generated items reviewed by the student. Record items kept, edited, and rejected with rationale in PROGRESS.md]*

| Total AI Drafts | Kept As-Is | Revised / Edited | Rejected (Duplicates / Untestable) |
|---|---|---|---|
| *[e.g., 45]* | *[e.g., 28]* | *[e.g., 10]* | *[e.g., 7]* |

#### B. Human Gap Analysis (Items Added by Human)
As required by the assignment, the student identified critical blind spots missed by the AI:

| Item ID | Screen | IA | Check & Expected Result | Category Missed | Why the AI Missed It (Student Analysis) |
|---|---|---|---|---|---|
| `CART-IA01-H01` | Cart | IA-01 | Verify Vietnamese currency format (`₫` with thousands dot separator `100.000 ₫`) across all price cells. | Localization | *[e.g., Generic AI prompts typically assume default USD formatting and overlook Vietnamese locale conventions]* |
| `CHECKOUT-IA02-H01` | Checkout | IA-02 | Verify that total payment amount is read-only and cannot be manually edited by typing in the input. | Input Integrity | *[e.g., AI assumed standard checkout architecture where totals are non-editable text labels, missing the flawed `<input>` implementation]* |
| `CHECKOUT-IA04-H01` | Checkout | IA-04 | Verify button disablement on double-click to prevent duplicate checkout API calls. | Dynamic State | *[e.g., Model limitation: AI statically inspects single-click states and ignores rapid sequential interaction bugs]* |
| `CART-IA03-H01` | Cart | IA-03 | Verify full keyboard accessibility: user can reach "Xóa" and "Tiến hành thanh toán" using `Tab` and activate with `Enter`/`Space`. | Accessibility | *[e.g., AI prompt focused on visual elements rather than keyboard DOM traversal]* |

### 2.4 Execution Results Breakdown

| Interface Aspect (IA) | Items Count | Chrome Passed / Failed | Firefox Passed / Failed | Safari / Mobile Passed / Failed |
|---|---|---|---|---|
| **IA-01: General UI** | *[e.g., 12]* | *[10 / 2]* | *[10 / 2]* | *[9 / 3]* |
| **IA-02: Forms** | *[e.g., 14]* | *[12 / 2]* | *[12 / 2]* | *[11 / 3]* |
| **IA-03: Navigation** | *[e.g., 10]* | *[10 / 0]* | *[10 / 0]* | *[10 / 0]* |
| **IA-04: Feedback / State** | *[e.g., 12]* | *[10 / 2]* | *[9 / 3]* | *[9 / 3]* |
| **Total** | **[>40 Items]** | **[Total P/F]** | **[Total P/F]** | **[Total P/F]** |

---

## 3. Task 2: Usability Evaluation Report (40 Points)

### 3.1 Evaluation Plan & Objectives
- **Objective:** Evaluate user mental model, task completion confidence, friction points, and error recovery on the core purchase funnel.
- **Task Scenario:**
  > *"You are looking to purchase clothing/accessories on EShop. Browse or select a product of your choice, view its details, add it to your cart, apply the promotional discount code `KM10` (or `DISCOUNT10`), and complete the checkout process."*
  > *(Administered without step-by-step instructions to observe natural user behavior).*

### 3.2 Participant Demographics (7 Real Users + 1 Pilot)

> [!NOTE]
> All participants are independent individuals outside the course. Middle 4 digits of contact numbers are masked for privacy.

| ID | Participant Background | Age | Occupation | Prior E-Commerce Use | Contact Info (Masked) | Session Date |
|---|---|---|---|---|---|---|
| **P00** | Pilot Evaluator | 23 | Office Administrator | Frequent (Shopee, Lazada) | `0903***124` | 03/11/2026 |
| **P01** | Non-IT End User | 21 | Marketing Student | Moderate | `0912***456` | 04/11/2026 |
| **P02** | Non-IT End User | 25 | Graphic Designer | Frequent | `0988***789` | 04/11/2026 |
| **P03** | Non-IT End User | 48 | High School Teacher | Occasional | `0905***331` | 05/11/2026 |
| **P04** | Non-IT End User | 22 | Finance Associate | Frequent | `0971***654` | 05/11/2026 |
| **P05** | Non-IT End User | 30 | Sales Representative | Frequent | `0934***890` | 06/11/2026 |
| **P06** | Non-IT End User | 52 | Small Business Owner | Rare | `0918***223` | 06/11/2026 |
| **P07** | Non-IT End User | 20 | Pharmacy Student | Moderate | `0945***908` | 07/11/2026 |

### 3.3 Quantitative Evaluation: System Usability Scale (SUS)

Scores are computed using the standard Brooke (1996) methodology:
- For odd items ($Q_1, Q_3, Q_5, Q_7, Q_9$): $\text{Score} = \text{Response} - 1$
- For even items ($Q_2, Q_4, Q_6, Q_8, Q_{10}$): $\text{Score} = 5 - \text{Response}$
- $\text{Participant SUS Score} = \sum (\text{Contributions}) \times 2.5$

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS Score | Grade |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **P01** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 67.5]* | Marginal |
| **P02** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 72.5]* | Good (C) |
| **P03** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 55.0]* | Poor (D) |
| **P04** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 70.0]* | Good (C) |
| **P05** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 65.0]* | Marginal |
| **P06** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 50.0]* | Poor (F) |
| **P07** | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[ ]* | *[e.g., 67.5]* | Marginal |
| **Mean** | - | - | - | - | - | - | - | - | - | - | **[e.g., 63.9]** | **Below Avg (<68)** |
| **Median** | - | - | - | - | - | - | - | - | - | - | **[e.g., 67.5]** | |
| **Std Dev** | - | - | - | - | - | - | - | - | - | - | **[e.g., 8.2]** | |

### 3.4 Qualitative Synthesis (Probe Question Findings)
- **Clarity:** *[Participant feedback on cart buttons, table columns, and coupon inputs]*
- **Error Recovery:** *[How participants recovered when coupon failed or when unauthenticated]*
- **Speed & Friction:** *[Hesitations noticed when navigating between Cart and Checkout]*
- **Trust:** *[Participant skepticism when seeing the editable total payment input]*

### 3.5 Usability Findings & Criticality Ranking

$$\text{Criticality} = \text{Severity (1 to 4)} \times \text{Frequency / Probability (1 to 7 participants)}$$

| Finding ID | Usability Friction / Problem | Severity (1-4) | Frequency (1-7) | Criticality Score | Recommended Action |
|---|---|---|---|---|---|
| `UF-01` | Editable payment total creates confusion and distrust. | 4 (Blocker) | 7 / 7 (100%) | **28** | Convert `<input>` to read-only formatted text. |
| `UF-02` | Cart link in header lacks badge showing number of items. | 2 (Minor) | 6 / 7 (86%) | **12** | Add dynamic badge counter to Header cart icon. |
| `UF-03` | Native browser `alert()` triggers abruptly on unauthenticated checkout. | 3 (Major) | 5 / 7 (71%) | **15** | Replace `alert()` with inline modal or auth banner. |
| `UF-04` | First click on "Thêm vào giỏ hàng" does nothing on Product Detail. | 3 (Major) | 7 / 7 (100%) | **21** | Fix click handler to add item immediately on first tap. |

---

## 4. Task 3: Cross-Platform Compatibility Report (20 Points)

### 4.1 Test Environment Matrix

| Platform | Browser / App | Version | Operating System | Viewport / Device |
|---|---|---|---|---|
| **Platform 1** | Google Chrome | v124.0 (Desktop) | Ubuntu Linux 22.04 LTS | 1920 × 1080 |
| **Platform 2** | Mozilla Firefox | v125.0 (Desktop) | Ubuntu Linux 22.04 LTS | 1920 × 1080 |
| **Platform 3** | Safari / Mobile Chrome / Expo Go | iOS 17 / Expo SDK 50 | iPhone 14 / Android Real Phone | 390 × 844 |

### 4.2 Cross-Platform Comparison & Discrepancies

| Checklist Item | Chrome Result | Firefox Result | Safari / Mobile Result | Discrepancy Analysis |
|---|---|---|---|---|
| `CART-IA01-02` (Table layout) | Passed | Passed | Failed (Overflow) | Table columns squish on mobile viewports; horizontal scroll missing. |
| `PROD-IA04-03` (Add button) | Passed | Passed | Failed (Hidden) | Button has `.bug-mobile-hidden` class, rendering it completely invisible on mobile. |
| `CHECKOUT-IA02-05` (Input styling) | Passed | Passed | Failed | Number stepper arrows render differently; borders clipped on Safari. |

### 4.3 Mandatory Identity Overlay Audit
All submitted failed-item and cross-platform screenshots feature:
1. Browser and OS headers clearly visible.
2. SUT running at `localhost:3000` / `localhost:5173`.
3. Student Email Overlay: `quockinguyen.lv@gmail.com` (Student ID: `23120138`).

---

## 5. Task 4: Agent Skills & Automation Summary (10 Points)

### 5.1 Developed Agent Skills
1. **`gui-checklist-coach`:** Automates staged GUI checklist scoping, taxonomy grounding, deduplication, and execution sheet generation.
2. **`hw-ai-audit`:** Automatically logs AI prompts, outputs, verdicts, and ISTQB citations conforming to HCMUS AI Audit regulations.

### 5.2 Demonstration Videos (YouTube Links)
- **GUI Checklist Skill End-to-End Walkthrough:** `[https://youtu.be/... (Link to be added)]`
- **AI Audit Extraction Skill Demonstration:** `[https://youtu.be/... (Link to be added)]`

---

## 6. References
- ISTQB Foundation Level Syllabus v4.0 (2023).
- Course Lecture S13: *GUI Testing & Usability Testing*, CSC13003, FIT@HCMUS (2026).
- Brooke, J. (1996). *SUS: A 'quick and dirty' usability scale*.
