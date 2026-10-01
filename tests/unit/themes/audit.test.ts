import { assertEquals } from '@std/assert';
import { auditContrast } from '../../../tools/themes/audit.ts';
import { resolveColors } from '../../../tools/themes/resolve.ts';
import { defaults, palette } from './fixtures.ts';

Deno.test('auditContrast flags text below 4.5:1 and passes the rest', () => {
  const colors = resolveColors({ ...palette, white: '#cccccc' }, defaults, { 'text-muted': 'white' });
  const results = auditContrast(colors, [
    { foreground: 'text', background: 'background', minimum: 4.5 },
    { foreground: 'text-muted', background: 'background', minimum: 4.5 },
  ]);
  assertEquals(
    results.map((result) => result.passes),
    [true, false],
  );
});
