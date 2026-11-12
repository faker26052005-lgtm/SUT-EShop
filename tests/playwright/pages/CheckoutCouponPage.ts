import { Locator, Page } from '@playwright/test';

export class CheckoutCouponPage {
  readonly page: Page;
  // Login page elements
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;

  // Home & Cart elements
  readonly addToCartButtons: Locator;
  readonly cartNavLink: Locator;
  readonly proceedToCheckoutButton: Locator;

  // Checkout & Coupon elements
  readonly checkoutHeading: Locator;
  readonly totalAmountInput: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponErrorMessage: Locator;
  readonly couponSuccessBox: Locator;
  readonly finalTotalLabel: Locator;
  readonly confirmCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginUsernameInput = page.locator('form div:has(> label:text-is("Username")) input');
    this.loginPasswordInput = page.locator('form div:has(> label:text-is("Mật khẩu")) input');
    this.loginSubmitButton = page.getByRole('button', { name: 'Sign In' });

    this.addToCartButtons = page.getByRole('button', { name: 'Thêm vào giỏ' });
    this.cartNavLink = page.getByRole('link', { name: 'Giỏ hàng' });
    this.proceedToCheckoutButton = page.getByRole('button', { name: 'Tiến hành thanh toán' });

    this.checkoutHeading = page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' });
    this.totalAmountInput = page.locator('input[type="number"]');
    this.couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
    this.applyCouponButton = page.getByRole('button', { name: 'Áp dụng' });
    this.couponErrorMessage = page.locator('p.text-red-600');
    this.couponSuccessBox = page.locator('div.text-green-700');
    this.finalTotalLabel = page.locator('span.font-bold.text-xl');
    this.confirmCheckoutButton = page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
  }

  async loginAsCustomer(email: string, password: string): Promise<void> {
    await this.page.goto('/login');
    await this.loginUsernameInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
    await this.page.waitForURL('**/');
    // Wait for AuthContext user state to hydrate in Header before leaving the page
    await this.page.getByRole('button', { name: 'Thoát' }).waitFor({ state: 'visible' });
  }

  async addFirstProductAndGoToCheckout(): Promise<void> {
    // Already on '/' after loginAsCustomer(); avoid page.goto('/') reload that resets AuthContext user to null
    await this.addToCartButtons.first().click();
    await this.cartNavLink.click();
    await this.proceedToCheckoutButton.click();
    await this.page.waitForURL('**/checkout');
  }

  async setOrderTotal(amount: number): Promise<void> {
    await this.totalAmountInput.fill(String(amount));
  }

  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    if (await this.applyCouponButton.isEnabled()) {
      await this.applyCouponButton.click();
    }
  }
}
