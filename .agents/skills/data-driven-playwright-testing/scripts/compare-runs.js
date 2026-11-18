#!/usr/bin/env node
/**
 * Compare two Playwright JSON results (before / after a fix) and print what changed per test.
 *
 *   node scripts/compare-runs.js demo-out/before.json reports/_json/<feature>-<browser>.json
 *
 * Output: totals, tests that went red -> green (false failures removed), green -> red (regressions)
 * and tests that stay red (real bugs).
 */
const fs = require('fs');

function collect(file) {
  const report = JSON.parse(fs.readFileSync(file, 'utf8'));
  const result = new Map();
  const walk = (suite) => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests ?? []) {
        const key = `${spec.title}`;
        // expected = passed as intended, unexpected = failed, flaky = passed after retry, skipped
        result.set(key, t.status === 'expected' || t.status === 'flaky' ? 'pass' : t.status === 'skipped' ? 'skip' : 'fail');
      }
    }
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const s of report.suites ?? []) walk(s);
  return { result, stats: report.stats ?? {} };
}

const [beforeFile, afterFile] = process.argv.slice(2);
if (!beforeFile || !afterFile) {
  console.error('usage: node compare-runs.js <before.json> <after.json>');
  process.exit(1);
}
const before = collect(beforeFile);
const after = collect(afterFile);
const count = (m, s) => [...m.values()].filter((v) => v === s).length;
const id = (title) => title.split(/\s+/)[0];

console.log('                BEFORE   AFTER');
console.log(`total tests     ${String(before.result.size).padStart(6)}  ${String(after.result.size).padStart(6)}`);
console.log(`passed          ${String(count(before.result, 'pass')).padStart(6)}  ${String(count(after.result, 'pass')).padStart(6)}`);
console.log(`failed          ${String(count(before.result, 'fail')).padStart(6)}  ${String(count(after.result, 'fail')).padStart(6)}`);
if (before.stats.duration && after.stats.duration) {
  console.log(`duration (s)    ${String(Math.round(before.stats.duration / 1000)).padStart(6)}  ${String(Math.round(after.stats.duration / 1000)).padStart(6)}`);
}

const group = { fixed: [], regressed: [], still: [] };
for (const [title, b] of before.result) {
  const a = after.result.get(title);
  if (b === 'fail' && a === 'pass') group.fixed.push(title);
  else if (b === 'pass' && a === 'fail') group.regressed.push(title);
  else if (b === 'fail' && a === 'fail') group.still.push(title);
}
const show = (label, list) => {
  console.log(`\n${label} (${list.length})`);
  for (const t of list) console.log(`  - ${id(t)}  ${t.slice(id(t).length).trim()}`);
};
show('RED -> GREEN  (false failures removed by the fix)', group.fixed);
show('GREEN -> RED  (regressions, should be 0)', group.regressed);
show('STILL RED     (real bugs found in the SUT)', group.still);
