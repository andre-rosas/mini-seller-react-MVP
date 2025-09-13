import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'setup.js',
        '*.config.*',
        'dist/',
        'coverage/',
      ],
    },
    testTimeout: 10000,
  },
  build: {
    rollupOptions: {
      external: ['jest-axe', '@testing-library/jest-dom']
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: ['./tests/setup.js'],
//   },
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, './src'),
//     },
//   },
// });