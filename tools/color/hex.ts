export type Rgb = readonly [number, number, number];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

/** Parses `#rrggbb` into channels between 0 and 1. */
export function hexToRgb(hex: string): Rgb {
  if (!isHexColor(hex)) {
    throw new Error(`Invalid color: ${hex}`);
  }
  const channel = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16) / 255;
  return [channel(1), channel(3), channel(5)];
}

export function rgbToHex(rgb: Rgb): string {
  const channels = rgb.map((channel) => {
    const byte = Math.round(Math.min(1, Math.max(0, channel)) * 255);
    return byte.toString(16).padStart(2, '0');
  });
  return `#${channels.join('')}`;
}
