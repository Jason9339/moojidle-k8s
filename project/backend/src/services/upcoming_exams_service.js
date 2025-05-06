import mongoose from "mongoose";

// Fetch upcoming exams for a specific user
async function FetchUpcomingExams(user_id) {
    try {
        const db = mongoose.connection.db;
        const parsedUserId = parseInt(user_id);

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
                    create_date: { $lt: new Date() }, // create_date < Date()
                    exam_date: { $gt: new Date() } // Date() < exam_date
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
                    exam_name: 1,
                    description: 1,
                    "course_data.name": 1, // Course name
                    exam_date: 1
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchUpcomingExams:", error);
        throw error;
    }
}

export { FetchUpcomingExams };