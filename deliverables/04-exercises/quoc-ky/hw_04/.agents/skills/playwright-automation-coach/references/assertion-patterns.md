# Assertion patterns (use at least three distinct ones)

The assignment counts distinct assertion patterns, so mix them on purpose, each where the check really needs it. Never add an assertion only to hit the count.

| # | Pattern | Example | Use for |
|---|---|---|---|
| 1 | Element visibility / state | `await expect(page.getByRole('alert')).toBeVisible()` | error and success messages, disabled buttons (`toBeDisabled`) |
| 2 | Text content | `await expect(alert).toHaveText(row.expectedMessage)` / `toContainText` | exact wording of messages, totals, order status |
| 3 | URL / title (navigation) | `await expect(page).toHaveURL(/\/orders/)` / `toHaveTitle` | redirect after login, checkout success |
| 4 | Count / list | `await expect(page.getByTestId('cart-item')).toHaveCount(row.expectedCount)` | search results, cart lines, table rows |
| 5 | Form value / attribute | `await expect(input).toHaveValue('')` / `toHaveAttribute('aria-invalid','true')` | preserved or cleared input, invalid markers |
| 6 | Network / API response | `const res = await page.waitForResponse(r => r.url().includes('/api/login')); expect(res.status()).toBe(401)` | status codes, server-side rejection |
| 7 | Computed value (plain `expect`) | `expect(parseVnd(totalText)).toBe(subtotal - discount)` | arithmetic: totals, discounts, coupon amounts |
| 8 | Soft assertion | `await expect.soft(el).toBeVisible()` | several independent checks on one page without stopping at the first |

## Rules

- Prefer web-first assertions (`await expect(locator)...`), which retry until the timeout. `expect(await locator.isVisible()).toBe(true)` does not retry and is flaky.
- Assert the outcome the requirement states, not whatever the app currently shows. If the two differ, that is a possible defect.
- A negative case needs a positive proof of failure (the message appears and the URL did not change), not only "no crash".
- Do not assert on text that changes per run (timestamps, generated ids) unless you match it with a pattern.
