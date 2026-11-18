/**
 * Reads the number shown in a tile / cell: "6,200,000 ₫" (en-US) and "6.200.000 ₫" (vi-VN) both become 6200000,
 * so the locale of the browser does not matter. Text without any digit ("NaN", "-", "") returns NaN, NOT 0:
 * reading a broken tile as 0 would let every "value did not change" check pass.
 * NaN (not an exception) on purpose: inside expect.poll() a thrown error aborts the poll, a NaN just keeps polling.
 * Decimals are not supported: use a dedicated parser if the SUT shows fractions.
 */
export const digits = (text: string): number => {
  const found = text.match(/\d/g);
  return found ? Number(found.join('')) : NaN;
};

/** Money as the SUT formats it in the pinned test locale (playwright.config.ts: locale 'en-US'). */
export const money = (n: number): string => Number(n).toLocaleString('en-US');
