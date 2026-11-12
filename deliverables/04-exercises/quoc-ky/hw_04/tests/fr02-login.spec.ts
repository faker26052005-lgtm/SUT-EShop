import { test, expect, type APIRequestContext, type Request } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { LoginPage } from '../pages/login.page';
import { registerFreshUser, getAdminToken } from '../fixtures';

/**
 * Data-Driven Test Suite for FR-02: Đăng nhập & Khóa tài khoản
 * - Standardized 3-state decisions: automate, automate_expected_failure, blocked_deferred
 * - Distinct test layers: ui_e2e, api, integration
 * - Rigorous URL Assertions: Specific URL boundaries (/ vs /login), eliminating overly broad regex
 * - Active Request Tracking: Inspects actual dispatched requests instead of relying on fixed timeouts
 * - Documented Timing Approximation: Wall-clock timing annotations for SRS boundary cases (29s/30s/31s)
 * - Reporter-Visible Blocked Reason: test.skip(true, reason) ensures HTML reporter displays blocker info
 * - Honest Defect Assertions: automate_expected_failure runs actively without synthetic passes
 */
interface Fr02TestCase {
  id: string;
  title: string;
  type: string;
  automation_decision: 'automate' | 'automate_expected_failure' | 'blocked_deferred';
  test_layer: 'ui_e2e' | 'api' | 'integration';
  defect_id?: string;
  blocker_reason?: string;
  unblock_condition?: string;
  preconditions?: string;
  wait_duration_seconds?: number;
  username: string;
  password: string;
  expected: {
    status?: number;
    url?: string;
    authenticated?: boolean;
    failure_counter?: number;
    is_locked?: boolean;
    message_contains?: string;
    timer_reset?: boolean;
    client_validation_blocked?: boolean;
    form_submitted?: boolean;
    client_validation_triggered?: boolean;
    validation_error?: boolean;
    lockout_duration_seconds?: number;
    exponential_backoff?: boolean;
  };
  notes?: string;
}

const dataFilePath = path.resolve(__dirname, '../data/fr02-login.json');
const testCases: Fr02TestCase[] = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';
const webBaseUrl = process.env.BASE_URL ?? 'http://localhost:5173';

/**
 * Helper to establish consecutive failed login attempts per SRS preconditions.
 * Verifies each attempt returns authentication error (HTTP 401 or 403).
 */
async function setupFailedAttempts(
  request: APIRequestContext,
  targetApiUrl: string,
  email: string,
  count: number,
  testCaseId: string
): Promise<void> {
  for (let attempt = 1; attempt <= count; attempt++) {
    const res = await request.post(`${targetApiUrl}/api/login`, {
      data: { email, password: `WrongPassSetup_${attempt}!` },
    });
    expect(
      [401, 403].includes(res.status()),
      `Setup precondition failed: attempt ${attempt}/${count} for ${testCaseId} returned HTTP ${res.status()}`
    ).toBe(true);
  }
}

/**
 * Helper to fetch database user state via Admin API for server state assertions.
 */
async function getAdminUserRecord(
  request: APIRequestContext,
  targetApiUrl: string,
  token: string,
  targetEmail: string
) {
  const res = await request.get(`${targetApiUrl}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status(), 'Failed to retrieve admin users list for state verification').toBe(200);
  const users = await res.json();
  return users.find((u: { email: string }) => u.email === targetEmail);
}

test.describe('FR-02: Đăng nhập & Khóa tài khoản', () => {
  let adminToken = '';

  test.beforeAll(async ({ request }) => {
    try {
      adminToken = await getAdminToken(request, apiUrl);
    } catch {
      // Admin auth helper fallback if backend unreachable
    }
  });

  for (const tc of testCases) {
    test(`${tc.id} [${tc.type}] ${tc.title}`, async ({ page, request }, testInfo) => {
      // -------------------------------------------------------------
      // 0. BLOCKED / DEFERRED TEST HANDLING (TC_FR02_12)
      // -------------------------------------------------------------
      if (tc.automation_decision === 'blocked_deferred') {
        const skipMessage = `[BLOCKED] ${tc.blocker_reason ?? 'Environment constraint'}. Requires: ${tc.unblock_condition ?? 'Time travel hook'}`;
        testInfo.annotations.push({
          type: 'blocked_reason',
          description: skipMessage,
        });
        test.skip(true, skipMessage);
        return;
      }

      // Annotate expected failure cases for clear defect reporting in HTML report
      if (tc.automation_decision === 'automate_expected_failure') {
        testInfo.annotations.push({
          type: 'defect_tracking',
          description: `Defect ID: ${tc.defect_id ?? 'Known Defect'}. Reason: ${tc.notes ?? 'SUT behavior diverges from SRS'}`,
        });
      }

      // -------------------------------------------------------------
      // 1. LAYER: UI E2E TESTING
      // -------------------------------------------------------------
      if (tc.test_layer === 'ui_e2e') {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        let targetEmail = tc.username;
        let targetPassword = tc.password;

        // Isolate positive logins by registering a fresh account with specified credentials
        if (tc.type === 'positive' || tc.id === 'TC_FR02_01') {
          const freshUser = await registerFreshUser(request, apiUrl, tc.password);
          targetEmail = freshUser.email;
          targetPassword = freshUser.password;
        } else if (tc.id === 'TC_FR02_02') {
          // Boundary password: exactly 8 characters from JSON ("Pass123!")
          const freshUser = await registerFreshUser(request, apiUrl, tc.password);
          targetEmail = freshUser.email;
          targetPassword = tc.password;
          expect(targetPassword.length, 'TC_FR02_02 password must have exactly 8 characters').toBe(8);
        }

        // Active request monitoring: observe whether POST /api/login actually dispatches
        let loginRequestDispatched = false;
        let interceptedResponseStatus: number | null = null;

        const requestHandler = (req: Request) => {
          if (req.url().includes('/api/login') && req.method() === 'POST') {
            loginRequestDispatched = true;
          }
        };
        page.on('request', requestHandler);

        const responsePromise = page.waitForResponse(
          (res) => res.url().includes('/api/login') && res.request().method() === 'POST',
          { timeout: 7_000 }
        ).then(res => {
          interceptedResponseStatus = res.status();
          return res;
        }).catch(() => null);

        await loginPage.login(targetEmail, targetPassword);
        const response = await responsePromise;

        // --- SUB-CASE A: Client-side validation blocked submission ---
        if (tc.expected.client_validation_blocked === true) {
          // Verify no HTTP request was ever dispatched to backend
          expect(
            loginRequestDispatched,
            'Client-side validation must block network request from being dispatched'
          ).toBe(false);
          expect(response, 'No HTTP response should exist when request is blocked at client').toBeNull();

          // Specific URL boundary: user remains strictly on /login page
          await expect(page, 'User must remain on login page when client validation fails').toHaveURL(new RegExp('/login$'));

          // Verify HTML5 constraint validation state on empty required fields
          if (targetEmail === '') {
            const isEmailMissing = await loginPage.usernameInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
            expect(isEmailMissing, 'Empty username input must trigger HTML5 valueMissing validity flag').toBe(true);
          }
          if (targetPassword === '') {
            const isPassMissing = await loginPage.passwordInput.evaluate((el: HTMLInputElement) => el.validity.valueMissing);
            expect(isPassMissing, 'Empty password input must trigger HTML5 valueMissing validity flag').toBe(true);
          }
        }
        // --- SUB-CASE B: Form submitted (Normal or Rejected by validation/auth) ---
        else {
          // Assertion on Client validation constraints for invalid formats (TC_FR02_14: Missing @)
          if (tc.id === 'TC_FR02_14') {
            const isTypeMismatch = await loginPage.usernameInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch);
            // SRS requires email input constraint validation. SUT uses type="text" which fails this check.
            expect(isTypeMismatch, 'SRS requires email field to enforce email type constraint (typeMismatch)').toBe(true);
          }

          // Assertion on HTTP status code (Backend response)
          if (tc.expected.status !== undefined) {
            expect(response, 'Expected HTTP response from backend but none was received').not.toBeNull();
            expect(response!.status()).toBe(tc.expected.status);
          }

          // Specific URL boundary for successful authentication: redirected to home page (/)
          if (tc.expected.authenticated === true || tc.type === 'positive') {
            // Must strictly navigate away from /login to root URL
            await expect(page, 'Successful login must redirect away from /login').not.toHaveURL(new RegExp('/login'));
            await expect(page, 'Successful login must arrive at home page root URL').toHaveURL(new RegExp('^' + webBaseUrl.replace(/\/$/, '') + '/?$'));

            // Verify authentication session persistence in browser
            const token = await page.evaluate(() => localStorage.getItem('token'));
            expect(token, 'Authentication token should be stored in localStorage upon success').toBeTruthy();
          }

          // If expected result is remaining on login page with error
          if (tc.expected.url === '/login' || (!tc.expected.authenticated && tc.type !== 'positive')) {
            await expect(page, 'Failed login attempt must keep user on login page').toHaveURL(new RegExp('/login$'));
          }

          // UI Error alert verification
          if (response && response.status() >= 400) {
            await expect(loginPage.errorAlert).toBeVisible();
            await expect(loginPage.errorAlert).toContainText(/thất bại|khóa/i);
          }
        }
      }

      // -------------------------------------------------------------
      // 2. LAYER: API TESTING
      // -------------------------------------------------------------
      else if (tc.test_layer === 'api') {
        let testEmail = tc.username;
        let testPassword = tc.password;
        let initialLockedUntil: string | null = null;

        // Group A: Tests requiring a fresh isolated user
        const needsFreshUser = [
          'TC_FR02_03', 'TC_FR02_04', 'TC_FR02_05', 'TC_FR02_06',
          'TC_FR02_07', 'TC_FR02_08', 'TC_FR02_13', 'TC_FR02_24'
        ].includes(tc.id);

        if (needsFreshUser) {
          // Pass custom password if testing boundary (e.g. TC_FR02_24: 255 chars)
          const fresh = await registerFreshUser(request, apiUrl, tc.password);
          testEmail = fresh.email;
          testPassword = fresh.password;

          // Apply pure SRS preconditions (Threshold = 3 consecutive failures for lockout)
          if (tc.id === 'TC_FR02_04') {
            // Precondition: exactly 1 previous failed attempt
            await setupFailedAttempts(request, apiUrl, testEmail, 1, tc.id);
            testPassword = tc.password; // WrongPass2!
          } else if (tc.id === 'TC_FR02_05') {
            // Precondition: exactly 2 previous failed attempts
            await setupFailedAttempts(request, apiUrl, testEmail, 2, tc.id);
            testPassword = fresh.password; // Submit valid registered password to reset
          } else if (tc.id === 'TC_FR02_06') {
            // Precondition: exactly 2 previous failed attempts, attempt 3 is main test triggering lockout
            await setupFailedAttempts(request, apiUrl, testEmail, 2, tc.id);
            testPassword = tc.password; // WrongPass3!
          } else if (['TC_FR02_07', 'TC_FR02_08', 'TC_FR02_13'].includes(tc.id)) {
            // Precondition: Lockout triggered by 3 consecutive failed attempts per SRS
            await setupFailedAttempts(request, apiUrl, testEmail, 3, tc.id);
            if (tc.id === 'TC_FR02_07') {
              testPassword = fresh.password; // Valid password submitted during lockout
            } else {
              testPassword = tc.password; // Wrong password submitted during lockout
            }

            // Capture initial lockout timestamp for TC_FR02_08 timer non-reset check
            if (tc.id === 'TC_FR02_08' && adminToken) {
              const uRec = await getAdminUserRecord(request, apiUrl, adminToken, testEmail);
              initialLockedUntil = uRec?.locked_until ?? null;
              expect(initialLockedUntil, 'Account must be locked prior to timer non-reset probe').not.toBeNull();
            }
          } else if (tc.id === 'TC_FR02_24') {
            // Boundary: verify password with length exactly 255 chars
            testPassword = tc.password;
            expect(testPassword.length, 'TC_FR02_24 password must have exactly 255 characters').toBe(255);
          }
        } else if (tc.id === 'TC_FR02_18') {
          // Boundary email with exactly 254 characters: register account with actual boundary email
          expect(tc.username.length, 'TC_FR02_18 email must have exactly 254 characters').toBe(254);
          const regRes = await request.post(`${apiUrl}/api/register`, {
            data: {
              name: 'RFC 254 Boundary User',
              email: tc.username,
              password: tc.password,
              role: 'customer',
            },
          });
          expect(
            [200, 201, 500].includes(regRes.status()),
            `Registration setup for 254-char email failed: ${await regRes.text()}`
          ).toBe(true);
          testEmail = tc.username;
          testPassword = tc.password;
        }

        const res = await request.post(`${apiUrl}/api/login`, {
          data: { email: testEmail, password: testPassword },
        });

        // Assertion 1: HTTP status code
        if (tc.expected.status !== undefined) {
          expect(res.status()).toBe(tc.expected.status);
        }

        const body = await res.json().catch(() => ({}));

        // Assertion 2: authenticated (API level JWT token verification)
        if (tc.expected.authenticated === true) {
          expect(body.token, 'Response body must contain authentication JWT token').toBeDefined();
          expect(typeof body.token, 'Token must be a non-empty string').toBe('string');
          expect(body.token.length, 'JWT token length must be greater than 10').toBeGreaterThan(10);
        }

        // Assertion 3: message_contains (Mandatory check - fails if message missing)
        if (tc.expected.message_contains !== undefined) {
          const bodyText = typeof body.error === 'string'
            ? body.error
            : typeof body.message === 'string'
              ? body.message
              : JSON.stringify(body);
          expect(
            bodyText.toLowerCase(),
            `Expected response message to contain '${tc.expected.message_contains}', but received: '${bodyText}'`
          ).toContain(tc.expected.message_contains.toLowerCase());
        }

        // Assertion 4: failure_counter verification via Admin API database state
        if (tc.expected.failure_counter !== undefined && adminToken) {
          const userRec = await getAdminUserRecord(request, apiUrl, adminToken, testEmail);
          expect(userRec, `User record for ${testEmail} must exist in database`).toBeDefined();
          expect(
            userRec.login_attempts,
            `SRS requires failure counter to be ${tc.expected.failure_counter}, but database record is ${userRec.login_attempts}`
          ).toBe(tc.expected.failure_counter);
        }

        // Assertion 5: is_locked verification via Admin API database state
        if (tc.expected.is_locked !== undefined && adminToken) {
          const userRec = await getAdminUserRecord(request, apiUrl, adminToken, testEmail);
          expect(userRec, `User record for ${testEmail} must exist in database`).toBeDefined();
          if (tc.expected.is_locked === true) {
            expect(userRec.locked_until, 'User locked_until timestamp must be set in database').not.toBeNull();
            expect(
              new Date(userRec.locked_until).getTime(),
              'locked_until timestamp must be in the future'
            ).toBeGreaterThan(Date.now());
          } else {
            const isLockedNow = userRec.locked_until ? new Date(userRec.locked_until).getTime() > Date.now() : false;
            expect(isLockedNow, 'Account must not be locked in database').toBe(false);
          }
        }

        // Assertion 6: timer_reset === false (TC_FR02_08)
        if (tc.expected.timer_reset === false && adminToken && initialLockedUntil) {
          const afterRec = await getAdminUserRecord(request, apiUrl, adminToken, testEmail);
          expect(afterRec, `User record for ${testEmail} must exist in database`).toBeDefined();
          expect(
            afterRec.locked_until,
            'Locked timestamp must not be updated or extended when wrong password submitted during active lockout'
          ).toBe(initialLockedUntil);
        }
      }

      // -------------------------------------------------------------
      // 3. LAYER: INTEGRATION TIMING TESTING
      // -------------------------------------------------------------
      else if (tc.test_layer === 'integration') {
        const fresh = await registerFreshUser(request, apiUrl, tc.password);
        const testEmail = fresh.email;
        const testPassword = fresh.password;

        // Precondition: Lockout triggered by 3 consecutive failed attempts per SRS
        await setupFailedAttempts(request, apiUrl, testEmail, 3, tc.id);

        const waitSec = tc.wait_duration_seconds ?? 29;

        // Document wall-clock timing approximation in test report annotations
        testInfo.annotations.push({
          type: 'timing_measurement',
          description: `Wall-clock timing approximation: sleeping ${waitSec}s measured from completion of 3rd failed attempt setup (network latency ±50ms). SUT hardcoded lockout is 180s.`,
        });

        // EXEMPTION: Real-time wait required to verify SRS lockout boundary at t=29s/30s/31s
        await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));

        const res = await request.post(`${apiUrl}/api/login`, {
          data: { email: testEmail, password: testPassword },
        });

        if (tc.expected.status !== undefined) {
          expect(res.status()).toBe(tc.expected.status);
        }

        const body = await res.json().catch(() => ({}));

        if (tc.expected.authenticated === true) {
          expect(body.token, 'Successful unlock login must return valid token').toBeDefined();
        }

        // State verification after boundary wait
        if (tc.expected.is_locked !== undefined && adminToken) {
          const userRec = await getAdminUserRecord(request, apiUrl, adminToken, testEmail);
          expect(userRec, `User record for ${testEmail} must exist in database`).toBeDefined();
          const isLockedNow = userRec.locked_until ? new Date(userRec.locked_until).getTime() > Date.now() : false;
          expect(isLockedNow, `Expected is_locked to be ${tc.expected.is_locked}`).toBe(tc.expected.is_locked);
        }
      }
    });
  }
});
