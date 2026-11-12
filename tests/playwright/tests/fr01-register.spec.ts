import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { loadJsonData } from '../utils/dataLoader';

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
    test(`[${tc.id}] (${tc.category}) ${tc.title}`, async ({ page }) => {
      test.info().annotations.push({
        type: 'Run by: 23120183',
        description: new Date().toISOString(),
      });

      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      // Assertion Pattern 1: Visibility & heading text check
      await expect(registerPage.heading).toBeVisible();
      await expect(registerPage.heading).toHaveText('Đăng Ký Tài Khoản');
      await expect(registerPage.emailInput).toHaveAttribute('required', '');

      const uniqueEmail = tc.email.replace('{{ts}}', String(Date.now()));
      await registerPage.fillForm(tc.name, uniqueEmail, tc.password);

      if (tc.expected.outcome === 'confirm_field_visible') {
        await expect(registerPage.confirmPasswordInput).toBeVisible();
        return;
      }

      await registerPage.submit();

      if (tc.expected.outcome === 'redirect_login') {
        // Assertion Pattern 2: URL navigation check
        await expect(page).toHaveURL(new RegExp(`${tc.expected.expectedUrl}$`));
      } else if (tc.expected.outcome === 'html5_invalid') {
        const targetInput =
          tc.expected.invalidField === 'name'
            ? registerPage.nameInput
            : tc.expected.invalidField === 'email'
              ? registerPage.emailInput
              : registerPage.passwordInput;

        const isValid = await targetInput.evaluate((el: HTMLInputElement) => el.checkValidity());
        expect(isValid).toBe(false);
        await expect(page).toHaveURL(/\/register$/);
      } else if (tc.expected.outcome === 'error_banner') {
        // Assertion Pattern 3: Error banner visibility & text content
        await expect(registerPage.errorBanner).toBeVisible();
        if (tc.expected.errorContains) {
          await expect(registerPage.errorBanner).toContainText(tc.expected.errorContains);
        }
        await expect(page).toHaveURL(/\/register$/);
      }
    });
  }
});
