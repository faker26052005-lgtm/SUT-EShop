import { defineConfig, devices } from '@playwright/test';

// Shown in the title of every HTML report ("Run by: <id>" + ISO timestamp). Override with RUN_BY=... if needed.
const RUN_BY = process.env.RUN_BY ?? '{{RUN_BY}}';
const RUN_AT = new Date().toISOString();

// scripts/run-matrix.js sets these so that every feature x browser run gets its own report + JSON result.
const REPORT_DIR = process.env.REPORT_DIR ?? 'reports/latest';
const REPORT_LABEL = process.env.REPORT_LABEL ?? 'manual run';
const REPORT_JSON = process.env.REPORT_JSON ?? 'reports/_json/latest.json';

export default defineConfig({
  testDir: './tests',
  // Shared SUT state (one database): tests must not run in parallel. Remove only if every test owns its data.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 7_000 },
  metadata: { 'Run by': RUN_BY, 'Run at': RUN_AT, 'Run label': REPORT_LABEL },
  reporter: [
    ['list'],
    ['html', { outputFolder: REPORT_DIR, open: 'never', title: `{{PROJECT_TITLE}} | Run by: ${RUN_BY} | ${REPORT_LABEL} | ${RUN_AT}` }],
    ['json', { outputFile: REPORT_JSON }],
  ],
  use: {
    locale: 'en-US', // number / date formats shown by the SUT must not depend on the OS language of the machine
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
