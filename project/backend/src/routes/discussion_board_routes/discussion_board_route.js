import express from 'express';
const router = express.Router();

import { 
    GetCourseDiscussionBoard,
} from '#src/controllers/discussion_board_controllers/discussion_board_controller.js';


router.get("/course-boards", GetCourseDiscussionBoard);

export default router;