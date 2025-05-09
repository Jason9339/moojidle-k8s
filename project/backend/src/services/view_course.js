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
                name: 1,
                color:1
            }
        }).toArray();

        // console.log(`[ViewCourses] Found ${courses.length} courses.`);

        // Map the database results to the desired frontend format
        const formattedCourses = courses.map(course => ({
            title: course.name,       // Map name to title
            courseId: course.course_id, // Use the integer course_id
            color:course.color
        }));

        // console.log("[ViewCourses] Returning formatted courses:", JSON.stringify(formattedCourses, null, 2));
        return formattedCourses;

    } catch (error) {
        console.error("[ViewCourses] Error fetching courses:", error);
        // Re-throw the error for the controller to handle
        throw new Error(`Failed to retrieve courses: ${error.message}`);
    }
}

async function GetTeachIn(userId) {
    // console.log(`[GetTeachIn] Attempting to fetch courses taught by user ID: ${userId}`);
    try {
        // 1. Validate and convert userId to integer
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
            throw new Error("Invalid user ID format. User ID must be an integer.");
        }

        // 2. Find course_ids the user teaches from 'teach_in' collection
        const teachInCollection = mongoose.connection.db.collection('teach_in');
        const teachingRecords = await teachInCollection.find(
            { user_id: userIdInt },
            { projection: { _id: 0, course_id: 1 } } // Only need course_id
        ).toArray();

        if (teachingRecords.length === 0) {
            // console.log(`[GetTeachIn] User ID ${userIdInt} not found teaching any courses.`);
            return []; // Return empty array if user teaches no courses
        }

        // 3. Extract the course IDs
        const courseIds = teachingRecords.map(record => record.course_id);
        // console.log(`[GetTeachIn] User ID ${userIdInt} teaches course IDs:`, courseIds);

        // 4. Find course details from 'course' collection for the extracted IDs
        const coursesCollection = mongoose.connection.db.collection('course');
        const courses = await coursesCollection.find(
            { course_id: { $in: courseIds } }, // Find courses matching the IDs
            { projection: { _id: 0, course_id: 1, name: 1 } } // Get ID and name
        ).toArray();

        // console.log(`[GetTeachIn] Found ${courses.length} course details.`);

        // 5. Map the course details to the desired frontend format
        const formattedCourses = courses.map(course => ({
            title: course.name,
            courseId: course.course_id,
            // Add other fields if needed, e.g., a flag indicating it's a teaching course
            // isTeacher: true // Example
        }));

        // console.log("[GetTeachIn] Returning formatted courses:", JSON.stringify(formattedCourses, null, 2));
        return formattedCourses;

    } catch (error) {
        // console.error(`[GetTeachIn] Error fetching courses for user ID ${userId}:`, error);
        // Re-throw the error for the controller to handle
        throw new Error(`Failed to retrieve courses taught by user: ${error.message}`);
    }
}


export {
    ViewCourses,
    GetTeachIn
};



