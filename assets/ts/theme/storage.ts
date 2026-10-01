/// <reference lib="dom" />
export const THEME_STORAGE_KEY = 'theme';

export interface SavedTheme {
  /** Family whose light or dark variant follows the system preference. */
  readonly family?: string;
  /** Theme id that overrides the system preference. */
  readonly theme?: string;
}

export function readSavedTheme(storage: Storage): SavedTheme | null {
  const raw = storage.getItem(THEME_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  const value: unknown = JSON.parse(raw);
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const { family, theme } = value as Record<string, unknown>;
  return {
    family: typeof family === 'string' ? family : undefined,
    theme: typeof theme === 'string' ? theme : undefined,
  };
}

export function applySavedTheme(root: HTMLElement, saved: SavedTheme): void {
  if (saved.family) {
    root.dataset.themeFamily = saved.family;
  }
  if (saved.theme) {
    root.dataset.theme = saved.theme;
  }
}
