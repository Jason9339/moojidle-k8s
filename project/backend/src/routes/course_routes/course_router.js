import express from 'express';
const router = express.Router();

import { 
  // 課程基本操作控制器
  CreateCourse,
  DeleteCourse,
  ReadCourse,
  GetCourseDetails,
  ReadTeachIn,
  EditCourse,
  ReadInviteCode,
  
  // 課程詳細資訊控制器
  GetAllCourses
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


// ----- 課程詳情路由 -----
router.get("/:courseId", GetCourseDetails);
router.get("/:courseId/inviteCode", ReadInviteCode);

export default router;
