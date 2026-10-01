import { assertEquals, assertThrows } from '@std/assert';
import { parsePalette, parseThemeManifest } from '../../../tools/themes/schema.ts';
import { palette } from './fixtures.ts';

const valid = {
  name: 'Test',
  family: 'test',
  variant: 'dark',
  credit: { author: 'Test', license: 'MIT', url: 'https://example.com' },
  palette: { url: 'https://example.com/p.json', sha256: 'a'.repeat(64) },
  roles: { link: '@text' },
};

Deno.test('parseThemeManifest accepts a valid manifest and keeps the file id', () => {
  assertEquals(parseThemeManifest('test-dark', valid).id, 'test-dark');
});

Deno.test('parseThemeManifest rejects unknown roles, so typos fail the build', () => {
  assertThrows(() => parseThemeManifest('t', { ...valid, roles: { lnk: '@text' } }));
});

Deno.test('parseThemeManifest rejects role sources that are neither palette keys nor @roles', () => {
  assertThrows(() => parseThemeManifest('t', { ...valid, roles: { link: 'blu' } }));
  assertThrows(() => parseThemeManifest('t', { ...valid, roles: { link: '@txt' } }));
});

Deno.test('parsePalette lowercases colors and rejects missing keys', () => {
  assertEquals(parsePalette({ ...palette, red: '#AA0000' }, 'p').red, '#aa0000');
  const { red: _red, ...withoutRed } = palette;
  assertThrows(() => parsePalette(withoutRed, 'p'));
});
