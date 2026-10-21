---
name: postman-api-test-suite
description: Turn a finished test design (DT/BV/BL/AC) into a Postman collection with one RUN ALL request, a PASS/FAIL/CẦN LÀM RÕ report and bug-repro folders. Use for 'collection test', run-all, Postman bugs.
---

# Postman API test suite from a test design

## Why this shape
The person demonstrating the work presses **Send once** and gets the whole report; bug folders then reproduce each root cause with a few clean requests to screenshot. The collection is generated from data (`tests.json`) by a script so that it is consistent with the design and every project feature gets the same structure.

## Inputs
- The final test list of the design (from the `domain-bva-test-design` skill, or any list with ID, request, expectation, requirement code).
- API spec: paths, methods, auth, bodies. Base URL, account credentials (SRS lists default accounts).
If the API spec does not say how a state can be built (e.g. an expired token), do not fake it: automate what can be built and leave the rest as manual/`CẦN LÀM RÕ`.

## Procedure
1. **Select automatable cases.** API cases only. `UI:` cases are listed as manual and left out of `tests.json`. Use the *final* list after DT/BV de-duplication, so the collection and the design agree.
2. **Write `tests.json`** following `references/tests-schema.md`. Rules that matter:
   - `expect` copies the design: `2xx…` → `success`, `4xx…` → `reject`, `CẦN LÀM RÕ` → `clarify`. Never change an expectation to make a test pass.
   - Each test asserts **its own condition only**. A baseline test checks 2xx and nothing else; extra postconditions get their own test.
   - Every test builds its own state in `setup` (e.g. reset/fill the cart, create the object) — tests must not depend on the order or on leftovers of earlier tests. If the system under test leaves residue (state that does not reset), the setup must neutralise it.
   - "Data unchanged" for `reject` tests: take a `before` snapshot of a read endpoint and add a `verify` check that compares it with the state after.
   - For computed values use exact numbers from the SRS formula.
   - Do not invent a check the SRS does not support (type validation of a field the SRS says is ignored, etc.).
3. **Generate:** `python scripts/build_collection.py tests.json -o FRxx_API_postman_collection.json`
4. **Dry-run without Postman** (if a server or mock is reachable): `node scripts/dry_run.js FRxx_API_postman_collection.json http://localhost:3000`. It prints every result; a `ERROR` row means the script itself broke (wrong path, bad check expression), not that the system has a bug. Fix those first.
5. **Bug folders (B):** after the run, fill `bugs` in `tests.json` (one group per **root cause**, named `FR-XX-BUG-NNx` for steps a, b, c) and regenerate. Each step is a small request with setup, a status expectation and optional check lines. Only `FAIL` cases with an SRS clause become bugs; `CẦN LÀM RÕ` never does.
6. Tell the person how to import and run: import the JSON, run B0 first for folder B, press Send on request A.

## Hard-won rules
- **The carrier request must be a public endpoint** (default `GET /api/products`). The real work happens in the Tests tab via `pm.sendRequest`; if the carrier is a protected endpoint with no token, the request itself shows 401 and looks like a failure although all tests ran. The builder uses `carrier` from `tests.json`; do not point it at an auth-protected or admin path.
- A response of 401/403 on a *test* request is a normal pass for access-control cases.
- Keep credentials in collection variables (the builder creates `user1Email`, `user1Password`, …), never hard-code tokens.
- `ERROR` ≠ `FAIL`: report script errors separately and fix them before reporting results.
- After editing the generated file by hand, re-run the dry-run: a collection that no longer matches the design is the most common inconsistency.

## Deliver
`FRxx_API_postman_collection.json`, the `tests.json` it came from, and the list of manual (UI) cases left out.
