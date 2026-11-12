# DOM Survey & Locator Design (Stage 1)

**Student ID:** `23120183`  
**Target SUT:** `EShop` (`frontend-web` on `:5173`, `frontend-admin` on `:5174`, `backend` on `:3000`)

---

## 1. Feature A — `FR-01`: Account Registration (`/register`)
Source: `frontend-web/src/pages/Register.jsx`

| Element | Actual DOM / Attributes | Chosen Playwright Locator | Observation / Accessibility Note |
|---|---|---|---|
| Heading | `<h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký Tài Khoản</h2>` | `page.getByRole('heading', { name: 'Đăng Ký Tài Khoản' })` | Page uses `<h2>` instead of `<h1>` (GUI defect). |
| Họ Tên | `<div><label>Họ Tên</label><input type="text" required /></div>` | `page.locator('form div:has(> label:text-is("Họ Tên")) input')` | `<label>` has no `htmlFor` and does not wrap `<input>`, so `getByLabel()` fails. |
| Email | `<div><label>Email</label><input type="text" required /></div>` | `page.locator('form div:has(> label:text-is("Email")) input')` | Uses `type="text"` instead of `type="email"`, bypassing HTML5 email format check. |
| Mật khẩu | `<div><label>Mật khẩu</label><input type="password" required /></div>` | `page.locator('form div:has(> label:text-is("Mật khẩu")) input')` | Regex `flawedStrongPasswordRegex` requires whitespace (`\s`) instead of special characters. |
| Xác nhận MK | *(Not present in DOM)* | `page.locator('form div:has(> label:text-matches("Xác nhận mật khẩu", "i")) input')` | Missing from `Register.jsx` (BUG-FR01-02). |
| Submit button | `<button type="submit">Đăng Ký</button>` | `page.getByRole('button', { name: 'Đăng Ký' })` | Stable semantic role locator. |
| Error banner | `<div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>` | `page.locator('div.bg-red-100.text-red-700')` | Rendered conditionally only on error. |

---

## 2. Feature B — `FR-09`: Discount Coupons (`/checkout`)
Source: `frontend-web/src/pages/Login.jsx`, `Home.jsx`, `Cart.jsx`, `Checkout.jsx`

| Element | Actual DOM / Attributes | Chosen Playwright Locator | Observation / Flow Note |
|---|---|---|---|
| Login Username | `<label>Username</label><input type="text" required />` | `page.locator('form div:has(> label:text-is("Username")) input')` | Login heading erroneously says `"Đăng Ký"`. |
| Login Password | `<label>Mật khẩu</label><input type="text" required />` | `page.locator('form div:has(> label:text-is("Mật khẩu")) input')` | Uses `type="text"` (plaintext visibility defect). |
| Login Submit | `<button type="submit">Sign In</button>` | `page.getByRole('button', { name: 'Sign In' })` | Redirects to `/`. |
| Add to Cart | `<button>Thêm vào giỏ</button>` | `page.getByRole('button', { name: 'Thêm vào giỏ' })` | Required before visiting `/cart` and `/checkout`. |
| Proceed Checkout | `<button>Tiến hành thanh toán</button>` | `page.getByRole('button', { name: 'Tiến hành thanh toán' })` | Navigates to `/checkout`. |
| Order Total Input | `<input type="number" value={editableTotal} ... />` | `page.locator('input[type="number"]')` | Total is editable on UI (allows testing exact boundary amounts). |
| Coupon Input | `<input type="text" placeholder="Nhập mã giảm giá..." />` | `page.getByPlaceholder('Nhập mã giảm giá...')` | Stable placeholder locator. |
| Apply Coupon | `<button disabled={applyingCoupon \|\| !couponCode.trim()}>Áp dụng</button>` | `page.getByRole('button', { name: 'Áp dụng' })` | Disabled when empty or whitespace-only. |
| Coupon Error | `<p className="mt-2 text-red-600 text-sm">{couponError}</p>` | `page.locator('p.text-red-600')` | Shows backend error message. |
| Coupon Success | `<div className="mt-2 text-green-700 text-sm space-y-1">...</div>` | `page.locator('div.text-green-700')` | Displays message, `Tiết kiệm`, and `Thành tiền`. |

---

## 3. Feature C — `FR-15`: Admin Product Management CRUD (`http://localhost:5174`)
Source: `frontend-admin/src/App.jsx`

| Element | Actual DOM / Attributes | Chosen Playwright Locator | Observation / Note |
|---|---|---|---|
| Admin Email/PW | `placeholder="Email"`, `placeholder="Password"` | `page.getByPlaceholder('Email')`, `page.getByPlaceholder('Password')` | Default admin: `admin@eshop.com` / `Admin123!`. |
| Admin Login | `<button>Login</button>` | `page.getByRole('button', { name: 'Login' })` | Stores `adminToken` in `localStorage`. |
| Products Tab | `<li onClick={() => setActiveTab("products")}>Sản phẩm</li>` | `page.locator('ul li').filter({ hasText: /^Sản phẩm$/ })` | Tab switch renders product management view. |
| Product Name | `<input placeholder="Tên sản phẩm" required />` | `page.getByPlaceholder('Tên sản phẩm')` | Required via HTML5 attribute. |
| Product Price | `<input placeholder="Giá tiền" type="number" />` | `page.getByPlaceholder('Giá tiền')` | No `min` or `required` attribute. |
| Image URL / Desc | `placeholder="URL Ảnh"`, `placeholder="Mô tả"` | `page.getByPlaceholder('URL Ảnh')`, `page.getByPlaceholder('Mô tả')` | Optional fields. |
| Category Select | `<select value={productForm.category_id}>...</select>` | `page.locator('form select')` | Populated from `/api/categories`. |
| Save / Cancel | `<button>Lưu sản phẩm</button>`, `<button>Hủy sửa</button>` | `page.getByRole('button', { name: 'Lưu sản phẩm' })` | `Hủy sửa` visible only when editing. |
| Product Table | `<table><thead>...<th>Tên SP</th>...</thead><tbody>...</tbody></table>` | `page.locator('table:has(th:text-is("Tên SP"))')` | Disambiguates from the CSV import preview table. |
| Row Actions | `<button>Sửa</button>`, `<button>Xóa</button>` | `row.getByRole('button', { name: 'Sửa' })`, `row.getByRole('button', { name: 'Xóa' })` | `Sửa` triggers `fakeMassUpdatedProducts` bug; `Xóa` deletes without `confirm()`. |
