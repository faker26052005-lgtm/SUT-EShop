#!/usr/bin/env python3
"""Công cụ hỗ trợ HW02 (chỉ dùng thư viện chuẩn của Python 3).

  python3 scripts/hw.py new-feature FR-09 "Mã giảm giá" B
  python3 scripts/hw.py new-entry   FR-09 "Bước 3 - lớp tương đương" --tool "Claude Sonnet 5.5"
  python3 scripts/hw.py new-entry   GENERAL "Hỏi cách dùng Postman" --tool "Claude Sonnet 5.5"
  python3 scripts/hw.py new-entry   SKILL "Soạn SKILL.md" --when "2026-10-18 20:15"   (ghi bổ sung)
  python3 scripts/hw.py issues FR-04 --repo OWNER/REPO --dry-run   (xem trước)
  python3 scripts/hw.py issues FR-04 --repo OWNER/REPO              (tạo Issue bằng GitHub CLI)
  python3 scripts/hw.py issues FR-04 --repo OWNER/REPO --url        (in link mở sẵn form Issue)
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
import tempfile
import unicodedata
import urllib.parse
import zipfile
from pathlib import Path

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


def norm_scope(s):
    """Phạm vi của một entry: mã feature (FR-09) hoặc một từ như GENERAL, SKILL, REPORT."""
    s = s.strip()
    m = re.fullmatch(r"(?i)fr-?(\d{1,2})", s)
    if m:
        return "FR-%02d" % int(m.group(1))
    if re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", s):
        return s.upper()
    sys.exit("Phạm vi phải là mã feature (FR-09) hoặc một từ như GENERAL, SKILL, REPORT.")


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
    fr = norm_scope(a.fr)
    d = ROOT / "ai_audit" / "entries" / fr
    d.mkdir(parents=True, exist_ok=True)
    n = len(list(d.glob("*.md"))) + 1
    entry_id = "%s-%02d" % (fr, n)
    now = datetime.datetime.now().astimezone()
    if a.when:
        stamp = "%s (nhập tay, ghi bổ sung)" % a.when.strip()
    else:
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


def parse_bug(path):
    t = read(path)
    m = re.search(r"\*\*Tiêu đề Issue:\*\*\s*`(.+?)`", t)
    if not m:
        return None
    head, *secs = re.split(r"(?m)^## ", t)
    rows, link = [], None
    for ln in head.splitlines():
        if not ln.startswith("|"):
            continue
        if ln.startswith("| GitHub Issue"):
            val = ln.split("|")[2].strip()
            link = val if val.startswith("http") else None
            continue
        rows.append(ln)
    parts = ["\n".join(rows)]
    for sec in secs:
        name, _, rest = sec.partition("\n")
        if name.strip().startswith("Bằng chứng"):
            continue
        parts.append("## " + name + "\n" + rest.rstrip())
    parts.append("_Ảnh chụp được đính kèm ở bình luận bên dưới._")
    return {"id": path.stem, "title": m.group(1), "body": "\n\n".join(parts).strip() + "\n", "link": link, "path": path}


def set_link(bug, url):
    t = read(bug["path"])
    t = re.sub(r"(?m)^\| GitHub Issue \| .*\|$", "| GitHub Issue | %s |" % url, t, count=1)
    write(bug["path"], t)
    bl = ROOT / "bugs" / "BUG_LIST.md"
    if bl.exists():
        lines = read(bl).splitlines()
        for i, ln in enumerate(lines):
            if ln.startswith("| %s |" % bug["id"]):
                cells = ln.split("|")
                if len(cells) >= 8:
                    cells[6] = " %s " % url
                    lines[i] = "|".join(cells)
        write(bl, "\n".join(lines) + "\n")


def cmd_issues(a):
    prefix = (norm_scope(a.filter) + "-") if a.filter else ""
    files = sorted(p for p in (ROOT / "bugs").glob("*-BUG-*.md") if p.name.upper().startswith(prefix))
    bugs = [b for b in (parse_bug(p) for p in files) if b]
    if not bugs:
        sys.exit("Không tìm thấy file bug nào trong bugs/ (tên dạng FR-04-BUG-01.md, có dòng 'Tiêu đề Issue').")
    for b in bugs:
        mark = "ĐÃ CÓ LINK, sẽ bỏ qua: " + b["link"] if b["link"] else "chưa có Issue"
        print("- %s | %s | %s" % (b["id"], b["title"], mark))
    todo = [b for b in bugs if not b["link"]]
    if a.url:
        for b in todo:
            q = {"title": b["title"], "body": b["body"]}
            if a.labels:
                q["labels"] = a.labels
            url = "https://github.com/%s/issues/new?%s" % (a.repo, urllib.parse.urlencode(q, quote_via=urllib.parse.quote))
            warn = "  (CẢNH BÁO: link dài %d ký tự, có thể bị cắt; hãy dùng chế độ gh)" % len(url) if len(url) > 7000 else ""
            print("\n%s%s\n%s" % (b["id"], warn, url))
        print("\nMở từng link, kéo thả ảnh vào khung mô tả rồi bấm Submit. Sau đó tự điền link Issue vào file bug và BUG_LIST.md.")
        return
    if a.dry_run:
        for b in todo:
            print("\n[dry-run] gh issue create --repo %s --title %r (%d ký tự nội dung)" % (a.repo, b["title"], len(b["body"])))
        return
    if not shutil.which("gh"):
        sys.exit("Chưa cài GitHub CLI (gh). Cài từ https://cli.github.com rồi chạy `gh auth login`, hoặc dùng --url.")
    if not todo:
        print("Không còn bug nào cần tạo Issue.")
        return
    if not a.yes:
        if input("Sẽ tạo %d Issue trong %s. Gõ y để tiếp tục: " % (len(todo), a.repo)).strip().lower() != "y":
            sys.exit("Đã hủy.")
    for b in todo:
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(b["body"])
            body_path = f.name
        cmd = ["gh", "issue", "create", "--repo", a.repo, "--title", b["title"], "--body-file", body_path]
        if a.labels:
            cmd += ["--label", a.labels]
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        Path(body_path).unlink(missing_ok=True)
        if r.returncode != 0:
            print("LỖI khi tạo %s: %s" % (b["id"], (r.stderr or r.stdout).strip()))
            continue
        url = r.stdout.strip().splitlines()[-1]
        set_link(b, url)
        print("Đã tạo %s -> %s (đã ghi link vào file bug và BUG_LIST.md)" % (b["id"], url))
    print("Việc còn lại: mở từng Issue, kéo thả ảnh chụp vào bình luận, và chụp trang danh sách Issues.")


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
    s = sub.add_parser("new-entry"); s.add_argument("fr", help="FR-09 hoặc phạm vi chung: GENERAL, SKILL, REPORT..."); s.add_argument("step"); s.add_argument("--tool"); s.add_argument("--when", help="giờ thật nếu ghi bổ sung, vd \"2026-10-18 20:15\""); s.set_defaults(f=cmd_new_entry)
    s = sub.add_parser("issues")
    s.add_argument("filter", nargs="?", help="chỉ xử lý bug của feature này, vd FR-04")
    s.add_argument("--repo", required=True, help="repo GitHub của nhóm, dạng OWNER/REPO")
    s.add_argument("--labels", help="nhãn đã tồn tại trong repo, vd bug,FR-04")
    s.add_argument("--url", action="store_true", help="in link mở sẵn form tạo Issue (không cần gh)")
    s.add_argument("--dry-run", action="store_true", help="chỉ xem trước")
    s.add_argument("--yes", action="store_true", help="không hỏi xác nhận")
    s.set_defaults(f=cmd_issues)
    s = sub.add_parser("build-report"); s.set_defaults(f=cmd_build_report)
    s = sub.add_parser("check"); s.set_defaults(f=lambda a: sys.exit(1 if cmd_check(a) else 0))
    s = sub.add_parser("package"); s.add_argument("student_id"); s.add_argument("grade"); s.set_defaults(f=cmd_package)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
