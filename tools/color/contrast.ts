import { hexToRgb } from './hex.ts';

/** WCAG 2 minimum for text. */
export const MIN_TEXT_CONTRAST = 4.5;
/** WCAG 2 minimum for non-text indicators such as focus rings and borders. */
export const MIN_UI_CONTRAST = 3;

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}
