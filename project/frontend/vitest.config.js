import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    testTimeout: 30000, // 整合測試需要更長時間
    css: true,
    include: ['test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**'
    ],
    // 序列執行以避免後端服務器衝突
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    reporters: ['json', 'default'],
    outputFile: './test-output.json'

  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 
