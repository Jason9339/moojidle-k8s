import express from 'express';
const router = express.Router();

import {
    GetCourseAnnouncements,
    CreateAnnouncement,
    EditAnnouncement
} from '#src/controllers/course_controllers/announcement_controller.js';

// ----- Announcement Routes -----
// entry point http://localhost:PORT/announcement

// GET /announcement/course/:courseId
router.get("/course/:courseId", GetCourseAnnouncements);

// POST /announcement/course/:courseId
router.post("/course/:courseId", CreateAnnouncement);

// POST /announcement/:announcementId/edit
router.post("/:announcementId/edit", EditAnnouncement);


export default router; 