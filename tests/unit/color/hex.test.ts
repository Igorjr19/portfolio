import { assertEquals, assertThrows } from '@std/assert';
import { hexToRgb, rgbToHex } from '../../../tools/color/hex.ts';

Deno.test('hexToRgb and rgbToHex round-trip a color', () => {
  assertEquals(rgbToHex(hexToRgb('#1e66f5')), '#1e66f5');
});

Deno.test('hexToRgb rejects shorthand and malformed colors', () => {
  assertThrows(() => hexToRgb('#fff'));
  assertThrows(() => hexToRgb('1e66f5'));
});

Deno.test('rgbToHex clamps out-of-gamut channels', () => {
  assertEquals(rgbToHex([1.2, -0.1, 0.5]), '#ff0080');
});
