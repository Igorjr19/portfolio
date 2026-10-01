import type { ResolvedTheme, ThemeFamily } from './types.ts';

/** Groups themes by family; every family needs exactly one light and one dark variant. */
export function groupFamilies(themes: readonly ResolvedTheme[]): ThemeFamily[] {
  const variants = new Map<string, Partial<Record<'light' | 'dark', ResolvedTheme>>>();
  for (const theme of themes) {
    const { family, variant, id } = theme.manifest;
    const entry = variants.get(family) ?? {};
    if (entry[variant]) {
      throw new Error(`Family "${family}" has two ${variant} variants (${entry[variant].manifest.id}, ${id})`);
    }
    variants.set(family, { ...entry, [variant]: theme });
  }

  return [...variants].map(([name, { light, dark }]) => {
    if (!(light && dark)) {
      throw new Error(`Family "${name}" needs one light and one dark variant`);
    }
    return { name, light, dark };
  });
}
