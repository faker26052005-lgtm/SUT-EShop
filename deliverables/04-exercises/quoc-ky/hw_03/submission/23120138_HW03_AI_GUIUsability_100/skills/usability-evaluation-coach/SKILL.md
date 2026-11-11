---
name: usability-evaluation-coach
description: Guides a student through planning, running, and analysing a moderated usability evaluation (task scenario, SUS or UEQ-S, probe questions, 7 real participants plus a pilot, severity-ranked findings, GitHub Issues for genuine bugs) for one end-to-end flow of a system under test such as EShop. Produces the test plan, task scenario with task components, Vietnamese participant instruments, session notes, SUS and performance statistics, a criticality-ranked findings table, bug drafts, an English usability report, and Git commit suggestions. Use this skill whenever the user mentions usability testing, usability evaluation, HW03 Task 2, task scenario, SUS, UEQ-S, think-aloud, participants or "người tham gia", probe questions, severity ranking, or running sessions on a flow such as Product selection → Add to cart → Apply coupon → Checkout, even if they do not say "skill". Do NOT use it for the GUI checklist (that is gui-checklist-coach) or for cross-browser test runs.
---

# Usability Evaluation Coach

A disciplined workflow for a small-sample, moderated usability evaluation that the student plans, conducts with real people, and analyses themselves, with the AI acting as a structured assistant. The course (Software Testing, CSC13003, HW03 Task 2) grades the design quality, the authenticity of the sessions, and the student's independent analysis (worth 40 of 100 points). The TA may phone two participants to verify attendance. This skill accelerates mechanical drafting, data scoring, and report templating while keeping human judgment, observations, and decisions strictly with the student.

## Why the workflow is staged

A single prompt such as "do a usability test of this app" produces generic output, fabricates results, and violates the course's AI-First learning objectives. Work sequentially through the phases below, halt at each checkpoint, and wait for student review and approval before proceeding. AI usage logging is handled by the `hw-ai-audit` skill; remind the student to log interactions at each checkpoint.

## Configuration (Defaults for HW03)

| Setting | Default | Note |
|---|---|---|
| SUT | EShop (`https://github.com/faker26052005-lgtm/SUT-EShop`) | Local clone outside working repo |
| Flow | `Product selection → Add to cart → Apply coupon → Checkout` | Covers FR-05, FR-06, FR-07, FR-09, FR-08. Confirm against running app. |
| Test type | **Assessment testing** | Defined tasks, working SUT, little moderator intervention, quantitative metrics. |
| Participants | **7 real participants** for sessions + **1 pilot participant** (8 people total). | Outside this class, not enrolled in HW03. Non-IT preferred. |
| Usability scale | **SUS (System Usability Scale)** by default. | UEQ-S or custom scale allowed only with written justification in the test plan. |
| Probe dimensions | Minimum 4: **Clarity, Error recovery, Speed, Trust**. | Open-ended post-task follow-ups. |
| Environment | Moderated, 1 participant per session, student as moderator | In-person or stable video call, screen/audio recording with consent. |
| **Output language** | **English for all deliverables & bug reports; Vietnamese for participant-facing instruments.** | Reply to the student in the language they use in conversation. |
| Working directory | `./usability/` (within the project repository root). | Aligns strictly with `GEMINI.md`. |
| Privacy rule | `usability/participants.md` must be **gitignored**. | Never commit unmasked names/contacts or push them to GitHub. |

## Division of Labour (Integrity Boundaries)

| The AI does (Draft & Automate) | The student does (Never the AI) |
|---|---|
| Draft test plan, task scenario, instruments, scripts | Select flow, finalize objectives, refine scenario |
| Check formatting, completeness, and lint scenario rules | Screen, recruit, and schedule 7 real participants + 1 pilot |
| Structure student's raw notes into formatted markdown | Moderate every session, observe, record timestamps & friction |
| Compute SUS, performance metrics, and criticality with script | Enter exact response scores, times, error counts, and quotes |
| Suggest groupings, root causes, and initial bug drafts | Decide final severity, root causes, and recommendations |
| Draft GitHub issue descriptions and format images | Review, approve, and authorize every GitHub issue creation |
| Suggest compliant Git commit messages and commands | Execute Git commits, inspect `.gitignore`, write AI critique |

> [!CAUTION]
> **Anti-AI-Cheat Hard Rules:**
> - **NEVER** fabricate, simulate, or "fill in" participant names, contact details, session notes, SUS ratings, task times, error counts, quotes, or screenshots.
> - The TA randomly calls 2 participants to verify identity. Impersonation or fabrication results in **0 points for Task 2**.
> - If data or sessions are missing, pause and ask the student to provide them.

## Workspace Layout

All working files reside in `./usability/` under the repository root:

```text
<repo root>/
├── usability/
│   ├── PROGRESS.md              # Current phase, decisions, overrides (read first when resuming)
│   ├── 01-test-plan.md          # Formal 9-section Usability Test Plan (English)
│   ├── 02-task-scenario.md      # Goal-oriented scenario, task components, reset steps (English/Bilingual)
│   ├── 03-instruments-vi.md     # Participant-facing Vietnamese forms: Consent, Script, SUS, Probes
│   ├── participants.md          # Masked participant table (GITIGNORED - never commit)
│   ├── 05-pilot-review.md       # Pilot session log, benchmark adjustments, scenario fixes
│   ├── sessions/
│   │   ├── P01/ … P07/          # notes.md (+ local screen recording reference)
│   ├── data/
│   │   ├── sus.csv              # Raw SUS responses (participant,q1..q10)
│   │   ├── performance.csv      # Raw performance (participant,time_seconds,outcome,error_count,help_requests)
│   │   └── findings.csv         # Ranked findings (id,title,type,severity,affected_participants)
│   ├── 06-analysis.md           # Quantitative summary, qualitative themes, criticality matrix (English)
│   ├── 07-bugs/                 # Markdown draft per genuine usability bug (English)
│   ├── 08-usability-report.md   # Final consolidated Task 2 report for submission (English)
│   ├── usability-summary.md     # Executive summary table for root README.md
│   └── commit-suggestions.md    # Explicit, safe Git commands per step
└── skills/usability-evaluation-coach/
    ├── SKILL.md
    └── scripts/score_usability.py
```

---

## Phase 0: Scope and Setup

**Goal:** Confirm the flow, SUT environment, and baseline rules.

1. Confirm the single end-to-end flow with the student. Verify that within their student group, no other peer uses this identical flow.
2. Verify functional requirements touched (e.g., FR-05/06 Product, FR-07 Cart, FR-09 Coupon, FR-08 Checkout).
3. Confirm starting machine state: Guest vs. Logged-in user, initial cart state, valid coupon code.
4. Record the exact SUT version (Git commit hash or date) in `PROGRESS.md`. Every session must run on this exact build.
5. **Participant Count Rule:**
   - *Default Plan:* 8 participants recruited (1 pilot participant + 7 experimental participants P01–P07). Pilot data is strictly used for scenario calibration and excluded from final statistical scoring.
   - *Contingency Plan:* If only 7 participants can be recruited, the pilot session may count as P01 only if the pilot reveals no scenario/environment flaws and requires zero modifications. If modifications occur, a replacement 7th participant must be recruited. Record the agreed rule in `PROGRESS.md`.
6. Confirm that `usability/participants.md` is present in `.gitignore`.

**Checkpoint 0 passes when** flow, SUT commit, participant rule, and `.gitignore` status are documented in `PROGRESS.md`.

---

## Phase 1: Test Plan and Objectives

**Goal:** Author the formal 9-section Usability Test Plan (`01-test-plan.md`) in English.

Structure according to the course standard:
1. **Purpose:** Broad purpose of the evaluation.
2. **Problem Statement:** 2–3 specific, measurable questions (e.g., *"Can users identify and apply a coupon before payment without hesitation?"*, *"What friction points cause checkout abandonment?"*).
3. **Test Plan and Objectives:** Key user tasks and target flows.
4. **User Profile:** Specific target user characteristics (age, online shopping frequency, tech literacy, exclusion criteria).
5. **Method and Test Design:** Assessment testing, moderated think-aloud, 1-on-1, SUS scale.
6. **Test Environment and Equipment:** Quiet room/call setup, browser, screen recording software, local SUT server URL.
7. **Test Monitor Role:** Neutral observer, minimal intervention, scripted assistance protocol.
8. **Evaluation Measures:** Performance metrics (time on task, completion rate, error counts, help requests) and preference metrics (SUS scores, probe feedback).
9. **Report Format:** Outline of final deliverables.

**Checkpoint 1 passes when** all 9 sections are complete in English, problem statements connect directly to measurable metrics, and the user profile is concrete.

---

## Phase 2: Task Scenario and Task Components

**Goal:** Create a realistic, goal-oriented scenario free of procedural hints (`02-task-scenario.md`).

1. **Scenario Definition:** Provide a realistic shopping context and goal (e.g., *"You want to buy a lightweight backpack under 500,000 ₫ for an upcoming weekend trip. You have received a promotional code 'SUMMER2026' from the store. Find an item that fits your needs, apply the coupon, and complete the order"*).
2. **Task Components Table:**
   - **Task:** Clear user goal in non-technical terms.
   - **Machine State:** SUT running, database seeded with test products and valid coupon, cart empty, user logged in or guest as planned.
   - **Successful Completion Criteria:** Observable, binary condition (e.g., *"Order confirmation page displays with order ID and discounted total"*).
   - **Benchmark:** Target duration (e.g., $\le 180$ seconds) based on pilot timing, internal team baseline, or competitor comparison.
3. **Mapping Table:** Map `Problem Statement` $\rightarrow$ `Performance Data` $\rightarrow$ `Preference Data` $\rightarrow$ `Task`.
4. **Scenario Lint Checklist:**
   - [ ] No UI labels or control names (no "click Add to Cart", "open Cart drawer", "press Apply coupon").
   - [ ] No step-by-step navigation instructions.
   - [ ] No technical jargon unfamiliar to non-technical users.
   - [ ] Clear completion criteria and verifiable goal.
5. **State Reset Procedure:** Detail step-by-step actions to reset the SUT between sessions (clear session storage/cart, verify coupon usage quota hasn't expired, restore inventory if stock decreased).

**Checkpoint 2 passes when** scenario passes lint, all 4 task components have explicit values, and the reset procedure is defined.

---

## Phase 3: Participant-Facing Instruments (Vietnamese)

**Goal:** Generate ready-to-use Vietnamese instruments for the room/call (`03-instruments-vi.md`).

Deliverables in `03-instruments-vi.md`:
- **Consent Form (Phiếu đồng ý):** Clear statement that the product is being tested (not the participant), consent for screen/audio recording, data privacy terms, permission for course staff to verify participation.
- **Moderator Script (Kịch bản điều phối):** Standardized greeting, think-aloud briefing, neutral intervention prompts (e.g., *"Bạn cứ thao tác như cách bạn nghĩ là đúng nhé"*, *"Bạn đang suy nghĩ điều gì lúc này?"*), and wrap-up.
- **Vietnamese SUS Questionnaire:** The standard 10-item Likert scale (1 = Hoàn toàn không đồng ý, 5 = Hoàn toàn đồng ý).
- **Structured Probes Table:** Covering the 4 required dimensions:
  1. *Clarity (Rõ ràng):* Hiển thị thông tin, nhãn nút, tính minh bạch của giá.
  2. *Error Recovery (Khắc phục lỗi):* Thông báo lỗi khi mã coupon sai/thiếu thông tin, khả năng tự sửa.
  3. *Speed (Tốc độ):* Cảm nhận thời gian phản hồi và các bước thanh toán dài hay ngắn.
  4. *Trust (Tin cậy):* Độ an toàn khi xác nhận đơn hàng, tính chính xác của tổng tiền sau giảm giá.

**Checkpoint 3 passes when** all participant-facing documents are provided in fluent, natural Vietnamese ready to print or share via Google Forms.

---

## Phase 4: Participants and Logistics

**Goal:** Confirm 7 eligible, reachable, consenting participants plus 1 pilot (`participants.md`).

1. Provide the masked participant table schema in `usability/participants.md`:
   `participant, name, contact_type, contact_masked, relationship, profile_fit, enrolled_in_hw03, consent_recorded, session_date, is_pilot`
2. **Student Entry:** The student types all participant data. **The AI never fills in or guesses names or phone numbers.**
3. **Verification Checks:**
   - Contact numbers/Zalo masked in the middle 4 digits (e.g., `091****890`).
   - `enrolled_in_hw03` must be `no` for all rows.
   - 7 experimental rows (P01–P07) + 1 pilot row (PILOT).
   - Verify `usability/participants.md` is in `.gitignore`.

**Checkpoint 4 passes when** table format is validated, consent is confirmed, and the gitignore check passes.

---

## Phase 5: Pilot Session

**Goal:** Validate scenario clarity and timing with 1 pilot participant (`05-pilot-review.md`).

1. Student conducts the pilot session following the script, timing the task and recording notes.
2. Complete the Pilot Review Checklist:
   - Did the participant understand the scenario without asking clarifying questions?
   - Did the SUT flow execute end-to-end without unhandled technical crashes?
   - Was the reset procedure effective (coupon still valid for next run)?
   - Was the time benchmark realistic?
   - Did screen recording capture audio and cursor clearly?
3. Record any adjustments to the scenario, benchmark, or probes in `05-pilot-review.md`.

**Checkpoint 5 passes when** pilot review is documented, and adjustments (if any) are applied to Phase 2/3 files.

---

## Phase 6: Session Execution (P01 to P07)

**Goal:** Record observations and numbers for each of the 7 sessions, one Git commit per session.

For each participant (P01 through P07):
1. **Pre-session check:** Run SUT reset procedure, verify coupon code, start recording.
2. **Data ingestion:** Student pastes raw notes and raw scores after the session.
3. **Structuring:**
   - Create `usability/sessions/<Pxx>/notes.md` with: Task outcome (`success`, `assisted`, `fail`), completion time (seconds), error count, help requests, timestamped observation log, verbatim quotes, probe answers.
   - Append raw scores to `usability/data/sus.csv` (`participant,q1,q2,...,q10`).
   - Append metrics to `usability/data/performance.csv` (`participant,time_seconds,outcome,error_count,help_requests`).
4. **Git Commit Suggestion:** Propose the exact commit command for that specific session:
   ```bash
   git add usability/sessions/Pxx/notes.md usability/data/sus.csv usability/data/performance.csv
   git commit -m "test(usability): record session Pxx"
   ```

**Checkpoint 6 passes when** all 7 sessions have structured notes, complete CSV rows, and matching commits.

---

## Phase 7: Data Analysis and Synthesis

**Goal:** Quantitative computation and qualitative findings synthesis in English (`06-analysis.md`).

### Step 1: Automated Metrics Calculation
Run the helper script:
```bash
python3 skills/usability-evaluation-coach/scripts/score_usability.py --dir usability/data --benchmark <seconds>
```
The script computes:
- Individual SUS scores ($0-100$), sample mean ($\bar{x}$), median, sample standard deviation ($s$), and range. Comparison against industry average benchmark ($\sim 68$).
- Performance summary: Completion rate (unassisted vs. assisted vs. failed), % within benchmark, mean/median/SD of completion time, average error rate, average help requests.

### Step 2: Qualitative Synthesis & Root Causes
- Group similar pain points, errors, and hesitations across sessions.
- Classify each into:
  - **Type:** `genuine bug` (system fails functional spec / unintended behavior) vs. `usability issue` (system functions as coded but confuses/slows user).
  - **Pattern:** `systemic` (design pattern flaw affecting multiple users) vs. `isolated` (one-off edge case).
- Every synthesis statement must cite participant IDs in brackets (e.g., *"[P01, P03, P06]"*).

### Step 3: Prioritization and Criticality Ranking
Fill `usability/data/findings.csv` (`id,title,type,severity,affected_participants`).
- Severity Scale: `4 = Blocker`, `3 = Major`, `2 = Minor`, `1 = Cosmetic`.
- Probability = $\frac{\text{affected count}}{n}$.
- Criticality = $Severity \times Probability$.

> [!IMPORTANT]
> **Blocker & Major Override Rule (Small Sample Correction):**
> In a small sample ($n=7$), calculating criticality purely by multiplication can unfairly downgrade critical blockers (e.g., a Blocker hitting 1 user gives $4 \times \frac{1}{7} \approx 0.57$, traditionally categorized as "Medium").
> **Rule:**
> 1. Any finding with **Severity = Blocker (4)** is automatically prioritized as **Fix First (Blocker Override)**.
> 2. Any finding with **Severity = Major (3)** affecting $\ge 2$ participants is prioritized as **Fix First / High (Major Override)**.
> 3. Other findings follow standard mathematical bands: $\ge 2.0$ (Fix First), $1.0 - 1.99$ (High), $0.5 - 0.99$ (Medium), $< 0.5$ (Low).

**Checkpoint 7 passes when** `06-analysis.md` contains verified statistical tables, qualitative findings with citations, and the override-adjusted criticality table.

---

## Phase 8: Usability Bugs and GitHub Issues

**Goal:** Report genuine bugs in English Markdown drafts (`07-bugs/`) and file them on GitHub one by one.

### Criteria
Only findings of type `genuine bug` are filed as GitHub issues by default. Usability design recommendations remain in the final report unless the student explicitly decides to file them under a `usability` label.

### Step 1: Draft Bug Reports
Create `usability/07-bugs/<ID>.md` using the bug report template in English. Include participant evidence, reproduction steps, expected vs. actual behavior, and severity.

### Step 2: Screenshot Handling
- Store bug evidence screenshots in `evidence/usability/<ID>.png`.
- Ensure screenshots contain **no private participant data** (mask any real email/phone in test fields).
- Ensure the student commits and pushes screenshots before embedding them in issues:
  `![evidence](https://github.com/<owner>/<repo>/blob/<commit-sha>/evidence/usability/<file>.png?raw=true)`

### Step 3: Interactive One-by-One Issue Creation
For each genuine bug:
1. Present the full draft to the student (Title, Labels, Body, Image preview).
2. **Issue Title Format:** `[Usability][<Screen>] <short, specific title>`
3. **Issue Labels:** `bug`, `<severity>` (`blocker`, `major`, `minor`, `cosmetic`), `usability`, and `<platform>` (`web` or `mobile`).
4. Wait for explicit student approval before creating the issue via `gh` CLI.
5. Record the created issue number and URL in the markdown draft and `findings.csv`.

**Checkpoint 8 passes when** all genuine bugs have approved GitHub issues with recorded URLs.

---

## Phase 9: Final Report, Summary, and Commits

**Goal:** Assemble consolidated Task 2 submission deliverables (`08-usability-report.md`).

1. Compile `usability/08-usability-report.md` in English combining Plan, Scenario, Execution, Analysis, Criticality Ranking, GitHub Issues, and honest Limitations.
2. Update `usability/usability-summary.md` with high-level stats for the root `README.md`.
3. Provide the full, clean sequence of Git commit commands in `usability/commit-suggestions.md`:

```bash
# Scope, plan, and scenario
git add usability/PROGRESS.md usability/01-test-plan.md
git commit -m "docs(usability): define flow, test plan, and objectives"

git add usability/02-task-scenario.md usability/03-instruments-vi.md
git commit -m "docs(usability): write task scenario, components, and instruments"

# Pilot
git add usability/05-pilot-review.md
git commit -m "test(usability): record pilot session and refinements"

# Sessions (1 commit per participant)
git add usability/sessions/P01/notes.md usability/data/sus.csv usability/data/performance.csv
git commit -m "test(usability): record session P01"
# ... repeat for P02 through P07 ...

# Analysis & Bugs
git add usability/data/findings.csv usability/06-analysis.md
git commit -m "docs(usability): score SUS, analyse performance, and rank findings"

git add usability/07-bugs/ evidence/usability/
git commit -m "docs(bugs): draft usability bug reports and link issues"

# Final Report
git add usability/08-usability-report.md usability/usability-summary.md
git commit -m "docs(report): assemble final usability evaluation report"
```

**Checkpoint 9 passes when** all files reconcile, no untracked private files exist in staging, and commit suggestions match the grading log format.

---

## Task 4 Demonstration Video Guidelines (10 Points)

When recording the YouTube demonstration video for this Agent Skill:
1. **Introduction (1 min):** State student name, ID, and objective. Show the workspace layout and trigger the skill.
2. **Interactive Planning (2 mins):** Show the skill drafting `01-test-plan.md` and validating `02-task-scenario.md` with the scenario linter.
3. **Execution & Automation (2 mins):** Show ingesting raw notes for a session, running `score_usability.py` to calculate SUS and metrics, and generating the criticality ranking table with the Blocker Override.
4. **Bug & Issue Filing (1 min):** Demonstrate the interactive confirmation of a bug draft and show the created issue rendering on GitHub.

---

## Reference: Templates

### 1. Test Plan Template (`01-test-plan.md` - English)

```markdown
# Usability Test Plan: EShop Checkout Flow

- **SUT / Build Commit:** EShop (`<commit-hash>`)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **Test Methodology:** Moderated Assessment Testing (Think-Aloud Protocol)

## 1. Purpose
Evaluate the checkout usability of EShop to identify navigation bottlenecks, coupon friction, and order completion confidence.

## 2. Problem Statements
1. Do users encounter hesitation or friction when locating and applying promotional discount coupons?
2. Are error messages during checkout clear enough for users to self-recover without external help?
3. What is the overall user satisfaction score measured via the System Usability Scale (SUS)?

## 3. Test Plan and Objectives
Participants complete a single goal-driven purchase scenario under observation. Measure completion rate, time on task, and error frequency.

## 4. User Profile
- Age: 18–35, active online shoppers (at least 1 online purchase per month).
- Exclusions: Students enrolled in Software Testing CSC13003; software testing professionals.

## 5. Method and Test Design
- Moderated 1-on-1 sessions (in-person or video call with screen recording).
- Sample: 1 Pilot participant + 7 experimental participants.
- Evaluation scale: 10-item System Usability Scale (SUS).

## 6. Environment and Equipment
- Desktop Chrome / Firefox, local server (`http://localhost:3000`).
- Screen & audio recording via OBS Studio / Google Meet.

## 7. Test Monitor Role
Neutral observer. Reads instructions aloud, triggers timer, intercedes only when user is completely deadlocked.

## 8. Evaluation Measures
- Quantitative: Task completion rate, task duration (seconds), error counts, help requests, SUS scores.
- Qualitative: Verbalized thoughts, post-task probe feedback (clarity, error recovery, speed, trust).

## 9. Report Format
Consolidated Markdown and PDF report including findings ranked by criticality.
```

### 2. Task Scenario Template (`02-task-scenario.md` - English)

```markdown
# Task Scenario and Components

## Scenario Prompt (Read to Participant)
"You are looking to buy a backpack for an upcoming weekend trip. You have a promotional code 'DISCOUNT10' offering 10% off. Find a suitable backpack, apply your discount code, and complete the order using cash on delivery (COD)."

## Provided Scenario Data
- Promotional Coupon Code: `DISCOUNT10`
- Budget / Constraint: Choose any backpack under 500,000 ₫.
- Payment method: Cash on delivery (COD).

## Task Components
| Component | Description |
|---|---|
| **Task** | Search backpack, add to cart, apply coupon code `DISCOUNT10`, and finish checkout. |
| **Machine State** | Clean browser session, empty cart, test coupon active in database, user logged in with test buyer account. |
| **Completion Criteria** | Order confirmation screen reached displaying unique Order ID and 10% discount applied. |
| **Benchmark** | $\le 150$ seconds (based on pilot timing). |

## Problem Statement to Data Mapping
| Problem Statement | Performance Data | Preference Data | Task Component |
|---|---|---|---|
| Coupon friction & visibility | Time to enter coupon; error count on coupon field | Clarity & trust probe responses | Cart & coupon input step |
| Checkout completion ease | Total time on task; success/assisted/fail | SUS score; speed probe rating | End-to-end checkout |

## State Reset Procedure (Between Sessions)
1. Delete active session cookies and clear browser cart storage.
2. In database / admin panel, verify coupon `DISCOUNT10` usage count is reset.
3. Ensure product inventory is sufficient.
4. Verify SUT commit version matches baseline.
```

### 3. Vietnamese Participant Instruments (`03-instruments-vi.md` - Vietnamese)

```markdown
# Bộ công cụ đánh giá độ khả dụng (Dành cho người tham gia)

## 1. Phiếu đồng ý tham gia (Consent Form)
Tôi đồng ý tham gia buổi kiểm thử độ khả dụng cho hệ thống mua sắm trực tuyến (phục vụ học tập môn Software Testing).
- Tôi hiểu rằng buổi thử nghiệm nhằm đánh giá sản phẩm, không đánh giá năng lực của tôi. Tôi không thể làm sai.
- Đồng ý ghi màn hình và âm thanh phục vụ nghiên cứu: [ ] Có  [ ] Không
- Tôi có quyền dừng tham gia bất kỳ lúc nào mà không cần giải thích lý do.
- Thông tin cá nhân của tôi được bảo mật và che một phần (ví dụ SĐT dạng 091****890) trong báo cáo học tập.
- Đồng ý cho Giảng viên / Trợ giảng liên hệ xác nhận tôi đã tham gia: [ ] Có  [ ] Không

Họ và tên: _______________________  Chữ ký: __________________  Ngày: ____________

---

## 2. Kịch bản điều phối (Moderator Script)
1. **Chào hỏi & Phổ biến:**
   "Cảm ơn bạn đã tham gia. Hôm nay mình đang kiểm tra giao diện của một trang web mua sắm để tìm xem hệ thống có điểm nào gây khó khăn cho người dùng hay không. Bạn cứ thực hiện tự nhiên, không có câu trả lời nào là sai cả. Trong quá trình thao tác, bạn hãy nói to suy nghĩ của mình lên nhé (Think-Aloud) — ví dụ bạn đang tìm kiếm cái gì, thấy điều gì bất ngờ hay bối rối."
2. **Giao nhiệm vụ:** Đưa kịch bản bằng văn bản và đọc to kịch bản. Bắt đầu bấm giờ.
3. **Quan sát trung lập:**
   - Nếu người dùng im lặng: *"Bạn đang suy nghĩ điều gì lúc này?"*
   - Nếu người dùng hỏi nên bấm vào đâu: *"Bạn cứ thử làm theo cách bạn cảm thấy hợp lý nhất nhé."*
   - Chỉ can thiệp khi người dùng bế tắc hoàn toàn (> 2 phút không có hướng giải quyết), ghi chú lại và đánh dấu kết quả là `assisted`.
4. **Kết thúc nhiệm vụ:** Dừng đồng hồ khi thấy màn hình xác nhận đơn hàng hoặc khi người dùng tuyên bố bỏ cuộc.

---

## 3. Phiếu đánh giá SUS (System Usability Scale)
*Vui lòng khoanh tròn mức độ đồng ý từ 1 (Hoàn toàn không đồng ý) đến 5 (Hoàn toàn đồng ý).*

| STT | Nội dung câu hỏi | 1 | 2 | 3 | 4 | 5 |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Tôi nghĩ rằng mình sẽ muốn sử dụng hệ thống này thường xuyên. | | | | | |
| 2 | Tôi thấy hệ thống phức tạp một cách không cần thiết. | | | | | |
| 3 | Tôi thấy hệ thống dễ sử dụng. | | | | | |
| 4 | Tôi nghĩ mình cần sự hỗ trợ của người có chuyên môn kỹ thuật để có thể dùng được hệ thống này. | | | | | |
| 5 | Tôi thấy các chức năng trong hệ thống được kết hợp với nhau rất tốt. | | | | | |
| 6 | Tôi thấy hệ thống có quá nhiều điểm thiếu nhất quán. | | | | | |
| 7 | Tôi nghĩ hầu hết mọi người sẽ học cách dùng hệ thống này rất nhanh. | | | | | |
| 8 | Tôi thấy hệ thống rất rườm rà, khó thao tác. | | | | | |
| 9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. | | | | | |
| 10 | Tôi cần phải học rất nhiều điều trước khi có thể bắt đầu sử dụng hệ thống này. | | | | | |

---

## 4. Bộ câu hỏi phỏng vấn sâu (Probe Questions)
1. **Rõ ràng (Clarity):** "Bạn có luôn biết mình đang ở bước nào trong quy trình không? Có nhãn nút bấm hay thông tin nào làm bạn phân vân không?"
2. **Khắc phục lỗi (Error Recovery):** "Khi nhập mã giảm giá hoặc thông tin giao hàng, nếu có lỗi xảy ra, thông báo có giúp bạn biết cách sửa ngay không?"
3. **Tốc độ (Speed):** "Bạn thấy thời gian từ lúc chọn sản phẩm đến khi đặt hàng thành công là nhanh hay chậm so với mong đợi?"
4. **Tin cậy (Trust):** "Ở màn hình xác nhận thanh toán cuối cùng, điều gì khiến bạn yên tâm hoặc lo lắng về số tiền và đơn hàng?"
```

### 4. Bug Report Template (`07-bugs/<id>.md` - English)

```markdown
# [Usability][<Screen>] <Short, Specific Defect Summary>

- **Finding ID:** `F-<NN>`
- **Affected Participants:** `[P02, P05, P07]`
- **Severity:** `<Blocker | Major | Minor | Cosmetic>`
- **Environment:** Chrome 124 / Ubuntu 22.04 / `http://localhost:3000` (SUT commit `<commit-sha>`)
- **GitHub Issue:** #<issue-number> (<url>)

## Description
Clear description of the observed usability defect or functional breakdown during the session.

## Steps to Reproduce
1. Navigate to product detail page.
2. Click "Add to Cart".
3. Open Cart and enter coupon code `DISCOUNT10`.
4. Click "Apply".

## Expected Result
Coupon discount is calculated and reflected in the subtotal with clear confirmation feedback.

## Actual Result
No visual feedback is displayed; discount is not applied, and the user assumes the button was not clicked.

## Session Evidence
- Participant P02 clicked the button 4 times in frustration (Timestamp: 02:15 in recording).
- Verbatim quote P05: *"Ủa bấm rồi mà sao không thấy trừ tiền gì hết vậy?"*

## Screenshot Evidence
![Defect Screenshot](https://github.com/<owner>/<repo>/blob/<commit-sha>/evidence/usability/<id>.png?raw=true)
```
