import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Web Cart (/cart).
 * AI Draft implementation for FR-07.
 */
export class CartPage {
  readonly page: Page;
  readonly emptyCartMessage: Locator;
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly totalText: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartMessage = page.getByText(/giỏ hàng của bạn đang trống/i);
    this.cartTable = page.locator('table');
    this.cartRows = page.locator('tbody tr');
    this.totalText = page.locator('.text-red-600');
    this.checkoutButton = page.getByRole('button', { name: /tiến hành thanh toán/i });
    this.continueShoppingButton = page.getByRole('link', { name: /tiếp tục mua sắm|← mua tiếp/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async addProductFromHome(productId: string = '1') {
    await this.page.goto('/');
    const addBtn = this.page.getByRole('button', { name: /thêm vào giỏ/i }).first();
    await addBtn.click();
  }

  async addProductFromDetail(productId: string, quantity: number = 1) {
    await this.page.goto(`/product/${productId}`);
    const quantityInput = this.page.locator('input[type="number"]');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill(String(quantity));
    }
    const addBtn = this.page.getByRole('button', { name: /thêm vào giỏ hàng/i });
    await addBtn.click();
  }

  async removeItem(index: number = 0) {
    const deleteBtn = this.page.getByRole('button', { name: /xóa/i }).nth(index);
    await deleteBtn.click();
  }
}
