#!/usr/bin/env python3
"""Công cụ tạo GitHub Issue và danh sách bug cho HW03 (chỉ dùng thư viện chuẩn của Python 3).

Cấu trúc thư mục (đặt script ở scripts/, file bug ở bugs/):
  bugs/GUI-BUG-01.md ... GUI-BUG-14.md   (mỗi lỗi một file)
  bugs/BUG_LIST.md                       (được script tạo ra nếu chưa có)
  scripts/hw.py

Cách dùng:
  python3 scripts/hw.py bug-list                    (tạo bugs/BUG_LIST.md nếu chưa có)
  python3 scripts/hw.py bug-list --force            (tạo lại từ các file bug)
  python3 scripts/hw.py issues GUI --repo OWNER/REPO --dry-run   (xem trước)
  python3 scripts/hw.py issues GUI --repo OWNER/REPO --env "Chrome 1xx, Windows 11, localhost:3000"
                                                    (tạo Issue bằng GitHub CLI)
  python3 scripts/hw.py issues GUI --repo OWNER/REPO --url       (in link mở sẵn form Issue)
  python3 scripts/hw.py set-link GUI-BUG-01 https://github.com/OWNER/REPO/issues/1
                                                    (ghi link Issue vào file bug và BUG_LIST.md)
  python3 scripts/hw.py import-links bugs/BUG_LIST_old.md
                                                    (lấy lại link Issue từ một BUG_LIST.md cũ)
  python3 scripts/hw.py update GUI-BUG-01 GUI-BUG-02 --repo OWNER/REPO --dry-run
  python3 scripts/hw.py update GUI-BUG-01 GUI-BUG-02 --repo OWNER/REPO
                                                    (cập nhật tiêu đề và mô tả của Issue đã tạo)
  python3 scripts/hw.py labels GUI --repo OWNER/REPO --platforms "Chrome,Firefox,Android-Chrome" --dry-run
  python3 scripts/hw.py labels GUI --repo OWNER/REPO --platforms "Chrome,Firefox,Android-Chrome"
                                                    (gắn nhãn bug, severity, IA, platform cho các Issue đã tạo)
"""
import argparse
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUGS = ROOT / "bugs"
BUG_LIST = BUGS / "BUG_LIST.md"
LIST_HEADER = (
    "# Danh sách bug\n\n"
    "| Bug ID | Màn hình | Tiêu đề | Mức độ | Mục checklist liên quan | Issue |\n"
    "| :--- | :--- | :--- | :-: | :--- | :-: |\n"
)


def norm_scope(s):
    """Tiền tố của mã bug, ví dụ GUI (cho các file GUI-BUG-01.md ...)."""
    s = s.strip()
    if re.fullmatch(r"[A-Za-z][A-Za-z0-9_-]*", s):
        return s.upper()
    sys.exit("Phạm vi phải là một từ như GUI (khớp với tên file GUI-BUG-01.md).")


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, t):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(t, encoding="utf-8")


def bug_files(prefix=""):
    if not BUGS.exists():
        return []
    return sorted(p for p in BUGS.glob("*-BUG-*.md") if p.name.upper().startswith(prefix))


def parse_bug(path, env=None):
    t = read(path)
    m = re.search(r"\*\*Tiêu đề Issue:\*\*\s*`(.+?)`", t)
    if not m:
        return None
    head, *secs = re.split(r"(?m)^## ", t)
    rows, link, meta = [], None, {}
    for ln in head.splitlines():
        if not ln.startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if cells and cells[0] == "GitHub Issue":
            val = cells[1] if len(cells) > 1 else ""
            link = val if val.startswith("http") else None
            continue
        if env and cells and cells[0] == "Môi trường":
            ln = "| Môi trường | %s |" % env
        rows.append(ln)
        if len(cells) >= 2:
            meta[cells[0]] = cells[1]
    parts = ["\n".join(rows)]
    for sec in secs:
        name, _, rest = sec.partition("\n")
        if name.strip().startswith("Bằng chứng"):
            continue
        parts.append("## " + name + "\n" + rest.rstrip())
    parts.append("_Ảnh chụp minh hoạ được đính kèm trong Issue này._")
    return {"id": path.stem, "title": m.group(1), "body": "\n\n".join(parts).strip() + "\n",
            "link": link, "path": path, "meta": meta}


def build_bug_list():
    rows = []
    for p in bug_files(""):
        b = parse_bug(p)
        if not b:
            continue
        m = b["meta"]
        title = re.sub(r"^\[[^\]]*\]\s*", "", b["title"])
        rows.append("| %s | %s | %s | %s | %s | %s |" % (
            b["id"], m.get("Màn hình", ""), title, m.get("Mức độ", ""),
            m.get("Mục checklist liên quan", ""), b["link"] or ""))
    write(BUG_LIST, LIST_HEADER + "\n".join(rows) + "\n")
    return len(rows)


def set_link(bug, url):
    t = read(bug["path"])
    t = re.sub(r"(?m)^\| GitHub Issue \| .*\|$", lambda _m: "| GitHub Issue | %s |" % url, t, count=1)
    write(bug["path"], t)
    if not BUG_LIST.exists():
        build_bug_list()
        return
    lines = read(BUG_LIST).splitlines()
    for i, ln in enumerate(lines):
        if ln.startswith("| %s |" % bug["id"]):
            cells = ln.split("|")
            if len(cells) >= 8:
                cells[6] = " %s " % url
                lines[i] = "|".join(cells)
            write(BUG_LIST, "\n".join(lines) + "\n")
            return
    build_bug_list()  # bug mới chưa có dòng trong danh sách: dựng lại từ các file bug


def cmd_bug_list(a):
    if BUG_LIST.exists() and not a.force:
        print("%s đã tồn tại (dùng --force để tạo lại từ các file bug)." % BUG_LIST.relative_to(ROOT))
        return
    n = build_bug_list()
    print("Đã tạo %s với %d bug." % (BUG_LIST.relative_to(ROOT), n))


def cmd_set_link(a):
    path = BUGS / (a.bug_id + ".md")
    if not path.exists():
        sys.exit("Không thấy file %s" % path.relative_to(ROOT))
    bug = parse_bug(path)
    if not bug:
        sys.exit("File bug thiếu dòng 'Tiêu đề Issue'.")
    set_link(bug, a.url.strip())
    print("Đã ghi link cho %s." % a.bug_id)


def issue_number(url):
    m = re.search(r"/issues/(\d+)", url or "")
    return m.group(1) if m else None


def cmd_import_links(a):
    src = Path(a.old_list)
    if not src.exists():
        sys.exit("Không thấy file %s" % src)
    found = {}
    for ln in read(src).splitlines():
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) >= 6 and re.fullmatch(r".+-BUG-\d+", cells[0]):
            url = cells[5].strip("() ")
            if url.startswith("http"):
                found[cells[0]] = url
    n = 0
    for bid, url in found.items():
        path = BUGS / (bid + ".md")
        bug = parse_bug(path) if path.exists() else None
        if bug and not bug["link"]:
            set_link(bug, url)
            n += 1
    print("Tìm thấy %d link trong %s, đã ghi %d link vào các file bug (bỏ qua file đã có link hoặc không tồn tại)." % (len(found), src, n))


def cmd_update(a):
    todo = []
    for bid in a.bug_ids:
        path = BUGS / (bid.strip().upper() + ".md")
        bug = parse_bug(path) if path.exists() else None
        if not bug:
            sys.exit("Không thấy file bug hợp lệ cho %s." % bid)
        if not issue_number(bug["link"]):
            sys.exit("%s chưa có link Issue. Dùng set-link hoặc import-links trước." % bid)
        todo.append(bug)
    for b in todo:
        print("- %s -> Issue #%s | %s" % (b["id"], issue_number(b["link"]), b["title"]))
    print("\nLưu ý: tiêu đề và mô tả của Issue sẽ bị ghi đè bằng nội dung trong file bug.")
    print("Ảnh nằm TRONG PHẦN MÔ TẢ sẽ mất; ảnh trong bình luận không bị ảnh hưởng.")
    if a.dry_run:
        return
    if not shutil.which("gh"):
        sys.exit("Chưa cài GitHub CLI (gh). Cài từ https://cli.github.com rồi chạy `gh auth login`.")
    if not a.yes:
        if input("Sẽ cập nhật %d Issue trong %s. Gõ y để tiếp tục: " % (len(todo), a.repo)).strip().lower() != "y":
            sys.exit("Đã hủy.")
    for b in todo:
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(b["body"])
            body_path = f.name
        cmd = ["gh", "issue", "edit", issue_number(b["link"]), "--repo", a.repo,
               "--title", b["title"], "--body-file", body_path]
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
        Path(body_path).unlink(missing_ok=True)
        if r.returncode != 0:
            print("LỖI khi cập nhật %s: %s" % (b["id"], (r.stderr or r.stdout).strip()))
            continue
        print("Đã cập nhật %s -> %s" % (b["id"], b["link"]))


IA_RANGES = [(1, 9, "IA-01"), (10, 25, "IA-02"), (26, 36, "IA-03"), (37, 47, "IA-04")]
EXTRA_IA = {48: "IA-01", 49: "IA-02", 50: "IA-02", 51: "IA-03", 52: "IA-04"}  # các mục tự bổ sung


def ia_labels(items_text):
    out = []
    for m in re.finditer(r"UI-(\d+)", items_text or ""):
        n = int(m.group(1))
        ia = EXTRA_IA.get(n) or next((name for lo, hi, name in IA_RANGES if lo <= n <= hi), None)
        if ia and ia not in out:
            out.append(ia)
    return out


def bug_labels(bug, platforms):
    """Nhãn: bug, severity:<mức>, IA-0x (theo mục checklist), platform:<tên>.
    Nền tảng lấy từ dòng 'Nền tảng' trong file bug (nếu có), nếu không thì dùng --platforms."""
    meta = bug["meta"]
    labels = ["bug"]
    sev = meta.get("Mức độ", "").strip()
    if sev:
        labels.append("severity:" + sev)
    labels += ia_labels(meta.get("Mục checklist liên quan", ""))
    plats = meta.get("Nền tảng") or platforms or ""
    for p in [x.strip() for x in plats.split(",") if x.strip()]:
        labels.append("platform:" + p)
    return labels


def label_color(name):
    if name == "bug":
        return "d73a4a"
    if name.startswith("severity:"):
        return {"high": "b60205", "medium": "d93f0b", "low": "fbca04"}.get(name.split(":", 1)[1].lower(), "ededed")
    if name.startswith("platform:"):
        return "1d76db"
    if name.startswith("IA-"):
        return "5319e7"
    return "ededed"


def cmd_labels(a):
    prefix = (norm_scope(a.filter) + "-") if a.filter else ""
    todo = []
    for p in bug_files(prefix):
        b = parse_bug(p)
        if not b:
            continue
        num = issue_number(b["link"])
        if not num:
            print("BỎ QUA %s: chưa có link Issue." % b["id"])
            continue
        todo.append((b, num, bug_labels(b, a.platforms)))
    if not todo:
        sys.exit("Không có bug nào có link Issue để gắn nhãn.")
    for b, num, labels in todo:
        print("- %s -> Issue #%s | %s" % (b["id"], num, ", ".join(labels)))
    print("\nLưu ý: chỉ gắn nhãn platform cho những nền tảng mà lỗi thực sự đã được tái hiện.")
    if a.dry_run:
        return
    if not shutil.which("gh"):
        sys.exit("Chưa cài GitHub CLI (gh). Cài từ https://cli.github.com rồi chạy `gh auth login`.")
    if not a.yes:
        if input("Sẽ gắn nhãn cho %d Issue trong %s. Gõ y để tiếp tục: " % (len(todo), a.repo)).strip().lower() != "y":
            sys.exit("Đã hủy.")
    made = set()
    for b, num, labels in todo:
        for l in labels:
            if l in made:
                continue
            r = subprocess.run(["gh", "label", "create", l, "--repo", a.repo, "--color", label_color(l), "--force"],
                               capture_output=True, text=True, encoding="utf-8")
            if r.returncode != 0:
                print("LỖI khi tạo nhãn %s: %s" % (l, (r.stderr or r.stdout).strip()))
            made.add(l)
        r = subprocess.run(["gh", "issue", "edit", num, "--repo", a.repo, "--add-label", ",".join(labels)],
                           capture_output=True, text=True, encoding="utf-8")
        if r.returncode != 0:
            print("LỖI khi gắn nhãn %s: %s" % (b["id"], (r.stderr or r.stdout).strip()))
            continue
        print("Đã gắn nhãn %s -> %s" % (b["id"], b["link"]))


def cmd_issues(a):
    prefix = (norm_scope(a.filter) + "-") if a.filter else ""
    bugs = [b for b in (parse_bug(p, a.env) for p in bug_files(prefix)) if b]
    if not bugs:
        sys.exit("Không tìm thấy file bug nào trong bugs/ (tên dạng GUI-BUG-01.md, có dòng 'Tiêu đề Issue').")
    for b in bugs:
        mark = "ĐÃ CÓ LINK, sẽ bỏ qua: " + b["link"] if b["link"] else "chưa có Issue"
        print("- %s | %s | %s" % (b["id"], b["title"], mark))
    todo = [b for b in bugs if not b["link"]]
    blocked = [b for b in todo if "TODO" in b["body"] and not a.allow_todo]
    for b in blocked:
        print("BỎ QUA %s: nội dung còn 'TODO' (điền mục Môi trường trong file hoặc dùng --env)." % b["id"])
    todo = [b for b in todo if b not in blocked]
    if not todo:
        print("Không còn bug nào cần tạo Issue.")
        return

    if a.url:
        for b in todo:
            q = {"title": b["title"], "body": b["body"]}
            if a.labels:
                q["labels"] = a.labels
            url = "https://github.com/%s/issues/new?%s" % (a.repo, urllib.parse.urlencode(q, quote_via=urllib.parse.quote))
            warn = "  (CẢNH BÁO: link dài %d ký tự, có thể bị cắt; hãy dùng chế độ gh)" % len(url) if len(url) > 7000 else ""
            print("\n%s%s\n%s" % (b["id"], warn, url))
        print("\nMở từng link, kéo thả ảnh vào khung mô tả rồi bấm Submit. Sau đó ghi link Issue bằng lệnh:")
        print("  python3 scripts/hw.py set-link <BUG-ID> <link Issue>")
        return
    if a.dry_run:
        for b in todo:
            print("\n[dry-run] gh issue create --repo %s --title %r (%d ký tự nội dung)" % (a.repo, b["title"], len(b["body"])))
        return
    if not shutil.which("gh"):
        sys.exit("Chưa cài GitHub CLI (gh). Cài từ https://cli.github.com rồi chạy `gh auth login`, hoặc dùng --url.")
    if not a.yes:
        if input("Sẽ tạo %d Issue trong %s. Gõ y để tiếp tục: " % (len(todo), a.repo)).strip().lower() != "y":
            sys.exit("Đã hủy.")
    if not BUG_LIST.exists():
        build_bug_list()
        print("Đã tạo %s." % BUG_LIST.relative_to(ROOT))
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


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("bug-list", help="tạo bugs/BUG_LIST.md từ các file bug (nếu chưa có)")
    s.add_argument("--force", action="store_true", help="tạo lại dù file đã tồn tại")
    s.set_defaults(f=cmd_bug_list)
    s = sub.add_parser("issues", help="tạo GitHub Issue từ các file bug chưa có link")
    s.add_argument("filter", nargs="?", help="chỉ xử lý bug có tiền tố này, vd GUI")
    s.add_argument("--repo", required=True, help="repo GitHub, dạng OWNER/REPO")
    s.add_argument("--labels", help="nhãn đã tồn tại trong repo, vd bug,GUI")
    s.add_argument("--env", help="mô tả môi trường test, thay cho dòng 'Môi trường' trong file bug khi tạo Issue")
    s.add_argument("--url", action="store_true", help="in link mở sẵn form tạo Issue (không cần gh)")
    s.add_argument("--dry-run", action="store_true", help="chỉ xem trước")
    s.add_argument("--yes", action="store_true", help="không hỏi xác nhận")
    s.add_argument("--allow-todo", action="store_true", help="vẫn tạo Issue dù nội dung còn chữ TODO")
    s.set_defaults(f=cmd_issues)
    s = sub.add_parser("set-link", help="ghi link Issue vào file bug và BUG_LIST.md")
    s.add_argument("bug_id", help="vd GUI-BUG-01")
    s.add_argument("url")
    s.set_defaults(f=cmd_set_link)
    s = sub.add_parser("import-links", help="lấy lại link Issue từ một BUG_LIST.md cũ")
    s.add_argument("old_list", help="đường dẫn tới BUG_LIST.md cũ (đã có cột Issue)")
    s.set_defaults(f=cmd_import_links)
    s = sub.add_parser("update", help="cập nhật tiêu đề và mô tả của các Issue đã tạo")
    s.add_argument("bug_ids", nargs="+", help="vd GUI-BUG-01 GUI-BUG-02")
    s.add_argument("--repo", required=True, help="repo GitHub, dạng OWNER/REPO")
    s.add_argument("--dry-run", action="store_true", help="chỉ xem trước")
    s.add_argument("--yes", action="store_true", help="không hỏi xác nhận")
    s.set_defaults(f=cmd_update)
    s = sub.add_parser("labels", help="gắn nhãn bug, severity, IA, platform cho các Issue đã tạo")
    s.add_argument("filter", nargs="?", help="chỉ xử lý bug có tiền tố này, vd GUI")
    s.add_argument("--repo", required=True, help="repo GitHub, dạng OWNER/REPO")
    s.add_argument("--platforms", help="các nền tảng đã tái hiện lỗi, cách nhau bằng dấu phẩy, vd Chrome,Firefox,Android-Chrome")
    s.add_argument("--dry-run", action="store_true", help="chỉ xem trước")
    s.add_argument("--yes", action="store_true", help="không hỏi xác nhận")
    s.set_defaults(f=cmd_labels)
    a = ap.parse_args()
    a.f(a)


if __name__ == "__main__":
    main()
