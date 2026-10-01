import type { Browser, Page } from '@astral/astral';
import { launchBrowser } from './browser.ts';
import { type StaticServer, serveSite } from './server.ts';

export type ColorScheme = 'light' | 'dark';

export interface PageOptions {
  readonly viewport?: { readonly width: number; readonly height: number };
  readonly colorScheme?: ColorScheme;
}

/** One browser and one static server shared by the steps of a test. */
export class Session implements AsyncDisposable {
  private constructor(
    private readonly browser: Browser,
    private readonly server: StaticServer,
  ) {}

  static async start(): Promise<Session> {
    return new Session(await launchBrowser(), serveSite());
  }

  async open(path: string, { viewport, colorScheme }: PageOptions = {}): Promise<Page> {
    const page = await this.browser.newPage();
    if (viewport) {
      await page.setViewportSize(viewport);
    }
    if (colorScheme) {
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: colorScheme }]);
    }
    await page.goto(`${this.server.url}${path}`, { waitUntil: 'load' });
    return page;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.browser.close();
    await this.server[Symbol.asyncDispose]();
  }
}
