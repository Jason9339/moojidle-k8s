import { 
    GetAllCourses,
    GetCourseDetails,
    AddCourse,
    RemoveCourse,
    RemoveCourseRelationships,
    ChangeCourseName,
    GetInviteCode,
    GetCoursesByTeacherId,
    ViewCourses
} from '#src/services/course_services/course_service.js';

import {
    AddTeachIn
} from '#src/services/course_services/course_member_service.js';


// 取得所有課程列表
async function GetAllCoursesController(req, res) {
    try {
        const courses = await GetAllCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 創建課程
async function CreateCourse(req, res) {
    try {
        const courseData = req.body;

        // console.log("courseData", courseData);
        if (!courseData || Object.keys(courseData).length === 0) {
            return res.status(400).send({ message: "Lack of Course Data." });
        }
        // console.log("courseData", courseData);
        const newCourse = await AddCourse(courseData);
        const newTeachIn = await AddTeachIn(courseData.userId, newCourse.course_id);
        res.status(201).send(newCourse); // 返回新增的課程物件
    } catch (error) {
        console.error("Failed to create course", error);
        res.status(500).send({ message: "Failed to create course", error: error.message });
    }
}

// 刪除課程
async function DeleteCourse(req, res) {
    try {
        // 從路由參數獲取課程 ID
        const { id } = req.params;

        // 驗證 ID 是否存在
        if (!id) {
            return res.status(400).send({ message: "Lack of Course ID" });
        }

        // 調用 Service 層的 RemoveCourse 函式處理刪除邏輯
        const deletedRowCount = await RemoveCourse(id);

        // 根據刪除結果返回響應
        if (deletedRowCount > 0) {
            // 刪除課程相關資料
            const courseIdInt = parseInt(id, 10);
            await RemoveCourseRelationships(courseIdInt);

            // 發送成功響應
            res.status(200).send({ message: `Successfully deleted course and its related data with ID = ${id}.` });
        } else {
            // 未找到對應 ID 的課程
            res.status(404).send({ message: `cannot find ID = ${id} course` });
        }
    } catch (error) {
        res.status(500).send({ message: "Fail to Delete course", error: error.message });
    }
}

// 讀取user有的課程
async function ReadCourse(req, res) {
    try {
        const userId = req.query.user_id;
        // 調用服務函數獲取格式化的課程
        const courses = await ViewCourses(userId);

        // 返回課程給客戶端
        res.status(200).json(courses);
    } catch (error) {
        console.error("[ReadCourse] Error fetching courses:", error);
        res.status(500).json({ message: "讀取課程列表失敗", error: error.message });
    }
}

// 獲取課程詳細資訊
async function GetCourseDetailsController(req, res) {
    try {
        const { courseId } = req.params;
        const courseDetails = await GetCourseDetails(courseId);
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
        // 調用服務函數獲取教學關係
        const teach_in = await GetCoursesByTeacherId(req.query.user_id);

        // 返回結果給客戶端
        res.status(200).json(teach_in);
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
        
        const updatedData = await ChangeCourseName(courseId, updateData.name);
        res.status(200).send(updatedData); // 返回更新的課程物件
    } catch (error) {
        console.error("Failed to Edit course", error);
        res.status(500).send({ message: "Failed to Edit course", error: error.message });
    }
}

async function ReadInviteCode(req, res) {
    try {
        const courseId = req.params.courseId;
        // console.log(courseId);
        const code = await GetInviteCode(courseId);
        return res.status(200).json({ code: code });
    } catch (error) {
        throw new Error(`Failed to retrieve invite code: ${error.message}`);
    }
}

export {
    GetAllCoursesController as GetAllCourses,
    CreateCourse,
    DeleteCourse,
    ReadCourse,
    GetCourseDetailsController as GetCourseDetails,
    ReadTeachIn,
    EditCourse,
    ReadInviteCode
};
