// vite.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/rss-school/',
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/main.tsx',
        'src/types/**',
        'src/mocks/**',
        'src/utilities/storage.ts',
        'eslint.config.js',
        'vite.config.ts',
        'src/utilities/typeGuards.ts',
        'src/pages/NotFoundPage.tsx',
        'src/pages/AboutPage.tsx',
      ],
    },
  },
});
