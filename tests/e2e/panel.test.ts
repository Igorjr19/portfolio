/// <reference lib="dom" />
import { assertEquals } from '@std/assert';
import { HOME_EN, HOME_PT, POST_EN } from './support/paths.ts';
import { Session } from './support/session.ts';

Deno.test('panels are readable by assistive technology', async (t) => {
  await using session = await Session.start();

  for (const path of [HOME_EN, HOME_PT, POST_EN]) {
    await t.step(`${path}: borders are CSS, not box-drawing characters in the text`, async () => {
      const page = await session.open(path);
      const hasBoxDrawing = await page.evaluate(() => /[\u2500-\u259F]/.test(document.body.textContent ?? ''));
      assertEquals(hasBoxDrawing, false);
    });

    await t.step(`${path}: every panel title is a heading`, async () => {
      const page = await session.open(path);
      const untitled = await page.evaluate(
        () =>
          [...document.querySelectorAll('.panel')].filter(
            (panel) => !panel.querySelector(':scope > .panel__title:is(h1, h2, h3, h4, h5, h6)'),
          ).length,
      );
      assertEquals(untitled, 0);
    });
  }
});
