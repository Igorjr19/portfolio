import type { Palette, ResolvedTheme, RoleMap, ThemeManifest, Variant } from '../../../tools/themes/types.ts';

/** A synthetic palette: each key gets a distinct, easy-to-read color. */
export const palette: Palette = {
  black: '#000000',
  red: '#aa0000',
  green: '#00aa00',
  yellow: '#aaaa00',
  blue: '#0000aa',
  purple: '#aa00aa',
  cyan: '#00aaaa',
  white: '#aaaaaa',
  brightBlack: '#555555',
  brightRed: '#ff5555',
  brightGreen: '#55ff55',
  brightYellow: '#ffff55',
  brightBlue: '#5555ff',
  brightPurple: '#ff55ff',
  brightCyan: '#55ffff',
  brightWhite: '#ffffff',
  background: '#ffffff',
  foreground: '#000000',
  cursorColor: '#000000',
  selectionBackground: '#000000',
};

export const defaults: RoleMap = {
  background: 'background',
  text: 'foreground',
  'text-muted': 'brightBlack',
  accent: 'blue',
  link: '@accent',
  cursor: 'cursorColor',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  'selection-background': '@text',
  'selection-text': '@background',
  'syntax-keyword': 'purple',
  'syntax-string': 'green',
  'syntax-number': 'yellow',
  'syntax-function': 'blue',
  'syntax-comment': '@text-muted',
};

export function manifest(id: string, family: string, variant: Variant): ThemeManifest {
  return {
    id,
    name: id,
    family,
    variant,
    credit: { author: 'Test', license: 'MIT', url: 'https://example.com' },
    palette: { url: 'https://example.com/palette.json', sha256: '0'.repeat(64) },
    roles: {},
  };
}

export function resolvedTheme(id: string, family: string, variant: Variant, background: string): ResolvedTheme {
  const colors = Object.fromEntries(
    [...Object.keys(defaults), 'surface-1', 'surface-2', 'surface-3'].map((name) => [name, '#000000']),
  );
  return { manifest: manifest(id, family, variant), colors: { ...colors, background } } as ResolvedTheme;
}
