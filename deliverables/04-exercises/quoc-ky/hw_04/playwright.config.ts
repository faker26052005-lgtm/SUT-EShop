import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'node:os';
import path from 'node:path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const STUDENT_ID = process.env.STUDENT_ID ?? '23120138';
const FEATURE = process.env.FEATURE ?? 'all';
const BROWSER_TAG = process.env.BROWSER_TAG ?? 'all';
const RUN_AT = process.env.RUN_AT ?? new Date().toISOString();
const OUT = `reports/${FEATURE}/${BROWSER_TAG}`;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  retries: 0,          // Retries must stay 0 for authentic evidence runs
  workers: 1,          // Ensure serial execution to avoid shared-state conflicts (lockout, coupons)
  reporter: [
    ['list'],
    ['html', {
      outputFolder: `${OUT}`,
      open: 'never',
      // Visible in the report title header (Mandatory: Run by: <StudentID>)
      title: `Run by: ${STUDENT_ID} | ${FEATURE} | ${BROWSER_TAG} | ${RUN_AT}`,
    }],
    ['json', { outputFile: `${OUT}/results.json` }], // Machine-readable metadata for checker
  ],
  metadata: {
    'Run by': STUDENT_ID,
    'Run at': RUN_AT,
    Feature: FEATURE,
    Browser: BROWSER_TAG,
    Host: os.hostname(),
  },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
