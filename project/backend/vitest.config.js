import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 15000,
    setupFiles: ['./tests/setup.js'],
    include: [
      'tests/services/*.test.js',
      'tests/controllers/*.test.js', 
      'tests/routes/*.test.js'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'tests/template.test.js',
      'tests/setup.js'
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/setup.js', 'tests/template.test.js']
    }
  },
  resolve: {
    alias: {
      '#src': path.resolve(process.cwd(), 'src')
    }
  }
}); 