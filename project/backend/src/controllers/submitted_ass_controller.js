import {
    GetAssignmentSubmissionTime,
    SubmitAssignmentService,
    GetAssignmentSubmissionService,
    DeleteSubmittedFileService,
    DeleteSubmissionRecordService
} from '#src/services/submitted_ass_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

// 取得作業繳交時間
async function GetAssignmentSubmissionTimeController(req, res) {
    try {
        const { assignmentId } = req.params;
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "缺少 userId" });

        const submitTime = await GetAssignmentSubmissionTime(assignmentId, userId);
        res.json({ submitTime });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 學生繳交作業 - 支援多檔案上傳和修改
async function SubmitAssignment(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId, description, keepFiles } = req.body;
        const files = req.files || [];
        
        console.log(`[SubmitAssignment] 開始處理學生作業提交: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, 檔案數量=${files.length}, keepFiles=${keepFiles ? 'true' : 'false'}`);
        
        if (!assignmentId || !submitByUserId) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        let savedFiles = [];
        let parsedKeepFiles = null;
        
        // 解析 keepFiles 參數（如果前端以JSON字串形式傳送）
        if (keepFiles) {
            try {
                parsedKeepFiles = typeof keepFiles === 'string' ? JSON.parse(keepFiles) : keepFiles;
                console.log(`[SubmitAssignment] 解析 keepFiles:`, parsedKeepFiles);
            } catch (error) {
                console.warn(`[SubmitAssignment] keepFiles 解析失敗:`, error);
                parsedKeepFiles = null;
            }
        }
        
        // 如果有新檔案要上傳，先儲存到硬碟
        if (files.length > 0) {
            console.log(`[SubmitAssignment] 開始儲存 ${files.length} 個檔案`);
            for (const file of files) {
                const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submit");
                savedFiles.push({
                    filename: savedFile.originalName,
                    url: savedFile.relativeUrl,
                    path_to_file: savedFile.relativeUrl,
                    fileId: savedFile.fileId
                });
                console.log(`[SubmitAssignment] 檔案已儲存: ${savedFile.originalName}`);
            }
        }
        
        // 調用 service 層處理業務邏輯
        const result = await SubmitAssignmentService(assignmentId, submitByUserId, description, savedFiles, parsedKeepFiles);
        
        if (result.deleted) {
            res.status(200).json({ 
                message: "作業提交記錄已完全清除",
                data: result
            });
        } else {
            res.status(200).json({ 
                message: files.length > 0 ? "檔案上傳成功" : "作業更新成功", 
                data: result 
            });
        }
        
    } catch (error) {
        console.error("學生繳交作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 取得某學生針對某作業的繳交紀錄
async function GetAssignmentSubmission(req, res) {
    try {
        const { assignmentId } = req.params;
        const { user_id } = req.query;
        console.log(`[GetAssignmentSubmission] 查詢參數: assignmentId=${assignmentId}, user_id=${user_id}`);
        
        if (!user_id) return res.status(400).json({ message: "缺少 user_id" });
        
        const submission = await GetAssignmentSubmissionService(assignmentId, user_id);
        
        console.log(`[GetAssignmentSubmission] 查詢結果:`, submission);
        res.json({ data: submission });
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

// 刪除學生提交的單個檔案
async function DeleteSubmittedFile(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId, fileUrl } = req.body;
        
        console.log(`[DeleteSubmittedFile] 刪除檔案: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, fileUrl=${fileUrl}`);
        
        if (!assignmentId || !submitByUserId || !fileUrl) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        // 調用 service 層處理業務邏輯
        const result = await DeleteSubmittedFileService(assignmentId, submitByUserId, fileUrl);
        
        // 刪除硬碟上的檔案
        try {
            await DeleteFile(result.deleteFilePath);
            console.log(`[DeleteSubmittedFile] 硬碟檔案已刪除: ${result.deleteFilePath}`);
        } catch (deleteError) {
            console.warn(`[DeleteSubmittedFile] 刪除硬碟檔案失敗: ${deleteError.message}`);
            // 繼續執行，不要因為檔案刪除失敗而中斷整個操作
        }
        
        if (result.deleted) {
            res.status(200).json({ 
                message: "檔案刪除成功，提交記錄已完全清除",
                data: { 
                    deleted: true,
                    reason: result.reason
                }
            });
        } else {
            res.status(200).json({ 
                message: "檔案刪除成功",
                data: { 
                    attachments: result.attachments,
                    deleted: false 
                }
            });
        }
        
    } catch (error) {
        console.error("刪除提交檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 完全刪除學生的作業提交記錄
async function DeleteSubmissionRecord(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId } = req.body;
        
        console.log(`[DeleteSubmissionRecord] 刪除提交記錄: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}`);
        
        if (!assignmentId || !submitByUserId) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        // 調用 service 層處理業務邏輯
        const result = await DeleteSubmissionRecordService(assignmentId, submitByUserId);
        
        // 刪除所有相關檔案
        if (result.attachments && result.attachments.length > 0) {
            for (const attachment of result.attachments) {
                const deleteFilePath = attachment.path_to_file || attachment.url;
                try {
                    await DeleteFile(deleteFilePath);
                    console.log(`[DeleteSubmissionRecord] 硬碟檔案已刪除: ${deleteFilePath}`);
                } catch (deleteError) {
                    console.warn(`[DeleteSubmissionRecord] 刪除硬碟檔案失敗: ${deleteError.message}`);
                }
            }
        }
        
        res.status(200).json({ 
            message: "作業提交記錄已完全刪除",
            data: { deleted: true }
        });
        
    } catch (error) {
        console.error("刪除提交記錄錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

export {
    GetAssignmentSubmissionTimeController,
    SubmitAssignment,
    GetAssignmentSubmission,
    DeleteSubmittedFile,
    DeleteSubmissionRecord
};
