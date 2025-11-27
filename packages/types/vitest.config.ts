import { defineConfig } from 'vitest/config';
import baseConfig from '../../vitest.config';

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    name: '@repo/types',
    coverage: {
      provider: 'v8',
      thresholds: {
        functions: 0, // Type-only package has no executable functions
        statements: 100,
        branches: 100,
        lines: 100,
      },
    },
  },
});
