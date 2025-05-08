import mongoose from 'mongoose';

// 查詢課程基本資訊
async function getCourseById(courseId) {
    try {
        return await mongoose.connection.db.collection('course').findOne({ course_id: parseInt(courseId) });
    } catch (error) {
        console.error(`[getCourseById] Error fetching course with ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course: ${error.message}`);
    }
}

// 查詢課程公告
async function getAnnouncementsByCourseId(courseId) {
    try {
        return await mongoose.connection.db.collection('announcement')
            .find({ course_id: parseInt(courseId) })
            .sort({ create_date: -1 }) // 依日期降序排列
            .toArray();
    } catch (error) {
        console.error(`[getAnnouncementsByCourseId] Error fetching announcements for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course announcements: ${error.message}`);
    }
}

// 查詢課程教材
async function getMaterialsByCourseId(courseId) {
    try {
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ create_date: -1 }) // 依日期降序排列
            .toArray();
        
        return materials.map(material => ({
            id: material.m_id,
            name: material.m_name,
            url: material.url,
            description: material.description,
            uploadDate: material.create_date
        }));
    } catch (error) {
        console.error(`[getMaterialsByCourseId] Error fetching materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

// 查詢課程作業
async function getAssignmentsByCourseId(courseId) {
    try {
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ end_date: 1 }) // 依截止日期升序排列
            .toArray();
        
        return assignments.map(assignment => ({
            id: assignment.ass_id,
            name: assignment.ass_name,
            description: assignment.description,
            dueDate: assignment.end_date,
            attachments: assignment.attachments || []
        }));
    } catch (error) {
        console.error(`[getAssignmentsByCourseId] Error fetching assignments for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course assignments: ${error.message}`);
    }
}

// 獲取所有課程
async function getAllCourses() {
    try {
        return await mongoose.connection.db.collection('course')
            .find({})
            .project({ course_id: 1, name: 1, description: 1, create_date: 1, _id: 0 })
            .toArray();
    } catch (error) {
        console.error("[getAllCourses] Error fetching all courses:", error);
        throw new Error(`Failed to retrieve all courses: ${error.message}`);
    }
}

// 獲取課程大綱
async function getCourseSyllabus(courseId) {
    try {
        const course = await mongoose.connection.db.collection('course')
            .findOne({ course_id: parseInt(courseId) });
        
        if (!course) {
            throw new Error('Course not found');
        }
        
        return { syllabus: course.syllabus || "尚無課程大綱資料" };
    } catch (error) {
        console.error(`[getCourseSyllabus] Error fetching syllabus for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course syllabus: ${error.message}`);
    }
}

// 獲取課程連結
async function getCourseLink(courseId) {
    try {
        const course = await mongoose.connection.db.collection('course')
            .findOne({ course_id: parseInt(courseId) });
        
        if (!course) {
            throw new Error('Course not found');
        }
        
        return { link: course.invite_link || "尚無課程連結" };
    } catch (error) {
        console.error(`[getCourseLink] Error fetching link for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course link: ${error.message}`);
    }
}

// 獲取課程詳細資訊
async function getCourseDetails(courseId) {
    try {
        const course = await mongoose.connection.db.collection('course')
            .findOne({ course_id: parseInt(courseId) });
        
        if (!course) {
            throw new Error('找不到課程');
        }
        
        return {
            id: course.course_id,
            title: course.name,
            description: course.description,
            syllabus: course.syllabus || "",
            createDate: course.create_date,
            inviteLink: course.invite_link || ""
        };
    } catch (error) {
        console.error(`[getCourseDetails] Error fetching details for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course details: ${error.message}`);
    }
}

// 獲取週課程資料
async function getWeeklyCourseData(courseId, week = 1) {
    try {
        const weekNumber = parseInt(week);
        
        // 查詢課程基本資訊
        const course = await mongoose.connection.db.collection('course')
            .findOne({ course_id: parseInt(courseId) });
            
        if (!course) throw new Error('Course not found');

        // 查詢公告
        const announcements = await mongoose.connection.db.collection('announcement')
            .find({ course_id: parseInt(courseId) })
            .toArray();

        // 查詢教材
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .toArray();

        // 查詢作業
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ in_course_id: parseInt(courseId) })
            .toArray();

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

        return {
            course_id: course.course_id,
            name: course.name,
            description: course.description,
            totalWeeks: 16, // 假設一個學期有16週
            currentWeek: weekNumber,
            weeks
        };
    } catch (error) {
        console.error(`[getWeeklyCourseData] Error fetching weekly data for course ID ${courseId}, week ${week}:`, error);
        throw new Error(`Failed to retrieve weekly course data: ${error.message}`);
    }
}

// 獲取用戶教授的課程
async function getTeachingCourses(userId) {
    try {
        if (!userId) {
            throw new Error('缺少用戶ID參數');
        }
        
        // 從 teach_in 集合中查詢用戶授課的所有課程ID
        const teachInRecords = await mongoose.connection.db.collection('teach_in')
            .find({ user_id: parseInt(userId) })
            .toArray();
        
        // 如果沒有找到任何教授記錄
        if (!teachInRecords || teachInRecords.length === 0) {
            return []; // 返回空數組
        }
        
        // 提取所有課程ID
        const courseIds = teachInRecords.map(record => record.course_id);
        
        // 查詢這些課程的詳細資訊
        const courses = await mongoose.connection.db.collection('course')
            .find({ course_id: { $in: courseIds } })
            .toArray();
        
        // 將課程資訊轉換為前端需要的格式
        return courses.map(course => ({
            title: course.name,
            courseId: course.course_id,
            description: course.description,
            color: "#4A90E2", // 預設顏色
            isTeacher: true
        }));
    } catch (error) {
        console.error(`[getTeachingCourses] Error fetching teaching courses for user ID ${userId}:`, error);
        throw new Error(`Failed to retrieve teaching courses: ${error.message}`);
    }
}

export {
    getCourseById,
    getAnnouncementsByCourseId,
    getMaterialsByCourseId,
    getAssignmentsByCourseId,
    getAllCourses,
    getCourseSyllabus,
    getCourseLink,
    getCourseDetails,
    getWeeklyCourseData,
    getTeachingCourses
};