import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        hookTimeout: 20000,
        testTimeout: 15000,
        setupFiles: ['./tests/setup.js'],
        include: [
            'tests/**/*.{test,spec}.{js,jsx,ts,tsx}'
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
        },
        reporters: ['json', 'default'],
        outputFile: './test-output.json'
    },
    resolve: {
        alias: {
            '#src': path.resolve(process.cwd(), 'src')
        }
    }
}); 
