#!/usr/bin/env python3
"""Build a Postman collection (v2.1) from a tests.json file.

Usage: python build_collection.py tests.json -o FRxx_API_postman_collection.json

Folder A  = one carrier request whose Tests tab runs every test (setup -> request -> checks)
            and prints a PASS / FAIL / CẦN LÀM RÕ report (visualizer + markdown).
Folder B  = bug reproduction requests (one folder per bug) for screenshots.
Z         = optional cleanup.
See references/tests-schema.md for the input format.
"""
import argparse, json, re, sys

SCHEMA = "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
JS = "@js:"


def js(o):
    """JSON-like value -> JS source. Strings starting with '@js:' are raw JS."""
    if isinstance(o, dict):
        return "{" + ", ".join(f"{json.dumps(k, ensure_ascii=False)}: {js(v)}" for k, v in o.items()) + "}"
    if isinstance(o, list):
        return "[" + ", ".join(js(v) for v in o) + "]"
    if isinstance(o, str) and o.startswith(JS):
        return o[len(JS):]
    return json.dumps(o, ensure_ascii=False)


def auth_js(a):
    """auth spec -> JS expression yielding a token or undefined."""
    if a in (None, ""):
        a = "user1"
    if a == "none":
        return "undefined"
    if isinstance(a, str) and a.startswith(JS):
        return a[len(JS):]
    if isinstance(a, str) and a.startswith("token:"):
        return json.dumps(a[6:])
    return f"tok[{json.dumps(a)}]"


def call_js(c, default_auth="user1"):
    body = js(c["body"]) if "body" in c else "undefined"
    return f"call({json.dumps(c['method'])}, {js(c['path'])}, {body}, {auth_js(c.get('auth', default_auth))})"


HELPERS = r"""
  const call = (method, path, body, token) => new Promise((resolve) => {
    const opt = { url: BASE + path, method, header: { 'Content-Type': 'application/json' } };
    if (token) opt.header['Authorization'] = String(token).startsWith('RAW:') ? String(token).slice(4) : 'Bearer ' + token;
    if (body !== undefined) opt.body = { mode: 'raw', raw: JSON.stringify(body) };
    pm.sendRequest(opt, (err, res) => {
      if (err || !res) return resolve({ code: 0, json: null, text: String(err) });
      let j = null; try { j = res.json(); } catch (e) {}
      resolve({ code: res.code, json: j, text: res.text() });
    });
  });
  const is2 = (c) => c >= 200 && c < 300, is4 = (c) => c >= 400 && c < 500;
  const short = (r) => `HTTP ${r.code} ${String(r.text).slice(0, 80).replace(/\s+/g, ' ')}`;
  const login = async (u) => {
    let r = await call('POST', '/api/login', { email: u.email, password: u.password });
    if ((!r.json || !r.json.token) && u.register) {
      await call('POST', '/api/register', { name: u.name || 'Test User', email: u.email, password: u.password });
      r = await call('POST', '/api/login', { email: u.email, password: u.password });
    }
    return r.json;
  };
"""


def users_block(spec):
    users = spec.get("users", {})
    out = ["  const USERS = " + json.dumps(users, ensure_ascii=False) + ";",
           "  const tok = {}, uid = {};",
           "  for (const k of Object.keys(USERS)) {",
           "    const u = Object.assign({}, USERS[k]);",
           "    u.email = pm.collectionVariables.get(k + 'Email') || u.email;",
           "    u.password = pm.collectionVariables.get(k + 'Password') || u.password;",
           "    const j = await login(u);",
           "    tok[k] = j && j.token;",
           "    uid[k] = j && j.user ? j.user.id : (j && j.id);",
           "  }"]
    return "\n".join(out)


def gen_test(t):
    exp = t.get("expect", "clarify")
    L = []
    L.append(f"  {{ const id = {json.dumps(t['id'])}, desc = {json.dumps(t.get('title', ''), ensure_ascii=False)};")
    L.append("    try {")
    L.append("      const snap = {}; const checks = [];")
    for c in t.get("setup", []):
        if "js" in c:
            L.append("      " + c["js"])
        else:
            L.append(f"      await {call_js(c)};")
    for b in t.get("before", []):
        L.append(f"      snap[{json.dumps(b['as'])}] = await {call_js(b)};")
    req = t["request"]
    L.append(f"      const r = await {call_js(req, t.get('auth', 'user1'))};")
    for v in t.get("verify", []):
        note = json.dumps(v.get("note", v.get("check", "")), ensure_ascii=False)
        if "method" in v:
            L.append(f"      {{ const v = await {call_js(v, t.get('auth', 'user1'))}; checks.push([{note}, !!({v['check']})]); }}")
        else:
            L.append(f"      checks.push([{note}, !!({v['check']})]);")
    L.append("      const bad = checks.filter(c => !c[1]).map(c => c[0]);")
    extra = json.dumps(" | " + t["note"], ensure_ascii=False) if t.get("note") else '""'
    if exp == "clarify":
        L.append("      const info = checks.length ? ' | ' + checks.map(c => c[0] + '=' + c[1]).join('; ') : '';")
        L.append(f"      rec(id, desc, 'CLARIFY', short(r) + info + ' (SRS im lặng)' + {extra});")
    else:
        if exp == "success":
            ok = "is2(r.code)"
        else:
            ok = f"{json.dumps(t['status'])}.includes(r.code)" if t.get("status") else "is4(r.code)"
        L.append(f"      const okS = {ok};")
        L.append(f"      rec(id, desc, (okS && bad.length === 0) ? 'PASS' : 'FAIL', short(r) + (bad.length ? ' | KHÔNG ĐẠT: ' + bad.join('; ') : '') + {extra});")
    L.append("    } catch (e) { rec(id, desc, 'ERROR', 'Lỗi script: ' + e.message); }")
    L.append("  }")
    return "\n".join(L)


REPORT = r"""
  const cnt = { PASS: 0, FAIL: 0, CLARIFY: 0, ERROR: 0 };
  R.forEach(x => cnt[x.verdict]++);
  pm.test(`TỔNG ${R.length} ca: PASS ${cnt.PASS} | FAIL ${cnt.FAIL} | CẦN LÀM RÕ ${cnt.CLARIFY} | LỖI SCRIPT ${cnt.ERROR}`, () => {});
  R.forEach(x => {
    if (x.verdict === 'CLARIFY') pm.test(`[CẦN LÀM RÕ] ${x.id} | ${x.desc} | ${x.note}`, () => {});
    else pm.test(`${x.id} | ${x.desc} | ${x.note}`, () => { pm.expect(x.verdict === 'PASS', x.note).to.be.true; });
  });
  console.log(JSON.stringify(cnt));
  const cell = (s) => String(s).replace(/\|/g, '/').replace(/\s+/g, ' ');
  const md = [`Chạy lúc: ${new Date().toISOString()} | baseUrl: ${BASE} | PASS ${cnt.PASS} | FAIL ${cnt.FAIL} | CẦN LÀM RÕ ${cnt.CLARIFY}`, '',
    '| ID | Mô tả | Verdict | Quan sát |', '| :--- | :--- | :-: | :--- |']
    .concat(R.map(x => `| ${x.id} | ${cell(x.desc)} | ${x.verdict} | ${cell(x.note)} |`)).join('\n');
  console.log(md);
  try {
    pm.visualizer.set(`<style>body{font-family:sans-serif;font-size:13px}td,th{border:1px solid #ccc;padding:4px 8px;text-align:left}
      .PASS{background:#dcfce7}.FAIL,.ERROR{background:#fee2e2}.CLARIFY{background:#fef9c3}</style>
      <h3>PASS {{c.PASS}} | FAIL {{c.FAIL}} | CẦN LÀM RÕ {{c.CLARIFY}}</h3>
      <textarea readonly rows="6" style="width:100%" onclick="this.select()">{{md}}</textarea>
      <table><tr><th>ID</th><th>Mô tả</th><th>Verdict</th><th>Quan sát</th></tr>
      {{#each r}}<tr class="{{verdict}}"><td>{{id}}</td><td>{{desc}}</td><td>{{verdict}}</td><td>{{note}}</td></tr>{{/each}}</table>`,
      { r: R, c: cnt, md });
  } catch (e) {}
"""


def script_a(spec):
    base = spec.get("baseUrl", "http://localhost:3000")
    parts = [f"// ===== {spec['feature']} - FULL SUITE ({len(spec['tests'])} ca) - generated by build_collection.py =====",
             "(async () => {",
             f"  const BASE = pm.collectionVariables.get('baseUrl') || {json.dumps(base)};",
             "  const R = [];",
             "  const rec = (id, desc, verdict, note) => R.push({ id, desc, verdict, note: note || '' });",
             HELPERS, users_block(spec),
             "  if (!tok.user1) { pm.test('SETUP LỖI: không đăng nhập được user1', () => { throw new Error('setup'); }); return; }",
             "  const ctx = {};"]
    if spec.get("init_js"):
        parts.append("  // ---- init_js ----\n  " + spec["init_js"])
    for t in spec["tests"]:
        parts.append(gen_test(t))
    parts.append(REPORT)
    parts.append("})();")
    return "\n".join(parts)


def prepare_script(spec):
    base = spec.get("baseUrl", "http://localhost:3000")
    parts = ["(async () => {",
             f"  const BASE = pm.collectionVariables.get('baseUrl') || {json.dumps(base)};",
             HELPERS, users_block(spec),
             "  for (const k of Object.keys(tok)) { pm.collectionVariables.set('tok_' + k, tok[k] || ''); pm.collectionVariables.set('uid_' + k, uid[k] === undefined ? '' : uid[k]); }",
             "  const ctx = {};"]
    if spec.get("init_js"):
        parts.append("  " + spec["init_js"])
    parts.append("  pm.collectionVariables.set('ctx', JSON.stringify(ctx));")
    parts.append("})();")
    return "\n".join(parts)


def mini_helpers():
    return ("const base = pm.collectionVariables.get('baseUrl');\n"
            "const ctx = JSON.parse(pm.collectionVariables.get('ctx') || '{}');\n"
            "const tok = {}; ['user1','user2','admin'].forEach(k => tok[k] = pm.collectionVariables.get('tok_' + k));\n"
            "const send = (m, p, b, t) => new Promise(res => pm.sendRequest({ url: base + p, method: m,\n"
            "  header: Object.assign({'Content-Type': 'application/json'}, t ? {Authorization: 'Bearer ' + t} : {}),\n"
            "  body: b === undefined ? undefined : {mode: 'raw', raw: JSON.stringify(b)} }, (e, r) => res(r)));\n")


def event(listen, code):
    return {"listen": listen, "script": {"type": "text/javascript", "exec": code.split("\n")}}


def make_item(name, method, path, auth, body, prereq=None, test=None):
    headers = [{"key": "Content-Type", "value": "application/json"}]
    if auth and auth != "none":
        if auth.startswith("token:"):
            headers.append({"key": "Authorization", "value": "Bearer " + auth[6:]})
        else:
            headers.append({"key": "Authorization", "value": "Bearer {{tok_" + auth + "}}"})
    raw_path = path if not str(path).startswith(JS) else "/" + "dynamic"
    req = {"method": method, "header": headers,
           "url": {"raw": "{{baseUrl}}" + raw_path, "host": ["{{baseUrl}}"], "path": [p for p in raw_path.split("/") if p]}}
    if body is not None:
        raw_body = json.dumps(body, ensure_ascii=False, indent=2)
        raw_body = re.sub(r'"\{\{(uid_\w+)\}\}"', r'{{\1}}', raw_body)   # numeric ids stay numbers
        req["body"] = {"mode": "raw", "raw": raw_body,
                       "options": {"raw": {"language": "json"}}}
    item = {"name": name, "request": req, "event": []}
    if prereq:
        item["event"].append(event("prerequest", prereq))
    if test:
        item["event"].append(event("test", test))
    return item


def status_cond(es):
    if es == "2xx":
        return "pm.response.code >= 200 && pm.response.code < 300", "2xx"
    if es == "4xx":
        return "pm.response.code >= 400 && pm.response.code < 500", "4xx"
    return f"{json.dumps(es)}.includes(pm.response.code)", "/".join(map(str, es))


def bug_folder(b):
    items = []
    for s in b["steps"]:
        pre = None
        if s.get("setup"):
            calls = "\n".join(f"  await send({json.dumps(c['method'])}, {js(c['path'])}, "
                              f"{js(c['body']) if 'body' in c else 'undefined'}, {auth_js(c.get('auth', 'user1'))});"
                              for c in s["setup"])
            pre = mini_helpers() + "(async () => {\n" + calls + "\n})();"
        test_lines = []
        if s.get("expect_status"):
            cond, label = status_cond(s["expect_status"])
            test_lines.append(f"pm.test({json.dumps(s['name'] + ': kỳ vọng HTTP ' + label)} + ', thực tế HTTP ' + pm.response.code, () => {{ pm.expect({cond}, 'BUG: ' + {json.dumps(b['title'], ensure_ascii=False)}).to.be.true; }});")
        if s.get("js"):
            test_lines.append("const ctx = JSON.parse(pm.collectionVariables.get('ctx') || '{}');")
            test_lines.append(s["js"])
        items.append(make_item(s["name"], s["method"], s["path"], s.get("auth", "user1"), s.get("body"), pre,
                               "\n".join(test_lines) if test_lines else None))
    return {"name": f"{b['id']}: {b['title']}", "item": items}


def build(spec):
    base = spec.get("baseUrl", "http://localhost:3000")
    carrier = spec.get("carrier", "/api/products")
    variables = [{"key": "baseUrl", "value": base}, {"key": "ctx", "value": "{}"}]
    for k, u in spec.get("users", {}).items():
        variables += [{"key": k + "Email", "value": u["email"]}, {"key": k + "Password", "value": u["password"]},
                      {"key": "tok_" + k, "value": ""}]
    A = make_item(f"A. RUN ALL - {spec['feature']} API (bấm Send, chạy {len(spec['tests'])} ca)", "GET", carrier, "none", None,
                  None, script_a(spec))
    B0 = make_item("B0. CHUẨN BỊ (chạy trước): token người dùng & dữ liệu mồi", "GET", carrier, "none", None,
                   prepare_script(spec),
                   "const cv = (k) => pm.collectionVariables.get(k);\n"
                   "pm.test('Chuẩn bị xong: user1 token ' + (cv('tok_user1') ? 'OK' : 'THIẾU'), () => { pm.expect(!!cv('tok_user1'), 'không đăng nhập được user1').to.be.true; });")
    B = {"name": "B. Tái hiện bug để chụp ảnh (Send lần lượt từ trên xuống)",
         "item": [B0] + [bug_folder(b) for b in spec.get("bugs", [])]}
    items = [A, B]
    if spec.get("cleanup"):
        calls = "\n".join(f"  await send({json.dumps(c['method'])}, {js(c['path'])}, "
                          f"{js(c['body']) if 'body' in c else 'undefined'}, {auth_js(c.get('auth', 'user1'))});"
                          for c in spec["cleanup"])
        items.append(make_item("Z. Dọn dẹp (chạy cuối, tùy chọn)", "GET", carrier, "none", None,
                               mini_helpers() + "(async () => {\n" + calls + "\n})();"))
    return {"info": {"name": f"{spec['feature']} {spec.get('title', '')} - Tầng API", "schema": SCHEMA},
            "variable": variables, "item": items}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("-o", "--out", required=True)
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    for key in ("feature", "tests"):
        if key not in spec:
            sys.exit(f"tests.json is missing '{key}'")
    ids = [t["id"] for t in spec["tests"]]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup:
        sys.exit(f"duplicate test ids: {sorted(dup)}")
    for t in spec["tests"]:
        if t.get("expect", "clarify") not in ("success", "reject", "clarify"):
            sys.exit(f"{t['id']}: expect must be success | reject | clarify")
        if "request" not in t:
            sys.exit(f"{t['id']}: missing 'request'")
    col = build(spec)
    json.dump(col, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"wrote {a.out}: {len(spec['tests'])} tests, {len(spec.get('bugs', []))} bug folders")


if __name__ == "__main__":
    main()
