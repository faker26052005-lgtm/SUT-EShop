import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Web Login (/login).
 * Refined implementation adhering to Accessible Locators and Web-First Assertions.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Accessible locators prioritized (Rule 4 GEMINI.md)
    this.usernameInput = page.getByLabel('Username').or(page.getByPlaceholder(/username|email/i));
    this.passwordInput = page.getByLabel('Mật khẩu').or(page.getByPlaceholder(/mật khẩu|password/i));
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorAlert = page.locator('div.bg-red-100');
    this.registerLink = page.getByRole('link', { name: /đăng ký ngay/i });
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.submitButton).toBeVisible();
  }

  async login(username: string, pass: string) {
    if (username !== '' && username !== '""') {
      await this.usernameInput.fill(username);
    } else {
      await this.usernameInput.clear();
    }

    if (pass !== '' && pass !== '""') {
      await this.passwordInput.fill(pass);
    } else {
      await this.passwordInput.clear();
    }

    await this.submitButton.click();
  }
}
