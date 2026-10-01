/// <reference lib="dom" />
import { assertNotEquals } from '@std/assert';
import { HOME_EN } from './support/paths.ts';
import { Session } from './support/session.ts';

Deno.test('keyboard focus stays visible despite the WebTUI outline reset', async () => {
  await using session = await Session.start();
  const page = await session.open(HOME_EN);
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
  assertNotEquals(outline, 'none');
});
