/**
 * 檔案驗證工具函數
 * 用於 Assignment 和 Submitted Assignment 的檔案大小檢查
 */

// 檔案大小限制：5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * 檢查單個檔案是否超過大小限制
 * @param {File} file - 要檢查的檔案
 * @param {number} maxSize - 最大檔案大小（bytes），預設為 5MB
 * @returns {Object} - { isValid: boolean, message: string, fileSize: number }
 */
export const validateFileSize = (file, maxSize = MAX_FILE_SIZE) => {
    if (!file) {
        return {
            isValid: false,
            message: "檔案不存在",
            fileSize: 0
        };
    }

    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(1);

    if (file.size > maxSize) {
        return {
            isValid: false,
            message: `檔案 "${file.name}" 大小為 ${fileSizeInMB}MB，超過 ${maxSizeInMB}MB 限制`,
            fileSize: file.size
        };
    }

    return {
        isValid: true,
        message: `檔案 "${file.name}" 大小檢查通過 (${fileSizeInMB}MB)`,
        fileSize: file.size
    };
};

/**
 * 檢查多個檔案是否都符合大小限制
 * @param {File[]} files - 要檢查的檔案陣列
 * @param {number} maxSize - 最大檔案大小（bytes），預設為 5MB
 * @returns {Object} - { isValid: boolean, message: string, invalidFiles: Array, totalSize: number }
 */
export const validateMultipleFilesSize = (files, maxSize = MAX_FILE_SIZE) => {
    if (!files || files.length === 0) {
        return {
            isValid: true,
            message: "沒有檔案需要檢查",
            invalidFiles: [],
            totalSize: 0
        };
    }

    const invalidFiles = [];
    let totalSize = 0;

    files.forEach(file => {
        totalSize += file.size;
        const validation = validateFileSize(file, maxSize);
        if (!validation.isValid) {
            invalidFiles.push({
                file,
                message: validation.message
            });
        }
    });

    const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

    if (invalidFiles.length > 0) {
        const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(1);
        return {
            isValid: false,
            message: `有 ${invalidFiles.length} 個檔案超過 ${maxSizeInMB}MB 限制`,
            invalidFiles,
            totalSize
        };
    }

    return {
        isValid: true,
        message: `所有檔案大小檢查通過，總計 ${totalSizeInMB}MB`,
        invalidFiles: [],
        totalSize
    };
};

/**
 * 格式化檔案大小顯示
 * @param {number} bytes - 檔案大小（bytes）
 * @returns {string} - 格式化後的檔案大小字串
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 檢查檔案並顯示警告訊息（整合版本）
 * 適合在檔案選擇時直接使用
 * @param {File[]} files - 要檢查的檔案陣列
 * @param {number} maxSize - 最大檔案大小（bytes），預設為 5MB
 * @param {boolean} showAlert - 是否顯示 alert 警告，預設為 true
 * @returns {boolean} - 是否通過檢查
 */
export const checkFilesAndAlert = (files, maxSize = MAX_FILE_SIZE, showAlert = true) => {
    const validation = validateMultipleFilesSize(files, maxSize);
    
    if (!validation.isValid && showAlert) {
        const errorMessages = validation.invalidFiles.map(item => item.message).join('\n');
        alert(`檔案過大：\n\n${errorMessages}`);
    }
    
    return validation.isValid;
};

// 匯出常數供外部使用
export { MAX_FILE_SIZE }; 