import '@testing-library/jest-dom'
import api from "@/ApiClient.js"

// 等待後端服務器就緒 (簡化版，用於確認連接)
export async function WaitForBackendReady(maxRetries = 30) {
    console.log('⏳ 確認後端服務器連接...')
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await api.get(`/health`, { timeout: 1000 })
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
export async function ResetBackendDatabase() {
    try {
        await api.post(`/test/reset-database`, {}, { timeout: 5000 })
        console.log('🔄 後端資料庫已重置')
    } catch (error) {
        console.error('重置後端資料庫失敗:', error.message)
        throw error
    }
}
