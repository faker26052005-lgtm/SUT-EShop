// Automation Multi-Browser Test Runner for HW04
// Executes: 3 features x 3 browsers = 9 distinct runs producing 9 HTML reports.
// Usage: node scripts/run-all.mjs [--reseed]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Parse CLI flags
const args = process.argv.slice(2);
const shouldReseed = args.includes('--reseed');

if (shouldReseed) {
  console.log('================================================================');
  console.log('[RESEED NOTICE] You requested a database reseed.');
  console.log('Please ensure SUT servers are temporarily stopped, then run:');
  console.log('  cd /path/to/SUT-EShop/backend && node database.js');
  console.log('Then restart ./run_servers.sh before proceeding.');
  console.log('================================================================\n');
}

// Load feature definitions from features.json if available
let features = [
  { slug: 'fr02-login', spec: 'tests/fr02-login.spec.ts' },
  { slug: 'fr07-cart', spec: 'tests/fr07-cart.spec.ts' },
  { slug: 'fr17-coupon', spec: 'tests/fr17-coupon.spec.ts' },
];

const featuresJsonPath = path.resolve('features.json');
if (fs.existsSync(featuresJsonPath)) {
  try {
    const raw = JSON.parse(fs.readFileSync(featuresJsonPath, 'utf-8'));
    features = raw.map((f) => ({ slug: f.slug, spec: f.spec }));
  } catch (err) {
    console.warn('Warning: Could not parse features.json, falling back to default mapping.', err.message);
  }
}

const BROWSERS = (process.env.BROWSERS ?? 'chromium,firefox,webkit').split(',');
const STUDENT_ID = process.env.STUDENT_ID ?? '23120138';

let runCount = 0;
for (const feat of features) {
  for (const browser of BROWSERS) {
    runCount += 1;
    const runAt = new Date().toISOString();
    console.log(`\n================================================================`);
    console.log(`[Run ${runCount}/9] Feature: ${feat.slug} | Browser: ${browser}`);
    console.log(`Output: reports/${feat.slug}/${browser}`);
    console.log(`Timestamp: ${runAt} | Student ID: ${STUDENT_ID}`);
    console.log(`================================================================`);

    const result = spawnSync(
      'npx',
      ['playwright', 'test', feat.spec, `--project=${browser}`],
      {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          STUDENT_ID,
          FEATURE: feat.slug,
          BROWSER_TAG: browser,
          RUN_AT: runAt,
        },
      }
    );

    console.log(`[Run ${runCount}] Exit code: ${result.status} ${result.status !== 0 ? '(Failures detected - expected if true bugs exist)' : '(All passed)'}`);
  }
}

console.log('\n================================================================');
console.log('All 9 multi-browser runs completed.');
console.log('Verify HTML reports in reports/<feature>/<browser>/index.html');
console.log('Run validation script: python3 scripts/check_requirements.py');
console.log('================================================================');
