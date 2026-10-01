/// <reference lib="dom" />
import type { Page } from '@astral/astral';
import { assertEquals, assertNotEquals } from '@std/assert';
import { HOME_EN } from './support/paths.ts';
import { Session } from './support/session.ts';

function readTheme(page: Page) {
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return { scheme: root.colorScheme, background: root.getPropertyValue('--color-background').trim() };
  });
}

Deno.test('theme follows the system until the visitor chooses one', async (t) => {
  await using session = await Session.start();

  const light = await readTheme(await session.open(HOME_EN, { colorScheme: 'light' }));
  const dark = await readTheme(await session.open(HOME_EN, { colorScheme: 'dark' }));

  await t.step('system light and dark preferences select different variants', () => {
    assertEquals([light.scheme, dark.scheme], ['light', 'dark']);
    assertNotEquals(light.background, dark.background);
  });

  await t.step('a saved theme overrides the system preference', async () => {
    const page = await session.open(HOME_EN, { colorScheme: 'dark' });
    await page.evaluate(() =>
      localStorage.setItem('theme', JSON.stringify({ family: 'catppuccin', theme: 'catppuccin-latte' })),
    );
    await page.reload();
    assertEquals(await readTheme(page), light);
  });

  await t.step('a corrupted saved value falls back to the system preference', async () => {
    const page = await session.open(HOME_EN, { colorScheme: 'dark' });
    await page.evaluate(() => localStorage.setItem('theme', '{broken'));
    await page.reload();
    assertEquals(await readTheme(page), dark);
  });
});
