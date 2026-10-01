import { type Browser, launch } from '@astral/astral';
import { fetchVerified } from '../../../tools/shared/download.ts';
import { pathExists } from '../../../tools/shared/fs.ts';

// Astral's bundled Chromium (125) predates CSS round(); tests run on a pinned Chrome for Testing build.
const VERSION = '154.0.8037.92';
const SHA256 = '636aa5c79f2693632e9921b8bbb050038ba11672e02346c06c20f991aed096f9';
const URL = `https://storage.googleapis.com/chrome-for-testing-public/${VERSION}/linux64/chrome-headless-shell-linux64.zip`;
const DIR = `.cache/browser/${VERSION}`;
const ARCHIVE = `${DIR}.zip`;
const BINARY = `${DIR}/chrome-headless-shell-linux64/chrome-headless-shell`;

async function ensureBrowser(): Promise<string> {
  if (await pathExists(BINARY)) {
    return BINARY;
  }
  if (Deno.build.os !== 'linux' || Deno.build.arch !== 'x86_64') {
    throw new Error('The pinned test browser is only available for Linux x64');
  }
  await fetchVerified({ url: URL, sha256: SHA256, cachePath: ARCHIVE }, { timeoutMs: 120_000 });
  const { success } = await new Deno.Command('unzip', { args: ['-q', '-o', ARCHIVE, '-d', DIR] }).output();
  if (!success) {
    throw new Error('Could not extract the test browser; is unzip installed?');
  }
  return BINARY;
}

// Ubuntu 24.04 runners block the Chrome sandbox through AppArmor; CI only loads the local fixture site.
const CI_ARGS = Deno.env.get('CI') === 'true' ? ['--no-sandbox'] : [];

export async function launchBrowser(): Promise<Browser> {
  return launch({ path: await ensureBrowser(), args: CI_ARGS });
}
