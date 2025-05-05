import mongoose from "mongoose";

async function FetchCourseData(user_id) {
    try {
        const db = mongoose.connection.db;
        const parsedUserId = parseInt(user_id);

        const result = await db.collection("user").aggregate([
            // Filter by user_id
            {
                $match: {
                    user_id: parsedUserId
                }
            },
            // Join with the study_in collection
            {
                $lookup: {
                    from: "study_in", // The collection to join with
                    localField: "user_id", // Field in the "user" collection
                    foreignField: "user_id", // Field in the "study_in" collection
                    as: "study_data" // Output array field
                }
            },
            // Unwind the study_data array to de-normalize
            {
                $unwind: "$study_data"
            },
            // Join with the course collection
            {
                $lookup: {
                    from: "course", // The collection to join with
                    localField: "study_data.course_id", // Field in the "study_data" object
                    foreignField: "course_id", // Field in the "course" collection
                    as: "course_data" // Output array field
                }
            },
            // Unwind the course_data array to de-normalize
            {
                $unwind: "$course_data"
            },
            // Optionally project only the fields you need
            {
                $project: {
                    _id: 0, // Exclude the MongoDB default _id field
                    user_id: 1,
                    name: 1,
                    "study_data.course_id": 1,
                    "course_data.name": 1,
                    "course_data.description": 1
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error aggregating data:", error);
        throw error;
    }
}

export { FetchCourseData };