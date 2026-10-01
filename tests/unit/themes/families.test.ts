import { assertEquals, assertThrows } from '@std/assert';
import { groupFamilies } from '../../../tools/themes/families.ts';
import { resolvedTheme } from './fixtures.ts';

Deno.test('groupFamilies pairs the light and dark variants of a family', () => {
  const [family] = groupFamilies([
    resolvedTheme('a-light', 'a', 'light', '#ffffff'),
    resolvedTheme('a-dark', 'a', 'dark', '#000000'),
  ]);
  assertEquals([family.name, family.light.manifest.id, family.dark.manifest.id], ['a', 'a-light', 'a-dark']);
});

Deno.test('groupFamilies rejects a family without both variants', () => {
  assertThrows(() => groupFamilies([resolvedTheme('a-light', 'a', 'light', '#ffffff')]), Error, 'needs one light');
});

Deno.test('groupFamilies rejects two themes with the same variant', () => {
  assertThrows(
    () =>
      groupFamilies([
        resolvedTheme('a-light', 'a', 'light', '#ffffff'),
        resolvedTheme('a-light-2', 'a', 'light', '#eeeeee'),
      ]),
    Error,
    'two light variants',
  );
});
