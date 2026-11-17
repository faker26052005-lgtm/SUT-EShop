import { test, expect } from '@playwright/test';

/**
 * Demo for fix F1 (FR-13, tests/helpers/admin.ts). No browser and no SUT needed.
 * Run:  npx playwright test -c demo/playwright.demo.config.ts
 *
 * The three versions of digits() are copied here so the demo does not depend on the repo state.
 */
const digitsOld = (t: string) => Number((t.match(/\d/g) ?? []).join(''));
const digitsThrow = (t: string) => {
  const found = t.match(/\d/g);
  if (!found) throw new Error(`no digit found in ${JSON.stringify(t)}`);
  return Number(found.join(''));
};
const digitsNew = (t: string) => {
  const found = t.match(/\d/g);
  return found ? Number(found.join('')) : NaN;
};

// A revenue tile that shows "NaN" for the first 1.5 s (as if it was still loading / broken), then "200,000 ₫".
const makeTile = () => {
  const start = Date.now();
  return () => (Date.now() - start < 1500 ? 'NaN' : '200,000 ₫');
};

test('1. OLD digits(): a broken tile reads as 0, so "revenue did not change" passes with nothing read', async () => {
  const before = digitsOld('NaN');
  const after = digitsOld('NaN');
  console.log(`old: before=${before} after=${after} delta=${after - before}`);
  expect(after - before).toBe(0); // S02-S05 / S10 style check: PASSES although the tile was unreadable
});

test('2. NEW digits(): the same broken tile is NaN, so the same check can no longer pass', async () => {
  const before = digitsNew('NaN');
  const after = digitsNew('NaN');
  console.log(`new: before=${before} after=${after} delta=${after - before}`);
  expect(after - before).not.toBe(0); // NaN !== 0, so expect(...).toBe(0) in the real test would FAIL
  expect(Number.isNaN(after - before)).toBe(true);
});

test('3. THROWING version inside expect.poll: the poll stops at the first bad read (no retry)', async () => {
  test.fail(); // expected failure: this is the reason the throwing version was rejected
  const tile = makeTile();
  const t0 = Date.now();
  try {
    await expect.poll(() => digitsThrow(tile()), { timeout: 5000 }).toBe(200000);
  } finally {
    console.log(`throwing version ended after ${Date.now() - t0} ms (the tile became readable only after 1500 ms)`);
  }
});

test('4. NaN version inside expect.poll: the poll keeps retrying and passes once the tile is readable', async () => {
  const tile = makeTile();
  const t0 = Date.now();
  await expect.poll(() => digitsNew(tile()), { timeout: 5000 }).toBe(200000);
  console.log(`NaN version passed after ${Date.now() - t0} ms`);
});
