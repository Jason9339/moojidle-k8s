import GetNextCounterId from '#src/utils/get_next_counter_id.js';

import {
    GetAssignmentSubmissionService,
    CreateAssignmentSubmissionService,
    UpdateAssignmentSubmissionService,
    // DeleteSubmittedFileService,
    DeleteSubmissionRecordService
} from '#src/services/submitted_ass_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

// 取得某學生針對某作業的繳交紀錄
async function GetAssignmentSubmission(req, res) {
    try {
        const { assignmentId, userId } = req.params;
        const submission = await GetAssignmentSubmissionService(assignmentId, userId);
        res.json({ data: submission });
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

// 刪除學生提交的單個檔案
// async function DeleteSubmittedFile(req, res) {
//     try {
//         const { assignmentId } = req.params;
//         const { submitByUserId, fileUrl } = req.body;
        
//         console.log(`[DeleteSubmittedFile] 刪除檔案: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, fileUrl=${fileUrl}`);
        
//         if (!assignmentId || !submitByUserId || !fileUrl) {
//             return res.status(400).json({ message: "缺少必要參數" });
//         }
        
//         // 調用 service 層處理業務邏輯
//         const result = await DeleteSubmittedFileService(assignmentId, submitByUserId, fileUrl);
        
//         // 刪除硬碟上的檔案
//         try {
//             await DeleteFile(result.deleteFilePath);
//             console.log(`[DeleteSubmittedFile] 硬碟檔案已刪除: ${result.deleteFilePath}`);
//         } catch (deleteError) {
//             console.warn(`[DeleteSubmittedFile] 刪除硬碟檔案失敗: ${deleteError.message}`);
//             // 繼續執行，不要因為檔案刪除失敗而中斷整個操作
//         }
        
//         if (result.deleted) {
//             res.status(200).json({ 
//                 message: "檔案刪除成功，提交記錄已完全清除",
//                 data: { 
//                     deleted: true,
//                     reason: result.reason
//                 }
//             });
//         } else {
//             res.status(200).json({ 
//                 message: "檔案刪除成功",
//                 data: { 
//                     attachments: result.attachments,
//                     deleted: false 
//                 }
//             });
//         }
        
//     } catch (error) {
//         console.error("刪除提交檔案錯誤:", error);
//         res.status(500).json({ message: error.message });
//     }
// }

// 完全刪除學生的作業提交記錄
async function DeleteSubmissionRecord(req, res) {
    try {
        const { assignmentId, userId } = req.params;
        await DeleteSubmissionRecordService(assignmentId, userId);
        res.status(200).json({ message: "作業提交記錄已刪除" });
    } catch (error) {
        console.error("DeleteSubmissionRecord 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}
// 建立學生的作業提交紀錄
async function CreateAssignmentSubmission(req, res) {
    try {
        const { assignmentId, userId } = req.params;
        const { description, attachments } = req.body;

        const nextSAssId = await GetNextCounterId("submitted_ass");

        const submission = {
            s_ass_id: nextSAssId,
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId),
            submit_user_course_tag: `StudentTag_${userId}`,
            submit_date: new Date(),
            attachments: attachments || [],
            description: description || ""
        };

        await CreateAssignmentSubmissionService(submission);

        res.status(200).json({ message: "新增作業提交成功", data: submission });
    } catch (error) {
        console.error("[CreateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}


// 更新作業提交
async function UpdateAssignmentSubmission(req, res) {
    try {
        const { assignmentId, userId } = req.params;
        const { description, attachments } = req.body;

        const updateData = {
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId),
            submit_date: new Date(),
            description: description || "",
            attachments: attachments || []
        };

        await UpdateAssignmentSubmissionService(
                parseInt(assignmentId),
                parseInt(userId),
                {
                    submit_date: new Date(),
                    description: description || "",
                    attachments: attachments || []
                }
            );

        res.status(200).json({ message: "更新作業提交成功", data: updateData });
    } catch (error) {
        console.error("[UpdateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}


export {
    GetAssignmentSubmission,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    //DeleteSubmittedFile,
    DeleteSubmissionRecord
    
};
