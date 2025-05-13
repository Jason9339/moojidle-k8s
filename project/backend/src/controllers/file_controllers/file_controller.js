import { saveFile } from "#src/services/file_services/file_storage_service.js";
import {
    insertAssignmentToDB,
    insertMaterialToDB,
    getNextId
} from "#src/services/file_services/file_db_service.js";

/**
 * 處理檔案上傳與資料庫寫入
 */
export const upload = async (req, res, next) => {
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
        const savedFile = await saveFile(file.buffer, decodeURIComponent(file.originalname), type);
        const now = new Date();

        let dbResult;

        if (type === "assignment") {
            const doc = {
                ass_id: await getNextId("assignments"),
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
                        url: savedFile.relativeUrl
                    }
                ]
            };
            dbResult = await insertAssignmentToDB(doc);
        } else if (type === "material") {
            const doc = {
                m_id: await getNextId("materials"),
                in_course_id: parseInt(courseId),
                create_by_user_id: parseInt(createByUserId),
                m_name: mName,
                description,
                create_date: now,
                display_date: new Date(req.body.displayDate),
                path_to_file: savedFile.relativeUrl,
                url: savedFile.relativeUrl
            };
            dbResult = await insertMaterialToDB(doc);
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
