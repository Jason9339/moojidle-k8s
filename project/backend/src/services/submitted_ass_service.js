import mongoose from "mongoose";

async function FindSubAssById(subAssId) {
    try {
        const subAss = await mongoose.connection.db.collection("submitted_ass").findOne(
            { s_ass_id: parseInt(subAssId) }
        )

        return subAss;
    } catch (error) {
        throw error;
    }
}

async function InsertSubAss(submission) {
    try {
        const db = mongoose.connection.db;
        const result = await db.collection("submitted_ass").insertOne(submission);

        return result.acknowledged;
    } catch (error) {
        throw error;
    }
}
// 更新作業提交（以 assignmentId + userId 為條件）
async function UpdateSubAssById(subAssId, userTags, savedFiles, description) {
    const db = mongoose.connection.db;
    const result = await db.collection("submitted_ass").updateOne(
        {
            s_ass_id: parseInt(subAssId)
        },
        { $set: {submit_user_course_tag: userTags, attachments: savedFiles, description: description} }
    );

    return result.acknowledged;
}

// 取得某學生針對某作業的繳交紀錄
async function FindSubAssByAssAndUser(assignmentId, userId) {
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

async function DeleteSubAssById(subAssId) {
    try {
        const db = mongoose.connection.db;

        const deleteResult = await db.collection("submitted_ass").deleteMany({
            s_ass_id: parseInt(subAssId)
        });

        return deleteResult.acknowledged;
    } catch (error) {
        console.error("DeleteSubmissionRecordService 錯誤:", error);
        throw error;
    }
}

export {
    FindSubAssById,
    FindSubAssByAssAndUser,

    InsertSubAss,

    UpdateSubAssById,

    DeleteSubAssById
};
