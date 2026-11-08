# Usability Evaluation Commit Suggestions

This document tracks safe, atomic, conventional commit suggestions for Task 2 (Usability Evaluation) conforming strictly to course rules.

---

## Step 1: Scope, Test Plan, and Setup (Phase 0 & Phase 1)
```bash
git add .gitignore usability/PROGRESS.md usability/01-test-plan.md
git commit -m "docs(usability): define flow, test plan, and objectives"
```

## Step 2: Task Scenario, Components, and Instruments (Phase 2 & Phase 3)
```bash
git add usability/02-task-scenario.md usability/03-instruments-vi.md usability/data/
git commit -m "docs(usability): write task scenario, components, and instruments"
```

## Step 3: Pilot Session & Calibration (Phase 5)
```bash
git add usability/05-pilot-review.md usability/PROGRESS.md
git commit -m "test(usability): record pilot session and refinements"
```

## Step 4: Individual Participant Sessions (Phase 6 - One Commit per Participant)
```bash
# Session P01
git add usability/sessions/P01/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P01"

# Session P02
git add usability/sessions/P02/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P02"

# Session P03
git add usability/sessions/P03/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P03"

# Session P04
git add usability/sessions/P04/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P04"

# Session P05
git add usability/sessions/P05/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P05"

# Session P06
git add usability/sessions/P06/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P06"

# Session P07
git add usability/sessions/P07/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P07"
```

## Step 5: Data Analysis, Metrics, and Criticality Matrix (Phase 7)
```bash
git add usability/data/findings.csv usability/06-analysis.md usability/PROGRESS.md
git commit -m "docs(usability): score SUS, analyse performance, and rank findings"
```

## Step 6: Usability Bugs & GitHub Issues (Phase 8)
```bash
git add usability/07-bugs/ evidence/usability/
git commit -m "docs(bugs): draft usability bug reports and link issues"
```

## Step 7: Final Consolidated Report & Summary (Phase 9)
```bash
git add usability/08-usability-report.md usability/usability-summary.md README.md
git commit -m "docs(report): assemble final usability evaluation report"
```
