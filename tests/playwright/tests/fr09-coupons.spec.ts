import { test, expect } from '@playwright/test';
import { CheckoutCouponPage } from '../pages/CheckoutCouponPage';
import { loadJsonData } from '../utils/dataLoader';

interface CouponTestCase {
  id: string;
  category: string;
  title: string;
  couponCode: string;
  orderTotal: number;
  expected: {
    outcome: 'applied' | 'button_disabled' | 'error';
    buttonDisabled: boolean;
    discountAmountText?: string;
    finalAmountText?: string;
    errorContains?: string;
    bugNote?: string;
  };
}

const testCases = loadJsonData<CouponTestCase>('fr09-coupons.json');

test.describe('FR-09: Discount Coupons at Checkout (Data-Driven)', () => {
  for (const tc of testCases) {
    test(`[${tc.id}] (${tc.category}) ${tc.title}`, async ({ page }) => {
      test.info().annotations.push({
        type: 'Run by: 23120183',
        description: new Date().toISOString(),
      });

      const checkoutPage = new CheckoutCouponPage(page);
      await checkoutPage.loginAsCustomer('test@eshop.com', 'Test1234!');
      await checkoutPage.addFirstProductAndGoToCheckout();

      // Assertion Pattern 1: URL & Heading Visibility
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(checkoutPage.checkoutHeading).toBeVisible();
      await expect(checkoutPage.totalAmountInput).toHaveAttribute('type', 'number');

      await checkoutPage.setOrderTotal(tc.orderTotal);
      await checkoutPage.couponInput.fill(tc.couponCode);

      if (tc.expected.outcome === 'button_disabled') {
        // Assertion Pattern 2: Disabled Button State
        await expect(checkoutPage.applyCouponButton).toBeDisabled();
        await expect(checkoutPage.couponSuccessBox).toBeHidden();
        return;
      }

      await expect(checkoutPage.applyCouponButton).toBeEnabled();

      // Wait explicitly for backend /api/apply-coupon response to avoid UI race conditions
      const applyResponsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/apply-coupon') && res.request().method() === 'POST'
      );
      await checkoutPage.applyCouponButton.click();
      await applyResponsePromise;

      if (tc.expected.outcome === 'applied') {
        // Assertion Pattern 3: Visibility + Multi-region Text Content (Success Box & Final Total)
        await expect(
          checkoutPage.couponSuccessBox,
          tc.expected.bugNote ?? 'Expected coupon to be applied successfully'
        ).toBeVisible({ timeout: 2500 });
        await expect(checkoutPage.couponErrorMessage).toBeHidden();

        if (tc.expected.discountAmountText) {
          await expect(
            checkoutPage.couponSuccessBox,
            tc.expected.bugNote
          ).toContainText(tc.expected.discountAmountText);
        }
        if (tc.expected.finalAmountText) {
          await expect(
            checkoutPage.couponSuccessBox,
            tc.expected.bugNote
          ).toContainText(tc.expected.finalAmountText);
          await expect(
            checkoutPage.finalTotalLabel,
            tc.expected.bugNote
          ).toContainText(tc.expected.finalAmountText);
        }
      } else if (tc.expected.outcome === 'error') {
        await expect(checkoutPage.couponErrorMessage).toBeVisible({ timeout: 2500 });
        await expect(checkoutPage.couponSuccessBox).toBeHidden();
        if (tc.expected.errorContains) {
          await expect(checkoutPage.couponErrorMessage).toContainText(tc.expected.errorContains);
        }
      }
    });
  }
});
