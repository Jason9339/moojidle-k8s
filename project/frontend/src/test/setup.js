import '@testing-library/jest-dom'
import axios from 'axios'

// 全局變數
const BACKEND_PORT = 3000
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`

// 全局測試設置
window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
}

// 設置測試環境變數
process.env.VITE_API_BASE_URL = BACKEND_URL
import.meta.env.VITE_API_BASE_URL = BACKEND_URL

// 等待後端服務器就緒 (簡化版，用於確認連接)
export async function waitForBackendReady(maxRetries = 30) {
    console.log('⏳ 確認後端服務器連接...')
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 1000 })
            if (response.status === 200) {
                console.log('✅ 後端服務器連接確認')
                return true
            }
        } catch (error) {
            // 服務器尚未就緒，繼續等待
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }
    
    throw new Error('無法連接到後端服務器')
}

// 重置後端資料庫
export async function resetBackendDatabase() {
    try {
        await axios.post(`${BACKEND_URL}/test/reset-database`, {}, { timeout: 5000 })
        console.log('🔄 後端資料庫已重置')
    } catch (error) {
        console.error('重置後端資料庫失敗:', error.message)
        throw error
    }
}

// 導出後端 URL 供測試使用
export { BACKEND_URL } 