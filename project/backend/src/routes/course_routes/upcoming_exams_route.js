import express from "express";
import { GetUpcomingExams } from "#src/controllers/course_controllers/upcoming_exams_controller.js";

const router = express.Router();

router.get("/coming", GetUpcomingExams);

export default router;
