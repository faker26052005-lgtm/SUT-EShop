import { test, expect } from '@playwright/test';
import type { Page, APIRequestContext } from '@playwright/test';
import { loadData } from './helpers/data';
import { WEB_URL } from './helpers/env';
import {
  captureDialogs, clickAndWaitDialog, newSession, startLoggedIn, getMe, setProfileApi, profileLink,
} from './helpers/web';

/**
 * FR-04 Profile management (web UI, data-driven).
 * Oracle = SRS FR-04 (HW02 results are treated as verified). Cases where the SRS is silent are "clarify":
 * the observed behaviour is written to the report (annotation CLARIFY) and the test does not fail.
 */

type Baseline = { name: string; phone: string; shipping_address: string };
const base = loadData<{ phoneTests: Baseline; fieldTests: Baseline }>('fr04-baseline.json');
const phones = loadData<{ id: string; title: string; phone: string; expect: 'accept' | 'reject' | 'clarify'; source: string }[]>('fr04-phone.json');
const fields = loadData<{ id: string; title: string; field: 'name' | 'address'; value?: string; repeat?: { char: string; count: number }; expect: 'accept' | 'clarify'; source: string }[]>('fr04-fields.json');
const security = loadData<{ id: string; title: string; payload: string; check: 'text' | 'no-script'; source: string }[]>('fr04-security.json');
const misc = loadData<{ id: string; title: string; kind: 'email-disabled' | 'guest' | 'ui-login'; source: string }[]>('fr04-misc.json');

const SUCCESS = 'Cập nhật thành công!';

const nameInput = (page: Page) => page.locator('form input[type="text"]:not([disabled])').first();
const phoneInput = (page: Page) => page.getByPlaceholder('VD: 0912345678');
const addressInput = (page: Page) => page.getByPlaceholder('Nhập địa chỉ của bạn');
const saveButton = (page: Page) => page.getByRole('button', { name: 'Cập nhật' });

async function openProfile(page: Page, request: APIRequestContext, baseline: Baseline) {
  const s = await newSession(request);
  await setProfileApi(request, s.token, baseline);
  await startLoggedIn(page, s.token);
  await page.goto(`${WEB_URL}/profile`);
  await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeVisible();
  await expect(nameInput(page)).toHaveValue(baseline.name); // the form is loaded with the stored data
  return s;
}

test.describe('FR-04 phone number (SRS: starts with 0, 10-11 digits)', () => {
  for (const row of phones) {
    test(`${row.id} ${row.title}`, async ({ page, request }) => {
      const dialogs = captureDialogs(page);
      const s = await openProfile(page, request, base.phoneTests);

      await phoneInput(page).fill(row.phone);
      const message = await clickAndWaitDialog(dialogs, saveButton(page));
      const stored = (await getMe(request, s.token)).phone;

      if (row.expect === 'accept') {
        expect(message, 'alert shown after saving').toBe(SUCCESS);
        expect(stored, 'phone stored in the database').toBe(row.phone);
      } else if (row.expect === 'reject') {
        expect(message, 'the form must not report success').not.toBe(SUCCESS);
        expect(stored, 'old phone must be kept').toBe(base.phoneTests.phone);
        test.info().annotations.push({ type: 'NOTE', description: `${row.id}: message shown = ${JSON.stringify(message)}` });
      } else {
        test.info().annotations.push({
          type: 'CLARIFY',
          description: `${row.id}: alert=${JSON.stringify(message)}, stored phone=${JSON.stringify(stored)} (SRS silent, recorded only)`,
        });
      }
    });
  }
});

test.describe('FR-04 name and address', () => {
  for (const row of fields) {
    test(`${row.id} ${row.title}`, async ({ page, request }) => {
      const dialogs = captureDialogs(page);
      const s = await openProfile(page, request, base.fieldTests);
      const value = row.repeat ? row.repeat.char.repeat(row.repeat.count) : (row.value as string);

      if (row.field === 'name') await nameInput(page).fill(value);
      else await addressInput(page).fill(value);
      const message = await clickAndWaitDialog(dialogs, saveButton(page));
      const me = await getMe(request, s.token);

      if (row.expect === 'accept') {
        expect(message).toBe(SUCCESS);
        expect(row.field === 'name' ? me.name : me.shipping_address).toBe(value);
        // the other fields are untouched
        if (row.field === 'name') {
          expect(me.phone).toBe(base.fieldTests.phone);
          expect(me.shipping_address).toBe(base.fieldTests.shipping_address);
        } else {
          expect(me.name).toBe(base.fieldTests.name);
          expect(me.phone).toBe(base.fieldTests.phone);
        }
      } else {
        const stored = row.field === 'name' ? me.name : me.shipping_address;
        test.info().annotations.push({
          type: 'CLARIFY',
          description: `${row.id}: alert=${JSON.stringify(message)}, stored ${row.field}=${JSON.stringify(stored?.slice(0, 40))}${stored && stored.length > 40 ? `... (${stored.length} chars)` : ''}`,
        });
      }
    });
  }
});

test.describe('FR-04 output escaping (SRS SEC-04)', () => {
  for (const row of security) {
    test(`${row.id} ${row.title}`, async ({ page, request }) => {
      const dialogs = captureDialogs(page);
      const s = await openProfile(page, request, base.fieldTests);
      await nameInput(page).fill(row.payload);
      expect(await clickAndWaitDialog(dialogs, saveButton(page))).toBe(SUCCESS);

      await page.goto(`${WEB_URL}/profile`); // reload: the header greets the stored name
      await expect(profileLink(page)).toBeVisible();
      if (row.check === 'text') {
        await expect(profileLink(page)).toContainText(row.payload); // the tag is visible as text
        await expect(profileLink(page).locator('b')).toHaveCount(0); // and was not turned into an element
      } else {
        await page.waitForTimeout(500);
        expect(await page.evaluate(() => (window as any).__xss), 'script from the name must not run').toBeUndefined();
        await expect(profileLink(page).locator('img')).toHaveCount(0);
      }
      expect((await getMe(request, s.token)).name).toBe(row.payload);
    });
  }
});

test.describe('FR-04 access and read-only fields', () => {
  for (const row of misc) {
    test(`${row.id} ${row.title}`, async ({ page, request }) => {
      if (row.kind === 'guest') {
        await page.goto(`${WEB_URL}/profile`);
        await expect(page.getByText('Vui lòng đăng nhập')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Hồ sơ của bạn' })).toBeHidden();
        await expect(saveButton(page)).toHaveCount(0);
      } else if (row.kind === 'email-disabled') {
        const s = await openProfile(page, request, base.fieldTests);
        const email = page.locator('form input[type="text"][disabled]');
        await expect(email).toHaveValue(s.email);
        await expect(email).toBeDisabled();
      } else {
        const s = await newSession(request, 'Ten Dang Nhap');
        await page.goto(`${WEB_URL}/login`);
        await page.locator('xpath=//label[normalize-space()="Username"]/following-sibling::input').fill(s.email);
        await page.locator('xpath=//label[normalize-space()="Mật khẩu"]/following-sibling::input').fill(s.password);
        await page.getByRole('button', { name: 'Sign In' }).click();
        await expect(profileLink(page)).toContainText('Chào, Ten Dang Nhap');
        await profileLink(page).click();
        await expect(nameInput(page)).toHaveValue('Ten Dang Nhap');
      }
    });
  }
});
