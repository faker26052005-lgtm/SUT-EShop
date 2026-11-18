import { test, expect } from '@playwright/test';
import { loadData } from './helpers/data';
import { WEB_URL } from './helpers/env';
import { captureDialogs, clickAndWaitDialog } from './helpers/dialogs';

/**
 * {{FEATURE_ID_UPPER}} - {{FEATURE_TITLE}}
 * Oracle: the SRS (clause in each data row's `source`), NOT the behaviour the SUT has today.
 * A red test is a candidate bug; where the SRS is silent the row uses mode "clarify" (record, never judge).
 * Test data: data/{{FEATURE_ID}}-cases.json (never inline arrays/objects here).
 */
type Row = {
  id: string;
  title: string;
  mode: 'accept' | 'reject' | 'clarify';
  input: string;
  source: string;
  draft?: boolean; // scaffold rows: replace the TODOs, then delete this flag
};

const rows = loadData<Row[]>('{{FEATURE_ID}}-cases.json');

test.describe('{{FEATURE_ID_UPPER}} {{FEATURE_TITLE}}', () => {
  for (const row of rows) {
    test(`${row.id} ${row.title}`, async ({ page }) => {
      test.fixme(row.draft === true, 'scaffold row: replace data, selectors and expectations first');

      // ARRANGE - create state through the API (fresh throwaway account, seed data), not through the UI under test.
      await page.goto(WEB_URL);
      const dialogs = captureDialogs(page);

      // ACT - drive the UI like a user. Selectors: role / placeholder / visible text with `exact: true`;
      // never CSS classes or positions. If the page offers nothing stable, ask for a data-testid and note it in docs/review.
      await page.getByPlaceholder('TODO').fill(row.input);
      const message = await clickAndWaitDialog(dialogs, page.getByRole('button', { name: 'TODO', exact: true }));

      if (row.mode === 'clarify') {
        // The SRS does not define this behaviour: record what the SUT does, do not judge it.
        test.info().annotations.push({ type: 'CLARIFY', description: `${row.source}; message=${JSON.stringify(message)}` });
        return;
      }

      // ASSERT - use at least three different kinds of assertion across the suite:
      //   1. value equality   : read the stored result back through the API and compare it with the expected value
      //   2. UI state         : toBeVisible / toBeHidden / toHaveValue / toHaveText / toHaveURL
      //   3. condition        : expect.poll(() => ...).toBeGreaterThan(...) / toContain / not.toBe
      // Every branch must assert something; a green test with no assertion proves nothing.
      if (row.mode === 'accept') {
        expect(message, `${row.source}: valid input must be accepted`).toBe('TODO success message');
      } else {
        expect(message, `${row.source}: invalid input must be rejected`).not.toBe('TODO success message');
      }
    });
  }
});
