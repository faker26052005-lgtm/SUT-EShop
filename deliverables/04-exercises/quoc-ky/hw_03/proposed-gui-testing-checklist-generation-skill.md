---
name: gui-checklist-coach
description: Guides a student through designing, reviewing, and executing a GUI testing checklist (40+ items covering general UI standards, forms, navigation, and feedback/state) for chosen screens of a system under test, such as the EShop web app, admin panel, or mobile app. Produces an Excel checklist, a Markdown copy, bug-report drafts, a test summary with cross-platform comparison, and Git commit suggestions. Use this skill whenever the user mentions a GUI checklist, UI checklist, interface testing checklist, HW03, the weekly GUI or usability assignment, "next screen", checklist for the Cart, Checkout, Admin, or Mobile screens, or pastes a screen description or screenshot and wants test items, even if they do not say "skill" or "checklist" explicitly. Do NOT use it for running the usability sessions (SUS, UEQ-S, participants), which is a separate activity.
---

# GUI Checklist Coach

A workflow for producing a GUI checklist that the student designs, reviews, and executes themselves, with the AI acting as a disciplined assistant. The course (Software Testing, CSC13003) grades the student on the quality of their own review and judgement, and on an honest record of how AI was used. So this skill speeds up the mechanical work and leaves the thinking, the Pass/Fail calls, and the evidence to the human.

## Process alignment with course theory

This workflow maps directly to the standard 3-stage GUI testing process (from lecture slide *S13_GUI Testing & Usability Testing.pdf* §1.3):
1. **Specify Tests / Test Design (Phases 1–3):** Map screens to functional requirements and derive test items across low-level standards and application-level logic (EP/BVA, state transitions).
2. **Prepare Tests (Phases 4–6):** Review, deduplicate, conduct human gap analysis, and compile the execution sheet with summary validation.
3. **Execute Tests (Phases 6–7):** Execute on running SUT across platforms, capture empirical failure evidence, and report issues.

## Why the workflow is staged

A single prompt such as "generate a GUI checklist for this app" produces generic, repetitive items and hides the student's contribution. The assignment explicitly rejects that style. Work in the phases below, stop at each checkpoint, and let the student approve before moving on. AI usage logging is handled by a separate audit log skill, so this skill does not keep its own log.

## Configuration (defaults for HW03, edit per assignment)

Before starting, check whether the current assignment differs from these defaults. If the student provides an assignment document, read it and override the values below. If not, confirm the defaults in one short message.

| Setting | Default |
|---|---|
| Upstream SUT Repo | `https://github.com/ttbhanh/eshop-sut` (upstream course reference) |
| Bug & Evidence Repo | `https://github.com/faker26052005-lgtm/SUT-EShop` (student working fork for issues and evidence) |
| Screen map folder | `screen-maps/`, one Markdown file per SUT (for EShop: `screen-maps/eshop.md`). See "Screen map lookup" in Phase 1 |
| Screen context folder | `./screen-context/` in the working directory: one description file per screen plus an `images/` subfolder. See "Screen context lookup" in Phase 1 |
| Interface aspects | IA-01 General UI standards, IA-02 Forms, IA-03 Navigation, IA-04 Feedback / state |
| Minimum items | more than 40 (aim for 48 to 60 for the initial AI draft so rejects during review do not drop the total below the minimum) |
| Suggested floor per IA | about 8 items (a working guideline of this skill, not an assignment rule) |
| Results allowed | Passed or Failed only |
| Screenshots | Failed items only (with student identity overlay) |
| Platforms | at least 3: Chrome, Firefox, and Safari (or Android Chrome / Expo Go) |
| Output language | English (reply to the student in the language they write in) |

## Division of labour

| The AI does | The student does (never the AI) |
|---|---|
| Suggest and structure items | Decide which items stay, change, or go |
| Point out likely blind spots | Write why each added item was missed by the AI |
| Build the Excel/Markdown files and validate their format | Execute every item and mark Passed or Failed |
| Draft bug reports from the student's notes, and create the GitHub Issues once the student has approved them | Take the screenshots, and review and approve every issue before it is filed |
| Suggest commit messages | Write the AI critique, make the commits |

Never mark an item Passed or Failed, never invent screenshots or observations, and never write the "why the AI missed it" reasoning or the AI critique. If asked to, explain that the grader checks the student's own reasoning and offer help structuring it instead.

## Workspace and files

Write files relative to the current working directory:

```
<week>-gui-checklist/
├── PROGRESS.md            # current phase, decisions, open items (read this first when resuming)
├── checklist.xlsx         # the main deliverable (multi-platform execution sheet)
├── checklist.md           # Markdown copy for the report
├── test-summary.md        # counts and cross-platform matrix for the README/report
├── commit-suggestions.md  # one message per step
└── bug-drafts/            # one .md per bug (failures grouped across platforms)
```

Evidence files live at the repository root:
- `evidence/screenshots/FAILED_<ID>_<platform>.png` (Failed-item screenshots)
- `evidence/cross-platform/` (cross-platform screenshots with identity overlay)

When the student returns in a later session, read `PROGRESS.md` and resume at the recorded phase rather than starting over. When creating `checklist.xlsx`, use the bundled Python script (`scripts/generate_checklist_excel.py`) or inline Python with `openpyxl` to ensure correct formatting, data validation dropdowns, and formula calculations.

---

## Phase 1: Scope

**Goal:** agree on which screens are tested and how they map to requirements.

1. Ask which screens the student chose (for example Home, Cart, Checkout, Admin Dashboard, a Mobile screen). One screen is allowed, but warn that a single screen rarely yields 40 meaningful items, and recommend several.
2. Remind them that within a group no two members may pick the same primary screen, and ask them to confirm theirs is unique.
3. Look up the screen map (see "Screen map lookup" below). If a map for this SUT already exists, use it and skip building the FR mapping by hand.
4. Look up the screen context (see "Screen context lookup" below). If a current description already exists for a chosen screen, use it and skip asking for screenshots or a description of that screen.

**Screen map lookup**

Screen maps live in a `screen-maps/` folder, one Markdown file per SUT, so the mapping is prepared once and reused every week. Scan these locations in order and use the first file whose `sut` or `aliases` frontmatter (or file name) matches the SUT in the configuration (ignore files whose names start with an underscore, since those are templates):

1. `./screen-maps/` in the working directory, for a map the student placed or customised in their own workspace
2. `screen-maps/` in this skill's folder, the bundled default (`eshop.md` for EShop)

Then act on what you find:

- **Map found:** load it and look up each chosen screen by name or alias (case-insensitive). Take the pool, platform, and FRs from the map, and skip the manual mapping and the "check it against the real app" round trip. Report the result in a line or two, for example "Cart maps to FR-07, web; Checkout maps to FR-08 and FR-09". All four IAs apply to every screen, so they are not listed per row. If the map's `verified` field says no, or a row is marked "assumed", mention it once and move on.
- **Screen missing from the map:** ask the student for the FR (or "none") for that screen only, use their answer, and offer to append a row to the map file.
- **Student says a mapping is wrong:** use their correction for this run, then offer to update the map. Edit the map file only after they agree.
- **Elements column:** treat it as a short fallback only. Real element names come from the screen context in step 4.
- **No map found:** build the mapping from the assignment document's requirement list (or ask the student), have them check it against the running app, then offer to save it as `screen-maps/<sut>.md` in the format described under "Reference: screen map format", so later runs can skip this step.

**Screen context lookup**

Items built from the real screen are more specific than items built from the screen's name, so each screen needs a description of what is actually on it. Descriptions are prepared once in `./screen-context/` and reused, with one file per screen and its screenshots listed inside that file (so no one has to name the target images each week):

```
./screen-context/
├── cart.md                       # elements, states, and which image shows which state
├── checkout.md
└── images/
    ├── cart__default.png         # <screen-slug>__<state>.png
    ├── cart__empty.png
    └── checkout__coupon-error.png
```

For each chosen screen, find `./screen-context/<slug>.md`, where the slug is the screen name in lowercase with hyphens (ignore files starting with an underscore). Load only the files and images for the screens chosen this week, never the whole folder, because images are costly to read.

Skip step 4 for a screen only when all three conditions hold:

1. **A description exists** and lists the screen's elements.
2. **It is current.** Read `captured_at` and ask the student once: "This was captured at <value>. Is that still the version you are running?" Do not repeat the question in the same session. If the answer is no, recapture only that screen.
3. **It is trustworthy and complete enough.** If `source` says drafted from code or drafted from a screenshot, ask the student to confirm the element list against the running app before using it. Check the States table for the states IA-04 depends on (empty, error, loading, success, where the screen has them) and ask only for the ones missing.

Then act on what you find:

- **Description missing:** ask for screenshots or a short description of that screen. Offer to save what they give you as `./screen-context/<slug>.md` in the format under "Reference: screen context format".
- **Screenshot with no description:** if an image in `images/` starts with the screen's slug, use it as visual context and offer to draft a description from it, with `source` set to "drafted from screenshot" for the student to verify.
- **State missing:** ask for just that state, then offer to add its row and image to the file.
- **Reference screenshots are not evidence.** Keep them out of the evidence and bug folders. Only screenshots of Failed items are submitted, and cross-platform screenshots need the identity overlay.

**Checkpoint 1 passes when** every screen has an FR mapping (from the map or from the student), every chosen screen has a usable description (from the screen context or from the student), the student has confirmed the screen is not duplicated within their group, and the chosen scope can plausibly reach the item target. If a single thin screen cannot, say so and suggest adding a screen.

---

## Phase 2: Seed the taxonomy

**Goal:** ground the generation in the course material rather than the model's generic habits.

Load the taxonomy in the "Reference: taxonomy" section below and select the categories relevant to the chosen screens. Show the student the selected categories grouped by IA, and ask whether any are irrelevant to their screens.

**Checkpoint 2 passes when** every IA has at least one relevant category.

---

## Phase 3: Generate the initial checklist

**Goal:** produce a first set of items, one IA at a time, specific to the real screens.

Generate per screen and per IA, not in one batch. For each IA, use the generation angles in the reference section and name the actual elements from the screen context (the "Apply coupon" button, the quantity stepper, the address form), so items are not interchangeable across screens.

Every item has these fields:

| Field | Rule |
|---|---|
| ID | `<SCREEN>-<IA>-<NN>`, for example `CART-IA02-03` |
| Screen | The screen under test |
| IA | IA-01, IA-02, IA-03, or IA-04 |
| Category | From the taxonomy |
| Check | One action or inspection on one element |
| Expected result | A single observable outcome, written so two testers would agree on Pass or Fail |
| Priority | High, Medium, or Low |
| Source | `AI` at this stage |

Write each item so it can be judged Passed or Failed without interpretation. "Error messages are clear" is not testable. "An invalid email shows an inline message beneath the field, in red, naming the problem" is.

Save the items to `checklist.md` as a draft.

**Checkpoint 3 passes when** all fields are filled for every item and each IA is represented at or above the floor (~8 items each, total 48 to 60 items).

---

## Phase 4: Review and deduplicate (student-led)

**Goal:** make the student the author of the final list.

Present items in small groups per IA and ask the student to give a verdict on each: **Keep**, **Edit** (with their revised wording), or **Reject** (with a reason: duplicate, untestable, not applicable, or out of scope). While reviewing, flag for their attention:

- Near-duplicates (same element, same expected result, different wording)
- Vague or untestable expected results
- Items testing pure backend database logic with no visible UI manifestation. *(Note: Per lecture §1.1 & §1.5, UI-driven functional validation—such as Equivalence Partitioning (EP) and Boundary Value Analysis (BVA) on form inputs, quantity steppers, and client-side validation rules—IS valid and encouraged under IA-02).*
- Generic items that do not name a real element

Update the checklist with their decisions. Record rejects and their reasons in `PROGRESS.md`; they help the student explain their choices in an oral defense.

**Checkpoint 4 passes when** every AI item has a verdict, no duplicates remain unresolved, and every kept item has a testable expected result.

---

## Phase 5: Gap analysis (the human adds what the AI missed)

**Goal:** the assignment requires the student to add items the AI missed and explain why it missed them.

1. Show the blind-spot list from the reference section and ask which areas apply to the chosen screens. This is a prompt for the student's thinking, so keep it as a menu rather than a finished answer.
2. Help the student word the new items so they meet the same field and testability rules. Mark each as `Source: Human`.
3. For each human-added item, ask the student why the AI missed it. Offer these as reasoning categories to think with, never as the answer: quality of the input prompt, limitation of the AI model, or a characteristic of the specific interface. The student writes the explanation in their own words and it goes in the "Why AI missed it" column unchanged.

If the student cannot explain why, say so plainly and suggest they test the AI again with a sharper prompt, since that experiment is itself useful evidence. Do not fill the gap with a plausible-sounding reason.

**Checkpoint 5 passes when** the total is **more than 40**, every human-added item has the student's own written reason, and each IA still meets the floor.

---

## Phase 6: Execution sheet (student executes)

**Goal:** a sheet ready for the student to run against the SUT across platforms.

Build `checklist.xlsx` (and refresh `checklist.md`) with columns dynamically reflecting the configured platforms:

`ID | Screen | IA | Category | Check | Expected result | Priority | Source | Why AI missed it (human items) | Result: Chrome | Result: Firefox | Result: Safari | Notes | Screenshot ref | Bug ID`

- **Result cells:** Data validation restricted to `Passed` or `Failed` only (starts empty).
- **Multi-platform results:** Task 1 is executed across at least 3 platforms (Task 3). An item can pass in one browser and fail in another.
- **Notes:** Records the reason for each Failure. When failing on multiple platforms, prefix each note with the platform name (e.g., `Firefox: text truncated; Safari: button misaligned`).
- **Screenshot ref:** Reference to the screenshot file in `evidence/screenshots/` (e.g., `FAILED_CART-IA02-03_Firefox.png`). For multiple platforms, list separated by semicolons.
- **Bug ID:** GitHub Issue reference (`#<number>` or issue URL), populated in Phase 7.
- **Summary tab:** Add a second sheet, **Summary**, with formulas calculating Items Designed, Executed, Passed, and Failed per platform.

Tell the student how to name evidence files: `FAILED_<ID>_<platform>.png`, and remind them that screenshots are for **Failed** items only.

**Result rules to share with the student:**

| Situation | Mark it |
|---|---|
| Observed behaviour differs from the expected result | Failed, with a note and screenshot |
| Only part of the expected result is met | Failed, say which part in Notes |
| The item cannot be tested (feature missing, screen blocked by another bug) | Do not mark Passed. Rewrite or replace the item, or fail it with a note if the blocker is itself a defect |
| The item does not apply to this screen | Replace it. There is no N/A state, and N/A would break the count reconciliation |
| A matter of taste with no deviation from the expected result | Passed, with an observation in Notes. Taste belongs in the usability study |

**Checkpoint 6 passes when** every item has a result from the student on every platform they ran, every Failed item has a note and a screenshot reference, and no Result cell was filled by the AI.

---

## Phase 7: Bug issues, summary, and commits

**Goal:** turn failed items into reviewed GitHub Issues with embedded screenshots, generate the cross-platform summary matrix, and provide exact Git commits.

Run this phase after Phase 6 is finished on all platforms, so duplicates across platforms are visible before anything is filed. Issues are hard to undo (they can be closed but not cleanly deleted), so the flow below drafts everything first, files one pilot, and only then files the rest.

**Step 1: Group and draft.** Group the Failed items. The same checklist item failing with the same symptom on several platforms is one bug that lists every affected platform. A different symptom, or a failure specific to one platform, is a separate bug. Show the grouping to the student, then create `bug-drafts/<ID>.md` for each bug from the student's notes.

```markdown
# [<Screen>] <short, specific title>

**Checklist item:** <ID>
**Platforms affected:** <e.g. Chrome, Firefox>
**Environment:** <browser or device, OS version, URL (localhost), build or commit>
**Severity:** <Blocker | Major | Minor | Cosmetic>  (student confirms)

## Steps to reproduce
1. ...

## Expected result
<from the checklist>

## Actual result
<from the student's notes>

## Evidence
![<ID> on <platform>](<commit-pinned screenshot URL, added in step 3>)
```

**Step 2: Student reviews every draft & confirms Severity.**
Guide the student using the course's criticality formula (from lecture §2.9):
$$\text{Criticality} = \text{Severity} \times \text{Probability}$$

- **Blocker:** High criticality. Crash, complete block on user flow (e.g., checkout cannot be submitted).
- **Major:** Significant functional failure, coupon calculation wrong, data loss on input blur.
- **Minor:** Low functional impact, clear workaround available (e.g., focus order skip, minor layout glitch).
- **Cosmetic:** Pure visual defect with no functional impairment (e.g., slight color contrast issue, font size variation).

**Step 3: Push screenshots and embed commit-pinned URLs.**
Embedded images need a URL that works inside the issue, so the screenshots must be committed and pushed to the repository **before** creating issues:

- Confirm target `owner/repo` is the student's own repository (`faker26052005-lgtm/SUT-EShop`).
- Suggest `evidence/screenshots/FAILED_<ID>_<platform>.png` as the path.
- Ask the student to commit and push the screenshots (`docs(evidence): add failed-item screenshots`), or approve the agent doing it.
- Embed each image with a URL pinned to that commit: `![<alt text>](https://github.com/<owner>/<repo>/blob/<commit-sha>/evidence/screenshots/<file>?raw=true)` (or `https://raw.githubusercontent.com/<owner>/<repo>/<commit-sha>/evidence/screenshots/<file>`).
- If public, check screenshots for sensitive personal data before pushing.

**Step 4: Pilot.** Create one issue only. Fetch it back and check the title, labels, body formatting, and that every image renders. Ask the student to open it and confirm. If anything is wrong, fix the draft template before continuing.

**Step 5: Dry run.** List the remaining issues (title, checklist ID, severity, platforms, labels) and wait for student approval.

**Step 6: Create the rest.** File the approved issues one after another with ~1s pause between creations. Stop on the first error and report it.
- Title: `[<Screen>] <short, specific title>`
- Labels: `bug`, severity label, IA tag, platform label.
- Use the `gh` CLI or manual filing as appropriate.

**Step 7: Write back.** Record each issue number and URL in the checklist's Bug ID column, in `checklist.md`, and in the draft file.

**Test Summary & Cross-Platform Matrix.** Write `test-summary.md` containing both the reconciliation table and the Task 3 Cross-Platform Matrix:

```markdown
# Test Summary & Execution Reconciliation

| Metric | Chrome | Firefox | Safari | Total Unique |
|---|---|---|---|---|
| Items Designed | | | | |
| Items Executed | | | | |
| Passed | | | | |
| Failed | | | | |
| Unique Bugs Filed | - | - | - | |

Check: Designed equals Executed, and Executed equals Passed plus Failed per platform.

# Task 3: Cross-Platform Compatibility Findings

| Screen & Item ID | Chrome | Firefox | Safari | Observed Discrepancy / Root Cause |
|---|---|---|---|---|
| `<ID>` | Pass | Fail | Fail | `<e.g. CSS Flex wrap broken in Gecko/WebKit>` |
```

**Commit suggestions.** Write `commit-suggestions.md` with one message per step, following the exact working timeline:

```
docs(checklist): scope screens and map FR/IA
docs(checklist): generate initial AI checklist for <screen>
docs(checklist): review and dedupe AI items
docs(checklist): add human items and rationale
docs(checklist): compile multi-platform execution sheet
test(checklist): execute checklist on chrome
test(checklist): execute checklist on firefox
test(checklist): execute checklist on safari
docs(evidence): add failed-item screenshots
docs(bugs): draft bug reports for failed items
docs(bugs): file github issues and record issue numbers
docs(summary): compile test summary and cross-platform matrix
```

**Checkpoint 7 passes when** counts reconcile, the Cross-Platform Matrix is compiled, every bug has a student-approved GitHub Issue with its embedded screenshot, and issue numbers are recorded in the checklist.

---

## Checkpoint behaviour

At the end of each phase, state which criteria were met and which were not, then ask the student to approve before moving on.

- If any criterion fails, name it exactly, stay in the current phase, and offer to help fix it.
- The student may override a failed gate. Record the override and their reason in `PROGRESS.md`.
- **Audit log reminder.** At the end of every checkpoint, once the student has approved or overridden it, add one line reminding them to run their audit log skill (`hw-ai-audit`) for the AI interactions of that phase.

---

## Reference: taxonomy (from the course guide)

### Mapping to interface aspects

| IA | Taxonomy categories |
|---|---|
| IA-01 General UI standards | Application and GUI standards, color scheme, typography, layout and alignment, labels, consistency across screens, visual integrity (text overflow, distorted images), responsive layout |
| IA-02 Forms | Data validation (EP/BVA boundaries), mandatory fields, incorrect field defaults, field order and Tab sequence, focus on the right object, control state vs. data state, wrong fields retrieved, input constraints |
| IA-03 Navigation | Main menu, breadcrumbs, links and buttons, form navigation, focus order, window or modal behaviour, window system commands (close, back), correct destinations |
| IA-04 Feedback / state | Error messages, success confirmation, loading and empty states, mishandling of server failures, synchronization of window content, currency of data on screen, control state aligned with data state, state transitions |

### The 15 common GUI bugs (use as prompts for items)

1. Data validation missing or wrong (IA-02)
2. Incorrect field default (IA-02)
3. Mishandling of server process failures (IA-04)
4. Mandatory fields that are not mandatory (or the reverse) (IA-02)
5. Wrong fields retrieved by queries (IA-02 / IA-04)
6. Incorrect search criteria (IA-02 / IA-03)
7. Illogical field or Tab order (IA-02 / IA-03)
8. Multiple records returned where one is expected (IA-04)
9. Stale data on screen (currency of data) (IA-04)
10. Window fields not matching the underlying data (IA-04)
11. Wrong window modality (modal vs. modeless) (IA-03)
12. Window system commands unavailable or broken (IA-03)
13. Control state out of line with the data state (IA-04 / IA-02)
14. Focus not placed on the object that needs it (IA-02 / IA-03)
15. Window content out of sync after a change (IA-04)

### Generation angles per IA

**IA-01 General UI standards:** brand colors and contrast of text on background; font family, size, and weight hierarchy; alignment and spacing of the real elements; consistent button styles and iconography with other screens; label wording and capitalization; truncated or overflowing text; image sizing and distortion; behaviour at narrow and wide viewports.

**IA-02 Forms:** for each real field, check label, required marker, input type and keyboard, placeholder vs. label, default value, length and format limits; **apply Equivalence Partitioning (EP) and Boundary Value Analysis (BVA)** (e.g. min/max quantity limits, empty inputs, negative numbers, extreme lengths, special characters, whitespace trimming); validation timing (on blur or on submit); error text and inline position; preserved input after an error; Tab order and autofocus; paste and autofill; double-submit protection.

**IA-03 Navigation:** menu items and their destinations; active-item highlighting; breadcrumb accuracy; link vs. button semantics; back and forward browser behaviour; deep links; logo returns home; behaviour of the cart or account icons; navigation after completing or cancelling an action; modal dismissibility.

**IA-04 Feedback / state:** success and failure messages for each action; loading indicators and progress spinners; empty states (empty cart, no results); **control state alignment with data state** (buttons disabled when action unavailable); **state transitions** (cart item count badge updates, price recalculates immediately); handling server errors or timeouts; order status shown consistently.

### Reference: commonly missed areas (blind spots)

- **Accessibility:** keyboard-only operation, visible focus indicator, color contrast ratios, alt text, form labels tied to inputs, screen-reader names, touch target size
- **Dark mode and theme:** contrast and unreadable text, images or icons with fixed backgrounds
- **Right-to-left (RTL) layout:** mirrored layout, alignment, and icons
- **Localization (Vietnamese context):** diacritics rendering and sorting, long Vietnamese strings, ₫ currency formatting, date and number formats, name field handling
- **Responsive and zoom:** 200 percent browser zoom, landscape orientation, small phones, tablets
- **Input robustness:** emoji, very long input, leading or trailing spaces, pasted text
- **Session and flow edge cases:** refresh mid-flow, browser back after submit, expired session, double-click on submit
- **Network conditions:** slow connection, offline, request timeout behaviour
- **Browser features:** autofill, password managers, tab title and favicon, print layout
- **Platform differences:** Safari form controls, mobile keyboard overlays, Expo Go gestures and safe areas

### Reference: screen map format

```markdown
---
sut: <SUT name>
aliases: [<other names the student might use for the SUT>]
upstream_repo: <upstream course repository URL>
issue_repo: <student bug issue repository URL>
source: <where the mapping came from>
verified: <yes or no, with date>
---

| Screen | Aliases | Pool | Platform | FRs | Elements |
|---|---|---|---|---|---|
| Cart | shopping cart, basket | B | Web (user) | FR-07 | |
```

### Reference: screen context format

```markdown
---
screen: Cart
slug: cart
sut: EShop
platform: Web (user)
captured_at: <commit hash of the SUT you ran, or YYYY-MM-DD>
source: <observed in running app | drafted from code | drafted from screenshot>
---

## Elements
- "Apply coupon" button, below the order summary

## States
| State | Image | Notes |
|---|---|---|
| default | images/cart__default.png | |
| empty | images/cart__empty.png | message shown when the cart has no items |

## Notes (optional)
```
