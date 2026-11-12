import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { CartPage } from '../pages/cart.page';

/**
 * Data-Driven Test Suite for FR-07: Giỏ hàng
 * - Standardized 3-state decisions: automate, automate_expected_failure
 * - Browser React state isolation: Each test gets a fresh page and empty cart
 * - Strictly asserts expected outcomes per SRS (expected failures demonstrate SUT defects)
 * - 5 distinct assertion pattern groups (count, visibility, text, plain value, URL)
 */
interface Fr07TestCase {
  id: string;
  title: string;
  type: string;
  automation_decision: 'automate' | 'automate_expected_failure' | 'blocked_deferred';
  test_layer: 'ui_e2e' | 'api';
  defect_id?: string;
  action?: string;
  product_id?: string;
  quantity?: number | string;
  row_index?: number;
  expected: {
    status?: number;
    row_count?: number;
    quantity?: number;
    subtotal?: number;
    total?: number;
    error_displayed?: boolean;
    added_to_cart?: boolean;
    blocked?: boolean;
    allow_negative?: boolean;
    subtotal_greater_than_zero?: boolean;
    nan_prevented?: boolean;
    blocked_by_input_type?: boolean;
    only_positive_integers?: boolean;
    crash_prevented?: boolean;
    infinity_prevented?: boolean;
    subtotal_item_1?: number;
    subtotal_item_2?: number;
    element?: {
      role: string;
      name: string;
    };
    disabled?: boolean;
    dialog_triggered?: boolean;
    dialog_type?: string;
    item_removed?: boolean;
    item_retained?: boolean;
    empty_message_visible?: boolean;
    label_exact_text?: string;
    forbidden_text?: string;
    dialog_enforced?: boolean;
    redirect_url?: string;
    cart_preserved?: boolean;
  };
  notes?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr07-cart.json');
const testCases: Fr07TestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

test.describe('FR-07: Giỏ hàng (Web Frontend & API)', () => {
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page, request }) => {
      const cartPage = new CartPage(page);

      // LAYER 1: API TESTS
      if (tc.test_layer === 'api') {
        const payload: Record<string, unknown> = {};
        if (tc.product_id !== undefined) payload.productId = tc.product_id;
        if (tc.quantity !== undefined) payload.quantity = tc.quantity;

        const res = await request.post(`${apiUrl}/api/cart`, { data: payload });
        if (tc.expected.status !== undefined) {
          expect(res.status()).toBe(tc.expected.status);
        }
        return;
      }

      // LAYER 2: UI E2E TESTS
      switch (tc.action) {
        case 'add_from_product_detail': {
          // Standard single-click addition from product detail
          await page.goto(`/product/${tc.product_id ?? '1'}`);
          const addBtn = page.getByRole('button', { name: /thêm vào giỏ hàng/i });
          await expect(addBtn).toBeVisible();
          await addBtn.click();

          await cartPage.goto();
          if (tc.expected.row_count !== undefined) {
            await expect(cartPage.tableRows).toHaveCount(tc.expected.row_count);
          }
          break;
        }

        case 'add_duplicate_product': {
          // Add product once from home, then add same product again
          await cartPage.addProductFromHome(0);
          await cartPage.addProductFromHome(0);
          await cartPage.goto();

          // Per SRS: Should consolidate into 1 row with incremented quantity
          if (tc.expected.row_count !== undefined) {
            await expect(cartPage.tableRows).toHaveCount(tc.expected.row_count);
          }
          if (tc.expected.quantity !== undefined) {
            const qtyCell = cartPage.tableRows.first().locator('td').nth(2);
            await expect(qtyCell).toHaveText(String(tc.expected.quantity));
          }
          break;
        }

        case 'view_non_existent_product': {
          await page.goto(`/product/${tc.product_id}`);
          // Per SRS: System should display clear user-friendly error message
          const errorMsg = page.getByText(/không tìm thấy|không tồn tại|lỗi/i);
          await expect(errorMsg).toBeVisible();
          break;
        }

        case 'input_quantity_zero':
        case 'input_negative_quantity':
        case 'input_empty_quantity':
        case 'input_decimal_quantity': {
          await page.goto(`/product/${tc.product_id ?? '1'}`);
          const qtyInput = page.locator('input[type="number"]');
          await qtyInput.fill(String(tc.quantity ?? ''));

          const addBtn = page.getByRole('button', { name: /thêm vào giỏ hàng/i });
          await addBtn.click();
          await cartPage.goto();

          if (await cartPage.tableRows.count() > 0) {
            const subtotal = await cartPage.getRowSubtotal(0);
            if (tc.expected.subtotal_greater_than_zero) {
              expect(subtotal).toBeGreaterThan(0);
            }
            if (tc.expected.allow_negative === false) {
              expect(subtotal).toBeGreaterThanOrEqual(0);
            }
            if (tc.expected.nan_prevented) {
              const subtotalText = await cartPage.tableRows.first().locator('td').nth(3).innerText();
              expect(subtotalText).not.toContain('NaN');
            }
          }
          break;
        }

        case 'input_text_quantity': {
          await page.goto(`/product/${tc.product_id ?? '1'}`);
          const qtyInput = page.locator('input[type="number"]');
          // Browser input[type="number"] should reject alphabetic characters
          await qtyInput.fill('abc');
          const value = await qtyInput.inputValue();
          expect(value).toBe('');
          break;
        }

        case 'input_large_quantity': {
          await page.goto(`/product/${tc.product_id ?? '1'}`);
          const qtyInput = page.locator('input[type="number"]');
          await qtyInput.fill(String(tc.quantity));

          const addBtn = page.getByRole('button', { name: /thêm vào giỏ hàng/i });
          await addBtn.click();
          await cartPage.goto();

          // Verify no NaN or Infinity crash
          const totalText = await cartPage.totalAmountText.innerText();
          expect(totalText).not.toContain('NaN');
          expect(totalText).not.toContain('Infinity');
          break;
        }

        case 'click_decrement_button':
        case 'check_decrement_at_minimum': {
          await cartPage.addProductFromHome(0);
          await cartPage.goto();

          // Per SRS: Cart must provide accessible '-' button for decrementing
          const decBtn = cartPage.tableRows.first().getByRole('button', { name: '-' });
          await expect(decBtn).toBeVisible();

          if (tc.expected.disabled) {
            await expect(decBtn).toBeDisabled();
          }
          break;
        }

        case 'confirm_delete_dialog':
        case 'cancel_delete_dialog':
        case 'assert_confirmation_dialog_enforced': {
          await cartPage.addProductFromHome(0);
          await cartPage.goto();
          await expect(cartPage.tableRows).toHaveCount(1);

          let dialogTriggered = false;
          page.once('dialog', async (dialog) => {
            dialogTriggered = true;
            if (tc.action === 'cancel_delete_dialog') {
              await dialog.dismiss();
            } else {
              await dialog.accept();
            }
          });

          await cartPage.removeItem(0);

          // Per SRS: Confirmation dialog must be enforced before product deletion
          expect(dialogTriggered).toBe(true);

          if (tc.action === 'cancel_delete_dialog') {
            await expect(cartPage.tableRows).toHaveCount(1);
          }
          break;
        }

        case 'remove_last_item': {
          await cartPage.addProductFromHome(0);
          await cartPage.goto();
          await expect(cartPage.tableRows).toHaveCount(1);

          await cartPage.removeItem(0);
          await expect(cartPage.emptyCartHeading).toBeVisible();
          break;
        }

        case 'check_total_label': {
          await cartPage.addProductFromHome(0);
          await cartPage.goto();

          // Per SRS FR-07: Summary label must be 'Tổng cộng'
          const label = page.getByText('Tổng cộng');
          await expect(label).toBeVisible();
          break;
        }

        case 'click_continue_shopping': {
          await cartPage.goto();
          await expect(cartPage.continueShoppingLink).toBeVisible();
          await cartPage.continueShoppingLink.click();
          await expect(page).toHaveURL(/\/(#.*)?$/);
          break;
        }

        default: {
          // Default multi-product calculation case (TC_FR07_12)
          await cartPage.addProductFromHome(0);
          await cartPage.addProductFromHome(1);
          await cartPage.goto();

          await expect(cartPage.tableRows).toHaveCount(2);
          const subtotal1 = await cartPage.getRowSubtotal(0);
          const subtotal2 = await cartPage.getRowSubtotal(1);
          const total = await cartPage.getTotalAmount();

          expect(subtotal1).toBeGreaterThan(0);
          expect(subtotal2).toBeGreaterThan(0);
          expect(total).toBe(subtotal1 + subtotal2);
        }
      }
    });
  }
});
