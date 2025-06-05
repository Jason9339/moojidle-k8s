import mongoose from "mongoose";

import GetNextCounterId from '#src/utils/get_next_counter_id.js';

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
                    course: "$course_data.name",
                    course_id: "$course_data.course_id",
                    title: "$exam_name", // Map to frontend's "title"
                    date: "$start_date" // Map to frontend's "date"
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

// Service function to retrieve all upcoming exams
// async function getComingExams() {
//     try {
//         // 取得當前日期
//         const currentDate = new Date();

//         // 查詢未發生的考試（考試日期 > 當前日期）
//         const exams = await mongoose.connection.db.collection('exams')
//             .find({ exam_date: { $gt: currentDate } })
//             .sort({ exam_date: 1 }) // 依日期升序排序
//             .toArray();

//         // 轉換為前端需要的格式
//         const formattedExams = exams.map(exam => ({
//             id: exam.exam_id,
//             name: exam.exam_name,
//             description: exam.description,
//             date: exam.exam_date,
//             courseId: exam.in_course_id
//         }));

//         return formattedExams;

//     } catch (error) {
//         console.error("[getComingExams] Error fetching exams:", error);
//         // Re-throw the error for the controller to handle
//         throw new Error(`Failed to retrieve upcoming exams: ${error.message}`);
//     }
// }

async function FindExamsByCourseId(courseId) {
    try {
        const db = mongoose.connection.db;
        const parsedCourseId = parseInt(courseId, 10);

        const exams = await db.collection('exams')
            .find({ in_course_id: parsedCourseId })
            .sort({ end_date: 1 })
            .toArray();

        return exams
    } catch (error) {
        console.error("[GetExamsByCourseId] Error:", error);
        throw new Error(`Failed to retrieve exams for course: ${error.message}`);
    }
}

async function AddExamByCourseId(examData) {
    try {
        const db = mongoose.connection.db;

        const nextExamId = await GetNextCounterId("exams");

        const examDoc = {
            exam_id: nextExamId,
            ...examData
        };

        const result = await mongoose.connection.db.collection("exams").insertOne(examDoc);
        return result;
    } catch (error) {
        console.error(`[InsertExamToDB] Error inserting exam:`, error);
        throw new Error(`Failed to insert exam: ${error.message}`);
    }
}

async function FindExamById(examId) {
    const db = mongoose.connection.db;
    return db.collection("exams").findOne({ exam_id: parseInt(examId) });
}

export {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindProjectedExamsByCourseId,
    FindExamsByCourseId,
    FindExamById,

    AddExamByCourseId,
    
    UpdateOneExamScoreById,
    
    // getComingExams
};
