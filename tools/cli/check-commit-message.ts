import { validateCommitMessage } from '../git/commit-message.ts';

const [path] = Deno.args;
if (!path) {
  console.error('Usage: check-commit-message.ts <commit message file>');
  Deno.exit(2);
}

const problems = validateCommitMessage(await Deno.readTextFile(path));
if (problems.length > 0) {
  console.error(problems.map((problem) => `- ${problem}`).join('\n'));
  Deno.exit(1);
}
