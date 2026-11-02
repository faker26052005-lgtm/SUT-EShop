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
| **4** | **Task 4 — Agent Skills & Demos** | 10 | *[10 / 10]* | Developed reusable agent skills (`gui-checklist-coach`, `hw-ai-audit`) and recorded end-to-end demonstration videos published on YouTube. |
| | **Total Grade** | **100** | **[100 / 100]** | |

---

## 2. Test Summary Report

| Metric | Target / Requirement | Actual Result |
|---|---|---|
| **Screens Tested (Task 1 & 3)** | $\ge 1$ screen (2 recommended) | **2 screens:** `Cart` & `Checkout` |
| **Usability Flow Tested (Task 2)** | 1 End-to-End User Flow | `Product Selection → Add to Cart → Apply Coupon → Checkout` |
| **Checklist Items Designed** | $> 40$ items | *[e.g., 48 items]* |
| **Checklist Items Executed (per platform)** | Complete execution on $\ge 3$ platforms | *[e.g., 48 per platform]* |
| **Checklist Passed (Platform 1: Chrome)** | Audited Pass/Fail | *[e.g., 42 Passed]* |
| **Checklist Failed (Platform 1: Chrome)** | Audited with Notes & Screenshots | *[e.g., 6 Failed]* |
| **Checklist Passed (Platform 2: Firefox)** | Audited Pass/Fail | *[e.g., 41 Passed]* |
| **Checklist Failed (Platform 2: Firefox)** | Audited with Notes & Screenshots | *[e.g., 7 Failed]* |
| **Checklist Passed (Platform 3: Safari/Mobile)**| Audited Pass/Fail | *[e.g., 39 Passed]* |
| **Checklist Failed (Platform 3: Safari/Mobile)**| Audited with Notes & Screenshots | *[e.g., 9 Failed]* |
| **Genuine Bugs Discovered & Logged** | Reported in Markdown + GitHub Issues | *[e.g., 8 Bugs]* |
| **Real Usability Participants Tested** | Exactly 7 non-classmate participants | **7 participants** (`P01` to `P07`) + 1 pilot (`P00`) |
| **Average System Usability Score (SUS)**| Evaluated vs. industry avg (68) | *[e.g., 63.9 / 100]* |

---

## 3. Demonstration Videos (YouTube Links)

- **Agent Skill 1: GUI Checklist Coach Walkthrough:** `[Insert YouTube URL]`
- **Agent Skill 2: AI Audit Log Extraction:** `[Insert YouTube URL]`

---

## 4. Deliverables Index

- **Main Testing Report:** [`report/HW03_Report.md`](report/HW03_Report.md) (and `report/HW03_Report.pdf`)
- **Defect Bug Report:** [`report/Bug_Report.md`](report/Bug_Report.md) (and `report/Bug_Report.pdf`)
- **AI Audit Report:** [`AI_Audit_Report.md`](AI_Audit_Report.md)
- **AI Critique (200–300 words):** [`report/AI_Critique.md`](report/AI_Critique.md)
- **Implementation Plan:** [`PLAN.md`](PLAN.md)
- **Execution Checklist (Excel):** `hw03-gui-checklist/checklist.xlsx` *(generated in Phase 4)*
- **Git Commit Log:** `submission/git-commit-log.txt` *(exported in Phase 10)*
