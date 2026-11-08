# HW03 Usability Evaluation Progress Tracker

## Session & Project Overview
- **Student:** 23120138 – Nguyễn Quốc Kỳ (`quockinguyen.lv@gmail.com`)
- **SUT:** EShop ([SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))
- **SUT Baseline Commit:** `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa` (2026-11-07)
- **Evaluated Flow:** `Product selection → Add to cart → Apply coupon → Checkout`
- **Functional Requirements Covered:** FR-05, FR-06 (Product), FR-07 (Cart), FR-09 (Coupon), FR-08 (Checkout)
- **Starting Machine State:**
  - User: Logged in with a test buyer account
  - Initial Cart: Empty
  - Test Coupon Code: `SAVE10` (valid 10% discount)
- **Participant Count Rule:** Default Plan — 8 participants total (1 Pilot participant for scenario calibration + 7 experimental participants P01–P07). Pilot data is strictly excluded from final statistical SUS scoring.
- **Privacy Protection:** `usability/participants.md` is strictly gitignored.
- **Audit Tool:** `hw-ai-audit`

---

## Phase Tracking

| Phase | Description | Status | Gate / Checkpoint Notes |
|---|---|---|---|
| Phase 0: Scope & Setup | Confirm flow, SUT environment, participant rules, and gitignore | **PASSED** | Checkpoint 0 passed: Flow confirmed, SUT commit `35b8c5a` pinned, starting state (logged in, empty cart, `SAVE10`) agreed, Default 8-participant rule selected, `.gitignore` verified. |
| Phase 1: Test Plan & Objectives | Author formal 9-section Usability Test Plan (`01-test-plan.md`) | **PASSED** | Checkpoint 1 passed: Complete 9 sections in English, explicit problem statements linked to measurable metrics, concrete user profile and exclusions. |
| Phase 2: Task Scenario & Components | Goal-oriented scenario, task components table, reset steps (`02-task-scenario.md`) | **PASSED** | Checkpoint 2 passed: Scenario passes all lint checks (no UI labels/hints), 4 task components defined, empirical data used (`SAVE10`), state reset procedure defined. |
| Phase 3: Participant Instruments (VI) | Vietnamese consent form, moderator script, SUS questionnaire, probes (`03-instruments-vi.md`) | **PASSED** | Checkpoint 3 passed: Natural Vietnamese consent form, think-aloud moderator script, 10-item standard SUS questionnaire, and 4-dimension probe questions table complete. |
| Phase 4: Participants & Logistics | Masked participant roster schema (`participants.md` - gitignored) | **PASSED** | Checkpoint 4 passed: 8 participants (1 Pilot + 7 P01–P07) confirmed, contact masked (4 middle digits), enrolled_in_hw03 = no verified, consent recorded, .gitignore active. |
| Phase 5: Pilot Session | Pilot execution, scenario validation, timing calibration (`05-pilot-review.md`) | **PASSED** | Checkpoint 5 passed: Pilot session completed in 142s, scenario validated, SUT & reset verified, benchmark calibrated to <= 150s, 05-pilot-review.md compiled. |
| Phase 6: Session Execution (P01–P07) | Moderated sessions, raw notes, `sus.csv`, `performance.csv` (1 commit/session) | **IN_PROGRESS** | Conducting 7 moderated think-aloud sessions, recording raw observation logs, SUS ratings, and performance times. |
| Phase 7: Data Analysis & Synthesis | Automated SUS/performance scoring, qualitative themes, criticality matrix (`06-analysis.md`) | PENDING | Pending Checkpoint 6 sign-off. |
| Phase 8: Usability Bugs & GitHub Issues | File genuine usability defects on GitHub repository (`07-bugs/`) | PENDING | Pending Checkpoint 7 sign-off. |
| Phase 9: Final Report & Summary | Consolidated report (`08-usability-report.md`), summary, commit suggestions | PENDING | Pending Checkpoint 8 sign-off. |

---

## Checkpoint 0 Gate Review (Phase 0: Scope & Setup)
- [x] Single end-to-end flow confirmed: `Product selection → Add to cart → Apply coupon → Checkout`.
- [x] Functional requirements mapped: FR-05/06 (Product), FR-07 (Cart), FR-09 (Coupon), FR-08 (Checkout).
- [x] Starting machine state specified: Test user logged in, cart empty, valid coupon `SAVE10` ready.
- [x] SUT baseline commit pinned: `35b8c5a`.
- [x] Participant recruitment rule: Default Plan (1 Pilot + 7 Participants P01–P07).
- [x] Privacy rule verified: `usability/participants.md` matches `.gitignore`.

---

## Checkpoint 4 Gate Review (Phase 4: Participants & Logistics)
- [x] Roster populated with exactly 8 distinct participants: 1 Pilot (`PILOT`) + 7 experimental (`P01`–`P07`).
- [x] Contact details format verified: Middle 4 digits masked with `xxxx` (e.g., `078xxxx135`).
- [x] Course anti-cheat exclusion verified: `enrolled_in_hw03` = `no` for 100% of rows.
- [x] Informed consent recorded: `consent_recorded` = `yes` for 100% of rows.
- [x] Gitignore verification: `git check-ignore` confirms `usability/participants.md` is strictly ignored and untracked.

---

## Checkpoint 5 Gate Review (Phase 5: Pilot Session)
- [x] Pilot session completed with `PILOT` (Nguyễn Thị Ngọc Linh) in 142 seconds without moderator intervention (`success`).
- [x] Scenario comprehension confirmed: Participant understood intent and price condition ($\ge 300,000$ ₫) without clarification questions.
- [x] SUT stability and state reset procedure verified: Zero technical crashes; cart localStorage cleanup and SQL order/coupon reset functioned properly.
- [x] Time benchmark calibrated: Formally adjusted from $\le 180$s down to $\le 150$s for P01–P07.
- [x] Pilot review report documented: Compiled in `usability/05-pilot-review.md`.
- [x] Data boundary enforced: Pilot metrics excluded from final statistical CSVs per Default Plan.


