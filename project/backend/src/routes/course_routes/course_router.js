import express from 'express';
const router = express.Router();

import {
    CreateCourse,
    RemoveCourse,
    ReadCourse,
    GetCourseDetail,
    ReadTeachIn,
    EditCourse,
    GetAllCourses,
    GetCourseIdByInviteCode
} from '#src/controllers/course_controllers/course_controller.js';

// 路由基礎地址: http://localhost:PORT/course

// getters -------------------------------------------------------------------------------------
// frontend gives user_id
// return:
// [
//     {
//         "title": "Course 1",
//         "courseId": 1,
//         "color": "#4A90E2",
//         "isTeacher": false,
//         "isStudent": false,
//         "isAssistant": true
//     },
// ...
router.get("/read", ReadCourse);

// frontend gives nothing
// return:
// [
//     {
//         "course_id": 1,
//         "name": "Course 1",
//         "description": "This is the description for course 1.",
//         "create_date": "2025-01-01T00:00:00.000Z"
//     },
// ...
router.get("/list", GetAllCourses); // 獲取所有課程列表

// frontend gives userId
// return:
// [
//     {
//         "title": "Course 1",
//         "courseId": 1
//     },
// ...
router.get("/read/teach_in", ReadTeachIn);

// posters
router.post("/create", CreateCourse);
router.post("/edit/:id", EditCourse);

// putters

// deleters
router.delete("/delete/:id", RemoveCourse);

// ----- 課程詳情路由 -----
// getters
router.get("/:courseId", GetCourseDetail);

router.get("/invite/:code", GetCourseIdByInviteCode);

export default router;
