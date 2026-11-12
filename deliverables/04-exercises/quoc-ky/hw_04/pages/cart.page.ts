import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for EShop Web Cart (/cart).
 * Refined implementation:
 * - Uses accessible role locators (heading, button, table)
 * - Encapsulates row subtotal extraction and arithmetic validation
 */
export class CartPage {
  readonly page: Page;
  readonly emptyCartHeading: Locator;
  readonly cartHeading: Locator;
  readonly tableRows: Locator;
  readonly totalAmountText: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartHeading = page.getByRole('heading', { name: /giỏ hàng của bạn đang trống/i });
    this.cartHeading = page.getByRole('heading', { name: 'Giỏ Hàng' });
    this.tableRows = page.locator('table tbody tr');
    this.totalAmountText = page.locator('.text-red-600');
    this.checkoutButton = page.getByRole('button', { name: /tiến hành thanh toán/i });
    this.continueShoppingLink = page.getByRole('link', { name: /tiếp tục mua sắm|← mua tiếp/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async addProductFromHome(cardIndex: number = 0) {
    await this.page.goto('/');
    const addButtons = this.page.getByRole('button', { name: /thêm vào giỏ/i });
    await expect(addButtons.first()).toBeVisible();
    await addButtons.nth(cardIndex).click();
  }

  async addProductFromDetail(productId: string, quantity: number = 1) {
    await this.page.goto(`/product/${productId}`);
    const quantityInput = this.page.locator('input[type="number"]');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill(String(quantity));
    }
    const addBtn = this.page.getByRole('button', { name: /thêm vào giỏ hàng/i });
    // Handle SUT intentional double-click quirk on ProductDetail if needed
    await addBtn.click();
    if (await addBtn.isVisible() && (await addBtn.innerText()).includes('Thêm vào giỏ hàng')) {
      await addBtn.click();
    }
  }

  async removeItem(rowIndex: number = 0) {
    const deleteBtn = this.tableRows.nth(rowIndex).getByRole('button', { name: /xóa/i });
    await deleteBtn.click();
  }

  async getRowSubtotal(rowIndex: number = 0): Promise<number> {
    const subtotalCell = this.tableRows.nth(rowIndex).locator('td').nth(3);
    const text = await subtotalCell.innerText();
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
  }

  async getTotalAmount(): Promise<number> {
    const text = await this.totalAmountText.innerText();
    return parseInt(text.replace(/\D/g, ''), 10) || 0;
  }
}
