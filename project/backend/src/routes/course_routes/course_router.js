import express from 'express';
const router = express.Router();

import { 
  // 課程基本操作控制器
  CreateCourse,
  DeleteCourse,
  ReadCourse,
  GetCourseDetails,
  GetTeachingCourses,
  ReadTeachIn,
  EditCourse,
  ReadInviteCode,
  
  // 課程詳細資訊控制器
  GetAllCourses,
  GetCourseAnnouncements, 
  CreateAnnouncement,
  EditAnnouncement,
  GetCourseSyllabus, 
  GetCourseLink,

  // helper functions
  CanUserEditAnnouncements
} from '#src/controllers/course_controllers/course_controller.js';

import assignmentRouter from './assignment_route.js';
import materialRouter from './material_route.js';

// 路由基礎地址: http://localhost:PORT/course

// ----- 基本路由 -----
router.get("/", async (req, res) => {
    return res.status(200).send("Hello from course router!!");
});

// ----- 課程管理路由 -----
router.post("/create", CreateCourse);
router.delete("/delete/:id", DeleteCourse);
router.get("/read", ReadCourse);
router.get("/list", GetAllCourses); // 獲取所有課程列表
router.get("/read/teach_in", ReadTeachIn);
router.post("/edit/:id", EditCourse);

// 獲取教師的課程列表 - 注意：此路由必須在 /:courseId 路由之前
router.get("/teaching", GetTeachingCourses);

// ----- 課程詳情路由 -----
router.get("/:courseId", GetCourseDetails);
router.get("/:courseId/announcements/read", GetCourseAnnouncements);
router.post("/:courseId/announcements/create", CreateAnnouncement);
router.post("/:announcementId/announcements/edit", EditAnnouncement);
// router.get("/:courseId/files", GetCourseFiles);
// router.get("/:courseId/materials", GetCourseFiles); // files 的別名
// router.post("/:courseId/materials", UpdateCourseMaterials); // 更新教材
// router.delete("/:courseId/materials/:materialId", DeleteCourseMaterial); // 刪除教材
// router.get("/:courseId/assignments", GetCourseAssignments);
router.get("/:courseId/syllabus", GetCourseSyllabus);
router.get("/:courseId/link", GetCourseLink);
router.get("/:courseId/inviteCode", ReadInviteCode);

// 掛載 assignment/material 子路由
router.use('/', assignmentRouter);
router.use('/', materialRouter);

// helper functions
router.get("/can_edit_announcements/:userId/:courseId", CanUserEditAnnouncements);

export default router;
