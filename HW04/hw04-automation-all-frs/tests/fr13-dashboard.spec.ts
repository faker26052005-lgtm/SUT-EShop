import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { loadData } from './helpers/data';
import { ACCOUNTS } from './helpers/env';
import {
  createOrder,
  ensureAtLeastOneOrder,
  listOrders,
  loginApi,
  moveOrderTo,
  registerThrowawayUser,
  revenueOf,
} from './helpers/api';
import type { Status } from './helpers/api';
import {
  ACTION_BUTTON,
  STATUS_LABEL,
  captureDialogs,
  dashboardHeading,
  goToTab,
  loginHeading,
  openAdmin,
  orderCountTile,
  orderRow,
  readKpi,
  revenueTile,
  uiLogin,
  waitDashboardLoaded,
} from './helpers/admin';

/**
 * FR-13 Dashboard (admin web, http://localhost:5174)
 * SRS: revenue = sum of total_amount of orders with status 'delivered'; also show the total number of orders.
 * Related: FR-12 access control, FR-10 order state machine (the dashboard depends on order status).
 *
 * Oracle = the SRS, applied to the order list returned by GET /api/admin/orders (verified in HW02).
 * Test data = data/fr13-dashboard.json and data/fr13-access.json.
 *
 * Why most scenarios check a CHANGE (delta) of the tiles: the database already holds old orders, so the absolute
 * numbers are arbitrary. A delta isolates the rule under test ("a pending order adds nothing"), and one dedicated
 * scenario (S13) anchors the absolute value.
 */

type Scenario = {
  id: string;
  title: string;
  mode: 'api-seed' | 'ui-walk' | 'final-state' | 'absolute';
  orders: { amount: number; finalStatus: Status }[];
  walk?: Status[];
  expect: { revenueDelta?: number; countDelta?: number; noActionButtons?: boolean };
  countVerdict?: 'firm' | 'clarify';
  source?: string;
};

type AccessCase = {
  id: string;
  title: string;
  kind: 'ui-login' | 'no-token' | 'inject-token';
  account?: 'admin' | 'user' | 'throwaway-wrong-password';
  password?: string;
  token?: 'user' | 'literal';
  tokenValue?: string;
  expect: 'reject' | 'dashboard' | 'login-form';
  source?: string;
};

const scenarios = loadData<Scenario[]>('fr13-dashboard.json');
const accessCases = loadData<AccessCase[]>('fr13-access.json');

const CLARIFY_COUNT =
  'SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged.';

/** Revenue tile must have moved by `delta` since `base` (assertion pattern: polling numeric equality). */
async function expectRevenueDelta(page: Page, base: number, delta: number) {
  await expect
    .poll(async () => (await readKpi(revenueTile(page))) - base, {
      message: `Dashboard revenue must change by ${delta} (SRS FR-13: only delivered orders are summed)`,
    })
    .toBe(delta);
}

async function expectCountDelta(page: Page, base: number, delta: number, verdict: 'firm' | 'clarify' = 'firm') {
  if (verdict === 'clarify') {
    const shown = await readKpi(orderCountTile(page));
    test.info().annotations.push({
      type: 'CLARIFY',
      description: `${CLARIFY_COUNT} Order tile moved from ${base} to ${shown} (expected change if all orders count: ${delta}).`,
    });
    return;
  }
  await expect
    .poll(async () => (await readKpi(orderCountTile(page))) - base, {
      message: `Dashboard total orders must change by ${delta} (SRS FR-13)`,
    })
    .toBe(delta);
}

test.beforeAll(async ({ request }) => {
  await ensureAtLeastOneOrder(request);
});

test.describe('FR-13 Dashboard figures', () => {
  for (const sc of scenarios) {
    test(`${sc.id} - ${sc.title}`, async ({ page, request }) => {
      const adminToken = await loginApi(request, 'admin');
      const userToken = await loginApi(request, 'user');
      const before = await listOrders(request, adminToken);

      // ---------------------------------------------------------------- absolute value
      if (sc.mode === 'absolute') {
        await openAdmin(page, { token: adminToken });
        await waitDashboardLoaded(page);
        await expect
          .poll(() => readKpi(revenueTile(page)), {
            message: 'Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)',
          })
          .toBe(revenueOf(before));
        await expect
          .poll(() => readKpi(orderCountTile(page)), {
            message: 'Dashboard total orders must equal the number of orders in the system (SRS FR-13)',
          })
          .toBe(before.length);
        return;
      }

      // ---------------------------------------------------------------- orders are arranged through the API
      if (sc.mode === 'api-seed') {
        await openAdmin(page, { token: adminToken });
        await waitDashboardLoaded(page);
        const revenue0 = await readKpi(revenueTile(page));
        const count0 = await readKpi(orderCountTile(page));

        for (const o of sc.orders) {
          const id = await createOrder(request, userToken, o.amount);
          await moveOrderTo(request, adminToken, id, o.finalStatus);
        }

        // The data row must agree with the SRS rule, otherwise the data file (not the SUT) is wrong.
        const after = await listOrders(request, adminToken);
        expect(revenueOf(after) - revenueOf(before), 'data-file revenueDelta').toBe(sc.expect.revenueDelta);
        expect(after.length - before.length, 'data-file countDelta').toBe(sc.expect.countDelta);

        await page.reload();
        await waitDashboardLoaded(page);
        await expectRevenueDelta(page, revenue0, sc.expect.revenueDelta as number);
        await expectCountDelta(page, count0, sc.expect.countDelta as number, sc.countVerdict);
        return;
      }

      // ---------------------------------------------------------------- the status is changed with the admin UI buttons
      if (sc.mode === 'ui-walk') {
        const amount = sc.orders[0].amount;
        const id = await createOrder(request, userToken, amount); // stays 'pending'

        await openAdmin(page, { token: adminToken });
        await waitDashboardLoaded(page);
        const revenue0 = await readKpi(revenueTile(page));
        const count0 = await readKpi(orderCountTile(page)); // already includes the new pending order

        await goToTab(page, 'Đơn hàng');
        const row = orderRow(page, id);
        await expect(row.locator('span').filter({ hasText: STATUS_LABEL.pending })).toBeVisible();

        for (const next of sc.walk ?? []) {
          await row.getByRole('button', { name: ACTION_BUTTON[next], exact: true }).click();
          await expect(row.locator('span').filter({ hasText: STATUS_LABEL[next] })).toBeVisible();

          // After every click the dashboard must follow the SRS rule: revenue moves only when 'delivered' is reached.
          await goToTab(page, 'Dashboard');
          await expectRevenueDelta(page, revenue0, next === 'delivered' ? amount : 0);
          await expectCountDelta(page, count0, 0, sc.countVerdict);
          await goToTab(page, 'Đơn hàng');
        }

        const finalList = await listOrders(request, adminToken);
        expect(revenueOf(finalList) - revenueOf(before), 'data-file revenueDelta').toBe(sc.expect.revenueDelta);
        expect(finalList.length - before.length, 'data-file countDelta').toBe(sc.expect.countDelta);
        return;
      }

      // ---------------------------------------------------------------- final states offer no action (FR-10)
      const finalStatus = sc.orders[0].finalStatus;
      const id = await createOrder(request, userToken, sc.orders[0].amount);
      await moveOrderTo(request, adminToken, id, finalStatus);

      await openAdmin(page, { token: adminToken });
      await goToTab(page, 'Đơn hàng');
      const row = orderRow(page, id);
      await expect(row.locator('span').filter({ hasText: STATUS_LABEL[finalStatus] })).toBeVisible();
      // SRS FR-10: delivered / canceled are final states, no transition may be offered.
      await expect(row.getByRole('button'), 'a final-state order must offer no action button').toHaveCount(0);
    });
  }
});

test.describe('FR-13 / FR-12 Admin access', () => {
  const expectLoginForm = async (page: Page) => {
    await expect(loginHeading(page), 'the login form must be shown').toBeVisible();
    await expect(dashboardHeading(page), 'the dashboard must not be shown').toBeHidden();
  };

  for (const ac of accessCases) {
    test(`${ac.id} - ${ac.title}`, async ({ page, request }) => {
      const dialogs = captureDialogs(page);

      if (ac.kind === 'no-token') {
        await openAdmin(page);
        await expectLoginForm(page);
      }

      if (ac.kind === 'inject-token') {
        const token = ac.token === 'user' ? await loginApi(request, 'user') : (ac.tokenValue as string);
        await openAdmin(page, { token, waitForOrders: false });
        await expectLoginForm(page);
      }

      if (ac.kind === 'ui-login') {
        const creds =
          ac.account === 'throwaway-wrong-password'
            ? { email: (await registerThrowawayUser(request)).email, password: ac.password as string }
            : ACCOUNTS[ac.account as 'admin' | 'user'];

        await openAdmin(page);
        await uiLogin(page, creds.email, creds.password);

        if (ac.expect === 'dashboard') {
          await expect(dashboardHeading(page)).toBeVisible();
          await expect(revenueTile(page)).toBeVisible();
          await expect(orderCountTile(page)).toBeVisible();
          expect(await page.evaluate(() => window.localStorage.getItem('adminToken'))).toBeTruthy();
        } else {
          await expectLoginForm(page);
          expect(await page.evaluate(() => window.localStorage.getItem('adminToken'))).toBeNull();
          // The SRS does not define the message text, so it is recorded, not asserted.
          test.info().annotations.push({
            type: 'CLARIFY',
            description: `Message shown to the user: ${dialogs.join(' | ') || '(none)'}`,
          });
        }
      }
    });
  }
});
