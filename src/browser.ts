import type { Browser as PwBrowser } from 'playwright-core/lib/client/browser.js';
import type { BrowserContext as PwBrowserContext } from 'playwright-core/lib/client/browserContext.js';
import { RoxyContext } from './context.js';

export interface NewContextOptions {
  userAgent?: string;
  viewport?: { width: number; height: number } | null;
  locale?: string;
  timezoneId?: string;
  geolocation?: { longitude: number; latitude: number; accuracy?: number };
  permissions?: string[];
  extraHTTPHeaders?: Record<string, string>;
  ignoreHTTPSErrors?: boolean;
}

export class RoxyBrowser {
  readonly raw: PwBrowser;

  constructor(pwBrowser: PwBrowser) {
    this.raw = pwBrowser;
  }

  async newContext(options: NewContextOptions = {}): Promise<RoxyContext> {
    const pwContext = await this.raw.newContext(options) as PwBrowserContext;
    return new RoxyContext(pwContext);
  }

  contexts(): RoxyContext[] {
    return this.raw.contexts().map(ctx => new RoxyContext(ctx as PwBrowserContext));
  }

  isConnected(): boolean {
    return this.raw.isConnected();
  }

  async close(): Promise<void> {
    await this.raw.close();
  }
}
