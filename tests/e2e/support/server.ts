import { serveDir } from '@std/http/file-server';

export interface StaticServer extends AsyncDisposable {
  readonly url: string;
}

/** Serves the Hugo output on a random local port. */
export function serveSite(root = 'public'): StaticServer {
  const server = Deno.serve({ port: 0, hostname: '127.0.0.1', onListen: () => undefined }, (request) =>
    serveDir(request, { fsRoot: root, quiet: true }),
  );
  return {
    url: `http://127.0.0.1:${server.addr.port}`,
    [Symbol.asyncDispose]: () => server.shutdown(),
  };
}
