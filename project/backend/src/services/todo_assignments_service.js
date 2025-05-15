import mongoose from "mongoose";

// Fetch unsubmitted assignments for a specific user
async function FetchToDoAssignments(user_id) {
    try {
        const db = mongoose.connection.db;
        // user_id is of type string
        const parsedUserId = parseInt(user_id);

        // Define a fixed current time for testing
        const current_time = new Date("2022-05-01T00:00:00Z"); // Set to a date in 2023
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

export { FetchToDoAssignments };
