import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/** Collects native alert/confirm/prompt messages. `action` decides what happens to the box (accept = OK, dismiss = Cancel). */
export function captureDialogs(page: Page, action: 'accept' | 'dismiss' = 'accept'): string[] {
  const messages: string[] = [];
  page.on('dialog', async (dialog) => {
    messages.push(dialog.message());
    if (action === 'accept') await dialog.accept();
    else await dialog.dismiss();
  });
  return messages;
}

/**
 * Clicks, then returns the dialog text that THIS click caused (null if none appeared within `ms`).
 * The position in the message list is remembered BEFORE the click: an alert raised by the page's own JavaScript
 * appears while the click is still running, so looking for "a new alert" only after the click would miss it
 * (false failures that depend on the browser).
 */
export async function clickAndWaitDialog(messages: string[], target: Locator, ms = 4_000): Promise<string | null> {
  const mark = messages.length;
  await target.click();
  try {
    await expect.poll(() => messages.length, { timeout: ms }).toBeGreaterThan(mark);
  } catch {
    return null;
  }
  return messages[mark];
}
