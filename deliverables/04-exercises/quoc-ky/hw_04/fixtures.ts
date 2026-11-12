import { APIRequestContext, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

export interface RegisterUserOptions {
  apiUrl?: string;
  password?: string;
  name?: string;
}

/**
 * Helper to register a unique test user via API.
 * Ensures isolation for login counter and lockout tests (FR-02) and fresh checkout (FR-07).
 * Supports custom passwords and uses crypto.randomUUID() for collision-free emails.
 */
export async function registerFreshUser(
  request: APIRequestContext,
  apiUrlOrOptions: string | RegisterUserOptions = process.env.API_URL ?? 'http://localhost:3000',
  customPassword?: string
): Promise<{ email: string; password: string; name: string }> {
  let apiUrl = process.env.API_URL ?? 'http://localhost:3000';
  let password = customPassword ?? 'Test1234!';
  let namePrefix = 'Test User';

  if (typeof apiUrlOrOptions === 'object' && apiUrlOrOptions !== null) {
    apiUrl = apiUrlOrOptions.apiUrl ?? apiUrl;
    password = apiUrlOrOptions.password ?? password;
    namePrefix = apiUrlOrOptions.name ?? namePrefix;
  } else if (typeof apiUrlOrOptions === 'string') {
    apiUrl = apiUrlOrOptions;
  }

  const uniqueId = randomUUID();
  const email = `test_user_${uniqueId}@eshop.com`;
  const name = `${namePrefix} ${uniqueId.substring(0, 8)}`;

  const response = await request.post(`${apiUrl}/api/register`, {
    data: {
      name,
      email,
      password,
      role: 'customer',
    },
  });

  expect(
    response.status(),
    `Register fresh user failed [HTTP ${response.status()}]: ${await response.text()} (Email: ${email})`
  ).toBe(201);

  return { email, password, name };
}

/**
 * Helper to obtain Admin JWT token via API.
 */
export async function getAdminToken(
  request: APIRequestContext,
  apiUrl: string = process.env.API_URL ?? 'http://localhost:3000',
  email: string = process.env.ADMIN_EMAIL ?? 'admin@eshop.com',
  password: string = process.env.ADMIN_PASSWORD ?? 'Admin123!'
): Promise<string> {
  const response = await request.post(`${apiUrl}/api/login`, {
    data: { email, password },
  });

  expect(response.status(), 'Admin login failed').toBe(200);
  const data = await response.json();
  return data.token;
}

/**
 * Helper to create a test coupon via Admin API.
 */
export async function createAdminCoupon(
  request: APIRequestContext,
  adminToken: string,
  couponData: {
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    max_uses_per_user?: number;
    expired_at?: string;
  },
  apiUrl: string = process.env.API_URL ?? 'http://localhost:3000'
): Promise<number> {
  const response = await request.post(`${apiUrl}/api/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
    data: {
      min_order_amount: 0,
      max_uses_per_user: 1,
      expired_at: new Date(Date.now() + 86400000 * 30).toISOString(),
      ...couponData,
    },
  });

  expect(response.status(), `Create coupon failed: ${await response.text()}`).toBe(201);
  const resJson = await response.json();
  return resJson.id || resJson.coupon?.id;
}

/**
 * Helper to clean up a test coupon via Admin API in afterEach.
 */
export async function deleteAdminCoupon(
  request: APIRequestContext,
  adminToken: string,
  couponId: number,
  apiUrl: string = process.env.API_URL ?? 'http://localhost:3000'
): Promise<void> {
  if (!couponId) return;
  const response = await request.delete(`${apiUrl}/api/admin/coupons/${couponId}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  // Accept 200 or 204 or 404 (if already deleted)
  expect([200, 204, 404]).toContain(response.status());
}
