import express from 'express';
const router = express.Router();

import { 
    GetCourseDiscussionBoard,
    GetAllCourseDiscussionBoard,
    AddDiscussionBoard, 
    DeleteDiscussionBoard,
    EditDiscussionBoard
} from '#src/controllers/discussion_board_controller.js';

router.get("/course-boards/:courseId", GetCourseDiscussionBoard);
router.get("/user-course-boards/:userId", GetAllCourseDiscussionBoard);

router.post("/course-boards", AddDiscussionBoard)

router.delete("/course-boards/:boardId", DeleteDiscussionBoard)

router.patch("/course-boards/:boardId", EditDiscussionBoard)

export default router;