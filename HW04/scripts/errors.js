// Prints, for every FAILED test, its first error message; and for every test, its CLARIFY notes.
// Usage:  node scripts/errors.js            (writes docs/errors.md as UTF-8)
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'reports', '_json');
const strip = (s) => String(s || '').replace(/\u001b\[[0-9;]*m/g, '');

function* tests(suite, trail = []) {
  const t = suite.title && !suite.title.endsWith('.ts') ? [...trail, suite.title] : trail;
  for (const spec of suite.specs || []) for (const test of spec.tests || []) yield { spec, test };
  for (const s of suite.suites || []) yield* tests(s, t);
}

const out = [];
const log = (t = '') => out.push(t);
for (const file of fs.readdirSync(dir).filter((f) => /^fr\d+-.+\.json$/.test(f)).sort()) {
  const run = file.replace('.json', '');
  const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const failed = [], notes = [];
  for (const top of json.suites || []) {
    for (const { spec, test } of tests(top)) {
      const last = test.results[test.results.length - 1] || {};
      if (test.status === 'unexpected' || last.status === 'failed' || last.status === 'timedOut') {
        const msg = strip((last.error && last.error.message) || (last.errors && last.errors[0] && last.errors[0].message) || '(no message)');
        failed.push(`### ${spec.title}\n\n\`\`\`\n${msg.split('\n').slice(0, 14).join('\n')}\n\`\`\`\n`);
      }
      for (const a of test.annotations || []) if (a.type === 'CLARIFY') notes.push(`- ${a.description}`);
    }
  }
  log(`\n## ${run}  (${failed.length} failed)\n`);
  log(failed.join('\n'));
  if (notes.length) log(`\n### CLARIFY notes (${run})\n\n${notes.join('\n')}\n`);
}

fs.mkdirSync(path.join(__dirname, '..', 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'errors.md'), out.join('\n'), 'utf8');
console.log('Wrote docs/errors.md');
