import { defineConfig } from '@playwright/test';

// Tiny config only for the SUT-free demo of fix F1 (no browser, no backend needed).
export default defineConfig({
  testDir: '.',
  testMatch: '*.demo.spec.ts',
  reporter: 'list',
  workers: 1,
  timeout: 15_000,
});
