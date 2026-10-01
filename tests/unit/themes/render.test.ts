import { assert, assertThrows } from '@std/assert';
import { groupFamilies } from '../../../tools/themes/families.ts';
import { renderThemeCss } from '../../../tools/themes/render.ts';
import { resolvedTheme } from './fixtures.ts';

const families = groupFamilies([
  resolvedTheme('a-light', 'a', 'light', '#ffffff'),
  resolvedTheme('a-dark', 'a', 'dark', '#000000'),
]);

Deno.test('renderThemeCss puts the explicit theme rules after the system-following rules', () => {
  const css = renderThemeCss(families, 'a');
  const root = css.indexOf(':root');
  const family = css.indexOf("[data-theme-family='a']");
  const explicit = css.indexOf("[data-theme='a-light']");
  assert(root < family && family < explicit, 'source order decides between equal-specificity rules');
});

Deno.test('renderThemeCss switches to the dark variant inside prefers-color-scheme: dark', () => {
  const css = renderThemeCss(families, 'a');
  const media = css.indexOf('@media (prefers-color-scheme: dark)');
  assert(media > 0 && css.indexOf('--color-background: #000000', media) > media);
});

Deno.test('renderThemeCss rejects an unknown default family', () => {
  assertThrows(() => renderThemeCss(families, 'missing'), Error, 'does not exist');
});
