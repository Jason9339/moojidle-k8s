import express from "express";
import { GetUpcomingExams } from "#src/controllers/upcoming_exams_controller.js";

const router = express.Router();

router.get("/coming", GetUpcomingExams);

export default router;
