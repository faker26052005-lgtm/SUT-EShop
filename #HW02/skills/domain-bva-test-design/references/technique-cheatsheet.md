# Technique cheat-sheet

## Contents
1. Class lists by data type
2. BVA by comparison operator
3. Boundaries on state (counters, dates)
4. Probes when the SRS gives no limit

## 1. Class lists by data type
Only create a class if it can change behaviour according to the SRS or if it is a legitimate `CẦN LÀM RÕ` question.

| Type | Valid classes | Invalid classes (one violation each) |
| :-- | :-- | :-- |
| Number (int) | in-range value | below range, above range, zero (if range excludes it), negative, non-integer (3.5), numeric string, null/missing |
| Number (money) | positive typical | zero, negative, numeric string, null/missing |
| String with length rule | length inside range | empty, whitespace only, shorter than min, longer than max, wrong type (number), null/missing |
| String with format rule (phone, email, code) | each accepted format the SRS lists | each rule broken on its own: wrong prefix, too short, too long, non-digit chars, missing "@", etc. |
| Free text shown on UI | plain text | HTML/script text (valid input, expectation is on display: SEC-04 → `UI:` test) |
| Enum / status | each listed value | unknown value, wrong case, null |
| Date | future, (past if allowed) | past when future required, today/same day if the rule is strict, malformed date |
| Boolean/flag | true, false | non-boolean value |
| Id (path/body) | existing own resource | non-existent, other user's resource, negative, non-numeric |
| Token (header) | valid, right role | missing header, missing `Bearer ` prefix, tampered signature, expired, valid token of wrong role |

Combining: never combine two violations in one test. Valid values of all other variables come from a documented baseline.

## 2. BVA by comparison operator (3-value: B−1, B, B+1)
Use the operator exactly as the SRS words it.

| SRS says | Boundary B | Tests (expected) |
| :-- | :-- | :-- |
| `x >= T` is accepted | T | T−1 reject, T accept, T+1 accept |
| `x > T` is accepted | T | T−1 reject, T reject, T+1 accept |
| `x <= T` is accepted | T | T−1 accept, T accept, T+1 reject |
| `x < T` is accepted | T | T−1 accept, T reject, T+1 reject |
| `a <= x <= b` | a and b | a−1 reject, a, a+1 accept; b−1 accept, b accept, b+1 reject |
| length 10–11 digits | 10 and 11 | 9 reject, 10, 11 accept, 12 reject (the +1/−1 values inside the range are optional when they repeat another test) |

Step size = the smallest meaningful unit: 1 for integers/currency in whole units, 1 char for lengths, 1 day for dates.
Rows where the expectation depends on a rule the SRS does not state stay `CẦN LÀM RÕ`.

## 3. Boundaries on state
- Counter limit `used < max_uses` (max=1): used 0 → accept; used 1 → reject. Build the state with real calls (apply/consume first).
- Date "before expired_at": the day before → accept; **the expiry day itself → reject** (today is not before it); the day after → reject. Date-dependent fixtures: use far-past/far-future items from the SRS sample data when they exist, or create items with computed dates.
- Threshold on a computed value (cart total): build carts whose computed total hits T−1, T, T+1 — the variable is the total, not a body field.

## 4. Probes when the SRS gives no limit
If a variable is ordered but the SRS names no limit, do not invent one (no 255, no 999). Add only probes, each `CẦN LÀM RÕ`, labelled "probe": 0, −1, empty, a very long value (e.g. 1000 chars). Record the question in the clarification list.
