import { parse } from '@std/toml';
import { fetchVerified } from '../shared/download.ts';
import { parsePalette, parseThemeDefaults, parseThemeManifest } from './schema.ts';
import type { Palette, ThemeDefaults, ThemeManifest } from './types.ts';

export async function loadThemeDefaults(path: string): Promise<ThemeDefaults> {
  return parseThemeDefaults(parse(await Deno.readTextFile(path)));
}

export async function loadThemeManifests(dir: string): Promise<ThemeManifest[]> {
  const manifests: ThemeManifest[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isFile && entry.name.endsWith('.toml')) {
      const id = entry.name.slice(0, -'.toml'.length);
      manifests.push(parseThemeManifest(id, parse(await Deno.readTextFile(`${dir}/${entry.name}`))));
    }
  }
  return manifests.sort((a, b) => a.id.localeCompare(b.id));
}

export async function loadPalette(manifest: ThemeManifest, cacheDir: string): Promise<Palette> {
  const data = await fetchVerified({
    url: manifest.palette.url,
    sha256: manifest.palette.sha256,
    cachePath: `${cacheDir}/${manifest.palette.sha256}.json`,
  });
  return parsePalette(JSON.parse(new TextDecoder().decode(data)), `Palette of "${manifest.id}"`);
}
