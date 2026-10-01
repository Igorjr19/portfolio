import { containsExampleContent, isCheckedContentFile } from '../content/example.ts';
import { walkFiles } from '../shared/fs.ts';

const CONTENT_DIR = Deno.args[0] ?? 'content';
const allowExample = Deno.env.get('ALLOW_EXAMPLE_CONTENT') === '1';

const exampleFiles: string[] = [];
for await (const path of walkFiles(CONTENT_DIR)) {
  if (isCheckedContentFile(path) && containsExampleContent(await Deno.readTextFile(path))) {
    exampleFiles.push(path);
  }
}

if (exampleFiles.length > 0) {
  const list = exampleFiles
    .sort()
    .map((path) => `  - ${path}`)
    .join('\n');
  if (!allowExample) {
    console.error(`Example content found:\n${list}\nReplace it, or set ALLOW_EXAMPLE_CONTENT=1 for previews.`);
    Deno.exit(1);
  }
  console.warn(`${exampleFiles.length} example file(s) allowed by ALLOW_EXAMPLE_CONTENT=1:\n${list}`);
}
console.log('Content check passed.');
