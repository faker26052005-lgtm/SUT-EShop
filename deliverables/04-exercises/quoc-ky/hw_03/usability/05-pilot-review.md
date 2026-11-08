# Usability Pilot Session Review and Refinements

- **Participant ID:** `PILOT` (Nguyễn Thị Ngọc Linh)
- **Role in Study:** Scenario calibration, environment validation, and timing benchmark adjustment (Data excluded from final P01–P07 statistical metrics per Default Plan).
- **Date & Platform:** 2026-11-08 / Desktop Web (Google Chrome / Ubuntu 22.04 / `http://localhost:3000`)
- **SUT Baseline Commit:** `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`
- **Moderator:** Nguyễn Quốc Kỳ (23120138)

---

## 1. Pilot Execution Metrics

| Metric | Recorded Value | Evaluation & Notes |
|---|:---:|---|
| **Task Completion Outcome** | `success` | Completed independently without moderator hints or intervention. |
| **Time on Task** | **142 seconds** (2m 22s) | Well within initial 180s estimate; included ~30s of coupon location searching. |
| **Error / Friction Count** | **2 friction points** | 1 hesitation locating coupon box + 1 feedback ambiguity after clicking "Áp dụng". |
| **Help Requests** | **0** | No requests for guidance; understood flow naturally. |
| **System Usability Scale (SUS)** | **82.5 / 100** | Raw scores: `[4, 2, 4, 1, 4, 2, 5, 2, 4, 1]` $\rightarrow$ Odd sum: 16, Even sum: 17 $\rightarrow$ Score: $33 \times 2.5 = 82.5$ (*Good / Above Average*). |

### Post-Task Quantitative Probe Ratings (1–5 Likert Scale):
- **Clarity (Rõ ràng):** `4 / 5` — General UI layout is bright and readable; coupon input could be more prominent.
- **Error Recovery (Khắc phục lỗi):** `3 / 5` — Absence of a clear success toast notification upon applying coupon caused uncertainty.
- **Speed & Flow (Tốc độ):** `5 / 5` — Fast page transitions, responsive buttons, smooth navigation.
- **Trust (Tin cậy):** `4 / 5` — Final order summary accurately reflects the 10% deduction (`SAVE10`), giving reassurance.

---

## 2. Pilot Review Checklist

- [x] **Scenario Comprehension:** Participant immediately understood the purchasing intent and price threshold ($\ge 300,000$ ₫) without asking clarifying questions.
- [x] **Scenario Lint Integrity:** Prompt did not leak UI control names or procedural steps.
- [x] **SUT Technical Stability:** SUT web app ran smoothly on `localhost:3000` with zero console crashes, server 500 errors, or UI freeze.
- [x] **State Reset Effectiveness:**
  - `localStorage.removeItem('cart')` reliably restored cart count to 0.
  - SQL deletion queries on `orders` and `coupon_usage` cleanly unlocked `SAVE10` for reuse.
- [x] **Recording & Audio Quality:** Screen recording captured cursor movement and microphone audio clearly.
- [x] **Time Benchmark Plausibility:** Initial 180s was generous; unassisted completion took 142s even with hesitations.

---

## 3. Qualitative Observations and Early Friction Analysis

1. **Coupon Input Discoverability (Cart Page):**
   - *Observation:* Participant spent 25–30 seconds scanning the cart screen to locate where promotional codes could be entered. The input box is visually understated or positioned below secondary controls.
   - *Behavioral Indicator:* Silent visual scanning across the upper right, scrolling down, and pausing before locating the field.

2. **Coupon Feedback Ambiguity:**
   - *Observation:* After clicking the "Áp dụng" button, the system recalculated the subtotal and grand total, but provided no explicit confirmation banner or toast message (e.g., *"Áp dụng mã giảm giá SAVE10 thành công (-10%)"*).
   - *Verbatim Quote:* *"Ủa, bấm rồi mà không thấy thông báo gì hết, phải nhìn kỹ lại số tiền mới biết là đã giảm rồi."*
   - *Impact:* Mild hesitation and loss of confirmation confidence.

---

## 4. Benchmark Calibration Decision

- **Initial Benchmark:** $\le 180$ seconds (3 minutes).
- **Calibrated Benchmark for P01–P07:** **$\le 150$ seconds (2 minutes 30 seconds)**.
- **Rationale:** The pilot participant completed the full flow in 142 seconds while experiencing approximately 30 seconds of hesitation locating the coupon box. A standard, focused e-commerce user can realistically complete the end-to-end task within 150 seconds. Setting the calibrated benchmark at 150s provides an accurate, discriminating metric for evaluating speed during experimental sessions P01 through P07.

---

## 5. Course Compliance & Rule Confirmation
As defined in the **Default Plan (Phase 0)**:
- This Pilot session (`PILOT`) is used strictly for scenario and benchmark validation.
- All scores (SUS: 82.5, Time: 142s) remain exclusively within this review file and are **not** entered into `usability/data/sus.csv` or `usability/data/performance.csv`.
- The experimental evaluation strictly covers participants **P01 through P07** ($n = 7$).
