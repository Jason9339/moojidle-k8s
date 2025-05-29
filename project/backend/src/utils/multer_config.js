import multer from 'multer';

// 設定 multer（記憶體儲存，限制檔案大小為 5MB）
export const uploadWithMulter = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("uploadFile");

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