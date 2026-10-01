import { contrastRatio, MIN_TEXT_CONTRAST, MIN_UI_CONTRAST } from '../color/contrast.ts';
import type { ContrastRequirement, ContrastResult, ThemeColors } from './types.ts';

export const CONTRAST_REQUIREMENTS: readonly ContrastRequirement[] = [
  { foreground: 'text', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'text-muted', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'link', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'accent', background: 'background', minimum: MIN_UI_CONTRAST },
  { foreground: 'success', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'warning', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'error', background: 'background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'selection-text', background: 'selection-background', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'text', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'syntax-keyword', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'syntax-string', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'syntax-number', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'syntax-function', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'syntax-comment', background: 'surface-1', minimum: MIN_TEXT_CONTRAST },
  { foreground: 'cursor', background: 'background', minimum: MIN_UI_CONTRAST },
];

export function auditContrast(
  colors: ThemeColors,
  requirements: readonly ContrastRequirement[] = CONTRAST_REQUIREMENTS,
): ContrastResult[] {
  return requirements.map((requirement) => {
    const ratio = contrastRatio(colors[requirement.foreground], colors[requirement.background]);
    return { ...requirement, ratio, passes: ratio >= requirement.minimum };
  });
}
