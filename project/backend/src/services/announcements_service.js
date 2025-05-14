import mongoose from "mongoose";

// Fetch all announcements for a specific course, sorted by create_date
async function FetchAnnouncements(courseId) {
    try {
        const db = mongoose.connection.db;
        const parsedCourseId = parseInt(courseId);

        const result = await db.collection("announcement").aggregate([
            {
                $match: {
                    course_id: parsedCourseId // Filter by course_id
                }
            },
            {
                $sort: {
                    create_date: 1 // Sort by create_date in ascending order
                }
            },
            {
                $project: {
                    a_id: 1,
                    create_date: 1, // Include announcement creation date
                    context: 1, // Include announcement content
                    user_id: 1 // Include user ID of the creator
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchAnnouncements:", error);
        throw error;
    }
}

export { FetchAnnouncements };