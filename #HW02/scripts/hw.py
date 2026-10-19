#!/usr/bin/env python3
"""Công cụ hỗ trợ HW02 (chỉ dùng thư viện chuẩn của Python 3).

  python3 scripts/hw.py new-feature FR-09 "Mã giảm giá" B
  python3 scripts/hw.py new-entry   FR-09 "Bước 3 - lớp tương đương" --tool "Claude Sonnet 5.5"
  python3 scripts/hw.py build-report
  python3 scripts/hw.py check
  python3 scripts/hw.py package 25127001 090
"""
import argparse
import datetime
import re
import shutil
import subprocess
import sys
import unicodedata
import zipfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT = Path(__file__).resolve().parent.parent
TPL_FEATURE = ROOT / "templates" / "feature"
ENTRY_TPL = ROOT / "ai_audit" / "ENTRY_TEMPLATE.md"
AUDIT = ROOT / "ai_audit" / "00_AI_AUDIT_REPORT.md"
CRITIQUE = ROOT / "ai_audit" / "AI_CRITIQUE.md"
ORDER = [
    "01_requirements.md", "02_variables.md", "03_domain_testing.md",
    "04_boundary_value_analysis.md", "05_business_security_tests.md",
    "06_execution_and_results.md", "07_root_cause_grouping.md",
    "08_ai_gap_analysis.md", "09_test_summary.md", "clarifications.md",
]


def norm_fr(s):
    m = re.fullmatch(r"(?i)fr-?(\d{1,2})", s.strip())
    if not m:
        sys.exit("Mã feature phải có dạng FR-09 (hoặc fr09).")
    return "FR-%02d" % int(m.group(1))


def slugify(s):
    s = s.replace("đ", "d").replace("Đ", "D")
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "step"


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, t):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(t, encoding="utf-8")


def cmd_new_feature(a):
    fr = norm_fr(a.fr)
    dest = ROOT / "features" / fr
    if dest.exists():
        sys.exit("%s đã tồn tại." % dest)
    shutil.copytree(TPL_FEATURE, dest)
    for p in dest.rglob("*.md"):
        t = read(p)
        t = t.replace("{{FR_ID}}", fr).replace("{{FEATURE_NAME}}", a.name).replace("{{POOL}}", a.pool)
        write(p, t)
    for extra in (ROOT / "evidence" / fr, ROOT / "ai_audit" / "entries" / fr, ROOT / "tests" / "postman" / fr):
        extra.mkdir(parents=True, exist_ok=True)
        (extra / ".gitkeep").touch()
    print("Đã tạo features/%s/ (+ evidence, ai_audit/entries, tests/postman)." % fr)
    print("Bước tiếp theo: điền 01_requirements.md, commit: docs(%s): extract requirements" % fr)


def cmd_new_entry(a):
    fr = norm_fr(a.fr)
    d = ROOT / "ai_audit" / "entries" / fr
    d.mkdir(parents=True, exist_ok=True)
    n = len(list(d.glob("*.md"))) + 1
    entry_id = "%s-%02d" % (fr, n)
    now = datetime.datetime.now().astimezone()
    stamp = now.strftime("%Y-%m-%d %H:%M:%S (UTC%z)")
    tool = a.tool or "TODO: tên công cụ + model"
    fname = "%02d_%s.md" % (n, slugify(a.step))
    t = read(ENTRY_TPL)
    for k, v in (("{{ENTRY_ID}}", entry_id), ("{{FR_ID}}", fr), ("{{STEP}}", a.step),
                 ("{{TOOL}}", tool), ("{{DATETIME}}", stamp)):
        t = t.replace(k, v)
    write(d / fname, t)
    row = "| %s | %s | %s | %s – %s | [entry](entries/%s/%s) |\n" % (entry_id, stamp, tool, fr, a.step, fr, fname)
    audit = read(AUDIT)
    marker = "<!-- ENTRIES -->"
    if marker in audit:
        audit = audit.replace(marker, row + marker)
        write(AUDIT, audit)
    print("Đã tạo ai_audit/entries/%s/%s (ngày giờ: %s)." % (fr, fname, stamp))
    print("Dán prompt + output gốc vào file đó ngay bây giờ.")


def feature_dirs():
    base = ROOT / "features"
    return sorted(p for p in base.glob("FR-*") if p.is_dir()) if base.exists() else []


def cmd_build_report(_):
    parts = [read(ROOT / "report" / "00_main_report_intro.md")]
    dirs = feature_dirs()
    if not dirs:
        print("Chưa có feature nào trong features/.")
    for d in dirs:
        for name in ORDER:
            f = d / name
            if f.exists():
                parts.append(read(f))
    out = ROOT / "report" / "MAIN_REPORT.generated.md"
    write(out, "\n\n---\n\n".join(parts))
    print("Đã ghép %d feature vào %s. Chuyển file này sang PDF bằng công cụ bạn dùng." % (len(dirs), out.relative_to(ROOT)))


def critique_words():
    t = read(CRITIQUE) if CRITIQUE.exists() else ""
    m = re.search(r"<!-- CRITIQUE_START -->(.*?)<!-- CRITIQUE_END -->", t, re.S)
    body = m.group(1).replace("TODO: viết 200–300 từ ở đây.", "") if m else ""
    return len(body.split())


def cmd_check(_, quiet=False):
    problems = 0
    need = ["README.md", "CHECKLIST.md", "ai_audit/00_AI_AUDIT_REPORT.md", "ai_audit/AI_CRITIQUE.md",
            "bugs/BUG_LIST.md", "report/00_main_report_intro.md"]
    for r in need:
        if not (ROOT / r).exists():
            print("THIẾU file bắt buộc:", r)
            problems += 1
    if not feature_dirs():
        print("CHƯA có feature nào trong features/")
        problems += 1
    scan = [ROOT / "README.md", ROOT / "report" / "00_main_report_intro.md", AUDIT, CRITIQUE]
    scan += [p for d in feature_dirs() for p in d.glob("*.md")]
    for p in scan:
        if p.exists():
            n = read(p).count("TODO")
            if n:
                print("Còn %d chỗ TODO: %s" % (n, p.relative_to(ROOT)))
                problems += 1
    w = critique_words()
    if not 200 <= w <= 300:
        print("AI Critique hiện có %d từ (yêu cầu 200–300)." % w)
        problems += 1
    for folder, label in (("report", "báo cáo chính"), ("ai_audit", "AI Audit/Critique")):
        if not list((ROOT / folder).glob("*.pdf")):
            print("Chưa có file PDF của %s trong %s/ (đề yêu cầu Markdown + PDF)." % (label, folder))
            problems += 1
    if not (ROOT / "git_log.txt").exists():
        print("Chưa có git_log.txt (sẽ được tạo khi chạy package).")
    print("Kiểm tra xong: %d vấn đề." % problems if problems else "Kiểm tra xong: không có vấn đề.")
    return problems


def cmd_package(a):
    if not re.fullmatch(r"\d{3}", a.grade) or not 0 <= int(a.grade) <= 100:
        sys.exit("Điểm tự đánh giá phải gồm 3 chữ số trong khoảng 000–100, ví dụ 090.")
    if not a.student_id.strip():
        sys.exit("Thiếu MSSV.")
    cmd_check(a)
    try:
        log = subprocess.run(["git", "log", "--oneline"], cwd=ROOT, capture_output=True, text=True, check=True).stdout
        write(ROOT / "git_log.txt", log)
        print("Đã ghi git_log.txt (%d commit)." % len(log.splitlines()))
    except Exception:
        print("Không đọc được git log: hãy chạy trong thư mục đã `git init` và đã commit.")
    name = "%s_HW02_AI_DomainTesting_%s.zip" % (a.student_id.strip(), a.grade)
    dist = ROOT / "dist"
    dist.mkdir(exist_ok=True)
    skip = {".git", "dist", "node_modules", "__pycache__", "templates"}
    with zipfile.ZipFile(dist / name, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(ROOT.rglob("*")):
            rel = p.relative_to(ROOT)
            if p.is_file() and not (set(rel.parts) & skip):
                z.write(p, str(rel))
    print("Đã tạo dist/%s" % name)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("new-feature"); s.add_argument("fr"); s.add_argument("name"); s.add_argument("pool", choices=list("ABCD")); s.set_defaults(f=cmd_new_feature)
    s = sub.add_parser("new-entry"); s.add_argument("fr"); s.add_argument("step"); s.add_argument("--tool"); s.set_defaults(f=cmd_new_entry)
    s = sub.add_parser("build-report"); s.set_defaults(f=cmd_build_report)
    s = sub.add_parser("check"); s.set_defaults(f=lambda a: sys.exit(1 if cmd_check(a) else 0))
    s = sub.add_parser("package"); s.add_argument("student_id"); s.add_argument("grade"); s.set_defaults(f=cmd_package)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
