export type FontStyle = 'normal' | 'italic';

export interface FontFamilyConfig {
  readonly name: string;
  readonly package: string;
  readonly weights: readonly number[];
  readonly styles: readonly FontStyle[];
}

export interface FontsManifest {
  readonly subsets: readonly string[];
  readonly families: readonly FontFamilyConfig[];
}

/** What the build needs from an installed Fontsource package. */
export interface FontPackage {
  readonly id: string;
  readonly unicodeRanges: Readonly<Record<string, string>>;
}

export interface FontFace {
  readonly family: string;
  readonly style: FontStyle;
  readonly weight: number;
  readonly unicodeRange: string;
  readonly packageName: string;
  /** File name inside the package `files/` directory. */
  readonly fileName: string;
  /** Path under the public fonts directory. */
  readonly relativePath: string;
}
