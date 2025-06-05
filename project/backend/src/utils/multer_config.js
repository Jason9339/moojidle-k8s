import multer from 'multer';

// 設定 multer（記憶體儲存，限制檔案大小為 5MB）
export const uploadWithMulter = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("uploadFile");

// 專門用於頭像上傳的 multer 配置
export const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 2 * 1024 * 1024, // 頭像限制為 2MB
    },
    fileFilter: (req, file, cb) => {
        // 只允許圖片格式
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只支援 JPG、PNG、GIF 或 WebP 格式的圖片'), false);
        }
    }
}).single("avatar") ; // 暫時接受任何欄位名稱來除錯

// 設定 multer 支援多檔案上傳
export const uploadMultipleWithMulter = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 5 * 1024 * 1024, // 每個檔案限制 5MB
        files: 10 // 最多10個檔案
    },
}).any(); // 接受任何檔案欄位名稱

// Multer 錯誤處理 middleware
export const MulterErrorHandling = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    }
    if (err) {
        console.error("Unknown Error:", err.message);
        return res.status(500).json({ message: "Unknown error during file upload" });
    }
    next();
};