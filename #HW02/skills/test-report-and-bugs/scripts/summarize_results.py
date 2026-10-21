#!/usr/bin/env python3
"""Summarise an execution-results table and cross-check it.

Usage: python summarize_results.py results.md [--design design.md]

Reads every markdown table that has a 'Verdict' column (the Postman report or the
results table of a report), counts PASS / FAIL / CẦN LÀM RÕ / ERROR, compares with the
totals written in the file (if any) and flags:
  - FAIL rows without a bug id when a 'Bug' column exists,
  - bug ids used in the table but absent from a bug-grouping table,
  - CẦN LÀM RÕ rows that carry a bug id (a clarification is not a bug),
  - (with --design) tests in the design that were never executed.
"""
import re, sys, collections


def clean(s):
    return re.sub(r"[*`]", "", s).strip()


def cells(line):
    line = line.strip()
    if not line.startswith("|"):
        return None
    return [clean(c) for c in re.split(r"(?<!\\)\|", line.strip("|"))]


def norm(v):
    v = v.upper().replace("Ầ", "A").replace("Ế", "E")
    if v.startswith("PASS"):
        return "PASS"
    if v.startswith("FAIL"):
        return "FAIL"
    if "CLARIFY" in v or v.startswith("CAN LAM RO") or "LÀM RÕ" in v.upper() or "LAM RO" in v:
        return "CLARIFY"
    if v.startswith("ERROR") or "LỖI" in v.upper():
        return "ERROR"
    return None


def main(path, design=None):
    text = open(path, encoding="utf-8").read().replace("\r", "")
    rows, bug_ids_group = [], set()
    header, prev = None, None
    for line in text.split("\n"):
        c = cells(line)
        if c is None:
            header = None
            prev = None
            continue
        if all(re.fullmatch(r":?-+:?", x.replace(" ", "")) or x == "" for x in c):
            header = prev
            continue
        prev = c
        if not header:
            continue
        hl = [h.lower() for h in header]
        if "verdict" in hl and re.match(r"^(DT|BV|BL|AC)-\d+", c[0]):
            d = dict(zip(hl, c))
            rows.append(d | {"_id": c[0], "_verdict": norm(d.get("verdict", ""))})
        if header and header[0].lower().startswith("bug id"):
            bug_ids_group.add(c[0])

    if not rows:
        print("no results table with a 'Verdict' column found")
        return 2
    cnt = collections.Counter(r["_verdict"] or "UNKNOWN" for r in rows)
    n = len(rows)
    print(f"{n} executed tests")
    for k in ("PASS", "FAIL", "CLARIFY", "ERROR", "UNKNOWN"):
        if cnt[k]:
            print(f"  {k:8} {cnt[k]:3}  ({100*cnt[k]/n:.1f}%)")
    problems = []
    ids = [r["_id"] for r in rows]
    for i in {i for i in ids if ids.count(i) > 1}:
        problems.append(f"{i} appears more than once in the results")

    m = re.search(r"Tổng ca test[^|]*\|\s*\**(\d+)", text)
    if m and int(m.group(1)) != n:
        problems.append(f"summary says {m.group(1)} tests but the table has {n}")
    for label, key in (("Passed", "PASS"), ("Failed", "FAIL"), ("CẦN LÀM RÕ", "CLARIFY")):
        m = re.search(rf"\|\s*\**{label}[^|]*\|\s*\**(\d+)", text)
        if m and int(m.group(1)) != cnt[key]:
            problems.append(f"summary says {label} = {m.group(1)} but the table has {cnt[key]}")

    bug_col = next((k for k in rows[0] if k.startswith("bug")), None)
    used = set()
    for r in rows:
        b = r.get(bug_col, "") if bug_col else ""
        bugs = re.findall(r"[A-Z]+-\d+-BUG-\d+", b)
        used.update(bugs)
        if bug_col and r["_verdict"] == "FAIL" and not bugs:
            problems.append(f"{r['_id']} is FAIL but has no bug id")
        if r["_verdict"] == "CLARIFY" and bugs:
            problems.append(f"{r['_id']} is CẦN LÀM RÕ but is linked to {bugs[0]} (a clarification is not a bug)")
        if r["_verdict"] == "PASS" and bugs:
            problems.append(f"{r['_id']} is PASS but is linked to {bugs[0]}")
    if bug_ids_group and used - bug_ids_group:
        problems.append(f"bug ids used in the table but not grouped: {sorted(used - bug_ids_group)}")

    if design:
        dtext = open(design, encoding="utf-8").read()
        designed = set(re.findall(r"^\|\s*\**((?:DT|BV|BL|AC)-\d+)\**\s*\|", dtext, re.M))
        missing = sorted(designed - set(ids))
        if missing:
            print(f"designed but not executed ({len(missing)}): {', '.join(missing)}")

    fails = [r["_id"] for r in rows if r["_verdict"] == "FAIL"]
    print("FAIL ids:", ", ".join(fails) or "-")
    print("CẦN LÀM RÕ ids:", ", ".join(r["_id"] for r in rows if r["_verdict"] == "CLARIFY") or "-")
    for p in problems:
        print("PROBLEM:", p)
    print("RESULT:", "CONSISTENT" if not problems else f"{len(problems)} problem(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    args = sys.argv[1:]
    des = args[args.index("--design") + 1] if "--design" in args else None
    sys.exit(main(args[0], des))
