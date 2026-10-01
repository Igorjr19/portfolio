import { parse } from '@std/toml';
import { planFontFaces } from '../fonts/plan.ts';
import { renderFontFaceCss } from '../fonts/render.ts';
import { parseFontPackage, parseFontsManifest } from '../fonts/schema.ts';
import type { FontPackage } from '../fonts/types.ts';

const MANIFEST_PATH = 'data/fonts.toml';
const PUBLIC_DIR = '/fonts';
const FONT_OUTPUT_DIR = 'generated/fonts';
const CSS_OUTPUT_DIR = 'generated/css';
const CSS_OUTPUT_PATH = `${CSS_OUTPUT_DIR}/fonts.css`;

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await Deno.readTextFile(path));
}

const manifest = parseFontsManifest(parse(await Deno.readTextFile(MANIFEST_PATH)));

const packages = new Map<string, FontPackage>();
for (const { package: name } of manifest.families) {
  const dir = `node_modules/${name}`;
  packages.set(
    name,
    parseFontPackage(await readJson(`${dir}/metadata.json`), await readJson(`${dir}/unicode.json`), name),
  );
}

const faces = planFontFaces(manifest, packages);
await Deno.remove(FONT_OUTPUT_DIR, { recursive: true }).catch(() => undefined);
for (const face of faces) {
  const target = `${FONT_OUTPUT_DIR}/${face.relativePath}`;
  await Deno.mkdir(target.slice(0, target.lastIndexOf('/')), { recursive: true });
  await Deno.copyFile(`node_modules/${face.packageName}/files/${face.fileName}`, target);
}

await Deno.mkdir(CSS_OUTPUT_DIR, { recursive: true });
await Deno.writeTextFile(CSS_OUTPUT_PATH, renderFontFaceCss(faces, PUBLIC_DIR));
console.log(`Wrote ${CSS_OUTPUT_PATH} and ${faces.length} font files.`);
