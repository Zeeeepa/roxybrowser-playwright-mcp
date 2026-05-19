import { describe, it, expect, vi, afterEach } from 'vitest';
import { chromium } from '../../src'

describe('chromium.connectOverCDP', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls process.exit(1) when endpoint is empty string', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await chromium.connectOverCDP('');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[roxybrowser]'));
  });
});
