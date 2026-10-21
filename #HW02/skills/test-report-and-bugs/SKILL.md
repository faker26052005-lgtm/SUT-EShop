---
name: test-report-and-bugs
description: Turn Postman PASS/FAIL/CẦN LÀM RÕ results into the final report - results table, bugs grouped by root cause with severity and SRS clause, stats, clarifications. Use for results.md, bug report.
---

# Test report and bug grouping

## Principles
- Verdict meanings are fixed: **PASS** = matches the SRS; **FAIL** = contradicts an SRS clause; **CẦN LÀM RÕ** = the SRS is silent, so it is neither pass nor fail and is never counted as a bug. `ERROR` = the test script itself broke; fix the script, do not report it as a system bug.
- A bug is a *root cause*, not a symptom. Several red tests that come from one defect are one bug.
- A bug must cite the SRS clause it violates (requirement code or SEC item). "API convention", "best practice" or "schema validation" is not an SRS clause: if that is the only basis, the case belongs in the clarification list.

## Procedure
1. **Collect results.** Input: the Postman report (markdown table or run output), the design file, environment (OS, SUT, tool, collection name, run time). If the person pastes only a screenshot or run log, extract ID, HTTP code, verdict and observation per test.
2. **Check consistency:** `python scripts/summarize_results.py results.md [--design design.md]` — counts verdicts, compares them with totals written in the report, flags FAIL rows without a bug, clarifications wrongly linked to bugs, duplicate IDs, and designed tests that were never executed. Report designed-but-not-executed tests openly (explain or run them).
3. **Challenge every FAIL before filing it.** For each red test ask: (a) does the expectation rest on an SRS clause, or on an assumption (type of an ignored field, an invented limit)? If assumption → reclassify as CẦN LÀM RÕ. (b) Could the test itself be wrong — wrong expected number, residue from earlier tests, a precondition that was not built, a derived value the test computed from client-sent data while the backend may legitimately use server-side data (e.g. prices from the product table)? Check with one extra read call before concluding. (c) Is the failure caused by the same defect as another red test? Group them.
4. **Group into bugs** (`FR-XX-BUG-NN`), table: Bug ID | root cause (one sentence of cause, not symptom) | tests | severity | SRS clause violated. Severity rubric in `references/report-template.md`.
5. **Write the report** with the layout in `references/report-template.md`: environment, how to run, results table (ID, HTTP, verdict, observation, side effect, bug), bug grouping, summary, clarification appendix (one row per CẦN LÀM RÕ topic with what the system does now, the tester's temporary assumption, and status "Chưa hỏi/Đã hỏi").
6. Re-run the script on the final file; fix every PROBLEM line.

## Writing the appendix
Merge clarifications by *question*, not by test: five tests about "empty address, spaces, null" are one question with several observed behaviours. Do not list as a question something the SRS already answers (for example a client-sent value the SRS says is ignored).

## Deliver
`FRxx_results.md` (report) and, when asked, one bug write-up per bug: title, steps to reproduce (the `FR-XX-BUG-NNx` Postman requests), expected (quote the SRS clause), actual, severity, evidence to attach.
