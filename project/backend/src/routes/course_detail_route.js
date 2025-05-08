import express from 'express';
const router = express.Router();

import { 
    getWeeklyCourseDataController, 
    getAllCourses, 
    getCourseAnnouncements, 
    getCourseFiles, 
    getCourseAssignments, 
    getCourseSyllabus, 
    getCourseLink 
} from '#src/controllers/course_controller.js';

// 所有課程列表
router.get('/', getAllCourses);

// 獲取特定類型的資料 - 單獨端點
router.get('/:courseId/announcements', getCourseAnnouncements);
router.get('/:courseId/files', getCourseFiles);
router.get('/:courseId/materials', getCourseFiles); // alias
router.get('/:courseId/assignments', getCourseAssignments);
router.get('/:courseId/syllabus', getCourseSyllabus);
router.get('/:courseId/link', getCourseLink);
router.get('/:courseId/weeks', getWeeklyCourseDataController);

export default router;