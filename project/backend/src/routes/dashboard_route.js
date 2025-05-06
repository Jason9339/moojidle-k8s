import express from "express";
import { GetToDoAssignments, GetUpcomingExams } from "#src/controllers/dashboard_controller";

const router = express.Router();

// Endpoint to fetch "To-Do" items
router.get("/assignments", GetToDoAssignments);

// Endpoint to fetch "Upcoming Events"
router.get("/exams", GetUpcomingExams);

export default router;