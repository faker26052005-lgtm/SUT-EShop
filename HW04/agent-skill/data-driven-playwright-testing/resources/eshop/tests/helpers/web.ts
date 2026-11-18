import { expect } from '@playwright/test';
import type { APIRequestContext, Locator, Page } from '@playwright/test';
import { API, DEFAULTS, WEB_URL } from './env';

/**
 * Helpers for the customer web (port 5173). Facts about the SUT that shape them:
 *  - The page has no ids / data-testid, and <label> is NOT linked to its input, so getByLabel() does not work.
 *    Use placeholders, roles and visible text instead.
 *  - Success / error messages on Profile and Checkout are native alert() dialogs: capture them with page.on('dialog').
 *  - The cart lives only in React memory: page.goto() empties it. Move between pages by clicking links.
 *  - The login token is kept in localStorage('token').
 */

export type Session = { email: string; password: string; token: string };

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

// Dialog helpers live in ./dialogs (generic); re-exported so specs can keep importing them from './helpers/web'.
export { captureDialogs, clickAndWaitDialog } from './dialogs';

/** A fresh account with a known password, so tests never share state and never lock the shared accounts. */
export async function newSession(request: APIRequestContext, name = DEFAULTS.defaultUserName): Promise<Session> {
  const email = `hw04.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;
  const password = DEFAULTS.throwawayPassword;
  const reg = await request.post(`${API}/register`, { data: { name, email, password } });
  expect(reg.ok(), 'register throwaway user').toBeTruthy();
  const login = await request.post(`${API}/login`, { data: { email, password } });
  expect(login.ok(), 'login throwaway user').toBeTruthy();
  return { email, password, token: (await login.json()).token as string };
}

/** Starts the page already logged in (same localStorage key the app writes after a real login). */
export async function startLoggedIn(page: Page, token: string): Promise<void> {
  await page.addInitScript((t) => window.localStorage.setItem('token', t), token);
}

export const cartLink = (page: Page) => page.getByRole('link', { name: 'Giỏ hàng' });
export const profileLink = (page: Page) => page.locator('a[href="/profile"]');

/** Client-side navigation without reloading (keeps the in-memory cart), as if the user typed a route inside the SPA. */
export async function spaNavigate(page: Page, path: string): Promise<void> {
  await page.evaluate((p) => {
    window.history.pushState({}, '', p);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, path);
}

export async function getMe(request: APIRequestContext, token: string) {
  const res = await request.get(`${API}/users/me`, { headers: bearer(token) });
  expect(res.ok(), 'GET /users/me').toBeTruthy();
  return (await res.json()) as { name: string; email: string; phone: string | null; shipping_address: string | null };
}

export async function setProfileApi(
  request: APIRequestContext,
  token: string,
  data: { name: string; phone: string; shipping_address: string },
) {
  const res = await request.put(`${API}/users/me`, { headers: bearer(token), data });
  expect(res.ok(), 'PUT /users/me (arrange baseline)').toBeTruthy();
}

export type Product = { id: number; name: string; price: number };
export async function listProducts(request: APIRequestContext): Promise<Product[]> {
  const res = await request.get(`${API}/products`);
  expect(res.ok(), 'GET /products').toBeTruthy();
  return (await res.json()) as Product[];
}

export type MyOrder = { id: number; total_amount: number; status: string; shipping_address: string | null };
export async function myOrders(request: APIRequestContext, token: string): Promise<MyOrder[]> {
  const res = await request.get(`${API}/orders/my-orders`, { headers: bearer(token) });
  expect(res.ok(), 'GET /orders/my-orders').toBeTruthy();
  return (await res.json()) as MyOrder[];
}

export const homeUrl = WEB_URL;
