#!/usr/bin/env node
// Dry-run Folder A of a generated collection without Postman.
// Usage: node dry_run.js collection.json [baseUrl]
// Executes the Tests script of the first request against a live server (real or mock)
// with a minimal `pm` shim and prints each result. Exit code 1 if any test FAILs/ERRORs.
const fs = require('fs'), vm = require('vm'), http = require('http'), https = require('https');
const [, , file, baseArg] = process.argv;
if (!file) { console.error('usage: node dry_run.js collection.json [baseUrl]'); process.exit(2); }
const col = JSON.parse(fs.readFileSync(file, 'utf8'));
const item = col.item[0];
const script = item.event.find(e => e.listen === 'test').script.exec.join('\n');
const vars = new Map((col.variable || []).map(v => [v.key, v.value]));
if (baseArg) vars.set('baseUrl', baseArg);
const results = [];
const pm = {
  collectionVariables: { get: k => vars.get(k), set: (k, v) => vars.set(k, v) },
  sendRequest(opt, cb) {
    const u = new URL(opt.url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request(u, { method: opt.method, headers: opt.header || {} }, res => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => cb(null, { code: res.statusCode, text: () => data, json: () => JSON.parse(data) }));
    });
    req.on('error', e => cb(e));
    if (opt.body && opt.body.raw) req.write(opt.body.raw);
    req.end();
  },
  test(name, fn) { try { fn(); results.push({ name, ok: true }); } catch (e) { results.push({ name, ok: false, msg: e.message }); } },
  expect(v, msg) { return { to: { be: { get true() { if (v !== true) throw new Error(msg || 'expected true'); } } } }; },
  visualizer: { set() {} },
};
const logs = [];
const sandbox = { pm, console: { log: (...a) => logs.push(a.join(' ')) }, URL, JSON, Promise, Date, String, Number, Array, Object };
(async () => {
  const p = vm.runInNewContext(script, sandbox);
  if (p && p.then) await p;
  let bad = 0;
  for (const r of results) { console.log((r.ok ? 'ok   ' : 'FAIL ') + r.name); if (!r.ok) bad++; }
  console.log('\n' + logs.join('\n'));
  process.exit(bad ? 1 : 0);
})();
