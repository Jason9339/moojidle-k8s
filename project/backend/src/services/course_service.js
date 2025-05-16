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
        const isStudent = await mongoose.connection.db.collection('study_in').findOne({ user_id: parsedUserId, course_id: parsedCourseId });

        return !!(isTeacher || isStudent); // Return true if either isTeacher or isStudent is not null
    } catch (error) {
        console.error("Failed to check user enrollment:", error);
        throw new Error("Failed to check user enrollment");
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
    canUserEditAnnouncements
};