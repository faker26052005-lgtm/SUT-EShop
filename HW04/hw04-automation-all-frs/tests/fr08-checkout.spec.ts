import { test, expect } from '@playwright/test';
import type { Page, APIRequestContext } from '@playwright/test';
import { loadData } from './helpers/data';
import { WEB_URL } from './helpers/env';
import {
  captureDialogs, waitForDialog, newSession, startLoggedIn, cartLink, spaNavigate, listProducts, myOrders, type Product,
} from './helpers/web';

/**
 * FR-08 Checkout (web UI, data-driven).
 * The UI is used for every step a customer does (add to cart, open cart, confirm payment).
 * The API is used only to arrange an account and to read back the stored order (the oracle).
 * Expected total = sum(price x quantity) of the chosen products, computed from GET /products.
 */

type Row = {
  id: string; title: string; mode: string; picks: number[]; tamperTotal?: number; check?: string; source: string;
};
const rows = loadData<Row[]>('fr08-checkout.json');

const confirmButton = (page: Page) => page.getByRole('button', { name: 'Xác Nhận Thanh Toán' });
const totalInput = (page: Page) => page.locator('input[type="number"]');
const successHeading = (page: Page) => page.getByRole('heading', { name: 'Thanh toán thành công!' });
const emptyCartText = (page: Page) => page.getByText('Giỏ hàng của bạn đang trống');

/** Opens the shop and clicks "Thêm vào giỏ" on the products at the given positions of the product list. */
async function addToCartByUi(page: Page, products: Product[], picks: number[]): Promise<Product[]> {
  await page.goto(WEB_URL);
  await expect(page.getByRole('heading', { name: 'Danh sách sản phẩm' })).toBeVisible();
  const cards = page.locator('div.border.rounded', { has: page.getByRole('button', { name: 'Thêm vào giỏ', exact: true }) });
  await expect(cards.first()).toBeVisible();
  expect(await cards.count(), 'the seed data must have enough products').toBeGreaterThan(Math.max(0, ...picks));
  const chosen: Product[] = [];
  for (const i of picks) {
    const card = cards.nth(i);
    const name = (await card.getByRole('heading').first().innerText()).trim();
    const product = products.find((p) => p.name === name);
    expect(product, `product "${name}" must exist in GET /products`).toBeTruthy();
    chosen.push(product as Product);
    await card.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click();
  }
  return chosen;
}

const sum = (ps: Product[]) => ps.reduce((t, p) => t + Number(p.price), 0);

async function toCheckoutByUi(page: Page) {
  await cartLink(page).click();
  await expect(page.getByRole('heading', { name: 'Giỏ Hàng' })).toBeVisible();
  await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
  await expect(page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toBeVisible();
}

async function loggedInShopper(page: Page, request: APIRequestContext) {
  const s = await newSession(request);
  await startLoggedIn(page, s.token);
  return s;
}

for (const row of rows) {
  test(`${row.id} ${row.title}`, async ({ page, request }) => {
    const dialogs = captureDialogs(page);
    const products = await listProducts(request);

    switch (row.mode) {
      case 'checkout': {
        const s = await loggedInShopper(page, request);
        const chosen = await addToCartByUi(page, products, row.picks);
        await toCheckoutByUi(page);
        if (row.tamperTotal !== undefined) await totalInput(page).fill(String(row.tamperTotal));
        await confirmButton(page).click();

        // wait for the outcome: success page, or an error alert
        await expect.poll(async () => (await successHeading(page).count()) + dialogs.length, { timeout: 7_000 }).toBeGreaterThan(0);
        const orders = await myOrders(request, s.token);
        if (row.tamperTotal === undefined) {
          await expect(successHeading(page)).toBeVisible();
          expect(orders, 'exactly one order was created').toHaveLength(1);
        }
        // R4: the stored total is the real cart total, whatever the browser sent
        // (if the server refuses the tampered request and stores nothing, that is also correct)
        for (const o of orders) expect(Number(o.total_amount)).toBe(sum(chosen));
        break;
      }

      case 'review': {
        await loggedInShopper(page, request);
        const chosen = await addToCartByUi(page, products, row.picks);
        await toCheckoutByUi(page);
        if (row.check === 'items') {
          const items = page.locator('li');
          await expect(items).toHaveCount(chosen.length);
          for (let i = 0; i < chosen.length; i++) {
            await expect(items.nth(i)).toContainText(chosen[i].name);
            await expect(items.nth(i)).toContainText(' x 1 ');
            await expect(items.nth(i)).toContainText(Number(chosen[i].price).toLocaleString());
          }
        } else if (row.check === 'total-value') {
          await expect(totalInput(page)).toHaveValue(String(sum(chosen)));
          await expect(page.getByText(`Tổng thanh toán: ${sum(chosen).toLocaleString()} ₫`)).toBeVisible();
        } else {
          // SRS FR-08: the total is shown to the user, it must not be an editable field
          await expect(totalInput(page), 'the payment total must be read-only').toBeDisabled();
        }
        break;
      }

      case 'cart-cleared': {
        await loggedInShopper(page, request);
        await addToCartByUi(page, products, row.picks);
        await toCheckoutByUi(page);
        await confirmButton(page).click();
        await expect(successHeading(page)).toBeVisible();
        await page.getByRole('button', { name: 'Quay lại trang chủ' }).click();
        await cartLink(page).click();
        await expect(emptyCartText(page), 'cart must be empty after a successful payment').toBeVisible();
        break;
      }

      case 'failure-keeps-cart': {
        const s = await loggedInShopper(page, request);
        const chosen = await addToCartByUi(page, products, row.picks);
        await toCheckoutByUi(page);
        // simulate a refused payment: the server answers 500 to the checkout request
        await page.route('**/api/checkout', (route) =>
          route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'simulated failure' }) }));
        await confirmButton(page).click();
        expect(await waitForDialog(dialogs)).toContain('Lỗi khi thanh toán');
        await expect(successHeading(page)).toHaveCount(0);
        expect(await myOrders(request, s.token), 'no order is created').toHaveLength(0);
        await cartLink(page).click();
        for (const p of chosen) await expect(page.getByText(p.name).first()).toBeVisible();
        break;
      }

      case 'guest-guard': {
        await addToCartByUi(page, products, row.picks);
        await cartLink(page).click();
        await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
        expect(await waitForDialog(dialogs), 'a message tells the visitor to log in').not.toBeNull();
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toHaveCount(0);
        break;
      }

      case 'guest-deeplink': {
        await addToCartByUi(page, products, row.picks);
        await spaNavigate(page, '/checkout'); // skips the cart button that normally asks for login
        await expect(page.getByRole('heading', { name: 'Xác Nhận Đơn Hàng' })).toBeVisible();
        await confirmButton(page).click();
        expect(await waitForDialog(dialogs), 'the server must refuse an anonymous payment').toContain('Lỗi khi thanh toán');
        await expect(successHeading(page)).toHaveCount(0);
        break;
      }

      case 'empty-cart': {
        const s = await loggedInShopper(page, request);
        await page.goto(WEB_URL);
        await expect(page.getByRole('heading', { name: 'Danh sách sản phẩm' })).toBeVisible();
        await cartLink(page).click();
        await expect(emptyCartText(page)).toBeVisible();
        const proceed = await page.getByRole('button', { name: 'Tiến hành thanh toán' }).count();
        let note = `checkout button on empty cart: ${proceed > 0 ? 'shown' : 'hidden'}`;
        if (proceed === 0) {
          await spaNavigate(page, '/checkout');
          await confirmButton(page).click();
          await waitForDialog(dialogs);
          const ok = await successHeading(page).count();
          note += `; forced checkout: ${ok ? 'SUCCESS page shown' : 'refused'}, orders created=${(await myOrders(request, s.token)).length}`;
        }
        test.info().annotations.push({ type: 'CLARIFY', description: `${row.id}: ${note} (SRS silent, recorded only)` });
        break;
      }

      case 'address': {
        const s = await loggedInShopper(page, request);
        await addToCartByUi(page, products, row.picks);
        await toCheckoutByUi(page);
        const hasAddressField = await page.locator('textarea, input[placeholder*="ịa chỉ" i]').count();
        await confirmButton(page).click();
        await expect(successHeading(page)).toBeVisible();
        const [order] = await myOrders(request, s.token);
        test.info().annotations.push({
          type: 'CLARIFY',
          description: `${row.id}: address field on checkout page=${hasAddressField > 0}, stored shipping_address=${JSON.stringify(order?.shipping_address)} (API spec requires it, SRS silent)`,
        });
        break;
      }

      default:
        throw new Error(`unknown mode ${row.mode}`);
    }
  });
}
