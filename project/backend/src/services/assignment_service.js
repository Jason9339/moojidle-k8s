import mongoose from "mongoose";
import GetNextCounterId from '#src/utils/get_next_counter_id.js';

// Fetch unsubmitted assignments for a specific user
async function GetToDoAssignmentsByUserId(user_id) {
    try {
        const db = mongoose.connection.db;
        // user_id is of type string
        const parsedUserId = parseInt(user_id);

        // Define a fixed current time for testing
        const current_time = new Date("2025-01-08T00:00:00Z"); // Set to a date in 2025
        // const current_time = new Date(); // Comment this out for testing

        const result = await db.collection("assignments").aggregate([
            // Match assignments for courses the user is studying in
            {
                $lookup: {
                    from: "study_in", // Join with the study_in collection
                    localField: "in_course_id", // Match course_id in assignments
                    foreignField: "course_id", // Match course_id in study_in
                    as: "study_data"
                }
            },
            {
                $unwind: "$study_data" // De-normalize study_data
            },
            {
                $match: {
                    "study_data.user_id": parsedUserId, // Filter by user_id
                }
            },
            // Exclude assignments that have been submitted by the current user
            {
                $lookup: {
                    from: "submitted_ass", // Join with submitted_ass collection
                    let: { ass_id: "$ass_id", user_id: parsedUserId }, // Pass ass_id and user_id to the pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$ass_id", "$$ass_id"] }, // Match ass_id
                                        { $eq: ["$submit_by_user_id", "$$user_id"] } // Match user_id
                                    ]
                                }
                            }
                        }
                    ],
                    as: "submitted_data"
                }
            },
            {
                $match: {
                    submitted_data: { $size: 0 } // Only unsubmitted assignments
                }
            },
            // Join with the course collection to get course details
            {
                $lookup: {
                    from: "course",
                    localField: "in_course_id",
                    foreignField: "course_id",
                    as: "course_data"
                }
            },
            {
                $unwind: "$course_data" // De-normalize course_data
            },
            // Project only the required fields
            {
                $project: {
                    _id: 0,
                    title: "$ass_name", // Map to frontend's "title"
                    course: "$course_data.name", // Map to frontend's "course"
                    start_date: "$start_date", // Map to frontend's "start_date"
                    due: "$end_date", // Map to frontend's "due"
                    points: { $literal: 100 } // Add a placeholder value for "points"
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchToDoAssignments:", error);
        throw error;
    }
}

async function FindAssignmentsByCourseId(courseId) {
    try {
        courseId = parseInt(courseId);
        const assignments = await mongoose.connection.db.collection('assignments')
        .find({ in_course_id: parseInt(courseId) })
        .sort({ end_date: 1 }) // 依截止日期升序排列
        .toArray();

        return assignments;
    } catch (error) {
        console.error(`[getAssignmentsByCourseId] Error fetching assignments for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course assignments: ${error.message}`);
    }
}



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

        console.log(sAssId, numericScore);
        
        
        // Prepare update document
        const updateDoc = {
            $set: {
                score: numericScore,
                graded_by_user_id: parseInt(graderId),
                // graded_date: new Date()
            }
        };
        
        
        const db = mongoose.connection.db;
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




const InsertAssignmentToDB = async (assignmentData) => {
    try {
        // 生成下一個 assignment ID
        const nextAssignmentId = await GetNextCounterId("assignments");
        
        // 準備要插入的文檔
        const assignmentDoc = {
            ass_id: nextAssignmentId,
            ...assignmentData
        };
        
        const result = await mongoose.connection.db.collection("assignments").insertOne(assignmentDoc);
        return result;
    } catch (error) {
        console.error(`[InsertAssignmentToDB] Error inserting assignment:`, error);
        throw new Error(`Failed to insert assignment: ${error.message}`);
    }
};

export {
    GetToDoAssignmentsByUserId,
    FindAssignmentsByCourseId,
    GetCourseIdByAssignmentId,
    GetSubmissionsByAssignmentId,
    ReviewAssignmentSubmissionService,
    InsertAssignmentToDB
};
