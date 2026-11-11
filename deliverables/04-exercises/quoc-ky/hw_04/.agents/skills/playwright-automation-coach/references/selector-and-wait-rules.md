# Selectors and waits

## Locator priority

1. `getByRole(role, { name })` for buttons, links, headings, inputs with accessible names
2. `getByLabel`, `getByPlaceholder` for form fields
3. `getByTestId` when the SUT exposes `data-testid` (ask the student to check the code)
4. `getByText` for stable visible text (beware of Vietnamese diacritics and changing copy)
5. CSS or XPath only as a last resort, short, and commented with why

Avoid: `nth-child` chains, auto-generated class names, absolute XPath, selectors copied from a recorder without review.

## Waits

- Never `page.waitForTimeout(n)` as a fix for flakiness. Wait for an observable condition: `await expect(locator).toBeVisible()`, `page.waitForURL`, `page.waitForResponse`.
- Set the timeout in the config, not in each step.
- Retries stay at 0 for evidence runs.

## Independence and state

- Each test sets up its own state (fresh login, seeded cart, API call) and does not rely on another test's result.
- Tests that change shared data (lockout counters, stock, coupons used) need a unique account or a reset step, otherwise browsers running the same feature collide. Run workers = 1 for such features, or use a distinct user per browser.
- Never hardcode ids that differ between runs.

## Browser differences to expect

- WebKit: date inputs, file upload dialogs, and some focus behaviours differ.
- Firefox: some validation tooltips render natively, so assert the app's own message, not the browser's bubble.
- A test that passes on one browser and fails on another is a finding worth reporting.
