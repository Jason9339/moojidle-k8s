import express from 'express';
const router = express.Router();

import { 
  CreateCourse,
  DeleteCourse,
  ReadCourse,
  GetCourseDetails,
  GetTeachingCourses,
  // 新增以下控制器引用
  getCourseFiles,
  getCourseAssignments,
  getCourseAnnouncements,
  getCourseSyllabus
} from '#src/controllers/course_controller.js';

// the route address start from:
// http://localhost:PORT/course

// 基本路由
router.get("/", async (req, res) => {
    return res.status(200).send("Hello from course router!!");
})
router.post("/create", CreateCourse);
router.delete("/delete/:id", DeleteCourse);
router.get("/read", ReadCourse);

// 獲取教師的課程列表 - 注意：此路由必須在 /:courseId 路由之前
router.get("/teaching", GetTeachingCourses);

// 課程專頁相關路由 - 必須在 /:courseId 路由之前
router.get("/:courseId/files", getCourseFiles);
router.get("/:courseId/materials", getCourseFiles);  // 別名，與前端保持一致
router.get("/:courseId/assignments", getCourseAssignments);
router.get("/:courseId/announcements", getCourseAnnouncements);
router.get("/:courseId/syllabus", getCourseSyllabus);

// 獲取課程詳情 - 放在最後避免攔截其他路由
router.get("/:courseId", GetCourseDetails);

export default router;
