import { SaveFile } from "#src/services/file_services/file_storage_service.js";
import {
    InsertAssignmentToDB,
    InsertMaterialToDB,
    GetNextId
} from "#src/services/file_services/file_db_service.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 模擬 __dirname，因為使用的是 ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 處理檔案上傳與資料庫寫入
 */
export const Upload = async (req, res, next) => {
    try {
        const {
            courseId,
            createByUserId,
            type,
            assName,
            endDate,
            mName,
            description
        } = req.body;

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 儲存檔案到硬碟
        const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), type);
        const now = new Date();

        let dbResult;

        if (type === "assignment") {
            const doc = {
                ass_id: await GetNextId("assignments"),
                in_course_id: parseInt(courseId),
                create_by_user_id: parseInt(createByUserId),
                ass_name: assName,
                start_date: new Date(req.body.startDate),
                end_date: new Date(endDate),
                description,
                create_date: now,
                attachments: [
                    {
                        filename: savedFile.originalName,
                        path_to_file: savedFile.relativeUrl
                    }
                ]
            };
            dbResult = await InsertAssignmentToDB(doc);
        } else if (type === "material") {
            const doc = {
                m_id: await GetNextId("materials"),
                in_course_id: parseInt(courseId),
                create_by_user_id: parseInt(createByUserId),
                m_name: mName,
                description,
                create_date: now,
                display_date: new Date(req.body.displayDate),
                path_to_file: savedFile.relativeUrl,
                filename: savedFile.originalName
            };
            dbResult = await InsertMaterialToDB(doc);
        } else {
            return res.status(400).json({ message: "Unknown upload type" });
        }

        res.status(200).json({
            message: "Upload success",
            fileId: savedFile.fileId,
            fileName: savedFile.originalName,
            data: dbResult
        });
    } catch (err) {
        next(err);
    }
};

export const DownloadFile = (req, res) => {
    const { path: filePathParam } = req.query;

    if (!filePathParam) {
        return res.status(400).json({ message: "Missing path parameter" });
    }

    const sanitizedPath = filePathParam.replace(/^\/+/, ""); // 去除開頭的 "/"
    const filePath = path.join(__dirname, "../../..", sanitizedPath);
    console.log("✅ Resolved file path:", filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("❌ 檔案不存在:", filePath);
            return res.status(404).json({ message: "File not found" });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(filePath)}"`
        );

        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ 下載錯誤:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    });
};
