import Course from '#src/models/course.js';
import Announcement from '#src/models/Announcement.js';
import Material from '#src/models/Material.js';
import Assignment from '#src/models/Assignment.js';

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