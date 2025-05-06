import { FetchToDoAssignments, FetchUpcomingExams } from "#src/services/dashboard_service.js";

async function GetToDoAssignments(req, res) {
    try {
        // API testing
        // const toDoData = await FetchToDoAssignments(req.query.user_id);

        const toDoAssignments = await FetchToDoAssignments();
        res.status(200).json(toDoAssignments); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetToDoAssignments:", error);
        res.status(500).send("Failed to fetch to-do assignments");
    }
}

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

export { GetToDoAssignments, GetUpcomingExams };