import { FetchToDoAssignments } from "#src/services/todo_assignments_service.js";

async function GetToDoAssignments(req, res) {
    try {
        const toDoAssignments = await FetchToDoAssignments(req.query.user_id);
        res.status(200).json(toDoAssignments); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetToDoAssignments:", error);
        res.status(500).send("Failed to fetch to-do assignments");
    }
}

export { GetToDoAssignments };
