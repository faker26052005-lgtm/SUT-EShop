import { Locator, Page } from '@playwright/test';

export class AdminProductPage {
  readonly page: Page;
  readonly adminUrl = 'http://localhost:5174';

  // Admin Login
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // Navigation
  readonly productsNavItem: Locator;
  readonly pageHeading: Locator;

  // Product Form
  readonly formHeading: Locator;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly imageUrlInput: Locator;
  readonly descriptionInput: Locator;
  readonly categorySelect: Locator;
  readonly saveButton: Locator;
  readonly cancelEditButton: Locator;

  // Product Table
  readonly productTable: Locator;
  readonly productRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });

    this.productsNavItem = page.locator('ul li').filter({ hasText: /^Sản phẩm$/ });
    this.pageHeading = page.getByRole('heading', { name: 'Quản lý Sản phẩm' });

    this.formHeading = page.locator('form h3');
    this.nameInput = page.getByPlaceholder('Tên sản phẩm');
    this.priceInput = page.getByPlaceholder('Giá tiền');
    this.imageUrlInput = page.getByPlaceholder('URL Ảnh');
    this.descriptionInput = page.getByPlaceholder('Mô tả');
    this.categorySelect = page.locator('form select');
    this.saveButton = page.getByRole('button', { name: 'Lưu sản phẩm' });
    this.cancelEditButton = page.getByRole('button', { name: 'Hủy sửa' });

    this.productTable = page.locator('table:has(th:text-is("Tên SP"))');
    this.productRows = this.productTable.locator('tbody tr');
  }

  async gotoAndLogin(email: string, password: string): Promise<void> {
    await this.page.goto(this.adminUrl);
    if (await this.loginButton.isVisible()) {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
    await this.productsNavItem.waitFor({ state: 'visible' });
  }

  async openProductsTab(): Promise<void> {
    await this.productsNavItem.click();
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  async fillProductForm(data: {
    name: string;
    price: string | number;
    description?: string;
    imageUrl?: string;
    categoryId?: string | number;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.priceInput.fill(String(data.price));
    if (data.imageUrl !== undefined) {
      await this.imageUrlInput.fill(data.imageUrl);
    }
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
    if (data.categoryId !== undefined) {
      await this.categorySelect.selectOption(String(data.categoryId));
    }
  }

  rowByProductName(name: string): Locator {
    return this.productRows.filter({ hasText: name });
  }
}
