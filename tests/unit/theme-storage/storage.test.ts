import { assertEquals, assertThrows } from '@std/assert';
import { readSavedTheme, THEME_STORAGE_KEY } from '../../../assets/ts/theme/storage.ts';

function storageWith(value: string | null): Storage {
  const storage = new Map<string, string>();
  if (value !== null) {
    storage.set(THEME_STORAGE_KEY, value);
  }
  return { getItem: (key: string) => storage.get(key) ?? null } as Storage;
}

Deno.test('readSavedTheme returns null when nothing was saved', () => {
  assertEquals(readSavedTheme(storageWith(null)), null);
});

Deno.test('readSavedTheme keeps only string fields', () => {
  assertEquals(readSavedTheme(storageWith('{"family":"a","theme":3}')), { family: 'a', theme: undefined });
});

Deno.test('readSavedTheme throws on corrupted JSON so the caller can fall back', () => {
  assertThrows(() => readSavedTheme(storageWith('{broken')));
});
