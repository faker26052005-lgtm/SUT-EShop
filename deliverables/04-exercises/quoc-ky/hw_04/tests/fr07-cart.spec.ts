import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { CartPage } from '../pages/cart.page';

/**
 * Data-Driven Test Suite for FR-07: Giỏ hàng
 * AI Draft generated for review.
 * All test data loaded from data/fr07-cart.json.
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

test.describe('FR-07: Giỏ hàng (AI Draft)', () => {
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page }) => {
      const cartPage = new CartPage(page);

      if (tc.type === 'positive' || tc.type === 'edge') {
        // Add item from home page
        await cartPage.addProductFromHome(tc.productId ?? '1');
        await cartPage.goto();

        // Assertion 1: Count assertion on cart table rows
        await expect(cartPage.cartRows).toHaveCount(1);

        // Assertion 2: Visibility of total amount
        await expect(cartPage.totalText).toBeVisible();

        // Assertion 3: Text content check on total price
        await expect(cartPage.totalText).toContainText(/₫/);

        // Assertion 4: Plain value check on parsed total price
        const totalRaw = await cartPage.totalText.innerText();
        const numericTotal = parseInt(totalRaw.replace(/\D/g, ''), 10);
        expect(numericTotal).toBeGreaterThan(0);
      } else {
        // Negative case handling
        await cartPage.goto();
        // Assertion 5: Empty cart visibility or validation
        await expect(cartPage.emptyCartMessage.or(cartPage.cartTable)).toBeVisible();
      }
    });
  }
});
