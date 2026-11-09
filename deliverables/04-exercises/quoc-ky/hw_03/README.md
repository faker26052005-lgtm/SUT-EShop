# HW03 – GUI & Usability Testing (Software Testing, CSC13003)

**Student Name:** Nguyễn Quốc Kỳ  
**Student ID:** 23120138  
**Class / Cohort:** CSC13003 – FIT @ HCMUS  
**Student Email:** `quockinguyen.lv@gmail.com`  
**SUT Repository:** [faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop)  
**Branch:** `QuocKy-HW03`  

---

## 1. Self-Assessment Table

| No. | Criteria | Max Grade | Self-Assessed Grade | Justification & Verification Link |
|---|---|---|---|---|
| **1** | **Task 1 — GUI Checklist**<br>(Design + Execution + Bug Report) | 30 | *[30 / 30]* | Designed >40 items covering IA-01 to IA-04; reviewed AI drafts; added human items with explicit rationale; executed against SUT; filed detailed GitHub issues with screenshots. See [HW03_Report.md](report/HW03_Report.md) & [Bug_Report.md](report/Bug_Report.md). |
| **2** | **Task 2 — Usability Evaluation**<br>(Task Scenario + 7 Sessions + Analysis) | 40 | *[40 / 40]* | Conducted 1 pilot + 7 moderated Think-Aloud sessions with real participants outside class; scored SUS according to standard Brooke formula; ranked findings via Criticality matrix ($S \times P$); reported bugs. |
| **3** | **Task 3 — Cross-Browser / Cross-Platform**<br>(≥ 3 Platforms) | 20 | *[20 / 20]* | Executed checklist across 3 platforms (Chrome, Firefox, Safari/Expo Go mobile); captured empirical screenshots featuring mandatory student email/ID overlay and localhost URL. |
| **4** | **Task 4 — Agent Skills & Demos** | 10 | *[10 / 10]* | Developed reusable agent skills (`gui-checklist-coach`, `usability-evaluation-coach`) and recorded end-to-end demonstration videos published on YouTube. |
| | **Total Grade** | **100** | **[100 / 100]** | |

---

## 2. Test Summary Report

| Metric | Target / Requirement | Actual Result |
|---|---|---|
| **Screens Tested (Task 1 & 3)** | $\ge 1$ screen (2 recommended) | **2 screens:** `Cart` & `Checkout` |
| **Usability Flow Tested (Task 2)** | 1 End-to-End User Flow | `Product Selection → Add to Cart → Apply Coupon → Checkout` |
| **Checklist Items Designed** | $> 40$ items | **73 items** (70 AI + 3 Human items across IA-01..IA-04) |
| **Checklist Items Executed (per platform)** | Complete execution on $\ge 3$ platforms | **73 per platform** (100% executed on Chrome, Firefox, Safari) |
| **Checklist Passed (Platform 1: Chrome)** | Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 1: Chrome)** | Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Checklist Passed (Platform 2: Firefox)** | Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 2: Firefox)** | Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Checklist Passed (Platform 3: Safari/Mobile)**| Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 3: Safari/Mobile)**| Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Genuine Bugs Discovered & Logged** | Reported in Markdown + GitHub Issues | **24 Bugs** (22 GUI Bugs #117–#138 + 2 Usability Bugs #159, #160) |
| **Real Usability Participants Tested** | Exactly 7 non-classmate participants | **7 participants** (`P01` to `P07`) + 1 pilot (`PILOT`) |
| **Average System Usability Score (SUS)**| Evaluated vs. industry avg (68) | **76.79 / 100** (Median: 77.50; +8.79 vs. industry avg ~68.0) |

---

## 3. Demonstration Videos (YouTube Links)

- **Agent Skills Demonstration (`gui-checklist-coach` & `usability-evaluation-coach`):** [https://www.youtube.com/watch?v=hHmWuolx5Dk](https://www.youtube.com/watch?v=hHmWuolx5Dk)  
  *(Comprehensive walkthrough of both agent skills: GUI checklist 7-phase execution, Pilot & Batch GitHub automation, think-aloud usability evaluation, and automated SUS/Criticality computation).*

---

## 4. Deliverables Index

- **Main Testing Report:** [`report/HW03_Report.md`](report/HW03_Report.md) (and `report/HW03_Report.pdf`)
- **Defect Bug Report:** [`report/Bug_Report.md`](report/Bug_Report.md) (and `report/Bug_Report.pdf`)
- **AI Audit Report:** [`AI_Audit_Report.md`](AI_Audit_Report.md)
- **AI Critique (200–300 words):** [`report/AI_Critique.md`](report/AI_Critique.md)
- **Implementation Plan:** [`PLAN.md`](PLAN.md)
- **Execution Checklist (Excel):** `hw03-gui-checklist/checklist.xlsx` *(generated in Phase 4)*
- **Git Commit Log:** `submission/git-commit-log.txt` *(exported in Phase 10)*
