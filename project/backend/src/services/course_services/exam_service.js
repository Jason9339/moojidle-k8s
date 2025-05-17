import mongoose from "mongoose";

// Fetch upcoming exams for a specific user
async function GetUpcomingExamsByUserId(user_id) {
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

export {
    GetUpcomingExamsByUserId
    // getComingExams
};