**Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)**

**CS423 / CSC13003 – Software Testing (AI-augmented · 2026)**

**AI POLICY · TEMPLATES — 2026 v1.0**

# **AI Audit Report — 5-section Template per Artifact**

*Mandatory appendix for every AI-assisted homework (HW#01–HW#06, and Seminar).*

*Adapted from Med Kharbach, PhD (2026) — AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0. This adaptation is prepared for FIT@HCMUS – CS423 / CSC13003 Software Testing course.*

## **1. Student Information**

| Field | Value |
| :---- | :---- |
| **Student name (printed):** | Nguyễn Quốc Kỳ |
| **Student ID:** | 23120138 |
| **Class / Cohort:** | CSC13003 |
| **Assignment ID (e.g., HW#00, HW#02):** | HW#03 |
| **Assignment date:** | 02/11/2026 |
| **AI tool(s) used:** | Gemini 3.8 Flash (via Antigravity) |
| **AI tool(s) used:** | [x] Yes  [ ] No |

## **2. Instructions (read before filling)**

* Add one row per AI-generated artifact (test case, script, checklist, OpenAPI spec, JMeter plan, etc.).  
* Paste the verbatim prompt — DO NOT paraphrase.  
* Paste the verbatim AI output (or include a labelled screenshot in the report).  
* Tag the verdict: VALID / INVALID / INCOMPLETE.  
* Reasoning must cite a course slide, ISTQB section, or technical RFC.  
* Show the corrected artifact with the change highlighted.  
* Sample rows are in italic — replace them before submission.

## **3. Audit Table — one row per artifact**

| (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning (ISTQB) | (5) Student Fix |
| :---- | :---- | :---- | :---- | :---- |
| **Artifact #1**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 15:40 02/11/2026<br>**Prompt:** `@[hw03.md] please analyze this assignment and create a detailed implementation plan to complete it.` | Detailed 10-phase implementation plan covering scope modeling, GUI checklist design (>40 items across IA-01 to IA-04), 7 usability sessions with SUS, cross-platform testing, agent skills, and a 25-step git commit cadence. Saved to `PLAN.md`. | VALID | ISTQB FL v4.0 §5.1.1 (Purpose and Content of a Test Plan) & §5.1.2 (Test Planning Activities). The AI accurately mapped syllabus deliverables into a phased, measurable test plan with clear verification gates and risks. | Reviewed plan structure; instructed saving directly into working directory as `PLAN.md`, and proceeded to configure specific project parameters. |
| **Artifact #2**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 16:04 02/11/2026<br>**Prompt:** `Regarding Selected scope: please suggest which ones I should choose for this assignment.` | Codebase analysis of SUT (`Cart.jsx`, `Checkout.jsx`, `ProductDetail.jsx`, `Login.jsx`), analyzing screens against the 4 Interface Aspects (IA-01 to IA-04), and recommendation to choose `Cart + Checkout` (Pool B: FR-07, FR-08, FR-09) and usability flow `Product selection → Add to cart → Apply coupon → Checkout`. | VALID | ISTQB FL v4.0 §4.1 (Overview of Test Design Techniques) & HCMUS Course Slide S13 (GUI & Usability Testing - Low-Level Checklist & Navigation Testing). The chosen screens provide high density of forms (IA-02), feedback banners (IA-04), and multi-step navigation (IA-03) necessary to exceed the 40-item threshold without repetitive checks. | Student requested clarification on Pool vs FR constraints, verified non-duplication within group, and approved updating `GEMINI.md`. |
| **Artifact #3**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 16:28 02/11/2026<br>**Prompt:** `please suggest the anatomy of the main report and bug report.` | Proposed a comprehensive, multi-section architecture for both reports: Main Report (Executive Summary, Task 1 GUI Checklist, Task 2 Usability Evaluation with SUS formulas and criticality ranking, Task 3 Cross-Platform matrix, Task 4 Agent skills) and Bug Report (Master table, IEEE 829 defect sheets, GitHub Issues gallery). | VALID | ISTQB FL v4.0 §5.3.1 (Test Progress and Summary Reporting) & §5.5 (Defect Management / Defect Report Structure). Adheres to formal test reporting standards, establishing clear defect classification (Severity, Priority, Preconditions, Steps to Reproduce) and academic rigor for usability evaluation reporting (Brooke 1996 SUS metrics). | Student reviewed the proposed anatomy and requested scaffolding them as practical Markdown template files for continuous editing across project phases. |
| **Artifact #4**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 16:31 02/11/2026<br>**Prompt:** `let create these files including the generic contents you suggested as templates so that we can fill in throughout all the phases.` | Generated four concrete template deliverables: `report/HW03_Report.md` (Main report template with SUS scoring tables and IA distribution), `report/Bug_Report.md` (IEEE 829 defect sheets and GitHub issues gallery), `report/AI_Critique.md` (guiding prompts and 200-300 word counter), and `README.md` (Self-assessment rubric and test summary metrics). | VALID | ISTQB FL v4.0 §5.1 (Test Management) & HCMUS Course Slide S13 (GUI & Usability Testing Deliverables). Establishing standardized document artifacts upfront ensures end-to-end traceability from requirements to defects, preventing missing submission criteria (§14). | Verified generated file structure and contents; accepted templates as the project's living baseline deliverables. |
| **Artifact #5** | *(Pending generation in Phase 1 / Phase 2)* | | | |
| **Artifact #6** | *(Pending generation in Phase 2)* | | | |
| **Artifact #7** | *(Pending generation in Phase 3)* | | | |
| **Artifact #8** | *(Pending generation in Phase 5)* | | | |
| **Artifact #9** | *(Pending generation in Phase 6)* | | | |
| **Artifact #10** | *(Pending generation in Phase 7)* | | | |

## **4. Summary of AI Accuracy**

Aggregate the verdicts from Section 3 and complete the table below.

| Metric | Count | Percentage |
| :---- | :---- | :---- |
| **Total AI-generated artifacts audited** | 4 | 100% |
| **VALID (correct, accepted as-is)** | 4 | 100% |
| **INVALID (wrong; rejected)** | 0 | 0% |
| **INCOMPLETE (acceptable after edits)** | 0 | 0% |

## **5. Conclusion — When should AI be used (or not)?**

*(In progress — to be finalized at the conclusion of all testing phases as per assignment guidelines).*

## **6. Mandatory Disclosure (paste verbatim)**

*"Implementation plan, scope analysis, and report deliverable templates were initially generated by Gemini 3.8 Flash; I reviewed and validated the proposed phases, requirements, report anatomy, and defect structures, confirmed non-duplication with group members, and approved the creation of GEMINI.md, PLAN.md, HW03_Report.md, Bug_Report.md, AI_Critique.md, and README.md. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category."*

## **Signature**

| Field | Value |
| :---- | :---- |
| **Student name (printed):** | Nguyễn Quốc Kỳ |
| **Student ID:** | 23120138 |
| **Class / Cohort:** | CSC13003 |
| **Course:** | CS423 / CSC13003 – Software Testing |
| **Instructor:** | Dr. Lam Quang Vu / Dr. Tran Duy Hoang |
| **Date:** | 02/11/2026 |
| **Signature:** | Nguyễn Quốc Kỳ |

## **References**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (v4.0).  
* Course Lecture S13: GUI Testing & Usability Testing (FIT@HCMUS, 2026).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
