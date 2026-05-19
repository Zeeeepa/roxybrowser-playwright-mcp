import type { Page as PwPage } from 'playwright-core/lib/client/page.js';
import type { Rect } from 'playwright-core/lib/client/types.js';
import { humanClick, humanHover } from './human/mouse.js';
import { humanType } from './human/keyboard.js';
import { humanScroll } from './human/scroll.js';
import { sleep, randInt } from './human/utils.js';

export type { TypeOptions } from './human/keyboard.js';

export interface ScrollTarget {
  selector?: string;
  x?: number;
  y?: number;
}

export class RoxyPage {
  readonly raw: PwPage;

  constructor(pwPage: PwPage) {
    this.raw = pwPage;
  }

  private async _getBoundingBox(selector: string): Promise<Rect> {
    const locator = this.raw.locator(selector);
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    if (!box) throw new Error(`Element not found or not visible: ${selector}`);
    return box;
  }

  async click(selector: string): Promise<void> {
    const box = await this._getBoundingBox(selector);
    await humanClick(this.raw.mouse, box);
  }

  async hover(selector: string): Promise<void> {
    const box = await this._getBoundingBox(selector);
    await humanHover(this.raw.mouse, box);
  }

  async type(selector: string, text: string, options: import('./human/keyboard.js').TypeOptions = {}): Promise<void> {
    await this.click(selector);
    await humanType(this.raw.keyboard, text, options);
  }

  async fill(selector: string, value: string, options: import('./human/keyboard.js').TypeOptions = {}): Promise<void> {
    await this.click(selector);
    const selectAll = process.platform === 'darwin' ? 'Meta+a' : 'Control+a';
    await this.raw.keyboard.press(selectAll);
    await this.raw.keyboard.press('Delete');
    await sleep(randInt(50, 100));
    await humanType(this.raw.keyboard, value, options);
  }

  async scroll(target: string | ScrollTarget, deltaY: number): Promise<void> {
    let x: number;
    let y: number;

    if (typeof target === 'string') {
      const box = await this._getBoundingBox(target);
      x = box.x + box.width / 2;
      y = box.y + box.height / 2;
    } else if (target.selector) {
      const box = await this._getBoundingBox(target.selector);
      x = box.x + box.width / 2;
      y = box.y + box.height / 2;
    } else {
      x = target.x ?? 0;
      y = target.y ?? 0;
    }

    await this.raw.mouse.move(x, y);
    await humanScroll(this.raw.mouse, x, y, deltaY);
  }

  async goto(url: string): Promise<void> {
    await sleep(randInt(100, 400));
    await this.raw.goto(url, { waitUntil: 'domcontentloaded' });
  }

  url(): string {
    return this.raw.url();
  }

  async title(): Promise<string> {
    return this.raw.title();
  }

  async screenshot(options?: Parameters<PwPage['screenshot']>[0]): Promise<Buffer> {
    return this.raw.screenshot(options);
  }

  async close(): Promise<void> {
    await this.raw.close();
  }
}
