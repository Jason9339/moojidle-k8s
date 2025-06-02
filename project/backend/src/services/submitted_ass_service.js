import mongoose from "mongoose";

async function CreateAssignmentSubmissionService(submission) {
    try {
        const db = mongoose.connection.db;
        const result = await db.collection("submitted_ass").insertOne(submission);

        return result.acknowledged;
    } catch (error) {
        throw error;
    }
}
// 更新作業提交（以 assignmentId + userId 為條件）
async function UpdateAssignmentSubmissionService(assignmentId, userId, updateData) {
    const db = mongoose.connection.db;
    await db.collection("submitted_ass").updateOne(
        {
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId)
        },
        { $set: updateData }
    );
    return updateData;
}

// 取得某學生針對某作業的繳交紀錄
async function GetAssignmentSubmissionService(assignmentId, userId) {
    try {
        const db = mongoose.connection.db;

        const submission = await db.collection("submitted_ass").find({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(userId)
        }).toArray();

        return submission;
    } catch (error) {
        console.error("GetAssignmentSubmissionService 錯誤:", error);
        throw error;
    }
}

// 刪除學生提交的單個檔案
// file部分先跳過
// async function DeleteSubmittedFileService(assignmentId, submitByUserId, fileUrl) {
//     try {
//         const db = mongoose.connection.db;
//         const now = new Date();

//         console.log(`[DeleteSubmittedFileService] 刪除檔案: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, fileUrl=${fileUrl}`);

//         const submissions = await db.collection("submitted_ass").find({
//             ass_id: parseInt(assignmentId),
//             submit_by_user_id: parseInt(submitByUserId)
//         }).sort({ submit_date: -1 }).toArray();

//         if (submissions.length === 0) {
//             throw new Error("未找到提交紀錄");
//         }

//         const submission = submissions[0];

//         const updatedAttachments = submission.attachments.filter(att => att.url !== fileUrl);
//         const fileToDelete = submission.attachments.find(att => att.url === fileUrl);
//         const deleteFilePath = fileToDelete?.path_to_file || fileToDelete?.url || fileUrl;

//         const hasDescription = submission.description && submission.description.trim() !== '';
//         const hasOtherFiles = updatedAttachments.length > 0;

//         if (!hasDescription && !hasOtherFiles) {
//             const deleteResult = await db.collection("submitted_ass").deleteMany({
//                 ass_id: parseInt(assignmentId),
//                 submit_by_user_id: parseInt(submitByUserId)
//             });

//             return {
//                 deleted: true,
//                 reason: "無描述且無其他檔案",
//                 deletedCount: deleteResult.deletedCount,
//                 deleteFilePath
//             };
//         } else {
//             await db.collection("submitted_ass").updateOne(
//                 { _id: submission._id },
//                 {
//                     $set: {
//                         attachments: updatedAttachments,
//                         submit_date: now
//                     }
//                 }
//             );

//             return {
//                 attachments: updatedAttachments,
//                 deleted: false,
//                 deleteFilePath
//             };
//         }

//     } catch (error) {
//         console.error("DeleteSubmittedFileService 錯誤:", error);
//         throw error;
//     }
// }

// 完全刪除學生的作業提交記錄
async function DeleteSubmissionRecordService(assignmentId, submitByUserId) {
    try {
        const db = mongoose.connection.db;

        const deleteResult = await db.collection("submitted_ass").deleteMany({
            ass_id: parseInt(assignmentId),
            submit_by_user_id: parseInt(submitByUserId)
        });

        return deleteResult.acknowledged;
    } catch (error) {
        console.error("DeleteSubmissionRecordService 錯誤:", error);
        throw error;
    }
}

export {
    CreateAssignmentSubmissionService,
    UpdateAssignmentSubmissionService,
    GetAssignmentSubmissionService,
    // DeleteSubmittedFileService,
    DeleteSubmissionRecordService
};
