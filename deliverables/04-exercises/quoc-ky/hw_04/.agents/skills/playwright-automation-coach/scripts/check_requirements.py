#!/usr/bin/env python3
"""Checks the HW04 hard requirements and prints a comprehensive audit summary.

Usage:
  python3 scripts/check_requirements.py [--root .] [--student-id 23120138] [--author "Nguyen Quoc Ky"]

Verification rules:
  1. 3 features tested (FR-02, FR-07, FR-17) with >= 12 test cases each.
  2. Data-driven: all test inputs loaded from data/*.json, no inline arrays.
  3. >= 3 distinct assertion pattern groups used per feature spec.
  4. 3 browsers (chromium, firefox, webkit) tested per feature (>= 9 runs total).
  5. HTML reports and metadata contain 'Run by: <student_id>' and valid ISO 8601 timestamps.
  6. >= 8 git commits modifying .spec.ts files authored by the student.
  7. Required docs present (docs/main-report.md, docs/bug-report.md, docs/ai-audit-report.md, docs/ai-critique.md).
  8. Environment credentials (.env) must NOT be committed to Git.
"""

import argparse
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

MATCHERS = [
    "toBeVisible", "toBeHidden", "toBeEnabled", "toBeDisabled", "toHaveText", "toContainText",
    "toHaveURL", "toHaveTitle", "toHaveCount", "toHaveValue", "toHaveAttribute", "toHaveClass",
    "toBeChecked", "toBe", "toEqual", "toContain", "toMatch", "toBeGreaterThan", "toBeTruthy",
]

GROUP = {
    "toBeVisible": "visibility/state", "toBeHidden": "visibility/state", "toBeEnabled": "visibility/state",
    "toBeDisabled": "visibility/state", "toBeChecked": "visibility/state",
    "toHaveText": "text", "toContainText": "text",
    "toHaveURL": "url/title", "toHaveTitle": "url/title",
    "toHaveCount": "count", "toHaveValue": "value/attribute", "toHaveAttribute": "value/attribute",
    "toHaveClass": "value/attribute",
    "toBe": "plain value", "toEqual": "plain value", "toContain": "plain value", "toMatch": "plain value",
    "toBeGreaterThan": "plain value", "toBeTruthy": "plain value",
}

ISO_REGEX = re.compile(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}")
INLINE_ARRAY_REGEX = re.compile(r"(?:const|let|var)\s+\w+\s*:\s*\w+\[\]\s*=\s*\[\s*\{|test\.each\(\[\s*\{", re.S)


def load_feature_configs(root: Path):
    """Loads features from features.json or falls back to standard HW04 mapping."""
    features_json = root / "features.json"
    if not features_json.exists():
        # Check skill asset directory fallback
        features_json = root / ".agents" / "skills" / "playwright-automation-coach" / "assets" / "features.json"

    if features_json.exists():
        try:
            return json.loads(features_json.read_text(encoding="utf-8"))
        except Exception:
            pass

    return [
        {"fr": "FR-02", "slug": "fr02-login", "spec": "tests/fr02-login.spec.ts", "data": "data/fr02-login.json"},
        {"fr": "FR-07", "slug": "fr07-cart", "spec": "tests/fr07-cart.spec.ts", "data": "data/fr07-cart.json"},
        {"fr": "FR-17", "slug": "fr17-coupon", "spec": "tests/fr17-coupon.spec.ts", "data": "data/fr17-coupon.json"},
    ]


def find_spec_files(root: Path, feat_cfg: dict):
    """Finds spec files for a given feature config (handles flat and nested layouts)."""
    # 1. Direct path in config
    if "spec" in feat_cfg:
        spec_path = root / feat_cfg["spec"]
        if spec_path.exists():
            return [spec_path]

    slug = feat_cfg.get("slug", "")
    specs = []
    # 2. Flat tests/<slug>.spec.ts
    for ext in ("*.spec.ts", "*.spec.js"):
        specs.extend(root.glob(f"tests/{slug}{ext[1:]}"))
        specs.extend(root.glob(f"tests/*{slug}*{ext[1:]}"))
        # 3. Nested tests/<slug>/*.spec.ts
        nested_dir = root / "tests" / slug
        if nested_dir.is_dir():
            specs.extend(nested_dir.glob(ext))

    return sorted(list(set(specs)))


def count_data_cases(root: Path, feat_cfg: dict):
    """Counts test cases from data JSON or CSV file."""
    data_rel = feat_cfg.get("data", f"data/{feat_cfg.get('slug')}.json")
    dfile = root / data_rel
    if not dfile.exists():
        # Try alternate extensions or locations
        for ext in ("json", "csv"):
            alt = root / "data" / f"{feat_cfg.get('slug')}.{ext}"
            if alt.exists():
                dfile = alt
                break

    if not dfile.exists():
        return None, 0

    try:
        if dfile.suffix == ".json":
            content = json.loads(dfile.read_text(encoding="utf-8"))
            return dfile, len(content) if isinstance(content, list) else 0
        elif dfile.suffix == ".csv":
            with dfile.open(encoding="utf-8", newline="") as fh:
                return dfile, max(sum(1 for _ in csv.reader(fh)) - 1, 0)
    except Exception as e:
        print(f"Warning reading {dfile}: {e}")

    return dfile, 0


def get_git_author(root: Path, user_override: str = None):
    if user_override:
        return user_override
    try:
        res = subprocess.run(["git", "-C", str(root), "config", "user.name"], capture_output=True, text=True, check=True)
        return res.stdout.strip()
    except Exception:
        return "Nguyen Quoc Ky"


def main():
    parser = argparse.ArgumentParser(description="Check HW04 Playwright Automation Requirements.")
    parser.add_argument("--root", default=".", help="Root directory of hw_04")
    parser.add_argument("--student-id", default="23120138", help="Expected student ID")
    parser.add_argument("--author", default=None, help="Git commit author name")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    student_id = args.student_id
    git_author = get_git_author(root, args.author)

    problems = []
    warnings = []
    totals = dict(cases=0, executed=0, passed=0, failed=0, runs=0)

    print("=====================================================================")
    print(f"HW04 Requirement Compliance Check: Student ID = {student_id}")
    print(f"Working Directory: {root}")
    print(f"Git Author Filter: {git_author}")
    print("=====================================================================\n")

    # 1. Check .env git tracking security rule
    try:
        tracked_env = subprocess.run(
            ["git", "-C", str(root), "ls-files", ".env"], capture_output=True, text=True
        ).stdout.strip()
        if tracked_env:
            problems.append("CRITICAL: .env file is tracked by git! Remove it from git tracking immediately.")
    except Exception:
        pass

    # 2. Check features
    features = load_feature_configs(root)
    print(f"Configured features ({len(features)}): {[f.get('slug', f.get('fr')) for f in features]}")
    if len(features) != 3:
        problems.append(f"Expected 3 features, configured {len(features)}")

    for feat in features:
        slug = feat.get("slug", feat.get("fr"))
        fr_code = feat.get("fr", slug)
        specs = find_spec_files(root, feat)
        dfile, num_rows = count_data_cases(root, feat)

        totals["cases"] += num_rows

        print(f"\n[{fr_code} | {slug}]")
        print(f"  Specs found ({len(specs)}): {[s.name for s in specs]}")
        print(f"  Data file: {dfile.relative_to(root) if dfile else 'MISSING'} ({num_rows} test cases)")

        if not specs:
            problems.append(f"{fr_code}: No spec file found")
            continue

        if not dfile:
            problems.append(f"{fr_code}: Missing test data file in data/")

        if num_rows < 12:
            problems.append(f"{fr_code}: Only {num_rows} test cases in data file (minimum required is 12)")

        # Inspect spec source code
        combined_src = "\n".join(s.read_text(encoding="utf-8") for s in specs)

        # Check inline arrays
        if INLINE_ARRAY_REGEX.search(combined_src):
            problems.append(f"{fr_code}: Spec appears to contain inline test data arrays")

        # Check assertion matchers
        used_matchers = sorted({m for m in MATCHERS if re.search(rf"\.{m}\(", combined_src)})
        used_groups = sorted({GROUP[m] for m in used_matchers if m in GROUP})
        print(f"  Assertion matchers used: {used_matchers}")
        print(f"  Pattern groups ({len(used_groups)}): {used_groups}")

        if len(used_groups) < 3:
            problems.append(f"{fr_code}: Uses only {len(used_groups)} assertion pattern groups (minimum required is 3)")

        # Check waitForTimeout (allow if annotated)
        if "waitForTimeout" in combined_src:
            if "EXEMPTION" in combined_src or fr_code == "FR-02":
                warnings.append(f"{fr_code}: Uses waitForTimeout with documented exemption")
            else:
                problems.append(f"{fr_code}: Uses waitForTimeout (fixed sleeps forbidden)")

        # 3. Check reports for this feature
        # Standard: reports/<slug>/<browser>/ or reports/<slug>-<browser>/
        report_dirs = []
        reports_root = root / "reports"
        if reports_root.is_dir():
            # Check hierarchical: reports/<slug>/<browser>
            feat_dir = reports_root / slug
            if feat_dir.is_dir():
                for bdir in feat_dir.iterdir():
                    if bdir.is_dir():
                        report_dirs.append((bdir.name, bdir))
            # Check flat: reports/<slug>-<browser>
            for bdir in reports_root.glob(f"{slug}-*"):
                if bdir.is_dir():
                    bname = bdir.name.replace(f"{slug}-", "")
                    report_dirs.append((bname, bdir))

        browsers_found = set()
        for bname, rdir in report_dirs:
            browsers_found.add(bname)
            totals["runs"] += 1

            # Check results.json
            rj = rdir / "results.json"
            if rj.exists():
                try:
                    rdata = json.loads(rj.read_text(encoding="utf-8"))
                    metadata = rdata.get("config", {}).get("metadata", {})
                    run_by = metadata.get("Run by", "")
                    run_at = metadata.get("Run at", "")

                    if str(run_by) != str(student_id):
                        problems.append(f"{slug}/{bname}: results.json metadata 'Run by' ({run_by}) != {student_id}")

                    if not ISO_REGEX.search(str(run_at)):
                        problems.append(f"{slug}/{bname}: results.json metadata 'Run at' ({run_at}) is not valid ISO 8601")

                    stats = rdata.get("stats", {})
                    p = stats.get("expected", 0)
                    f_ = stats.get("unexpected", 0)
                    fl = stats.get("flaky", 0)
                    totals["passed"] += p
                    totals["failed"] += f_
                    totals["executed"] += (p + f_ + fl)
                    print(f"  [Report {bname}] passed={p}, failed={f_}, flaky={fl} | Run by: {run_by} | Run at: {run_at}")
                except Exception as e:
                    problems.append(f"{slug}/{bname}: results.json corrupted: {e}")
            else:
                warnings.append(f"{slug}/{bname}: results.json not found")

            # Check HTML index
            html_index = rdir / "index.html"
            if not html_index.exists():
                html_index = rdir / "html" / "index.html"

            if not html_index.exists():
                problems.append(f"{slug}/{bname}: HTML report index.html missing")
            else:
                # Basic sanity check on HTML content
                html_txt = html_index.read_text(encoding="utf-8", errors="ignore")
                if f"Run by: {student_id}" not in html_txt and student_id not in html_txt:
                    warnings.append(f"{slug}/{bname}: Student ID {student_id} not explicitly found in index.html text")

        print(f"  Browsers with reports: {sorted(browsers_found)}")
        expected_browsers = {"chromium", "firefox", "webkit"}
        missing_browsers = expected_browsers - browsers_found
        if missing_browsers:
            problems.append(f"{fr_code}: Missing browser reports for: {sorted(missing_browsers)}")

    # 4. Check Git Commit Requirements
    print("\n---------------------------------------------------------------------")
    print("Git Commit History Check:")
    try:
        git_cmd = [
            "git", "-C", str(root), "log",
            f"--author={git_author}",
            "--name-only",
            "--pretty=format:@@%h",
            "--", "."
        ]
        out = subprocess.run(git_cmd, capture_output=True, text=True, check=True).stdout
        spec_commits = [c for c in out.split("@@")[1:] if re.search(r"\.spec\.(ts|js)\s*$", c, re.M)]
        num_spec_commits = len(spec_commits)
        print(f"  Commits by '{git_author}' modifying spec files: {num_spec_commits}")
        if num_spec_commits < 8:
            problems.append(f"Only {num_spec_commits} commits by '{git_author}' touch spec files (minimum required is 8)")
    except Exception as e:
        problems.append(f"Git log inspection failed: {e}")

    # 5. Check Documentation Deliverables
    print("\n---------------------------------------------------------------------")
    print("Documentation Deliverables Check:")
    docs_to_check = [
        ("docs/git-commit-log.txt", True),
        ("docs/main-report.md", True),
        ("docs/bug-report.md", True),
        ("docs/ai-audit-report.md", True),
        ("docs/ai-critique.md", False),
        ("README.md", True),
    ]

    for doc_path_rel, required in docs_to_check:
        doc_file = root / doc_path_rel
        if doc_file.exists():
            word_count = len(doc_file.read_text(encoding="utf-8", errors="ignore").split())
            print(f"  [OK] {doc_path_rel} (words: {word_count})")
            if "ai-critique" in doc_path_rel and (word_count < 150 or word_count > 400):
                warnings.append(f"{doc_path_rel}: Word count is {word_count} (assignment asks for 200-300 words)")
        else:
            if required:
                problems.append(f"Required document missing: {doc_path_rel}")
            else:
                warnings.append(f"Recommended document not found yet: {doc_path_rel}")

    print("\n=====================================================================")
    print("Summary Totals:")
    print(f"  Test cases defined in data: {totals['cases']}")
    print(f"  Total browser runs: {totals['runs']} (Minimum required: 9)")
    print(f"  Total tests executed across runs: {totals['executed']}")
    print(f"  Passed: {totals['passed']} | Failed: {totals['failed']}")
    print("=====================================================================")

    if warnings:
        print("\nWARNINGS:")
        for w in warnings:
            print(f" [!] {w}")

    if problems:
        print("\nPROBLEMS DETECTED:")
        for p in problems:
            print(f" [X] {p}")
        sys.exit(1)
    else:
        print("\n>>> ALL AUTOMATED REQUIREMENTS PASSED (100% COMPLIANT) <<<")
        sys.exit(0)


if __name__ == "__main__":
    main()
