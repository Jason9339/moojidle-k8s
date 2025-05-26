import mongoose from 'mongoose';

async function FindProjectSubAssignByUserIdAssId(userId, assId) {
    try {
        userId = parseInt(userId);
        assId = parseInt(assId);

        const result = await mongoose.connection.db.collection('submitted_ass').find(
            {submit_by_user_id: userId, ass_id: assId}
        ).project(
            { attachments: 0, description: 0, _id: 0 }
        ).toArray();

        return result;
    } catch (err) {
        throw err;
    }
}

export {
    FindProjectSubAssignByUserIdAssId,
}