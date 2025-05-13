import { Router } from "express";
import multer from "multer";
import FileController from "#src/controllers/file_controllers/file_controller.js";

const fileRouter = Router();
const fileController = new FileController();

// 檔案上傳的 middleware => 限制檔案大小
const uploadWithMulter = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("uploadFile"); // 'uploadFile': 前端 input 的 name 屬性

// 定義 middleware 的 error handling
const multerErrorHandling = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer Error: " + err.message);
        return res
            .status(400)
            .json({ message: "Multer error: " + err.message });
    } else if (err) {
        console.error("Unknown Error: " + err.message);
        return res
            .status(500)
            .json({ message: "Unknown error during file upload" });
    }
    next();
};

// 定義路由
fileRouter.post(
    "/upload",
    uploadWithMulter,
    (req, res) => fileController.upload(req, res),
    multerErrorHandling
);

export default fileRouter;
