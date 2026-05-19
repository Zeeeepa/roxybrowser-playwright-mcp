import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pw = (...parts: string[]) => path.resolve(__dirname, 'playwright', ...parts);

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      'playwright-core/lib': pw('packages/playwright-core/src'),
      'playwright/lib':      pw('packages/playwright/src'),
      '@playwright':         pw('packages/playwright/src'),
      '@protocol':           pw('packages/protocol/src'),
      '@utils':              pw('packages/utils'),
      '@isomorphic':         pw('packages/isomorphic'),
      '@recorder':           pw('packages/recorder/src'),
      '@trace':              pw('packages/trace/src'),
    },
  },
});
