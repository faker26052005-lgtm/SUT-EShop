# Usability Test Plan: EShop Purchase and Checkout Flow

- **Document Version:** 1.0 (Draft)
- **Author / Moderator:** 23120138 – Nguyễn Quốc Kỳ (`quockinguyen.lv@gmail.com`)
- **System Under Test (SUT):** EShop ([faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))
- **Baseline SUT Commit:** `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`
- **Evaluated Flow:** `Product selection → Add to cart → Apply coupon → Checkout`
- **Methodology:** Moderated Assessment Testing with Concurrent Think-Aloud Protocol

---

## 1. Purpose
The purpose of this usability evaluation is to assess the ease of use, clarity, and efficiency of the core purchasing flow in EShop from a typical end-user perspective. Specifically, the evaluation aims to uncover interface friction, layout ambiguity, feedback deficiencies, and cognitive hurdles when selecting a product, navigating the shopping cart, applying a discount coupon code (`SAVE10`), and confirming the order.

---

## 2. Problem Statements
This evaluation investigates three specific, measurable usability research questions:

1. **Coupon Visibility and Friction:** Can users smoothly locate the promotional coupon input, enter the discount code `SAVE10`, and understand the applied discount without hesitation, false attempts, or external assistance?
2. **Checkout Navigation and Error Recovery:** What interface friction points, unexpected behaviors, or confusing controls lead to user hesitation, input errors, or potential abandonment between reviewing the cart and confirming the order?
3. **User Confidence and Overall Usability:** Does the end-to-end checkout experience instill sufficient transparency, trust, and satisfaction to achieve an above-average System Usability Scale (SUS) score ($\ge 68$ points)?

---

## 3. Test Plan and Objectives
Participants are given a realistic, goal-directed purchase scenario to execute independently on a live instance of EShop. 

### Key Objectives:
- Measure total task duration (Time on Task) against an empirical benchmark ($\le 150$ seconds, calibrated from Phase 5 Pilot review).
- Evaluate unassisted task completion rate across the 7 experimental participants.
- Identify and catalog specific usability friction points and genuine functional defects encountered during execution.
- Measure overall perceived usability via the standard 10-item System Usability Scale (SUS).
- Elicit structured quantitative probe ratings (1–5 scale) and qualitative feedback across four core dimensions: Clarity, Error Recovery, Speed, and Trust.

---

## 4. User Profile and Sampling
To ensure representative and unbiased usability findings, participants must meet specific demographic and behavioral criteria.

### Target Characteristics:
- **Age:** 18–35 years old (university students or young professionals).
- **Online Shopping Frequency:** Active online shoppers who make at least 1–2 online purchases per month on popular Vietnamese e-commerce platforms (e.g., Shopee, TikTok Shop, Lazada, Tiki).
- **Tech Literacy:** General consumer tech literacy (regular smartphone and laptop web browser users).

### Exclusion Criteria:
- **Strictly Excluded:** Students currently enrolled in course CSC13003 (Software Testing) at FIT@HCMUS.
- **Strictly Excluded:** Professional QA engineers, software testers, or developers involved in building or maintaining the SUT.
- **Diversity:** Prefer non-IT or mixed educational backgrounds to avoid developer bias.

### Sample Size & Roster Structure:
- **Total Recruited:** 8 participants (1 Pilot participant + 7 Experimental participants P01–P07).
- Pilot participant data is utilized strictly for validating the scenario wording, verifying state reset procedures, and calibrating the time benchmark. Pilot data is excluded from final statistical scoring.

---

## 5. Method and Test Design
- **Test Type:** Assessment Testing (goal-oriented user scenario on a functional SUT build with quantitative metric collection).
- **Format:** Moderated 1-on-1 sessions conducted in person or via synchronous 1-on-1 video call (Google Meet/Zoom) with active screen and audio recording.
- **Protocol:** Concurrent Think-Aloud (CTA). Participants are encouraged to verbalize their thoughts, intentions, hesitations, and reactions as they perform the task.
- **Standardized Usability Scale:** 10-item System Usability Scale (SUS) administered immediately upon task completion.

---

## 6. Test Environment and Equipment
- **Hardware:** Laptop / PC running modern desktop operating system (Ubuntu Linux / Windows / macOS).
- **Browser:** Google Chrome (latest stable) or Mozilla Firefox (latest stable) in standard desktop viewport ($\ge 1280 \times 800$).
- **SUT Deployment:**
  - Frontend: `http://localhost:3000` (React Web Client)
  - Backend API: `http://localhost:5000` (Node.js/Express)
  - Database: Local SQLite database seeded with valid product catalog and coupon `SAVE10`
- **Recording Equipment:** OBS Studio or Google Meet recording capturing full browser screen, mouse pointer movements, and participant verbal audio (with prior written consent).
- **Testing Space:** Quiet, well-lit room free of background noise and interruptions.

---

## 7. Test Monitor Role and Intervention Protocol
The student acts strictly as a neutral, objective test monitor:

1. **Pre-Session:** Prepares the testing machine, resets browser storage, ensures test buyer account is logged in and cart is empty, seeds coupon code `SAVE10`, and starts the recording.
2. **Instruction:** Greets the participant, obtains signed consent, reads the standardized briefing script, presents the printed/displayed task scenario prompt, and starts the stopwatch.
3. **Observation & Neutrality:**
   - Remains neutral; does not hint, guide, praise, or express agreement/disagreement.
   - If the participant goes silent for $> 15$ seconds, gently prompts: *"What are you thinking right now?"* (*"Bạn đang suy nghĩ điều gì lúc này?"*).
   - If the participant asks how to proceed: *"Please do whatever you think makes the most sense"* (*"Bạn cứ thao tác như cách bạn nghĩ là đúng nhé"*).
4. **Intervention Protocol:**
   - The monitor intervenes **only** when the participant is completely deadlocked for $> 2$ minutes without any forward progress or explicitly gives up.
   - Any monitor intervention automatically flags the outcome as `assisted`.
5. **Post-Task:** Stops the timer upon reaching the order confirmation screen, delivers the 10-item SUS questionnaire, and conducts structured probe questions.

---

## 8. Evaluation Measures

### Quantitative Performance Metrics:
- **Task Completion Outcome:**
  - `success`: Completed independently without monitor hints or intervention.
  - `assisted`: Completed only after required monitor intervention following deadlock.
  - `fail`: Abandoned or uncompleted after repeated errors.
- **Time on Task (seconds):** Measured from the moment the participant starts reading/interacting until the order confirmation page renders.
- **Error Count:** Frequency of erroneous actions (e.g., submitting invalid input, clicking inactive UI elements, navigating to wrong routes, misinterpreting coupon status).
- **Help Requests:** Number of times the participant explicitly asks the moderator for guidance.

### Quantitative Preference Metrics:
- **System Usability Scale (SUS):** 10 standardized Likert-scale questions scored from 1 to 5, normalized to an aggregate score of 0–100 via the canonical formula:
  $$\text{SUS} = 2.5 \times \left[ \sum (Q_{\text{odd}} - 1) + \sum (5 - Q_{\text{even}}) \right]$$
- **Structured Post-Task Probe Ratings (1–5 Likert scale):**
  1. *Clarity Rating:* 1 (Very Ambiguous) to 5 (Very Clear).
  2. *Error Recovery Rating:* 1 (Very Difficult to Recover) to 5 (Very Easy to Recover).
  3. *Speed & Flow Rating:* 1 (Very Slow/Cumbersome) to 5 (Very Fast/Streamlined).
  4. *Trust Rating:* 1 (Very Anxious/Untrustworthy) to 5 (Fully Confident/Trustworthy).

### Qualitative Metrics:
- Timestamped observation notes of behavioral friction (hesitation, confusion, frustration, backtracking).
- Verbatim participant quotes during think-aloud and debriefing.
- In-depth qualitative follow-up answers to the four probe dimensions (reasons behind the 1–5 ratings).

---

## 9. Report Format
The final evaluation deliverable (`usability/08-usability-report.md`) compiles:
- Executive summary with high-level SUS and performance metrics.
- Comprehensive findings table categorized by type (`genuine bug` vs. `usability issue`) and ranked by severity with small-sample Blocker and Major overrides.
- Detailed bug reports with reproduction steps and GitHub issue cross-references.
- Methodological limitations, self-critique, and recommendations for user experience enhancement.
