import mongoose from 'mongoose';

import GetNextCounterId from '#src/utils/get_next_counter_id.js';

async function FindProjectTakenExamByUserIdAssId(userId, examId) {
    try {
        userId = parseInt(userId);
        examId = parseInt(examId);

        const result = await mongoose.connection.db.collection('taken_exams').find(
            {taken_by_user_id: userId, exam_id: examId}
        ).project(
            { attachments: 0, description: 0, _id: 0 }
        ).toArray();

        return result;
    } catch (err) {
        throw err;
    }
}


async function FindAllTakenExamsByExamId(examId) {
    try {
        
        const result = await mongoose.connection.db.collection('taken_exams').find(
            {exam_id: examId}
        ).toArray();

        return result;
    } catch (err) {
        throw err;
    }

}

async function CreateTakenExam(score, graderId, beGradedUserId, examId, userCourseTag = "", description = "", attachments = []) {
    try {

        // Get next counter id for taken exams
        const nextId = await GetNextCounterId("taken_exams");
        // console.log("Next Taken Exam ID:", nextId);
        
        // Create the document object
        const takenExamDocument = {
            t_exam_id: nextId,
            exam_id: examId,
            taken_by_user_id: beGradedUserId,
            taken_user_course_tag: userCourseTag,
            score: score,
            graded_by_user_id: graderId,
            // attachments: attachments,
            // description: description
        };

        // Insert the document into the collection
        const result = await mongoose.connection.db.collection('taken_exams').insertOne(takenExamDocument);
        
        return { ...takenExamDocument, _id: result.insertedId };
    } catch (err) {
        console.error("Error creating taken exam:", err);
        throw err;
    }
}

async function UpdateTakenExam(t_exam_id, score, graderId, beGradedUserId, examId, userCourseTag = "", description = "", attachments = []) {
    try {

        // Prepare the update object
        const updateObject = {
            $set: {
                score: score,
                graded_by_user_id: graderId,
                // taken_user_course_tag: userCourseTag,
                // description: description,
                // attachments: attachments
            }
        };

        // console.log("Update Object:", updateObject);
        // console.log("Exam ID:", examId);
        // console.log("Taken Exam ID:", t_exam_id);
        // console.log("Be Graded User ID:", beGradedUserId);

        // Update the document in the collection
        const result = await mongoose.connection.db.collection('taken_exams').updateOne(
            { exam_id: examId, t_exam_id: t_exam_id },
            updateObject
        );

        return result.modifiedCount > 0;
    } catch (err) {
        console.error("Error updating taken exam:", err);
        throw err;
    }

}

export {
    FindProjectTakenExamByUserIdAssId,
    FindAllTakenExamsByExamId,
    CreateTakenExam,
    UpdateTakenExam
}
