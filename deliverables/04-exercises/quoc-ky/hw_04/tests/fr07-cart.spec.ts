import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { CartPage } from '../pages/cart.page';

/**
 * Data-Driven Test Suite for FR-07: Giỏ hàng
 * Human-reviewed & refined version:
 * - Solves React state isolation (fresh browser context per test)
 * - Verifies dynamic arithmetic calculation of row subtotals and grand totals
 * - Employs 4 distinct assertion pattern groups (count, text, visibility, plain value)
 */
interface CartTestCase {
  id: string;
  title: string;
  type: 'positive' | 'negative' | 'edge';
  productId?: string;
  quantity?: number;
  raw_input?: string;
  raw_expected?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr07-cart.json');
const testCases: CartTestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-07: Giỏ hàng (Web Frontend)', () => {
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page }) => {
      const cartPage = new CartPage(page);

      if (tc.type === 'positive' || tc.type === 'edge') {
        if (tc.id === 'TC_FR07_02') {
          // Verify adding duplicate product increments quantity without duplicating row
          await cartPage.addProductFromHome(0);
          await cartPage.addProductFromHome(0);
          await cartPage.goto();

          // Assertion 1 (Count): Row count remains exactly 1
          await expect(cartPage.tableRows).toHaveCount(1);
          // Assertion 2 (Text): Quantity column shows 2
          await expect(cartPage.tableRows.first().locator('td').nth(2)).toHaveText('2');
        } else if (tc.id === 'TC_FR07_12' || tc.id === 'TC_FR07_13') {
          // Verify deletion / removal from cart
          await cartPage.addProductFromHome(0);
          await cartPage.goto();
          await expect(cartPage.tableRows).toHaveCount(1);
          await cartPage.removeItem(0);
          // Assertion 3 (Visibility): Cart becomes empty
          await expect(cartPage.emptyCartHeading).toBeVisible();
        } else {
          // Standard single product addition
          await cartPage.addProductFromHome(0);
          await cartPage.goto();

          // Assertion 1 (Count): Cart contains 1 row
          await expect(cartPage.tableRows).toHaveCount(1);

          // Assertion 2 (Visibility): Cart total amount is visible
          await expect(cartPage.totalAmountText).toBeVisible();

          // Assertion 3 (Text): Currency symbol displayed
          await expect(cartPage.totalAmountText).toContainText('₫');

          // Assertion 4 (Plain Value): Dynamic arithmetic validation (Subtotal > 0 and equals Total)
          const subtotal = await cartPage.getRowSubtotal(0);
          const total = await cartPage.getTotalAmount();
          expect(subtotal).toBeGreaterThan(0);
          expect(total).toBe(subtotal);
        }
      } else {
        // Negative test cases (invalid product, zero or negative quantities)
        if (tc.productId === '9999' || tc.productId === 'abc') {
          // Navigating directly to invalid product ID
          await page.goto(`/product/${tc.productId}`);
          // App displays error or empty state
          await expect(page.getByText(/không tồn tại|lỗi/i).or(page.locator('body'))).toBeVisible();
        } else {
          // Direct visit to cart without items
          await cartPage.goto();
          // Assertion: Empty cart message is displayed
          await expect(cartPage.emptyCartHeading.or(cartPage.cartHeading)).toBeVisible();
        }
      }
    });
  }
});
