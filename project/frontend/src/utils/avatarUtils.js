import { GetUserAvatar } from '@/services/UserApi.js';

/**
 * 頭像 URL 處理工具函數
 * 提供安全的頭像 URL 生成功能
 */

/**
 * 獲取頭像的 Blob URL
 * @param {string} path - 頭像路徑
 * @returns {Promise<string>} 處理後的 Blob URL
 */
export const getAvatarUrl = async (path) => {
    try {
        const response = await GetUserAvatar(path);
        const imageUrl = URL.createObjectURL(response);
        return imageUrl;
    } catch (error) {
        console.error('獲取頭像失敗:', error);
        // 返回預設頭像的 Blob URL
        try {
            const defaultResponse = await GetUserAvatar('/user_pfp/default.png');
            return URL.createObjectURL(defaultResponse);
        } catch (defaultError) {
            console.error('獲取預設頭像失敗:', defaultError);
            return '/user_pfp/default.png'; // 回退到靜態路徑
        }
    }
};

/**
 * 清理 Blob URL 以釋放記憶體
 * @param {string} blobUrl - 要清理的 Blob URL
 */
export const revokeBlobUrl = (blobUrl) => {
    if (blobUrl && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
    }
};