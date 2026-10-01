import { pathExists } from './fs.ts';
import { sha256Hex } from './hash.ts';

export interface DownloadOptions {
  timeoutMs?: number;
  attempts?: number;
}

export interface VerifiedDownload {
  url: string;
  sha256: string;
  cachePath: string;
}

export async function fetchBytes(
  url: string,
  { timeoutMs = 10_000, attempts = 2 }: DownloadOptions = {},
): Promise<Uint8Array<ArrayBuffer>> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Failed to download ${url}: ${lastError}`);
}

/** Returns the cached file when present; downloads it otherwise. Both paths are checksum-verified. */
export async function fetchVerified(
  { url, sha256, cachePath }: VerifiedDownload,
  options?: DownloadOptions,
): Promise<Uint8Array<ArrayBuffer>> {
  const data = (await pathExists(cachePath)) ? await Deno.readFile(cachePath) : await fetchBytes(url, options);

  const actual = await sha256Hex(data);
  if (actual !== sha256) {
    throw new Error(`Checksum mismatch for ${url}: expected ${sha256}, got ${actual}`);
  }

  await Deno.mkdir(cachePath.slice(0, cachePath.lastIndexOf('/')), { recursive: true });
  await Deno.writeFile(cachePath, data);
  return data;
}
