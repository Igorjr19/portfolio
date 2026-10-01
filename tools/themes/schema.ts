import * as v from '@valibot/valibot';
import { isHexColor } from '../color/hex.ts';
import { PALETTE_KEYS, type Palette, ROLES, type RoleSource, type ThemeDefaults, type ThemeManifest } from './types.ts';

const paletteKeys: ReadonlySet<string> = new Set(PALETTE_KEYS);
const roles: ReadonlySet<string> = new Set(ROLES);

function isRoleSource(value: string): value is RoleSource {
  return value.startsWith('@') ? roles.has(value.slice(1)) : paletteKeys.has(value);
}

const RoleSourceSchema = v.custom<RoleSource>(
  (value: unknown) => typeof value === 'string' && isRoleSource(value),
  'Expected a palette key or "@" followed by a role',
);

const roleEntries = (schema: v.GenericSchema<RoleSource> | v.OptionalSchema<typeof RoleSourceSchema, undefined>) =>
  Object.fromEntries(ROLES.map((role) => [role, schema]));

const ThemeManifestSchema = v.strictObject({
  name: v.pipe(v.string(), v.nonEmpty()),
  family: v.pipe(v.string(), v.regex(/^[a-z0-9-]+$/)),
  variant: v.picklist(['light', 'dark']),
  credit: v.strictObject({
    author: v.pipe(v.string(), v.nonEmpty()),
    license: v.pipe(v.string(), v.nonEmpty()),
    url: v.pipe(v.string(), v.url()),
  }),
  palette: v.strictObject({
    url: v.pipe(v.string(), v.url()),
    sha256: v.pipe(v.string(), v.regex(/^[0-9a-f]{64}$/)),
  }),
  roles: v.optional(v.strictObject(roleEntries(v.optional(RoleSourceSchema))), {}),
});

const ThemeDefaultsSchema = v.strictObject({
  defaultFamily: v.pipe(v.string(), v.nonEmpty()),
  roles: v.strictObject(roleEntries(RoleSourceSchema)),
});

const HexColorSchema = v.pipe(v.string(), v.toLowerCase(), v.check(isHexColor, 'Expected a #rrggbb color'));

const PaletteSchema = v.object(Object.fromEntries(PALETTE_KEYS.map((key) => [key, HexColorSchema])));

function parseWith<T>(schema: v.GenericSchema<unknown, T>, input: unknown, context: string): T {
  const result = v.safeParse(schema, input);
  if (!result.success) {
    throw new Error(`${context}:\n${v.summarize(result.issues)}`);
  }
  return result.output;
}

export function parseThemeManifest(id: string, input: unknown): ThemeManifest {
  return { ...parseWith(ThemeManifestSchema, input, `Theme "${id}"`), id } as ThemeManifest;
}

export function parseThemeDefaults(input: unknown): ThemeDefaults {
  return parseWith(ThemeDefaultsSchema, input, 'Theme defaults') as ThemeDefaults;
}

export function parsePalette(input: unknown, context: string): Palette {
  return parseWith(PaletteSchema, input, context) as Palette;
}
