import { playwright } from 'playwright-core/lib/inprocess.js';
import { RoxyBrowser } from './browser.js';
import type { Browser as PwBrowser } from 'playwright-core/lib/client/browser.js';

export interface ChromiumOptions {
  cdpEndpoint: string;
  slowMo?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export async function chromium(options: ChromiumOptions): Promise<RoxyBrowser> {
  if (!options.cdpEndpoint) {
    console.error('[roxybrowser] cdpEndpoint is required. Pass the CDP URL of a running Chrome instance, e.g. http://localhost:9222');
    process.exit(1);
  }

  const pwBrowser = await playwright.chromium.connectOverCDP(
    options.cdpEndpoint,
    {
      slowMo: options.slowMo,
      timeout: options.timeout,
      headers: options.headers,
    }
  ) as unknown as PwBrowser;

  return new RoxyBrowser(pwBrowser);
}
