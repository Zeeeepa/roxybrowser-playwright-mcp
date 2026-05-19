import { describe, it, expect, vi, beforeEach } from 'vitest';
import { humanClick, humanHover } from '../../../src/human/mouse.js';
import type { Rect } from 'playwright-core/lib/client/types.js';

function makeMouse() {
  return {
    move: vi.fn().mockResolvedValue(undefined),
    down: vi.fn().mockResolvedValue(undefined),
    up:   vi.fn().mockResolvedValue(undefined),
    wheel: vi.fn().mockResolvedValue(undefined),
  };
}

const box: Rect = { x: 100, y: 200, width: 80, height: 40 };

describe('humanClick', () => {
  let mouse: ReturnType<typeof makeMouse>;

  beforeEach(() => { mouse = makeMouse(); });

  it('calls move, down, up in order', async () => {
    const order: string[] = [];
    mouse.move.mockImplementation(() => { order.push('move'); return Promise.resolve(); });
    mouse.down.mockImplementation(() => { order.push('down'); return Promise.resolve(); });
    mouse.up.mockImplementation  (() => { order.push('up');   return Promise.resolve(); });

    await humanClick(mouse as any, box);

    expect(order).toEqual(['move', 'down', 'up']);
  });

  it('moves to a point inside the box (with 10% margin)', async () => {
    await humanClick(mouse as any, box);

    const [x, y] = mouse.move.mock.calls[0] as [number, number, unknown];
    expect(x).toBeGreaterThanOrEqual(box.x + box.width  * 0.1);
    expect(x).toBeLessThanOrEqual   (box.x + box.width  * 0.9);
    expect(y).toBeGreaterThanOrEqual(box.y + box.height * 0.1);
    expect(y).toBeLessThanOrEqual   (box.y + box.height * 0.9);
  });

  it('passes steps option to move', async () => {
    await humanClick(mouse as any, box);
    const opts = mouse.move.mock.calls[0][2] as { steps: number };
    expect(opts.steps).toBeGreaterThanOrEqual(10);
    expect(opts.steps).toBeLessThanOrEqual(25);
  });
});

describe('humanHover', () => {
  let mouse: ReturnType<typeof makeMouse>;

  beforeEach(() => { mouse = makeMouse(); });

  it('calls move exactly once', async () => {
    await humanHover(mouse as any, box);
    expect(mouse.move).toHaveBeenCalledTimes(1);
  });

  it('does not call down or up', async () => {
    await humanHover(mouse as any, box);
    expect(mouse.down).not.toHaveBeenCalled();
    expect(mouse.up).not.toHaveBeenCalled();
  });

  it('moves to a point inside the box', async () => {
    await humanHover(mouse as any, box);
    const [x, y] = mouse.move.mock.calls[0] as [number, number, unknown];
    expect(x).toBeGreaterThanOrEqual(box.x + box.width  * 0.1);
    expect(x).toBeLessThanOrEqual   (box.x + box.width  * 0.9);
    expect(y).toBeGreaterThanOrEqual(box.y + box.height * 0.1);
    expect(y).toBeLessThanOrEqual   (box.y + box.height * 0.9);
  });
});
