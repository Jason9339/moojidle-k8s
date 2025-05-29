import mongoose from 'mongoose';

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

export {
    FindProjectTakenExamByUserIdAssId,
}