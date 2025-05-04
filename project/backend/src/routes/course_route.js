import express from 'express';
import { 
    getWeeklyCourseDataController, 
    getAllCourses, 
    getCourseAnnouncements, 
    getCourseFiles, 
    getCourseAssignments, 
    getCourseSyllabus, 
    getCourseLink 
} from '#src/controllers/course_controller.js';

const router = express.Router();

// 取得所有課程列表
router.get('/', getAllCourses);

// 獲取特定類型的資料 - 單獨端點
router.get('/:courseId/announcements', getCourseAnnouncements);
router.get('/:courseId/files', getCourseFiles);
router.get('/:courseId/assignments', getCourseAssignments);
router.get('/:courseId/syllabus', getCourseSyllabus);
router.get('/:courseId/link', getCourseLink);

// 取得課程的每周資料（支援週次參數）
router.get('/:courseId/weeks', getWeeklyCourseDataController);

export default router;