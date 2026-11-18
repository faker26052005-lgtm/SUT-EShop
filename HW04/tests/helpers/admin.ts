import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { ADMIN_URL } from './env';
import type { Status } from './api';

/** Vietnamese labels shown by the admin web. */
export const STATUS_LABEL: Record<Status, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  canceled: 'Đã hủy',
};

/** Button that moves an order INTO the given status. */
export const ACTION_BUTTON: Partial<Record<Status, string>> = {
  confirmed: 'Xác nhận',
  shipping: 'Giao hàng',
  delivered: 'Hoàn thành',
  canceled: 'Hủy',
};

/** "6,200,000 ₫" (en-US) and "6.200.000 ₫" (vi-VN) both become 6200000, so the locale of each browser does not matter. */
export const digits = (text: string): number => {
  const found = text.match(/\d/g);
  // "NaN", "-" or an empty tile must NOT be read as 0: that would let every "revenue did not change" case pass.
  // NaN (not an exception) on purpose: inside expect.poll() a thrown error aborts the poll, a NaN just keeps polling.
  return found ? Number(found.join('')) : NaN;
};

/** Native alert() boxes are auto-dismissed by Playwright; this keeps their text so a test can read it. */
export function captureDialogs(page: Page): string[] {
  const messages: string[] = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    await dialog.dismiss();
  });
  return messages;
}

/**
 * Open the admin web. With a token, it is put in localStorage('adminToken') before the app starts
 * (the same key the app uses after a real login), which skips the login form for tests that are not about login.
 */
export async function openAdmin(page: Page, opts: { token?: string; waitForOrders?: boolean } = {}): Promise<void> {
  const { token, waitForOrders = true } = opts;
  if (token !== undefined) {
    await page.addInitScript((t) => window.localStorage.setItem('adminToken', t), token);
  }
  const ordersLoaded =
    token !== undefined && waitForOrders
      ? page
          .waitForResponse((r) => r.url().includes('/api/admin/orders') && r.request().method() === 'GET', {
            timeout: 10_000,
          })
          .catch(() => null)
      : null;
  await page.goto(ADMIN_URL);
  if (ordersLoaded && (await ordersLoaded) === null) {
    // Not fatal here (waitDashboardLoaded decides), but it must be visible in the report instead of being swallowed.
    test.info().annotations.push({ type: 'WARN', description: 'GET /api/admin/orders was not observed within 10 s after opening the admin web' });
  }
}

export const loginHeading = (page: Page): Locator => page.getByRole('heading', { name: 'Admin Login' });
export const dashboardHeading = (page: Page): Locator =>
  page.getByRole('heading', { name: 'Dashboard', exact: true });
export const revenueTile = (page: Page): Locator =>
  page.getByRole('heading', { name: /Tổng doanh thu/ }).locator('xpath=following-sibling::p[1]');
export const orderCountTile = (page: Page): Locator =>
  page.getByRole('heading', { name: 'Tổng số đơn hàng' }).locator('xpath=following-sibling::p[1]');

export const readKpi = async (tile: Locator): Promise<number> => digits(await tile.innerText());

export async function goToTab(page: Page, label: 'Dashboard' | 'Đơn hàng'): Promise<void> {
  await page.locator('li').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).click();
}

export const orderRow = (page: Page, orderId: number): Locator =>
  page.locator('tr').filter({ has: page.getByRole('cell', { name: `#${orderId}`, exact: true }) });

/** Fills the admin login form and waits until the login request has been answered. */
export async function uiLogin(page: Page, email: string, password: string): Promise<void> {
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  const answered = page.waitForResponse((r) => r.url().includes('/api/login'));
  await page.getByRole('button', { name: 'Login' }).click();
  await answered;
}

/** The dashboard renders "0" until GET /api/admin/orders has been answered; wait for real data before reading tiles. */
export async function waitDashboardLoaded(page: Page): Promise<void> {
  await expect(dashboardHeading(page)).toBeVisible();
  await expect(orderCountTile(page)).not.toHaveText(/^\s*0\s*$/);
}
