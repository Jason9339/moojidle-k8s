import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000, // 增加超時時間，因為載入完整數據需要更多時間
    setupFiles: ['./tests/setup-real-db.js'], // 使用新的設置文件
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
      'tests/setup.js',
      'tests/setup-real-db.js'
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/', 
        'tests/setup.js', 
        'tests/setup-real-db.js',
        'tests/template.test.js'
      ]
    },
    // 序列執行測試以避免數據庫衝突
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  resolve: {
    alias: {
      '#src': path.resolve(process.cwd(), 'src')
    }
  }
}); 