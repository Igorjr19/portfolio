export interface ContentRepository {
  readonly repo: string;
  readonly token: string;
  readonly ref?: string;
  readonly destination: string;
}

export function cloneArgs({ repo, token, ref, destination }: ContentRepository): string[] {
  const branch = ref ? ['--branch', ref] : [];
  return ['clone', '--depth', '1', ...branch, `https://x-access-token:${token}@github.com/${repo}.git`, destination];
}
