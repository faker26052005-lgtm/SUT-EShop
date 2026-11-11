# HW03 – GUI & Usability (Software Testing, CSC13003, FIT@HCMUS)

Individual assignment. I test the EShop web app and mobile app, run a usability evaluation, and build agent skills. You are my assistant: you speed up mechanical work, but the judgement, the Pass/Fail results, and the evidence are mine.

## Project facts

| Item | Value |
|---|---|
| SUT | EShop, a Vietnamese e-commerce demo app: https://github.com/faker26052005-lgtm/SUT-EShop |
| Repo for bug issues and evidence | `https://github.com/faker26052005-lgtm/SUT-EShop` (my own repository, not the course's) |
| Local path of the Git repo | `/home/quocky05/academy/software-testing/seminar/SUT-EShop/` (the workspace root below is this repo) |
| Student ID / full name | `23120138` / `Nguyễn Quốc Kỳ` |
| Student email (identity overlay on cross-platform screenshots) | `quockinguyen.lv@gmail.com` |
| My checklist screens | `Cart, Checkout` (Pool B: FR-07, FR-08, FR-09) |
| My usability flow | `Product selection → Add to cart → Apply coupon → Checkout` |
| Test platforms (at least 3) | `BrowserStack (Chrome , FireFox and Safari)` |
| Audit log skill | `hw-ai-audit` |
| Deadline | 10/11/2026 |

## What is graded (100 points)

1. Task 1, GUI checklist: design, execution, bug report (30)
2. Task 2, usability evaluation: scenario, 7 sessions, analysis (40)
3. Task 3, cross-browser / cross-platform, at least 3 platforms (20)
4. Agent skills, with demo videos (10)

Quality counts as much as completion. The checklist needs **more than 40 items** covering IA-01 General UI standards, IA-02 Forms, IA-03 Navigation, and IA-04 Feedback / state.

## Skills and tools

- For anything about the GUI checklist, use the **gui-checklist-coach** skill and follow its phases and checkpoints. Do not restate or work around its rules here.
- The usability evaluation (SUS or UEQ-S, 7 real participants, sessions) is a separate activity. The checklist skill does not cover it.
- AI usage is logged with my audit log skill. Remind me to run it at the end of each phase. Do not keep a separate log of your own.

## Workspace layout (suggested, adjust to match reality)

The workspace root is the Git repository (remote: the issue repo above).

```
<repo root>/
├── GEMINI.md
├── README.md                    # self-assessment table + test summary (submitted)
├── .gitignore
├── screen-maps/                 # screen-to-requirement maps, one per SUT
├── screen-context/              # per-screen descriptions; reference screenshots in images/
├── <week>-gui-checklist/        # Task 1 working files, created by the skill
│   ├── PROGRESS.md              # current phase, decisions, rejected items: READ THIS FIRST
│   ├── checklist.xlsx / .md
│   ├── test-summary.md
│   ├── commit-suggestions.md
│   └── bug-drafts/
├── evidence/
│   ├── screenshots/             # Failed-item screenshots: FAILED_<ID>_<platform>.png
│   └── cross-platform/          # Task 3 screenshots with the identity overlay
├── usability/                   # Task 2: scenario, notes, SUS/UEQ-S, findings, participants
├── report/                      # main report, AI critique (Markdown + PDF)
├── skills/                      # my agent skills (graded deliverable)
└── submission/                  # staging for the zip and git-commit-log.txt (gitignored)
```

Keep a clone of the SUT outside this repo (a sibling folder) and never modify it. Do not nest it inside the workspace.

## Start of every session

1. Read `PROGRESS.md` and resume at the recorded phase. Do not start over.
2. Before analysing a screen, check `./screen-context/` and `./screen-maps/`. Reuse what exists and ask only for what is missing or out of date.
3. Run `git status` and tell me about uncommitted work before starting something new.
4. Never overwrite an existing file without telling me. Show what will change.

## Integrity rules (never break these)

- **Never mark a checklist item Passed or Failed.** Only I do that, after observing the SUT.
- **Never create, edit, or suggest fabricating** screenshots, execution results, participant details, session notes, or SUS/UEQ-S responses. The TAs verify these, and impersonation or fabrication scores zero.
- **Never write my reasoning for me:** the "why the AI missed it" explanations and the 200 to 300 word AI critique are mine. You may help me structure them or point out things worth considering.
- Build prompts and items from my own screens and words. Copying between students, including prompts, scores zero for both of us.
- Raw AI output is not a deliverable. Anything you produce is a draft for my review.
- Reference screenshots in `./screen-context/` are inputs, not evidence. Only Failed-item screenshots are submitted.

## Conventions

- **Item ID:** `<SCREEN>-<IA>-<NN>`, for example `CART-IA02-03`.
- **Results:** only Passed or Failed. Untestable or not-applicable items get rewritten or replaced, not marked N/A.
- **Severity:** Blocker, Major, Minor, Cosmetic. It is separate from Pass/Fail and goes in the bug report.
- **Bug title:** `[<Screen>] <short, specific title>`. Labels: `bug`, a severity label, the IA tag, and a platform label.
- **Output language:** English for deliverables. Reply in the language I write in.

## Git

The assignment asks for one commit per step of the testing procedure and a Git commit log as a text file. The log is graded as proof of how I worked, so it must show the real timeline.

- **Branch:** work  on `QuocKy-HW03`. This is an individual assignment, so no pull requests.
- **Identity:** commits use my real name and student email (`git config user.name` and `user.email`). Check this before the first commit.
- **Format:** `<type>(<scope>): <summary>`. Imperative mood, lowercase, no trailing period, 72 characters or fewer. Add a short body only when the why is not obvious.
- **Types:** `docs` for checklists, reports, and drafts; `test` for executing tests and recording sessions or results; `feat` for changes to my agent skills; `fix` for corrections; `chore` for housekeeping.
- **Scopes:** `checklist`, `usability`, `bugs`, `evidence`, `summary`, `report`, `skill`.
- **One step per commit.** Do not mix evidence, checklist edits, and report changes in one commit. Never use messages like `update` or `wip`.
- **Usability sessions:** one commit per session, for example `test(usability): record session P03`. Refer to participants by code (P01 to P07) in commit messages, never by name or phone number.

Typical sequence (the checklist skill writes the exact messages into `commit-suggestions.md`):

| Step | Example message |
|---|---|
| Scope and mapping | `docs(checklist): scope screens and map FR/IA` |
| Initial AI checklist | `docs(checklist): generate initial checklist for cart` |
| Review and gap analysis | `docs(checklist): review items and add human items` |
| Execution per platform | `test(checklist): execute checklist on firefox` |
| Evidence screenshots | `docs(evidence): add failed-item screenshots` |
| Issues filed | `docs(bugs): file github issues and record numbers` |
| Usability planning | `docs(usability): add scenario, instruments, and pilot notes` |
| Each session | `test(usability): record session P01` |
| Usability analysis | `docs(usability): score SUS and rank findings by severity` |
| Report and summary | `docs(report): compile main report and test summary` |

**What goes in the repo:** checklists, drafts, Failed-item screenshots, cross-platform screenshots, reports, skills, and usability notes. **What stays out** (put these in `.gitignore`): tokens and `.env` files, `submission/`, large screen recordings (keep them elsewhere and link to them), and `usability/participants.md`. Participant contact details live only in that gitignored file and in the submitted zip, never in commit messages, issues, or screenshots, because the issue repo may be public.

**Rules for the history:**
- Never amend, squash, rebase, or backdate commits to tidy the timeline. The log should show what really happened.
- Propose each commit as the message plus the files to stage (`git status` and `git diff --stat`), and wait for my approval.
- Push only when I ask, or when screenshots must be pushed so embedded issue images work.

**Exporting the log for submission:**

```
git log --reverse --date=iso --pretty=format:"%h | %ad | %an | %s" > submission/git-commit-log.txt
```

## Actions that need my approval first

- Creating GitHub Issues (follow the pilot, dry-run, batch flow in the skill's Phase 7)
- Committing or pushing anything
- Creating new labels in the issue repository
- Deleting or overwriting files

Do not use force pushes, history rewrites, or other destructive git commands. Never commit secrets or tokens. If the issue repository is public, check screenshots for personal information before pushing.

## Submission checklist

File name: `<StudentID>_HW03_AI_GUIUsability_<SelfAssessedGrade>.zip` (grade is 3 digits, 000 to 100). Missing any required item scores 0, so check this list before packaging:

- [ ] Main report (Markdown + PDF) with the GUI checklist report and the usability evaluation report
- [ ] Bug report with screenshots of the bugs on the GitHub Issues page
- [ ] AI critique and AI audit report (Markdown + PDF)
- [ ] Git commit log (text file)
- [ ] Excel checklist (more than 40 items) and the test summary
- [ ] Usability evidence: task scenario, observation notes, SUS/UEQ-S responses, severity-ranked findings, recordings if available, and the table of 7 participants (name plus Zalo or phone with the middle four digits masked)
- [ ] Cross-browser / cross-platform screenshots, each showing the browser/OS/device, the localhost URL, and my identity overlay (confirm the exact form with the TA: student email, or student ID and full name)
- [ ] README.md with the self-assessment table and the test summary (screens/flows tested; items designed, executed, passed, failed; bugs; participants; demo videos)
- [ ] Agent skills and demo video links (YouTube)
- [ ] AI declaration: either "I do not use any AI help in this exercise" or "I use AI tools for the following tasks" with the log

If I am invited to the oral defense (30% chance, 5 to 7 minutes), I must be able to explain every choice, so keep rejected items and their reasons recorded in `PROGRESS.md`.
