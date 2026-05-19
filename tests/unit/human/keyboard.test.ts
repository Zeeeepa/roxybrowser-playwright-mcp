import { describe, it, expect, vi, beforeEach } from 'vitest';
import { humanType } from '../../../src/human/keyboard.js';

function makeKeyboard() {
  return {
    type:  vi.fn().mockResolvedValue(undefined),
    press: vi.fn().mockResolvedValue(undefined),
  };
}

describe('humanType', () => {
  let keyboard: ReturnType<typeof makeKeyboard>;

  beforeEach(() => { keyboard = makeKeyboard(); });

  it('types each character once (no typos)', async () => {
    await humanType(keyboard as any, 'hello', { typos: false, minDelay: 0, maxDelay: 0 });

    const typed = keyboard.type.mock.calls.map((c: unknown[]) => c[0]);
    expect(typed).toEqual(['h', 'e', 'l', 'l', 'o']);
    expect(keyboard.press).not.toHaveBeenCalled();
  });

  it('types empty string without error', async () => {
    await humanType(keyboard as any, '', { minDelay: 0, maxDelay: 0 });
    expect(keyboard.type).not.toHaveBeenCalled();
  });

  it('passes delay:0 to keyboard.type', async () => {
    await humanType(keyboard as any, 'ab', { minDelay: 0, maxDelay: 0 });
    for (const call of keyboard.type.mock.calls) {
      expect((call[1] as { delay: number }).delay).toBe(0);
    }
  });

  it('with typos enabled: may insert a Backspace for alphabetic chars', async () => {
    // Force Math.random to always trigger typo (< 0.05 threshold)
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.01);

    await humanType(keyboard as any, 'abc', { typos: true, minDelay: 0, maxDelay: 0 });

    // Each letter should have triggered a typo: type wrong char + Backspace + correct char
    const presses = keyboard.press.mock.calls.map((c: unknown[]) => c[0]);
    expect(presses.every((k: string) => k === 'Backspace')).toBe(true);
    // 3 typo chars + 3 real chars = 6 type() calls
    expect(keyboard.type).toHaveBeenCalledTimes(6);

    spy.mockRestore();
  });

  it('with typos disabled: never calls Backspace', async () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.01);

    await humanType(keyboard as any, 'abcdef', { typos: false, minDelay: 0, maxDelay: 0 });

    expect(keyboard.press).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('non-alpha chars are never typo-d even when typos enabled', async () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.01);

    await humanType(keyboard as any, '123!@#', { typos: true, minDelay: 0, maxDelay: 0 });

    expect(keyboard.press).not.toHaveBeenCalled();
    expect(keyboard.type).toHaveBeenCalledTimes(6);

    spy.mockRestore();
  });
});
