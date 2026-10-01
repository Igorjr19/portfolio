import { cloneArgs } from '../content/repository.ts';
import { pathExists } from '../shared/fs.ts';

const DESTINATION = 'content';

if (await pathExists(DESTINATION)) {
  console.log(`Using existing ${DESTINATION}/.`);
  Deno.exit(0);
}

const repo = Deno.env.get('CONTENT_REPO');
const token = Deno.env.get('CONTENT_TOKEN');
if (!(repo && token)) {
  console.error(`${DESTINATION}/ is missing; set CONTENT_REPO and CONTENT_TOKEN to download it.`);
  Deno.exit(1);
}

const args = cloneArgs({ repo, token, ref: Deno.env.get('CONTENT_REF'), destination: DESTINATION });
// Git output is discarded so the token never reaches the logs.
const { success } = await new Deno.Command('git', { args, stdout: 'null', stderr: 'null' }).output();
if (!success) {
  console.error(`Could not clone ${repo}. Check the token and the repository name.`);
  Deno.exit(1);
}
console.log(`Cloned ${repo}.`);
