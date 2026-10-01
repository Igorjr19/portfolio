import { assertAlmostEquals } from '@std/assert';
import { contrastRatio } from '../../../tools/color/contrast.ts';

Deno.test('contrastRatio: black on white is the WCAG maximum of 21:1', () => {
  assertAlmostEquals(contrastRatio('#000000', '#ffffff'), 21, 0.01);
});

Deno.test('contrastRatio: argument order does not matter', () => {
  assertAlmostEquals(contrastRatio('#1e1e2e', '#cdd6f4'), contrastRatio('#cdd6f4', '#1e1e2e'), 1e-9);
});

Deno.test('contrastRatio: #767676 on white is the lightest gray that passes 4.5:1', () => {
  assertAlmostEquals(contrastRatio('#767676', '#ffffff'), 4.54, 0.01);
});
