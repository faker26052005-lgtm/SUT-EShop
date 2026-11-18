#!/usr/bin/env python3
"""Kiểm tra test-matrix.md và các feature của một lần chạy.

Dùng:
    python check_coverage.py executions/<run-id>

Hai giai đoạn, tự nhận biết:
  - Chưa có features/*.feature: chỉ kiểm matrix (Pha A).
  - Đã có feature: kiểm matrix, sự khớp matrix-feature và chất lượng assertion (Pha B).

Thoát với mã 1 nếu có LỖI. CẢNH BÁO không làm thất bại nhưng phải được xem xét.
Chỉ dùng thư viện chuẩn của Python 3.
"""
import os
import re
import sys

VALID_SOURCES = ("srs", "openapi", "không nêu", "khong neu")
WEAK_MARKERS = r"(string|number|boolean|array|object|notnull|present|ignore|uuid|\[\])"
STEP_RE = re.compile(r"^(?:Given|When|Then|And|But|\*)\s+(.*)$")
STATUS_VAR_RE = re.compile(r"^match\s+\w*[Ss]tatus\w*\s*(?:==|!=)\s*\d{3}\b")
HTTP_CODE_RE = re.compile(r"\b[1-5]\d\d\b")
BARE_VAR_RE = re.compile(r"[{,]\s*[\w$]+\s*:\s*([A-Za-z_][\w.]*)\s*(?=[,}])")
SAFE_MARK = re.compile(r"#\s*an[- ]?toan|#\s*an toàn", re.I)
MATCH_RE = re.compile(
    r"^match\s+(?:each\s+)?(\S+)\s+"
    r"(==|!=|!contains(?:\s+deep|\s+only|\s+any)?|contains(?:\s+deep|\s+only|\s+any)?)\s+(.+)$"
)


# ---------------------------------------------------------------- matrix
def _cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def _is_sep(line):
    return bool(re.match(r"^\|?[\s:\-|]+\|?$", line.strip())) and "-" in line


def _tables(text):
    """Trả về danh sách (header_cells_lowercase, rows) cho mọi bảng markdown."""
    lines = text.replace("\r", "").split("\n")
    out, i = [], 0
    while i < len(lines):
        if lines[i].strip().startswith("|") and i + 1 < len(lines) and _is_sep(lines[i + 1]):
            header = [c.lower() for c in _cells(lines[i])]
            rows, j = [], i + 2
            while j < len(lines) and lines[j].strip().startswith("|"):
                rows.append(_cells(lines[j]))
                j += 1
            out.append((header, rows))
            i = j
        else:
            i += 1
    return out


def load_matrix(run_dir):
    """Đọc matrix. Trả về (rules, cases, errors)."""
    path = os.path.join(run_dir, "test-matrix.md")
    errors, rules, cases = [], [], []
    if not os.path.isfile(path):
        return rules, cases, [f"Không thấy {path}"]
    text = open(path, encoding="utf-8").read()
    tables = _tables(text)

    rule_tbl = next((t for t in tables if "mã" in t[0] and "phủ qua api" in t[0]), None)
    case_tbl = next((t for t in tables if "id" in t[0] and "duyệt" in t[0]), None)
    if rule_tbl is None:
        errors.append("Matrix thiếu bảng Quy tắc (cột 'Mã' và 'Phủ qua API'). Dùng mẫu assets/templates/test-matrix.template.md")
    if case_tbl is None:
        errors.append("Matrix thiếu bảng ca (cột 'ID' và 'Duyệt'). Dùng mẫu assets/templates/test-matrix.template.md")
        return rules, cases, errors

    if rule_tbl:
        h = rule_tbl[0]
        for r in rule_tbl[1]:
            r = r + [""] * (len(h) - len(r))
            rid = r[h.index("mã")].strip()
            if re.match(r"^R\d+[a-z]?$", rid):
                rules.append({"id": rid, "covered_api": r[h.index("phủ qua api")].strip().lower().startswith("c")})

    h = case_tbl[0]
    need = ["id", "nhóm", "quy tắc", "nguồn kỳ vọng", "duyệt"]
    missing = [c for c in need if c not in h]
    if missing:
        errors.append("Bảng ca thiếu cột: " + ", ".join(missing))
        return rules, cases, errors
    for r in case_tbl[1]:
        r = r + [""] * (len(h) - len(r))
        d = dict(zip(h, r))
        cid = d["id"].strip()
        if not cid:
            continue
        cases.append({
            "id": cid,
            "group": d["nhóm"].strip(),
            "rules": re.findall(r"R\d+[a-z]?", d["quy tắc"]),
            "source": d["nguồn kỳ vọng"].strip().lower(),
            "duyet": d["duyệt"].strip().upper(),
            "note": d.get("ghi chú", "").strip(),
            "assertion": d.get("assertion chính"),
        })
    return rules, cases, errors


def matrix_stats(run_dir):
    """Đếm số ca theo cột Duyệt. Dùng cho summary.md. Trả về dict hoặc None."""
    _, cases, errors = load_matrix(run_dir)
    if errors and not cases:
        return None
    s = {"tong": len(cases), "Y": 0, "S": 0, "N": 0, "trong": 0, "them": 0}
    for c in cases:
        if c["duyet"] in ("Y", "S", "N"):
            s[c["duyet"]] += 1
        elif not c["duyet"]:
            s["trong"] += 1
        if c["note"].upper().startswith("[THÊM]"):
            s["them"] += 1
    return s


def check_matrix(rules, cases, errors, warnings, need_approval):
    seen = set()
    rule_ids = {r["id"] for r in rules}
    for c in cases:
        if c["id"] in seen:
            errors.append(f"Matrix: ID {c['id']} bị trùng")
        seen.add(c["id"])
        if not re.match(r"^[1-6]", c["group"]):
            errors.append(f"Matrix: {c['id']} cột Nhóm phải là 1 đến 6 (đang là '{c['group']}')")
        if not c["rules"]:
            errors.append(f"Matrix: {c['id']} chưa gắn quy tắc nào (cột Quy tắc)")
        for rid in c["rules"]:
            if rid not in rule_ids:
                errors.append(f"Matrix: {c['id']} nhắc quy tắc {rid} không có trong bảng Quy tắc")
        if not any(c["source"].startswith(v) for v in VALID_SOURCES):
            errors.append(f"Matrix: {c['id']} cột Nguồn kỳ vọng phải là SRS, OpenAPI hoặc Không nêu (đang là '{c['source']}')")
        if c["duyet"] != "N" and c["assertion"] is not None:
            if not re.search(r"status", c["assertion"], re.I) and not HTTP_CODE_RE.search(c["assertion"]):
                errors.append(f"Matrix: {c['id']} cột Assertion chính chưa nêu mã trạng thái (ví dụ 'status 400')")
        if c["duyet"] and c["duyet"] not in ("Y", "S", "N"):
            errors.append(f"Matrix: {c['id']} cột Duyệt chỉ nhận Y, S, N (đang là '{c['duyet']}')")
    active = [c for c in cases if c["duyet"] != "N"]
    for r in rules:
        if r["covered_api"] and not any(r["id"] in c["rules"] for c in active):
            errors.append(f"Matrix: quy tắc {r['id']} chưa có ca nào (hoặc mọi ca đã bị loại)")
    if need_approval:
        empty = [c["id"] for c in cases if not c["duyet"]]
        if empty:
            errors.append("Người chưa duyệt các ca: " + ", ".join(empty))
        if not any(c["duyet"] in ("Y", "S") for c in cases):
            errors.append("Không có ca nào được duyệt (Y hoặc S)")


# --------------------------------------------------------------- features
def parse_feature(path):
    scenarios, cur, tags = [], None, []
    text = open(path, encoding="utf-8").read().replace("\r", "")
    for raw in text.split("\n"):
        s = raw.strip()
        if not s:
            continue
        if s.startswith("#"):
            if cur is not None:
                cur["comments"].append(s)
            continue
        if s.startswith("@"):
            tags += s.split()
            continue
        if s.startswith("Feature:") or s.startswith("Background:"):
            cur, tags = None, []
            continue
        m = re.match(r"^(Scenario Outline|Scenario)\s*:\s*(.*)$", s)
        if m:
            ids = [t[1:] for t in tags if re.match(r"^@[A-Z]{2,}\d+$", t)]
            cur = {"file": os.path.basename(path), "name": m.group(2), "tags": tags, "ids": ids, "lines": [], "comments": []}
            scenarios.append(cur)
            tags = []
            continue
        if cur is not None:
            cur["lines"].append(s)
    return scenarios, text


def _has_literal(rhs):
    flat = rhs.replace(" ", "")
    if flat in ("[]", "{}"):
        return True
    for a, b in re.findall(r"'([^']*)'|\"([^\"]*)\"", rhs):
        v = a or b
        if not re.match(r"^#" + WEAK_MARKERS + r"$", v):
            return True
    stripped = re.sub(r"'[^']*'|\"[^\"]*\"", "", rhs)
    return bool(re.search(r"(?<![\w.])-?\d+(\.\d+)?|\b(true|false)\b", stripped))


def classify_match(body):
    """strong, weak hoặc control (phép loại trừ, không tính là kiểm giá trị chính)."""
    m = MATCH_RE.match(body)
    if not m:
        return "strong"
    _, op, rhs = m.group(1), m.group(2), m.group(3).strip()
    marker = re.match(r"^(['\"])#" + WEAK_MARKERS + r"\1$", rhs)
    if op == "!=":
        return "weak" if (rhs == "null" or marker) else "control"
    if op.startswith("!contains"):
        return "control"
    if marker:
        return "weak"
    if rhs[:1] in "{[" and not _has_literal(rhs):
        return "weak"
    return "strong"


def check_features(run_dir, cases, errors, warnings, info):
    fdir = os.path.join(run_dir, "features")
    files = sorted(f for f in os.listdir(fdir) if f.endswith(".feature"))
    scenarios, texts = [], []
    for f in files:
        sc, t = parse_feature(os.path.join(fdir, f))
        scenarios += sc
        texts.append((f, t))

    by_id = {c["id"]: c for c in cases}
    seen = {}
    for sc in scenarios:
        label = f"{sc['file']}: {sc['name'][:50]}"
        if len(sc["ids"]) != 1:
            errors.append(f"Feature: Scenario phải có đúng một thẻ @ID ({label})")
            continue
        sid = sc["ids"][0]
        sc["id"] = sid
        if sid in seen:
            errors.append(f"Feature: ID {sid} xuất hiện ở nhiều Scenario")
        seen[sid] = sc
        if sid not in by_id:
            errors.append(f"Feature: @{sid} không có trong matrix")
        if not sc["name"].startswith(sid):
            warnings.append(f"Feature: tên Scenario {sid} nên mở đầu bằng '{sid}'")

    for c in cases:
        if c["duyet"] in ("Y", "S") and c["id"] not in seen:
            errors.append(f"Feature: ca {c['id']} đã duyệt nhưng chưa có Scenario")
        if c["duyet"] == "N" and c["id"] in seen:
            errors.append(f"Feature: ca {c['id']} bị loại (N) nhưng vẫn có Scenario")

    for sid, sc in seen.items():
        steps = [m.group(1) for ln in sc["lines"] for m in [STEP_RE.match(ln)] if m]
        has_status = any(re.match(r"^status\s+\S+", s) or STATUS_VAR_RE.match(s) for s in steps)
        classes = [classify_match(s) for s in steps if s.startswith("match ")]
        if not has_status:
            errors.append(f"Feature: {sid} không có dòng 'status'")
        if not classes:
            errors.append(f"Feature: {sid} không có dòng 'match' nào")
        elif "strong" not in classes:
            src = by_id.get(sid, {}).get("source", "")
            if src.startswith("không nêu") or src.startswith("khong neu"):
                info.append(f"{sid}: assertion lỏng, được phép vì matrix ghi 'Không nêu'")
            else:
                errors.append(
                    f"Feature: {sid} chỉ kiểm kiểu hoặc sự tồn tại (match yếu) nhưng matrix ghi nguồn "
                    f"'{src}'. Hãy kiểm giá trị cụ thể, hoặc sửa nguồn thành 'Không nêu' nếu tài liệu thực sự không nêu")
        for st in steps:
            if not re.match(r"^(request|def|set|match)\b", st):
                continue
            flat = re.sub(r"'[^']*'|\"[^\"]*\"", "''", st)
            bare = [v for v in BARE_VAR_RE.findall(flat) if v not in ("true", "false", "null")]
            if bare:
                errors.append(
                    f"Feature: {sid} có tên biến trần trong JSON ({', '.join(sorted(set(bare)))}). "
                    f"Karate không nội suy: giá trị sẽ là chuỗi chữ '{bare[0]}', không phải giá trị của biến. "
                    f"Viết '#({bare[0]})'")
                break
        body = "\n".join(sc["lines"])
        safe = any(SAFE_MARK.search(c) for c in sc["comments"])
        last_path = []
        for st in steps:
            if st.startswith("path "):
                last_path = re.findall(r"'[^']*'|\"[^\"]*\"|[^,\s]+", st[5:])
            m = re.match(r"^method\s+(put|patch|delete)\b", st, re.I)
            if not m:
                continue
            toks = [t.strip("'\"") for t in last_path]
            quoted = [t0.startswith(("'", '"')) for t0 in last_path]
            has_num = any(re.fullmatch(r"\d+", t) for t in toks)
            has_var = any((not q) and re.fullmatch(r"[A-Za-z_]\w*(\.\w+)*", t) for t, q in zip(toks, quoted))
            if has_num and not safe:
                warnings.append(f"Feature: {sid} dùng {m.group(1).upper()} với id cố định ({'/'.join(toks)}). "
                                f"Có thể là dữ liệu mẫu: nếu hệ thống lỗi phân quyền, thao tác sẽ thành công thật. "
                                f"Dùng đối tượng tạm, hoặc thêm chú thích '# an-toan: <lý do>' nếu id chắc chắn không phải dữ liệu mẫu")
            elif (not has_num) and (not has_var) and re.search(r"\b(userToken|adminToken)\b", body):
                warnings.append(f"Feature: {sid} ghi ({m.group(1)}) bằng tài khoản mẫu. Xác nhận ca không làm hỏng dữ liệu mẫu, hoặc dùng tài khoản tạm")
        if "callonce" in body:
            warnings.append(f"Feature: {sid} dùng callonce trong Scenario. callonce chỉ dành cho đăng nhập ở Background")
    for f, t in texts:
        if re.search(r"https?://", t):
            warnings.append(f"Feature: {f} có địa chỉ http viết cứng. Dùng biến baseUrl")
    return len(seen)


# ------------------------------------------------------------------ main
def run(run_dir):
    errors, warnings, info = [], [], []
    rules, cases, errs = load_matrix(run_dir)
    errors += errs
    fdir = os.path.join(run_dir, "features")
    has_features = os.path.isdir(fdir) and any(f.endswith(".feature") for f in os.listdir(fdir))
    if cases:
        check_matrix(rules, cases, errors, warnings, need_approval=has_features)
    n_scn = None
    if has_features and cases:
        n_scn = check_features(run_dir, cases, errors, warnings, info)
    return rules, cases, n_scn, has_features, errors, warnings, info


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    run_dir = argv[1]
    rules, cases, n_scn, has_features, errors, warnings, info = run(run_dir)
    phase = "Pha B (matrix và feature)" if has_features else "Pha A (chỉ matrix)"
    print(f"Kiểm tra {run_dir}: {phase}")
    print(f"Matrix: {len(rules)} quy tắc, {len(cases)} ca" + (f"; Feature: {n_scn} scenario" if n_scn is not None else ""))
    for m in info:
        print("THÔNG TIN", m)
    for m in warnings:
        print("CẢNH BÁO", m)
    for m in errors:
        print("LỖI", m)
    if errors:
        print(f"=> {len(errors)} lỗi, {len(warnings)} cảnh báo. Sửa hết LỖI rồi chạy lại.")
        return 1
    print(f"=> Sạch lỗi, {len(warnings)} cảnh báo." + (" Xem xét từng cảnh báo." if warnings else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
