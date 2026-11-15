import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import { ACCOUNTS, API } from './env';

/**
 * API helpers used ONLY to arrange state (log in, create orders, move them through the state machine)
 * and to compute the expected value from the SRS. The assertions of the FR-13 suite are made on the web UI.
 */

export type Status = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'canceled';
export type Order = {
  id: number;
  total_amount: number;
  status: Status;
  user_name?: string;
  shipping_address?: string;
};

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function loginApi(request: APIRequestContext, who: 'admin' | 'user'): Promise<string> {
  const res = await request.post(`${API}/login`, { data: ACCOUNTS[who] });
  expect(res.ok(), `API login as ${who} must succeed`).toBeTruthy();
  return (await res.json()).token as string;
}

/** A one-off account, so that wrong-password tests never touch (and never lock) the shared accounts. */
export async function registerThrowawayUser(request: APIRequestContext): Promise<{ email: string; password: string }> {
  const email = `hw04.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
  const password = 'Throwaway1!';
  const res = await request.post(`${API}/register`, { data: { name: 'HW04 Throwaway', email, password } });
  expect(res.ok(), 'throwaway user registration').toBeTruthy();
  return { email, password };
}

export async function createOrder(request: APIRequestContext, userToken: string, amount: number): Promise<number> {
  const res = await request.post(`${API}/checkout`, {
    headers: bearer(userToken),
    data: { total_amount: amount, shipping_address: '123 Le Loi, Q1, TP.HCM' },
  });
  expect(res.ok(), `checkout with total_amount=${amount}`).toBeTruthy();
  return (await res.json()).orderId as number;
}

/** Valid SRS FR-10 paths starting from "pending". */
const PATH_FROM_PENDING: Record<Status, Status[]> = {
  pending: [],
  confirmed: ['confirmed'],
  shipping: ['confirmed', 'shipping'],
  delivered: ['confirmed', 'shipping', 'delivered'],
  canceled: ['canceled'],
};

export async function moveOrderTo(
  request: APIRequestContext,
  adminToken: string,
  orderId: number,
  finalStatus: Status,
): Promise<void> {
  for (const status of PATH_FROM_PENDING[finalStatus]) {
    const res = await request.put(`${API}/admin/orders/${orderId}/status`, {
      headers: bearer(adminToken),
      data: { status },
    });
    expect(res.ok(), `order ${orderId} -> ${status}`).toBeTruthy();
  }
}

export async function listOrders(request: APIRequestContext, adminToken: string): Promise<Order[]> {
  const res = await request.get(`${API}/admin/orders`, { headers: bearer(adminToken) });
  expect(res.ok(), 'GET /admin/orders').toBeTruthy();
  return (await res.json()) as Order[];
}

/** SRS FR-13: revenue = sum of total_amount of orders whose status is 'delivered' (and only those). */
export const revenueOf = (orders: Order[]): number =>
  orders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

/** A brand-new database has no orders; the dashboard tests need at least one to tell "loaded" from "not loaded yet". */
export async function ensureAtLeastOneOrder(request: APIRequestContext): Promise<void> {
  const adminToken = await loginApi(request, 'admin');
  if ((await listOrders(request, adminToken)).length === 0) {
    await createOrder(request, await loginApi(request, 'user'), 1000);
  }
}
