import { 
    getAllCourses as getAllCoursesService,
    getAnnouncementsByCourseId,
    createAnnouncement as createAnnouncementService,
    editAnnouncement as editAnnouncementService,
    getMaterialsByCourseId,
    getAssignmentsByCourseId,
    getCourseSyllabus as getCourseSyllabusService,
    getCourseLink as getCourseLinkService,
    getCourseDetails as getCourseDetailsService,
    getTeachingCourses as getTeachingCoursesService,
    canUserEditAnnouncements as canUserEditAnnouncementsService
} from '#src/services/course_service.js';

import { 
    AddCourse, 
    AddTeachIn, 
    RemoveCourse, 
    RemoveCourseRelationships, 
    ChangeCourseName 
} from "#src/services/modify_course.js";

import { 
    ViewCourses, 
    GetTeachIn,
    getInviteCode,
} from "#src/services/view_course.js";

// 取得所有課程列表
export const getAllCourses = async (req, res) => {
    try {
        const courses = await getAllCoursesService();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的公告
export const getCourseAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.params;
        const announcements = await getAnnouncementsByCourseId(courseId);
        res.json(announcements);
    } catch (error) {
        console.error("取得課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createAnnouncement = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { context, userId, announceDate } = req.body;
        const announcement = await createAnnouncementService(courseId, context, userId, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("新增課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

export const editAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { context, announceDate } = req.body;
        const announcement = await editAnnouncementService(announcementId, context, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("更改課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的檔案
export const getCourseFiles = async (req, res) => {
    try {
        const { courseId } = req.params;
        const files = await getMaterialsByCourseId(courseId);
        res.json(files);
    } catch (error) {
        console.error("取得課程檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的作業
export const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const formattedAssignments = await getAssignmentsByCourseId(courseId);
        res.json(formattedAssignments);
    } catch (error) {
        console.error("取得課程作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的 syllabus
export const getCourseSyllabus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const syllabusData = await getCourseSyllabusService(courseId);
        res.json(syllabusData);
    } catch (error) {
        console.error("取得課程大綱錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的連結
export const getCourseLink = async (req, res) => {
    try {
        const { courseId } = req.params;
        const linkData = await getCourseLinkService(courseId);
        res.json(linkData);
    } catch (error) {
        console.error("取得課程連結錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

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
async function GetCourseDetails(req, res) {
    try {
        const { courseId } = req.params;
        const courseDetails = await getCourseDetailsService(courseId);
        res.status(200).json(courseDetails);
    } catch (error) {
        console.error("獲取課程詳情錯誤:", error);
        
        if (error.message === '找不到課程') {
            return res.status(404).json({ message: '找不到課程' });
        }
        
        res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
}

// 獲取用戶教授的課程
async function GetTeachingCourses(req, res) {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ message: '缺少用戶ID參數' });
        }
        
        const formattedCourses = await getTeachingCoursesService(userId);
        res.json(formattedCourses);
    } catch (error) {
        console.error("獲取教師課程錯誤:", error);
        res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
}

// 讀取教學關係
async function ReadTeachIn(req, res) {
    try {
        // 調用服務函數獲取教學關係
        const teach_in = await GetTeachIn(req.query.user_id);

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
        const code = await getInviteCode(courseId);
        return res.status(200).json({ code: code });
    } catch (error) {
        throw new Error(`Failed to retrieve invite code: ${error.message}`);
    }
}

export const canUserEditAnnouncements = async (req, res) => {
    const { courseId, userId } = req.params;
    try {
        const enrolled = await canUserEditAnnouncementsService(courseId, userId);
        res.status(200).json(enrolled);
    } catch (error) {
        console.error("Failed to check user enrollment:", error);
        res.status(500).json({ message: "Failed to check user enrollment" });
    }
};

export {
    CreateCourse,
    DeleteCourse,
    ReadCourse,
    GetCourseDetails,
    GetTeachingCourses,
    ReadTeachIn,
    EditCourse,
    ReadInviteCode,
};
