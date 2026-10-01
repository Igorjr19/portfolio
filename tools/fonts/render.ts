import type { FontFace } from './types.ts';

export function renderFontFaceCss(faces: readonly FontFace[], publicDir: string): string {
  const rules = faces.map((face) =>
    [
      '@font-face {',
      `  font-family: '${face.family}';`,
      `  font-style: ${face.style};`,
      `  font-weight: ${face.weight};`,
      '  font-display: swap;',
      `  src: url('${publicDir}/${face.relativePath}') format('woff2');`,
      `  unicode-range: ${face.unicodeRange};`,
      '}',
    ].join('\n'),
  );
  return `${rules.join('\n\n')}\n`;
}
