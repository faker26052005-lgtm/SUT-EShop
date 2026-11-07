# Git Commit Suggestions – HW03 GUI Testing Checklist

Follow the 1-step-per-commit discipline for the GUI testing checklist procedure:

```bash
# Phase 1: Scope and mapping
git add screen-maps/eshop.md screen-context/
git commit -m "docs(checklist): scope screens and map FR/IA"

# Phase 3: Initial AI checklist generation
git add hw03-gui-checklist/checklist_draft_p3_p5.md
git commit -m "docs(checklist): generate initial AI checklist for cart and checkout"

# Phase 4: Review and deduplication
git add hw03-gui-checklist/PROGRESS.md
git commit -m "docs(checklist): review and dedupe AI items"

# Phase 5: Gap analysis (human items)
git add hw03-gui-checklist/checklist_draft_p3_p5.md hw03-gui-checklist/PROGRESS.md
git commit -m "docs(checklist): add human items and rationale"

# Phase 6: Compile execution sheet
git add hw03-gui-checklist/checklist.xlsx hw03-gui-checklist/checklist.md hw03-gui-checklist/commit-suggestions.md
git commit -m "docs(checklist): compile multi-platform execution sheet"

# Phase 6: Multi-platform execution runs
git commit -m "test(checklist): execute checklist on chrome"
git commit -m "test(checklist): execute checklist on firefox"
git commit -m "test(checklist): execute checklist on safari"

# Phase 7: Evidence screenshots
git add evidence/screenshots/
git commit -m "docs(evidence): add failed-item screenshots"

# Phase 7: Bug drafting & issues
git add hw03-gui-checklist/bug-drafts/
git commit -m "docs(bugs): draft bug reports for failed items"
git commit -m "docs(bugs): file github issues and record issue numbers"

# Phase 7: Summary and cross-platform matrix
git add hw03-gui-checklist/test-summary.md README.md
git commit -m "docs(summary): compile test summary and cross-platform matrix"
```
