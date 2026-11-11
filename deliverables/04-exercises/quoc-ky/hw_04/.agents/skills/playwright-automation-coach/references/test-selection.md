# Choosing which test cases to automate

Source: the Automation Testing lecture (FIT-HCMUS), section "Which test cases to automate".

## Good candidates

- Cases prone to human error (long sequences where a step is easy to forget)
- Repetitive, monotonous cases (login with many credentials, form validation across inputs)
- Cases that run the same flow with many data sets (best fit for data-driven files)
- Cases that cannot be done manually (precise timing, many parallel sessions)
- Cases that take too long by hand
- High-risk cases (authentication, lockout, checkout, coupon calculation, order state)
- Cases that must run across many browsers, devices, or operating systems

## Poor candidates (document them as "Not automated" with the reason)

- Requirements that change often, because maintenance cost outweighs the benefit
- Ad-hoc or exploratory cases whose steps cannot be fixed in advance
- Purely visual or taste judgements (belongs to usability, not a script)
- Cases needing a real email inbox, SMS, payment gateway, or CAPTCHA that the SUT does not expose a test hook for
- Cases blocked by a known SUT defect that makes the step impossible

## Per-feature quick prompts

| Pool | Typical data-driven candidates | Typical hard-to-automate cases |
|---|---|---|
| A (auth, products) | registration field validation, login credentials matrix, lockout after N failures, search keywords, product detail by id | two-step password reset that needs an emailed token, if the SUT does not expose it |
| B (cart, checkout) | quantity boundaries, coupon codes (valid, expired, minimum not met), checkout field validation, order state transitions | payment confirmation that depends on an external gateway |
| C (admin) | CRUD with valid and invalid fields, CSV import with good and bad rows, access control by role, filters | file dialogs on WebKit, destructive actions that cannot be reset between runs |

## Output format

| ID | Feature | Type (positive / negative / edge) | Priority | Expected result | Decision | Reason if not automated |
|---|---|---|---|---|---|---|
