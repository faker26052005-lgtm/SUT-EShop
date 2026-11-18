#!/usr/bin/env node
/**
 * Creates a ready-to-run, data-driven, 3-browser Playwright project from the skill's templates.
 *
 *   node scripts/scaffold-project.js <targetDir> [--preset generic|eshop] [--run-by ID] [--title TEXT]
 *                                    [--web-url URL] [--api-url URL] [--force]
 *
 * Presets
 *   generic  config, run-matrix/summarize scripts and generic helpers (data loader JSON/CSV, dialogs, numbers, env)
 *   eshop    generic + the EShop helpers (API login/register/orders, customer web, admin web) and data/*.json stubs
 *
 * Existing files are never overwritten unless --force is given.
 */
const fs = require('fs');
const path = require('path');

const SKILL = path.resolve(__dirname, '..');
const TPL = path.join(SKILL, 'resources', 'templates', 'project');
const ESHOP = path.join(SKILL, 'resources', 'eshop');

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
const target = path.resolve(args[0]);
const preset = opt('--preset', 'generic');
if (!['generic', 'eshop'].includes(preset)) {
  console.error(`Unknown preset "${preset}" (use generic or eshop)`);
  process.exit(1);
}
const force = args.includes('--force');
const vars = {
  PROJECT_NAME: path.basename(target).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'automation',
  PROJECT_TITLE: opt('--title', 'Automation Testing'),
  RUN_BY: opt('--run-by', 'YOUR-ID'),
  WEB_URL: opt('--web-url', 'http://localhost:5173'),
  API_URL: opt('--api-url', 'http://localhost:3000/api'),
};
const render = (text) => text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

const written = [];
const skipped = [];
function emit(relPath, content) {
  const out = path.join(target, relPath);
  if (fs.existsSync(out) && !force) {
    skipped.push(relPath);
    return;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content);
  written.push(relPath);
}

function walk(dir, base = '') {
  const items = [];
  for (const name of fs.readdirSync(dir)) {
    const rel = path.join(base, name);
    if (fs.statSync(path.join(dir, name)).isDirectory()) items.push(...walk(path.join(dir, name), rel));
    else items.push(rel);
  }
  return items;
}

const targetName = (rel) => {
  if (path.basename(rel) === 'gitignore.tpl') return path.join(path.dirname(rel), '.gitignore');
  return rel.endsWith('.tpl') ? rel.slice(0, -4) : rel;
};

// 1. generic templates
for (const rel of walk(TPL)) {
  const content = fs.readFileSync(path.join(TPL, rel));
  emit(targetName(rel), rel.endsWith('.tpl') ? render(content.toString('utf8')) : content);
}
// 2. preset overlay (overwrites the generic env.ts on purpose: written even if it exists from step 1 of this run)
if (preset === 'eshop') {
  for (const rel of walk(ESHOP)) {
    const out = path.join(target, rel);
    const content = fs.readFileSync(path.join(ESHOP, rel));
    const generated = written.includes(rel);
    if (fs.existsSync(out) && !force && !generated) {
      skipped.push(rel);
      continue;
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, content);
    if (!generated) written.push(rel);
  }
}
// 3. empty folders the workflow expects
for (const d of ['docs/review', 'bugs/screenshots']) {
  const keep = path.join(target, d, '.gitkeep');
  if (!fs.existsSync(keep)) {
    fs.mkdirSync(path.dirname(keep), { recursive: true });
    fs.writeFileSync(keep, '');
  }
}

console.log(`Project scaffolded in ${target} (preset: ${preset})`);
console.log(`  written: ${written.length} file(s)${skipped.length ? `, skipped (already exist): ${skipped.join(', ')}` : ''}`);
console.log('\nNext steps');
console.log(`  1. cd "${target}" && npm install && npx playwright install chromium firefox webkit`);
if (preset === 'eshop') console.log('  2. Fill data/accounts.json with the admin and user accounts given in the SRS');
console.log(`  ${preset === 'eshop' ? 3 : 2}. node ${path.relative(process.cwd(), path.join(SKILL, 'scripts', 'scaffold-feature.js'))} <featureId> --title "<feature title>" --dir "${target}"`);
