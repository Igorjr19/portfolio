/// <reference lib="dom" />
import { assert, assertAlmostEquals, assertEquals } from '@std/assert';
import { HOME_EN, POST_EN } from './support/paths.ts';
import { Session } from './support/session.ts';

const MONO_COLUMNS_FOR_TWO_PANELS = 80;

Deno.test('layout snaps to a grid of monospace cells', async (t) => {
  await using session = await Session.start();

  for (const width of [360, 700, 800, 1280]) {
    await t.step(`${width}px: one column below 80 cells, two from there, widths on the cell grid`, async () => {
      const page = await session.open(HOME_EN, { viewport: { width, height: 800 } });
      const layout = await page.evaluate(async () => {
        await document.fonts.load(`${getComputedStyle(document.body).fontSize} 'Fira Code'`);
        const grid = document.querySelector('.grid') as Element;
        return {
          cell: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cell-width')),
          body: document.body.getBoundingClientRect().width,
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          panelWidths: [...grid.children].map((panel) => panel.getBoundingClientRect().width),
        };
      });
      assertEquals(layout.columns, layout.body >= MONO_COLUMNS_FOR_TWO_PANELS * layout.cell ? 2 : 1);
      for (const panelWidth of layout.panelWidths) {
        const cells = panelWidth / layout.cell;
        assert(Math.abs(cells - Math.round(cells)) < 0.01, `${panelWidth}px is not a whole number of cells`);
      }
    });
  }

  await t.step('prose in Fira Sans keeps the cell size measured with Fira Code', async () => {
    const page = await session.open(POST_EN);
    const sizes = await page.evaluate(async () => {
      const rootStyle = getComputedStyle(document.documentElement);
      await document.fonts.load(`${rootStyle.fontSize} 'Fira Code'`);
      await document.fonts.load(`${rootStyle.fontSize} 'Fira Sans'`);
      const paragraph = document.querySelector('.prose p') as Element;

      const ruler = document.createElement('span');
      ruler.style.cssText = `position: absolute; white-space: nowrap; font: ${rootStyle.fontSize} 'Fira Code'`;
      ruler.textContent = '0'.repeat(100);
      document.body.append(ruler);
      const glyphWidth = ruler.getBoundingClientRect().width / 100;
      ruler.remove();

      return {
        rootCell: Number.parseFloat(rootStyle.getPropertyValue('--cell-width')),
        proseCell: Number.parseFloat(getComputedStyle(paragraph).getPropertyValue('--cell-width')),
        proseFont: getComputedStyle(paragraph).fontFamily,
        glyphWidth,
      };
    });
    assert(sizes.proseFont.includes('Fira Sans'));
    assertEquals(sizes.proseCell, sizes.rootCell);
    assertAlmostEquals(sizes.rootCell, sizes.glyphWidth, 0.01);
  });
});
