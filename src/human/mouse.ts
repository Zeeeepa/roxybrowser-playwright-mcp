import type { Mouse } from 'playwright-core/lib/client/input.js';
import type { Rect } from 'playwright-core/lib/client/types.js';
import { randFloat, randInt, sleep } from './utils.js';

function targetPoint(box: Rect): { x: number; y: number } {
  const margin = 0.1;
  return {
    x: box.x + box.width  * randFloat(margin, 1 - margin),
    y: box.y + box.height * randFloat(margin, 1 - margin),
  };
}

export async function humanClick(mouse: Mouse, box: Rect): Promise<void> {
  const { x, y } = targetPoint(box);
  await mouse.move(x, y, { steps: randInt(10, 25) });
  await sleep(randInt(50, 150));
  await mouse.down();
  await sleep(randInt(20, 60));
  await mouse.up();
}

export async function humanHover(mouse: Mouse, box: Rect): Promise<void> {
  const { x, y } = targetPoint(box);
  await mouse.move(x, y, { steps: randInt(15, 30) });
  await sleep(randInt(80, 200));
}
