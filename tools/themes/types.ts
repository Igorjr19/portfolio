export const PALETTE_KEYS = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'purple',
  'cyan',
  'white',
  'brightBlack',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightPurple',
  'brightCyan',
  'brightWhite',
  'background',
  'foreground',
  'cursorColor',
  'selectionBackground',
] as const;

export type PaletteKey = (typeof PALETTE_KEYS)[number];
export type Palette = Readonly<Record<PaletteKey, string>>;

export const ROLES = [
  'background',
  'text',
  'text-muted',
  'accent',
  'link',
  'cursor',
  'success',
  'warning',
  'error',
  'selection-background',
  'selection-text',
  'syntax-keyword',
  'syntax-string',
  'syntax-number',
  'syntax-function',
  'syntax-comment',
] as const;

export type Role = (typeof ROLES)[number];

/** Surfaces are the background pulled towards the text color by the given amount. */
export const SURFACES = {
  'surface-1': 0.08,
  'surface-2': 0.16,
  'surface-3': 0.24,
} as const;

export type Surface = keyof typeof SURFACES;
export type ColorName = Role | Surface;
export type ThemeColors = Readonly<Record<ColorName, string>>;

/** A palette key, or another role prefixed with `@`. */
export type RoleSource = PaletteKey | `@${Role}`;
export type RoleMap = Readonly<Record<Role, RoleSource>>;
export type RoleOverrides = Readonly<Partial<Record<Role, RoleSource>>>;

export type Variant = 'light' | 'dark';

export interface ThemeManifest {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly variant: Variant;
  readonly credit: { readonly author: string; readonly license: string; readonly url: string };
  readonly palette: { readonly url: string; readonly sha256: string };
  readonly roles: RoleOverrides;
}

export interface ThemeDefaults {
  readonly defaultFamily: string;
  readonly roles: RoleMap;
}

export interface ResolvedTheme {
  readonly manifest: ThemeManifest;
  readonly colors: ThemeColors;
}

export interface ThemeFamily {
  readonly name: string;
  readonly light: ResolvedTheme;
  readonly dark: ResolvedTheme;
}

export interface ContrastRequirement {
  readonly foreground: ColorName;
  readonly background: ColorName;
  readonly minimum: number;
}

export interface ContrastResult extends ContrastRequirement {
  readonly ratio: number;
  readonly passes: boolean;
}
