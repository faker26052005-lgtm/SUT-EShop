#!/usr/bin/env python3
"""Consistency checker for a test-design markdown file (domain testing + BVA).

Usage: python check_design.py FRxx_test_design.md [--strict]

Errors (exit code 1):  duplicate test IDs in one section, requirement codes that are
not defined, expectations outside the fixed vocabulary, equivalence classes that no DT
test covers, final-list IDs that were never defined.
Warnings: missing columns, BV rows presenting an assumed limit as fact.
"""
import re, sys, collections

FORMS = [
    r"^(2xx|\d{3}(/\d{3})*) và dữ liệu được lưu đúng",
    r"^(4xx|\d{3}(/\d{3})*) và dữ liệu không đổi",
    r"^CẦN LÀM RÕ",
    r"^UI:",
]
TEST_ID = re.compile(r"^(DT|BV|BL|AC)-\d+$")
REQ_REF = re.compile(r"\b(R\d+|SEC-\d+)\b")
CLASS_ID = re.compile(r"\bC\d+\.\d+\b")


def clean(s):
    return re.sub(r"[*`]", "", s).strip()


def split_row(line):
    line = line.strip()
    if not line.startswith("|"):
        return None
    parts = re.split(r"(?<!\\)\|", line.strip("|"))
    return [clean(p) for p in parts]


def main(path):
    text = open(path, encoding="utf-8").read().replace("\r", "")
    lines = text.split("\n")
    errors, warns = [], []

    section = ""
    header = None
    prev_cells = None
    defined_req = set()
    other_text = []          # lines that are not test rows (for SEC / class definitions)
    tests = []               # (section, id, row dict, lineno)
    ref_rows = []            # rows that only reference tests (e.g. the DT/BV overlap table)
    dropped = set()          # tests the design says to drop ("loại BV-07")
    class_defined, class_covered = set(), set()

    for no, raw in enumerate(lines, 1):
        if raw.startswith("## "):
            section = raw[3:].strip()
        cells = split_row(raw)
        if cells is None:
            header = None if not raw.strip().startswith("|") else header
            prev_cells = None
            other_text.append(raw)
            m = re.match(r"^[\s\-*]*\**(C\d+\.\d+)\b", raw)
            if m:
                class_defined.add(m.group(1))
            continue
        if all(re.fullmatch(r":?-+:?", c.replace(" ", "")) or c == "" for c in cells):
            header = prev_cells          # separator row: previous row is the header
            continue
        prev_cells = cells
        first = cells[0] if cells else ""
        if TEST_ID.match(first):
            row = {}
            if header:
                for i, h in enumerate(header):
                    if i < len(cells):
                        row[h] = cells[i]
            row["_cells"] = cells
            is_final = any(m in section.lower() for m in ("cuối cùng", "final"))
            has_exp = any(h.lower().startswith(("kỳ vọng", "ky vong", "expected")) for h in (header or []))
            if header and not has_exp and not is_final:
                ref_rows.append((first, no))      # reference row, not a definition
                for m in re.findall(r"loại\s+((?:DT|BV|BL|AC)-\d+)", cells[-1], re.I):
                    dropped.add(m)
                continue
            tests.append((section, first, row, no))
            continue
        other_text.append(raw)
        if header and header[0].lower().startswith("mã") and re.fullmatch(r"R\d+|SEC-\d+", first):
            defined_req.add(first)
        m = re.match(r"^(C\d+\.\d+)\b", first)
        if m:
            class_defined.add(m.group(1))

    for t in other_text:
        for s in re.findall(r"SEC-\d+", t):
            defined_req.add(s)

    def find_col(row, *names):
        for k, v in row.items():
            kl = k.lower()
            if any(kl.startswith(n) for n in names):
                return v
        return None

    final_markers = ("cuối cùng", "final")
    defined_ids = set()
    seen = collections.defaultdict(set)
    counts = collections.Counter()
    for sec, tid, row, no in tests:
        is_final = any(m in sec.lower() for m in final_markers)
        if is_final:
            continue
        if tid in seen[sec]:
            errors.append(f"line {no}: duplicate test ID {tid} in section '{sec}'")
        seen[sec].add(tid)
        defined_ids.add(tid)

        exp = find_col(row, "kỳ vọng", "ky vong", "expected")
        if exp is None:
            warns.append(f"line {no}: {tid} has no 'Kỳ vọng' column")
        else:
            counts[tid.split("-")[0] + ("/CLARIFY" if exp.startswith("CẦN LÀM RÕ") else "")] += 1
            if not any(re.match(p, exp) for p in FORMS):
                errors.append(f"line {no}: {tid} expectation outside the fixed vocabulary: '{exp[:60]}'")

        req = find_col(row, "mã yc", "mã yêu cầu", "req")
        if req is None:
            warns.append(f"line {no}: {tid} has no requirement-code column")
        else:
            refs = REQ_REF.findall(req)
            if not refs:
                warns.append(f"line {no}: {tid} has no requirement code")
            for r in refs:
                if r not in defined_req:
                    errors.append(f"line {no}: {tid} cites {r}, which is not defined in the requirement tables")

        cls = find_col(row, "lớp", "lop", "class")
        if tid.startswith("DT") and cls:
            class_covered.update(CLASS_ID.findall(cls))

        if tid.startswith("BV") and exp and not exp.startswith("CẦN LÀM RÕ"):
            if "giả định" in " ".join(row["_cells"]).lower():
                warns.append(f"line {no}: {tid} relies on an assumed limit but has a definite expectation")

    for sec, tid, row, no in tests:
        if any(m in sec.lower() for m in final_markers):
            if tid not in defined_ids:
                errors.append(f"line {no}: final list contains {tid}, which was never defined")
            if tid in dropped:
                errors.append(f"line {no}: final list still contains {tid}, which the overlap table drops")
    for tid, no in ref_rows:
        if tid not in defined_ids:
            errors.append(f"line {no}: {tid} is referenced but never defined")

    for c in sorted(class_defined - class_covered, key=lambda x: [int(n) for n in x[1:].split(".")]):
        errors.append(f"class {c} has no DT test")

    print(f"{path}: {len(defined_ids)} tests, {len(defined_req)} requirement codes, {len(class_defined)} classes")
    print("expectation counts:", dict(counts))
    for w in warns:
        print("WARNING:", w)
    for e in errors:
        print("ERROR:", e)
    print("RESULT:", "FAIL" if errors else "OK")
    return 1 if errors else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
