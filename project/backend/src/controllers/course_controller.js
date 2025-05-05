import { FetchCourseData } from "#src/services/course_service.js";

async function GetCourseData(req, res) {
    try {
        // Call the service function to fetch course data

        // API testing
        // const courseData = await FetchCourseData(req.query.user_id);

        const courseData = await FetchCourseData();
        res.status(200).json(courseData); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetCourseData:", error);
        res.status(500).send("Failed to fetch course data");
    }
}

export { GetCourseData };