import mongoose from "mongoose";


async function GetCourseIdByAssignmentId(assignmentId) {
    try {
        const assignment = await mongoose.connection.db.collection("assignments").findOne(
            { ass_id: assignmentId },
            { projection: { in_course_id: 1 } }
        );
        return assignment ? assignment.in_course_id : null;
    } catch (error) {
        console.error("Error getting course ID by assignment ID:", error);
        throw error;
    }

}

/**
 * Get all submissions for a specific assignment with student details
 * @param {number} assignmentId - The assignment ID
 * @returns {Promise<Array>} Array of submission details
 */
async function GetSubmissionsByAssignmentId(assignmentId) {
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




async function ReviewAssignmentSubmissionService(submissionId, score, graderId) {
    try {
        
        // Convert submission ID and score to appropriate types
        const sAssId = parseInt(submissionId);
        const numericScore = parseFloat(score);

        
        const db = mongoose.connection.db;
        
        // 先檢查提交是否存在
        const existingSubmission = await db.collection("submitted_ass").findOne(
            { s_ass_id: sAssId }
        ); 
        if (!existingSubmission) {
            throw new Error("Submission not found");
        }
        
        const score_lb = 0;
        // 獲取作業的最大分數
        const assignment = await db.collection("assignments").findOne(
            { ass_id: existingSubmission.ass_id }
        );

        if (!assignment) {
            throw new Error("Associated assignment not found");
        }
        const score_ub = assignment.max_score;

        if (score < score_lb || score > score_ub) {
            throw new Error(`Score must be between ${score_lb} and ${score_ub}`);
        }



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
    GetCourseIdByAssignmentId,
    GetSubmissionsByAssignmentId,
    ReviewAssignmentSubmissionService,

}
