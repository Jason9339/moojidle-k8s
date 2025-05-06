import mongoose from "mongoose";

// Fetch unsubmitted assignments for a specific user
async function FetchToDoAssignments(user_id) {
    try {
        const db = mongoose.connection.db;
        const parsedUserId = parseInt(user_id);

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
                    create_date: { $lt: new Date() }, // create_date < Date()
                    end_date: { $gt: new Date() } // Date() < end_date
                }
            },
            // Exclude assignments that have been submitted
            {
                $lookup: {
                    from: "submitted_ass", // Join with submitted_ass collection
                    localField: "ass_id", // Match assignment ID
                    foreignField: "ass_id", // Match submitted assignment ID
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
                    ass_name: 1,
                    description: 1,
                    "course_data.name": 1, // Course name
                    end_date: 1
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchToDoAssignments:", error);
        throw error;
    }
}



export { FetchToDoAssignments };
