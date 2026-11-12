import { test, expect } from '@playwright/test';
import { AdminProductPage } from '../pages/AdminProductPage';
import { loadJsonData } from '../utils/dataLoader';
import { annotateTestRun } from '../utils/testHelpers';

interface ProductTestCase {
  id: string;
  category: string;
  action: 'create' | 'update_isolation' | 'cancel_edit' | 'delete' | 'delete_confirm';
  title: string;
  name?: string;
  nameRepeat?: { char: string; length: number };
  price: string;
  description?: string;
  imageUrl?: string;
  categoryId?: string;
  expected: {
    outcome: string;
    bugNote?: string;
  };
}

const testCases = loadJsonData<ProductTestCase>('fr15-products.json');

test.describe('FR-15: Admin Product Management CRUD (Data-Driven)', () => {
  for (const tc of testCases) {
    test(`[${tc.id}] (${tc.category}) ${tc.title}`, async ({ page, browserName, request }) => {
      annotateTestRun(test.info(), {
        feature: 'FR-15',
        tcId: tc.id,
        category: tc.category,
        bugNote: tc.expected.bugNote,
      });

      const adminPage = new AdminProductPage(page);
      await adminPage.gotoAndLogin('admin@eshop.com', 'Admin123!');
      await adminPage.openProductsTab();

      // Assertion Pattern 1: URL & Heading Visibility / Text
      await expect(page).toHaveURL(/localhost:5174/);
      await expect(adminPage.pageHeading).toBeVisible();
      await expect(adminPage.pageHeading).toHaveText('Quản lý Sản phẩm');

      const uniqueTag = `${browserName}_${Date.now()}`;
      const resolvedName = tc.nameRepeat
        ? tc.nameRepeat.char.repeat(tc.nameRepeat.length)
        : (tc.name ?? '').replace('{{ts}}', uniqueTag);

      if (tc.action === 'create') {
        let dialogCount = 0;
        page.on('dialog', async (dialog) => {
          dialogCount++;
          await dialog.dismiss();
        });

        await adminPage.fillProductForm({
          name: resolvedName,
          price: tc.price,
          description: tc.description,
          imageUrl: tc.imageUrl,
          categoryId: tc.categoryId,
        });

        if (tc.expected.outcome === 'html5_invalid') {
          let createApiCalled = false;
          page.on('request', (req) => {
            if (req.url().includes('/api/products') && req.method() === 'POST') {
              createApiCalled = true;
            }
          });
          await adminPage.saveButton.click();
          const isValid = await adminPage.nameInput.evaluate((el: HTMLInputElement) =>
            el.checkValidity()
          );
          expect(isValid).toBe(false);
          expect(createApiCalled).toBe(false);
          return;
        }

        const beforeRowCount = await adminPage.productRows.count();
        const [createRes] = await Promise.all([
          page.waitForResponse(
            (res) => res.url().endsWith('/api/products') && res.request().method() === 'POST'
          ),
          adminPage.saveButton.click(),
        ]);

        const createBody = await createRes.json().catch(() => ({}));
        const createdId = createBody?.id;

        try {
          if (tc.expected.outcome === 'created_in_table') {
            expect(createRes.status()).toBe(200);
            // Assertion Pattern 2: Row Visibility in Table
            await expect(adminPage.rowByProductName(resolvedName).first()).toBeVisible({
              timeout: 3000,
            });
          } else if (tc.expected.outcome === 'created_escaped_no_alert') {
            expect(createRes.status()).toBe(200);
            await expect(adminPage.rowByProductName(resolvedName).first()).toBeVisible({
              timeout: 3000,
            });
            expect(dialogCount).toBe(0);
          } else if (tc.expected.outcome === 'rejected') {
            // Assertion Pattern 3: HTTP 4xx rejection & row count must not increase
            expect(
              createRes.status(),
              tc.expected.bugNote ?? 'Invalid product should be rejected with HTTP 4xx'
            ).toBeGreaterThanOrEqual(400);
            await expect(
              adminPage.productRows,
              tc.expected.bugNote ?? 'Product count must remain unchanged'
            ).toHaveCount(beforeRowCount, { timeout: 2500 });
          }
        } finally {
          if (createdId) {
            await request.delete(`http://localhost:3000/api/products/${createdId}`);
          }
        }
      } else if (tc.action === 'update_isolation') {
        const secondRowName = await adminPage.productRows.nth(1).locator('td').nth(1).innerText();

        await adminPage.productRows.first().getByRole('button', { name: 'Sửa' }).click();
        await expect(adminPage.formHeading).toHaveText('Sửa sản phẩm');

        await adminPage.nameInput.fill(resolvedName);
        await adminPage.priceInput.fill(tc.price);

        const dialogPromise = page.waitForEvent('dialog').then(async (d) => {
          await d.accept();
        });
        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes('/api/products/') && res.request().method() === 'PUT'
          ),
          dialogPromise,
          adminPage.saveButton.click(),
        ]);

        // Wait until React commits the PUT state update to row 0 before checking row 1 isolation
        await expect(
          adminPage.productRows.first().locator('td').nth(1)
        ).toHaveText(resolvedName, { timeout: 2500 });

        await expect(
          adminPage.productRows.nth(1).locator('td').nth(1),
          tc.expected.bugNote ?? 'Other products must remain unchanged when updating one product'
        ).toHaveText(secondRowName, { timeout: 2500 });
      } else if (tc.action === 'cancel_edit') {
        await adminPage.productRows.first().getByRole('button', { name: 'Sửa' }).click();
        await expect(adminPage.formHeading).toHaveText('Sửa sản phẩm');
        await expect(adminPage.cancelEditButton).toBeVisible();

        await adminPage.cancelEditButton.click();
        await expect(adminPage.formHeading).toHaveText('Thêm sản phẩm mới');
        await expect(adminPage.nameInput).toHaveValue('');
      } else if (tc.action === 'delete') {
        await adminPage.fillProductForm({
          name: resolvedName,
          price: tc.price,
          description: tc.description,
          imageUrl: tc.imageUrl,
          categoryId: tc.categoryId,
        });
        await Promise.all([
          page.waitForResponse(
            (res) => res.url().endsWith('/api/products') && res.request().method() === 'POST'
          ),
          adminPage.saveButton.click(),
        ]);

        const targetRow = adminPage.rowByProductName(resolvedName).first();
        await expect(targetRow).toBeVisible();

        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes('/api/products/') && res.request().method() === 'DELETE'
          ),
          targetRow.getByRole('button', { name: 'Xóa' }).click(),
        ]);
        await expect(adminPage.rowByProductName(resolvedName)).toHaveCount(0, { timeout: 2500 });
      } else if (tc.action === 'delete_confirm') {
        await adminPage.fillProductForm({
          name: resolvedName,
          price: tc.price,
          description: tc.description,
          imageUrl: tc.imageUrl,
          categoryId: tc.categoryId,
        });
        const [createRes] = await Promise.all([
          page.waitForResponse(
            (res) => res.url().endsWith('/api/products') && res.request().method() === 'POST'
          ),
          adminPage.saveButton.click(),
        ]);
        const createBody = await createRes.json().catch(() => ({}));

        const targetRow = adminPage.rowByProductName(resolvedName).first();
        await expect(targetRow).toBeVisible();

        let confirmTriggered = false;
        page.on('dialog', async (dialog) => {
          if (dialog.type() === 'confirm') {
            confirmTriggered = true;
          }
          await dialog.dismiss();
        });

        await Promise.all([
          page.waitForResponse(
            (res) => res.url().includes('/api/products/') && res.request().method() === 'DELETE'
          ),
          targetRow.getByRole('button', { name: 'Xóa' }).click(),
        ]).catch(() => {
          // If confirm dialog blocked DELETE, that's expected; ignore timeout
        });

        if (createBody?.id && confirmTriggered) {
          await request.delete(`http://localhost:3000/api/products/${createBody.id}`);
        }

        expect(
          confirmTriggered,
          tc.expected.bugNote ?? 'Expected window.confirm() dialog before deleting product'
        ).toBe(true);
      }
    });
  }
});
