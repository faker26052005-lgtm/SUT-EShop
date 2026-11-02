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
| **Artifact #5**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 16:53 02/11/2026<br>**Prompt:** `@[proposed-gui-testing-checklist-generation-skill.md] @[hw03.md] @[gui-and-usability-testing-knowledge.md] I created a complete skill for generating the gui testing checklist following the hw3 requirements and the knowledge my lecturer provided. First of all, review this skill and list all the points or mistakes based on the documents and requirements if they exists, so that I can review before moving on to the skill creation phase.` | Critical review of the proposed skill identifying 5 key issues: environment path hallucination (`/mnt/user-data/outputs/`), missing xlsx dependency, Git commit sequence inversion and missing per-platform execution steps, theoretical conflation of "business logic" vs UI-driven functional validation (EP/BVA), and Task 3 cross-platform matrix deliverable gap. | VALID | ISTQB FL v4.0 §3.2 (Static Testing / Review Process) & Course Lecture S13 §1.3 (GUI Testing Process), §1.4 (Common GUI Bugs), §1.5 (Application-Level GUI Testing). Static review of test design procedures ensures conformance to requirement standards before execution. | Reviewed identified gaps, instructed the AI to formulate specific text updates, and approved the refinements. |
| **Artifact #6**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 17:10 02/11/2026<br>**Prompt:** `Apply all the updates to the skill file and create a local skill named as gui-checklist-coach in the current working directory.` | Applied all updates to `proposed-gui-testing-checklist-generation-skill.md`, generated formal skill package `skills/gui-checklist-coach/SKILL.md`, created multi-platform openpyxl generator `skills/gui-checklist-coach/scripts/generate_checklist_excel.py`, and established symlink `.agents/skills/gui-checklist-coach` for local discovery. | VALID | ISTQB FL v4.0 §5.1 (Test Management) & HW03 §7 (Agent Skills). Establishing a reusable, deterministic agent skill with integrated data validation and summary reconciliation ensures repeatable GUI checklist generation and execution. | Validated directory structure and file contents, approved git commit `feat(skill): implement gui-checklist-coach skill`. |
| **Artifact #7**<br><br>**Tool:** Gemini 3.8 Flash (Antigravity)<br>**Time:** 17:24 02/11/2026<br>**Prompt:** `oke create the script for github issue operations.` | Standalone Python automation script `skills/gui-checklist-coach/scripts/create_github_issues.py` supporting dry-run, pilot issue validation, batch creation with rate-limiting, and automatic write-back to `checklist.md` and bug drafts. Updated `SKILL.md` to reference the script. | VALID | ISTQB FL v4.0 §5.5 (Defect Management Process & Defect Logging Tools) & Course Lecture S13 §1.7 (GUI Automation Tooling). Automating defect submission with dry-run and pilot verification prevents duplicate issues and enforces defect report schema consistency. | Tested script CLI arguments (`--help`), validated token loading security via gitignored `.env`, and approved git commit `feat(skill): add github issue automation script`. |
| **Artifact #8** | *(Pending generation in Phase 1 / Phase 2)* | | | |
| **Artifact #9** | *(Pending generation in Phase 3 / Phase 5)* | | | |
| **Artifact #10** | *(Pending generation in Phase 6 / Phase 7)* | | | |

## **4. Summary of AI Accuracy**

Aggregate the verdicts from Section 3 and complete the table below.

| Metric | Count | Percentage |
| :---- | :---- | :---- |
| **Total AI-generated artifacts audited** | 7 | 100% |
| **VALID (correct, accepted as-is)** | 7 | 100% |
| **INVALID (wrong; rejected)** | 0 | 0% |
| **INCOMPLETE (acceptable after edits)** | 0 | 0% |

## **5. Conclusion — When should AI be used (or not)?**

*(In progress — to be finalized at the conclusion of all testing phases as per assignment guidelines).*

## **6. Mandatory Disclosure (paste verbatim)**

*"Implementation plan, scope analysis, report deliverable templates, GUI checklist generation skill (gui-checklist-coach), and automation scripts (generate_checklist_excel.py, create_github_issues.py) were initially drafted and refined with Gemini 3.8 Flash; I reviewed and validated all proposed phases, requirements, report anatomy, defect structures, and script code, confirmed non-duplication with group members, and approved git commits. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category."*

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
