import { assertEquals } from '@std/assert';
import { mixOklab } from '../../../tools/color/oklab.ts';

Deno.test('mixOklab returns the endpoints at 0 and 1', () => {
  assertEquals(mixOklab('#1e1e2e', '#cdd6f4', 0), '#1e1e2e');
  assertEquals(mixOklab('#1e1e2e', '#cdd6f4', 1), '#cdd6f4');
});

Deno.test('mixOklab matches browsers: color-mix(in oklab, black, white) is rgb(99, 99, 99)', () => {
  assertEquals(mixOklab('#000000', '#ffffff', 0.5), '#636363');
});
