---
name: domain-bva-test-design
description: Black-box test design for one FR from SRS + API spec - domain testing, BVA, business/security/side-effect tests. Use for test cases, 'chia lớp tương đương', 'giá trị biên', BVA, test design for FR-xx.
---

# Domain Testing + BVA test design (black-box, spec-driven)

## Why this skill exists
The goal of testing here is to find where the implementation deviates from the **specification**. So the SRS is the oracle: every expected result must come from a sentence of the SRS (or its security list). Looking at what the running system does and writing that down as "expected" destroys the purpose. When the SRS is silent, say so (`CẦN LÀM RÕ`) instead of guessing: a guess that turns out to differ from the system produces a false bug report, and a guess that matches hides a real gap.

## Inputs
One feature at a time. Needed: the FR's SRS text, the related security requirements (SEC-xx), and the related API endpoints. If the user gives the whole SRS and API spec plus an FR id, first build the **FR slice** (Step 0). If the SRS or API text is missing, ask for it; do not rely on memory of how such a system usually works.

## Working mode
Default is **step by step with a review checkpoint**: do one step, output it, end with one line asking the person to confirm or correct before the next step (their review is part of the deliverable). If they say "chạy liền / làm hết / all steps", run every step in one answer but keep the step headings. If they ask for a single step, do only that step. Reply in the language the person writes in (Vietnamese by default for this project); keep the fixed labels below exactly as written.

## Fixed vocabulary
Expected results take exactly one of these forms (the checker script depends on them):
- `2xx và dữ liệu được lưu đúng`
- `4xx và dữ liệu không đổi`
- `CẦN LÀM RÕ` (add a short reason after it)
- `UI: <what must be observed>` for checks that need the screen (manual, not automatable)

The form comes first; concrete detail may follow after it, e.g. `2xx và dữ liệu được lưu đúng — đơn hàng lưu total = 300000`, `4xx và dữ liệu không đổi — giỏ hàng vẫn còn 1 món`. A state check written without the leading form ("Giỏ hàng trả về rỗng") is not accepted by the checker.

**Oracle rule** — choose the form by evidence, not by habit:
- 4xx only if a requirement (or SEC item) says the input/state is forbidden, invalid or must be rejected.
- 2xx only if a requirement says it is allowed, or the class is the valid class of a rule.
- anything else → `CẦN LÀM RÕ`. This includes pure type mismatches (a string where a number goes) when no requirement defines the type, empty/null values with no stated rule, and unspecified maximum lengths.
- `CẦN LÀM RÕ` is never a pass and never a bug; it becomes a question for the lecturer/BA.
- If the SRS says a field is **ignored or recomputed by the backend** (e.g. "backend recalculates the total, does not accept the client's value"), do not test that field's domain. One test proving the client value is ignored is enough; validating its type or range would test behaviour the SRS never asked for.

## Steps

### Step 0 — FR slice (only if given the full documents)
Produce the three blocks the other steps consume: **A.** SRS excerpt of the FR (verbatim), **B.** SEC rows and any other FR it depends on (e.g. state machine, access control) — only what changes an expectation, **C.** API endpoints used (method, path, auth, body). Copy text verbatim; do not paraphrase.

### Step 1 — Extract requirements
1. Table `Mã | Nội dung | Nguồn | Loại`. One atomic statement per row: R1, R2… Split compound sentences; each condition of a condition-table (C1…C5) is its own row. Loại ∈ input / nghiệp vụ / bảo mật / truy cập. Keep the SRS's own numbers (thresholds, lengths, limits) in the content.
2. Endpoint table: method, path, token needed, body.
3. `CẦN LÀM RÕ` list: things a tester needs for an expectation that the SRS does not say (empty cart, null/empty fields, error status codes, limits, API-vs-SRS conflicts). Do not propose answers here.

### Step 2 — Variables
- Input variables: name, location (body/query/path/header), type, constraint stated by the SRS, what the SRS is silent about, ordered/numeric? (decides BVA), **role**: validated / ignored-by-spec / derived.
- State variables and hidden conditions (token, role, existing data, counters, dates) with how to build each state in a test.
- Observable outputs used to decide pass/fail (status code, body, DB-visible state via a read endpoint, UI).

### Step 3 — Equivalence classes
Per variable, a table `Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu`. Valid classes (several if the SRS defines distinct behaviours), then invalid classes, each violating **one** rule. Representatives violate exactly one thing; all other variables keep the baseline valid values. If a violation cannot be isolated, say why. Mark classes the SRS does not decide as `CẦN LÀM RÕ`. See `references/technique-cheatsheet.md` for per-type class lists (numbers, strings, dates, enums, phone/email, ids, tokens).
When a rule says "all N conditions must hold" (like C1–C5), make one all-valid test and N tests that each break exactly one condition.

### Step 4 — Domain-testing cases (DT-01…)
Table `ID | Lớp | Mô tả | Input (header/endpoint/body, concrete JSON) | Kỳ vọng | Mã YC`. At least one test per class. State the baseline values once and reuse them. A baseline test asserts **only its own condition** (e.g. checkout returns 2xx); side effects such as "cart emptied" belong to their own business test, otherwise a baseline fails for an unrelated reason and muddies the bug grouping.

### Step 5 — Boundary Value Analysis (BV-01…)
Pick variables with an ordered domain (numbers, lengths, dates, counts) and explain why others are excluded (categorical, ignored-by-spec). Boundaries come **from the SRS only** (">= 300,000", "10–11 digits", "before expired_at", "< max_uses"). Use 3-value BVA: for each boundary B test B−1, B, B+1 (use the exact comparison operator of the SRS; `references/technique-cheatsheet.md` has the operator table). Never invent limits such as 255 or 999: if the SRS gives no limit, add at most a few *probe* values (0, negative, empty, very long) marked `CẦN LÀM RÕ`, and say they are probes. Then list BV tests that hit the same input as a DT test and keep only one (prefer the BV, it carries the boundary meaning). The final test list used for execution must reflect this decision — do not drop a test in the text and still run it later.

### Step 6 — Business, security and access tests (BL-…, AC-…)
Generate from every requirement of type nghiệp vụ / bảo mật / truy cập not yet covered: authentication variants on each protected endpoint, role checks, data isolation, mass assignment, formulas with exact numbers computed from the SRS, state transitions, SEC items. Checklist and examples: `references/security-and-side-effects.md`. Each test has `Cách dựng`, input, expectation, requirement code.

### Step 7 — Side-effect review
For every write operation list what else may change besides the fields that were sent (other fields, other records/users, derived values, counters, history, failure atomicity, double submit, leaked response fields) and mark each as already tested / new test / `CẦN LÀM RÕ`. Add the new tests (continue BL numbering). Same checklist file.

### Step 8 — Assemble and self-check
Assemble one markdown file `FRxx_test_design.md` (layout in `references/output-template.md`) and run:

```
python scripts/check_design.py FRxx_test_design.md
```

It fails on duplicate IDs, requirement codes that do not exist (a typical slip: citing `R11` when the table ends at R8), expectations outside the fixed vocabulary and equivalence classes with no test. Fix every error, then deliver. Report warnings to the person instead of hiding them.

## Pitfalls seen in real use
- Expectation copied from the system's behaviour instead of the SRS.
- Treating `CẦN LÀM RÕ` rows as bugs in the report, or "API convention" as a violated requirement (a bug must cite an SRS clause).
- Assumed boundaries presented as facts; DT/BV duplicates removed in the design but still executed.
- Requirement codes that are not in the requirement table; test IDs renumbered between documents.
- A baseline test failing because of an unrelated side effect (see Step 4).

## Optional: AI-usage log
If the course asks for a log of AI use, write each step as a separate file with the header and sections in `references/output-template.md` (tool, timestamp, step, verbatim prompt, unedited output, human review).
