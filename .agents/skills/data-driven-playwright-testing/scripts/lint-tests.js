#!/usr/bin/env node
/**
 * Static checker for Playwright test code (specs and helpers). It looks for the weaknesses that AI-generated
 * scripts most often contain: flaky waits, fragile selectors, assertions that can pass with nothing checked,
 * locale-dependent number handling, inline test data. It is a review aid, not a proof of quality.
 *
 *   node scripts/lint-tests.js [path ...] [--json] [--strict]
 *
 *   path       files or folders to scan (default: ./tests)
 *   --json     machine-readable output
 *   --strict   exit code 1 on warnings too (default: only on errors)
 *
 * Severity: error = fix before running the matrix; warn = review and fix or justify; info = consider.
 * Rules: L01 fixed sleep, L02 .only, L03 locale-dependent toLocaleString, L04 fragile selector, L05 substring role name,
 *        L06 text-to-number that turns "no digits" into 0, L07 swallowed error, L08 assertion inside a loop,
 *        L09 dialog position taken after the click, L10 hard-coded credentials, L11 inline data table,
 *        L12 fewer than 3 assertion kinds in the suite, L13 test without any assertion, L14 spec without external data.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\*\n|^ \* ?/gm, '').trim());
  process.exit(0);
}
const asJson = args.includes('--json');
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) targets.push('tests');

function collect(p, out = []) {
  if (!fs.existsSync(p)) return out;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const n of fs.readdirSync(p)) if (n !== 'node_modules' && !n.startsWith('.')) collect(path.join(p, n), out);
  } else if (/\.(ts|js|mjs)$/.test(p) && !/\.d\.ts$/.test(p)) out.push(p);
  return out;
}
const files = targets.flatMap((t) => collect(t));
if (!files.length) {
  console.error(`No .ts/.js files found under: ${targets.join(', ')}`);
  process.exit(1);
}

const findings = [];
const add = (file, line, rule, severity, message) => findings.push({ file, line, rule, severity, message });

/** Replaces comments and string contents with spaces (same length) so that regexes do not match inside them. */
function mask(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') { out += ' '; i++; }
    } else if (c === '/' && n === '*') {
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; }
      out += '  '; i += 2;
    } else if (c === '"' || c === "'" || c === '`') {
      const q = c;
      out += q; i++;
      while (i < src.length && src[i] !== q) {
        if (src[i] === '\\') { out += ' '; i++; }
        out += src[i] === '\n' ? '\n' : ' '; i++;
      }
      out += q; i++;
    } else { out += c; i++; }
  }
  return out;
}

const matcherKinds = new Set();

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  const masked = mask(src).split(/\r?\n/);
  const isSpec = /\.spec\.(ts|js)$/.test(file);
  const at = (i) => i + 1;

  lines.forEach((raw, i) => {
    const code = masked[i];
    // L01 / L02
    if (/\bwaitForTimeout\s*\(/.test(code)) add(file, at(i), 'L01', 'error', 'Fixed sleep (waitForTimeout): wait for an event, a response or a polled condition instead (flaky wait).');
    if (/\b(test|describe)\.only\s*\(/.test(code)) add(file, at(i), 'L02', 'error', '.only left in the code: the rest of the suite would be skipped.');
    // L03
    if (/\.toLocaleString\(\s*\)/.test(code)) add(file, at(i), 'L03', 'warn', 'toLocaleString() without a locale depends on the machine: use toLocaleString(\'en-US\') and pin locale in playwright.config.ts.');
    // L04 fragile selectors (selector strings are masked, so read them from the raw line)
    const sel = raw.match(/\blocator\(\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    if (sel) {
      const s = sel[2];
      const bare = s.replace(/\[[^\]]*\]/g, '');
      if (!/^(xpath=|text=|\/\/)/.test(s) && /[A-Za-z*)]\.[A-Za-z_-]/.test(bare)) add(file, at(i), 'L04', 'warn', `CSS class selector "${s}": breaks when styling changes. Prefer role, placeholder or visible text; ask for a data-testid if nothing stable exists.`);
      if (/:nth-(child|of-type)|>>\s*nth=/.test(s)) add(file, at(i), 'L04', 'warn', `Positional selector "${s}": depends on element order.`);
      if (/^xpath=/.test(s)) add(file, at(i), 'L04', 'info', `XPath "${s}": depends on the DOM structure; keep it in one helper and document the assumption.`);
      if (/\.(first|last)\(\)|\.nth\(/.test(raw) && !/getBy(Role|Text|Placeholder|Label|TestId)/.test(raw)) add(file, at(i), 'L04', 'info', 'locator(...).first()/nth() picks by position: fine only if the order is guaranteed.');
    }
    // L05
    if (/getByRole\([^)]*\{[^}]*\bname:\s*(['"`])/.test(raw) && !/exact:\s*true/.test(raw)) add(file, at(i), 'L05', 'info', 'getByRole name matches as a substring: add exact: true to avoid strict-mode violations or wrong matches.');
    // L06
    if (/Number\(\s*\(\s*[\w.()]+\.match\([^)]*\)\s*\?\?\s*\[\]\s*\)\.join\(\s*(''|"")\s*\)\s*\)/.test(raw)) add(file, at(i), 'L06', 'warn', 'Text without digits becomes 0 (Number("") === 0): an unreadable value would look like "0". Return NaN when no digit is found.');
    // L07 (skip when the result is checked soon after)
    if (/\.catch\(\s*\(\s*\)\s*=>\s*(null|undefined|\{\s*\})\s*\)/.test(code) || /\bcatch\s*(\([^)]*\))?\s*\{\s*\}/.test(code)) {
      const near = lines.slice(i, i + 10).join('\n');
      if (!/===\s*null|annotations\.push|console\.(warn|error)/.test(near)) add(file, at(i), 'L07', 'warn', 'Error swallowed (catch returning null / empty catch): the real cause disappears; check the result or record a WARN annotation.');
    }
    // L08
    const loop = code.match(/\bfor\s*\([^)]*\bof\s+([\w.]+)\s*\)\s*\{?\s*expect\(/);
    if (loop) {
      const name = loop[1].replace(/\./g, '\\.');
      const before = lines.slice(Math.max(0, i - 10), i).join('\n');
      const guarded = new RegExp(`expect\\(\\s*${name}\\.length|expect\\([^;]*\\b${name}\\b[^;]*\\)\\s*\\.(toHaveLength|toBeGreaterThan|toBeGreaterThanOrEqual)`).test(before);
      if (!guarded) add(file, at(i), 'L08', 'info', 'Assertion inside a loop runs zero times when the list is empty: assert the list is not empty (or has the expected length) first.');
    }
    // L09
    if (/await\s+[\w.()'"\[\]]+\.click\(\s*\)\s*;?\s*$/.test(code) && /\bconst\s+mark\s*=.*\.length/.test((masked[i + 1] ?? '') + (masked[i + 2] ?? ''))) add(file, at(i), 'L09', 'error', 'Dialog position taken after the click: an alert raised by the click is already counted. Take the position BEFORE clicking.');
    // L10
    if (/\b(password|passwd|pwd)\b\s*[:=]\s*(['"])[^'"]+\2/i.test(raw) && !/process\.env/.test(raw)) add(file, at(i), 'L10', 'warn', 'Hard-coded credential/test value in code: move it to data/*.json (or an environment variable).');
    // L11
    if (/\b(const|let)\s+\w+\s*(:[^=]+)?=\s*\[\s*$/.test(code) && /^\s*[{\["'`\d]/.test(masked[i + 1] ?? '') ) add(file, at(i), 'L11', 'warn', 'Inline data array in code: test data must live in data/*.json or data/*.csv and be read with loadData().');
    // collect matcher kinds for L12
    for (const m of code.matchAll(/\.(?:not\.)?(to(?:Be|Have|Contain|Equal|Match|StrictEqual|Throw|Pass)\w*)\s*\(/g)) matcherKinds.add(m[1]);
  });

  // L13 / L14 (specs only)
  if (isSpec) {
    if (!/\bloadData\s*(<[^>]*>)?\s*\(|readFileSync|from\s+['"][^'"]+\.(json|csv)['"]|require\(['"][^'"]+\.json['"]\)/.test(src)) add(file, 1, 'L14', 'warn', 'Spec reads no external data file: test data must not be hard-coded in specs.');
    const text = masked.join('\n');
    const starts = [...text.matchAll(/\btest(?:\.(?:only|skip|fixme))?\s*\(\s*['"`]/g)].map((m) => m.index);
    for (const s of starts) {
      const arrow = text.indexOf('=>', s);
      if (arrow < 0) continue;
      const open = text.indexOf('{', arrow);
      if (open < 0) continue;
      let depth = 0, j = open;
      for (; j < text.length; j++) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}' && --depth === 0) break;
      }
      if (depth !== 0) continue;
      const body = text.slice(open, j);
      const origBody = src.slice(open, j);
      if (!/\bexpect\w*[.(]|\bassert\w*\(/.test(body) && !/CLARIFY/.test(origBody)) {
        const line = text.slice(0, s).split('\n').length;
        add(file, line, 'L13', 'warn', 'Test without any assertion (and not marked CLARIFY): it can only fail by throwing.');
      }
    }
  }
}

// L12 suite-wide
if (matcherKinds.size < 3) add('(suite)', 0, 'L12', 'warn', `Only ${matcherKinds.size} distinct assertion kind(s) found (${[...matcherKinds].join(', ') || 'none'}): use at least three (value equality, UI state, condition/poll).`);

const order = { error: 0, warn: 1, info: 2 };
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || order[a.severity] - order[b.severity]);
const count = (s) => findings.filter((f) => f.severity === s).length;

if (asJson) {
  console.log(JSON.stringify({ files: files.length, matcherKinds: [...matcherKinds].sort(), errors: count('error'), warnings: count('warn'), info: count('info'), findings }, null, 2));
} else {
  let last = '';
  for (const f of findings) {
    if (f.file !== last) { console.log(`\n${f.file}`); last = f.file; }
    console.log(`  ${String(f.line).padStart(4)}  ${f.severity.padEnd(5)}  ${f.rule}  ${f.message}`);
  }
  console.log(`\n${files.length} file(s) scanned | assertion kinds: ${[...matcherKinds].sort().join(', ') || 'none'}`);
  console.log(`${count('error')} error(s), ${count('warn')} warning(s), ${count('info')} info`);
}
process.exit(count('error') > 0 || (strict && count('warn') > 0) ? 1 : 0);
