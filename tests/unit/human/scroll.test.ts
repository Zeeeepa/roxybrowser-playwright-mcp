import { describe, it, expect, vi, beforeEach } from 'vitest';
import { humanScroll } from '../../../src/human/scroll.js';

function makeMouse() {
  return {
    move:  vi.fn().mockResolvedValue(undefined),
    wheel: vi.fn().mockResolvedValue(undefined),
  };
}

describe('humanScroll', () => {
  let mouse: ReturnType<typeof makeMouse>;

  beforeEach(() => { mouse = makeMouse(); });

  it('calls wheel multiple times (5–12 steps)', async () => {
    await humanScroll(mouse as any, 0, 0, 300);
    const calls = mouse.wheel.mock.calls.length;
    expect(calls).toBeGreaterThanOrEqual(5);
    expect(calls).toBeLessThanOrEqual(12);
  });

  it('always passes 0 as deltaX', async () => {
    await humanScroll(mouse as any, 0, 0, 200);
    for (const call of mouse.wheel.mock.calls) {
      expect(call[0]).toBe(0);
    }
  });

  it('total deltaY is approximately the requested amount (within 30%)', async () => {
    const target = 500;
    await humanScroll(mouse as any, 0, 0, target);
    const total = mouse.wheel.mock.calls.reduce((sum: number, c: unknown[]) => sum + (c[1] as number), 0);
    expect(total).toBeGreaterThan(target * 0.7);
    expect(total).toBeLessThan(target * 1.3);
  });

  it('works with negative deltaY (scroll up)', async () => {
    await humanScroll(mouse as any, 0, 0, -300);
    const total = mouse.wheel.mock.calls.reduce((sum: number, c: unknown[]) => sum + (c[1] as number), 0);
    expect(total).toBeLessThan(0);
  });
});
