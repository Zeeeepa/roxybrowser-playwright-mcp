import type { Keyboard } from 'playwright-core/lib/client/input.js';
import { randInt, sleep } from './utils.js';

const ADJACENT_KEYS: Record<string, string[]> = {
  a: ['s', 'q', 'w', 'z'],
  b: ['v', 'g', 'h', 'n'],
  c: ['x', 'd', 'f', 'v'],
  d: ['s', 'e', 'r', 'f', 'c', 'x'],
  e: ['w', 'r', 'd', 's'],
  f: ['d', 'r', 't', 'g', 'v', 'c'],
  g: ['f', 't', 'y', 'h', 'b', 'v'],
  h: ['g', 'y', 'u', 'j', 'n', 'b'],
  i: ['u', 'o', 'k', 'j'],
  j: ['h', 'u', 'i', 'k', 'm', 'n'],
  k: ['j', 'i', 'o', 'l', 'm'],
  l: ['k', 'o', 'p'],
  m: ['n', 'j', 'k'],
  n: ['b', 'h', 'j', 'm'],
  o: ['i', 'p', 'l', 'k'],
  p: ['o', 'l'],
  q: ['w', 'a'],
  r: ['e', 't', 'f', 'd'],
  s: ['a', 'w', 'e', 'd', 'x', 'z'],
  t: ['r', 'y', 'g', 'f'],
  u: ['y', 'i', 'j', 'h'],
  v: ['c', 'f', 'g', 'b'],
  w: ['q', 'e', 's', 'a'],
  x: ['z', 's', 'd', 'c'],
  y: ['t', 'u', 'h', 'g'],
  z: ['a', 's', 'x'],
};

function getAdjacentKey(char: string): string | null {
  const neighbors = ADJACENT_KEYS[char.toLowerCase()];
  if (!neighbors?.length) return null;
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

export interface TypeOptions {
  typos?: boolean;
  minDelay?: number;
  maxDelay?: number;
}

export async function humanType(
  keyboard: Keyboard,
  text: string,
  options: TypeOptions = {}
): Promise<void> {
  const minDelay = options.minDelay ?? 30;
  const maxDelay = options.maxDelay ?? 100;
  const typosEnabled = options.typos ?? false;

  for (const char of text) {
    if (typosEnabled && /[a-zA-Z]/.test(char) && Math.random() < 0.05) {
      const typoChar = getAdjacentKey(char);
      if (typoChar) {
        await keyboard.type(typoChar, { delay: 0 });
        await sleep(randInt(80, 200));
        await keyboard.press('Backspace');
        await sleep(randInt(50, 120));
      }
    }

    await keyboard.type(char, { delay: 0 });
    await sleep(randInt(minDelay, maxDelay));
  }
}
