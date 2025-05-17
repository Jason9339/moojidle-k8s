import express from 'express';
const router = express.Router();

import {
    GetCourseAnnouncements,
    CreateAnnouncement,
    EditAnnouncement
} from '#src/controllers/course_controllers/announcement_controller.js';

// ----- Announcement Routes -----
// Base path for these routes will be mounted on /course or similar in main.js

// GET /announcement/course/:courseId
router.get("/course/:courseId", GetCourseAnnouncements);

// POST /announcement/course/:courseId
router.post("/course/:courseId", CreateAnnouncement);

// POST /announcement/:announcementId/edit
router.post("/:announcementId/edit", EditAnnouncement);


export default router; 