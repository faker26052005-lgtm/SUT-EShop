import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorBanner: Locator;
  readonly passwordHint: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Đăng Ký Tài Khoản' });
    // Note: Register.jsx <label> tags lack `htmlFor` / wrapping `<input>`, so getByLabel() does not match.
    this.nameInput = page.locator('form div:has(> label:text-is("Họ Tên")) input');
    this.emailInput = page.locator('form div:has(> label:text-is("Email")) input');
    this.passwordInput = page.locator('form div:has(> label:text-is("Mật khẩu")) input');
    this.confirmPasswordInput = page.locator(
      'form div:has(> label:text-matches("Xác nhận mật khẩu", "i")) input'
    );
    this.submitButton = page.getByRole('button', { name: 'Đăng Ký' });
    this.errorBanner = page.locator('div.bg-red-100.text-red-700');
    this.passwordHint = page.locator('form p.text-xs');
    this.loginLink = page.getByRole('link', { name: 'Đăng nhập' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/register');
  }

  async fillForm(name: string, email: string, password: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
