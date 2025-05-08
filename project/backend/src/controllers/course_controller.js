import Course from '#src/models/course.js';
import Announcement from '#src/models/Announcement.js';
import Material from '#src/models/Material.js';
import Assignment from '#src/models/Assignment.js';
import mongoose from 'mongoose';

// 取得所有課程列表
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, 'course_id name description create_date');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的公告
export const getCourseAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.params;
        const announcements = await Announcement.find({ course_id: parseInt(courseId) })
            .sort({ create_date: -1 }); // 依日期降序排列
        res.json(announcements);
    } catch (error) {
        console.error("取得課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的檔案
export const getCourseFiles = async (req, res) => {
    try {
        const { courseId } = req.params;
        const materials = await Material.find({ in_course_id: parseInt(courseId) })
            .sort({ create_date: -1 }); // 依日期降序排列
        
        const files = materials.map(material => ({
            id: material.m_id,
            name: material.m_name,
            url: material.url,
            description: material.description,
            uploadDate: material.create_date
        }));
        
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
        const assignments = await Assignment.find({ in_course_id: parseInt(courseId) })
            .sort({ end_date: 1 }); // 依截止日期升序排列
        
        const formattedAssignments = assignments.map(assignment => ({
            id: assignment.ass_id,
            name: assignment.ass_name,
            description: assignment.description,
            dueDate: assignment.end_date,
            attachments: assignment.attachments || []
        }));
        
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
        const course = await Course.findOne({ course_id: parseInt(courseId) });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ syllabus: course.syllabus || "尚無課程大綱資料" });
    } catch (error) {
        console.error("取得課程大綱錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 取得特定課程的連結
export const getCourseLink = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({ course_id: parseInt(courseId) });
        
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ link: course.invite_link || "尚無課程連結" });
    } catch (error) {
        console.error("取得課程連結錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

// 修改原有函數，增加週次查詢參數
export const getWeeklyCourseDataController = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { week } = req.query; // 獲取週次參數
        const weekNumber = week ? parseInt(week) : 1; // 預設為第1週

        // 查詢課程基本資訊
        const course = await Course.findOne({ course_id: parseInt(courseId) });
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // 查詢公告
        const announcements = await Announcement.find({ course_id: parseInt(courseId) });

        // 查詢教材
        const materials = await Material.find({ in_course_id: parseInt(courseId) });

        // 查詢作業
        const assignments = await Assignment.find({ in_course_id: parseInt(courseId) });

        // 整合每周資料 (目前數據庫沒有週次區分，所以模擬一下)
        const weeks = [];
        
        // 模擬週次資料 - 實際應用中應根據資料庫中的週次進行過濾
        for (let i = 1; i <= 16; i++) {
            // 只添加被請求的週次或者預設週次
            if (i === weekNumber) {
                weeks.push({
                    weekNumber: i,
                    syllabus: course.syllabus || "尚無課程大綱資料",
                    link: course.invite_link || "尚無課程連結",
                    announcement: announcements.length > 0 ? announcements[0].context : "尚無公告訊息",
                    files: materials.length > 0 ? 
                        materials.map(material => ({
                            name: material.m_name,
                            url: material.url,
                            description: material.description,
                            uploadDate: material.create_date
                        })) : [],
                    assignments: assignments.length > 0 ? 
                        assignments.map(assignment => ({
                            id: assignment.ass_id,
                            name: assignment.ass_name,
                            description: assignment.description,
                            dueDate: assignment.end_date,
                            attachments: assignment.attachments || []
                        })) : []
                });
                break;
            }
        }

        res.json({
            course_id: course.course_id,
            name: course.name,
            description: course.description,
            totalWeeks: 16, // 假設一個學期有16週
            currentWeek: weekNumber,
            weeks
        });
    } catch (error) {
        console.error("週課程資料查詢錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};


import { AddCourse, AddTeachIn, RemoveCourse, RemoveCourseRelationships, ChangeCourseName } from "#src/services/modify_course.js";
import { ViewCourses, GetTeachIn } from "#src/services/view_course.js";




async function CreateCourse(req, res) {
    try {
        const courseData = req.body;

        console.log("courseData", courseData);
        if (!courseData || Object.keys(courseData).length === 0) {
            return res.status(400).send({ message: "Lack of Course Data." });
        }
        console.log("courseData", courseData);
        const newCourse = await AddCourse(courseData);
        const newTeachIn = await AddTeachIn(courseData.user_id, newCourse.course_id);
        res.status(201).send(newCourse); // 返回新增的課程物件

    } catch (error) {
        console.error("Failed to create course", error);
        res.status(500).send({ message: "Failed to create course", error: error.message });
    }
}

async function DeleteCourse(req, res) {
    try {
        // 1. 從路由參數獲取課程 ID
        const { id } = req.params;
        console.log("DeleteCourse ID:", req.params);

        // 2. 驗證 ID 是否存在
        if (!id) {
            return res.status(400).send({ message: "Lack of Course ID" });
        }

        // 3. 調用 Service 層的 RemoveCourse 函式處理刪除邏輯
        //    假設 RemoveCourse 返回刪除的行數
        const deletedRowCount = await RemoveCourse(id);

        // 4. 根據刪除結果返回響應
        if (deletedRowCount > 0) {
            // Successfully deleted the main course document
            // console.log(`Successfully deleted course with ID = ${id}. Now deleting related data...`);

            // 4a. Call the service function to delete related data
            // Convert id to integer again for the relationship deletion function
            const courseIdInt = parseInt(id, 10);
            await RemoveCourseRelationships(courseIdInt); // Call the new function

            // 4b. Send success response after all deletions are attempted
            res.status(200).send({ message: `Successfully deleted course and its related data with ID = ${id}.` });
            // 或者返回 204 No Content，不帶響應體
            // res.status(204).send();
        } else {
            // 未找到對應 ID 的課程
            res.status(404).send({ message: `cannot find ID = ${id} course` });
        }

    } catch (error) {
        // 5. 如果過程中發生錯誤
        // console.error("刪除課程時發生錯誤:", error);
        res.status(500).send({ message: "Fail to Delete course", error: error.message });
    }
}

// Controller function to handle reading/viewing all courses
async function ReadCourse(req, res) {
    try {
        console.log("[ReadCourse] Request received to fetch courses.");
        // Call the service function to get formatted courses
        const courses = await ViewCourses();

        // Send the courses back to the client with a 200 OK status
        res.status(200).json(courses); // Use .json() to correctly set Content-Type

    } catch (error) {
        // If the service layer throws an error
        console.error("[ReadCourse] Error fetching courses:", error);
        res.status(500).json({ message: "讀取課程列表失敗", error: error.message });
    }
}

// 獲取課程詳細資訊
async function GetCourseDetails(req, res) {
    try {
        const { courseId } = req.params;
        
        // 查詢課程基本資訊
        const course = await Course.findOne({ course_id: parseInt(courseId) });
        if (!course) {
            return res.status(404).json({ message: '找不到課程' });
        }
        
        // 整合所有課程信息到一個物件中返回
        res.status(200).json({
            id: course.course_id,
            title: course.name,
            description: course.description,
            syllabus: course.syllabus || "",
            createDate: course.create_date,
            inviteLink: course.invite_link || ""
        });
    } catch (error) {
        console.error("獲取課程詳情錯誤:", error);
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
        
        // 從 teach_in 集合中查詢用戶授課的所有課程ID
        const teachInRecords = await mongoose.connection.db.collection('teach_in')
            .find({ user_id: parseInt(userId) })
            .toArray();
        
        // 如果沒有找到任何教授記錄
        if (!teachInRecords || teachInRecords.length === 0) {
            return res.json([]); // 返回空數組
        }
        
        // 提取所有課程ID
        const courseIds = teachInRecords.map(record => record.course_id);
        
        // 查詢這些課程的詳細資訊
        const courses = await Course.find({ course_id: { $in: courseIds } });
        
        // 將課程資訊轉換為前端需要的格式
        const formattedCourses = courses.map(course => ({
            title: course.name,
            courseId: course.course_id,
            description: course.description,
            color: "#4A90E2", // 預設顏色
            isTeacher: true
        }));
        
        res.json(formattedCourses);
    } catch (error) {
        console.error("獲取教師課程錯誤:", error);
        res.status(500).json({ message: "伺服器錯誤", error: error.message });

async function ReadTeachIn(req, res) {
    try {
        console.log("[TeachIn] Request received to fetch courses.");
        // Call the service function to get formatted courses
        const teach_in = await (GetTeachIn(req.query.user_id));

        // Send the courses back to the client with a 200 OK status
        res.status(200).json(teach_in); // Use .json() to correctly set Content-Type

    } catch (error) {
        // If the service layer throws an error
        console.error("[TeachInCourse] Error fetching courses:", error);
        res.status(500).json({ message: "讀取teach_in失敗", error: error.message });
    }
}

async function EditCourse(req, res) {
    try {
        const updateData = req.body
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

export {
    CreateCourse,
    DeleteCourse,
    ReadCourse,
    GetCourseDetails,
    GetTeachingCourses,
    ReadTeachIn,
    EditCourse
};