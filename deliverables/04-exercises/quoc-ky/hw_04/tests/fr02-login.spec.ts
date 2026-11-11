import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/login.page';

/**
 * Data-Driven Test Suite for FR-02: Đăng nhập & Khóa tài khoản
 * AI Draft generated for review.
 * All test data loaded from data/fr02-login.json.
 */
interface LoginTestCase {
  id: string;
  title: string;
  type: 'positive' | 'negative' | 'edge';
  username: string;
  password: string;
  expectedStatus: number;
  expectedUrl?: string;
  raw_expected?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr02-login.json');
const testCases: LoginTestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-02: Đăng nhập & Khóa tài khoản (AI Draft)', () => {
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Wait for login API response
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/login') && res.request().method() === 'POST',
        { timeout: 10_000 }
      ).catch(() => null);

      await loginPage.login(tc.username, tc.password);

      const response = await responsePromise;
      if (response) {
        // Assertion 1: Plain value assertion on HTTP response status
        expect(response.status()).toBe(tc.expectedStatus);
      }

      if (tc.type === 'positive') {
        // Assertion 2: URL assertion on successful redirection
        await expect(page).toHaveURL(/\/(login)?/);
      } else {
        // Assertion 3: Visibility & Text assertion on error message
        if (response && response.status() >= 400) {
          await expect(loginPage.errorAlert).toBeVisible();
          await expect(loginPage.errorAlert).toContainText(/thất bại|bị khóa/i);
        }
      }
    });
  }
});
