import express from "express";
import { GetCourseData } from "#src/controllers/course_controller.js";

const router = express.Router();

// Endpoint: GET /course
router.get("/", GetCourseData);

export default router;