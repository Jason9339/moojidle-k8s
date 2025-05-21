import express from 'express';
const router = express.Router();

import {
    GetCalendarEvents
} from '#src/controllers/calendar_controller.js';

// The router starts at "/calendar/"
// getters
// In : courseId
// Out:
// [
// 
//  {due_date, title, description, label: "exam"}
//
//
//
//
// ]

router.get("/get-events/:userId", GetCalendarEvents);
export default router;
