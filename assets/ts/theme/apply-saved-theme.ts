/// <reference lib="dom" />
import { applySavedTheme, readSavedTheme } from './storage.ts';

// Runs inline in <head> so the saved theme applies before the first paint.
try {
  const saved = readSavedTheme(localStorage);
  if (saved) {
    applySavedTheme(document.documentElement, saved);
  }
} catch {
  // Storage blocked or value corrupted: the system preference applies.
}
