import { defineConfig } from 'rolldown';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pw = (...parts) => path.resolve(__dirname, 'playwright', ...parts);

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  codeSplitting: false,
  external: [
    /^node:/,
    /\.node$/,
    // bare Node.js built-ins imported without the node: prefix (e.g. from CJS deps like pngjs)
    'assert', 'buffer', 'child_process', 'events', 'fs', 'path',
    'stream', 'util', 'vm', 'zlib', 'os', 'crypto', 'http', 'https',
    'net', 'tls', 'url', 'querystring', 'string_decoder', 'timers',
    'readline', 'worker_threads', 'perf_hooks', 'async_hooks',
    'playwright-core',
    'playwright',
  ],
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
