import mongoose from 'mongoose';

// 計算週次的輔助函數
function calculateWeek(courseStartDate, itemDate, courseWeekNum = 16) {
    const courseDate = new Date(courseStartDate);
    const itemDate2 = new Date(itemDate);

    if (isNaN(courseDate) || isNaN(itemDate2)) return 1;

    // 將課程起始日對齊到當週的週日
    const dayOfWeek = courseDate.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
    courseDate.setDate(courseDate.getDate() - dayOfWeek); // 往前推到週日

    const diffTime = itemDate2 - courseDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffDays / 7) + 1;

    return Math.min(Math.max(weekNumber, 1), courseWeekNum);
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
        const now = new Date();
        return await mongoose.connection.db.collection('announcement')
            .find({
                course_id: parseInt(courseId),
                announce_date: { $lte: now } // Only return announcements where announce_date is less than or equal to now
            })
            .sort({ create_date: -1 }) // 依日期降序排列
            .toArray();
    } catch (error) {
        console.error(`[getAnnouncementsByCourseId] Error fetching announcements for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course announcements: ${error.message}`);
    }
}

// Helper to get next a_id from counter collection
async function getNextSequenceValue(collectionName) {
    // 直接找出第一筆 document 的 _id，作為固定的 counter 主體
    const existingCounter = await mongoose.connection.db.collection("counter").findOne({}, { projection: { _id: 1 } });

    if (!existingCounter) {
        throw new Error("Counter document does not exist. Please initialize the counter collection manually.");
    }

    const result = await mongoose.connection.db.collection("counter").findOneAndUpdate(
        { _id: existingCounter._id },
        { $inc: { [collectionName]: 1 } },
        {
            returnDocument: 'after',
            upsert: false  // 強制只更新，不建立新 document
        }
    );
    console.log("Counter update result:", result);
    console.log("Counter result:", result.value?.[collectionName]);
    return result[collectionName] ?? 1;
}

// 建立課程公告
async function createAnnouncement(courseId, context, user_id, announce_date) {
    try {
        const a_id = await getNextSequenceValue('announcement');
        const now = new Date();
        const announcement = {
            a_id,
            course_id: parseInt(courseId),
            context,
            user_id: parseInt(user_id),
            create_date: now,
            announce_date: new Date(announce_date) // Use the provided announce_date
        };

        await mongoose.connection.db.collection('announcement').insertOne(announcement);

        return announcement;
    } catch (error) {
        console.error(`[createAnnouncement] Error creating announcement for course ID ${courseId}:`, error);
        throw new Error(`Failed to create announcement: ${error.message}`);
    }
}

// 編輯課程公告
async function editAnnouncement(announcementId, context, announce_date) {
    try {
        const result = await mongoose.connection.db.collection('announcement').updateOne(
            { a_id: parseInt(announcementId) },
            { $set: { context, announce_date: new Date(announce_date) } }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Announcement not found or no changes made');
        }

        // Return the updated announcement
        const updated = await mongoose.connection.db.collection('announcement').findOne({ a_id: parseInt(announcementId) });
        return updated;
    } catch (error) {
        console.error(`[editAnnouncement] Error editing announcement ID ${announcementId}:`, error);
        throw new Error(`Failed to edit announcement: ${error.message}`);
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
        
        // 使用 start_date 而不是 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週
        
        const materials = await mongoose.connection.db.collection('materials')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ display_date: -1, create_date: -1 }) // 先依 display_date 再依 create_date 降序排列
            .toArray();
        
        return materials.map(material => {
            // 如果材料已有週次信息，則使用該信息；否則，計算週次
            // 使用 display_date 或備用 create_date
            const materialDate = material.display_date || material.create_date;
            const week = calculateWeek(courseStartDate, materialDate, courseWeekNum);

            return {
                id: material.m_id,
                name: material.m_name,
                url: material.url || material.path_to_file, // 修正：優先用 url，否則用 path_to_file
                description: material.description,
                displayDate: material.display_date || material.create_date, // 優先使用 display_date
                week: week,
                path_to_file: material.path_to_file,
                filename: material.filename
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
        // 先獲取課程信息，以獲取開始日期
        const course = await getCourseById(courseId);
        if (!course) {
            throw new Error('找不到課程');
        }
        
        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週
        
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ end_date: 1 }) // 依截止日期升序排列
            .toArray();
        
        return assignments.map(assignment => {
            // 計算週次 - 使用 start_date 而非 create_date
            const assignmentDate = assignment.start_date || assignment.create_date;
            const week = calculateWeek(courseStartDate, assignmentDate, courseWeekNum);
          
            return {
                id: assignment.ass_id,
                name: assignment.ass_name,
                description: assignment.description,
                dueDate: assignment.end_date,
                startDate: assignment.start_date,
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
        
        // console.log("[getCourseDetails] 從數據庫獲取的原始課程數據:", course); // 新增日誌
        //console.log("[getCourseDetails] 從數據庫獲取的 course.week_num:", course.week_num); // 新增日誌
        
        return {
            id: course.course_id,
            title: course.name,
            description: course.description,
            syllabus: course.syllabus || "",
            createDate: course.create_date,
            start_date: course.start_date,
            inviteLink: course.invite_link || "",
            week_num: course.week_num,
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

async function canUserEditAnnouncements(courseId, userId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const parsedUserId = parseInt(userId);

        // Check if the user is in teach_in or study_in collections
        const isTeacher = await mongoose.connection.db.collection('teach_in').findOne({ user_id: parsedUserId, course_id: parsedCourseId });
        const isAssistant = await mongoose.connection.db.collection('assist_in').findOne({ user_id: parsedUserId, course_id: parsedCourseId });

        return !!(isTeacher || isAssistant); // 只有老師或助教才能發公告
    } catch (error) {
        console.error("Failed to check user enrollment:", error);
        throw new Error("Failed to check user enrollment");
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
        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數
        
        // 只處理現有教材的更新
        for (const material of materials) {
            // 檢查是否是已存在的教材
            if (material.id) {
                // 如果沒有提供週次，嘗試計算
                let week = material.week;
                if (!week) {
                    // 獲取教材的顯示日期或創建日期
                    const existingMaterial = await materialsCollection.findOne({
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    });
                    
                    if (existingMaterial) {
                        // 使用 display_date 或備用 create_date
                        const materialDate = existingMaterial.display_date || existingMaterial.create_date;
                        week = calculateWeek(courseStartDate, materialDate, courseWeekNum);
                    } else {
                        week = 1; // 默認值
                    }
                }
                
                // 創建更新對象
                const updateObj = {
                    m_name: material.name,
                    url: material.url,
                    description: material.description || ""
                };
                
                // 如果提供了顯示日期，添加到更新對象中，並強制轉型與防呆
                if (typeof material.displayDate !== 'undefined' && material.displayDate !== null && material.displayDate !== '') {
                    const dateObj = new Date(material.displayDate);
                    if (!isNaN(dateObj.getTime())) {
                        updateObj.display_date = dateObj;
                    } else {
                        console.warn('[updateMaterialsService] displayDate 轉換失敗:', material.displayDate);
                    }
                }
                // debug log
                 console.log('[updateMaterialsService] updateObj:', updateObj);
                
                // 更新現有教材
                const result = await materialsCollection.updateOne(
                    { 
                        m_id: parseInt(material.id),
                        in_course_id: parseInt(courseId)
                    },
                    {
                        $set: updateObj
                    }
                );
                console.log('[updateMaterialsService] update result:', result);
                
                if (result.matchedCount > 0) {
                    results.push({
                        id: material.id,
                        name: material.name,
                        url: material.url,
                        description: material.description || "",
                        displayDate: material.displayDate || "",
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

        // 強化查詢條件，允許字串與數字
        const query = {
            m_id: { $in: [parseInt(materialId), materialId] },
            in_course_id: { $in: [parseInt(courseId), courseId] }
        };
        const material = await materialsCollection.findOne(query);
        
        if (!material) {
            console.error(`[deleteMaterialService] 找不到教材，查詢條件:`, query);
            return { deletedCount: 0 };
        }
        
        // 如果存在檔案路徑，執行檔案刪除操作
        if (material.path_to_file) {
            // 導入並使用文件刪除服務
            const { DeleteFile } = await import('../file_services/file_storage_service.js');
            await DeleteFile(material.path_to_file);
        }
        
        // 刪除數據庫中的記錄
        const result = await materialsCollection.deleteOne(query);
        
        
        return result;
    } catch (error) {
        console.error(`[deleteMaterialService] Error deleting material ID ${materialId} from course ID ${courseId}:`, error);
        throw new Error(`Failed to delete material: ${error.message}`);
    }
}

export {
    getCourseById,
    getAnnouncementsByCourseId,
    createAnnouncement,
    editAnnouncement,
    getMaterialsByCourseId,
    getAssignmentsByCourseId,
    getAllCourses,
    getCourseSyllabus,
    getCourseLink,
    getCourseDetails,
    getTeachingCourses,
    canUserEditAnnouncements,
    // 教材操作服務
    updateMaterialsService,
    deleteMaterialService
};