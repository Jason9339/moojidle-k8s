import '@testing-library/jest-dom'
import { spawn } from 'child_process'
import axios from 'axios'

// 全局變數
let backendServer = null
const BACKEND_PORT = 3000
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`

// 全局測試設置
window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
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
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 設置測試環境變數
process.env.VITE_API_BASE_URL = BACKEND_URL
import.meta.env.VITE_API_BASE_URL = BACKEND_URL

// 全局設置：啟動後端服務器
export async function setupBackendServer() {
  console.log('🚀 啟動後端測試服務器...')
  
  return new Promise((resolve, reject) => {
    // 啟動後端服務器（使用測試模式）
    backendServer = spawn('npm', ['run', 'test:server'], {
      cwd: '../backend',
      env: {
        ...process.env,
        NODE_ENV: 'integration-test',
        PORT: BACKEND_PORT.toString(),
        USE_MEMORY_DB: 'true'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let serverReady = false
    const timeout = setTimeout(() => {
      if (!serverReady) {
        reject(new Error('後端服務器啟動超時'))
      }
    }, 30000)

    // 監聽後端輸出
    backendServer.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('後端輸出:', output)
      
      // 檢查服務器是否已啟動
      if (output.includes('整合測試環境準備完成') || output.includes('Server running')) {
        serverReady = true
        clearTimeout(timeout)
        console.log('✅ 後端服務器啟動成功')
        resolve()
      }
    })

    backendServer.stderr.on('data', (data) => {
      console.error('後端錯誤:', data.toString())
    })

    backendServer.on('error', (error) => {
      clearTimeout(timeout)
      reject(new Error(`後端服務器啟動失敗: ${error.message}`))
    })

    backendServer.on('exit', (code) => {
      if (code !== 0 && !serverReady) {
        clearTimeout(timeout)
        reject(new Error(`後端服務器異常退出，代碼: ${code}`))
      }
    })
  })
}

// 全局清理：關閉後端服務器
export async function teardownBackendServer() {
  if (backendServer) {
    console.log('🧹 關閉後端測試服務器...')
    backendServer.kill('SIGTERM')
    
    // 等待服務器關閉
    await new Promise((resolve) => {
      backendServer.on('exit', () => {
        console.log('✅ 後端服務器已關閉')
        resolve()
      })
      
      // 強制關閉
      setTimeout(() => {
        if (backendServer) {
          backendServer.kill('SIGKILL')
          resolve()
        }
      }, 5000)
    })
    
    backendServer = null
  }
}

// 等待後端服務器就緒
export async function waitForBackendReady(maxRetries = 30) {
  console.log('⏳ 等待後端服務器就緒...')
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 1000 })
      if (response.status === 200) {
        console.log('✅ 後端服務器已就緒')
        return true
      }
    } catch (error) {
      // 服務器尚未就緒，繼續等待
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  throw new Error('等待後端服務器就緒超時')
}

// 重置後端資料庫
export async function resetBackendDatabase() {
  try {
    await axios.post(`${BACKEND_URL}/test/reset-database`, {}, { timeout: 5000 })
    console.log('🔄 後端資料庫已重置')
  } catch (error) {
    console.error('重置後端資料庫失敗:', error.message)
  }
}

// 導出後端 URL 供測試使用
export { BACKEND_URL } 