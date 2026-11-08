# Usability Data Analysis and Synthesis Report

- **Evaluation:** Task 2 Usability Evaluation (Moderated Assessment Testing)
- **Evaluated Flow:** `Product selection → Add to cart → Apply coupon → Checkout`
- **Sample:** $n = 7$ Experimental Participants (P01–P07) + 1 Pilot (Linh)
- **Calibrated Benchmark:** $\le 150$ seconds
- **SUT Version:** EShop Desktop Web (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)
- **Author / Moderator:** 23120138 – Nguyễn Quốc Kỳ (`quockinguyen.lv@gmail.com`)

---

## 1. Executive Quantitative Summary

### 1.1. System Usability Scale (SUS) Statistics
The standard 10-item System Usability Scale was administered immediately following task completion. Raw item responses and normalized scores (0–100) are detailed below:

| Participant | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Normalized SUS | Interpretation (vs. Industry Avg ~68) |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **P01** | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | **77.5** | +9.5 (Above Average / Grade B) |
| **P02** | 4 | 3 | 3 | 2 | 4 | 2 | 4 | 3 | 3 | 2 | **65.0** | -3.0 (Marginal / Grade C) |
| **P03** | 5 | 2 | 5 | 1 | 4 | 2 | 5 | 2 | 4 | 1 | **87.5** | +19.5 (Excellent / Grade A) |
| **P04** | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **100.0** | +32.0 (Best Imaginable / Grade A+) |
| **P05** | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 4 | 2 | 3 | **42.5** | -25.5 (Poor / Grade F) |
| **P06** | 4 | 2 | 4 | 2 | 4 | 2 | 5 | 2 | 4 | 2 | **77.5** | +9.5 (Above Average / Grade B) |
| **P07** | 5 | 2 | 4 | 1 | 5 | 2 | 5 | 1 | 4 | 2 | **87.5** | +19.5 (Excellent / Grade A) |

#### Statistical Summary ($n = 7$):
- **Mean SUS Score ($\bar{x}$):** **76.79 / 100** (95% CI: $[62.99, 90.58]$)
- **Median SUS Score:** **77.50 / 100**
- **Sample Standard Deviation ($s$):** **18.64**
- **Score Range:** $42.5 - 100.0$ ($\Delta = 57.5$)
- **Comparison to Benchmark:** The sample mean exceeds the canonical industry benchmark ($\sim 68.0$) by $+8.79$ points, reflecting generally favorable usability. However, the high standard deviation ($18.64$) highlights sharp divergence between unimpeded users (P03, P04, P07 scoring $\ge 87.5$) and users encountering error feedback hurdles (P05 scoring $42.5$).

---

### 1.2. Task Performance Metrics

| Participant | Outcome | Time on Task (s) | Benchmark ($\le 150$s) | Error Count | Help Requests | Primary Friction Encountered |
|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **P01** | `success` | 135 | **PASS** | 1 | 0 | Enter key in coupon input ignored; 9s hesitation. |
| **P02** | `success` | 168 | **FAIL** (+18s) | 2 | 0 | Small button fonts, slow reading, coupon verification. |
| **P03** | `success` | 118 | **PASS** | 1 | 0 | Accidental trailing space in coupon code; recovered. |
| **P04** | `success` | 105 | **PASS** | 0 | 0 | Smooth navigation; zero friction. |
| **P05** | `assisted` | 195 | **FAIL** (+45s) | 3 | 1 | Selected item $< 300$k; cryptic error message; deadlock $> 2$m. |
| **P06** | `success` | 140 | **PASS** | 1 | 0 | Cart drawer vs. view cart dual navigation hesitation. |
| **P07** | `success` | 125 | **PASS** | 1 | 0 | No success feedback; double-clicked "Áp dụng" button. |

#### Performance Summary Statistics:
- **Overall Completion Rate:** **100.0%** (7 / 7 completed)
  - Unassisted Success Rate: **85.7%** (6 / 7)
  - Assisted Completion Rate: **14.3%** (1 / 7)
  - Task Failure Rate: **0.0%** (0 / 7)
- **Within Calibrated Benchmark ($\le 150$s):** **71.4%** (5 / 7 participants)
- **Mean Time on Task:** **140.9 seconds** ($\approx 2$m 21s)
  - Median Duration: **135.0 seconds**
  - Standard Deviation: **31.0 seconds**
  - Fastest Completion: **105.0 seconds** (P04)
  - Slowest Completion: **195.0 seconds** (P05)
- **Average Error Frequency:** **1.29 errors / session** (Total: 9 recorded errors)
- **Average Help Requests:** **0.14 requests / session** (Total: 1 request by P05)

---

### 1.3. Structured Post-Task Probe Ratings (1–5 Likert Scale)

| Participant | Clarity (1–5) | Error Recovery (1–5) | Speed & Flow (1–5) | Trust (1–5) |
|:---:|:---:|:---:|:---:|:---:|
| **P01** | 4 | 3 | 5 | 4 |
| **P02** | 3 | 4 | 4 | 5 |
| **P03** | 4 | 3 | 5 | 5 |
| **P04** | 5 | 4 | 5 | 5 |
| **P05** | 2 | 2 | 3 | 3 |
| **P06** | 4 | 4 | 4 | 4 |
| **P07** | 4 | 3 | 5 | 5 |
| **Mean** | **3.71 / 5.0** | **3.29 / 5.0** | **4.43 / 5.0** | **4.43 / 5.0** |
| **Median** | **4.0** | **3.0** | **5.0** | **5.0** |

#### Dimensional Insights:
1. **Speed & Flow ($\bar{x} = 4.43$)** and **Trust ($\bar{x} = 4.43$):** Highly rated strengths. Fast client routing, instant cart updates, and transparent price subtotals generate strong purchase confidence.
2. **Clarity ($\bar{x} = 3.71$):** Moderately high, but impacted by understated coupon placement and small typography [P01, P02].
3. **Error Recovery ($\bar{x} = 3.29$):** The lowest dimension across all participants. When coupons fail or succeed, feedback is either misleadingly generic [P03, P05] or completely silent [P01, P07].

---

## 2. Qualitative Synthesis and Root Causes

Across all 7 sessions and the preliminary pilot, observations were synthesized into 5 distinct usability and functional findings. Every statement below cites affected participant IDs:

### Finding F-01: Cryptic / Misleading Error Feedback on Coupon Failure
- **Classification:** `genuine bug` | **Pattern:** `systemic`
- **Affected Participants:** `[P03, P05]`
- **Root Cause & Description:** 
  When a coupon fails validation, the frontend displays generic, unhelpful error toasts such as *"Mã không hợp lệ hoặc không thể áp dụng"* or *"Mã giảm giá không tồn tại"*. 
  In reality, the backend API differentiates between minimum order restrictions (`min_order_amount`), expired codes, and non-existent codes. 
  Because the frontend masks the specific reason, [P05] repeatedly re-typed the coupon code in uppercase/lowercase for $> 2$ minutes, assumed the promotional campaign had expired, and required moderator assistance. Similarly, [P03] accidentally included an extra whitespace (`SAVE 10`) and was told the coupon did not exist rather than receiving an invalid format notice.
- **Evidence Quote [P05]:** *"Thông báo lỗi nên ghi rõ lý do như 'Đơn hàng chưa đủ 300k' thay vì chỉ báo 'Mã không hợp lệ'."*

### Finding F-02: Coupon Input Ignores Keyboard `Enter` Form Submission
- **Classification:** `genuine bug` | **Pattern:** `isolated`
- **Affected Participants:** `[P01]`
- **Root Cause & Description:**
  The coupon input element is rendered without a wrapping `<form onSubmit=...>` or an `onKeyDown` listener for the `Enter` key (KeyCode 13). 
  Users accustomed to desktop web conventions naturally press `Enter` to submit input fields. 
  [P01] pressed `Enter` after typing `SAVE10`, experienced zero UI response, and froze for 9 seconds assuming the browser had hung, before realizing they were forced to manually click the adjacent "Áp dụng" button.
- **Evidence Quote [P01]:** *"Gõ mã xong mình quen tay bấm Enter nhưng web không nhận, tưởng bị đơ một lúc mới thấy cần phải bấm chuột vào nút Áp dụng bên cạnh."*

### Finding F-03: Lack of Success Notification on Coupon Application
- **Classification:** `usability issue` | **Pattern:** `systemic`
- **Affected Participants:** `[P01, P07]` (also observed in `PILOT`)
- **Root Cause & Description:**
  Upon successfully applying a discount coupon, the system updates the numeric subtotals in the pricing column, but presents no explicit confirmation banner, toast, or badge (e.g., *"Đã áp dụng mã SAVE10 (-10%)"*). 
  Users receive no immediate sensory feedback confirming their click registered. 
  [P07] clicked the "Áp dụng" button twice in confusion, while [P01] and the pilot participant had to carefully scrutinize the numeric totals before proceeding.
- **Evidence Quote [P07]:** *"Bấm áp dụng xong nên có thông báo nhảy lên báo là đã giảm thành công bao nhiêu tiền, chứ không có thông báo làm mình tưởng chưa bấm ăn."*

### Finding F-04: Low Visual Prominence of Promotional Input in Cart
- **Classification:** `usability issue` | **Pattern:** `systemic`
- **Affected Participants:** `[P01, P02]` (also observed in `PILOT`)
- **Root Cause & Description:**
  The coupon input container in the cart view is styled with low visual hierarchy, placed beneath secondary total lines without an icon or accent container. 
  Participants spent 20–30 seconds scanning the screen to locate the promotion section. 
  [P02] specifically noted small button font sizing and subdued borders that slowed down navigation.
- **Evidence Quote [P02]:** *"Chữ trên mấy cái nút bấm hơi nhỏ, nhìn không được rõ lắm."*

### Finding F-05: Dual Navigation Ambiguity on Slide-Out Cart Drawer
- **Classification:** `usability issue` | **Pattern:** `isolated`
- **Affected Participants:** `[P06]`
- **Root Cause & Description:**
  When adding an item to the cart, the cart drawer slides out presenting two competing primary-colored actions: *"Xem giỏ hàng"* and *"Thanh toán ngay"*. 
  [P06] hesitated for 10 seconds unsure which button would allow them to input their discount voucher before final payment.
- **Evidence Observation [P06]:** Paused and hovered between drawer buttons before deciding to navigate to the full cart page.

---

## 3. Prioritization and Override-Adjusted Criticality Matrix

Using the course scoring rubric:
$$\text{Criticality} = \text{Severity} \times \text{Probability}$$
Where:
- **Severity Score:** Blocker = 4, Major = 3, Minor = 2, Cosmetic = 1.
- **Probability:** $\text{Affected Participants} / n$ ($n = 7$).

### Small-Sample Blocker & Major Override Rule:
1. **Blocker Override:** Any finding with $\text{Severity} = 4$ is automatically prioritized as **Fix First**.
2. **Major Override:** Any finding with $\text{Severity} = 3$ affecting $\ge 2$ participants is prioritized as **Fix First / High**.
3. **Mathematical Bands:** $\ge 2.0$ (Fix First), $1.0 - 1.99$ (High), $0.5 - 0.99$ (Medium), $< 0.5$ (Low).

| ID | Title | Type | Severity | Affected ($n=7$) | Prob | Criticality | Priority Band | Recommended Action |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **F-01** | Cryptic error message on coupon condition failure causing checkout deadlock | `genuine bug` | **Major (3)** | `[P03, P05]` (2) | 0.29 | 0.86 | **Fix First (Major Override)** | Display specific backend error messages (min order requirement, trim trailing spaces). Filed as GitHub Issue [#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159). |
| **F-03** | Missing success toast notification upon applying coupon code | `usability issue` | **Minor (2)** | `[P01, P07]` (2) | 0.29 | 0.57 | **Medium** | Add green success toast: *"Áp dụng mã SAVE10 thành công (-10%)"*. |
| **F-04** | Low visual prominence and discoverability of coupon entry in cart | `usability issue` | **Minor (2)** | `[P01, P02]` (2) | 0.29 | 0.57 | **Medium** | Enhance container border, add promo tag icon, increase touch target. |
| **F-02** | Coupon input field does not submit on Enter key press | `genuine bug` | **Minor (2)** | `[P01]` (1) | 0.14 | 0.29 | **Low** | Bind `onKeyDown` (Enter) to trigger coupon verification function. Filed as GitHub Issue [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160). |
| **F-05** | Ambiguous dual navigation controls on cart drawer slide-out | `usability issue` | **Cosmetic (1)** | `[P06]` (1) | 0.14 | 0.14 | **Low** | Add visual hierarchy distinction between "View Cart" and "Instant Checkout". |

---

## 4. Synthesis Conclusions & Phase 8 Transition
- **Genuine Functional Bugs Filed as GitHub Issues:**
  1. `F-01`: Cryptic coupon error message causing task deadlock (`Major`, Priority: *Fix First*) $\rightarrow$ GitHub Issue [#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159).
  2. `F-02`: Coupon input field ignores Enter key press (`Minor`, Priority: *Low*) $\rightarrow$ GitHub Issue [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160).
- **Usability Enhancement Recommendations (for Final Report):**
  - `F-03`: Success toast notification for discounts.
  - `F-04`: Visual accent and contrast enhancement for the cart coupon section.
  - `F-05`: Visual hierarchy refinement for the cart drawer.
