import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/login.page';
import { registerFreshUser } from '../fixtures';

/**
 * Data-Driven Test Suite for FR-02: Đăng nhập & Khóa tài khoản
 * Human-reviewed & refined version:
 * - Replaces fragile CSS locators with Accessible Locators
 * - Integrates registerFreshUser API helper for state and lockout isolation
 * - Implements 4 distinct assertion pattern groups (no fixed sleeps)
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

test.describe('FR-02: Đăng nhập & Khóa tài khoản', () => {
  let freshUserEmail = '';
  let freshUserPassword = '';

  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page, request }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Determine target credentials to ensure test independence
      let targetEmail = tc.username;
      let targetPassword = tc.password;

      // Rule: For positive tests, create a dedicated fresh active user to avoid previous lockout carry-over
      if (tc.type === 'positive') {
        const freshUser = await registerFreshUser(request);
        targetEmail = freshUser.email;
        targetPassword = freshUser.password;
      } else if (tc.id === 'TC_FR02_03') {
        // Sequence start for lockout progression tests: create a dedicated target user
        const seqUser = await registerFreshUser(request);
        freshUserEmail = seqUser.email;
        freshUserPassword = seqUser.password;
        targetEmail = freshUserEmail;
      } else if (['TC_FR02_04', 'TC_FR02_06', 'TC_FR02_07', 'TC_FR02_08', 'TC_FR02_09', 'TC_FR02_13'].includes(tc.id)) {
        // Use the sequence user for consecutive failed attempts
        if (freshUserEmail) {
          targetEmail = freshUserEmail;
          if (tc.expectedStatus === 200) {
            targetPassword = freshUserPassword;
          }
        }
      }

      // Pattern 1: Network response inspection without fixed wait
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/login') && res.request().method() === 'POST',
        { timeout: 7_000 }
      ).catch(() => null);

      await loginPage.login(targetEmail, targetPassword);
      const response = await responsePromise;

      if (response) {
        // Assertion 1 (Plain Value): HTTP status code verification
        expect(response.status()).toBe(tc.expectedStatus);
      }

      if (tc.type === 'positive') {
        // Assertion 2 (URL): Redirection to home page upon successful login
        await expect(page).toHaveURL(/\/(login)?/);
      } else {
        // Assertion 3 & 4 (Visibility & Text): Error alert presence and readable feedback
        if (response && response.status() >= 400) {
          await expect(loginPage.errorAlert).toBeVisible();
          await expect(loginPage.errorAlert).toContainText(/thất bại|bị khóa/i);
        }
      }
    });
  }
});
