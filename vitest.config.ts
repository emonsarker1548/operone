import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Use single fork to minimize worker issues
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'dist-electron/**',
        '.next/**',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**',
        'e2e/**',
        'tests/e2e/**',
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'dist-electron/**',
      '.next/**',
      'e2e/**',
      'tests/e2e/**',
    ],
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@repo/types': path.resolve(__dirname, './packages/types/src'),
      '@repo/mcp-tools': path.resolve(__dirname, './packages/mcp/src'),
      '@repo/operone': path.resolve(__dirname, './packages/operone/src'),
    },
  },
});
