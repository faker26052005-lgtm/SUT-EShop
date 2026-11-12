import { test, expect } from '@playwright/test';
import { AdminProductPage } from '../pages/AdminProductPage';
import { loadJsonData } from '../utils/dataLoader';

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
    test(`[${tc.id}] (${tc.category}) ${tc.title}`, async ({ page, browserName }) => {
      test.info().annotations.push({
        type: 'Run by: 23120183',
        description: new Date().toISOString(),
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
        await adminPage.saveButton.click();

        if (tc.expected.outcome === 'html5_invalid') {
          const isValid = await adminPage.nameInput.evaluate((el: HTMLInputElement) =>
            el.checkValidity()
          );
          expect(isValid).toBe(false);
        } else if (tc.expected.outcome === 'created_in_table') {
          // Assertion Pattern 2: Row Visibility in Table
          await expect(adminPage.rowByProductName(resolvedName).first()).toBeVisible({
            timeout: 2500,
          });
        } else if (tc.expected.outcome === 'created_escaped_no_alert') {
          await expect(adminPage.rowByProductName(resolvedName).first()).toBeVisible({
            timeout: 2500,
          });
          expect(dialogCount).toBe(0);
        } else if (tc.expected.outcome === 'rejected') {
          // Assertion Pattern 3: Count Assertion (must not appear in table)
          await expect(
            adminPage.rowByProductName(resolvedName),
            tc.expected.bugNote ?? 'Invalid product should be rejected'
          ).toHaveCount(0, { timeout: 2500 });
        }
      } else if (tc.action === 'update_isolation') {
        page.on('dialog', (d) => d.accept());
        const secondRowName = await adminPage.productRows.nth(1).locator('td').nth(1).innerText();

        await adminPage.productRows.first().getByRole('button', { name: 'Sửa' }).click();
        await expect(adminPage.formHeading).toHaveText('Sửa sản phẩm');

        await adminPage.nameInput.fill(resolvedName);
        await adminPage.priceInput.fill(tc.price);
        await adminPage.saveButton.click();

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
        await adminPage.saveButton.click();

        const targetRow = adminPage.rowByProductName(resolvedName).first();
        await expect(targetRow).toBeVisible();

        await targetRow.getByRole('button', { name: 'Xóa' }).click();
        await expect(adminPage.rowByProductName(resolvedName)).toHaveCount(0, { timeout: 2500 });
      } else if (tc.action === 'delete_confirm') {
        await adminPage.fillProductForm({
          name: resolvedName,
          price: tc.price,
          description: tc.description,
          imageUrl: tc.imageUrl,
          categoryId: tc.categoryId,
        });
        await adminPage.saveButton.click();

        const targetRow = adminPage.rowByProductName(resolvedName).first();
        await expect(targetRow).toBeVisible();

        let confirmTriggered = false;
        page.on('dialog', async (dialog) => {
          if (dialog.type() === 'confirm') {
            confirmTriggered = true;
          }
          await dialog.dismiss();
        });

        await targetRow.getByRole('button', { name: 'Xóa' }).click();
        expect(
          confirmTriggered,
          tc.expected.bugNote ?? 'Expected window.confirm() dialog before deleting product'
        ).toBe(true);
      }
    });
  }
});
