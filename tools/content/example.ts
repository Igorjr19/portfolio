const EXAMPLE_FLAG = /^example:\s*true\s*$/m;
const EXAMPLE_MARKER = '[EXAMPLE]';
const CHECKED_FILE = /\.(md|ya?ml)$/;

/** Example content is fake data for development and must never reach production. */
export function containsExampleContent(text: string): boolean {
  return EXAMPLE_FLAG.test(text) || text.includes(EXAMPLE_MARKER);
}

export function isCheckedContentFile(path: string): boolean {
  return CHECKED_FILE.test(path) && !path.endsWith('README.md');
}
