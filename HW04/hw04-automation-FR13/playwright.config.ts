import { defineConfig, devices } from '@playwright/test';

// Shown in the title of every HTML report ("Run by: <MSSV>" + ISO timestamp) - HW04 anti-cheat requirement.
const STUDENT_ID = '23120056';
const RUN_AT = new Date().toISOString();

// scripts/run-matrix.js sets these so that every feature x browser run gets its own report + JSON result.
const REPORT_DIR = process.env.REPORT_DIR ?? 'reports/latest';
const REPORT_LABEL = process.env.REPORT_LABEL ?? 'manual run';
const REPORT_JSON = process.env.REPORT_JSON ?? 'reports/_json/latest.json';

export default defineConfig({
  testDir: './tests',
  // The SUT keeps all state in one SQLite DB, so tests must not run in parallel.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 7_000 },
  metadata: { 'Run by': STUDENT_ID, 'Run at': RUN_AT, 'Run label': REPORT_LABEL },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: REPORT_DIR,
        open: 'never',
        title: `HW04 | Run by: ${STUDENT_ID} | ${REPORT_LABEL} | ${RUN_AT}`,
      },
    ],
    ['json', { outputFile: REPORT_JSON }],
  ],
  use: {
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
