import mongoose from "mongoose";

// Fetch upcoming exams for a specific user
async function FindFromExamJoinStudyInJoinCourseByUserId(user_id) {
    try {
        const db = mongoose.connection.db;
        // user_id is of type string
        const parsedUserId = parseInt(user_id);

        // Define a fixed current time for testing
        const current_time = new Date("2025-01-08T00:00:00Z"); // Set to a date in 2025
        // const current_time = new Date(); // Comment this out for testing

        const result = await db.collection("exams").aggregate([
            // Match exams for courses the user is studying in
            {
                $lookup: {
                    from: "study_in", // Join with the study_in collection
                    localField: "in_course_id", // Match course_id in exams
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
                    exam_date: { $gt: current_time } // current_time < exam_date
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
                    title: "$exam_name", // Map to frontend's "title"
                    date: "$exam_date" // Map to frontend's "date"
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchUpcomingExams:", error);
        throw error;
    }
}

async function FindProjectedExamsByCourseId(courseId) {
    try {
        courseId = parseInt(courseId);

        const result = await mongoose.connection.db.collection("exams").find(
            { in_course_id: courseId }
        ).project(
            { attachments: 0, description: 0, _id: 0 }
        ).toArray();

        if (result == null || result.length == 0) {
            return [];
        } else {
            return result;
        }
    } catch (err) {
        throw err;
    }
}

async function UpdateOneExamScoreById(examId, max_score, percentage) {
    try {           
            const result = await mongoose.connection.db.collection('exams').updateOne(
                { exam_id: examId },
                { $set: { max_score: max_score, percentage: percentage } }
            );

            if (result.matchedCount === 0) {
                return null;
            }
    
            return result.matchedCount;
        } catch (err) {
            throw err;
        }
}

export {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindProjectedExamsByCourseId,

    UpdateOneExamScoreById
};