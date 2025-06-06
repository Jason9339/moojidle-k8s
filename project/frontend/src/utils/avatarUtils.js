/**
 * 頭像 URL 處理工具函數
 * 提供安全的頭像 URL 生成功能
 */

/**
 * 獲取安全的頭像 URL
 * @param {string} path - 頭像路徑
 * @returns {string} 處理後的安全 URL
 */
export const getAvatarUrl = (path) => {
    // 如果路徑為空或為預設路徑，返回預設頭像
    if (!path || path === '/user_pfp/default.png' || path.trim() === '') {
        return '/user_pfp/default.png';
    }
    
    // 如果已經是完整的 HTTP URL，直接返回
    if (path.startsWith('http')) {
        return path;
    }
    
    // 從路徑中提取檔案名稱
    const filename = path.split('/').pop();
    if (!filename) {
        return '/user_pfp/default.png';
    }
    
    // 返回安全的 API 端點 URL
    return `http://localhost:3000/user/avatar/${filename}`;
};

// /**
//  * 檢查是否為預設頭像
//  * @param {string} path - 頭像路徑
//  * @returns {boolean} 是否為預設頭像
//  */
// export const isDefaultAvatar = (path) => {
//     return !path || path === '/user_pfp/default.png' || path.trim() === '';
// };

// /**
//  * 從頭像路徑提取檔案名稱
//  * @param {string} path - 頭像路徑
//  * @returns {string|null} 檔案名稱，如果無效則返回 null
//  */
// export const extractAvatarFilename = (path) => {
//     if (!path || typeof path !== 'string') {
//         return null;
//     }
    
//     const filename = path.split('/').pop();
//     return filename || null;
// };
