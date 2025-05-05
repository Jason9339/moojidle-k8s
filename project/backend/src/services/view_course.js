import mongoose from "mongoose"

// Service function to retrieve all courses and format them
async function ViewCourses() {
    // console.log("[ViewCourses] Attempting to fetch all courses...");
    try {
        const coursesCollection = mongoose.connection.db.collection('course');

        // Find all courses, projecting only the necessary fields
        const courses = await coursesCollection.find({}, {
            projection: {
                _id: 0, // Exclude the default MongoDB _id
                course_id: 1,
                name: 1
            }
        }).toArray();

        // console.log(`[ViewCourses] Found ${courses.length} courses.`);

        // Map the database results to the desired frontend format
        const formattedCourses = courses.map(course => ({
            title: course.name,       // Map name to title
            courseId: course.course_id, // Use the integer course_id
            color:"#2ECC71"
            // 'color' field is not available in the database schema
        }));

        // console.log("[ViewCourses] Returning formatted courses:", JSON.stringify(formattedCourses, null, 2));
        return formattedCourses;

    } catch (error) {
        console.error("[ViewCourses] Error fetching courses:", error);
        // Re-throw the error for the controller to handle
        throw new Error(`Failed to retrieve courses: ${error.message}`);
    }
}

export {
    ViewCourses
};



