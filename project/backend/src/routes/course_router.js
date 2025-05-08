import express from 'express';
const router = express.Router();

import { 
  CreateCourse,
  DeleteCourse,
  ReadCourse,
  GetCourseDetails,
  GetTeachingCourses,
  ReadTeachIn,
  EditCourse
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
router.get("/read/teach_in", ReadTeachIn);
router.post("/edit/:id", EditCourse);

// 獲取教師的課程列表 - 注意：此路由必須在 /:courseId 路由之前
router.get("/teaching", GetTeachingCourses);

// 獲取課程詳情
router.get("/:courseId", GetCourseDetails);

export default router;