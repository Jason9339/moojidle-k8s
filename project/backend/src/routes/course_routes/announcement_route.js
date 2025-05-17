import express from 'express';
const router = express.Router();

import {
    GetCourseAnnouncements,
    CreateAnnouncement,
    EditAnnouncement,
    CanUserEditAnnouncements
} from '#src/controllers/course_controllers/announcement_controller.js';

// ----- Announcement Routes -----
// Base path for these routes will be mounted on /course or similar in main.js

// GET /course/:courseId/announcements/read
router.get("/:courseId/announcements/read", GetCourseAnnouncements);

// POST /course/:courseId/announcements/create
router.post("/:courseId/announcements/create", CreateAnnouncement);

// POST /announcements/:announcementId/edit
router.post("/:announcementId/announcements/edit", EditAnnouncement);


// GET /can_edit_announcements/:userId/:courseId (This was a top-level route in course_router)
// If announcement_router is mounted at /course, this becomes /course/can_edit_announcements/:userId/:courseId
router.get("/can_edit_announcements/:userId/:courseId", CanUserEditAnnouncements);

export default router; 