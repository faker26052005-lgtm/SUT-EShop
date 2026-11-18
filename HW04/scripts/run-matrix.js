#!/usr/bin/env node
/**
 * Runs every feature x browser combination as its own Playwright run, so that each run produces
 * its own HTML report (reports/<feature>-<browser>/) that shows "Run by: <MSSV>" + an ISO timestamp.
 *
 *   node scripts/run-matrix.js fr13                       -> fr13 on chromium, firefox, webkit (3 runs)
 *   node scripts/run-matrix.js fr04,fr08,fr13             -> 9 runs
 *   node scripts/run-matrix.js fr13 chromium              -> one run
 *
 * Test failures are expected (they are the bugs); the script only fails when a run produced no result file.
 * Set DRY_RUN=1 to print the commands without running them.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const features = (process.argv[2] || 'fr13').split(',').map((s) => s.trim()).filter(Boolean);
const browsers = (process.argv[3] || 'chromium,firefox,webkit').split(',').map((s) => s.trim()).filter(Boolean);
const PW = process.env.PW_CMD || 'npx playwright';

const rows = [];
for (const feature of features) {
  for (const browser of browsers) {
    const slug = `${feature}-${browser}`;
    const env = {
      ...process.env,
      REPORT_DIR: `reports/${slug}`,
      REPORT_LABEL: `${feature.toUpperCase()} on ${browser}`,
      REPORT_JSON: `reports/_json/${slug}.json`,
    };
    const cmd = `${PW} test ${feature}- --project=${browser}`;
    console.log(`\n=== ${slug}: ${cmd}`);
    if (process.env.DRY_RUN) {
      console.log(`    report -> ${env.REPORT_DIR}`);
      continue;
    }
    fs.rmSync(path.join('reports', slug), { recursive: true, force: true });
    const res = spawnSync(cmd, { stdio: 'inherit', shell: true, env });
    const hasResult = fs.existsSync(env.REPORT_JSON);
    rows.push({ slug, exit: res.status, hasResult });
  }
}

if (!process.env.DRY_RUN) {
  console.log('\n=== Matrix finished');
  for (const r of rows) console.log(`${r.hasResult ? 'ok     ' : 'NO RESULT'}  ${r.slug}  (playwright exit code ${r.exit})`);
  console.log('Next: npm run summary');
  if (rows.some((r) => !r.hasResult)) process.exit(2);
}
