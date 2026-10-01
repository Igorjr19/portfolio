import { assertEquals } from '@std/assert';
import { cloneArgs } from '../../../tools/content/repository.ts';

Deno.test('cloneArgs makes a shallow clone and pins the ref when given', () => {
  const args = cloneArgs({ repo: 'owner/repo', token: 't', ref: 'v1', destination: 'content' });
  assertEquals(args.slice(0, 5), ['clone', '--depth', '1', '--branch', 'v1']);
  assertEquals(args.at(-1), 'content');
});

Deno.test('cloneArgs omits --branch without a ref', () => {
  assertEquals(cloneArgs({ repo: 'owner/repo', token: 't', destination: 'content' }).includes('--branch'), false);
});
