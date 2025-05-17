import mongoose from 'mongoose';

// 計算週次的輔助函數
function CalculateWeek(courseStartDate, itemDate, courseWeekNum = 16) {
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
async function GetCourseById(courseId) {
    try {
        return await mongoose.connection.db.collection('course').findOne({ course_id: parseInt(courseId) });
    } catch (error) {
        console.error(`[getCourseById] Error fetching course with ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course: ${error.message}`);
    }
}

// Helper to get next a_id from counter collection
async function GetNextSequenceValue(collectionName) {
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

// 獲取所有課程
async function GetAllCourses() {
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

async function GetInviteCode(courseId) {
    try {
        const parsedId = parseInt(courseId, 10);
        if (isNaN(parsedId)) {
            throw new Error("Invalid course ID format. Course ID must be an integer.");
        }
        
        const coursesCollection = mongoose.connection.db.collection('course');
        const course = await coursesCollection.findOne(
            { course_id: parsedId },
            { projection: { _id: 0, invite_link: 1 }} //WARN: link
        );

        // console.log(course);
        
        if (!course) {
            throw new Error(`Course with ID ${parsedId} not found`);
        }
        
        return course.invite_link;
    } catch (error) {
        throw new Error(`Failed to retrieve invite code: ${error.message}`);
    }
}


// 獲取課程詳細資訊
async function GetCourseDetails(courseId) {
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
async function GetTeachingCourses(userId) {
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

// Service to add a new course
async function AddCourse(courseData) {
    try {
        // 1. Generate the next course_id
        const nextCourseId = await GetNextSequenceValue("course");
        console.log("Next course_id:", nextCourseId);
        const inviteLink = await GenerateInviteCode(); //generateInviteLink(nextCourseId);

        // 2. Prepare the document to insert
        const newCourseDocument = {
            course_id: nextCourseId,
            name: courseData.name,
            description: courseData.description || "",
            create_date: new Date(), // Set current date/time
            start_date: new Date(courseData.start_date) || new Date(), // Default to current date if not provided
            syllabus: courseData.syllabus || "",
            // Include optional fields if they exist in courseData
             invite_link: inviteLink,
            // Add other optional fields from schema if needed
            week_num: courseData.week || 16, // Default to 16 if not provided
            color : courseData.color || "#4A90E2", // Default to blue if not provided

        };

        // 3. Insert the document into the 'course' collection
        const result = await mongoose.connection.db.collection('course').insertOne(newCourseDocument);

        // 4. Check if insertion was successful and return the inserted document
        // The inserted document is available in result.ops[0] for older drivers or directly via findOne after insert
        // A more reliable way post-insert is often to fetch it by the generated ID or return the constructed object
        // For simplicity, we return the document we constructed, assuming insert was successful if no error was thrown.
        // MongoDB's insertOne result includes insertedId (_id), not the full doc directly in newer drivers.
        // Let's return the document we intended to insert, augmented with the MongoDB _id.
        const insertedDoc = { ...newCourseDocument, _id: result.insertedId };
        return insertedDoc;

    } catch (err) {
        console.error("Error adding course in service:", err);
        // Re-throw the error so the controller can catch it and send a 500 response
        throw new Error(`Failed to add course: ${err.message}`);
    }
}


async function GenerateInviteCode() {
    const db = mongoose.connection.db;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code;
    do {
        code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (await db.collection('courses').findOne({ inviteCode: code }));
    return code;
};

async function AddTeachIn(userId, courseId) {
    try {
        const newTeachInDocument = {
            user_id: userId,
            course_id: courseId,
        };
        const result = await mongoose.connection.db.collection('teach_in').insertOne(newTeachInDocument);
        return result.insertedId;
    } catch (err) {
        console.error("Error adding teach_in entry:", err);
        throw new Error(`Failed to add teach_in entry: ${err.message}`);
    }
}


// Service to remove a course by its course_id
async function RemoveCourse(id) {
    try {
        // 1. Convert the incoming id (expected to be course_id) to an integer
        const courseIdInt = parseInt(id, 10);
        if (isNaN(courseIdInt)) {
            throw new Error("Invalid course ID format. ID must be an integer.");
        }

        // 2. Delete the document matching the course_id
        const result = await mongoose.connection.db.collection('course').deleteOne({ course_id: courseIdInt });

        // 3. Return the number of documents deleted (0 or 1)
        return result.deletedCount;

    } catch (err) {
        console.error(`Error removing course with ID ${id} in service:`, err);
        // Re-throw the error for the controller
        throw new Error(`Failed to remove course: ${err.message}`);
    }
}

// Service function to delete related data from other collections based on course_id
async function RemoveCourseRelationships(courseIdInt) {
    console.log(`[DeleteCourseRelationships] Deleting relationships for course_id: ${courseIdInt}`);
    try {
        // List of collections that have a direct course_id relationship
        const relatedCollections = [
            'teach_in',
            'assist_in',
            'study_in',
            'announcement',
            'discussion_board', // Note: Posts within boards might need separate handling if not cascading
            'exams',
            'materials',
            'assignments', // Note: Submitted assignments might need separate handling
            'course_tag'
        ];

        const deletionPromises = relatedCollections.map(collectionName =>
            mongoose.connection.db.collection(collectionName).deleteMany({ course_id: courseIdInt })
        );

        // Execute all deletion operations concurrently
        const results = await Promise.allSettled(deletionPromises);

        results.forEach((result, index) => {
            const collectionName = relatedCollections[index];
            if (result.status === 'fulfilled') {
                console.log(`[DeleteCourseRelationships] Successfully deleted ${result.value.deletedCount} documents from ${collectionName} for course_id: ${courseIdInt}`);
            } else {
                console.error(`[DeleteCourseRelationships] Error deleting documents from ${collectionName} for course_id: ${courseIdInt}:`, result.reason);
                // Decide if you want to throw an error here or just log it
            }
        });

        // Optionally, you could check if any promise failed and throw an error
        // if (!results.every(r => r.status === 'fulfilled')) {
        //     throw new Error("Failed to delete some course relationships.");
        // }

    } catch (err) {
        console.error(`[DeleteCourseRelationships] General error deleting relationships for course_id ${courseIdInt}:`, err);
        // Re-throw the error to be caught by the controller
        throw new Error(`Failed to delete course relationships: ${err.message}`);
    }
}

// Service to change the course name and return the updated course
async function ChangeCourseName(courseId, newName) {
    try {
        const result = await mongoose.connection.db.collection('course').updateOne(
            { course_id: courseId }, // Filter by course_id
            { $set: { name: newName } } // Update the name field
        );


        if (result.matchedCount === 0) {
            throw new Error(`Course with ID ${courseId} not found.`);
        }

        // Fetch the updated course
        const updatedCourse = await mongoose.connection.db.collection('course').findOne({ course_id: courseId });
        console.log("Updated course:", updatedCourse);
        return updatedCourse; // Return the updated course
    } catch (err) {
        console.error("Error updating course name:", err);
        throw new Error(`Failed to update course name: ${err.message}`); 
    }
}

async function GetCoursesByTeacherId(userId) {
    try {
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
            throw new Error("Invalid user ID format. User ID must be an integer.");
        }

        const teachInCollection = mongoose.connection.db.collection('teach_in');
        const teachingRecords = await teachInCollection.find(
            { user_id: userIdInt },
            { projection: { _id: 0, course_id: 1 } }
        ).toArray();

        if (teachingRecords.length === 0) {
            return [];
        }

        const courseIds = teachingRecords.map(record => record.course_id);

        const coursesCollection = mongoose.connection.db.collection('course');
        const courses = await coursesCollection.find(
            { course_id: { $in: courseIds } },
            { projection: { _id: 0, course_id: 1, name: 1 } }
        ).toArray();

        const formattedCourses = courses.map(course => ({
            title: course.name,
            courseId: course.course_id,
        }));

        return formattedCourses;
    } catch (error) {
        console.error("Error in GetCoursesByTeacherId:", error);
        throw new Error(`Failed to retrieve courses taught by user: ${error.message}`);
    }
}

// Service function to retrieve all courses with user role information
async function ViewCourses(userId) {
    // console.log(`[ViewCourses] Attempting to fetch courses for user ID: ${userId}...`);
    try {
        // Convert userId to integer if provided
        const userIdInt = userId ? parseInt(userId, 10) : null;
        
        // Get all courses
        const coursesCollection = mongoose.connection.db.collection('course');
        const courses = await coursesCollection.find({}, {
            projection: {
                _id: 0,
                course_id: 1,
                name: 1,
                color: 1
            }
        }).toArray();
        
        // If no userId provided, just return basic course information
        if (!userId || isNaN(userIdInt)) {
            return courses.map(course => ({
                title: course.name,
                courseId: course.course_id,
                color: course.color
            }));
        }
        
        // Get courses where user is a teacher
        const teachInCollection = mongoose.connection.db.collection('teach_in');
        const teachingRecords = await teachInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const teachingCourseIds = new Set(teachingRecords.map(record => record.course_id));
        
        // Get courses where user is a student
        const studyInCollection = mongoose.connection.db.collection('study_in');
        const studyingRecords = await studyInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const studyingCourseIds = new Set(studyingRecords.map(record => record.course_id));
        
        // Get courses where user is an assistant
        const assistInCollection = mongoose.connection.db.collection('assist_in');
        const assistingRecords = await assistInCollection.find(
            { user_id: userIdInt }
        ).toArray();
        const assistingCourseIds = new Set(assistingRecords.map(record => record.course_id));
        
        // Format courses with role information and filter out courses with no relationship
        const formattedCourses = courses
            .map(course => ({
                title: course.name,
                courseId: course.course_id,
                color: course.color,
                isTeacher: teachingCourseIds.has(course.course_id) || false,
                isStudent: studyingCourseIds.has(course.course_id) || false,
                isAssistant: assistingCourseIds.has(course.course_id) || false
            }))
            .filter(course => course.isTeacher || course.isStudent || course.isAssistant);
        
        return formattedCourses;

    } catch (error) {
        console.error("[ViewCourses] Error fetching courses:", error);
        throw new Error(`Failed to retrieve courses: ${error.message}`);
    }
}


export {
    GetCourseById,
    GetNextSequenceValue,
    GetAllCourses,
    GetInviteCode,
    GetCourseDetails,
    GetTeachingCourses,
    CalculateWeek,
    AddCourse, 
    AddTeachIn,
    RemoveCourse,
    RemoveCourseRelationships,
    ChangeCourseName,
    GetCoursesByTeacherId,
    ViewCourses
};