const TYPES = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'];
const MAX_HEADER_LENGTH = 72;
const HEADER = new RegExp(`^(${TYPES.join('|')})(\\([a-z0-9-]+\\))?!?: \\S`);
const FORBIDDEN_LINES = [
  { pattern: /^co-authored-by:/i, reason: 'Co-authored-by trailers are not allowed' },
  { pattern: /generated with/i, reason: '"Generated with" signatures are not allowed' },
];

/** Returns the problems found in a commit message; an empty list means it is valid. */
export function validateCommitMessage(message: string): string[] {
  const lines = message.split('\n').filter((line) => !line.startsWith('#'));
  const header = lines[0]?.trim() ?? '';
  const problems: string[] = [];

  if (!HEADER.test(header)) {
    problems.push(`Header must look like "type(scope): subject" with type one of: ${TYPES.join(', ')}`);
  }
  if (header.length > MAX_HEADER_LENGTH) {
    problems.push(`Header is ${header.length} characters; keep it within ${MAX_HEADER_LENGTH}`);
  }
  for (const { pattern, reason } of FORBIDDEN_LINES) {
    if (lines.some((line) => pattern.test(line.trim()))) {
      problems.push(reason);
    }
  }
  return problems;
}
