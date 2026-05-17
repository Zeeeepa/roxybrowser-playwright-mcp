import type { BrowserContext as PwBrowserContext } from 'playwright-core/lib/client/browserContext.js';
import type { Page as PwPage } from 'playwright-core/lib/client/page.js';
import { RoxyPage } from './page.js';

export class RoxyContext {
  readonly raw: PwBrowserContext;

  constructor(pwContext: PwBrowserContext) {
    this.raw = pwContext;
  }

  async newPage(): Promise<RoxyPage> {
    const pwPage = await this.raw.newPage() as PwPage;
    return new RoxyPage(pwPage);
  }

  pages(): RoxyPage[] {
    return this.raw.pages().map(p => new RoxyPage(p as PwPage));
  }

  async close(): Promise<void> {
    await this.raw.close();
  }
}
