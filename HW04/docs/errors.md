
## fr04-chromium  (8 failed)

### P01 10 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P02 11 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P03 Boundary: 10 digits (lower limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P04 Boundary: 11 digits (upper limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P05 10 digits not starting with 0 is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### P13 First digit 1 (next to the valid 0) is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### X01 SEC-04: a name containing an HTML tag is shown as plain text in the page header

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('a[href="/profile"]')
Expected substring: "<b>x</b>"
Received string:    "Chào, x"
Timeout: 7000ms

Call log:
  - Expect "toContainText" locator('a[href="/profile"]') with timeout 7000ms
  - waiting for locator('a[href="/profile"]')
    17 × locator resolved to <a href="/profile" data-discover="true" class="hover:underline text-yellow-300">…</a>
       - unexpected value "Chào, x"

```

### X02 SEC-04: a name containing an <img onerror> payload must not run any script

```
Error: script from the name must not run

expect(received).toBeUndefined()

Received: 1
```


### CLARIFY notes (fr04-chromium)

- P14: alert="Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.", stored phone="0900000000" (SRS silent, recorded only)
- F04: alert=null, stored name="Ten Goc"
- F05: alert="Cập nhật thành công!", stored name="   "
- F06: alert="Cập nhật thành công!", stored address=""
- F07: alert="Cập nhật thành công!", stored name="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"... (1000 chars)


## fr04-firefox  (8 failed)

### P01 10 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P02 11 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P03 Boundary: 10 digits (lower limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P04 Boundary: 11 digits (upper limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P05 10 digits not starting with 0 is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### P13 First digit 1 (next to the valid 0) is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### X01 SEC-04: a name containing an HTML tag is shown as plain text in the page header

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('a[href="/profile"]')
Expected substring: "<b>x</b>"
Received string:    "Chào, x"
Timeout: 7000ms

Call log:
  - Expect "toContainText" locator('a[href="/profile"]') with timeout 7000ms
  - waiting for locator('a[href="/profile"]')
    17 × locator resolved to <a href="/profile" data-discover="true" class="hover:underline text-yellow-300">…</a>
       - unexpected value "Chào, x"

```

### X02 SEC-04: a name containing an <img onerror> payload must not run any script

```
Error: script from the name must not run

expect(received).toBeUndefined()

Received: 1
```


### CLARIFY notes (fr04-firefox)

- P14: alert="Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.", stored phone="0900000000" (SRS silent, recorded only)
- F04: alert=null, stored name="Ten Goc"
- F05: alert="Cập nhật thành công!", stored name="   "
- F06: alert="Cập nhật thành công!", stored address=""
- F07: alert="Cập nhật thành công!", stored name="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"... (1000 chars)


## fr04-webkit  (8 failed)

### P01 10 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P02 11 digits starting with 0 is accepted and saved

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P03 Boundary: 10 digits (lower limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P04 Boundary: 11 digits (upper limit) is accepted

```
Error: alert shown after saving

expect(received).toBe(expected) // Object.is equality

Expected: "Cập nhật thành công!"
Received: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."
```

### P05 10 digits not starting with 0 is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### P13 First digit 1 (next to the valid 0) is rejected

```
Error: the form must not report success

expect(received).not.toBe(expected) // Object.is equality

Expected: not "Cập nhật thành công!"
```

### X01 SEC-04: a name containing an HTML tag is shown as plain text in the page header

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('a[href="/profile"]')
Expected substring: "<b>x</b>"
Received string:    "Chào, x"
Timeout: 7000ms

Call log:
  - Expect "toContainText" locator('a[href="/profile"]') with timeout 7000ms
  - waiting for locator('a[href="/profile"]')
    17 × locator resolved to <a href="/profile" data-discover="true" class="hover:underline text-yellow-300">…</a>
       - unexpected value "Chào, x"

```

### X02 SEC-04: a name containing an <img onerror> payload must not run any script

```
Error: script from the name must not run

expect(received).toBeUndefined()

Received: 1
```


### CLARIFY notes (fr04-webkit)

- P14: alert="Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.", stored phone="0900000000" (SRS silent, recorded only)
- F04: alert=null, stored name="Ten Goc"
- F05: alert="Cập nhật thành công!", stored name="   "
- F06: alert="Cập nhật thành công!", stored address=""
- F07: alert="Cập nhật thành công!", stored name="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"... (1000 chars)


## fr08-chromium  (4 failed)

### C05 R4: a client that sends total_amount = 1 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 58000000
Received: 1
```

### C06 R4: a client that sends total_amount = 0 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 30000000
Received: 0
```

### C09 R2: the payment total cannot be edited by the user

```
Error: the payment total must be read-only

expect(locator).toBeDisabled() failed

Locator:  locator('input[type="number"]')
Expected: disabled
Received: enabled
Timeout:  7000ms

Call log:
  - the payment total must be read-only locator('input[type="number"]') with timeout 7000ms
  - waiting for locator('input[type="number"]')
    18 × locator resolved to <input type="number" value="30000000" class="border p-2 rounded text-red-600 font-bold"/>
       - unexpected value "enabled"
```

### C10 R5: after a successful checkout the cart is empty

```
Error: cart must be empty after a successful payment

expect(locator).toBeVisible() failed

Locator: getByText('Giỏ hàng của bạn đang trống')
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - cart must be empty after a successful payment getByText('Giỏ hàng của bạn đang trống') with timeout 7000ms
  - waiting for getByText('Giỏ hàng của bạn đang trống')

```


### CLARIFY notes (fr08-chromium)

- C14: checkout button on empty cart: hidden; forced checkout: SUCCESS page shown, orders created=1 (SRS silent, recorded only)
- C15: address field on checkout page=false, stored shipping_address=null (API spec requires it, SRS silent)


## fr08-firefox  (4 failed)

### C05 R4: a client that sends total_amount = 1 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 58000000
Received: 1
```

### C06 R4: a client that sends total_amount = 0 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 30000000
Received: 0
```

### C09 R2: the payment total cannot be edited by the user

```
Error: the payment total must be read-only

expect(locator).toBeDisabled() failed

Locator:  locator('input[type="number"]')
Expected: disabled
Received: enabled
Timeout:  7000ms

Call log:
  - the payment total must be read-only locator('input[type="number"]') with timeout 7000ms
  - waiting for locator('input[type="number"]')
    18 × locator resolved to <input type="number" value="30000000" class="border p-2 rounded text-red-600 font-bold"/>
       - unexpected value "enabled"
```

### C10 R5: after a successful checkout the cart is empty

```
Error: cart must be empty after a successful payment

expect(locator).toBeVisible() failed

Locator: getByText('Giỏ hàng của bạn đang trống')
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - cart must be empty after a successful payment getByText('Giỏ hàng của bạn đang trống') with timeout 7000ms
  - waiting for getByText('Giỏ hàng của bạn đang trống')

```


### CLARIFY notes (fr08-firefox)

- C14: checkout button on empty cart: hidden; forced checkout: SUCCESS page shown, orders created=1 (SRS silent, recorded only)
- C15: address field on checkout page=false, stored shipping_address=null (API spec requires it, SRS silent)


## fr08-webkit  (4 failed)

### C05 R4: a client that sends total_amount = 1 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 58000000
Received: 1
```

### C06 R4: a client that sends total_amount = 0 must not change the stored total

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 30000000
Received: 0
```

### C09 R2: the payment total cannot be edited by the user

```
Error: the payment total must be read-only

expect(locator).toBeDisabled() failed

Locator:  locator('input[type="number"]')
Expected: disabled
Received: enabled
Timeout:  7000ms

Call log:
  - the payment total must be read-only locator('input[type="number"]') with timeout 7000ms
  - waiting for locator('input[type="number"]')
    17 × locator resolved to <input type="number" value="30000000" class="border p-2 rounded text-red-600 font-bold"/>
       - unexpected value "enabled"
```

### C10 R5: after a successful checkout the cart is empty

```
Error: cart must be empty after a successful payment

expect(locator).toBeVisible() failed

Locator: getByText('Giỏ hàng của bạn đang trống')
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - cart must be empty after a successful payment getByText('Giỏ hàng của bạn đang trống') with timeout 7000ms
  - waiting for getByText('Giỏ hàng của bạn đang trống')

```


### CLARIFY notes (fr08-webkit)

- C14: checkout button on empty cart: hidden; forced checkout: SUCCESS page shown, orders created=1 (SRS silent, recorded only)
- C15: address field on checkout page=false, stored shipping_address=null (API spec requires it, SRS silent)


## fr13-chromium  (8 failed)

### S01 - One delivered order is added to the revenue

```
Error: Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 200000
Received: 400000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S06 - Boundary: smallest delivered amount (1 VND) is added exactly

```
Error: Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S07 - Boundary: largest 32-bit amount (2147483647) is added exactly

```
Error: Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 2147483647
Received: 4294967294

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S08 - Mixed orders: only the two delivered ones are summed

```
Error: Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 550000
Received: 1100000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S09 - Admin walks an order pending > confirmed > shipping > delivered in the UI; revenue changes only at delivered

```
Error: Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 180000
Received: 360000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S12 - FR-10: a canceled order is a final state, the order list offers no action for it

```
Error: a final-state order must offer no action button

expect(locator).toHaveCount(expected) failed

Locator:  locator('tr').filter({ has: getByRole('cell', { name: '#68', exact: true }) }).getByRole('button')
Expected: 0
Received: 1
Timeout:  7000ms

Call log:
  - a final-state order must offer no action button locator('tr').filter({ has: getByRole('cell', { name: '#68', exact: true }) }).getByRole('button') with timeout 7000ms
  - waiting for locator('tr').filter({ has: getByRole('cell', { name: '#68', exact: true }) }).getByRole('button')
    17 × locator resolved to 1 element
       - unexpected value "1"
```

### S13 - Revenue tile equals the sum of all delivered orders in the system, order tile equals the number of orders

```
Error: Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

expect(received).toBe(expected) // Object.is equality

Expected: 2148533648
Received: 4297067296

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### A04 - A non-admin JWT placed in the admin web must not open the dashboard (FR-12, SEC-03)

```
Error: the login form must be shown

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Admin Login' })
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - the login form must be shown getByRole('heading', { name: 'Admin Login' }) with timeout 7000ms
  - waiting for getByRole('heading', { name: 'Admin Login' })

```


### CLARIFY notes (fr13-chromium)

- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 58 to 59 (expected change if all orders count: 1).
- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 66 to 66 (expected change if all orders count: 0).
- Message shown to the user: Bạn không phải là admin!
- Message shown to the user: Đăng nhập thất bại


## fr13-firefox  (8 failed)

### S01 - One delivered order is added to the revenue

```
Error: Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 200000
Received: 400000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S06 - Boundary: smallest delivered amount (1 VND) is added exactly

```
Error: Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S07 - Boundary: largest 32-bit amount (2147483647) is added exactly

```
Error: Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 2147483647
Received: 4294967294

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S08 - Mixed orders: only the two delivered ones are summed

```
Error: Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 550000
Received: 1100000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S09 - Admin walks an order pending > confirmed > shipping > delivered in the UI; revenue changes only at delivered

```
Error: Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 180000
Received: 360000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S12 - FR-10: a canceled order is a final state, the order list offers no action for it

```
Error: a final-state order must offer no action button

expect(locator).toHaveCount(expected) failed

Locator:  locator('tr').filter({ has: getByRole('cell', { name: '#82', exact: true }) }).getByRole('button')
Expected: 0
Received: 1
Timeout:  7000ms

Call log:
  - a final-state order must offer no action button locator('tr').filter({ has: getByRole('cell', { name: '#82', exact: true }) }).getByRole('button') with timeout 7000ms
  - waiting for locator('tr').filter({ has: getByRole('cell', { name: '#82', exact: true }) }).getByRole('button')
    16 × locator resolved to 1 element
       - unexpected value "1"
```

### S13 - Revenue tile equals the sum of all delivered orders in the system, order tile equals the number of orders

```
Error: Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

expect(received).toBe(expected) // Object.is equality

Expected: 4297067296
Received: 8594134592

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### A04 - A non-admin JWT placed in the admin web must not open the dashboard (FR-12, SEC-03)

```
Error: the login form must be shown

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Admin Login' })
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - the login form must be shown getByRole('heading', { name: 'Admin Login' }) with timeout 7000ms
  - waiting for getByRole('heading', { name: 'Admin Login' })

```


### CLARIFY notes (fr13-firefox)

- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 72 to 73 (expected change if all orders count: 1).
- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 80 to 80 (expected change if all orders count: 0).
- Message shown to the user: Bạn không phải là admin!
- Message shown to the user: Đăng nhập thất bại


## fr13-webkit  (8 failed)

### S01 - One delivered order is added to the revenue

```
Error: Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 200000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 200000
Received: 400000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S06 - Boundary: smallest delivered amount (1 VND) is added exactly

```
Error: Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 1 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 2

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S07 - Boundary: largest 32-bit amount (2147483647) is added exactly

```
Error: Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 2147483647 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 2147483647
Received: 4294967294

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S08 - Mixed orders: only the two delivered ones are summed

```
Error: Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 550000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 550000
Received: 1100000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S09 - Admin walks an order pending > confirmed > shipping > delivered in the UI; revenue changes only at delivered

```
Error: Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

Dashboard revenue must change by 180000 (SRS FR-13: only delivered orders are summed)

expect(received).toBe(expected) // Object.is equality

Expected: 180000
Received: 360000

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### S12 - FR-10: a canceled order is a final state, the order list offers no action for it

```
Error: a final-state order must offer no action button

expect(locator).toHaveCount(expected) failed

Locator:  locator('tr').filter({ has: getByRole('cell', { name: '#96', exact: true }) }).getByRole('button')
Expected: 0
Received: 1
Timeout:  7000ms

Call log:
  - a final-state order must offer no action button locator('tr').filter({ has: getByRole('cell', { name: '#96', exact: true }) }).getByRole('button') with timeout 7000ms
  - waiting for locator('tr').filter({ has: getByRole('cell', { name: '#96', exact: true }) }).getByRole('button')
    17 × locator resolved to 1 element
       - unexpected value "1"
```

### S13 - Revenue tile equals the sum of all delivered orders in the system, order tile equals the number of orders

```
Error: Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

Dashboard revenue must equal the sum of total_amount of ALL delivered orders (SRS FR-13)

expect(received).toBe(expected) // Object.is equality

Expected: 6445600944
Received: 12891201888

Call Log:
- Timeout 7000ms exceeded while waiting on the predicate
```

### A04 - A non-admin JWT placed in the admin web must not open the dashboard (FR-12, SEC-03)

```
Error: the login form must be shown

expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Admin Login' })
Expected: visible
Timeout: 7000ms
Error: element(s) not found

Call log:
  - the login form must be shown getByRole('heading', { name: 'Admin Login' }) with timeout 7000ms
  - waiting for getByRole('heading', { name: 'Admin Login' })

```


### CLARIFY notes (fr13-webkit)

- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 86 to 87 (expected change if all orders count: 1).
- SRS does not say whether canceled orders are part of "total number of orders"; the value shown is recorded, not judged. Order tile moved from 94 to 94 (expected change if all orders count: 0).
- Message shown to the user: Bạn không phải là admin!
- Message shown to the user: Đăng nhập thất bại
