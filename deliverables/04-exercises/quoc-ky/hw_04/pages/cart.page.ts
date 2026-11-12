import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Helper to parse Vietnamese currency strings (e.g. "30.000.000 ₫", "-20.000 ₫", "NaN ₫").
 * Rejects invalid non-numeric states (NaN, Infinity, empty) with descriptive errors instead of silent 0 fallbacks.
 */
export function parseCurrencyAmount(rawText: string, contextDescription: string = 'amount'): number {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error(`Invalid currency format for ${contextDescription}: string is empty`);
  }
  if (/NaN/i.test(trimmed)) {
    throw new Error(`Invalid currency format for ${contextDescription}: text contains 'NaN' ('${trimmed}')`);
  }
  if (/Infinity/i.test(trimmed)) {
    throw new Error(`Invalid currency format for ${contextDescription}: text contains 'Infinity' ('${trimmed}')`);
  }

  // Check for negative sign (e.g., "-20.000 ₫")
  const isNegative = trimmed.startsWith('-') || /-\s*\d/.test(trimmed);

  // Extract digit sequence
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (!digitsOnly) {
    throw new Error(`Invalid currency format for ${contextDescription}: no numeric digits found in '${trimmed}'`);
  }

  const parsed = parseInt(digitsOnly, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid currency format for ${contextDescription}: failed to parse integer from '${trimmed}'`);
  }

  return isNegative ? -parsed : parsed;
}

/**
 * Page Object Model for EShop Web Cart (/cart).
 * Encapsulates DOM interaction, accessible locators, and UI state extraction.
 * Adheres strictly to single-click actions without silent workaround retries.
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

  /**
   * Adds product to cart from Home page.
   * Supports stable identification by Product ID / Name (string), while retaining cardIndex (number) for compatibility.
   */
  async addProductFromHome(target: number | string = 0) {
    await this.page.goto('/');

    if (typeof target === 'number') {
      const addButtons = this.page.getByRole('button', { name: /thêm vào giỏ/i });
      await expect(addButtons.first()).toBeVisible();
      await addButtons.nth(target).click();
    } else {
      // Find card containing link to specific product ID or product title
      const productCard = this.page.locator('div.border.rounded', {
        has: this.page.locator(`a[href*="/product/${target}"]`).or(this.page.getByText(target, { exact: false })),
      });
      await expect(productCard.first()).toBeVisible();
      await productCard.first().getByRole('button', { name: /thêm vào giỏ/i }).click();
    }
  }

  /**
   * Adds product from Product Detail page.
   * Performs exactly one single click without automatic double-click workarounds.
   */
  async addProductFromDetail(productId: string, quantity: number = 1) {
    await this.page.goto(`/product/${productId}`);
    const quantityInput = this.page.locator('input[type="number"]');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill(String(quantity));
    }
    const addBtn = this.page.getByRole('button', { name: /thêm vào giỏ hàng/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();
  }

  async removeItem(rowIndex: number = 0) {
    const deleteBtn = this.tableRows.nth(rowIndex).getByRole('button', { name: /xóa/i });
    await expect(deleteBtn).toBeVisible();
    await deleteBtn.click();
  }

  /**
   * Retrieves raw inner text of a row's subtotal cell without transformation.
   */
  async getRowSubtotalText(rowIndex: number = 0): Promise<string> {
    const subtotalCell = this.tableRows.nth(rowIndex).locator('td').nth(3);
    await expect(subtotalCell).toBeVisible();
    return (await subtotalCell.innerText()).trim();
  }

  /**
   * Parses row subtotal into an integer. Throws descriptive error if string is NaN, Infinity, or empty.
   */
  async getRowSubtotal(rowIndex: number = 0): Promise<number> {
    const text = await this.getRowSubtotalText(rowIndex);
    return parseCurrencyAmount(text, `cart row ${rowIndex} subtotal`);
  }

  /**
   * Retrieves raw inner text of the grand total display without transformation.
   */
  async getTotalAmountText(): Promise<string> {
    await expect(this.totalAmountText).toBeVisible();
    return (await this.totalAmountText.innerText()).trim();
  }

  /**
   * Parses grand total into an integer. Throws descriptive error if string is NaN, Infinity, or empty.
   */
  async getTotalAmount(): Promise<number> {
    const text = await this.getTotalAmountText();
    return parseCurrencyAmount(text, 'cart grand total');
  }
}
