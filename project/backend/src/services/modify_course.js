import mongoose from "mongoose"

const inviteLinkBase = "https://localhost:3000/course/join/";

// Service to add a new course
async function AddCourse(courseData) {
    try {
        // 1. Generate the next course_id
        const nextCourseId = await getNextSequenceValue("course");
        console.log("Next course_id:", nextCourseId);
        const inviteLink = await generateInviteLink(nextCourseId);

        // 2. Prepare the document to insert
        const newCourseDocument = {
            course_id: nextCourseId,
            name: courseData.name,
            description: courseData.description || "",
            create_date: new Date().toISOString(), // Set current date/time
            syllabus: courseData.syllabus || "",
            // Include optional fields if they exist in courseData
             invite_link: inviteLink,
            // Add other optional fields from schema if needed
            week: courseData.week || 16, // Default to 16 if not provided
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

async function generateInviteLink(course_id) {
    return inviteLinkBase + course_id;
}

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


export {
    AddCourse, 
    AddTeachIn,
    RemoveCourse,
    RemoveCourseRelationships,
    ChangeCourseName,
}
