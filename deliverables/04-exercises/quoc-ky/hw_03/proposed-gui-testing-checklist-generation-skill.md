---
name: gui-checklist-coach
description: Guides a student through designing, reviewing, and executing a GUI testing checklist (40+ items covering general UI standards, forms, navigation, and feedback/state) for chosen screens of a system under test, such as the EShop web app, admin panel, or mobile app. Produces an Excel checklist, a Markdown copy, bug-report drafts, a test summary, and Git commit suggestions. Use this skill whenever the user mentions a GUI checklist, UI checklist, interface testing checklist, HW03, the weekly GUI or usability assignment, "next screen", checklist for the Cart, Checkout, Admin, or Mobile screens, or pastes a screen description or screenshot and wants test items, even if they do not say "skill" or "checklist" explicitly. Do NOT use it for running the usability sessions (SUS, UEQ-S, participants), which is a separate activity.
---

# GUI Checklist Coach

A workflow for producing a GUI checklist that the student designs, reviews, and executes themselves, with the AI acting as a disciplined assistant. The course (Software Testing, CSC13003) grades the student on the quality of their own review and judgement, and on an honest record of how AI was used. So this skill speeds up the mechanical work and leaves the thinking, the Pass/Fail calls, and the evidence to the human.

## Why the workflow is staged

A single prompt such as "generate a GUI checklist for this app" produces generic, repetitive items and hides the student's contribution. The assignment explicitly rejects that style. Work in the phases below, stop at each checkpoint, and let the student approve before moving on. AI usage logging is handled by a separate audit log skill, so this skill does not keep its own log.

## Configuration (defaults for HW03, edit per assignment)

Before starting, check whether the current assignment differs from these defaults. If the student provides an assignment document, read it and override the values below. If not, confirm the defaults in one short message.

| Setting | Default |
|---|---|
| SUT | EShop (https://github.com/faker26052005-lgtm/SUT-EShop) |
| Screen map folder | `screen-maps/`, one Markdown file per SUT (for EShop: `screen-maps/eshop.md`). See "Screen map lookup" in Phase 1 |
| Screen context folder | `./screen-context/` in the working directory: one description file per screen plus an `images/` subfolder. See "Screen context lookup" in Phase 1 |
| Interface aspects | IA-01 General UI standards, IA-02 Forms, IA-03 Navigation, IA-04 Feedback / state |
| Minimum items | more than 40 (aim for 48 to 60 so rejects during review do not drop the total below the minimum) |
| Suggested floor per IA | about 8 items (a working guideline of this skill, not an assignment rule) |
| Results allowed | Passed or Failed only |
| Screenshots | Failed items only |
| Platforms | at least 3: Chrome, Firefox, and Safari or Android Chrome or Expo Go |
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

Write files to the current working directory, or to `/mnt/user-data/outputs/` when that exists. Use one folder per assignment week and screen group:

```
<week>-gui-checklist/
├── PROGRESS.md            # current phase, decisions, open items (read this first when resuming)
├── checklist.xlsx         # the main deliverable
├── checklist.md           # Markdown copy for the report
├── test-summary.md        # counts for the README
├── commit-suggestions.md  # one message per phase
└── bug-drafts/            # one .md per bug (failures grouped across platforms)
```

When the student returns in a later session, read `PROGRESS.md` and resume at the recorded phase rather than starting over. When creating the `.xlsx`, read the xlsx skill first if one is available.

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

## Phase 2: Seed the taxonomy

**Goal:** ground the generation in the course material rather than the model's generic habits.

Load the taxonomy in the "Reference: taxonomy" section below and select the categories relevant to the chosen screens. Show the student the selected categories grouped by IA, and ask whether any are irrelevant to their screens.

**Checkpoint 2 passes when** every IA has at least one relevant category.

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

**Checkpoint 3 passes when** all fields are filled for every item and each IA is represented at or above the floor.

## Phase 4: Review and deduplicate (student-led)

**Goal:** make the student the author of the final list.

Present items in small groups per IA and ask the student to give a verdict on each: **Keep**, **Edit** (with their revised wording), or **Reject** (with a reason: duplicate, untestable, not applicable, or out of scope). While reviewing, flag for their attention:

- Near-duplicates (same element, same expected result, different wording)
- Vague or untestable expected results
- Items that test business logic rather than the interface
- Generic items that do not name a real element

Update the checklist with their decisions. Record rejects and their reasons in `PROGRESS.md`; they help the student explain their choices in an oral defense.

**Checkpoint 4 passes when** every AI item has a verdict, no duplicates remain unresolved, and every kept item has a testable expected result.

## Phase 5: Gap analysis (the human adds what the AI missed)

**Goal:** the assignment requires the student to add items the AI missed and explain why it missed them.

1. Show the blind-spot list from the reference section and ask which areas apply to the chosen screens. This is a prompt for the student's thinking, so keep it as a menu rather than a finished answer.
2. Help the student word the new items so they meet the same field and testability rules. Mark each as `Source: Human`.
3. For each human-added item, ask the student why the AI missed it. Offer these as reasoning categories to think with, never as the answer: quality of the input prompt, limitation of the AI model, or a characteristic of the specific interface. The student writes the explanation in their own words and it goes in the "Why AI missed it" column unchanged.

If the student cannot explain why, say so plainly and suggest they test the AI again with a sharper prompt, since that experiment is itself useful evidence. Do not fill the gap with a plausible-sounding reason.

**Checkpoint 5 passes when** the total is **more than 40**, every human-added item has the student's own written reason, and each IA still meets the floor.

## Phase 6: Execution sheet (student executes)

**Goal:** a sheet ready for the student to run against the SUT.

Build `checklist.xlsx` (and refresh `checklist.md`) with these columns:

`ID | Screen | IA | Category | Check | Expected result | Priority | Source | Why AI missed it (human items) | Result: Platform 1 | Result: Platform 2 | Result: Platform 3 | Notes | Screenshot ref | Bug ID`

- Result cells accept only `Passed` or `Failed` (add data validation) and start empty.
- The assignment requires Task 1 to be repeated on at least three platforms in Task 3, so the sheet carries one result column per platform. An item can pass in one browser and fail in another.
- Notes records the reason for each Failure. Prefix each note with the platform, for example `Safari: error text overflows the card`.
- Add a second sheet, **Summary**, with formulas for items designed, executed, passed, and failed per platform.

Tell the student how to name evidence files, for example `FAILED_CART-IA02-03_Firefox.png`, and remind them that screenshots are for **Failed** items only.

**Result rules to share with the student:**

| Situation | Mark it |
|---|---|
| Observed behaviour differs from the expected result | Failed, with a note and screenshot |
| Only part of the expected result is met | Failed, say which part in Notes |
| The item cannot be tested (feature missing, screen blocked by another bug) | Do not mark Passed. Rewrite or replace the item, or fail it with a note if the blocker is itself a defect |
| The item does not apply to this screen | Replace it. There is no N/A state, and N/A would break the count reconciliation |
| A matter of taste with no deviation from the expected result | Passed, with an observation in Notes. Taste belongs in the usability study |

Severity (Blocker, Major, Minor, Cosmetic) is separate from the result and belongs in the bug report.

**Checkpoint 6 passes when** every item has a result from the student on every platform they ran, every Failed item has a note and a screenshot reference, and no Result cell was filled by the AI. If the student has not yet run all three platforms, record which are pending and do not block progress on the platforms completed.

## Phase 7: Bug issues, summary, and commits

**Goal:** turn failed items into reviewed GitHub Issues with embedded screenshots, then close the loop.

Run this phase after Phase 6 is finished on every platform the student ran, so duplicates across platforms are visible before anything is filed. Issues are hard to undo (they can be closed but not cleanly deleted), so the flow below drafts everything first, files one pilot, and only then files the rest.

**Step 1: Group and draft.** Group the Failed items. The same checklist item failing with the same symptom on several platforms is one bug that lists every affected platform. A different symptom, or a failure specific to one platform, is a separate bug. Show the grouping to the student, then create `bug-drafts/<ID>.md` for each bug from the student's notes. Do not add details they did not observe.

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

**Step 2: Student reviews every draft.** The student confirms the title, severity, steps, platforms, and screenshot for each bug. Severity is their call, not the AI's.

**Step 3: Push the screenshots and embed them.** Embedded images need a URL that works inside the issue, so the screenshots must be committed and pushed to the repository where the issues will be filed.

- Ask once for the target `owner/repo`, and confirm it is the student's own repository, not the course's.
- Suggest `evidence/screenshots/FAILED_<ID>_<platform>.png` as the path.
- Ask the student to commit and push the screenshots, or to approve the agent doing it, before any issue is created.
- Embed each image with a URL pinned to that commit: `![<alt text>](https://github.com/<owner>/<repo>/blob/<commit-sha>/evidence/screenshots/<file>?raw=true)`. A commit-pinned URL keeps working if the branch moves or the file is renamed later, and a relative path does not render reliably inside an issue.
- If the repository is public, remind the student to check each screenshot for personal information before pushing.
- Tell the student once that these are embedded images, not uploaded attachments, and suggest confirming with the TA that this satisfies "attach a screenshot to each issue".

**Step 4: Pilot.** Create one issue only. If the tools allow, fetch it back and check the title, labels, body formatting, and that every image renders, then ask the student to open it and confirm. If anything is wrong, fix the draft template before creating any more.

**Step 5: Dry run.** List the remaining issues (title, checklist ID, severity, platforms, labels) and wait for the student's approval of the list.

**Step 6: Create the rest.** File the approved issues one after another, pausing about a second between creations, because GitHub throttles rapid content creation. Stop at the first error and report it. Before retrying a failed creation, search the repository's issues for that title, so a retry cannot create a duplicate.

- Use the title `[<Screen>] <short, specific title>`.
- Use the labels `bug`, a severity label, the IA tag, and a platform label. Use labels that already exist and ask before creating missing ones.
- Use whatever GitHub access the environment provides (the `gh` CLI or a GitHub connector). If there is none, give the student ready-to-paste issue bodies and have them file them in the same order, pilot first.

**Step 7: Write back.** Record each issue number and URL in the checklist's Bug ID column, in `checklist.md`, and in the draft file. Remind the student that bugs must appear both in the Markdown report and on their GitHub Issues page, and that creating issues through an agent is AI use, so it belongs in this phase's audit log reminder.

**Test summary.** Write `test-summary.md` for the README:

```markdown
| Metric | Value |
|---|---|
| Screens tested | |
| Checklist items designed | |
| Items executed (per platform) | |
| Passed (per platform) | |
| Failed (per platform) | |
| Bugs reported | |
| Participants | (filled in by the usability activity) |
| Demo videos | (student adds links) |
```

Check that the figures reconcile: designed equals executed, and executed equals passed plus failed, for each platform. If they do not, list the mismatches and let the student resolve them.

**Commit suggestions.** Write `commit-suggestions.md` with one message per phase, since the assignment asks for a commit for each testing step:

```
docs(checklist): scope screens and map FR/IA
docs(checklist): generate initial AI checklist for <screen>
docs(checklist): review and dedupe AI items
docs(checklist): add human items and rationale
test(checklist): execute checklist on <platform>
docs(bugs): draft bug reports for failed items
docs(evidence): add failed-item screenshots
docs(bugs): file GitHub issues and record issue numbers
docs(summary): compile test summary
```

The student makes the commits. Remind them to export the Git log as a text file for submission.

**Checkpoint 7 passes when** the counts reconcile, every bug has a student-approved GitHub Issue with its embedded screenshot (or a filing the student confirms they made by hand), and the issue numbers are recorded in the checklist.

---

## Checkpoint behaviour

At the end of each phase, state which criteria were met and which were not, then ask the student to approve before moving on.

- If any criterion fails, name it exactly, stay in the current phase, and offer to help fix it.
- The student may override a failed gate. Record the override and their reason in `PROGRESS.md`, because they are accountable for the final result.
- Some criteria can only be verified for existence (a reason is written, a screenshot is referenced), not for quality. Say so when relevant, since quality is the student's responsibility.
- **Audit log reminder.** At the end of every checkpoint, once the student has approved or overridden it, add one line reminding them to run their audit log skill for the AI interactions of that phase, for example: "Before moving on, run your audit log skill for this phase so the prompts and full outputs are saved word for word." Do it after each phase rather than once at the end, because earlier prompts and outputs can become hard to retrieve verbatim in a long conversation. This skill never writes or runs the log itself. Skip the reminder for a phase in which no AI was used, and do not repeat it if the student says the phase is already logged.

## Evidence and integrity rules

- Cross-platform screenshots, participant data, and execution results must come from the student's real runs. Never generate, edit, or suggest fabricating them.
- Screenshots in Task 3 must show the browser, OS, or device alongside the localhost URL, plus the student's identity overlay. The assignment text names this overlay two ways (student email in one section, student ID and full name in another), so tell the student to confirm the exact form with the TA, or include both.
- Build prompts and items from the student's own screens and words. Copying between students, including prompts, scores zero for both, so do not reuse another student's checklist or paste prior-student material into this one.

---

## Reference: taxonomy (from the course guide)

Use these categories as the seed. They come from the lecture's low-level checklist testing, navigation testing, and common GUI bug list.

### Mapping to interface aspects

| IA | Taxonomy categories |
|---|---|
| IA-01 General UI standards | Application and GUI standards, color scheme, typography, layout and alignment, labels, consistency across screens, visual integrity (text overflow, distorted images), responsive layout |
| IA-02 Forms | Data validation, mandatory fields, incorrect field defaults, field order and Tab sequence, focus on the right object, control state vs. data state, wrong fields retrieved, input constraints |
| IA-03 Navigation | Main menu, breadcrumbs, links and buttons, form navigation, focus order, window or modal behaviour, window system commands (close, back), correct destinations |
| IA-04 Feedback / state | Error messages, success confirmation, loading and empty states, mishandling of server failures, synchronization of window content, currency of data on screen, control state aligned with data state, state transitions |

### The 15 common GUI bugs (use as prompts for items)

1. Data validation missing or wrong
2. Incorrect field default
3. Mishandling of server process failures
4. Mandatory fields that are not mandatory (or the reverse)
5. Wrong fields retrieved by queries
6. Incorrect search criteria
7. Illogical field or Tab order
8. Multiple records returned where one is expected
9. Stale data on screen (currency of data)
10. Window fields not matching the underlying data
11. Wrong window modality (modal vs. modeless)
12. Window system commands unavailable or broken
13. Control state out of line with the data state
14. Focus not placed on the object that needs it
15. Window content out of sync after a change

### Generation angles per IA

**IA-01 General UI standards:** brand colors and contrast of text on background; font family, size, and weight hierarchy; alignment and spacing of the real elements; consistent button styles and iconography with other screens; label wording and capitalization; truncated or overflowing text; image sizing and distortion; behaviour at narrow and wide viewports.

**IA-02 Forms:** for each real field, check label, required marker, input type and keyboard, placeholder vs. label, default value, length and format limits, validation timing (on blur or on submit), error text and position, preserved input after an error, Tab order, autofocus, paste and autofill, disabled and enabled submit states, double-submit protection.

**IA-03 Navigation:** menu items and their destinations, active-item highlighting, breadcrumb accuracy, link vs. button semantics, back and forward browser behaviour, deep links, logo returns home, behaviour of the cart or account icons, navigation after completing or cancelling an action.

**IA-04 Feedback / state:** success and failure messages for each action, wording and placement, loading indicators, empty states (empty cart, no results), disabled controls when an action is unavailable, state after server errors or timeouts, badge or counter updates (cart count), data refreshed after an edit, order status shown consistently.

### Reference: commonly missed areas (blind spots)

Offer these to the student in Phase 5 as areas to consider. Tell them which are plausible for the chosen screens and which are probably irrelevant.

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

Use this format for every file in `screen-maps/`, so lookups work the same way for any SUT.

```markdown
---
sut: <SUT name>
aliases: [<other names the student might use for the SUT>]
repo: <repository URL>
source: <where the mapping came from>
verified: <yes or no, with date>
---

| Screen | Aliases | Pool | Platform | FRs | Elements |
|---|---|---|---|---|---|
| Cart | shopping cart, basket | B | Web (user) | FR-07 | |
```

- One row per screen. `Aliases` lets the lookup match the names students actually use.
- `FRs` lists the requirement codes the screen covers, or `none assigned`. Mark guesses as "assumed".
- `Elements` is optional. Real element names belong in the screen context folder, so use this column only as a short fallback, and leave it empty rather than guessing.
- Do not list IA-01 to IA-04 per row, since they apply to every screen.

### Reference: screen context format

One file per screen in `./screen-context/`, named `<slug>.md`. A copy-ready `_template.md` is provided next to this skill.

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

- `screen` should match the Screen column in the screen map, so the two lookups agree.
- `captured_at` drives the staleness question. Use the commit hash of the version you ran when you can.
- `source` marks how much to trust the description. Observed in the running app is the strongest.
- Name images `<slug>__<state>.png`, so an image identifies its screen even if the description file is missing.
- List only states you captured. Leave the image cell empty for a state you have not captured yet.
