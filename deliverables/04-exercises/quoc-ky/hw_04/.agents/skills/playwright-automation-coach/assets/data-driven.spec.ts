import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/login.page';

/**
 * Data-Driven Spec Template for HW04.
 * Rule: All test cases and inputs are loaded from data/*.json.
 * Zero inline arrays/objects in the spec.
 */
interface LoginTestCase {
  id: string;              // e.g., 'TC_FR02_01'
  title: string;          // Human-readable case title from HW02
  type: 'positive' | 'negative' | 'boundary' | 'edge';
  automation_decision: 'automate' | 'automate_expected_failure' | 'blocked_deferred';
  test_layer: 'ui_e2e' | 'api' | 'integration';
  defect_id?: string;
  blocker_reason?: string;
  unblock_condition?: string;
  preconditions?: Record<string, unknown>;
  username: string;
  password: string;
  expected: {
    status?: number;       // HTTP status from /api/login
    url?: string;          // Regex/path pattern for redirection
    message?: string;      // UI error text on rejection
  };
}

const dataFilePath = path.resolve(__dirname, '../../data/fr02-login.json');
const testCases: LoginTestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-02: Đăng nhập & Khóa tài khoản', () => {
  for (const tc of testCases) {
    if (tc.automation_decision === 'blocked_deferred') {
      test.skip(`${tc.id} [${tc.type}] ${tc.title}`, async () => {
        // Blocked: tc.blocker_reason
      });
      continue;
    }

    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Pattern 1: Network response inspection
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/login') && res.request().method() === 'POST'
      );

      await loginPage.login(tc.username, tc.password);
      const response = await responsePromise;

      if (tc.expected.status !== undefined) {
        expect(response.status()).toBe(tc.expected.status);
      }

      if (tc.expected.url) {
        // Pattern 2: URL navigation verification
        await expect(page).toHaveURL(new RegExp(tc.expected.url));
      }

      if (tc.expected.message) {
        // Pattern 3: Visibility of error alert
        await expect(loginPage.errorAlert).toBeVisible();
        // Pattern 4: Exact or containing text assertion
        await expect(loginPage.errorAlert).toContainText(tc.expected.message);
      }
    });
  }
});
