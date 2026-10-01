import { assertEquals, assertThrows } from '@std/assert';
import { planFontFaces } from '../../../tools/fonts/plan.ts';
import type { FontPackage, FontsManifest } from '../../../tools/fonts/types.ts';

const manifest: FontsManifest = {
  subsets: ['latin', 'latin-ext'],
  families: [{ name: 'Mono', package: '@fontsource/mono', weights: [400, 700], styles: ['normal'] }],
};
const packages = new Map<string, FontPackage>([
  ['@fontsource/mono', { id: 'mono', unicodeRanges: { latin: 'U+0000-00FF', 'latin-ext': 'U+0100-024F' } }],
]);

Deno.test('planFontFaces creates one face per weight, style and subset', () => {
  const faces = planFontFaces(manifest, packages);
  assertEquals(faces.length, 4);
  assertEquals(faces[0].relativePath, 'mono/mono-latin-400-normal.woff2');
  assertEquals(faces[0].unicodeRange, 'U+0000-00FF');
});

Deno.test('planFontFaces fails when a package lacks a requested subset', () => {
  assertThrows(() => planFontFaces({ ...manifest, subsets: ['greek'] }, packages), Error, 'no "greek" subset');
});

Deno.test('planFontFaces fails when a package is not installed', () => {
  assertThrows(() => planFontFaces(manifest, new Map()), Error, 'not installed');
});
