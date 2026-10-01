import type { FontFace, FontPackage, FontsManifest } from './types.ts';

/** Lists one @font-face per family, weight, style and subset. */
export function planFontFaces(manifest: FontsManifest, packages: ReadonlyMap<string, FontPackage>): FontFace[] {
  return manifest.families.flatMap((family) => {
    const fontPackage = packages.get(family.package);
    if (!fontPackage) {
      throw new Error(`Package ${family.package} is not installed`);
    }
    return family.weights.flatMap((weight) =>
      family.styles.flatMap((style) =>
        manifest.subsets.map((subset) => {
          const unicodeRange = fontPackage.unicodeRanges[subset];
          if (!unicodeRange) {
            throw new Error(`${family.package} has no "${subset}" subset`);
          }
          const fileName = `${fontPackage.id}-${subset}-${weight}-${style}.woff2`;
          return {
            family: family.name,
            style,
            weight,
            unicodeRange,
            packageName: family.package,
            fileName,
            relativePath: `${fontPackage.id}/${fileName}`,
          };
        }),
      ),
    );
  });
}
