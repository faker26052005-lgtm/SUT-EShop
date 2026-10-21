# tests.json schema

```json
{
  "feature": "FR-09",
  "title": "Mã giảm giá",
  "baseUrl": "http://localhost:3000",
  "carrier": "/api/products",
  "users": {
    "user1": {"email": "test@eshop.com", "password": "Test1234!"},
    "user2": {"email": "user2@eshop.com", "password": "Password123!", "register": true, "name": "User Two"},
    "admin": {"email": "admin@eshop.com", "password": "Admin123!"}
  },
  "init_js": "const p = await call('GET','/api/products'); ctx.P1 = p.json[0];",
  "tests": [ { ...test... } ],
  "bugs":  [ { ...bug... } ],
  "cleanup": [ {"method": "DELETE", "path": "/api/cart", "auth": "user1"} ]
}
```
`user1` is required (login failure aborts the run). Login uses `POST /api/login` returning `{token}`; `register: true` registers the user when login fails.

## Values
- Plain JSON values are used as-is.
- A string starting with `@js:` is raw JavaScript, evaluated at run time: `"@js:ctx.P1.id"`, `"@js:'A'.repeat(255)"`, `"@js:`/api/orders/${ctx.orderId}`"`. Available names: `ctx` (filled by `init_js`), `tok` (tokens), `uid` (user ids from the login response `user.id`), `call(method, path, body, token)`, `r` (main response), `v` (current verify response), `snap` (before-snapshots).
- Responses are `{code, json, text}`.

## auth
`"user1"` (default) · `"user2"` · `"admin"` · `"none"` (no header) · `"token:literal-value"` · `"@js:expr"`. To send a header **without** the `Bearer ` prefix use `"@js:'RAW:' + tok.user1"` (the value after `RAW:` is sent as the whole header).

## test
```json
{
  "id": "BV-04",
  "technique": "BVA",
  "req": "R3",
  "title": "total = threshold exactly (>= accepted)",
  "auth": "user1",
  "setup":  [ {"method": "POST", "path": "/api/cart", "body": {"id": "@js:ctx.P1.id", "quantity": 1}} ],
  "before": [ {"as": "cart", "method": "GET", "path": "/api/cart"} ],
  "request": {"method": "POST", "path": "/api/apply-coupon", "body": {"code": "SAVE10", "total_amount": 300000}},
  "expect": "success",
  "status": [400, 422],
  "verify": [
    {"check": "r.json && r.json.final_amount === 270000", "note": "final_amount = 270000"},
    {"method": "GET", "path": "/api/cart", "check": "v.json.length === snap.cart.json.length", "note": "cart unchanged"}
  ],
  "note": "free text appended to the observation"
}
```
- `expect`: `success` (status 2xx) · `reject` (status 4xx, or one of `status` if given) · `clarify` (never fails; records what happened).
- A `setup` entry may instead be `{"js": "const code = 'T_' + Date.now();"}` — a raw JS statement scoped to that test (use it for unique fixture names). Later entries and `request` can use the variable via `@js:code`.
- `setup` / `before` / `verify` calls take `method`, `path`, optional `body`, optional `auth` (default: the test's auth).
- `verify` entries without `method` are pure checks on the main response `r`.
- The verdict is PASS only if the status condition and every `verify.check` hold.

## bug
```json
{
  "id": "FR-09-BUG-01",
  "title": "Coupon threshold uses > instead of >= (R3)",
  "steps": [
    {"name": "FR-09-BUG-01a. Apply SAVE10 with total exactly 300000 (BV-04)",
     "method": "POST", "path": "/api/apply-coupon", "auth": "user1",
     "body": {"code": "SAVE10", "total_amount": 300000},
     "setup": [],
     "expect_status": "2xx",
     "js": "pm.test('discount_amount = 30000', () => pm.expect(pm.response.json().discount_amount === 30000, 'BUG').to.be.true);"}
  ]
}
```
`expect_status`: `"2xx"`, `"4xx"` or a list of codes. `js` is raw Postman script (has `pm` and `ctx`). Bug steps need B0 to have been run (it stores tokens, `ctx`, and the collection variables `tok_<user>`, `uid_<user>`). Request bodies are static: use `{{varName}}` collection variables for fixtures that `init_js` creates with `pm.collectionVariables.set('varName', value)`; a body value written exactly as `"{{uid_user1}}"` is emitted unquoted, i.e. as a number.
