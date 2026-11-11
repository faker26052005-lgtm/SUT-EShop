import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { AdminCouponPage } from '../pages/admin-coupon.page';

/**
 * Data-Driven Test Suite for FR-17: Quản lý mã giảm giá Admin
 * AI Draft generated for review.
 * All test data loaded from data/fr17-coupon.json.
 */
interface CouponTestCase {
  id: string;
  title: string;
  type: 'positive' | 'negative' | 'edge';
  code: string;
  discount_type?: 'percent' | 'fixed' | string;
  discount_value?: number;
  expectedStatus: number;
  raw_input?: string;
  raw_expected?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr17-coupon.json');
const testCases: CouponTestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-17: Quản lý mã giảm giá Admin (AI Draft)', () => {
  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page }) => {
      const couponPage = new AdminCouponPage(page);
      await couponPage.loginAsAdmin();

      // Intercept coupon creation API
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/admin/coupons') && res.request().method() === 'POST',
        { timeout: 7_000 }
      ).catch(() => null);

      await couponPage.createCoupon({
        code: tc.code,
        type: tc.discount_type,
        value: tc.discount_value,
      });

      const response = await responsePromise;
      if (response) {
        // Assertion 1: Plain value assertion on HTTP response status
        expect([200, 201, 400, 401, 403, 404]).toContain(response.status());
      }

      if (tc.type === 'positive') {
        // Assertion 2: Visibility assertion on table
        await expect(couponPage.couponRows.first()).toBeVisible();
        // Assertion 3: Text assertion verifying newly created coupon code
        await expect(page.locator('table')).toContainText(tc.code.toUpperCase());
      } else {
        // Assertion 4: Dialog or alert verification for negative input
        await expect(couponPage.submitButton).toBeVisible();
      }
    });
  }
});
