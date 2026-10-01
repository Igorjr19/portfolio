import type { ResolvedTheme, ThemeFamily } from './types.ts';

const INDENT = '  ';

function declarations(theme: ResolvedTheme, depth: number): string {
  const pad = INDENT.repeat(depth);
  const scheme = `${pad}color-scheme: ${theme.manifest.variant};`;
  const colors = Object.entries(theme.colors).map(([name, value]) => `${pad}--color-${name}: ${value};`);
  return [scheme, ...colors].join('\n');
}

function rule(selector: string, theme: ResolvedTheme, depth: number): string {
  const pad = INDENT.repeat(depth);
  return `${pad}${selector} {\n${declarations(theme, depth + 1)}\n${pad}}`;
}

function followSystem(selector: string, family: ThemeFamily): string {
  return [
    rule(selector, family.light, 1),
    `${INDENT}@media (prefers-color-scheme: dark) {`,
    rule(selector, family.dark, 2),
    `${INDENT}}`,
  ].join('\n');
}

/**
 * Rules share the same specificity, so source order decides:
 * the default family follows the system, a chosen family follows the system,
 * and an explicitly chosen theme overrides the system.
 */
export function renderThemeCss(families: readonly ThemeFamily[], defaultFamily: string): string {
  const fallback = families.find((family) => family.name === defaultFamily);
  if (!fallback) {
    throw new Error(`Default family "${defaultFamily}" does not exist`);
  }
  const themes = families.flatMap((family) => [family.light, family.dark]);
  const blocks = [
    followSystem(':root', fallback),
    ...families.map((family) => followSystem(`[data-theme-family='${family.name}']`, family)),
    ...themes.map((theme) => rule(`[data-theme='${theme.manifest.id}']`, theme, 1)),
  ];
  return `@layer app.tokens {\n${blocks.join('\n\n')}\n}\n`;
}
