import type { Mouse } from 'playwright-core/lib/client/input.js';
import { randFloat, randInt, sleep } from './utils.js';

export async function humanScroll(
  mouse: Mouse,
  _x: number,
  _y: number,
  totalDeltaY: number
): Promise<void> {
  const steps = randInt(5, 12);
  const baseStep = totalDeltaY / steps;

  for (let i = 0; i < steps; i++) {
    const jitter = randFloat(0.8, 1.2);
    await mouse.wheel(0, baseStep * jitter);
    await sleep(randInt(15, 40));
  }
}
