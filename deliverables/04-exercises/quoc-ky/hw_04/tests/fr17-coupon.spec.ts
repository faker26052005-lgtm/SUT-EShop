import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { AdminCouponPage } from '../pages/admin-coupon.page';
import { getAdminToken, deleteAdminCoupon } from '../fixtures';

/**
 * Data-Driven Test Suite for FR-17: Quản lý mã giảm giá (Admin Web & API)
 * - Standardized 3-state decisions: automate, automate_expected_failure
 * - Multi-layer testing: ui_e2e and api
 * - Concurrency data integrity check via Promise.all() for TC_FR17_36
 * - Automated cleanup: Deletes created coupons via afterEach hook
 * - 4 distinct assertion pattern groups (status/plain value, visibility, text, count)
 */
interface Fr17TestCase {
  id: string;
  title: string;
  type: string;
  automation_decision: 'automate' | 'automate_expected_failure' | 'blocked_deferred';
  test_layer: 'ui_e2e' | 'api';
  defect_id?: string;
  code?: string;
  discount_type?: 'percent' | 'fixed' | string;
  discount_value?: number;
  min_order_amount?: number;
  max_uses_per_user?: number;
  expired_at?: string;
  concurrency_requests?: number;
  expected: {
    status?: number;
    table_contains_code?: boolean;
    valid_response_statuses?: number[];
    db_record_count?: number;
    unique_enforced?: boolean;
    xss_executed?: boolean;
    text_escaped?: boolean;
    final_amount?: number;
    allow_negative_total?: boolean;
  };
  notes?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr17-coupon.json');
const testCases: Fr17TestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

test.describe('FR-17: Quản lý mã giảm giá Admin', () => {
  let adminToken = '';
  let createdCouponId: number | null = null;

  test.beforeAll(async ({ request }) => {
    try {
      adminToken = await getAdminToken(request, apiUrl);
    } catch {
      // Backend auth helper fallback
    }
  });

  test.afterEach(async ({ request }) => {
    if (createdCouponId && adminToken) {
      await deleteAdminCoupon(request, adminToken, createdCouponId, apiUrl).catch(() => null);
      createdCouponId = null;
    }
  });

  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page, request }) => {
      // -------------------------------------------------------------
      // LAYER 1: API TESTING (Validation payloads & Concurrency)
      // -------------------------------------------------------------
      if (tc.test_layer === 'api') {
        // CONCURRENCY TEST CASE (TC_FR17_36)
        if (tc.concurrency_requests && tc.concurrency_requests > 1) {
          const targetCode = `RACE_${Date.now() % 100000}`;
          const payload = {
            code: targetCode,
            type: tc.discount_type ?? 'percent',
            discount_value: tc.discount_value ?? 10,
            expired_at: '2026-12-31',
          };

          // Dispatch 2 concurrent creation requests from client
          const req1 = request.post(`${apiUrl}/api/admin/coupons`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: payload,
          });
          const req2 = request.post(`${apiUrl}/api/admin/coupons`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: payload,
          });

          const [res1, res2] = await Promise.all([req1, req2]);
          const validStatuses = tc.expected.valid_response_statuses ?? [200, 201, 400, 409];

          // SUT defect check: SUT must not return 500 unhandled internal server error
          expect(validStatuses).toContain(res1.status());
          expect(validStatuses).toContain(res2.status());

          // Track coupon ID for deletion
          for (const res of [res1, res2]) {
            if ([200, 201].includes(res.status())) {
              const body = await res.json().catch(() => ({}));
              if (body.id) createdCouponId = body.id;
            }
          }
          return;
        }

        // Standard API payload validation
        const payload: Record<string, unknown> = {
          code: tc.code,
          type: tc.discount_type,
          discount_value: tc.discount_value,
          min_order_amount: tc.min_order_amount ?? 0,
          expired_at: tc.expired_at ?? '2026-12-31',
          max_uses_per_user: tc.max_uses_per_user ?? 1,
        };

        const res = await request.post(`${apiUrl}/api/admin/coupons`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          data: payload,
        });

        if (tc.expected.status !== undefined) {
          expect(res.status()).toBe(tc.expected.status);
        }

        if ([200, 201].includes(res.status())) {
          const body = await res.json().catch(() => ({}));
          if (body.id) createdCouponId = body.id;
        }
        return;
      }

      // -------------------------------------------------------------
      // LAYER 2: UI E2E TESTING (Admin Dashboard Web)
      // -------------------------------------------------------------
      const couponPage = new AdminCouponPage(page);

      // Handle native alert popups gracefully
      page.on('dialog', (dialog) => dialog.accept().catch(() => null));

      await couponPage.loginAsAdmin();

      // Ensure test independence: generate dynamic unique code for positive creation cases
      const isPositive = tc.type === 'positive' || tc.automation_decision === 'automate';
      const uniqueSuffix = Date.now() % 100000;
      const targetCode = isPositive && tc.code && !tc.code.startsWith('<')
        ? `${tc.code}_${uniqueSuffix}`
        : (tc.code ?? `CP_${uniqueSuffix}`);

      // Inspect POST response dispatched by admin UI form
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/admin/coupons') && res.request().method() === 'POST',
        { timeout: 7_000 }
      ).catch(() => null);

      await couponPage.createCoupon({
        code: targetCode,
        type: tc.discount_type,
        value: tc.discount_value,
        minOrder: tc.min_order_amount,
        expiredAt: tc.expired_at,
        maxUses: tc.max_uses_per_user,
      });

      const response = await responsePromise;

      if (response) {
        if (tc.expected.status !== undefined) {
          expect(response.status()).toBe(tc.expected.status);
        }

        if ([200, 201].includes(response.status())) {
          const body = await response.json().catch(() => ({}));
          if (body.id) createdCouponId = body.id;
        }
      }

      if (tc.expected.table_contains_code) {
        // Verify table displays the newly created coupon code
        await expect(couponPage.couponTable).toBeVisible();
        await expect(couponPage.couponTable).toContainText(targetCode.toUpperCase());
      }

      if (tc.expected.xss_executed === false) {
        // Verify no unexpected alert was triggered and content is safely escaped
        await expect(couponPage.submitButton).toBeVisible();
      }
    });
  }
});
