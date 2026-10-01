import { auditContrast } from '../themes/audit.ts';
import { groupFamilies } from '../themes/families.ts';
import { loadPalette, loadThemeDefaults, loadThemeManifests } from '../themes/load.ts';
import { renderThemeCss } from '../themes/render.ts';
import { resolveColors } from '../themes/resolve.ts';
import type { ContrastResult, ResolvedTheme } from '../themes/types.ts';

const DEFAULTS_PATH = 'data/theme-defaults.toml';
const THEMES_DIR = 'data/themes';
const CACHE_DIR = '.cache/palettes';
const OUTPUT_DIR = 'generated/css';
const OUTPUT_PATH = `${OUTPUT_DIR}/themes.css`;

function formatResult({ passes, ratio, minimum, foreground, background }: ContrastResult): string {
  const status = passes ? 'ok  ' : 'FAIL';
  return `  ${status} ${ratio.toFixed(2).padStart(5)}:1 (min ${minimum}) ${foreground} on ${background}`;
}

const defaults = await loadThemeDefaults(DEFAULTS_PATH);
const manifests = await loadThemeManifests(THEMES_DIR);

const themes: ResolvedTheme[] = [];
let failures = 0;
for (const manifest of manifests) {
  const palette = await loadPalette(manifest, CACHE_DIR);
  const colors = resolveColors(palette, defaults.roles, manifest.roles);
  const results = auditContrast(colors);
  failures += results.filter((result) => !result.passes).length;
  console.log([manifest.name, ...results.map(formatResult)].join('\n'));
  themes.push({ manifest, colors });
}

if (failures > 0) {
  console.error(`${failures} contrast check(s) failed.`);
  Deno.exit(1);
}

await Deno.mkdir(OUTPUT_DIR, { recursive: true });
await Deno.writeTextFile(OUTPUT_PATH, renderThemeCss(groupFamilies(themes), defaults.defaultFamily));
console.log(`Wrote ${OUTPUT_PATH} (${themes.length} themes).`);
