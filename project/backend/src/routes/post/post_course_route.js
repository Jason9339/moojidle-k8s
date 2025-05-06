import express from 'express';
const post_course_router = express.Router();

import { GetCourseName } from "#src/controllers/post_controller.js";

post_course_router.get("/:id", GetCourseName);

export default post_course_router;
