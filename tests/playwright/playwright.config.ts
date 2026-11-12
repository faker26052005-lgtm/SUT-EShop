import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const STUDENT_ID = '23120183';
const RUN_TIMESTAMP_ISO = new Date().toISOString();
const SUT_ROOT = path.resolve(__dirname, '../..');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  metadata: {
    runBy: `Run by: ${STUDENT_ID}`,
    studentId: STUDENT_ID,
    executedAtISO: RUN_TIMESTAMP_ISO,
    sut: 'EShop Web Frontend (FR-01, FR-09, FR-15)',
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: 'playwright-report',
        open: 'never',
      },
    ],
    ['./reporters/antiCheatReporter.ts'],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: [
    {
      command: 'node server.js',
      cwd: path.join(SUT_ROOT, 'backend'),
      url: 'http://localhost:3000/api/products',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev -- --port 5173',
      cwd: path.join(SUT_ROOT, 'frontend-web'),
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev -- --port 5174',
      cwd: path.join(SUT_ROOT, 'frontend-admin'),
      url: 'http://localhost:5174',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
