# Review checklist for AI-generated Playwright code (Phase 6)

Go through each generated spec and page object. The student decides each finding and writes the reason the AI missed it.

## Selectors
- [ ] Any CSS/XPath chain tied to layout or generated classes
- [ ] Locators invented for elements the AI never saw (verify on the real page)
- [ ] Text selectors that break on Vietnamese diacritics, case, or copy changes
- [ ] Ambiguous locators matching more than one element (strict mode errors)

## Assertions
- [ ] Missing assertion: the test only performs actions and never checks the outcome
- [ ] Weak assertion: `toBeTruthy`, "page loaded", or only checking that no error was thrown
- [ ] Non-retrying assertion (`expect(await ...)`)
- [ ] Expected values copied from observed app behaviour instead of the requirement
- [ ] Fewer than three distinct assertion patterns in the feature

## Waits and flakiness
- [ ] `waitForTimeout` or arbitrary sleeps
- [ ] Race between click and navigation or network response
- [ ] Hidden dependency on test order or shared account state

## Data and coverage
- [ ] Data inlined in the script instead of the data file
- [ ] Missing boundary values (min, max, just outside), empty input, whitespace, very long input, special and Vietnamese characters
- [ ] Missing negative cases (wrong role, expired coupon, duplicate registration, locked account)
- [ ] Missing state cases (refresh mid-flow, back button, double submit)
- [ ] Positive cases only, or the same case repeated with trivial variation

## Cross-browser
- [ ] Browser-specific behaviour not handled (WebKit file upload, Firefox validation bubbles)
- [ ] Viewport assumptions

## Typical reasons the AI misses these (for the student to think with, not copy)

- **Prompt quality:** the prompt gave no real DOM, no requirement text, or asked for everything at once.
- **Model limitation:** the model cannot see the running app, so it guesses selectors and expected messages.
- **Feature characteristic:** multi-step flows, server-side counters (lockout), async validation, or state that persists between tests.

If the student cannot say why, suggest re-prompting with the missing input and comparing the result. That experiment is valid evidence.
