import { TestInfo } from '@playwright/test';

/**
 * Attach standardized student anti-cheat and defect traceability annotations to each test run.
 */
export function annotateTestRun(
  testInfo: TestInfo,
  options: { feature: string; tcId: string; category: string; bugNote?: string }
): void {
  testInfo.annotations.push(
    { type: 'Run by: 23120183', description: new Date().toISOString() },
    { type: 'Feature', description: `${options.feature} | ${options.tcId} (${options.category})` }
  );
  if (options.bugNote) {
    testInfo.annotations.push({ type: 'SUT Defect Note', description: options.bugNote });
  }
}
