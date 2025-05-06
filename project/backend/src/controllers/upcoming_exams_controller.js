import { FetchUpcomingExams } from "#src/services/upcoming_exams_service.js";

async function GetUpcomingExams(req, res) {
    try {
        // API testing
        // const upcomingExams = await FetchUpcomingExams(req.query.user_id);

        const upcomingExams = await FetchUpcomingExams();
        res.status(200).json(upcomingExams); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetUpcomingExams:", error);
        res.status(500).send("Failed to fetch upcoming exams");
    }
}

export { GetUpcomingExams };
