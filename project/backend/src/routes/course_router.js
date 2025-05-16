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
  getAllCourses,
  getCourseAnnouncements, 
  createAnnouncement,
  editAnnouncement,
  getCourseFiles, 
  getCourseAssignments, 
  getCourseSyllabus, 
  getCourseLink,

  // helper functions
  canUserEditAnnouncements,
  
  // 教材操作控制器
  updateCourseMaterials,
  deleteCourseMaterial
} from '#src/controllers/course_controller.js';

// 路由基礎地址: http://localhost:PORT/course

// ----- 基本路由 -----
router.get("/", async (req, res) => {
    return res.status(200).send("Hello from course router!!");
});

// ----- 課程管理路由 -----
router.post("/create", CreateCourse);
router.delete("/delete/:id", DeleteCourse);
router.get("/read", ReadCourse);
router.get("/list", getAllCourses); // 獲取所有課程列表
router.get("/read/teach_in", ReadTeachIn);
router.post("/edit/:id", EditCourse);

// 獲取教師的課程列表 - 注意：此路由必須在 /:courseId 路由之前
router.get("/teaching", GetTeachingCourses);

// ----- 課程詳情路由 -----
router.get("/:courseId", GetCourseDetails);
router.get("/:courseId/announcements/read", getCourseAnnouncements);
router.post("/:courseId/announcements/create", createAnnouncement);
router.post("/:announcementId/announcements/edit", editAnnouncement);
router.get("/:courseId/files", getCourseFiles);
router.get("/:courseId/materials", getCourseFiles); // files 的別名

// ----- 教材管理路由 -----
router.post("/:courseId/materials", updateCourseMaterials); // 更新教材
router.delete("/:courseId/materials/:materialId", deleteCourseMaterial); // 刪除教材

router.get("/:courseId/assignments", getCourseAssignments);
router.get("/:courseId/syllabus", getCourseSyllabus);
router.get("/:courseId/link", getCourseLink);
router.get("/:courseId/inviteCode", ReadInviteCode);

// helper functions
router.get("/can_edit_announcements/:userId/:courseId", canUserEditAnnouncements);

export default router;
