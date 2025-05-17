import mongoose from "mongoose"

// Service function to retrieve all courses with user role information
async function ViewCourses(userId) {
    // console.log(`[ViewCourses] Attempting to fetch courses for user ID: ${userId}...`);
    try {
        // Convert userId to integer if provided
        const userIdInt = userId ? parseInt(userId, 10) : null;
        
        // Get all courses
        const coursesCollection = mongoose.connection.db.collection('course');
        const courses = await coursesCollection.find({}, {
            projection: {
                _id: 0,
                course_id: 1,
                name: 1,
                color: 1
            }
        }).toArray();
        
        // If no userId provided, just return basic course information
        if (!userId || isNaN(userIdInt)) {
            return courses.map(course => ({
                title: course.name,
                courseId: course.course_id,
                color: course.color
            }));
        }
        
        // Get courses where user is a teacher
        const teachInCollection = mongoose.connection.db.collection('teach_in');
        const teachingRecords = await teachInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const teachingCourseIds = new Set(teachingRecords.map(record => record.course_id));
        
        // Get courses where user is a student
        const studyInCollection = mongoose.connection.db.collection('study_in');
        const studyingRecords = await studyInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const studyingCourseIds = new Set(studyingRecords.map(record => record.course_id));
        
        // Get courses where user is an assistant
        const assistInCollection = mongoose.connection.db.collection('assist_in');
        const assistingRecords = await assistInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const assistingCourseIds = new Set(assistingRecords.map(record => record.course_id));
        
        // Format courses with role information and filter out courses with no relationship
        const formattedCourses = courses
            .map(course => ({
                title: course.name,
                courseId: course.course_id,
                color: course.color,
                isTeacher: teachingCourseIds.has(course.course_id) || false,
                isStudent: studyingCourseIds.has(course.course_id) || false,
                isAssistant: assistingCourseIds.has(course.course_id) || false
            }))
            .filter(course => course.isTeacher || course.isStudent || course.isAssistant);
        
        return formattedCourses;

    } catch (error) {
        console.error("[ViewCourses] Error fetching courses:", error);
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

async function GetInviteCode(courseId) {
    try {
        const parsedId = parseInt(courseId, 10);
        if (isNaN(parsedId)) {
            throw new Error("Invalid course ID format. Course ID must be an integer.");
        }
        
        const coursesCollection = mongoose.connection.db.collection('course');
        const course = await coursesCollection.findOne(
            { course_id: parsedId },
            { projection: { _id: 0, invite_link: 1 }} //WARN: link
        );

        // console.log(course);
        
        if (!course) {
            throw new Error(`Course with ID ${parsedId} not found`);
        }
        
        return course.invite_link;
    } catch (error) {
        throw new Error(`Failed to retrieve invite code: ${error.message}`);
    }
}





export {
    ViewCourses,
    GetTeachIn,
    GetInviteCode,
};



