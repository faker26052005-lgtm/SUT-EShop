import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Web Login (/login).
 * Follows locator priority: getByRole, getByLabel, getByPlaceholder.
 * Uses web-first assertions without fixed sleeps.
 */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    // Prefer getByLabel or getByPlaceholder over CSS selectors
    this.emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    this.passwordInput = page.getByLabel(/mật khẩu|password/i).or(page.getByPlaceholder(/mật khẩu|password/i));
    this.submitButton = page.getByRole('button', { name: /đăng nhập|login/i });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
    // Wait for observable element rather than arbitrary sleep
    await expect(this.submitButton).toBeVisible();
  }

  async login(email: string, pass: string) {
    if (email !== '') {
      await this.emailInput.fill(email);
    } else {
      await this.emailInput.clear();
    }

    if (pass !== '') {
      await this.passwordInput.fill(pass);
    } else {
      await this.passwordInput.clear();
    }

    await this.submitButton.click();
  }
}
