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
async function UpdateSubAssById(subAssId, userTags, savedFiles, description, updateTime) {
    const db = mongoose.connection.db;
    const result = await db.collection("submitted_ass").updateOne(
        {
            s_ass_id: parseInt(subAssId)
        },
        { $set: {submit_user_course_tag: userTags, attachments: savedFiles, description: description, submit_date: updateTime} }
    );

    return result.modifiedCount;
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

        return deleteResult.deletedCount;
    } catch (error) {
        console.error("DeleteSubmissionRecordService 錯誤:", error);
        throw error;
    }
}



// ========================================================================= //
// Teacher assignment 
/**
 * Get all submissions for a specific assignment with student details
 * @param {number} assignmentId - The assignment ID
 * @returns {Promise<Array>} Array of submission details
 */
async function FindSubmissionsByAssignmentId(assignmentId) {
    try {
        const db = mongoose.connection.db;
        const submissions = await db.collection("submitted_ass").aggregate([
            { $match: { ass_id: assignmentId } },
            { $lookup: {
                from: "user",
                localField: "submit_by_user_id",
                foreignField: "user_id", 
                as: "student_info"
            }},
            { $unwind: "$student_info" },
            { $project: {
                s_ass_id: 1,
                ass_id: 1,
                submit_by_user_id: 1,
                submit_user_course_tag: 1,
                submit_date: 1,
                score: 1,
                graded_by_user_id: 1,
                attachments: 1,
                description: 1,
                "student_name": "$student_info.name",
                "status": { $cond: { if: { $ifNull: ["$score", false] }, then: "已評分", else: "待評分" } }
            }}
        ]).toArray();
        
        return submissions;
    } catch (error) {
        console.error("Error getting submissions by assignment ID:", error);
        throw error;
    }
}



async function UpdateReviewAssignmentSubmission(submissionId, score, graderId) {
    try {
        
        // Convert submission ID and score to appropriate types
        const sAssId = parseInt(submissionId);
        const numericScore = parseFloat(score);

        
        const db = mongoose.connection.db;
        

        // Prepare update document
        const updateDoc = {
            $set: {
                score: numericScore,
                graded_by_user_id: parseInt(graderId),
                // graded_date: new Date()
            }
        };
        
        const result = await db.collection("submitted_ass").updateOne(
            { s_ass_id: sAssId },
            updateDoc
        );
        
        return { updated: result.modifiedCount > 0, result };
    } catch (error) {
        console.error("Error reviewing assignment submission:", error);
        throw error;
    }
}


export {
    FindSubAssById,
    FindSubAssByAssAndUser,
    InsertSubAss,
    UpdateSubAssById,
    DeleteSubAssById,

    FindSubmissionsByAssignmentId,
    UpdateReviewAssignmentSubmission,
};
