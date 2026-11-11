import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Admin Coupon Management.
 * AI Draft implementation for FR-17.
 */
export class AdminCouponPage {
  readonly page: Page;
  readonly adminUrl: string;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly couponTab: Locator;
  readonly codeInput: Locator;
  readonly typeSelect: Locator;
  readonly valueInput: Locator;
  readonly minOrderInput: Locator;
  readonly expiredDateInput: Locator;
  readonly maxUsesInput: Locator;
  readonly submitButton: Locator;
  readonly couponRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminUrl = process.env.ADMIN_URL ?? 'http://localhost:5174';

    // Admin login locators
    this.emailInput = page.locator('input[type="email"]').or(page.locator('input').first());
    this.passwordInput = page.locator('input[type="password"]').or(page.locator('input').nth(1));
    this.loginButton = page.getByRole('button', { name: /đăng nhập|login/i });

    // Coupon tab navigation
    this.couponTab = page.getByText('Mã Giảm Giá');

    // Coupon form locators
    this.codeInput = page.getByPlaceholder(/Mã coupon/i);
    this.typeSelect = page.locator('select').first();
    this.valueInput = page.getByPlaceholder(/Giá trị %|Số tiền/i);
    this.minOrderInput = page.getByPlaceholder(/Đơn tối thiểu/i);
    this.expiredDateInput = page.locator('input[type="date"]').or(page.getByPlaceholder(/Ngày hết hạn/i));
    this.maxUsesInput = page.getByPlaceholder(/Số lần dùng tối đa/i);
    this.submitButton = page.getByRole('button', { name: 'Tạo mã' });
    this.couponRows = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto(this.adminUrl);
  }

  async loginAsAdmin(
    email: string = process.env.ADMIN_EMAIL ?? 'admin@eshop.com',
    password: string = process.env.ADMIN_PASSWORD ?? 'Admin123!'
  ) {
    await this.goto();
    // Check if login is required
    if (await this.loginButton.isVisible()) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
    // Navigate to coupons tab
    await expect(this.couponTab).toBeVisible();
    await this.couponTab.click();
    await expect(this.submitButton).toBeVisible();
  }

  async createCoupon(data: {
    code: string;
    type?: string;
    value?: number;
    minOrder?: number;
    expiredAt?: string;
    maxUses?: number;
  }) {
    await this.codeInput.fill(data.code);
    if (data.type) {
      await this.typeSelect.selectOption(data.type);
    }
    if (data.value !== undefined) {
      await this.valueInput.fill(String(data.value));
    }
    if (data.minOrder !== undefined) {
      await this.minOrderInput.fill(String(data.minOrder));
    }
    if (data.expiredAt) {
      await this.expiredDateInput.fill(data.expiredAt);
    } else {
      // Default to 30 days ahead
      const nextMonth = new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0];
      await this.expiredDateInput.fill(nextMonth);
    }
    if (data.maxUses !== undefined) {
      await this.maxUsesInput.fill(String(data.maxUses));
    }
    await this.submitButton.click();
  }
}
