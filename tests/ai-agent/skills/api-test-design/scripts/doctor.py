#!/usr/bin/env python3
"""Kiểm tra môi trường trước khi bắt đầu một lần test. Không cài gì, không sửa gì.

Dùng (từ gốc workspace):
    python .agents/skills/api-test-design/scripts/doctor.py [--base-url http://localhost:3000]

Mỗi dòng bắt đầu bằng [OK], [THIẾU] (phải xử lý) hoặc [LƯU Ý] (xử lý khi cần).
Thoát mã 0 nếu không có [THIẾU], mã 1 nếu có.
"""
import argparse
import glob
import os
import platform
import re
import shutil
import socket
import subprocess
import sys
from urllib.parse import urlparse

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

RELEASES = "https://github.com/karatelabs/karate/releases (chọn v1.5.2, tải file karate-1.5.2.jar)"
HINTS = {
    "Windows": {"java": "winget install EclipseAdoptium.Temurin.17.JDK", "node": "winget install OpenJS.NodeJS.LTS"},
    "Darwin": {"java": "brew install openjdk@17", "node": "brew install node"},
    "Linux": {"java": "sudo apt install openjdk-17-jdk", "node": "sudo apt install nodejs npm"},
}
LEAK = re.compile(r"x-known-deviations|known[_-]?deviation|BUG[_-]?LIST", re.I)

results = []


def add(level, msg, hint=None):
    results.append((level, msg, hint))


def java_major():
    exe = shutil.which("java")
    if not exe:
        return None, None
    try:
        p = subprocess.run([exe, "-version"], capture_output=True, text=True, timeout=15)
        out = (p.stderr or "") + (p.stdout or "")
        m = re.search(r'version "(\d+)(?:\.(\d+))?', out)
        if not m:
            return exe, 0
        major = int(m.group(1))
        return exe, (int(m.group(2) or 0) if major == 1 else major)
    except Exception:
        return exe, 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default=os.environ.get("BASE_URL", "http://localhost:3000"))
    ap.add_argument("--karate-dir", default="karate")
    a = ap.parse_args()
    hints = HINTS.get(platform.system(), HINTS["Linux"])

    # Python
    if sys.version_info >= (3, 9):
        add("OK", f"Python {platform.python_version()}")
    else:
        add("THIẾU", f"Python {platform.python_version()} quá cũ (cần 3.9 trở lên)", "Cài Python 3.9+ từ python.org")

    # Java
    exe, major = java_major()
    if exe is None:
        add("THIẾU", "Chưa có Java (Karate 1.5.x cần Java 17 trở lên)", "Cài bằng: " + hints["java"])
    elif major < 17:
        add("THIẾU", f"Java hiện là bản {major or '?'}, cần 17 trở lên", "Cài bằng: " + hints["java"])
    else:
        add("OK", f"Java {major}")

    # Karate jar
    cands = [os.environ.get("KARATE_JAR", "")] + sorted(glob.glob(os.path.join(a.karate_dir, "karate-*.jar"))) + sorted(glob.glob("karate-*.jar"))
    jar = next((c for c in cands if c and os.path.isfile(c)), None)
    if jar:
        add("OK", f"Karate jar: {jar}")
    else:
        add("THIẾU", f"Chưa thấy karate-*.jar trong thư mục {a.karate_dir}/", f"Tải tại {RELEASES} rồi đặt vào {a.karate_dir}/")

    # Node (để chạy EShop)
    if shutil.which("node"):
        try:
            v = subprocess.run(["node", "--version"], capture_output=True, text=True, timeout=15).stdout.strip()
        except Exception:
            v = "?"
        add("OK", f"Node.js {v} (dùng để chạy EShop)")
    else:
        add("LƯU Ý", "Chưa có Node.js. Cần khi chạy EShop, không cần khi chỉ lập matrix", "Cài bằng: " + hints["node"])

    # Workspace: skill và rules
    for p, what in ((".agents/skills/api-test-design/SKILL.md", "skill"), (".antigravity/rules/api-test-workflow.md", "rules")):
        if os.path.isfile(p):
            add("OK", f"Thấy {what}: {p}")
        else:
            add("THIẾU", f"Không thấy {p} trong thư mục hiện tại",
                "Mở đúng thư mục gốc của dự án (thư mục chứa .agents/) làm workspace trong Antigravity, và chạy lệnh từ đó")

    # Inputs
    for f in ("srs.md", "openapi.yaml", "sample-data.md"):
        p = os.path.join("inputs", f)
        if os.path.isfile(p) and os.path.getsize(p) > 0:
            add("OK", f"Thấy {p}")
            if LEAK.search(open(p, encoding="utf-8", errors="ignore").read()):
                add("LƯU Ý", f"{p} có dấu vết của danh sách lỗi đã biết (x-known-deviations, BUG_LIST...)",
                    "Dùng bản đã gỡ đáp án để kỳ vọng không bị ảnh hưởng")
        else:
            add("THIẾU", f"Thiếu hoặc rỗng: {p}", "Đặt đủ ba tệp srs.md, openapi.yaml, sample-data.md vào inputs/")

    # Máy chủ
    u = urlparse(a.base_url)
    try:
        with socket.create_connection((u.hostname or "localhost", u.port or 80), timeout=3):
            add("OK", f"Máy chủ trả lời tại {a.base_url}")
    except OSError:
        add("LƯU Ý", f"Chưa kết nối được {a.base_url}. Cần khi chạy test, không cần khi lập matrix",
            "Khởi động EShop (xem README mục 'Khởi động lại EShop')")

    bad = 0
    for level, msg, hint in results:
        print(f"[{level}] {msg}")
        if hint and level != "OK":
            print(f"        -> {hint}")
        bad += level == "THIẾU"
    print()
    print("Sẵn sàng." if not bad else f"Còn {bad} mục THIẾU. Xử lý xong rồi chạy lại doctor.py.")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
