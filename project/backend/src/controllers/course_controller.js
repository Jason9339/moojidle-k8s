import {
    FindAllCourses,
    FindCourseInCourseId,
    InsertCourse,
    EditCourseName,
    DeleteCourse,
    FindCourseById,
    FindCourseIdByInviteCode
} from '#src/services/course_service.js';

import {
    FindTeachInByUserId,
    FindStudyInByUserId,
    FindAssistInByUserId,
    InsertTeachIn,
} from '#src/services/course_member_service.js';


// 取得所有課程列表
async function GetAllCourses(req, res) {
    try {
        const courses = await FindAllCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 創建課程
async function CreateCourse(req, res) {
    try {
        const courseData = req.body;

        // TDD 改進點 1: 更詳細的輸入驗證
        if (!courseData || Object.keys(courseData).length === 0) {
            return res.status(400).send({ message: "Lack of Course Data." });
        }
        
        /* TDD 改進建議：
        // 驗證必填字段
        if (!courseData.name) {
            return res.status(400).send({ message: "Course name is required" });
        }
        
        if (!courseData.userId) {
            return res.status(400).send({ message: "User ID is required" });
        }
        
        // 驗證用戶 ID 格式
        const userId = parseInt(courseData.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).send({ message: "Invalid user ID format" });
        }
        */
        
        // console.log("courseData", courseData);
        const newCourse = await InsertCourse(courseData);
        const newTeachIn = await InsertTeachIn(courseData.userId, newCourse.course_id);
        res.status(201).send(newCourse); // 返回新增的課程物件
    } catch (error) {
        console.error("Failed to create course", error);
        
        // TDD 改進點 2: 更智能的錯誤處理
        /* 建議改進：
        // 區分不同類型的錯誤
        if (error.message.includes('required') || error.message.includes('cannot be empty') || error.message.includes('too long')) {
            return res.status(400).send({ message: error.message });
        }
        */
        
        res.status(500).send({ message: "Failed to create course", error: error.message });
    }
}

// 刪除課程
async function RemoveCourse(req, res) {
    try {
        // 從路由參數獲取課程 ID
        const { id } = req.params;

        // 驗證 ID 是否存在
        if (!id) {
            return res.status(400).send({ message: "Lack of Course ID" });
        }

        const deletedRowCount = await DeleteCourse(id);

        // 根據刪除結果返回響應
        if (deletedRowCount > 0) {
            res.status(200).send({ message: `Successfully deleted course and its related data with ID = ${id}.` });
        } else {
            res.status(404).send({ message: `cannot find ID = ${id} course` });
        }
    } catch (error) {
        res.status(500).send({ message: "Fail to Delete course", error: error.message });
    }
}

// 讀取user有的課程
async function ReadCourse(req, res) {
    try {
        const userId = parseInt(req.params.user_id);
        // retrieve all courses with user role information
        let courses = await FindAllCourses();

        // get teaching courses
        let teachingRecords = await FindTeachInByUserId(userId);
        const teachingCourseIds = new Set(teachingRecords.map(record => record.course_id));

        // get assisting courses
        let assistingRecords = await FindAssistInByUserId(userId);
        const assistingCourseIds = new Set(assistingRecords.map(record => record.course_id));

        // get studying courses
        let studyingRecords = await FindStudyInByUserId(userId);
        const studyingCourseIds = new Set(studyingRecords.map(record => record.course_id));

        const formattedCourses = courses
            .map(course => ({
                title: course.name,
                courseId: course.course_id,
                color: course.color,
                isTeacher: teachingCourseIds.has(course.course_id) || false,
                isStudent: studyingCourseIds.has(course.course_id) || false,
                isAssistant: assistingCourseIds.has(course.course_id) || false,

                // adding 2 additional repeated attributes for axios services
                course_id: course.course_id,
                course_name: course.name,
                start_date: course.start_date,
                week_num: course.week_num
            }))
            .filter(course => course.isTeacher || course.isStudent || course.isAssistant);

        // 返回課程給客戶端
        res.status(200).json(formattedCourses);
    } catch (error) {
        console.error("[ReadCourse] Error fetching courses:", error);
        res.status(500).json({ message: "讀取課程列表失敗", error: error.message });
    }
}

// 獲取課程詳細資訊
async function GetCourseDetail(req, res) {
    try {
        const { courseId } = req.params;
        const courseDetails = await FindCourseById(courseId);
        res.status(200).json(courseDetails);
    } catch (error) {
        console.error("獲取課程詳情錯誤:", error);

        if (error.message === '找不到課程') {
            return res.status(404).json({ message: '找不到課程' });
        }

        res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
}

// 讀取教學關係
async function ReadTeachIn(req, res) {
    try {
        let userId = req.query.user_id;
        let teachingRecords = await FindTeachInByUserId(userId);

        if (teachingRecords.length === 0) {
            res.status(200).json([]);
            return;
        }

        const courseIds = teachingRecords.map(record => record.course_id);

        const courses = await FindCourseInCourseId(courseIds);

        const formattedCourses = courses.map(course => ({
            title: course.name,
            courseId: course.course_id,
        }));

        res.status(200).json(formattedCourses);
    } catch (error) {
        console.error("[TeachInCourse] Error fetching courses:", error);
        res.status(500).json({ message: "讀取teach_in失敗", error: error.message });
    }
}

// 編輯課程
async function EditCourse(req, res) {
    try {
        const updateData = req.body;
        const courseId = parseInt(req.params.id, 10);

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).send({ message: "Lack of update Data." });
        }

        const updatedData = await EditCourseName(courseId, updateData.name);
        res.status(200).send(updatedData); // 返回更新的課程物件
    } catch (error) {
        console.error("Failed to Edit course", error);
        res.status(500).send({ message: "Failed to Edit course", error: error.message });
    }
}

async function GetCourseIdByInviteCode(req, res) {
    try {
        const code = req.params.code;
        const courseId = await FindCourseIdByInviteCode(code);
        if (courseId) {
            res.status(200).json({ courseId: courseId.course_id });
        }
        else {
            res.status(404).json({ message: "Course not found" });
        }

    }
    catch (error) {
        console.error("Error getting course ID via invite code:", error);
        res.status(500).json({ error: error.message });
    }
}


export {
    GetAllCourses,
    CreateCourse,
    RemoveCourse,
    ReadCourse,
    GetCourseDetail,
    ReadTeachIn,
    EditCourse,
    GetCourseIdByInviteCode
};
