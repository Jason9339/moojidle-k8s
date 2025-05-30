import express from 'express';
const router = express.Router();

import {
    GetCourseAnnouncements,
    CreateAnnouncement,
    EditAnnouncement,
    DeleteAnnouncement
} from '#src/controllers/announcement_controller.js';
import { Delete } from '#src/controllers/user_controller';

// ----- Announcement Routes -----
// entry point http://localhost:PORT/announcement

// GET /announcement/course/:courseId
router.get("/course/:courseId", GetCourseAnnouncements);

// POST /announcement/course/:courseId
router.post("/course/:courseId", CreateAnnouncement);

// POST /announcement/:announcementId/edit
router.post("/:announcementId/edit", EditAnnouncement);

// DELETE /announcement/:announcementId
// router.delete("/:announcementId/delete", DeleteAnnouncement);


export default router; 