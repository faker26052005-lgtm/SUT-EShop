# Business, security, access tests and side-effect checklist

## Contents
1. Access control (AC-)
2. Business and security tests (BL-)
3. Side-effect checklist

## 1. Access control (AC-)
For each protected endpoint of the FR, one test per variant, each with a requirement code (SEC-02/R-access):
- no Authorization header
- malformed header (no `Bearer ` prefix)
- tampered / invalid signature
- expired token (only if you can build one; otherwise `CẦN LÀM RÕ` on how)
- valid token of the wrong role (user token on an admin endpoint) when SEC-03 / role rules exist
Expected: `4xx và dữ liệu không đổi`. Verify "data unchanged" by reading a list/detail endpoint before and after.
Do not assert a specific 401 vs 403 unless the SRS names it; if it matters, put it in the clarification list.

## 2. Business and security tests (BL-)
- **Formulas**: compute the expected number from the SRS formula with concrete inputs (e.g. total 500,000, 10% → discount 50,000, final 450,000) and compare exactly.
- **Client-controlled values**: if the SRS says the backend computes something, send a wrong client value and verify the stored value is the computed one.
- **Data isolation / IDOR**: user B reads or changes user A's resource by id or via a body field such as `user_id`.
- **Mass assignment**: send fields the user must not control (`role`, `id`, `is_active`, another user's id). Verify the field did not change by re-reading.
- **State machine**: each valid transition once, and each forbidden transition (from terminal states too).
- **SEC items present in the SRS**: parameterized queries (send `' OR '1'='1` in text inputs: expect no extra rows/no 5xx), XSS escaping (`<script>` stored as plain text, UI check), password/OTP rules — only when the SRS lists them.
- **Conditions of a rule table** (C1–C5): see SKILL.md Step 3, one-violation-each.
Each test: `Cách dựng` (setup calls), input, expectation (fixed vocabulary), requirement code.

## 3. Side-effect checklist (after every write: create, update, delete, apply, checkout, cancel)
Ask each question; answer "tested by <ID>", "new test", or "CẦN LÀM RÕ".
1. Fields not sent in the request: unchanged?
2. Other records of the same user (cart items, other orders): unchanged?
3. Other users' records: unchanged and not visible?
4. Derived or aggregate values the SRS defines (totals, counters, usage counts, stock, status): updated exactly as specified?
5. Cleanup the SRS demands (e.g. cart emptied after checkout): done only on success?
6. Failure path: a rejected request leaves everything unchanged (no half-created order, no consumed coupon use)?
7. Repeat / double submit: second identical request handled per the SRS (or `CẦN LÀM RÕ`)?
8. Snapshot/history: later changes to a referenced item (price, name) do not rewrite past records — only if the SRS says so.
9. System-generated fields (id, timestamps, default status): present and valid?
10. Response body: does not expose other users' data or secrets.
