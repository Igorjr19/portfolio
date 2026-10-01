import { assertEquals } from '@std/assert';
import { validateCommitMessage } from '../../../tools/git/commit-message.ts';

Deno.test('validateCommitMessage accepts Conventional Commits headers', () => {
  assertEquals(validateCommitMessage('feat: add theme picker'), []);
  assertEquals(validateCommitMessage('fix(themes)!: reject unknown roles\n\nBody text.'), []);
});

Deno.test('validateCommitMessage rejects headers without a known type', () => {
  assertEquals(validateCommitMessage('Add theme picker').length, 1);
  assertEquals(validateCommitMessage('feature: add theme picker').length, 1);
});

Deno.test('validateCommitMessage rejects co-author trailers and generated-with signatures', () => {
  assertEquals(validateCommitMessage('feat: x\n\nCo-Authored-By: Someone <a@b.c>').length, 1);
  assertEquals(validateCommitMessage('feat: x\n\nGenerated with some tool').length, 1);
});

Deno.test('validateCommitMessage ignores git comment lines', () => {
  assertEquals(validateCommitMessage('# Please enter the commit message\nfeat: x'), []);
});

Deno.test('validateCommitMessage rejects headers longer than 72 characters', () => {
  assertEquals(validateCommitMessage(`feat: ${'x'.repeat(70)}`).length, 1);
});
