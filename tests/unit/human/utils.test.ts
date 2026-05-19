import { describe, it, expect } from 'vitest';
import { randInt, randFloat, sleep } from '../../../src/human/utils.js';

describe('randInt', () => {
  it('returns value within [min, max]', () => {
    for (let i = 0; i < 100; i++) {
      const v = randInt(3, 7);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(7);
    }
  });

  it('returns integer', () => {
    for (let i = 0; i < 50; i++) {
      expect(Number.isInteger(randInt(0, 100))).toBe(true);
    }
  });

  it('returns min when min === max', () => {
    expect(randInt(5, 5)).toBe(5);
  });
});

describe('randFloat', () => {
  it('returns value within [min, max)', () => {
    for (let i = 0; i < 100; i++) {
      const v = randFloat(1.0, 2.0);
      expect(v).toBeGreaterThanOrEqual(1.0);
      expect(v).toBeLessThan(2.0);
    }
  });
});

describe('sleep', () => {
  it('resolves after approximately the given ms', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });

  it('resolves immediately for 0ms', async () => {
    const start = Date.now();
    await sleep(0);
    expect(Date.now() - start).toBeLessThan(50);
  });
});
