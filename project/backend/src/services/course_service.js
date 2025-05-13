import mongoose from 'mongoose';

// 計算週次的輔助函數
function calculateWeek(courseCreateDate, itemCreateDate, courseWeekNum = 16) {
    // 確保日期格式正確
    const courseDate = new Date(courseCreateDate);
    const itemDate = new Date(itemCreateDate);
    
    // 計算日期差異（毫秒）
    const diffTime = Math.abs(itemDate - courseDate);
    // 轉換為天數
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // 轉換為週數（向上取整，確保第一週為第1週）
    const weekNumber = Math.floor(diffDays / 7) + 1;
    
    // 防止週數超過課程設定的週數
    return Math.min(weekNumber, courseWeekNum);
}

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
        // 先獲取課程信息，以獲取創建日期
        const course = await getCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
        
        const courseCreateDate = course.create_date;
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週
        
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ create_date: -1 }) // 依日期降序排列
            .toArray();
        
        return materials.map(material => {
            // 如果材料已有週次信息，則使用該信息；否則，計算週次
            const week = material.week || calculateWeek(courseCreateDate, material.create_date, courseWeekNum);
            
            return {
                id: material.m_id,
                name: material.m_name,
                url: material.url,
                description: material.description,
                uploadDate: material.create_date,
                week: week
            };
        });
    } catch (error) {
        console.error(`[getMaterialsByCourseId] Error fetching materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course materials: ${error.message}`);
    }
}

// 查詢課程作業
async function getAssignmentsByCourseId(courseId) {
    try {
        // 先獲取課程信息，以獲取創建日期
        const course = await getCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
        
        const courseCreateDate = course.create_date;
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週
        
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ end_date: 1 }) // 依截止日期升序排列
            .toArray();
        
        return assignments.map(assignment => {
            // 計算週次
            const week = assignment.week || calculateWeek(courseCreateDate, assignment.create_date, courseWeekNum);
            
            return {
                id: assignment.ass_id,
                name: assignment.ass_name,
                description: assignment.description,
                dueDate: assignment.end_date,
                attachments: assignment.attachments || [],
                week: week
            };
        });
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
            start_date: course.start_date,
            inviteLink: course.invite_link || ""
        };
    } catch (error) {
        console.error(`[getCourseDetails] Error fetching details for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course details: ${error.message}`);
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

// 更新課程教材
async function updateMaterialsService(courseId, materials) {
    try {
        const materialsCollection = mongoose.connection.db.collection('materials');
        const results = [];
        
        // 獲取課程創建日期和週數，用於計算週次
        const course = await getCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
        const courseCreateDate = course.create_date;
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數
        
        // 只處理現有教材的更新
        for (const material of materials) {
            // 檢查是否是已存在的教材
            if (material.id) {
                // 如果沒有提供週次，嘗試計算
                let week = material.week;
                if (!week) {
                    // 獲取教材的創建日期
                    const existingMaterial = await materialsCollection.findOne({
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    });
                    
                    if (existingMaterial) {
                        week = calculateWeek(courseCreateDate, existingMaterial.create_date, courseWeekNum);
                    } else {
                        week = 1; // 默認值
                    }
                }
                
                // 更新現有教材
                const result = await materialsCollection.updateOne(
                    { 
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    },
                    {
                        $set: {
                            m_name: material.name,
                            url: material.url,
                            description: material.description || "",
                            week: week
                        }
                    }
                );
                
                if (result.matchedCount > 0) {
                    results.push({
                        id: material.id,
                        name: material.name,
                        url: material.url,
                        description: material.description || "",
                        week: week,
                        status: 'updated'
                    });
                }
            }
        }
        
        return results;
    } catch (error) {
        console.error(`[updateMaterialsService] Error updating materials for course ID ${courseId}:`, error);
        throw new Error(`Failed to update course materials: ${error.message}`);
    }
}

// 刪除教材
async function deleteMaterialService(courseId, materialId) {
    try {
        const materialsCollection = mongoose.connection.db.collection('materials');
        
        const result = await materialsCollection.deleteOne({
            m_id: parseInt(materialId),
            in_course_id: parseInt(courseId)
        });
        
        return result;
    } catch (error) {
        console.error(`[deleteMaterialService] Error deleting material ID ${materialId} from course ID ${courseId}:`, error);
        throw new Error(`Failed to delete material: ${error.message}`);
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
    getTeachingCourses,
    // 教材操作服務
    updateMaterialsService,
    deleteMaterialService
};