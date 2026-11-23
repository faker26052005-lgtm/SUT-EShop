#!/usr/bin/env python3
"""Chạy Karate cho một lần chạy và tạo report/summary.md.

Dùng (từ gốc workspace):
    python .agents/skills/api-test-design/scripts/run_karate.py executions/<run-id>

Tùy chọn:
    --all              chạy cả ca @slow (mặc định bỏ qua)
    --base-url URL     địa chỉ máy chủ (mặc định http://localhost:3000)
    --jar PATH         đường dẫn karate-*.jar (mặc định tìm trong karate/ hoặc biến KARATE_JAR)
    --karate-dir DIR   thư mục karate của dự án (mặc định ./karate)
    --skip-check       bỏ qua check_coverage (không khuyến khích)
    --summarize-only   chỉ tạo summary.md từ báo cáo có sẵn, không chạy Karate

Mã thoát: 0 mọi ca xanh; 1 có ca đỏ; 2 điều kiện chưa đạt (chưa chạy gì); 3 Karate không tạo báo cáo.
Chỉ dùng thư viện chuẩn của Python 3.
"""
import argparse
import glob
import json
import os
import shutil
import socket
import subprocess
import sys
import time
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_DIR = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import check_coverage as cc  # noqa: E402

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def fail(msg, code=2):
    print("LỖI", msg)
    sys.exit(code)


def find_jar(arg, karate_dir):
    cands = []
    if arg:
        cands.append(arg)
    if os.environ.get("KARATE_JAR"):
        cands.append(os.environ["KARATE_JAR"])
    for d in (karate_dir, "."):
        cands += sorted(glob.glob(os.path.join(d, "karate-*.jar")))
    for c in cands:
        if os.path.isfile(c):
            return os.path.abspath(c)
    return None


def server_up(base_url):
    u = urlparse(base_url)
    host, port = u.hostname or "localhost", u.port or (443 if u.scheme == "https" else 80)
    try:
        with socket.create_connection((host, port), timeout=3):
            return True
    except OSError:
        return False


def load_results(report_dir):
    kr = os.path.join(report_dir, "karate-reports")
    summ_path = os.path.join(kr, "karate-summary-json.txt")
    if not os.path.isfile(summ_path):
        return None
    summ = json.load(open(summ_path, encoding="utf-8"))
    scenarios = []
    for f in sorted(os.listdir(kr)):
        if f.endswith("karate-json.txt") and "summary" not in f:
            data = json.load(open(os.path.join(kr, f), encoding="utf-8"))
            for s in data.get("scenarioResults", []):
                tags = [str(t).lstrip("@") for t in (s.get("tags") or [])]
                sid = next((t for t in tags if cc.re.match(r"^[A-Z]{2,}\d+$", t)), "?")
                scenarios.append({
                    "id": sid,
                    "name": s.get("name", ""),
                    "failed": bool(s.get("failed")),
                    "error": (s.get("error") or "").strip(),
                })
    return summ, scenarios


def write_summary(run_dir, summ, scenarios, command, base_url, tag_note):
    run_id = os.path.basename(os.path.normpath(run_dir))
    stats = cc.matrix_stats(run_dir)
    _, cases, _ = cc.load_matrix(run_dir)
    ran = {s["id"] for s in scenarios}
    not_ran = [c["id"] for c in cases if c["duyet"] in ("Y", "S") and c["id"] not in ran]
    red = [s for s in scenarios if s["failed"]]
    L = [f"# Tóm tắt chạy: {run_id}", "",
         "Tạo tự động bởi `run_karate.py`. Không sửa tay; chạy lại script để làm mới.", "",
         "## Tổng quan", "",
         "| Hạng mục | Giá trị |", "|---|---|",
         f"| Ngày giờ chạy | {summ.get('resultDate', '?')} |",
         f"| Karate | {summ.get('version', '?')} |",
         f"| Lệnh | `{command}` |",
         f"| Địa chỉ máy chủ | {base_url} |",
         f"| Phạm vi thẻ | {tag_note} |",
         f"| Ca đã chạy | {len(scenarios)} |",
         f"| Xanh | {len(scenarios) - len(red)} |",
         f"| Đỏ | {len(red)} |"]
    if stats:
        L.append(f"| Ca trong matrix (tổng / Y / S / N / người thêm) | {stats['tong']} / {stats['Y']} / {stats['S']} / {stats['N']} / {stats['them']} |")
    L += ["", "## Danh sách ca", "", "| ID | Kết quả | Tên |", "|---|---|---|"]
    for s in scenarios:
        L.append(f"| {s['id']} | {'ĐỎ' if s['failed'] else 'xanh'} | {s['name']} |")
    L += ["", "## Ca đỏ (nguyên văn từ Karate)", ""]
    if not red:
        L.append("Không có ca đỏ.")
    for s in red:
        err = s["error"] if len(s["error"]) <= 1500 else s["error"][:1500] + "\n... (cắt bớt)"
        L += [f"### {s['id']}: {s['name']}", "", "```", err, "```", ""]
    L += ["## Chưa chạy", ""]
    L.append(", ".join(not_ran) if not_ran else "Không có. Mọi ca Y hoặc S đều đã chạy.")
    L.append("")
    path = os.path.join(run_dir, "report", "summary.md")
    open(path, "w", encoding="utf-8").write("\n".join(L))
    return path, len(red), len(scenarios)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("run_dir")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--base-url", default=os.environ.get("BASE_URL", "http://localhost:3000"))
    ap.add_argument("--jar")
    ap.add_argument("--karate-dir", default="karate")
    ap.add_argument("--skip-check", action="store_true")
    ap.add_argument("--summarize-only", action="store_true")
    a = ap.parse_args()

    run_dir = os.path.normpath(a.run_dir)
    report_dir = os.path.join(run_dir, "report")
    tag_note = "tất cả (kể cả @slow)" if a.all else "bỏ qua @slow"
    command = "(chạy ngoài script)"

    if not a.summarize_only:
        if not os.path.isdir(os.path.join(run_dir, "features")):
            fail(f"Không thấy {run_dir}/features")
        if not a.skip_check:
            _, _, _, _, errors, _, _ = cc.run(run_dir)
            if errors:
                print("check_coverage còn lỗi, chưa chạy. Chạy check_coverage.py để xem chi tiết.")
                for e in errors[:10]:
                    print("LỖI", e)
                sys.exit(2)
        if not shutil.which("java"):
            fail("Không tìm thấy 'java' trong PATH (cần Java 17 trở lên).")
        jar = find_jar(a.jar, a.karate_dir)
        if not jar:
            fail("Không tìm thấy karate-*.jar. Đặt vào thư mục karate/ hoặc dùng --jar hoặc biến KARATE_JAR.")
        if not server_up(a.base_url):
            fail(f"Không kết nối được {a.base_url}. Người cần khởi động (lại) máy chủ EShop trước khi chạy.")

        # Chỉ xóa kết quả cũ do script này tạo ra.
        shutil.rmtree(os.path.join(report_dir, "karate-reports"), ignore_errors=True)
        try:
            os.remove(os.path.join(report_dir, "summary.md"))
        except OSError:
            pass
        os.makedirs(report_dir, exist_ok=True)

        cp_parts = [jar]
        if os.path.isdir(a.karate_dir):
            cp_parts.append(os.path.abspath(a.karate_dir))
        cp_parts.append(os.path.join(SKILL_DIR, "assets", "karate"))  # dự phòng: helpers và karate-config đi kèm skill
        cmd = ["java", f"-DbaseUrl={a.base_url}", "-cp", os.pathsep.join(cp_parts), "com.intuit.karate.Main"]
        if not a.all:
            cmd += ["-t", "~@slow"]
        cmd += ["-o", report_dir, os.path.join(run_dir, "features")]
        command = subprocess.list2cmdline(cmd)
        print("Chạy:", command)
        t0 = time.time()
        proc = subprocess.run(cmd)
        print(f"Karate kết thúc sau {time.time() - t0:.1f}s, mã thoát {proc.returncode} (khác 0 thường nghĩa là có ca đỏ).")

    res = load_results(report_dir)
    if res is None:
        fail("Karate không tạo báo cáo (karate-reports/karate-summary-json.txt). Xem log phía trên.", 3)
    summ, scenarios = res
    path, n_red, n_all = write_summary(run_dir, summ, scenarios, command, a.base_url, tag_note)
    print(f"Đã ghi {path}: {n_all} ca, {n_all - n_red} xanh, {n_red} đỏ.")
    print("Bước tiếp: tạo result.md từ assets/templates/result.template.md.")
    sys.exit(1 if n_red else 0)


if __name__ == "__main__":
    main()
