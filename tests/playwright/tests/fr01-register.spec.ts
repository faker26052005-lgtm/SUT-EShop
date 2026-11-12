import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { loadJsonData } from '../utils/dataLoader';
import { annotateTestRun } from '../utils/testHelpers';

interface RegisterTestCase {
  id: string;
  category: string;
  title: string;
  name: string;
  email: string;
  password: string;
  checkConfirmField: boolean;
  expected: {
    outcome: 'redirect_login' | 'html5_invalid' | 'error_banner' | 'confirm_field_visible';
    invalidField?: 'name' | 'email' | 'password';
    errorContains?: string;
    expectedUrl: string;
    bugNote?: string;
  };
}

const testCases = loadJsonData<RegisterTestCase>('fr01-register.json');

test.describe('FR-01: Account Registration (Data-Driven)', () => {
  for (const tc of testCases) {
    test(`[${tc.id}] (${tc.category}) ${tc.title}`, async ({ page, browserName }) => {
      annotateTestRun(test.info(), {
        feature: 'FR-01',
        tcId: tc.id,
        category: tc.category,
        bugNote: tc.expected.bugNote,
      });

      const registerPage = new RegisterPage(page);
      let registerApiCalled = false;
      page.on('request', (req) => {
        if (req.url().includes('/api/register') && req.method() === 'POST') {
          registerApiCalled = true;
        }
      });

      await registerPage.goto();

      // Assertion Pattern 1: Element Visibility, Exact Text & Required Attribute
      await expect(registerPage.heading).toBeVisible();
      await expect(registerPage.heading).toHaveText('Đăng Ký Tài Khoản');
      await expect(registerPage.emailInput).toHaveAttribute('required', '');
      await expect(registerPage.errorBanner).toBeHidden();

      const uniqueSuffix = `${browserName}_${Date.now()}`;
      const resolvedEmail = tc.email.replace('{{ts}}', uniqueSuffix);
      await registerPage.fillForm(tc.name, resolvedEmail, tc.password);

      if (tc.expected.outcome === 'confirm_field_visible') {
        await expect(
          registerPage.confirmPasswordInput,
          tc.expected.bugNote ?? 'Confirm Password field should exist on /register'
        ).toBeVisible({ timeout: 2000 });
        return;
      }

      await registerPage.submit();

      if (tc.expected.outcome === 'redirect_login') {
        // Assertion Pattern 2: URL Navigation
        await expect(
          page,
          tc.expected.bugNote ?? 'Expected successful registration to navigate to /login'
        ).toHaveURL(new RegExp(`${tc.expected.expectedUrl}$`), { timeout: 2500 });
      } else if (tc.expected.outcome === 'html5_invalid') {
        // Assertion Pattern 3 & 4: Native HTML5 Constraint Validation + Zero API Call Guard
        const targetInput =
          tc.expected.invalidField === 'name'
            ? registerPage.nameInput
            : tc.expected.invalidField === 'email'
              ? registerPage.emailInput
              : registerPage.passwordInput;

        const validity = await targetInput.evaluate((el: HTMLInputElement) => ({
          valid: el.checkValidity(),
          messageLength: el.validationMessage.length,
        }));
        expect(validity.valid).toBe(false);
        expect(validity.messageLength).toBeGreaterThan(0);
        expect(registerApiCalled).toBe(false);
        await expect(page).toHaveURL(/\/register$/);
      } else if (tc.expected.outcome === 'error_banner') {
        // Assertion Pattern 2 & 3: Error Banner Visibility & Text Content
        await expect(
          registerPage.errorBanner,
          tc.expected.bugNote ?? 'Expected validation error banner on invalid input'
        ).toBeVisible({ timeout: 2500 });
        if (tc.expected.errorContains) {
          await expect(registerPage.errorBanner).toContainText(tc.expected.errorContains);
        }
        await expect(page).toHaveURL(/\/register$/);
      }
    });
  }
});
