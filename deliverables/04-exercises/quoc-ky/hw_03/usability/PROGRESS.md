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
| Phase 6: Session Execution (P01–P07) | Moderated sessions, raw notes, `sus.csv`, `performance.csv` (1 commit/session) | **PASSED** | Checkpoint 6 passed: All 7 moderated sessions executed, standardized into `usability/sessions/<Pxx>/notes.md`, raw data ingested into `sus.csv` & `performance.csv`, 7 atomic Git commits recorded. |
| Phase 7: Data Analysis & Synthesis | Automated SUS/performance scoring, qualitative themes, criticality matrix (`06-analysis.md`) | **PASSED** | Checkpoint 7 passed: Automated `score_usability.py` run on benchmark 150s, 5 findings cataloged in `findings.csv`, qualitative themes synthesized with participant citations, criticality matrix computed with Major Override for F-01. |
| Phase 8: Usability Bugs & GitHub Issues | File genuine usability defects on GitHub repository (`07-bugs/`) | **PASSED** | Checkpoint 8 passed: 2 genuine usability bugs filed as GitHub issues (#159, #160) on faker26052005-lgtm/SUT-EShop with commit-pinned evidence images (e289d73), drafts and findings.csv synchronized. |
| Phase 9: Final Report & Summary | Consolidated report (`08-usability-report.md`), summary, commit suggestions | **IN_PROGRESS** | Compiling final consolidated report in English, updating usability-summary.md for root README.md. |

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

---

## Checkpoint 6 Gate Review (Phase 6: Session Execution)
- [x] All 7 participant sessions executed and structured into `usability/sessions/<Pxx>/notes.md` (P01 through P07).
- [x] 100% of rows appended to `usability/data/sus.csv` (7 rows, Q1–Q10 Likert responses).
- [x] 100% of rows appended to `usability/data/performance.csv` (7 rows, time, outcome, error_count, help_requests).
- [x] Strict atomic Git timeline: 7 independent commits created (`test(usability): record session P01` through `P07`).
- [x] Qualitative observation logs include timestamps, think-aloud reactions, and 4-dimension probe answers for each participant.

---

## Checkpoint 7 Gate Review (Phase 7: Data Analysis & Synthesis)
- [x] Automated scoring script `score_usability.py` executed successfully with calibrated benchmark 150s.
- [x] SUS statistics verified: Mean $\bar{x} = 76.79$, Median = 77.50, $s = 18.64$, Range: $42.5 - 100.0$.
- [x] Performance metrics verified: 100% completion rate (85.7% unassisted, 14.3% assisted), 71.4% within benchmark, mean duration 140.9s, average errors 1.29.
- [x] Quantitative probe dimensions computed: Speed (4.43) and Trust (4.43) rated highest; Error Recovery (3.29) identified as primary friction.
- [x] Qualitative themes synthesized: 5 findings identified and every synthesis statement cites participant IDs in brackets (`[P01]`, `[P05]`, etc.).
- [x] Criticality matrix populated in `usability/data/findings.csv` and adjusted with Major Override rule (F-01 elevated to *Fix First (Major Override)*).
- [x] Consolidated analysis authored in `usability/06-analysis.md`.

---

## Checkpoint 8 Gate Review (Phase 8: Usability Bugs & GitHub Issues)
- [x] Screenshot evidence committed and pushed to remote branch (`e289d73`).
- [x] Repository label `usability` created with color `#5319e7`.
- [x] Genuine defect F-01 filed as GitHub Issue [#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159) with `severity:Major`, `usability`, `platform:Chrome`.
- [x] Genuine defect F-02 filed as GitHub Issue [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160) with `severity:Minor`, `usability`, `platform:Chrome`.
- [x] Issue numbers and permanent URLs synchronized into `usability/07-bugs/F-01.md`, `usability/07-bugs/F-02.md`, and `usability/data/findings.csv`.





