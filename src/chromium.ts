import { playwright } from 'playwright-core/lib/inprocess.js';
import { RoxyBrowser } from './browser.js';
import type { Browser as PwBrowser } from 'playwright-core/lib/client/browser.js';

export interface ConnectOptions {
  slowMo?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export const chromium = {
  async connectOverCDP(endpoint: string, options?: ConnectOptions): Promise<RoxyBrowser> {
    if (!endpoint) {
      console.error('[roxybrowser] endpoint is required. Pass the CDP URL of a running Chrome instance, e.g. http://localhost:9222');
      return process.exit(1) as never;
    }

    const pwBrowser = await playwright.chromium.connectOverCDP(
      endpoint,
      {
        slowMo: options?.slowMo,
        timeout: options?.timeout,
        headers: options?.headers,
      }
    ) as unknown as PwBrowser;

    return new RoxyBrowser(pwBrowser);
  },
};
