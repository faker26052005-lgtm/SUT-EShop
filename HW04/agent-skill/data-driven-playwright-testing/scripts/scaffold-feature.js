#!/usr/bin/env node
/**
 * Adds a feature skeleton to a project created by scaffold-project.js.
 *
 *   node scripts/scaffold-feature.js <featureId> [--title "Feature title"] [--dir <projectDir>] [--force]
 *
 * featureId = lowercase letters and digits, e.g. fr04. It becomes the file-name prefix that scripts/run-matrix.js uses.
 * Creates: data/<id>-cases.json, tests/<id>-<slug>.spec.ts, docs/review/<id>-review.md
 * (and docs/spec-notes.md, bugs/BUG_LIST.md if missing) and adds npm scripts test:<id> and test:all.
 * Scaffold rows are marked "draft": they show up in the list as fixme until you replace the TODOs.
 */
const fs = require('fs');
const path = require('path');

const SKILL = path.resolve(__dirname, '..');
const TPL = path.join(SKILL, 'resources', 'templates');

function usage(code) {
  const text = fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^#!.*\n/, '').replace(/^\/\*\*\n|^ \* ?/gm, '');
  console.log(text.trim());
  process.exit(code);
}
const args = process.argv.slice(2);
if (!args.length || args.includes('--help') || args.includes('-h')) usage(args.length ? 0 : 1);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const id = args[0];
if (!/^[a-z][a-z0-9]*$/.test(id)) {
  console.error(`featureId "${id}" must be lowercase letters and digits (for example fr04)`);
  process.exit(1);
}
const dir = path.resolve(opt('--dir', process.cwd()));
const force = args.includes('--force');
for (const must of ['playwright.config.ts', path.join('tests', 'helpers', 'data.ts'), 'package.json']) {
  if (!fs.existsSync(path.join(dir, must))) {
    console.error(`${dir} is not a project created by scaffold-project.js (missing ${must}).`);
    process.exit(1);
  }
}
const title = opt('--title', id.toUpperCase());
const slug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'feature';
const vars = { FEATURE_ID: id, FEATURE_ID_UPPER: id.toUpperCase(), FEATURE_TITLE: title, SPEC_FILES: 'system_requirements_specification.md, api_specification.md' };
const render = (t) => t.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

const made = [];
function emit(rel, tplRel, onlyIfMissing = false) {
  const out = path.join(dir, rel);
  if (fs.existsSync(out) && (onlyIfMissing || !force)) {
    if (!onlyIfMissing) console.log(`skipped (exists): ${rel}`);
    return;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(fs.readFileSync(path.join(TPL, tplRel), 'utf8')));
  made.push(rel);
}

emit(path.join('data', `${id}-cases.json`), path.join('feature', 'cases.json.tpl'));
emit(path.join('tests', `${id}-${slug}.spec.ts`), path.join('feature', 'feature.spec.ts.tpl'));
emit(path.join('docs', 'review', `${id}-review.md`), path.join('feature', 'review.md.tpl'));
emit(path.join('docs', 'spec-notes.md'), path.join('docs', 'spec-notes.md.tpl'), true);
emit(path.join('bugs', 'BUG_LIST.md'), path.join('docs', 'bug-list.md.tpl'), true);

// npm scripts: test:<id> and test:all
const pkgPath = path.join(dir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts[`test:${id}`] = `node scripts/run-matrix.js ${id}`;
const ids = Object.keys(pkg.scripts).filter((k) => /^test:[a-z][a-z0-9]*$/.test(k) && k !== 'test:all').map((k) => k.slice(5));
pkg.scripts['test:all'] = `node scripts/run-matrix.js ${ids.join(',')}`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Feature ${id} scaffolded in ${dir}:`);
for (const f of made) console.log(`  + ${f}`);
console.log(`  ~ package.json (scripts test:${id}, test:all)`);
console.log('\nNext: fill data/' + `${id}-cases.json from the SRS, replace the TODOs in the spec, then`);
console.log(`  node ${path.relative(process.cwd(), path.join(SKILL, 'scripts', 'lint-tests.js'))} ${path.join(dir, 'tests')}`);
