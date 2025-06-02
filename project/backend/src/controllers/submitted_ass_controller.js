import GetNextCounterId from '#src/utils/get_next_counter_id.js';

import {
    FindSubAssById,
    GetAssignmentSubmissionService,
    CreateAssignmentSubmissionService,
    UpdateAssignmentSubmissionService,
    DeleteSubmissionRecordService
} from '#src/services/submitted_ass_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

import { FindOneUserById } from '#src/services/user_service.js';
import { FindAssignmentById } from '#src/services/assignment_service.js';

async function GetAssignmentSubmission(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while finding sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while finding sub ass for a user");
            return;
        }

        const submission = await GetAssignmentSubmissionService(assId, userId);

        if (submission.length == 0) {
            res.status(200).send(null);
            return;
        }

        // send back the newest one if have muiltiple
        res.status(200).json(submission.at(-1));
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

async function DeleteSubmissionRecord(req, res) {
    try {
        const subAssId = parseInt(req.params.subAssId);

        // check if this sub ass exist
        const subAss = await FindSubAssById(subAssId);
        if (!subAss) {
            res.status(404).send("sub ass not found while deleting");
            return;
        }

        // handle file deletion
        for (let attachment of subAss.attachments) {
            const filePath = attachment.path_to_file; // Use path_to_file field
            const result = await DeleteFile(filePath);

            // since seed has a lot of invalid path, i dont do error handle here,
            // just assume everything is deleted
        }

        const result = await DeleteSubmissionRecordService(subAssId);
        
        if (result) {
            res.status(200).json("delete sub ass successfully");
        } else {
            res.status(500).send("internal error when delete sub ass");
        }
    } catch (error) {
        console.error("DeleteSubmissionRecord 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function CreateAssignmentSubmission(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);
        const { userTags, description } = req.body;

        // since using multer to parse the body we have req.files to use
        const files = req.files || [];

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while creating sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while creating sub ass for a user");
            return;
        }

        // handle file storage
        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submitted_assignment");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl,
                size: file.size || 0 // 添加檔案大小資訊
            });
        }

        const nextSAssId = await GetNextCounterId("submitted_ass");

        const submission = {
            s_ass_id: nextSAssId,
            ass_id: assId,
            submit_by_user_id: userId,
            submit_user_course_tag: userTags || "",
            submit_date: new Date(),
            attachments: savedFiles,
            description: description || ""
        };

        const result = await CreateAssignmentSubmissionService(submission);

        if (result) {
            res.status(200).json("create sub ass successfully");
        } else {
            res.status(500).send("internal error when creating sub ass");
        }
    } catch (error) {
        console.error("[CreateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function UpdateAssignmentSubmission(req, res) {
    try {
        const subAssId = parseInt(req.params.subAssId);
        const { userTags, description, keepFiles } = req.body;

        // since using multer to parse the body we have req.files to use
        const files = req.files || [];

        // check if this sub ass exist
        const subAss = await FindSubAssById(subAssId);
        if (!subAss) {
            res.status(404).send("sub ass not found while updating");
            return;
        }

        // 處理要保留的檔案
        let filesToKeep = [];
        if (keepFiles) {
            try {
                filesToKeep = JSON.parse(keepFiles);
            } catch (e) {
                console.error("解析 keepFiles 失敗:", e);
                filesToKeep = [];
            }
        }

        // handle file storage - 保存新上傳的檔案
        const newSavedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submitted_assignment");
            newSavedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl,
                size: file.size || 0 // 添加檔案大小資訊
            });
        }

        // 刪除不在 keepFiles 中的原有檔案
        const originalFiles = subAss.attachments || [];
        for (const origFile of originalFiles) {
            const shouldKeep = filesToKeep.some(keepFile => 
                keepFile.filename === origFile.filename || 
                keepFile.path_to_file === origFile.path_to_file
            );

            if (!shouldKeep) {
                // 檔案不在保留列表中，需要刪除
                const filePath = origFile.path_to_file;
                
                // 呼叫刪除函數，但不因為刪除失敗而中斷整個流程
                const deleteResult = await DeleteFile(filePath);
            }
        }

        // 組合最終的檔案列表：保留的檔案 + 新上傳的檔案
        const finalAttachments = [
            ...filesToKeep.map(keepFile => ({
                filename: keepFile.filename,
                path_to_file: keepFile.path_to_file,
                // 如果有 size 欄位就保留，否則設為 0
                ...(keepFile.size !== undefined && { size: keepFile.size })
            })),
            ...newSavedFiles
        ];

        const result = await UpdateAssignmentSubmissionService(
            subAssId, 
            userTags || "", // 確保不是 undefined
            finalAttachments, 
            description || "" // 確保不是 undefined
        );

        if (result > 0) {
            res.status(200).json("update sub ass successfully");
        } else {
            res.status(500).send("internal error when updating sub ass");
        }
    } catch (error) {
        console.error("[UpdateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

export {
    GetAssignmentSubmission,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord
};
