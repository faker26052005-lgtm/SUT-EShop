import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Web Login (/login).
 * AI Draft implementation for FR-02.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    // Basic locator targeting
    this.usernameInput = page.getByLabel(/username/i).or(page.locator('input').first());
    this.passwordInput = page.getByLabel(/mật khẩu|password/i).or(page.locator('input[type="text"]').nth(1));
    this.submitButton = page.getByRole('button', { name: /sign in|đăng nhập/i });
    this.errorAlert = page.locator('.bg-red-100');
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
