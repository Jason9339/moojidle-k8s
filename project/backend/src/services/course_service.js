import mongoose from 'mongoose';
import GetNextCounterId from "#src/utils/get_next_counter_id.js"

async function GenerateInviteCode() {
    const db = mongoose.connection.db;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code;
    do {
        code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (await db.collection('courses').findOne({ invite_link: code }));
    return code;
};

async function FindAllCourses() {
    try {
        return await mongoose.connection.db.collection('course').find().toArray();
    } catch (error) {
        console.error("[getAllCourses] Error fetching all courses:", error);
        throw new Error(`Failed to retrieve all courses: ${error.message}`);
    }
}

async function FindStudyInCourseIdsByUserId(userId) {
    try {
        return await mongoose.connection.db.collection('study_in')
            .find(
                { user_id: userId },
                {
                    projection: {
                        course_id: 1,
                        _id: 0
                    }
                }

            )
            .toArray();
    }
    catch (e) {
        console.error(e);
        throw new Error(`Failed to retrieve all courses: ${error.message}`);
    }
}

// Service to add a new course
async function InsertCourse(courseData) {
    try {
        // TDD 改進點 1: 添加輸入驗證
        // 應該驗證必填字段，拒絕無效數據
        /*
        if (!courseData || !courseData.name) {
            throw new Error('Course name is required');
        }
        
        if (typeof courseData.name !== 'string' || courseData.name.trim() === '') {
            throw new Error('Course name cannot be empty');
        }
        
        if (courseData.name.length > 255) {
            throw new Error('Course name is too long');
        }
        
        // 驗證其他字段...
        */

        // 1. Generate the next course_id
        const nextCourseId = await GetNextCounterId("course");
        const inviteLink = await GenerateInviteCode(); //generateInviteLink(nextCourseId);

        // 2. Prepare the document to insert
        const newCourseDocument = {
            course_id: nextCourseId,
            name: courseData.name, // TDD: 這裡可能是 undefined，應該在上面驗證
            description: courseData.description || "",
            create_date: new Date(), // Set current date/time
            start_date: new Date(courseData.start_date) || new Date(), // Default to current date if not provided
            syllabus: courseData.syllabus || "",
            // Include optional fields if they exist in courseData
            invite_link: inviteLink,
            // Add other optional fields from schema if needed
            week_num: courseData.week || 16, // Default to 16 if not provided
            color: courseData.color || "#4A90E2", // Default to blue if not provided
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

// Service to change the course name and return the updated course
async function UpdateCourseName(courseId, newName) {
    try {
        // TDD 改進點 2: 添加輸入驗證
        /*
        if (!newName) {
            throw new Error('Course name is required');
        }
        
        if (typeof newName !== 'string' || newName.trim() === '') {
            throw new Error('Course name cannot be empty');
        }
        
        if (newName.length > 255) {
            throw new Error('Course name is too long');
        }
        */

        const result = await mongoose.connection.db.collection('course').updateOne(
            { course_id: courseId }, // Filter by course_id
            { $set: { name: newName } } // Update the name field
        );


        if (result.matchedCount === 0) {
            // TDD 改進點 3: 返回 null 而不是拋出錯誤，讓 controller 決定如何處理
            // throw new Error(`Course with ID ${courseId} not found.`);
            return null; // 改為返回 null
        }

        // Fetch the updated course
        const updatedCourse = await mongoose.connection.db.collection('course').findOne({ course_id: courseId });
        return updatedCourse; // Return the updated course
    } catch (err) {
        console.error("Error updating course name:", err);
        throw new Error(`Failed to update course name: ${err.message}`);
    }
}

// Service to remove a course by its course_id
async function DeleteCourse(id) {
    try {
        // TDD 改進點 4: 更嚴格的輸入驗證
        /*
        if (!id) {
            throw new Error('Course ID is required');
        }
        */

        // 1. Convert the incoming id (expected to be course_id) to an integer
        const courseIdInt = parseInt(id, 10);
        if (isNaN(courseIdInt)) {
            throw new Error("Invalid course ID format"); // TDD: 這個錯誤處理是好的
        }

        // 2. Delete the document matching the course_id
        const result = await mongoose.connection.db.collection('course').deleteOne({ course_id: courseIdInt });

        if (result.deletedCount > 0) {
            await DeleteCourseRelationships(courseIdInt);
        }

        // 3. Return the number of documents deleted (0 or 1)
        return result.deletedCount;

    } catch (err) {
        console.error(`Error removing course with ID ${id} in service:`, err);
        // Re-throw the error for the controller
        throw new Error(`Failed to remove course: ${err.message}`);
    }
}

// Service function to delete related data from other collections based on course_id
async function DeleteCourseRelationships(courseIdInt) {
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

        const deletionPromises = relatedCollections.map((collectionName) => {
            let promise = mongoose.connection.db.collection(collectionName).deleteMany({ course_id: courseIdInt })
            if (collectionName == "discussion_board") {
                // delete post in that discussion board
                // TODO
            } else if (collectionName == "assignments") {
                // delete submitted assigns
                // TODO
            }

            return promise;
        });

        // Execute all deletion operations concurrently
        const results = await Promise.allSettled(deletionPromises);

        results.forEach((result, index) => {
            const collectionName = relatedCollections[index];
            if (result.status === 'fulfilled') {
                // console.log(`[DeleteCourseRelationships] Successfully deleted ${result.value.deletedCount} documents from ${collectionName} for course_id: ${courseIdInt}`);
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

// 獲取課程詳細資訊
async function FindCourseById(courseId) {
    try {
        // TDD 改進點 5: 添加輸入驗證
        /*
        if (!courseId) {
            throw new Error('Course ID is required');
        }
        
        const courseIdInt = parseInt(courseId, 10);
        if (isNaN(courseIdInt)) {
            throw new Error('Invalid course ID format');
        }
        */

        const course = await mongoose.connection.db.collection('course')
            .findOne({ course_id: parseInt(courseId) });

        if (!course) {
            // TDD 改進點 6: 返回 null 而不是拋出錯誤
            // throw new Error('找不到課程');
            return null; // 改為返回 null，讓 controller 決定如何處理
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

            // NOTICE! sent duplicate attribute because changing attribute name
            // TODO  change it to make consistant
            course_id: course.course_id,
            name: course.name,
            invite_link: course.invite_link || "",
            color: course.color
        };
    } catch (error) {
        console.error(`[getCourseDetails] Error fetching details for course ID ${courseId}:`, error);
        // TDD 改進點 7: 不要包裝錯誤消息，直接拋出原始錯誤
        // throw new Error(`Failed to retrieve course details: ${error.message}`);
        throw error; // 改為直接拋出原始錯誤
    }
}

async function FindCourseIdByInviteCode(code) {
    // console.log(code);
    return await mongoose.connection.db.collection('course').findOne({ invite_link: code }, { projection: { course_id: 1 } });
}

export {
    FindCourseById,
    FindAllCourses,
    FindCourseInCourseId,
    FindCourseIdByInviteCode,
    InsertCourse,
    UpdateCourseName,
    DeleteCourse
};
