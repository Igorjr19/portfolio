import { mixOklab } from '../color/oklab.ts';
import {
  type Palette,
  type PaletteKey,
  ROLES,
  type Role,
  type RoleMap,
  type RoleOverrides,
  SURFACES,
  type Surface,
  type ThemeColors,
} from './types.ts';

function resolveRole(role: Role, map: RoleMap, palette: Palette, visiting: readonly Role[]): string {
  if (visiting.includes(role)) {
    throw new Error(`Role cycle: ${[...visiting, role].join(' -> ')}`);
  }
  const source = map[role];
  if (source.startsWith('@')) {
    return resolveRole(source.slice(1) as Role, map, palette, [...visiting, role]);
  }
  return palette[source as PaletteKey];
}

/** Maps every role to a palette color, following `@role` references, and derives the surfaces. */
export function resolveColors(palette: Palette, defaults: RoleMap, overrides: RoleOverrides): ThemeColors {
  const map: RoleMap = { ...defaults, ...overrides };
  const roleColors = Object.fromEntries(ROLES.map((role) => [role, resolveRole(role, map, palette, [])])) as Record<
    Role,
    string
  >;
  const surfaceColors = Object.fromEntries(
    Object.entries(SURFACES).map(([surface, amount]) => [
      surface,
      mixOklab(roleColors.background, roleColors.text, amount),
    ]),
  ) as Record<Surface, string>;
  return { ...roleColors, ...surfaceColors };
}
