# Usability Evaluation Report: EShop E-Commerce Purchasing Flow

- **Course:** Software Testing (CSC13003) – FIT @ HCMUS
- **Assignment:** HW03 – Task 2: Usability Evaluation
- **Student Name:** Nguyễn Quốc Kỳ
- **Student ID:** 23120138
- **Student Email:** `quockinguyen.lv@gmail.com`
- **SUT Repository:** [faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop)
- **Baseline Git Commit:** `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`
- **Date of Evaluation:** November 2026

---

## 1. Executive Summary

This report documents the moderated assessment usability evaluation conducted on the **EShop** web application. The study evaluated the primary transaction flow: **`Product selection → Add to cart → Apply coupon → Checkout`**, encompassing functional requirements FR-05, FR-06, FR-07, FR-09, and FR-08.

The evaluation was planned and executed with **8 real human participants** (1 Pilot participant for scenario validation and timing calibration + 7 experimental participants P01–P07). Every session adhered to the concurrent think-aloud protocol in a 1-on-1 moderated setting without procedural prompting.

### Key Evaluation Findings:
- **System Usability Scale (SUS):** The system achieved an overall mean SUS score of **76.79 / 100** (Median: 77.50, SD: 18.64), exceeding the canonical industry benchmark ($\sim 68.0$) by $+8.79$ points (*Grade B / Good*).
- **Task Effectiveness & Efficiency:** Overall completion rate reached **100.0%** (85.7% unassisted, 14.3% assisted). The mean task execution duration was **140.9 seconds** ($\approx 2$m 21s), with **71.4%** of participants finishing within the pilot-calibrated benchmark of $\le 150$ seconds.
- **Dimensional Strengths:** Post-task probe dimensions highlighted exceptional perception of **Speed & Flow (4.43 / 5.0)** and **Trust (4.43 / 5.0)**.
- **Primary Bottlenecks:** The lowest perceived dimension was **Error Recovery (3.29 / 5.0)**. A total of **5 usability and functional findings** were identified, prioritized using an override-adjusted criticality matrix ($S \times P$), resulting in **2 genuine bugs** filed as GitHub Issues:
  1. **Issue #159 (`F-01` - Major, *Fix First*):** Cryptic coupon error message failing to explain minimum order requirements, causing task deadlock ($> 2$ minutes) and checkout abandonment risk.
  2. **Issue #160 (`F-02` - Minor, *Low*):** Coupon input field failing to support keyboard `Enter` form submission.

---

## 2. Test Plan and Evaluation Objectives

### 2.1. Research Problem Statements
The evaluation was designed to resolve three specific, measurable usability questions:
1. **PS-1 (Coupon Friction):** Can users locate, apply, and verify a promotional coupon code (`SAVE10`) without confusion, false retries, or external moderator assistance?
2. **PS-2 (Navigation & Recovery):** What specific interface bottlenecks or ambiguous elements impede user progression between cart inspection and final order confirmation?
3. **PS-3 (Satisfaction & Trust):** Does the checkout process provide adequate transparency and reassurance to achieve an above-average SUS score ($\ge 68.0$)?

### 2.2. User Profile and Sampling Criteria
To eliminate testing and developer bias, strict demographic criteria were enforced:
- **Target Profile:** Vietnamese consumers aged 18–35 who make at least 1–2 online purchases per month on platforms such as Shopee, TikTok Shop, or Lazada.
- **Strict Exclusion:** Students enrolled in CSC13003 (Software Testing), QA professionals, and software developers.
- **Sample Roster:** 8 non-IT participants recruited (masked contacts maintained in gitignored `participants.md`).

---

## 3. Task Scenario and Task Components

### 3.1. Realistic Scenario Prompt
To observe authentic behavior without leading instructions, participants were presented with a natural purchasing goal:

> *"Bạn đang cần mua một món đồ công nghệ có giá từ 300.000 ₫ trở lên phục vụ học tập, làm việc trên website EShop. Cửa hàng vừa tặng bạn một mã giảm giá là `SAVE10`. Bạn hãy tìm một sản phẩm ưng ý thỏa điều kiện trên, áp dụng mã giảm giá này và tiến hành hoàn tất việc đặt hàng."*  
> *(English translation: "You are looking to buy a tech gadget or accessory priced at 300,000 ₫ or more for your study and work on the EShop store. The store has sent you a promotional discount code: SAVE10. Please find an item you like that meets this condition, apply your promotional code, and complete your order.")*

### 3.2. Task Components Specification
- **User Task:** Search/browse product, add to cart, navigate to cart, apply coupon `SAVE10`, proceed to checkout, select COD, and confirm purchase.
- **Machine State:** Local server running on `http://localhost:3000`, test buyer account (`test@eshop.com`) logged in, shopping cart empty, coupon `SAVE10` active in SQLite database with zero prior uses.
- **Completion Criteria:** Observable render of the order confirmation view ("Thanh toán thành công!") displaying the order ID and 10% discount subtracted from the grand total.
- **Time Benchmark:** $\le 150$ seconds (calibrated from Phase 5 pilot run of 142s).

### 3.3. State Reset Protocol Between Sessions
Between every participant run, the moderator executed:
1. Local storage cleanup (`localStorage.removeItem('cart')`).
2. SQLite database reset queries:
   ```sql
   DELETE FROM coupon_usage WHERE coupon_id = (SELECT id FROM coupons WHERE code = 'SAVE10');
   DELETE FROM orders WHERE user_id = (SELECT id FROM users WHERE email = 'test@eshop.com');
   ```

---

## 4. Methodology and Pilot Calibration

### 4.1. Evaluation Design
- **Method:** Moderated Assessment Testing with Concurrent Think-Aloud (CTA).
- **Moderator Role:** Neutral observer. Prompted *"What are you thinking right now?"* only when the participant remained silent for $> 15$ seconds. Intervened only when completely deadlocked for $> 2$ minutes (resulting in an `assisted` rating).

### 4.2. Pilot Session Summary (Participant: Linh)
The pilot session validated the scenario clarity and test environment:
- **Pilot Duration:** 142 seconds (unassisted `success`).
- **Observations:** Participant understood the prompt immediately with zero clarification requests. Experienced ~30s searching for the coupon input in the cart, and hesitated due to missing success confirmation after applying the code.
- **Benchmark Calibration:** Initial benchmark ($\le 180$s) was refined to **$\le 150$s** for experimental sessions P01–P07.
- **Compliance:** Pilot data was strictly isolated in `05-pilot-review.md` and excluded from P01–P07 statistical datasets.

---

## 5. Quantitative Usability Results

### 5.1. System Usability Scale (SUS) Breakdown
The Brooke (1996) SUS scoring formula was applied to all 7 participants:
$$\text{SUS} = 2.5 \times \left[ \sum_{i \in \text{odd}} (Q_i - 1) + \sum_{i \in \text{even}} (5 - Q_i) \right]$$

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | SUS Score | Assessment |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **P01** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | **77.5** | Above Average (+9.5) |
| **P02** | 4 | 3 | 3 | 2 | 4 | 2 | 4 | 3 | 3 | 2 | **65.0** | Marginal (-3.0) |
| **P03** | 5 | 2 | 5 | 1 | 4 | 2 | 5 | 2 | 4 | 1 | **87.5** | Excellent (+19.5) |
| **P04** | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **100.0** | Best Imaginable (+32.0) |
| **P05** | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 4 | 2 | 3 | **42.5** | Poor (-25.5) |
| **P06** | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 2 | **77.5** | Above Average (+9.5) |
| **P07** | 5 | 2 | 4 | 1 | 5 | 2 | 5 | 1 | 4 | 2 | **87.5** | Excellent (+19.5) |

- **Sample Mean ($\bar{x}$):** **76.79 / 100**
- **Median:** **77.50 / 100**
- **Sample Standard Deviation ($s$):** **18.64**
- **Minimum / Maximum:** 42.5 / 100.0

### 5.2. Task Performance and Efficiency
- **Overall Completion:** 100.0% (6 Unassisted `success`, 1 `assisted`, 0 `fail`).
- **Mean Duration:** 140.9 seconds (Median: 135.0s, SD: 31.0s, Range: 105s – 195s).
- **Benchmark Adherence:** 71.4% (5 / 7) completed within $\le 150$s.
- **Error Rate:** 1.29 errors / session (9 total errors recorded).
- **Assistance Frequency:** 0.14 help requests / session.

### 5.3. Quantitative Probe Ratings (1–5 Likert Scale)
1. **Speed & Flow:** **4.43 / 5.0** (Fast, seamless client-side page transitions).
2. **Trust & Security:** **4.43 / 5.0** (Accurate coupon arithmetic and clear final totals).
3. **Interface Clarity:** **3.71 / 5.0** (Readable catalog; subdued coupon container).
4. **Error Recovery:** **3.29 / 5.0** (Vague coupon rejection messages; absence of success toast).

---

## 6. Qualitative Synthesis & Criticality Analysis

### 6.1. Identified Findings Detail

1. **F-01 (Cryptic error message on coupon failure):**
   - *Observation:* When coupon rules fail (minimum order amount $\ge 300$k or accidental whitespace), SUT renders generic toast *"Mã không hợp lệ hoặc không thể áp dụng"*. 
   - *Impact:* Caused [P05] to deadlock for $> 2$ minutes, retrying 3 times and assuming the code was broken, necessitating moderator help. In [P03], extra whitespace produced *"Mã không tồn tại"*.
   - *Type:* `genuine bug` | *Severity:* **Major (3)** | *Affected:* `[P03, P05]` ($n=2$).

2. **F-02 (Coupon field ignores Enter key):**
   - *Observation:* Pressing `Enter` in the coupon input field produces no reaction; the form fails to submit.
   - *Impact:* [P01] pressed Enter, experienced 9 seconds of cognitive freeze assuming the browser hung, before switching back to the mouse.
   - *Type:* `genuine bug` | *Severity:* **Minor (2)** | *Affected:* `[P01]` ($n=1$).

3. **F-03 (Missing success feedback on coupon application):**
   - *Observation:* Applying a valid coupon recalculates totals in-place without displaying a positive confirmation toast or badge.
   - *Impact:* [P07] clicked the button twice in uncertainty. [P01] and the pilot participant had to re-verify numbers manually.
   - *Type:* `usability issue` | *Severity:* **Minor (2)** | *Affected:* `[P01, P07]` ($n=2$).

4. **F-04 (Low visual prominence of coupon input in cart):**
   - *Observation:* The input box has thin borders, small button typography, and sits below secondary totals.
   - *Impact:* [P01, P02] spent 20–30 seconds scanning the screen searching for where to enter promo codes.
   - *Type:* `usability issue` | *Severity:* **Minor (2)** | *Affected:* `[P01, P02]` ($n=2$).

5. **F-05 (Dual navigation ambiguity on slide-out cart drawer):**
   - *Observation:* Adding an item triggers a drawer with two equally weighted buttons: *"Xem giỏ hàng"* and *"Thanh toán ngay"*.
   - *Impact:* [P06] hesitated for 10 seconds unsure which option allowed entering promotional discount vouchers.
   - *Type:* `usability issue` | *Severity:* **Cosmetic (1)** | *Affected:* `[P06]` ($n=1$).

### 6.2. Criticality Prioritization Matrix

$$\text{Criticality} = \text{Severity} \times \frac{\text{Affected}}{n}$$

*Small-Sample Override Rule applied: Any Major severity finding affecting $\ge 2$ participants is elevated to **Fix First (Major Override)**.*

| ID | Title | Type | Severity | Affected ($n=7$) | Prob | Criticality | Priority Band | Status / Resolution |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **F-01** | Cryptic error message on coupon condition failure causing checkout deadlock | `genuine bug` | **Major** (3) | `[P03, P05]` (2) | 0.29 | 0.86 | **Fix First (Major Override)** | Filed as GitHub Issue [#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159) |
| **F-03** | Missing success toast notification upon applying coupon code | `usability issue` | **Minor** (2) | `[P01, P07]` (2) | 0.29 | 0.57 | **Medium** | Architectural design recommendation |
| **F-04** | Low visual prominence and discoverability of coupon entry in cart | `usability issue` | **Minor** (2) | `[P01, P02]` (2) | 0.29 | 0.57 | **Medium** | Styling & visual hierarchy recommendation |
| **F-02** | Coupon input field does not submit on Enter key press | `genuine bug` | **Minor** (2) | `[P01]` (1) | 0.14 | 0.29 | **Low** | Filed as GitHub Issue [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160) |
| **F-05** | Ambiguous dual navigation controls on cart drawer slide-out | `usability issue` | **Cosmetic** (1) | `[P06]` (1) | 0.14 | 0.14 | **Low** | Drawer UX hierarchy recommendation |

---

## 7. Genuine Defect Reports (Filed on GitHub)

### Issue #159: [Usability][Cart] Cryptic error message on coupon condition failure causing checkout deadlock
- **URL:** [https://github.com/faker26052005-lgtm/SUT-EShop/issues/159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159)
- **Labels:** `bug`, `severity:Major`, `usability`, `platform:Chrome`
- **Impact:** Blocker to self-recovery; caused 14.3% of test sessions to require external moderator intervention.
- **Evidence Link:** [F-01.png](https://github.com/faker26052005-lgtm/SUT-EShop/blob/e289d73/deliverables/04-exercises/quoc-ky/hw_03/evidence/usability/F-01.png?raw=true)

### Issue #160: [Usability][Cart] Coupon input field ignores Enter key form submission
- **URL:** [https://github.com/faker26052005-lgtm/SUT-EShop/issues/160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160)
- **Labels:** `bug`, `severity:Minor`, `usability`, `platform:Chrome`
- **Impact:** Violates standard keyboard interaction patterns, causing perceived system freezing.
- **Evidence Link:** [F-02.png](https://github.com/faker26052005-lgtm/SUT-EShop/blob/e289d73/deliverables/04-exercises/quoc-ky/hw_03/evidence/usability/F-02.png?raw=true)

---

## 8. UX Recommendations for EShop Redesign

1. **Specific, Actionable Error Messaging:** Parse backend validation payloads directly. When `min_order_amount` is violated, display *"Đơn hàng chưa đạt tối thiểu 300.000 ₫ để áp dụng mã này (còn thiếu X ₫)"* rather than a generic rejection banner.
2. **Immediate Positive Feedback Loops:** Implement a green animated toast notification and a badge tag next to the grand total displaying the exact discount applied: *"Đã áp dụng mã SAVE10 (-10%)"*.
3. **Form & Keyboard Accessibility:** Wrap coupon input in a semantic `<form onSubmit=...>` and automatically trim leading/trailing whitespace (`input.trim()`).
4. **Visual Prominence of Promotions:** Elevate the coupon container with a subtle accent background, dashed coupon border, and tag icon to reduce search friction.
5. **Drawer Navigation Hierarchy:** Prioritize *"Thanh toán"* with high-contrast primary styling and downgrade *"Xem giỏ hàng"* to a secondary outline button, or embed the coupon field directly inside the cart drawer.

---

## 9. Limitations and Threats to Validity

1. **Small Sample Size ($n = 7$):** While 7 participants are sufficient to uncover $\sim 80-85\%$ of primary usability defects (Nielsen & Landauer, 1993), minor edge cases may remain undiscovered.
2. **Localhost Environment:** Testing was conducted on a local development server (`localhost:3000`). While this eliminated network latency and allowed accurate measurement of raw UI execution time, real-world cellular throttling or server delays could introduce additional user hesitation.
3. **Cash on Delivery (COD) Focus:** The scenario evaluated COD checkout. Payment gateway integrations (e.g., VNPay, credit card forms) were not evaluated and may harbor additional usability friction.
4. **Moderator Presence Effect:** Even with strict adherence to neutral think-aloud protocols, the physical presence of a moderator can subtly increase user compliance or attentiveness compared to unmoderated home sessions.
